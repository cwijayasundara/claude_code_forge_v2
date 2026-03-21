#!/usr/bin/env node
/**
 * PostToolUse hook: TypeScript typecheck on .ts/.tsx Edit/Write.
 * Cross-platform (Windows, macOS, Linux).
 */
const { execSync } = require("child_process");

const filePath = process.env.CLAUDE_FILE_PATH || "";
if (!/\.tsx?$/.test(filePath)) process.exit(0);

const projectDir =
  process.env.CLAUDE_PROJECT_DIR || process.cwd();

try {
  execSync("npx tsc --noEmit", {
    cwd: projectDir,
    stdio: "pipe",
  });
} catch (err) {
  // Report typecheck errors but don't block
  if (err.stderr) {
    process.stderr.write(err.stderr);
  }
  if (err.stdout) {
    process.stderr.write(err.stdout);
  }
}

process.exit(0);
