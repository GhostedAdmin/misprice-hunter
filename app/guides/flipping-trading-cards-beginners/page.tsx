import Link from 'next/link';
import type { Metadata } from 'next';
import { GuideShell, H2, Aff, Fine, Callout } from '../guide-components';

export const metadata: Metadata = {
  title: "The Beginner's Guide to Flipping Trading Cards for Profit | Misprice Hunter",
  description:
    'How to flip trading cards for profit: where to source deals, when grading makes sense, the real eBay fee math, and honest expectations for beginners.',
};

export default function FlippingTradingCardsBeginners() {
  return (
    <GuideShell
      kicker="From collector to flipper"
      title="The Beginner's Guide to Flipping Trading Cards for Profit"
      lede="Flipping cards is a real side hustle — not a lottery ticket. Here's the honest beginner's playbook: sourcing, grading, fee math, and what to actually expect."
      current="flipping-trading-cards-beginners"
    >
      <p>
        Let's set expectations first: flipping trading cards won't make you rich, but it can
        reliably make you money. The flippers who last treat it like a business with thin margins
        and strict discipline — buy below market, protect the asset, sell efficiently, repeat. The
        ones who flame out treat it like gambling. This guide is for the first group.
      </p>

      <H2>Step 1: source below market (the whole game)</H2>
      <p>
        Profit is made at the buy, not the sell. If you pay full market price, fees will eat you
        alive (more on the math below). Your edge has to come from sourcing. The beginner-friendly
        sources, ranked:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li>
          <strong className="text-white">Typo hunting on eBay.</strong> Misspelled listings get
          fewer bids and close below market. It's the highest-ROI sourcing method for beginners
          because it costs nothing but time. Our{' '}
          <Link href="/guides/ebay-typo-hunting-guide" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
            typo hunting guide
          </Link>{' '}
          is the full playbook, and the{' '}
          <Link href="/" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
            Misprice Hunter homepage
          </Link>{' '}
          publishes fresh misspelled finds every 8 hours.
        </li>
        <li>
          <strong className="text-white">Retail arbitrage.</strong> Buy sealed at MSRP, sell the
          singles or the sealed product when demand spikes. This only works with strict retail
          discipline — see our{' '}
          <Link href="/guides/pokemon-sealed-worth-buying-2026" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
            sealed buying guide
          </Link>{' '}
          for what's actually worth buying in 2026.
        </li>
        <li>
          <strong className="text-white">Facebook Marketplace & local groups.</strong> Sellers
          clearing collections price to move fast. Be polite, pay cash, meet safe — and always
          verify the big cards in person before money changes hands.
        </li>
        <li>
          <strong className="text-white">Card shows.</strong> Dealers discount on Sunday afternoon
          rather than pack inventory home. Walk the floor twice: once to scout, once to buy.
        </li>
      </ul>

      <H2>Step 2: learn the fee math (do this before your first listing)</H2>
      <p>
        This is where beginners lose money without realizing it. A card that "sells for $100" does
        not put $100 in your pocket. The real math on eBay:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li><strong className="text-white">eBay final value fee:</strong> ~13% on most trading card sales (varies slightly by category and store level).</li>
        <li><strong className="text-white">Payment processing:</strong> included in that ~13% for most sellers now.</li>
        <li><strong className="text-white">Shipping:</strong> $4–6 for a bubble mailer with tracking via eBay labels. <em>Never</em> ship a card without tracking.</li>
        <li><strong className="text-white">Supplies:</strong> toploader, sleeve, team bag, mailer — roughly $1–2 per card.</li>
      </ul>
      <p>
        The quick mental formula: <strong className="text-white">estimated net = (sale price ×
        0.87) − $6 shipping.</strong> So a $100 sale nets you about $81. That means your buy price
        needs to be comfortably under $81 for the flip to make sense — we target at least a 25–30%
        margin under net to make the time worthwhile.
      </p>
      <p>
        Worked example: you win a misspelled auction at $55 for a card that sells at $100. Net =
        ($100 × 0.87) − $6 = $81. Profit = $81 − $55 = $26. That's a 47% return on your $55 — a
        great flip. But if you'd paid $75, your profit is $6 for all that work. The buy price is
        everything.
      </p>

      <Callout title="💰 The margin rule">
        <p>
          Never flip a card unless your buy price is at least 25–30% under your estimated net (sale
          × 0.87 − $6). Tighter margins get wiped out by one return, one lost package, or one
          pricing mistake. Discipline here is what separates flippers who last from flippers who
          quit.
        </p>
      </Callout>

      <H2>Step 3: know when grading makes sense</H2>
      <p>
        Grading can multiply a card's value — or torch your margin. The beginner rules:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li>
          <strong className="text-white">Grade cards worth $25+ raw with real 10 potential.</strong>{' '}
          Below that, grading fees ($15–25+ per card plus months of waiting) eat the upside.
        </li>
        <li>
          <strong className="text-white">Be brutally honest about condition.</strong> Centering,
          corners, edges, surface — if you can see the flaw, so can the grader. Only submit cards
          you'd bet on.
        </li>
        <li>
          <strong className="text-white">PSA for resale, CGC/BGS for PC.</strong> PSA 10s command
          the highest resale premiums in most categories. Grade with the buyer in mind.
        </li>
        <li>
          <strong className="text-white">Don't grade to "find out."</strong> Every submission
          should have a thesis: "this is a $40 raw card that becomes a $150 PSA 10." If you can't
          state the thesis, don't submit.
        </li>
      </ul>

      <H2>Step 4: ship like a professional</H2>
      <p>
        Nothing kills a flipping business faster than damaged arrivals and bad feedback. The
        standard that keeps you at 100% positive:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li>Penny sleeve → toploader (taped at the top so the card can't slide out) → team bag.</li>
        <li>Sandwich between cardboard or use a cardboard mailer for anything over $50.</li>
        <li>Bubble mailer, tracking number on every single package. No exceptions.</li>
        <li>Ship within 1 business day. Fast shipping is free feedback.</li>
      </ul>
      <p>
        The supply kit that covers your first hundred flips:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li>
          <Aff href="https://www.amazon.com/dp/B0F1F8674Y?tag=basementvault-20">
            Toploaders + soft sleeves combo
          </Aff>{' '}
          — you'll go through these faster than you think.
        </li>
        <li>
          <Aff href="https://www.amazon.com/dp/B0C33YJ8RR?tag=basementvault-20">
            6x10 bubble mailers (100-pack)
          </Aff>{' '}
          — the standard size for shipping protected cards.
        </li>
        <li>
          <Aff href="https://www.amazon.com/dp/B01HNSRYAK?tag=basementvault-20">
            Digital kitchen scale
          </Aff>{' '}
          — weigh every package so you buy the right postage instead of guessing.
        </li>
      </ul>
      <Fine />

      <H2>Honest expectations: the numbers</H2>
      <p>
        A disciplined beginner flipping part-time can realistically clear a few hundred dollars a
        month within a few months — buying 5–10 cards a week at real discounts and turning them
        steadily. The math: 20 flips a month at $20 average profit is $400. That's real money, and
        it compounds as your eye for deals sharpens and your bankroll grows.
      </p>
      <p>
        What it isn't: passive income. Sourcing takes time, listing takes time, shipping takes
        time. Anyone telling you card flipping is "easy money" is selling you something. The edge
        is real — mispriced cards exist every single day — but you earn it with work and
        discipline.
      </p>
      <p>
        Start here: read the{' '}
        <Link href="/guides/ebay-typo-hunting-guide" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          typo hunting guide
        </Link>{' '}
        for your sourcing edge, learn to{' '}
        <Link href="/guides/sports-card-overpriced-check" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          spot overpriced cards in 90 seconds
        </Link>
        , and keep your sealed buying disciplined with the{' '}
        <Link href="/guides/pokemon-sealed-worth-buying-2026" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          2026 sealed guide
        </Link>
        . Then go win your first auction.
      </p>
    </GuideShell>
  );
}
