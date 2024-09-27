import { Plugin } from "obsidian";
// import { drawSelection } from "@codemirror/view";
import { extendedFormattingPlugin, customHighlightPlugin, alignerPlugin } from "./src/editorPlugins/decorationBuilders";
import { customHighlightField, extendedFormattingField } from "./src/editorPlugins/stateFields";
import { ExtendedFormattingPostProcessor, CustomHighlightPostProcessor, AlignerPostProcessor } from "./src/postProcessor";

export default class ExtendedMarkdownSyntax extends Plugin {

    async onload() {
        await this.loadData();

        // state fields
        this.registerEditorExtension([
            extendedFormattingField,
            customHighlightField
        ]);

        // view plugins
        this.registerEditorExtension([
            extendedFormattingPlugin,
            customHighlightPlugin,
            alignerPlugin,
            // drawSelection()
        ]);

        // postprocessor
        this.registerMarkdownPostProcessor(new ExtendedFormattingPostProcessor(this.app.workspace).postProcess);
        this.registerMarkdownPostProcessor(new CustomHighlightPostProcessor().postProcess);
        this.registerMarkdownPostProcessor(new AlignerPostProcessor().postProcess);

        console.log("Load Extended Markdown Syntax");
    }

    onunload(): void {
        console.log("Unload Extended Markdown Syntax");
    }
}