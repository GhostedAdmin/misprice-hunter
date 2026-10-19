import Link from 'next/link';
import type { Metadata } from 'next';
import { GuideShell, H2, Callout } from '../guide-components';

export const metadata: Metadata = {
  title: 'How to Find Mispriced Pokémon Cards on eBay (Typo Hunting)',
  description:
    'Mispriced Pokémon cards hide behind misspelled titles — Charzard, Pikacu, Blastois. How to find them, beat eBay autocorrect, and verify a real deal before you bid.',
  alternates: { canonical: '/guides/mispriced-pokemon-cards-ebay' },
};

export default function MispricedPokemonCardsEbay() {
  return (
    <GuideShell
      kicker="TYPO HUNTING"
      title="How to Find Mispriced Pokémon Cards on eBay"
      lede="A &quot;mispriced&quot; Pokémon card usually isn't a pricing error — it's a listing most buyers never see. The most common reason: the seller misspelled the card's name, so the auction never shows up in normal search. Here's how to find those listings, and how to tell a real deal from a trap."
      current="mispriced-pokemon-cards-ebay"
    >
      <H2>What &quot;mispriced&quot; actually means</H2>
      <p>
        A mispriced card is one listed meaningfully below what the correctly-spelled card sells for — not
        because the seller is generous, but because the listing is invisible. eBay search matches listing
        titles. When a seller lists a Charizard as a &quot;Charzard,&quot; every buyer searching
        &quot;Charizard&quot; never sees it. The auction runs in a quiet corner with a fraction of the
        eyeballs — and a fraction of the bids.
      </p>
      <p>
        That is the whole edge. You are not outsmarting the market. You are looking where the market isn&apos;t.
      </p>

      <H2>The misspellings that surface real listings</H2>
      <p>Misprice Hunter tracks 18 Pokémon terms and their common misspellings. The ones that come up again and again:</p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Charizard →</strong> Charzard, Charizad, Charazard, Charizardd</li>
        <li><strong>Pikachu →</strong> Pikacu, Pikatchu, Pikachuu, Pickachu</li>
        <li><strong>Blastoise →</strong> Blastois, Blastoies, Blastose</li>
        <li><strong>Venusaur →</strong> Venasaur, Venusar, Venasaure</li>
        <li><strong>Gengar →</strong> Genger, Genghar, Genngar</li>
        <li><strong>Mewtwo →</strong> Mewtow, Mewtoo, Meewtwo</li>
        <li><strong>Umbreon / Espeon / Sylveon →</strong> Umberon, Espean, Sylvean, Silveon</li>
        <li><strong>Rayquaza →</strong> Raquaza, Rayquasa, Rayquazza</li>
        <li><strong>Gyarados →</strong> Gyrados, Gyarodas, Gyaradoes</li>
        <li><strong>Dragonite →</strong> Dragonight, Dragonaite, Dragonitte</li>
      </ul>
      <p>
        The full list — 38 search terms, 106 misspellings across Pokémon and sports — lives in the{' '}
        <Link href="/word-list" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">typo dictionary</Link>,
        where every entry has a one-tap hunt button.
      </p>

      <H2>How to hunt: the literal-search rule</H2>
      <p>
        eBay tries to help by correcting your spelling. That &quot;help&quot; kills typo hunting. When you search a
        misspelling, check that the results actually contain the typo in the listing title — if eBay quietly
        corrected you to the right spelling, you are looking at the same crowded auctions as everyone else.
      </p>
      <p>The reliable workflow:</p>
      <ol className="list-decimal list-inside space-y-1">
        <li>Search the exact misspelling (for example, <code>Charzard</code>).</li>
        <li>Confirm the typo appears in the listing titles on the results page.</li>
        <li>Sort by ending soonest for auctions about to close, and check newly listed for fresh Buy It Now listings.</li>
        <li>Compare the asking price against the market price for the correctly-spelled card before you bid — the gap is your opportunity.</li>
      </ol>
      <p>
        The hunt buttons on Misprice Hunter run that exact misspelling as a search across eBay (ending soonest,
        newly listed, cheapest Buy It Now), TCGplayer, Mercari, Facebook Marketplace, and Whatnot. They are
        manual marketplace searches — no API key, no account — and the price shown next to each card is a
        market-price guide for comparison, not a live eBay listing.
      </p>

      <H2>Verify before you bid</H2>
      <p>Typos correlate with rushed listings, and rushed listings correlate with surprises. Run this checklist on every candidate:</p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Zoom every photo.</strong> Look for whitening, scratches, and off-centering. Judge the card, not the title.</li>
        <li><strong>Read the full description.</strong> Some sellers bury &quot;MP&quot; (moderately played) or &quot;for parts&quot; in paragraph three.</li>
        <li><strong>Check the seller.</strong> Feedback history, how long the account has existed, and whether their other listings look legitimate.</li>
        <li><strong>Confirm the set and variant.</strong> A misspelled title can hide the wrong set, a reprint, or a different condition than you assumed.</li>
        <li><strong>Do the math before the adrenaline hits.</strong> Subtract fees and shipping from the market price, set a max bid, and stick to it.</li>
      </ul>
      <p>
        Some &quot;typos&quot; are intentional keyword spam — sellers stuffing misspellings into titles to catch extra
        searches. Read every listing. If the title is a word salad, walk.
      </p>

      <H2>What not to expect</H2>
      <p>
        Typo hunting is not free money. Most misspelled listings are correctly priced for their condition, or the
        &quot;typo&quot; is spam. Some weeks you will find nothing worth bidding on. The edge is real but thin: a
        handful of genuine finds a month beats a dozen rushed bids on cards with hidden issues.
      </p>
      <p>
        Misprice Hunter never claims a deal is verified. Market prices are a guide, not a guarantee — always check
        the seller, the photos, and the description before you bid.
      </p>

      <Callout title="The 30-second routine">
        <p>
          Pick a card. Run its misspellings. Compare against market price. Verify photos, description, and seller.
          Bid once, at your max, and walk away if it passes that number. Repeat next week.
        </p>
      </Callout>

      <p>
        Keep going: the <Link href="/how-it-works" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">4-step typo-arbitrage playbook</Link>{' '}
        and the <Link href="/guides/ebay-typo-hunting-guide" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">deeper typo-hunting guide</Link>.
        If you want sealed instead of singles, see the{' '}
        <Link href="/guides/pokemon-sealed-worth-buying-2026" className="font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300">Pokémon sealed guide</Link>.
      </p>
    </GuideShell>
  );
}
