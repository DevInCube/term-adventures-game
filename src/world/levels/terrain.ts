import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Turtle } from "../npcs/turtle";
import { Deer } from "../npcs/deer";
import { Snail } from "../npcs/snail";
import { tiles } from "../tiles";
import { Fish } from "../npcs/Fish";
import { Ghost } from "../npcs/Ghost";
import { Bee } from "../npcs/bee";
import { Dragon } from "../npcs/Dragon";
import { Monkey } from "../npcs/Monkey";

const doors = [
    door('terrain_door', { position: [2, 2] }),
];

const mounts = [
    new Turtle([3, 5]),
    new Turtle([9, 7]),
    new Deer([2, 5]),
    new Deer([3, 18]),
    new Snail([1, 1]),
    new Dragon([2, 6]),
];

const npcs = [
    new Fish([15, 8]),
    new Fish([8, 4]),
    new Bee([3, 15]),
    new Ghost([8, 14]),
    new Monkey([6, 15]),
];

const objects = [...doors, ...mounts, ...npcs];

const levelTiles = Tiles.parseTiles(
`                                 
    MMMMM                        
    MMM    wwwwwwww              
     M    wwwwwwwwwww            
      wwwwwwWWWWWWWwwwwwww       
    wwwwwwWWWWWWWWWWWwwww        
   wwwwwwwwwWWWWWWWwwwwwww       
      wwwwWWWWWWWWWWWwwwwwww     
      wwwwwwWWWWWWWwwwwwww       
    wwwwwwWWWWWWWWWWWwwww        
   wwwwwwwwwWWWWWWWwwwwwww       
      wwwwWWWWWWWWWWWwwwwwww     
         wwwwwwwwwwwww           
         wwwwwwwwww              
             wwww                
             wwww                
                                 
                                 
                                 
                                 `, {
        'M': tiles.mountain,
        'w': tiles.water,
        'W': tiles.water_deep,
    });

export const terrainLevel = new Level('terrain', objects, levelTiles);
