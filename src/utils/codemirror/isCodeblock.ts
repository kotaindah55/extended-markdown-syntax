import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

export function isCodeblock(view: EditorView, from: number, to: number): boolean {
    let isCodeblock: boolean = false;
    syntaxTree(view.state).iterate({
        from,
        to,
        enter: (node) => {
            // console.log(node.name);
            if (/^inline-code/.test(node.name) || node.name == 'HyperMD-codeblock_HyperMD-codeblock-bg') {
                isCodeblock = true;
                return false; // short circuit child iteration
            }
        }
    });
    return isCodeblock;
}