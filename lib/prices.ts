// Misprice Hunter — live market pricing via TCGdex (https://api.tcgdex.net)
// Free, no API key, no signup, no rate limits. Every card carries TCGplayer
// market prices (USD) plus Cardmarket (EUR), refreshed daily.
//
//   GET https://api.tcgdex.net/v2/en/cards/<setId>-<localId>
//
// Card IDs below are the iconic printing per tracked term (e.g. Base Set
// Charizard for "Charizard"), resolved once and pinned so scans are fast and
// stable: 18 requests per scan, cached ~1h server-side.

import { MISSPELLINGS } from './misspellings';

export interface MarketDeal {
  id: string;
  title: string; // e.g. "Charizard #4"
  setName: string; // e.g. "Base Set"
  term: string; // tracked term, e.g. "Charizard"
  misspelling: string; // top typo — feeds the hunt buttons
  rawPrice: number | null; // TCGplayer market, dollars
  gradedPrice: number | null; // TCGdex has no graded prices — always null
  lowPrice: number | null; // TCGplayer low across finishes, dollars
  highPrice: number | null; // TCGplayer high across finishes, dollars
  priceUrl: string; // TCGplayer product page
  imageUrl: string | null; // card image
  live: true;
  source: 'TCGplayer';
}

const API = 'https://api.tcgdex.net/v2/en';

// Iconic printing per tracked Pokémon term. All verified against the TCGdex
// API 2026-09-12, including Mew (sv03.5 = set "151").
const TERM_CARD_IDS: Record<string, string> = {
  Charizard: 'base1-4', // Base Set
  Pikachu: 'base1-58', // Base Set
  Blastoise: 'base1-2', // Base Set
  Venusaur: 'base1-15', // Base Set
  Gengar: 'base3-5', // Fossil
  Mewtwo: 'base1-10', // Base Set
  Mew: 'sv03.5-151', // 151 — Mew ex #151
  Umbreon: 'swsh7-95', // Evolving Skies Umbreon VMAX
  Espeon: 'swsh7-65', // Evolving Skies Espeon VMAX
  Sylveon: 'swsh7-75', // Evolving Skies Sylveon VMAX
  Rayquaza: 'swsh7-111', // Evolving Skies Rayquaza VMAX
  Lugia: 'neo1-9', // Neo Genesis
  Eevee: 'base2-51', // Jungle
  Gyarados: 'base1-6', // Base Set
  Dragonite: 'base3-4', // Fossil
  Snorlax: 'base2-11', // Jungle
  Greninja: 'xy1-41', // XY
  Lucario: 'dp1-6', // Diamond & Pearl
};

interface TcgdexPriceBucket {
  marketPrice?: number;
  lowPrice?: number;
  highPrice?: number;
}

interface TcgdexCard {
  id: string;
  name: string;
  localId?: string;
  set?: { name?: string };
  image?: string;
  thirdParty?: { tcgplayer?: number };
  pricing?: {
    tcgplayer?: Record<string, TcgdexPriceBucket | undefined>;
  };
}

async function fetchCard(id: string): Promise<TcgdexCard> {
  const res = await fetch(`${API}/cards/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`tcgdex ${id} -> ${res.status}`);
  return res.json();
}

function marketRangeOf(card: TcgdexCard): { market: number | null; low: number | null; high: number | null } {
  const p = card.pricing?.tcgplayer;
  if (!p) return { market: null, low: null, high: null };
  let market: number | null = null;
  let low: number | null = null;
  let high: number | null = null;
  const buckets = ['holofoil', 'normal', 'reverse-holofoil']
    .map((k) => p[k])
    .concat(Object.values(p));
  for (const b of buckets) {
    if (!b) continue;
    if (market === null && typeof b.marketPrice === 'number' && b.marketPrice > 0) market = b.marketPrice;
    if (typeof b.lowPrice === 'number' && b.lowPrice > 0) low = low === null ? b.lowPrice : Math.min(low, b.lowPrice);
    if (typeof b.highPrice === 'number' && b.highPrice > 0) high = high === null ? b.highPrice : Math.max(high, b.highPrice);
  }
  return { market, low, high };
}

/**
 * Live TCGplayer market prices for every tracked Pokémon term. No key needed.
 * A term whose card can't be priced is skipped rather than failing the scan.
 */
export async function fetchPokemonPrices(): Promise<MarketDeal[]> {
  const terms = MISSPELLINGS.filter((t) => t.category === 'pokemon');
  const deals: MarketDeal[] = [];
  const BATCH = 6;
  for (let i = 0; i < terms.length; i += BATCH) {
    const results = await Promise.all(
      terms.slice(i, i + BATCH).map(async (term) => {
        const cardId = TERM_CARD_IDS[term.term];
        if (!cardId) return null;
        try {
          const c = await fetchCard(cardId);
          const { market, low, high } = marketRangeOf(c);
          if (market === null) return null;
          const tpId = c.thirdParty?.tcgplayer;
          return {
            id: `tcgdex-${c.id}`,
            title: `${c.name}${c.localId ? ` #${c.localId}` : ''}`,
            setName: c.set?.name ?? '',
            term: term.term,
            misspelling: term.misspellings[0] ?? term.term,
            rawPrice: market,
            gradedPrice: null,
            lowPrice: low,
            highPrice: high,
            priceUrl: tpId
              ? `https://www.tcgplayer.com/product/${tpId}`
              : `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(term.term)}`,
            imageUrl: c.image ? `${c.image}/high.png` : null,
            live: true as const,
            source: 'TCGplayer' as const,
          };
        } catch {
          return null;
        }
      }),
    );
    for (const d of results) if (d) deals.push(d);
  }
  if (deals.length === 0) throw new Error('TCGdex lookup failed');
  return deals;
}
