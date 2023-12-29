import { GameEvent, GameEventHandler } from "./events/GameEvent";
import { GameObjectAction, ObjectAction, ObjectActionType, SceneObject } from "./objects/SceneObject";
import { Cell } from "./graphics/Cell";
import { emitEvent } from "./events/EventLoop";
import { drawCell, drawObjects, getCellAt } from "./graphics/GraphicsEngine";
import { CanvasContext } from "./graphics/CanvasContext";
import { Npc } from "./objects/Npc";
import { Item } from "./objects/Item";
import { Camera } from "./Camera";
import { Level } from "./Level";
import * as utils from "./../utils/layer";

const defaultLightLevelAtNight = 4;
const defaultLightLevelAtDay = 15;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.
const defaultMoisture = 5;  // @todo depends on biome.

const voidCell = new Cell(' ', 'transparent', 'black');

export class Scene implements GameEventHandler {
    level: Level;
    camera: Camera = new Camera();
    gameTime = 0;
    ticksPerDay: number = 120000;
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

        if (ev.type === "transfer_items") {
            const items = ev.args["items"] as Item[];
            const recipient = ev.args["recipient"] as Npc;
            recipient.inventory.addItems(items);
            // TODO: show message to player.
        }
    }
    
    update(ticks: number) {
        const scene = this;

        this.gameTime += ticks;
        this.level.weatherTicks += ticks;
        this.level.temperatureTicks += ticks;

        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight)); 
        scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));
        //console.log({sunlightPercent});

        // update all enabled objects
        for (const obj of this.level.objects) {
            if (!obj.enabled) continue;

            obj.update(ticks, this);
        }

        this.camera.update();
        
        updateBlocked();
        updateTransparency();
        updateWeather();
        updateLights();
        updateTemperature();
        updateMoisture();

        function updateBlocked() {
            scene.level.blockedLayer = [];
            fillLayer(scene.level.blockedLayer, false);
            for (const object of scene.level.objects) {
                if (!object.enabled) continue;

                for (let y = 0; y < object.physics.collisions.length; y++) {
                    for (let x = 0; x < object.physics.collisions[y].length; x++) {
                        if ((object.physics.collisions[y][x] || ' ') === ' ') continue;

                        const left = object.position[0] - object.originPoint[0] + x;
                        const top = object.position[1] - object.originPoint[1] + y;
                        if (!scene.isPositionValid([left, top])) continue;

                        scene.level.blockedLayer[top][left] = true;
                    }
                }
            }
        }

        function updateTransparency() {
            scene.level.transparencyLayer = [];
            fillLayer(scene.level.transparencyLayer, 0);
            for (const object of scene.level.objects) {
                if (!object.enabled) continue;

                const objectLayer = object.physics.transparency;
                for (let y = 0; y < objectLayer.length; y++) {
                    for (let x = 0; x < objectLayer[y].length; x++) {
                        const char = objectLayer[y][x] || '0'; 
                        const value = Number.parseInt(char, 16);
                        if (value === 0) continue;

                        const left = object.position[0] - object.originPoint[0] + x;
                        const top = object.position[1] - object.originPoint[1] + y;
                        if (!scene.isPositionValid([left, top])) continue;

                        scene.level.transparencyLayer[top][left] = value;
                    }
                }
            }
        }

        function getSkyTransparency(): number {
            switch (scene.level.weatherType) {
                case 'rain':
                case 'snow':
                case 'rain_and_snow':
                    return 0.8;
                case 'mist':
                    return 0.7;
                default: return 1;
            }
        }
        
        function updateWeather() {
            scene.level.cloudLayer = [];
            fillLayer(scene.level.cloudLayer, 15 - Math.round(15 * getSkyTransparency()) | 0);

            if (scene.level.weatherTicks > 300) {
                scene.level.weatherTicks = 0;
                scene.level.weatherLayer = [];

                const weatherType = scene.level.weatherType;
                const roofHoles = scene.level.roofHolesLayer;

                for (let y = 0; y < scene.camera.size.height; y++) {
                    for (let x = 0; x < scene.camera.size.width; x++) {
                        const top = y + scene.camera.position.top;
                        const left = x + scene.camera.position.left;
                        let roofHoleVal = (roofHoles[top] && roofHoles[top][left]);
                        if (typeof roofHoleVal === "undefined") roofHoleVal = true; 
                        if (!roofHoleVal && weatherType !== 'mist') continue;

                        const cell = createCell();
                        if (!cell) continue;
                        
                        addCell(cell, x, y);
                    }
                }
                function addCell(cell: Cell, x: number, y: number) {
                    if (!scene.level.weatherLayer[y])
                        scene.level.weatherLayer[y] = [];
                    scene.level.weatherLayer[y][x] = cell;
                }
                function createCell() : Cell | undefined {
                    const rainColor = 'cyan';
                    const snowColor = '#fff9';
                    const mistColor = '#fff2';
                    if (weatherType === 'rain') {
                        const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                        return new Cell(sym, rainColor, 'transparent');
                    } else if (weatherType === 'snow') {
                        const r = (Math.random() * 8 | 0);
                        if (r === 0)
                            return new Cell('❅', snowColor, 'transparent');
                        else if (r === 1)
                            return new Cell('❆', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 3)
                            return new Cell('•', snowColor, 'transparent');
                    } else if (weatherType === 'rain_and_snow') {
                        const r = Math.random() * 3 | 0;
                        if (r === 1)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('`', rainColor, 'transparent');
                    } else if (weatherType === 'mist') {
                        if ((Math.random() * 2 | 0) === 1)
                            return new Cell('*', 'transparent', mistColor);
                    }

                    return undefined;
                }
            }
        }

        function updateLights() {
            // clear
            scene.level.lightLayer = [];
            fillLayer(scene.level.lightLayer, 0);
            
            scene.level.lightColorLayer = [];
            fillLayer(scene.level.lightColorLayer, null);

            const ambientLayer: number[][] = [];
            fillLayer(ambientLayer, 0);

            const maxValue = 15;
            for (let y = 0; y < scene.level.height; y++) {
                for (let x = 0; x < scene.level.width; x++) {
                    const cloudValue = (scene.level.cloudLayer[y] && scene.level.cloudLayer[y][x]) || 0;
                    const roofValue = (scene.level.roofLayer[y] && scene.level.roofLayer[y][x]) || 0;
                    const cloudOpacity = (maxValue - cloudValue) / maxValue;
                    const roofOpacity = (maxValue - roofValue) / maxValue;
                    const opacity = cloudOpacity * roofOpacity;
                    const cellLightLevel = Math.round(scene.globalLightLevel * opacity) | 0;
                    
                    const position: [number, number] = [x, y];
                    addEmitter(ambientLayer, position, cellLightLevel);
                    spreadPoint(ambientLayer, position, 0);
                }
            }

            const lightObjects = [
                ...scene.level.objects, 
                ...scene.level.objects
                    .filter(x => (x instanceof Npc) && x.equipment.objectInMainHand)
                    .map((x: Npc) => <Item>x.equipment.objectInMainHand),
                ...scene.level.objects
                    .filter(x => (x instanceof Npc) && x.equipment.objectInSecondaryHand)
                    .map((x: Npc) => <Item>x.equipment.objectInSecondaryHand)
            ];

            const lightLayers: { lights: number[][], color: [number, number, number], }[] = []; 
            lightLayers.push({ lights: ambientLayer, color: [255, 255, 255], });
            for (const obj of lightObjects) {
                if (!obj.enabled) continue;

                for (const [top, string] of obj.physics.lights.entries()) {
                    for (let [left, char] of string.split('').entries()) {
                        let color: [number, number, number] = [255, 255, 255];
                        if (obj.physics.lightsMap) {
                            const record = obj.physics.lightsMap[char];
                            char = record.intensity;
                            color = record.color;
                        }

                        const lightLevel = Number.parseInt(char, 16);
                        const aleft = obj.position[0] - obj.originPoint[0] + left;
                        const atop = obj.position[1] - obj.originPoint[1] + top;
                        const position: [number, number] = [aleft, atop];
                        if (!scene.isPositionValid(position)) {
                            continue;
                        }
                        
                        //addEmitter(scene.level.lightLayer, position, lightLevel, color);
                        //spreadPoint(scene.level.lightLayer, position, 0);
                        
                        const layer: number[][] = [];
                        fillLayer(layer, 0);
                        addEmitter(layer, position, lightLevel);
                        spreadPoint(layer, position, 0);
                        lightLayers.push({ lights: layer, color });
                    }
                }

                if (lightLayers.length) {
                    for (let y = 0; y < scene.level.lightLayer.length; y++) {
                        for (let x = 0; x < scene.level.lightLayer[y].length; x++) {
                            const colors: {color:[number, number, number], intensity: number}[] = lightLayers
                                .map(layer => ({ color: layer.color, intensity: layer.lights[y][x] }))
                                .filter(x => x.color && x.intensity);
                            
                            scene.level.lightLayer[y][x] = Math.max(...colors.map(x => x.intensity));
                            scene.level.lightColorLayer[y][x] = mixColors(colors);
                        }
                    }
                }
            }
        }

        function mixColors(colors: { color: [number, number, number], intensity: number }[]): [number, number, number] {
            const mixedColor: [number, number, number] = [
                Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) | 0),
                Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) | 0),
                Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) | 0),
            ];
            return mixedColor;
        }

        function updateTemperature() {
            if (scene.level.temperatureLayer.length === 0) {
                scene.level.temperatureLayer = [];
                fillLayer(scene.level.temperatureLayer, scene.globalTemperature);
            }

            if (scene.level.temperatureTicks > 1000) {
                scene.level.temperatureTicks = 0;
                // Cool down step.
                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        // cool down slower than warm up.
                        scene.level.temperatureLayer[y][x] -= 1;
                    }
                }

                // iterate temp points (sources) in objects
                const temperatureObjects = [
                    ...scene.level.objects, 
                    ...scene.level.objects
                        .filter(x => (x instanceof Npc) && x.equipment.objectInMainHand)
                        .map((x: Npc) => <Item>x.equipment.objectInMainHand),
                    ...scene.level.objects
                        .filter(x => (x instanceof Npc) && x.equipment.objectInSecondaryHand)
                        .map((x: Npc) => <Item>x.equipment.objectInSecondaryHand)
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
                            
                            addEmitter(scene.level.temperatureLayer, position, temperature);
                        }
                    }
                }

                var newTemperatureLayer: number[][] = [];
                fillLayer(newTemperatureLayer, scene.globalTemperature);
                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        meanPoint(scene.level.temperatureLayer, newTemperatureLayer, x, y);
                    }
                }
                scene.level.temperatureLayer = newTemperatureLayer;

                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        if (scene.level.temperatureLayer[y][x] < scene.globalTemperature) {
                            scene.level.temperatureLayer[y][x] = scene.globalTemperature;
                        }
                    }
                }
            }
        }

        function fillLayer<T>(layer: T[][], defaultValue: T) {
            utils.fillLayer(layer, scene.level.width, scene.level.height, defaultValue);
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
            for (let i = Math.max(0, y - 1); i <= Math.min(array.length - 1, y + 1); i++) {
                for (let j = Math.max(0, x - 1); j <= Math.min(array[i].length - 1, x + 1); j++) {
                    if ((i === y || j === x) && !(i === y && j === x) 
                        && array[i][j] > maxValue) {
                        maxValue = array[i][j];
                    }
                }
            }
            
            if (!newArray[y]) {
                newArray[y] = [];
            }
            
            newArray[y][x] = Math.max(array[y][x], maxValue - speed); 
        }

        function spreadPoint(array: number[][], position: [number, number], min: number, speed: number = 2) {
            if (!array) return;

            const positionTransparency = scene.getPositionTransparency(position);
            if (positionTransparency === 0) return;

            const [x, y] = position;
            if (y >= array.length || x >= array[y].length) return;

            const level = array[y][x];
            const originalNextLevel = level - speed;
            const nextLevel = Math.round(originalNextLevel * positionTransparency) | 0;
            speed = speed + (originalNextLevel - nextLevel)
            if (nextLevel <= min) return;

            for (let j = x - 1; j <= x + 1; j++)
                for (let i = y - 1; i <= y + 1; i++)
                    if ((j === x || i === y) && 
                        !(j === x && i === y) && 
                        (i >= 0 && i < array.length && j >= 0 && j < array[i].length) && 
                        (array[i][j] < nextLevel))
                    {
                        array[i][j] = nextLevel;
                        const nextPosition: [number, number] = [j, i];
                        
                        spreadPoint(array, nextPosition, min, speed);
                    }
        }

        function updateMoisture() {
            // @todo check water tiles
            scene.level.moistureLayer = [];
            fillLayer(scene.level.moistureLayer, scene.globalMoisture);
        }
    }

    draw(ctx: CanvasContext) {
        const scene = this;
        drawTiles();

        // sort objects by origin point
        this.level.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        
        drawObjects(ctx, this.camera, this.level.objects);

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
            drawLayer(scene.level.tiles, cameraTransformation, c => c ? getCellAt(c.skin, 0, 0) : voidCell);
        }

        function drawWeather() {
            // Currently is linked with camera, not the level.
            drawLayer(scene.level.weatherLayer, p => p, c => c);
        }

        function drawLights() {
            drawLayer(scene.level.lightLayer, cameraTransformation, createCell);

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
            drawDebugLayer(scene.level.temperatureLayer);
        }

        function drawMoisture() {
            drawDebugLayer(scene.level.moistureLayer);
        }

        function drawBlockedCells() {
            drawLayer(scene.level.blockedLayer, cameraTransformation, createCell);

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
        return aleft >= 0 && atop >= 0 && aleft < this.level.width && atop < this.level.height;
    }

    isPositionBlocked(position: [number, number]) {
        const layer = this.level.blockedLayer;
        const [aleft, atop] = position;
        return (layer[atop] && layer[atop][aleft]) === true;
    }

    getPositionTransparency(position: [number, number]): number {
        const layer = this.level.transparencyLayer;
        const [aleft, atop] = position;
        const transparencyValue = (layer[atop] && layer[atop][aleft]) || 0;
        return (15 - transparencyValue) / 15;
    }

    private getActionsAt(position: [number, number]): ActionData[] {
        const scene = this;
        const actions: ActionData[] = [];
        for (const object of scene.level.objects) {
            if (!object.enabled) continue;
            //
            const [left, top] = position;
            //
            const pleft = left - object.position[0] + object.originPoint[0];
            const ptop = top - object.position[1] + object.originPoint[1];

            for (const action of object.actions) {
                const [aleft, atop] = action.position;
                if (aleft === pleft && 
                    atop === ptop) {
                    actions.push(this.convertToActionData(object, action));
                }
            }
        }

        return actions;
    }

    getNpcAt(position: [number, number]): Npc | undefined {
        for (let object of this.level.objects) {
            if (!object.enabled) continue;
            if (!(object instanceof Npc)) continue;
            //
            if (object.position[0] === position[0] && 
                object.position[1] === position[1]) {
                return object;
            }
        }
        return undefined;
    }

    getNpcInteraction(npc: Npc): ActionData | undefined {
        return this.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
    }

    getNpcCollisionAction(npc: Npc): ActionData | undefined {
        return this.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
    }

    getItemUsageAction(item: Item): ActionData | undefined {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }

        // TODO: this is a default usage action. Should it be resolved by some id?
        const defaultAction = interactions[0];
        return this.convertToActionData(item, defaultAction);
    }

    private convertToActionData(object: SceneObject, objectAction: ObjectAction): ActionData {
        const [ileft, itop] = objectAction.iconPosition;
        const actionIconChar = object.skin.grid[itop][ileft];
        const [fgColor, bgColor] = object.skin.raw_colors[itop] ? (object.skin.raw_colors[itop][ileft] || []) : [];
        const actionIcon = new Cell(actionIconChar, fgColor, bgColor);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon }; 
    }
}

export type ActionData = {
    type: ObjectActionType,
    object: SceneObject,
    action: GameObjectAction,
    actionIcon: Cell,
};