import { StaticGameObject } from "../../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Scene } from "../../../engine/Scene";
import { Face, FaceHelper } from "../../../engine/data/Face";
import { Sprite } from "../../../engine/data/Sprite";
import { Vector2 } from "../../../engine/data/Vector2";
 
export class Invertor extends StaticGameObject {
    private _face: Face = "right";
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            inputSides: {
                left: true,
            },
            sides: {
                right: true,
            },
            invertorOf: true,
        });
        const sprite = Sprite.parseSimple('▶️◀️🔼🔽')
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this.type = "invertor";
        this.setAction(ctx => (ctx.obj as Invertor).rotate());

        this.faceTo("right");
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        // TODO: change when rotated.
        const controlSignal = scene.getSignalsAt(this.position.add(new Vector2(0, +1)));
        const control = typeof controlSignal === "undefined" || controlSignal <= 0;
        const invert = control ? true : false;
        const signalCell = this.physics.signalCells[0];
        signalCell.invertorOf = invert;
        //signalCell.sides[this._face] = invert; 
    }

    public rotate() {
        this.faceTo(FaceHelper.getNextClockwise(this._face));
    }

    private faceTo(face: Face) {
        this._face = face;
        const signalCell = this.physics.signalCells[0];
        signalCell.sides = {};
        signalCell.sides[face] = true;
        signalCell.inputSides![FaceHelper.getOpposite(face)] = true;
        if (this._face === "right") {
            this.skin = this._sprite.frames["0"][0];
        } else if (this._face === "left") {
            this.skin = this._sprite.frames["1"][0];
        } else if (this._face === "top") {
            this.skin = this._sprite.frames["2"][0];
        } else if (this._face === "bottom") {
            this.skin = this._sprite.frames["3"][0];
        }
    }
}


