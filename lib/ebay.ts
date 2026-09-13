// Misprice Hunter — live eBay listings via the eBay Browse API.
//
// Auth is the application (client-credentials) grant: POST the identity
// token endpoint with Basic auth base64(EBAY_APP_ID:EBAY_CERT_ID) and
// grant_type=client_credentials. The returned token is cached in memory
// until expiry, and concurrent callers share one in-flight token request.
//
// Credentials come ONLY from env vars (EBAY_APP_ID / EBAY_CERT_ID) and are
// never logged, returned, or stored anywhere else. When the keys aren't
// configured, ebayConfigured() is false and callers fall back to the honest
// 'ebay-not-configured' state — the site keeps working on manual hunt links.
// Listing data is never fabricated: real Browse API items, or an error.

const TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const BROWSE_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

export interface EbayListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  itemWebUrl: string;
  buyingOptions: string[];
  auctionEnd: string | null; // ISO datetime for AUCTION items, else null
}

function appId(): string | null {
  return process.env.EBAY_APP_ID || null;
}

function certId(): string | null {
  return process.env.EBAY_CERT_ID || null;
}

export function ebayConfigured(): boolean {
  return appId() !== null && certId() !== null;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms
let inflightToken: Promise<string> | null = null;

export async function getAppToken(): Promise<string> {
  const id = appId();
  const cert = certId();
  if (!id || !cert) throw new Error('eBay API keys not configured');
  // Reuse a fresh-enough cached token (60s safety margin).
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  if (inflightToken) return inflightToken;
  inflightToken = (async () => {
    const basic = Buffer.from(`${id}:${cert}`).toString('base64');
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope',
      }).toString(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`ebay token -> ${res.status}`);
    const json: any = await res.json();
    if (!json?.access_token) throw new Error('ebay token: no access_token');
    cachedToken = String(json.access_token);
    const ttl = typeof json.expires_in === 'number' ? json.expires_in : 7200;
    tokenExpiresAt = Date.now() + ttl * 1000;
    return cachedToken as string;
  })();
  try {
    return await inflightToken;
  } finally {
    inflightToken = null;
  }
}

function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function searchEbay(
  query: string,
  opts: { limit?: number } = {},
): Promise<EbayListing[]> {
  const q = query.trim();
  if (!q) return [];
  const limit = Math.min(Math.max(opts.limit ?? 6, 1), 25);
  const token = await getAppToken();
  const url = `${BROWSE_URL}?${new URLSearchParams({ q, limit: String(limit) })}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`ebay search -> ${res.status}`);
  const json: any = await res.json();
  const items: any[] = Array.isArray(json?.itemSummaries) ? json.itemSummaries : [];
  return items
    .map((it) => ({
      id: String(it?.itemId ?? ''),
      title: String(it?.title ?? 'eBay listing'),
      price: num(it?.price?.value),
      currency: String(it?.price?.currency ?? 'USD'),
      imageUrl: typeof it?.image?.imageUrl === 'string' ? it.image.imageUrl : null,
      itemWebUrl: String(it?.itemWebUrl ?? ''),
      buyingOptions: Array.isArray(it?.buyingOptions)
        ? it.buyingOptions.map(String)
        : [],
      auctionEnd: typeof it?.itemEndDate === 'string' ? it.itemEndDate : null,
    }))
    .filter((l) => l.id && l.itemWebUrl);
}
