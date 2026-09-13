'use client';

import { useEffect, useState } from 'react';

// Steal hall of fame: the single biggest discount the hunter has found this
// week, plus past weeks' champs. Maintained by the 8-hour hunter run
// (see hunter/RUNBOOK.md) in public/hall-of-fame.json.

export interface FameEntry {
  weekStart: string; // ISO date of the Monday the week started
  title: string;
  imageUrl: string | null;
  itemUrl: string;
  price: number;
  marketPrice: number;
  discountPct: number;
  typo: string;
  term: string;
  foundAt: string; // ISO timestamp of the hunt that crowned it
}

interface FameFile {
  current: FameEntry | null;
  past: FameEntry[];
}

function money(v: number): string {
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

function weekLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HallOfFame() {
  const [data, setData] = useState<FameFile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/hall-of-fame.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setData(j))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  const share = async () => {
    const url = 'https://misprice-hunter.vercel.app/#hall-of-fame';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can copy from the address bar */
    }
  };

  const { current, past } = data;

  return (
    <section id="hall-of-fame" className="mb-10 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            🏆 Steal hall of fame
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            The biggest discount our hunter has caught each week. Found a better one? That’s the
            game — go hunt.
          </p>
        </div>
        <button
          onClick={share}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
        >
          {copied ? '✓ Link copied!' : 'Share this ⧉'}
        </button>
      </div>

      {!current ? (
        <div className="rounded-xl border border-zinc-800 bg-[#141417] p-10 text-center">
          <p className="text-3xl mb-3">🏆</p>
          <p className="text-zinc-400 font-semibold">No steals crowned yet.</p>
          <p className="mt-1 text-sm text-zinc-600">
            The hunter crowns the biggest discount after every 8-hour run. Check back soon.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-amber-400/60 bg-[#141417] overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="relative bg-zinc-900 sm:w-64 shrink-0 aspect-[4/3] sm:aspect-auto">
              {current.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.imageUrl}
                  alt={current.title}
                  className="h-full w-full object-contain p-3"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-700 text-5xl">
                  🂠
                </div>
              )}
              <span className="absolute top-2 left-2 rounded bg-amber-400 px-2 py-0.5 text-[11px] font-black tracking-wide text-black">
                {current.discountPct}% OFF
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                Week of {weekLabel(current.weekStart)} · reigning steal
              </p>
              <h3 className="font-bold text-lg leading-snug line-clamp-2">{current.title}</h3>
              <p className="text-xs text-zinc-500">
                found via typo <span className="text-amber-400/90 font-mono">"{current.typo}"</span>
                <span className="text-zinc-600"> → {current.term}</span>
              </p>
              <p className="text-sm text-zinc-400">
                Sold/bid at <span className="text-amber-300 font-extrabold text-xl tabular-nums">{money(current.price)}</span>
                <span className="text-zinc-600"> vs </span>
                <span className="text-zinc-300 font-semibold tabular-nums">{money(current.marketPrice)}</span>
                <span className="text-zinc-600"> market</span>
              </p>
              <a
                href={current.itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto self-start rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
              >
                See the listing ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Past champs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {past.slice(0, 8).map((p) => (
              <a
                key={p.weekStart}
                href={p.itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-800 bg-[#141417] p-3 hover:border-amber-400/50 transition-colors"
              >
                <p className="text-[11px] text-zinc-500">Week of {weekLabel(p.weekStart)}</p>
                <p className="mt-1 text-sm font-bold text-amber-300 tabular-nums">{p.discountPct}% off</p>
                <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{p.title}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
