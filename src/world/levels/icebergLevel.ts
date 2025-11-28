import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { tiles } from "../tiles";

const doors = [
    door('iceberg_door_west', { position: [7, 7] }),
];

const objects = [...doors];

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
        ' ': tiles.water,
        'I': tiles.ice,
    });

export const icebergLevel = new Level('iceberg', objects, levelTiles);
icebergLevel.defaultTemperatureAtDay = 2;
icebergLevel.defaultTemperatureAtNight = 0;
