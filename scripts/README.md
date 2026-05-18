# AnimalQuest data pipeline

One-shot batch scripts that build the per-state `elusiveness` data each
animal in `data.js` carries. The game itself never hits the network — these
scripts produce JSON that's spliced into `data.js` once, then committed.

## Running

Requires Node 18+ (uses global `fetch`). Run from the repo root:

```sh
# 1. Pull top-500 species per US state from iNaturalist (~5 min, 250 reqs).
node scripts/fetch-inat.mjs
#    Subset:  node scripts/fetch-inat.mjs CA OR WA

# 2. Bucket the counts into rarity tiers and emit a diff for review.
node scripts/merge-rarity.mjs

# 3. Once the diff looks sane, splice the tiers into data.js.
node scripts/merge-rarity.mjs --apply
```

## Outputs (gitignored)

- `scripts/data/inat-state-species.json` — raw fetched counts per state
- `scripts/data/inat-place-ids.json` — cached state→place_id lookups
- `scripts/data/elusiveness.json` — bucketed tiers per species
- `scripts/data/merge-diff.txt` — human-readable summary of the merge

## Bucketing rule

Per state, species are ranked by observation count, then placed by
percentile: top 20% = common, next 30% = uncommon, next 30% = rare,
next 15% = epic, bottom 5% = mythic. Species not in a state's top-N list
are omitted from that state's range entirely (treated as out-of-range by
the game, except for species marked `vagrantEligible: true` which are
scored as 2× mythic when spotted outside their range).
