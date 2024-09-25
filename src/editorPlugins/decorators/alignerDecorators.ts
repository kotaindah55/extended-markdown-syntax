import { Decoration } from "@codemirror/view"

export const alignerDecorators = [
    Decoration.line({
        class: "cmx-align-left",
        query: /(?<=^|^#{1,6} +)!left!/gm,
        style: "text-align: left;",
        marker: Decoration.mark({class: "cmx-align-left-marker"})
    }),
    Decoration.line({
        class: "cmx-align-right",
        query: /(?<=^|^#{1,6} +)!right!/gm,
        style: "text-align: right;",
        marker: Decoration.mark({class: "cmx-align-right-marker"})
    }),
    Decoration.line({
        class: "cmx-align-center",
        query: /(?<=^|^#{1,6} +)!center!/gm,
        style: "text-align: center;",
        marker: Decoration.mark({class: "cmx-align-center-marker"})
    }),
    Decoration.line({
        class: "cmx-align-justify",
        query: /(?<=^|^#{1,6} +)!justify!/gm,
        style: "text-align: justify;",
        marker: Decoration.mark({class: "cmx-align-justify-marker"})
    }),
]