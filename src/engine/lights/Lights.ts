import { mixColors } from "../../utils/color";
import { Level } from "../Level";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import * as utils from "../../utils/layer";
import { SkyLight } from "./SkyLight";
import { clamp } from "../../utils/math";
import { Scene } from "../Scene";
import { LightInfo } from "../components/ObjectPhysics";

type LightLayer = {
    intensityLayer: number[][],
    color: Color,
};

export class Lights {
    private static maxIntensity = 15;
    private static maxTransparency = 15;
    private static defaultOpacity = 1;
    private static defaultDecay = 2;

    private opacityLayer: number[][] = [];
    private lightLayer: LightInfo[][] = [];
    
    constructor(private scene: Level) {
        
    }

    public update() {
        const objects = this.getSceneRenderList(this.scene);
        this.updateOpacity(objects);
        this.updateLights(objects);
    }

    public getLightInfoAt(position: Vector2): LightInfo | undefined {
        const [x, y] = position;
        return this.lightLayer?.[y]?.[x];
    }
    
    // TODO: copied from renderer, use only there.
    private getSceneRenderList(scene: Scene): Object2D[] {
        const allObjects = scene.children.flatMap(x => getRenderItems(x));
        return allObjects;

        function getRenderItems(object: Object2D): Object2D[] {
            if (!object.enabled || !object.visible) {
                return [];
            }

            if (object.children.length === 0) {
                return [object];
            }

            return [object, ...object.children.flatMap(x => getRenderItems(x))]
        }
    }

    private updateOpacity(objects: Object2D[]) {
        const opacityLayer = utils.fillLayer(this.scene.size, 0);
        for (const object of objects) {
            const objectLayer = object.physics.transparency;
            const cellPos = new Vector2(0, 0);
            for (cellPos.y = 0; cellPos.y < objectLayer.length; cellPos.y++) {
                for (cellPos.x = 0; cellPos.x < objectLayer[cellPos.y].length; cellPos.x++) {
                    const char = objectLayer[cellPos.y][cellPos.x] || '0'; 
                    const transparency = Number.parseInt(char, 16);
                    if (transparency === 0) {
                        continue;
                    }

                    const result = object.position.clone().sub(object.originPoint).add(cellPos);
                    if (!this.scene.isPositionValid(result)) {
                        continue;
                    }

                    opacityLayer[result.y][result.x] = (Lights.maxTransparency - transparency) / Lights.maxTransparency;
                }
            }
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
        return this.opacityLayer[y]?.[x] || Lights.defaultOpacity;
    }

    private getObjectLights(obj: Object2D): LightInfo[] {
        const lights = obj.physics.getLights();
        return lights.map(x => ({...x, position: obj.position.clone().sub(obj.originPoint).add(x.position)}));
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
        if (positionOpacity === 0) {
            return;
        }

        const [x, y] = position;
        if (y >= array.length || x >= array[y].length) {
            return;
        }

        const level = array[y][x];
        const originalNextLevel = level - decay;
        const nextLevel = Math.round(originalNextLevel * positionOpacity) | 0;
        decay = decay + (originalNextLevel - nextLevel);
        if (nextLevel <= min) {
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

                if (array[nextPosition.y][nextPosition.x] >= nextLevel) {
                    continue;
                }
                
                array[nextPosition.y][nextPosition.x] = nextLevel;
                this.spreadPoint(array, nextPosition, min, decay);
            }
        }
    }
}