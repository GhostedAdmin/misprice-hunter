'use client';

import HuntButtons from '@/components/HuntButtons';
import type { Deal } from '@/lib/deals';

function money(v: number | null): string {
  if (v === null) return '—';
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-[#141417] overflow-hidden flex flex-col hover:border-amber-400/60 transition-colors">
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
              deal.category === 'pokemon' ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'
            }`}
          >
            {deal.category === 'pokemon' ? 'POKÉMON' : 'SPORTS'}
          </span>
          {deal.setName && (
            <span className="text-xs text-zinc-500 truncate">{deal.setName}</span>
          )}
        </div>
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{deal.title}</h3>
        <p className="text-xs text-zinc-500">
          hunt the typo <span className="text-amber-400/90 font-mono">"{deal.misspelling}"</span>
          <span className="text-zinc-600"> → {deal.term}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Raw market</p>
            <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.rawPrice)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Graded market</p>
            <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.gradedPrice)}</p>
          </div>
        </div>

        <div className="pt-1">
          <HuntButtons query={deal.misspelling} />
        </div>

        <div className="mt-auto pt-2">
          <a
            href={deal.priceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
          >
            Full price history ↗
          </a>
        </div>
      </div>
    </article>
  );
}
