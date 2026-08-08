# Location page restructure — 8 August 2026

Covers Prompt B (v2) — restructuring the 20 pages in `locations/` and installing final copy. Prompt A (`/pricing` page) was already live before this pass started.

## Scope notes and deviations from the brief

- **`base-design.md` / StarterKit `CLAUDE.md`**: the prompt asked me to fetch `base-design.md` from a "StarterKit" repo via raw GitHub URL and later update that repo's `CLAUDE.md` with a banned-words section. No StarterKit repo reference exists anywhere in this codebase or its git remote, and there's no local `CLAUDE.md`. Per your instruction, I skipped both steps and worked from the type-scale variables already defined in `assets/css/styles.css` instead (documented under Task 4.3 below). Task 4.5 (persist banned words) is therefore **not done** — there is nowhere to persist it to.
- **`node` is not installed on this machine.** I could not literally run `node scripts/sync-blocks.js`. Instead I reimplemented its exact matching logic (same regex, same file walk, same skip-dirs) in Python and ran it against the repo — see Task 1.1/1.2 verification below. I'd recommend actually running the real script once Node is available, as a final sanity check.
- **Playwright is not set up in this repo.** Visual checks (Task 4.3) were done with the in-app browser preview (a local Python HTTP server + live DOM inspection) instead, per your direction.
- **Word-count targets**: the brief's target end state (~500–750 words for metro pages, ~900–1,100 for regional) assumes cuts beyond what Part 1 of the brief actually authorises. Hero, FAQ, nearby-suburbs and final-CTA are all explicitly "keep as is" / "leave untouched," and FAQ alone runs to roughly 400 words of markup. With only `#cost`, `#guarantee`, `#why-us` and `#examples` condensed and `#pricing` removed, metro pages land at ~910–955 words and regional pages at ~1,195–1,270 words — lower than before, but above the stated target. I did not cut into the untouched sections to force the number down, since that would contradict the explicit "leave completely untouched" / "keep as is" instructions. Flagging this rather than silently missing the target or silently violating scope.

## Task 1.1 / 1.2 — synced block removal

Both `<section class="sec pricing" id="pricing">` (with `FRW:BEGIN/END pricing`) and the `FRW:BEGIN/END guarantee` fence inside `<section class="sec guarantee" id="guarantee">` were removed from all 20 files.

`scripts/sync-blocks.js` walks the whole repo tree (skipping only `blocks/`, `scripts/`, `node_modules/`) and matches purely on `FRW:BEGIN <name> v# … FRW:END <name>` markers found in each file — there's no hardcoded file list to edit, so nothing further was needed there.

I reimplemented the script's exact regex/walk logic in Python (since Node isn't installed here) and confirmed:
- Zero files anywhere in the repo would be modified by a sync run (all remaining `pricing`/`guarantee` fences elsewhere — e.g. `pricing.html`, `web-design-melbourne.html` — already match their canonical `/blocks` source).
- None of the 20 location files contain a `pricing` or `guarantee` fence anymore, so there's nothing for the real sync script to re-inject on a future run.

The `#guarantee` id itself was **not** deleted — per the section-structure table (Guarantee → "Condense to summary + link," distinct from Pricing → "Remove entirely"), I removed the synced 6-card grid but kept a minimal, unsynced `<section id="guarantee">` holding the one-sentence summary required by Task 1.3.

## Task 1.3 — condensed sections

- **`#cost`**: reduced to two sentences — free build, $199/month, no lock-in — linking to `/pricing` with the rotated anchor text (below).
- **`#guarantee`**: reduced to one sentence, linking to `/pricing#guarantee`.
- **`#examples`**: reduced to one sentence, linking to `/#examples`.
- **`#why-us`**: reduced to two sentences (kept the "picks up the phone" differentiator, cut the repetition), then a third sentence linking to `/guides/diy-builder-vs-local-web-designer` — placed here since it's a natural contrast point ("us vs. DIY").

Regional pages (Ballarat, Bendigo, Geelong, Mildura, Mornington) use their existing "Melbourne-based, working with you remotely" framing rather than the metro "picks up the phone" heading, condensed the same way.

## Task 1.4 — anchor text rotation

| # | Page | Anchor text used |
|---|---|---|
| 1 | Ballarat | what the Care Plan covers |
| 2 | Bendigo | what it costs to keep it running |
| 3 | Bentleigh | the $199 plan in full |
| 4 | Berwick | how the pricing works |
| 5 | Blackburn | what you pay and when |
| 6 | Box Hill | the full pricing breakdown |
| 7 | Camberwell | what the Care Plan covers |
| 8 | Carnegie | what it costs to keep it running |
| 9 | Caulfield | the $199 plan in full |
| 10 | Cranbourne | how the pricing works |
| 11 | Dandenong | what you pay and when |
| 12 | Doncaster | the full pricing breakdown |
| 13 | Frankston | what the Care Plan covers |
| 14 | Geelong | what it costs to keep it running |
| 15 | Glen Waverley | the $199 plan in full |
| 16 | Malvern | how the pricing works |
| 17 | Mildura | what you pay and when |
| 18 | Mornington | the full pricing breakdown |
| 19 | Oakleigh | what the Care Plan covers |
| 20 | Ringwood | what it costs to keep it running |

Straight round-robin through the 6 variants in filename order — each variant used 3–4 times.

## Task 1.5 — schema

Checked `areaServed` on all 20 files before editing anything: every page already used the exact target format —
```json
{ "@type": "City", "name": "<Suburb>", "containedInPlace": { "@type": "State", "name": "Victoria" } }
```
No changes were required. `WebPage`, `FAQPage` and `BreadcrumbList` were left untouched, as instructed.

## Part 2 — final copy installation

All 20 `#local` sections were replaced with their Part 3 block verbatim, wrapped in `<!-- FRW:TRADEMIX-START <slug> --> … <!-- FRW:TRADEMIX-END <slug> -->` using the lowercase hyphenated filename slug. No copy was reworded, shortened, or "improved."

The five regional pages' `h3` subheadings needed styling — none existed in `assets/css/styles.css` before this pass. I added one rule following the existing type scale (`--text-xl`, the "card headings" step, one below `.sec-title`'s `--text-2xl`), white text to sit on the section's `var(--grape)` background, matching the weight/family of `.sec-title`:
```css
#local h3{font-family:var(--fh);font-weight:700;font-size:var(--text-xl);line-height:1.2;color:var(--white);margin:var(--space-4) 0 var(--space-2)}
```

All industry links in the installed copy resolve to real files in `industries/` (checked programmatically — see Task 4.2). All internal links across all 20 files are extensionless (checked programmatically — none had picked up `.html`).

## Task 4.1 — before/after report

"Unique words" = total word count of sentences that appear on only one of the 20 pages (same method as the 7 August audit: sentence-level uniqueness compared across the other 19 pages, then summed the words in the surviving unique sentences). This is directly comparable to the brief's "roughly 90–130 unique words" characterisation of the pre-pass state.

| Page | Words before | Words after | Unique words before | Unique words after | Unique sentences before | Unique sentences after | Outbound links before | Outbound links after | Pricing anchor text |
|---|---|---|---|---|---|---|---|---|---|
| Bentleigh | 1234 | 937 | 253 | 361 | 12 | 16 | 16 | 16 | the $199 plan in full |
| Berwick | 1244 | 955 | 261 | 379 | 12 | 17 | 16 | 16 | how the pricing works |
| Blackburn | 1241 | 927 | 273 | 365 | 13 | 17 | 16 | 17 | what you pay and when |
| Box Hill | 1273 | 933 | 306 | 372 | 13 | 16 | 16 | 16 | the full pricing breakdown |
| Camberwell | 1244 | 947 | 276 | 385 | 12 | 18 | 16 | 17 | what the Care Plan covers |
| Carnegie | 1240 | 919 | 259 | 341 | 12 | 16 | 16 | 20 | what it costs to keep it running |
| Caulfield | 1229 | 925 | 247 | 349 | 12 | 16 | 17 | 22 | the $199 plan in full |
| Cranbourne | 1244 | 942 | 261 | 366 | 12 | 17 | 15 | 16 | how the pricing works |
| Dandenong | 1239 | 936 | 258 | 360 | 12 | 15 | 16 | 17 | what you pay and when |
| Doncaster | 1250 | 944 | 287 | 383 | 14 | 18 | 16 | 18 | the full pricing breakdown |
| Frankston | 1242 | 944 | 274 | 382 | 13 | 18 | 16 | 21 | what the Care Plan covers |
| Glen Waverley | 1245 | 927 | 231 | 351 | 10 | 15 | 17 | 21 | the $199 plan in full |
| Malvern | 1231 | 932 | 268 | 371 | 14 | 17 | 16 | 18 | how the pricing works |
| Oakleigh | 1235 | 911 | 253 | 335 | 12 | 14 | 16 | 19 | what the Care Plan covers |
| Ringwood | 1249 | 937 | 282 | 373 | 14 | 19 | 15 | 17 | what it costs to keep it running |
| Ballarat (regional) | 1276 | 1239 | 258 | 598 | 10 | 32 | 15 | 21 | what the Care Plan covers |
| Bendigo (regional) | 1279 | 1215 | 261 | 572 | 10 | 28 | 15 | 20 | what it costs to keep it running |
| Geelong (regional) | 1283 | 1194 | 265 | 551 | 10 | 27 | 15 | 22 | what it costs to keep it running |
| Mildura (regional) | 1272 | 1270 | 254 | 629 | 10 | 31 | 15 | 19 | what you pay and when |
| Mornington (regional) | 1232 | 1209 | 218 | 598 | 10 | 33 | 16 | 25 | the full pricing breakdown |

**Every page cleared 300 unique words after the pass — none flagged.** The 15 metro pages roughly 40–70% more unique content than before (253–306 → 335–385 words); the 5 regional pages more than doubled (218–265 → 551–629 words), reflecting the much longer Part 3 copy for those five.

Total word count dropped on every page (pricing block removal alone accounts for most of that), while unique-sentence count rose on every page — the boilerplate-to-unique-content ratio moved in the intended direction even though total length didn't hit the brief's target band (see deviations note above).

## Task 4.2 — technical checks

All checked programmatically across all 20 files:

- ✅ Every modified/existing JSON-LD block parses as valid JSON.
- ✅ Every internal link is extensionless (no `.html` in any `href`).
- ✅ Every `/industries/...` link in the installed copy resolves to a real file.
- ✅ Every `/guides/...` link resolves (`diy-builder-vs-local-web-designer`).
- ✅ `sitemap.xml` — zero diff, unchanged by this pass.
- ✅ Canonicals on all 20 pages self-reference correctly (suburb slug matches filename).
- ✅ Pricing and guarantee blocks do not reappear — confirmed via a Python reimplementation of `sync-blocks.js`'s matching logic (see Task 1.1/1.2 note on why the real script couldn't be run directly).

## Task 4.3 — visual checks

Done via local HTTP server (`python3 -m http.server`, required because `includes.js` fetches header/footer partials — `file://` doesn't work) + live DOM inspection, in place of Playwright.

Checked `web-design-dandenong.html`, `web-design-camberwell.html`, `web-design-ballarat.html`, `web-design-mildura.html` at 375px, 768px and 1440px:

- **Horizontal scroll**: none at any width on any of the 4 pages (`scrollWidth === clientWidth` confirmed via JS at all three breakpoints).
- **Footer position at 1440px**: footer sits normally at the end of page content on all 4 (body height 5,200–6,400px vs. 900px viewport — no floating/detached footer).
- **`h3` rendering in `#local` on regional pages**: confirmed on Ballarat (2 h3s) and Mildura (3 h3s) — white text, 30px (`--text-xl`), weight 700, positioned correctly between paragraphs.
- **Spacing between condensed sections**: measured section boundaries via `getBoundingClientRect()` — `#cost`, `#local`, `#why-us`, `#guarantee` and `#examples` sit flush against each other with only their own `.sec` padding (40px on the checked breakpoints) between them; no unexpected gaps or overlaps. (An earlier screenshot-based check appeared to show a large blank gap — that turned out to be a stale/frozen screenshot after a scroll-timeout in the browser tool, not a real rendering issue; JS-measured geometry and `get_page_text` output both confirmed the content renders contiguously.)

## Outstanding (per the brief, unchanged by this pass)

1. Suburb-specific FAQ copy for the 20 location pages — not written, `#faq` left untouched.
2. Two new guides (website maintenance cost, website redesign) — not started.
3. The `sameAs` array on the Organization schema — pending directory citation URLs.
4. Task 4.5 (persist banned words to StarterKit `CLAUDE.md`) — not done; no StarterKit repo exists in this environment (see deviations note above).
