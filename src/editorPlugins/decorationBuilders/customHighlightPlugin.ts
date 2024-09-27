import { Decoration, ViewPlugin, type PluginValue, type DecorationSet, type EditorView, type ViewUpdate, drawSelection } from "@codemirror/view";
import { type Range } from "@codemirror/state";
import { editorLivePreviewField } from "obsidian";
import { checkSelectionOverlap } from "../../utils/codemirror";
import { ColorButton, HiddenWidget } from "../widgets";
import { highlightDecorator } from "../decorators";
import { customHighlightField } from "../stateFields";

class CustomHighlight implements PluginValue {

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
        let marker = highlightDecorator.markerDeco as Decoration;

        view.state.field(customHighlightField).hlCollection.forEach(hl => {
            
            let [outerFrom, innerFrom, innerTo, outerTo, color] = [...hl];
            let markerLength = color ? color.length + 2 : 0;

            newDecorations.push(
                Decoration.mark({class: `${highlightDecorator.class}-${color ?? "default"}`}).range(outerFrom, outerTo),
                Decoration.mark({class: `${highlightDecorator.class}-first-letter`}).range(innerFrom + markerLength, innerFrom + markerLength + 1),
                Decoration.mark({class: `${highlightDecorator.class}-last-letter`}).range(innerTo - 1, innerTo)
            );

            if (checkSelectionOverlap(view.state.selection, outerFrom, outerTo) || !this.isLivePreview) {
                newDecorations.push(Decoration.widget({widget: new ColorButton(
                    color, innerFrom, innerFrom + markerLength, outerFrom, outerTo, innerFrom, innerTo
                ), side: 1}).range(innerFrom));
            }

            if (color && !(checkSelectionOverlap(view.state.selection, innerFrom, innerFrom + markerLength) || !this.isLivePreview)) {
                this.hideMarker(newDecorations, marker, innerFrom, innerFrom + markerLength);
            }
        });

        return Decoration.set(newDecorations, true);
    }

    hideMarker(decorations: Range<Decoration>[], marker: Decoration, from: number, to: number) {
        let hiddenMarker = Decoration.replace({
            widget: new HiddenWidget(marker)
        });
        decorations.push(
            hiddenMarker.range(from, to)
        );
    }
}

export const customHighlightPlugin = ViewPlugin.fromClass(CustomHighlight, {
    decorations: (value) => value.decorations
});