import type { DefaultParserResult, Parser as PTTParser } from 'parse-torrent-title';

export interface ParsedInfo extends DefaultParserResult {
    episodeTitle?: string;
    showTitle?: string;
    isExtras?: boolean;
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

