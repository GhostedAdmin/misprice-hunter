'use client';

import { useState } from 'react';

const CODE = 'VAULT';

/**
 * Partner promo banner for CrownCards. Shows the ambassador code big and
 * copies it to the clipboard on tap — the code is redeemed in the app's
 * Refer tab, so no external link is needed.
 */
export default function CrownCardsBanner() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
    } catch {
      /* clipboard unavailable — the code is visible to type in manually */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/50 bg-[#121214] p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0 flex-1 basis-64">
          <span className="inline-block rounded-md border border-amber-400/40 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300">
            🎴 Partner · Basemint Vault
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-[26px]">
            Get a <span className="text-amber-400">FREE pack</span> on CrownCards
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Rip digital packs with real card imagery — Pokémon, sports, grails.
            Download CrownCards on iOS or Android, open the Refer tab, and
            enter the ambassador code for a free pack.
          </p>
          <button
            onClick={copyCode}
            aria-label="Copy ambassador code VAULT"
            className="mt-3 inline-block rounded-lg border border-dashed border-amber-400/60 bg-black px-5 py-2 text-lg font-extrabold tracking-[0.25em] text-amber-300 transition-colors hover:border-amber-300"
          >
            {copied ? '✓ COPIED!' : CODE}
          </button>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            onClick={copyCode}
            className="rounded-[10px] bg-amber-400 px-8 py-3.5 text-[17px] font-extrabold text-black transition-colors hover:bg-amber-300"
          >
            {copied ? 'Code copied ✓' : 'Copy my free-pack code'}
          </button>
          <p className="text-xs text-zinc-500">
            Enter code VAULT at signup · First pack&apos;s on the house
          </p>
        </div>
      </div>
    </div>
  );
}
