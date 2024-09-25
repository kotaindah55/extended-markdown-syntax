import { WidgetType, Decoration, EditorView } from "@codemirror/view"

export class HiddenWidget extends WidgetType {

    mark: Decoration;

    constructor(formattingMark: Decoration) {
        super();
        this.mark = formattingMark;
    }

    eq(other: HiddenWidget) {
        return other.mark == this.mark;
    }
    
    toDOM(view: EditorView): HTMLElement {
        return document.createElement("span");
    }
}