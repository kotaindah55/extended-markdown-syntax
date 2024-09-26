/**
 * Replace text by position
 */
export function replaceStringByPos(text: string, replaceValue: string, from: number, to: number) {
    let replaceArea = new RegExp(`.{${to - from}}`, "ys");
    replaceArea.lastIndex = from;
    return text.replace(replaceArea, replaceValue);
}