import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Turtle } from "../npcs/turtle";
import { Deer } from "../npcs/deer";
import { Snail } from "../npcs/snail";
import { tiles } from "../tiles";

const doors = [
    door({ position: [2, 2] }),
];

const mounts = [
    new Turtle([3, 5]),
    new Turtle([9, 7]),
    new Deer([2, 5]),
    new Deer([3, 18]),
    new Snail([1, 1]),
];

const objects = [...doors, ...mounts];

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
terrainLevel.portals['terrain_door'] = [[2, 2]];
