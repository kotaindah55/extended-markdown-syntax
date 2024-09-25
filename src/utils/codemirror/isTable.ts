import { type Tree } from "@lezer/common";

export function isTable(tree: Tree, pos: number): boolean {
    let isTable: boolean = false;
    tree.iterate({
        from: pos,
        to: pos,
        enter: (node) => {
            if (/table/.test(node.name)) {
                isTable = true;
                return false; // short circuit child iteration
            }
        }
    });
    return isTable;
}