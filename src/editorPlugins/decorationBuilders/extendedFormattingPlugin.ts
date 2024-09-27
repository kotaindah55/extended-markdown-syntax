import { Decoration, type EditorView, type PluginValue, type DecorationSet, type ViewUpdate, ViewPlugin } from "@codemirror/view";
import { type Range } from "@codemirror/state";
import { editorLivePreviewField } from "obsidian";
import { extendedFormattingField } from "../stateFields";
import { checkSelectionOverlap } from "../../utils/codemirror";
import { HiddenWidget } from "../widgets";
import { type DelimPos } from "../../types";
import { formattingDecorators, hiddenSpoiler } from "../decorators";

class ExtendedFormatting implements PluginValue {

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

        view.state.field(extendedFormattingField).delimField.forEach((posCollection, type) => {

            if (posCollection.length === 0) {return};
            
            let decorator = formattingDecorators.get(type) as Decoration;
            let delimDecorator = decorator?.spec.delimDeco as Decoration;

            
            posCollection.forEach(pos => {

                let hasClosingDelim = pos[2] != pos[3];

                if (type != "spoiler") {
                    newDecorations.push(decorator.range(pos[1], pos[2]));
                }

                newDecorations.push(delimDecorator.range(pos[0], pos[1]));
                if (hasClosingDelim) {
                    newDecorations.push(delimDecorator.range(pos[2], pos[3]));
                }

                if ((!view.hasFocus || !checkSelectionOverlap(view.state.selection, pos[0], pos[3])) && this.isLivePreview) {
                    type == "spoiler" && newDecorations.push(hiddenSpoiler.range(pos[1], pos[2]));
                    this.hideDelim(newDecorations, delimDecorator, pos, hasClosingDelim);
                } else if (type == "spoiler") {
                    newDecorations.push(decorator.range(pos[1], pos[2]));
                }
            });
        });

        return Decoration.set(newDecorations, true);
    }

    hideDelim(decorations: Range<Decoration>[], decorator: Decoration, pos: DelimPos, hasClosingDelim: boolean) {

        let hiddenDelim = Decoration.replace({
            widget: new HiddenWidget(decorator)
        });

        decorations.push(hiddenDelim.range(pos[0], pos[1]));
        if (hasClosingDelim) {
            decorations.push(hiddenDelim.range(pos[2], pos[3]));
        }
    }
}

export const extendedFormattingPlugin = ViewPlugin.fromClass(ExtendedFormatting, {
    decorations: value => value.decorations
});