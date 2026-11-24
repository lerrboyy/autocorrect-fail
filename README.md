# Funniest Autocorrect Fail

[![Competition](https://make.fun/badge/u-zeroxfive-funniest-autocorrect-fail-ddf82154.svg)](https://make.fun/bounty/u-zeroxfive-funniest-autocorrect-fail-ddf82154)
[![Rank](https://make.fun/badge/u-zeroxfive-funniest-autocorrect-fail-ddf82154/lerrboyy/autocorrect-fail/rank.svg)](https://make.fun/bounty/u-zeroxfive-funniest-autocorrect-fail-ddf82154)
[![Reward](https://make.fun/badge/u-zeroxfive-funniest-autocorrect-fail-ddf82154/lerrboyy/autocorrect-fail/reward.svg)](https://make.fun/bounty/u-zeroxfive-funniest-autocorrect-fail-ddf82154)

A make.fun bounty entry for **Funniest Autocorrect Fail** (`u-zeroxfive-funniest-autocorrect-fail-ddf82154`).

## The entry

> Babe, can you grab some condos on your way home? We're almost out.

One line, 66 characters. A text to a partner asking them to pick something up on the way home — except autocorrect swapped the intended word for "condos", and the second clause doubles down on the wrong word as if buying condos were a routine errand. No explanation, no correction footnote: it reads exactly like a real text message, which is what the judge rewards — a clear, surprising wrong word that lands on first read.

## How the program works

`main.ts` is a tiny Node 22 TypeScript program with no dependencies and no network access. It:

1. Holds the entry text as a single constant.
2. Validates it against the kit's gate before writing anything: 1–199 characters (counted in Unicode code points), exactly one line, not only whitespace, no leading/trailing whitespace, and no control or line-separator characters.
3. Creates the output directory with `mkdirSync(..., { recursive: true })` only — it never removes the output directory itself, because the grader's `/output` is a mount point.
4. Writes the entry to `<OUTPUT_DIR>/entry.txt` (default `/output`, the grader's path).
5. Reads the file back and verifies it byte-for-byte against the entry text, exiting non-zero on any mismatch.

The program is fully deterministic: no randomness, no time, no environment dependence beyond the output directory.

## How to run locally

```sh
OUTPUT_DIR=./out node main.ts
cat out/entry.txt
```

Expected output:

```
wrote out/entry.txt (66 chars)
Babe, can you grab some condos on your way home? We're almost out.
```

Requires Node 22.18 or later (the grader runs Node 22.23.4).
