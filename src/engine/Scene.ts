import { GameEvent, GameEventHandler } from "./GameEvent";
import { SceneObject } from "./SceneObject";
import { viewHeight, viewWidth } from "../main";
import { Cell } from "./Cell";
import { emitEvent } from "./EventLoop";
import { drawCell, isCollision, drawObjects } from "./GraphicsEngine";
import { Npc } from "./Npc";
import { Item } from "./Item";

const defaultLightLevelAtNight = 4;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.

export class Scene implements GameEventHandler {
    objects: SceneObject[] = [];
    weatherType = 'normal';
    weatherTicks: number = 0;
    isWindy = true;
    timePeriod = 'day';
    lightLayer: number[][] = [];
    temperatureTicks: number =  0;
    temperatureLayer: number[][] = [];
    weatherLayer: Cell[][] = [];
    dayLightLevel: number = 15;
    globalLightLevel: number = 0;
    globalTemperature: number = 7;
    debugDrawTemperatures: boolean = false;

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(new GameEvent(this, "switch_mode", {from: "scene", to: "dialog"}));
        }
    }
    
    update(ticks: number) {
        this.weatherTicks += ticks;
        this.temperatureTicks += ticks;
        // update all enabled objects
        for (const obj of this.objects) {
            if (!obj.enabled) continue;
            obj.update(ticks, this);
        }
        
        const scene = this;
        updateWeather();
        updateLights();
        updateTemperature();
        
        function updateWeather() {
            if (scene.weatherType === 'rain') {
                scene.dayLightLevel = 12;
            } else {
                scene.dayLightLevel = 15;
            }
            if (scene.weatherTicks > 300) {
                scene.weatherTicks = 0;
                scene.weatherLayer = [];
                for (let y = 0; y < viewHeight; y++) {
                    for (let x = 0; x < viewWidth; x++) {
                        createCell(x, y);
                    }
                }
                function addCell(cell: Cell, x: number, y: number) {
                    if (!scene.weatherLayer[y])
                        scene.weatherLayer[y] = [];
                    scene.weatherLayer[y][x] = cell;
                }
                function createCell(x: number, y: number) {
                    if (scene.weatherType === 'rain') {
                        const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                        addCell(new Cell(sym, 'cyan', '#0000'), x, y);
                    }
                    else if (scene.weatherType === 'snow') {
                        const r = (Math.random() * 6 | 0);
                        if (r === 0)
                            addCell(new Cell('❄', 'white', 'transparent'), x, y);
                        else if (r === 1)
                            addCell(new Cell('❅', 'white', 'transparent'), x, y);
                        else if (r === 2)
                            addCell(new Cell('❆', 'white', 'transparent'), x, y);
                    }
                    else if (scene.weatherType === 'rain_and_snow') {
                        const r = Math.random() * 3 | 0;
                        if (r === 1)
                            addCell(new Cell('❄', 'white', 'transparent'), x, y);
                        else if (r === 2)
                            addCell(new Cell('`', 'cyan', 'transparent'), x, y);
                    }
                    else if (scene.weatherType === 'mist') {
                        if ((Math.random() * 2 | 0) === 1)
                            addCell(new Cell('*', 'transparent', '#fff2'), x, y);
                    }
                }
            }
        }

        function updateLights() {
            // clear
            if (scene.timePeriod === 'night') {
                scene.globalLightLevel = defaultLightLevelAtNight;
            } else {
                scene.globalLightLevel = scene.dayLightLevel;
            }
            scene.lightLayer = [];
            fillLayer(scene.lightLayer, scene.globalLightLevel);
            const lightObjects = [
                ...scene.objects, 
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInMainHand)
                    .map((x: Npc) => <Item>x.objectInMainHand),
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInSecondaryHand)
                    .map((x: Npc) => <Item>x.objectInSecondaryHand)
            ];
            for (let obj of lightObjects) {
                for (let line of obj.physics.lights.entries()) {
                    for (let left = 0; left < line[1].length; left++) {
                        const char = line[1][left];
                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + line[0];
                        // console.log('add light', scene.lightLayer);
                        addEmitter(scene.lightLayer, aleft, atop, lightLevel);
                        spreadPoint(scene.lightLayer, aleft, atop, defaultLightLevelAtNight);
                    }
                }
            }
        }

        function updateTemperature() {
            if (scene.timePeriod === 'night') {
                scene.globalTemperature = defaultTemperatureAtNight;
            } else {
                scene.globalTemperature = defaultTemperatureAtDay;
            }

            if (scene.temperatureLayer.length === 0)
            {
                scene.temperatureLayer = [];
                fillLayer(scene.temperatureLayer, scene.globalTemperature);
            }

            if (scene.temperatureTicks > 1000)
            {
                scene.temperatureTicks = 0;
                // Cool down step.
                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        // cool down slower than warm up.
                        scene.temperatureLayer[y][x] -= 1;
                    }
                }

                // iterate temp points (sources) in objects
                const temperatureObjects = [
                    ...scene.objects, 
                    ...scene.objects
                        .filter(x => (x instanceof Npc) && x.objectInMainHand)
                        .map((x: Npc) => <Item>x.objectInMainHand),
                    ...scene.objects
                        .filter(x => (x instanceof Npc) && x.objectInSecondaryHand)
                        .map((x: Npc) => <Item>x.objectInSecondaryHand)
                ];
                for (let obj of temperatureObjects) {
                    for (let line of obj.physics.temperatures.entries()) {
                        for (let left = 0; left < line[1].length; left++) {
                            const char = line[1][left];
                            const temperature = Number.parseInt(char, 16);
                            const aleft = obj.position[0] - obj.originPoint[0] + left;
                            const atop = obj.position[1] - obj.originPoint[1] + line[0];
                            addEmitter(scene.temperatureLayer, aleft, atop, temperature);
                        }
                    }
                }

                var newTemperatureLayer: number[][] = [];
                fillLayer(newTemperatureLayer, scene.globalTemperature);
                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        meanPoint(scene.temperatureLayer, newTemperatureLayer, x, y);
                    }
                }
                scene.temperatureLayer = newTemperatureLayer;

                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        if (scene.temperatureLayer[y][x] < scene.globalTemperature) {
                            scene.temperatureLayer[y][x] = scene.globalTemperature;
                        }
                    }
                }
            }
        }

        function fillLayer(layer: number[][], defaultValue: number) {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (!layer[y])
                        layer[y] = [];
                    if (!layer[y][x])
                        layer[y][x] = defaultValue;
                }
            }
        }

        function addEmitter(layer: number[][], left: number, top: number, level: number) {
            if (layer[top] && typeof layer[top][left] != "undefined") {
                layer[top][left] = level;
            }
        }

        function meanPoint(array: number[][], newArray: number[][], x: number, y: number, speed: number = 2)
        {
            if (!array) return;
            if (y >= array.length || x >= array[y].length) return;
            let maxValue = array[y][x];
            for (let i = Math.max(0, y - 1); i <= Math.min(array.length - 1, y + 1); i++)
                for (let j = Math.max(0, x - 1); j <= Math.min(array[i].length - 1, x + 1); j++)
                    if ((i === y || j === x) && !(i === y && j === x) 
                        && array[i][j] > maxValue) 
                        maxValue = array[i][j];
            newArray[y][x] = maxValue - speed; 
        }

        function spreadPoint(array: number[][], x: number, y: number, min: number, speed: number = 2) 
        {
            if (!array) return;
            if (y >= array.length || x >= array[y].length) return;
            if (array[y][x] - speed <= min) return;
            for (let i = x - 1; i < x + 2; i++)
                for (let j = y - 1; j < y + 2; j++)
                    if ((i === x || j === y) && !(i === x && j === y) 
                        && (j >= 0 && j < array.length && i >= 0 && i < array[j].length)
                        && (array[j][i] + 1 < array[y][x]))
                    {
                        array[j][i] = array[y][x] - speed;
                        spreadPoint(array, i, j, min, speed);
                    }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // sort objects by origin point
        this.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        // bedrock
        for (let y = 0; y < viewHeight; y++) {
            for (let x = 0; x < viewWidth; x++) {
                drawCell(ctx, new Cell(' ', 'transparent', '#331'), x, y);
            }
        }

        drawObjects(ctx, this.objects);

        const scene = this;
        drawWeather();
        drawLights();
        if (scene.debugDrawTemperatures)
        {
            drawTemperatures();
        }

        function drawWeather() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                        drawCell(ctx, scene.weatherLayer[y][x], x, y);
                }
            }
        }

        function drawLights() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    const lightLevel = scene.lightLayer[y][x] | 0;
                    drawCell(ctx, new Cell(' ', undefined, `#000${(15 - lightLevel).toString(16)}`), x, y);
                }
            }
        }

        function drawTemperatures() {
            for (let y = 0; y < viewHeight; y++) {
                for (let x = 0; x < viewWidth; x++) {
                    const temperature = scene.temperatureLayer[y][x] | 0;
                    drawCell(ctx, new Cell(temperature.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(temperature)), x, y);
                }
            }

            function numberToHexColor(number: number): string {
                const red = Math.floor((number / 15) * 255);
                const blue = 255 - red;
                const alpha = 0.2;
              
                return `rgba(${red}, 0, ${blue}, ${alpha})`;
              }
        }
    }

    isPositionBlocked(position: [number, number]) {
        for (let object of this.objects) {
            if (!object.enabled) continue;
            const pleft = position[0] - object.position[0] + object.originPoint[0];
            const ptop = position[1] - object.position[1] + object.originPoint[1];
            if (isCollision(object, pleft, ptop)) { 
                return true;
            }
        }
        return false;
    }
}

