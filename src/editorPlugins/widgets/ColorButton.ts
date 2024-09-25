import { WidgetType, EditorView } from "@codemirror/view"
import { Menu } from "obsidian";

/**
 * These code snippets are taken from 
 * https://github.com/Superschnizel/obisdian-fast-text-color/blob/master/src/widgets/ColorWidget.ts
 * with some modifications.
*/
export class ColorButton extends WidgetType {

    color: string;
    markerFrom: number;
    markerTo: number;
    menu: Menu | null;
    outerFrom: number;
    outerTo: number;
	innerFrom: number;
	innerTo: number;

    private readonly colors = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink", "accent", "default"];

    constructor(color: string = "default", markerFrom: number, markerTo: number, outerFrom: number, outerTo: number, innerFrom: number, innerTo: number) {
        super();
        this.color = color;
        this.markerFrom = markerFrom;
        this.markerTo = markerTo;
        this.outerFrom = outerFrom;
        this.outerTo = outerTo;
		this.innerFrom = innerFrom;
		this.innerTo = innerTo;
    }

    eq(other: ColorButton) {
        return other.color == this.color;
    }

    toDOM(view: EditorView): HTMLElement {
        let btn = document.createElement("span");

        btn.setAttribute("aria-hidden", "true");
        btn.className = "cmx-color-btn";

        btn.onclick = evt => {
            view.dispatch({
				selection: {
					anchor: this.markerFrom,
					head: this.markerTo
				}
			});
        }

        btn.onmouseover = evt => {
			if (this.menu != null) {
				return;
			}

			this.menu = new Menu();

            // @ts-ignore
            (this.menu.dom as HTMLElement).addClass("es-highlight-colors-modal");

			this.colors.forEach((color) => {
				this.menu!.addItem((item) => {
					item
						.setTitle(color)
						.onClick(evt => {
							view.dispatch({
								changes: {
									from: this.markerFrom,
									to: this.markerTo,
									insert: color != "default" ? `{${color}}` : ""
								}
							})
						})
						.setIcon("palette");
					// @ts-ignore
					(item.dom as HTMLElement).addClass(`es-item-${color}`);
				})
			});

			this.menu.addItem(item => {
				item
					.setTitle("Remove")
					.setIcon("ban")
					.onClick((evt) => {
						view.dispatch({
							changes: [{
								from: this.outerFrom,
								to: this.markerTo,
								insert: ''
							}, {
								from: this.innerTo,
								to: this.outerTo,
								insert: ''
							}]
						});
					});
			});

			const rect = btn.getBoundingClientRect();
			this.menu.showAtPosition({ x: rect.left, y: rect.bottom })
		}

        return btn;
    }

    ignoreEvent() {
        return false;
    }
}