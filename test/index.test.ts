import { describe, it, expect } from 'vitest';
import { parsePath, Parser } from '../src/index.js';

describe('parsePath', () => {
    it('should parse standard SxxExx filenames', () => {
        const result = parsePath('Show.Name.S01E02.1080p.mkv');
        expect(result.title).toBe('Show Name');
        expect(result.season).toBe(1);
        expect(result.episode).toBe(2);
        expect(result.resolution).toBe('1080p');
    });

    it('should parse alternate style S1 - E01 patterns', () => {
        const result = parsePath('Show.Name.S1 - E01 - Pilot.mp4');
        expect(result.title).toBe('Show Name');
        expect(result.season).toBe(1);
        expect(result.episode).toBe(1);
        expect(result.episodeTitle).toBe('Pilot');
    });

    it('should parse alternate style standalone episode - N -', () => {
        const result = parsePath('Show Name - 03 - Title.mkv');
        expect(result.title).toBe('Show Name');
        expect(result.episode).toBe(3);
        expect(result.episodeTitle).toBe('Title');
    });

    it('should parse NxNN patterns', () => {
        const result = parsePath('Show.Name.1x05.mkv');
        expect(result.title).toBe('Show Name');
        expect(result.season).toBe(1);
        expect(result.episode).toBe(5);
    });

    it('should parse movies with years', () => {
        const result = parsePath('Movie.Title.2024.1080p.mkv');
        expect(result.title).toBe('Movie Title');
        expect(result.year).toBe(2024);
    });

    it('should detect extras files', () => {
        const result = parsePath('Movie.Title.2024.Bloopers.mkv');
        expect(result.isExtras).toBe(true);
    });

    it('should use folder context for season if missing in filename', () => {
        const result = parsePath('Season 05/Episode 01.mkv');
        expect(result.episode).toBe(1);
        expect(result.season).toBe(5);
    });

    it('should cleanup codec names', () => {
        const result = parsePath('Show.S01E01.h.264.mkv');
        expect(result.codec).toBe('h264');
    });

    it('should handle embedded years ShowName2006', () => {
        const result = parsePath('DoctorWho2006.S01E01.mkv');
        expect(result.year).toBe(2006);
        expect(result.title).toBe('DoctorWho');
    });

    it('should parse episode titles for all patterns', () => {
        // pattern 1: SxxExx
        expect(parsePath('Show.S01E01.Title.mkv').episodeTitle).toBe('Title');
        // pattern 2: S1 - E01
        expect(parsePath('Show.S1 - E01 - Title.mkv').episodeTitle).toBe('Title');
        // pattern 3: - N -
        expect(parsePath('Show - 01 - Title.mkv').episodeTitle).toBe('Title');
        // pattern 4: 1x01
        expect(parsePath('Show.1x01.Title.mkv').episodeTitle).toBe('Title');
        // pattern 5: Season N Episode N
        expect(parsePath('Season 1 Episode 1 - Title.mkv').episodeTitle).toBe('Title');
    });

    it('should respect skipIfAlreadyFound for year', () => {
        const result = parsePath('Movie (2020) 2024.mkv');
        expect(result.year).toBe(2020);
    });

    it('should support custom handlers with value and function transform', () => {
        const parser = new Parser();
        parser.addHandler('tag', /\[(TAG)\]/i, { value: 'custom' });
        // parse-torrent-title does not natively support 'transform' or 'uppercase' type on regex handlers,
        // so we must use function handlers to achieve custom behavior:
        parser.addHandler('val', (input: any) => {
            const title = input.title;
            const result = input.result;
            const match = title.match(/VAL:(\d+)/);
            if (match && match[1]) {
                result.val = Number(match[1]) * 2;
            }
        });
        parser.addHandler('upper', (input: any) => {
            const title = input.title;
            const result = input.result;
            const match = title.match(/(UPPER)/);
            if (match && match[1]) {
                result.upper = match[1].toUpperCase();
            }
        });
        parser.addHandler('float', /FLOAT:(\d+\.\d+)/, { type: 'float' });
        parser.addHandler('bool', /(BOOLEAN)/, { type: 'boolean' });
        parser.addHandler('def', /(DEFAULT)/);

        const result = parser.parse('[TAG] VAL:10 UPPER FLOAT:1.5 BOOLEAN DEFAULT') as any;
        expect(result.tag).toBe('custom');
        expect(result.val).toBe(20);
        expect(result.upper).toBe('UPPER');
        expect(result.float).toBe(1.5);
        expect(result.bool).toBe(true);
        expect(result.def).toBe('DEFAULT');
    });

    it('should handle edge-case branches for 100% coverage', () => {
        // index.ts: options.includeDefaults === false
        const noDefaults = parsePath('Show.S01E01.mkv', { includeDefaults: false });
        expect(noDefaults.season).toBeUndefined();

        // index.ts: folderName exists but does not match season pattern
        const noSeasonFolder = parsePath('Random Folder/Episode 01.mkv');
        expect(noSeasonFolder.season).toBeUndefined();

        // defaults.ts: episode title regex matches, but cleaned title is an empty string
        const emptyCleaned = parsePath('Show.S01E01 - ');
        expect(emptyCleaned.episodeTitle).toBeUndefined();

        // parser.ts: regex returns a match array without an `index` property (caused by global 'g' flag)
        const parser = new Parser();
        parser.addHandler('global', /match/g);
        const globalMatch = parser.parse('match match') as any;
        expect(globalMatch.global).toBe('match');
    });
});
