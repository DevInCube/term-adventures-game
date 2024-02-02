import { GameEvent, GameEventHandler } from "./engine/events/GameEvent";
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
import { volcanicLevel } from "./world/levels/volcanicLevel";
import { signalsLevel } from "./world/levels/signalsLevel";
import { Vector2 } from "./engine/math/Vector2";
import { signalLightsLevel } from "./world/levels/signalLightsLevel";
import { CanvasRenderer } from "./engine/renderers/CanvasRenderer";
import { UIElement } from "./ui/UIElement";
import { Camera } from "./engine/Camera";
import { GameMode } from "./GameMode";
import { UI } from "./UI";
import { FollowCamera } from "./engine/FollowCamera";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = new CanvasContext(canvas);

const renderer = new CanvasRenderer(canvas, ctx);

// TODO: more ideas:
// 1. 🎲 Game die, activate to randomize. ⚀⚁⚂⚃⚄⚅
// 2. 🎄 Christmas tree with blinking color lights. 

let camera = new Camera();

let ui: Scene = new UI(camera);

const dialog = createDialog(camera);
dialog.visible = false;
ui.add(dialog);

const uiInventory = new UIInventory(hero, camera); 
uiInventory.visible = false;
ui.add(uiInventory);

class Game implements GameEventHandler {

    mode: GameMode = "scene";
    
    private switchMode(from: GameMode, to: GameMode) {
        if (from === "dialog") {
            dialog.visible = false;
        } else if (from === "inventory") {
            uiInventory.visible = false;
        }

        this.mode = to;
        if (this.mode === "dialog") {
            dialog.visible = true;
        } else if (this.mode === "inventory") {
            uiInventory.refresh();
            uiInventory.visible = true;
        }
    }

    handleEvent(ev: GameEvent): void {
        if (ev.type === SwitchGameModeGameEvent.type) {
            const args = <SwitchGameModeGameEvent.Args>ev.args; 
            this.switchMode(args.from, args.to);
            console.log(`Game mode switched from ${args.from} to ${args.to}.`);
        } else if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(SwitchGameModeGameEvent.create("scene", "dialog"));
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
            emitEvent(PlayerMessageGameEvent.create(`${args.mounter.type} ${args.newState} ${args.mount.type}`));
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
        ctx.setLights(scene.lights.lightLayer);
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
        camera.update();
        ui.update(ticks);
    }
}

function loadLevel(level: Level) {
    scene = level;
    
    hero.position = new Vector2(9, 7);
    camera = new FollowCamera(hero, level.size);

    level.onLoaded();
}

function teleportToEndpoint(portalId: string, teleport: Object2D, object: Object2D) {
    const portalPositions = scene.portals[portalId];
    if (portalPositions?.length === 2) {
        // Pair portal is on the same level.
        const portalPositionIndex = portalPositions.findIndex(x => x.equals(teleport.position));
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
            teleportTo(pairPortal.levelId, pairPortal.position.clone().add(new Vector2(0, 1)));
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

let scene: Level = signalLightsLevel;

const debug = true;
if (debug) {
    selectLevel(null, signalLightsLevel);
    
    // TODO: this disables day progress for first level only.
    scene.debugDisableGameTime = true;
    debugProgressDay(0.5);
}

export const canvasPosition = new Vector2(
    (canvas.width - cellStyle.size.width * camera.size.width) / 2,
    (canvas.height - cellStyle.size.height * camera.size.height) / 2);

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
        controlObject.direction = Vector2.top;
        doMove = !Controls.Up.isShiftDown;
    } else if (Controls.Down.isDown) {
        controlObject.direction = Vector2.bottom;
        doMove = !Controls.Down.isShiftDown;
    } else if (Controls.Left.isDown) {
        controlObject.direction = Vector2.left;
        doMove = !Controls.Left.isShiftDown;
    } else if (Controls.Right.isDown) {
        controlObject.direction = Vector2.right;
        doMove = !Controls.Right.isShiftDown;
    } 

    if (doMove) {
        if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
            controlObject.move();
        }
    }

    if (Controls.Inventory.isDown && !Controls.Inventory.isHandled) {
        emitEvent(SwitchGameModeGameEvent.create(game.mode, "inventory"));
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

function createDialog(camera: Camera): UIElement {
    // background
    const dialogWidth = camera.size.width;
    const dialogHeight = camera.size.height / 2 - 3;
    const uiPanel = new UIPanel(
        null,
        new Vector2(0, camera.size.height - dialogHeight),
        new Vector2(dialogWidth, dialogHeight));
    return uiPanel;
}

const ticksPerStep = 33;
let startTime: Date = new Date();

function onInterval() {
    handleControls();

    const elapsedTime: number = new Date().getMilliseconds() - startTime.getMilliseconds();
    startTime = new Date();
    const ticksMillis = Math.max(0, elapsedTime);

    game.update(ticksMillis);

    eventLoop([game, scene, ...scene.children]);

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

    toogleDebugDrawTemperatures: () => {
        scene.temperatureLayerObject.visible = !scene.temperatureLayerObject.visible;
        console.log(`Toggled debugDrawTemperatures ${scene.temperatureLayerObject.visible}`);
    },
    
    toggleDebugDrawMoisture: () => {
        scene.moistureLayerObject.visible = !scene.moistureLayerObject.visible;
        console.log(`Toggled debugDrawMoisture ${scene.moistureLayerObject.visible}`);
    },

    toggleDebugDrawBlockedCells: () => {
        scene.blockedLayerObject.visible = !scene.blockedLayerObject.visible;
        console.log(`Toggled debugDrawBlockedCells ${scene.blockedLayerObject.visible}`);
    },

    toggleDebugDrawSignals: () => {
        scene.signalsLayerObject.visible = !scene.signalsLayerObject.visible;
        console.log(`Toggled debugDrawSignals ${scene.signalsLayerObject.visible}`);
    },

    toggleDebugDrawOpacity: () => {
        scene.opacityLayerObject.visible = !scene.opacityLayerObject.visible;
        console.log(`Toggled debugDrawOpacity ${scene.opacityLayerObject.visible}`);
    },
}

