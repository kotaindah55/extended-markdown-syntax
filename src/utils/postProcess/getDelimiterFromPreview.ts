import { type DelimPos } from "../../types";
import { type Pos } from "../../types";
import { getEscapedDelims } from "./getEscapedDelims";
import { type postProcessorDelimRegExps } from "../../regExps";

/**
 * This function is used to get the range containing delimiter
 * position of text in preview mode. It uses a similar
 * algorithm to [`getDelimiterFromEditor`](../../editorPlugins/stateFields/extendedFormattingField.ts).
 * 
 * @param text - preprocessed text, not raw markdown
 * @param rawText - raw markdown text to retrieve the index of escaped delimiters if any
 */
export function getDelimiterFromPreview(text: string, rawText: string, delimQuery: ReturnType<typeof postProcessorDelimRegExps.get>) {

    let newLineChar = /(<br>\n?)\1+/g;
    let htmlTagRegExp = /<[\w\d\-]+(?: *[\w\d\-]+(?:=(?:"[^"]*")|(?:'[^']*'))?)*>/g;
    let currentLineEndOffset = newLineChar.exec(text)?.index ?? text.length;

    let currentTagExecArr = htmlTagRegExp.exec(text);
    let currentTagRange: Pos = [
        currentTagExecArr?.index ?? text.length,
        htmlTagRegExp.lastIndex || text.length
    ];

    let {openingDelim, closingDelim, raw} = delimQuery!;
    let escapedIndexes = getEscapedDelims(rawText, raw.openingDelim, raw.closingDelim);

    let delimPosCollection: DelimPos[] = [];

    openingDelim.lastIndex = 0;
    closingDelim.lastIndex = 0;

    for (
        let openingMatch = openingDelim.exec(text), lastIndex = openingDelim.lastIndex, i = 0;
        openingMatch;
        openingMatch = openingDelim.exec(text), lastIndex = openingDelim.lastIndex
    ) {

        let delimPos: DelimPos = [0, 0, 0, 0]

        if (lastIndex > currentTagRange[1]) {
            htmlTagRegExp.lastIndex = lastIndex;
            currentTagRange = [
                htmlTagRegExp.exec(text)?.index || text.length,
                htmlTagRegExp.lastIndex || text.length
            ];
        }

        if (lastIndex > currentTagRange[0] && lastIndex < currentTagRange[1]) {
            continue;
        }
        
        /** 
         * if the order of the matched delimiter ({@link i}) is the same as the index of 
         * the escaped delimiter ({@link escapedIndexes}) then the previously matched 
         * delimiter is considered escaped.
         */ 
        if (escapedIndexes[0] === i) {
            openingDelim.lastIndex = openingMatch.index + 1;
            escapedIndexes.shift();
            i++;
            continue;
        }

        if (lastIndex > currentLineEndOffset) {
            newLineChar.lastIndex = lastIndex;
            currentLineEndOffset = newLineChar.exec(text)?.index || text.length;
        }

        closingDelim.lastIndex = lastIndex;
        [delimPos[0], delimPos[1]] = openingMatch.indices![0];
        i++;

        for (let closingMatch = closingDelim.exec(text);; closingMatch = closingDelim.exec(text)) {

            lastIndex = closingDelim.lastIndex;

            if (!closingMatch || lastIndex > currentLineEndOffset) {

                openingDelim.lastIndex = delimPos[2] = delimPos[3] = currentLineEndOffset;
                currentLineEndOffset = newLineChar.exec(text)?.index || text.length;
            
            } else if (lastIndex > currentTagRange[0] && lastIndex < currentTagRange[1]) {

                continue;

            /** 
             * if the order of the matched delimiter ({@link i}) is the same as the index of 
             * the escaped delimiter ({@link escapedIndexes}) then the previously matched 
             * delimiter is considered escaped.
             */
            } else if (escapedIndexes[0] === i) {

                closingDelim.lastIndex = closingMatch.index + 1;
                escapedIndexes.shift();
                i++;
                continue;

            } else {
                
                if (lastIndex > currentTagRange[1]) {
                    htmlTagRegExp.lastIndex = lastIndex;
                    currentTagRange = [
                        htmlTagRegExp.exec(text)?.index || text.length,
                        htmlTagRegExp.lastIndex || text.length
                    ];
                }
                
                [delimPos[2], delimPos[3]] = closingMatch.indices![0];
                openingDelim.lastIndex = lastIndex;
                i++;
            }

            break;
        }

        delimPosCollection.push(delimPos);
    }

    return delimPosCollection;
}