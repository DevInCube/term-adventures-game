import { sheepLevel } from "./world/levels/sheep";
import { emptyHand, lamp, sword } from "./world/items";
import { GameEvent, GameEventHandler } from "./engine/events/GameEvent";
import { GameObjectAction, SceneObject } from "./engine/objects/SceneObject";
import { emitEvent, eventLoop } from "./engine/events/EventLoop";
import { Scene } from "./engine/Scene";
import { Cell } from "./engine/graphics/Cell";
import { cellStyle, drawCell } from "./engine/graphics/GraphicsEngine";
import { CanvasContext } from "./engine/graphics/CanvasContext";
import { hero } from "./world/hero";
import { PlayerUi } from "./ui/playerUi";
import { Npc } from "./engine/objects/Npc";
import { clone } from "./utils/misc";
import { introLevel } from "./world/levels/intro";
import { level } from "./world/levels/ggj2020demo/level";
import { Level } from "./engine/Level";
import { levels } from "./world/levels/levels";
import { lightsLevel } from "./world/levels/lights";
import { devHubLevel } from "./world/levels/devHub";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = new CanvasContext(canvas.getContext("2d") as CanvasRenderingContext2D);

const debugInput = document.getElementById("debug") as HTMLInputElement;
debugInput.addEventListener('keyup', function (ev: KeyboardEvent) {
    const input = ev.target as HTMLInputElement;
    if (ev.key === 'Enter' && input.value) {
        runDebugCommand(input.value);
    }
});
debugInput.addEventListener('focusin', function (ev) { disableGameInput(); })
debugInput.addEventListener('focusout', function (ev) { enableGameInput(); })

function runDebugCommand(rawInput : string) {
    console.log(`DEBUG: ${rawInput}`);
    const tokens = rawInput.split(' ');
    if (tokens[0] === 'time') {
        if (tokens[1] === 'set') {
            const time = parseFloat(tokens[2]);
            scene.gameTime = time * scene.ticksPerDay;
        } else if (tokens[1] === 'get') {
            console.log(scene.gameTime);
        }
    }
}

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
        }
        ctx.draw();
    }

    update(ticks: number) {
        heroUi.update(ticks, scene);
        if (this.mode === "scene") {
            checkPortals();
            scene.update(ticks);
        }
    }
}

function checkPortals() {
    if (!scene.level) {
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
    scene.level = level;
    scene.level.objects = scene.level.objects.filter(x => x !== hero).concat([hero]);
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
    if (game.mode === 'scene') {
        // onSceneInput();
    } else if (game.mode === 'dialog') {
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
    }
    
    onInterval();

    function onSceneInput() {
        if (raw_key === 'w') {
            hero.direction = [0, -1];
        } else if (raw_key === 's') {
            hero.direction = [0, +1];
        } else if (raw_key === 'a') {
            hero.direction = [-1, 0];
        } else if (raw_key === 'd') {
            hero.direction = [+1, 0];
        } else if (raw_key === ' ') {
            if (hero.objectInMainHand === sword) {
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
                actionData.action(actionData.object);
            }
            onInterval();
            return;
        } else {
            // debug keys
            if (code.shiftKey) {
                if (key_code === 'Digit1') {
                    hero.objectInMainHand = clone(emptyHand);
                } else if (key_code === 'Digit2') {
                    hero.objectInMainHand = clone(sword);
                } else if (key_code === "KeyQ") {
                    selectLevel(devHubLevel);
                } else if (key_code === "KeyR") {
                    selectLevel(sheepLevel);
                } else if (key_code === "KeyE") {
                    selectLevel(level);
                } else if (key_code === "KeyT") {
                    selectLevel(lightsLevel);
                } else if (key_code === "KeyY") {
                    selectLevel(introLevel);
                }
                return;
            }

            const oldWeatherType = scene.level.weatherType;
            if (raw_key === '1') {  // debug
                scene.level.weatherType = 'normal';
            } else if (raw_key === '2') {  // debug
                scene.level.weatherType = 'rain';
            } else if (raw_key === '3') {  // debug
                scene.level.weatherType = 'snow';
            } else if (raw_key === '4') {  // debug
                scene.level.weatherType = 'rain_and_snow';
            } else if (raw_key === '5') {  // debug
                scene.level.weatherType = 'mist';
            } 
            if (oldWeatherType !== scene.level.weatherType) {
                emitEvent(new GameEvent(
                    "system", 
                    "weather_changed", 
                    {
                        from: oldWeatherType,
                        to: scene.level.weatherType,
                    }));
            }
            // wind
            if (raw_key === 'e') {
                scene.isWindy = !scene.isWindy;
                emitEvent(new GameEvent(
                    "system", 
                    "wind_changed", 
                    {
                        from: !scene.isWindy,
                        to: scene.isWindy,
                    }));
            }
            //
            if (raw_key === 'q') {  // debug
                console.log('Changed time of the day');
                scene.gameTime += scene.ticksPerDay / 2;
            }
            if (raw_key === 't') {
                console.log('Toggled debugDrawTemperatures');
                scene.debugDrawTemperatures = !scene.debugDrawTemperatures;
            }
            if (raw_key === 'm') {
                console.log('Toggled debugDrawMoisture');
                scene.debugDrawMoisture = !scene.debugDrawMoisture;
            }
            if (raw_key === 'b') {
                console.log("Toggled debugDrawBlockedCells");
                scene.debugDrawBlockedCells = !scene.debugDrawBlockedCells;
            }
            return;  // skip
        }
        if (!code.shiftKey) {
            if (!scene.isPositionBlocked(hero.cursorPosition)) {
                hero.move();
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
    for (let y = 0; y < dialogHeight; y++) {
        for (let x = 0; x < dialogWidth; x++) {
            if (x === 0 || x === dialogWidth - 1 || y === 0 || y === dialogHeight - 1)
                drawCell(ctx, scene.camera, new Cell(' ', 'black', '#555'), x, scene.camera.size.height - dialogHeight + y);
            else 
                drawCell(ctx, scene.camera, new Cell(' ', 'white', '#333'), x, scene.camera.size.height - dialogHeight + y);
        }
    }
}

const ticksPerStep = 33;

function onInterval() {
    game.update(ticksPerStep);
    eventLoop([game, scene, ...scene.level.objects]);
    game.draw();
}

// initial events
emitEvent(new GameEvent("system", "weather_changed", {from: scene.level.weatherType, to: scene.level.weatherType}));
emitEvent(new GameEvent("system", "wind_changed", {from: scene.isWindy, to: scene.isWindy}));
//
onInterval(); // initial run
setInterval(onInterval, ticksPerStep);

// commands
declare global {
    interface Window { command: any; }
}
window.command = new class {
    getItem (itemName: string) {
        console.log('Not implemented yet')
    }
    takeItem (itemName: string) {
        if (itemName === 'sword') {
            hero.objectInMainHand = clone(sword);
        } else if (itemName === 'lamp') {
            hero.objectInMainHand = clone(lamp);
        }
    }
    takeItem2 (itemName: string) {
        if (itemName === 'lamp') {
            hero.objectInSecondaryHand = clone(lamp);
        } else {
            hero.objectInSecondaryHand = null;
        }
    }
}

