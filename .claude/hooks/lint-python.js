#!/usr/bin/env node
/**
 * PostToolUse hook: Auto-lint + format Python files on Edit/Write.
 * Cross-platform (Windows, macOS, Linux).
 */
const { execSync } = require("child_process");
const path = require("path");

const filePath = process.env.CLAUDE_FILE_PATH || "";
if (!filePath.endsWith(".py")) process.exit(0);

const projectDir =
  process.env.CLAUDE_PROJECT_DIR || process.cwd();

try {
  execSync(`uv run ruff check --fix "${filePath}"`, {
    cwd: projectDir,
    stdio: "pipe",
  });
} catch {
  // ruff may return non-zero if unfixable issues remain — that's fine
}

try {
  execSync(`uv run ruff format "${filePath}"`, {
    cwd: projectDir,
    stdio: "pipe",
  });
} catch {
  // format errors are non-fatal
}

process.exit(0);
