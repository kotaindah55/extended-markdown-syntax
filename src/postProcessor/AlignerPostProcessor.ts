import { type MarkdownPostProcessor } from "obsidian";
import { type ExtendedElement } from "../types";

export class AlignerPostProcessor {

    private readonly targetedElements = 'p, h1, h2, h3, h4, h5, h6, td, th, .callout-title-inner';

    constructor() {}

    private format = (el: ExtendedElement) => {
        
        let alignMark = /^!((?:left)|(?:right)|(?:center)|(?:justify))!/;
        let alignMarkExecArr: RegExpExecArray | null;

        if (el.parentElement?.tagName == "BLOCKQUOTE") { return }

        if (el.parentElement?.hasClass("callout-content")) {
            alignMark = /^ *!((?:left)|(?:right)|(?:center)|(?:justify))!/;
            alignMarkExecArr = alignMark.exec(el.innerHTML);

        } else if (el.toString() == "[object HTMLHeadingElement]" && el.childNodes[1].nodeType == 3) {
            alignMarkExecArr = alignMark.exec(el.childNodes[1].textContent!);

        } else {
            alignMarkExecArr = alignMark.exec(el.innerHTML);
        }

        if (alignMarkExecArr) {
            
            el.innerHTML = el.innerHTML.replace(alignMarkExecArr[0], "");

            if (el.hasClass("callout-title-inner")) {
                el.parentElement!.style.justifyContent = alignMarkExecArr[1] != "justify" ? alignMarkExecArr[1] : "space-between";
            } else {
                el.style.textAlign = alignMarkExecArr[1];
            }   
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