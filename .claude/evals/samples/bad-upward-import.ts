/**
 * Eval sample: Upward layer imports.
 * This file simulates a service module that incorrectly imports from API layer.
 * Expected: code-reviewer should BLOCK this.
 */
import { uploadRouter } from "../../api/routes"; // VIOLATION: service → api
import { ParsedDocument } from "../../types/document";
import { DocumentRepo } from "../../repository/documents";

export class ExtractionService {
  private repo: DocumentRepo;
  private router = uploadRouter; // Using API-layer object in service

  constructor(repo: DocumentRepo) {
    this.repo = repo;
  }

  async extract(doc: ParsedDocument): Promise<Record<string, unknown>> {
    const cached = await this.repo.getCached(doc.id);
    if (cached) {
      return cached;
    }
    // ... extraction logic
    return { status: "extracted" };
  }
}
