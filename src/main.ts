import { sheepLevel } from "./world/levels/sheep";
import { emptyHand, lamp, sword } from "./world/items";
import { GameEvent, GameEventHandler } from "./engine/events/GameEvent";
import { Drawable, GameObjectAction, SceneObject } from "./engine/objects/SceneObject";
import { emitEvent, eventLoop } from "./engine/events/EventLoop";
import { Scene } from "./engine/Scene";
import { Cell } from "./engine/graphics/Cell";
import { cellStyle, drawCell, drawObjectAt } from "./engine/graphics/GraphicsEngine";
import { CanvasContext } from "./engine/graphics/CanvasContext";
import { hero } from "./world/hero";
import { PlayerUi } from "./ui/playerUi";
import { Npc } from "./engine/objects/Npc";
import { introLevel } from "./world/levels/intro";
import { level } from "./world/levels/ggj2020demo/level";
import { Level } from "./engine/Level";
import { levels, rawLevels } from "./world/levels/levels";
import { lightsLevel } from "./world/levels/lights";
import { devHubLevel } from "./world/levels/devHub";
import { dungeonLevel } from "./world/levels/dungeon";
import UIPanel from "./ui/UIPanel";
import UIInventory from "./ui/UIInventory";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = new CanvasContext(canvas.getContext("2d") as CanvasRenderingContext2D);

class Game implements GameEventHandler {

    mode: string = "scene";  // "dialog", "inventory", ...

    handleEvent(ev: GameEvent): void {
        if (ev.type === "switch_mode") {
            this.mode = ev.args.to;
        } else if (ev.type === "add_object") {
            scene.level.objects.push(ev.args.object);
            // @todo send new event
        }
    }

    draw() {
        scene.draw(ctx);
        heroUi.draw(ctx);
        if (this.mode === "dialog") {
            drawDialog();
        } else if (this.mode === "inventory") {
            drawInventory();
        }
        ctx.draw();
    }

    update(ticks: number) {
        heroUi.update(ticks, scene);
        checkPortals();
        scene.update(ticks);
    }
}

function checkPortals() {
    if (!scene.level) {
        return;
    }

    // Hero can not go throuht portals while on mount.
    // TODO: check portal object realm, not "ground".
    if (hero.mount ||
        hero.realm !== "ground") {
        return;
    }

    const portals = Object.entries(scene.level.portals);
    for (const [portalId, portalPositions] of portals) {
        for (let portalPositionIndex = 0; portalPositionIndex < portalPositions.length; portalPositionIndex++) {
            const portalPosition = portalPositions[portalPositionIndex];
            if (portalPosition[0] !== hero.position[0] || 
                portalPosition[1] !== hero.position[1]) {
                continue;
            }

            if (portalPositions.length === 2) {
                // Pair portal is on the same level.
                const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
                teleportTo(scene.level.id, [pairPortalPosition[0], pairPortalPosition[1] + 1]);
            } else {
                // Find other level with this portal id.
                const pairPortals = Object.entries(levels)
                    .filter(([levelId, _]) => levelId !== scene.level?.id)
                    .filter(([___, level]) => level.portals[portalId]?.length === 1)
                    .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0]}));
                if (pairPortals?.length !== 0) {
                    const pairPortal = pairPortals[0];
                    teleportTo(pairPortal.levelId, [pairPortal.position[0], pairPortal.position[1] + 1]);
                } else {
                    // TODO add portal cooldown.
                    console.log(`Pair portal for "${portalId}" was not found.`);
                }
            }

            break;
        }
    }

    function teleportTo(levelId: string, position: [number, number]) {
        if (!scene.level) {
            return;
        }

        if (levelId !== scene.level.id) {
            selectLevel(levels[levelId]);
        }

        hero.position[0] = position[0];
        hero.position[1] = position[1];
        // TODO: raise game event.
    }    
}

const game = new Game();

const scene = new Scene();

selectLevel(devHubLevel);

export const leftPad = (ctx.context.canvas.width - cellStyle.size.width * scene.camera.size.width) / 2;
export const topPad = (ctx.context.canvas.height - cellStyle.size.height * scene.camera.size.height) / 2;

let heroUi = new PlayerUi(hero, scene.camera);

function selectLevel(level: Level) {
    console.log(`Selecting level "${level.id}".`);
    scene.level = level;
    scene.level.objects = scene.level.objects.filter(x => x !== hero).concat([hero]);
    for (const object of scene.level.objects) {
        object.scene = scene;
    }

    hero.position = [9, 7];
    scene.camera.follow(hero, level);
}

enableGameInput();

function enableGameInput() {
    document.addEventListener("keydown", onkeydown);
    document.addEventListener("keypress", onkeypress);
    console.log('Enabled game input');
}

function disableGameInput() {
    document.removeEventListener("keydown", onkeydown);
    document.removeEventListener("keypress", onkeypress);
    console.log('Disabled game input');
}

function onkeydown(ev: KeyboardEvent) {
    // const raw_key = ev.key.toLowerCase();
    const key_code = ev.code;

    if (key_code === "KeyE") {
        if (game.mode !== 'inventory') {
            updateInventory(); // TODO handle somewhere else
            emitEvent(new GameEvent("system", "switch_mode", { from: game.mode, to: "inventory" }));
        } else {
            emitEvent(new GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
        }
        return;
    }
    

    if (game.mode === 'scene') {
        // onSceneInput();
    } else if (game.mode === 'dialog') {
        if (key_code === "Escape") {
            emitEvent(new GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
        }
    } else if (game.mode === 'inventory') {
        if (key_code === "Escape") {
            emitEvent(new GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
        }
    }
}

function onkeypress(code: KeyboardEvent) {
    const raw_key = code.key.toLowerCase();
    const key_code = code.code;
    // console.log(raw_key, key_code);
    if (game.mode === 'scene') {
        onSceneInput();
    } else if (game.mode === 'dialog') {
        //
    } else if (game.mode === 'inventory') {
        uiInventory.onKeyPress(code);
    }
    
    onInterval();

    function onSceneInput() {
        console.log("input move");

        const controlObject = hero.mount || hero;
        if (code.code === 'KeyW') {
            controlObject.direction = [0, -1];
        } else if (code.code === 'KeyS') {
            controlObject.direction = [0, +1];
        } else if (code.code === 'KeyA') {
            controlObject.direction = [-1, 0];
        } else if (code.code === 'KeyD') {
            controlObject.direction = [+1, 0];
        } else if (code.code === 'KeyF') {
            // TODO: check if mount can fly.
            if (controlObject === hero.mount || controlObject.type === "dragon") {
                controlObject.realm = controlObject.realm !== "sky" ? "sky" : "ground";
            }
        } else if (code.code === 'Space') {
            // TODO 'sword' type
            // hero.objectInMainHand === sword
            if (false) {
                const npc = getNpcUnderCursor(hero);
                if (npc) {
                    emitEvent(new GameEvent(hero, 'attack', {
                        object: hero,
                        subject: npc
                    }));
                }
                return;
            }
            const actionData = getActionUnderCursor();
            if (actionData) {
                actionData.action({ obj: actionData.object, initiator: hero});
            } else if (hero.equipment.objectInMainHand) {
                const item = hero.equipment.objectInMainHand;
                const itemActionData = scene.getItemAction(item);
                if (itemActionData) {
                    itemActionData.action({ obj: itemActionData.object, initiator: hero});
                }
            }

            onInterval();
            return;
        } else {
            // debug keys
            if (code.shiftKey) {
                if (key_code === "KeyQ") {
                    selectLevel(devHubLevel);
                } else if (key_code === "KeyR") {
                    selectLevel(sheepLevel);
                } else if (key_code === "KeyE") {
                    selectLevel(level);
                } else if (key_code === "KeyT") {
                    selectLevel(lightsLevel);
                } else if (key_code === "KeyY") {
                    selectLevel(introLevel);
                } else if (key_code === "KeyU") {
                    selectLevel(dungeonLevel);
                }
                return;
            }

            // wind
            if (raw_key === 'p') {
                scene.level.isWindy = !scene.level.isWindy;
                emitEvent(new GameEvent(
                    "system", 
                    "wind_changed", 
                    {
                        from: !scene.level.isWindy,
                        to: scene.level.isWindy,
                    }));
            }
            //
            if (raw_key === 'q') {  // debug
                console.log('Changed time of the day');
                scene.gameTime += scene.ticksPerDay / 2;
            }
            
            return;  // skip
        }

        if (!code.shiftKey) {
            if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
                controlObject.move();
            }
        }
    }
}

function getActionUnderCursor(): {object: SceneObject, action: GameObjectAction, actionIcon: Cell} | undefined {
    return scene.getNpcAction(hero);
}

function getNpcUnderCursor(npc: Npc): SceneObject | undefined {
    for (let object of scene.level.objects) {
        if (!object.enabled) continue;
        if (!(object instanceof Npc)) continue;
        //
        if (object.position[0] === npc.cursorPosition[0] && 
            object.position[1] === npc.cursorPosition[1]) {
            return object;
        }
    }
    return undefined;
}

function drawDialog() {
    // background
    const dialogWidth = scene.camera.size.width;
    const dialogHeight = scene.camera.size.height / 2 - 3;
    const uiPanel = new UIPanel([0, scene.camera.size.height - dialogHeight], {
        width: dialogWidth,
        height: dialogHeight,
    });
    uiPanel.draw(ctx);
}

let uiInventory: UIInventory; 

function updateInventory() {
    uiInventory = new UIInventory(hero, scene.camera);
    uiInventory.update();
}

function drawInventory() {
    uiInventory?.draw(ctx);
}

const ticksPerStep = 33;

function onInterval() {
    game.update(ticksPerStep);
    eventLoop([game, scene, ...scene.level.objects]);
    game.draw();
}

// initial events
emitEvent(new GameEvent("system", "weather_changed", {from: scene.level.weatherType, to: scene.level.weatherType}));
emitEvent(new GameEvent("system", "wind_changed", {from: scene.level.isWindy, to: scene.level.isWindy}));
//
onInterval(); // initial run
setInterval(onInterval, ticksPerStep);

//

const weatherTypes = ["normal", "rain", "snow", "rain_and_snow", "mist"] as const;
type WeatherType = typeof weatherTypes[number];

function changeWeather(weatherType: WeatherType) {
    const oldWeatherType = scene.level.weatherType;
    scene.level.weatherType = weatherType;
    if (oldWeatherType !== scene.level.weatherType) {
        emitEvent(new GameEvent(
            "system", 
            "weather_changed", 
            {
                from: oldWeatherType,
                to: scene.level.weatherType,
            }));
    }
} 

// commands
declare global {
    interface Window { _: any; }
}
window._ = {

    selectLevel: selectLevel,
    levels: rawLevels,

    weatherTypes: Object.fromEntries(weatherTypes.map(x => [x, x])),
    changeWeather: changeWeather,

    toogleDebugDrawTemperatures: () => {
        console.log('Toggled debugDrawTemperatures');
        scene.debugDrawTemperatures = !scene.debugDrawTemperatures;
    },
    
    toggleDebugDrawMoisture: () => {
        console.log('Toggled debugDrawMoisture');
        scene.debugDrawMoisture = !scene.debugDrawMoisture;
    },

    toggleDebugDrawBlockedCells: () => {
        console.log("Toggled debugDrawBlockedCells");
        scene.debugDrawBlockedCells = !scene.debugDrawBlockedCells;
    },
}

