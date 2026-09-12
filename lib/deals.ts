import type { Category } from './misspellings';

export interface Deal {
  id: string;
  title: string;
  imageUrl: string;
  price: number; // current bid
  currency: string;
  bidCount: number;
  endTime: string; // ISO
  listingUrl: string;
  category: Category;
  term: string; // correctly spelled term
  misspelling: string; // the typo that surfaced it
}

// ---------------------------------------------------------------------------
// DEMO DATA — clearly fake sample listings so the site feels real before a
// user adds their free eBay API key. Never presented as live results.
// ---------------------------------------------------------------------------
interface DemoSeed {
  title: string;
  price: number;
  bidCount: number;
  endsInMinutes: number;
  category: Category;
  term: string;
  misspelling: string;
  seed: string;
}

const DEMO_SEEDS: DemoSeed[] = [
  { title: 'Charzard 1st Edition Base Set Holo — LP, sharp corners', price: 41.0, bidCount: 9, endsInMinutes: 134, category: 'pokemon', term: 'Charizard', misspelling: 'Charzard', seed: 'mh-char' },
  { title: 'Pikacu Illustrator Style Promo — sealed in toploader', price: 12.5, bidCount: 4, endsInMinutes: 47, category: 'pokemon', term: 'Pikachu', misspelling: 'Pikacu', seed: 'mh-pika' },
  { title: 'Blastois Base Set Holo 2/102 — light play', price: 28.0, bidCount: 6, endsInMinutes: 322, category: 'pokemon', term: 'Blastoise', misspelling: 'Blastois', seed: 'mh-blast' },
  { title: 'Venasaur 15/102 Base Set Holo — clean front', price: 19.99, bidCount: 3, endsInMinutes: 95, category: 'pokemon', term: 'Venusaur', misspelling: 'Venasaur', seed: 'mh-ven' },
  { title: 'Mewtow EX Holo — near mint', price: 8.5, bidCount: 2, endsInMinutes: 410, category: 'pokemon', term: 'Mewtwo', misspelling: 'Mewtow', seed: 'mh-mew2' },
  { title: 'Genger Evolutions Reverse Holo lot (x4)', price: 5.25, bidCount: 1, endsInMinutes: 26, category: 'pokemon', term: 'Gengar', misspelling: 'Genger', seed: 'mh-geng' },
  { title: 'Micheal Jordan 1986 Fleer #57 — reprint? read description', price: 15.5, bidCount: 7, endsInMinutes: 188, category: 'sports', term: 'Michael Jordan', misspelling: 'Micheal Jordan', seed: 'mh-mj' },
  { title: 'Leborn James Prizm Silver Prizm — rookie year card', price: 63.0, bidCount: 11, endsInMinutes: 74, category: 'sports', term: 'LeBron James', misspelling: 'Leborn James', seed: 'mh-lebron' },
  { title: 'Luka Donic Optic Holo Rated Rookie — PSA ready', price: 22.0, bidCount: 5, endsInMinutes: 256, category: 'sports', term: 'Luka Doncic', misspelling: 'Luka Donic', seed: 'mh-luka' },
  { title: 'Tom Braddy Contenders Rookie Ticket auto — ungraded', price: 310.0, bidCount: 14, endsInMinutes: 59, category: 'sports', term: 'Tom Brady', misspelling: 'Tom Braddy', seed: 'mh-brady' },
  { title: 'Koby Bryant Topps Chrome Refractor #138', price: 88.0, bidCount: 8, endsInMinutes: 540, category: 'sports', term: 'Kobe Bryant', misspelling: 'Koby Bryant', seed: 'mh-kobe' },
  { title: 'Shohei Otani 2018 Topps Rookie lot (x6) — NM', price: 34.75, bidCount: 6, endsInMinutes: 152, category: 'sports', term: 'Shohei Ohtani', misspelling: 'Shohei Otani', seed: 'mh-ohtani' },
];

export function demoDeals(): Deal[] {
  const now = Date.now();
  return DEMO_SEEDS.map((s, i) => ({
    id: `demo-${i}`,
    title: s.title,
    imageUrl: `https://picsum.photos/seed/${s.seed}/400/300`,
    price: s.price,
    currency: 'USD',
    bidCount: s.bidCount,
    endTime: new Date(now + s.endsInMinutes * 60_000).toISOString(),
    listingUrl: 'https://www.ebay.com/',
    category: s.category,
    term: s.term,
    misspelling: s.misspelling,
  }));
}
