import { NextRequest, NextResponse } from 'next/server';
import { demoDeals, type Deal } from '@/lib/deals';
import { fetchPokemonPrices } from '@/lib/prices';
import { fetchSportsPrices, sportsConfigured } from '@/lib/sports';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory cache (~1h TTL). Note: serverless instances each hold their own
// copy, so this is a best-effort cache for the PoC, not a shared store.
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; deals: Deal[]; demo: boolean; sportsLive: boolean } | null =
  null;

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const force = url.searchParams.get('refresh') === '1';

  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json({
      demo: cache.demo,
      sportsLive: cache.sportsLive,
      updatedAt: new Date(cache.at).toISOString(),
      cached: true,
      deals: cache.deals,
    });
  }

  try {
    // Pokémon goes live via TCGdex (free, no key). Sports goes live via
    // CardSight AI when a key is configured, otherwise clearly-labeled samples.
    const pokemon = await fetchPokemonPrices();
    let sports: Deal[];
    let sportsLive = false;
    try {
      if (sportsConfigured()) {
        sports = (await fetchSportsPrices()).map((s) => ({
          ...s,
          category: 'sports' as const,
        }));
        sportsLive = true;
      } else {
        sports = demoDeals().filter((d) => d.category === 'sports');
      }
    } catch {
      // Sports pricing hiccup — keep Pokémon live, sports fall back to samples.
      sports = demoDeals().filter((d) => d.category === 'sports');
      sportsLive = false;
    }
    const deals: Deal[] = [
      ...pokemon.map((p) => ({ ...p, category: 'pokemon' as const })),
      ...sports,
    ];
    cache = { at: Date.now(), deals, demo: false, sportsLive };
    return NextResponse.json({
      demo: false,
      sportsLive,
      updatedAt: new Date().toISOString(),
      cached: false,
      deals,
    });
  } catch (err) {
    // Never leave the UI empty — fall back to labeled demo data on error.
    const deals = demoDeals();
    return NextResponse.json({
      demo: true,
      sportsLive: false,
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
