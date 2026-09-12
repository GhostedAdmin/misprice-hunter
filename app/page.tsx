'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DealCard from '@/components/DealCard';
import { MISSPELLINGS } from '@/lib/misspellings';
import type { Deal } from '@/lib/deals';

type Filter = 'all' | 'pokemon' | 'sports';
type Sort = 'raw' | 'graded' | 'name';

const PC_TOKEN_KEY = 'mh_pc_token';

interface ScanResponse {
  demo: boolean;
  updatedAt: string;
  cached?: boolean;
  error?: string;
  deals: Deal[];
}

const TICKER_WORDS = MISSPELLINGS.flatMap((e) => e.misspellings.slice(0, 2));

export default function Home() {
  const [data, setData] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('graded');
  const [showSettings, setShowSettings] = useState(false);
  const [pcToken, setPcToken] = useState('');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(PC_TOKEN_KEY) ?? '';
    setPcToken(t);
    setHasToken(Boolean(t));
  }, []);

  const fetchDeals = useCallback(async (refresh = false) => {
    const stored = localStorage.getItem(PC_TOKEN_KEY) ?? '';
    const headers: Record<string, string> = {};
    if (stored) headers['x-pc-token'] = stored;
    const res = await fetch(`/api/scan${refresh ? '?refresh=1' : ''}`, { headers });
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

  const saveToken = () => {
    localStorage.setItem(PC_TOKEN_KEY, pcToken.trim());
    setHasToken(Boolean(pcToken.trim()));
    setShowSettings(false);
    onRefresh();
  };

  const clearToken = () => {
    localStorage.removeItem(PC_TOKEN_KEY);
    setPcToken('');
    setHasToken(false);
    onRefresh();
  };

  const deals = useMemo(() => {
    if (!data) return [];
    let list = data.deals;
    if (filter !== 'all') list = list.filter((d) => d.category === filter);
    const sorted = [...list];
    if (sort === 'raw') sorted.sort((a, b) => (a.rawPrice ?? Infinity) - (b.rawPrice ?? Infinity));
    else if (sort === 'graded') sorted.sort((a, b) => (b.gradedPrice ?? -1) - (a.gradedPrice ?? -1));
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [data, filter, sort]);

  const typoCount = MISSPELLINGS.reduce((n, e) => n + e.misspellings.length, 0);

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
            pulls live market prices for {typoCount}+ tracked cards across Pokémon and sports,
            so you know what the correctly-spelled card is worth before you hunt the typo.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-black hover:bg-amber-300 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Scanning…' : '↻ Refresh prices'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
            >
              {hasToken ? '✓ Price token connected' : 'Connect free price token'}
            </button>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            {data?.demo
              ? 'Showing demo prices — connect your free PriceCharting token for live market data.'
              : `Live market prices · updated ${data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '—'}`}
          </p>
        </div>
        {/* typo ticker */}
        <div className="border-t border-zinc-800 overflow-hidden py-3 select-none" aria-hidden>
          <div className="ticker flex whitespace-nowrap gap-8 w-max">
            {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
              <span key={i} className="font-mono text-sm text-zinc-600">
                <span className="text-red-400/70 line-through">{w}</span>
                <span className="text-zinc-700"> → </span>
                <span className="text-zinc-500">fewer bids</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* DEMO / ERROR BANNERS */}
        {data?.demo && (
          <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <p className="text-sm text-amber-200">
              <span className="font-bold">Demo prices.</span> These are sample market values so you can see
              the product. Add your free PriceCharting token for live market data — takes 2 minutes.
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black hover:bg-amber-300"
            >
              Get live prices
            </button>
          </div>
        )}
        {data?.error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            Price lookup hit a snag ({data.error}). Showing demo prices instead.
          </div>
        )}

        {/* FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
              <option value="graded">Highest graded</option>
              <option value="raw">Lowest raw</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-[#141417] h-80 animate-pulse" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#141417] p-12 text-center text-zinc-500">
            No cards matched this filter right now. Hit refresh or try another category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}

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
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowSettings(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-zinc-700 bg-[#141417] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Connect your free price token</h2>
            <ol className="mt-3 text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
              <li>Go to <span className="text-zinc-200 font-mono">pricecharting.com/api</span> and sign in</li>
              <li>Copy your API token (the same token works for sports cards via SportsCardsPro)</li>
              <li>Paste it below — it stays in your browser only</li>
            </ol>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              PriceCharting API token
            </label>
            <input
              value={pcToken}
              onChange={(e) => setPcToken(e.target.value)}
              type="password"
              placeholder="40-character token"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b0b0d] px-3 py-2.5 font-mono text-sm"
            />
            <div className="mt-5 flex gap-3">
              <button
                onClick={saveToken}
                disabled={!pcToken.trim()}
                className="flex-1 rounded-lg bg-amber-400 px-4 py-2.5 font-bold text-black hover:bg-amber-300 disabled:opacity-40"
              >
                Save & go live
              </button>
              {hasToken && (
                <button
                  onClick={clearToken}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:text-white"
                >
                  Disconnect
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] text-zinc-600">
              The token is stored in this browser's localStorage and sent only to this site's API route to fetch market prices. Never shared.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
