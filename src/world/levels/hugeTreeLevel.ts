import { Level } from "../../engine/Level";
import { portal } from "../objects/portal";
import { Tiles } from "../../engine/data/Tiles";
import { tiles } from "../tiles";
import { TreeLeaves } from "../objects/TreeLeaves";
import { Vector2 } from "../../engine/math/Vector2";
import { hugeTreeTrunk } from "../objects/hugeTreeTrunk";

const origin = Vector2.from([1, 2]);
const positionsMap = `
         x                     
            x     x            
               x               
      x   x  x                 
                x   x          
     x     x                   
  x     x      x      x        
                  x            
      x     x                  
 x  x    x      x  x   x       
                          x    
     x     x        x          
  x     x     x  x     x       
                               
   x        x     x     x      
x     x  x     x     x     x   
                               
    x      x       x           
       x       x      x        
`;
const positions = positionsMap.split('\n')
  .filter(rowString => rowString.length > 0)
  .map(rowString => rowString.split(''))
  .map((row, y) => row.map((cell, x) => cell === 'x' ? Vector2.from([x, y]) : null))
  .flat()
  .filter(row => row !== null);
const leaves = positions
  .filter(position => position !== null)
  .map(position => new TreeLeaves(position!.add(origin)));

const trunkPosition: [number, number] = [origin.x + 19, origin.y + 21];
const trunk = hugeTreeTrunk({ position: trunkPosition });

const portals = [
    portal('huge_tree_portal_west', { position: [trunkPosition[0] - 2, trunkPosition[1] + 2] }),
];

const objects = [...portals, ...leaves, trunk];

const levelTiles = Tiles.parseTiles(
`                                 
             I              I    
   II                     IIII   
                           II    
 I            IIII               
       II    IIIIIII             
    IIIIIIIIIIIIIIIIIIII         
   IIIIIIIIIIIIIIIIII  I         
     IIIIIIIIIIIIIIIIIIII        
      IIIIIIIIIIIIIIIII          
 IIIIIIIIIIIIIIIIIIIIIIIII       
  IIIIIIIIIIIIIIIIIIIIIIIIII     
 IIIIIIIIIIIIIIIIIIIIIIIIIIII    
   IIIIIIIIIIIIIIIIIIIIIIIII     
      IIIIIIIIIIIIIIIIIIIIIIIIII 
     IIIIIIIIIIIIIIIIIIIIIIIIII  
 I    IIIIIIIIIIIIIIIIIIIIIIIII  
     IIIIIIIIIIIIIIIIIIIIIIIII   
    IIIIIIIIIIIIIIIIIIIIIIIIIII  
   IIIIIIIIIIIIIIIIIIIIIIIIIIIII 
  IIIIIIIIIIIIIIIIIIIIIIIIIIIIII 
 II IIIIIIIIIIIIIIIIIIIIIIIIIIII 
 IIIIIIIIIIIIIIIIIIIIIIIIIIIIII  
      IIIIIIIIIIIIIIIIIIIIIIIIII 
         III    IIIIIIIIIIII     
  II          IIIII    III    I  
                        I        
                                 `, {
        ' ': tiles.grass_tall,
        'I': tiles.grass,
    });

const level = new Level('hugeTree', objects, levelTiles);
// TODO: needs 3D levels to work properly.
// level.roofHolesLayer = new Grid<boolean>(level.size).fillValue(true);
// level.roofLayer = new Grid<number>(level.size).fillValue(0);
// if (true) { // add leaves shadow
//     const shadowOffset = new Vector2(0, 5);
//     const skinPositions = leaves[0].skin.getPositions();
//     for (const position of positions) {
//         for (const skinPosition of skinPositions) {
//             const newPosition = position.clone().add(skinPosition).add(shadowOffset).clone();
//             level.roofLayer.setAt(newPosition, 15);
//             level.roofHolesLayer.setAt(newPosition, false);
//         }
//     }
// }
export const hugeTreeLevel = level;
