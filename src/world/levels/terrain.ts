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
import { Vector2 } from "../../engine/data/Vector2";

const doors = [
    door('terrain_door', { position: [2, 2] }),
];

const mounts = [
    new Turtle(Vector2.from([3, 5])),
    new Turtle(Vector2.from([9, 7])),
    new Deer(Vector2.from([2, 5])),
    new Deer(Vector2.from([3, 18])),
    new Snail(Vector2.from([1, 1])),
    new Dragon(Vector2.from([2, 6])),
];

const npcs = [
    new Fish(Vector2.from([15, 8])),
    new Fish(Vector2.from([8, 4])),
    new Bee(Vector2.from([3, 15])),
    new Ghost(Vector2.from([8, 14])),
    new Monkey(Vector2.from([6, 15])),
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
  sssswwwwWWWWWWWWWWWwwwwwww     
 ssssswwwwwwWWWWWWWwwwwwww       
  sswwwwwwWWWWWWWWWWWwwww        
   ssswwwwwwWWWWWWWwwwwwww       
    ssssswWWWWWWWWWWWwwwwwww     
       sssswwwwwwwwwsss          
         sswwwwwwwss             
          ssswwwwss              
           sswwwwsss             
            ssssssssss           
                                 
                                 
                                 `, {
        'M': tiles.mountain,
        'w': tiles.water,
        'W': tiles.water_deep,
        's': tiles.sand,
    });

export const terrainLevel = new Level('terrain', objects, levelTiles);
