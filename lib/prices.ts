// Misprice Hunter — market pricing via PriceCharting (Pokémon) and
// SportsCardsPro (sports). Both are the same company's API and share one
// free token passed as ?t=<token>.
//
// Endpoints (verified against public API docs + third-party probes):
//   GET {host}/api/products?q=<text>&t=<token>  → { products: [...] } (≤20 hits,
//       each carrying the full price field set, prices in pennies)
//   GET {host}/api/product?id=<id>&t=<token>    → single product detail
//
// Field semantics: "loose-price" = raw/ungraded market. Graded ladders vary
// by product, so we take the first non-zero of the documented graded fields
// and label it generically "Graded" — never claiming a specific grade.

import { MISSPELLINGS, type Category } from './misspellings';

export interface MarketDeal {
  id: string;
  title: string; // product-name, e.g. "Charizard #4"
  setName: string; // console-name, e.g. "Pokemon Base Set"
  term: string; // tracked term, e.g. "Charizard"
  misspelling: string; // top typo — feeds the hunt buttons
  category: Category;
  rawPrice: number | null; // dollars
  gradedPrice: number | null; // dollars
  priceUrl: string; // where to see the full price history
}

const HOSTS: Record<Category, string> = {
  pokemon: 'https://www.pricecharting.com',
  sports: 'https://www.sportscardspro.com',
};

const GRADED_FIELDS = [
  'manual-only-price',
  'graded-price',
  'condition-18-price',
  'condition-17-price',
  'bgs-10-price',
] as const;

function dollars(v: unknown): number | null {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n / 100;
}

function priceUrlFor(category: Category, term: string): string {
  const q = encodeURIComponent(term);
  return category === 'pokemon'
    ? `https://www.pricecharting.com/search?query=${q}`
    : `https://www.sportscardspro.com/search-products?q=${q}&type=prices`;
}

interface PriceHit {
  id?: string | number;
  'product-name'?: string;
  'console-name'?: string;
  [k: string]: unknown;
}

async function searchBest(
  host: string,
  token: string,
  query: string,
): Promise<PriceHit | null> {
  const url =
    `${host}/api/products?q=${encodeURIComponent(query)}` +
    `&t=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`price lookup failed (${res.status})`);
  const data = await res.json();
  if (data?.status === 'error')
    throw new Error(String(data['error-message'] ?? 'price lookup error'));
  const hits: PriceHit[] = Array.isArray(data?.products) ? data.products : [];
  return hits[0] ?? null;
}

function toDeal(
  term: (typeof MISSPELLINGS)[number],
  hit: PriceHit,
): MarketDeal | null {
  const raw = dollars(hit['loose-price']);
  let graded: number | null = null;
  for (const f of GRADED_FIELDS) {
    graded = dollars(hit[f]);
    if (graded !== null) break;
  }
  if (raw === null && graded === null) return null;
  return {
    id: `pc-${term.category}-${hit.id ?? term.term}`,
    title: String(hit['product-name'] ?? term.term),
    setName: String(hit['console-name'] ?? ''),
    term: term.term,
    misspelling: term.misspellings[0] ?? term.term,
    category: term.category,
    rawPrice: raw,
    gradedPrice: graded,
    priceUrl: priceUrlFor(term.category, term.term),
  };
}

/** Pull live market prices for every tracked term. Throws on auth/network failure. */
export async function fetchMarketPrices(token: string): Promise<MarketDeal[]> {
  const deals: MarketDeal[] = [];
  const BATCH = 8;
  for (let i = 0; i < MISSPELLINGS.length; i += BATCH) {
    const batch = MISSPELLINGS.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (term) => {
        try {
          const hit = await searchBest(HOSTS[term.category], token, term.term);
          return hit ? toDeal(term, hit) : null;
        } catch {
          return null;
        }
      }),
    );
    for (const d of results) if (d) deals.push(d);
  }
  if (deals.length === 0)
    throw new Error('no market prices returned — check the token');
  return deals;
}
