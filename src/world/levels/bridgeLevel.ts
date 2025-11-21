import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { tiles } from "../tiles";
import { fence } from "../objects/fence";
import { lamp } from "../objects/lamp";
import { bush } from "../objects/natural";

const bridgeY = 7;
const doors = [
    door('bridge_door_west', { position: [1, bridgeY + 2] }),
];

const foliage = [
    bush({ position: [2, 2] }),
    bush({ position: [6, 1] }),
    bush({ position: [12, 3] }),
    bush({ position: [17, 2] }),
    bush({ position: [4, 19] }),
];

const width = 33;
const fences = [];
if (true) {  // add fence
    for (let x = 0; x < width; x++) {
        if (x % 9 === 3) {
            fences.push(lamp({ position: [x, bridgeY], isOn: true }));
            fences.push(lamp({ position: [x, bridgeY + 5], isOn: true }));
        } else {
            fences.push(fence({ position: [x, bridgeY] }));
            fences.push(fence({ position: [x, bridgeY + 5] }));
        }
    }
}

const objects = [...doors, ...fences, ...foliage];

const levelTiles = Tiles.parseTiles(
`                                 
                                 
                                 
MMMMMMMMMM       MM              
MMMMMMMMMMMMMMMMMMMMMMMMMM  MMMMM
MM     MMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
bbbbbbbbbbbbbbbbbbbbBbbbbbbbBbbbb
bbBbbbbbbbbbBbbbbbbbbbbbBbbbbbbbb
bbbbbBbbbbbbbbbbbbbbbbbbbbbbbbbBb
bbbbbbbbbBbbbbbbbbbbbbbbbbbBbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
wwwwMMMMMMMMMwwwwwwwwwwwMMMMMMMMM
MMMwwwwwwwwwwwMMMMMMMMMwwwwwwwwww
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
           MMMMMM                
                                 
                                 `, {
        'M': tiles.mountain,
        'w': tiles.water,
        'b': tiles.bridge_stone,
        'B': tiles.bridge_stone_dark,
    });

export const bridgeLevel = new Level('bridge', objects, levelTiles);
