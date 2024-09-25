import { Decoration, ViewPlugin, type PluginValue, type DecorationSet, type EditorView, type ViewUpdate } from "@codemirror/view";
import { type Range } from "@codemirror/state";
import { RegExpCursor } from "@codemirror/search";
import { editorLivePreviewField } from "obsidian";
import { checkSelectionOverlap } from "../utils/codemirror";
import { isCodeblock } from "../utils/codemirror";
import { HiddenWidget } from "./widgets";
import { alignerDecorators } from "./decorators";

class Aligner implements PluginValue {

    decorations: DecorationSet;
    isLivePreview: boolean;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
        this.isLivePreview = view.state.field(editorLivePreviewField);
    }

    update(update: ViewUpdate) {

        if (update.state.field(editorLivePreviewField) == this.isLivePreview) {
            this.decorations = this.buildDecorations(update.view);
        }

        this.isLivePreview = update.state.field(editorLivePreviewField);

        if (update.docChanged || update.selectionSet) {
            this.decorations = this.buildDecorations(update.view);
            
        }
    }

    buildDecorations(view: EditorView) {

        let newDecorations: Range<Decoration>[] = [];

        alignerDecorators.forEach((deco) => {

            let searchCursor = new RegExpCursor(view.state.doc, deco.spec.query).next();
            if (searchCursor.done) {return newDecorations};
            let marker = deco.spec.marker as Decoration;

            while (!searchCursor.done) {
                let [from, to] = [searchCursor.value.from, searchCursor.value.to];
                if (!isCodeblock(view, from, to)) {
                    let linePosFrom = view.state.doc.lineAt(from).from;
                    newDecorations.push(deco.range(linePosFrom, linePosFrom));
                    newDecorations.push(marker.range(from, to));
                    if (!checkSelectionOverlap(view.state.selection, from, to) && this.isLivePreview) {
                        this.hideMarker(newDecorations, marker, from, to);
                    }
                }
                searchCursor.next();
            }
        });

        return Decoration.set(newDecorations, true);
    }

    hideMarker(decorations: Range<Decoration>[], marker: Decoration, from: number, to: number) {
        let hiddenMarker = Decoration.replace({
            widget: new HiddenWidget(marker)
        });
        decorations.push(hiddenMarker.range(from, to));
    }
}

export const alignerPlugin = ViewPlugin.fromClass(Aligner, {
    decorations: (value) => value.decorations
});