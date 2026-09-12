'use client';

import { useEffect, useRef, useState } from 'react';
import CardDetailModal, { segmentEmoji, type SearchPick } from './CardDetailModal';
import type { PokemonHit, SportsHit } from '@/app/api/card-search/route';

// One search box for everything: typing still filters the tracked grid
// instantly (local), and after a beat it also searches every card in
// existence — Pokémon via TCGdex, sports via CardSight AI's catalog.

interface SearchState {
  pokemon: PokemonHit[];
  sports: SportsHit[];
}

export default function CardSearch({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchState>({ pokemon: [], sports: [] });
  const [pick, setPick] = useState<SearchPick | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const q = query.trim();

  useEffect(() => {
    if (q.length < 3) {
      setResults({ pokemon: [], sports: [] });
      setLoading(false);
      setOpen(false);
      return;
    }
    setOpen(true);
    setLoading(true);
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/card-search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error('search failed');
        const json = await res.json();
        setResults({
          pokemon: Array.isArray(json.pokemon) ? json.pokemon : [],
          sports: Array.isArray(json.sports) ? json.sports : [],
        });
      } catch {
        // aborted keystroke or a hiccup — keep whatever we had
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const choose = (p: SearchPick) => {
    setOpen(false);
    setPick(p);
  };

  const hasAny = results.pokemon.length > 0 || results.sports.length > 0;

  return (
    <div className="relative z-50 mb-4">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-600">
        ⌕
      </span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (q.length >= 3) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Search any card — try “Charizard”, “Mahomes”, “Mickey Mantle”…"
        aria-label="Search any card"
        autoComplete="off"
        className="w-full rounded-xl border border-zinc-800 bg-[#141417] py-3 pl-11 pr-11 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/60 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:text-white"
        >
          ✕
        </button>
      )}

      {open && (
        <>
          {/* click-catcher below the dropdown */}
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-700 bg-[#141417] shadow-2xl shadow-black/60 max-h-[65vh] overflow-y-auto">
            {loading && !hasAny ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-11 w-9 rounded bg-zinc-800 animate-pulse shrink-0" />
                    <div className="h-4 flex-1 rounded bg-zinc-800 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !hasAny && !loading ? (
              <p className="p-5 text-sm text-zinc-500 text-center">
                No cards found for <span className="text-amber-300 font-semibold">“{q}”</span> — check the spelling or try a player name.
              </p>
            ) : (
              <div className="py-2">
                {results.pokemon.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-[11px] font-bold tracking-widest text-emerald-400/80 uppercase">
                      Pokémon
                    </p>
                    {results.pokemon.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => choose({ kind: 'pokemon', id: p.id, title: p.title, imageUrl: p.imageUrl })}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/60 transition-colors"
                      >
                        <span className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-900 text-xl">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
                          ) : (
                            '🂠'
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-zinc-100">{p.title}</span>
                          <span className="block text-xs text-zinc-500">Pokémon TCG · tap for live price</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {results.sports.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-[11px] font-bold tracking-widest text-sky-400/80 uppercase">
                      Sports cards
                    </p>
                    {results.sports.map((s) => (
                      <button
                        key={s.cardId}
                        onClick={() => choose({ kind: 'sports', cardId: s.cardId, title: s.title, subtitle: s.subtitle, segment: s.segment })}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/60 transition-colors"
                      >
                        <span className="flex h-12 w-9 shrink-0 items-center justify-center rounded bg-zinc-900 text-2xl">
                          {segmentEmoji(s.segment)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-zinc-100">{s.title}</span>
                          <span className="block truncate text-xs text-zinc-500">
                            {[s.subtitle, s.segment].filter(Boolean).join(' · ') || 'tap for live price'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {loading && (
                  <p className="px-4 py-2 text-xs text-zinc-600">Searching…</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {pick && <CardDetailModal pick={pick} onClose={() => setPick(null)} />}
    </div>
  );
}
