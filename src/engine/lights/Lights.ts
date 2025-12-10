import { mixColors } from "../../utils/color";
import { Level } from "../Level";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { SkyLight } from "./SkyLight";
import { clamp } from "../../utils/math";
import { LightInfo, LightInfo3, MaterialInfo3 } from "../components/ObjectPhysics";
import { Grid3 } from "../math/Grid3";
import { Vector3 } from "../math/Vector3";
import { Colors } from "../math/Colors";
import { Grid } from "../math/Grid";

type LightLayer = {
    intensityLayer: Grid3<number>,
    color: Color,
};

export class Lights {
    private static maxIntensity = 15;
    private static maxTransparency = 15;
    private static defaultOpacity = 1;
    private static defaultDecay = 2;

    public opacityLayer: Grid3<number>;
    public lightLayer: Grid3<LightInfo3>;
    
    constructor(private scene: Level) {
        this.opacityLayer = new Grid3<number>(scene.size3);
        this.lightLayer = new Grid3<LightInfo3>(scene.size3)
            .fill(position => ({ position, color: Colors.White, intensity: 0 }));
    }

    public update() {
        const objects: Object2D[] = [];
        this.scene.traverseVisible(x => objects.push(x));
        this.updateOpacity(objects);
        this.updateLights(objects);
    }

    public getLightInfoAt(position: Vector2): LightInfo | undefined {
        const position3 = new Vector3(position.x, position.y, 0);
        const lightInfo3 = this.lightLayer.at(position3);
        return lightInfo3 ? { position, color: lightInfo3.color, intensity: lightInfo3.intensity } : undefined;
    }

    public getLightInfoAt3(position: Vector3): LightInfo3 | undefined {
        return this.lightLayer.at(position);
    }
    
    private updateOpacity(objects: Object2D[]) {
        const opacityLayer = new Grid3<number>(this.scene.size3).fillValue(0);

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
        this.lightLayer = new Grid3<LightInfo3>(this.scene.size3)
            .fill(position => ({ position, color: new Color(1, 1, 1), intensity: 0 }));

        const lightLayers: LightLayer[] = [];

        const layers: Grid3<number>[] = [
            this.scene.weather.cloudLayer,
            this.scene.roofLayer,
        ].map(x => this._expandToGrid3(x));
        const skyLightLayer = this.createSkyLightLayer(this.scene.skyLight, layers, this.scene.size3);
        lightLayers.push(skyLightLayer);

        const lights = objects.flatMap(x => this.getObjectLights(x).map(y => ({ object: x, lightInfo: y })));
        lightLayers.push(...lights.map(x => this.createLightLayer(x.object, x.lightInfo, this.scene.size3)));
        
        this.mergeLightLayers(lightLayers, this.lightLayer);
    }

    // Uses 2d grid as an XY slice for each depth level (Z) of 3d grid.
    private _expandToGrid3(grid: Grid<number>): Grid3<number> {
        return new Grid3<number>(this.scene.size3)
            .fill(position => grid.at(new Vector2(position.x, position.y)) || 0);
    }
    
    // transparencyLayers - transparency [0..F].
    private createSkyLightLayer(skyLight: SkyLight, transparencyLayers: Grid3<number>[], size: Vector3): LightLayer {
        const skyLightLayer = new Grid3<number>(this.scene.size3).fillValue(0);
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
            this.spreadPoint(grid, null, position, position, 0);
        });

        return <LightLayer>{ intensityLayer: skyLightLayer, color: skyLight.color, };
    }
    
    private getPositionOpacity(position: Vector3): number {
        const opacity = this.opacityLayer.at(position);
        const result = typeof opacity !== "undefined" ? opacity : 1;
        return result;
    }

    private _mapObjectPosition2To3(obj: Object2D, position: Vector2): Vector3 {
        const position2 = obj.getWorldPosition(new Vector2()).sub(obj.originPoint).add(position);
        const projectedDepth = -position.y + obj.originPoint.y;
        return new Vector3(position2.x, position2.y + projectedDepth, projectedDepth);
    }

    private getObjectLights(obj: Object2D): LightInfo3[] {
        const lights = obj.physics.lights;
        return lights.map(x => ({...x, position: this._mapObjectPosition2To3(obj, x.position)}));
    }

    private getObjectMaterials(obj: Object2D): MaterialInfo3[] {
        const materials = obj.physics.materials;
        return materials.map(x => ({...x, position: this._mapObjectPosition2To3(obj, x.position)}));
    }

    private createLightLayer(sourceObject: Object2D, lightInfo: LightInfo3, size: Vector3): LightLayer {
        const minLightIntensity = 0;
        const layer = new Grid3<number>(size).fillValue(minLightIntensity);
        this.addEmitter(layer, lightInfo.position, lightInfo.intensity);
        this.spreadPoint(layer, sourceObject, lightInfo.position, lightInfo.position, minLightIntensity);
        return { intensityLayer: layer, color: lightInfo.color };
    }
    
    private mergeLightLayers(lightLayers: LightLayer[], layer: Grid3<LightInfo3>) {
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

    private addEmitter(layer: Grid3<number>, position: Vector3, level: number) {
        const value = layer.at(position);
        if (typeof value !== "undefined" &&
            value < level
        ) {
            layer.setAt(position, level);
        }
    }

    private getPositionOpacity2(sourceObject: Object2D | null, sourcePosition: Vector3, position: Vector3): number {
        if (!sourcePosition.equals(position)) {
            return this.getPositionOpacity(position);
        }

        // Light sources should not be blocked by themselves.
        const blocker = this.scene.blockedCacheObject.getBlockerAt(position);
        return blocker && blocker !== sourceObject ? 1 : 0;
    }

    private spreadPoint(
        array: Grid3<number>,
        sourceObject: Object2D | null,
        sourcePosition: Vector3,
        position: Vector3, 
        min: number, 
        decay: number = Lights.defaultDecay
    ) {
        const positionOpacity = this.getPositionOpacity2(sourceObject, sourcePosition, position);
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

        const relative = new Vector3();
        for (const direction of Vector3.directions) {
            relative.copy(direction);
            const nextPosition = position.clone().add(relative);
            if (!array.containsPosition(nextPosition)) {
                continue;
            }

            if (array.at(nextPosition) >= nextIntensity) {
                continue;
            }
            
            array.setAt(nextPosition, nextIntensity);
            this.spreadPoint(array, sourceObject, sourcePosition, nextPosition, min, decay);
        }
    }
}