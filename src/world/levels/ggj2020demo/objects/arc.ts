import { ObjectPhysicsBuilder } from "../../../../engine/data/ObjectPhysicsBuilder";
import { ObjectSkinBuilder } from "../../../../engine/data/ObjectSkinBuilder";
import { Colors } from "../../../../engine/math/Colors";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const arc = (options: { position: [number, number]; }) => new Object2D(new Vector2(2, 3),
    new ObjectSkinBuilder(`
▟▄▄▄▙
█   █
█   █
█   █
`, `
LLLLL
H   H
H   H
B   B`, {
        'L': [Colors.Orange, Colors.Brown],
        'H': [Colors.White, Colors.Transparent],
        'B': [Colors.Gray, Colors.Transparent],
    }).build(),
    new ObjectPhysicsBuilder(`
          
     
     
.   .
`).build().collision(),
    Vector2.from(options.position));
