'use client';

import { useEffect, useState } from 'react';
import HuntButtons from './HuntButtons';
import EbayListings from './EbayListings';
import type { Deal } from '@/lib/deals';

export type SearchPick =
  | { kind: 'pokemon'; id: string; title: string; imageUrl: string | null }
  | { kind: 'sports'; cardId: string; title: string; subtitle: string; segment: string };

export function segmentEmoji(segment: string): string {
  const s = segment.toLowerCase();
  if (s.includes('baseball')) return '⚾';
  if (s.includes('basketball')) return '🏀';
  if (s.includes('football')) return '🏈';
  if (s.includes('hockey')) return '🏒';
  if (s.includes('soccer')) return '⚽';
  return '🂠';
}

function money(v: number | null): string {
  if (v === null) return '—';
  return v >= 1000
    ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : `$${v.toFixed(2)}`;
}

function detailUrl(pick: SearchPick): string {
  if (pick.kind === 'pokemon') {
    return `/api/card-detail?type=pokemon&id=${encodeURIComponent(pick.id)}`;
  }
  const params = new URLSearchParams({
    type: 'sports',
    cardId: pick.cardId,
    title: pick.title,
    subtitle: pick.subtitle,
  });
  return `/api/card-detail?${params.toString()}`;
}

export default function CardDetailModal({
  pick,
  onClose,
}: {
  pick: SearchPick;
  onClose: () => void;
}) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDeal(null);
    setError(null);
    setLoading(true);
    fetch(detailUrl(pick))
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.deal) throw new Error(json.error || 'lookup failed');
        setDeal(json.deal);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'lookup failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const isPokemon = pick.kind === 'pokemon';
  const range =
    deal && deal.lowPrice != null && deal.highPrice != null
      ? `${money(deal.lowPrice)}–${money(deal.highPrice)}`
      : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#141417] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-zinc-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-6 space-y-4">
            <div className="aspect-[4/3] rounded-xl bg-zinc-900 animate-pulse" />
            <div className="h-6 w-2/3 rounded bg-zinc-900 animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-lg bg-zinc-900 animate-pulse" />
              <div className="h-20 rounded-lg bg-zinc-900 animate-pulse" />
            </div>
          </div>
        ) : error || !deal ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🂠</p>
            <p className="font-bold">Couldn't price this card</p>
            <p className="mt-1 text-sm text-zinc-500">{error ?? 'try another search'}</p>
            <button
              onClick={onClose}
              className="mt-5 rounded-lg border border-zinc-700 px-5 py-2 text-sm font-semibold hover:border-amber-400/60 hover:text-amber-300"
            >
              Back to search
            </button>
          </div>
        ) : (
          <div>
            <div className="relative aspect-[4/3] bg-zinc-900 rounded-t-2xl overflow-hidden">
              {deal.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-contain p-3" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-7xl">
                  {pick.kind === 'sports' ? segmentEmoji(pick.segment) : '🂠'}
                </div>
              )}
              <span
                className={`absolute top-3 left-3 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
                  isPokemon ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'
                }`}
              >
                {isPokemon ? 'POKÉMON' : 'SPORTS'}
              </span>
              <span className="absolute top-3 right-14 rounded bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-black">
                LIVE
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-extrabold leading-snug pr-6">{deal.title}</h3>
              {deal.setName && <p className="text-sm text-zinc-500 mt-0.5">{deal.setName}</p>}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    {isPokemon ? 'Market price' : 'Raw market'}
                  </p>
                  {deal.rawPrice !== null ? (
                    <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.rawPrice)}</p>
                  ) : (
                    <p className="text-sm font-semibold text-zinc-500 pt-1.5">No recent sales</p>
                  )}
                  <p className="text-[10px] text-zinc-600">{deal.source} · live</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3">
                  {isPokemon ? (
                    <>
                      <p className="text-[11px] uppercase tracking-wide text-zinc-500">Price range</p>
                      <p className="text-base font-extrabold text-amber-400 tabular-nums pt-0.5">
                        {range ?? '—'}
                      </p>
                      <p className="text-[10px] text-zinc-600">{deal.source} · live</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] uppercase tracking-wide text-zinc-500">Graded market</p>
                      <p className="text-xl font-extrabold text-amber-400 tabular-nums">{money(deal.gradedPrice)}</p>
                      <p className="text-[10px] text-zinc-600">
                        {deal.gradedPrice !== null ? `${deal.source} · live` : 'n/a'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <HuntButtons query={deal.term} />
              </div>

              <EbayListings query={deal.term} />

              <a
                href={deal.priceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 transition-colors"
              >
                Full price history ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
