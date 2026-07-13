#!/usr/bin/env node
'use strict';

/*
 * FRW shared-block sync
 *
 * Reads each canonical block in /blocks (a complete FRW:BEGIN..FRW:END fence)
 * and replaces the matching fence in every .html file in the repo root with
 * that canonical version. Everything outside a fence — including per-page
 * lines living just above a BEGIN marker — is left untouched.
 *
 * Usage:
 *   node scripts/sync-blocks.js            # apply changes
 *   node scripts/sync-blocks.js --dry-run  # report only, write nothing
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOCKS_DIR = path.join(ROOT, 'blocks');
const DRY_RUN = process.argv.includes('--dry-run');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

// Pull the block name out of a canonical block file's own BEGIN marker,
// rather than trusting the filename, so the fence name is always authoritative.
function parseBlockName(blockContent, fileName) {
  const m = blockContent.match(/<!--\s*FRW:BEGIN\s+([a-zA-Z0-9_-]+)\s+v\d+/);
  if (!m) {
    throw new Error(`${fileName}: could not find a FRW:BEGIN marker`);
  }
  return m[1];
}

function loadBlocks() {
  const files = fs.readdirSync(BLOCKS_DIR).filter((f) => f.endsWith('.html'));
  const blocks = [];
  for (const file of files) {
    const full = path.join(BLOCKS_DIR, file);
    const content = readFile(full);
    const name = parseBlockName(content, file);
    if (!content.includes(`<!-- FRW:END ${name} -->`)) {
      throw new Error(`${file}: missing matching FRW:END ${name} marker`);
    }
    blocks.push({ name, file, content: content.replace(/\n$/, '') });
  }
  return blocks;
}

// Directories to skip entirely — /blocks holds canonical masters (not live
// pages), /scripts has no HTML, and dotfolders / node_modules aren't ours.
const SKIP_DIRS = new Set(['blocks', 'scripts', 'node_modules']);

function targetHtmlFiles(dir = ROOT, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      targetHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// Matches an entire fence, including its own leading indentation, from
// "<indent><!-- FRW:BEGIN name v#  ... -->" through "<!-- FRW:END name -->".
function fenceRegex(name) {
  return new RegExp(
    '[ \\t]*<!-- FRW:BEGIN ' +
      name +
      ' v\\d+[\\s\\S]*?-->[\\s\\S]*?<!-- FRW:END ' +
      name +
      ' -->',
    'g'
  );
}

function main() {
  const blocks = loadBlocks();
  const files = targetHtmlFiles();
  let anyChanged = false;

  for (const filePath of files) {
    const fileName = path.relative(ROOT, filePath);
    let html = readFile(filePath);
    let fileChanged = false;

    for (const block of blocks) {
      const re = fenceRegex(block.name);
      const matches = html.match(re);
      if (!matches) continue; // this page doesn't have that block — skip

      for (const existing of matches) {
        if (existing !== block.content) {
          html = html.split(existing).join(block.content);
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      anyChanged = true;
      console.log(`${DRY_RUN ? '[dry-run] would update' : 'updated'}: ${fileName}`);
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, html, 'utf8');
      }
    }
  }

  if (!anyChanged) {
    console.log('No changes — all fenced blocks already match /blocks.');
  }
}

main();
