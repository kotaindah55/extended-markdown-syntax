import { BlockquoteChildSection } from "../../interfaces";

/**
 * Splits the blockquote/callout into {@link BlockquoteChildSection sections}.
 * This function also removes codeblocks, mathblocks, and empty row instead
 * of keeping them in the sections, as they will not be parsed. Rows that are
 * not interspersed by empty row will be considered as one section.
 * 
 * @example
 * ````
 * > first section
 * > merged to the first
 * > 
 * > $$
 * > math block
 * > $$
 * > ```
 * > codeblock
 * > ```
 * >
 * > second section
 * ````
 * 
 * The blockquote above will be divided into 2 sections
 * 
 * @param text - Must be a markdown text representing a blockquote/callout
 * @param isCallout - If true then the first line representing callout title will be a standalone section
 */
export function getBlockquoteSections(text: string, isCallout: boolean) {

    let blockquoteDelim = /^ *>/;
    let sections: BlockquoteChildSection[] = [];

    text.split("\n").forEach((text) => { // splits blockquotes into lines based on "\n" character

        /** blockquote level */
        let level = 0;
        
        while (blockquoteDelim.test(text) && ++level) { // the blockquote level is dependent on the number of delimiters
            text = text.replace(blockquoteDelim, ""); // strips out the blockquote/callout delimiters (">")
        }

        text = text.trimStart();
        sections.push({
            text: text,
            level: level
        });
    });

    // splits the blockquote/callout into sections
    loop1: for (
        let i = 0,
        /** if true then the following row will be merged with the previous row */
        mergePrevious = false;
        i < sections.length;
    ) {

        let currentLine = sections[i];

        if (isCallout && i === 0) {
            i++;
            continue;
        }
        
        if (/^```/.test(currentLine.text)) { // removes codeblock
            
            let k = 1;
            while (sections[i + k]) {
                let {level, text} = sections[i + k++];
                if (
                    (text === "" && level < currentLine.level) ||
                    (/^``` *$/.test(text) && level == currentLine.level)
                ) { break }
            }

            sections.splice(i, k), mergePrevious &&= false;
            continue loop1;

        } else if (/^\$\$/.test(currentLine.text)) { // removes mathblock

            let k = 1;
            while (sections[i + k]) {
                let {level, text} = sections[i + k++];
                if (
                    (text === "" && level < currentLine.level && k--) ||
                    (/^\$\$ *$/.test(text) && level == currentLine.level)
                ) { break }
            }

            if (k !== 1) {
                sections.splice(i, k), mergePrevious &&= false;
                continue loop1;
            }

        } else if (currentLine.text === "") { // removes empty row
            sections.splice(i, 1), mergePrevious &&= false;
            continue loop1;
        }
        
        // rows that are not interspersed by empty row will be considered as one section.
        (mergePrevious && sections[i - 1].level >= currentLine.level) && (sections[i - 1].text += `\n${sections.splice(i, 1)[0].text}`, i--);
        i++, mergePrevious ||= true;
    }
    
    return sections;
}