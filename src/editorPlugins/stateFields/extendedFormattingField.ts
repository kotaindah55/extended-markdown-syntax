import { StateField, type Text, type StateEffect } from '@codemirror/state';
import { syntaxTree, type ParseContext } from '@codemirror/language';
import { type Tree } from "@lezer/common"
import { type DelimPos } from "../../types";
import { isColumnSeparator, isRestrictedPos, isTable } from '../../utils/codemirror';
import { delimRegExps } from '../../regExps';
import { DelimType } from '../../enums';

/**
 * Used to get the position of each delimiter in the editor.
 * 
 */
function getDelimiterFromEditor(doc: Text, tree: Tree, type: DelimType, openingDelim: RegExp, closingDelim: RegExp, previous?: {from: number, delimLength: number, posCollection: DelimPos[]}) {

    let text = doc.toString(),
        doubleNewLineChar = /\n\n+/g,
        verticalBarChar = /(?<!^)\|/g,
        delimPosCollection: DelimPos[] = [];

    if (previous) {
        
        delimPosCollection = previous.posCollection;
        let {from, delimLength} = previous,
            lastIndex = /* type == "spoiler" ? doc.lineAt(from).from : */ from - delimLength;

        delimPosCollection.length && delimPosCollection.findLast((delimPos, index, collection) => {

            if (from >= delimPos[1]) {

                if (from < delimPos[3] || (from == delimPos[3] && delimPos[2] == delimPos[3])) {
                    lastIndex = delimPos[0];
                    collection.splice(index);
                } else if (from - delimPos[3] < delimLength) {
                    lastIndex = delimPos[3];
                    collection.splice(index + 1);
                } else {
                    // type == "spoiler" && (lastIndex = Math.max(closingTo, lastIndex));
                    collection.splice(index + 1);
                }
                return true;
                
            } else if (index == 0) {
                collection.splice(0);
                return true;
            }
        });

        openingDelim.lastIndex = doubleNewLineChar.lastIndex = lastIndex;
    }
    
    mainLoop: for (
        let openingPos = openingDelim.exec(text)?.indices![0],
        endLineOffset = doubleNewLineChar.exec(text)?.index ?? text.length;
        openingPos;
        openingPos = openingDelim.exec(text)?.indices![0]
    ) {

        if (openingPos[1] > tree.length) { break }

        if (isRestrictedPos(tree, openingPos[0])) { continue }

        let delimPos: DelimPos = [0, 0, 0, 0];

        closingDelim.lastIndex = openingPos[1];
        let endCellOffset = 0,
            currentLine = doc.lineAt(openingPos[0]),
            isTableRow = isTable(tree, openingPos[0]);

        if (isTableRow) {

            if (type == "spoiler") {
                openingDelim.lastIndex = currentLine.to;
                continue;
            }

            for (verticalBarChar.lastIndex = openingPos[0] - currentLine.from;;) {
                let verticalBarPos = verticalBarChar.exec(currentLine.text)?.index;

                if (!verticalBarPos) {
                    endCellOffset = currentLine.to;
                    break;

                } else if (isColumnSeparator(tree, verticalBarPos + currentLine.from)) {
                    endCellOffset = verticalBarPos + currentLine.from;
                    break;
                }
            }
        }

        if (openingDelim.lastIndex > endLineOffset) {

            doubleNewLineChar.lastIndex = openingDelim.lastIndex;
            endLineOffset = doubleNewLineChar.exec(text)?.index || text.length;
        }

        [delimPos[0], delimPos[1]] = openingPos;

        while (true) {

            let closingPos = closingDelim.exec(text)?.indices![0];

            if (!closingPos || closingDelim.lastIndex > endLineOffset || (isTableRow && closingDelim.lastIndex > endCellOffset)) {
                delimPos[2] = delimPos[3] = openingDelim.lastIndex = isTableRow ? endCellOffset : endLineOffset;
                closingDelim.lastIndex > endLineOffset && (endLineOffset = doubleNewLineChar.exec(text)?.index || text.length);
                // if (type == "spoiler") { continue mainLoop }

            } else {
                if (isRestrictedPos(tree, closingPos[0])) { continue }
                openingDelim.lastIndex = closingPos[1];
                [delimPos[2], delimPos[3]] = closingPos;
            }

            break;
        }

        delimPosCollection.push(delimPos);
    }

    closingDelim.lastIndex &&= 0;
    return delimPosCollection;
}

/**
 * @returns
 */
export const extendedFormattingField: StateField<{delimField: Map<DelimType, ReturnType<typeof getDelimiterFromEditor>>, treeLength: number}> = StateField.define({

    create(state) {

        let delimField = new Map<DelimType, ReturnType<typeof getDelimiterFromEditor>>();
        let tree = syntaxTree(state);

        delimRegExps.forEach((value, type) => {
            delimField.set(type, getDelimiterFromEditor(state.doc, tree, type, value.openingDelim, value.closingDelim));
        });

        return {delimField, treeLength: tree.length};

    },

    update(value, transaction) {

        let tree = syntaxTree(transaction.state);
        
        transaction.effects.forEach((value: StateEffect<{context: ParseContext, tree: Tree}>) => {
            tree = (value.value?.tree ?? tree);
        });

        if (transaction.docChanged || tree.length != value.treeLength) {

            let from = Math.min(value.treeLength, tree.length);
            value.treeLength = tree.length;

            transaction.changes.iterChangedRanges((fromA) => {
                from = Math.min(from, fromA);
            }, false);

            value.delimField.forEach((posCollection, type) => {
                let {openingDelim, closingDelim, length} = delimRegExps.get(type)!;
                getDelimiterFromEditor(transaction.state.doc, tree, type, openingDelim, closingDelim, {from, delimLength: length, posCollection});
            });
		}

        return value;
    }
});