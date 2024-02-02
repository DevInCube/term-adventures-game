import { canvasPosition } from "../../main";
import { mixColors } from "../../utils/color";
import { clamp } from "../../utils/math";
import { LightInfo } from "../components/ObjectPhysics";
import { Color } from "../math/Color";
import { Faces } from "../math/Face";
import { Grid } from "../math/Grid";
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
    private objects: Grid<CellInfo[]>;
    private particles: Grid<CellInfo[]>;
    private lights: Grid<LightInfo>;
    private ui: Grid<CellInfo[]>;
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

    public beginDraw(background: Color | undefined, size: Vector2) {
        this.background = background;
        this.size = size;
        this.objects = new Grid<CellInfo[]>(size).fill(() => []);
        this.particles = new Grid<CellInfo[]>(size).fill(() => []);
        this.ui = new Grid<CellInfo[]>(size).fill(() => []);
    }

    private createBuffer(): HTMLCanvasElement {
        const buffer = document.createElement("canvas");
        buffer.width = this.canvas.width;
        buffer.height = this.canvas.height;
        return buffer;
    }

    public add(layerName: Layer, position: Vector2, cellInfo: CellInfo[]): void {
        if (layerName === "objects") {
            this.objects.at(position).push(...cellInfo);
        } else if (layerName === "particles") {
            this.particles.at(position).push(...cellInfo);
        } else if (layerName === "ui") {
            this.ui.at(position).push(...cellInfo);
        }
    }

    public setLights(lights: Grid<LightInfo>) {
        this.lights = lights;
    }

    public endDraw() {
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

        this.objects.traverse((objectCells, pos) => {
            for (const c of objectCells) {
                this.drawCellInfoOn(this._objectsContext!, pos, c);
            }
        });

        this.particles.traverse((particleCells, pos) => {
            for (const c of particleCells) {
                this.drawCellInfoOn(this._particlesContext!, pos, c);
            }
        });

        this.lights.traverse((v, pos) => {
            const pixelPos = canvasPosition.clone().add(pos.clone().multiply(cellStyle.size));

            // Draw light colors.
            this._lightColorContext!.fillStyle = v?.color.getStyle();
            this._lightColorContext!.fillRect(pixelPos.x, pixelPos.y, cellStyle.size.width, cellStyle.size.height);

            // Draw shadows mask.
            const intensity = (v?.intensity || 0) / 15;
            this._shadowMaskContext!.fillStyle = new Color(intensity, intensity, intensity).getStyle();
            this._shadowMaskContext!.fillRect(pixelPos.x, pixelPos.y, cellStyle.size.width, cellStyle.size.height);
        });

        this.ui.traverse((uiCells, pos) => {
            for (const c of uiCells) {
                this.drawCellInfoOn(this._uiContext!, pos, c);
            }
        });
        
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
    }

    private drawCellInfoOn(ctx: CanvasRenderingContext2D, cellPos: Vector2, cellInfo: CellInfo) {
        const cellDrawPosition = canvasPosition.clone()
            .add(cellPos.clone().multiply(cellStyle.size))
            .add(cellStyle.size.clone().multiply(cellInfo.cell.options.miniCellPosition));
        const cellDrawSize = cellStyle.size.clone().multiplyScalar(cellInfo.cell.options.scale);
        const fontSize = Math.max(3, (cellStyle.charSize * cellInfo.cell.options.scale) | 0);
        //
        ctx.globalAlpha = cellInfo.extraOpacity;
        ctx.fillStyle = cellInfo.cell.backgroundColor;
        ctx.fillRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
        ctx.font = (cellInfo.cell.options.bold ? "bold " : "") + `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = cellInfo.cell.textColor;
        ctx.fillText(cellInfo.cell.character, cellDrawPosition.x + cellDrawSize.width / 2, cellDrawPosition.y + cellDrawSize.height / 2 + 2);
        if (cellStyle.borderWidth > 0) {
            ctx.strokeStyle = cellStyle.borderColor;
            ctx.lineWidth = cellStyle.borderWidth;
            ctx.strokeRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
        }

        drawCellBorders();
        
        function drawCellBorders() {
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
}
