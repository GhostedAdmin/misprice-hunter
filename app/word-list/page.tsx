'use client';

import { useMemo, useState } from 'react';
import HuntButtons from '@/components/HuntButtons';
import { MISSPELLINGS, type Category, type MisspellingEntry } from '@/lib/misspellings';

type Filter = 'all' | Category;

function EntryHunt({ entry }: { entry: MisspellingEntry }) {
  const [selected, setSelected] = useState(entry.misspellings[0]);
  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-black/30 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Hunt typo:</span>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-[#0b0b0d] px-2.5 py-1.5 font-mono text-sm text-amber-300"
        >
          {entry.misspellings.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <HuntButtons query={selected} />
    </div>
  );
}

export default function WordList() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const entries = useMemo(() => {
    return MISSPELLINGS.filter((e) => {
      if (filter !== 'all' && e.category !== filter) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        e.term.toLowerCase().includes(needle) ||
        e.misspellings.some((m) => m.toLowerCase().includes(needle))
      );
    });
  }, [filter, q]);

  const total = MISSPELLINGS.reduce((n, e) => n + e.misspellings.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">The dictionary</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">Word list</h1>
      <p className="mt-4 text-zinc-400 text-lg">
        Every typo the scanner checks — {MISSPELLINGS.length} search terms, {total} misspellings.
        Pick a typo on any entry to hunt it across every marketplace — no API key needed.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
          {(['all', 'pokemon', 'sports'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                filter === f ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms or typos…"
          className="flex-1 min-w-[200px] rounded-lg border border-zinc-800 bg-[#141417] px-4 py-2 text-sm"
        />
      </div>

      <div className="mt-6 space-y-3">
        {entries.map((e) => (
          <div key={e.term} className="rounded-xl border border-zinc-800 bg-[#141417] p-5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-bold text-lg">{e.term}</h2>
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-bold tracking-wide ${
                  e.category === 'pokemon' ? 'bg-emerald-500 text-black' : 'bg-sky-500 text-black'
                }`}
              >
                {e.category === 'pokemon' ? 'POKÉMON' : 'SPORTS'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {e.misspellings.map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-sm text-red-300"
                >
                  {m}
                </span>
              ))}
            </div>
            <EntryHunt entry={e} />
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-zinc-500 text-center py-10">No terms match that search.</p>
        )}
      </div>
    </div>
  );
}
