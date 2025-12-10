import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { Item } from "../engine/objects/Item";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { UIText } from "./UIText";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";
import { Colors } from "../engine/math/Colors";
import { CellSprite } from "../engine/data/CellSprite";

export class UIItem extends UIElement {
    isSelected: boolean = false;
    uiObject: UISceneObject;
    uiText: UIText;

    constructor(
        parent: UIElement,
        public item: Item,
        position: Vector2
    ) {
        super(parent);

        this.position = position;
        this.uiObject = new UISceneObject(this, item);
        this.uiText = new UIText(this, item.type, Colors.White, Colors.Transparent);
        this.uiText.position = new Vector2(1, 0);
    }

    update(ticks: number){
        super.update(ticks);

        this.skin = this.createBackground();
    }

    private createBackground(): ObjectSkin {
        const cells: Cell[] = [];
        const actualWidth = 1 + this.uiText.text.length;
        for (let x = 0; x < actualWidth; x++) {
            const cell = new Cell(CellSprite.empty, undefined, Colors.Transparent);
            if (this.isSelected) {
                cell.backgroundColor = Colors.Gray;
                const borders = {
                    3: Colors.White, 
                    0: x === actualWidth - 1 ? Colors.White : Colors.Transparent, 
                    1: Colors.White, 
                    2: x === 0 ? Colors.White : Colors.Transparent
                };
                cell.options.border = borders;
            }

            cells.push(cell);
        }
        
        const skin = new ObjectSkin(Grid.from([cells]));
        return skin;
    }
}
