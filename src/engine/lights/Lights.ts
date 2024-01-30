import { mixColors } from "../../utils/color";
import { Level } from "../Level";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import * as utils from "../../utils/layer";
import { SkyLight } from "./SkyLight";
import { clamp } from "../../utils/math";
import { LightInfo, MaterialInfo } from "../components/ObjectPhysics";

type LightLayer = {
    intensityLayer: number[][],
    color: Color,
};

export class Lights {
    private static maxIntensity = 15;
    private static maxTransparency = 15;
    private static defaultOpacity = 1;
    private static defaultDecay = 2;

    public opacityLayer: number[][] = [];
    private lightLayer: LightInfo[][] = [];
    
    constructor(private scene: Level) {
        
    }

    public update() {
        const objects: Object2D[] = [];
        this.scene.traverseVisible(x => objects.push(x));
        this.updateOpacity(objects);
        this.updateLights(objects);
    }

    public getLightInfoAt(position: Vector2): LightInfo | undefined {
        const [x, y] = position;
        return this.lightLayer?.[y]?.[x];
    }
    
    private updateOpacity(objects: Object2D[]) {
        const opacityLayer = utils.fillLayer(this.scene.size, 0);

        const materials = objects.flatMap(x => this.getObjectMaterials(x));
        for (const materialInfo of materials) {
            if (materialInfo.opacity === 0) {
                continue;
            }

            if (!this.scene.isPositionValid(materialInfo.position)) {
                continue;
            }

            opacityLayer[materialInfo.position.y][materialInfo.position.x] = materialInfo.opacity;
        }

        this.opacityLayer = opacityLayer;
    }

    private updateLights(objects: Object2D[]) {
        // Clear layers.
        this.lightLayer = utils.fillLayerWith<LightInfo>(this.scene.size, position => ({ position, color: new Color(1, 1, 1), intensity: 0 }));
        
        const lightLayers: LightLayer[] = [];

        const skyLightLayer = this.createSkyLightLayer(this.scene.skyLight, [this.scene.weather.cloudLayer, this.scene.roofLayer], this.scene.size);
        lightLayers.push(skyLightLayer);

        const lights = objects.flatMap(x => this.getObjectLights(x));
        lightLayers.push(...lights.map(x => this.createLightLayer(x, this.scene.size)));
        
        this.mergeLightLayers(lightLayers, this.lightLayer);
    }
    
    // transparencyLayers - transparency [0..F].
    private createSkyLightLayer(skyLight: SkyLight, transparencyLayers: number[][][], size: Vector2): LightLayer {
        const skyLightLayer = utils.fillLayer(this.scene.size, 0);

        const position = new Vector2(0, 0);
        for (position.y = 0; position.y < size.height; position.y++) {
            for (position.x = 0; position.x < size.width; position.x++) {
                const opacity = transparencyLayers
                    .map(layer => layer[position.y]?.[position.x] || 0)
                    .map(transparency => (Lights.maxTransparency - transparency) / Lights.maxTransparency)
                    .reduce((a, opacity) => a * opacity, Lights.defaultOpacity);
                const cellLightLevel = Math.round(skyLight.intensity * clamp(opacity, 0, 1)) | 0;
                if (cellLightLevel === 0) {
                    continue;
                }
                
                this.addEmitter(skyLightLayer, position, cellLightLevel);
                this.spreadPoint(skyLightLayer, position, 0);
            }
        }

        return <LightLayer>{ intensityLayer: skyLightLayer, color: skyLight.color, };
    }
    
    private getPositionOpacity([x, y]: Vector2): number {
        const opacity = this.opacityLayer[y]?.[x];
        const result = typeof opacity !== "undefined" ? opacity : 1;
        return result;
    }

    private getObjectLights(obj: Object2D): LightInfo[] {
        const lights = obj.physics.getLights();
        return lights.map(x => ({...x, position: obj.position.clone().sub(obj.originPoint).add(x.position)}));
    }

    private getObjectMaterials(obj: Object2D): MaterialInfo[] {
        const materials = obj.physics.getMaterials();
        return materials.map(x => ({...x, position: obj.position.clone().sub(obj.originPoint).add(x.position)}));
    }

    private createLightLayer(lightInfo: LightInfo, size: Vector2): LightLayer {
        const minLightIntensity = 0;
        const layer = utils.fillLayer(size, minLightIntensity);
        this.addEmitter(layer, lightInfo.position, lightInfo.intensity);
        this.spreadPoint(layer, lightInfo.position, minLightIntensity);
        return { intensityLayer: layer, color: lightInfo.color };
    }
    
    private mergeLightLayers(lightLayers: LightLayer[], layer: LightInfo[][]) {
        if (!lightLayers.length) {
            return;
        }

        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                const colors: { color: Color, intensity: number }[] = lightLayers
                    .map(layer => ({ color: layer.color, intensity: layer.intensityLayer[y][x] }))
                    .filter(x => x.color && x.intensity);
                const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;

                layer[y][x].intensity = clamp(intensity, 0, Lights.maxIntensity); 
                layer[y][x].color.copy(mixColors(colors));
            }
        }
    }

    private addEmitter(layer: number[][], [x, y]: Vector2, level: number) {
        if (typeof layer[y]?.[x] !== "undefined" &&
            layer[y][x] < level
        ) {
            layer[y][x] = level;
        }
    }

    private spreadPoint(array: number[][], position: Vector2, min: number, decay: number = Lights.defaultDecay) {
        if (!array) {
            return;
        }

        const positionOpacity = this.getPositionOpacity(position);
        if (positionOpacity === 1) {
            return;
        }

        const [x, y] = position;
        if (y >= array.length || x >= array[y].length) {
            return;
        }

        const currentIntensity = array[y][x];
        const originalNextIntensity = currentIntensity - decay;
        const positionTransparency = 1 - positionOpacity;
        const nextIntensity = Math.round(originalNextIntensity * positionTransparency) | 0;
        decay = decay + (originalNextIntensity - nextIntensity);
        if (nextIntensity <= min) {
            return;
        }

        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if (j === i || j + i === 0) {
                    // Diagonals.
                    continue;
                }

                const nextPosition = new Vector2(x + j, y + i);
                if (nextPosition.y < 0 ||
                    nextPosition.y >= array.length ||
                    nextPosition.x < 0 ||
                    nextPosition.x >= array[0].length) {
                    // Out of bounds.
                    continue;
                }

                if (array[nextPosition.y][nextPosition.x] >= nextIntensity) {
                    continue;
                }
                
                array[nextPosition.y][nextPosition.x] = nextIntensity;
                this.spreadPoint(array, nextPosition, min, decay);
            }
        }
    }
}