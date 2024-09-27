import { type MarkdownPostProcessor } from "obsidian";

export class AlignerPostProcessor {

    private readonly targetedElements = 'p, h1, h2, h3, h4, h5, h6, td, th, .callout-title-inner';

    constructor() {}

    private format = (el: HTMLElement) => {
        
        let alignMark = /^!((?:left)|(?:right)|(?:center)|(?:justify))!/d;
        let alignMarkExecArr: RegExpExecArray | null;
        let firstChildNode = el.firstChild;

        if (!firstChildNode || el.parentElement?.tagName == "BLOCKQUOTE") { return }

        if (el instanceof HTMLHeadingElement && (firstChildNode = el.childNodes[1]) instanceof Text) {
            alignMarkExecArr = alignMark.exec(firstChildNode.textContent ?? "");

        } else {
            
            if (!(firstChildNode instanceof Text)) { return }

            el.parentElement?.hasClass("callout-content") && (alignMark = /^ *!((?:left)|(?:right)|(?:center)|(?:justify))!/d);
            alignMarkExecArr = alignMark.exec(firstChildNode.textContent ?? "");
        }

        if (alignMarkExecArr) {
            let [from, to] = alignMarkExecArr.indices![0];
            firstChildNode.replaceData(from, to - from, "");
            el.addClass(`cmx-align-${alignMarkExecArr[1]}`);
        }
    }

    postProcess: MarkdownPostProcessor = (container) => {
        if (container.classList.contains("table-cell-wrapper")) {
            this.format(container);
        } else {
            container.querySelectorAll<HTMLElement>(this.targetedElements).forEach((el) => {
                this.format(el);
            });
        }
    }
}