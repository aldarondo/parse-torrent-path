# parse-torrent-path — Roadmap

## Current Milestone
✅ Production-ready — comprehensive pattern support, used by ds-video-to-jellyfin

### 🔨 In Progress
[Empty]

### 🟢 Ready (Next Up)
[Empty — library is stable; update only when new naming patterns are found in the wild]

### 📋 Backlog
- Add handler: detect 4K/HDR/Dolby Vision tags
- Add handler: detect anime episode naming conventions (e.g., `[Group] Show - 01 [720p]`)
- Expand test coverage for edge cases found during real DS Video migration runs
- Document all supported naming patterns in README

### 🔴 Blocked
[Empty]

## ✅ Completed
- Handler-based architecture with modular regex rules
- Series name extraction with path-context awareness
- Season/episode number detection
- Resolution extraction (480p, 720p, 1080p, 2160p)
- Release group detection
- Extras/featurettes detection
- Episode title extraction
- Full vitest test suite
- Published as npm package with Changesets versioning
