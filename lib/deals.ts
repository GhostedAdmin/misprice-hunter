import type { Category } from './misspellings';

export interface Deal {
  id: string;
  title: string; // product name, e.g. "Charizard #4"
  setName: string; // e.g. "Base Set"
  term: string; // tracked term, e.g. "Charizard"
  misspelling: string; // top typo — feeds the hunt buttons
  category: Category;
  rawPrice: number | null; // raw/ungraded market, dollars
  gradedPrice: number | null; // graded market, dollars (null when the source has none)
  priceUrl: string; // full price history link
  imageUrl: string | null;
  live: boolean; // false = clearly-labeled sample
  source: string; // where the numbers came from: 'sample' | 'TCGplayer' | 'CardSight AI'
}

// ---------------------------------------------------------------------------
// DEMO DATA — fallback when the live feed hiccups, and the standing sample
// set for sports cards when no CardSight API key is configured. Never
// presented as live results; every card carries a real photo of that exact card.
// ---------------------------------------------------------------------------

const TCGDEX_IMG = 'https://assets.tcgdex.net';

const DEMO_MARKET: Array<{
  title: string;
  setName: string;
  term: string;
  misspelling: string;
  category: Category;
  rawPrice: number;
  gradedPrice: number;
  image: string;
}> = [
  { title: 'Charizard #4', setName: 'Pokemon Base Set', term: 'Charizard', misspelling: 'Charzard', category: 'pokemon', rawPrice: 399.99, gradedPrice: 2499.99, image: `${TCGDEX_IMG}/en/base/base1/4/high.png` },
  { title: 'Pikachu #58', setName: 'Pokemon Base Set', term: 'Pikachu', misspelling: 'Pikacu', category: 'pokemon', rawPrice: 8.5, gradedPrice: 64.99, image: `${TCGDEX_IMG}/en/base/base1/58/high.png` },
  { title: 'Blastoise #2', setName: 'Pokemon Base Set', term: 'Blastoise', misspelling: 'Blastois', category: 'pokemon', rawPrice: 189.99, gradedPrice: 1129.99, image: `${TCGDEX_IMG}/en/base/base1/2/high.png` },
  { title: 'Venusaur #15', setName: 'Pokemon Base Set', term: 'Venusaur', misspelling: 'Venasaur', category: 'pokemon', rawPrice: 149.99, gradedPrice: 899.99, image: `${TCGDEX_IMG}/en/base/base1/15/high.png` },
  { title: 'Mewtwo #10', setName: 'Pokemon Base Set', term: 'Mewtwo', misspelling: 'Mewtow', category: 'pokemon', rawPrice: 42.0, gradedPrice: 329.99, image: `${TCGDEX_IMG}/en/base/base1/10/high.png` },
  { title: 'Gengar #5', setName: 'Pokemon Fossil', term: 'Gengar', misspelling: 'Genger', category: 'pokemon', rawPrice: 64.99, gradedPrice: 419.99, image: `${TCGDEX_IMG}/en/base/base3/5/high.png` },
  { title: 'Michael Jordan #57', setName: 'Basketball Cards 1986 Fleer', term: 'Michael Jordan', misspelling: 'Micheal Jordan', category: 'sports', rawPrice: 2255.0, gradedPrice: 6022.95, image: '/cards/jordan-1986-fleer-57.jpg' },
  { title: 'LeBron James #111', setName: 'Basketball Cards 2003 Topps Chrome', term: 'LeBron James', misspelling: 'Leborn James', category: 'sports', rawPrice: 899.99, gradedPrice: 3499.99, image: '/cards/lebron-2003-topps-chrome-111.webp' },
  { title: 'Luka Doncic #280', setName: 'Basketball Cards 2018 Panini Prizm', term: 'Luka Doncic', misspelling: 'Luka Donic', category: 'sports', rawPrice: 219.99, gradedPrice: 1049.99, image: '/cards/luka-2018-prizm-280.jpg' },
  { title: 'Tom Brady #144', setName: 'Football Cards 2000 Playoff Contenders', term: 'Tom Brady', misspelling: 'Tom Braddy', category: 'sports', rawPrice: 1899.99, gradedPrice: 8999.99, image: '/cards/brady-2000-contenders-144.jpg' },
  { title: 'Kobe Bryant #138', setName: 'Basketball Cards 1996 Topps Chrome', term: 'Kobe Bryant', misspelling: 'Koby Bryant', category: 'sports', rawPrice: 749.99, gradedPrice: 4999.99, image: '/cards/kobe-1996-topps-chrome-138.jpg' },
  { title: 'Shohei Ohtani #US1', setName: 'Baseball Cards 2018 Topps Update', term: 'Shohei Ohtani', misspelling: 'Shohei Otani', category: 'sports', rawPrice: 34.75, gradedPrice: 219.99, image: '/cards/ohtani-2018-update-us1.jpg' },
];

function priceUrlFor(category: Category, term: string): string {
  const q = encodeURIComponent(term);
  return category === 'pokemon'
    ? `https://www.pricecharting.com/search?query=${q}`
    : `https://www.sportscardspro.com/search-products?q=${q}&type=prices`;
}

export function demoDeals(): Deal[] {
  return DEMO_MARKET.map((s, i) => ({
    id: `demo-${i}`,
    title: s.title,
    setName: s.setName,
    term: s.term,
    misspelling: s.misspelling,
    category: s.category,
    rawPrice: s.rawPrice,
    gradedPrice: s.gradedPrice,
    priceUrl: priceUrlFor(s.category, s.term),
    imageUrl: s.image,
    live: false,
    source: 'sample',
  }));
}
