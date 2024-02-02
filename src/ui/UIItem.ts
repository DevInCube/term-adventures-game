import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { Item } from "../engine/objects/Item";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { UIText } from "./UIText";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";

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
        this.uiText = new UIText(this, item.type, 'white', 'transparent');
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
            // TODO: fix cell borders render.
            const borders = [
                'white', 
                x === actualWidth - 1 ? 'white' : '', 
                'white', 
                x === 0 ? 'white' : ''
            ];
            const cell = new Cell(' ', undefined, this.isSelected ? 'gray' : 'transparent');
            cells.push(cell);
        }
        
        return new ObjectSkin(Grid.from([cells]));
    }
}
