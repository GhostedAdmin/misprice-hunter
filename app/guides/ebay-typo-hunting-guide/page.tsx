import Link from 'next/link';
import type { Metadata } from 'next';
import { GuideShell, H2, Aff, Fine, Callout } from '../guide-components';

export const metadata: Metadata = {
  title: 'How to Find Underpriced Pokémon Cards on eBay (Typo Hunting Guide) | Misprice Hunter',
  description:
    'Misspelled eBay listings get fewer bids and lower prices. Learn the typo-hunting strategy: classic misspellings, beating eBay autocorrect, and verifying real deals.',
};

export default function EbayTypoHuntingGuide() {
  return (
    <GuideShell
      kicker="The core strategy"
      title="How to Find Underpriced Pokémon Cards on eBay (Typo Hunting Guide)"
      lede="Sellers can't spell. You profit. Here is the complete playbook for finding misspelled Pokémon card listings on eBay — the oldest arbitrage in the hobby, and it still works."
      current="ebay-typo-hunting-guide"
    >
      <p>
        Every day, sellers list valuable Pokémon cards with misspelled titles: "Charzard" instead
        of Charizard, "Pikachoo" instead of Pikachu, "Mewtow" instead of Mewtwo. Those listings go
        live like any other auction — but almost nobody searches for the misspelling. Fewer
        eyeballs means fewer bids, and fewer bids means lower final prices. That gap between the
        typo price and the real market price is yours to take.
      </p>

      <H2>Why typos create discounts</H2>
      <p>
        eBay search matches listing titles. When a collector searches "Charizard," eBay shows
        listings titled "Charizard" — not "Charzard." The misspelled auction sits in a quiet corner
        of the marketplace where only a handful of bidders ever wander in. An auction that might
        get 30 bids spelled correctly can end with 3 bids spelled wrong. The card is identical;
        the audience is not.
      </p>
      <p>
        This isn't a loophole or an exploit. It's just search mechanics. The seller still gets paid,
        the buyer gets a deal, and eBay gets its fees. Everybody wins except the bidders who never
        saw the listing.
      </p>

      <H2>The classic misspellings to hunt</H2>
      <p>
        Start with the highest-value names, because that's where the dollar gaps are biggest. The
        usual suspects:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li><strong className="text-white">Charizard →</strong> Charzard, Charizrd, Charizard (extra letters), Charazard</li>
        <li><strong className="text-white">Pikachu →</strong> Pikachoo, Pikacu, Pikatchu</li>
        <li><strong className="text-white">Mewtwo →</strong> Mewtow, Mutwo, Mewtoo</li>
        <li><strong className="text-white">Blastoise →</strong> Blastois, Blastose, Blastoice</li>
        <li><strong className="text-white">Umbreon →</strong> Umbreom, Umbrion, Umbreon (swapped letters)</li>
        <li><strong className="text-white">Rayquaza →</strong> Rayquaza (dropped letters), Raquaza</li>
      </ul>
      <p>
        Don't stop at Pokémon names. Misspelled set names ("Celebrtions"), rarities ("holograhic"),
        and grader names work too. We keep a full running dictionary on our{' '}
        <Link href="/word-list" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          typo word list
        </Link>{' '}
        — it's the same list our hunter scans every 8 hours.
      </p>

      <H2>Beat eBay's autocorrect (this is the part most people miss)</H2>
      <p>
        Here's the trap: eBay auto-corrects most typo searches to the correct spelling. Type
        "Charzard" and eBay helpfully shows you "Charizard" results instead — ordinary
        correctly-spelled listings with zero typo edge. If you bid on those, you're just paying
        market price like everyone else.
      </p>
      <p>
        On every eBay results page, look for the small link that says{' '}
        <strong className="text-white">"Search instead for [your typo]"</strong>. Click it. That
        forces the literal misspelled result set. Only listings whose actual title contains the
        misspelling count. When we publish typo finds, we apply this rule ruthlessly — a find only
        counts if the typo is really in the title.
      </p>

      <Callout title="⚠️ The literal-search rule">
        <p>
          Never trust the first results page on a typo search. Always click "Search instead for
          [typo]" and verify the misspelling appears in the listing title itself. This single habit
          separates real typo hunters from people overpaying on auto-corrected results.
        </p>
      </Callout>

      <H2>Verify before you bid</H2>
      <p>
        A low price on a misspelled listing is a lead, not a deal. Run this checklist before every
        bid:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li><strong className="text-white">Zoom every photo.</strong> Typos correlate with rushed listings — rushed listings correlate with undisclosed whitening, scratches, and off-centering. Judge the card, not the title.</li>
        <li><strong className="text-white">Check the seller.</strong> Feedback under 98% or a brand-new account selling a $500 card deserves extra scrutiny.</li>
        <li><strong className="text-white">Compare against sold listings.</strong> On eBay, filter to "Sold items" for the correctly-spelled card. That's the real market price — ignore active listings, which are asking prices, not selling prices.</li>
        <li><strong className="text-white">Read the description fully.</strong> Some sellers bury "MP" (moderately played) or "for parts" in paragraph three.</li>
        <li><strong className="text-white">Watch for keyword spam.</strong> Some sellers intentionally misspell to dodge filters or stuff keywords. If the listing feels off, walk away.</li>
      </ul>

      <H2>Bidding strategy: ending soonest wins</H2>
      <p>
        Sort typo results by "ending soonest." Auctions ending in the next few hours with few bids
        are where the real steals live — there's no time for the crowd to find them. Set your max
        bid before the adrenaline hits and let eBay's proxy bidding do the work. Never get into a
        bidding war on a card you haven't fully verified; there will always be another typo
        tomorrow.
      </p>

      <H2>Let the hunter do the grunt work</H2>
      <p>
        Doing this manually across dozens of misspellings every day is exhausting. That's why we
        built <Link href="/" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">Misprice Hunter</Link>:
        our typo hunter scans the full misspelling dictionary every 8 hours, pulls the genuine
        misspelled listings (literal-search rule enforced), and publishes the best finds with live
        market prices attached so you can see the gap at a glance. The{' '}
        <Link href="/#typo-finds" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          fresh typo finds
        </Link>{' '}
        on the homepage are free to browse — start there before you build your own search routine.
        You can also generate typo searches for any card name with the built-in typo generator.
      </p>

      <H2>Protect your wins: the supplies that pay for themselves</H2>
      <p>
        A typo steal only stays a steal if the card arrives — and stays — in the condition you
        bought it in. Every card you win should go straight into protection:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
        <li>
          <Aff href="https://www.amazon.com/dp/B0F1F8674Y?tag=basementvault-20">
            Toploaders + soft sleeves combo
          </Aff>{' '}
          — the penny-sleeve-then-toploader routine is non-negotiable for anything over $20.
        </li>
        <li>
          <Aff href="https://www.amazon.com/dp/B08XLBHX3Y?tag=basementvault-20">
            Ultra Pro UV one-touch magnetic holders
          </Aff>{' '}
          — for your best hits; UV protection matters if the card ever sees daylight.
        </li>
        <li>
          <Aff href="https://www.amazon.com/dp/B0DJL3YLQB?tag=basementvault-20">
            Bulk card sleeves (1,000 ct)
          </Aff>{' '}
          — you'll burn through sleeves fast once you're hunting daily.
        </li>
      </ul>
      <Fine />

      <H2>The honest fine print</H2>
      <p>
        Typo hunting is a percentage game. Most misspelled listings are fairly priced or have
        condition issues — the wins come from volume and discipline, not from any single auction.
        Never bid more than your verified comp just because "it's a typo, it has to be cheap."
        Sometimes the seller knows exactly what they have. Check every listing like it's full price,
        and let the discount be a bonus, not an assumption.
      </p>
      <p>
        Ready for the next level? Learn{' '}
        <Link href="/guides/flipping-trading-cards-beginners" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          how to flip your wins for profit
        </Link>{' '}
        — including the real fee math — or make sure you're not{' '}
        <Link href="/guides/sports-card-overpriced-check" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">
          overpaying on the sports card side
        </Link>
        .
      </p>
    </GuideShell>
  );
}
