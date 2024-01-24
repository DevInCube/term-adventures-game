import { Vector2 } from "../data/Vector2";
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
    }

    public setForegroundAt(position: [number, number], foreground: string): void {
        for (const skin of this.skins) {
            skin.setForegroundAt(position, foreground);
        }
    }

    public setBackgroundAt(position: [number, number], background: string): void {
        for (const skin of this.skins) {
            skin.setBackgroundAt(position, background);
        }
    }

    public getCellsAt(position: Vector2): Cell[] {
        return this.skins.flatMap(x => x.getCellsAt(position));
    }

    public isEmptyCellAt(position: Vector2): boolean {
        return this.skins.map(x => x.isEmptyCellAt(position)).reduce((a, x) => a &&= x, true);
    }
}
