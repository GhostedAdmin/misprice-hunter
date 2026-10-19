import type { MetadataRoute } from 'next';

const BASE = 'https://misprice-hunter.vercel.app';

const GUIDE_SLUGS = [
  'ebay-typo-hunting-guide',
  'pokemon-sealed-worth-buying-2026',
  'sports-card-overpriced-check',
  'flipping-trading-cards-beginners',
  'mispriced-pokemon-cards-ebay',
  'how-to-find-mispriced-sports-cards',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/word-list`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${BASE}/guides/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/links`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
