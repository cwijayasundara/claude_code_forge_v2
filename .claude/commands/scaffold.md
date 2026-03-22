# Scaffold a new project with Claude Code Forge v2

Copy the full SDLC toolkit into the current project directory.

## What this does

1. Copies all agents, skills, hooks, evals, templates, and configuration from the plugin into the project's `.claude/` directory.
2. Creates the `specs/` output directory structure.
3. Creates CLAUDE.md at the project root (if it doesn't exist).
4. Rewrites hook paths from plugin paths to local relative paths.
5. After scaffolding, the project is self-contained — no `--plugin-dir` needed.

## Steps

### 1. Detect plugin source directory

The plugin source is `$CLAUDE_PLUGIN_DIR` (set automatically when loaded via `--plugin-dir`).
If not set, detect from the location of this command file.

```bash
# Detect the forge root (parent of .claude/)
FORGE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
echo "Forge source: $FORGE_ROOT/.claude/"
```

### 2. Copy the scaffold into the current project

```bash
# Create target directory structure first (ensures cp -r copies correctly)
mkdir -p .claude/agents .claude/skills .claude/hooks .claude/evals .claude/state

# Copy agents (8 agent definitions)
cp "$FORGE_ROOT/.claude/agents/"*.md .claude/agents/

# Copy skills (all 18 skills with templates and references)
cp -r "$FORGE_ROOT/.claude/skills/"* .claude/skills/

# Copy hooks (11 enforcement hooks)
cp "$FORGE_ROOT/.claude/hooks/"*.js .claude/hooks/

# Copy evals (code reviewer validation samples)
cp -r "$FORGE_ROOT/.claude/evals/"* .claude/evals/

# Copy configuration
cp "$FORGE_ROOT/.claude/settings.json" .claude/
cp "$FORGE_ROOT/.claude/architecture.md" .claude/
cp "$FORGE_ROOT/.claude/program.md" .claude/

# Initialize state files
echo "0" > .claude/state/coverage-baseline.txt
touch .claude/state/iteration-log.md
touch .claude/state/learned-rules.md
touch .claude/state/failures.md
```

### 3. Create output directory structure

```bash
mkdir -p specs/brd/features
mkdir -p specs/stories
mkdir -p specs/design/mockups
mkdir -p specs/test_artefacts
mkdir -p specs/reviews
mkdir -p specs/state
```

### 4. Create CLAUDE.md if it doesn't exist

If the project doesn't already have a CLAUDE.md, copy the forge's CLAUDE.md as a starting point:

```bash
if [ ! -f CLAUDE.md ]; then
  cp "$FORGE_ROOT/CLAUDE.md" CLAUDE.md
  echo "Created CLAUDE.md — customize it for your project."
else
  echo "CLAUDE.md already exists — skipping (review forge CLAUDE.md for updates)."
fi
```

### 5. Copy design.md reference

```bash
if [ ! -f design.md ]; then
  cp "$FORGE_ROOT/design.md" design.md
  echo "Created design.md — scaffold architecture reference."
fi
```

### 6. Initialize git if needed

```bash
if [ ! -d .git ]; then
  git init
  echo ".env" >> .gitignore
  echo ".env.*" >> .gitignore
  echo "!.env.example" >> .gitignore
  echo "node_modules/" >> .gitignore
  echo "__pycache__/" >> .gitignore
  echo ".pytest_cache/" >> .gitignore
  echo ".mypy_cache/" >> .gitignore
  echo "dist/" >> .gitignore
  echo "build/" >> .gitignore
  echo "Created .gitignore with standard exclusions."
fi
```

### 7. Report what was installed

After copying, report the scaffold contents:

```
Scaffold installed successfully!

Agents:        8 (brd-creator, spec-writer, architect, ui-designer, implementer, code-reviewer, security-reviewer, test-engineer)
Skills:        18 (12 task + 6 reference)
Hooks:         11 (3 security + 5 quality + 3 gates)
Templates:     10+ (BRD, stories, architecture, UI, deployment, tests)
Evals:         4 samples + expected findings

Output dirs:
  specs/brd/           → BRD output (app spec + feature specs)
  specs/stories/       → Epics, stories, dependency graph
  specs/design/        → Architecture, API contracts, data models
  specs/design/mockups/→ UI mockup HTML files
  specs/test_artefacts/→ Test plan, cases, data, E2E
  specs/reviews/       → Code + security review reports
  specs/state/         → Iteration log, learned rules, failures

Next steps:
  1. Exit this session: /exit
  2. Restart without --plugin-dir: claude
  3. Create a BRD: /brd "describe your app idea"
  4. Or run the full pipeline: /build "describe your app idea"
```

## Important

- Do NOT copy `.claude-plugin/` or `commands/scaffold.md` — those are plugin-only files.
- The project is self-contained after scaffolding. Team members just run `claude` in the project root.
- Customize CLAUDE.md for your project's specific tech stack and conventions.
