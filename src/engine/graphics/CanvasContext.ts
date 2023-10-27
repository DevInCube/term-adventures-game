import { leftPad, topPad } from "../../main";
import { CellInfo } from "./CellInfo";
import { cellStyle } from "./GraphicsEngine";

export class CanvasContext {
    previous: CellInfo[][][] = [];
    current: CellInfo[][][] = [];

    constructor(public context: CanvasRenderingContext2D) {
    }

    add(position: [number, number], cellInfo: CellInfo) {
        const [top, left] = position;
        if (!this.current[top])
            this.current[top] = [];
        if (!this.current[top][left])
            this.current[top][left] = [];
        this.current[top][left].push(cellInfo);
    }

    draw() {
        for (let y = 0; y < this.current.length; y++) {
            for (let x = 0; x < this.current[y].length; x++) {
                if (!(this.current[y] && this.current[y][x])) continue;

                if (!(this.previous[y] && this.previous[y][x]) ||
                    !(CanvasContext.compare(this.current[y][x], this.previous[y][x]))) {
                    for (let c of this.current[y][x]) {
                        this.drawCellInfo(y, x, c);
                    }
                }
            }
        }

        this.previous = this.current;
        this.current = [];
    }

    static compare(_this: CellInfo[], array: CellInfo[]): boolean {
        // if the other array is a falsy value, return
        if (!_this || !array)
            return false;

        // compare lengths - can save a lot of time 
        if (_this.length !== array.length)
            return false;

        for (let i = 0, l = _this.length; i < l; i++) {
            if (!compare(_this[i], array[i])) {
                // Warning - two different object instances will never be equal: {x:20} !== {x:20}
                return false;
            }
        }
        return true;

        function compare(a: CellInfo, b: CellInfo) {
            return a.transparent === b.transparent
                && a.border[0] === b.border[0]
                && a.border[1] === b.border[1]
                && a.border[2] === b.border[2]
                && a.border[3] === b.border[3]
                && a.cell.character === b.cell.character
                && a.cell.textColor === b.cell.textColor
                && a.cell.backgroundColor === b.cell.backgroundColor;
        }
    }

    drawCellInfo(topPos: number, leftPos: number, cellInfo: CellInfo) {
        const ctx = this.context;
        //
        const left = leftPad + leftPos * cellStyle.size.width;
        const top = topPad + topPos * cellStyle.size.height;
        //
        ctx.globalAlpha = cellInfo.transparent ? 0.2 : 1;
        ctx.fillStyle = cellInfo.cell.backgroundColor;
        ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
        ctx.font = `${cellStyle.charSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // ctx.globalAlpha = 1;
        ctx.fillStyle = cellInfo.cell.textColor;
        ctx.fillText(cellInfo.cell.character, left + cellStyle.size.width / 2, top + cellStyle.size.height / 2 + 2);
        if (cellStyle.borderWidth > 0) {
            ctx.strokeStyle = cellStyle.borderColor;
            ctx.lineWidth = cellStyle.borderWidth;
            // palette borders
            ctx.strokeRect(left, top, cellStyle.size.width, cellStyle.size.height);
        }
        // cell borders
        addObjectBorders();

        function addObjectBorders() {
            const borderWidth = 2;
            ctx.lineWidth = borderWidth;
            ctx.globalAlpha = cellInfo.transparent ? 0.3 : 0.6;
            if (cellInfo.border[0]) {
                ctx.strokeStyle = cellInfo.border[0];
                ctx.strokeRect(left + 1, top + 1, cellStyle.size.width - 2, 0);
            }
            if (cellInfo.border[1]) {
                ctx.strokeStyle = cellInfo.border[1];
                ctx.strokeRect(left + cellStyle.size.width - 1, top + 1, 0, cellStyle.size.height - 2);
            }
            if (cellInfo.border[2]) {
                ctx.strokeStyle = cellInfo.border[2];
                ctx.strokeRect(left + 1, top + cellStyle.size.height - 1, cellStyle.size.width - 2, 0);
            }
            if (cellInfo.border[3]) {
                ctx.strokeStyle = cellInfo.border[3];
                ctx.strokeRect(left + 1, top + 1, 0, cellStyle.size.height - 2);
            }
        }
    }
}
