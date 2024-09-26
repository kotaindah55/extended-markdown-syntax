import { type TableWidget, type DocViewBlock, type BlockWidget } from "@codemirror/view";
import { type MarkdownView, type Workspace, type MarkdownPostProcessor } from "obsidian";
import { postProcessorDelimRegExps } from "../regExps";
import { iterDelimReplacement, splitCells, getBlockquoteSections } from "../utils/postProcess";
import { getTextAtLine } from "../utils";

export class ExtendedFormattingPostProcessor {

    view: MarkdownView | null;
    workspace: Workspace;

    private readonly targetedElements = 'p, li, h1, h2, h3, h4, h5, h6, .callout-title-inner';
    private readonly excludedSelector = 'code, a.internal-link';

    constructor(workspace: Workspace) {
        this.view = workspace.activeEditor as typeof this.view;
        this.workspace = workspace;
    }

    private format(contentEl: HTMLElement, rawText: string, isTableCell?: boolean) {

        postProcessorDelimRegExps.forEach((delimQuery, tagName) => {
            iterDelimReplacement(contentEl, rawText, delimQuery, tagName, this.excludedSelector, isTableCell);
        });
    }

    postProcess: MarkdownPostProcessor = (container, ctx) => {

        let sectionInfo = ctx.getSectionInfo(container);

        if (sectionInfo) {

            let rawTextData = getTextAtLine(sectionInfo.text, sectionInfo.lineStart, sectionInfo.lineEnd);
            let firstChild = container.firstElementChild;

            if (firstChild?.tagName == "TABLE") {

                splitCells(rawTextData).forEach((rawText, i) => {
                    this.format(container.querySelectorAll<HTMLElement>("td, th")[i], rawText, true);
                });
                
            } else if (firstChild?.tagName == "BLOCKQUOTE") {

                getBlockquoteSections(rawTextData, false).forEach((section, i) => {
                    this.format(container.querySelectorAll<HTMLElement>(this.targetedElements)[i], section.text);
                });

            } else if (firstChild?.classList.contains("callout")) {

                getBlockquoteSections(rawTextData, true).forEach((section, i) => {
                    this.format(container.querySelectorAll<HTMLElement>(this.targetedElements)[i], section.text);
                });

            } else {

                container.querySelectorAll<HTMLElement>(this.targetedElements).forEach(contentEl => {
                    this.format(contentEl, rawTextData);
                });
            }

            container.querySelectorAll<HTMLElement>("spoiler").forEach(el => {
                el.addEventListener("click", event => {
                    let spoiler = event.currentTarget as HTMLElement;
                    spoiler.hasClass("cmx-revealed") ? spoiler.removeClass("cmx-revealed") : spoiler.addClass("cmx-revealed");
                })
            })

        } else {
            
            let cmEditor = this.view?.editor?.cm ??
                this.workspace._["quick-preview"]
                .find((evtRef) => evtRef.ctx?.hasOwnProperty("editMode") && evtRef.ctx?.path == ctx.sourcePath)
                ?.ctx?.editMode.cm!;

            if (container.classList.contains("table-cell-wrapper")) {

                let tableBlock: DocViewBlock<TableWidget> | undefined = cmEditor.docView.children.find(el => el.widget?.containerEl == ctx.containerEl);
                let tableCells = tableBlock?.widget?.cellChildMap.keys()!;

                for (let cell of tableCells) {
                    if (cell.contentEl == ctx.el) {
                        this.format(container, cell.text, true);
                        break;
                    }
                }

            } else if (ctx.containerEl.classList.contains("cm-callout")) {

                let calloutBlock: DocViewBlock<BlockWidget> | undefined = cmEditor.docView.children.find(el => el.widget?.containerEl == ctx.containerEl);
                let calloutText = calloutBlock?.widget?.text!;

                getBlockquoteSections(calloutText, true).forEach((section, i) => {
                    this.format(container.querySelectorAll<HTMLElement>(this.targetedElements)[i], section.text);
                });
            }
        }
    }
}