import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Typo Arbitrage Works — Find Mispriced Cards on eBay',
  description:
    'Sellers typo card titles, nobody searches the typo, and those auctions close low. The 4-step typo-arbitrage playbook: price the real card, hunt the misspelling, verify, bid.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How Typo Arbitrage Works — Find Mispriced Cards on eBay',
    description:
      'Sellers typo card titles, nobody searches the typo, and those auctions close low. The 4-step typo-arbitrage playbook.',
  },
};

const STEPS = [
  {
    n: '01',
    title: 'Sellers typo their titles',
    body: 'It happens constantly — "Charzard", "Micheal Jordan", "Leborn James". A rushed listing with a misspelled name still goes live on eBay like any other auction.',
  },
  {
    n: '02',
    title: 'Nobody searches the typo',
    body: 'Everybody searches "Charizard". Almost nobody searches "Charzard". Those auctions get a fraction of the eyeballs — and a fraction of the bids.',
  },
  {
    n: '03',
    title: 'We price the real card for you',
    body: 'Misprice Hunter tracks live market prices on both sides of the hobby: TCGplayer market prices for every tracked Pokémon card through TCGdex — free, no API key, refreshed hourly — and live completed-auction medians for sports cards through CardSight AI. You always know what the correctly-spelled card is actually worth.',
  },
  {
    n: '04',
    title: 'You hunt the typo and compare',
    body: 'Hit the hunt buttons to run the misspelling as a search across every marketplace. When you find one, compare the asking price against the market prices above — the gap is your opportunity. Check the seller feedback, zoom the photos, read the description — then bid like you mean it.',
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Do misspelled card auctions really sell for less?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Often, yes — because eBay search matches listing titles, so a listing titled “Charzard” never appears when everyone searches “Charizard.” Fewer eyeballs usually means fewer bids. It is not guaranteed: condition, timing, and seller reputation still move the final price.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does Misprice Hunter buy or bid on listings?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. It shows market prices to compare against and gives you one-tap searches for each misspelling across eBay, TCGplayer, Mercari, Facebook Marketplace, and Whatnot. You check the listing and place your own bid.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need an API key or account?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. The hunt buttons are plain marketplace searches — no API key, no account, no install.',
                },
              },
            ],
          }),
        }}
      />
      <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">The playbook</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">How typo arbitrage works</h1>
      <p className="mt-4 text-zinc-400 text-lg">
        This is one of the oldest flips in the card game. Here's the whole strategy in four steps.
      </p>

      <div className="mt-10 space-y-4">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-xl border border-zinc-800 bg-[#141417] p-6 flex gap-5">
            <span className="font-mono text-2xl font-black text-amber-400/80">{s.n}</span>
            <div>
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-1.5 text-zinc-400">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-amber-400/40 bg-amber-400/10 p-6">
        <h2 className="font-bold text-amber-200">The honest fine print</h2>
        <ul className="mt-2 text-sm text-amber-100/80 space-y-1.5 list-disc list-inside">
          <li>Low asking prices can mean a hidden gem — or a card with issues the photos reveal.</li>
          <li>Some "typos" are intentional keyword spam. Read every listing.</li>
          <li>We show market prices worth comparing against. We never claim a deal is verified.</li>
          <li>Set a max bid before the adrenaline hits. Future you says thanks.</li>
        </ul>
      </div>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-[#141417] p-6">
        <h2 className="font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-5 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-white">Do misspelled card auctions really sell for less?</h3>
            <p className="mt-1 text-zinc-400">Often, yes — because eBay search matches listing titles, so a listing titled “Charzard” never appears when everyone searches “Charizard.” Fewer eyeballs usually means fewer bids. It is not guaranteed: condition, timing, and seller reputation still move the final price.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Does Misprice Hunter buy or bid on listings?</h3>
            <p className="mt-1 text-zinc-400">No. It shows market prices to compare against and gives you one-tap searches for each misspelling across eBay, TCGplayer, Mercari, Facebook Marketplace, and Whatnot. You check the listing and place your own bid.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Do I need an API key or account?</h3>
            <p className="mt-1 text-zinc-400">No. The hunt buttons are plain marketplace searches — no API key, no account, no install.</p>
          </div>
        </div>
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
