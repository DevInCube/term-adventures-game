import { leftPad, topPad } from "../../main";
import { CellInfo } from "./CellInfo";
import { cellStyle } from "./GraphicsEngine";

// TODO: remove this and draw in GraphicsEngine.
export class CanvasContext {
    private _context: CanvasRenderingContext2D | undefined; 
    private _lightColorContext: CanvasRenderingContext2D | undefined; 
    current: CellInfo[][][] = [];
    private buffer: HTMLCanvasElement;
    private lightColorBuffer: HTMLCanvasElement;

    constructor(public canvas: HTMLCanvasElement) {
        this.buffer = document.createElement("canvas");
        this.buffer.width = canvas.width;
        this.buffer.height = canvas.height;
        this.lightColorBuffer = document.createElement("canvas");
        this.lightColorBuffer.width = canvas.width;
        this.lightColorBuffer.height = canvas.height;
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
        this._context = this.buffer.getContext("2d") as CanvasRenderingContext2D;
        this._lightColorContext = this.lightColorBuffer.getContext("2d") as CanvasRenderingContext2D;
        const ctx = this._context!;

        this._context.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._lightColorContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        
        for (let y = 0; y < this.current.length; y++) {
            for (let x = 0; x < this.current[y].length; x++) {
                for (let c of this.current[y][x]) {
                    this.drawCellInfo(y, x, c);
                }
            }
        }

        if (true) {
            ctx.globalCompositeOperation = "multiply";  // multiply | overlay | luminosity
            ctx.drawImage(this.lightColorBuffer, 0, 0);

            // TODO: add physical material reflectiveness. Try with black reflective tiles. 

            ctx.globalCompositeOperation = "source-over";
        }

        //this.canvas.getContext("2d")?.drawImage(this.lightColorBuffer, 0, 0);
        this.canvas.getContext("2d")?.drawImage(this.buffer, 0, 0);

        this.current = [];
    }

    drawCellInfo(topPos: number, leftPos: number, cellInfo: CellInfo) {
        const ctx = this._context!;
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

        // Draw light colors.
        if (this._lightColorContext) {
            this._lightColorContext.fillStyle = cellInfo.cell.lightColor;
            this._lightColorContext.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
        }

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
