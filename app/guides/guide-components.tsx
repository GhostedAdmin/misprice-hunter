import Link from 'next/link';
import type { ReactNode } from 'react';

export const GUIDE_META = [
  {
    slug: 'ebay-typo-hunting-guide',
    title: 'How to Find Underpriced Pokémon Cards on eBay (Typo Hunting Guide)',
    excerpt:
      'Misspelled listings get fewer bids. Here is the full typo-hunting playbook — the classic misspellings, how to beat eBay autocorrect, and how to verify a real deal before you bid.',
  },
  {
    slug: 'pokemon-sealed-worth-buying-2026',
    title: 'Pokémon TCG Sealed Products Actually Worth Buying at Retail in 2026',
    excerpt:
      'Retail discipline is everything in 2026. Which sealed products hold value at MSRP, which ones to never chase on the secondary market, and the traps burning buyers right now.',
  },
  {
    slug: 'sports-card-overpriced-check',
    title: 'How to Tell If a Sports Card Is Overpriced Before You Buy',
    excerpt:
      'eBay sold listings, pop reports, and print runs — the three checks that take 90 seconds and save you from overpaying on every sports card purchase.',
  },
  {
    slug: 'flipping-trading-cards-beginners',
    title: "The Beginner's Guide to Flipping Trading Cards for Profit",
    excerpt:
      'Sourcing, grading, the real fee math, and honest expectations. Everything a beginner needs to flip their first cards without lighting money on fire.',
  },
];

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-white pt-6">{children}</h2>;
}

export function Aff({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300"
    >
      {children}
    </a>
  );
}

export function Fine() {
  return (
    <p className="text-xs text-zinc-500 italic">
      As an Amazon Associate we earn from qualifying purchases.
    </p>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-5">
      <p className="font-bold text-amber-200">{title}</p>
      <div className="mt-2 text-sm text-amber-100/80 space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}

export function GuideShell({
  kicker,
  title,
  lede,
  current,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Link
        href="/guides"
        className="text-sm font-semibold text-amber-400 hover:text-amber-300"
      >
        ← All guides
      </Link>
      <p className="mt-6 text-xs font-bold tracking-widest text-amber-400 uppercase">{kicker}</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">{title}</h1>
      <p className="mt-4 text-zinc-400 text-lg">{lede}</p>
      <p className="mt-3 text-xs text-zinc-600">Basemint Vault — October 2026</p>
      <div className="mt-8 space-y-5 text-zinc-300 leading-relaxed text-[17px]">{children}</div>

      <div className="mt-12 rounded-xl border border-zinc-800 bg-[#141417] p-6">
        <h2 className="text-lg font-bold">
          Keep reading — <span className="text-amber-400">more guides</span>
        </h2>
        <ul className="mt-3 space-y-2">
          {GUIDE_META.filter((g) => g.slug !== current).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="text-sm font-semibold text-zinc-300 hover:text-amber-300"
              >
                → {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
