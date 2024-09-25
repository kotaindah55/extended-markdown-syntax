/**
 * Get text on a specific line, based on newline character (\n).
 */
export function getTextAtLine(text: string, lineStart: number, lineEnd: number) {
    return text.split("\n").slice(lineStart, lineEnd + 1).join("\n");
}