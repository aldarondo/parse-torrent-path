import type { DefaultParserResult } from 'parse-torrent-title';

export interface ParsedInfo extends DefaultParserResult {
    episodeTitle?: string;
    showTitle?: string;
    isExtras?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface HandlerContext {
    title?: string;
    result?: ParsedInfo;
}

export type HandlerFunction = (context: HandlerContext) => void;

export interface ParserOptions {
    includeDefaults?: boolean;
}

