'use client';

import { useEffect, useState } from 'react';

interface EbayListing {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  itemWebUrl: string;
  buyingOptions: string[];
  auctionEnd: string | null;
}

function money(v: number | null, currency: string): string {
  if (v === null) return '—';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(v);
  } catch {
    return `$${v.toFixed(2)}`;
  }
}

// Short "2h 14m" / "3d 5h" countdown for auctions; null when expired/missing.
function timeLeft(iso: string | null): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms) || ms <= 0) return null;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

/**
 * Real-time eBay listings for the tracked card name, rendered inside the
 * card detail modal. The section hides itself entirely when the server
 * reports ebay-not-configured (keys not set in Vercel yet), so the modal
 * works the same as before until then.
 */
export default function EbayListings({ query }: { query: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'unconfigured'>('loading');
  const [listings, setListings] = useState<EbayListing[]>([]);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setListings([]);
    fetch(`/api/ebay-search?q=${encodeURIComponent(query)}&limit=6`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (json && json.reason === 'ebay-not-configured') {
          setState('unconfigured');
          return;
        }
        if (!res.ok || !json || !json.ok) throw new Error('ebay search failed');
        setListings(Array.isArray(json.listings) ? json.listings : []);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  // Keys not configured yet — don't render anything at all.
  if (state === 'unconfigured') return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        Live eBay listings
      </p>
      {state === 'loading' ? (
        <div className="grid grid-cols-1 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-zinc-800 bg-[#0b0b0d] p-2.5"
            >
              <div className="h-16 w-16 shrink-0 animate-pulse rounded bg-zinc-900" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-900" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-900" />
              </div>
            </div>
          ))}
        </div>
      ) : state === 'error' ? (
        <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3 text-sm text-zinc-400">
          eBay search is unavailable right now — the hunt links below still work.
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d] p-3 text-sm text-zinc-500">
          No live eBay listings found for this card.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2">
          {listings.map((l) => {
            const left = timeLeft(l.auctionEnd);
            return (
              <li key={l.id}>
                <a
                  href={l.itemWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-[#0b0b0d] p-2.5 transition-colors hover:border-amber-400/60"
                >
                  {l.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-zinc-900 text-xl">
                      🂠
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-zinc-100">
                      {l.title}
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold tabular-nums text-amber-400">
                      {money(l.price, l.currency)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {left
                        ? `Ends in ${left}`
                        : l.buyingOptions.includes('FIXED_PRICE')
                          ? 'Buy it now'
                          : 'eBay'}
                    </p>
                  </div>
                  <span className="self-center text-sm text-zinc-600">↗</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
