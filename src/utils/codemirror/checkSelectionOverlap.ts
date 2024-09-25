import { EditorSelection } from "@codemirror/state";

/**
 * These code snippets are taken from 
 * https://github.com/Mara-Li/obsidian-regex-mark/blob/master/src/cmPlugin.ts
 * with some modifications.
*/
export function checkSelectionOverlap(selection: EditorSelection, from: number, to: number): boolean {
    if (!selection) {return false}
    for (const range of selection.ranges) {
		if (range.to >= from && range.from <= to) {
			return true;
		}
	    return false;
    }
    return false;
}