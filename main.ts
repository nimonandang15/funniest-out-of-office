// Entry for make.fun's "The Funniest Out-of-Office" (Node 22, standard
// library only). The entry is one out-of-office auto-reply, at most 140
// characters, written to /output/entry.txt, where the gate and the judge
// read it.
//
// The line: "I'm out of office until Monday. Your email has been forwarded
// to Future Me, who read it, sighed, and marked it unread again."
// — 124 characters. The setup is the most ordinary OOO sentence there is;
// the twist is who handles the mail: Future Me, who already read it,
// sighed at it, and marked it unread again — the inbox equivalent of
// walking past a chore and pretending not to see it. It sounds like a
// real person confessing how their own inbox actually works, and every
// word earns its place: the sigh is the whole joke.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const LINE =
  "I'm out of office until Monday. Your email has been forwarded to Future Me, who read it, sighed, and marked it unread again.";

// Runtime gate: the competition requires /output/entry.txt to be UTF-8
// text of 1–140 characters, not only whitespace, on a single line.
// Count code points (not UTF-16 units or bytes) so multi-byte characters
// are measured the way the gate counts them, and fail loudly before
// writing anything bad. No trailing newline: the file holds exactly the
// line, nothing else.
const codePoints = [...LINE];
if (codePoints.length < 1 || codePoints.length > 140) {
  throw new Error(`entry must be 1–140 characters, got ${codePoints.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, "entry.txt"), LINE, "utf8");

// Round-trip check: confirm what landed on disk is exactly what we wrote.
if (readFileSync(join(OUTPUT_DIR, "entry.txt"), "utf8") !== LINE) {
  throw new Error("round-trip check failed: entry.txt differs from LINE");
}
