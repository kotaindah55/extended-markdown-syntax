import { Decoration } from "@codemirror/view";

export const highlightDecorator = {
    class: "cmx-highlight cmx-highlight",
    markerDeco: Decoration.mark({class: "cmx-highlight-marker"})
}