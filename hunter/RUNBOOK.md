# Typo Hunter — 8-hour eBay hunt

Every 8 hours a scheduled job hunts eBay for misspelled card listings and
publishes the best finds to `public/typo-finds.json`. The homepage renders
them in the "Fresh typo finds" section (`components/TypoFinds.tsx`) — real,
clickable listings for visitors who don't want to run the searches themselves.

## How a run works

1. **Read the rotation** — `hunter/rotation.json` lists the typo searches
   (~14 high-value ones; kept small so a run finishes reliably).
2. **Hunt** — for each entry, open the eBay search in a real browser:
   `https://www.ebay.com/sch/i.html?_nkw=<typo>&LH_Auction=1&_sop=1`
   (auctions, ending soonest — that's where typo deals live). **Critical:**
   eBay auto-corrects most typo searches to the proper spelling. On the
   results page, click the **"Search instead for \<typo\>"** link to force
   the literal misspelled search, and extract ONLY from that literal result
   set. Listings from the auto-corrected set are correctly-spelled items any
   normal search would find — they have no typo edge and must never be
   published as typo finds.
3. **Extract** — from each literal search, take the top ~6 results: listing
   title, price, bid count, time left, thumbnail URL, and the item URL
   (`https://www.ebay.com/itm/<itemId>`).
4. **Filter honestly** — keep a listing only if:
   - **the title genuinely contains the misspelling** (this is the hard
     requirement — a typo find invisible to normal search is the product's
     whole point),
   - the title plausibly names the intended card (not accessories, lots of
     junk, or a different player/character),
   - the price is a real number (skip "price on request" / broken parses),
   - it's not an obvious scam (stock photos only + $1 Buy It Now, etc.).
   - Dedupe by eBay item ID. Cap the file at ~18 finds, best first.
   - True misspellings are rare — a run that yields 2-4 genuine finds is a
     GOOD run. Never pad the file with auto-corrected listings.
5. **Attach market context** — fetch `https://misprice-hunter.vercel.app/api/scan`,
   map `Deal.term → Deal.rawPrice`, and set `marketPrice` on each find whose
   term matches. Never invent a market price: leave it null when unknown.
   `discountPct` is derived in the UI from price vs market — don't write it.
6. **Write `public/typo-finds.json`** — shape:
   ```json
   {
     "updatedAt": "<ISO timestamp of this run>",
     "finds": [
       {
         "id": "ebay-388912345678",
         "title": "<seller's title, typos and all>",
         "price": 49.99,
         "listingType": "auction",
         "bids": 3,
         "timeLeft": "2h 14m",
         "endsInMinutes": 134,
         "imageUrl": "https://i.ebayimg.com/...",
         "itemUrl": "https://www.ebay.com/itm/388912345678",
         "typo": "Charzard",
         "term": "Charizard",
         "category": "pokemon",
         "marketPrice": 399.99
       }
     ]
   }
   ```
   `listingType` is `"auction"` or `"buyitnow"` (omit `bids`/`timeLeft` for BIN).
   `endsInMinutes` is the auction countdown as a number (for the "ending soon"
   filter); omit it for Buy It Now listings.
7. **If the hunt comes back empty** (bot wall, CAPTCHA, eBay hiccup): DO NOT
   overwrite with an empty file. Keep the previous `typo-finds.json` untouched
   and end the run — stale finds with an "updated Xh ago" label beat no finds.
8. **Maintain the hall of fame** — read `public/hall-of-fame.json`
   (`{ current, past }`). Compute the discount of each new find as
   `(1 - price / marketPrice) * 100` (only when marketPrice is known and the
   find is a plausible match). Determine the current week (Monday, ISO date).
   - If the week's `current` is null or belongs to an older week: move the old
     `current` into `past` (if any), and crown the new week's best find as
     `current` (needs ≥40% discount to be crowned; otherwise leave null).
   - If `current` is this week's and a new find beats its `discountPct`:
     replace `current` with the new find (keep the old one out — only the
     weekly champ is stored).
   - Keep `past` to the last 8 entries.
   - Entry shape: `{ weekStart, title, imageUrl, itemUrl, price, marketPrice,
     discountPct (rounded), typo, term, foundAt }`.
9. **Commit + push** to `main` (GitHub REST git-data API via the `github`
   skill's `bin/github-api` — git-over-HTTPS does not work). Vercel
   auto-redeploys on push.
10. **Verify** — fetch `https://misprice-hunter.vercel.app/typo-finds.json`
    after the deploy and confirm `updatedAt` moved.

## Rules

- Every field must be real extracted data. Never fabricate listings, prices,
  images, or time-left values.
- Never invent market prices. `marketPrice: null` when the scan has no match.
- Auctions show "Current bid" — never present a mid-auction bid as a final price.
- Prefer misspelled-title listings that a normal search would miss; that's the
  product's whole point.
