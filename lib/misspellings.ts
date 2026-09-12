// Misprice Hunter — typo dictionary.
//
// This is the heart of the product: eBay sellers constantly misspell card
// names, and misspelled auctions get fewer eyeballs and lower final bids.
// Each entry below is a correctly-spelled search term plus the misspellings
// we scan for.
//
// TO ADD MORE: copy an entry, change `term`, set `category` to
// 'pokemon' or 'sports', and list the misspellings. That's it — the scanner
// and the Word List page pick them up automatically.

export type Category = 'pokemon' | 'sports';

export interface MisspellingEntry {
  term: string;
  category: Category;
  misspellings: string[];
  note?: string;
}

export const MISSPELLINGS: MisspellingEntry[] = [
  // ---------------- POKÉMON ----------------
  { term: 'Charizard', category: 'pokemon', misspellings: ['Charzard', 'Charizad', 'Charazard', 'Charizardd'] },
  { term: 'Pikachu', category: 'pokemon', misspellings: ['Pikacu', 'Pikatchu', 'Pikachuu', 'Pickachu'] },
  { term: 'Blastoise', category: 'pokemon', misspellings: ['Blastois', 'Blastoies', 'Blastose'] },
  { term: 'Venusaur', category: 'pokemon', misspellings: ['Venasaur', 'Venusar', 'Venasaure'] },
  { term: 'Gengar', category: 'pokemon', misspellings: ['Genger', 'Genghar', 'Genngar'] },
  { term: 'Mewtwo', category: 'pokemon', misspellings: ['Mewtow', 'Mewtoo', 'Meewtwo'] },
  { term: 'Mew', category: 'pokemon', misspellings: ['Mwe', 'Meu'] },
  { term: 'Umbreon', category: 'pokemon', misspellings: ['Umberon', 'Umbreom', 'Umbron'] },
  { term: 'Espeon', category: 'pokemon', misspellings: ['Espean', 'Espion', 'Espeom'] },
  { term: 'Sylveon', category: 'pokemon', misspellings: ['Sylvean', 'Silveon', 'Sylvion'] },
  { term: 'Rayquaza', category: 'pokemon', misspellings: ['Raquaza', 'Rayquasa', 'Rayquazza'] },
  { term: 'Lugia', category: 'pokemon', misspellings: ['Luggia', 'Lugya'] },
  { term: 'Eevee', category: 'pokemon', misspellings: ['Evee', 'Eevie', 'Eevi'] },
  { term: 'Gyarados', category: 'pokemon', misspellings: ['Gyrados', 'Gyarodas', 'Gyaradoes'] },
  { term: 'Dragonite', category: 'pokemon', misspellings: ['Dragonight', 'Dragonaite', 'Dragonitte'] },
  { term: 'Snorlax', category: 'pokemon', misspellings: ['Snorelax', 'Snorlacks', 'Snorelacks'] },
  { term: 'Greninja', category: 'pokemon', misspellings: ['Greninija', 'Greninga', 'Greninjaa'] },
  { term: 'Lucario', category: 'pokemon', misspellings: ['Lukario', 'Lucarion', 'Lucarrio'] },

  // ---------------- SPORTS ----------------
  { term: 'Michael Jordan', category: 'sports', misspellings: ['Micheal Jordan', 'Michael Jorden', 'Michel Jordan'] },
  { term: 'LeBron James', category: 'sports', misspellings: ['Lebron James', 'Leborn James', 'Lebran James'] },
  { term: 'Luka Doncic', category: 'sports', misspellings: ['Luka Donic', 'Luka Doncik', 'Luca Doncic'] },
  { term: 'Victor Wembanyama', category: 'sports', misspellings: ['Wembenyama', 'Victor Wembanyana', 'Wembanyana'] },
  { term: 'Kobe Bryant', category: 'sports', misspellings: ['Koby Bryant', 'Kobe Bryent', 'Kobi Bryant'] },
  { term: 'Stephen Curry', category: 'sports', misspellings: ['Stephan Curry', 'Steven Curry', 'Steph Curry'] },
  { term: 'Jayson Tatum', category: 'sports', misspellings: ['Jason Tatum', 'Jayson Tatumn', 'Jaysen Tatum'] },
  { term: 'Anthony Edwards', category: 'sports', misspellings: ['Antony Edwards', 'Anthony Edwwards'] },
  { term: 'Nikola Jokic', category: 'sports', misspellings: ['Nikola Jokick', 'Jokich', 'Nikola Jokic'] },
  { term: 'Tom Brady', category: 'sports', misspellings: ['Tom Braddy', 'Tom Bradey', 'Tom Braidy'] },
  { term: 'Patrick Mahomes', category: 'sports', misspellings: ['Patrick Mahoms', 'Pat Mahomes', 'Patrick Mahomees'] },
  { term: 'Josh Allen', category: 'sports', misspellings: ['Josh Allan', 'Josh Alen'] },
  { term: 'Joe Burrow', category: 'sports', misspellings: ['Joe Burow', 'Joe Burrough'] },
  { term: 'Justin Jefferson', category: 'sports', misspellings: ['Justin Jeffersen', 'Justin Jeferson'] },
  { term: 'Jayden Daniels', category: 'sports', misspellings: ['Jayden Danials', 'Jaden Daniels'] },
  { term: 'Shohei Ohtani', category: 'sports', misspellings: ['Shohei Otani', 'Shohi Ohtani', 'Shohei Ohtanii'] },
  { term: 'Mike Trout', category: 'sports', misspellings: ['Mike Trought', 'Mike Troute'] },
  { term: 'Aaron Judge', category: 'sports', misspellings: ['Aron Judge', 'Aaron Judgge'] },
  { term: 'Caitlin Clark', category: 'sports', misspellings: ['Caitlyn Clark', 'Kaitlin Clark', 'Caitlin Clarke'] },
  { term: 'Connor Bedard', category: 'sports', misspellings: ['Conner Bedard', 'Connor Beddard'] },
];
