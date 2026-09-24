'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DealCard from '@/components/DealCard';
import CrownCardsBanner from '@/components/CrownCardsBanner';
import MoversTicker from '@/components/MoversTicker';
import CardSearch from '@/components/CardSearch';
import TypoFinds from '@/components/TypoFinds';
import TypoGenerator from '@/components/TypoGenerator';
import HallOfFame from '@/components/HallOfFame';
import type { Deal } from '@/lib/deals';

type Filter = 'all' | 'pokemon' | 'sports';
type Sort = 'value-desc' | 'value-asc' | 'name';

interface ScanResponse {
  demo: boolean;
  sportsLive?: boolean;
  updatedAt: string;
  cached?: boolean;
  error?: string;
  deals: Deal[];
}

export default function Home() {
  const [data, setData] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('value-desc');
  const [query, setQuery] = useState('');

  const fetchDeals = useCallback(async (refresh = false) => {
    const res = await fetch(`/api/scan${refresh ? '?refresh=1' : ''}`);
    const json: ScanResponse = await res.json();
    setData(json);
  }, []);

  useEffect(() => {
    fetchDeals()
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [fetchDeals]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDeals(true);
    } finally {
      setRefreshing(false);
    }
  };

  const deals = useMemo(() => {
    if (!data) return [];
    let list = data.deals;
    if (filter !== 'all') list = list.filter((d) => d.category === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((d) =>
        [d.title, d.setName, d.term, d.misspelling].some((s) =>
          s.toLowerCase().includes(q),
        ),
      );
    }
    const primary = (d: Deal) => d.rawPrice ?? d.gradedPrice ?? -1;
    const sorted = [...list];
    if (sort === 'value-desc') sorted.sort((a, b) => primary(b) - primary(a));
    else if (sort === 'value-asc')
      sorted.sort(
        (a, b) =>
          (a.rawPrice ?? a.gradedPrice ?? Infinity) -
          (b.rawPrice ?? b.gradedPrice ?? Infinity),
      );
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [data, filter, sort, query]);

  const totalCount = data?.deals.length ?? 0;

  return (
    <div>
      {/* HERO */}
      <section className="dotgrid border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 text-center">
          <p className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-bold tracking-widest text-amber-300 uppercase">
            Typo arbitrage for card hunters
          </p>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight">
            Sellers can't spell.
            <br />
            <span className="text-amber-400">You profit.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-zinc-400 text-base sm:text-lg">
            Misspelled listings get fewer eyeballs — and lower final bids. Misprice Hunter
            tracks {totalCount || '24'} iconic cards with live market prices — TCGplayer for
            Pokémon, CardSight AI for sports — so you know what the correctly-spelled card
            is worth before you hunt the typo across every marketplace.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-black hover:bg-amber-300 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Scanning…' : '↻ Refresh prices'}
            </button>
            <a
              href="/how-it-works"
              className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
            >
              How it works
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            {!data
              ? 'Loading live market prices…'
              : data.demo
                ? 'Showing sample prices — live data will return automatically.'
                : `Live market prices${data.sportsLive ? ' (Pokémon + sports)' : ' (Pokémon · sports samples)'} · updated ${data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '—'}`}
          </p>
        </div>
        {/* market movers ticker */}
        {data && data.deals.length > 0 && (
          <MoversTicker deals={data.deals} live={!data.demo} />
        )}
      </section>

      {/* CROWNCARDS PARTNER BANNER */}
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <CrownCardsBanner />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* DEMO / ERROR BANNERS */}
        {data?.demo && (
          <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
            <p className="text-sm text-amber-200">
              <span className="font-bold">Sample prices.</span> The live price feed hiccuped
              {data.error ? ` (${data.error})` : ''} — showing sample values until the next refresh.
            </p>
          </div>
        )}

        {/* SEARCH — filters tracked cards instantly, searches every card via dropdown */}
        <CardSearch query={query} setQuery={setQuery} />

        {/* FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
            {(['all', 'pokemon', 'sports'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : f === 'pokemon' ? 'Pokémon' : 'Sports'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-zinc-800 bg-[#141417] px-3 py-2 text-sm font-medium text-zinc-200"
            >
              <option value="value-desc">Highest value</option>
              <option value="value-asc">Lowest value</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>
        {query.trim() && (
          <p className="mb-4 text-sm text-zinc-500">
            {deals.length} of {totalCount} cards match{' '}
            <span className="text-amber-300 font-semibold">“{query.trim()}”</span>
          </p>
        )}

        {/* PRE-HUNTED TYPO FINDS — refreshed every 8 hours by the typo hunter */}
        {!query.trim() && <TypoFinds />}

        {/* STEAL HALL OF FAME — biggest weekly discount */}
        {!query.trim() && <HallOfFame />}

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-[#141417] h-80 animate-pulse" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#141417] p-12 text-center text-zinc-500">
            {query.trim() ? (
              <>
                Nothing matches <span className="text-amber-300 font-semibold">“{query.trim()}”</span>.
                <br />
                <button onClick={() => setQuery('')} className="mt-3 text-sm font-semibold text-amber-400 hover:text-amber-300">
                  Clear search →
                </button>
              </>
            ) : (
              'No cards matched this filter right now. Hit refresh or try another category.'
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}

        {/* TYPO GENERATOR — hunt any card name */}
        <TypoGenerator />

        {/* HUNT MANUALLY */}
        <section className="mt-10 rounded-xl border border-zinc-800 bg-[#141417] p-6">
          <h2 className="text-lg font-bold">
            🎯 Hunt manually — <span className="text-amber-400">no API key needed</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Typo arbitrage works on <span className="text-zinc-100 font-semibold">every</span>{' '}
            marketplace. The hunt buttons on each card run that exact misspelling as a search
            across eBay (ending soonest, newly listed, cheapest Buy It Now), TCGplayer, Mercari,
            Facebook Marketplace, and Whatnot — compare what you find against the market prices
            above to spot the real steals. Hit <span className="text-amber-300 font-semibold">Open
            all</span> to fire every search at once, then check the tabs and bid on what other
            hunters can't find.
          </p>
          <a
            href="/word-list"
            className="mt-4 inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
          >
            Browse the full typo dictionary →
          </a>
        </section>

        <p className="mt-8 text-center text-xs text-zinc-600 max-w-2xl mx-auto">
          Market prices are a guide, not a guarantee — always check the seller, the photos, and
          the description before you bid on a misspelled listing.
        </p>

        {/* BASEMINT VAULT SOCIALS */}
        <section className="mt-10 rounded-xl border border-amber-400/30 bg-[#141417] p-6 text-center">
          <h2 className="text-lg font-bold">
            🏦 Follow the <span className="text-amber-400">Basemint Vault</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-xl mx-auto">
            Daily grail sales, record-breakers, and market movers — the cards behind the prices
            on this page, posted every day.
          </p>
          <a
            href="https://www.instagram.com/thebasemintvault"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-black hover:bg-amber-300 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @thebasemintvault on Instagram
          </a>
        </section>
      </div>
    </div>
  );
}
