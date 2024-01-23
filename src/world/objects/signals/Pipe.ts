import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Orientation, OrientationHelper } from "../../../engine/data/Orientation";
import { SidesHelper } from "../../../engine/data/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { StaticGameObject } from "../../../engine/objects/StaticGameObject";

export class Pipe extends StaticGameObject {
    private _orientation: Orientation;
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; orientation?: Orientation }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.horizontal(),
        });
        const sprite = Sprite.parseSimple('═‖')
        super([0, 0], sprite.frames["0"][0], physics, options.position);

        this._sprite = sprite;
        this.type = "pipe";
        this.setAction(ctx => (ctx.obj as Pipe).rotate())

        this.setOrientation(options.orientation || "horizontal");
    }

    public rotate() {
        this.setOrientation(OrientationHelper.rotate(this._orientation));
    }
    
    private setOrientation(orientation: Orientation) {
        this._orientation = orientation;
        if (this._orientation === "horizontal") {
            this.skin = this._sprite.frames["0"][0];
        } else {
            this.skin = this._sprite.frames["1"][0];
        }

        const signalCell = this.physics.signalCells[0];
        signalCell.sides = SidesHelper.fromOrientation(this._orientation);
        signalCell.inputSides = SidesHelper.fromOrientation(this._orientation);
    }
}
