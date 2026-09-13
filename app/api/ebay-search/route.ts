import { NextRequest, NextResponse } from 'next/server';
import { ebayConfigured, searchEbay } from '@/lib/ebay';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Live eBay search proxy. The card detail modal calls this with the tracked
// card name. Without keys configured (EBAY_APP_ID / EBAY_CERT_ID in env) we
// return the honest not-configured fallback — never a crash, never fake
// listings, and never any credential detail in the response.

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const q = (params.get('q') || '').trim();
  const rawLimit = Number(params.get('limit') || 6);
  const limit = Number.isFinite(rawLimit) ? rawLimit : 6;

  if (!q) {
    return NextResponse.json({ ok: false, reason: 'missing-query' }, { status: 400 });
  }
  if (!ebayConfigured()) {
    return NextResponse.json({ ok: false, reason: 'ebay-not-configured' });
  }
  try {
    const listings = await searchEbay(q, { limit });
    return NextResponse.json({ ok: true, listings });
  } catch {
    // Surface an honest error state; the UI keeps its manual hunt links.
    return NextResponse.json({ ok: false, reason: 'ebay-error' }, { status: 502 });
  }
}
