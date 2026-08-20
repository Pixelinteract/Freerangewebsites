# Free Range Websites — Location & Industry Page Linking + Templating Audit

**Date:** 2026-08-19
**Type:** Audit + proposal only. No page files were edited.
**Scope:** 2 location hubs, 20 suburb/town location pages, 1 industries index, 17 industry pages (**40 pages total**).
**Method:** RAW HTML only. The site-header and site-footer are injected client-side by `includes.js` via `fetch()`, so **all nav/footer links were treated as NOT present** (they do not exist in the raw HTML — the pages ship only `<div id="site-header">`/`<div id="site-footer">` placeholders).

---

## 1. Summary of findings

**The original hypothesis (pages are static-HTML orphans, reachable only via sitemap) is FALSE.** Every in-scope page already carries a curated static cross-link block (`<section class="xlink-sec">`) in its own HTML body. Result:

- **Orphans (zero static inbound): 0 of 40.** Every page has between 2 and 34 static inbound internal links. Discoverability via crawlable `<a>` links is therefore **not** the primary problem.
- **Templating IS a real problem: 39 of 40 pages fall below ~50% unique body content** (only the industries index passes). This is the most likely driver of "Discovered – currently not indexed": Google sees thin/duplicative pages and defers indexing. **This should be treated as the #1 cause, ahead of linking.**

Three genuine *linking* gaps remain, in priority order:

1. **Core authority pages pass no link equity down.** Home (`/`), `/pricing`, and `/about` contain **zero** static links to any hub, location, or industry page — every such link lives only in the JS footer. The three highest-authority pages on the site do not statically point at the 40 pages we want indexed.
2. **14 of 20 suburb pages get no inbound from industry pages.** Every industry page links to the **same 6 metro suburbs** (Blackburn, Box Hill, Camberwell, Doncaster, Glen Waverley, Ringwood). The other 14 suburbs — including all 4 regional towns (Ballarat, Bendigo, Geelong, Mildura) and 10 metro suburbs — receive **0** inbound from the 17 industry pages. Weakest page: **Mornington (inbound = 2)**.
3. **Industry ↔ industry linking is a full-list dump.** Every industry page links to all 16 other industries (identical 16-item pill list on every page). This is the "auto-generated full-list dump" the brief asks to avoid: it dilutes relevance signals and adds ~16 near-identical links to every page's boilerplate (feeding the templating problem in §2).

Secondary observations:

- **No visible/crawlable breadcrumb exists on any page.** A `BreadcrumbList` is present in JSON-LD on all 40 pages, but there is no clickable `<a>` breadcrumb trail in the HTML body. (Table 1 "breadcrumb" column = crawlable `<a>` breadcrumb.)
- **No authoritative outbound external links anywhere.** The only external links are 4 self-owned client demo sites on `*.pages.dev` (on the 2 hubs + all 17 industry pages). Suburb pages have no external links at all. There are currently **no** gov/licensing/industry-association outbound links — the opportunity Task 3 was scoping.

---

## 2. Table 1 — Static internal link graph

- **Inbound** = static `<a>` links pointing TO this page from other in-scope pages **and** from core pages (home, pricing, about, the two hubs, industries index). JS-injected footer/nav excluded.
- **Breadcrumb (Y/N)** = a visible, crawlable `<a>` breadcrumb trail in static HTML. *(All 40 have a JSON-LD `BreadcrumbList`, but none have a crawlable one — hence all N.)*
- **Related block** = a curated cross-link section in static HTML (`class="xlink-sec"`).

| Page | Static inbound | Static outbound | Orphan | Breadcrumb (crawlable) | Related block |
|---|---:|---:|:---:|:---:|:---:|
| /web-design-melbourne (hub) | 34 | 21 | N | N | Y |
| /web-design-regional-victoria (hub) | 5 | 5 | N | N | Y |
| /locations/web-design-ballarat | 5 | 16 | N | N | Y |
| /locations/web-design-bendigo | 5 | 15 | N | N | Y |
| /locations/web-design-bentleigh | 6 | 11 | N | N | Y |
| /locations/web-design-berwick | 4 | 11 | N | N | Y |
| /locations/web-design-blackburn | 22 | 12 | N | N | Y |
| /locations/web-design-box-hill | 23 | 11 | N | N | Y |
| /locations/web-design-camberwell | 22 | 12 | N | N | Y |
| /locations/web-design-carnegie | 7 | 15 | N | N | Y |
| /locations/web-design-caulfield | 7 | 17 | N | N | Y |
| /locations/web-design-cranbourne | 4 | 11 | N | N | Y |
| /locations/web-design-dandenong | 4 | 12 | N | N | Y |
| /locations/web-design-doncaster | 23 | 13 | N | N | Y |
| /locations/web-design-frankston | 4 | 16 | N | N | Y |
| /locations/web-design-geelong | 5 | 17 | N | N | Y |
| /locations/web-design-glen-waverley | 22 | 16 | N | N | Y |
| /locations/web-design-malvern | 5 | 13 | N | N | Y |
| /locations/web-design-mildura | 5 | 14 | N | N | Y |
| /locations/web-design-mornington | **2** | 20 | N | N | Y |
| /locations/web-design-oakleigh | 6 | 14 | N | N | Y |
| /locations/web-design-ringwood | 21 | 12 | N | N | Y |
| /industries/ (hub) | 17 | 17 | N | N | N* |
| /industries/websites-for-air-conditioning | 24 | 24 | N | N | Y |
| /industries/websites-for-beauty-salons | 23 | 24 | N | N | Y |
| /industries/websites-for-builders | 30 | 24 | N | N | Y |
| /industries/websites-for-cleaners | 23 | 24 | N | N | Y |
| /industries/websites-for-concreters | 25 | 24 | N | N | Y |
| /industries/websites-for-electricians | 33 | 24 | N | N | Y |
| /industries/websites-for-fencing | 26 | 24 | N | N | Y |
| /industries/websites-for-hairdressers | 23 | 24 | N | N | Y |
| /industries/websites-for-landscapers | 30 | 24 | N | N | Y |
| /industries/websites-for-locksmiths | 20 | 24 | N | N | Y |
| /industries/websites-for-mechanics | 21 | 24 | N | N | Y |
| /industries/websites-for-painters | 32 | 24 | N | N | Y |
| /industries/websites-for-personal-trainers | 21 | 24 | N | N | Y |
| /industries/websites-for-pest-control | 21 | 24 | N | N | Y |
| /industries/websites-for-plumbers | 30 | 24 | N | N | Y |
| /industries/websites-for-roofers | 26 | 24 | N | N | Y |
| /industries/websites-for-tilers | 23 | 24 | N | N | Y |

\* The industries index is itself the hub list of all industries, so it has no separate "related" block.

**Inbound composition (how the counts break down):**

- **6 "wired" metro suburbs** (Blackburn, Box Hill, Camberwell, Doncaster, Glen Waverley, Ringwood): inbound 21–23, of which **17 come from every industry page** linking the same 6 suburbs.
- **14 "starved" suburbs** (Ballarat, Bendigo, Bentleigh, Berwick, Carnegie, Caulfield, Cranbourne, Dandenong, Frankston, Geelong, Malvern, Mildura, Mornington, Oakleigh): inbound 2–7, **0 from industry pages** — only nearby-suburb sibling links + hub(s).
- **Industry pages**: inbound 20–33 = 16 from sibling industries (the full-list dump) + `/industries/` hub + a variable number of location pages (3–16). Electricians (33) and Painters (32) are the most-linked; Locksmiths (20) the least.
- **Core pages contribute 0 inbound to every page** — home/pricing/about link to none of the 40 statically.

---

## 3. Table 2 — Content uniqueness / templating

**Method (stated for honesty):** For each page, body text was extracted from raw HTML with `<script>`, `<style>`, `<svg>`, and the header/footer placeholders removed. Text was tokenised into 5-word shingles; a shingle counts as **boilerplate** if it appears on ≥3 pages *of the same type* (location vs industry). "Estimated unique %" = share of a page's shingles that are **not** boilerplate. This is an estimate of *intra-cluster* templating; absolute values depend on the method, but the **relative ranking and the at-risk threshold (~50%) are robust**. At-risk = below ~50% unique.

| Page | Approx words | Est. unique % | At risk | Main repeated boilerplate blocks |
|---|---:|---:|:---:|---|
| /industries/ (hub) | 1,285 | 99.1 | N | (unique hub listing) |
| /web-design-melbourne (hub) | 1,550 | 67.4 | N | Guarantee, examples/showcase, FAQ scaffold, final CTA |
| /web-design-regional-victoria (hub) | 1,293 | 59.2 | N | Guarantee, examples/showcase, FAQ scaffold, final CTA |
| /locations/web-design-mornington | 1,236 | 41.4 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-mildura | 1,300 | 40.4 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-ballarat | 1,266 | 38.6 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-bendigo | 1,242 | 37.3 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-geelong | 1,225 | 36.3 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-berwick | 985 | 25.9 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-frankston | 973 | 25.1 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-cranbourne | 969 | 24.7 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-doncaster | 970 | 24.7 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-bentleigh | 965 | 24.2 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-box-hill | 960 | 24.2 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-ringwood | 966 | 24.2 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-malvern | 959 | 24.1 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-dandenong | 963 | 23.8 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-caulfield | 959 | 23.7 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-blackburn | 955 | 23.6 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-glen-waverley | 958 | 23.4 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-camberwell | 976 | 24.8 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-carnegie | 950 | 22.8 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /locations/web-design-oakleigh | 940 | 22.0 | Y | why-us, guarantee, showcase, FAQ, xlink, CTA |
| /industries/websites-for-personal-trainers | 2,742 | 25.9 | Y | Guarantee, compare table, how-it-works, pricing, FAQ scaffold, 16-item xlink dump, CTA |
| /industries/websites-for-cleaners | 2,782 | 24.8 | Y | (as above) |
| /industries/websites-for-pest-control | 2,788 | 24.8 | Y | (as above) |
| /industries/websites-for-hairdressers | 2,768 | 24.6 | Y | (as above) |
| /industries/websites-for-electricians | 2,929 | 24.5 | Y | (as above) |
| /industries/websites-for-beauty-salons | 2,737 | 24.2 | Y | (as above) |
| /industries/websites-for-builders | 2,928 | 23.9 | Y | (as above) |
| /industries/websites-for-landscapers | 2,923 | 23.7 | Y | (as above) |
| /industries/websites-for-concreters | 2,852 | 23.6 | Y | (as above) |
| /industries/websites-for-plumbers | 2,878 | 23.5 | Y | (as above) |
| /industries/websites-for-mechanics | 2,764 | 23.1 | Y | (as above) |
| /industries/websites-for-fencing | 2,777 | 22.8 | Y | (as above) |
| /industries/websites-for-painters | 2,894 | 22.0 | Y | (as above) |
| /industries/websites-for-tilers | 2,790 | 21.6 | Y | (as above) |
| /industries/websites-for-roofers | 2,858 | 21.6 | Y | (as above) |
| /industries/websites-for-locksmiths | 2,786 | 21.7 | Y | (as above) |
| /industries/websites-for-air-conditioning | 2,865 | 21.2 | Y | (as above) |

**At risk: 39 of 40.** Only `/industries/` passes.

**Which blocks drive the similarity (targeted fix guidance):**

- **Location pages** — unique per page: the H1 hero, "What does web design in *{Town}* cost?" intro, "The businesses we build for around *{Town}*", "The trades that stay busiest here", "What changes when a *{Town}* business gets a website". Shared verbatim across all 20: the **"Melbourne-based, working with you remotely" (why-us)** block, the **guarantee** block, the **examples/showcase**, the **FAQ scaffold**, the **xlink** block, and the **final CTA**. Metro suburb pages (~950 words) are the thinnest; the 5 regional/outer pages (~1,230–1,300 words) carry more unique text and score highest.
- **Industry pages** — unique per page: the H1 hero, "What does a website for a *{trade}* actually cost?", the "Why nobody's finding your website" problem block, the trade-specific services list, and one bespoke section (e.g. EV chargers on electricians). Shared verbatim across all 17: the **guarantee ("Here's exactly what you get")**, **examples/showcase**, **"How we compare to agencies and freelancers" table**, **"four simple steps" how-it-works**, **pricing**, **FAQ scaffold**, the **16-item industry xlink dump**, and the **final CTA**. Because these pages are long (~2,800 words) and the shared scaffold is large, unique share lands ~21–26% despite each page having genuinely bespoke hero/problem/services copy.

---

## 4. Table 3 — Existing outbound external links

| Page group | External targets (static HTML) | Authoritative / relevant? |
|---|---|---|
| 2 hubs (Melbourne, Regional VIC) + all 17 industry pages | `bentleighcharcoal.pages.dev`, `carrollscoatings.pages.dev`, `caulfieldace.pages.dev`, `focuson-370.pages.dev` | Self-owned client demo sites (portfolio examples). **Not** third-party authoritative. Fine as showcase; contribute nothing as authority/citation signals. |
| 20 suburb/town location pages | *(none)* | — |
| /industries/ index | *(none)* | — |

**Also present (internal, out-of-scope but worth noting as existing cross-links):** every page links to `/contact` and `/get-started`; every location page and the industries index also link into `/guides/` (e.g. `/guides/diy-builder-vs-local-web-designer/`, `/guides/website-cost-for-tradies/`).

**Gap for Task 3's purpose:** there are currently **no** outbound links to authoritative gov/licensing/industry-association sources on any in-scope page. Adding 1–2 relevant citations per page type (see §5.6) would add trust signals and a small uniqueness boost.

---

## 5. Proposed cross-linking map (proposal only — no edits made)

All proposed links must be added to each page's **own static HTML body**, never to `includes.js`. Existing `xlink-sec` blocks already satisfy much of the hub/spoke and spoke↔spoke wiring; the proposals below are **additive/corrective**, focused on the three gaps in §1. Target: **2–4 contextual in-body links + one curated related block (3–5 links) per page**, no full-list dumps.

### 5.1 Fix the core-page gap (highest impact, smallest effort — 3 pages)

Add a curated static block to the three authority pages (currently 0 static downlinks each):

- **`/` (home):** add a "Where we work / What we build" block →  `/web-design-melbourne`, `/web-design-regional-victoria`, `/industries/`, plus 3–4 flagship industry pages (`websites-for-electricians`, `websites-for-plumbers`, `websites-for-builders`, `websites-for-landscapers`). *(These already appear in the JS footer, but need a crawlable static instance.)*
- **`/pricing`:** 1 contextual link to `/industries/` and 1 to `/web-design-melbourne`.
- **`/about`:** 1 contextual link to `/web-design-melbourne` and 1 to `/web-design-regional-victoria`.

### 5.2 Convert the industry→suburb block from "same 6 metro" to a rotating relevant set (17 pages)

Each industry page currently links the **same 6 metro suburbs**. Replace with a curated **5-suburb** set that (a) varies across industries and (b) collectively covers all 20 suburbs, so every suburb gains ≥3 inbound industry links. Suggested allocation so the 14 currently-starved suburbs get coverage:

- Rotate regional towns (Ballarat, Bendigo, Geelong, Mildura) onto the industry pages whose trade the town page already features (e.g. Ballarat features builders/plumbers/electricians/roofers → have those industry pages link back to Ballarat).
- Rotate outer/other metro suburbs (Bentleigh, Berwick, Carnegie, Caulfield, Cranbourne, Dandenong, Frankston, Malvern, Mornington, Oakleigh) across the remaining industry pages.
- Keep it curated (5 links, trade-relevant), not a 20-item dump.

### 5.3 Replace the 16-item industry↔industry dump with a curated "related trades" set (17 pages)

For each industry page, keep only **3–5 genuinely related trades** in the related block instead of all 16, e.g.:

- Electricians → Plumbers, Air Conditioning, Builders, Solar/Roofers *(+ "See every trade →" to `/industries/`)*
- Plumbers → Electricians, Builders, Roofers, Concreters
- Painters → Plasterers/Builders, Tilers, Roofers, Fencing
- Landscapers → Fencing, Concreters, Builders
- Hairdressers → Beauty Salons, Personal Trainers
- Mechanics → (few natural neighbours) Locksmiths, Air Conditioning

Keep the single `/industries/` "see every trade" link for full discoverability. Net effect: relevance-weighted links, ~12 fewer boilerplate links per page (helps §2 templating).

### 5.4 Spoke → hub (already largely in place — verify only)

Every location page already links to its hub (`/web-design-melbourne` or `/web-design-regional-victoria`) and every industry page links to `/industries/` + `/web-design-melbourne`. **Recommended addition:** a crawlable breadcrumb (§5.5) gives a second, top-of-page hub link with clear hierarchy.

### 5.5 Add a visible, crawlable breadcrumb to all 40 pages

Currently breadcrumb exists only in JSON-LD. Add a static `<nav aria-label="Breadcrumb">` near the top:

- Location suburb: `Home › Web design Melbourne (or Regional VIC) › {Town}`
- Industry: `Home › Industries › Websites for {trade}`
- Hubs: `Home › {Hub}`

This adds a consistent, crawlable spoke→hub→home path on every page.

### 5.6 Authoritative external links (Task 3 follow-up — optional, 1–2 per page type)

Candidates to add later (after Baz confirms targets): state licensing/registration bodies (e.g. VBA for builders, Energy Safe Victoria for electricians, VBA/plumbing for plumbers), and business.gov.au / ABR for general small-business pages. 1 relevant citation per industry page, 1 per location hub.

### 5.7 Per-page proposed additions (review list)

Delta only — what to ADD beyond what each page already has. "Related block" = the curated 3–5 link section.

**Core pages**
- `/` → add static block: `/web-design-melbourne`, `/web-design-regional-victoria`, `/industries/`, `/industries/websites-for-electricians`, `/industries/websites-for-plumbers`, `/industries/websites-for-builders`
- `/pricing` → `/industries/`, `/web-design-melbourne`
- `/about` → `/web-design-melbourne`, `/web-design-regional-victoria`

**Location hubs**
- `/web-design-melbourne` → (already links all 20 metro-ish suburbs + regional hub; healthy) add 2 contextual body links to popular industries: `/industries/websites-for-electricians`, `/industries/websites-for-plumbers`
- `/web-design-regional-victoria` → currently links only 4 regional towns; add contextual links to `/industries/` and 2 popular industries; confirm all 4 regional towns present (Ballarat, Bendigo, Geelong, Mildura ✓)

**Starved suburbs — ensure ≥3 inbound industry links via §5.2, plus keep existing sibling/hub links.** Priority order by current inbound: Mornington (2), Berwick/Cranbourne/Dandenong/Frankston (4), Ballarat/Bendigo/Geelong/Malvern/Mildura (5), Bentleigh/Oakleigh (6), Carnegie/Caulfield (7).
- Ballarat ← builders, plumbers, electricians, roofers, painters (industries it already features)
- Bendigo ← builders, concreters, electricians, plumbers, painters
- Geelong ← builders, landscapers, roofers, electricians, plumbers
- Mildura ← electricians, plumbers, painters, air-conditioning, roofers
- Bentleigh ← electricians, plumbers, painters, builders
- Berwick ← landscapers, fencing, concreters, air-conditioning
- Carnegie ← builders, painters, plumbers, cleaners
- Caulfield ← electricians, plumbers, cleaners, locksmiths
- Cranbourne ← landscapers, fencing, concreters, builders
- Dandenong ← electricians, mechanics, cleaners, fencing
- Frankston ← roofers, painters, plumbers, electricians
- Malvern ← builders, painters, tilers, landscapers
- Mornington ← plumbers, electricians, roofers, painters, cleaners
- Oakleigh ← builders, electricians, plumbers, mechanics
- *(The 6 wired suburbs — Blackburn, Box Hill, Camberwell, Doncaster, Glen Waverley, Ringwood — already have strong inbound; they can be rotated OUT of some industry pages to make room for the above without dropping below ~10 inbound.)*

**Industry pages (all 17)** — two changes each:
1. Trim industry related block to 3–5 relevant trades (§5.3) + keep `/industries/`.
2. Swap the fixed 6-metro suburb block for a curated 5-suburb relevant set per §5.2/§5.7 so coverage spreads across all 20 suburbs.

---

## 6. Prioritised recommendations

1. **Reduce templating on the 39 at-risk pages (biggest indexing lever).** Add/expand genuinely unique copy in the per-page sections identified in §3, and shrink shared scaffolding where possible. For industry pages, the 16-item link dump and repeated compare/guarantee/how-it-works blocks are the largest duplicative mass — trimming the link dump (§5.3) helps here too. Thin metro suburb pages (~950 words, ~22–25% unique) are the most exposed; prioritise adding unique local detail there.
2. **Add crawlable static downlinks from `/`, `/pricing`, `/about` (§5.1).** Smallest effort, and it puts the highest-authority pages behind the 40 targets for the first time.
3. **Spread industry→suburb links across all 20 suburbs (§5.2).** Fixes the 14 starved suburbs, especially Mornington (2) and the four regional towns.
4. **Replace industry↔industry full-list dumps with curated related-trade sets (§5.3).** Improves relevance signals and reduces boilerplate.
5. **Add a visible crawlable breadcrumb to all 40 pages (§5.5).** Cheap, uniform spoke→hub→home reinforcement; complements the existing JSON-LD.
6. **Later: add 1–2 authoritative external citations per page type (§5.6).** Trust signal + minor uniqueness gain.

**Note on cause:** Because there are **no static orphans**, the "Discovered – currently not indexed" backlog is most consistent with **thin/templated content (item 1)** plus **weak link equity from authority pages (item 2)** — not broken discoverability. Recommend tackling 1 and 2 first and re-checking GSC before investing further in link-graph changes.

---

*Prepared as an audit + proposal. No existing page files were modified. Baz to review before any implementation prompt is written.*
