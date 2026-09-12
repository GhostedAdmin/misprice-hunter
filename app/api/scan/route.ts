import { NextRequest, NextResponse } from 'next/server';
import { demoDeals, type Deal } from '@/lib/deals';
import { fetchMarketPrices, type MarketDeal } from '@/lib/prices';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory cache (~1h TTL). Note: serverless instances each hold their own
// copy, so this is a best-effort cache for the PoC, not a shared store.
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; deals: Deal[]; demo: boolean; live: boolean } | null =
  null;

function toDeal(m: MarketDeal): Deal {
  return {
    id: m.id,
    title: m.title,
    setName: m.setName,
    term: m.term,
    misspelling: m.misspelling,
    category: m.category,
    rawPrice: m.rawPrice,
    gradedPrice: m.gradedPrice,
    priceUrl: m.priceUrl,
  };
}

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get('refresh') === '1';
  const token =
    req.headers.get('x-pc-token') || process.env.PRICECHARTING_TOKEN || '';
  const live = Boolean(token);

  if (
    !force &&
    cache &&
    Date.now() - cache.at < CACHE_TTL_MS &&
    cache.live === live
  ) {
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
    return NextResponse.json({
      demo: true,
      updatedAt: new Date().toISOString(),
      cached: false,
      deals,
    });
  }

  try {
    const market = await fetchMarketPrices(token);
    const deals = market.map(toDeal);
    cache = { at: Date.now(), deals, demo: false, live: true };
    return NextResponse.json({
      demo: false,
      updatedAt: new Date().toISOString(),
      cached: false,
      deals,
    });
  } catch (err) {
    // Never leave the UI empty — fall back to labeled demo data on error.
    const deals = demoDeals();
    return NextResponse.json({
      demo: true,
      error: err instanceof Error ? err.message : 'Price lookup failed',
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
