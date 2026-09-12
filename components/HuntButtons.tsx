'use client';

import { HUNT_AVENUES } from '@/lib/hunt';

/**
 * Compact row of marketplace deep-links for one typo query, plus an
 * "Open all" button that fires every avenue in new tabs (user gesture, so
 * popup blockers allow it). Zero API calls — pure search URLs.
 */
export default function HuntButtons({ query }: { query: string }) {
  const openAll = () => {
    for (const a of HUNT_AVENUES) {
      window.open(a.buildUrl(query), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        Hunt:
      </span>
      {HUNT_AVENUES.map((a) => (
        <a
          key={a.id}
          href={a.buildUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Search "${query}" on ${a.label.replace(/[^a-zA-Z]/g, '') || a.id}`}
          className="rounded-md border border-zinc-700 px-2 py-1 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-amber-400/70 hover:text-amber-300"
        >
          {a.label}
        </a>
      ))}
      <button
        onClick={openAll}
        title={`Open all ${HUNT_AVENUES.length} marketplaces for "${query}"`}
        className="rounded-md border border-amber-400/50 bg-amber-400/10 px-2 py-1 text-[11px] font-bold text-amber-300 transition-colors hover:bg-amber-400/20"
      >
        Open all ⧉
      </button>
    </div>
  );
}
