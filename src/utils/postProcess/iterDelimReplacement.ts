import { getDelimCounts } from ".";
import { type DelimType } from "../../enums";
import { type postProcessorDelimRegExps } from "../../regExps";

export function iterDelimReplacement(contentEl: HTMLElement, rawText: string, delimQuery: ReturnType<typeof postProcessorDelimRegExps.get>, tagName: DelimType, isTableCell?: boolean) {

    let ignoreEscaper = !!(isTableCell && tagName == "spoiler");
    let {openingDelim, closingDelim, raw, length: delimLength, origin: originDelim} = delimQuery!;
    let delimIndexes = getDelimCounts(rawText, raw.openingDelim, raw.closingDelim, originDelim, ignoreEscaper);
    let lastDelimCount = delimIndexes[delimIndexes.length - 1];
    let formattedRange: Range[] = [];

    if (delimIndexes.length == 0) { return }
    
    openingDelim.lastIndex = closingDelim.lastIndex = 0;
    let treeWalker = document.createTreeWalker(contentEl, 5, (node: Text | Element) => {

        if (node instanceof Text) {
            if (node.textContent?.includes(originDelim)) {
                return NodeFilter.FILTER_ACCEPT;
            } else {
                return NodeFilter.FILTER_REJECT;
            }

        } else {
            if (node instanceof HTMLBRElement && node.nextSibling instanceof HTMLBRElement) {
                return NodeFilter.FILTER_ACCEPT;
            } else if (node.tagName == "CODE" || node.hasClass("internal-link") || node.hasClass("math")) {
                return NodeFilter.FILTER_REJECT;
            } else {
                return NodeFilter.FILTER_SKIP;
            }
        }
    });

    treeWalker.nextNode();

    for (
        let i = 0,
            node = treeWalker.currentNode,
            matched: RegExpExecArray | null,
            closingTurn = false,
            endOfTree = false,
            range: Range;
        i <= lastDelimCount + 1 || endOfTree;
    ) {

        if (node instanceof Text && !closingTurn) {

            matched = openingDelim.exec(node.textContent ?? "");

            if (matched) {

                if (matched.index + delimLength == node.length && node.nextSibling instanceof HTMLBRElement) { continue }

                if (delimIndexes[0] === i++) {
                    closingTurn = true;
                    node.deleteData((closingDelim.lastIndex = matched.index), delimLength);
                    (range = document.createRange()).setStart(node, matched.index);
                    delimIndexes.shift();
                }

            } else {

                openingDelim.lastIndex = 0;

                if (treeWalker.nextNode()) {
                    node = treeWalker.currentNode;
                } else { break }
            }
            
            continue;
        }
        
        if (closingTurn) {

            if (node instanceof Text) {

                matched = closingDelim.exec(node.textContent ?? "");
    
                if (matched) {

                    if (matched.index == 0 && node.previousSibling instanceof HTMLBRElement) { continue }
    
                    if (delimIndexes[0] == i++) {
                        /\s/.test(node.textContent!.charAt(matched.index - 1)) && matched.index++;
                        node.deleteData((openingDelim.lastIndex = matched.index), delimLength);
                        range!.setEnd(node, matched.index);
                        delimIndexes.shift();

                    } else {
                        continue;
                    }
    
                } else {
    
                    closingDelim.lastIndex = 0;

                    if (treeWalker.nextNode()) {
                        node = treeWalker.currentNode;
                        continue;
                    }

                    range!.setEndAfter(node);
                    endOfTree = true;
                }

            } else {
                range!.setEndBefore(node as HTMLBRElement);
            }

            formattedRange.push(range!.cloneRange());
            closingTurn = false;
        }

        if (endOfTree) { break }
    }

    formattedRange.forEach(range => {
        let formattedEl = document.createElement(tagName);
        formattedEl.append(range!.extractContents());
        range!.insertNode(formattedEl);
    });
}