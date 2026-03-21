#!/usr/bin/env node
/**
 * PostToolUse hook: Block writes outside the project directory.
 * Prevents agents from modifying system files, other repos, or home configs.
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

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const resolvedFile = path.resolve(filePath);
const resolvedProject = path.resolve(projectDir);

// Allow writes within the project directory
if (resolvedFile.startsWith(resolvedProject + path.sep) || resolvedFile === resolvedProject) {
  process.exit(0);
}

// Allow writes to /tmp (for coverage reports, temp files)
if (resolvedFile.startsWith("/tmp") || resolvedFile.startsWith(path.resolve("/tmp"))) {
  process.exit(0);
}

process.stderr.write(
  `BLOCKED: Write outside project directory.\n` +
  `  Target: ${resolvedFile}\n` +
  `  Allowed: ${resolvedProject}/** or /tmp/**\n` +
  `\nAll code must live within the project. Use .claude/ for scaffold files.\n`
);
process.exit(2);
