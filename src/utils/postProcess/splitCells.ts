export function splitCells(text: string) {

    let rows = text.split("\n");
    let cells: string[] = [];

    rows.forEach((row, index) => {
        
        if (index === 1) { return }

        row = row.trim();
        row.startsWith("|") && (row = row.substring(1));
        row.endsWith("|") && (row = row.substring(0, row.length - 1));
        
        row.split(/(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))\|/).forEach(cell => {
            cells.push(cell);
        });
    });
    
    return cells;
}