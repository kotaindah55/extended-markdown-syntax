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
        ["quick-preview"]: EventRef<MarkdownView>[];
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
        children: DocViewBlock<any>[];
    }

    interface DocViewBlock<T extends BlockWidget> {
        widget?: T;
    }

    class BlockWidget extends WidgetType {
        toDOM(view: EditorView): HTMLElement;
        containerEl: HTMLElement;
        text: string;
    }

    class TableWidget extends BlockWidget {
        cellChildMap: Map<TableCell, unknown>;
    }

}