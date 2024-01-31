import { Vector2 } from "../math/Vector2";
import { Cell } from "../graphics/Cell";
import { ObjectSkin } from "./ObjectSkin";

export class CompositeObjectSkin extends ObjectSkin {
    public get size(): Vector2 {
        return this.skins
            .map(x => x.size)
            .reduce((a, x) => a.max(x), new Vector2());
    }

    constructor(private skins: ObjectSkin[]) {
        super();
        if (skins.filter(x => !x).length > 0) {
            throw new Error('Undefined skin not allowed.');
        }
    }

    public color(options: string, position: Vector2) {
        for (const skin of this.skins) {
            skin.color(options, position);
        }

        return this;
    }

    public background(options: string, position: Vector2) {
        for (const skin of this.skins) {
            skin.background(options, position);
        }

        return this;
    }

    public getCellsAt(position: Vector2): Cell[] {
        return this.skins.flatMap(x => x.getCellsAt(position));
    }

    public isEmptyCellAt(position: Vector2): boolean {
        return this.skins.map(x => x.isEmptyCellAt(position)).reduce((a, x) => a &&= x, true);
    }
}
