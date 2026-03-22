# Code Reviewer Eval Samples

Each file in `samples/` contains intentional violations. The code-reviewer agent
should catch ALL violations listed in the corresponding `expected.md`.

## Running Evals

```bash
# 1. Copy a sample into src/ temporarily
cp .claude/evals/samples/bad-upward-import.ts src/service/temp_eval.ts

# 2. Run the code-reviewer agent on it
# (via /review or manual agent spawn)

# 3. Compare its findings against expected.md

# 4. Clean up
rm src/service/temp_eval.ts
```

## Scoring

- **Pass**: Reviewer catches ALL BLOCK-level violations in `expected.md`
- **Partial**: Reviewer catches some but misses others
- **Fail**: Reviewer misses a BLOCK-level violation

## Adding New Evals

When a real code review misses a violation:
1. Create a minimal sample reproducing the violation
2. Add the expected findings
3. Re-run the eval to verify the reviewer now catches it
