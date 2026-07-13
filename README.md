# Free Range Websites

Static HTML site. No build step, no framework — plain HTML/CSS/JS served as-is.

## Shared blocks

Four sections repeat identically across every page (`index.html`,
`websites-for-electricians.html`, and the industry pages to come): the
**guarantee** band, the **comparison** table, **how-it-works**, and
**pricing**. They stay hardcoded in every page's HTML (so crawlers see them
directly) but are kept in sync via a fence + script, not a JS include.

Each block is wrapped in matching markers:

```html
<!-- FRW:BEGIN pricing v1
     DO NOT EDIT HERE — this block is synced across all pages.
     Edit /blocks/pricing.html then run: node scripts/sync-blocks.js -->
...section markup...
<!-- FRW:END pricing -->
```

The canonical copy of each block lives in `/blocks` (`guarantee.html`,
`comparison.html`, `how-it-works.html`, `pricing.html`). Those files are not
fetched at runtime — they're master copies only.

**To edit a shared block:**

1. Edit the file in `/blocks` (never hand-edit inside a page's fence).
2. Preview the change: `node scripts/sync-blocks.js --dry-run`
3. Apply it: `node scripts/sync-blocks.js`

The script scans every `.html` file in the repo root, replaces the contents
between matching `FRW:BEGIN`/`FRW:END` markers with the canonical block, and
leaves everything outside the fences (including per-page lines like the
guarantee lead-in or the comparison intro sentence, which sit just above the
BEGIN marker) untouched.

**Adding a new page:** paste the four fences in from `/blocks`, add your
per-page content above each BEGIN marker, then run the sync script — future
edits to `/blocks` will reach the new page automatically.
