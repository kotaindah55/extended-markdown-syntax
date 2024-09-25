import { type Tree } from "@lezer/common";

export function isRestrictedPos(tree: Tree, pos: number): boolean {
    return /(?:inline-code)|(?:tag)|(?:HyperMD-codeblock)|(?:footref)|(?:hmd-internal-link)|(?:hmd-footnote)|(?:math)|(?:hmd-codeblock)|(?:formatting-strikethrough)/
        .test(tree.resolveInner(pos, 1).name);
}