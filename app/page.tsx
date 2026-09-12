'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DealCard from '@/components/DealCard';
import { MISSPELLINGS } from '@/lib/misspellings';
import type { Deal } from '@/lib/deals';

type Filter = 'all' | 'pokemon' | 'sports';
type Sort = 'ending' | 'price';

const APP_ID_KEY = 'mh_ebay_app_id';
const CERT_ID_KEY = 'mh_ebay_cert_id';

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
  const [sort, setSort] = useState<Sort>('ending');
  const [showSettings, setShowSettings] = useState(false);
  const [appId, setAppId] = useState('');
  const [certId, setCertId] = useState('');
  const [hasKeys, setHasKeys] = useState(false);

  useEffect(() => {
    setAppId(localStorage.getItem(APP_ID_KEY) ?? '');
    setCertId(localStorage.getItem(CERT_ID_KEY) ?? '');
    setHasKeys(Boolean(localStorage.getItem(APP_ID_KEY) && localStorage.getItem(CERT_ID_KEY)));
  }, []);

  const fetchDeals = useCallback(async (refresh = false) => {
    const storedApp = localStorage.getItem(APP_ID_KEY) ?? '';
    const storedCert = localStorage.getItem(CERT_ID_KEY) ?? '';
    const headers: Record<string, string> = {};
    if (storedApp) headers['x-ebay-app-id'] = storedApp;
    if (storedCert) headers['x-ebay-cert-id'] = storedCert;
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

  const saveKeys = () => {
    localStorage.setItem(APP_ID_KEY, appId.trim());
    localStorage.setItem(CERT_ID_KEY, certId.trim());
    setHasKeys(Boolean(appId.trim() && certId.trim()));
    setShowSettings(false);
    onRefresh();
  };

  const clearKeys = () => {
    localStorage.removeItem(APP_ID_KEY);
    localStorage.removeItem(CERT_ID_KEY);
    setAppId('');
    setCertId('');
    setHasKeys(false);
    onRefresh();
  };

  const deals = useMemo(() => {
    if (!data) return [];
    let list = data.deals;
    if (filter !== 'all') list = list.filter((d) => d.category === filter);
    const sorted = [...list];
    if (sort === 'ending') sorted.sort((a, b) => +new Date(a.endTime) - +new Date(b.endTime));
    else sorted.sort((a, b) => a.price - b.price);
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
            Misspelled eBay auctions get fewer eyeballs — and lower final bids. Misprice Hunter
            scans {typoCount}+ common typos across Pokémon and sports cards and surfaces the
            auctions ending soonest.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-black hover:bg-amber-300 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Scanning…' : '↻ Refresh deals'}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
            >
              {hasKeys ? '✓ eBay key connected' : 'Connect free eBay key'}
            </button>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            {data?.demo
              ? 'Showing demo data — connect your free eBay key for live results.'
              : `Live results · updated ${data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '—'}`}
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
              <span className="font-bold">Demo data.</span> These are sample listings so you can see
              the product. Add your free eBay key for live results — takes 5 minutes.
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black hover:bg-amber-300"
            >
              Get live results
            </button>
          </div>
        )}
        {data?.error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            Live scan hit a snag ({data.error}). Showing demo data instead.
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
              <option value="ending">Ending soonest</option>
              <option value="price">Lowest bid</option>
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
            No auctions matched this filter right now. Hit refresh or try another category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-600 max-w-2xl mx-auto">
          These are auctions other bidders may have missed — that makes them <em>worth a look</em>,
          not guaranteed deals. Always check the seller, the photos, and the description before you bid.
        </p>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowSettings(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-zinc-700 bg-[#141417] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Connect your free eBay key</h2>
            <ol className="mt-3 text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
              <li>Go to <span className="text-zinc-200 font-mono">developer.ebay.com</span> and sign in</li>
              <li>Create an app (pick a name like "misprice-hunter")</li>
              <li>Copy the <span className="text-zinc-200">App ID (Client ID)</span> and <span className="text-zinc-200">Cert ID (Client Secret)</span></li>
              <li>Paste them below — they stay in your browser only</li>
            </ol>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              App ID (Client ID)
            </label>
            <input
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="e.g. MarcelRos-misprice-PRD-…"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b0b0d] px-3 py-2.5 font-mono text-sm"
            />
            <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Cert ID (Client Secret)
            </label>
            <input
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              type="password"
              placeholder="PRD-…"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b0b0d] px-3 py-2.5 font-mono text-sm"
            />
            <div className="mt-5 flex gap-3">
              <button
                onClick={saveKeys}
                disabled={!appId.trim() || !certId.trim()}
                className="flex-1 rounded-lg bg-amber-400 px-4 py-2.5 font-bold text-black hover:bg-amber-300 disabled:opacity-40"
              >
                Save & go live
              </button>
              {hasKeys && (
                <button
                  onClick={clearKeys}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:text-white"
                >
                  Disconnect
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] text-zinc-600">
              Keys are stored in this browser's localStorage and sent only to this site's API route to call eBay. Never shared.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
