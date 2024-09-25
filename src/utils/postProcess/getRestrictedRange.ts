import { Pos } from "../../types";

export function getRestrictedRanges(text: string) {

    let query = /(\\)|`(?:[^`])+`|\[\[\[?(?!\[)(?:.|\s)+?(?<!\])\]\]|\$\$(?:.|\s)*?\$\$|\$(?!\s|\$).+?(?<!\s)\$/gd;
    let restrictedRanges: Pos[] = [];

    for (let match = query.exec(text); match; match = query.exec(text)) {
        match[1] ? query.lastIndex += 1 : restrictedRanges.push(match.indices![0]);
    }

    return restrictedRanges;
}