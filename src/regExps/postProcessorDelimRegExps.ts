import { DelimType } from "../enums";

export const postProcessorDelimRegExps = new Map([
    [DelimType.U, {
        openingDelim: /\+(?=\+(?!\s))/gd,
        closingDelim: /(?<!\s)\+(?=\+)/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\+(\\)?\+)(?!$|\s)(?=(\+)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\+(\\)?\+)/gd
        },
        length: 2,
        origin: "++"
    }],
    [DelimType.Sup, {
        openingDelim: /\^(?!\s)/gd,
        closingDelim: /(?<!\s)\^/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\^()?)(?!$|\s)(?=(\^)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\^()?)/gd
        },
        length: 1,
        origin: "^"
    }],
    [DelimType.Sub, {
        openingDelim: /~(?!\s)/gd,
        closingDelim: /(?<!\s)~/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(~()?)(?!$|\s)(?=(~)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(~()?)/gd
        },
        length: 1,
        origin: "~"
    }],
    [DelimType.Spoiler, {
        openingDelim: /\|(?=\|(?!\s))/gd,
        closingDelim: /(?<!\s)\|(?=\|)/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\|(\\)?\|)(?!$|\s)(?=(\|)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\|(\\)?\|)/gd
        },
        length: 2,
        origin: "||"
    }]
])