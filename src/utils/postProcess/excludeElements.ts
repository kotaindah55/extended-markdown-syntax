/**
 * @deprecated
 */
export function excludeElements<T, P extends any[]>(contentEl: HTMLElement, selector: string, callback: (...args: P) => T, ...args: Parameters<typeof callback>): T {
    
    let excludedContents: string[] = [];
    let excludedEl = contentEl.querySelectorAll<HTMLElement>(selector);

    if (excludedEl.length) {

        excludedEl.forEach((el) => {
            excludedContents.push(el.innerHTML);
            el.innerHTML = "";
        });

        let returnValue = callback(...args);

        excludedEl.forEach((el, index) => {
            el.innerHTML = excludedContents[index];
        });

        return returnValue;

    } else {
        return callback(...args);
    }
}