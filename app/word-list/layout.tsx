import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Misspelled Card Search Terms — The Typo Dictionary (106 Misspellings)',
  description:
    'Every typo the scanner checks: 38 search terms, 106 misspellings — Charzard, Pikacu, Blastois, Micheal Jordan, Leborn James and more. Pick a typo and hunt it across every marketplace.',
  alternates: { canonical: '/word-list' },
  openGraph: {
    title: 'Misspelled Card Search Terms — The Typo Dictionary',
    description:
      '38 search terms, 106 misspellings — Charzard, Pikacu, Blastois, Micheal Jordan, Leborn James and more. Pick a typo and hunt it across every marketplace.',
  },
};

export default function WordListLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
