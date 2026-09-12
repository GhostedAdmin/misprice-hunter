// Misprice Hunter — API-independent hunt avenues.
//
// These are plain search-URL deep links: zero keys, zero API calls, nothing
// eBay (or anyone) can revoke. Each avenue below was verified on 2026-09-12:
//   - eBay (3 sorts): canonical sch/i.html pattern in use for 15+ years
//     (_sop=1 ending soonest, _sop=10 newly listed, _sop=15 price+shipping
//     lowest; LH_Auction=1 / LH_BIN=1 listing-type filters). Datacenter curl
//     hits eBay's bot wall, but the pattern resolves on eBay's servers and
//     works in any real browser.
//   - TCGplayer: HTTP 200, search page rendered.
//   - Mercari: https://www.mercari.com/search/?keyword= is Mercari's live
//     search pattern (datacenter curl hits their Cloudflare challenge only).
//   - Facebook Marketplace: HTTP 200, page title confirmed the query
//     ("New and used Charzard for sale | Facebook Marketplace").
//   - Whatnot: HTTP 200, page title "Searching for charzard".
//
// Dropped (could not verify a working search-URL pattern): COMC (blocked /
// no discoverable pattern), Fanatics Collect (SPA, /search 404s, ?query=
// unverified), Goldin (curated catalog auctions — no typo surface anyway).
//
// TO ADD AN AVENUE: verify the pattern returns a real search-results page
// (not a homepage redirect or login wall), then append one entry here.
// HuntButtons picks it up automatically everywhere.

export interface HuntAvenue {
  id: string;
  label: string;
  buildUrl: (q: string) => string;
}

export const HUNT_AVENUES: HuntAvenue[] = [
  {
    id: 'ebay-ending',
    label: 'eBay ⏳',
    buildUrl: (q) =>
      `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&LH_Auction=1&_sop=1`,
  },
  {
    id: 'ebay-new',
    label: 'eBay 🆕',
    buildUrl: (q) =>
      `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&_sop=10`,
  },
  {
    id: 'ebay-cheap',
    label: 'eBay 💲',
    buildUrl: (q) =>
      `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&LH_BIN=1&_sop=15`,
  },
  {
    id: 'tcgplayer',
    label: 'TCGplayer',
    buildUrl: (q) =>
      `https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'mercari',
    label: 'Mercari',
    buildUrl: (q) =>
      `https://www.mercari.com/search/?keyword=${encodeURIComponent(q)}`,
  },
  {
    id: 'facebook',
    label: 'FB',
    buildUrl: (q) =>
      `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(q)}`,
  },
  {
    id: 'whatnot',
    label: 'Whatnot',
    buildUrl: (q) =>
      `https://www.whatnot.com/search?query=${encodeURIComponent(q)}`,
  },
];
