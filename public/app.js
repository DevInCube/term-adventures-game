System.register("controls", [], function (exports_1, context_1) {
    "use strict";
    var Controls;
    var __moduleName = context_1 && context_1.id;
    function create(code, area = [0, 0, 0, 0]) {
        return {
            isHandled: false,
            isDown: false,
            isShiftDown: false,
            code,
            area,
            touchID: -1,
        };
    }
    function findControlByCode(code) {
        var _a;
        return (_a = Object.entries(Controls).find(x => x[1].code === code)) === null || _a === void 0 ? void 0 : _a[1];
    }
    function findControlByTouchArea(x, y) {
        for (const [_, o] of Object.entries(Controls)) {
            if (x < o.area[0] * window.innerWidth / 100)
                continue;
            if (y < o.area[1] * window.innerHeight / 100)
                continue;
            if (x > o.area[2] * window.innerWidth / 100)
                continue;
            if (y > o.area[3] * window.innerHeight / 100)
                continue;
            return o;
        }
        return undefined;
    }
    function findControlByTouchID(touchId) {
        var _a;
        return (_a = Object.entries(Controls).find(x => x[1].touchID === touchId)) === null || _a === void 0 ? void 0 : _a[1];
    }
    // exported
    function enableGameInput() {
        document.addEventListener("keydown", onkeydown);
        document.addEventListener("keyup", onkeyup);
        if (isTouchDevice()) {
            console.log('Touch input is supported.');
            document.addEventListener("touchstart", ontouchstart);
            document.addEventListener("touchend", ontouchend);
        }
        console.log('Enabled game input.');
    }
    exports_1("enableGameInput", enableGameInput);
    // event listeners
    // keyboard
    function onkeyup(ev) {
        const control = findControlByCode(ev.code);
        if (control) {
            control.isHandled = false;
            control.isDown = false;
            control.isShiftDown = false;
        }
    }
    function onkeydown(ev) {
        const control = findControlByCode(ev.code);
        if (control) {
            control.isDown = true;
            control.isShiftDown = ev.shiftKey;
        }
    }
    // touch screen
    function isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);
    }
    function ontouchstart(ev) {
        for (let touchId = 0; touchId < ev.touches.length; touchId++) {
            const touch = ev.touches[touchId];
            const control = findControlByTouchArea(touch.clientX, touch.clientY);
            if (control) {
                control.isDown = true;
                control.touchID = touchId;
            }
        }
    }
    function ontouchend(ev) {
        for (let touchId = 0; touchId < ev.changedTouches.length; touchId++) {
            var control = findControlByTouchID(touchId);
            if (control) {
                control.isHandled = false;
                control.isDown = false;
                control.touchID = -1;
            }
        }
    }
    return {
        setters: [],
        execute: function () {
            exports_1("Controls", Controls = {
                Up: create("KeyW", [25, 0, 75, 25]),
                Down: create("KeyS", [25, 75, 75, 100]),
                Left: create("KeyA", [0, 25, 25, 75]),
                Right: create("KeyD", [75, 25, 100, 75]),
                //
                Escape: create("Escape", [0, 0, 25, 25]),
                Inventory: create("KeyE", [75, 0, 100, 25]),
                Interact: create("Space", [25, 25, 75, 75]),
                //
                DebugQ: create("KeyQ", [0, 75, 25, 100]),
                DebugP: create("KeyP"),
            });
        }
    };
});
System.register("engine/events/GameEvent", [], function (exports_2, context_2) {
    "use strict";
    var GameEvent;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            GameEvent = class GameEvent {
                constructor(sender, type, args) {
                    this.sender = sender;
                    this.type = type;
                    this.args = args;
                }
            };
            exports_2("GameEvent", GameEvent);
        }
    };
});
System.register("engine/events/EventLoop", [], function (exports_3, context_3) {
    "use strict";
    var events;
    var __moduleName = context_3 && context_3.id;
    function eventLoop(handlers) {
        while (events.length > 0) {
            const ev = events.shift();
            if (ev) {
                for (const obj of handlers) {
                    obj.handleEvent(ev);
                }
            }
        }
    }
    exports_3("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_3("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("engine/components/ObjectSkin", [], function (exports_4, context_4) {
    "use strict";
    var ObjectSkin;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            ObjectSkin = class ObjectSkin {
                constructor(charactersMask = '', colorsMask = '', colors = {}) {
                    this.charactersMask = charactersMask;
                    this.colorsMask = colorsMask;
                    this.colors = colors;
                    this.characters = [];
                    this.grid = [];
                    this.raw_colors = [];
                    this.raw_colors = this.getRawColors();
                    this.characters = charactersMask.split('\n');
                    this.grid = this.characters.map(this.groupUnicode);
                    // console.log(charactersMask, this.characters);
                }
                getRawColors() {
                    let raw_colors = [];
                    const lines = this.colorsMask.split('\n');
                    for (let y = 0; y < lines.length; y++) {
                        raw_colors.push([]);
                        for (let x = 0; x < lines[y].length; x++) {
                            const cellColor = lines[y][x] || ' ';
                            const color = this.colors[cellColor];
                            raw_colors[y].push(color ? [...color] : ['', '']);
                        }
                    }
                    return raw_colors;
                }
                groupUnicode(line) {
                    const newLine = [];
                    let x = 0;
                    for (let charIndex = 0; charIndex < line.length; charIndex++) {
                        const codePoint = line.codePointAt(charIndex);
                        let char = line[charIndex] || ' ';
                        if (codePoint && codePoint > 0xffff) {
                            const next = line[charIndex + 1];
                            if (next) {
                                char += next;
                                charIndex += 1;
                            }
                        }
                        newLine.push(char);
                        x += 1;
                    }
                    return newLine;
                }
            };
            exports_4("ObjectSkin", ObjectSkin);
        }
    };
});
System.register("engine/components/ObjectPhysics", [], function (exports_5, context_5) {
    "use strict";
    var ObjectPhysics;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '', topMask = '', transparencyMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                    this.temperatures = temperatureMask.split('\n');
                    this.tops = topMask.split('\n');
                    this.transparency = transparencyMask !== ''
                        ? transparencyMask.split('\n')
                        : this.collisions.map(x => x === '.' ? 'F' : '0');
                }
            };
            exports_5("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("engine/graphics/Cell", [], function (exports_6, context_6) {
    "use strict";
    var Cell;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Cell = class Cell {
                get isEmpty() {
                    const result = this.character === ' ' &&
                        this.textColor === '' &&
                        this.backgroundColor === '';
                    return result;
                }
                constructor(character = ' ', textColor = 'white', backgroundColor = 'black', lightColor = 'white', lightIntensity = null) {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                    this.lightColor = lightColor;
                    this.lightIntensity = lightIntensity;
                }
            };
            exports_6("Cell", Cell);
        }
    };
});
System.register("engine/graphics/CellInfo", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/StaticGameObject", ["engine/objects/SceneObject"], function (exports_8, context_8) {
    "use strict";
    var SceneObject_1, StaticGameObject;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position = [0, 0]) {
                    super(originPoint, skin, physics, position);
                }
            };
            exports_8("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_9, context_9) {
    "use strict";
    var ObjectSkin_1, StaticGameObject_1, ObjectPhysics_1;
    var __moduleName = context_9 && context_9.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_9("distanceTo", distanceTo);
    function createTextObjectSkin(text, color, background) {
        const textSkin = new ObjectSkin_1.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [color, background] });
        return textSkin;
    }
    exports_9("createTextObjectSkin", createTextObjectSkin);
    function createTextObject(text, x, y) {
        const skin = createTextObjectSkin(text);
        const t = new StaticGameObject_1.StaticGameObject([0, 0], skin, new ObjectPhysics_1.ObjectPhysics(), [x, y]);
        t.type = "victory_text_object";
        return t;
    }
    exports_9("createTextObject", createTextObject);
    function deepCopy(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" !== typeof obj)
            return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = deepCopy(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = deepCopy(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    exports_9("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/objects/Behavior", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Item", ["engine/objects/SceneObject", "engine/components/ObjectPhysics"], function (exports_11, context_11) {
    "use strict";
    var SceneObject_2, ObjectPhysics_2, Item;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_2.SceneObject {
                constructor(originPoint, skin, physics = new ObjectPhysics_2.ObjectPhysics(), position = [0, 0]) {
                    super(originPoint, skin, physics, position);
                }
                setUsage(action) {
                    this.setAction({
                        type: "usage",
                        action,
                    });
                }
                static create(type, skin, physics = new ObjectPhysics_2.ObjectPhysics()) {
                    const item = new Item([0, 0], skin, physics);
                    item.type = type;
                    return item;
                }
            };
            exports_11("Item", Item);
        }
    };
});
System.register("engine/objects/Equipment", [], function (exports_12, context_12) {
    "use strict";
    var Equipment;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            Equipment = class Equipment {
                constructor(object) {
                    this.object = object;
                    this.items = [];
                    this.objectInMainHand = null;
                    this.objectInSecondaryHand = null;
                }
                equip(item) {
                    // TODO: check if item is equippable and if it is handhold-equippable.
                    if (item === this.objectInSecondaryHand) {
                        this.objectInSecondaryHand = null;
                    }
                    this.objectInMainHand = item;
                    item.parent = this.object;
                    item.position = [...this.object.direction];
                    // TODO: event and player message.
                    const itemTypeStyle = "color:blue;font-weight:bold;";
                    const defaultStyle = "color:black;font-weight:normal;";
                    console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                    // TODO: equippable items categories
                    //this.items.push(item);
                }
            };
            exports_12("Equipment", Equipment);
        }
    };
});
System.register("engine/objects/TileCategory", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Tile", ["engine/objects/SceneObject", "engine/components/ObjectPhysics"], function (exports_14, context_14) {
    "use strict";
    var SceneObject_3, ObjectPhysics_3, Tile;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            }
        ],
        execute: function () {
            Tile = class Tile extends SceneObject_3.SceneObject {
                get totalMovementPenalty() {
                    return this.movementPenalty * (1 - 0.1 * this.snowLevel);
                }
                constructor(skin, position) {
                    super([0, 0], skin, new ObjectPhysics_3.ObjectPhysics(), position);
                    this.movementPenalty = 1;
                    this.snowLevel = 0;
                    this.snowTicks = 0;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    if (this.category === "solid") {
                        this.snowTicks += ticks;
                        if (this.snowTicks > 3000) {
                            const temp = scene.getTemperatureAt(this.position);
                            if (temp < 8) {
                                const isSnowing = scene.getWeatherAt(this.position) === "snow";
                                if (isSnowing && this.snowLevel < Tile.maxSnowLevel) {
                                    this.snowLevel += Math.random() * 2 | 0;
                                }
                            }
                            else {
                                if (this.snowLevel > 0) {
                                    this.snowLevel -= 1;
                                }
                            }
                            this.snowTicks = 0;
                        }
                    }
                }
            };
            exports_14("Tile", Tile);
            Tile.maxSnowLevel = 4;
        }
    };
});
System.register("engine/objects/NpcMovementOptions", [], function (exports_15, context_15) {
    "use strict";
    var NpcMovementOptions, defaultMovementOptions;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            // Number values are in cells per second.
            NpcMovementOptions = class NpcMovementOptions {
            };
            exports_15("NpcMovementOptions", NpcMovementOptions);
            exports_15("defaultMovementOptions", defaultMovementOptions = {
                walking: {
                    walkingSpeed: 4,
                    swimmingSpeed: 1,
                },
                waterborne: {
                    swimmingSpeed: 10,
                },
                amphibious: {
                    walkingSpeed: 1,
                    swimmingSpeed: 4,
                },
                flying: {
                    walkingSpeed: 3,
                    flyingSpeed: 10,
                }
            });
        }
    };
});
System.register("engine/objects/Npc", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "utils/misc", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Equipment", "engine/objects/NpcMovementOptions"], function (exports_16, context_16) {
    "use strict";
    var SceneObject_4, ObjectSkin_2, ObjectPhysics_4, misc_1, EventLoop_1, GameEvent_1, Equipment_1, NpcMovementOptions_1, Npc;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (SceneObject_4_1) {
                SceneObject_4 = SceneObject_4_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            },
            function (Equipment_1_1) {
                Equipment_1 = Equipment_1_1;
            },
            function (NpcMovementOptions_1_1) {
                NpcMovementOptions_1 = NpcMovementOptions_1_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_4.SceneObject {
                get children() {
                    return [...super.children, this.equipment.objectInMainHand, this.equipment.objectInSecondaryHand, this.mount]
                        .filter(x => x);
                }
                get direction() {
                    return this._direction;
                }
                set direction(value) {
                    if (this._direction[0] !== value[0] || this._direction[1] !== value[1]) {
                        this._direction = [...value];
                        this.onMoved();
                    }
                }
                get attackValue() {
                    return this.basicAttack; // @todo
                }
                get cursorPosition() {
                    return [
                        this.position[0] + this.direction[0],
                        this.position[1] + this.direction[1]
                    ];
                }
                constructor(skin = new ObjectSkin_2.ObjectSkin(), position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics(`.`, ``), position);
                    this._direction = [0, 1];
                    this.showCursor = false;
                    this.movementOptions = NpcMovementOptions_1.defaultMovementOptions.walking;
                    this.moveSpeedPenalty = 0;
                    this.moveTick = 0;
                    this.equipment = new Equipment_1.Equipment(this);
                    this.health = 1;
                    this.maxHealth = 3;
                    this.basicAttack = 1;
                    this.attackTick = 0;
                    this.attackSpeed = 1; // atk per second
                    this.behaviors = [];
                    this.mount = null;
                    this.important = true;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.moveTick += ticks;
                    this.attackTick += ticks;
                    //
                    for (const b of this.behaviors) {
                        b.update(ticks, this);
                    }
                }
                move() {
                    var _a, _b;
                    const obj = this;
                    if (!obj.scene) {
                        console.error("Can not move. Object is not bound to scene.");
                        return;
                    }
                    const [nextPosX, nextPosY] = [obj.position[0] + obj.direction[0], obj.position[1] + obj.direction[1]];
                    const tile = (_a = obj.scene.level.tiles[nextPosY]) === null || _a === void 0 ? void 0 : _a[nextPosX];
                    obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);
                    const moveSpeed = this.calculateMoveSpeed(tile);
                    const moveSpeedPenalty = obj.moveSpeedPenalty;
                    const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
                    if (resultSpeed <= 0) {
                        return;
                    }
                    if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
                        obj.position = [
                            obj.position[0] + obj.direction[0],
                            obj.position[1] + obj.direction[1]
                        ];
                        if (obj.realm === "ground") {
                            const tile = (_b = this.scene) === null || _b === void 0 ? void 0 : _b.getTileAt(obj.position);
                            if (tile && tile.snowLevel > 1) {
                                tile.snowLevel -= 1;
                            }
                        }
                        //
                        obj.moveTick = 0;
                    }
                }
                onMoved() {
                    const obj = this;
                    // Move equipped items.
                    if (obj.equipment.objectInMainHand) {
                        obj.equipment.objectInMainHand.position = [...obj.direction];
                    }
                    if (obj.equipment.objectInSecondaryHand) {
                        obj.equipment.objectInSecondaryHand.position = [obj.direction[1], obj.direction[0]];
                    }
                }
                attack(target) {
                    if (this.attackTick > 1000 / this.attackSpeed) {
                        this.attackTick = 0;
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "attack", {
                            object: this,
                            subject: target,
                        }));
                    }
                }
                distanceTo(other) {
                    return misc_1.distanceTo(this.position, other.position);
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === "attack" && ev.args.subject === this) {
                        const damage = ev.args.object.attackValue;
                        this.health -= damage;
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(ev.args.object, "damage", Object.create(ev.args)));
                        if (this.health <= 0) {
                            this.enabled = false;
                            EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "death", { object: this, cause: { type: "attacked", by: ev.args.object } }));
                        }
                    }
                    for (const b of this.behaviors) {
                        b.handleEvent(ev, this);
                    }
                }
                runAway(enemiesNearby) {
                    const freeDirections = this.getFreeDirections();
                    if (freeDirections.length === 0) {
                        return;
                    }
                    const possibleDirs = freeDirections.map(x => ({ direction: x }));
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        if (enemiesNearby.length) {
                            const distances = enemiesNearby.map(x => misc_1.distanceTo(position, x.position));
                            const nearestEnemyDistance = Math.min(...distances);
                            pd.distance = nearestEnemyDistance;
                        }
                    }
                    const direction = possibleDirs;
                    direction.sort((x, y) => y.distance - x.distance);
                    if (direction.length) {
                        if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                            const randIndex = Math.random() * 2 | 0;
                            this.direction = direction[randIndex].direction;
                        }
                        else {
                            this.direction = direction[0].direction;
                        }
                        this.move();
                    }
                }
                approach(target) {
                    const freeDirections = this.getFreeDirections();
                    if (freeDirections.length === 0) {
                        return;
                    }
                    const possibleDirs = freeDirections.map(x => ({ direction: x }));
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        pd.distance = misc_1.distanceTo(position, target.position);
                    }
                    const direction = possibleDirs;
                    direction.sort((x, y) => x.distance - y.distance);
                    if (direction.length) {
                        if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                            const randIndex = Math.random() * 2 | 0;
                            this.direction = direction[randIndex].direction;
                        }
                        else {
                            this.direction = direction[0].direction;
                        }
                        this.move();
                    }
                }
                faceRandomDirection(koef = 100) {
                    if ((Math.random() * koef | 0) === 0) {
                        const randomIndex = Math.random() * Npc.directions.length | 0;
                        this.direction = Npc.directions[randomIndex];
                    }
                }
                getFreeDirections() {
                    // Detect all possible free positions.
                    const directions = Npc.directions
                        .map(direction => ({
                        direction,
                        isBlocked: this.scene.isPositionBlocked([
                            this.position[0] + direction[0],
                            this.position[1] + direction[1]
                        ])
                    }))
                        .filter(x => !x.isBlocked)
                        .map(x => x.direction);
                    return directions;
                }
                moveRandomFreeDirection() {
                    const freeDirections = this.getFreeDirections();
                    if (freeDirections.length === 0) {
                        return;
                    }
                    if (freeDirections.length === 1) {
                        this.direction = [...freeDirections[0]];
                        this.move();
                        return;
                    }
                    // Select random free position.
                    const randomIndex = Math.random() * freeDirections.length | 0;
                    this.direction = [...freeDirections[randomIndex]];
                    this.move();
                }
                moveRandomly(koef = 100) {
                    if ((Math.random() * koef | 0) === 0) {
                        this.moveRandomFreeDirection();
                    }
                }
                getMobsNearby(scene, radius, callback) {
                    const enemies = [];
                    for (const object of scene.level.objects) {
                        if (!object.enabled)
                            continue;
                        if (object === this)
                            continue; // self check
                        if (object instanceof Npc && callback(object)) {
                            if (this.distanceTo(object) < radius) {
                                enemies.push(object);
                            }
                        }
                    }
                    return enemies;
                }
                getObjectsNearby(scene, radius, callback) {
                    const nearObjects = [];
                    for (const object of scene.level.objects) {
                        if (!object.enabled)
                            continue;
                        if (object === this)
                            continue; // self check
                        if (object instanceof SceneObject_4.SceneObject && callback(object)) {
                            if (this.distanceTo(object) < radius) {
                                nearObjects.push(object);
                            }
                        }
                    }
                    return nearObjects;
                }
                calculateMoveSpeedPenalty(tile) {
                    if (!tile) {
                        return 0;
                    }
                    return tile.totalMovementPenalty;
                }
                calculateMoveSpeed(tile) {
                    if (!tile) {
                        return 0;
                    }
                    const obj = this.mount || this;
                    const isFlying = obj.realm === "sky" || obj.realm === "soul";
                    const isInWater = tile.category === "liquid";
                    const isOnMountain = tile.category === "elevated";
                    if (isFlying) {
                        return obj.movementOptions.flyingSpeed;
                    }
                    else if (isInWater) {
                        return obj.movementOptions.swimmingSpeed;
                    }
                    else if (isOnMountain) {
                        return obj.movementOptions.climbingSpeed;
                    }
                    else {
                        return obj.movementOptions.walkingSpeed;
                    }
                }
            };
            exports_16("Npc", Npc);
            Npc.directions = [[0, 1], [-1, 0], [0, -1], [1, 0]];
        }
    };
});
System.register("engine/data/SpriteInfo", [], function (exports_17, context_17) {
    "use strict";
    var SpriteInfo;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            exports_17("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["engine/components/ObjectSkin", "engine/data/SpriteInfo"], function (exports_18, context_18) {
    "use strict";
    var ObjectSkin_3, SpriteInfo_1, Sprite;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (SpriteInfo_1_1) {
                SpriteInfo_1 = SpriteInfo_1_1;
            }
        ],
        execute: function () {
            Sprite = class Sprite {
                constructor() {
                    this.frames = {};
                }
                static parse(str) {
                    const info = new SpriteInfo_1.SpriteInfo();
                    const lines = str.split(`\n`);
                    let i = 0;
                    const colorsDict = {};
                    // read headers (sprite info)
                    while (lines[i] !== '') {
                        const [key, value] = lines[i].split(':');
                        if (key === 'width')
                            info.width = Number(value);
                        else if (key === 'height')
                            info.height = Number(value);
                        else if (key === 'name')
                            info.name = value;
                        else if (key === 'empty')
                            info.empty = value;
                        else if (key === 'color') {
                            const colorParts = value.split(',');
                            colorsDict[colorParts[0]] = [colorParts[1], colorParts[2]];
                        }
                        else
                            throw new Error(`unknown key: '${key}'`);
                        i++;
                    }
                    i++;
                    //console.log(info);
                    const sprite = new Sprite();
                    while (i < lines.length) {
                        if (lines[i].startsWith(info.name)) {
                            const name = lines[i].substr(info.name.length);
                            //console.log(name);
                            i++;
                            const framesCount = lines[i].length / info.width;
                            const bodies = Array(framesCount).fill(``);
                            for (let y = 0; y < info.height; y++) {
                                for (let x = 0; x < framesCount; x++) {
                                    const part = lines[i + y].substr(x * info.width, info.width);
                                    bodies[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                                }
                            }
                            i += info.height;
                            //
                            const colors = Array(framesCount).fill(``);
                            for (let y = 0; y < info.height; y++) {
                                for (let x = 0; x < framesCount; x++) {
                                    const part = lines[i + y].substr(x * info.width, info.width);
                                    colors[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                                }
                            }
                            i += info.height;
                            for (let k = 0; k < framesCount; k++) {
                                if (k === 0)
                                    sprite.frames[name] = [];
                                sprite.frames[name].push(new ObjectSkin_3.ObjectSkin(bodies[k], colors[k], colorsDict));
                            }
                        }
                        else {
                            i += 1;
                        }
                    }
                    return sprite;
                }
            };
            exports_18("Sprite", Sprite);
        }
    };
});
System.register("engine/objects/Particle", ["engine/components/ObjectPhysics", "engine/objects/StaticGameObject"], function (exports_19, context_19) {
    "use strict";
    var ObjectPhysics_5, StaticGameObject_2, Particle;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            },
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            }
        ],
        execute: function () {
            Particle = class Particle extends StaticGameObject_2.StaticGameObject {
                constructor(sprite, position, state) {
                    const initialFrame = Particle.getFrameSkinAt(sprite, state);
                    super([0, 0], initialFrame, new ObjectPhysics_5.ObjectPhysics(), position);
                    this.sprite = sprite;
                    this.state = state;
                }
                next() {
                    const frame = this.sprite.frames[Particle.defaultFrameName];
                    this.state = (this.state + 1) % frame.length;
                    this.skin = Particle.getFrameSkinAt(this.sprite, this.state);
                }
                hasNext() {
                    const frame = this.sprite.frames[Particle.defaultFrameName];
                    return this.state < frame.length - 1;
                }
                static getFrameSkinAt(sprite, index) {
                    const frame = sprite.frames[Particle.defaultFrameName];
                    return frame[index % frame.length];
                }
            };
            exports_19("Particle", Particle);
            Particle.defaultFrameName = 'particle';
        }
    };
});
System.register("engine/Level", [], function (exports_20, context_20) {
    "use strict";
    var Level;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            Level = class Level {
                constructor(id, objects, tiles) {
                    this.id = id;
                    this.objects = objects;
                    this.tiles = tiles;
                    this.blockedLayer = [];
                    this.transparencyLayer = [];
                    this.lightLayer = [];
                    this.lightColorLayer = [];
                    this.weatherTicks = 0;
                    this.temperatureTicks = 0;
                    this.temperatureLayer = [];
                    this.moistureLayer = [];
                    this.weatherParticles = [];
                    this.weatherLayer = [];
                    this.cloudLayer = [];
                    this.roofLayer = [];
                    this.roofHolesLayer = [];
                    this.weatherType = 'normal';
                    this.isWindy = true; // TODO: remove and use wind.
                    this.wind = [1, 1];
                    this.windTicks = 0;
                    this.ambientLightColor = [255, 255, 255];
                    this.portals = {};
                    this.height = tiles.length;
                    this.width = this.height > 0 ? tiles[0].length : 0;
                    for (const object of objects) {
                        object.bindToLevel(this);
                    }
                }
                update(ticks) {
                    this.weatherTicks += ticks;
                    this.windTicks += ticks;
                    this.temperatureTicks += ticks;
                }
            };
            exports_20("Level", Level);
        }
    };
});
System.register("engine/Camera", [], function (exports_21, context_21) {
    "use strict";
    var followOffset, Camera;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            followOffset = 4;
            Camera = class Camera {
                constructor() {
                    this.position = {
                        left: 0,
                        top: 0,
                    };
                    this.size = {
                        width: 20,
                        height: 20,
                    };
                    this.npc = null;
                    this.level = null;
                }
                follow(npc, level) {
                    this.npc = npc;
                    this.level = level;
                }
                update() {
                    if (this.npc && this.level) {
                        const cameraRight = this.position.left + this.size.width - 1;
                        const cameraBottom = this.position.top + this.size.height - 1;
                        const leftRel = this.npc.position[0] - this.position.left;
                        if (leftRel < followOffset) {
                            this.position.left = Math.max(0, this.npc.position[0] - followOffset);
                        }
                        const topRel = this.npc.position[1] - this.position.top;
                        if (topRel < followOffset) {
                            this.position.top = Math.max(0, this.npc.position[1] - followOffset);
                        }
                        const rightRel = cameraRight - this.npc.position[0];
                        if (rightRel < followOffset) {
                            this.position.left = Math.min(this.level.width - this.size.width, this.npc.position[0] - (this.size.width - 1) + followOffset);
                        }
                        const bottomRel = cameraBottom - this.npc.position[1];
                        if (bottomRel < followOffset) {
                            this.position.top = Math.min(this.level.height - this.size.height, this.npc.position[1] - (this.size.height - 1) + followOffset);
                        }
                        if (cameraRight > this.level.width) {
                            this.position.left = this.level.width - this.size.width;
                        }
                        if (cameraBottom > this.level.height) {
                            this.position.top = this.level.height - this.size.height;
                        }
                    }
                }
            };
            exports_21("Camera", Camera);
        }
    };
});
System.register("engine/graphics/GraphicsEngine", ["engine/graphics/Cell", "engine/objects/Npc"], function (exports_22, context_22) {
    "use strict";
    var Cell_1, Npc_1, GraphicsEngine, cellStyle, emptyCollisionChar;
    var __moduleName = context_22 && context_22.id;
    function drawObjects(ctx, camera, objects) {
        const importantObjects = objects.filter(x => x.important);
        for (const object of objects) {
            if (!object.enabled) {
                continue;
            }
            drawObject(ctx, camera, object, importantObjects);
            for (const childObject of object.children) {
                drawObject(ctx, camera, childObject, importantObjects);
            }
            // reset object highlight.
            object.highlighted = false;
        }
        // draw cursors
        for (const object of objects) {
            if (!object.enabled) {
                continue;
            }
            if (object instanceof Npc_1.Npc) {
                if (object.equipment.objectInMainHand) {
                    object.equipment.objectInMainHand.highlighted = object.showCursor;
                    object.equipment.objectInMainHand.highlighColor = 'yellow';
                }
            }
        }
    }
    exports_22("drawObjects", drawObjects);
    function drawObjectAt(ctx, camera, obj, position, layerName = "objects") {
        drawObjectSkinAt(ctx, camera, obj.skin, obj.originPoint, position, layerName);
    }
    exports_22("drawObjectAt", drawObjectAt);
    function drawObjectSkinAt(ctx, camera, objSkin, originPoint, position, layerName = "objects") {
        for (let y = 0; y < objSkin.grid.length; y++) {
            for (let x = 0; x < objSkin.grid[y].length; x++) {
                const cell = getCellAt(objSkin, x, y);
                const left = position[0] - originPoint[0] + x;
                const top = position[1] - originPoint[1] + y;
                drawCell(ctx, camera, cell, left, top, undefined, undefined, layerName);
            }
        }
    }
    exports_22("drawObjectSkinAt", drawObjectSkinAt);
    function drawObject(ctx, camera, obj, importantObjects) {
        var _a;
        let showOnlyCollisions = isInFrontOfImportantObject();
        for (let y = 0; y < obj.skin.grid.length; y++) {
            for (let x = 0; x < obj.skin.grid[y].length; x++) {
                const cell = getCellAt(obj.skin, x, y);
                if (cell.isEmpty) {
                    continue;
                }
                const transparent = (showOnlyCollisions && !isCollision(obj, x, y)) ||
                    obj.realm !== ((_a = camera.npc) === null || _a === void 0 ? void 0 : _a.realm);
                const cellBorders = getCellBorders(obj, x, y);
                const [left, top] = [
                    obj.position[0] - obj.originPoint[0] + x,
                    obj.position[1] - obj.originPoint[1] + y
                ];
                const [leftPos, topPos] = [
                    left - camera.position.left,
                    top - camera.position.top
                ];
                drawCell(ctx, camera, cell, leftPos, topPos, transparent, cellBorders);
            }
        }
        function isInFrontOfImportantObject() {
            for (const o of importantObjects) {
                if (isPositionBehindTheObject(obj, o.position[0], o.position[1])) {
                    return true;
                }
            }
            return false;
        }
        function isEmptyCell(object, left, top) {
            if (left < 0 || top < 0)
                return true;
            const grid = object.skin.grid;
            if (top >= grid.length || left >= grid[top].length)
                return true;
            const char = grid[top][left];
            return char === ' ';
        }
        function getCellBorders(obj, x, y) {
            return obj.highlighted
                ? [
                    isEmptyCell(obj, x + 0, y - 1) ? obj.highlighColor : null,
                    isEmptyCell(obj, x + 1, y + 0) ? obj.highlighColor : null,
                    isEmptyCell(obj, x + 0, y + 1) ? obj.highlighColor : null,
                    isEmptyCell(obj, x - 1, y + 0) ? obj.highlighColor : null,
                ]
                : [];
        }
    }
    function getCellAt(skin, x, y) {
        const cellColor = (skin.raw_colors[y] && skin.raw_colors[y][x]) || [undefined, 'transparent'];
        const char = skin.grid[y][x];
        const cell = new Cell_1.Cell(char, cellColor[0], cellColor[1]);
        return cell;
    }
    exports_22("getCellAt", getCellAt);
    function isCollision(object, left, top) {
        const cchar = (object.physics.collisions[top] && object.physics.collisions[top][left]) || emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    exports_22("isCollision", isCollision);
    function isPositionBehindTheObject(object, left, top) {
        const pleft = left - object.position[0] + object.originPoint[0];
        const ptop = top - object.position[1] + object.originPoint[1];
        // check collisions
        if (isCollision(object, ptop, pleft))
            return false;
        // check characters skin
        const cchar = (object.skin.grid[ptop] && object.skin.grid[ptop][pleft]) || emptyCollisionChar;
        // check color skin
        const color = (object.skin.raw_colors[ptop] && object.skin.raw_colors[ptop][pleft]) || [undefined, undefined];
        return cchar !== emptyCollisionChar || !!color[0] || !!color[1];
    }
    exports_22("isPositionBehindTheObject", isPositionBehindTheObject);
    function drawCell(ctx, camera, cell, leftPos, topPos, transparent = false, border = [null, null, null, null], layer = "objects") {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (cell.isEmpty)
            return;
        if (camera) {
            if (leftPos < 0 ||
                topPos < 0 ||
                leftPos >= camera.size.width ||
                topPos >= camera.size.height) {
                return;
            }
        }
        const camX = leftPos + (((_a = camera === null || camera === void 0 ? void 0 : camera.position) === null || _a === void 0 ? void 0 : _a.left) || 0);
        const camY = topPos + (((_b = camera === null || camera === void 0 ? void 0 : camera.position) === null || _b === void 0 ? void 0 : _b.top) || 0);
        if (layer === "objects") {
            if (((_c = camera === null || camera === void 0 ? void 0 : camera.level) === null || _c === void 0 ? void 0 : _c.lightColorLayer) && ((_d = camera === null || camera === void 0 ? void 0 : camera.level) === null || _d === void 0 ? void 0 : _d.lightColorLayer[camY])) {
                const color = (_e = camera === null || camera === void 0 ? void 0 : camera.level) === null || _e === void 0 ? void 0 : _e.lightColorLayer[camY][camX];
                const str = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
                cell.lightColor = str;
            }
            if (((_f = camera === null || camera === void 0 ? void 0 : camera.level) === null || _f === void 0 ? void 0 : _f.lightLayer) && ((_g = camera === null || camera === void 0 ? void 0 : camera.level) === null || _g === void 0 ? void 0 : _g.lightLayer[camY]) && cell.lightIntensity === null) {
                const intensity = (_h = camera === null || camera === void 0 ? void 0 : camera.level) === null || _h === void 0 ? void 0 : _h.lightLayer[camY][camX];
                cell.lightIntensity = intensity;
            }
        }
        ctx.add(layer, [leftPos, topPos], { cell, transparent, border });
    }
    exports_22("drawCell", drawCell);
    function mixColors(colors) {
        const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
        const mixedColor = [
            Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) / totalIntensity | 0),
            Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) / totalIntensity | 0),
            Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) / totalIntensity | 0),
        ];
        return mixedColor;
    }
    exports_22("mixColors", mixColors);
    return {
        setters: [
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_22("GraphicsEngine", GraphicsEngine);
            exports_22("cellStyle", cellStyle = {
                borderColor: "#1114",
                borderWidth: 1,
                default: {
                    textColor: '#fff',
                    backgroundColor: '#335'
                },
                size: {
                    width: 32,
                    height: 32,
                },
                charSize: 26,
            });
            emptyCollisionChar = ' ';
        }
    };
});
System.register("engine/graphics/CanvasContext", ["main", "engine/graphics/GraphicsEngine"], function (exports_23, context_23) {
    "use strict";
    var main_1, GraphicsEngine_1, CanvasContext;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (GraphicsEngine_1_1) {
                GraphicsEngine_1 = GraphicsEngine_1_1;
            }
        ],
        execute: function () {
            // TODO: remove this and draw in GraphicsEngine.
            CanvasContext = class CanvasContext {
                constructor(canvas) {
                    this.canvas = canvas;
                    this.current = [];
                    this.weather = [];
                    this.ui = [];
                    this.buffer = document.createElement("canvas");
                    this.buffer.width = canvas.width;
                    this.buffer.height = canvas.height;
                    this.objectsBuffer = this.createBuffer();
                    this.weatherBuffer = this.createBuffer();
                    this.shadowMaskBuffer = this.createBuffer();
                    this.lightColorBuffer = this.createBuffer();
                    this.uiBuffer = this.createBuffer();
                }
                createBuffer() {
                    const buffer = document.createElement("canvas");
                    buffer.width = this.canvas.width;
                    buffer.height = this.canvas.height;
                    return buffer;
                }
                addTo(grid, [left, top], cellInfo) {
                    if (!grid[top]) {
                        grid[top] = [];
                    }
                    if (!grid[top][left]) {
                        grid[top][left] = [];
                    }
                    grid[top][left].push(cellInfo);
                }
                addToPlain(grid, [left, top], cellInfo) {
                    if (!grid[top]) {
                        grid[top] = [];
                    }
                    grid[top][left] = cellInfo;
                }
                add(layerName, position, cellInfo) {
                    if (layerName === "objects") {
                        this.addTo(this.current, position, cellInfo);
                    }
                    else if (layerName === "weather") {
                        this.addTo(this.weather, position, cellInfo);
                    }
                    else if (layerName === "ui") {
                        this.addTo(this.ui, position, cellInfo);
                    }
                }
                draw() {
                    var _a, _b, _c;
                    this._context = this.buffer.getContext("2d");
                    this._objectsContext = this.objectsBuffer.getContext("2d");
                    this._weatherContext = this.weatherBuffer.getContext("2d");
                    this._shadowMaskContext = this.shadowMaskBuffer.getContext("2d");
                    this._lightColorContext = this.lightColorBuffer.getContext("2d");
                    this._uiContext = this.uiBuffer.getContext("2d");
                    this._context.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._objectsContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._weatherContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._shadowMaskContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._lightColorContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._uiContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    for (let y = 0; y < this.current.length; y++) {
                        for (let x = 0; x < this.current[y].length; x++) {
                            for (let c of this.current[y][x]) {
                                this.drawCellInfo(y, x, c);
                            }
                            for (const c of ((_a = this.weather[y]) === null || _a === void 0 ? void 0 : _a[x]) || []) {
                                this.drawCellInfoOn(this._weatherContext, [x, y], c);
                            }
                            for (const c of ((_b = this.ui[y]) === null || _b === void 0 ? void 0 : _b[x]) || []) {
                                this.drawCellInfoOn(this._uiContext, [x, y], c);
                            }
                            const maxIntensity = Math.max(...this.current[y][x].map(x => x.cell.lightIntensity || 0));
                            // Draw shadows.
                            if (this._shadowMaskContext) {
                                const left = main_1.leftPad + x * GraphicsEngine_1.cellStyle.size.width;
                                const top = main_1.topPad + y * GraphicsEngine_1.cellStyle.size.height;
                                const v = (maxIntensity).toString(16);
                                this._shadowMaskContext.fillStyle = `#${v}${v}${v}`;
                                this._shadowMaskContext.fillRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                            }
                        }
                    }
                    const ctx = this._context;
                    // TODO: add physical material reflectiveness. Try with black reflective tiles. 
                    ctx.globalCompositeOperation = "source-over"; // multiply | overlay | luminosity
                    ctx.drawImage(this.objectsBuffer, 0, 0);
                    ctx.drawImage(this.weatherBuffer, 0, 0);
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(this.shadowMaskBuffer, 0, 0);
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(this.lightColorBuffer, 0, 0);
                    ctx.globalCompositeOperation = "source-over";
                    ctx.drawImage(this.uiBuffer, 0, 0);
                    (_c = this.canvas.getContext("2d")) === null || _c === void 0 ? void 0 : _c.drawImage(this.buffer, 0, 0);
                    // Clear grid layers.
                    this.current = [];
                    this.weather = [];
                    this.ui = [];
                }
                drawCellInfoOn(ctx, [leftPos, topPos], cellInfo) {
                    const left = main_1.leftPad + leftPos * GraphicsEngine_1.cellStyle.size.width;
                    const top = main_1.topPad + topPos * GraphicsEngine_1.cellStyle.size.height;
                    //
                    ctx.globalAlpha = cellInfo.transparent ? 0.2 : 1;
                    ctx.fillStyle = cellInfo.cell.backgroundColor;
                    ctx.fillRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                    ctx.font = `${GraphicsEngine_1.cellStyle.charSize}px monospace`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    // ctx.globalAlpha = 1;
                    ctx.fillStyle = cellInfo.cell.textColor;
                    ctx.fillText(cellInfo.cell.character, left + GraphicsEngine_1.cellStyle.size.width / 2, top + GraphicsEngine_1.cellStyle.size.height / 2 + 2);
                    if (GraphicsEngine_1.cellStyle.borderWidth > 0) {
                        ctx.strokeStyle = GraphicsEngine_1.cellStyle.borderColor;
                        ctx.lineWidth = GraphicsEngine_1.cellStyle.borderWidth;
                        // palette borders
                        ctx.strokeRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                    }
                    // cell borders
                    addObjectBorders();
                    function addObjectBorders() {
                        const borderWidth = 2;
                        ctx.lineWidth = borderWidth;
                        ctx.globalAlpha = cellInfo.transparent ? 0.3 : 0.6;
                        if (cellInfo.border[0]) {
                            ctx.strokeStyle = cellInfo.border[0];
                            ctx.strokeRect(left + 1, top + 1, GraphicsEngine_1.cellStyle.size.width - 2, 0);
                        }
                        if (cellInfo.border[1]) {
                            ctx.strokeStyle = cellInfo.border[1];
                            ctx.strokeRect(left + GraphicsEngine_1.cellStyle.size.width - 1, top + 1, 0, GraphicsEngine_1.cellStyle.size.height - 2);
                        }
                        if (cellInfo.border[2]) {
                            ctx.strokeStyle = cellInfo.border[2];
                            ctx.strokeRect(left + 1, top + GraphicsEngine_1.cellStyle.size.height - 1, GraphicsEngine_1.cellStyle.size.width - 2, 0);
                        }
                        if (cellInfo.border[3]) {
                            ctx.strokeStyle = cellInfo.border[3];
                            ctx.strokeRect(left + 1, top + 1, 0, GraphicsEngine_1.cellStyle.size.height - 2);
                        }
                    }
                }
                drawCellInfo(topPos, leftPos, cellInfo) {
                    const ctx = this._objectsContext;
                    this.drawCellInfoOn(ctx, [leftPos, topPos], cellInfo);
                    //
                    const left = main_1.leftPad + leftPos * GraphicsEngine_1.cellStyle.size.width;
                    const top = main_1.topPad + topPos * GraphicsEngine_1.cellStyle.size.height;
                    //
                    // Draw light colors.
                    if (this._lightColorContext) {
                        this._lightColorContext.fillStyle = cellInfo.cell.lightColor;
                        this._lightColorContext.fillRect(left, top, GraphicsEngine_1.cellStyle.size.width, GraphicsEngine_1.cellStyle.size.height);
                    }
                }
            };
            exports_23("CanvasContext", CanvasContext);
        }
    };
});
System.register("engine/objects/Inventory", [], function (exports_24, context_24) {
    "use strict";
    var Inventory;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [],
        execute: function () {
            Inventory = class Inventory {
                constructor() {
                    this.items = [];
                }
                addItems(newItems) {
                    for (const newItem of newItems) {
                        this.items.push(newItem);
                    }
                }
            };
            exports_24("Inventory", Inventory);
        }
    };
});
System.register("engine/objects/SceneObject", ["engine/objects/Inventory"], function (exports_25, context_25) {
    "use strict";
    var Inventory_1, SceneObject;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (Inventory_1_1) {
                Inventory_1 = Inventory_1_1;
            }
        ],
        execute: function () {
            SceneObject = class SceneObject {
                get children() {
                    return [];
                }
                get position() {
                    var _a, _b;
                    return [
                        (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.position[0]) || 0) + this._position[0],
                        (((_b = this.parent) === null || _b === void 0 ? void 0 : _b.position[1]) || 0) + this._position[1]
                    ];
                }
                set position(value) {
                    if (this.position[0] !== value[0] || this.position[1] !== value[1]) {
                        this._position = [...value];
                        this.onMoved();
                    }
                }
                get level() {
                    return this._level;
                }
                set level(value) {
                    if (this._level !== value) {
                        this._level = value;
                        this.onMoved();
                    }
                }
                constructor(originPoint, skin, physics, _position) {
                    this.originPoint = originPoint;
                    this.skin = skin;
                    this.physics = physics;
                    this._position = _position;
                    this._level = null;
                    this.scene = null;
                    this.parent = null;
                    this.type = "<undefined_item>";
                    this.enabled = true;
                    this.highlighted = false;
                    this.highlighColor = '#0ff';
                    this.important = false;
                    this.parameters = {};
                    this.actions = [];
                    this.inventory = new Inventory_1.Inventory();
                    this.realm = "ground";
                    this.ticks = 0;
                    //
                }
                bindToLevel(level) {
                    this.level = level;
                }
                // When physical location or orientation changed.
                onMoved() {
                }
                setAction(arg) {
                    if (typeof arg === "function") {
                        this.setAction({ action: arg });
                        return;
                    }
                    const options = arg;
                    if (options) {
                        const type = options.type || "interaction";
                        // There can be only one usage action.
                        if (type === "usage" && this.actions.find(x => x.type === "usage")) {
                            throw new Error(`Object '${this.type}' already has registered '${type}' action.`);
                        }
                        const position = options.position || [0, 0];
                        const iconPosition = options.iconPosition || position;
                        this.actions.push({
                            type,
                            position,
                            callback: options.action,
                            iconPosition,
                        });
                    }
                }
                handleEvent(ev) { }
                update(ticks, scene) {
                    this.ticks += ticks;
                }
            };
            exports_25("SceneObject", SceneObject);
        }
    };
});
System.register("utils/layer", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    function fillLayer(layer, width, height, defaultValue) {
        for (let y = 0; y < height; y++) {
            if (!layer[y])
                layer[y] = [];
            for (let x = 0; x < width; x++) {
                if (!layer[y][x])
                    layer[y][x] = defaultValue;
            }
        }
    }
    exports_26("fillLayer", fillLayer);
    function forLayerOf(layer, iteration, defaultValue) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer[y][x] || defaultValue);
            }
        }
    }
    exports_26("forLayerOf", forLayerOf);
    function forLayer(layer, iteration) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer, x, y);
            }
        }
    }
    exports_26("forLayer", forLayer);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/Performance", [], function (exports_27, context_27) {
    "use strict";
    var Performance;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
            Performance = class Performance {
                constructor() {
                    this.stats = {};
                    this.item = null;
                }
                measure(f) {
                    this.start(f.name);
                    f();
                    this.stop();
                }
                report() {
                    if (!Performance.enabled) {
                        return;
                    }
                    const important = Object.entries(this.stats).filter(x => x[1].time > 0);
                    for (const [name, stat] of important) {
                        console.log({ name, time: stat.time });
                    }
                }
                start(name) {
                    this.item = { name, startTime: new Date() };
                }
                stop() {
                    if (!this.item) {
                        return;
                    }
                    this.stats[this.item.name] = { time: new Date().getMilliseconds() - this.item.startTime.getMilliseconds() };
                }
            };
            exports_27("Performance", Performance);
            Performance.enabled = false;
        }
    };
});
System.register("world/events/TransferItemsGameEvent", ["engine/events/GameEvent"], function (exports_28, context_28) {
    "use strict";
    var GameEvent_2, TransferItemsGameEvent;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            }
        ],
        execute: function () {
            (function (TransferItemsGameEvent) {
                TransferItemsGameEvent.type = "transfer_items";
                class Args {
                }
                TransferItemsGameEvent.Args = Args;
                function create(recipient, items) {
                    return new GameEvent_2.GameEvent(recipient, TransferItemsGameEvent.type, {
                        recipient,
                        items,
                    });
                }
                TransferItemsGameEvent.create = create;
            })(TransferItemsGameEvent || (exports_28("TransferItemsGameEvent", TransferItemsGameEvent = {})));
        }
    };
});
System.register("world/events/SwitchGameModeGameEvent", ["engine/events/GameEvent"], function (exports_29, context_29) {
    "use strict";
    var GameEvent_3, SwitchGameModeGameEvent;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            }
        ],
        execute: function () {
            (function (SwitchGameModeGameEvent) {
                SwitchGameModeGameEvent.type = "switch_mode";
                class Args {
                }
                SwitchGameModeGameEvent.Args = Args;
                function create(from, to) {
                    return new GameEvent_3.GameEvent("system", SwitchGameModeGameEvent.type, { from, to });
                }
                SwitchGameModeGameEvent.create = create;
            })(SwitchGameModeGameEvent || (exports_29("SwitchGameModeGameEvent", SwitchGameModeGameEvent = {})));
        }
    };
});
System.register("world/events/RemoveObjectGameEvent", ["engine/events/GameEvent"], function (exports_30, context_30) {
    "use strict";
    var GameEvent_4, RemoveObjectGameEvent;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            }
        ],
        execute: function () {
            (function (RemoveObjectGameEvent) {
                RemoveObjectGameEvent.type = "remove_object";
                class Args {
                }
                RemoveObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_4.GameEvent("system", RemoveObjectGameEvent.type, { object });
                }
                RemoveObjectGameEvent.create = create;
            })(RemoveObjectGameEvent || (exports_30("RemoveObjectGameEvent", RemoveObjectGameEvent = {})));
        }
    };
});
System.register("world/events/AddObjectGameEvent", ["engine/events/GameEvent"], function (exports_31, context_31) {
    "use strict";
    var GameEvent_5, AddObjectGameEvent;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (GameEvent_5_1) {
                GameEvent_5 = GameEvent_5_1;
            }
        ],
        execute: function () {
            (function (AddObjectGameEvent) {
                AddObjectGameEvent.type = "add_object";
                class Args {
                }
                AddObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_5.GameEvent("system", AddObjectGameEvent.type, { object });
                }
                AddObjectGameEvent.create = create;
            })(AddObjectGameEvent || (exports_31("AddObjectGameEvent", AddObjectGameEvent = {})));
        }
    };
});
System.register("engine/ActionData", ["engine/graphics/Cell"], function (exports_32, context_32) {
    "use strict";
    var Cell_2;
    var __moduleName = context_32 && context_32.id;
    function convertToActionData(object, objectAction) {
        const [ileft, itop] = objectAction.iconPosition;
        const actionIconChar = object.skin.grid[itop][ileft];
        const [fgColor, bgColor] = object.skin.raw_colors[itop] ? (object.skin.raw_colors[itop][ileft] || []) : [];
        const actionIcon = new Cell_2.Cell(actionIconChar, fgColor, bgColor);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon };
    }
    exports_32("convertToActionData", convertToActionData);
    function getNpcInteraction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
    }
    exports_32("getNpcInteraction", getNpcInteraction);
    function getNpcCollisionAction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
    }
    exports_32("getNpcCollisionAction", getNpcCollisionAction);
    function getItemUsageAction(item) {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }
        // This is a default usage action.
        const defaultAction = interactions[0];
        return convertToActionData(item, defaultAction);
    }
    exports_32("getItemUsageAction", getItemUsageAction);
    return {
        setters: [
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/sprites/snowFlakeSprite", ["engine/data/Sprite"], function (exports_33, context_33) {
    "use strict";
    var Sprite_1, snowFlakeSpriteRaw, snowFlakeSprite;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            }
        ],
        execute: function () {
            exports_33("snowFlakeSpriteRaw", snowFlakeSpriteRaw = `width:1
height:1
name:
empty:'
color:S,#fff9,transparent

particle
❆❅✶•·.
SSSSSS`);
            exports_33("snowFlakeSprite", snowFlakeSprite = Sprite_1.Sprite.parse(snowFlakeSpriteRaw));
        }
    };
});
System.register("world/sprites/mistSprite", ["engine/data/Sprite"], function (exports_34, context_34) {
    "use strict";
    var Sprite_2, mistSpriteRaw, mistSprite;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (Sprite_2_1) {
                Sprite_2 = Sprite_2_1;
            }
        ],
        execute: function () {
            mistSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#fff6
color:T,transparent,#fff4
color:Y,transparent,#fff2

particle
''''''''''
YTRRRRRTTY`;
            exports_34("mistSprite", mistSprite = Sprite_2.Sprite.parse(mistSpriteRaw));
        }
    };
});
System.register("world/sprites/rainDropSprite", ["engine/data/Sprite"], function (exports_35, context_35) {
    "use strict";
    var Sprite_3, rainDropSpriteRaw, rainDropSprite;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (Sprite_3_1) {
                Sprite_3 = Sprite_3_1;
            }
        ],
        execute: function () {
            rainDropSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0ff9,transparent

particle
ᣟ˙·.
RRRR`;
            exports_35("rainDropSprite", rainDropSprite = Sprite_3.Sprite.parse(rainDropSpriteRaw));
        }
    };
});
System.register("engine/Scene", ["engine/graphics/Cell", "engine/events/EventLoop", "engine/graphics/GraphicsEngine", "engine/objects/Npc", "engine/Camera", "utils/layer", "engine/Performance", "world/events/TransferItemsGameEvent", "world/events/SwitchGameModeGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent", "utils/misc", "engine/ActionData", "engine/objects/Particle", "world/sprites/snowFlakeSprite", "world/sprites/mistSprite", "world/sprites/rainDropSprite"], function (exports_36, context_36) {
    "use strict";
    var Cell_3, EventLoop_2, GraphicsEngine_2, Npc_2, Camera_1, utils, Performance_1, TransferItemsGameEvent_1, SwitchGameModeGameEvent_1, RemoveObjectGameEvent_1, AddObjectGameEvent_1, misc_2, ActionData_1, Particle_1, snowFlakeSprite_1, mistSprite_1, rainDropSprite_1, defaultLightLevelAtNight, defaultLightLevelAtDay, defaultTemperatureAtNight, defaultTemperatureAtDay, defaultMoisture, voidCell, Scene;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GraphicsEngine_2_1) {
                GraphicsEngine_2 = GraphicsEngine_2_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (utils_1) {
                utils = utils_1;
            },
            function (Performance_1_1) {
                Performance_1 = Performance_1_1;
            },
            function (TransferItemsGameEvent_1_1) {
                TransferItemsGameEvent_1 = TransferItemsGameEvent_1_1;
            },
            function (SwitchGameModeGameEvent_1_1) {
                SwitchGameModeGameEvent_1 = SwitchGameModeGameEvent_1_1;
            },
            function (RemoveObjectGameEvent_1_1) {
                RemoveObjectGameEvent_1 = RemoveObjectGameEvent_1_1;
            },
            function (AddObjectGameEvent_1_1) {
                AddObjectGameEvent_1 = AddObjectGameEvent_1_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (ActionData_1_1) {
                ActionData_1 = ActionData_1_1;
            },
            function (Particle_1_1) {
                Particle_1 = Particle_1_1;
            },
            function (snowFlakeSprite_1_1) {
                snowFlakeSprite_1 = snowFlakeSprite_1_1;
            },
            function (mistSprite_1_1) {
                mistSprite_1 = mistSprite_1_1;
            },
            function (rainDropSprite_1_1) {
                rainDropSprite_1 = rainDropSprite_1_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            defaultLightLevelAtDay = 15;
            defaultTemperatureAtNight = 4; // @todo depends on biome.
            defaultTemperatureAtDay = 7; // @todo depends on biome.
            defaultMoisture = 5; // @todo depends on biome.
            voidCell = new Cell_3.Cell(' ', 'transparent', 'black');
            Scene = class Scene {
                constructor() {
                    this.camera = new Camera_1.Camera();
                    this.gameTime = 0;
                    this.ticksPerDay = 120000;
                    this.globalLightLevel = 0;
                    this.globalTemperature = 7;
                    this.globalMoisture = defaultMoisture;
                    this.debugDrawTemperatures = false;
                    this.debugDrawMoisture = false;
                    this.debugDrawBlockedCells = false;
                    this.debugDisableGameTime = false;
                }
                get objects() {
                    var _a;
                    return ((_a = this.level) === null || _a === void 0 ? void 0 : _a.objects) || [];
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_2.emitEvent(SwitchGameModeGameEvent_1.SwitchGameModeGameEvent.create("scene", "dialog"));
                    }
                    else if (ev.type === AddObjectGameEvent_1.AddObjectGameEvent.type) {
                        const args = ev.args;
                        this.addLevelObject(args.object);
                        console.log(`${args.object.type} added to the scene.`);
                    }
                    else if (ev.type === RemoveObjectGameEvent_1.RemoveObjectGameEvent.type) {
                        const args = ev.args;
                        this.removeLevelObject(args.object);
                        console.log(`${args.object.type} removed from scene.`);
                    }
                    else if (ev.type === TransferItemsGameEvent_1.TransferItemsGameEvent.type) {
                        const args = ev.args;
                        args.recipient.inventory.addItems(args.items);
                        console.log(`${args.recipient.type} received ${args.items.length} items.`);
                    }
                }
                update(ticks) {
                    var _a, _b, _c;
                    const scene = this;
                    if (!this.debugDisableGameTime) {
                        this.gameTime += ticks;
                    }
                    (_a = this.level) === null || _a === void 0 ? void 0 : _a.update(ticks);
                    const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
                    // 0.125 (1/8) so the least amount of sunlight is at 03:00
                    const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
                    scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight));
                    scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));
                    //console.log({sunlightPercent});
                    const perf = new Performance_1.Performance();
                    // update all tiles
                    for (const tile of ((_c = (_b = scene.level) === null || _b === void 0 ? void 0 : _b.tiles) === null || _c === void 0 ? void 0 : _c.flat()) || []) {
                        tile.update(ticks, scene);
                    }
                    // update all enabled objects
                    for (const obj of scene.objects) {
                        if (!obj.enabled)
                            continue;
                        obj.update(ticks, scene);
                    }
                    this.camera.update();
                    perf.measure(updateBlocked);
                    perf.measure(updateTransparency);
                    perf.measure(updateLights);
                    perf.measure(updateWeather);
                    perf.measure(updateTemperature);
                    perf.measure(updateMoisture);
                    perf.report();
                    function updateBlocked() {
                        const blockedLayer = [];
                        fillLayer(blockedLayer, false);
                        for (const object of scene.objects) {
                            if (!object.enabled)
                                continue;
                            for (let y = 0; y < object.physics.collisions.length; y++) {
                                for (let x = 0; x < object.physics.collisions[y].length; x++) {
                                    if ((object.physics.collisions[y][x] || ' ') === ' ')
                                        continue;
                                    const left = object.position[0] - object.originPoint[0] + x;
                                    const top = object.position[1] - object.originPoint[1] + y;
                                    if (!scene.isPositionValid([left, top]))
                                        continue;
                                    blockedLayer[top][left] = true;
                                }
                            }
                        }
                        if (scene.level) {
                            scene.level.blockedLayer = blockedLayer;
                        }
                    }
                    function updateTransparency() {
                        const transparencyLayer = [];
                        fillLayer(transparencyLayer, 0);
                        for (const object of scene.objects) {
                            if (!object.enabled)
                                continue;
                            const objectLayer = object.physics.transparency;
                            for (let y = 0; y < objectLayer.length; y++) {
                                for (let x = 0; x < objectLayer[y].length; x++) {
                                    const char = objectLayer[y][x] || '0';
                                    const value = Number.parseInt(char, 16);
                                    if (value === 0)
                                        continue;
                                    const left = object.position[0] - object.originPoint[0] + x;
                                    const top = object.position[1] - object.originPoint[1] + y;
                                    if (!scene.isPositionValid([left, top]))
                                        continue;
                                    transparencyLayer[top][left] = value;
                                }
                            }
                        }
                        if (scene.level) {
                            scene.level.transparencyLayer = transparencyLayer;
                        }
                    }
                    function getSkyTransparency() {
                        var _a;
                        switch ((_a = scene.level) === null || _a === void 0 ? void 0 : _a.weatherType) {
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
                        if (!scene.level) {
                            return;
                        }
                        scene.level.cloudLayer = [];
                        fillLayer(scene.level.cloudLayer, 15 - Math.round(15 * getSkyTransparency()) | 0);
                        const weatherType = scene.level.weatherType;
                        if (weatherType == 'heavy_mist') {
                            // Update heavy mist instantly to sync with light changes.
                            updateWeatherLayer();
                            scene.level.weatherTicks = 0;
                            return;
                        }
                        const weatherTicksOverflow = scene.level.weatherTicks - 300;
                        if (weatherTicksOverflow >= 0) {
                            updateWeatherLayer();
                            scene.level.weatherTicks = weatherTicksOverflow;
                        }
                        const windTicksOverflow = scene.level.windTicks - 1000;
                        if (windTicksOverflow >= 0) {
                            updateWeatherWind();
                            scene.level.windTicks = windTicksOverflow;
                        }
                        function updateWeatherLayer() {
                            scene.level.weatherLayer = [];
                            const roofHoles = scene.level.roofHolesLayer;
                            for (let y = 0; y < scene.camera.size.height; y++) {
                                for (let x = 0; x < scene.camera.size.width; x++) {
                                    const top = y + scene.camera.position.top;
                                    const left = x + scene.camera.position.left;
                                    let roofHoleVal = (roofHoles[top] && roofHoles[top][left]);
                                    if (typeof roofHoleVal === "undefined")
                                        roofHoleVal = true;
                                    if (!roofHoleVal && weatherType !== 'mist' && weatherType !== 'heavy_mist')
                                        continue;
                                    const cell = createCell([x, y]);
                                    if (!cell)
                                        continue;
                                    addCell(cell, x, y);
                                }
                            }
                            function getParticleCellAt([x, y]) {
                                var _a;
                                const existingParticle = (_a = scene.level.weatherParticles[y]) === null || _a === void 0 ? void 0 : _a[x];
                                if (!existingParticle) {
                                    return undefined;
                                }
                                return GraphicsEngine_2.getCellAt(existingParticle.skin, 0, 0);
                            }
                            function addCell(cell, x, y) {
                                if (!scene.level.weatherLayer[y])
                                    scene.level.weatherLayer[y] = [];
                                scene.level.weatherLayer[y][x] = cell;
                            }
                            function createCell([x, y]) {
                                var _a;
                                if (weatherType === 'heavy_mist') {
                                    return createHeavyMistCell([x, y]);
                                }
                                else {
                                    const existingParticle = (_a = scene.level.weatherParticles[y]) === null || _a === void 0 ? void 0 : _a[x];
                                    if (existingParticle && existingParticle.hasNext()) {
                                        existingParticle.next();
                                    }
                                    else {
                                        if (!scene.level.weatherParticles[y]) {
                                            scene.level.weatherParticles[y] = [];
                                        }
                                        const particle = createParticle([x, y]);
                                        scene.level.weatherParticles[y][x] = particle;
                                    }
                                    return getParticleCellAt([x, y]);
                                }
                            }
                            function createHeavyMistCell(p) {
                                var _a, _b;
                                const pos = ((_a = scene.camera.npc) === null || _a === void 0 ? void 0 : _a.position) || [0, 0];
                                const pos2 = [
                                    pos[0] - scene.camera.position.left,
                                    pos[1] - scene.camera.position.top,
                                ];
                                const distance = misc_2.distanceTo(pos2, p);
                                const fullVisibilityRange = 1;
                                const koef = 2.5;
                                if (distance >= fullVisibilityRange) {
                                    const ambientLightIntensity = Math.max(0, ((_b = scene.level.lightLayer[p[1]]) === null || _b === void 0 ? void 0 : _b[p[0]]) || 0);
                                    const mistTransparency = Math.min((distance * koef | 0) - fullVisibilityRange, 15);
                                    const heavyMistColor = [ambientLightIntensity, ambientLightIntensity, ambientLightIntensity, mistTransparency]
                                        .map(x => x.toString(16))
                                        .reduce((a, x) => a += x, '');
                                    return new Cell_3.Cell(' ', 'transparent', `#${heavyMistColor}`);
                                }
                                return undefined;
                            }
                        }
                        function createParticle(p) {
                            const state = 0; // TODO: random/large state is not working.
                            if (weatherType === 'rain') {
                                const probability = 0.05;
                                return (Math.random() / probability | 0) === 0
                                    ? new Particle_1.Particle(rainDropSprite_1.rainDropSprite, p, state)
                                    : undefined;
                            }
                            else if (weatherType === "snow") {
                                const probability = 0.05;
                                return (Math.random() / probability | 0) === 0
                                    ? new Particle_1.Particle(snowFlakeSprite_1.snowFlakeSprite, p, state)
                                    : undefined;
                            }
                            else if (weatherType === "rain_and_snow") {
                                const probability = 0.1;
                                const r = Math.random() / probability | 0;
                                return r === 0
                                    ? new Particle_1.Particle(rainDropSprite_1.rainDropSprite, p, state)
                                    : (r === 1 ? new Particle_1.Particle(snowFlakeSprite_1.snowFlakeSprite, p, state) : undefined);
                            }
                            else if (weatherType === "mist") {
                                const probability = 0.1;
                                return (Math.random() / probability | 0) === 0
                                    ? new Particle_1.Particle(mistSprite_1.mistSprite, p, state)
                                    : undefined;
                            }
                            return undefined;
                        }
                        function updateWeatherWind() {
                            const width = scene.camera.size.width;
                            if (scene.level.wind[1] > 0) {
                                // TODO: implement wind intensity.
                                scene.level.weatherParticles.unshift(Array(width).map((_, x) => createParticle([x, 0])));
                            }
                            if (scene.level.wind[0] > 0) {
                                // TODO: implement wind intensity.
                                for (let y = 0; y < scene.level.weatherParticles.length; y++) {
                                    scene.level.weatherParticles[y].unshift(createParticle([0, y]));
                                }
                            }
                        }
                    }
                    function updateLights() {
                        if (!scene.level) {
                            return;
                        }
                        // clear
                        scene.level.lightLayer = [];
                        fillLayer(scene.level.lightLayer, 0);
                        scene.level.lightColorLayer = [];
                        fillLayer(scene.level.lightColorLayer, null);
                        const ambientLayer = [];
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
                                if (cellLightLevel === 0) {
                                    continue;
                                }
                                const position = [x, y];
                                addEmitter(ambientLayer, position, cellLightLevel);
                                spreadPoint(ambientLayer, position, 0);
                            }
                        }
                        const lightLayers = [];
                        lightLayers.push({ lights: ambientLayer, color: scene.level.ambientLightColor, });
                        const lightObjects = [...scene.objects];
                        for (const obj of lightObjects) {
                            if (!obj.enabled)
                                continue;
                            lightLayers.push(...getObjectLightLayers(obj));
                            for (const child of obj.children) {
                                lightLayers.push(...getObjectLightLayers(child));
                            }
                        }
                        mergeLightLayers(lightLayers);
                    }
                    function getObjectLightLayers(obj) {
                        const lightLayers = [];
                        for (const [top, string] of obj.physics.lights.entries()) {
                            for (let [left, char] of string.split('').entries()) {
                                const light = getLightIntensityAndColor(obj, char);
                                if (light.intensity === 0) {
                                    continue;
                                }
                                const position = [
                                    obj.position[0] - obj.originPoint[0] + left,
                                    obj.position[1] - obj.originPoint[1] + top
                                ];
                                if (!scene.isPositionValid(position)) {
                                    continue;
                                }
                                const layer = [];
                                fillLayer(layer, 0);
                                addEmitter(layer, position, light.intensity);
                                spreadPoint(layer, position, 0);
                                lightLayers.push({ lights: layer, color: light.color });
                            }
                        }
                        return lightLayers;
                    }
                    function getLightIntensityAndColor(obj, char) {
                        let color = [255, 255, 255];
                        if (obj.physics.lightsMap) {
                            const record = obj.physics.lightsMap[char];
                            char = record.intensity;
                            color = record.color;
                        }
                        const lightLevel = Number.parseInt(char, 16);
                        return { intensity: lightLevel, color: color };
                    }
                    function mergeLightLayers(lightLayers) {
                        if (!lightLayers.length) {
                            return;
                        }
                        for (let y = 0; y < scene.level.lightLayer.length; y++) {
                            for (let x = 0; x < scene.level.lightLayer[y].length; x++) {
                                const colors = lightLayers
                                    .map(layer => ({ color: layer.color, intensity: layer.lights[y][x] }))
                                    .filter(x => x.color && x.intensity);
                                const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;
                                //const intensity = Math.max(...colors.map(x => x.intensity));
                                scene.level.lightLayer[y][x] = Math.min(15, Math.max(0, intensity));
                                scene.level.lightColorLayer[y][x] = GraphicsEngine_2.mixColors(colors);
                            }
                        }
                    }
                    function updateTemperature() {
                        if (!scene.level) {
                            return;
                        }
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
                            const temperatureObjects = [...scene.objects];
                            for (const obj of temperatureObjects) {
                                if (!obj.enabled)
                                    continue;
                                addObjectTemperature(obj);
                                for (const child of obj.children) {
                                    addObjectTemperature(child);
                                }
                            }
                            var newTemperatureLayer = [];
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
                    function addObjectTemperature(obj) {
                        for (const [top, string] of obj.physics.temperatures.entries()) {
                            for (const [left, char] of string.split('').entries()) {
                                const temperature = Number.parseInt(char, 16);
                                const aleft = obj.position[0] - obj.originPoint[0] + left;
                                const atop = obj.position[1] - obj.originPoint[1] + top;
                                const position = [aleft, atop];
                                if (!scene.isPositionValid(position)) {
                                    continue;
                                }
                                addEmitter(scene.level.temperatureLayer, position, temperature);
                            }
                        }
                    }
                    function fillLayer(layer, defaultValue) {
                        var _a, _b;
                        const width = ((_a = scene.level) === null || _a === void 0 ? void 0 : _a.width) || 0;
                        const height = ((_b = scene.level) === null || _b === void 0 ? void 0 : _b.height) || 0;
                        utils.fillLayer(layer, width, height, defaultValue);
                    }
                    function addEmitter(layer, position, level) {
                        const [left, top] = position;
                        if (layer[top] &&
                            typeof layer[top][left] !== "undefined" &&
                            layer[top][left] < level) {
                            layer[top][left] = level;
                        }
                    }
                    function meanPoint(array, newArray, x, y, speed = 2) {
                        if (!array)
                            return;
                        if (y >= array.length || x >= array[y].length)
                            return;
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
                    function spreadPoint(array, position, min, speed = 2) {
                        if (!array)
                            return;
                        const positionTransparency = scene.getPositionTransparency(position);
                        if (positionTransparency === 0)
                            return;
                        const [x, y] = position;
                        if (y >= array.length || x >= array[y].length)
                            return;
                        const level = array[y][x];
                        const originalNextLevel = level - speed;
                        const nextLevel = Math.round(originalNextLevel * positionTransparency) | 0;
                        speed = speed + (originalNextLevel - nextLevel);
                        if (nextLevel <= min)
                            return;
                        for (let j = x - 1; j <= x + 1; j++)
                            for (let i = y - 1; i <= y + 1; i++)
                                if ((j === x || i === y) &&
                                    !(j === x && i === y) &&
                                    (i >= 0 && i < array.length && j >= 0 && j < array[i].length) &&
                                    (array[i][j] < nextLevel)) {
                                    array[i][j] = nextLevel;
                                    const nextPosition = [j, i];
                                    spreadPoint(array, nextPosition, min, speed);
                                }
                    }
                    function updateMoisture() {
                        if (!scene.level) {
                            return;
                        }
                        // @todo check water tiles
                        scene.level.moistureLayer = [];
                        fillLayer(scene.level.moistureLayer, scene.globalMoisture);
                    }
                }
                draw(ctx) {
                    const scene = this;
                    drawTiles();
                    drawSnow();
                    // sort objects by origin point
                    this.level.objects.sort((a, b) => a.position[1] - b.position[1]);
                    GraphicsEngine_2.drawObjects(ctx, this.camera, this.level.objects);
                    drawWeather();
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
                        drawLayer(scene.level.tiles, cameraTransformation, c => c ? GraphicsEngine_2.getCellAt(c.skin, 0, 0) : voidCell);
                    }
                    function drawSnow() {
                        drawLayer(scene.level.tiles, cameraTransformation, c => getSnowCell((c === null || c === void 0 ? void 0 : c.snowLevel) || 0));
                        function getSnowCell(snowLevel) {
                            if (snowLevel === 0) {
                                return undefined;
                            }
                            return new Cell_3.Cell(' ', undefined, `#fff${(snowLevel * 2).toString(16)}`);
                        }
                    }
                    function drawWeather() {
                        // Currently is linked with camera, not the level.
                        drawLayer(scene.level.weatherLayer, p => p, c => c, "weather");
                    }
                    function drawTemperatures() {
                        drawDebugLayer(scene.level.temperatureLayer);
                    }
                    function drawMoisture() {
                        drawDebugLayer(scene.level.moistureLayer);
                    }
                    function drawBlockedCells() {
                        drawLayer(scene.level.blockedLayer, cameraTransformation, createCell);
                        function createCell(b) {
                            return b === true ? new Cell_3.Cell('⛌', `#f00c`, `#000c`) : undefined;
                        }
                    }
                    function cameraTransformation(position) {
                        const [x, y] = position;
                        const top = scene.camera.position.top + y;
                        const left = scene.camera.position.left + x;
                        return [left, top];
                    }
                    function drawLayer(layer, transformation, cellFactory, layerName = "objects") {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                const [left, top] = transformation([x, y]);
                                const value = (layer[top] && layer[top][left]);
                                const cell = cellFactory(value);
                                if (!cell)
                                    continue;
                                GraphicsEngine_2.drawCell(ctx, scene.camera, cell, x, y, undefined, undefined, layerName);
                            }
                        }
                    }
                    function drawDebugLayer(layer, max = 15) {
                        drawLayer(layer, cameraTransformation, createCell);
                        function createCell(v) {
                            const value = v || 0;
                            return new Cell_3.Cell(value.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max));
                        }
                        function numberToHexColor(val, max = 15) {
                            const intVal = Math.round(val) | 0;
                            const red = Math.floor((intVal / max) * 255);
                            const blue = 255 - red;
                            const alpha = 0.2;
                            return `rgba(${red}, 0, ${blue}, ${alpha})`;
                        }
                    }
                }
                isPositionValid(position) {
                    const [aleft, atop] = position;
                    return aleft >= 0 && atop >= 0 && aleft < this.level.width && atop < this.level.height;
                }
                isPositionBlocked(position) {
                    const layer = this.level.blockedLayer;
                    const [aleft, atop] = position;
                    return (layer[atop] && layer[atop][aleft]) === true;
                }
                getPositionTransparency(position) {
                    const layer = this.level.transparencyLayer;
                    const [aleft, atop] = position;
                    const transparencyValue = (layer[atop] && layer[atop][aleft]) || 0;
                    return (15 - transparencyValue) / 15;
                }
                getActionsAt(position) {
                    const scene = this;
                    const actions = [];
                    for (const object of scene.objects) {
                        if (!object.enabled)
                            continue;
                        //
                        const [left, top] = position;
                        //
                        const pleft = left - object.position[0] + object.originPoint[0];
                        const ptop = top - object.position[1] + object.originPoint[1];
                        for (const action of object.actions) {
                            const [aleft, atop] = action.position;
                            if (aleft === pleft &&
                                atop === ptop) {
                                actions.push(ActionData_1.convertToActionData(object, action));
                            }
                        }
                    }
                    return actions;
                }
                getNpcAt(position) {
                    for (let object of this.level.objects) {
                        if (!object.enabled)
                            continue;
                        if (!(object instanceof Npc_2.Npc))
                            continue;
                        //
                        if (object.position[0] === position[0] &&
                            object.position[1] === position[1]) {
                            return object;
                        }
                    }
                    return undefined;
                }
                getTemperatureAt(position) {
                    var _a, _b;
                    return ((_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.temperatureLayer[position[1]]) === null || _b === void 0 ? void 0 : _b[position[0]]) || 0;
                }
                getWeatherAt(position) {
                    var _a, _b, _c, _d, _e;
                    const value = (_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.roofHolesLayer[position[1]]) === null || _b === void 0 ? void 0 : _b[position[0]];
                    const isHole = typeof value === "undefined" || value;
                    if (!isHole && ((_c = this.level) === null || _c === void 0 ? void 0 : _c.weatherType) !== "mist" && ((_d = this.level) === null || _d === void 0 ? void 0 : _d.weatherType) !== "heavy_mist") {
                        return undefined;
                    }
                    return ((_e = this.level) === null || _e === void 0 ? void 0 : _e.weatherType) || undefined;
                }
                getTileAt(position) {
                    var _a, _b, _c;
                    return (_c = (_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.tiles) === null || _b === void 0 ? void 0 : _b[position[1]]) === null || _c === void 0 ? void 0 : _c[position[0]];
                }
                addLevelObject(object) {
                    this.level.objects.push(object);
                    object.bindToLevel(this.level);
                    object.scene = this;
                    // @todo send new event
                }
                removeLevelObject(object) {
                    this.level.objects = this.level.objects.filter(x => x !== object);
                    object.level = null;
                    object.scene = null;
                }
            };
            exports_36("Scene", Scene);
        }
    };
});
System.register("world/behaviors/WanderingBehavior", [], function (exports_37, context_37) {
    "use strict";
    var WanderingBehavior;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [],
        execute: function () {
            WanderingBehavior = class WanderingBehavior {
                constructor(options = {}) {
                    this.options = options;
                }
                update(ticks, object) {
                    object.faceRandomDirection();
                    object.moveRandomly();
                }
                handleEvent(ev, object) {
                }
            };
            exports_37("WanderingBehavior", WanderingBehavior);
        }
    };
});
System.register("world/events/MountGameEvent", ["engine/events/GameEvent"], function (exports_38, context_38) {
    "use strict";
    var GameEvent_6, MountGameEvent;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (GameEvent_6_1) {
                GameEvent_6 = GameEvent_6_1;
            }
        ],
        execute: function () {
            (function (MountGameEvent) {
                MountGameEvent.type = "mount";
                class Args {
                }
                MountGameEvent.Args = Args;
                function create(mounter, mount, newState) {
                    return new GameEvent_6.GameEvent(mounter, MountGameEvent.type, {
                        mounter,
                        mount,
                        newState,
                    });
                }
                MountGameEvent.create = create;
            })(MountGameEvent || (exports_38("MountGameEvent", MountGameEvent = {})));
        }
    };
});
System.register("world/behaviors/MountBehavior", ["world/behaviors/WanderingBehavior", "engine/events/EventLoop", "world/events/MountGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent"], function (exports_39, context_39) {
    "use strict";
    var WanderingBehavior_1, EventLoop_3, MountGameEvent_1, RemoveObjectGameEvent_2, AddObjectGameEvent_2, MountBehavior;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (WanderingBehavior_1_1) {
                WanderingBehavior_1 = WanderingBehavior_1_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (MountGameEvent_1_1) {
                MountGameEvent_1 = MountGameEvent_1_1;
            },
            function (RemoveObjectGameEvent_2_1) {
                RemoveObjectGameEvent_2 = RemoveObjectGameEvent_2_1;
            },
            function (AddObjectGameEvent_2_1) {
                AddObjectGameEvent_2 = AddObjectGameEvent_2_1;
            }
        ],
        execute: function () {
            MountBehavior = class MountBehavior {
                constructor(mountObject, options = {}) {
                    this.mountObject = mountObject;
                    this.options = options;
                    this.state = "wild";
                    this.mounterObject = null;
                    this.wanderingBeh = new WanderingBehavior_1.WanderingBehavior();
                }
                update(ticks, object) {
                    const state = this.state;
                    this.mountObject.parameters["isMounted"] = state === "mounted";
                    if (state === "wild") {
                        this.wanderingBeh.update(ticks, object);
                    }
                }
                handleEvent(ev, object) {
                }
                mount(mounter) {
                    this.mounterObject = mounter;
                    this.state = "mounted";
                    // Link mount and mounter.
                    mounter.mount = this.mountObject;
                    this.mountObject.parent = mounter;
                    // Update mount to have position relative to the mounter.
                    mounter.mount.position = [0, 0];
                    // Move mounter on top of the mount.
                    mounter.position = [...mounter.cursorPosition];
                    // Remove mount from the scene.
                    EventLoop_3.emitEvent(RemoveObjectGameEvent_2.RemoveObjectGameEvent.create(this.mountObject));
                    EventLoop_3.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "mounted"));
                }
                unmount() {
                    const mount = this.mountObject;
                    const mounter = this.mounterObject;
                    if (!mounter) {
                        return;
                    }
                    if (!mounter.scene) {
                        console.error(`Can not unmount ${mounter.type}. Mounter is not bound to the scene.`);
                        return;
                    }
                    if (mounter.scene && mounter.scene.isPositionBlocked(mounter.cursorPosition)) {
                        console.log(`Can not unmount ${mounter.type}. Position blocked.`);
                        return;
                    }
                    this.mounterObject = null;
                    this.state = "wild";
                    // Unlink mount and mounter.
                    mounter.mount = null;
                    mount.parent = null;
                    // Move mount to the mounter position.
                    mount.position = [...mounter.position];
                    // Add mount back to the scene.
                    EventLoop_3.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(mount));
                    // Move mounter forward.
                    mounter.position = [...mounter.cursorPosition];
                    EventLoop_3.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "unmounted"));
                }
            };
            exports_39("MountBehavior", MountBehavior);
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/behaviors/MountBehavior", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Npc"], function (exports_40, context_40) {
    "use strict";
    var Item_1, ObjectSkin_4, ObjectPhysics_6, MountBehavior_1, EventLoop_4, GameEvent_7, Npc_3, lamp, SwordItem, sword, emptyHand, victoryItem, bambooSeed, honeyPot, seaShell, Saddle, saddle;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (MountBehavior_1_1) {
                MountBehavior_1 = MountBehavior_1_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (GameEvent_7_1) {
                GameEvent_7 = GameEvent_7_1;
            },
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            }
        ],
        execute: function () {
            exports_40("lamp", lamp = () => {
                const physics = new ObjectPhysics_6.ObjectPhysics(` `, `x`, `a`);
                physics.lightsMap = { 'x': { intensity: 'f', color: [255, 255, 255] } };
                const item = Item_1.Item.create("lamp", new ObjectSkin_4.ObjectSkin(`🏮`), physics);
                return item;
            });
            SwordItem = class SwordItem extends Item_1.Item {
                constructor() {
                    super([0, 0], new ObjectSkin_4.ObjectSkin(`🗡`));
                    this.type = "sword";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            EventLoop_4.emitEvent(new GameEvent_7.GameEvent(ctx.initiator, 'attack', {
                                object: ctx.initiator,
                                subject: ctx.subject,
                            }));
                        }
                    });
                }
            };
            exports_40("SwordItem", SwordItem);
            exports_40("sword", sword = () => new SwordItem());
            exports_40("emptyHand", emptyHand = () => Item_1.Item.create("empty_hand", new ObjectSkin_4.ObjectSkin(` `)));
            exports_40("victoryItem", victoryItem = () => Item_1.Item.create("victory_item", new ObjectSkin_4.ObjectSkin(`W`)));
            exports_40("bambooSeed", bambooSeed = () => Item_1.Item.create("bamboo_seed", new ObjectSkin_4.ObjectSkin(`▄`, `T`, { 'T': ['#99bc20', 'transparent'] })));
            exports_40("honeyPot", honeyPot = () => Item_1.Item.create("honey_pot", new ObjectSkin_4.ObjectSkin(`🍯`)));
            // TODO: reveals invisible underwater chests.
            exports_40("seaShell", seaShell = () => Item_1.Item.create("sea_shell", new ObjectSkin_4.ObjectSkin(`🐚`)));
            Saddle = class Saddle extends Item_1.Item {
                constructor() {
                    super([0, 0], new ObjectSkin_4.ObjectSkin(`🐾`, `T`, { 'T': ['#99bc20', 'transparent'] }));
                    this.type = "saddle";
                    this.setUsage(ctx => {
                        if (ctx.initiator.mount) {
                            const mountBeh = ctx.initiator.mount.behaviors.find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.unmount();
                            }
                        }
                        else if (ctx.subject instanceof Npc_3.Npc) {
                            const mountBeh = ctx.subject.behaviors.find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.mount(ctx.initiator);
                            }
                        }
                    });
                }
            };
            exports_40("Saddle", Saddle);
            exports_40("saddle", saddle = () => new Saddle());
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items", "engine/objects/NpcMovementOptions"], function (exports_41, context_41) {
    "use strict";
    var Npc_4, ObjectSkin_5, items_1, NpcMovementOptions_2, hero;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            },
            function (NpcMovementOptions_2_1) {
                NpcMovementOptions_2 = NpcMovementOptions_2_1;
            }
        ],
        execute: function () {
            exports_41("hero", hero = new class extends Npc_4.Npc {
                constructor() {
                    super(new ObjectSkin_5.ObjectSkin('🐱'), [9, 7]);
                    this.type = "human";
                    this.showCursor = true;
                    this.movementOptions = {
                        ...NpcMovementOptions_2.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    const anEmptyHand = items_1.emptyHand();
                    const aSword = items_1.sword();
                    const aLamp = items_1.lamp();
                    this.inventory.items.push(anEmptyHand);
                    this.inventory.items.push(aSword);
                    this.inventory.items.push(aLamp);
                    this.inventory.items.push(items_1.saddle());
                    this.inventory.items.push(items_1.seaShell());
                    this.equipment.equip(aLamp);
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const obj = this;
                    obj.moveTick += ticks;
                }
            });
        }
    };
});
System.register("ui/UIElement", [], function (exports_42, context_42) {
    "use strict";
    var UIElement;
    var __moduleName = context_42 && context_42.id;
    return {
        setters: [],
        execute: function () {
            UIElement = class UIElement {
                constructor(parent) {
                    this.parent = parent;
                    this.position = [0, 0];
                    this.children = [];
                    if (parent) {
                        parent.children.push(this);
                    }
                }
                draw(ctx) {
                    for (const child of this.children) {
                        child.draw(ctx);
                    }
                }
                remove(element) {
                    if (!element) {
                        return;
                    }
                    if (element.parent !== this) {
                        return;
                    }
                    element.parent = null;
                    this.children = this.children.filter(x => x !== element);
                }
                getAbsolutePosition() {
                    const pos = [...this.position];
                    let parent = this.parent;
                    while (parent) {
                        pos[0] += parent.position[0];
                        pos[1] += parent.position[1];
                        parent = parent.parent;
                    }
                    return pos;
                }
            };
            exports_42("UIElement", UIElement);
        }
    };
});
System.register("ui/UIPanel", ["engine/graphics/Cell", "engine/graphics/GraphicsEngine", "ui/UIElement"], function (exports_43, context_43) {
    "use strict";
    var Cell_4, GraphicsEngine_3, UIElement_1, UIPanel;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            },
            function (GraphicsEngine_3_1) {
                GraphicsEngine_3 = GraphicsEngine_3_1;
            },
            function (UIElement_1_1) {
                UIElement_1 = UIElement_1_1;
            }
        ],
        execute: function () {
            UIPanel = class UIPanel extends UIElement_1.UIElement {
                constructor(parent, position, size) {
                    super(parent);
                    this.borderColor = '#555';
                    this.backgroundColor = '#333';
                    this.position = position;
                    this.size = size;
                }
                draw(ctx) {
                    this.drawBackgroundAndBorders(ctx);
                    super.draw(ctx);
                }
                drawBackgroundAndBorders(ctx) {
                    for (let y = 0; y < this.size.height; y++) {
                        const top = this.position[1] + y;
                        for (let x = 0; x < this.size.width; x++) {
                            const left = this.position[0] + x;
                            GraphicsEngine_3.drawCell(ctx, undefined, this.getCell([x, y]), left, top, undefined, undefined, "ui");
                        }
                    }
                }
                getCell([x, y]) {
                    if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
                        return new Cell_4.Cell(' ', 'black', this.borderColor, undefined, 15);
                    }
                    else {
                        return new Cell_4.Cell(' ', 'white', this.backgroundColor, undefined, 15);
                    }
                }
            };
            exports_43("UIPanel", UIPanel);
        }
    };
});
System.register("ui/UISceneObject", ["engine/graphics/GraphicsEngine", "ui/UIElement"], function (exports_44, context_44) {
    "use strict";
    var GraphicsEngine_4, UIElement_2, UISceneObject;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (GraphicsEngine_4_1) {
                GraphicsEngine_4 = GraphicsEngine_4_1;
            },
            function (UIElement_2_1) {
                UIElement_2 = UIElement_2_1;
            }
        ],
        execute: function () {
            UISceneObject = class UISceneObject extends UIElement_2.UIElement {
                constructor(parent, sceneObject) {
                    super(parent);
                    this.sceneObject = sceneObject;
                }
                draw(ctx) {
                    GraphicsEngine_4.drawObjectAt(ctx, undefined, this.sceneObject, this.getAbsolutePosition(), "ui");
                    super.draw(ctx);
                }
            };
            exports_44("UISceneObject", UISceneObject);
        }
    };
});
System.register("ui/HealthBarUi", ["engine/graphics/GraphicsEngine", "engine/graphics/Cell", "ui/UIElement"], function (exports_45, context_45) {
    "use strict";
    var GraphicsEngine_5, Cell_5, UIElement_3, HealthBarUi;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (GraphicsEngine_5_1) {
                GraphicsEngine_5 = GraphicsEngine_5_1;
            },
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
            },
            function (UIElement_3_1) {
                UIElement_3 = UIElement_3_1;
            }
        ],
        execute: function () {
            HealthBarUi = class HealthBarUi extends UIElement_3.UIElement {
                constructor(parent, npc, position) {
                    super(parent);
                    this.npc = npc;
                    this.position = position;
                }
                draw(ctx) {
                    for (let i = 0; i < this.npc.maxHealth; i++) {
                        const heartCell = new Cell_5.Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent');
                        GraphicsEngine_5.drawCell(ctx, undefined, heartCell, this.position[0] + i, this.position[1], undefined, undefined, "ui");
                    }
                }
            };
            exports_45("HealthBarUi", HealthBarUi);
        }
    };
});
System.register("ui/playerUi", ["engine/graphics/GraphicsEngine", "engine/objects/Npc", "engine/ActionData", "ui/UIPanel", "ui/UIElement", "ui/UISceneObject", "ui/HealthBarUi"], function (exports_46, context_46) {
    "use strict";
    var GraphicsEngine_6, Npc_5, ActionData_2, UIPanel_1, UIElement_4, UISceneObject_1, HealthBarUi_1, PlayerUi;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (GraphicsEngine_6_1) {
                GraphicsEngine_6 = GraphicsEngine_6_1;
            },
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ActionData_2_1) {
                ActionData_2 = ActionData_2_1;
            },
            function (UIPanel_1_1) {
                UIPanel_1 = UIPanel_1_1;
            },
            function (UIElement_4_1) {
                UIElement_4 = UIElement_4_1;
            },
            function (UISceneObject_1_1) {
                UISceneObject_1 = UISceneObject_1_1;
            },
            function (HealthBarUi_1_1) {
                HealthBarUi_1 = HealthBarUi_1_1;
            }
        ],
        execute: function () {
            PlayerUi = class PlayerUi extends UIElement_4.UIElement {
                constructor(npc, camera) {
                    super(null);
                    this.npc = npc;
                    this.camera = camera;
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    this.objectUnderCursorSprite = null;
                    this.objectUnderCursorHealthBar = null;
                    this.panel = new UIPanel_1.UIPanel(this, [0, 0], { width: camera.size.width, height: 1 });
                    this.panel.borderColor = '#000a';
                    this.heroSprite = new UISceneObject_1.UISceneObject(this, npc);
                    this.heroSprite.position = [0, 0];
                    this.heroHealthBar = new HealthBarUi_1.HealthBarUi(this, npc, [1, 0]);
                }
                draw(ctx) {
                    super.draw(ctx);
                    const right = this.camera.size.width - 1;
                    if (this.actionUnderCursor) {
                        GraphicsEngine_6.drawCell(ctx, this.camera, this.actionUnderCursor, right, 0, undefined, undefined, "ui");
                    }
                }
                getNpcUnderCursor(scene) {
                    const npcObjects = scene.objects
                        .filter(x => x.enabled && x instanceof Npc_5.Npc)
                        .map(x => x);
                    for (let o of npcObjects) {
                        if (o.position[0] === this.npc.cursorPosition[0] &&
                            o.position[1] === this.npc.cursorPosition[1]) {
                            return o;
                        }
                    }
                    return undefined;
                }
                update(ticks, scene) {
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    const npcUnderCursor = this.getNpcUnderCursor(scene);
                    if (npcUnderCursor) {
                        if (npcUnderCursor !== this.objectUnderCursor) {
                            npcUnderCursor.highlighted = true;
                            this.objectUnderCursor = npcUnderCursor;
                            const right = this.camera.size.width - 1;
                            this.remove(this.objectUnderCursorSprite);
                            this.remove(this.objectUnderCursorHealthBar);
                            this.objectUnderCursorHealthBar = new HealthBarUi_1.HealthBarUi(this, npcUnderCursor, [right - npcUnderCursor.maxHealth, 0]);
                            this.objectUnderCursorSprite = new UISceneObject_1.UISceneObject(this, npcUnderCursor);
                            this.objectUnderCursorSprite.position = [right, 0];
                        }
                    }
                    else {
                        this.remove(this.objectUnderCursorSprite);
                        this.remove(this.objectUnderCursorHealthBar);
                        this.objectUnderCursorSprite = null;
                        this.objectUnderCursorHealthBar = null;
                    }
                    const actionData = ActionData_2.getNpcInteraction(this.npc);
                    if (actionData) {
                        actionData.object.highlighted = true;
                        this.actionUnderCursor = actionData.actionIcon;
                    }
                }
            };
            exports_46("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/objects/house", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_47, context_47) {
    "use strict";
    var StaticGameObject_3, ObjectSkin_6, ObjectPhysics_7, windowHorizontalSkin, wallSkin, physicsUnitBlockedTransparent, physicsUnitBlocked, windowHorizontal, wall;
    var __moduleName = context_47 && context_47.id;
    function house(options) {
        return new StaticGameObject_3.StaticGameObject([2, 2], new ObjectSkin_6.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }), new ObjectPhysics_7.ObjectPhysics(`
 ... 
 . .`, ''), options.position);
    }
    exports_47("house", house);
    return {
        setters: [
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            },
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            }
        ],
        execute: function () {
            windowHorizontalSkin = () => new ObjectSkin_6.ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
            wallSkin = () => new ObjectSkin_6.ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
            physicsUnitBlockedTransparent = (transparency) => new ObjectPhysics_7.ObjectPhysics('.', '', '', '', transparency || '0');
            physicsUnitBlocked = () => new ObjectPhysics_7.ObjectPhysics('.');
            exports_47("windowHorizontal", windowHorizontal = (options) => new StaticGameObject_3.StaticGameObject([0, 0], windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), options.position));
            exports_47("wall", wall = (options) => new StaticGameObject_3.StaticGameObject([0, 0], wallSkin(), physicsUnitBlocked(), options.position));
        }
    };
});
System.register("world/objects/fence", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_48, context_48) {
    "use strict";
    var ObjectSkin_7, StaticGameObject_4, ObjectPhysics_8;
    var __moduleName = context_48 && context_48.id;
    function fence(options) {
        return new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_7.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_8.ObjectPhysics('.'), options.position);
    }
    exports_48("fence", fence);
    return {
        setters: [
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/events/TeleportToEndpointGameEvent", ["engine/events/GameEvent"], function (exports_49, context_49) {
    "use strict";
    var GameEvent_8, TeleportToEndpointGameEvent;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (GameEvent_8_1) {
                GameEvent_8 = GameEvent_8_1;
            }
        ],
        execute: function () {
            (function (TeleportToEndpointGameEvent) {
                TeleportToEndpointGameEvent.type = "teleport_to_endpoint";
                class Args {
                }
                TeleportToEndpointGameEvent.Args = Args;
                function create(id, teleport, object) {
                    return new GameEvent_8.GameEvent(teleport, TeleportToEndpointGameEvent.type, {
                        id,
                        teleport,
                        object,
                    });
                }
                TeleportToEndpointGameEvent.create = create;
            })(TeleportToEndpointGameEvent || (exports_49("TeleportToEndpointGameEvent", TeleportToEndpointGameEvent = {})));
        }
    };
});
System.register("world/objects/door", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/events/EventLoop", "world/events/TeleportToEndpointGameEvent"], function (exports_50, context_50) {
    "use strict";
    var ObjectSkin_8, StaticGameObject_5, ObjectPhysics_9, EventLoop_5, TeleportToEndpointGameEvent_1, Door;
    var __moduleName = context_50 && context_50.id;
    function door(id, options) {
        return new Door(id, options);
    }
    exports_50("door", door);
    return {
        setters: [
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
            },
            function (TeleportToEndpointGameEvent_1_1) {
                TeleportToEndpointGameEvent_1 = TeleportToEndpointGameEvent_1_1;
            }
        ],
        execute: function () {
            Door = class Door extends StaticGameObject_5.StaticGameObject {
                constructor(id, options) {
                    super([0, 0], new ObjectSkin_8.ObjectSkin(`🚪`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_9.ObjectPhysics(` `), options.position);
                    this.id = id;
                    this.setAction({
                        type: "collision",
                        action: ctx => EventLoop_5.emitEvent(TeleportToEndpointGameEvent_1.TeleportToEndpointGameEvent.create(id, ctx.obj, ctx.initiator))
                    });
                }
                bindToLevel(level) {
                    super.bindToLevel(level);
                    if (!level.portals[this.id]) {
                        level.portals[this.id] = [];
                    }
                    if (!level.portals[this.id].find(x => x[0] === this.position[0] && x[1] === this.position[1])) {
                        level.portals[this.id].push(this.position);
                    }
                }
            };
            exports_50("Door", Door);
        }
    };
});
System.register("world/events/PlayerMessageGameEvent", ["engine/events/GameEvent"], function (exports_51, context_51) {
    "use strict";
    var GameEvent_9, PlayerMessageGameEvent;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (GameEvent_9_1) {
                GameEvent_9 = GameEvent_9_1;
            }
        ],
        execute: function () {
            (function (PlayerMessageGameEvent) {
                PlayerMessageGameEvent.type = "player_message";
                class Args {
                }
                PlayerMessageGameEvent.Args = Args;
                function create(message) {
                    return new GameEvent_9.GameEvent(null, PlayerMessageGameEvent.type, { message });
                }
                PlayerMessageGameEvent.create = create;
            })(PlayerMessageGameEvent || (exports_51("PlayerMessageGameEvent", PlayerMessageGameEvent = {})));
        }
    };
});
System.register("world/actions", ["engine/events/EventLoop", "world/events/PlayerMessageGameEvent", "world/events/TransferItemsGameEvent"], function (exports_52, context_52) {
    "use strict";
    var EventLoop_6, PlayerMessageGameEvent_1, TransferItemsGameEvent_2;
    var __moduleName = context_52 && context_52.id;
    function storageAction(obj) {
        return (ctx) => {
            const items = obj.inventory.items;
            if (items.length === 0) {
                EventLoop_6.emitEvent(PlayerMessageGameEvent_1.PlayerMessageGameEvent.create("Chest is empty."));
                return;
            }
            obj.inventory.items = [];
            EventLoop_6.emitEvent(TransferItemsGameEvent_2.TransferItemsGameEvent.create(ctx.initiator, items));
        };
    }
    exports_52("storageAction", storageAction);
    return {
        setters: [
            function (EventLoop_6_1) {
                EventLoop_6 = EventLoop_6_1;
            },
            function (PlayerMessageGameEvent_1_1) {
                PlayerMessageGameEvent_1 = PlayerMessageGameEvent_1_1;
            },
            function (TransferItemsGameEvent_2_1) {
                TransferItemsGameEvent_2 = TransferItemsGameEvent_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/chest", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/actions"], function (exports_53, context_53) {
    "use strict";
    var StaticGameObject_6, ObjectSkin_9, ObjectPhysics_10, actions_1, Chest, chest;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (StaticGameObject_6_1) {
                StaticGameObject_6 = StaticGameObject_6_1;
            },
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            }
        ],
        execute: function () {
            Chest = class Chest extends StaticGameObject_6.StaticGameObject {
                constructor(position) {
                    super([0, 0], new ObjectSkin_9.ObjectSkin(`🧰`), new ObjectPhysics_10.ObjectPhysics(`.`, ''), position);
                    this.setAction(actions_1.storageAction(this));
                }
            };
            exports_53("default", Chest);
            exports_53("chest", chest = () => new Chest([2, 10]));
        }
    };
});
System.register("engine/data/TileInfo", [], function (exports_54, context_54) {
    "use strict";
    var TileInfo;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [],
        execute: function () {
            TileInfo = class TileInfo {
                constructor(color = 'transparent', type = 'undefined_tile', category = "solid", movementPenalty = 1) {
                    this.color = color;
                    this.type = type;
                    this.category = category;
                    this.movementPenalty = movementPenalty;
                }
            };
            exports_54("TileInfo", TileInfo);
        }
    };
});
System.register("engine/data/Tiles", ["engine/components/ObjectSkin", "engine/objects/Tile", "engine/data/TileInfo"], function (exports_55, context_55) {
    "use strict";
    var ObjectSkin_10, Tile_1, TileInfo_1, Tiles;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (TileInfo_1_1) {
                TileInfo_1 = TileInfo_1_1;
            }
        ],
        execute: function () {
            Tiles = class Tiles {
                static createEmptyMap(width, height, callback) {
                    const grid = Array.from(Array(width), () => Array.from(Array(height), callback));
                    return this.tileInfoToTiles(grid);
                }
                static createEmpty(width, height) {
                    return this.createEmptyMap(width, height, () => Tiles.defaultTile);
                }
                static createEmptyDefault() {
                    return this.createEmpty(20, 20);
                }
                static parseTiles(str, map) {
                    const tileInfos = str
                        .split('\n')
                        .map(mapLine);
                    return this.tileInfoToTiles(tileInfos);
                    function mapLine(line) {
                        return line
                            .split('')
                            .map(mapTileInfo);
                    }
                    function mapTileInfo(s) {
                        const tileInfo = s === ' ' ? Tiles.defaultTile : map[s];
                        return tileInfo;
                    }
                }
                static tileInfoToTiles(tileInfos) {
                    const tilesGrid = [];
                    for (let y = 0; y < tileInfos.length; y++) {
                        tilesGrid.push([]);
                        for (let x = 0; x < tileInfos[y].length; x++) {
                            const tileInfo = tileInfos[y][x];
                            const position = [x, y];
                            const skin = new ObjectSkin_10.ObjectSkin(' ', '.', { '.': ['transparent', tileInfo.color] });
                            const tile = new Tile_1.Tile(skin, position);
                            tile.type = tileInfo.type;
                            tile.category = tileInfo.category;
                            tile.movementPenalty = tileInfo.movementPenalty;
                            tilesGrid[tilesGrid.length - 1].push(tile);
                        }
                    }
                    return tilesGrid;
                }
            };
            exports_55("Tiles", Tiles);
            Tiles.defaultTile = new TileInfo_1.TileInfo('#331', '<default_tile>');
        }
    };
});
System.register("world/levels/devHub", ["engine/Level", "world/objects/house", "world/objects/fence", "world/objects/door", "world/objects/chest", "world/items", "engine/data/Tiles"], function (exports_56, context_56) {
    "use strict";
    var Level_1, house_1, fence_1, door_1, chest_1, items_2, Tiles_1, fences, width, height, house1, doors, chest, objects, level, devHubLevel;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [
            function (Level_1_1) {
                Level_1 = Level_1_1;
            },
            function (house_1_1) {
                house_1 = house_1_1;
            },
            function (fence_1_1) {
                fence_1 = fence_1_1;
            },
            function (door_1_1) {
                door_1 = door_1_1;
            },
            function (chest_1_1) {
                chest_1 = chest_1_1;
            },
            function (items_2_1) {
                items_2 = items_2_1;
            },
            function (Tiles_1_1) {
                Tiles_1 = Tiles_1_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 44;
            height = 44;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_1.fence({ position: [x, 0] }));
                    fences.push(fence_1.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_1.fence({ position: [0, y] }));
                    fences.push(fence_1.fence({ position: [width - 1, y] }));
                }
            }
            house1 = house_1.house({ position: [6, 2] });
            doors = [
                door_1.door('lights', { position: [2, 2] }),
                door_1.door('dungeon', { position: [2, 4] }),
                door_1.door('intro', { position: [2, 8] }),
                door_1.door('house', { position: [6, 2] }),
                door_1.door('terrain_door', { position: [6, 6] }),
                door_1.door('ggj2020demo_door', { position: [12, 2] }),
            ];
            chest = new chest_1.default([7, 7]);
            chest.inventory.addItems([items_2.bambooSeed()]);
            objects = [...fences, house1, ...doors, chest];
            level = new Level_1.Level('devHub', objects, Tiles_1.Tiles.createEmpty(width, height));
            exports_56("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/objects/campfire", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_57, context_57) {
    "use strict";
    var ObjectPhysics_11, ObjectSkin_11, StaticGameObject_7, Campfire;
    var __moduleName = context_57 && context_57.id;
    function campfire(options) {
        return new Campfire(options.position);
    }
    exports_57("campfire", campfire);
    return {
        setters: [
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (StaticGameObject_7_1) {
                StaticGameObject_7 = StaticGameObject_7_1;
            }
        ],
        execute: function () {
            Campfire = class Campfire extends StaticGameObject_7.StaticGameObject {
                constructor(position) {
                    super([0, 0], new ObjectSkin_11.ObjectSkin(`🔥`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_11.ObjectPhysics(` `, 'F', 'F'), position);
                    this.type = "campfire";
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    const isRainyWeather = scene.level.weatherType === 'rain' ||
                        scene.level.weatherType === 'rain_and_snow';
                    const [x, y] = this.position;
                    const isUnderTheSky = scene.level.roofHolesLayer[y] && scene.level.roofHolesLayer[y][x];
                    if (isRainyWeather && isUnderTheSky) {
                        this.skin.grid[0][0] = `💨`;
                        this.physics.lights[0] = `6`;
                        this.physics.temperatures[0] = `8`;
                    }
                    else {
                        this.skin.grid[0][0] = `🔥`;
                        this.physics.lights[0] = `F`;
                        this.physics.temperatures[0] = `F`;
                    }
                }
            };
            exports_57("Campfire", Campfire);
        }
    };
});
System.register("world/objects/mushroom", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_58, context_58) {
    "use strict";
    var StaticGameObject_8, ObjectSkin_12, ObjectPhysics_12, mushroom;
    var __moduleName = context_58 && context_58.id;
    return {
        setters: [
            function (StaticGameObject_8_1) {
                StaticGameObject_8 = StaticGameObject_8_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
            }
        ],
        execute: function () {
            exports_58("mushroom", mushroom = (options) => {
                const physics = new ObjectPhysics_12.ObjectPhysics(` `, `x`);
                physics.lightsMap = { 'x': { intensity: '8', color: [255, 255, 0] } };
                const object = new StaticGameObject_8.StaticGameObject([0, 0], new ObjectSkin_12.ObjectSkin(`🍄`), physics, options.position);
                return object;
            });
        }
    };
});
System.register("world/levels/dungeon", ["engine/Level", "world/objects/door", "world/objects/campfire", "utils/layer", "world/objects/house", "engine/data/Tiles", "world/objects/mushroom"], function (exports_59, context_59) {
    "use strict";
    var Level_2, door_2, campfire_1, layer_1, house_2, Tiles_2, mushroom_1, walls, campfires, mushrooms, doors, objects, level, dungeonLevel;
    var __moduleName = context_59 && context_59.id;
    return {
        setters: [
            function (Level_2_1) {
                Level_2 = Level_2_1;
            },
            function (door_2_1) {
                door_2 = door_2_1;
            },
            function (campfire_1_1) {
                campfire_1 = campfire_1_1;
            },
            function (layer_1_1) {
                layer_1 = layer_1_1;
            },
            function (house_2_1) {
                house_2 = house_2_1;
            },
            function (Tiles_2_1) {
                Tiles_2 = Tiles_2_1;
            },
            function (mushroom_1_1) {
                mushroom_1 = mushroom_1_1;
            }
        ],
        execute: function () {
            walls = [];
            if (true) { // add border walls
                for (let x = 0; x < 20; x++) {
                    walls.push(house_2.wall({ position: [x, 0] }));
                    walls.push(house_2.wall({ position: [x, 19] }));
                }
                for (let y = 1; y < 19; y++) {
                    walls.push(house_2.wall({ position: [0, y] }));
                    walls.push(house_2.wall({ position: [19, y] }));
                }
            }
            if (true) { // add random walls
                for (let y = 2; y < 17; y += 2) {
                    const parts = 2;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newHeadStone = house_2.wall({ position: [x, y] });
                        walls.push(newHeadStone);
                    }
                }
            }
            campfires = [
                campfire_1.campfire({ position: [3, 3] }),
                campfire_1.campfire({ position: [10, 13] }),
            ];
            mushrooms = [
                mushroom_1.mushroom({ position: [3, 12] }),
            ];
            doors = [
                door_2.door('dungeon', { position: [2, 2] }),
            ];
            objects = [...walls, ...doors, ...campfires, ...mushrooms];
            level = new Level_2.Level('dungeon', objects, Tiles_2.Tiles.createEmptyDefault());
            level.roofHolesLayer = [];
            layer_1.fillLayer(level.roofHolesLayer, level.width, level.height, false);
            if (false) { // add test hole
                level.roofHolesLayer[7][8] = true;
                level.roofHolesLayer[8][7] = true;
                level.roofHolesLayer[8][8] = true;
                level.roofHolesLayer[8][9] = true;
                level.roofHolesLayer[9][8] = true;
            }
            level.roofLayer = [];
            layer_1.fillLayer(level.roofLayer, level.width, level.height, 15);
            if (true) { // add gradient
                layer_1.forLayer(level.roofLayer, (l, x, y) => {
                    const v = 8 + Math.sin(x / 2) * 8;
                    const roofValue = Math.min(15, Math.max(0, Math.round(v)));
                    l[y][x] = roofValue;
                    if (roofValue === 0) {
                        level.roofHolesLayer[y][x] = true;
                    }
                });
            }
            exports_59("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/npcs/bee", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions"], function (exports_60, context_60) {
    "use strict";
    var Npc_6, ObjectSkin_13, WanderingBehavior_2, NpcMovementOptions_3, Bee;
    var __moduleName = context_60 && context_60.id;
    function bee(options) {
        return new Bee(options.position);
    }
    exports_60("bee", bee);
    return {
        setters: [
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (WanderingBehavior_2_1) {
                WanderingBehavior_2 = WanderingBehavior_2_1;
            },
            function (NpcMovementOptions_3_1) {
                NpcMovementOptions_3 = NpcMovementOptions_3_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_6.Npc {
                constructor(position) {
                    super(new ObjectSkin_13.ObjectSkin(`🐝`, `.`, {
                        '.': ['yellow', 'transparent'],
                    }), position);
                    this.type = "bee";
                    this.realm = "sky";
                    this.movementOptions = NpcMovementOptions_3.defaultMovementOptions.flying;
                    this.behaviors.push(new WanderingBehavior_2.WanderingBehavior());
                }
            };
            exports_60("Bee", Bee);
        }
    };
});
System.register("world/behaviors/PreyGroupBehavior", ["world/behaviors/WanderingBehavior"], function (exports_61, context_61) {
    "use strict";
    var WanderingBehavior_3, PreyGroupBehavior;
    var __moduleName = context_61 && context_61.id;
    return {
        setters: [
            function (WanderingBehavior_3_1) {
                WanderingBehavior_3 = WanderingBehavior_3_1;
            }
        ],
        execute: function () {
            PreyGroupBehavior = class PreyGroupBehavior {
                constructor(options = {}) {
                    this.options = options;
                    this.state = "still";
                    this.stress = 0;
                    this.enemies = [];
                    this.wanderingBeh = new WanderingBehavior_3.WanderingBehavior();
                }
                update(ticks, object) {
                    var _a, _b;
                    const scene = object.scene;
                    let enemiesNearby = object.getMobsNearby(scene, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.enemiesRadius) || 5, x => x.type !== object.type);
                    const fearedFriends = object.getMobsNearby(scene, ((_b = this.options) === null || _b === void 0 ? void 0 : _b.friendsRadius) || 2, x => x.type === object.type && (x.parameters["stress"] | 0) > 0);
                    if (enemiesNearby.length || fearedFriends.length) {
                        if (enemiesNearby.length) {
                            this.state = "feared";
                            this.stress = 3;
                            this.enemies = enemiesNearby;
                        }
                        else {
                            const sheepsStress = Math.max(...fearedFriends.map(x => x.parameters["stress"] | 0));
                            this.stress = sheepsStress - 1;
                            if (this.stress === 0) {
                                this.state = "still";
                                this.enemies = [];
                            }
                            else {
                                this.state = "feared_2";
                                this.enemies = fearedFriends[0].parameters["enemies"];
                                enemiesNearby = fearedFriends[0].parameters["enemies"];
                            }
                        }
                    }
                    else {
                        this.state = "wandering";
                        this.stress = 0;
                        this.enemies = [];
                    }
                    const state = this.state;
                    if (state === "wandering") {
                        this.wanderingBeh.update(ticks, object);
                    }
                    if (this.stress > 0) {
                        object.runAway(enemiesNearby || fearedFriends);
                    }
                    object.parameters['stress'] = this.stress;
                }
                handleEvent(ev, object) {
                }
            };
            exports_61("PreyGroupBehavior", PreyGroupBehavior);
        }
    };
});
System.register("world/npcs/duck", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior"], function (exports_62, context_62) {
    "use strict";
    var Npc_7, ObjectSkin_14, PreyGroupBehavior_1, Duck;
    var __moduleName = context_62 && context_62.id;
    function duck(options) {
        return new Duck(options.position);
    }
    exports_62("duck", duck);
    return {
        setters: [
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (PreyGroupBehavior_1_1) {
                PreyGroupBehavior_1 = PreyGroupBehavior_1_1;
            }
        ],
        execute: function () {
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_7.Npc {
                constructor(position) {
                    super(new ObjectSkin_14.ObjectSkin(`🦆`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "duck";
                    this.movementOptions = {
                        walkingSpeed: 2,
                        swimmingSpeed: 5,
                    };
                    this.behaviors.push(new PreyGroupBehavior_1.PreyGroupBehavior());
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const duck = this;
                    //
                    if (duck.parameters["state"] === "feared") {
                        duck.skin.raw_colors[0][0] = [undefined, "#FF000055"];
                    }
                    else if (duck.parameters["stress"] > 1) {
                        duck.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
                    }
                    else if (duck.parameters["stress"] > 0) {
                        duck.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        duck.skin.raw_colors[0][0] = [undefined, "transparent"];
                    }
                }
            };
        }
    };
});
System.register("world/npcs/sheep", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior"], function (exports_63, context_63) {
    "use strict";
    var Npc_8, ObjectSkin_15, PreyGroupBehavior_2, Sheep;
    var __moduleName = context_63 && context_63.id;
    function sheep(options) {
        return new Sheep(options.position);
    }
    exports_63("sheep", sheep);
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (PreyGroupBehavior_2_1) {
                PreyGroupBehavior_2 = PreyGroupBehavior_2_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_8.Npc {
                constructor(position) {
                    super(new ObjectSkin_15.ObjectSkin(`🐑`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                    this.behaviors.push(new PreyGroupBehavior_2.PreyGroupBehavior());
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const sheep = this;
                    //
                    // update skin
                    if (sheep.parameters["state"] === "feared") {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FF000055"];
                    }
                    else if (sheep.parameters["stress"] > 1) {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        sheep.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
                    }
                }
            };
        }
    };
});
System.register("world/objects/lamp", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_64, context_64) {
    "use strict";
    var StaticGameObject_9, ObjectSkin_16, ObjectPhysics_13, lamp;
    var __moduleName = context_64 && context_64.id;
    return {
        setters: [
            function (StaticGameObject_9_1) {
                StaticGameObject_9 = StaticGameObject_9_1;
            },
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
            }
        ],
        execute: function () {
            exports_64("lamp", lamp = (options) => {
                const object = new StaticGameObject_9.StaticGameObject([0, 2], new ObjectSkin_16.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                    'L': ['yellow', 'transparent'],
                    'H': ['#666', 'transparent'],
                }), new ObjectPhysics_13.ObjectPhysics(` 
 
.`, `B`), options.position);
                object.parameters["is_on"] = true;
                object.setAction({
                    position: [0, 2],
                    action: (ctx) => {
                        const o = ctx.obj;
                        o.parameters["is_on"] = !o.parameters["is_on"];
                        o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
                        o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
                    },
                    iconPosition: [0, 0]
                });
                return object;
            });
        }
    };
});
System.register("world/objects/bamboo", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/events/EventLoop", "engine/objects/StaticGameObject", "world/events/RemoveObjectGameEvent", "world/events/TransferItemsGameEvent", "world/items"], function (exports_65, context_65) {
    "use strict";
    var ObjectPhysics_14, ObjectSkin_17, EventLoop_7, StaticGameObject_10, RemoveObjectGameEvent_3, TransferItemsGameEvent_3, items_3;
    var __moduleName = context_65 && context_65.id;
    function bamboo(options) {
        const object = new StaticGameObject_10.StaticGameObject([0, 4], new ObjectSkin_17.ObjectSkin(`▄
█
█
█
█
█`, `T
H
L
H
L
D`, {
            // https://colorpalettes.net/color-palette-412/
            'T': ['#99bc20', 'transparent'],
            'L': ['#517201', 'transparent'],
            'H': ['#394902', 'transparent'],
            'D': ['#574512', 'transparent'],
        }), new ObjectPhysics_14.ObjectPhysics(` 
 
 
 
 
.`, ``), options.position);
        object.type = "bamboo";
        // TODO: only using an axe.
        object.setAction({
            position: [0, 5],
            action: ctx => {
                EventLoop_7.emitEvent(RemoveObjectGameEvent_3.RemoveObjectGameEvent.create(ctx.obj));
                EventLoop_7.emitEvent(TransferItemsGameEvent_3.TransferItemsGameEvent.create(ctx.initiator, [items_3.bambooSeed()]));
            }
        });
        return object;
    }
    exports_65("bamboo", bamboo);
    return {
        setters: [
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            },
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (EventLoop_7_1) {
                EventLoop_7 = EventLoop_7_1;
            },
            function (StaticGameObject_10_1) {
                StaticGameObject_10 = StaticGameObject_10_1;
            },
            function (RemoveObjectGameEvent_3_1) {
                RemoveObjectGameEvent_3 = RemoveObjectGameEvent_3_1;
            },
            function (TransferItemsGameEvent_3_1) {
                TransferItemsGameEvent_3 = TransferItemsGameEvent_3_1;
            },
            function (items_3_1) {
                items_3 = items_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_66, context_66) {
    "use strict";
    var Sprite_4, treeSpriteRaw, treeSprite;
    var __moduleName = context_66 && context_66.id;
    return {
        setters: [
            function (Sprite_4_1) {
                Sprite_4 = Sprite_4_1;
            }
        ],
        execute: function () {
            treeSpriteRaw = `width:3
height:4
name:
empty:'
color:o,#0c0,#0a0
color:0,#0a0,#080
color:1,#080,#060
color:S,#060,#040
color:H,sienna,transparent

no wind
'░'
░░░
░░░
'█'
'o'
o01
01S
'H'
wind
'▒'
▒▒▒
▒▒▒
'█'
'o'
o01
01S
'H'`;
            exports_66("treeSprite", treeSprite = Sprite_4.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/StaticGameObject"], function (exports_67, context_67) {
    "use strict";
    var StaticGameObject_11, Tree;
    var __moduleName = context_67 && context_67.id;
    return {
        setters: [
            function (StaticGameObject_11_1) {
                StaticGameObject_11 = StaticGameObject_11_1;
            }
        ],
        execute: function () {
            Tree = class Tree extends StaticGameObject_11.StaticGameObject {
                constructor(originPoint, sprite, physics, position) {
                    super(originPoint, sprite.frames["wind"][0], physics, position);
                    this.sprite = sprite;
                    this.currentFrameName = "wind";
                    this.isSnowy = false;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const o = this;
                    if (o.ticks > 300) {
                        o.ticks = 0;
                        if (o.parameters["animate"]) {
                            o.parameters["tick"] = !o.parameters["tick"];
                            this.currentFrameName = o.parameters["tick"]
                                ? 'no wind'
                                : 'wind';
                            this.skin = this.sprite.frames[this.currentFrameName][0];
                            if (this.isSnowy) {
                                for (let y = 0; y < this.skin.grid.length; y++) {
                                    for (let x = 0; x < this.skin.grid[0].length; x++) {
                                        if (this.physics.tops[y] && this.physics.tops[y][x] !== ' ') {
                                            this.skin.raw_colors[y][x][1] = 'white';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    //
                    const o = this;
                    if (ev.type === 'wind_changed') {
                        o.parameters["animate"] = ev.args["to"];
                    }
                    else if (ev.type === 'weather_changed') {
                        this.isSnowy = ev.args.to === 'snow';
                    }
                }
            };
            exports_67("Tree", Tree);
            ;
        }
    };
});
System.register("world/objects/pineTree", ["engine/components/ObjectPhysics", "world/sprites/tree", "world/objects/Tree"], function (exports_68, context_68) {
    "use strict";
    var ObjectPhysics_15, tree_1, Tree_1, PineTree;
    var __moduleName = context_68 && context_68.id;
    function pineTree(options) {
        return new PineTree(options.position);
    }
    exports_68("pineTree", pineTree);
    return {
        setters: [
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            },
            function (tree_1_1) {
                tree_1 = tree_1_1;
            },
            function (Tree_1_1) {
                Tree_1 = Tree_1_1;
            }
        ],
        execute: function () {
            PineTree = class PineTree extends Tree_1.Tree {
                constructor(position) {
                    super([1, 3], tree_1.treeSprite, new ObjectPhysics_15.ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), position);
                }
            };
        }
    };
});
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_69, context_69) {
    "use strict";
    var Sprite_5, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_69 && context_69.id;
    return {
        setters: [
            function (Sprite_5_1) {
                Sprite_5 = Sprite_5_1;
            }
        ],
        execute: function () {
            sakuraSpriteRaw = `width:4
height:4
name:
empty:'
color:o,#c3829e,#fcd1d7
color:0,#fcd1d7,#e9b1cd
color:1,#e9b1cd,#c3829e
color:S,#c3829e,#562135
color:H,sienna,transparent

no wind
'░░'
░░░░
'░░'
''█'
'oo' 
o01o
'1S'
''H'
wind
'▒▒'
▒▒▒▒
'▒▒'
''█'
'oo' 
o01o
'1S'
''H'`;
            exports_69("sakuraSprite", sakuraSprite = Sprite_5.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/sakuraTree", ["engine/components/ObjectPhysics", "world/sprites/sakura", "world/objects/Tree"], function (exports_70, context_70) {
    "use strict";
    var ObjectPhysics_16, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_70 && context_70.id;
    function sakuraTree(options) {
        return new SakuraTree(options.position);
    }
    exports_70("sakuraTree", sakuraTree);
    return {
        setters: [
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (sakura_1_1) {
                sakura_1 = sakura_1_1;
            },
            function (Tree_2_1) {
                Tree_2 = Tree_2_1;
            }
        ],
        execute: function () {
            SakuraTree = class SakuraTree extends Tree_2.Tree {
                constructor(position) {
                    super([2, 3], sakura_1.sakuraSprite, new ObjectPhysics_16.ObjectPhysics(`
    
    
  .`, '', '', ` .. 
....
    
    `), position);
                }
            };
        }
    };
});
System.register("world/objects/beehive", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/items", "world/actions"], function (exports_71, context_71) {
    "use strict";
    var StaticGameObject_12, ObjectSkin_18, ObjectPhysics_17, items_4, actions_2;
    var __moduleName = context_71 && context_71.id;
    function beehive(options) {
        const obj = new StaticGameObject_12.StaticGameObject([0, 0], new ObjectSkin_18.ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }), new ObjectPhysics_17.ObjectPhysics(`.`), options.position);
        obj.inventory.addItems([items_4.honeyPot()]);
        obj.setAction(actions_2.storageAction(obj));
        return obj;
    }
    exports_71("beehive", beehive);
    return {
        setters: [
            function (StaticGameObject_12_1) {
                StaticGameObject_12 = StaticGameObject_12_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            },
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (items_4_1) {
                items_4 = items_4_1;
            },
            function (actions_2_1) {
                actions_2 = actions_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/natural", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_72, context_72) {
    "use strict";
    var StaticGameObject_13, ObjectSkin_19, ObjectPhysics_18, createUnitSkin, createUnitPhysics, createUnitStaticObject, flower, wheat, hotspring;
    var __moduleName = context_72 && context_72.id;
    return {
        setters: [
            function (StaticGameObject_13_1) {
                StaticGameObject_13 = StaticGameObject_13_1;
            },
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_19.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            createUnitPhysics = () => new ObjectPhysics_18.ObjectPhysics(` `);
            createUnitStaticObject = (options) => new StaticGameObject_13.StaticGameObject([0, 0], createUnitSkin(options.sym, options.color), createUnitPhysics(), options.position);
            exports_72("flower", flower = (options) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' }));
            exports_72("wheat", wheat = (options) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' }));
            exports_72("hotspring", hotspring = (options) => new StaticGameObject_13.StaticGameObject([0, 0], createUnitSkin(`♨`, 'lightblue'), new ObjectPhysics_18.ObjectPhysics(' ', ' ', 'A'), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/pillar", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_73, context_73) {
    "use strict";
    var ObjectPhysics_19, ObjectSkin_20, StaticGameObject_14, pillar;
    var __moduleName = context_73 && context_73.id;
    return {
        setters: [
            function (ObjectPhysics_19_1) {
                ObjectPhysics_19 = ObjectPhysics_19_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (StaticGameObject_14_1) {
                StaticGameObject_14 = StaticGameObject_14_1;
            }
        ],
        execute: function () {
            exports_73("pillar", pillar = (options) => new StaticGameObject_14.StaticGameObject([0, 3], new ObjectSkin_20.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_19.ObjectPhysics(` 
 
 
. `), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/shop", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_74, context_74) {
    "use strict";
    var ObjectPhysics_20, ObjectSkin_21, StaticGameObject_15, shop;
    var __moduleName = context_74 && context_74.id;
    return {
        setters: [
            function (ObjectPhysics_20_1) {
                ObjectPhysics_20 = ObjectPhysics_20_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            },
            function (StaticGameObject_15_1) {
                StaticGameObject_15 = StaticGameObject_15_1;
            }
        ],
        execute: function () {
            exports_74("shop", shop = (options) => new StaticGameObject_15.StaticGameObject([2, 3], new ObjectSkin_21.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_20.ObjectPhysics(`       
       
 ..... `), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/arc", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_75, context_75) {
    "use strict";
    var ObjectPhysics_21, ObjectSkin_22, StaticGameObject_16, arc;
    var __moduleName = context_75 && context_75.id;
    return {
        setters: [
            function (ObjectPhysics_21_1) {
                ObjectPhysics_21 = ObjectPhysics_21_1;
            },
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (StaticGameObject_16_1) {
                StaticGameObject_16 = StaticGameObject_16_1;
            }
        ],
        execute: function () {
            exports_75("arc", arc = (options) => new StaticGameObject_16.StaticGameObject([2, 3], new ObjectSkin_22.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_21.ObjectPhysics(`     
     
     
.   .`), options.position));
        }
    };
});
System.register("world/tiles", ["engine/data/TileInfo"], function (exports_76, context_76) {
    "use strict";
    var TileInfo_2, tiles;
    var __moduleName = context_76 && context_76.id;
    return {
        setters: [
            function (TileInfo_2_1) {
                TileInfo_2 = TileInfo_2_1;
            }
        ],
        execute: function () {
            exports_76("tiles", tiles = {
                mountain: new TileInfo_2.TileInfo('#986A6A', 'mountain', "elevated"),
                water: new TileInfo_2.TileInfo('#358', 'water', "liquid"),
                water_deep: new TileInfo_2.TileInfo('#246', 'water_deep', "liquid"),
                grass: new TileInfo_2.TileInfo('#350', 'grass'),
                grass_tall: new TileInfo_2.TileInfo('#240', 'grass_tall'),
                sand: new TileInfo_2.TileInfo('#b80', 'sand', "solid", 0.8),
                bridge_stone: new TileInfo_2.TileInfo('#444', 'bridge_stone', "solid", 1.2),
                bridge_stone_dark: new TileInfo_2.TileInfo('#333', 'bridge_stone_dark', "solid", 1.2),
            });
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/data/Tiles", "world/tiles"], function (exports_77, context_77) {
    "use strict";
    var Tiles_3, tiles_1, levelTiles;
    var __moduleName = context_77 && context_77.id;
    return {
        setters: [
            function (Tiles_3_1) {
                Tiles_3 = Tiles_3_1;
            },
            function (tiles_1_1) {
                tiles_1 = tiles_1_1;
            }
        ],
        execute: function () {
            exports_77("levelTiles", levelTiles = Tiles_3.Tiles.parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
gggggggGGGGggggggg  gggggggggggggg gggggggggggg ggg
gggggg g gg gggggggggggggggg g  g g  g  g g gg g gg
gg  gg gg gggg gggg gggg gg gg ggg g gggg gg ggggg 
g ggg ggg g       gg    gg  gg ggg ggggGGGGg gggggg
ggg                gg ggggg gggggg gggggggggGGGGGgg
g                     ggGGGGgggg ggggggg gggggggggg
gggg      ggG    GG   gg    ggg GGG       gggggg  g
g      ggggg           g     g g gg   gggg    GGggg
gg      ggGG   gg     gG    gGg GGssssssss  ggggggg
g     gggg                       ssswwwWWWssgggGGgg
g                                 bbbBBWWwwwsgggggg
g           g        g             sswwwwWwsggg ggg
g                                    ssssssgg   ggg
   gggg    gg      gggggg             ggggggg ggggg
g        GGGGG     gGGGGGGgg gggg          gGG  ggg
gg       ggggg     gGgggGGGggg gggg     ggggGGGGggg
ggg    gg            GGGgggg ggg gg     gg g gGG gg
gggggggg            ggGGgg     gg           g g ggg
gg  gg gg          ggggg GGGgg              g  gg g
gggggggGG              GGGGgggggGGGgggG       ggGGg
gGGGGgggG                       GGggg   GGG   gGGgg
gg   gGG    gggg                 gg  g g g gssssssg
g   gg     gGGgggggg gg gggg      gGGg ggsssssswwws
   g gg     ggGGgGGg  gg g  g g     ggGGgwwwwwwwwww
ggsss      gGGgg ggg    sss sssbBbssswwwwwWWWWWWWWw
wwwwwww            wwwwwwwwwwwwBbbwwwwwwwwwWWWWWWWW
ggggwwww          wwwwwWWWWWWWWbbBWWWWwwwwwwwwwwWWW
ggggggwwwssssswwwwwWWWWWwsssg sbBbsssswwwwwwwwwWWWW
gggggwwwwwwwwwwwww gggg gggggggg  gg  ggssswwwWWWWW`, {
                'g': tiles_1.tiles.grass,
                'G': tiles_1.tiles.grass_tall,
                'w': tiles_1.tiles.water,
                'W': tiles_1.tiles.water_deep,
                'b': tiles_1.tiles.bridge_stone,
                'B': tiles_1.tiles.bridge_stone_dark,
                's': tiles_1.tiles.sand,
            }));
        }
    };
});
System.register("world/levels/ggj2020demo/level", ["engine/Level", "world/npcs/bee", "world/npcs/duck", "world/npcs/sheep", "world/objects/lamp", "world/objects/house", "world/objects/bamboo", "world/objects/pineTree", "world/objects/sakuraTree", "world/objects/beehive", "world/objects/natural", "world/levels/ggj2020demo/objects/pillar", "world/levels/ggj2020demo/objects/shop", "world/levels/ggj2020demo/objects/arc", "world/levels/ggj2020demo/tiles", "world/objects/fence", "world/objects/door"], function (exports_78, context_78) {
    "use strict";
    var Level_3, bee_1, duck_1, sheep_1, lamp_1, house_3, bamboo_1, pineTree_1, sakuraTree_1, beehive_1, natural_1, pillar_1, shop_1, arc_1, tiles_2, fence_2, door_3, levelHeight, levelWidth, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, doors, objects, level;
    var __moduleName = context_78 && context_78.id;
    return {
        setters: [
            function (Level_3_1) {
                Level_3 = Level_3_1;
            },
            function (bee_1_1) {
                bee_1 = bee_1_1;
            },
            function (duck_1_1) {
                duck_1 = duck_1_1;
            },
            function (sheep_1_1) {
                sheep_1 = sheep_1_1;
            },
            function (lamp_1_1) {
                lamp_1 = lamp_1_1;
            },
            function (house_3_1) {
                house_3 = house_3_1;
            },
            function (bamboo_1_1) {
                bamboo_1 = bamboo_1_1;
            },
            function (pineTree_1_1) {
                pineTree_1 = pineTree_1_1;
            },
            function (sakuraTree_1_1) {
                sakuraTree_1 = sakuraTree_1_1;
            },
            function (beehive_1_1) {
                beehive_1 = beehive_1_1;
            },
            function (natural_1_1) {
                natural_1 = natural_1_1;
            },
            function (pillar_1_1) {
                pillar_1 = pillar_1_1;
            },
            function (shop_1_1) {
                shop_1 = shop_1_1;
            },
            function (arc_1_1) {
                arc_1 = arc_1_1;
            },
            function (tiles_2_1) {
                tiles_2 = tiles_2_1;
            },
            function (fence_2_1) {
                fence_2 = fence_2_1;
            },
            function (door_3_1) {
                door_3 = door_3_1;
            }
        ],
        execute: function () {
            levelHeight = tiles_2.levelTiles.length;
            levelWidth = tiles_2.levelTiles[0].length;
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < levelWidth; x++) {
                    fences.push(fence_2.fence({ position: [x, 0] }));
                    fences.push(fence_2.fence({ position: [x, levelHeight - 1] }));
                }
                for (let y = 1; y < levelHeight - 1; y++) {
                    fences.push(fence_2.fence({ position: [0, y] }));
                    fences.push(fence_2.fence({ position: [levelWidth - 1, y] }));
                }
            }
            extraFences = [
                fence_2.fence({ position: [28, 7] }),
                fence_2.fence({ position: [29, 7] }),
                fence_2.fence({ position: [30, 7] }),
                fence_2.fence({ position: [31, 7] }),
            ];
            trees = [
                { position: [7, 9] },
                { position: [27, 19] },
                { position: [5, 28] },
                { position: [34, 18] },
                { position: [47, 2] },
                { position: [11, 16] },
                { position: [12, 24] },
                { position: [17, 3] },
                { position: [23, 5] },
                { position: [27, 5] },
                { position: [33, 8] },
                { position: [37, 7] },
                { position: [42, 9] },
            ].map((x) => pineTree_1.pineTree(x));
            sakuras = [
                { position: [37, 22] },
                { position: [42, 18] },
                { position: [47, 19] },
                { position: [40, 24] },
                { position: [43, 22] },
                { position: [26, 24] },
                { position: [32, 20] },
            ].map((x) => sakuraTree_1.sakuraTree(x));
            houses = [
                house_3.house({ position: [25, 5] }),
                house_3.house({ position: [15, 25] }),
                house_3.house({ position: [13, 3] }),
                house_3.house({ position: [3, 10] }),
            ];
            lamps = [
                lamp_1.lamp({ position: [27, 5] }),
                lamp_1.lamp({ position: [13, 25] }),
                lamp_1.lamp({ position: [15, 3] }),
                lamp_1.lamp({ position: [1, 10] }),
            ];
            pillars = [
                pillar_1.pillar({ position: [7, 21] }),
                pillar_1.pillar({ position: [20, 24] }),
                pillar_1.pillar({ position: [30, 20] }),
            ];
            arcs = [
                arc_1.arc({ position: [16, 16] }),
                arc_1.arc({ position: [32, 25] }),
            ];
            shops = [
                { position: [18, 10] }
            ].map((x) => shop_1.shop(x));
            ducks = [
                { position: [40, 10] },
                { position: [38, 12] },
                { position: [44, 25] },
                { position: [40, 26] },
                { position: [7, 28] },
            ].map((x) => duck_1.duck(x));
            sheepList = [
                { position: [44, 16] },
                { position: [48, 16] },
                { position: [43, 14] },
                { position: [46, 12] },
            ].map((x) => sheep_1.sheep(x));
            wheats = [
                { position: [31, 4] },
                { position: [31, 5] },
                { position: [30, 3] },
                { position: [31, 3] },
                { position: [28, 2] },
                { position: [29, 2] },
                { position: [29, 3] },
                { position: [29, 5] },
                { position: [28, 6] },
            ].map((x) => natural_1.wheat(x));
            flowers = [
                { position: [7, 4] },
                { position: [37, 5] },
                { position: [46, 4] },
                { position: [44, 7] },
                { position: [34, 3] },
                { position: [37, 3] },
                { position: [38, 1] },
            ].map((x) => natural_1.flower(x));
            bamboos = [
                { position: [4, 17] },
                { position: [6, 19] },
                { position: [3, 22] },
                { position: [2, 27] },
                { position: [1, 15] },
            ].map((x) => bamboo_1.bamboo(x));
            beehives = [
                { position: [34, 2] },
                { position: [36, 2] },
                { position: [34, 4] },
                { position: [36, 4] },
                { position: [38, 2] },
                { position: [38, 4] },
            ].map((x) => beehive_1.beehive(x));
            bees = [
                { position: [35, 2] },
                { position: [34, 5] },
                { position: [40, 3] },
            ].map((x) => bee_1.bee(x));
            hotsprings = [
                { position: [22, 18] },
                { position: [21, 15] },
                { position: [24, 19] },
            ].map((x) => natural_1.hotspring(x));
            doors = [
                new door_3.Door("ggj2020demo_door", { position: [2, 2] }),
            ];
            objects = [
                ...fences, ...extraFences,
                ...trees, ...sakuras, ...bamboos,
                ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                ...flowers, ...lamps, ...wheats,
                ...hotsprings,
                ...ducks, ...bees, ...sheepList,
                ...doors,
            ];
            exports_78("level", level = new Level_3.Level('ggj2020demo', objects, tiles_2.levelTiles));
        }
    };
});
System.register("world/objects/lightSource", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_79, context_79) {
    "use strict";
    var StaticGameObject_17, ObjectSkin_23, ObjectPhysics_22, lightSource;
    var __moduleName = context_79 && context_79.id;
    return {
        setters: [
            function (StaticGameObject_17_1) {
                StaticGameObject_17 = StaticGameObject_17_1;
            },
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (ObjectPhysics_22_1) {
                ObjectPhysics_22 = ObjectPhysics_22_1;
            }
        ],
        execute: function () {
            exports_79("lightSource", lightSource = (options) => {
                const physics = new ObjectPhysics_22.ObjectPhysics(` `, `x`);
                physics.lightsMap = { 'x': { intensity: 'F', color: options.color } };
                const object = new StaticGameObject_17.StaticGameObject([0, 0], new ObjectSkin_23.ObjectSkin(`⚪`, `L`, {
                    'L': [undefined, 'transparent'],
                }), physics, options.position);
                object.parameters["is_on"] = true;
                object.setAction(ctx => {
                    ctx.obj.parameters["is_on"] = !ctx.obj.parameters["is_on"];
                    physics.lightsMap['x'].intensity = ctx.obj.parameters["is_on"] ? 'F' : '0';
                });
                return object;
            });
        }
    };
});
System.register("world/levels/house", ["engine/Level", "world/objects/door", "utils/layer", "world/objects/house", "engine/data/Tiles", "world/objects/lightSource", "world/tiles"], function (exports_80, context_80) {
    "use strict";
    var Level_4, door_4, layer_2, house_4, Tiles_4, lightSource_1, tiles_3, walls, margin, left, top, width, height, campfires, lightSources, doors, objects, level, houseLevel;
    var __moduleName = context_80 && context_80.id;
    return {
        setters: [
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (door_4_1) {
                door_4 = door_4_1;
            },
            function (layer_2_1) {
                layer_2 = layer_2_1;
            },
            function (house_4_1) {
                house_4 = house_4_1;
            },
            function (Tiles_4_1) {
                Tiles_4 = Tiles_4_1;
            },
            function (lightSource_1_1) {
                lightSource_1 = lightSource_1_1;
            },
            function (tiles_3_1) {
                tiles_3 = tiles_3_1;
            }
        ],
        execute: function () {
            walls = [];
            margin = 2;
            left = margin;
            top = margin;
            width = 20 - margin * 2;
            height = 20 - margin * 2;
            if (true) { // add border walls
                for (let x = 0; x < width; x++) {
                    const object = (x < 6 || x > 9) ? house_4.wall : house_4.windowHorizontal;
                    walls.push(object({ position: [margin + x, top] }));
                    walls.push(object({ position: [margin + x, margin + height - 1] }));
                }
                for (let y = 0; y < height; y++) {
                    walls.push(house_4.wall({ position: [left, margin + y] }));
                    walls.push(house_4.wall({ position: [margin + width - 1, margin + y] }));
                }
            }
            campfires = [
            //campfire({ position: [10, 13] }),
            ];
            lightSources = [
                lightSource_1.lightSource({ position: [6, 10], color: [255, 0, 0], }),
                lightSource_1.lightSource({ position: [12, 10], color: [0, 255, 0], }),
                lightSource_1.lightSource({ position: [9, 13], color: [0, 0, 255], }),
            ];
            doors = [
                door_4.door('house', { position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...doors, ...campfires, ...lightSources];
            level = new Level_4.Level('house', objects, Tiles_4.Tiles.createEmptyMap(20, 20, () => tiles_3.tiles.bridge_stone));
            level.roofHolesLayer = [];
            layer_2.fillLayer(level.roofHolesLayer, level.width, level.height, true);
            level.roofLayer = [];
            layer_2.fillLayer(level.roofLayer, level.width, level.height, 0);
            if (true) { // add gradient
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        level.roofHolesLayer[top + y][left + x] = false;
                        level.roofLayer[top + y][left + x] = 15;
                    }
                }
            }
            exports_80("houseLevel", houseLevel = level);
        }
    };
});
System.register("world/levels/intro", ["world/objects/chest", "world/objects/lamp", "world/objects/house", "engine/events/EventLoop", "engine/events/GameEvent", "engine/Level", "world/objects/pineTree", "world/objects/door", "world/objects/bamboo", "engine/objects/Npc", "engine/components/ObjectSkin", "engine/data/Tiles", "world/items"], function (exports_81, context_81) {
    "use strict";
    var chest_2, lamp_2, house_5, EventLoop_8, GameEvent_10, Level_5, pineTree_2, door_5, bamboo_2, Npc_9, ObjectSkin_24, Tiles_5, items_5, lamps, doors, house1, tree1, chest1, trees, ulan, npcs, objects, introLevel;
    var __moduleName = context_81 && context_81.id;
    return {
        setters: [
            function (chest_2_1) {
                chest_2 = chest_2_1;
            },
            function (lamp_2_1) {
                lamp_2 = lamp_2_1;
            },
            function (house_5_1) {
                house_5 = house_5_1;
            },
            function (EventLoop_8_1) {
                EventLoop_8 = EventLoop_8_1;
            },
            function (GameEvent_10_1) {
                GameEvent_10 = GameEvent_10_1;
            },
            function (Level_5_1) {
                Level_5 = Level_5_1;
            },
            function (pineTree_2_1) {
                pineTree_2 = pineTree_2_1;
            },
            function (door_5_1) {
                door_5 = door_5_1;
            },
            function (bamboo_2_1) {
                bamboo_2 = bamboo_2_1;
            },
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (ObjectSkin_24_1) {
                ObjectSkin_24 = ObjectSkin_24_1;
            },
            function (Tiles_5_1) {
                Tiles_5 = Tiles_5_1;
            },
            function (items_5_1) {
                items_5 = items_5_1;
            }
        ],
        execute: function () {
            lamps = [
                lamp_2.lamp({ position: [2, 5] }),
                lamp_2.lamp({ position: [17, 5] }),
            ];
            doors = [
                door_5.door('intro', { position: [2, 2] }),
                door_5.door('intro_door', { position: [10, 10] }),
            ];
            house1 = house_5.house({ position: [5, 10] });
            tree1 = pineTree_2.pineTree({ position: [2, 12] });
            chest1 = chest_2.chest();
            chest1.inventory.addItems([items_5.victoryItem()]);
            exports_81("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x2, y] }));
                }
            }
            ulan = new Npc_9.Npc(new ObjectSkin_24.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction((ctx) => {
                const o = ctx.obj;
                EventLoop_8.emitEvent(new GameEvent_10.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            npcs = [
                ulan,
            ];
            objects = [house1, chest1, tree1, ...trees, ...lamps, ...npcs, ...doors];
            exports_81("introLevel", introLevel = new Level_5.Level('intro', objects, Tiles_5.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/headStone", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_82, context_82) {
    "use strict";
    var ObjectSkin_25, StaticGameObject_18, ObjectPhysics_23, headStone;
    var __moduleName = context_82 && context_82.id;
    return {
        setters: [
            function (ObjectSkin_25_1) {
                ObjectSkin_25 = ObjectSkin_25_1;
            },
            function (StaticGameObject_18_1) {
                StaticGameObject_18 = StaticGameObject_18_1;
            },
            function (ObjectPhysics_23_1) {
                ObjectPhysics_23 = ObjectPhysics_23_1;
            }
        ],
        execute: function () {
            exports_82("headStone", headStone = (options) => new StaticGameObject_18.StaticGameObject([0, 0], new ObjectSkin_25.ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_23.ObjectPhysics('.'), options.position));
        }
    };
});
System.register("world/levels/lights", ["world/objects/campfire", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/headStone", "world/objects/house", "engine/data/Tiles", "world/objects/door"], function (exports_83, context_83) {
    "use strict";
    var campfire_2, Level_6, pineTree_3, fence_3, headStone_1, house_6, Tiles_6, door_6, fences, headStones, walls, tree2, campfires, doors, objects, level, lightsLevel;
    var __moduleName = context_83 && context_83.id;
    return {
        setters: [
            function (campfire_2_1) {
                campfire_2 = campfire_2_1;
            },
            function (Level_6_1) {
                Level_6 = Level_6_1;
            },
            function (pineTree_3_1) {
                pineTree_3 = pineTree_3_1;
            },
            function (fence_3_1) {
                fence_3 = fence_3_1;
            },
            function (headStone_1_1) {
                headStone_1 = headStone_1_1;
            },
            function (house_6_1) {
                house_6 = house_6_1;
            },
            function (Tiles_6_1) {
                Tiles_6 = Tiles_6_1;
            },
            function (door_6_1) {
                door_6 = door_6_1;
            }
        ],
        execute: function () {
            fences = [];
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(fence_3.fence({ position: [x, 1] }));
                    fences.push(fence_3.fence({ position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(fence_3.fence({ position: [1, y] }));
                    fences.push(fence_3.fence({ position: [18, y] }));
                }
            }
            headStones = [];
            walls = [];
            walls.push(house_6.wall({ position: [5, 3] }));
            walls.push(house_6.wall({ position: [9, 3] }));
            walls.push(house_6.wall({ position: [13, 3] }));
            //
            walls.push(house_6.wall({ position: [4, 4] }));
            walls.push(house_6.wall({ position: [6, 4] }));
            walls.push(house_6.wall({ position: [8, 4] }));
            walls.push(house_6.wall({ position: [10, 4] }));
            walls.push(house_6.wall({ position: [12, 4] }));
            walls.push(house_6.wall({ position: [14, 4] }));
            //
            walls.push(house_6.wall({ position: [4, 5] }));
            walls.push(house_6.windowHorizontal({ position: [5, 5] }));
            walls.push(house_6.wall({ position: [6, 5] }));
            walls.push(house_6.wall({ position: [8, 5] }));
            walls.push(house_6.windowHorizontal({ position: [9, 5], transparency: '3' }));
            walls.push(house_6.wall({ position: [10, 5] }));
            walls.push(house_6.wall({ position: [12, 5] }));
            walls.push(house_6.windowHorizontal({ position: [13, 5], transparency: '6' }));
            walls.push(house_6.wall({ position: [14, 5] }));
            if (true) { // random objects
                for (let y = 8; y < 17; y += 2) {
                    const parts = 2;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newHeadStone = headStone_1.headStone({ position: [x, y] });
                        headStones.push(newHeadStone);
                    }
                }
            }
            tree2 = pineTree_3.pineTree({ position: [7, 12] });
            campfires = [
                campfire_2.campfire({ position: [5, 4] }),
                campfire_2.campfire({ position: [9, 4] }),
                campfire_2.campfire({ position: [13, 4] }),
                //
                campfire_2.campfire({ position: [3, 17] }),
            ];
            doors = [
                new door_6.Door("lights", { position: [7, 12] }),
            ];
            objects = [...fences, ...walls, tree2, ...campfires, ...headStones, ...doors];
            level = new Level_6.Level('lights', objects, Tiles_6.Tiles.createEmptyDefault());
            exports_83("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/behaviors/HunterBehavior", ["world/behaviors/WanderingBehavior"], function (exports_84, context_84) {
    "use strict";
    var WanderingBehavior_4, HunterBehavior;
    var __moduleName = context_84 && context_84.id;
    return {
        setters: [
            function (WanderingBehavior_4_1) {
                WanderingBehavior_4 = WanderingBehavior_4_1;
            }
        ],
        execute: function () {
            HunterBehavior = class HunterBehavior {
                constructor(options) {
                    this.options = options;
                    this.hungerTicks = 0;
                    this.hunger = 3;
                    this.state = "still";
                    this.wanderingBeh = new WanderingBehavior_4.WanderingBehavior();
                }
                update(ticks, object) {
                    var _a, _b;
                    const scene = object.scene;
                    this.hungerTicks += ticks;
                    if (this.hungerTicks > 2000) {
                        this.hunger += 1;
                        this.hungerTicks = 0;
                    }
                    //
                    if (this.hunger >= 3) {
                        const preyList = object.getMobsNearby(scene, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.preyRadius) || 6, npc => npc.type === this.options.preyType);
                        if (!preyList.length) {
                            this.state = "wandering";
                        }
                        else if (!this.target) {
                            this.target = preyList[0];
                            this.state = "hunting";
                        }
                    }
                    const enemiesNearby = object.getObjectsNearby(scene, ((_b = this.options) === null || _b === void 0 ? void 0 : _b.enemiesRadius) || 5, x => x.type === "campfire");
                    if (enemiesNearby.length) {
                        this.state = "feared";
                        this.enemies = enemiesNearby;
                        this.target = undefined;
                    }
                    if (this.state === "hunting" && this.target) {
                        if (object.distanceTo(this.target) <= 1) {
                            object.attack(this.target);
                        }
                        object.approach(this.target);
                    }
                    else if (this.state === "feared") {
                        object.runAway(enemiesNearby);
                    }
                    else if (this.state === "wandering") {
                        this.wanderingBeh.update(ticks, object);
                    }
                    object.parameters['state'] = this.state;
                }
                handleEvent(ev, object) {
                    if (ev.type === "death" && ev.args.object === this.target) {
                        this.target = undefined;
                        if (ev.args.cause.type === "attacked" && ev.args.cause.by === object) {
                            this.hunger = 0;
                            this.state = "still";
                        }
                    }
                }
            };
            exports_84("HunterBehavior", HunterBehavior);
        }
    };
});
System.register("world/npcs/wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/HunterBehavior", "engine/objects/NpcMovementOptions"], function (exports_85, context_85) {
    "use strict";
    var Npc_10, ObjectSkin_26, HunterBehavior_1, NpcMovementOptions_4, Wolf;
    var __moduleName = context_85 && context_85.id;
    function wolf(options) {
        return new Wolf(options.position);
    }
    exports_85("wolf", wolf);
    return {
        setters: [
            function (Npc_10_1) {
                Npc_10 = Npc_10_1;
            },
            function (ObjectSkin_26_1) {
                ObjectSkin_26 = ObjectSkin_26_1;
            },
            function (HunterBehavior_1_1) {
                HunterBehavior_1 = HunterBehavior_1_1;
            },
            function (NpcMovementOptions_4_1) {
                NpcMovementOptions_4 = NpcMovementOptions_4_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_10.Npc {
                constructor(position) {
                    super(new ObjectSkin_26.ObjectSkin(`🐺`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "wolf";
                    this.movementOptions = {
                        ...NpcMovementOptions_4.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    this.behaviors.push(new HunterBehavior_1.HunterBehavior({
                        preyType: 'sheep',
                    }));
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const wolf = this;
                    //
                    if (wolf.parameters["state"] === "feared") {
                        wolf.skin.raw_colors[0][0] = [undefined, "#FF000055"];
                    }
                    else if (wolf.parameters["state"] === "hunting") {
                        wolf.skin.raw_colors[0][0] = [undefined, "violet"];
                    }
                    else if (wolf.parameters["state"] === "wandering") {
                        wolf.skin.raw_colors[0][0] = [undefined, "yellow"];
                    }
                    else {
                        wolf.skin.raw_colors[0][0] = [undefined, "transparent"];
                    }
                }
            };
            ;
        }
    };
});
System.register("world/levels/sheep", ["world/objects/campfire", "world/npcs/sheep", "world/npcs/wolf", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/door", "engine/data/Tiles"], function (exports_86, context_86) {
    "use strict";
    var campfire_3, sheep_2, wolf_1, Level_7, pineTree_4, fence_4, door_7, Tiles_7, sheeps, wolves, fences, tree2, campfires, doors, objects, sheepLevel;
    var __moduleName = context_86 && context_86.id;
    return {
        setters: [
            function (campfire_3_1) {
                campfire_3 = campfire_3_1;
            },
            function (sheep_2_1) {
                sheep_2 = sheep_2_1;
            },
            function (wolf_1_1) {
                wolf_1 = wolf_1_1;
            },
            function (Level_7_1) {
                Level_7 = Level_7_1;
            },
            function (pineTree_4_1) {
                pineTree_4 = pineTree_4_1;
            },
            function (fence_4_1) {
                fence_4 = fence_4_1;
            },
            function (door_7_1) {
                door_7 = door_7_1;
            },
            function (Tiles_7_1) {
                Tiles_7 = Tiles_7_1;
            }
        ],
        execute: function () {
            sheeps = [];
            wolves = [];
            fences = [];
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(fence_4.fence({ position: [x, 1] }));
                    fences.push(fence_4.fence({ position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(fence_4.fence({ position: [1, y] }));
                    fences.push(fence_4.fence({ position: [18, y] }));
                }
            }
            if (true) { // random sheeps
                for (let y = 2; y < 17; y++) {
                    const parts = 4;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newSheep = sheep_2.sheep({ position: [x, y] });
                        sheeps.push(newSheep);
                    }
                }
            }
            wolves.push(wolf_1.wolf({ position: [15, 15] }));
            tree2 = pineTree_4.pineTree({ position: [7, 9] });
            campfires = [
                campfire_3.campfire({ position: [10, 10] }),
            ];
            doors = [
                door_7.door('sheep_door', { position: [4, 2] }),
                door_7.door('sheep_door', { position: [14, 14] }),
                door_7.door('intro_door', { position: [2, 2] }),
            ];
            objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...doors];
            exports_86("sheepLevel", sheepLevel = new Level_7.Level('sheep', objects, Tiles_7.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/npcs/turtle", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_87, context_87) {
    "use strict";
    var Npc_11, ObjectSkin_27, MountBehavior_2, NpcMovementOptions_5, Turtle;
    var __moduleName = context_87 && context_87.id;
    return {
        setters: [
            function (Npc_11_1) {
                Npc_11 = Npc_11_1;
            },
            function (ObjectSkin_27_1) {
                ObjectSkin_27 = ObjectSkin_27_1;
            },
            function (MountBehavior_2_1) {
                MountBehavior_2 = MountBehavior_2_1;
            },
            function (NpcMovementOptions_5_1) {
                NpcMovementOptions_5 = NpcMovementOptions_5_1;
            }
        ],
        execute: function () {
            Turtle = class Turtle extends Npc_11.Npc {
                constructor(position) {
                    super(new ObjectSkin_27.ObjectSkin(`🐢`), position);
                    this.type = "turtle";
                    this.movementOptions = NpcMovementOptions_5.defaultMovementOptions.amphibious;
                    this.behaviors.push(new MountBehavior_2.MountBehavior(this));
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const turtle = this;
                    //
                    // update skin
                    if (turtle.parameters["isMounted"]) {
                        turtle.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        turtle.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
                    }
                }
            };
            exports_87("Turtle", Turtle);
        }
    };
});
System.register("world/npcs/deer", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior"], function (exports_88, context_88) {
    "use strict";
    var Npc_12, ObjectSkin_28, MountBehavior_3, Deer;
    var __moduleName = context_88 && context_88.id;
    function deer(options) {
        return new Deer(options.position);
    }
    exports_88("deer", deer);
    return {
        setters: [
            function (Npc_12_1) {
                Npc_12 = Npc_12_1;
            },
            function (ObjectSkin_28_1) {
                ObjectSkin_28 = ObjectSkin_28_1;
            },
            function (MountBehavior_3_1) {
                MountBehavior_3 = MountBehavior_3_1;
            }
        ],
        execute: function () {
            Deer = class Deer extends Npc_12.Npc {
                constructor(position) {
                    super(new ObjectSkin_28.ObjectSkin(`🦌`), position);
                    this.type = "deer";
                    this.movementOptions = {
                        walkingSpeed: 10,
                        swimmingSpeed: 1,
                    };
                    this.behaviors.push(new MountBehavior_3.MountBehavior(this));
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const deer = this;
                    //
                    // update skin
                    if (deer.parameters["isMounted"]) {
                        deer.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        deer.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
                    }
                }
            };
            exports_88("Deer", Deer);
        }
    };
});
System.register("world/npcs/snail", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior"], function (exports_89, context_89) {
    "use strict";
    var Npc_13, ObjectSkin_29, MountBehavior_4, Snail;
    var __moduleName = context_89 && context_89.id;
    return {
        setters: [
            function (Npc_13_1) {
                Npc_13 = Npc_13_1;
            },
            function (ObjectSkin_29_1) {
                ObjectSkin_29 = ObjectSkin_29_1;
            },
            function (MountBehavior_4_1) {
                MountBehavior_4 = MountBehavior_4_1;
            }
        ],
        execute: function () {
            Snail = class Snail extends Npc_13.Npc {
                constructor(position) {
                    super(new ObjectSkin_29.ObjectSkin(`🐌`), position);
                    this.type = "snail";
                    this.movementOptions = {
                        climbingSpeed: 1,
                        walkingSpeed: 1,
                    };
                    this.behaviors.push(new MountBehavior_4.MountBehavior(this));
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const snail = this;
                    //
                    // update skin
                    if (snail.parameters["isMounted"]) {
                        snail.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        snail.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
                    }
                }
            };
            exports_89("Snail", Snail);
        }
    };
});
System.register("world/npcs/Fish", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions"], function (exports_90, context_90) {
    "use strict";
    var Npc_14, ObjectSkin_30, WanderingBehavior_5, NpcMovementOptions_6, Fish;
    var __moduleName = context_90 && context_90.id;
    return {
        setters: [
            function (Npc_14_1) {
                Npc_14 = Npc_14_1;
            },
            function (ObjectSkin_30_1) {
                ObjectSkin_30 = ObjectSkin_30_1;
            },
            function (WanderingBehavior_5_1) {
                WanderingBehavior_5 = WanderingBehavior_5_1;
            },
            function (NpcMovementOptions_6_1) {
                NpcMovementOptions_6 = NpcMovementOptions_6_1;
            }
        ],
        execute: function () {
            Fish = class Fish extends Npc_14.Npc {
                constructor(position) {
                    super(new ObjectSkin_30.ObjectSkin(`🐟`), position);
                    this.type = "fish";
                    this.realm = "water";
                    this.movementOptions = NpcMovementOptions_6.defaultMovementOptions.waterborne;
                    this.behaviors.push(new WanderingBehavior_5.WanderingBehavior());
                }
            };
            exports_90("Fish", Fish);
        }
    };
});
System.register("world/npcs/Ghost", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior"], function (exports_91, context_91) {
    "use strict";
    var Npc_15, ObjectSkin_31, WanderingBehavior_6, Ghost;
    var __moduleName = context_91 && context_91.id;
    return {
        setters: [
            function (Npc_15_1) {
                Npc_15 = Npc_15_1;
            },
            function (ObjectSkin_31_1) {
                ObjectSkin_31 = ObjectSkin_31_1;
            },
            function (WanderingBehavior_6_1) {
                WanderingBehavior_6 = WanderingBehavior_6_1;
            }
        ],
        execute: function () {
            Ghost = class Ghost extends Npc_15.Npc {
                constructor(position) {
                    super(new ObjectSkin_31.ObjectSkin(`👻`), position);
                    this.type = "ghost";
                    this.realm = "soul";
                    this.movementOptions = {
                        flyingSpeed: 4,
                    };
                    this.behaviors.push(new WanderingBehavior_6.WanderingBehavior());
                }
            };
            exports_91("Ghost", Ghost);
        }
    };
});
System.register("world/npcs/Dragon", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_92, context_92) {
    "use strict";
    var Npc_16, ObjectSkin_32, MountBehavior_5, NpcMovementOptions_7, Dragon;
    var __moduleName = context_92 && context_92.id;
    return {
        setters: [
            function (Npc_16_1) {
                Npc_16 = Npc_16_1;
            },
            function (ObjectSkin_32_1) {
                ObjectSkin_32 = ObjectSkin_32_1;
            },
            function (MountBehavior_5_1) {
                MountBehavior_5 = MountBehavior_5_1;
            },
            function (NpcMovementOptions_7_1) {
                NpcMovementOptions_7 = NpcMovementOptions_7_1;
            }
        ],
        execute: function () {
            Dragon = class Dragon extends Npc_16.Npc {
                constructor(position) {
                    super(new ObjectSkin_32.ObjectSkin(`🐉`), position);
                    this.type = "dragon";
                    this.movementOptions = NpcMovementOptions_7.defaultMovementOptions.flying;
                    this.behaviors.push(new MountBehavior_5.MountBehavior(this));
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const dragon = this;
                    //
                    // update skin
                    if (dragon.parameters["isMounted"]) {
                        dragon.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
                    }
                    else {
                        dragon.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
                    }
                }
            };
            exports_92("Dragon", Dragon);
        }
    };
});
System.register("world/npcs/Monkey", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "world/items"], function (exports_93, context_93) {
    "use strict";
    var Npc_17, ObjectSkin_33, WanderingBehavior_7, items_6, Monkey;
    var __moduleName = context_93 && context_93.id;
    return {
        setters: [
            function (Npc_17_1) {
                Npc_17 = Npc_17_1;
            },
            function (ObjectSkin_33_1) {
                ObjectSkin_33 = ObjectSkin_33_1;
            },
            function (WanderingBehavior_7_1) {
                WanderingBehavior_7 = WanderingBehavior_7_1;
            },
            function (items_6_1) {
                items_6 = items_6_1;
            }
        ],
        execute: function () {
            Monkey = class Monkey extends Npc_17.Npc {
                constructor(position) {
                    super(new ObjectSkin_33.ObjectSkin(`🐒`), position);
                    this.type = "monkey";
                    this.behaviors.push(new WanderingBehavior_7.WanderingBehavior());
                    const aLamp = items_6.lamp();
                    this.inventory.items.push(aLamp);
                    this.equipment.equip(aLamp);
                }
            };
            exports_93("Monkey", Monkey);
        }
    };
});
System.register("world/levels/terrain", ["engine/Level", "world/objects/door", "engine/data/Tiles", "world/npcs/turtle", "world/npcs/deer", "world/npcs/snail", "world/tiles", "world/npcs/Fish", "world/npcs/Ghost", "world/npcs/bee", "world/npcs/Dragon", "world/npcs/Monkey"], function (exports_94, context_94) {
    "use strict";
    var Level_8, door_8, Tiles_8, turtle_1, deer_1, snail_1, tiles_4, Fish_1, Ghost_1, bee_2, Dragon_1, Monkey_1, doors, mounts, npcs, objects, levelTiles, terrainLevel;
    var __moduleName = context_94 && context_94.id;
    return {
        setters: [
            function (Level_8_1) {
                Level_8 = Level_8_1;
            },
            function (door_8_1) {
                door_8 = door_8_1;
            },
            function (Tiles_8_1) {
                Tiles_8 = Tiles_8_1;
            },
            function (turtle_1_1) {
                turtle_1 = turtle_1_1;
            },
            function (deer_1_1) {
                deer_1 = deer_1_1;
            },
            function (snail_1_1) {
                snail_1 = snail_1_1;
            },
            function (tiles_4_1) {
                tiles_4 = tiles_4_1;
            },
            function (Fish_1_1) {
                Fish_1 = Fish_1_1;
            },
            function (Ghost_1_1) {
                Ghost_1 = Ghost_1_1;
            },
            function (bee_2_1) {
                bee_2 = bee_2_1;
            },
            function (Dragon_1_1) {
                Dragon_1 = Dragon_1_1;
            },
            function (Monkey_1_1) {
                Monkey_1 = Monkey_1_1;
            }
        ],
        execute: function () {
            doors = [
                door_8.door('terrain_door', { position: [2, 2] }),
            ];
            mounts = [
                new turtle_1.Turtle([3, 5]),
                new turtle_1.Turtle([9, 7]),
                new deer_1.Deer([2, 5]),
                new deer_1.Deer([3, 18]),
                new snail_1.Snail([1, 1]),
                new Dragon_1.Dragon([2, 6]),
            ];
            npcs = [
                new Fish_1.Fish([15, 8]),
                new Fish_1.Fish([8, 4]),
                new bee_2.Bee([3, 15]),
                new Ghost_1.Ghost([8, 14]),
                new Monkey_1.Monkey([6, 15]),
            ];
            objects = [...doors, ...mounts, ...npcs];
            levelTiles = Tiles_8.Tiles.parseTiles(`                                 
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
                'M': tiles_4.tiles.mountain,
                'w': tiles_4.tiles.water,
                'W': tiles_4.tiles.water_deep,
                's': tiles_4.tiles.sand,
            });
            exports_94("terrainLevel", terrainLevel = new Level_8.Level('terrain', objects, levelTiles));
        }
    };
});
System.register("world/levels/levels", ["world/levels/devHub", "world/levels/dungeon", "world/levels/ggj2020demo/level", "world/levels/house", "world/levels/intro", "world/levels/lights", "world/levels/sheep", "world/levels/terrain"], function (exports_95, context_95) {
    "use strict";
    var devHub_1, dungeon_1, level_1, house_7, intro_1, lights_1, sheep_3, terrain_1, dict, rawLevels, levels;
    var __moduleName = context_95 && context_95.id;
    return {
        setters: [
            function (devHub_1_1) {
                devHub_1 = devHub_1_1;
            },
            function (dungeon_1_1) {
                dungeon_1 = dungeon_1_1;
            },
            function (level_1_1) {
                level_1 = level_1_1;
            },
            function (house_7_1) {
                house_7 = house_7_1;
            },
            function (intro_1_1) {
                intro_1 = intro_1_1;
            },
            function (lights_1_1) {
                lights_1 = lights_1_1;
            },
            function (sheep_3_1) {
                sheep_3 = sheep_3_1;
            },
            function (terrain_1_1) {
                terrain_1 = terrain_1_1;
            }
        ],
        execute: function () {
            dict = { devHubLevel: devHub_1.devHubLevel, introLevel: intro_1.introLevel, lightsLevel: lights_1.lightsLevel, sheepLevel: sheep_3.sheepLevel, level: level_1.level, dungeonLevel: dungeon_1.dungeonLevel, houseLevel: house_7.houseLevel, terrainLevel: terrain_1.terrainLevel };
            exports_95("rawLevels", rawLevels = dict);
            exports_95("levels", levels = {});
            for (const item of Object.values(dict)) {
                levels[item.id] = item;
            }
        }
    };
});
System.register("world/events/LoadLevelGameEvent", ["engine/events/GameEvent"], function (exports_96, context_96) {
    "use strict";
    var GameEvent_11, LoadLevelGameEvent;
    var __moduleName = context_96 && context_96.id;
    return {
        setters: [
            function (GameEvent_11_1) {
                GameEvent_11 = GameEvent_11_1;
            }
        ],
        execute: function () {
            (function (LoadLevelGameEvent) {
                LoadLevelGameEvent.type = "load_level";
                class Args {
                }
                LoadLevelGameEvent.Args = Args;
                function create(level) {
                    return new GameEvent_11.GameEvent("system", LoadLevelGameEvent.type, { level });
                }
                LoadLevelGameEvent.create = create;
            })(LoadLevelGameEvent || (exports_96("LoadLevelGameEvent", LoadLevelGameEvent = {})));
        }
    };
});
System.register("world/events/TeleportToPositionGameEvent", ["engine/events/GameEvent"], function (exports_97, context_97) {
    "use strict";
    var GameEvent_12, TeleportToPositionGameEvent;
    var __moduleName = context_97 && context_97.id;
    return {
        setters: [
            function (GameEvent_12_1) {
                GameEvent_12 = GameEvent_12_1;
            }
        ],
        execute: function () {
            (function (TeleportToPositionGameEvent) {
                TeleportToPositionGameEvent.type = "teleport_to_position";
                class Args {
                }
                TeleportToPositionGameEvent.Args = Args;
                function create(object, position) {
                    return new GameEvent_12.GameEvent("system", TeleportToPositionGameEvent.type, {
                        object,
                        position
                    });
                }
                TeleportToPositionGameEvent.create = create;
            })(TeleportToPositionGameEvent || (exports_97("TeleportToPositionGameEvent", TeleportToPositionGameEvent = {})));
        }
    };
});
System.register("ui/UIText", ["engine/graphics/GraphicsEngine", "utils/misc", "ui/UIElement"], function (exports_98, context_98) {
    "use strict";
    var GraphicsEngine_7, misc_3, UIElement_5, UIText;
    var __moduleName = context_98 && context_98.id;
    return {
        setters: [
            function (GraphicsEngine_7_1) {
                GraphicsEngine_7 = GraphicsEngine_7_1;
            },
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (UIElement_5_1) {
                UIElement_5 = UIElement_5_1;
            }
        ],
        execute: function () {
            UIText = class UIText extends UIElement_5.UIElement {
                constructor(parent, text = '', color, background) {
                    super(parent);
                    this.text = text;
                    this.color = color;
                    this.background = background;
                    this.skin = misc_3.createTextObjectSkin(text, color, background);
                }
                draw(ctx) {
                    super.draw(ctx);
                    GraphicsEngine_7.drawObjectSkinAt(ctx, undefined, this.skin, [0, 0], this.getAbsolutePosition(), "ui");
                }
            };
            exports_98("UIText", UIText);
        }
    };
});
System.register("ui/UIItem", ["engine/graphics/Cell", "engine/graphics/GraphicsEngine", "ui/UIElement", "ui/UISceneObject", "ui/UIText"], function (exports_99, context_99) {
    "use strict";
    var Cell_6, GraphicsEngine_8, UIElement_6, UISceneObject_2, UIText_1, UIItem;
    var __moduleName = context_99 && context_99.id;
    return {
        setters: [
            function (Cell_6_1) {
                Cell_6 = Cell_6_1;
            },
            function (GraphicsEngine_8_1) {
                GraphicsEngine_8 = GraphicsEngine_8_1;
            },
            function (UIElement_6_1) {
                UIElement_6 = UIElement_6_1;
            },
            function (UISceneObject_2_1) {
                UISceneObject_2 = UISceneObject_2_1;
            },
            function (UIText_1_1) {
                UIText_1 = UIText_1_1;
            }
        ],
        execute: function () {
            UIItem = class UIItem extends UIElement_6.UIElement {
                constructor(parent, item, position) {
                    super(parent);
                    this.item = item;
                    this.isSelected = false;
                    this.position = position;
                    this.uiObject = new UISceneObject_2.UISceneObject(this, item);
                    this.uiText = new UIText_1.UIText(this, item.type, 'white', 'transparent');
                    this.uiText.position = [1, 0];
                }
                draw(ctx) {
                    this.drawBackground(ctx);
                    super.draw(ctx);
                }
                drawBackground(ctx) {
                    if (this.isSelected) {
                        const [x0, y0] = this.getAbsolutePosition();
                        const actualWidth = 1 + this.uiText.text.length;
                        for (let x = 0; x < actualWidth; x++) {
                            const borders = [
                                'white',
                                x === actualWidth - 1 ? 'white' : '',
                                'white',
                                x === 0 ? 'white' : ''
                            ];
                            GraphicsEngine_8.drawCell(ctx, undefined, new Cell_6.Cell(' '), x0 + x, y0, true, borders, "ui");
                        }
                    }
                }
            };
            exports_99("UIItem", UIItem);
        }
    };
});
System.register("ui/UIInventory", ["controls", "engine/events/EventLoop", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "engine/objects/Npc", "world/events/SwitchGameModeGameEvent", "ui/UIElement", "ui/UIItem", "ui/UIPanel"], function (exports_100, context_100) {
    "use strict";
    var controls_1, EventLoop_9, Cell_7, GraphicsEngine_9, Npc_18, SwitchGameModeGameEvent_2, UIElement_7, UIItem_1, UIPanel_2, UIInventory;
    var __moduleName = context_100 && context_100.id;
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (EventLoop_9_1) {
                EventLoop_9 = EventLoop_9_1;
            },
            function (Cell_7_1) {
                Cell_7 = Cell_7_1;
            },
            function (GraphicsEngine_9_1) {
                GraphicsEngine_9 = GraphicsEngine_9_1;
            },
            function (Npc_18_1) {
                Npc_18 = Npc_18_1;
            },
            function (SwitchGameModeGameEvent_2_1) {
                SwitchGameModeGameEvent_2 = SwitchGameModeGameEvent_2_1;
            },
            function (UIElement_7_1) {
                UIElement_7 = UIElement_7_1;
            },
            function (UIItem_1_1) {
                UIItem_1 = UIItem_1_1;
            },
            function (UIPanel_2_1) {
                UIPanel_2 = UIPanel_2_1;
            }
        ],
        execute: function () {
            UIInventory = class UIInventory extends UIElement_7.UIElement {
                get selectedItem() {
                    return this.uiItems[this.selectedItemIndex].item;
                }
                constructor(object, camera) {
                    super(null);
                    this.object = object;
                    this.camera = camera;
                    this.uiItems = [];
                    this.selectedItemIndex = -1;
                    const dialogWidth = camera.size.width;
                    const dialogHeight = camera.size.height / 2 - 3;
                    const position = [0, camera.size.height - dialogHeight];
                    const size = {
                        width: dialogWidth,
                        height: dialogHeight,
                    };
                    this.uiPanel = new UIPanel_2.UIPanel(this, position, size);
                    this.selectedItemIndex = 0;
                }
                handleControls() {
                    const prevSelectedIndex = this.selectedItemIndex;
                    if (controls_1.Controls.Down.isDown && !controls_1.Controls.Down.isHandled) {
                        this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, this.uiItems.length - 1);
                        controls_1.Controls.Down.isHandled = true;
                    }
                    if (controls_1.Controls.Up.isDown && !controls_1.Controls.Up.isHandled) {
                        this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
                        controls_1.Controls.Up.isHandled = true;
                    }
                    if (controls_1.Controls.Interact.isDown && !controls_1.Controls.Interact.isHandled) {
                        if (this.object instanceof Npc_18.Npc) {
                            this.object.equipment.equip(this.selectedItem);
                        }
                        controls_1.Controls.Interact.isHandled = true;
                    }
                    if (controls_1.Controls.Inventory.isDown && !controls_1.Controls.Inventory.isHandled) {
                        EventLoop_9.emitEvent(SwitchGameModeGameEvent_2.SwitchGameModeGameEvent.create("inventory", "scene"));
                        controls_1.Controls.Inventory.isHandled = true;
                    }
                    if (prevSelectedIndex != this.selectedItemIndex) {
                        this.uiItems[prevSelectedIndex].isSelected = false;
                        this.uiItems[this.selectedItemIndex].isSelected = true;
                    }
                }
                update() {
                    this.uiItems = [];
                    for (const child of [...this.uiPanel.children]) {
                        this.uiPanel.remove(child);
                    }
                    let index = 0;
                    for (const item of this.object.inventory.items) {
                        const uiItem = new UIItem_1.UIItem(this.uiPanel, item, [2, 1 + index]);
                        uiItem.isSelected = index === this.selectedItemIndex;
                        this.uiItems.push(uiItem);
                        index += 1;
                    }
                }
                draw(ctx) {
                    super.draw(ctx);
                    for (const uiItem of this.uiItems) {
                        if (this.object instanceof Npc_18.Npc && uiItem.item === this.object.equipment.objectInMainHand) {
                            const [x, y] = uiItem.getAbsolutePosition();
                            const cursorCell = new Cell_7.Cell('✋', undefined, 'transparent');
                            GraphicsEngine_9.drawCell(ctx, undefined, cursorCell, x - 1, y, undefined, undefined, "ui");
                        }
                    }
                }
            };
            exports_100("UIInventory", UIInventory);
        }
    };
});
System.register("main", ["engine/events/GameEvent", "engine/events/EventLoop", "engine/Scene", "engine/ActionData", "engine/graphics/GraphicsEngine", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "world/levels/levels", "world/levels/devHub", "world/events/TeleportToEndpointGameEvent", "controls", "world/events/MountGameEvent", "world/events/PlayerMessageGameEvent", "world/events/SwitchGameModeGameEvent", "world/events/AddObjectGameEvent", "world/events/TransferItemsGameEvent", "utils/misc", "world/events/LoadLevelGameEvent", "world/events/RemoveObjectGameEvent", "world/events/TeleportToPositionGameEvent", "ui/UIPanel", "ui/UIInventory"], function (exports_101, context_101) {
    "use strict";
    var GameEvent_13, EventLoop_10, Scene_1, ActionData_3, GraphicsEngine_10, CanvasContext_1, hero_1, playerUi_1, levels_1, devHub_2, TeleportToEndpointGameEvent_2, controls_2, MountGameEvent_2, PlayerMessageGameEvent_2, SwitchGameModeGameEvent_3, AddObjectGameEvent_3, TransferItemsGameEvent_4, misc_4, LoadLevelGameEvent_1, RemoveObjectGameEvent_4, TeleportToPositionGameEvent_1, UIPanel_3, UIInventory_1, canvas, ctx, Game, game, scene, debug, leftPad, topPad, heroUi, uiInventory, ticksPerStep, startTime, weatherTypes;
    var __moduleName = context_101 && context_101.id;
    function loadLevel(level) {
        scene.level = level;
        scene.level.objects = scene.level.objects;
        for (const object of scene.level.objects) {
            object.scene = scene;
            object.bindToLevel(scene.level);
        }
        hero_1.hero.position = [9, 7];
        scene.camera.follow(hero_1.hero, level);
        // Emit initial level events.
        EventLoop_10.emitEvent(new GameEvent_13.GameEvent("system", "weather_changed", { from: level.weatherType, to: level.weatherType }));
        EventLoop_10.emitEvent(new GameEvent_13.GameEvent("system", "wind_changed", { from: level.isWindy, to: level.isWindy }));
    }
    function teleportToEndpoint(portalId, teleport, object) {
        const portalPositions = scene.level.portals[portalId];
        if ((portalPositions === null || portalPositions === void 0 ? void 0 : portalPositions.length) === 2) {
            // Pair portal is on the same level.
            const portalPositionIndex = portalPositions.findIndex(x => x[0] === teleport.position[0] && x[1] === teleport.position[1]);
            const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
            teleportTo(scene.level.id, [pairPortalPosition[0], pairPortalPosition[1] + 1]);
        }
        else {
            // Find other level with this portal id.
            const pairPortals = Object.entries(levels_1.levels)
                .filter(([levelId, _]) => { var _a; return levelId !== ((_a = scene.level) === null || _a === void 0 ? void 0 : _a.id); })
                .filter(([___, level]) => { var _a; return ((_a = level.portals[portalId]) === null || _a === void 0 ? void 0 : _a.length) === 1; })
                .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0] }));
            if ((pairPortals === null || pairPortals === void 0 ? void 0 : pairPortals.length) !== 0) {
                const pairPortal = pairPortals[0];
                teleportTo(pairPortal.levelId, [pairPortal.position[0], pairPortal.position[1] + 1]);
            }
            else {
                console.log(`Pair portal for "${portalId}" was not found.`);
            }
        }
        function teleportTo(levelId, position) {
            if (!scene.level) {
                return;
            }
            if (levelId !== scene.level.id) {
                selectLevel(scene.level, levels_1.levels[levelId]);
            }
            EventLoop_10.emitEvent(TeleportToPositionGameEvent_1.TeleportToPositionGameEvent.create(object, position));
        }
    }
    function selectLevel(prevLevel, level) {
        console.log(`Selecting level "${level.id}".`);
        if (prevLevel) {
            EventLoop_10.emitEvent(RemoveObjectGameEvent_4.RemoveObjectGameEvent.create(hero_1.hero));
        }
        EventLoop_10.emitEvent(LoadLevelGameEvent_1.LoadLevelGameEvent.create(level));
        EventLoop_10.emitEvent(AddObjectGameEvent_3.AddObjectGameEvent.create(hero_1.hero));
    }
    function handleControls() {
        if (game.mode === "scene") {
            handleSceneControls();
        }
        else {
            if (game.mode === "inventory") {
                uiInventory.handleControls();
            }
            // TODO: add this to some abstract UI dialog and extent in concrete dialogs.
            if (controls_2.Controls.Escape.isDown && !controls_2.Controls.Escape.isHandled) {
                EventLoop_10.emitEvent(SwitchGameModeGameEvent_3.SwitchGameModeGameEvent.create(game.mode, "scene"));
                controls_2.Controls.Escape.isHandled = true;
            }
        }
    }
    function handleSceneControls() {
        const controlObject = hero_1.hero;
        let doMove = false;
        if (controls_2.Controls.Up.isDown) {
            controlObject.direction = [0, -1];
            doMove = !controls_2.Controls.Up.isShiftDown;
        }
        else if (controls_2.Controls.Down.isDown) {
            controlObject.direction = [0, +1];
            doMove = !controls_2.Controls.Down.isShiftDown;
        }
        else if (controls_2.Controls.Left.isDown) {
            controlObject.direction = [-1, 0];
            doMove = !controls_2.Controls.Left.isShiftDown;
        }
        else if (controls_2.Controls.Right.isDown) {
            controlObject.direction = [+1, 0];
            doMove = !controls_2.Controls.Right.isShiftDown;
        }
        if (doMove) {
            if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
                controlObject.move();
            }
        }
        if (controls_2.Controls.Inventory.isDown && !controls_2.Controls.Inventory.isHandled) {
            updateInventory(); // TODO: handle somewhere else
            EventLoop_10.emitEvent(SwitchGameModeGameEvent_3.SwitchGameModeGameEvent.create(game.mode, "inventory"));
            controls_2.Controls.Inventory.isHandled = true;
        }
        else if (controls_2.Controls.Interact.isDown && !controls_2.Controls.Interact.isHandled) {
            interact();
            controls_2.Controls.Interact.isHandled = true;
        }
        if (controls_2.Controls.DebugP.isDown && !controls_2.Controls.DebugP.isHandled) {
            debugToggleWind();
            controls_2.Controls.DebugP.isHandled = true;
        }
        if (controls_2.Controls.DebugQ.isDown && !controls_2.Controls.DebugQ.isHandled) {
            debugProgressDay(controls_2.Controls.DebugQ.isShiftDown ? 0.25 : 0.5);
            controls_2.Controls.DebugQ.isHandled = true;
        }
    }
    function debugToggleWind() {
        scene.level.isWindy = !scene.level.isWindy;
        EventLoop_10.emitEvent(new GameEvent_13.GameEvent("system", "wind_changed", {
            from: !scene.level.isWindy,
            to: scene.level.isWindy,
        }));
    }
    function debugProgressDay(partOfTheDay) {
        scene.gameTime += scene.ticksPerDay * partOfTheDay;
        console.log(`Changed time of the day to ${scene.gameTime} (${getDayTimePeriodName(scene.gameTime)}).`);
        function getDayTimePeriodName(ticks) {
            const dayTime = ticks % scene.ticksPerDay;
            if (dayTime < scene.ticksPerDay * 0.25) {
                return "Midnight";
            }
            else if (dayTime < scene.ticksPerDay * 0.5) {
                return "Morning";
            }
            else if (dayTime < scene.ticksPerDay * 0.75) {
                return "Noon";
            }
            else {
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
                initiator: hero_1.hero,
                subject: actionData.object,
            });
            return;
        }
        // Second, check if hero's main hand item has any usage actions. 
        const item = hero_1.hero.equipment.objectInMainHand;
        if (item) {
            const itemActionData = ActionData_3.getItemUsageAction(item);
            const subject = scene.getNpcAt(item.position);
            if (itemActionData) {
                itemActionData.action({
                    obj: itemActionData.object,
                    initiator: hero_1.hero,
                    subject: subject,
                });
            }
        }
    }
    function getActionUnderCursor() {
        return ActionData_3.getNpcInteraction(hero_1.hero);
    }
    function drawDialog() {
        // background
        const dialogWidth = scene.camera.size.width;
        const dialogHeight = scene.camera.size.height / 2 - 3;
        const uiPanel = new UIPanel_3.UIPanel(null, [0, scene.camera.size.height - dialogHeight], {
            width: dialogWidth,
            height: dialogHeight,
        });
        uiPanel.draw(ctx);
    }
    function updateInventory() {
        uiInventory = new UIInventory_1.UIInventory(hero_1.hero, scene.camera);
        uiInventory.update();
    }
    function drawInventory() {
        uiInventory === null || uiInventory === void 0 ? void 0 : uiInventory.draw(ctx);
    }
    function onInterval() {
        handleControls();
        const elapsedTime = new Date().getMilliseconds() - startTime.getMilliseconds();
        startTime = new Date();
        const ticksMillis = Math.max(0, elapsedTime);
        game.update(ticksMillis);
        EventLoop_10.eventLoop([game, scene, ...scene.objects]);
        game.draw();
    }
    function changeWeather(weatherType) {
        const oldWeatherType = scene.level.weatherType;
        scene.level.weatherType = weatherType;
        if (oldWeatherType !== scene.level.weatherType) {
            EventLoop_10.emitEvent(new GameEvent_13.GameEvent("system", "weather_changed", {
                from: oldWeatherType,
                to: scene.level.weatherType,
            }));
        }
    }
    return {
        setters: [
            function (GameEvent_13_1) {
                GameEvent_13 = GameEvent_13_1;
            },
            function (EventLoop_10_1) {
                EventLoop_10 = EventLoop_10_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (ActionData_3_1) {
                ActionData_3 = ActionData_3_1;
            },
            function (GraphicsEngine_10_1) {
                GraphicsEngine_10 = GraphicsEngine_10_1;
            },
            function (CanvasContext_1_1) {
                CanvasContext_1 = CanvasContext_1_1;
            },
            function (hero_1_1) {
                hero_1 = hero_1_1;
            },
            function (playerUi_1_1) {
                playerUi_1 = playerUi_1_1;
            },
            function (levels_1_1) {
                levels_1 = levels_1_1;
            },
            function (devHub_2_1) {
                devHub_2 = devHub_2_1;
            },
            function (TeleportToEndpointGameEvent_2_1) {
                TeleportToEndpointGameEvent_2 = TeleportToEndpointGameEvent_2_1;
            },
            function (controls_2_1) {
                controls_2 = controls_2_1;
            },
            function (MountGameEvent_2_1) {
                MountGameEvent_2 = MountGameEvent_2_1;
            },
            function (PlayerMessageGameEvent_2_1) {
                PlayerMessageGameEvent_2 = PlayerMessageGameEvent_2_1;
            },
            function (SwitchGameModeGameEvent_3_1) {
                SwitchGameModeGameEvent_3 = SwitchGameModeGameEvent_3_1;
            },
            function (AddObjectGameEvent_3_1) {
                AddObjectGameEvent_3 = AddObjectGameEvent_3_1;
            },
            function (TransferItemsGameEvent_4_1) {
                TransferItemsGameEvent_4 = TransferItemsGameEvent_4_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            },
            function (LoadLevelGameEvent_1_1) {
                LoadLevelGameEvent_1 = LoadLevelGameEvent_1_1;
            },
            function (RemoveObjectGameEvent_4_1) {
                RemoveObjectGameEvent_4 = RemoveObjectGameEvent_4_1;
            },
            function (TeleportToPositionGameEvent_1_1) {
                TeleportToPositionGameEvent_1 = TeleportToPositionGameEvent_1_1;
            },
            function (UIPanel_3_1) {
                UIPanel_3 = UIPanel_3_1;
            },
            function (UIInventory_1_1) {
                UIInventory_1 = UIInventory_1_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = new CanvasContext_1.CanvasContext(canvas);
            Game = class Game {
                constructor() {
                    this.mode = "scene"; // "dialog", "inventory", ...
                }
                handleEvent(ev) {
                    if (ev.type === SwitchGameModeGameEvent_3.SwitchGameModeGameEvent.type) {
                        const args = ev.args;
                        this.mode = args.to;
                        console.log(`Game mode switched from ${args.from} to ${args.to}.`);
                    }
                    else if (ev.type === TeleportToEndpointGameEvent_2.TeleportToEndpointGameEvent.type) {
                        const args = ev.args;
                        teleportToEndpoint(args.id, args.teleport, args.object);
                    }
                    else if (ev.type === TeleportToPositionGameEvent_1.TeleportToPositionGameEvent.type) {
                        const args = ev.args;
                        args.object.position = [...args.position];
                    }
                    else if (ev.type === MountGameEvent_2.MountGameEvent.type) {
                        const args = ev.args;
                        EventLoop_10.emitEvent(PlayerMessageGameEvent_2.PlayerMessageGameEvent.create(`${args.mounter.type} ${args.newState} ${args.mount.type}`));
                    }
                    else if (ev.type === PlayerMessageGameEvent_2.PlayerMessageGameEvent.type) {
                        // TODO: implement an actual player message in UI.
                        const args = ev.args;
                        const style = "color:steelblue;font-weight:bold;background-color:yellow";
                        console.log(`%c${args.message}`, style);
                    }
                    else if (ev.type === TransferItemsGameEvent_4.TransferItemsGameEvent.type) {
                        const args = ev.args;
                        if (args.items.find(x => x.type === "victory_item")) {
                            EventLoop_10.emitEvent(AddObjectGameEvent_3.AddObjectGameEvent.create(misc_4.createTextObject(`VICTORY!`, 6, 6)));
                        }
                    }
                    else if (ev.type === LoadLevelGameEvent_1.LoadLevelGameEvent.type) {
                        const args = ev.args;
                        loadLevel(args.level);
                    }
                }
                draw() {
                    scene.draw(ctx);
                    heroUi.draw(ctx);
                    if (this.mode === "dialog") {
                        drawDialog();
                    }
                    else if (this.mode === "inventory") {
                        drawInventory();
                    }
                    ctx.draw();
                }
                update(ticks) {
                    const collisionActionData = ActionData_3.getNpcCollisionAction(hero_1.hero);
                    if (collisionActionData) {
                        collisionActionData.action({
                            obj: collisionActionData.object,
                            initiator: hero_1.hero,
                            subject: collisionActionData.object,
                        });
                    }
                    scene.update(ticks);
                    heroUi.update(ticks, scene);
                }
            };
            game = new Game();
            scene = new Scene_1.Scene();
            debug = true;
            if (debug) {
                selectLevel(null, devHub_2.devHubLevel);
                scene.debugDisableGameTime = true;
                debugProgressDay(0.5);
            }
            exports_101("leftPad", leftPad = (canvas.width - GraphicsEngine_10.cellStyle.size.width * scene.camera.size.width) / 2);
            exports_101("topPad", topPad = (canvas.height - GraphicsEngine_10.cellStyle.size.height * scene.camera.size.height) / 2);
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, scene.camera);
            controls_2.enableGameInput();
            ticksPerStep = 33;
            startTime = new Date();
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            //
            weatherTypes = ["normal", "rain", "snow", "rain_and_snow", "mist", "heavy_mist"];
            window._ = {
                selectLevel: selectLevel,
                levels: levels_1.rawLevels,
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
            };
        }
    };
});
//# sourceMappingURL=app.js.map