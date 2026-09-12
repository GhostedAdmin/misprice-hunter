'use client';

import { useEffect, useState } from 'react';
import HuntButtons from '@/components/HuntButtons';
import type { Deal } from '@/lib/deals';

function formatCountdown(endTime: string): { text: string; urgent: boolean; ended: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { text: 'Ended', urgent: false, ended: true };
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return { text: `${d}d ${h % 24}h`, urgent: false, ended: false };
  if (h > 0) return { text: `${h}h ${m % 60}m`, urgent: h < 2, ended: false };
  return { text: `${m}m`, urgent: true, ended: false };
}

export default function DealCard({ deal }: { deal: Deal }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);
  void tick;

  const cd = formatCountdown(deal.endTime);

  return (
    <article className="rounded-xl border border-zinc-800 bg-[#141417] overflow-hidden flex flex-col hover:border-amber-400/60 transition-colors">
      <div className="relative aspect-[4/3] bg-zinc-900">
        {deal.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-700 text-4xl">🂠</div>
        )}
        <span
          className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
            deal.category === 'pokemon' ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'
          }`}
        >
          {deal.category === 'pokemon' ? 'POKÉMON' : 'SPORTS'}
        </span>
        <span
          className={`absolute top-2 right-2 rounded px-2 py-1 text-xs font-bold tabular-nums ${
            cd.ended ? 'bg-zinc-700 text-zinc-300' : cd.urgent ? 'bg-red-500 text-white' : 'bg-black/80 text-amber-300'
          }`}
        >
          {cd.ended ? 'ENDED' : `⏳ ${cd.text}`}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{deal.title}</h3>
        <p className="text-xs text-zinc-500">
          surfaced by typo <span className="text-amber-400/90 font-mono">"{deal.misspelling}"</span>
          <span className="text-zinc-600"> → {deal.term}</span>
        </p>
        <div className="pt-1">
          <HuntButtons query={deal.misspelling} />
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Current bid</p>
            <p className="text-2xl font-extrabold text-amber-400 tabular-nums">
              ${deal.price.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500 tabular-nums">{deal.bidCount} bids</p>
          </div>
          <a
            href={deal.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black hover:bg-amber-300 transition-colors"
          >
            View on eBay
          </a>
        </div>
      </div>
    </article>
  );
}
