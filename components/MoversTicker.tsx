'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Deal } from '@/lib/deals';

// Per-visitor price memory: the tape compares today's live prices against
// what THIS browser saw last visit, so "gainers/losers" is real movement,
// not decoration. First visit has no baseline — the tape just shows prices.
const STORE_KEY = 'mh-last-prices-v1';

interface Stored {
  price: number;
  at: number;
}

function primaryPrice(d: Deal): number | null {
  return d.rawPrice ?? d.gradedPrice;
}

function money(v: number): string {
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

interface MoverItem {
  deal: Deal;
  price: number;
  pct: number | null; // % change vs last visit, null = no baseline
}

export default function MoversTicker({ deals, live }: { deals: Deal[]; live: boolean }) {
  const [baseline, setBaseline] = useState<Record<string, Stored> | null>(null);

  // Read last visit's prices once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      setBaseline(raw ? (JSON.parse(raw) as Record<string, Stored>) : {});
    } catch {
      setBaseline({});
    }
  }, []);

  // After painting this visit's tape, store today's prices for next time.
  // Never learn from sample data.
  useEffect(() => {
    if (!live || deals.length === 0) return;
    const next: Record<string, Stored> = {};
    const now = Date.now();
    for (const d of deals) {
      const p = primaryPrice(d);
      if (p !== null) next[d.id] = { price: p, at: now };
    }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* private mode — tape still works, just no memory */
    }
  }, [live, deals]);

  const ordered = useMemo<MoverItem[]>(() => {
    const items: MoverItem[] = [];
    for (const d of deals) {
      const price = primaryPrice(d);
      if (price === null) continue;
      const prev = baseline?.[d.id]?.price;
      const pct = prev && prev > 0 ? ((price - prev) / prev) * 100 : null;
      items.push({ deal: d, price, pct });
    }
    const hasBaseline = baseline !== null && Object.keys(baseline).length > 0;
    if (!hasBaseline) return items; // first visit: plain live tape
    const gainers = items
      .filter((i) => i.pct !== null && i.pct > 0.05)
      .sort((a, b) => (b.pct as number) - (a.pct as number));
    const losers = items
      .filter((i) => i.pct !== null && i.pct < -0.05)
      .sort((a, b) => (a.pct as number) - (b.pct as number));
    const flat = items.filter((i) => i.pct === null || Math.abs(i.pct as number) <= 0.05);
    return [...gainers, ...losers, ...flat];
  }, [deals, baseline]);

  if (ordered.length === 0) return null;

  const hasBaseline = baseline !== null && Object.keys(baseline).length > 0;
  const label = !live
    ? 'Sample prices'
    : hasBaseline
      ? 'Top gainers & losers · since your last visit'
      : 'Live market tape';

  const loop = [...ordered, ...ordered];

  return (
    <div className="border-t border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 pt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase truncate">
          {hasBaseline && live ? (
            <>
              <span className="text-emerald-400">▲ Gainers</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-red-400">▼ Losers</span>
              <span className="text-zinc-600"> · since your last visit</span>
            </>
          ) : (
            label
          )}
        </p>
        <p className="text-[11px] text-zinc-700 shrink-0 hidden sm:block">hover to pause</p>
      </div>
      <div className="overflow-hidden py-3 select-none">
        <div
          className="ticker flex whitespace-nowrap gap-10 w-max items-center"
          style={{ animationDuration: `${Math.max(60, ordered.length * 5)}s` }}
        >
          {loop.map((item, i) => (
            <span key={i} className="flex items-center gap-2 font-mono text-sm">
              {item.pct !== null && item.pct > 0.05 && (
                <span className="text-emerald-400 font-bold">▲ {item.pct.toFixed(1)}%</span>
              )}
              {item.pct !== null && item.pct < -0.05 && (
                <span className="text-red-400 font-bold">▼ {Math.abs(item.pct).toFixed(1)}%</span>
              )}
              <span className="text-zinc-300 font-sans font-semibold">{item.deal.title}</span>
              <span className="text-amber-300 tabular-nums">{money(item.price)}</span>
              <span className="text-zinc-800">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
