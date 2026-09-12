// Misprice Hunter — live sports card pricing via CardSight AI
// (https://cardsight.ai). Free tier: 750 calls/month, no credit card — the key
// comes from a free signup and is sent via the X-API-Key header.
//
// Quota discipline: prices come from ONE bulk request covering every tracked
// card and are cached ~24h. A full day of scans costs a single API call
// (~30/mo of the 750 free). Card UUIDs are pinned below (verified against the
// CardSight catalog 2026-09-12), so no search calls are needed at runtime.
//
// Without a key (or on any API failure) the caller falls back to the
// clearly-labeled sports samples — the site never breaks.

const API = 'https://api.cardsight.ai';
const PRICE_TTL_MS = 24 * 60 * 60 * 1000;

export interface SportsSpec {
  term: string;
  misspelling: string;
  title: string;
  setName: string;
  image: string;
  /** Pinned CardSight catalog UUID (v4), verified 2026-09-12. */
  cardId: string;
}

export const SPORTS_SPECS: SportsSpec[] = [
  { term: 'Michael Jordan', misspelling: 'Micheal Jordan', title: 'Michael Jordan #57', setName: 'Basketball Cards 1986 Fleer', image: '/cards/jordan-1986-fleer-57.jpg', cardId: 'e4ebadf4-f673-4c1b-bcba-cae5f3bd51fd' },
  { term: 'LeBron James', misspelling: 'Leborn James', title: 'LeBron James #111', setName: 'Basketball Cards 2003 Topps Chrome', image: '/cards/lebron-2003-topps-chrome-111.webp', cardId: '2735bc7e-51c2-497c-a890-86012b4ff0fc' },
  { term: 'Luka Doncic', misspelling: 'Luka Donic', title: 'Luka Doncic #280', setName: 'Basketball Cards 2018 Panini Prizm', image: '/cards/luka-2018-prizm-280.jpg', cardId: '403a7398-4b20-43c0-8cdb-cd78cfc8c78a' },
  { term: 'Tom Brady', misspelling: 'Tom Braddy', title: 'Tom Brady #144', setName: 'Football Cards 2000 Playoff Contenders', image: '/cards/brady-2000-contenders-144.jpg', cardId: '46c39e6c-53dc-4b73-b2d2-041504694799' },
  { term: 'Kobe Bryant', misspelling: 'Koby Bryant', title: 'Kobe Bryant #138', setName: 'Basketball Cards 1996 Topps Chrome', image: '/cards/kobe-1996-topps-chrome-138.jpg', cardId: '9d9f06e7-9f4e-4eef-8380-fe8f5011c3d7' },
  { term: 'Shohei Ohtani', misspelling: 'Shohei Otani', title: 'Shohei Ohtani #US1', setName: 'Baseball Cards 2018 Topps Update', image: '/cards/ohtani-2018-update-us1.jpg', cardId: '04497684-a220-4f0d-8739-e481dc7105f7' },
];

export interface SportsDeal {
  id: string;
  title: string;
  setName: string;
  term: string;
  misspelling: string;
  rawPrice: number | null; // median of recent completed raw sales, USD
  gradedPrice: number | null; // median of recent PSA 10 (or best) sales, USD
  priceUrl: string;
  imageUrl: string;
  live: true;
  source: 'CardSight AI';
}

function apiKey(): string | null {
  return process.env.CARDSIGHT_API_KEY || process.env.CARDSIGHTAI_API_KEY || null;
}

export function sportsConfigured(): boolean {
  return apiKey() !== null;
}

async function cs(path: string, init?: RequestInit): Promise<any> {
  const k = apiKey();
  if (!k) throw new Error('CardSight API key not configured');
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'X-API-Key': k,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`cardsight ${path} -> ${res.status}`);
  return res.json();
}

function salePrices(records: any[]): number[] {
  return (records || [])
    .map((r) => (r && typeof r.price === 'number' ? r.price : NaN))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function median(ns: number[]): number | null {
  if (!ns.length) return null;
  const s = [...ns].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Median of recent completed auction sales: raw + PSA 10 (or best grade). */
function extract(pricing: any): { raw: number | null; graded: number | null } {
  const raw = median(salePrices(pricing?.raw?.records));
  let graded: number | null = null;
  const companies: any[] = pricing?.graded || [];
  const preferred =
    companies.find((c) => /psa/i.test(String(c?.company_name || ''))) || companies[0];
  const grades: any[] = preferred?.grades || [];
  const best =
    grades.find((g) => String(g?.grade_value ?? '').trim() === '10') ||
    [...grades].sort(
      (a, b) => parseFloat(b?.grade_value) - parseFloat(a?.grade_value),
    )[0];
  if (best) graded = median(salePrices(best.records));
  return { raw, graded };
}

/** Bulk result envelope: { card_id, success, data: { raw, graded, ... } }. */
function pricingOf(result: any): any {
  if (!result) return null;
  return result.data || result.pricing || result;
}

let priceCache: { at: number; deals: SportsDeal[] } | null = null;

/**
 * Live sports market prices via one bulk CardSight call. Throws when no key
 * is configured or pricing can't be parsed — the caller falls back to
 * labeled samples.
 */
export async function fetchSportsPrices(): Promise<SportsDeal[]> {
  if (!sportsConfigured()) throw new Error('CardSight API key not configured');
  if (priceCache && Date.now() - priceCache.at < PRICE_TTL_MS) return priceCache.deals;

  const ids = SPORTS_SPECS.map((s) => s.cardId);
  const bulk = await cs('/v1/pricing/', {
    method: 'POST',
    body: JSON.stringify({
      card_ids: ids,
      period: '3m',
      listing_type: 'auction', // completed sales = real market, not asking prices
      limit: 25,
    }),
  });
  const results: any[] = bulk?.results || [];
  if (!results.length) throw new Error('cardsight: empty bulk pricing response');

  const deals: SportsDeal[] = [];
  for (let i = 0; i < SPORTS_SPECS.length; i++) {
    const spec = SPORTS_SPECS[i];
    const r = results.find((x) => String(x?.card_id) === ids[i]) || results[i];
    const { raw, graded } = extract(pricingOf(r));
    if (raw === null && graded === null) continue;
    deals.push({
      id: `cardsight-${ids[i]}`,
      title: spec.title,
      setName: spec.setName,
      term: spec.term,
      misspelling: spec.misspelling,
      rawPrice: raw,
      gradedPrice: graded,
      priceUrl: `https://www.sportscardspro.com/search-products?q=${encodeURIComponent(spec.term)}&type=prices`,
      imageUrl: spec.image,
      live: true as const,
      source: 'CardSight AI' as const,
    });
  }
  if (!deals.length) throw new Error('cardsight: no sports prices parsed');
  priceCache = { at: Date.now(), deals };
  return deals;
}
