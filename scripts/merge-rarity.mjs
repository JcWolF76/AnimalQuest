#!/usr/bin/env node
/* merge-rarity.mjs — Turn fetched iNat counts into per-species elusiveness.
 *
 * Reads:  scripts/data/inat-state-species.json   (from fetch-inat.mjs)
 *         data.js                                (the live game data)
 * Writes: scripts/data/elusiveness.json          (intermediate, reviewable)
 *         scripts/data/merge-diff.txt            (human-readable diff)
 *
 * The script does NOT auto-edit data.js. Review the diff first, then run
 * with --apply to splice elusiveness blocks into data.js in-place.
 *
 *   node scripts/merge-rarity.mjs              # dry run, write JSON + diff
 *   node scripts/merge-rarity.mjs --apply      # also edit data.js
 *
 * Bucketing rule (per state, over species we have count data for):
 *   rank-percentile  → tier
 *     0–20%          → common
 *    20–50%          → uncommon
 *    50–80%          → rare
 *    80–95%          → epic
 *    95–100%         → mythic
 * Species not present in a state's top-N list → omitted (= out of range).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_JS   = resolve(__dirname, '..', 'data.js');
const IN_FILE   = resolve(__dirname, 'data', 'inat-state-species.json');
const ELUS_OUT  = resolve(__dirname, 'data', 'elusiveness.json');
const DIFF_OUT  = resolve(__dirname, 'data', 'merge-diff.txt');

const TIER_CUTS = [
    { tier: 'common',   pct: 0.20 },
    { tier: 'uncommon', pct: 0.50 },
    { tier: 'rare',     pct: 0.80 },
    { tier: 'epic',     pct: 0.95 },
    { tier: 'mythic',   pct: 1.00 }
];

const APPLY = process.argv.includes('--apply');

if (!existsSync(IN_FILE)) {
    console.error(`Missing ${IN_FILE}. Run scripts/fetch-inat.mjs first.`);
    process.exit(1);
}

const require = createRequire(import.meta.url);
const D = require(DATA_JS);

const raw = JSON.parse(readFileSync(IN_FILE, 'utf8'));

// Build a per-state lookup: scientific name (lowercased) → rank (1-based).
const stateRanks = {};
for (const [state, payload] of Object.entries(raw)) {
    const map = new Map();
    (payload.species || []).forEach((s, i) => {
        if (s.name) map.set(s.name.toLowerCase(), { rank: i + 1, count: s.count });
    });
    stateRanks[state] = { total: payload.species?.length || 0, map };
}

function tierForRank(rank, total) {
    if (!total || !rank) return null;
    const pct = rank / total;          // smaller pct = more common
    for (const cut of TIER_CUTS) {
        if (pct <= cut.pct) return cut.tier;
    }
    return 'mythic';
}

// Build elusiveness blocks per animal.
const elusiveness = {};
const diffLines = [];
let hits = 0, misses = 0;

for (const a of D.ANIMALS) {
    if (a.setting === 'zoo') continue;
    if (!a.scientific) continue;
    const key = a.scientific.toLowerCase();
    const perState = {};
    for (const [state, { total, map }] of Object.entries(stateRanks)) {
        const entry = map.get(key);
        if (!entry) continue;
        const tier = tierForRank(entry.rank, total);
        if (tier) perState[state] = tier;
    }
    if (Object.keys(perState).length) {
        elusiveness[a.id] = perState;
        hits++;
        diffLines.push(
            `${a.id.padEnd(38)} ${a.scientific.padEnd(36)} `
            + `${Object.keys(perState).length} states `
            + `[${summarizeTiers(perState)}]`
        );
    } else {
        misses++;
        diffLines.push(`${a.id.padEnd(38)} ${a.scientific.padEnd(36)} — no iNat matches`);
    }
}

function summarizeTiers(perState) {
    const counts = {};
    for (const t of Object.values(perState)) counts[t] = (counts[t] || 0) + 1;
    return ['common','uncommon','rare','epic','mythic']
        .filter(t => counts[t])
        .map(t => `${t.slice(0,3)}:${counts[t]}`)
        .join(' ');
}

writeFileSync(ELUS_OUT, JSON.stringify(elusiveness, null, 2));
writeFileSync(DIFF_OUT, [
    `# AnimalQuest elusiveness merge — ${new Date().toISOString()}`,
    `# matched: ${hits}   unmatched: ${misses}   states: ${Object.keys(stateRanks).length}`,
    ``,
    ...diffLines
].join('\n'));

console.log(`Matched ${hits} species, missed ${misses}.`);
console.log(`Wrote ${ELUS_OUT}`);
console.log(`Wrote ${DIFF_OUT}`);

if (!APPLY) {
    console.log('\nDry run. Review the diff above, then re-run with --apply to splice into data.js.');
    process.exit(0);
}

// ── Apply: splice elusiveness:{...} into each ANIMALS entry in data.js ──
let src = readFileSync(DATA_JS, 'utf8');
let edited = 0;
for (const [id, perState] of Object.entries(elusiveness)) {
    const block = JSON.stringify(perState).replace(/"([A-Z]{2})":/g, '$1:');
    const idLiteral = `id:'${id}'`;
    const lineRe = new RegExp(`(\\{[^\\n]*?${escapeRe(idLiteral)}[^\\n]*?)(\\s*\\})`, 'm');
    const m = src.match(lineRe);
    if (!m) continue;
    if (/elusiveness:\s*\{/.test(m[1])) {
        // Replace existing elusiveness block.
        const replaced = m[1].replace(/elusiveness:\s*\{[^}]*\}/, `elusiveness:${block}`);
        src = src.replace(m[0], replaced + m[2]);
    } else {
        // Insert before the closing brace.
        src = src.replace(m[0], `${m[1]}, elusiveness:${block}${m[2]}`);
    }
    edited++;
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

writeFileSync(DATA_JS, src);
console.log(`\nApplied: edited ${edited} animal entries in data.js`);
