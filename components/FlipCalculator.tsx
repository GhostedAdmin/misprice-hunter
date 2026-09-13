'use client';

import { useState } from 'react';

// Flip math: buy price in, net profit out. Collapsible so it stays out of
// the way until a hunter wants it. Defaults can be prefilled (e.g. a find's
// listing price and our tracked market price); everything is editable.
export default function FlipCalculator({
  buyPrice,
  sellPrice,
}: {
  buyPrice?: number;
  sellPrice?: number;
}) {
  const [open, setOpen] = useState(false);
  const [buy, setBuy] = useState(buyPrice != null ? String(buyPrice) : '');
  const [sell, setSell] = useState(sellPrice != null ? String(sellPrice) : '');
  const [ship, setShip] = useState('5');
  const [feePct, setFeePct] = useState('13.25');

  const b = parseFloat(buy);
  const s = parseFloat(sell);
  const sh = parseFloat(ship);
  const f = parseFloat(feePct) / 100;
  const valid =
    Number.isFinite(b) && Number.isFinite(s) && b >= 0 && s > 0 && Number.isFinite(sh) && sh >= 0;

  const fees = valid ? s * f : 0;
  const profit = valid ? s - fees - sh - b : 0;
  const roi = valid && b > 0 ? (profit / b) * 100 : null;

  const verdict =
    !valid ? null
    : profit <= 0 ? { label: 'Pass — you’d lose money', cls: 'text-red-400' }
    : roi !== null && roi >= 30
      ? { label: 'Worth flipping 🔥', cls: 'text-emerald-400' }
      : { label: 'Thin but green', cls: 'text-amber-300' };

  const num = (id: string, value: string, set: (v: string) => void, label: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        id={id}
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-[#0b0b0d] px-2 py-1.5 text-sm text-zinc-100 tabular-nums focus:border-amber-400/60 focus:outline-none"
      />
    </label>
  );

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0b0b0d]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-amber-300 transition-colors"
      >
        <span>🧮 Flip math</span>
        <span className="text-zinc-500">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {num('fc-buy', buy, setBuy, 'You pay')}
            {num('fc-sell', sell, setSell, 'You sell for')}
            {num('fc-fee', feePct, setFeePct, 'Fee %')}
            {num('fc-ship', ship, setShip, 'Shipping $')}
          </div>
          {valid ? (
            <div className="mt-2 rounded-md border border-zinc-800 bg-[#141417] p-2.5 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Fees ({feePct}%)</span>
                <span className="tabular-nums">−${fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="tabular-nums">−${sh.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-zinc-800 pt-1 font-bold">
                <span>Net profit</span>
                <span className={`tabular-nums ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : '−'}${Math.abs(profit).toFixed(2)}
                  {roi !== null && (
                    <span className="ml-1 text-xs font-semibold">({roi >= 0 ? '+' : ''}{roi.toFixed(0)}%)</span>
                  )}
                </span>
              </div>
              {verdict && <p className={`mt-1 text-xs font-bold ${verdict.cls}`}>{verdict.label}</p>}
            </div>
          ) : (
            <p className="mt-2 text-xs text-zinc-600">Enter a buy and sell price to see the math.</p>
          )}
        </div>
      )}
    </div>
  );
}
