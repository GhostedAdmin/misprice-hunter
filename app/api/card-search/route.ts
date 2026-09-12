import { NextRequest, NextResponse } from 'next/server';
import { cardsightGet, sportsConfigured } from '@/lib/sports';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Universal card search: Pokémon via TCGdex (free, no key), sports via
// CardSight AI's fuzzy catalog search (one API call per query). Results are
// lightweight — full pricing happens on demand in /api/card-detail so typing
// doesn't burn the CardSight quota.

const TCGDEX_SEARCH = 'https://api.tcgdex.net/v2/en/cards';
const TAKE = 8;

export interface PokemonHit {
  id: string;
  title: string;
  imageUrl: string | null;
}

export interface SportsHit {
  cardId: string;
  title: string;
  subtitle: string;
  segment: string;
}

// Short in-memory cache per normalized query — protects the CardSight quota
// when someone types, deletes, and retypes the same thing.
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; data: { pokemon: PokemonHit[]; sports: SportsHit[] } }>();

function titleOf(name: string, localId?: string): string {
  return localId ? `${name} #${localId}` : name;
}

async function searchPokemon(q: string): Promise<PokemonHit[]> {
  try {
    const res = await fetch(
      `${TCGDEX_SEARCH}?name=${encodeURIComponent(q)}&pagination:itemsPerPage=${TAKE}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const items: any[] = await res.json();
    if (!Array.isArray(items)) return [];
    return items.slice(0, TAKE).map((c) => ({
      id: String(c.id),
      title: titleOf(String(c.name ?? 'Unknown card'), c.localId),
      imageUrl: c.image ? `${c.image}/high.png` : null,
    }));
  } catch {
    return [];
  }
}

async function searchSports(q: string): Promise<SportsHit[]> {
  if (!sportsConfigured()) return [];
  try {
    const json: any = await cardsightGet(
      `/v1/catalog/search?q=${encodeURIComponent(q)}&take=${TAKE}&type=card`,
    );
    const results: any[] = json?.results || [];
    return results
      .filter((r) => r && r.type === 'card' && r.id)
      .slice(0, TAKE)
      .map((r) => {
        const bits = [r.releaseName || r.setName, r.year].filter(Boolean);
        if (r.cardNumber) bits.push(`#${r.cardNumber}`);
        return {
          cardId: String(r.id),
          title: String(r.name ?? 'Unknown card'),
          subtitle: bits.join(' · '),
          segment: String(r.segmentName ?? ''),
        };
      });
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const q = (new URL(req.url).searchParams.get('q') || '').trim();
  if (q.length < 3) {
    return NextResponse.json({ pokemon: [], sports: [] });
  }
  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return NextResponse.json({ ...hit.data, cached: true });
  }
  const [pokemon, sports] = await Promise.all([searchPokemon(q), searchSports(q)]);
  const data = { pokemon, sports };
  cache.set(key, { at: Date.now(), data });
  // Keep the cache small.
  if (cache.size > 200) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0]?.[0];
    if (oldest) cache.delete(oldest);
  }
  return NextResponse.json(data);
}
