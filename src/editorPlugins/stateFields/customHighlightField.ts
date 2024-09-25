import { type Text, StateField, type StateEffect } from "@codemirror/state";
import { ParseContext, syntaxTree } from "@codemirror/language";
import { type SyntaxNode, type Tree } from "@lezer/common";
import { type HighlightProp } from "../../types";

function getHighlight(doc: Text, tree: Tree, previous?: {from: number, hlCollection: HighlightProp[]}) {

    let text = doc.toString();
    let hlChecker = /highlight/;
    let hlDelim = /(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))==+(?=(?:\{([\w\d\-]+)\})|[^=\s])/g;
    let hlCollection: HighlightProp[] = [];

    if (previous) {
        
        hlCollection = previous.hlCollection;
        let {from} = previous,
            lastIndex = from - 2;

        hlCollection.length && hlCollection.findLast((hlProp, index, collection) => {

            if (from >= hlProp[1]) {

                if (from < hlProp[3] || from == hlProp[3]) {
                    lastIndex = hlProp[0];
                    collection.splice(index);
                } else {
                    collection.splice(index + 1);
                }
                return true;
                
            } else if (index == 0) {
                collection.splice(0);
                return true;
            }
        });

        hlDelim.lastIndex = lastIndex;
    }

    for (
        let hlMatch = hlDelim.exec(text),
        node: SyntaxNode;
        hlMatch && (node = tree.resolveInner(hlMatch.index, 1));
        hlMatch = hlDelim.exec(text)
    ) {

        let openingFrom = node.from;

        if (openingFrom > tree.length) { break }

        if (!hlChecker.test(node.name)) { continue }

        let to: number;

        while (true) {
            to = node.to;
            node = tree.resolveInner(node.to, 1);
            if (!hlChecker.test(node.name)) { break }
        }

        let lastNode = tree.resolveInner(to, -1);
        let innerHlEnd = /formatting-highlight/.test(lastNode.name) ? lastNode.from : to;

        // opening delim start : openingFrom
        //               end   : hlDelim.lastIndex
        // closing delim start : innerHlEnd
        //               end   : to
        // highlight color     : hlMatch[1]
        hlCollection.push([openingFrom, hlDelim.lastIndex, innerHlEnd, to, hlMatch[1]]);
        hlDelim.lastIndex = to;
    }

    return hlCollection;
}

export const customHighlightField: StateField<{hlCollection: ReturnType<typeof getHighlight>, treeLength: number}> = StateField.define({

    create(state) {

        let tree = syntaxTree(state);

        return {
            hlCollection: getHighlight(state.doc, tree),
            treeLength: tree.length
        };
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

            getHighlight(transaction.state.doc, tree, {from, hlCollection: value.hlCollection})
		}

        return value;
    }
})