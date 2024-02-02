import { clamp } from "../../utils/math";
import { Camera } from "../Camera";
import { FollowCamera } from "../FollowCamera";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { CellInfo } from "../graphics/CellInfo";
import { Box2 } from "../math/Box2";
import { Face, Faces } from "../math/Face";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";

function renderSort(a: Object2D, b: Object2D) {
    if (a.renderOrder !== b.renderOrder) {
		return a.renderOrder - b.renderOrder;
	} else /*if (a.position.y !== b.position.y)*/ {
		return a.position.y - b.position.y;
	}
}

export class CanvasRenderer {
    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasContext,
    ) {

    }

    public render(scene: Scene, camera: Camera) {
        const renderList = this.getSceneRenderList(scene);
        renderList.sort(renderSort);
        this.renderObjects(renderList, scene, camera);
    }

    private getSceneRenderList(scene: Scene): Object2D[] {
        const allObjects: Object2D[] = [];
        scene.traverseVisible(x => allObjects.push(x));
        return allObjects;
    }

    private renderObjects(objects: Object2D[], scene: Scene, camera: Camera) {
        for (const object of objects) {
            this.renderObject(object, scene, camera);

            // TODO: move to updates.
            // reset object highlight.
            object.highlighted = false;
        }
    }

    private renderObject(object: Object2D, scene: Scene, camera: Camera) {
        const importantObjects = scene.children.filter(x => x.important);
        const objects = importantObjects.filter(x => x !== object.parent);
        const isInFrontOfAnyObject = this.isInFrontOfAnyObject(object, objects);
        const { width, height } = object.skin.size;
        const cameraBox = new Box2(new Vector2(), camera.size.clone().sub(new Vector2(1, 1)));
        const skinPos = new Vector2();
        for (skinPos.y = 0; skinPos.y < height; skinPos.y++) { 
            for (skinPos.x = 0; skinPos.x < width; skinPos.x++) {
                const levelPos = object.position.clone().sub(object.originPoint).add(skinPos);
                const resultPos = levelPos.clone().sub(camera.position);
                if (!cameraBox.containsPoint(resultPos)) {
                    continue;
                }

                const cells = object.skin.getCellsAt(skinPos).filter(x => !x.isEmpty);
                const extraOpacity = getExtraPositionalOpacity(skinPos);
                const extraBorder = this.getExtraCellBorders(object, skinPos);
                const cellInfos = cells.map(cell => <CellInfo>{ cell, extraOpacity, extraBorder });
                this.ctx.add(object.layer, resultPos, cellInfos);
            }
        }

        function getExtraPositionalOpacity(skinPos: Vector2) {
            if (object.layer === "objects") {
                const objectOpacity = isObjectPositionTransparent(skinPos) ? 0.2 : 1;
                return objectOpacity;
            } else if (object.layer === "particles") {
                return getParticleOpacity();
            }

            return 1;
        }

        function isObjectPositionTransparent(skinPos: Vector2): boolean {
            return (
                isInFrontOfAnyObject &&
                !object.physics.collisions.find(x => x.equals(skinPos))
            );
        }

        function getParticleOpacity() {
            if (!(camera instanceof FollowCamera)) {
                return 1;
            }

            if (!camera.npc) {
                return 1;
            }

            const distance = camera.npc.position.distanceTo(object.position);
            const fullVisibilityRange = 1.2;
            if (distance < fullVisibilityRange) {
                return 0.2;
            }

            const distanceKoef = 0.2;
            const transparency = clamp(Math.sqrt(distance * distanceKoef), 0, 1);
            return transparency;
        }
    }

    private getExtraCellBorders(obj: Object2D, position: Vector2) {
        if (!obj.highlighted) {
            return [];
        }

        const entries = Faces
            .map(x => {
                const dir = Vector2.fromFace(x);
                const pos = position.clone().add(dir);
                const borderColor = obj.skin.isEmptyCellAt(pos) ? obj.highlighColor : undefined;
                return [x, borderColor];
            })
            .filter(x => x[1]);
        return Object.fromEntries(entries);
    }

    private isPositionBehindTheObject(object: Object2D, position: Vector2): boolean {
        const resultPos = position.clone().sub(object.position).add(object.originPoint);
        return !object.skin.isEmptyCellAt(resultPos);
    }

    private isInFrontOfAnyObject(object: Object2D, objects: Object2D[]) {
        for (const o of objects.filter(o => o.renderOrder <= object.renderOrder)) {
            if (this.isPositionBehindTheObject(object, o.position)) {
                return true;
            }
        }

        return false;
    }
}