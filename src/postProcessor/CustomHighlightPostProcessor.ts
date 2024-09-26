import { type MarkdownPostProcessor } from "obsidian";

export class CustomHighlightPostProcessor {

    constructor() {}

    private format = (el: HTMLElement) => {
        
        let markElements = el.querySelectorAll<HTMLElement>("mark");
        let colorMark = /^\{([\w\d\-_]+)\}/d;

        markElements.forEach((mark) => {

            let firstChildNode = mark.firstChild;

            if (!(firstChildNode instanceof Text && firstChildNode.textContent)) { return }

            let colorMarkExecArr = colorMark.exec(firstChildNode.textContent);

            if (colorMarkExecArr) {
                
                let [from, to] = colorMarkExecArr.indices![0];
                firstChildNode.replaceData(from, to - from, "");
                mark.classList.add(`cmx-highlight-${colorMarkExecArr[1]}`);
            }
        });
    }

    postProcess: MarkdownPostProcessor = (container, t) => {
        this.format(container);
    }
}