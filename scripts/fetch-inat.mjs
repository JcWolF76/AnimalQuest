#!/usr/bin/env node
/* fetch-inat.mjs — Pull per-state species observation counts from iNaturalist.
 *
 * Run locally (this repo's CI env blocks api.inaturalist.org):
 *   node scripts/fetch-inat.mjs           # all 50 states
 *   node scripts/fetch-inat.mjs CA OR WA  # subset
 *
 * Output: scripts/data/inat-state-species.json
 *   { "CA": { generatedAt, totalSpecies, species: [{taxonId, name, count}, ...] }, ... }
 *
 * Strategy: for each state, hit /v1/observations/species_counts with the
 * state's iNat place_id, paginating up to TOP_N. Bucketing happens later
 * in merge-rarity.mjs — this script only fetches raw data.
 *
 * iNat asks API users to rate-limit themselves to ~60 req/min. We do 1
 * req/sec, plus a polite UA. Total: 50 states × 5 pages = 250 requests
 * ≈ 4–5 minutes.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = resolve(__dirname, 'data');
const OUT_FILE  = resolve(OUT_DIR, 'inat-state-species.json');
const CACHE_FILE = resolve(OUT_DIR, 'inat-place-ids.json');

const TOP_N     = 500;
const PER_PAGE  = 100;
const SLEEP_MS  = 1100;
const UA        = 'AnimalQuest/0.1 (https://github.com/jcwolf76/AnimalQuest)';

const STATE_NAMES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
    CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
    FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
    IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
    KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
    NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
    NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
    OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
    VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
    WI: 'Wisconsin', WY: 'Wyoming'
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getJson(url) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    return res.json();
}

async function loadPlaceIdCache() {
    if (!existsSync(CACHE_FILE)) return {};
    try { return JSON.parse(readFileSync(CACHE_FILE, 'utf8')); }
    catch { return {}; }
}

function savePlaceIdCache(cache) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Resolve a state name (e.g. "California") to its iNat place_id by hitting
// /v1/places/autocomplete and picking the best US-administrative match.
async function resolvePlaceId(stateName, cache) {
    if (cache[stateName]) return cache[stateName];
    const url = `https://api.inaturalist.org/v1/places/autocomplete?q=${encodeURIComponent(stateName)}`;
    const data = await getJson(url);
    const candidates = (data.results || []).filter(p =>
        p.admin_level === 1 && p.name === stateName
        && (p.ancestor_place_ids || []).includes(1)   // 1 = United States in iNat
    );
    const pick = candidates[0] || (data.results || [])[0];
    if (!pick) throw new Error(`No iNat place_id found for ${stateName}`);
    cache[stateName] = pick.id;
    savePlaceIdCache(cache);
    await sleep(SLEEP_MS);
    return pick.id;
}

async function fetchTopSpecies(placeId) {
    const pages = Math.ceil(TOP_N / PER_PAGE);
    const all = [];
    for (let page = 1; page <= pages; page++) {
        const url = `https://api.inaturalist.org/v1/observations/species_counts`
            + `?place_id=${placeId}`
            + `&per_page=${PER_PAGE}`
            + `&page=${page}`
            + `&verifiable=true&quality_grade=research`;
        const data = await getJson(url);
        const results = data.results || [];
        for (const r of results) {
            all.push({
                taxonId: r.taxon?.id,
                name: r.taxon?.name,                   // scientific name (binomial)
                rank: r.taxon?.rank,
                common: r.taxon?.preferred_common_name || null,
                count: r.count
            });
        }
        if (results.length < PER_PAGE) break;
        await sleep(SLEEP_MS);
    }
    return all;
}

async function main() {
    const argStates = process.argv.slice(2)
        .map(s => s.toUpperCase())
        .filter(s => STATE_NAMES[s]);
    const targets = argStates.length ? argStates : Object.keys(STATE_NAMES);

    mkdirSync(OUT_DIR, { recursive: true });
    const placeCache = await loadPlaceIdCache();

    // Load any existing output so partial reruns merge in.
    let out = {};
    if (existsSync(OUT_FILE)) {
        try { out = JSON.parse(readFileSync(OUT_FILE, 'utf8')); } catch {}
    }

    let i = 0;
    for (const code of targets) {
        i++;
        const name = STATE_NAMES[code];
        process.stdout.write(`[${i}/${targets.length}] ${code} ${name} … `);
        try {
            const placeId = await resolvePlaceId(name, placeCache);
            const species = await fetchTopSpecies(placeId);
            out[code] = {
                generatedAt: new Date().toISOString(),
                placeId,
                totalSpecies: species.length,
                species
            };
            writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));
            console.log(`${species.length} species (place_id ${placeId})`);
        } catch (err) {
            console.log(`FAIL: ${err.message}`);
        }
        await sleep(SLEEP_MS);
    }

    console.log(`\nWrote ${OUT_FILE}`);
    console.log('Next: node scripts/merge-rarity.mjs');
}

main().catch(err => { console.error(err); process.exit(1); });
