import { GameEvent, GameEventHandler } from "./events/GameEvent";
import { GameObjectAction, SceneObject } from "./objects/SceneObject";
import { Cell } from "./graphics/Cell";
import { emitEvent } from "./events/EventLoop";
import { drawCell, drawObjects } from "./graphics/GraphicsEngine";
import { CanvasContext } from "./graphics/CanvasContext";
import { Npc } from "./objects/Npc";
import { Item } from "./objects/Item";
import { Camera } from "./Camera";

const defaultLightLevelAtNight = 4;
const defaultLightLevelAtDay = 15;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.
const defaultMoisture = 5;  // @todo depends on biome.

const bedrockCell = new Cell(' ', 'transparent', '#331');

export class Scene implements GameEventHandler {
    objects: SceneObject[] = [];
    camera: Camera = new Camera();
    weatherType = 'normal';
    weatherTicks: number = 0;
    isWindy = true;
    gameTime = 0;
    ticksPerDay: number = 120000;
    tiles: (Cell | null)[][] = [];
    width: number;
    height: number;
    blockedLayer: boolean[][] = [];
    lightLayer: number[][] = [];
    temperatureTicks: number =  0;
    temperatureLayer: number[][] = [];
    moistureLayer: number[][] = [];
    weatherLayer: Cell[][] = [];
    skyTransparency: number = 1;
    globalLightLevel: number = 0;
    globalTemperature: number = 7;
    globalMoisture: number = defaultMoisture;
    debugDrawTemperatures: boolean = false;
    debugDrawMoisture: boolean = false;
    debugDrawBlockedCells: boolean = false;

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(new GameEvent(this, "switch_mode", {from: "scene", to: "dialog"}));
        }
    }
    
    update(ticks: number) {
        this.gameTime += ticks;
        this.weatherTicks += ticks;
        this.temperatureTicks += ticks;

        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        console.log(sunlightPercent);

        // update all enabled objects
        for (const obj of this.objects) {
            if (!obj.enabled) continue;

            obj.update(ticks, this);
        }

        this.camera.update();
        
        const scene = this;
        updateBlocked();
        updateWeather();
        updateLights();
        updateTemperature();
        updateMoisture();

        function updateBlocked() {
            scene.blockedLayer = [];
            fillLayer(scene.blockedLayer, false);
            for (const object of scene.objects) {
                if (!object.enabled) continue;

                for (let y = 0; y < object.physics.collisions.length; y++) {
                    for (let x = 0; x < object.physics.collisions[y].length; x++) {
                        if ((object.physics.collisions[y][x] || ' ') === ' ') continue;

                        const left = object.position[0] - object.originPoint[0] + x;
                        const top = object.position[1] - object.originPoint[1] + y;
                        scene.blockedLayer[top][left] = true;
                    }
                }
            }
        }
        
        function updateWeather() {
            scene.skyTransparency = scene.weatherType === 'normal' ? 1 : 0.8;

            if (scene.weatherTicks > 300) {
                scene.weatherTicks = 0;
                scene.weatherLayer = [];
                for (let y = 0; y < scene.camera.size.height; y++) {
                    for (let x = 0; x < scene.camera.size.width; x++) {
                        const cell = createCell();
                        if (cell) {
                            addCell(cell, x, y);
                        }
                    }
                }
                function addCell(cell: Cell, x: number, y: number) {
                    if (!scene.weatherLayer[y])
                        scene.weatherLayer[y] = [];
                    scene.weatherLayer[y][x] = cell;
                }
                function createCell() : Cell | undefined {
                    const rainColor = 'cyan';
                    const snowColor = '#fff9';
                    const mistColor = '#fff2';
                    if (scene.weatherType === 'rain') {
                        const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                        return new Cell(sym, rainColor, 'transparent');
                    } else if (scene.weatherType === 'snow') {
                        const r = (Math.random() * 8 | 0);
                        if (r === 0)
                            return new Cell('❅', snowColor, 'transparent');
                        else if (r === 1)
                            return new Cell('❆', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 3)
                            return new Cell('•', snowColor, 'transparent');
                    } else if (scene.weatherType === 'rain_and_snow') {
                        const r = Math.random() * 3 | 0;
                        if (r === 1)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('`', rainColor, 'transparent');
                    } else if (scene.weatherType === 'mist') {
                        if ((Math.random() * 2 | 0) === 1)
                            return new Cell('*', 'transparent', mistColor);
                    }

                    return undefined;
                }
            }
        }

        function updateLights() {
            scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight)); 
            const sceneLightLevel = Math.round(scene.globalLightLevel * scene.skyTransparency) | 0;
            // clear
            scene.lightLayer = [];
            fillLayer(scene.lightLayer, sceneLightLevel);
            const lightObjects = [
                ...scene.objects, 
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInMainHand)
                    .map((x: Npc) => <Item>x.objectInMainHand),
                ...scene.objects
                    .filter(x => (x instanceof Npc) && x.objectInSecondaryHand)
                    .map((x: Npc) => <Item>x.objectInSecondaryHand)
            ];
            for (const obj of lightObjects) {
                if (!obj.enabled) continue;

                for (const [top, string] of obj.physics.lights.entries()) {
                    for (const [left, char] of string.split('').entries()) {
                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + top;
                        const position: [number, number] = [aleft, atop];
                        if (!scene.isPositionValid(position)) {
                            continue;
                        }
                        
                        addEmitter(scene.lightLayer, position, lightLevel);
                        spreadPoint(scene.lightLayer, position, defaultLightLevelAtNight);
                    }
                }
            }
        }

        function updateTemperature() {
            scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));

            if (scene.temperatureLayer.length === 0) {
                scene.temperatureLayer = [];
                fillLayer(scene.temperatureLayer, scene.globalTemperature);
            }

            if (scene.temperatureTicks > 1000) {
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
                for (const obj of temperatureObjects) {
                    if (!obj.enabled) continue;

                    for (const [top, string] of obj.physics.temperatures.entries()) {
                        for (const [left, char] of string.split('').entries()) {
                            const temperature = Number.parseInt(char, 16);
                            const aleft = obj.position[0] - obj.originPoint[0] + left;
                            const atop = obj.position[1] - obj.originPoint[1] + top;
                            const position: [number, number] = [aleft, atop];
                            if (!scene.isPositionValid(position)) {
                                continue;
                            }
                            
                            addEmitter(scene.temperatureLayer, position, temperature);
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

        function fillLayer<T>(layer: T[][], defaultValue: T) {
            for (let y = 0; y < scene.height; y++) {
                if (!layer[y])
                    layer[y] = [];

                for (let x = 0; x < scene.width; x++) {
                    if (!layer[y][x])
                        layer[y][x] = defaultValue;
                }
            }
        }

        function addEmitter(layer: number[][], position: [number, number], level: number) {
            const [left, top] = position;
            if (layer[top] && 
                typeof layer[top][left] !== "undefined" &&
                layer[top][left] < level) {
                layer[top][left] = level;
            }
        }

        function meanPoint(array: number[][], newArray: number[][], x: number, y: number, speed: number = 2) {
            if (!array) return;
            if (y >= array.length || x >= array[y].length) return;
            let maxValue = array[y][x];
            for (let i = Math.max(0, y - 1); i <= Math.min(array.length - 1, y + 1); i++)
                for (let j = Math.max(0, x - 1); j <= Math.min(array[i].length - 1, x + 1); j++)
                    if ((i === y || j === x) && !(i === y && j === x) 
                        && array[i][j] > maxValue) 
                        maxValue = array[i][j];
            newArray[y][x] = Math.max(array[y][x], maxValue - speed); 
        }

        function spreadPoint(array: number[][], position: [number, number], min: number, speed: number = 2) {
            if (!array) return;

            const [x, y] = position;
            if (y >= array.length || x >= array[y].length) return;
            if (array[y][x] - speed <= min) return;
            for (let i = x - 1; i < x + 2; i++)
                for (let j = y - 1; j < y + 2; j++)
                    if ((i === x || j === y) && !(i === x && j === y) 
                        && (j >= 0 && j < array.length && i >= 0 && i < array[j].length)
                        && (array[j][i] + 1 < array[y][x]))
                    {
                        array[j][i] = array[y][x] - speed;
                        const nextPosition: [number, number] = [i, j];
                        if (scene.isPositionBlocked(nextPosition)) continue;

                        spreadPoint(array, nextPosition, min, speed);
                    }
        }

        function updateMoisture() {
            // @todo check water tiles
            scene.moistureLayer = [];
            fillLayer(scene.moistureLayer, scene.globalMoisture);
        }
    }

    draw(ctx: CanvasContext) {
        const scene = this;
        drawTiles();

        // sort objects by origin point
        this.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        
        drawObjects(ctx, this.camera, this.objects);

        drawWeather();
        drawLights();
        if (scene.debugDrawTemperatures) {
            drawTemperatures();
        }

        if (scene.debugDrawMoisture) {
            drawMoisture();
        }

        if (scene.debugDrawBlockedCells) {
            drawBlockedCells();
        }

        function drawTiles() {
            drawLayer(scene.tiles, cameraTransformation, c => c || bedrockCell);
        }

        function drawWeather() {
            // Currently is linked with camera, not the level.
            drawLayer(scene.weatherLayer, p => p, c => c);
        }

        function drawLights() {
            drawLayer(scene.lightLayer, cameraTransformation, createCell);

            function createCell(v: number | undefined) {
                const value = v || 0;
                return new Cell(' ', undefined, numberToLightColor(value));
            }

            function numberToLightColor(val: number, max: number = 15): string {
                const intVal = Math.round(val) | 0;
                const alphaValue = Math.min(max, Math.max(0, max - intVal));
                return `#000${alphaValue.toString(16)}`;
            }
        }

        function drawTemperatures() {
            drawDebugLayer(scene.temperatureLayer);
        }

        function drawMoisture() {
            drawDebugLayer(scene.moistureLayer);
        }

        function drawBlockedCells() {
            drawLayer(scene.blockedLayer, cameraTransformation, createCell);

            function createCell(b: boolean | undefined) {
                return b === true ? new Cell('⛌', `#f00c`, `#000c`) : undefined;
            }
        }

        function cameraTransformation(position: [number, number]) : [number, number] {
            const [x, y] = position;
            const top = scene.camera.position.top + y;
            const left = scene.camera.position.left + x;
            return [left, top];
        }

        function drawLayer<T>(
            layer: T[][], 
            transformation: (p: [number, number]) => [number, number], 
            cellFactory: (value: T | undefined) => Cell | undefined) {
        
            for (let y = 0; y < scene.camera.size.height; y++) {
                for (let x = 0; x < scene.camera.size.width; x++) {
                    const [left, top] = transformation([x, y]);
                    const value = (layer[top] && layer[top][left]);
                    const cell = cellFactory(value);
                    if (!cell) continue;

                    drawCell(ctx, scene.camera, cell, x, y);
                }
            }
        }

        function drawDebugLayer(layer: number[][], max: number = 15) {
            drawLayer(layer, cameraTransformation, createCell);

            function createCell(v: number | undefined) {
                const value = v || 0;
                return new Cell(value.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max))
            }

            function numberToHexColor(val: number, max: number = 15): string {
                const intVal = Math.round(val) | 0;
                const red = Math.floor((intVal / max) * 255);
                const blue = 255 - red;
                const alpha = 0.2;
                return `rgba(${red}, 0, ${blue}, ${alpha})`;
            }
        }
    }

    isPositionValid(position: [number, number]) {
        const [aleft, atop] = position;
        return aleft >= 0 && atop >= 0 && aleft < this.width && atop < this.height;
    }

    isPositionBlocked(position: [number, number]) {
        return (this.blockedLayer[position[1]] && this.blockedLayer[position[1]][position[0]]) === true;
    }

    getNpcAction(npc: Npc): {object: SceneObject, action: GameObjectAction, actionIcon: Cell} | undefined {
        const scene = this;
        for (const object of scene.objects) {
            if (!object.enabled) continue;
            //
            const left = npc.position[0] + npc.direction[0];
            const top = npc.position[1] + npc.direction[1];
            //
            const pleft = left - object.position[0] + object.originPoint[0];
            const ptop = top - object.position[1] + object.originPoint[1];
            for (const [[aleft, atop], actionFunc, [ileft, itop]] of object.actions) {
                if (aleft === pleft && 
                    atop === ptop) {
                    const actionIconChar = object.skin.grid[itop][ileft];
                    const [fgColor, bgColor] = object.skin.raw_colors[itop][ileft];
                    const actionIcon = new Cell(actionIconChar, fgColor, bgColor);
                    return { object, action: actionFunc, actionIcon };
                }
            }
        }

        return undefined;
    }
}

