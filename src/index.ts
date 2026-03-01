import path from 'path';
import * as ptt from 'parse-torrent-title';
import { addExtendedHandlers } from './defaults.js';
import { ParsedInfo, ParserOptions } from './types.js';

export const Parser = ptt.Parser;
export * from './types.js';

let defaultParser: ptt.Parser<ParsedInfo> | null = null;

/**
 * Get the default parser with standard and extended handlers.
 */
export function getDefaultParser(): ptt.Parser<ParsedInfo> {
    if (!defaultParser) {
        defaultParser = new ptt.Parser<ParsedInfo>();
        ptt.addDefaults(defaultParser);
        addExtendedHandlers(defaultParser);
    }
    return defaultParser;
}

/**
 * High-level function to parse a filename or path into metadata.
 * @param filePath The filename or full path to parse.
 * @param options Options for the parser.
 */
export function parsePath(filePath: string, options: ParserOptions = {}): ParsedInfo {
    const parser = options.includeDefaults !== false ? getDefaultParser() : new ptt.Parser<ParsedInfo>();

    const basename = path.basename(filePath);
    const folderName = path.dirname(filePath) !== '.' ? path.basename(path.dirname(filePath)) : '';

    // Parse the basename first
    const result = parser.parse(basename) as ParsedInfo;

    // If it's a "Season" folder or we need more context from the path, we can add it here.
    // For example, if season is missing but folder is "Season 01"
    if (result.season === undefined && folderName) {
        const seasonMatch = folderName.match(/^(?:Season\s+|S)([0-9]{1,2})$/i);
        if (seasonMatch) {
            result.season = parseInt(seasonMatch[1], 10);
        }
    }

    return result;
}

