import { clamp } from "../../utils/math";
import { Camera } from "../cameras/Camera";
import { FollowCamera } from "../cameras/FollowCamera";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { CellInfo } from "../graphics/CellInfo";
import { Box2 } from "../math/Box2";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { Rotations } from "../math/Rotation";

const _p1 = new Vector2();
const _p2 = new Vector2();

function renderSort(a: Object2D, b: Object2D) {
    if (a.renderOrder !== b.renderOrder) {
		return a.renderOrder - b.renderOrder;
	} else /*if (a.position.y !== b.position.y)*/ {
		return a.getWorldPosition(_p1).y - b.getWorldPosition(_p2).y;
	}
}

export class CanvasRenderer {
    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasContext,
    ) {

    }

    public render(scene: Scene, camera: Camera) {
        scene.updateMatrixWorld();
        if (!camera.parent) {
            camera.updateMatrixWorld();
        }

        const renderList = this.getSceneRenderList(scene);
        renderList.sort(renderSort);

        const unobstructedObjects: Object2D[] = [];
        scene.traverseVisible(x => {
            if ("isUnobstructed" in x) {
                unobstructedObjects.push(x);
            }
        });
        this.renderObjects(renderList, scene, camera, unobstructedObjects);
    }

    private getSceneRenderList(scene: Scene): Object2D[] {
        const allObjects: Object2D[] = [];
        scene.traverseVisible(x => allObjects.push(x));
        return allObjects;
    }

    private renderObjects(objects: Object2D[], scene: Scene, camera: Camera, unobstructedObjects: Object2D[]) {
        for (const object of objects) {
            this.renderObject(object, scene, camera, unobstructedObjects);

            // TODO: move to updates.
            // reset object highlight.
            object.highlighted = false;
        }
    }

    private renderObject(object: Object2D, scene: Scene, camera: Camera, unobstructedObjects: Object2D[]) {
        object.onBeforeRender(this, scene, camera);

        const objectPosition = object.getWorldPosition(_p1);
        const objectRadius = Math.max(...object.skin.size);
        const objects = unobstructedObjects
            .filter(x => x !== object &&
                         x !== object.parent && 
                         x.renderOrder <= object.renderOrder &&
                         x.getWorldPosition(_p2).distanceTo(objectPosition) <= objectRadius);
        const isInFrontOfAnyObject = this.isInFrontOfAnyObject(object, objects);
        const { width, height } = object.skin.size;
        const cameraBox = new Box2(new Vector2(), camera.size.clone().sub(new Vector2(1, 1)));
        const skinPos = new Vector2();
        for (skinPos.y = 0; skinPos.y < height; skinPos.y++) { 
            for (skinPos.x = 0; skinPos.x < width; skinPos.x++) {
                const levelPos = object.getWorldPosition(_p1).sub(object.originPoint).add(skinPos);
                const resultPos = levelPos.sub(camera.getWorldPosition(_p2)).clone();
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

            if (!camera.followObject) {
                return 1;
            }

            const distance = camera.followObject.getWorldPosition(_p1).distanceTo(object.getWorldPosition(_p2));
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

        const entries = Rotations.all
            .map(x => {
                const dir = _p1.copy(Vector2.right).rotate(x);
                const pos = _p2.copy(position).add(dir);
                const borderColor = obj.skin.isEmptyCellAt(pos) ? obj.highlighColor : undefined;
                return [x, borderColor];
            })
            .filter(x => x[1]);
        return Object.fromEntries(entries);
    }

    private isPositionBehindTheObject(object: Object2D, position: Vector2): boolean {
        const objectLeftTop = object.getWorldPosition(_p2).sub(object.originPoint);
        const localSkinPos = _p1.copy(position).sub(objectLeftTop);
        return !object.skin.isEmptyCellAt(localSkinPos);
    }

    private isInFrontOfAnyObject(object: Object2D, objects: Object2D[]) {
        for (const o of objects) {
            if (this.isPositionBehindTheObject(object, o.getWorldPosition(_p1))) {
                return true;
            }
        }

        return false;
    }
}