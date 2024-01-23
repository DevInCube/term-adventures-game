import { Cell } from "../graphics/Cell";
import { ObjectSkin } from "./ObjectSkin";

export class CompositeObjectSkin extends ObjectSkin {
    public get size() {
        return {
            width: Math.max(...this.skins.map(x => x.size.width)),
            height: Math.max(...this.skins.map(x => x.size.height))
        };
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

    public getCellsAt(position: [number, number]): Cell[] {
        return this.skins.flatMap(x => x.getCellsAt(position));
    }

    public isEmptyCellAt(position: [number, number]): boolean {
        return this.skins.map(x => x.isEmptyCellAt(position)).reduce((a, x) => a &&= x, true);
    }
}
