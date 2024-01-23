import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Orientation } from "../../../engine/data/Orientation";
import { SidesHelper } from "../../../engine/data/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { StaticGameObject } from "../../../engine/objects/StaticGameObject";

export class Lever extends StaticGameObject {
    private _isOn: boolean = false;
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; orientation?: Orientation; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.all(),
        });
        const sprite = Sprite.parseSimple('⫯⫰');
        sprite.frames["0"][0].setForegroundAt([0, 0], 'yellow');
        sprite.frames["0"][0].setBackgroundAt([0, 0], 'gray');
        sprite.frames["1"][0].setForegroundAt([0, 0], 'black');
        sprite.frames["1"][0].setBackgroundAt([0, 0], 'gray');
        super([0, 0], sprite.frames["1"][0], physics, options.position);

        this._sprite = sprite;
        
        this.type = "lever";
        this.setAction(ctx => (ctx.obj as Lever).toggle());

        this.setOn(false);
    }

    private toggle() {
        this.setOn(!this._isOn);
    }

    private setOn(isOn: boolean) {
        this._isOn = isOn;
        if (this._isOn) {
            this.skin = this._sprite.frames["0"][0];
            this.physics.signalCells[0].sourceOf = 1;
        } else {
            this.skin = this._sprite.frames["1"][0];
            this.physics.signalCells[0].sourceOf = undefined;
        }
    }
}
