import { GameEvent, GameEventHandler } from "./engine/events/GameEvent";
import { emitEvent, eventLoop } from "./engine/events/EventLoop";
import { Scene } from "./engine/Scene";
import { ActionData, getItemUsageAction, getNpcCollisionAction, getNpcInteraction } from "./engine/ActionData";
import { cellStyle } from "./engine/graphics/GraphicsEngine";
import { CanvasContext } from "./engine/graphics/CanvasContext";
import { hero } from "./world/hero";
import { PlayerUi } from "./ui/playerUi";
import { Level, WeatherType, weatherTypes } from "./engine/Level";
import { levels, rawLevels } from "./world/levels/levels";
import { devHubLevel } from "./world/levels/devHub";
import { SceneObject } from "./engine/objects/SceneObject";
import { TeleportToEndpointGameEvent } from "./world/events/TeleportToEndpointGameEvent";
import { Controls, enableGameInput } from "./controls";
import { MountGameEvent } from "./world/events/MountGameEvent";
import { PlayerMessageGameEvent } from "./world/events/PlayerMessageGameEvent";
import { SwitchGameModeGameEvent } from "./world/events/SwitchGameModeGameEvent";
import { AddObjectGameEvent } from "./world/events/AddObjectGameEvent";
import { TransferItemsGameEvent } from "./world/events/TransferItemsGameEvent";
import { createTextObject } from "./utils/misc";
import { LoadLevelGameEvent } from "./world/events/LoadLevelGameEvent";
import { RemoveObjectGameEvent } from "./world/events/RemoveObjectGameEvent";
import { TeleportToPositionGameEvent } from "./world/events/TeleportToPositionGameEvent";
import { UIPanel } from "./ui/UIPanel";
import { UIInventory } from "./ui/UIInventory";
import { particlesLevel } from "./world/levels/particlesLevel";
import { mistlandLevel } from "./world/levels/mistlandLevel";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = new CanvasContext(canvas);

class Game implements GameEventHandler {

    mode: string = "scene";  // "dialog", "inventory", ...

    handleEvent(ev: GameEvent): void {
        if (ev.type === SwitchGameModeGameEvent.type) {
            const args = <SwitchGameModeGameEvent.Args>ev.args; 
            this.mode = args.to;
            console.log(`Game mode switched from ${args.from} to ${args.to}.`);
        } else if (ev.type === TeleportToEndpointGameEvent.type) {
            const args = <TeleportToEndpointGameEvent.Args>ev.args;
            teleportToEndpoint(args.id, args.teleport, args.object);
        } else if (ev.type === TeleportToPositionGameEvent.type) {
            const args = <TeleportToPositionGameEvent.Args>ev.args;
            args.object.position = [...args.position];
        } else if (ev.type === MountGameEvent.type) {
            const args = <MountGameEvent.Args>ev.args;
            emitEvent(PlayerMessageGameEvent.create(`${args.mounter.type} ${args.newState} ${args.mount.type}`));
        } else if (ev.type === PlayerMessageGameEvent.type) {
            // TODO: implement an actual player message in UI.
            const args = <PlayerMessageGameEvent.Args>ev.args;
            const style = "color:steelblue;font-weight:bold;background-color:yellow";
            console.log(`%c${args.message}`, style);
        } else if (ev.type === TransferItemsGameEvent.type) {
            const args = <TransferItemsGameEvent.Args>ev.args;
            if (args.items.find(x => x.type === "victory_item")) {
                emitEvent(AddObjectGameEvent.create(createTextObject(`VICTORY!`, 6, 6)))
            }
        } else if (ev.type === LoadLevelGameEvent.type) {
            const args = <LoadLevelGameEvent.Args>ev.args;
            loadLevel(args.level);
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
        const collisionActionData = getNpcCollisionAction(hero);
        if (collisionActionData) {
            collisionActionData.action({
                obj: collisionActionData.object,
                initiator: hero,
                subject: collisionActionData.object,
            });
        }

        scene.update(ticks);
        heroUi.update(ticks, scene);
    }
}

function loadLevel(level: Level) {
    scene.level = level;
    scene.level.objects = scene.level.objects;
    for (const object of scene.level.objects) {
        object.scene = scene;
        object.bindToLevel(scene.level);
    }

    hero.position = [9, 7];
    scene.camera.follow(hero, level);

    level.onLoaded(scene);
}

function teleportToEndpoint(portalId: string, teleport: SceneObject, object: SceneObject) {
    const portalPositions = scene.level.portals[portalId];
    if (portalPositions?.length === 2) {
        // Pair portal is on the same level.
        const portalPositionIndex = portalPositions.findIndex(x => x[0] === teleport.position[0] && x[1] === teleport.position[1]);
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
            console.log(`Pair portal for "${portalId}" was not found.`);
        }
    }

    function teleportTo(levelId: string, position: [number, number]) {
        if (!scene.level) {
            return;
        }

        if (levelId !== scene.level.id) {
            selectLevel(scene.level, levels[levelId]);
        }

        emitEvent(TeleportToPositionGameEvent.create(object, position));
    }    
}

const game = new Game();

const scene = new Scene();

const debug = true;
if (debug) {
    selectLevel(null, mistlandLevel);
    scene.debugDisableGameTime = true;
    debugProgressDay(0.5);
}

export const leftPad = (canvas.width - cellStyle.size.width * scene.camera.size.width) / 2;
export const topPad = (canvas.height - cellStyle.size.height * scene.camera.size.height) / 2;

let heroUi = new PlayerUi(hero, scene.camera);

function selectLevel(prevLevel: Level | null, level: Level) {
    console.log(`Selecting level "${level.id}".`);
    if (prevLevel) {
        emitEvent(RemoveObjectGameEvent.create(hero));
    }

    emitEvent(LoadLevelGameEvent.create(level));
    emitEvent(AddObjectGameEvent.create(hero));
}

enableGameInput();

function handleControls() {
    if (game.mode === "scene") {
        handleSceneControls();
    } else {
        if (game.mode === "inventory") {
            uiInventory.handleControls();
        } 

        // TODO: add this to some abstract UI dialog and extent in concrete dialogs.
        if (Controls.Escape.isDown && !Controls.Escape.isHandled) {
            emitEvent(SwitchGameModeGameEvent.create(game.mode, "scene"));
            Controls.Escape.isHandled = true;
        }
    }
}

function handleSceneControls() {
    const controlObject = hero;

    let doMove = false;
    if (Controls.Up.isDown) {
        controlObject.direction = [0, -1];
        doMove = !Controls.Up.isShiftDown;
    } else if (Controls.Down.isDown) {
        controlObject.direction = [0, +1];
        doMove = !Controls.Down.isShiftDown;
    } else if (Controls.Left.isDown) {
        controlObject.direction = [-1, 0];
        doMove = !Controls.Left.isShiftDown;
    } else if (Controls.Right.isDown) {
        controlObject.direction = [+1, 0];
        doMove = !Controls.Right.isShiftDown;
    } 

    if (doMove) {
        if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
            controlObject.move();
        }
    }

    if (Controls.Inventory.isDown && !Controls.Inventory.isHandled) {
        updateInventory(); // TODO: handle somewhere else
        emitEvent(SwitchGameModeGameEvent.create(game.mode, "inventory"));
        Controls.Inventory.isHandled = true;
    } else if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
        interact();
        Controls.Interact.isHandled = true;
    }

    if (Controls.DebugP.isDown && !Controls.DebugP.isHandled) {
        debugToggleWind(Controls.DebugP.isShiftDown);
        Controls.DebugP.isHandled = true;
    }

    if (Controls.DebugQ.isDown && !Controls.DebugQ.isHandled) {
        debugProgressDay(Controls.DebugQ.isShiftDown ? 0.25 : 0.5);
        Controls.DebugQ.isHandled = true;
    }
}

function debugToggleWind(isShift: boolean) {
    // Iterates coordinate values: [-1, 0, 1].
    const index = isShift ? 1 : 0;
    scene.level.wind[index] = (scene.level.wind[index] === 1) ? -1 : scene.level.wind[index] + 1;
    emitEvent(new GameEvent(
        "system", 
        "wind_changed", 
        {
            from: !scene.level.isWindy,
            to: scene.level.isWindy,
        }));
}

function debugProgressDay(partOfTheDay: number) {
    scene.gameTime += scene.ticksPerDay * partOfTheDay;
    console.log(`Changed time of the day to ${scene.gameTime} (${getDayTimePeriodName(scene.gameTime)}).`);

    function getDayTimePeriodName(ticks: number) {
        const dayTime = ticks % scene.ticksPerDay;
        if (dayTime < scene.ticksPerDay * 0.25) {
            return "Midnight";
        } else if (dayTime < scene.ticksPerDay * 0.5) {
            return "Morning";
        } else if (dayTime < scene.ticksPerDay * 0.75) {
            return "Noon";
        } else {
            return "Evening";
        }
    }
}

function interact() {
    // First, check if there is an interaction that does not depend on hero's item.
    // This way hero can interact with NPC dialog with equipped weapons and not attacking them.
    const actionData = getActionUnderCursor();
    if (actionData) {
        actionData.action({
            obj: actionData.object,
            initiator: hero,
            subject: actionData.object,
        } );
        return;
    }
    
    // Second, check if hero's main hand item has any usage actions. 
    const item = hero.equipment.objectInMainHand;
    if (item) {
        const itemActionData = getItemUsageAction(item);
        const subject = scene.getNpcAt(item.position);
        if (itemActionData) {
            itemActionData.action({
                obj: itemActionData.object, 
                initiator: hero,
                subject: subject,
            });
        }
    }
}

function getActionUnderCursor(): ActionData | undefined {
    return getNpcInteraction(hero);
}

function drawDialog() {
    // background
    const dialogWidth = scene.camera.size.width;
    const dialogHeight = scene.camera.size.height / 2 - 3;
    const uiPanel = new UIPanel(null, [0, scene.camera.size.height - dialogHeight], {
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
let startTime: Date = new Date();

function onInterval() {
    handleControls();

    const elapsedTime: number = new Date().getMilliseconds() - startTime.getMilliseconds();
    startTime = new Date();
    const ticksMillis = Math.max(0, elapsedTime);

    game.update(ticksMillis);

    eventLoop([game, scene, ...scene.objects]);

    game.draw();
}

//
onInterval(); // initial run
setInterval(onInterval, ticksPerStep);

// commands
declare global {
    interface Window { _: any; }
}
window._ = {

    selectLevel: selectLevel,
    levels: rawLevels,

    weatherTypes: Object.fromEntries(weatherTypes.map(x => [x, x])),
    changeWeather: (x: WeatherType) => scene.level.changeWeather(x),

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

