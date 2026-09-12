import { NextRequest, NextResponse } from 'next/server';
import { fetchPokemonCard, marketRangeOf, type TcgdexCard } from '@/lib/prices';
import { cardsightGet, fetchSportsDetail, sportsConfigured } from '@/lib/sports';
import type { Deal } from '@/lib/deals';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// On-demand pricing for one card picked from universal search. Returns a
// complete Deal so the UI can render it exactly like a tracked card.

// Resolved sports artwork, cached per card UUID — the catalog carries no
// images, so the photo comes from a completed-auction listing instead.
const IMAGE_CACHE = new Map<string, string | null>();

function listingImage(r: any): string | null {
  const u = r?.image_url;
  return typeof u === 'string' && u.startsWith('http') ? u : null;
}

async function sportsImage(cardId: string, title: string): Promise<string | null> {
  if (IMAGE_CACHE.has(cardId)) return IMAGE_CACHE.get(cardId) ?? null;
  let img: string | null = null;
  try {
    const json: any = await cardsightGet(
      `/v1/pricing/search?q=${encodeURIComponent(title)}&listing_type=auction&period=3m&limit=10`,
    );
    const results: any[] = json?.results || json?.data?.results || [];
    const matched = results.find((r) => {
      const mc = r?.matched_card;
      const id = typeof mc === 'string' ? mc : mc?.id;
      return id != null && String(id) === cardId && listingImage(r);
    });
    img = (matched && listingImage(matched)) || results.map(listingImage).find(Boolean) || null;
  } catch {
    img = null;
  }
  IMAGE_CACHE.set(cardId, img);
  if (IMAGE_CACHE.size > 300) {
    const oldest = IMAGE_CACHE.keys().next().value;
    if (oldest) IMAGE_CACHE.delete(oldest);
  }
  return img;
}

function pokemonDeal(c: TcgdexCard): Deal {
  const { market, low, high } = marketRangeOf(c);
  const title = `${c.name}${c.localId ? ` #${c.localId}` : ''}`;
  const tpId = c.thirdParty?.tcgplayer;
  return {
    id: `tcgdex-${c.id}`,
    title,
    setName: c.set?.name ?? '',
    term: title,
    misspelling: title, // hunt buttons use the real name for ad-hoc cards
    category: 'pokemon',
    rawPrice: market,
    gradedPrice: null,
    lowPrice: low,
    highPrice: high,
    priceUrl: tpId
      ? `https://www.tcgplayer.com/product/${tpId}`
      : `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(c.name)}`,
    imageUrl: c.image ? `${c.image}/high.png` : null,
    live: true,
    source: 'TCGplayer',
  };
}

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const type = params.get('type');

  try {
    if (type === 'pokemon') {
      const id = (params.get('id') || '').trim();
      if (!id) throw new Error('missing id');
      const card = await fetchPokemonCard(id);
      return NextResponse.json({ deal: pokemonDeal(card) });
    }

    if (type === 'sports') {
      if (!sportsConfigured()) throw new Error('sports pricing not configured');
      const cardId = (params.get('cardId') || '').trim();
      if (!cardId) throw new Error('missing cardId');
      const title = (params.get('title') || 'Sports card').slice(0, 120);
      const subtitle = (params.get('subtitle') || '').slice(0, 160);
      // Pricing + artwork in parallel. The catalog has no images, so the
      // photo comes from the first completed-auction listing with one —
      // cached per card so repeat views cost nothing.
      const [{ raw, graded }, imageUrl] = await Promise.all([
        fetchSportsDetail(cardId),
        sportsImage(cardId, title),
      ]);
      if (raw === null && graded === null) throw new Error('no pricing found for this card');
      const deal: Deal = {
        id: `cardsight-${cardId}`,
        title,
        setName: subtitle,
        term: title,
        misspelling: title,
        category: 'sports',
        rawPrice: raw,
        gradedPrice: graded,
        priceUrl: `https://www.sportscardspro.com/search-products?q=${encodeURIComponent(title)}&type=prices`,
        imageUrl,
        live: true,
        source: 'CardSight AI',
      };
      return NextResponse.json({ deal });
    }

    throw new Error('unknown type');
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'lookup failed' },
      { status: 502 },
    );
  }
}
