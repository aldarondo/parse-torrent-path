import { Parser as PTTParser } from 'parse-torrent-title';
import { ParsedInfo, HandlerContext } from './types.js';

export function addExtendedHandlers(parser: PTTParser<ParsedInfo>): void {
    // Embedded year fallback: "ShowName2006"
    parser.addHandler('year', /^(.*\D)(\d{4})(?=\s|[-_]|$)/, { type: 'integer', skipIfAlreadyFound: true });

    // Alternate Style: S1 - E01
    parser.addHandler('season', /S([0-9]{1,2})\s*-\s*E[0-9]{1,2}/i, { type: 'integer' });
    parser.addHandler('episode', /S[0-9]{1,2}\s*-\s*E([0-9]{1,5})/i, { type: 'integer' });

    // Alternate Style: - N - (standalone episode)
    parser.addHandler('episode', /(?:^|\s)-\s*(\d{1,3})\s*-\s+/i, { type: 'integer' });

    // NxNN pattern (e.g. 1x01)
    parser.addHandler('season', /(\d{1,2})x(\d{2,3})/i, { type: 'integer' });
    parser.addHandler('episode', /\d{1,2}x(\d{2,3})/i, { type: 'integer' });

    // Spelled out: Season N Episode N
    parser.addHandler('season', /Season\s+(\d+)\s+Episode\s+\d+/i, { type: 'integer' });
    parser.addHandler('episode', /Season\s+\d+\s+Episode\s+(\d+)/i, { type: 'integer' });

    // Standalone Episode N (fallback)
    parser.addHandler('episode', /(?:^|[.\s-_])(?:Episode|Ep)[.\s-_]?(\d{1,3})(?:[.\s-_]|$)/i, { type: 'integer', skipIfAlreadyFound: true });

    // --- Extras Detection ---
    const EXTRAS_PATTERN = /\b(?:extras?|bts|featurettes?|behind[\s_-]the[\s_-]scenes?|deleted[\s_-]scenes?|interviews?|trailers?|bloopers?|outtakes?|shorts?|making[\s_-]of|bonus)\b/i;
    parser.addHandler('isExtras', ({ title, result }: HandlerContext) => {
        if (title && result && EXTRAS_PATTERN.test(title)) {
            result.isExtras = true;
        }
    });

    // --- Episode Title Cleanup ---
    // If we have an episode, try to find the remainder as the episode title
    parser.addHandler('episodeTitle', ({ title, result }: HandlerContext) => {
        if (title && result && result.episode !== undefined) {
            // Look for common separators after the episode number
            const patterns = [
                /[Ss]\d{1,2}[Ee]\d{1,3}[\s._-]+(.*)/,
                /[Ss]\d{1,2}\s*-\s*[Ee]\d{1,3}[\s._-]+(.*)/,
                /(?:^|\s)-\s*\d{1,3}\s*-\s+(.*)/,
                /\d{1,2}x\d{2,3}[\s._-]+(.*)/,
                /Season\s+\d+\s+Episode\s+\d+[\s._-]+(.*)/
            ];

            for (const p of patterns) {
                const match = title.match(p);
                if (match && match[1]) {
                    const cleaned = match[1]
                        .replace(/\.(mkv|mp4|avi|mov|wmv|m4v|ts|m2ts|webm)$/i, '')
                        .trim();
                    result.episodeTitle = cleaned;
                    break;
                }
            }
        }
    });
}
