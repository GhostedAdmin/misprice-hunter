import { NextRequest, NextResponse } from 'next/server';
import { MISSPELLINGS, type Category } from '@/lib/misspellings';
import { demoDeals, type Deal } from '@/lib/deals';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory cache (~1h TTL). Note: serverless instances each hold their own
// copy, so this is a best-effort cache for the PoC, not a shared store.
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; deals: Deal[]; demo: boolean; live: boolean } | null = null;
let tokenCache: { token: string; exp: number } | null = null;

interface EbayItem {
  itemId?: string;
  title?: string;
  image?: { imageUrl?: string };
  currentBidPrice?: { value?: string; currency?: string };
  bidCount?: number;
  itemEndDate?: string;
  itemWebUrl?: string;
}

async function getEbayToken(appId: string, certId: string): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.exp) return tokenCache.token;
  const basic = Buffer.from(`${appId}:${certId}`).toString('base64');
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });
  if (!res.ok) throw new Error(`eBay token request failed (${res.status})`);
  const data = await res.json();
  tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return tokenCache.token;
}

async function searchMisspelling(
  token: string,
  query: string,
  term: string,
  category: Category,
): Promise<Deal[]> {
  const url =
    'https://api.ebay.com/buy/browse/v1/item_summary/search' +
    `?q=${encodeURIComponent(query)}` +
    '&filter=buyingOptions:{AUCTION}' +
    '&sort=endTimeSoonest&limit=6';
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const items: EbayItem[] = data.itemSummaries ?? [];
  const now = Date.now();
  return items
    .filter((i) => i.itemEndDate && new Date(i.itemEndDate).getTime() > now)
    .map((i) => ({
      id: i.itemId ?? `${query}-${Math.random()}`,
      title: i.title ?? query,
      imageUrl: i.image?.imageUrl ?? '',
      price: parseFloat(i.currentBidPrice?.value ?? '0'),
      currency: i.currentBidPrice?.currency ?? 'USD',
      bidCount: i.bidCount ?? 0,
      endTime: i.itemEndDate as string,
      listingUrl: i.itemWebUrl ?? 'https://www.ebay.com/',
      category,
      term,
      misspelling: query,
    }));
}

async function liveScan(appId: string, certId: string): Promise<Deal[]> {
  const token = await getEbayToken(appId, certId);
  const queries: { q: string; term: string; category: Category }[] = [];
  for (const e of MISSPELLINGS) {
    for (const m of e.misspellings.slice(0, 2)) queries.push({ q: m, term: e.term, category: e.category });
  }
  const deals: Deal[] = [];
  const seen = new Set<string>();
  const BATCH = 10;
  for (let i = 0; i < queries.length; i += BATCH) {
    const batch = queries.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map((q) => searchMisspelling(token, q.q, q.term, q.category).catch(() => [] as Deal[])),
    );
    for (const r of results.flat()) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        deals.push(r);
      }
    }
  }
  deals.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  return deals.slice(0, 60);
}

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get('refresh') === '1';
  const appId = req.headers.get('x-ebay-app-id') || process.env.EBAY_APP_ID || '';
  const certId = req.headers.get('x-ebay-cert-id') || process.env.EBAY_CERT_ID || '';
  const live = Boolean(appId && certId);

  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS && cache.live === live) {
    return NextResponse.json({
      demo: cache.demo,
      updatedAt: new Date(cache.at).toISOString(),
      cached: true,
      deals: cache.deals,
    });
  }

  if (!live) {
    const deals = demoDeals();
    cache = { at: Date.now(), deals, demo: true, live: false };
    return NextResponse.json({ demo: true, updatedAt: new Date().toISOString(), cached: false, deals });
  }

  try {
    const deals = await liveScan(appId, certId);
    cache = { at: Date.now(), deals, demo: false, live: true };
    return NextResponse.json({ demo: false, updatedAt: new Date().toISOString(), cached: false, deals });
  } catch (err) {
    // Never leave the UI empty — fall back to labeled demo data on error.
    const deals = demoDeals();
    return NextResponse.json({
      demo: true,
      error: err instanceof Error ? err.message : 'Live scan failed',
      updatedAt: new Date().toISOString(),
      cached: false,
      deals,
    });
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
