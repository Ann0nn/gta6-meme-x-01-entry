// main.ts
// Hands the X post address to the grader: copies POST.json from the
// repository root into the output directory, creating it if needed.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

const source = join(repoRoot, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`POST.json not found at ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Confirm the copy is valid JSON with a url, so a broken POST.json
// fails loudly here instead of reaching the grader.
const post = JSON.parse(readFileSync(target, "utf8")) as { url?: unknown };
if (typeof post.url !== "string" || post.url.length === 0) {
  console.error(`POST.json at ${target} has no url`);
  process.exit(1);
}
console.log(`Wrote ${target} for ${post.url}`);
