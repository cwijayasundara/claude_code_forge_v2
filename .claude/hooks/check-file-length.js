#!/usr/bin/env node
/**
 * PostToolUse hook: Warn on files exceeding 200 lines, BLOCK at 300 lines.
 * Enforces the "small, well-scoped modules" quality principle.
 * Runs on Python and TypeScript file Edit/Write.
 *
 * Thresholds:
 *   - WARN at 200 lines  → file is getting large, consider splitting
 *   - BLOCK at 300 lines → file must be split before proceeding
 *
 * Exceptions: test files, config files, generated files, type definition files.
 */
const fs = require("fs");
const path = require("path");

const filePath = process.env.CLAUDE_FILE_PATH || "";
const isPython = filePath.endsWith(".py");
const isTS = /\.tsx?$/.test(filePath);

if (!isPython && !isTS) process.exit(0);

// Skip files that are naturally long
const basename = path.basename(filePath);
const exceptions = [
  /^test_/,           // Python test files
  /\.test\./,         // TS test files
  /\.spec\./,         // TS spec files
  /conftest\.py$/,    // pytest fixtures
  /config\./,         // config files
  /\.d\.ts$/,         // type declarations
  /__init__\.py$/,    // Python init files
  /migrations?\//,    // DB migrations
];

if (exceptions.some((re) => re.test(filePath) || re.test(basename))) {
  process.exit(0);
}

let content;
try {
  content = fs.readFileSync(filePath, "utf-8");
} catch {
  process.exit(0);
}

const lineCount = content.split("\n").length;
const WARN_THRESHOLD = 200;
const BLOCK_THRESHOLD = 300;

if (lineCount > BLOCK_THRESHOLD) {
  const rel = path.relative(
    process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    filePath
  );
  process.stderr.write(
    `BLOCKED: ${rel} is ${lineCount} lines (max ${BLOCK_THRESHOLD}).\n` +
    `  Split into smaller modules — one file = one responsibility.\n` +
    `  See quality principle #1: "Small, well-scoped modules".\n`
  );
  process.exit(2);
} else if (lineCount > WARN_THRESHOLD) {
  const rel = path.relative(
    process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    filePath
  );
  process.stderr.write(
    `WARNING: ${rel} is ${lineCount} lines (threshold ${WARN_THRESHOLD}).\n` +
    `  Consider splitting before it reaches ${BLOCK_THRESHOLD} lines.\n`
  );
}

process.exit(0);
