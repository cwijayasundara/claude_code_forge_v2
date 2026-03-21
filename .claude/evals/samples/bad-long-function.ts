/**
 * Eval sample: Function over 50 lines + bare catch + hardcoded secret.
 * Expected: code-reviewer should BLOCK all three violations.
 */
import { RawDocument, PageResult, ExtractionResult } from "../../types/document";

// VIOLATION: Hardcoded API key — should use env var
const API_KEY = "sk-ant-api03-REAL_KEY_HERE_abc123def456";

export function processDocument(doc: RawDocument): ExtractionResult {
  const result: ExtractionResult = {
    id: doc.id,
    name: doc.name,
    status: "processing",
    pages: [],
    errors: [],
    warnings: [],
    metadata: {},
    extractedFields: {},
    confidenceScores: {},
    validationResults: {},
  };

  try {
    // Page processing
    for (let i = 0; i < doc.pages.length; i++) {
      const pageResult: PageResult = {
        number: i + 1,
        text: doc.pages[i].text,
        tables: [],
        images: [],
        headers: [],
        footers: [],
      };

      for (const block of doc.pages[i].textBlocks) {
        if (block.type === "table") {
          pageResult.tables.push(block.content);
        } else if (block.type === "image") {
          pageResult.images.push(block.ref);
        } else if (block.type === "header") {
          pageResult.headers.push(block.content);
        } else if (block.type === "footer") {
          pageResult.footers.push(block.content);
        } else {
          pageResult.text += block.content;
        }
      }

      result.pages.push(pageResult);
    }

    // Field extraction
    for (const fieldName of doc.expectedFields) {
      let value: string | null = null;
      let confidence = 0.0;
      for (const page of result.pages) {
        if (page.text.toLowerCase().includes(fieldName.toLowerCase())) {
          value = page.text;
          confidence = 0.85;
          break;
        }
      }
      result.extractedFields[fieldName] = value;
      result.confidenceScores[fieldName] = confidence;
    }

    // Validation
    for (const [fieldName, value] of Object.entries(result.extractedFields)) {
      if (value === null) {
        result.validationResults[fieldName] = "missing";
        result.warnings.push(`Field ${fieldName} not found`);
      } else if ((result.confidenceScores[fieldName] ?? 0) < 0.8) {
        result.validationResults[fieldName] = "low_confidence";
      } else {
        result.validationResults[fieldName] = "valid";
      }
    }

    result.status = "completed";
  } catch (e) {
    // VIOLATION: Bare catch with no typed error
    result.status = "failed";
    result.errors.push("Unknown error occurred");
  }

  return result;
}
