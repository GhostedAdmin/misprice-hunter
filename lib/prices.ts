// Misprice Hunter — live market pricing via the free Pokémon TCG API
// (pokemontcg.io, key at https://dev.pokemontcg.io). Every card object
// carries TCGplayer market prices, updated daily.
//
//   GET https://api.pokemontcg.io/v2/cards?q=name:<term>*&pageSize=12
//   header X-Api-Key: <key>   (works keyless too, but shared-host IPs burn
//   through the 1k/day anonymous quota fast, so we ask for a key)
//
// Sports cards have no verifiable free API (PriceCharting/SportsCardsPro
// moved API access behind paid tiers in 2026), so sports entries stay on
// clearly-labeled sample prices until a sports source is added.

import { MISSPELLINGS } from './misspellings';

export interface MarketDeal {
  id: string;
  title: string; // e.g. "Charizard #4"
  setName: string; // e.g. "Base Set"
  term: string; // tracked term, e.g. "Charizard"
  misspelling: string; // top typo — feeds the hunt buttons
  rawPrice: number | null; // TCGplayer market, dollars
  gradedPrice: number | null; // not provided by this API — always null
  priceUrl: string; // TCGplayer listing page
  imageUrl: string | null; // card image
  live: true;
}

const API = 'https://api.pokemontcg.io/v2';

interface TcgCard {
  id: string;
  name: string;
  number?: string;
  set?: { name?: string };
  images?: { small?: string };
  tcgplayer?: {
    url?: string;
    prices?: Record<string, { market?: number } | undefined>;
  };
}

async function searchCards(term: string, key: string): Promise<TcgCard[]> {
  const res = await fetch(
    `${API}/cards?q=${encodeURIComponent(`name:${term.toLowerCase()}*`)}&pageSize=12`,
    { headers: key ? { 'X-Api-Key': key } : {}, cache: 'no-store' },
  );
  if (!res.ok) throw new Error(`card lookup failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
}

function marketOf(card: TcgCard): number | null {
  const p = card.tcgplayer?.prices;
  if (!p) return null;
  const preferred = [
    'holofoil',
    '1stEditionHolofoil',
    'reverseHolofoil',
    'normal',
    '1stEditionNormal',
  ];
  for (const k of preferred) {
    const m = p[k]?.market;
    if (typeof m === 'number' && m > 0) return m;
  }
  for (const v of Object.values(p)) {
    const m = v?.market;
    if (typeof m === 'number' && m > 0) return m;
  }
  return null;
}

/**
 * Live TCGplayer market prices for every tracked Pokémon term. Picks the
 * highest-market priced match per term (usually the iconic printing) — the
 * card name, set and number are always shown so it's transparent.
 */
export async function fetchPokemonPrices(key: string): Promise<MarketDeal[]> {
  const terms = MISSPELLINGS.filter((t) => t.category === 'pokemon');
  const deals: MarketDeal[] = [];
  const BATCH = 6;
  for (let i = 0; i < terms.length; i += BATCH) {
    const results = await Promise.all(
      terms.slice(i, i + BATCH).map(async (term) => {
        try {
          const cards = await searchCards(term.term, key);
          const priced = cards
            .map((c) => ({ c, m: marketOf(c) }))
            .filter((x) => x.m !== null)
            .sort((a, b) => (b.m ?? 0) - (a.m ?? 0));
          if (priced.length === 0) return null;
          const { c, m } = priced[0];
          return {
            id: `ptcg-${c.id}`,
            title: `${c.name}${c.number ? ` #${c.number}` : ''}`,
            setName: c.set?.name ?? '',
            term: term.term,
            misspelling: term.misspellings[0] ?? term.term,
            rawPrice: m,
            gradedPrice: null,
            priceUrl:
              c.tcgplayer?.url ??
              `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(term.term)}`,
            imageUrl: c.images?.small ?? null,
            live: true as const,
          };
        } catch {
          return null;
        }
      }),
    );
    for (const d of results) if (d) deals.push(d);
  }
  if (deals.length === 0)
    throw new Error('no live prices returned — check the API key');
  return deals;
}
