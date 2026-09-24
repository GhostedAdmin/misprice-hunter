import type { Metadata } from "next";
import CrownCardsBanner from "@/components/CrownCardsBanner";

export const metadata: Metadata = {
  title: "Basemint Vault — Links",
  description:
    "Everywhere Basemint Vault lives: typo'd card deals, the Vault pack game, weekly buy sheets, and the market report.",
};

type VaultLink = {
  href: string;
  icon: string;
  title: string;
  sub: string;
  badge?: string;
  featured?: boolean;
};

const LINKS: VaultLink[] = [
  {
    href: "https://misprice-hunter.vercel.app/",
    icon: "🎯",
    title: "Misprice Hunter",
    sub: "Typo'd eBay auctions, TCGplayer, Mercari & more — the deal scanner",
    badge: "Flagship",
    featured: true,
  },
  {
    href: "https://vault-share-xi.vercel.app",
    icon: "🃏",
    title: "The Vault",
    sub: "Rip play-money packs, chase grails, vault your hits",
  },
  {
    href: "https://thebasemintvault.gumroad.com/l/basemint-vault-buy-sheet-01",
    icon: "💰",
    title: "Weekly Buy Sheet",
    sub: "Buy / Hold / Skip verdicts with real flip math — $19",
    badge: "$19",
  },
  {
    href: "https://thebasemintvault.gumroad.com/l/basemint-vault-market-report",
    icon: "📊",
    title: "Monthly Market Report",
    sub: "The movers, the records, what's next — $9/mo",
    badge: "$9/mo",
  },
  {
    href: "https://thebasemintvault.gumroad.com/l/omrdad",
    icon: "🎁",
    title: "Free Buy Sheet Sample",
    sub: "3-page teaser of the weekly sheet — free",
    badge: "Free",
  },
  {
    href: "https://www.instagram.com/thebasemintvault",
    icon: "📸",
    title: "@thebasemintvault",
    sub: "Daily grail sales, record-breakers & market movers",
  },
];

export default function LinksPage() {
  return (
    <main className="dotgrid min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-md px-5 py-10 sm:py-14">
        {/* Identity */}
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-black text-4xl font-black shadow-[0_0_40px_rgba(251,191,36,0.25)]">
            ⌖
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight">
            BASEMINT<span className="text-amber-400">VAULT</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Card deals, grail sales &amp; the pack game
          </p>
        </div>

        {/* CROWNCARDS PARTNER BANNER */}
        <div className="mt-8">
          <CrownCardsBanner />
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 rounded-xl border bg-[#121214] px-4 py-4 transition-all hover:-translate-y-0.5 ${
                l.featured
                  ? "border-amber-400/70 shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                  : "border-zinc-800 hover:border-amber-400/60"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-2xl">
                {l.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-zinc-100 group-hover:text-amber-300 transition-colors">
                    {l.title}
                  </span>
                  {l.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        l.featured
                          ? "bg-amber-400 text-black"
                          : "bg-zinc-800 text-amber-300"
                      }`}
                    >
                      {l.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-zinc-500">
                  {l.sub}
                </span>
              </span>
              <span className="shrink-0 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all">
                →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-600">
          Basemint Vault · deals fund the grails
        </p>
      </div>
    </main>
  );
}
