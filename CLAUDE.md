# parse-torrent-path

## What This Project Is
Modular, handler-based media metadata parser for filenames and directory paths. Extracts series name, season/episode numbers, resolution, release groups, and more. Features path-context awareness (detects season from folder names), extras detection (bonus content, featurettes), and episode title extraction. Used as a dependency by ds-video-to-jellyfin.

## Tech Stack
- Node.js / TypeScript
- vitest (testing)
- ESLint
- Changesets (versioning)
- No runtime dependencies

## Key Decisions
- Handler-based architecture inspired by parse-torrent-title — each extraction rule is an isolated function
- Path-context awareness is the key differentiator from simpler parsers (folder name informs file parse)
- Zero runtime dependencies
- Published as npm package; versioned via Changesets

## Session Startup Checklist
1. Read ROADMAP.md to find the current active task
2. Check MEMORY.md if it exists — it contains auto-saved learnings from prior sessions
3. Run `npm install` if node_modules are stale
4. Run `npm test` to verify all tests pass before making changes
5. Do not break the public API — ds-video-to-jellyfin depends on it

## Key Files
- `src/` — parser source (handlers, main parse function)
- `test/` — vitest tests with extensive pattern coverage
- `CHANGELOG.md` — version history

---
@~/Documents/GitHub/CLAUDE.md

## Git Rules
- Never create pull requests. Push directly to main.
- solo/auto-push OK
