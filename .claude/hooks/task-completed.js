#!/usr/bin/env node
/**
 * TaskCompleted hook: Run architecture compliance scan and remind to review.
 * Cross-platform (Windows, macOS, Linux).
 */
const fs = require("fs");
const path = require("path");

const projectDir =
  process.env.CLAUDE_PROJECT_DIR || process.cwd();
const srcDir = path.join(projectDir, "src");

if (!fs.existsSync(srcDir)) {
  console.log(
    "REMINDER: Run /review before marking stories done."
  );
  process.exit(0);
}

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

console.log("=== Task Completion Checklist ===");

const pyFiles = findPyFiles(srcDir);
let found = false;

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
        if (!found) {
          process.stderr.write(
            "FAIL: Upward layer imports detected:\n"
          );
          found = true;
        }
        process.stderr.write(`  ${rel}:${i + 1}: ${line}\n`);
      }
    }
  }
}

if (!found) {
  console.log("PASS: No upward layer imports.");
}

console.log(
  "REMINDER: Run /review before marking stories done."
);
process.exit(0);
