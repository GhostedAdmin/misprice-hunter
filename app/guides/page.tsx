import Link from 'next/link';
import type { Metadata } from 'next';
import { GUIDE_META } from './guide-components';

export const metadata: Metadata = {
  title: 'Card Collecting Guides | Misprice Hunter',
  description:
    'Free guides for card collectors: typo hunting on eBay, buying Pokémon sealed at retail, spotting overpriced sports cards, and flipping cards for profit.',
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">Learn the game</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
        Card collecting <span className="text-amber-400">guides</span>
      </h1>
      <p className="mt-4 text-zinc-400 text-lg">
        No fluff, no guru talk — just the deal-hunting tactics that actually work, written by
        collectors who run the numbers.
      </p>

      <div className="mt-10 space-y-4">
        {GUIDE_META.map((g, i) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block rounded-xl border border-zinc-800 bg-[#141417] p-6 hover:border-amber-400/60 transition-colors"
          >
            <div className="flex gap-5">
              <span className="font-mono text-2xl font-black text-amber-400/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">{g.title}</h2>
                <p className="mt-1.5 text-zinc-400">{g.excerpt}</p>
                <p className="mt-3 text-sm font-semibold text-amber-400">Read the guide →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-amber-400 px-8 py-3 font-bold text-black hover:bg-amber-300 transition-colors"
        >
          Hunt the typos →
        </Link>
      </div>
    </div>
  );
}
