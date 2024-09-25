import { DelimType } from "../enums";

export const delimRegExps = new Map([
    [DelimType.U, {
        openingDelim: /(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))\+\+(?![\+\s]|$)/gd,
        closingDelim: /(?:(?<![\s\\]|^)|(?<=(?<!\\)(?:\\{2})+))\+\+/gd,
        length: 2
    }],
    [DelimType.Sup, {
        openingDelim: /(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))\^(?![\^\s]|$)/gd,
        closingDelim: /(?:(?<![\s\\]|^)|(?<=(?<!\\)(?:\\{2})+))\^/gd,
        length: 1
    }],
    [DelimType.Sub, {
        openingDelim: /(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))~(?![~\s]|$)/gd,
        closingDelim: /(?:(?<![\s\\]|^)|(?<=(?<!\\)(?:\\{2})+))~/gd,
        length: 1
    }],
    [DelimType.Spoiler, {
        openingDelim: /(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))\|\|(?![|\s]|$)/gd,
        closingDelim: /(?:(?<![\s\\]|^)|(?<=(?<!\\)(?:\\{2})+))\|\|/gd,
        length: 2
    }]
]);

/*
single: /((?<!\\)(?:\\{2})*\\)?(\^()?)(?!$|\s)(?=(\^)?)/gd
double: /((?<!\\)(?:\\{2})*\\)?(\^(\\)?\^)(?!$|\s)(?=(\^)?)/gd

single: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\^()?)/gd
double: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\^(\\)?\^)/gd
*/