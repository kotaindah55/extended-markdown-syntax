import { syntaxTree } from "@codemirror/language";
import { type EditorState } from "@codemirror/state";

/**
 * Ensure whether this range will be parsed or not
 * 
 * @param type - the type of delimiter
 * @returns {boolean} if it returns true then the range between {@link from} and {@link to} will not be parsed
 */
export function isRestrictedRange(state: EditorState, from: number, to: number, type: string): boolean {
    let isRestrictedRange: boolean = false;
    syntaxTree(state).iterate({
        from,
        to,
        enter: (node) => {
            if (/(?:^inline-code)|(?:^tag)|(?:HyperMD-codeblock)|(?:blockid)|(?:footref_hmd-barelink)|(?:hmd-internal-link)|(?:hmd-barelink_hmd-footnote)|(?:^math)|(?:formatting-code-block)/.test(node.name)) {
                isRestrictedRange = true;
                return false; // short circuit child iteration
            }
            if (type == "sub" && /formatting-strikethrough/.test(node.name)) {
                isRestrictedRange = true;
                return false;
            }
        }
    });
    return isRestrictedRange;
}