import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { tiles } from "../tiles";
import { fence } from "../objects/fence";
import { lamp } from "../objects/lamp";

const doors = [
    door('bridge_door_west', { position: [1, 10] }),
];

const width = 33;
const fences = [];
if (true) {  // add fence
    for (let x = 0; x < width; x++) {
        if (x % 9 === 3) {
            fences.push(lamp({ position: [x, 8], isOn: true }));
            fences.push(lamp({ position: [x, 12], isOn: true }));
        } else {
            fences.push(fence({ position: [x, 8] }));
            fences.push(fence({ position: [x, 12] }));
        }
    }
}

const objects = [...doors, ...fences];

const levelTiles = Tiles.parseTiles(
`                                 
                                 
                                 
MMMMMMMMMM       MM              
MMMMMMMMMMMMMMMMMMMMMMMMMM  MMMMM
MM     MMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
wwwwMMMMMMMMMwwwwwwwwwwwMMMMMMMMM
MMMwwwwwwwwwwwMMMMMMMMMwwwwwwwwww
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
           MMMMMM                
                                 
                                 `, {
        'M': tiles.mountain,
        'w': tiles.water,
        'b': tiles.bridge_stone,
    });

export const bridgeLevel = new Level('bridge', objects, levelTiles);
