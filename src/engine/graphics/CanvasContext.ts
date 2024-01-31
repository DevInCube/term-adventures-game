import { canvasPosition } from "../../main";
import { Color } from "../math/Color";
import { Faces } from "../math/Face";
import { Vector2 } from "../math/Vector2";
import { CellInfo } from "./CellInfo";
import { cellStyle } from "./cellStyle";
import { Layer } from "./Layers";

// TODO: remove this and draw in GraphicsEngine.
export class CanvasContext {
    private _context: CanvasRenderingContext2D | undefined; 
    private _objectsContext: CanvasRenderingContext2D | undefined; 
    private _particlesContext: CanvasRenderingContext2D | undefined; 
    private _shadowMaskContext: CanvasRenderingContext2D | undefined; 
    private _lightColorContext: CanvasRenderingContext2D | undefined; 
    private _uiContext: CanvasRenderingContext2D | undefined; 
    private background: Color | undefined;
    private size: Vector2;
    private objects: CellInfo[][][] = [];
    private particles: CellInfo[][][] = [];
    private ui: CellInfo[][][] = [];
    private buffer: HTMLCanvasElement;
    private objectsBuffer: HTMLCanvasElement;
    private weatherBuffer: HTMLCanvasElement;
    private shadowMaskBuffer: HTMLCanvasElement;
    private lightColorBuffer: HTMLCanvasElement;
    private uiBuffer: HTMLCanvasElement;

    constructor(public canvas: HTMLCanvasElement) {
        this.buffer = document.createElement("canvas");
        this.buffer.width = canvas.width;
        this.buffer.height = canvas.height;

        this.objectsBuffer = this.createBuffer();
        this.weatherBuffer = this.createBuffer();
        this.shadowMaskBuffer = this.createBuffer();
        this.lightColorBuffer = this.createBuffer();
        this.uiBuffer = this.createBuffer();
    }

    public setBackground(color: Color | undefined, size: Vector2) {
        this.background = color;
        this.size = size;
    }

    private createBuffer() {
        const buffer = document.createElement("canvas");
        buffer.width = this.canvas.width;
        buffer.height = this.canvas.height;
        return buffer;
    }

    private addTo(grid: CellInfo[][][], pos: Vector2, cellInfo: CellInfo) {
        if (!grid[pos.y]) {
            grid[pos.y] = [];
        }

        if (!grid[pos.y][pos.x]) {
            grid[pos.y][pos.x] = [];
        }

        grid[pos.y][pos.x].push(cellInfo);
    }

    add(layerName: Layer, position: Vector2, cellInfo: CellInfo) {
        if (layerName === "objects") {
            this.addTo(this.objects, position, cellInfo);
        } else if (layerName === "particles") {
            this.addTo(this.particles, position, cellInfo);
        } else if (layerName === "ui") {
            this.addTo(this.ui, position, cellInfo);
        }
    }

    draw() {
        this._context = this.buffer.getContext("2d") as CanvasRenderingContext2D;
        this._objectsContext = this.objectsBuffer.getContext("2d") as CanvasRenderingContext2D;
        this._particlesContext = this.weatherBuffer.getContext("2d") as CanvasRenderingContext2D;
        this._shadowMaskContext = this.shadowMaskBuffer.getContext("2d") as CanvasRenderingContext2D;
        this._lightColorContext = this.lightColorBuffer.getContext("2d") as CanvasRenderingContext2D;
        this._uiContext = this.uiBuffer.getContext("2d") as CanvasRenderingContext2D;

        this._context.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._objectsContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._particlesContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._shadowMaskContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._lightColorContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this._uiContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        
        const pos = new Vector2();
        for (pos.y = 0; pos.y < this.objects.length; pos.y++) {
            for (pos.x = 0; pos.x < this.objects[pos.y]?.length || 0; pos.x++) {
                const objectCells = this.objects[pos.y][pos.x] || [];
                for (const c of objectCells) {
                    this.drawCellInfo(pos, c);
                }

                const particleCells = this.particles[pos.y]?.[pos.x] || [];
                for (const c of particleCells) {
                    this.drawCellInfoOn(this._particlesContext, pos, c);
                }

                const uiCells = this.ui[pos.y]?.[pos.x] || [];
                for (const c of uiCells) {
                    this.drawCellInfoOn(this._uiContext, pos, c);
                }

                // TODO: use particle cells for light too.
                const maxIntensity = Math.max(...objectCells.map(x => x.cell.lightIntensity || 0));

                // Draw shadows.
                if (this._shadowMaskContext) {
                    const left = canvasPosition.x + pos.x * cellStyle.size.width;
                    const top = canvasPosition.y + pos.y * cellStyle.size.height;
                    const v = (maxIntensity).toString(16);
                    this._shadowMaskContext.fillStyle = `#${v}${v}${v}`;
                    this._shadowMaskContext.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
                }
            }
        }

        const ctx = this._context;
        // TODO: add physical material reflectiveness. Try with black reflective tiles. 

        if (this.background) {
            ctx.fillStyle = this.background.getStyle();
            ctx.fillRect(canvasPosition.x, canvasPosition.y, this.size.width * cellStyle.size.width, this.size.height * cellStyle.size.height);
        }

        ctx.globalCompositeOperation = "source-over";  // multiply | overlay | luminosity
        
        ctx.drawImage(this.objectsBuffer, 0, 0);
        ctx.drawImage(this.weatherBuffer, 0, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(this.shadowMaskBuffer, 0, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(this.lightColorBuffer, 0, 0);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.uiBuffer, 0, 0);

        this.canvas.getContext("2d")?.drawImage(this.buffer, 0, 0);

        // Clear grid layers.
        this.objects = [];
        this.particles = [];
        this.ui = [];
    }

    drawCellInfoOn(ctx: CanvasRenderingContext2D, cellPos: Vector2, cellInfo: CellInfo) {
        const cellDrawPosition = new Vector2(
            canvasPosition.x + cellPos.x * cellStyle.size.width + (cellStyle.size.width * cellInfo.cell.options.miniCellPosition.x),
            canvasPosition.y + cellPos.y * cellStyle.size.height + (cellStyle.size.height * cellInfo.cell.options.miniCellPosition.y));
        const cellDrawSize = new Vector2(
            cellStyle.size.width * cellInfo.cell.options.scale,
            cellStyle.size.height * cellInfo.cell.options.scale);
        //
        ctx.globalAlpha = cellInfo.extraOpacity;
        ctx.fillStyle = cellInfo.cell.backgroundColor;
        ctx.fillRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
        const fontSize = Math.max(3, (cellStyle.charSize * cellInfo.cell.options.scale) | 0);
        ctx.font =  (cellInfo.cell.options.bold ? "bold " : "") + `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // ctx.globalAlpha = 1;
        ctx.fillStyle = cellInfo.cell.textColor;
        ctx.fillText(cellInfo.cell.character, cellDrawPosition.x + cellDrawSize.width / 2, cellDrawPosition.y + cellDrawSize.height / 2 + 2);
        if (cellStyle.borderWidth > 0) {
            ctx.strokeStyle = cellStyle.borderColor;
            ctx.lineWidth = cellStyle.borderWidth;
            // palette borders
            ctx.strokeRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
        }

        // cell borders
        addObjectBorders();
        
        function addObjectBorders() {
            const borderWidth = 2;
            ctx.lineWidth = borderWidth;
            ctx.globalAlpha = cellInfo.extraOpacity ? 0.3 : 0.6;
            const [topBorder, rightBorder, bottomBorder, leftBorder] =
                Faces.map(x => cellInfo.extraBorder[x] || cellInfo.cell.options.border?.[x]);
            if (topBorder) {
                ctx.strokeStyle = topBorder;
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, cellDrawSize.width - 2, 0);
            }
            if (rightBorder) {
                ctx.strokeStyle = rightBorder;
                ctx.strokeRect(cellDrawPosition.x + cellDrawSize.width - 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
            }
            if (bottomBorder) {
                ctx.strokeStyle = bottomBorder;
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + cellDrawSize.height - 1, cellDrawSize.width - 2, 0);
            }
            if (leftBorder) {
                ctx.strokeStyle = leftBorder;
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
            }
        }
    }

    drawCellInfo(cellPos: Vector2, cellInfo: CellInfo) {
        const ctx = this._objectsContext!;
        this.drawCellInfoOn(ctx, cellPos, cellInfo);

        // Draw light colors.
        if (this._lightColorContext) {
            const pixelPos = new Vector2(
                canvasPosition.x + cellPos.x * cellStyle.size.width,
                canvasPosition.y + cellPos.y * cellStyle.size.height);

            this._lightColorContext.fillStyle = cellInfo.cell.lightColor;
            this._lightColorContext.fillRect(pixelPos.x, pixelPos.y, cellStyle.size.width, cellStyle.size.height);
        }
    }
}
