import { DelimType } from "../enums";

export const postProcessorDelimRegExps = new Map([
    [DelimType.U, {
        openingDelim: /\+\+(?![\s]|$|(?:<br>\n?))/gd,
        closingDelim: /(?<![\s]|(?:<br>\n?))\+\+/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\+(\\)?\+)(?!$|\s)(?=(\+)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\+(\\)?\+)/gd
        },
        length: 2
    }],
    [DelimType.Sup, {
        openingDelim: /\^(?![\s]|$|(?:<br>\n?))/gd,
        closingDelim: /(?<![\s]|(?:<br>\n?))\^/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\^()?)(?!$|\s)(?=(\^)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\^()?)/gd
        },
        length: 1
    }],
    [DelimType.Sub, {
        openingDelim: /~(?![\s]|$|(?:<br>\n?))/gd,
        closingDelim: /(?<![\s]|(?:<br>\n?))~/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(~()?)(?!$|\s)(?=(~)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(~()?)/gd
        },
        length: 1
    }],
    [DelimType.Spoiler, {
        openingDelim: /\|\|(?![\s]|$|(?:<br>\n?))/gd,
        closingDelim: /(?<![\s]|(?:<br>\n?))\|\|/gd,
        raw: {
            openingDelim: /((?<!\\)(?:\\{2})*\\)?(\|(\\)?\|)(?!$|\s)(?=(\|)?)/gd,
            closingDelim: /(?:((?<!\\)(?:\\{2})*(?<!\s)\\)|(?<![\\\s])|((?<!\\)(?:\\{2})+))(\|(\\)?\|)/gd
        },
        length: 2
    }]
])