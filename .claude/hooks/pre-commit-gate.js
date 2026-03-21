#!/usr/bin/env node
/**
 * PostToolUse hook: Pre-commit gate — scans src/ for upward layer imports.
 * Only runs when the Bash tool executes a git commit command.
 * Cross-platform (Windows, macOS, Linux).
 */
const fs = require("fs");
const path = require("path");

// Read stdin to check if this was a git commit
let stdin = "";
try {
  stdin = fs.readFileSync(0, "utf-8");
} catch {
  // No stdin available
}

let toolInput = "";
try {
  const parsed = JSON.parse(stdin);
  toolInput = parsed.tool_input?.command || "";
} catch {
  toolInput = process.env.CLAUDE_TOOL_INPUT || "";
}

if (!toolInput.includes("git commit")) process.exit(0);

const projectDir =
  process.env.CLAUDE_PROJECT_DIR || process.cwd();

// Recursively find all .py files in src/
function findPyFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPyFiles(full));
    } else if (entry.name.endsWith(".py")) {
      results.push(full);
    }
  }
  return results;
}

const srcDir = path.join(projectDir, "src");
if (!fs.existsSync(srcDir)) process.exit(0);

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

const violations = [];
const pyFiles = findPyFiles(srcDir);

for (const file of pyFiles) {
  const normalized = file.replace(/\\/g, "/");
  const rule = rules.find((r) => normalized.includes(r.layer));
  if (!rule) continue;

  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const forbidden of rule.forbidden) {
      if (line.startsWith(forbidden)) {
        const rel = path.relative(projectDir, file);
        violations.push(
          `  ${rel}:${i + 1}: ${line}`
        );
      }
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(
    "BLOCKED: Upward layer imports detected — fix before committing:\n"
  );
  process.stderr.write(violations.join("\n") + "\n");
  process.exit(2);
}

console.log("Pre-commit checks passed.");
process.exit(0);
