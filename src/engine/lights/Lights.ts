import { mixColors } from "../../utils/color";
import { Level } from "../Level";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { SkyLight } from "./SkyLight";
import { clamp } from "../../utils/math";
import { LightInfo, MaterialInfo } from "../components/ObjectPhysics";
import { Grid } from "../math/Grid";

type LightLayer = {
    intensityLayer: Grid<number>,
    color: Color,
};

export class Lights {
    private static maxIntensity = 15;
    private static maxTransparency = 15;
    private static defaultOpacity = 1;
    private static defaultDecay = 2;

    public opacityLayer: Grid<number>;
    public lightLayer: Grid<LightInfo>;
    
    constructor(private scene: Level) {
        this.opacityLayer = new Grid<number>(scene.size);
        this.lightLayer = new Grid<LightInfo>(scene.size);
    }

    public update() {
        const objects: Object2D[] = [];
        this.scene.traverseVisible(x => objects.push(x));
        this.updateOpacity(objects);
        this.updateLights(objects);
    }

    public getLightInfoAt(position: Vector2): LightInfo | undefined {
        return this.lightLayer.at(position);
    }
    
    private updateOpacity(objects: Object2D[]) {
        const opacityLayer = new Grid<number>(this.scene.size).fillValue(0);

        const materials = objects.flatMap(x => this.getObjectMaterials(x));
        for (const materialInfo of materials) {
            if (materialInfo.opacity === 0) {
                continue;
            }

            if (!opacityLayer.containsPosition(materialInfo.position)) {
                continue;
            }

            opacityLayer.setAt(materialInfo.position, materialInfo.opacity);
        }

        this.opacityLayer = opacityLayer;
    }

    private updateLights(objects: Object2D[]) {
        // Clear layers.
        this.lightLayer = new Grid<LightInfo>(this.scene.size).fill(position => ({ position, color: new Color(1, 1, 1), intensity: 0 }));
        
        const lightLayers: LightLayer[] = [];

        const skyLightLayer = this.createSkyLightLayer(this.scene.skyLight, [this.scene.weather.cloudLayer, this.scene.roofLayer], this.scene.size);
        lightLayers.push(skyLightLayer);

        const lights = objects.flatMap(x => this.getObjectLights(x));
        lightLayers.push(...lights.map(x => this.createLightLayer(x, this.scene.size)));
        
        this.mergeLightLayers(lightLayers, this.lightLayer);
    }
    
    // transparencyLayers - transparency [0..F].
    private createSkyLightLayer(skyLight: SkyLight, transparencyLayers: Grid<number>[], size: Vector2): LightLayer {
        const skyLightLayer = new Grid<number>(this.scene.size).fillValue(0);
        skyLightLayer.traverse((v, position, grid) => {
            const opacity = transparencyLayers
                .map(layer => layer.at(position) || 0)
                .map(transparency => (Lights.maxTransparency - transparency) / Lights.maxTransparency)
                .reduce((a, opacity) => a * opacity, Lights.defaultOpacity);
            const cellLightLevel = Math.round(skyLight.intensity * clamp(opacity, 0, 1)) | 0;
            if (cellLightLevel === 0) {
                return;
            }
            
            this.addEmitter(grid, position, cellLightLevel);
            this.spreadPoint(grid, position, 0);
        });

        return <LightLayer>{ intensityLayer: skyLightLayer, color: skyLight.color, };
    }
    
    private getPositionOpacity(position: Vector2): number {
        const opacity = this.opacityLayer.at(position);
        const result = typeof opacity !== "undefined" ? opacity : 1;
        return result;
    }

    private getObjectLights(obj: Object2D): LightInfo[] {
        const lights = obj.physics.lights;
        return lights.map(x => ({...x, position: obj.getWorldPosition(new Vector2()).sub(obj.originPoint).add(x.position)}));
    }

    private getObjectMaterials(obj: Object2D): MaterialInfo[] {
        const materials = obj.physics.materials;
        return materials.map(x => ({...x, position: obj.getWorldPosition(new Vector2()).sub(obj.originPoint).add(x.position)}));
    }

    private createLightLayer(lightInfo: LightInfo, size: Vector2): LightLayer {
        const minLightIntensity = 0;
        const layer = new Grid<number>(size).fillValue(minLightIntensity);
        this.addEmitter(layer, lightInfo.position, lightInfo.intensity);
        this.spreadPoint(layer, lightInfo.position, minLightIntensity);
        return { intensityLayer: layer, color: lightInfo.color };
    }
    
    private mergeLightLayers(lightLayers: LightLayer[], layer: Grid<LightInfo>) {
        if (!lightLayers.length) {
            return;
        }

        layer.traverse((v, pos) => {
            const colors: { color: Color, intensity: number }[] = lightLayers
                .map(layer => ({ color: layer.color, intensity: layer.intensityLayer.at(pos) }))
                .filter(x => x.color && x.intensity);
            const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;

            v.intensity = clamp(intensity, 0, Lights.maxIntensity); 
            v.color.copy(mixColors(colors));
        });
    }

    private addEmitter(layer: Grid<number>, position: Vector2, level: number) {
        const value = layer.at(position);
        if (typeof value !== "undefined" &&
            value < level
        ) {
            layer.setAt(position, level);
        }
    }

    private spreadPoint(array: Grid<number>, position: Vector2, min: number, decay: number = Lights.defaultDecay) {
        const positionOpacity = this.getPositionOpacity(position);
        if (positionOpacity === 1) {
            return;
        }

        const currentIntensity = array.at(position);
        const originalNextIntensity = currentIntensity - decay;
        const positionTransparency = 1 - positionOpacity;
        const nextIntensity = Math.round(originalNextIntensity * positionTransparency) | 0;
        decay = decay + (originalNextIntensity - nextIntensity);
        if (nextIntensity <= min) {
            return;
        }

        const relative = new Vector2();
        for (relative.x = -1; relative.x <= 1; relative.x++) {
            for (relative.y = -1; relative.y <= 1; relative.y++) {
                if (relative.x === relative.y || relative.x + relative.y === 0) {
                    // Diagonals.
                    continue;
                }

                const nextPosition = position.clone().add(relative);
                if (!array.containsPosition(nextPosition)) {
                    continue;
                }

                if (array.at(nextPosition) >= nextIntensity) {
                    continue;
                }
                
                array.setAt(nextPosition, nextIntensity);
                this.spreadPoint(array, nextPosition, min, decay);
            }
        }
    }
}