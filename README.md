# parse-torrent-path

Modular, handler-based media metadata parser for filenames and paths. Optimized for general media library organization and complex naming conventions.

## Features

- **Modular Handler System**: Extensible architecture using regex and functional handlers.
- **Extended Pattern Support**: Specialized patterns (e.g., `S1 - E01`, `- N -`).
- **Path Context**: Automatically extracts season info from parent folder names (e.g., `Season 01/`).
- **Extras Detection**: Identifies bonus content, deleted scenes, and featurettes.
- **Episode Title Extraction**: Captures episode titles embedded in filenames.
- **Movie Year Fallbacks**: Advanced detection for embedded broadcast years.

## Installation

```bash
npm install parse-torrent-path
```

## Usage

### Simple Parsing

```typescript
import { parsePath } from 'parse-torrent-path';

const info = parsePath('Show.Name.S01E02.1080p.mkv');
// {
//   title: 'Show Name',
//   season: 1,
//   episode: 2,
//   resolution: '1080p'
// }
```

### Path Context Awareness

```typescript
// Uses folder name to infer missing season
const info = parsePath('Season 05/Episode 01.mkv');
// {
//   title: 'Episode 01',
//   season: 5,
//   episode: 1
// }
```

### Alternate Patterns

```typescript
const info = parsePath('Show.Name.S1 - E01 - Pilot.mp4');
// {
//   title: 'Show Name',
//   season: 1,
//   episode: 1,
//   episodeTitle: 'Pilot'
// }
```

## Advanced Usage

You can leverage the exported `getDefaultParser()` which comes pre-loaded with all standard `parse-torrent-title` rules and our extended path-aware handlers, or you can create a fresh `Parser` and add your own custom logic:

```typescript
import { getDefaultParser } from 'parse-torrent-path';

const parser = getDefaultParser();

// Add custom logic
parser.addHandler('customTag', /\[(TAG)\]/i, { type: 'lowercase' });

const info = parser.parse('Show [TAG] S01E01.mkv');
```

## Acknowledgements

This package is heavily inspired by and built upon the excellent [parse-torrent-title](https://github.com/clement-escolano/parse-torrent-title) package by clement-escolano. It adapts its core "Handlers" architecture while adding context-aware path parsing and extended matching rules.

## License

MIT
