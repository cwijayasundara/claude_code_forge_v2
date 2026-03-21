#!/usr/bin/env node
/**
 * PostToolUse hook: Detect secrets, API keys, and PII in written files.
 * Blocks writes that contain hardcoded credentials or sensitive data.
 * Runs on Edit and Write operations.
 */
const fs = require("fs");

let stdin = "";
try {
  stdin = fs.readFileSync(0, "utf-8");
} catch {
  // No stdin
}

let filePath = "";
let newContent = "";
try {
  const parsed = JSON.parse(stdin);
  filePath = parsed.tool_input?.file_path || "";
  newContent = parsed.tool_input?.content || parsed.tool_input?.new_string || "";
} catch {
  filePath = process.env.CLAUDE_FILE_PATH || "";
}

// Skip non-source files and config templates
const normalized = filePath.replace(/\\/g, "/");
if (
  normalized.endsWith(".env.example") ||
  normalized.includes("/hooks/") ||
  normalized.includes("/evals/") ||
  normalized.includes("/templates/") ||
  normalized.endsWith(".md") ||
  normalized.endsWith(".json") && normalized.includes("settings")
) {
  process.exit(0);
}

// If we don't have content from stdin, try reading the file
if (!newContent && filePath) {
  try {
    newContent = fs.readFileSync(filePath, "utf-8");
  } catch {
    process.exit(0);
  }
}

if (!newContent) process.exit(0);

const patterns = [
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "AWS Secret Key", regex: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*["']?[A-Za-z0-9/+=]{40}/gi },
  { name: "Generic API Key assignment", regex: /(?:api[_-]?key|apikey|secret[_-]?key|auth[_-]?token|access[_-]?token)\s*[=:]\s*["'][A-Za-z0-9_\-]{20,}["']/gi },
  { name: "Private Key block", regex: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/g },
  { name: "GitHub Token", regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g },
  { name: "Anthropic API Key", regex: /sk-ant-[A-Za-z0-9_\-]{20,}/g },
  { name: "OpenAI API Key", regex: /sk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{20,}/g },
  { name: "Slack Token", regex: /xox[baprs]-[0-9]{10,}-[A-Za-z0-9]{10,}/g },
  { name: "Hardcoded password", regex: /(?:password|passwd|pwd)\s*[=:]\s*["'][^"']{8,}["']/gi },
  { name: "Database connection string with password", regex: /(?:postgres|mysql|mongodb):\/\/[^:]+:[^@\s]+@/gi },
  { name: "Social Security Number", regex: /\b\d{3}-\d{2}-\d{4}\b/g },
];

const violations = [];

for (const { name, regex } of patterns) {
  const matches = newContent.match(regex);
  if (matches) {
    // Mask the actual value for safety
    const masked = matches[0].substring(0, 10) + "...REDACTED";
    violations.push(`  ${name}: ${masked}`);
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `BLOCKED: Potential secrets/PII detected in ${normalized}:\n`
  );
  process.stderr.write(violations.join("\n") + "\n");
  process.stderr.write(
    "\nUse environment variables or .env files instead. See .env.example.\n"
  );
  process.exit(2);
}

process.exit(0);
