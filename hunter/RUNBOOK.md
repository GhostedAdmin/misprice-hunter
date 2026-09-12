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
   (auctions, ending soonest — that's where typo deals live). Also worth one
   pass with `&LH_BIN=1&_sop=15` (cheapest Buy It Now) for the top 4-5 terms
   if time allows.
3. **Extract** — from each search, take the top ~6 results: listing title,
   price, bid count, time left, thumbnail URL, and the item URL
   (`https://www.ebay.com/itm/<itemId>`).
4. **Filter honestly** — keep a listing only if:
   - the title plausibly names the intended card (not accessories, lots of
     junk, or a different player/character),
   - the price is a real number (skip "price on request" / broken parses),
   - it's not an obvious scam (stock photos only + $1 Buy It Now, etc.).
   - Dedupe by eBay item ID. Cap the file at ~18 finds, best first.
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
7. **If the hunt comes back empty** (bot wall, CAPTCHA, eBay hiccup): DO NOT
   overwrite with an empty file. Keep the previous `typo-finds.json` untouched
   and end the run — stale finds with an "updated Xh ago" label beat no finds.
8. **Commit + push** to `main` (GitHub REST git-data API via the `github`
   skill's `bin/github-api` — git-over-HTTPS does not work). Vercel
   auto-redeploys on push.
9. **Verify** — fetch `https://misprice-hunter.vercel.app/typo-finds.json`
   after the deploy and confirm `updatedAt` moved.

## Rules

- Every field must be real extracted data. Never fabricate listings, prices,
  images, or time-left values.
- Never invent market prices. `marketPrice: null` when the scan has no match.
- Auctions show "Current bid" — never present a mid-auction bid as a final price.
- Prefer misspelled-title listings that a normal search would miss; that's the
  product's whole point.
