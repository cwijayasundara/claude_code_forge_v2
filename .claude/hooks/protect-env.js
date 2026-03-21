#!/usr/bin/env node
/**
 * PostToolUse hook: Block modifications to .env files.
 * .env files contain real secrets and should only be edited by humans.
 * .env.example is allowed (it's a template with no real values).
 * Runs on Edit and Write operations.
 */
const path = require("path");
const fs = require("fs");

let stdin = "";
try {
  stdin = fs.readFileSync(0, "utf-8");
} catch {
  // No stdin
}

let filePath = "";
try {
  const parsed = JSON.parse(stdin);
  filePath = parsed.tool_input?.file_path || "";
} catch {
  filePath = process.env.CLAUDE_FILE_PATH || "";
}

if (!filePath) process.exit(0);

const basename = path.basename(filePath);

// Allow .env.example — it's a template
if (basename === ".env.example") process.exit(0);

// Block .env, .env.local, .env.production, etc.
if (/^\.env(\..+)?$/.test(basename) && basename !== ".env.example") {
  process.stderr.write(
    `BLOCKED: Cannot modify ${basename} — it contains real secrets.\n` +
    `  Edit .env.example for template changes.\n` +
    `  Humans must edit .env files directly.\n`
  );
  process.exit(2);
}

process.exit(0);
