import { LightInfo3 } from "../components/ObjectPhysics";
import { Color } from "../math/Color";
import { Colors } from "../math/Colors";
import { Grid3 } from "../math/Grid3";
import { Rotations } from "../math/Rotation";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { defaultCellDrawOptions } from "./Cell";
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
    private size3: Vector3;
    private objects: Grid3<CellInfo[]>;
    private particles: Grid3<CellInfo[]>;
    private lights: Grid3<LightInfo3>;
    private ui: Grid3<CellInfo[]>;
    private buffer: HTMLCanvasElement;
    private objectsBuffer: HTMLCanvasElement;
    private weatherBuffer: HTMLCanvasElement;
    private shadowMaskBuffer: HTMLCanvasElement;
    private lightColorBuffer: HTMLCanvasElement;
    private uiBuffer: HTMLCanvasElement;

    constructor(public canvas: HTMLCanvasElement) {
        this.buffer = document.createElement("canvas");
        this.objectsBuffer = document.createElement("canvas");
        this.weatherBuffer = document.createElement("canvas");
        this.shadowMaskBuffer = document.createElement("canvas");
        this.lightColorBuffer = document.createElement("canvas");
        this.uiBuffer = document.createElement("canvas");
    }

    public beginDraw(background: Color | undefined, gridSize: Vector3) {
        this.background = background;
        this.size = new Vector2(gridSize.x, gridSize.y);
        this.size3 = gridSize;
        this.setCanvasSize(this.size.clone().multiply(cellStyle.size));
        this.objects = new Grid3<CellInfo[]>(gridSize).fill(() => []);
        this.particles = new Grid3<CellInfo[]>(gridSize).fill(() => []);
        this.ui = new Grid3<CellInfo[]>(new Vector3(gridSize.x, gridSize.y, 1)).fill(() => []);
    }

    private setCanvasSize(canvasSize: Vector2) {
        const buffers = [
            this.buffer,
            this.objectsBuffer,
            this.weatherBuffer,
            this.shadowMaskBuffer,
            this.lightColorBuffer,
            this.uiBuffer,
        ];
        for (const buffer of buffers) {
            buffer.width = canvasSize.width;
            buffer.height = canvasSize.height;
        }
    }

    public add(layerName: Layer, position: Vector3, cellInfo: CellInfo[]): void {
        const layer = this.getLayer(layerName);
        layer.at(position)?.push(...cellInfo);
    }

    private getLayer(layerName: Layer): Grid3<CellInfo[]> {
        if (layerName === "objects") {
            return this.objects;
        } else if (layerName === "particles") {
            return this.particles;
        } else if (layerName === "ui") {
            return this.ui;
        }

        throw new Error(`Layer "${layerName}" not found.`);
    }

    public setLights(lights: Grid3<LightInfo3>) {
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

        const cellSize3 = new Vector3(cellStyle.size.width, cellStyle.size.height, 1);
        this.lights.traverse((v, pos) => {
            if (pos.z !== 0) {
                return; // TEST: only ground lights.
            }

            const pixelPos = pos.clone().multiply(cellSize3);

            // Draw light colors.
            this._lightColorContext!.fillStyle = v?.color.getStyle();
            this._lightColorContext!.fillRect(pixelPos.x, pixelPos.y, cellStyle.size.width, cellStyle.size.height);

            // Draw shadows mask.
            const intensity = (v?.intensity || 0) / 15;
            this._shadowMaskContext!.fillStyle = new Color(intensity, intensity, intensity).getStyle();
            this._shadowMaskContext!.fillRect(pixelPos.x, pixelPos.y, cellStyle.size.width, cellStyle.size.height);
        });

        this.ui.traverse((uiCells, pos) => {
            if (pos.z !== 0) {
                throw new Error("UI cells must be on layer 0.");
            }

            for (const c of uiCells) {
                this.drawCellInfoOn(this._uiContext!, pos, c, false);
            }
        });

        const ctx = this._context;
        // TODO: add physical material reflectiveness. Try with black reflective tiles. 

        if (this.background) {
            ctx.fillStyle = this.background.getStyle();
            ctx.fillRect(0, 0, this.size.width * cellStyle.size.width, this.size.height * cellStyle.size.height);
        }

        ctx.globalCompositeOperation = "source-over";  // multiply | overlay | luminosity

        ctx.drawImage(this.objectsBuffer, 0, 0);
        ctx.drawImage(this.weatherBuffer, 0, 0);

        // TODO: remove this.
        if (false) {
            ctx.globalCompositeOperation = "multiply";
            ctx.drawImage(this.shadowMaskBuffer, 0, 0);
            ctx.globalCompositeOperation = "multiply";
            ctx.drawImage(this.lightColorBuffer, 0, 0);
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.uiBuffer, 0, 0);

        this.canvas.getContext("2d")?.drawImage(this.buffer, 0, 0);
    }

    private applyLight(color: Color, light: LightInfo3 | undefined) {
        if (!light) {
            return color.getStyle();
        }

        const lightLevel = light?.intensity || 0;
        const lightColor = light?.color || Colors.White;
        const REFLECTIVENESS = 0.0;

        const newColor = new Color(color.r, color.g, color.b, color.a);
        newColor.setLightness(newColor.getLightness() * lightLevel / 15);

        // Direct colored light
        const dr = newColor.r * lightColor.r;
        const dg = newColor.g * lightColor.g;
        const db = newColor.b * lightColor.b;

        // Reflectiveness modulated by lightColor
        const reflectFactor = (lightLevel / 15) * REFLECTIVENESS;

        const rr = reflectFactor * lightColor.r;
        const rg = reflectFactor * lightColor.g;
        const rb = reflectFactor * lightColor.b;

        newColor.r = Math.min(1, dr + rr);
        newColor.g = Math.min(1, dg + rg);
        newColor.b = Math.min(1, db + rb);

        return newColor.getStyle();
    }

    private drawCellInfoOn(
        ctx: CanvasRenderingContext2D,
        cellPos3: Vector3,
        cellInfo: CellInfo,
        useLight: boolean = true, // TODO: Ugly.
    ) {
        const cellPos = new Vector2(cellPos3.x, cellPos3.y);
        const cellDrawPosition = new Vector2()
            .add(cellPos.clone().multiply(cellStyle.size))
            .add(cellStyle.size.clone().multiply(cellInfo.cell.options.miniCellPosition || defaultCellDrawOptions.miniCellPosition));
        const cellScale = cellInfo.cell.options.scale || defaultCellDrawOptions.scale;
        const cellDrawSize = cellStyle.size.clone().multiplyScalar(cellScale);
        const fontSize = Math.max(3, (cellStyle.charSize * cellScale) | 0);
        const light = useLight ? this.lights.at(cellPos3) : undefined;
        //
        ctx.globalAlpha = cellInfo.extraOpacity;
        ctx.fillStyle = this.applyLight(cellInfo.cell.backgroundColor, light);
        ctx.fillRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
        if (cellInfo.cell.character.char) {
            ctx.font = (cellInfo.cell.options.bold ? "bold " : "") + `${fontSize}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = this.applyLight(cellInfo.cell.textColor, light);
            ctx.fillText(cellInfo.cell.character.char!, cellDrawPosition.x + cellDrawSize.width / 2, cellDrawPosition.y + cellDrawSize.height / 2 + 2);
        }

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
            const [rightBorder, bottomBorder, leftBorder, topBorder]: (Color | undefined)[] =
                Rotations.all.map(x => cellInfo.extraBorder[x] || cellInfo.cell.options.border?.[x]);
            if (topBorder) {
                ctx.strokeStyle = topBorder.getStyle();
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, cellDrawSize.width - 2, 0);
            }

            if (rightBorder) {
                ctx.strokeStyle = rightBorder.getStyle();
                ctx.strokeRect(cellDrawPosition.x + cellDrawSize.width - 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
            }

            if (bottomBorder) {
                ctx.strokeStyle = bottomBorder.getStyle();
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + cellDrawSize.height - 1, cellDrawSize.width - 2, 0);
            }

            if (leftBorder) {
                ctx.strokeStyle = leftBorder.getStyle();
                ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
            }
        }
    }
}
