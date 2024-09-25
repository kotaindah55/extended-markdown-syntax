import { Decoration } from "@codemirror/view";
import { DelimType } from "../../enums";

export const formattingDecorators = new Map([
    [DelimType.U, Decoration.mark({class: "cmx-underline", delimDeco: Decoration.mark({class: "cmx-underline cmx-formatting-underline"})})],
    [DelimType.Sup, Decoration.mark({class: "cmx-superscript", delimDeco: Decoration.mark({class: "cmx-superscript cmx-formatting-superscript"})})],
    [DelimType.Sub, Decoration.mark({class: "cmx-subscript", delimDeco: Decoration.mark({class: "cmx-subscript cmx-formatting-subscript"})})],
    [DelimType.Spoiler, Decoration.mark({class: "cmx-spoiler", delimDeco: Decoration.mark({class: "cmx-spoiler cmx-formatting-spoiler"})})]
]);