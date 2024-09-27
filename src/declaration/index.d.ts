import { type WidgetType } from "@codemirror/view";
import { type TableCell } from "obsidian";

declare module "obsidian" {

    interface Workspace {
        _: EventListener;
    }

    interface TableCell {
        row: number;
        col: number;
        text: string;
        contentEl: HTMLElement;
    }

    interface EventListener {
        [name: string]: EventRef[];
    }

    interface EventRef<T = unknown> {
        ctx?: T;
    }

    interface MarkdownView {
        path: string;
    }

    interface MarkdownPostProcessorContext {
        containerEl: HTMLElement;
        el: HTMLElement;
    }

}

declare module "@codemirror/view" {

    interface EditorView {
        docView: DocView;
    }

    interface DocView {
        children: DocViewBlock[];
    }

    interface DocViewBlock<T = BlockWidget> {
        widget?: T;
    }

    interface TableBlock extends DocViewBlock<TableWidget> {
        widget: TableWidget;
    }

    interface BlockWidget extends WidgetType {
        toDOM(view: EditorView): HTMLElement;
        containerEl: HTMLElement;
        text: string;
    }

    interface TableWidget extends BlockWidget {
        cellChildMap: Map<TableCell, unknown>;
    }

}