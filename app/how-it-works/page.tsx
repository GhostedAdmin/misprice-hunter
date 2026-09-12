import Link from 'next/link';

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
