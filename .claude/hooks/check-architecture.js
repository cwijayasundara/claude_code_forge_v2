#!/usr/bin/env node
/**
 * PostToolUse hook: Block upward layer imports in Python files.
 * Runs on every Python file Edit/Write.
 * Cross-platform (Windows, macOS, Linux).
 *
 * Architecture layers (top → bottom):
 *   UI → API → Service → Repository → Config → Types
 * A layer may only import from layers BELOW it.
 */
const fs = require("fs");
const path = require("path");

const filePath = process.env.CLAUDE_FILE_PATH || "";
if (!filePath.endsWith(".py")) process.exit(0);

// Normalize to forward slashes for cross-platform matching
const normalized = filePath.replace(/\\/g, "/");

// Define forbidden imports per layer
const rules = [
  { layer: "src/service/", forbidden: ["from src.api"] },
  {
    layer: "src/repository/",
    forbidden: ["from src.api", "from src.service"],
  },
  {
    layer: "src/config/",
    forbidden: ["from src.api", "from src.service", "from src.repository"],
  },
  {
    layer: "src/types/",
    forbidden: [
      "from src.api",
      "from src.service",
      "from src.repository",
      "from src.config",
    ],
  },
];

// Find which layer this file belongs to
const applicableRule = rules.find((r) => normalized.includes(r.layer));
if (!applicableRule) process.exit(0);

let content;
try {
  content = fs.readFileSync(filePath, "utf-8");
} catch {
  process.exit(0);
}

const lines = content.split("\n");
const violations = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  for (const forbidden of applicableRule.forbidden) {
    if (line.startsWith(forbidden) || line.includes(` ${forbidden}`)) {
      violations.push(
        `  Line ${i + 1}: "${line}" — '${forbidden}' not allowed in ${applicableRule.layer}`
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `BLOCKED: Upward layer import(s) detected in ${filePath}:\n`
  );
  process.stderr.write(violations.join("\n") + "\n");
  process.exit(2);
}

process.exit(0);
