'use client';

import { useMemo, useState } from 'react';
import HuntButtons from '@/components/HuntButtons';

// Typo generator: type any card or player name, get the misspellings a
// seller would plausibly make, each wired straight into the hunt buttons.
// Pure string surgery — no API, no dictionary needed.

function wordVariants(word: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (v: string) => {
    const k = v.toLowerCase();
    if (k !== word.toLowerCase() && !seen.has(k) && v.length >= 3) {
      seen.add(k);
      out.push(v);
    }
  };
  // Dropped interior letters (most common real typo)
  for (let i = 1; i < word.length - 1; i++) push(word.slice(0, i) + word.slice(i + 1));
  // Swapped adjacent letters
  for (let i = 0; i < word.length - 1; i++)
    push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  // Doubled letters
  for (let i = 1; i < word.length; i++) push(word.slice(0, i) + word[i] + word.slice(i));
  // Missing doubled letter ("Pikatchu" -> "Pikachu" style is covered by drops;
  // this catches e.g. "Charizardd" -> handled by doubles above)
  return out;
}

function generateTypos(name: string): string[] {
  const words = name.trim().split(/\s+/).filter((w) => w.length >= 4);
  if (words.length === 0) return [];
  const picks: string[] = [];
  for (let wi = 0; wi < words.length && picks.length < 8; wi++) {
    const variants = wordVariants(words[wi]);
    // Take a spread: first drop, first swap, first double for this word
    const take = variants.slice(0, 3);
    for (const v of take) {
      if (picks.length >= 8) break;
      const candidate = words.map((w, i) => (i === wi ? v : w)).join(' ');
      if (!picks.includes(candidate)) picks.push(candidate);
    }
  }
  return picks;
}

export default function TypoGenerator() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState('');
  const typos = useMemo(() => generateTypos(submitted), [submitted]);

  const go = () => {
    if (name.trim().length >= 3) setSubmitted(name.trim());
  };

  return (
    <section className="mt-10 rounded-xl border border-zinc-800 bg-[#141417] p-6">
      <h2 className="text-lg font-bold">
        ✏️ Typo generator — <span className="text-amber-400">hunt any card</span>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Not one of the 24 tracked cards? Type any player or card name and we’ll mangle it the way
        sellers do — then hunt each misspelling across every marketplace with one tap.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder="e.g. Anthony Edwards"
          className="flex-1 rounded-lg border border-zinc-700 bg-[#0b0b0d] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/60 focus:outline-none"
        />
        <button
          onClick={go}
          className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-300 transition-colors"
        >
          Mangle it
        </button>
      </div>

      {submitted && (
        <div className="mt-5">
          {typos.length === 0 ? (
            <p className="text-sm text-zinc-500">
              That name’s too short to mangle — try a full player or card name.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {typos.map((t) => (
                <li
                  key={t}
                  className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3"
                >
                  <p className="mb-2 font-mono text-sm text-amber-300">"{t}"</p>
                  <HuntButtons query={t} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-zinc-600">
            Tip: start with eBay ⏳ (ending soonest) — that’s where typo auctions get stolen.
          </p>
        </div>
      )}
    </section>
  );
}
