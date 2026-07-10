---
description: Pull manual Desktop-folder edits into the preview copy and refresh the live preview
---

The user has made manual edits directly in `/Users/basil/Desktop/FreeRange/Freerangewebsites` (outside this session) and wants those changes reflected everywhere. Do the following, in order, without asking for confirmation:

1. Run:
   ```
   rsync -a --delete --exclude '.git' --exclude '.claude' --exclude 'node_modules' \
     /Users/basil/Desktop/FreeRange/Freerangewebsites/ /Users/basil/frw-preview/
   ```
2. Check for a running preview server via `preview_list`. If one is running, reload it hard:
   `preview_eval` with expression `location.reload(true)`.
   If no server is running, don't start one unless the user has asked to see the preview.
3. Briefly confirm to the user what was synced (e.g. list any changed files if easy to tell, otherwise just confirm the sync + reload completed) — 1-2 sentences, no need for a full report.

Do not re-read every file from scratch unless the user also says which files they changed — if they mention specific files, re-read those before continuing any related work.
