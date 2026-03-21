#!/usr/bin/env node
/**
 * PostToolUse hook: Warn when functions exceed 50 lines.
 * Runs on Python and TypeScript file Edit/Write.
 * Cross-platform (Windows, macOS, Linux).
 */
const fs = require("fs");

const filePath = process.env.CLAUDE_FILE_PATH || "";
const isPython = filePath.endsWith(".py");
const isTS = /\.tsx?$/.test(filePath);

if (!isPython && !isTS) process.exit(0);

let content;
try {
  content = fs.readFileSync(filePath, "utf-8");
} catch {
  process.exit(0);
}

const lines = content.split("\n");
const MAX_LINES = 50;
const warnings = [];

if (isPython) {
  // Track Python function definitions by indentation
  const funcStack = []; // { name, startLine, indent }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(
      /^(\s*)(async\s+)?def\s+(\w+)/
    );
    if (match) {
      const indent = match[1].length;
      // Close any functions at same or deeper indent
      while (
        funcStack.length > 0 &&
        funcStack[funcStack.length - 1].indent >= indent
      ) {
        const fn = funcStack.pop();
        const length = i - fn.startLine;
        if (length > MAX_LINES) {
          warnings.push(
            `  ${fn.name}() at line ${fn.startLine + 1}: ${length} lines (max ${MAX_LINES})`
          );
        }
      }
      funcStack.push({
        name: match[3],
        startLine: i,
        indent,
      });
    }
  }
  // Check remaining functions
  for (const fn of funcStack) {
    const length = lines.length - fn.startLine;
    if (length > MAX_LINES) {
      warnings.push(
        `  ${fn.name}() at line ${fn.startLine + 1}: ${length} lines (max ${MAX_LINES})`
      );
    }
  }
} else if (isTS) {
  // Simplified TS function detection
  const funcPattern =
    /^(\s*)(export\s+)?(async\s+)?function\s+(\w+)|^(\s*)(export\s+)?const\s+(\w+)\s*=\s*(async\s+)?\(/;

  const funcStack = [];
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(funcPattern);
    if (match) {
      const name = match[4] || match[7] || "anonymous";
      funcStack.push({
        name,
        startLine: i,
        braceDepthAtStart: braceDepth,
      });
    }
    // Count braces
    for (const ch of line) {
      if (ch === "{") braceDepth++;
      if (ch === "}") {
        braceDepth--;
        // Check if a tracked function closed
        if (
          funcStack.length > 0 &&
          braceDepth <=
            funcStack[funcStack.length - 1].braceDepthAtStart
        ) {
          const fn = funcStack.pop();
          const length = i - fn.startLine + 1;
          if (length > MAX_LINES) {
            warnings.push(
              `  ${fn.name}() at line ${fn.startLine + 1}: ${length} lines (max ${MAX_LINES})`
            );
          }
        }
      }
    }
  }
}

if (warnings.length > 0) {
  process.stderr.write(
    `WARNING: Functions exceeding ${MAX_LINES} lines in ${filePath}:\n`
  );
  process.stderr.write(warnings.join("\n") + "\n");
  // Warning only — exit 0, not exit 2
}

process.exit(0);
