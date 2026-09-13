'use client';

import { useEffect, useState } from 'react';

// One pre-hunted typo listing. Written every 8 hours by the typo hunter
// (see hunter/RUNBOOK.md) into public/typo-finds.json. Every field is real
// data extracted from a live eBay listing — never fabricated.
export interface TypoFind {
  id: string; // e.g. "ebay-388912345678"
  title: string; // listing title as written by the seller (typos and all)
  price: number; // current bid or Buy It Now price, USD
  listingType: 'auction' | 'buyitnow';
  bids?: number;
  timeLeft?: string; // e.g. "3h 22m" for auctions
  imageUrl: string | null;
  itemUrl: string; // deep link to the live eBay listing
  typo: string; // the misspelling that surfaced it, e.g. "Charzard"
  term: string; // the correctly-spelled card, e.g. "Charizard"
  category: 'pokemon' | 'sports';
  marketPrice?: number | null; // our tracked market price for the card, when known
  endsInMinutes?: number | null; // auction countdown in minutes, when known
}

interface FindsFile {
  updatedAt: string;
  finds: TypoFind[];
}

function money(v: number): string {
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Auction countdown → minutes. The hunter writes endsInMinutes; this parses
// the display string as a fallback ("2h 14m", "3d 5h", "55m").
function endsIn(f: TypoFind): number | null {
  if (f.endsInMinutes != null) return f.endsInMinutes;
  if (!f.timeLeft) return null;
  const d = /(\d+)\s*d/i.exec(f.timeLeft);
  const h = /(\d+)\s*h/i.exec(f.timeLeft);
  const m = /(\d+)\s*m(?!o)/i.exec(f.timeLeft);
  if (!d && !h && !m) return null;
  return (d ? parseInt(d[1]) * 1440 : 0) + (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

import FlipCalculator from '@/components/FlipCalculator';

function FindCard({ find }: { find: TypoFind }) {
  const discount =
    find.marketPrice && find.marketPrice > 0
      ? Math.round((1 - find.price / find.marketPrice) * 100)
      : null;
  const hot = discount !== null && discount >= 50;
  return (
    <a
      href={find.itemUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-zinc-800 bg-[#141417] overflow-hidden flex flex-col hover:border-amber-400/60 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-zinc-900">
        {find.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={find.imageUrl}
            alt={find.title}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-700 text-4xl">
            🂠
          </div>
        )}
        <span
          className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
            find.category === 'pokemon' ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'
          }`}
        >
          {find.category === 'pokemon' ? 'POKÉMON' : 'SPORTS'}
        </span>
        {hot && (
          <span className="absolute top-2 right-2 rounded bg-red-500 px-2 py-0.5 text-[11px] font-black tracking-wide text-white">
            HOT
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{find.title}</h3>
        <p className="text-xs text-zinc-500">
          found via typo <span className="text-amber-400/90 font-mono">"{find.typo}"</span>
          <span className="text-zinc-600"> → {find.term}</span>
        </p>

        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              {find.listingType === 'auction' ? 'Current bid' : 'Buy It Now'}
            </p>
            <p className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {money(find.price)}
            </p>
          </div>
          <div className="text-right text-xs text-zinc-500">
            {find.listingType === 'auction' && (
              <>
                {find.bids !== undefined && <p>{find.bids} bid{find.bids === 1 ? '' : 's'}</p>}
                {find.timeLeft && <p className="text-amber-300/90 font-semibold">{find.timeLeft} left</p>}
              </>
            )}
            {discount !== null && discount > 0 && (
              <p className="text-emerald-400 font-semibold">{discount}% below market</p>
            )}
          </div>
        </div>
        {find.marketPrice ? (
          <p className="text-[11px] text-zinc-600">
            Tracked market: <span className="text-zinc-400 font-semibold">{money(find.marketPrice)}</span>
          </p>
        ) : null}

        {/* stopPropagation: the card is a link — calculator clicks must not navigate */}
        <div onClick={(e) => e.preventDefault()}>
          <FlipCalculator buyPrice={find.price} sellPrice={find.marketPrice ?? undefined} />
        </div>

        <span className="mt-auto pt-2 inline-block rounded-lg bg-amber-400 px-4 py-2 text-center text-sm font-bold text-black hover:bg-amber-300 transition-colors">
          View live listing ↗
        </span>
      </div>
    </a>
  );
}

export default function TypoFinds() {
  const [data, setData] = useState<FindsFile | null>(null);
  const [endingSoon, setEndingSoon] = useState(false);

  useEffect(() => {
    fetch('/typo-finds.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setData(j))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  let finds = data.finds;
  if (endingSoon) {
    finds = finds
      .filter((f) => {
        const e = endsIn(f);
        return e !== null && e <= 60;
      })
      .sort((a, b) => (endsIn(a) ?? Infinity) - (endsIn(b) ?? Infinity));
  }
  const soonCount = data.finds.filter((f) => {
    const e = endsIn(f);
    return e !== null && e <= 60;
  }).length;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            🔥 Fresh typo finds <span className="text-amber-400">— already hunted for you</span>
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Real misspelled listings our hunter pulled from eBay. Too lazy to search? Just click
            one. <span className="text-zinc-400">Updated {timeAgo(data.updatedAt)}</span>
            <span className="text-zinc-600"> · new hunt every 8 hours</span>
          </p>
        </div>
        {soonCount > 0 && (
          <button
            onClick={() => setEndingSoon((v) => !v)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              endingSoon
                ? 'bg-red-500 text-white'
                : 'border border-red-500/50 text-red-400 hover:bg-red-500/10'
            }`}
          >
            ⚡ Ending soon ({soonCount})
          </button>
        )}
      </div>

      {finds.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#141417] p-10 text-center">
          {endingSoon ? (
            <>
              <p className="text-3xl mb-3">⏳</p>
              <p className="text-zinc-400 font-semibold">Nothing ends within the hour right now.</p>
              <p className="mt-1 text-sm text-zinc-600">
                <button onClick={() => setEndingSoon(false)} className="text-amber-400 font-semibold hover:text-amber-300">
                  Show all finds →
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-zinc-400 font-semibold">The hunter is out scanning eBay…</p>
              <p className="mt-1 text-sm text-zinc-600">
                Fresh typo listings land here after the next hunt. Meanwhile, the hunt buttons on
                every card below run the typos yourself.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {finds.map((f) => (
            <FindCard key={f.id} find={f} />
          ))}
        </div>
      )}
    </section>
  );
}
