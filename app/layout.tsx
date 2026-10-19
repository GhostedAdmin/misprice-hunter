import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://misprice-hunter.vercel.app'),
  title: {
    default: 'Misprice Hunter — Find Mispriced & Misspelled Card Deals on eBay',
    template: '%s | Misprice Hunter',
  },
  description:
    'Find mispriced Pokémon and sports cards hiding behind misspelled eBay titles. Compare market prices, then hunt the typo across eBay, TCGplayer, Mercari, Facebook Marketplace and Whatnot — no API key needed.',
  keywords: [
    'mispriced cards',
    'misspelled eBay auctions',
    'typo hunting cards',
    'eBay card deals',
    'Pokémon typo finds',
    'sports card deals',
    'Charzard',
    'mispriced Pokémon cards',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://misprice-hunter.vercel.app/',
    siteName: 'Misprice Hunter',
    title: 'Misprice Hunter — Find Mispriced & Misspelled Card Deals on eBay',
    description:
      'Misspelled listings get fewer eyeballs — and lower final bids. Compare market prices, then hunt the typo across every marketplace.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Misprice Hunter — Sellers can't spell. You profit.",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Misprice Hunter — Find Mispriced & Misspelled Card Deals on eBay',
    description:
      'Misspelled listings get fewer eyeballs — and lower final bids. Compare market prices, then hunt the typo across every marketplace.',
    images: ['/og-image.png'],
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Misprice Hunter',
            url: 'https://misprice-hunter.vercel.app/',
            description:
              'Find mispriced Pokémon and sports cards hiding behind misspelled eBay titles. Compare market prices, then hunt the typo across eBay, TCGplayer, Mercari, Facebook Marketplace and Whatnot.',
            inLanguage: 'en-US',
          }),
        }}
      />
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
              <NavLink href="/guides">Guides</NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-800 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-500 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p>
              Misprice Hunter is an independent tool. Not affiliated with or endorsed by eBay Inc.
              As an Amazon Associate we earn from qualifying purchases.
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
