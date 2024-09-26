import { getRestrictedRanges } from ".";

export function getDelimCounts(text: string, openingDelim: RegExp, closingDelim: RegExp, originDelim: string, ignoreEscaper: boolean = false) {

    let restrictedRanges = getRestrictedRanges(text);
    let counts: number[] = [];

    let delimChar = originDelim.charAt(0);
    ignoreEscaper && (text = text.replaceAll(`\\${delimChar}`, delimChar));

    openingDelim.lastIndex = 0;
    closingDelim.lastIndex = 0;

    for (let openingMatch = openingDelim.exec(text), i = 0; openingMatch; openingMatch = openingDelim.exec(text)) {

        let [all, escaper, target, slippedBackslash, next] = openingMatch.indices!;

        if (restrictedRanges.some(range => range[0] <= all[0] && range[1] >= all[1])) {
            continue;
        }

        closingDelim.lastIndex = all[1];

        if (escaper || slippedBackslash || next) {
            openingDelim.lastIndex = target[0] + 1;
            i++;
            continue;
        }

        counts.push(i++);

        for(
            let closingMatch = closingDelim.exec(text);
            closingMatch || ((openingDelim.lastIndex = text.length), false);
            closingMatch = closingDelim.exec(text)
        ) {

            let [all, escaper, nonEscaper, target, slippedBackslash] = [...closingMatch!.indices!];

            if (restrictedRanges.some(range => range[0] <= all[0] && range[1] >= all[1])) { 
                continue;
            }

            if (escaper || slippedBackslash) {
                closingDelim.lastIndex = target[0] + 1;
                i++;
                continue;
            }

            counts.push(i++);
            openingDelim.lastIndex = all[1];
            break;
        }
    }

    return counts;
}