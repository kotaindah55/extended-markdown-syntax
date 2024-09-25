import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

export function isHighlight(view: EditorView, from: number, to: number): boolean {
    let isHighlightFromPos: boolean = false;
    syntaxTree(view.state).iterate({
        from,
        to,
        enter: (node) => {
            if (/highlight/.test(node.name)) {
                isHighlightFromPos = true;
                return false; // short circuit child iteration
            }
        }
    });
    return isHighlightFromPos;
}