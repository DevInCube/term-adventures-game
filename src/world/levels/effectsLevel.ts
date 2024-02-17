import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Vector2 } from "../../engine/math/Vector2";
import { tiles } from "../tiles";
import { IceCube } from "../objects/IceCube";

const fences: Object2D[] = [];

const fires = [
    new Campfire(new Vector2(10, 10)),
    new Campfire(new Vector2(5, 20)),
    new IceCube().translateX(4).translateY(6),
];

const doors = [
    door('effects_level', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...fires];

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

        
export const effectsLevel = new class extends Level{ 
    constructor() {
        super('effects', objects, levelTiles);
        this.weather.wind = new Vector2(1, 1);
    }
    
    onLoaded(): void {
        super.onLoaded();
        this.weather.changeWeather("rain");
    }
}();