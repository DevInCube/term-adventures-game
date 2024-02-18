import { GameEvent } from "./engine/events/GameEvent";
import { GameEventHandler } from "./engine/events/GameEventHandler";
import { emitEvent, eventLoop } from "./engine/events/EventLoop";
import { Scene } from "./engine/Scene";
import { ActionData, getItemUsageAction, getNpcCollisionAction, getNpcInteraction } from "./engine/ActionData";
import { cellStyle } from "./engine/graphics/cellStyle";
import { CanvasContext } from "./engine/graphics/CanvasContext";
import { hero } from "./world/hero";
import { PlayerUi } from "./ui/playerUi";
import { Level } from "./engine/Level";
import { WeatherType, weatherTypes } from "./engine/weather/WeatherType";
import { levels, rawLevels } from "./world/levels/levels";
import { devHubLevel } from "./world/levels/devHub";
import { Object2D } from "./engine/objects/Object2D";
import { TeleportToEndpointGameEvent } from "./world/events/TeleportToEndpointGameEvent";
import { Controls, enableGameInput } from "./controls";
import { MountGameEvent } from "./world/events/MountGameEvent";
import { PlayerMessageGameEvent } from "./world/events/PlayerMessageGameEvent";
import { AddObjectGameEvent } from "./world/events/AddObjectGameEvent";
import { TransferItemsGameEvent } from "./world/events/TransferItemsGameEvent";
import { createTextObject } from "./utils/misc";
import { LoadLevelGameEvent } from "./world/events/LoadLevelGameEvent";
import { RemoveObjectGameEvent } from "./world/events/RemoveObjectGameEvent";
import { TeleportToPositionGameEvent } from "./world/events/TeleportToPositionGameEvent";
import { UIInventory } from "./ui/UIInventory";
import { UIDialog } from "./ui/UIDialog";
import { particlesLevel } from "./world/levels/particlesLevel";
import { mistlandLevel } from "./world/levels/mistlandLevel";
import { volcanicLevel } from "./world/levels/volcanicLevel";
import { signalsLevel } from "./world/levels/signalsLevel";
import { Vector2 } from "./engine/math/Vector2";
import { signalLightsLevel } from "./world/levels/signalLightsLevel";
import { CanvasRenderer } from "./engine/renderers/CanvasRenderer";
import { Camera } from "./engine/cameras/Camera";
import { FollowCamera } from "./engine/cameras/FollowCamera";
import { effectsLevel } from "./world/levels/effectsLevel";

let camera = new Camera();
const canvasSize = camera.size.clone().multiply(cellStyle.size);
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvasSize.width;
canvas.height = canvasSize.height;
const ctx = new CanvasContext(canvas);

const renderer = new CanvasRenderer(canvas, ctx);

// TODO: more ideas:
// 1. 🎲 Game die, activate to randomize. ⚀⚁⚂⚃⚄⚅
// 2. 🎄 Christmas tree with blinking color lights. 

const ui: Scene = new Scene();
camera.add(ui);

const dialog = createDialog(camera);
ui.add(dialog);

const uiInventory = new UIInventory(hero, camera.size); 
ui.add(uiInventory);

class Game implements GameEventHandler {

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            dialog.open();
        } else if (ev.type === TransferItemsGameEvent.type) {
            const args = <TransferItemsGameEvent.Args>ev.args;
            args.recipient.inventory.addItems(args.items);
            console.log(`${args.recipient.type} received ${args.items.length} items.`);
        } else if (ev.type === TeleportToEndpointGameEvent.type) {
            const args = <TeleportToEndpointGameEvent.Args>ev.args;
            teleportToEndpoint(args.id, args.teleport, args.object);
        } else if (ev.type === TeleportToPositionGameEvent.type) {
            const args = <TeleportToPositionGameEvent.Args>ev.args;
            args.object.position = args.position.clone();
        } else if (ev.type === MountGameEvent.type) {
            const args = <MountGameEvent.Args>ev.args;
            const message = `${args.mounter.type} ${args.newState} ${args.mount.type}`;
            emitEvent(PlayerMessageGameEvent.create(message));
        } else if (ev.type === PlayerMessageGameEvent.type) {
            // TODO: implement an actual player message in UI.
            const args = <PlayerMessageGameEvent.Args>ev.args;
            const style = "color:steelblue;font-weight:bold;background-color:yellow";
            console.log(`%c${args.message}`, style);
        } else if (ev.type === TransferItemsGameEvent.type) {
            const args = <TransferItemsGameEvent.Args>ev.args;
            if (args.items.find(x => x.type === "victory_item")) {
                emitEvent(AddObjectGameEvent.create(createTextObject(`VICTORY!`, new Vector2(6, 6))));
            }
        } else if (ev.type === LoadLevelGameEvent.type) {
            const args = <LoadLevelGameEvent.Args>ev.args;
            loadLevel(args.level);
            console.log(`Loaded scene ${args.level.name}.`);
        } else if (ev.type === AddObjectGameEvent.type) {
            const args = <AddObjectGameEvent.Args>ev.args;
            scene.add(args.object);
            console.log(`${args.object.type} added to the scene ${scene.name}.`);
        } else if (ev.type === RemoveObjectGameEvent.type) {
            const args = <RemoveObjectGameEvent.Args>ev.args;
            scene.remove(args.object);
            console.log(`${args.object.type} removed from scene ${scene.name}.`);
        } 
    }

    draw() {
        ctx.beginDraw(scene.background, camera.size);
        renderer.render(scene, camera);
        ctx.setLights(scene.lights.lightLayer.subGrid(camera.box));
        renderer.render(ui, camera);
        ctx.endDraw();
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
        camera.update(ticks);
    }
}

function loadLevel(level: Level) {
    scene = level;
    
    hero.position = new Vector2(9, 7);
    camera = new FollowCamera(hero, level.size);
    camera.add(ui);

    level.onLoaded();
}

function teleportToEndpoint(portalId: string, teleport: Object2D, object: Object2D) {
    const portalPositions = scene.portals[portalId];
    if (portalPositions?.length === 2) {
        // Pair portal is on the same level.
        const teleportPosition = teleport.getWorldPosition(new Vector2());
        const portalPositionIndex = portalPositions
            .findIndex(x => x.equals(teleportPosition));
        const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
        teleportTo(scene.name, pairPortalPosition.clone().add(new Vector2(0, 1)));
    } else {
        // Find other level with this portal id.
        const pairPortals = Object.entries(levels)
            .filter(([levelId, _]) => levelId !== scene.name)
            .filter(([___, level]) => level.portals[portalId]?.length === 1)
            .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0]}));
        if (pairPortals?.length !== 0) {
            const pairPortal = pairPortals[0];
            const position = pairPortal.position.clone().add(new Vector2(0, 1));
            teleportTo(pairPortal.levelId, position);
        } else {
            console.log(`Pair portal for "${portalId}" was not found.`);
        }
    }

    function teleportTo(levelId: string, position: Vector2) {
        if (levelId !== scene.name) {
            selectLevel(scene, levels[levelId]);
        }

        emitEvent(TeleportToPositionGameEvent.create(object, position));
    }    
}

const game = new Game();

let scene: Level = effectsLevel;

const debug = true;
if (debug) {
    selectLevel(null, effectsLevel);
    
    // TODO: this disables day progress for first level only.
    scene.debugDisableGameTime = true;
    debugProgressDay(0.5);
}

let heroUi = new PlayerUi(hero, camera);
ui.add(heroUi);

function selectLevel(prevLevel: Level | null, level: Level) {
    console.log(`Selecting level "${level.name}".`);
    if (prevLevel) {
        emitEvent(RemoveObjectGameEvent.create(hero));
    }

    emitEvent(LoadLevelGameEvent.create(level));
    emitEvent(AddObjectGameEvent.create(hero));
}

enableGameInput();

function handleControls() {
    // TODO: opened dialogs stack?
    if (dialog.enabled) {
        dialog.handleControls();
    } else if (uiInventory.enabled) {
        uiInventory.handleControls();
    } else {
        handleSceneControls();
    }
}

function handleSceneControls() {
    const controlObject = hero;

    let doMove = false;
    if (Controls.Up.isDown) {
        controlObject.lookAt(Vector2.top);
        doMove = !Controls.Up.isShiftDown;
    } else if (Controls.Down.isDown) {
        controlObject.lookAt(Vector2.bottom);
        doMove = !Controls.Down.isShiftDown;
    } else if (Controls.Left.isDown) {
        controlObject.lookAt(Vector2.left);
        doMove = !Controls.Left.isShiftDown;
    } else if (Controls.Right.isDown) {
        controlObject.lookAt(Vector2.right);
        doMove = !Controls.Right.isShiftDown;
    } 

    if (doMove) {
        const position = controlObject.getWorldCursorPosition(new Vector2());
        if (!scene.isPositionBlocked(position)) {
            controlObject.move();
        }
    }

    if (Controls.Inventory.isDown && !Controls.Inventory.isHandled) {
        uiInventory.refresh();
        uiInventory.open();
        Controls.Inventory.isHandled = true;
    } else if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
        interact();
        Controls.Interact.isHandled = true;
    }

    if (Controls.Equip.isDown && !Controls.Equip.isHandled) {
        hero.equipment.toggleEquip();
        Controls.Equip.isHandled = true;
    }

    if (Controls.DebugP.isDown && !Controls.DebugP.isHandled) {
        debugToggleWind(Controls.DebugP.isShiftDown);
        Controls.DebugP.isHandled = true;
    }

    if (Controls.DebugO.isDown && !Controls.DebugO.isHandled) {
        debugProgressDay(Controls.DebugO.isShiftDown ? 0.25 : 0.5);
        Controls.DebugO.isHandled = true;
    }
}

function debugToggleWind(isShift: boolean) {
    // Iterates coordinate values: [-1, 0, 1].
    const oldWind = scene.weather.wind.clone();
    const index = isShift ? 1 : 0;
    const coord = scene.weather.wind.getAt(index);
    const newCoord = (coord === 1) ? -1 : coord + 1; 
    scene.weather.wind.setAt(index, newCoord);
    emitEvent(new GameEvent(
        "system", 
        "wind_changed", 
        {
            from: oldWind,
            to: scene.weather.wind,
        }));
}

function debugProgressDay(partOfTheDay: number) {
    scene.weather.gameTime += scene.weather.ticksPerDay * partOfTheDay;
    console.log(`Changed time of the day to ${scene.weather.gameTime} (${getDayTimePeriodName(scene.weather.gameTime)}).`);

    function getDayTimePeriodName(ticks: number) {
        const dayTime = ticks % scene.weather.ticksPerDay;
        if (dayTime < scene.weather.ticksPerDay * 0.25) {
            return "Midnight";
        } else if (dayTime < scene.weather.ticksPerDay * 0.5) {
            return "Morning";
        } else if (dayTime < scene.weather.ticksPerDay * 0.75) {
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
        const subject = scene.getNpcAt(item.getWorldPosition(new Vector2()));
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

function createDialog(camera: Camera): UIDialog {
    // background
    const dialogWidth = camera.size.width;
    const dialogHeight = camera.size.height / 2 - 3;
    const uiPanel = new UIDialog(new Vector2(dialogWidth, dialogHeight))
        .translateY(camera.size.height - dialogHeight);
    return uiPanel;
}

function onLoop(ticksMillis: number) {
    handleControls();

    game.update(ticksMillis);

    const handlers: GameEventHandler[] = [game];
    scene.traverse(x => handlers.push(x));
    eventLoop(handlers);

    game.draw();
}

let start: number = 0;
let previousTimeStamp: number = 0;

function step(timeStamp: number) {
    if (!start) {
        start = timeStamp;
    }

    if (!previousTimeStamp) {
        previousTimeStamp = timeStamp;
    }

    //const totalElapsed = timeStamp - start;
    const dt = timeStamp - previousTimeStamp;
    const ticks = Math.min(100, dt);
    onLoop(ticks);

    previousTimeStamp = timeStamp;
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

// commands
declare global {
    interface Window { _: any; }
}
window._ = {

    selectLevel: selectLevel,
    levels: rawLevels,

    weatherTypes: Object.fromEntries(weatherTypes.map(x => [x, x])),
    changeWeather: (x: WeatherType) => scene.weather.changeWeather(x),

    tick: {
        freeze() {
            console.log('Freezed signal tick updates.');
            scene.debugTickFreeze = true;
        },
        unfreeze() {
            console.log('Unfreezed signal ticking.');
            scene.debugTickFreeze = false;
        },
        step(nSteps: number = 1) {
            if (nSteps < 1) {
                console.log(`Invalid argument: ${nSteps}`);
                return;
            }

            console.log(`Unfreezed signal tick updates for ${nSteps} ticks.`);
            scene.debugTickStep = nSteps;
        },
    },

    toggleDebugDrawTemperatures: () => {
        const o = scene.temperatureLayerObject.toggle();
        console.log(`Toggled debugDrawTemperatures ${o.visible}`);
    },
    
    toggleDebugDrawMoisture: () => {
        const o = scene.moistureLayerObject.toggle();
        console.log(`Toggled debugDrawMoisture ${o.visible}`);
    },

    toggleDebugDrawBlockedCells: () => {
        const o = scene.blockedLayerObject.toggle();
        console.log(`Toggled debugDrawBlockedCells ${o.visible}`);
    },

    toggleDebugDrawSignals: () => {
        const o = scene.signalsLayerObject.toggle();
        console.log(`Toggled debugDrawSignals ${o.visible}`);
    },

    toggleDebugDrawOpacity: () => {
        const o = scene.opacityLayerObject.toggle();
        console.log(`Toggled debugDrawOpacity ${o.visible}`);
    },

    effects: () => {
        for (const item of hero.equipment.getEquippedItems()) {
            const effects = item.effects;
            if (effects.length <= 0) {
                continue;
            }

            for (const effect of item.effects) {
                console.log(`${item.type}: ${effect.name}.${effect.type} (${effect.value})`, effect);
            }
        }

        for (const effect of hero.effects.map(x => x.effect)) {
            console.log(`${effect.name}.${effect.type} (${effect.value})`, effect);
        }
    },
}

