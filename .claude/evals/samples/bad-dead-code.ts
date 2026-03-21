/**
 * Eval sample: Dead code, commented-out blocks, any types.
 * Expected: code-reviewer should catch all violations.
 */

export function parseDocument(content: any): any {
  // VIOLATION: any types on both parameter and return
  const result = { parsed: true };

  // TODO: Remove this old implementation
  // function oldParse(text: string) {
  //   const lines = text.split("\n");
  //   const sections: string[] = [];
  //   for (const line of lines) {
  //     if (line.includes("Section")) {
  //       sections.push(line);
  //     }
  //   }
  //   return sections;
  // }

  return result;
}

export function unusedHelper(data: any): any {
  // VIOLATION: Dead code — no callers, plus any types
  return data;
}

// Old extraction logic — keeping for reference
// class LegacyExtractor {
//   private patterns = [/\d+/, /[A-Z]+/];
//
//   extract(text: string): string[] {
//     const results: string[] = [];
//     for (const pattern of this.patterns) {
//       const matches = text.match(pattern);
//       if (matches) results.push(...matches);
//     }
//     return results;
//   }
// }

export function formatOutput(data: Record<string, unknown>): any {
  // VIOLATION: Return type is any
  // VIOLATION: Commented-out code block
  // if (data.legacyFormat) {
  //   return new LegacyExtractor().extract(data.text as string);
  // }
  return { formatted: true, data };
}
