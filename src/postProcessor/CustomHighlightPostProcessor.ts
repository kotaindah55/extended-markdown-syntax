import { type MarkdownPostProcessor } from "obsidian";
import { type ExtendedElement } from "../types";

export class CustomHighlightPostProcessor {

    constructor() {}

    private format = (el: ExtendedElement) => {
        
        let markElements = el.querySelectorAll<ExtendedElement>("mark");
        let colorMark = /^\{([\w\d\-_]+)\}/;

        markElements.forEach((mark) => {
            let colorMarkExecArr = colorMark.exec(mark.innerText);
            if (colorMarkExecArr) {
                mark.innerHTML = mark.innerHTML.replace(colorMarkExecArr[0], "");
                mark.classList.add(`cmx-highlight-${colorMarkExecArr[1]}`);
            }
        });
    }

    postProcess: MarkdownPostProcessor = (container, t) => {
        this.format(container);
    }
}