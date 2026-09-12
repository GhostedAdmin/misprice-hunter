import type { Category } from './misspellings';

export interface Deal {
  id: string;
  title: string; // product name, e.g. "Charizard #4"
  setName: string; // e.g. "Pokemon Base Set"
  term: string; // tracked term, e.g. "Charizard"
  misspelling: string; // top typo — feeds the hunt buttons
  category: Category;
  rawPrice: number | null; // raw/ungraded market, dollars
  gradedPrice: number | null; // graded market, dollars
  priceUrl: string; // full price history link
}

// ---------------------------------------------------------------------------
// DEMO DATA — clearly sample market prices so the site feels real before a
// user adds their free PriceCharting token. Never presented as live results.
// ---------------------------------------------------------------------------

const DEMO_MARKET: Array<{
  title: string;
  setName: string;
  term: string;
  misspelling: string;
  category: Category;
  rawPrice: number;
  gradedPrice: number;
}> = [
  { title: 'Charizard #4', setName: 'Pokemon Base Set', term: 'Charizard', misspelling: 'Charzard', category: 'pokemon', rawPrice: 399.99, gradedPrice: 2499.99 },
  { title: 'Pikachu #58', setName: 'Pokemon Base Set', term: 'Pikachu', misspelling: 'Pikacu', category: 'pokemon', rawPrice: 8.5, gradedPrice: 64.99 },
  { title: 'Blastoise #2', setName: 'Pokemon Base Set', term: 'Blastoise', misspelling: 'Blastois', category: 'pokemon', rawPrice: 189.99, gradedPrice: 1129.99 },
  { title: 'Venusaur #15', setName: 'Pokemon Base Set', term: 'Venusaur', misspelling: 'Venasaur', category: 'pokemon', rawPrice: 149.99, gradedPrice: 899.99 },
  { title: 'Mewtwo #10', setName: 'Pokemon Base Set', term: 'Mewtwo', misspelling: 'Mewtow', category: 'pokemon', rawPrice: 42.0, gradedPrice: 329.99 },
  { title: 'Gengar #5', setName: 'Pokemon Fossil', term: 'Gengar', misspelling: 'Genger', category: 'pokemon', rawPrice: 64.99, gradedPrice: 419.99 },
  { title: 'Michael Jordan #57', setName: 'Basketball Cards 1986 Fleer', term: 'Michael Jordan', misspelling: 'Micheal Jordan', category: 'sports', rawPrice: 2255.0, gradedPrice: 6022.95 },
  { title: 'LeBron James #221', setName: 'Basketball Cards 2003 Topps Chrome', term: 'LeBron James', misspelling: 'Leborn James', category: 'sports', rawPrice: 899.99, gradedPrice: 3499.99 },
  { title: 'Luka Doncic #280', setName: 'Basketball Cards 2018 Panini Prizm', term: 'Luka Doncic', misspelling: 'Luka Donic', category: 'sports', rawPrice: 219.99, gradedPrice: 1049.99 },
  { title: 'Tom Brady #144', setName: 'Football Cards 2000 Playoff Contenders', term: 'Tom Brady', misspelling: 'Tom Braddy', category: 'sports', rawPrice: 1899.99, gradedPrice: 8999.99 },
  { title: 'Kobe Bryant #138', setName: 'Basketball Cards 1996 Topps Chrome', term: 'Kobe Bryant', misspelling: 'Koby Bryant', category: 'sports', rawPrice: 749.99, gradedPrice: 4999.99 },
  { title: 'Shohei Ohtani #700', setName: 'Baseball Cards 2018 Topps Update', term: 'Shohei Ohtani', misspelling: 'Shohei Otani', category: 'sports', rawPrice: 34.75, gradedPrice: 219.99 },
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
  }));
}
