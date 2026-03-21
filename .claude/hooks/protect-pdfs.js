#!/usr/bin/env node
/**
 * PostToolUse hook: Block writes to sample PDFs in docs/.
 * Cross-platform (Windows, macOS, Linux).
 */
const filePath = (process.env.CLAUDE_FILE_PATH || "").replace(
  /\\/g,
  "/"
);

if (/^docs\/.*\.pdf$/i.test(filePath) || filePath.includes("/docs/") && filePath.endsWith(".pdf")) {
  process.stderr.write(
    "BLOCKED: Do not modify sample PDFs in docs/\n"
  );
  process.exit(2);
}

process.exit(0);
