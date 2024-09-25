import { type Tree } from "@lezer/common";

export function isColumnSeparator(tree: Tree, pos: number): boolean {
    return /hmd-table-sep/.test(tree.resolveInner(pos, 1).name);
}