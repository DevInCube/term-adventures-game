import { Vector2 } from "../../math/Vector2";
import { Cell, CellDrawOptions } from "../../graphics/Cell";
import { Object2D } from "../Object2D";
import { ObjectSkin } from "../../components/ObjectSkin";
import { SignalColors, SignalType, SignalTypes } from "../../components/SignalCell";
import { CompositeObjectSkin } from "../../components/CompositeObjectSkin";
import { Grid } from "../../math/Grid";

export class SignalsLayerObject extends Object2D {

    constructor() {
        super();
        this.layer = "ui";
        this.type = "signals_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.skin = this.createSignalsSkin();
    }

    private createSignalsSkin(): ObjectSkin {
        const scene = this.scene!;
        const layers = Object.fromEntries(SignalTypes.map(x => [x, new Grid<Cell | undefined>(scene.size).fillValue(undefined)]));
        scene.signalProcessor.signalLayer.traverse((signals, position) => {
            if (!signals) {
                return;
            }

            for (const [signalType, value] of Object.entries(signals)) {
                const cell = createCell(signalType as SignalType, value as number);
                layers[signalType].setAt(position, cell);
            }
        });
        const filledLayers = Object.values(layers).map(x => x.map(x => x || new Cell(' ', undefined, 'transparent')));
        return new CompositeObjectSkin(filledLayers.map(x => new ObjectSkin(x)));

        function createCell(signalType: SignalType, v: number) {
            const index = SignalTypes.indexOf(signalType);
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
            return cell;
        }
    }
}
