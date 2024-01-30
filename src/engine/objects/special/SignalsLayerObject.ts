import { Vector2 } from "../../math/Vector2";
import { Cell, CellDrawOptions } from "../../graphics/Cell";
import { Object2D } from "../Object2D";
import * as utils from "../../../utils/layer";
import { ObjectSkin } from "../../components/ObjectSkin";
import { SignalColors, SignalType, SignalTypes } from "../../components/SignalCell";
import { CompositeObjectSkin } from "../../components/CompositeObjectSkin";

export class SignalsLayerObject extends Object2D {
    private blockedLayer: boolean[][];

    constructor() {
        super();
        this.layer = "ui";
        this.type = "signals_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.skin = this.createSignalsSkin();
    }

    public isPositionBlocked(position: Vector2) {
        const layer = this.blockedLayer;
        return layer?.[position.y]?.[position.x] === true;
    }

    private createSignalsSkin(): ObjectSkin {
        const scene = this.scene!;
        const layers = Object.fromEntries(SignalTypes.map(x => [x, utils.fillLayer<Cell | undefined>(scene.size, undefined)]));
        utils.forLayer(scene.signalProcessor.signalLayer, (signals, position) => {
            if (!signals) {
                return;
            }

            for (const [signalType, value] of Object.entries(signals)) {
                const v = value as number;
                const index = SignalTypes.indexOf(signalType as SignalType);
                const signalColor = SignalColors[index];
                const cellOptions: CellDrawOptions = {
                    miniCellPosition: new Vector2(0.5 + ((index % 2) - 1) * 0.33, ((index / 2) | 0) * 0.33),
                    scale: 0.333,
                    bold: true,
                    opacity: 1,
                    border: undefined,
                };

                // Invert text for light bg colors.
                const text = v > 0 ? v.toString(16) : '·';
                const textColor = ((index === 0 || index === 3 || index === 4)) ? 'black' : 'white';
                const backgroundColor = signalColor;
                const cell = new Cell(text, textColor, backgroundColor);
                cell.options = cellOptions;
                layers[signalType][position.y][position.x] = cell;
            }
        });
        const filledLayers = Object.values(layers).map(x => utils.mapLayer(x, x => x || new Cell(' ', undefined, 'transparent')));
        return new CompositeObjectSkin(filledLayers.map(x => new ObjectSkin(x)))
    }
}
