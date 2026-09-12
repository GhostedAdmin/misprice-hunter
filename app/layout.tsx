import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Misprice Hunter — typo'd card auctions worth a look",
  description:
    "Misspelled eBay auctions get fewer eyeballs and lower bids. Misprice Hunter scans common typos for Pokémon and sports cards so you can spot them before they end.",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center min-h-[44px] px-3 text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-800 bg-[#0b0b0d] sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 py-2 sm:py-0 sm:h-16 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-400 text-black text-lg font-black">
                ⌖
              </span>
              <span className="font-extrabold tracking-tight text-base sm:text-lg">
                MISPRICE<span className="text-amber-400">HUNTER</span>
              </span>
            </Link>
            <nav className="flex items-center gap-0.5 sm:gap-6">
              <NavLink href="/">Deals</NavLink>
              <NavLink href="/how-it-works">How it works</NavLink>
              <NavLink href="/word-list">Word list</NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-800 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-500 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p>
              Misprice Hunter is an independent tool. Not affiliated with or endorsed by eBay Inc.
            </p>
            <p className="text-zinc-600">
              Auctions are "worth a look" — always verify the listing before bidding.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
