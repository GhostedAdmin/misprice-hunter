'use client';

import HuntButtons from '@/components/HuntButtons';
import FlipCalculator from '@/components/FlipCalculator';
import type { Deal } from '@/lib/deals';

function money(v: number | null): string {
  if (v === null) return '—';
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

export default function DealCard({ deal }: { deal: Deal }) {
  const isPokemon = deal.category === 'pokemon';
  const sourceLabel = deal.live ? `${deal.source} · live` : 'sample';
  const range =
    deal.lowPrice != null && deal.highPrice != null
      ? `${money(deal.lowPrice)}–${money(deal.highPrice)}`
      : null;
  return (
    <article className="rounded-xl border border-zinc-800 bg-[#141417] overflow-hidden flex flex-col hover:border-amber-400/60 transition-colors">
      <div className="relative aspect-[4/3] bg-zinc-900">
        {deal.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-contain p-2" loading="lazy" />
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
          className={`absolute top-2 right-2 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
            deal.live ? 'bg-amber-400 text-black' : 'bg-zinc-700 text-zinc-300'
          }`}
        >
          {deal.live ? 'LIVE' : 'SAMPLE'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">{deal.title}</h3>
          {deal.setName && <p className="text-xs text-zinc-500">{deal.setName}</p>}
        </div>
        <p className="text-xs text-zinc-500">
          hunt the typo <span className="text-amber-400/90 font-mono">"{deal.misspelling}"</span>
          <span className="text-zinc-600"> → {deal.term}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              {isPokemon ? 'Market price' : 'Raw market'}
            </p>
            {deal.rawPrice !== null ? (
              <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.rawPrice)}</p>
            ) : (
              <p className="text-sm font-semibold text-zinc-500 pt-1.5">No recent sales</p>
            )}
            <p className="text-[10px] text-zinc-600">{sourceLabel}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
            {isPokemon ? (
              <>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Price range</p>
                <p className="text-base sm:text-lg font-extrabold text-amber-400 tabular-nums pt-0.5">
                  {range ?? '—'}
                </p>
                <p className="text-[10px] text-zinc-600">{sourceLabel}</p>
              </>
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Graded market</p>
                <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.gradedPrice)}</p>
                <p className="text-[10px] text-zinc-600">
                  {deal.gradedPrice !== null ? sourceLabel : 'n/a'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="pt-1">
          <HuntButtons query={deal.misspelling} />
        </div>

        <div className="pt-1">
          <FlipCalculator sellPrice={deal.rawPrice ?? deal.gradedPrice ?? undefined} />
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
