import { ObjectPhysicsBuilder } from "../../../../engine/data/ObjectPhysicsBuilder";
import { ObjectSkinBuilder } from "../../../../engine/data/ObjectSkinBuilder";
import { Colors } from "../../../../engine/math/Colors";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const shop = (options: { position: [number, number]; }) => new Object2D(new Vector2(2, 3),
    new ObjectSkinBuilder(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
        'L': [Colors.LightGray, Colors.Brown],
        'H': [Colors.Gray, Colors.Transparent],
        'B': [Colors.Brown, Colors.Transparent],
        'T': [Colors.Orange, Colors.Brown],
    }).build(),
    new ObjectPhysicsBuilder(`       
       
 ..... `).build(), Vector2.from(options.position));
