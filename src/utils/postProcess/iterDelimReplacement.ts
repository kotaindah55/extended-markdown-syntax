import { type DelimType } from "../../enums";
import { type postProcessorDelimRegExps } from "../../regExps";
import { replaceStringByPos } from "../../utils";
import { getDelimiterFromPreview } from "./getDelimiterFromPreview";

export function iterDelimReplacement(contentEl: HTMLElement, rawText: string, delimQuery: ReturnType<typeof postProcessorDelimRegExps.get>, tagName: DelimType, excludedSelector: string, isTableCell?: boolean) {

    isTableCell && tagName == "spoiler" && (rawText = "");

    let excludedContents: string[] = [];
    let excludedEl = contentEl.querySelectorAll<HTMLElement>(excludedSelector);

    excludedEl.length && excludedEl.forEach((el) => {
        excludedContents.push(el.innerHTML);
        el.innerHTML = "";
    });

    let sanitizedText = contentEl.innerHTML;
    let ranges = getDelimiterFromPreview(sanitizedText, rawText, delimQuery);
    
    if (ranges.length) {
        
        let delimLength = delimQuery?.length!;
        let lengthA = tagName.length + 2 - delimLength;
        let lengthB = tagName.length + 3;
        let i: number = 0;
    
        ranges.forEach((value) => {
            sanitizedText = replaceStringByPos(sanitizedText, `<${tagName}>`, value[0] + i, value[1] + i);
            i += lengthA;
            sanitizedText = replaceStringByPos(sanitizedText, `</${tagName}>`, value[2] + i, value[3] + i);
            i = value[2] == value[3] ? i + lengthB : i + lengthB - delimLength;
        })
    };
    
    contentEl.innerHTML = sanitizedText;

    excludedContents.forEach((content, index) => {
        contentEl.querySelectorAll<HTMLElement>(excludedSelector)[index].innerHTML = content;
    });
}