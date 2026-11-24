// Funniest Autocorrect Fail — make.fun bounty entry
// u-zeroxfive-funniest-autocorrect-fail-ddf82154
//
// A tiny Node 22 program (no dependencies, no network) that writes one
// single-line autocorrect fail to <OUTPUT_DIR>/entry.txt and verifies it
// byte-for-byte. OUTPUT_DIR defaults to /output, the grader's path.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, a text to a partner, the slip visible inside it.
// Intended word: "condoms". Autocorrect's word: "condos". The second
// clause doubles down on the wrong word as if it were normal.
const ENTRY =
  "Babe, can you grab some condos on your way home? We're almost out.";

// The gate from the kit: 1 to 199 characters, one line, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 199;
const OUTPUT_FILE = "entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validateEntry(text: string): void {
  // Count Unicode code points, not UTF-16 code units or bytes, so the
  // length the judge sees matches what we check here.
  const chars = [...text];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    fail(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (text.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  // A stray leading or trailing space would be invisible in the file yet
  // change the judged text, so the entry must start and end with a
  // visible character.
  if (text !== text.trim()) {
    fail("entry must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line (no newline characters)");
  }
  // Control characters other than the ones above would break the "one line
  // of plain text" reading, so reject them outright. Also reject the
  // Unicode line/paragraph separators, which split a line for many readers
  // even though they are not \n.
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029) {
      fail(
        `entry contains a disallowed character (U+${code.toString(16).padStart(4, "0")})`,
      );
    }
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // Create the output directory if needed. Never remove it: the grader's
  // /output is a mount point and deleting it throws EBUSY.
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, OUTPUT_FILE);
  writeFileSync(outPath, ENTRY, "utf8");

  // Read the file back and verify it is byte-exact before declaring
  // success: compare the raw bytes, not just the decoded string, so a
  // stray BOM or trailing newline cannot slip through unnoticed.
  const writtenBytes = readFileSync(outPath);
  const expectedBytes = Buffer.from(ENTRY, "utf8");
  if (!writtenBytes.equals(expectedBytes)) {
    fail(`verification failed: ${outPath} does not match the entry text byte-for-byte`);
  }

  console.log(`wrote ${outPath} (${[...ENTRY].length} chars)`);
  console.log(ENTRY);
}

main();
