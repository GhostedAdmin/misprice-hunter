import Link from 'next/link';
import type { Metadata } from 'next';
import { GuideShell, H2, Callout } from '../guide-components';

export const metadata: Metadata = {
  title: 'How to Find Mispriced Sports Cards (Jordan, Brady, Mahomes & More)',
  description:
    'Mispriced sports cards hide behind misspelled names — Micheal Jordan, Leborn James, Tom Braddy. How to hunt the typo, check sold comps, and avoid overpaying.',
  alternates: { canonical: '/guides/how-to-find-mispriced-sports-cards' },
};

export default function HowToFindMispricedSportsCards() {
  return (
    <GuideShell
      kicker="TYPO HUNTING · SPORTS"
      title="How to Find Mispriced Sports Cards"
      lede="Sports card sellers misspell names constantly — &quot;Micheal Jordan,&quot; &quot;Leborn James,&quot; &quot;Tom Braddy.&quot; Those listings draw a fraction of the searches and a fraction of the bids. Here's how to hunt them, and the three checks that stop you from overpaying."
      current="how-to-find-mispriced-sports-cards"
    >
      <H2>Why sports cards get mispriced</H2>
      <p>
        Same mechanism as Pokémon, bigger names. eBay search matches listing titles, so a &quot;Micheal
        Jordan&quot; rookie listing never appears when buyers search &quot;Michael Jordan.&quot; The auction runs
        quiet. And because sports cards carry bigger price tags and bigger condition sensitivity, a quiet
        auction on a real card is where the gap between asking price and market value shows up.
      </p>
      <p>
        Misprice Hunter tracks 20 sports terms and their common misspellings — the names below are the ones that
        come up most:
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Michael Jordan →</strong> Micheal Jordan, Michael Jorden, Michel Jordan</li>
        <li><strong>LeBron James →</strong> Lebron James, Leborn James, Lebran James</li>
        <li><strong>Kobe Bryant →</strong> Koby Bryant, Kobe Bryent, Kobi Bryant</li>
        <li><strong>Stephen Curry →</strong> Stephan Curry, Steven Curry, Steph Curry</li>
        <li><strong>Tom Brady →</strong> Tom Braddy, Tom Bradey, Tom Braidy</li>
        <li><strong>Patrick Mahomes →</strong> Patrick Mahoms, Pat Mahomes, Patrick Mahomees</li>
        <li><strong>Luka Doncic →</strong> Luka Donic, Luka Doncik, Luca Doncic</li>
        <li><strong>Victor Wembanyama →</strong> Wembenyama, Victor Wembanyana, Wembanyana</li>
        <li><strong>Shohei Ohtani →</strong> Shohei Otani, Shohi Ohtani, Shohei Ohtanii</li>
        <li><strong>Caitlin Clark →</strong> Caitlyn Clark, Kaitlin Clark, Caitlin Clarke</li>
      </ul>
      <p>
        The full list — 38 search terms, 106 misspellings across sports and Pokémon — lives in the{' '}
        <Link href="/word-list" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">typo dictionary</Link>,
        where every entry has a one-tap hunt button.
      </p>

      <H2>Hunt the typo, then run the three checks</H2>
      <p>
        Finding a misspelled listing is step one. The three checks below decide whether it is actually a deal.
        They take about 90 seconds combined.
      </p>
      <p>
        <strong>1. Sold comps, not asking prices.</strong> A seller&apos;s asking price is a wish. On eBay, filter
        to Sold Items and look at what the correctly-spelled version of the same card, in the same grade and
        variant, actually closed for. Compare the misspelled listing against those closes — not against other
        active listings.
      </p>
      <p>
        <strong>2. Population and print run.</strong> A card with a pop over 500 is not &quot;RARE&quot; no matter
        what the title says. Check the grading population and, for modern cards, the print run. High-pop modern
        base cards have a ceiling no typo can fix.
      </p>
      <p>
        <strong>3. Condition and authenticity.</strong> Zoom every photo. Typos correlate with rushed listings,
        and rushed listings correlate with undisclosed whitening, scratches, and off-centering. For graded cards,
        verify the cert number with the grader. For raw cards, assume the photos are hiding something until they
        prove otherwise.
      </p>
      <p>If a listing fails any one of these, it is not a deal — it is a lesson with a price tag.</p>

      <H2>Auctions vs. Buy It Now</H2>
      <p>Misspelled auctions and misspelled Buy It Now listings play differently:</p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Auctions ending soon</strong> are where the quiet-bid effect is strongest — fewer watchers, fewer last-minute bids. Sort by ending soonest and set your max before the adrenaline hits.</li>
        <li><strong>Buy It Now</strong> listings reward speed. A fresh misspelled BIN at a real discount disappears fast, so check newly listed and decide quickly — but still run the three checks first.</li>
        <li><strong>Best Offer</strong> listings let you anchor low with the comps in hand. Offer the sold-comp number minus your margin, and be ready to walk.</li>
      </ul>
      <p>
        The hunt buttons on Misprice Hunter run each misspelling as a search across eBay (ending soonest, newly
        listed, cheapest Buy It Now), TCGplayer, Mercari, Facebook Marketplace, and Whatnot. They are manual
        marketplace searches — no API key, no account — and the price shown next to each card is a market-price
        guide for comparison, not a live eBay listing.
      </p>

      <H2>Red flags that scream &quot;walk away&quot;</H2>
      <ul className="list-disc list-inside space-y-1">
        <li>&quot;RARE&quot; in the title on a card with a pop over 500.</li>
        <li>Stock photos instead of the actual card.</li>
        <li>&quot;Investment grade&quot; on an ungraded base card.</li>
        <li>A Buy It Now price far above the last three sold listings.</li>
        <li>Shill-bidding patterns: the same bidder retracting, or private-feedback bidders running the price up.</li>
        <li>A title that is a word salad of misspellings — intentional keyword spam, not an honest typo.</li>
      </ul>
      <p>Any one of these: verify twice or walk.</p>

      <H2>The honest math</H2>
      <p>
        A mispriced find is only a profit after fees, shipping, and grading (if you grade). Work backward from
        the sold comp: subtract marketplace fees, shipping both ways, and any grading cost, then decide your max
        bid. If the numbers only work when everything goes perfectly, they don&apos;t work.
      </p>
      <p>
        Misprice Hunter never claims a deal is verified. Market prices are a guide, not a guarantee — always
        check the seller, the photos, and the description before you bid.
      </p>

      <Callout title="The 90-second rule">
        <p>
          Sold comps, pop/print run, photos. If a misspelled listing survives all three and the math works after
          fees, bid your max and walk away. If it fails one, close the tab — there will be another typo tomorrow.
        </p>
      </Callout>

      <p>
        Keep going: the <Link href="/how-it-works" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">4-step typo-arbitrage playbook</Link>,{' '}
        <Link href="/guides/sports-card-overpriced-check" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">how to tell if a sports card is overpriced</Link>,
        and <Link href="/guides/flipping-trading-cards-beginners" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">the beginner&apos;s flipping guide</Link>.
      </p>
    </GuideShell>
  );
}
