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
                Equip: create("KeyQ", [0, 75, 25, 100]),
                DebugO: create("KeyO"),
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
System.register("utils/unicode", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function groupUnicode(line) {
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
    exports_4("groupUnicode", groupUnicode);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/data/Face", [], function (exports_5, context_5) {
    "use strict";
    var Faces, FaceHelper;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            exports_5("Faces", Faces = ["top", "right", "bottom", "left"]);
            FaceHelper = class FaceHelper {
                static getNextClockwise(face) {
                    const index = Faces.indexOf(face);
                    const nextFace = Faces[(index + 1) % Faces.length];
                    return nextFace;
                }
                static getOpposite(face) {
                    const index = Faces.indexOf(face);
                    const nextFace = Faces[(index + 2) % Faces.length];
                    return nextFace;
                }
            };
            exports_5("FaceHelper", FaceHelper);
        }
    };
});
System.register("engine/data/Vector2", [], function (exports_6, context_6) {
    "use strict";
    var Vector2;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Vector2 = class Vector2 {
                get width() {
                    return this.x;
                }
                get height() {
                    return this.y;
                }
                get length() {
                    return this.distanceTo(Vector2.zero);
                }
                constructor(x = 0, y = 0) {
                    this.x = x;
                    this.y = y;
                }
                clone() {
                    return new Vector2(this.x, this.y);
                }
                distanceTo(v) {
                    return Math.sqrt((this.x - v.x) ** 2 +
                        (this.y - v.y) ** 2);
                }
                equals(p) {
                    return (this.x === p.x &&
                        this.y === p.y);
                }
                getAt(index) {
                    switch (index) {
                        case 0: return this.x;
                        case 1: return this.y;
                        default: throw new Error(`Index is out of range: ${index}`);
                    }
                }
                setAt(index, value) {
                    switch (index) {
                        case 0:
                            this.x = value;
                            break;
                        case 1:
                            this.y = value;
                            break;
                        default: throw new Error(`Index is out of range: ${index}`);
                    }
                    return this;
                }
                add(v) {
                    this.x += v.x;
                    this.y += v.y;
                    return this;
                }
                sub(v) {
                    this.x -= v.x;
                    this.y -= v.y;
                    return this;
                }
                multiplyScalar(s) {
                    this.x *= s;
                    this.y *= s;
                    return this;
                }
                negate() {
                    this.x = -this.x;
                    this.y = -this.y;
                    return this;
                }
                max(v) {
                    this.x = Math.max(this.x, v.x);
                    this.y = Math.max(this.y, v.y);
                    return this;
                }
                to() {
                    return [this.x, this.y];
                }
                *[Symbol.iterator]() {
                    yield this.x;
                    yield this.y;
                }
                static from([x, y]) {
                    return new Vector2(x, y);
                }
                static get zero() {
                    return new Vector2();
                }
                static get top() {
                    return new Vector2(0, -1);
                }
                static get bottom() {
                    return new Vector2(0, +1);
                }
                static get left() {
                    return new Vector2(-1, 0);
                }
                static get right() {
                    return new Vector2(+1, 0);
                }
                static fromFace(face) {
                    switch (face) {
                        case "top": return Vector2.top;
                        case "right": return Vector2.right;
                        case "bottom": return Vector2.bottom;
                        case "left": return Vector2.left;
                    }
                }
                static add(p1, p2) {
                    return p1.add(p2);
                }
            };
            exports_6("Vector2", Vector2);
        }
    };
});
System.register("engine/graphics/Cell", [], function (exports_7, context_7) {
    "use strict";
    var Cell;
    var __moduleName = context_7 && context_7.id;
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
            exports_7("Cell", Cell);
        }
    };
});
System.register("engine/components/ObjectSkin", ["utils/unicode", "engine/data/Vector2", "engine/graphics/Cell"], function (exports_8, context_8) {
    "use strict";
    var unicode_1, Vector2_1, Cell_1, ObjectSkin;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (unicode_1_1) {
                unicode_1 = unicode_1_1;
            },
            function (Vector2_1_1) {
                Vector2_1 = Vector2_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            }
        ],
        execute: function () {
            ObjectSkin = class ObjectSkin {
                get size() {
                    var _a;
                    return new Vector2_1.Vector2(((_a = this.grid[0]) === null || _a === void 0 ? void 0 : _a.length) || 0, this.grid.length);
                }
                constructor(charactersMask = '', colorsMask = '', colors = {}) {
                    this.colorsMask = colorsMask;
                    this.colors = colors;
                    this.characters = [];
                    this.grid = [];
                    this.raw_colors = [];
                    this.raw_colors = this.getRawColors();
                    this.characters = charactersMask.split('\n');
                    this.grid = this.characters.map(unicode_1.groupUnicode);
                    // console.log(charactersMask, this.characters);
                }
                setForegroundAt([x, y], foreground) {
                    if (!this.raw_colors[y][x]) {
                        this.raw_colors[y][x] = [foreground, undefined];
                        return;
                    }
                    this.raw_colors[y][x][0] = foreground;
                }
                setBackgroundAt([x, y], background) {
                    if (!this.raw_colors[y][x]) {
                        this.raw_colors[y][x] = [undefined, background];
                        return;
                    }
                    this.raw_colors[y][x][1] = background;
                }
                isEmptyCellAt([x, y]) {
                    var _a, _b;
                    if (x < 0 || y < 0 || y >= this.grid.length || x >= this.grid[y].length) {
                        return true;
                    }
                    const emptyChar = ' ';
                    const char = ((_a = this.grid[y]) === null || _a === void 0 ? void 0 : _a[x]) || emptyChar;
                    const color = ((_b = this.raw_colors[y]) === null || _b === void 0 ? void 0 : _b[x]) || [undefined, undefined];
                    return char === emptyChar && !color[0] && !color[1];
                }
                getCellsAt(position) {
                    var _a, _b;
                    const cellColor = ((_a = this.raw_colors[position.y]) === null || _a === void 0 ? void 0 : _a[position.x]) || [undefined, 'transparent'];
                    const char = (_b = this.grid[position.y]) === null || _b === void 0 ? void 0 : _b[position.x];
                    const cell = new Cell_1.Cell(char, cellColor[0], cellColor[1]);
                    return [cell];
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
            };
            exports_8("ObjectSkin", ObjectSkin);
        }
    };
});
System.register("engine/data/Orientation", [], function (exports_9, context_9) {
    "use strict";
    var Orientations, OrientationHelper;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            exports_9("Orientations", Orientations = ["horizontal", "vertical"]);
            OrientationHelper = class OrientationHelper {
                static rotate(orientation) {
                    return orientation === "horizontal"
                        ? "vertical"
                        : "horizontal";
                }
            };
            exports_9("OrientationHelper", OrientationHelper);
        }
    };
});
System.register("engine/data/Sides", ["engine/data/Face"], function (exports_10, context_10) {
    "use strict";
    var Face_1, SidesHelper;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (Face_1_1) {
                Face_1 = Face_1_1;
            }
        ],
        execute: function () {
            SidesHelper = class SidesHelper {
                static horizontal() {
                    return { left: true, right: true, };
                }
                static vertical() {
                    return { top: true, bottom: true, };
                }
                static all() {
                    return Object.fromEntries(Face_1.Faces.map(x => [x, true]));
                }
                static fromOrientation(orientation) {
                    return orientation === "horizontal"
                        ? this.horizontal()
                        : this.vertical();
                }
            };
            exports_10("SidesHelper", SidesHelper);
        }
    };
});
System.register("engine/components/SignalCell", [], function (exports_11, context_11) {
    "use strict";
    var SignalTypes;
    var __moduleName = context_11 && context_11.id;
    function isAnISignalInit(obj) {
        return ("initialize" in obj &&
            typeof obj.initialize === "function");
    }
    exports_11("isAnISignalInit", isAnISignalInit);
    function isAnISignalSource(obj) {
        return ("updateSource" in obj &&
            typeof obj.updateSource === "function");
    }
    exports_11("isAnISignalSource", isAnISignalSource);
    function isAnISignalProcessor(obj) {
        return ("processSignalTransfer" in obj &&
            typeof obj.processSignalTransfer === "function");
    }
    exports_11("isAnISignalProcessor", isAnISignalProcessor);
    return {
        setters: [],
        execute: function () {
            exports_11("SignalTypes", SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"]);
            ;
        }
    };
});
System.register("engine/components/ObjectPhysics", [], function (exports_12, context_12) {
    "use strict";
    var ObjectPhysics;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '', topMask = '', transparencyMask = '') {
                    this.signalCells = [];
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                    this.temperatures = temperatureMask.split('\n');
                    this.tops = topMask.split('\n');
                    this.transparency = transparencyMask !== ''
                        ? transparencyMask.split('\n')
                        : this.collisions.map(x => x === '.' ? 'F' : '0');
                }
            };
            exports_12("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("engine/graphics/CellInfo", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Behavior", [], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Item", ["engine/objects/SceneObject", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_15, context_15) {
    "use strict";
    var SceneObject_1, ObjectPhysics_1, Vector2_2, Item;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            },
            function (Vector2_2_1) {
                Vector2_2 = Vector2_2_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics = new ObjectPhysics_1.ObjectPhysics(), position = Vector2_2.Vector2.zero) {
                    super(originPoint, skin, physics, position);
                }
                setUsage(action) {
                    this.setAction({
                        type: "usage",
                        action,
                    });
                }
                static create(type, skin, physics = new ObjectPhysics_1.ObjectPhysics()) {
                    const item = new Item(Vector2_2.Vector2.zero, skin, physics);
                    item.type = type;
                    return item;
                }
            };
            exports_15("Item", Item);
        }
    };
});
System.register("engine/objects/Equipment", ["engine/data/Vector2"], function (exports_16, context_16) {
    "use strict";
    var Vector2_3, Equipment;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (Vector2_3_1) {
                Vector2_3 = Vector2_3_1;
            }
        ],
        execute: function () {
            Equipment = class Equipment {
                get objects() {
                    return [
                        this.objectWearable,
                        this.objectInMainHand,
                        this.objectInSecondaryHand,
                    ];
                }
                constructor(object) {
                    this.object = object;
                    this.items = [];
                    this.objectWearable = null;
                    this.objectInMainHand = null;
                    this.objectInSecondaryHand = null;
                    this._lastObjectInMainHand = null;
                }
                toggleEquip() {
                    if (this.objectInMainHand) {
                        this._lastObjectInMainHand = this.objectInMainHand;
                        this.unequipObjectInMainHand();
                    }
                    else if (this._lastObjectInMainHand) {
                        this.equipObjectInMainHand(this._lastObjectInMainHand);
                    }
                }
                equip(item) {
                    // TODO: event and player message.
                    const itemTypeStyle = "color:blue;font-weight:bold;";
                    const defaultStyle = "color:black;font-weight:normal;";
                    // TODO: unequip wearable.
                    if (item === this.objectWearable) {
                        this.objectWearable = null;
                        item.parent = null;
                        console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                        return;
                    }
                    // TODO: wearable category.
                    if (item.type === "glasses") {
                        this.objectWearable = item;
                        item.parent = this.object;
                        item.position = Vector2_3.Vector2.zero;
                        console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                        return;
                    }
                    // TODO: unequip handhold-equippable.
                    if (item === this.objectInMainHand) {
                        this.unequipObjectInMainHand();
                        return;
                    }
                    // TODO: check if item is equippable and if it is handhold-equippable.
                    if (item === this.objectInSecondaryHand) {
                        this.objectInSecondaryHand = null;
                        item.parent = null;
                        item.position = Vector2_3.Vector2.zero;
                    }
                    this.equipObjectInMainHand(item);
                    // TODO: equippable items categories
                    //this.items.push(item);
                }
                equipObjectInMainHand(item) {
                    // TODO: event and player message.
                    const itemTypeStyle = "color:blue;font-weight:bold;";
                    const defaultStyle = "color:black;font-weight:normal;";
                    if (item) {
                        this.objectInMainHand = item;
                        item.parent = this.object;
                        item.position = this.object.direction.clone();
                        console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                    }
                }
                unequipObjectInMainHand() {
                    // TODO: event and player message.
                    const itemTypeStyle = "color:blue;font-weight:bold;";
                    const defaultStyle = "color:black;font-weight:normal;";
                    const item = this.objectInMainHand;
                    if (item) {
                        this.objectInMainHand = null;
                        item.parent = null;
                        item.position = Vector2_3.Vector2.zero;
                        console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                    }
                }
            };
            exports_16("Equipment", Equipment);
        }
    };
});
System.register("engine/objects/TileCategory", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/data/SpriteInfo", [], function (exports_18, context_18) {
    "use strict";
    var SpriteInfo;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            exports_18("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["utils/unicode", "engine/components/ObjectSkin", "engine/data/SpriteInfo"], function (exports_19, context_19) {
    "use strict";
    var unicode_2, ObjectSkin_1, SpriteInfo_1, Sprite;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (unicode_2_1) {
                unicode_2 = unicode_2_1;
            },
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
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
                static parseSimple(str) {
                    const sprite = new Sprite();
                    const groups = unicode_2.groupUnicode(str);
                    // TODO: grouping is wrong for invertor.
                    //console.log(groups);
                    for (const [index, char] of groups.entries()) {
                        const name = index.toString();
                        const skin = new ObjectSkin_1.ObjectSkin(char, '.', { '.': [undefined, 'transparent'] });
                        sprite.frames[name] = [skin];
                    }
                    return sprite;
                }
                // TODO: group unicode characters in frames.
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
                                sprite.frames[name].push(new ObjectSkin_1.ObjectSkin(bodies[k], colors[k], colorsDict));
                            }
                        }
                        else {
                            i += 1;
                        }
                    }
                    return sprite;
                }
            };
            exports_19("Sprite", Sprite);
        }
    };
});
System.register("world/sprites/waterRippleSprite", ["engine/data/Sprite"], function (exports_20, context_20) {
    "use strict";
    var Sprite_1, waterRippleSpriteRaw, waterRippleSprite;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            }
        ],
        execute: function () {
            waterRippleSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#082e54,transparent

particle
·◌○⨀Ⓞ◯
RRRRRR`;
            exports_20("waterRippleSprite", waterRippleSprite = Sprite_1.Sprite.parse(waterRippleSpriteRaw));
        }
    };
});
System.register("engine/objects/Particle", ["engine/components/ObjectPhysics", "engine/data/Vector2", "engine/objects/SceneObject"], function (exports_21, context_21) {
    "use strict";
    var ObjectPhysics_2, Vector2_4, SceneObject_2, Particle;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            },
            function (Vector2_4_1) {
                Vector2_4 = Vector2_4_1;
            },
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            }
        ],
        execute: function () {
            Particle = class Particle extends SceneObject_2.SceneObject {
                constructor(sprite, position, state, options = {
                    decaySpeed: 1000,
                }) {
                    const initialFrame = Particle.getFrameSkinAt(sprite, state);
                    super(Vector2_4.Vector2.zero, initialFrame, new ObjectPhysics_2.ObjectPhysics(), position);
                    this.sprite = sprite;
                    this.state = state;
                    this.options = options;
                    this.decayTicks = 0;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    if (this.options.decaySpeed) {
                        this.decayTicks += ticks;
                        const decayTicksOverflow = this.decayTicks - this.options.decaySpeed;
                        if (decayTicksOverflow >= 0) {
                            if (!this.hasNext()) {
                                this.onRemove(scene);
                            }
                            else {
                                this.next();
                                this.onNext(scene);
                            }
                            this.decayTicks = decayTicksOverflow;
                        }
                    }
                }
                onNext(scene) {
                }
                onRemove(scene) {
                    scene.removeParticle(this);
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
                reset() {
                    this.state = 0;
                    this.skin = Particle.getFrameSkinAt(this.sprite, this.state);
                }
                static getFrameSkinAt(sprite, index) {
                    const frame = sprite.frames[Particle.defaultFrameName];
                    return frame[index % frame.length];
                }
            };
            exports_21("Particle", Particle);
            Particle.defaultFrameName = 'particle';
        }
    };
});
System.register("engine/objects/Tile", ["engine/objects/SceneObject", "engine/components/ObjectPhysics", "world/sprites/waterRippleSprite", "engine/objects/Particle", "engine/data/Vector2"], function (exports_22, context_22) {
    "use strict";
    var SceneObject_3, ObjectPhysics_3, waterRippleSprite_1, Particle_1, Vector2_5, Tile;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            },
            function (waterRippleSprite_1_1) {
                waterRippleSprite_1 = waterRippleSprite_1_1;
            },
            function (Particle_1_1) {
                Particle_1 = Particle_1_1;
            },
            function (Vector2_5_1) {
                Vector2_5 = Vector2_5_1;
            }
        ],
        execute: function () {
            Tile = class Tile extends SceneObject_3.SceneObject {
                get totalMovementPenalty() {
                    return this.movementPenalty * (1 - 0.1 * this.snowLevel);
                }
                constructor(skin, position) {
                    super(Vector2_5.Vector2.zero, skin, new ObjectPhysics_3.ObjectPhysics(), position);
                    this.movementPenalty = 1;
                    this.snowLevel = 0;
                    this.snowTicks = 0;
                    this.disturbanceLevel = 0;
                    this.disturbanceTicks = 0;
                    this.disturbanceMaxValue = waterRippleSprite_1.waterRippleSprite.frames[Particle_1.Particle.defaultFrameName].length;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    if (this.category === "solid") {
                        this.snowTicks += SceneObject_3.SceneObject.updateValue(this.snowTicks, ticks, 3000, () => {
                            const temp = scene.getTemperatureAt(this.position);
                            if (temp >= 8) {
                                this.decreaseSnow();
                            }
                        });
                    }
                    else if (this.category === "liquid" && this.isDisturbed) {
                        this.disturbanceTicks = SceneObject_3.SceneObject.updateValue(this.disturbanceTicks, ticks, 200, () => {
                            this.disturbanceLevel = SceneObject_3.SceneObject.updateValue(this.disturbanceLevel, 1, this.disturbanceMaxValue, () => {
                                this.isDisturbed = false;
                            });
                        });
                    }
                }
                increaseSnow() {
                    if (this.category !== "solid" || this.snowLevel >= Tile.maxSnowLevel) {
                        return;
                    }
                    this.snowLevel += 1;
                }
                decreaseSnow() {
                    if (this.category !== "solid" || this.snowLevel === 0) {
                        return;
                    }
                    this.snowLevel -= 1;
                }
                addDisturbance() {
                    if (this.category !== "liquid") {
                        return;
                    }
                    this.isDisturbed = true;
                }
            };
            exports_22("Tile", Tile);
            Tile.maxSnowLevel = 4;
        }
    };
});
System.register("engine/objects/NpcMovementOptions", [], function (exports_23, context_23) {
    "use strict";
    var NpcMovementOptions, defaultMovementOptions;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
            // Number values are in cells per second.
            NpcMovementOptions = class NpcMovementOptions {
            };
            exports_23("NpcMovementOptions", NpcMovementOptions);
            exports_23("defaultMovementOptions", defaultMovementOptions = {
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
System.register("engine/objects/Npc", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Equipment", "engine/objects/NpcMovementOptions", "engine/data/Vector2", "engine/data/Face"], function (exports_24, context_24) {
    "use strict";
    var SceneObject_4, ObjectSkin_2, ObjectPhysics_4, EventLoop_1, GameEvent_1, Equipment_1, NpcMovementOptions_1, Vector2_6, Face_2, Npc;
    var __moduleName = context_24 && context_24.id;
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
            },
            function (Vector2_6_1) {
                Vector2_6 = Vector2_6_1;
            },
            function (Face_2_1) {
                Face_2 = Face_2_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_4.SceneObject {
                get children() {
                    return [...super.children, ...this.equipment.objects, this.mount]
                        .filter(x => x);
                }
                get direction() {
                    return this._direction;
                }
                set direction(value) {
                    if (!this._direction.equals(value)) {
                        this._direction = value.clone();
                        this.moveEquippedItems();
                    }
                }
                get attackValue() {
                    return this.basicAttack; // @todo
                }
                get cursorPosition() {
                    return this.position.clone().add(this.direction);
                }
                constructor(skin = new ObjectSkin_2.ObjectSkin(), position = Vector2_6.Vector2.zero, originPoint = Vector2_6.Vector2.zero) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics(`.`, ``), position);
                    this._direction = new Vector2_6.Vector2(0, 1);
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
                    var _a, _b, _c;
                    const obj = this;
                    if (!obj.scene) {
                        console.error("Can not move. Object is not bound to scene.");
                        return;
                    }
                    const nextPos = obj.cursorPosition;
                    const tile = (_a = obj.scene.level.tiles[nextPos.y]) === null || _a === void 0 ? void 0 : _a[nextPos.x];
                    obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);
                    const moveSpeed = this.calculateMoveSpeed(tile);
                    const moveSpeedPenalty = obj.moveSpeedPenalty;
                    const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
                    if (resultSpeed <= 0) {
                        return;
                    }
                    if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
                        if (obj.realm === "ground") {
                            const tile = (_b = this.scene) === null || _b === void 0 ? void 0 : _b.getTileAt(obj.position);
                            tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                        }
                        // Assign to trigger property.
                        obj.position = obj.position.add(obj.direction);
                        if (obj.realm === "ground") {
                            const tile = (_c = this.scene) === null || _c === void 0 ? void 0 : _c.getTileAt(obj.position);
                            tile === null || tile === void 0 ? void 0 : tile.decreaseSnow();
                        }
                        //
                        obj.moveTick = 0;
                    }
                }
                moveEquippedItems() {
                    const obj = this;
                    if (obj.equipment.objectInMainHand) {
                        obj.equipment.objectInMainHand.position = obj.direction.clone();
                    }
                    if (obj.equipment.objectInSecondaryHand) {
                        obj.equipment.objectInSecondaryHand.position = new Vector2_6.Vector2(obj.direction.y, obj.direction.x); // TODO: rotate vector.
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
                    return this.position.distanceTo(other.position);
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
                        const position = this.position.clone().add(pd.direction);
                        if (enemiesNearby.length) {
                            const distances = enemiesNearby.map(x => position.distanceTo(x.position));
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
                        const position = this.position.clone().add(pd.direction);
                        pd.distance = position.distanceTo(target.position);
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
                        const randomIndex = Math.random() * Face_2.Faces.length | 0;
                        this.direction = Vector2_6.Vector2.fromFace(Face_2.Faces[randomIndex]);
                    }
                }
                getFreeDirections() {
                    // Detect all possible free positions.
                    const directions = Face_2.Faces
                        .map(x => Vector2_6.Vector2.fromFace(x))
                        .map(direction => {
                        return ({
                            direction,
                            isBlocked: this.scene.isPositionBlocked(this.position.clone().add(direction))
                        });
                    })
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
                        this.direction = freeDirections[0].clone();
                        this.move();
                        return;
                    }
                    // Select random free position.
                    const randomIndex = Math.random() * freeDirections.length | 0;
                    this.direction = freeDirections[randomIndex].clone();
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
            exports_24("Npc", Npc);
        }
    };
});
System.register("world/sprites/fallingAshSprite", ["engine/data/Sprite"], function (exports_25, context_25) {
    "use strict";
    var Sprite_2, fallingAshSpriteRaw, fallingAshSprite;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (Sprite_2_1) {
                Sprite_2 = Sprite_2_1;
            }
        ],
        execute: function () {
            fallingAshSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#aaa9,transparent

particle
ᣟ˙·.
RRRR`;
            exports_25("fallingAshSprite", fallingAshSprite = Sprite_2.Sprite.parse(fallingAshSpriteRaw));
        }
    };
});
System.register("world/objects/particles/WeatherParticle", ["engine/objects/Particle"], function (exports_26, context_26) {
    "use strict";
    var Particle_2, WeatherParticle;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (Particle_2_1) {
                Particle_2 = Particle_2_1;
            }
        ],
        execute: function () {
            WeatherParticle = class WeatherParticle extends Particle_2.Particle {
                constructor(sprite, position, state = 0) {
                    super(sprite, position, state, {
                        decaySpeed: WeatherParticle.DefaultDecaySpeed,
                    });
                }
                onRemove(scene) {
                    scene.removeWeatherParticle(this);
                }
            };
            exports_26("WeatherParticle", WeatherParticle);
            WeatherParticle.DefaultDecaySpeed = 300;
        }
    };
});
System.register("world/objects/particles/FallingAsh", ["world/sprites/fallingAshSprite", "world/objects/particles/WeatherParticle"], function (exports_27, context_27) {
    "use strict";
    var fallingAshSprite_1, WeatherParticle_1, FallingAsh;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (fallingAshSprite_1_1) {
                fallingAshSprite_1 = fallingAshSprite_1_1;
            },
            function (WeatherParticle_1_1) {
                WeatherParticle_1 = WeatherParticle_1_1;
            }
        ],
        execute: function () {
            FallingAsh = class FallingAsh extends WeatherParticle_1.WeatherParticle {
                constructor(position, state = 0) {
                    super(fallingAshSprite_1.fallingAshSprite, position, state);
                    this.type = "falling_ash";
                }
                onRemove(scene) {
                    super.onRemove(scene);
                    const tile = scene.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                }
            };
            exports_27("FallingAsh", FallingAsh);
        }
    };
});
System.register("world/sprites/rainDropSprite", ["engine/data/Sprite"], function (exports_28, context_28) {
    "use strict";
    var Sprite_3, rainDropSpriteRaw, rainDropSprite;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (Sprite_3_1) {
                Sprite_3 = Sprite_3_1;
            }
        ],
        execute: function () {
            exports_28("rainDropSpriteRaw", rainDropSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0ff9,transparent

particle
ᣟ˙·.
RRRR`);
            exports_28("rainDropSprite", rainDropSprite = Sprite_3.Sprite.parse(rainDropSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Raindrop", ["world/sprites/rainDropSprite", "world/objects/particles/WeatherParticle"], function (exports_29, context_29) {
    "use strict";
    var rainDropSprite_1, WeatherParticle_2, Raindrop;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (rainDropSprite_1_1) {
                rainDropSprite_1 = rainDropSprite_1_1;
            },
            function (WeatherParticle_2_1) {
                WeatherParticle_2 = WeatherParticle_2_1;
            }
        ],
        execute: function () {
            Raindrop = class Raindrop extends WeatherParticle_2.WeatherParticle {
                constructor(position, state = 0) {
                    super(rainDropSprite_1.rainDropSprite, position, state);
                    this.type = "raindrop";
                }
                onRemove(scene) {
                    super.onRemove(scene);
                    const tile = scene.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                }
            };
            exports_29("Raindrop", Raindrop);
        }
    };
});
System.register("world/sprites/snowFlakeSprite", ["engine/data/Sprite"], function (exports_30, context_30) {
    "use strict";
    var Sprite_4, snowFlakeSpriteRaw, snowFlakeSprite;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (Sprite_4_1) {
                Sprite_4 = Sprite_4_1;
            }
        ],
        execute: function () {
            exports_30("snowFlakeSpriteRaw", snowFlakeSpriteRaw = `width:1
height:1
name:
empty:'
color:S,#fff9,transparent

particle
❆❅✶•·.
SSSSSS`);
            exports_30("snowFlakeSprite", snowFlakeSprite = Sprite_4.Sprite.parse(snowFlakeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Snowflake", ["world/sprites/snowFlakeSprite", "world/objects/particles/WeatherParticle"], function (exports_31, context_31) {
    "use strict";
    var snowFlakeSprite_1, WeatherParticle_3, Snowflake;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (snowFlakeSprite_1_1) {
                snowFlakeSprite_1 = snowFlakeSprite_1_1;
            },
            function (WeatherParticle_3_1) {
                WeatherParticle_3 = WeatherParticle_3_1;
            }
        ],
        execute: function () {
            Snowflake = class Snowflake extends WeatherParticle_3.WeatherParticle {
                constructor(position, state = 0) {
                    super(snowFlakeSprite_1.snowFlakeSprite, position, state);
                    this.type = "snowflake";
                }
                onRemove(scene) {
                    super.onRemove(scene);
                    const tile = scene.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                    tile === null || tile === void 0 ? void 0 : tile.increaseSnow();
                }
            };
            exports_31("Snowflake", Snowflake);
        }
    };
});
System.register("world/sprites/mistSprite", ["engine/data/Sprite"], function (exports_32, context_32) {
    "use strict";
    var Sprite_5, mistSpriteRaw, mistSprite;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (Sprite_5_1) {
                Sprite_5 = Sprite_5_1;
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
            exports_32("mistSprite", mistSprite = Sprite_5.Sprite.parse(mistSpriteRaw));
        }
    };
});
System.register("engine/WeatherSystem", ["world/objects/particles/FallingAsh", "world/objects/particles/Raindrop", "world/objects/particles/Snowflake", "world/sprites/mistSprite", "engine/objects/Particle"], function (exports_33, context_33) {
    "use strict";
    var FallingAsh_1, Raindrop_1, Snowflake_1, mistSprite_1, Particle_3, weatherTypes;
    var __moduleName = context_33 && context_33.id;
    function createWeatherParticle(weatherType, p) {
        const state = 0; //Math.random() * 100 | 0;  // TODO: random/large state is not working.
        if (weatherType === 'rain') {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new Raindrop_1.Raindrop(p, state)
                : undefined;
        }
        else if (weatherType === 'ashfall') {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new FallingAsh_1.FallingAsh(p, state)
                : undefined;
        }
        else if (weatherType === "snow") {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new Snowflake_1.Snowflake(p, state)
                : undefined;
        }
        else if (weatherType === "rain_and_snow") {
            const probability = 0.1;
            const r = Math.random() / probability | 0;
            return r === 0
                ? new Raindrop_1.Raindrop(p, state)
                : (r === 1 ? new Snowflake_1.Snowflake(p, state) : undefined);
        }
        else if (weatherType === "mist") {
            const probability = 0.1;
            return (Math.random() / probability | 0) === 0
                ? new Particle_3.Particle(mistSprite_1.mistSprite, p, state, {
                    decaySpeed: 300,
                })
                : undefined;
        }
        return undefined;
    }
    exports_33("createWeatherParticle", createWeatherParticle);
    function getWeatherSkyTransparency(weatherType) {
        switch (weatherType) {
            case 'rain':
            case 'ashfall':
            case 'snow':
            case 'rain_and_snow':
                return 0.8;
            case 'mist':
                return 0.7;
            default:
                return 1;
        }
    }
    exports_33("getWeatherSkyTransparency", getWeatherSkyTransparency);
    return {
        setters: [
            function (FallingAsh_1_1) {
                FallingAsh_1 = FallingAsh_1_1;
            },
            function (Raindrop_1_1) {
                Raindrop_1 = Raindrop_1_1;
            },
            function (Snowflake_1_1) {
                Snowflake_1 = Snowflake_1_1;
            },
            function (mistSprite_1_1) {
                mistSprite_1 = mistSprite_1_1;
            },
            function (Particle_3_1) {
                Particle_3 = Particle_3_1;
            }
        ],
        execute: function () {
            exports_33("weatherTypes", weatherTypes = ["normal", "rain", "ashfall", "snow", "rain_and_snow", "mist", "heavy_mist"]);
        }
    };
});
System.register("utils/layer", ["engine/data/Vector2"], function (exports_34, context_34) {
    "use strict";
    var Vector2_7;
    var __moduleName = context_34 && context_34.id;
    function fillLayer(size, defaultValue, layer = []) {
        for (let y = 0; y < size.height; y++) {
            if (!layer[y]) {
                layer[y] = [];
            }
            for (let x = 0; x < size.width; x++) {
                if (!layer[y][x]) {
                    layer[y][x] = defaultValue;
                }
            }
        }
        return layer;
    }
    exports_34("fillLayer", fillLayer);
    function fillLayerWith(size, valueFactory, layer = []) {
        for (let y = 0; y < size.height; y++) {
            if (!layer[y]) {
                layer[y] = [];
            }
            for (let x = 0; x < size.width; x++) {
                layer[y][x] = valueFactory(new Vector2_7.Vector2(x, y));
            }
        }
        return layer;
    }
    exports_34("fillLayerWith", fillLayerWith);
    function forLayerOf(layer, iteration, defaultValue) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer[y][x] || defaultValue);
            }
        }
    }
    exports_34("forLayerOf", forLayerOf);
    function forLayer(layer, iteration) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer, new Vector2_7.Vector2(x, y), layer[y][x]);
            }
        }
    }
    exports_34("forLayer", forLayer);
    function mapLayer(layer, converter) {
        const newLayer = [];
        for (let y = 0; y < layer.length; y++) {
            if (!newLayer[y]) {
                newLayer[y] = [];
            }
            for (let x = 0; x < layer[y].length; x++) {
                newLayer[y][x] = converter(layer[y][x], new Vector2_7.Vector2(x, y));
            }
        }
        return newLayer;
    }
    exports_34("mapLayer", mapLayer);
    return {
        setters: [
            function (Vector2_7_1) {
                Vector2_7 = Vector2_7_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/data/Box2", [], function (exports_35, context_35) {
    "use strict";
    var Box2;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [],
        execute: function () {
            Box2 = class Box2 {
                constructor(min, max) {
                    this.min = min;
                    this.max = max;
                }
                clone() {
                    return new Box2(this.min.clone(), this.max.clone());
                }
                containsPoint(position) {
                    return (position.x >= this.min.x &&
                        position.y >= this.min.y &&
                        position.x <= this.max.x &&
                        position.y <= this.max.y);
                }
                expandByVector(v) {
                    this.min.sub(v);
                    this.max.add(v);
                    return this;
                }
            };
            exports_35("Box2", Box2);
        }
    };
});
System.register("engine/objects/StaticGameObject", ["engine/objects/SceneObject", "engine/data/Vector2"], function (exports_36, context_36) {
    "use strict";
    var SceneObject_5, Vector2_8, StaticGameObject;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (SceneObject_5_1) {
                SceneObject_5 = SceneObject_5_1;
            },
            function (Vector2_8_1) {
                Vector2_8 = Vector2_8_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_5.SceneObject {
                constructor(originPoint, skin, physics, position = Vector2_8.Vector2.zero) {
                    super(originPoint, skin, physics, position);
                }
            };
            exports_36("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("engine/signaling/SignalProcessor", ["utils/layer", "engine/components/SignalCell", "engine/data/Box2", "engine/data/Face", "engine/data/Vector2"], function (exports_37, context_37) {
    "use strict";
    var layer_1, SignalCell_1, Box2_1, Face_3, Vector2_9, SignalProcessor;
    var __moduleName = context_37 && context_37.id;
    function visitorEquals(v1, v2) {
        return (v1.position.equals(v2.position) &&
            v1.direction === v2.direction &&
            v1.signalType === v2.signalType);
    }
    return {
        setters: [
            function (layer_1_1) {
                layer_1 = layer_1_1;
            },
            function (SignalCell_1_1) {
                SignalCell_1 = SignalCell_1_1;
            },
            function (Box2_1_1) {
                Box2_1 = Box2_1_1;
            },
            function (Face_3_1) {
                Face_3 = Face_3_1;
            },
            function (Vector2_9_1) {
                Vector2_9 = Vector2_9_1;
            }
        ],
        execute: function () {
            SignalProcessor = class SignalProcessor {
                constructor(level) {
                    this.level = level;
                    this.signalLayer = [];
                }
                update(scene) {
                    // clear
                    this.clearLayer();
                    const signalObjects = [...this.level.objects.filter(x => x.enabled)];
                    // Clear all cells signals.
                    for (const obj of signalObjects) {
                        if (SignalCell_1.isAnISignalInit(obj)) {
                            obj.initialize();
                        }
                    }
                    for (const obj of signalObjects) {
                        //TODO: only 1 cell object will work here.
                        this.updateSignalSource(obj, scene);
                    }
                }
                updateSignalSource(object, scene) {
                    if (!SignalCell_1.isAnISignalSource(object)) {
                        return;
                    }
                    const outputs = object.updateSource(scene);
                    this.registerOutputsAt(object.position, outputs);
                    const visited = [];
                    for (const output of outputs) {
                        //TODO: only 1 cell object will work here.
                        const outputPosition = object.position.clone().add(Vector2_9.Vector2.fromFace(output.direction));
                        const inputDirection = Face_3.FaceHelper.getOpposite(output.direction);
                        this.processSignalAt(outputPosition, inputDirection, output.signal, visited);
                    }
                }
                processSignalAt(position, direction, signal, visited) {
                    const visitor = { position, direction, signalType: signal.type };
                    if (visited.find(x => visitorEquals(x, visitor))) {
                        return;
                    }
                    visited.push(visitor);
                    const result = this.getSignalCellAt(position);
                    if (!result) {
                        return;
                    }
                    const { cell: signalCell, object } = result;
                    if (!SignalCell_1.isAnISignalProcessor(object)) {
                        return;
                    }
                    const input = { signal, direction };
                    const outputs = object.processSignalTransfer(input);
                    this.registerOutputsAt(object.position, outputs);
                    for (const output of outputs) {
                        const outputPosition = position.clone().add(Vector2_9.Vector2.fromFace(output.direction));
                        const inputDirection = Face_3.FaceHelper.getOpposite(output.direction);
                        this.processSignalAt(outputPosition, inputDirection, output.signal, visited);
                    }
                }
                clearLayer() {
                    this.signalLayer = layer_1.fillLayer(this.level.size, undefined);
                }
                registerOutputsAt(pos, outputs) {
                    if (outputs.length === 0) {
                        return;
                    }
                    this.signalLayer[pos.y][pos.x] = Math.max(...outputs.map(x => x.signal.value));
                }
                getSignalCellAt(position) {
                    const levelBox = new Box2_1.Box2(new Vector2_9.Vector2(), this.level.size.clone().sub(new Vector2_9.Vector2(1, 1)));
                    if (!levelBox.containsPoint(position)) {
                        return undefined;
                    }
                    for (const obj of this.level.objects) {
                        if (!obj.enabled)
                            continue;
                        const objOriginPos = obj.position.clone().sub(obj.originPoint);
                        for (const signalCell of obj.physics.signalCells) {
                            const signalCellPos = objOriginPos.clone().add(signalCell.position);
                            if (signalCellPos.equals(position)) {
                                return { cell: signalCell, object: obj };
                            }
                        }
                    }
                    return undefined;
                }
            };
            exports_37("SignalProcessor", SignalProcessor);
        }
    };
});
System.register("engine/Level", ["engine/data/Vector2", "engine/events/EventLoop", "engine/events/GameEvent", "engine/signaling/SignalProcessor"], function (exports_38, context_38) {
    "use strict";
    var Vector2_10, EventLoop_2, GameEvent_2, SignalProcessor_1, Level;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (Vector2_10_1) {
                Vector2_10 = Vector2_10_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            },
            function (SignalProcessor_1_1) {
                SignalProcessor_1 = SignalProcessor_1_1;
            }
        ],
        execute: function () {
            Level = class Level {
                get isWindy() {
                    return this.wind.length !== 0;
                }
                constructor(id, objects, tiles) {
                    this.id = id;
                    this.objects = objects;
                    this.tiles = tiles;
                    this._isLoaded = false;
                    this.blockedLayer = [];
                    this.transparencyLayer = [];
                    this.signalProcessor = new SignalProcessor_1.SignalProcessor(this);
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
                    this.particles = [];
                    this.weatherType = 'normal';
                    this.wind = Vector2_10.Vector2.zero;
                    this.windTicks = 0;
                    this.ambientLightColor = [255, 255, 255];
                    this.portals = {};
                    const height = tiles.length;
                    this.size = new Vector2_10.Vector2(height > 0 ? tiles[0].length : 0, height);
                    for (const object of objects) {
                        object.bindToLevel(this);
                    }
                }
                update(ticks, scene) {
                    this.weatherTicks += ticks;
                    this.windTicks += ticks;
                    this.temperatureTicks += ticks;
                }
                onLoaded(scene) {
                    if (this._isLoaded) {
                        return;
                    }
                    // Emit initial level events.
                    const level = this;
                    EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "weather_changed", { from: level.weatherType, to: level.weatherType }));
                    EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "wind_changed", { from: level.isWindy, to: level.isWindy }));
                    this._isLoaded = true;
                }
                changeWeather(weatherType) {
                    const oldWeatherType = this.weatherType;
                    this.weatherType = weatherType;
                    if (oldWeatherType !== this.weatherType) {
                        EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "weather_changed", {
                            from: oldWeatherType,
                            to: this.weatherType,
                        }));
                    }
                }
            };
            exports_38("Level", Level);
        }
    };
});
System.register("engine/Camera", ["engine/data/Vector2"], function (exports_39, context_39) {
    "use strict";
    var Vector2_11, followOffset, Camera;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (Vector2_11_1) {
                Vector2_11 = Vector2_11_1;
            }
        ],
        execute: function () {
            followOffset = 4;
            Camera = class Camera {
                constructor() {
                    this.position = Vector2_11.Vector2.zero;
                    this.size = new Vector2_11.Vector2(20, 20);
                    this.npc = null;
                    this.level = null;
                }
                follow(npc, level) {
                    this.npc = npc;
                    this.level = level;
                }
                // TODO: use Vector2.clamp.
                update() {
                    if (this.npc && this.level) {
                        const cameraRightBottom = this.position.clone().add(this.size).sub(new Vector2_11.Vector2(1, 1));
                        const leftRel = this.npc.position.x - this.position.x;
                        if (leftRel < followOffset) {
                            this.position.x = (Math.max(0, this.npc.position.x - followOffset));
                        }
                        const topRel = this.npc.position.y - this.position.y;
                        if (topRel < followOffset) {
                            this.position.y = (Math.max(0, this.npc.position.y - followOffset));
                        }
                        const rightRel = cameraRightBottom.x - this.npc.position.x;
                        if (rightRel < followOffset) {
                            this.position.x = (Math.min(this.level.size.width - this.size.width, this.npc.position.x - (this.size.width - 1) + followOffset));
                        }
                        const bottomRel = cameraRightBottom.y - this.npc.position.y;
                        if (bottomRel < followOffset) {
                            this.position.y = (Math.min(this.level.size.height - this.size.height, this.npc.position.y - (this.size.height - 1) + followOffset));
                        }
                        if (cameraRightBottom.x > this.level.size.width) {
                            this.position.x = (this.level.size.width - this.size.width);
                        }
                        if (cameraRightBottom.y > this.level.size.height) {
                            this.position.y = (this.level.size.height - this.size.height);
                        }
                    }
                }
            };
            exports_39("Camera", Camera);
        }
    };
});
System.register("engine/graphics/GraphicsEngine", ["engine/objects/Npc", "engine/data/Vector2", "engine/data/Face", "engine/data/Box2"], function (exports_40, context_40) {
    "use strict";
    var Npc_1, Vector2_12, Face_4, Box2_2, GraphicsEngine, cellStyle, emptyCollisionChar;
    var __moduleName = context_40 && context_40.id;
    function drawObjects(ctx, camera, objects) {
        const importantObjects = objects.filter(x => x.important);
        for (const object of objects) {
            if (!object.enabled) {
                continue;
            }
            drawObject(ctx, camera, object, importantObjects);
            for (const childObject of object.children) {
                drawObject(ctx, camera, childObject, importantObjects.filter(x => x !== object));
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
    exports_40("drawObjects", drawObjects);
    function drawParticles(ctx, camera, particles) {
        for (const particle of particles) {
            if (!particle.enabled) {
                continue;
            }
            drawParticle(ctx, camera, particle);
        }
    }
    exports_40("drawParticles", drawParticles);
    function drawObjectAt(ctx, camera, obj, position, layerName = "objects") {
        drawObjectSkinAt(ctx, camera, obj.skin, obj.originPoint, position, layerName);
    }
    exports_40("drawObjectAt", drawObjectAt);
    function drawObjectSkinAt(ctx, camera, objSkin, originPoint, position, layerName = "objects") {
        const { width, height } = objSkin.size;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const skinPos = new Vector2_12.Vector2(x, y);
                const resultPos = position.clone().sub(originPoint).add(skinPos);
                const cells = getCellsAt(objSkin, skinPos);
                for (const cell of cells) {
                    if (cell.isEmpty) {
                        continue;
                    }
                    drawCell(ctx, camera, cell, resultPos, undefined, undefined, layerName);
                }
            }
        }
    }
    exports_40("drawObjectSkinAt", drawObjectSkinAt);
    function drawSceneObject(ctx, camera, obj, transparency) {
        const cameraPos = new Vector2_12.Vector2(camera.position.x, camera.position.y);
        const pos = obj.position;
        const origin = obj.originPoint;
        const { width, height } = obj.skin.size;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const skinPos = new Vector2_12.Vector2(x, y);
                const transparent = transparency(skinPos);
                const cellBorders = getCellBorders(obj, skinPos);
                const levelPos = pos.clone().sub(origin).add(skinPos);
                const resultPos = levelPos.clone().sub(cameraPos);
                const cells = getCellsAt(obj.skin, skinPos);
                for (const cell of cells) {
                    if (cell.isEmpty) {
                        continue;
                    }
                    drawCell(ctx, camera, cell, resultPos, transparent, cellBorders);
                }
            }
        }
        function getCellBorders(obj, position) {
            if (!obj.highlighted) {
                return [];
            }
            return Face_4.Faces
                .map(x => Vector2_12.Vector2.fromFace(x))
                .map(x => position.clone().add(x))
                .map(x => obj.skin.isEmptyCellAt(x) ? obj.highlighColor : null);
        }
    }
    function drawObject(ctx, camera, obj, importantObjects) {
        let showOnlyCollisions = isInFrontOfImportantObject();
        const isTransparentCell = (position) => {
            var _a;
            return (showOnlyCollisions && !isCollision(obj, position)) ||
                obj.realm !== ((_a = camera.npc) === null || _a === void 0 ? void 0 : _a.realm);
        };
        drawSceneObject(ctx, camera, obj, p => isTransparentCell(p) ? 0.2 : 1);
        function isInFrontOfImportantObject() {
            for (const o of importantObjects) {
                if (isPositionBehindTheObject(obj, o.position)) {
                    return true;
                }
            }
            return false;
        }
    }
    function drawParticle(ctx, camera, particle) {
        const getCellTransparency = () => {
            const distance = camera.npc.position.distanceTo(particle.position);
            const fullVisibilityRange = 1.2;
            const koef = 0.2;
            if (distance >= fullVisibilityRange) {
                const mistTransparency = Math.max(0, Math.min(1, Math.sqrt(distance * koef)));
                return mistTransparency;
            }
            return 0.2;
        };
        drawSceneObject(ctx, camera, particle, pos => getCellTransparency());
    }
    function getCellsAt(skin, position) {
        return skin.getCellsAt(position);
    }
    exports_40("getCellsAt", getCellsAt);
    function isCollision(object, position) {
        var _a;
        const cchar = ((_a = object.physics.collisions[position.y]) === null || _a === void 0 ? void 0 : _a[position.x]) || emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    exports_40("isCollision", isCollision);
    function isPositionBehindTheObject(object, position) {
        const resultPos = position.clone().sub(object.position).add(object.originPoint);
        // check collisions
        if (isCollision(object, resultPos))
            return false;
        return !object.skin.isEmptyCellAt(resultPos);
    }
    exports_40("isPositionBehindTheObject", isPositionBehindTheObject);
    function drawCell(ctx, camera, cell, cellPos, transparent = 1, border = [null, null, null, null], layer = "objects") {
        var _a, _b, _c, _d, _e, _f;
        if (cell.isEmpty)
            return;
        if (camera) {
            const cameraBox = new Box2_2.Box2(new Vector2_12.Vector2(), camera.size.clone().sub(new Vector2_12.Vector2(1, 1)));
            if (!cameraBox.containsPoint(cellPos)) {
                return;
            }
        }
        const [camX, camY] = cellPos.clone().add((camera === null || camera === void 0 ? void 0 : camera.position) || Vector2_12.Vector2.zero);
        if (layer === "objects") {
            if (((_a = camera === null || camera === void 0 ? void 0 : camera.level) === null || _a === void 0 ? void 0 : _a.lightColorLayer) && ((_b = camera === null || camera === void 0 ? void 0 : camera.level) === null || _b === void 0 ? void 0 : _b.lightColorLayer[camY])) {
                const color = (_c = camera === null || camera === void 0 ? void 0 : camera.level) === null || _c === void 0 ? void 0 : _c.lightColorLayer[camY][camX];
                const str = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
                cell.lightColor = str;
            }
            if (((_d = camera === null || camera === void 0 ? void 0 : camera.level) === null || _d === void 0 ? void 0 : _d.lightLayer) && ((_e = camera === null || camera === void 0 ? void 0 : camera.level) === null || _e === void 0 ? void 0 : _e.lightLayer[camY]) && cell.lightIntensity === null) {
                const intensity = (_f = camera === null || camera === void 0 ? void 0 : camera.level) === null || _f === void 0 ? void 0 : _f.lightLayer[camY][camX];
                cell.lightIntensity = intensity;
            }
        }
        ctx.add(layer, cellPos, { cell, transparent, border });
    }
    exports_40("drawCell", drawCell);
    function mixColors(colors) {
        const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
        const mixedColor = [
            Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) / totalIntensity | 0),
            Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) / totalIntensity | 0),
            Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) / totalIntensity | 0),
        ];
        return mixedColor;
    }
    exports_40("mixColors", mixColors);
    return {
        setters: [
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            },
            function (Vector2_12_1) {
                Vector2_12 = Vector2_12_1;
            },
            function (Face_4_1) {
                Face_4 = Face_4_1;
            },
            function (Box2_2_1) {
                Box2_2 = Box2_2_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_40("GraphicsEngine", GraphicsEngine);
            exports_40("cellStyle", cellStyle = {
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
System.register("engine/graphics/CanvasContext", ["main", "engine/graphics/GraphicsEngine"], function (exports_41, context_41) {
    "use strict";
    var main_1, GraphicsEngine_1, CanvasContext;
    var __moduleName = context_41 && context_41.id;
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
                addTo(grid, pos, cellInfo) {
                    if (!grid[pos.y]) {
                        grid[pos.y] = [];
                    }
                    if (!grid[pos.y][pos.x]) {
                        grid[pos.y][pos.x] = [];
                    }
                    grid[pos.y][pos.x].push(cellInfo);
                }
                addToPlain(grid, pos, cellInfo) {
                    if (!grid[pos.y]) {
                        grid[pos.y] = [];
                    }
                    grid[pos.y][pos.x] = cellInfo;
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
                    ctx.globalAlpha = cellInfo.transparent;
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
            exports_41("CanvasContext", CanvasContext);
        }
    };
});
System.register("engine/objects/Inventory", [], function (exports_42, context_42) {
    "use strict";
    var Inventory;
    var __moduleName = context_42 && context_42.id;
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
            exports_42("Inventory", Inventory);
        }
    };
});
System.register("engine/objects/SceneObject", ["engine/objects/Inventory", "engine/data/Vector2"], function (exports_43, context_43) {
    "use strict";
    var Inventory_1, Vector2_13, SceneObject;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (Inventory_1_1) {
                Inventory_1 = Inventory_1_1;
            },
            function (Vector2_13_1) {
                Vector2_13 = Vector2_13_1;
            }
        ],
        execute: function () {
            SceneObject = class SceneObject {
                get children() {
                    return [];
                }
                get position() {
                    var _a, _b;
                    return (((_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.clone()) || Vector2_13.Vector2.zero).add(this._position);
                }
                set position(value) {
                    if (!this.position.equals(value)) {
                        this._position = value.clone();
                    }
                }
                get level() {
                    return this._level;
                }
                set level(value) {
                    if (this._level !== value) {
                        this._level = value;
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
                        const position = options.position || Vector2_13.Vector2.zero;
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
                static updateValue(oldValue, increment, maxValue, action) {
                    const newValue = oldValue + increment;
                    const overflow = newValue - maxValue;
                    if (overflow < 0) {
                        return newValue;
                    }
                    action === null || action === void 0 ? void 0 : action();
                    return overflow;
                }
            };
            exports_43("SceneObject", SceneObject);
        }
    };
});
System.register("engine/Performance", [], function (exports_44, context_44) {
    "use strict";
    var Performance;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [],
        execute: function () {
            Performance = class Performance {
                constructor() {
                    this.stats = {};
                    this.item = null;
                }
                measure(f) {
                    if (!f) {
                        return;
                    }
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
            exports_44("Performance", Performance);
            Performance.enabled = false;
        }
    };
});
System.register("world/events/TransferItemsGameEvent", ["engine/events/GameEvent"], function (exports_45, context_45) {
    "use strict";
    var GameEvent_3, TransferItemsGameEvent;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            }
        ],
        execute: function () {
            (function (TransferItemsGameEvent) {
                TransferItemsGameEvent.type = "transfer_items";
                class Args {
                }
                TransferItemsGameEvent.Args = Args;
                function create(recipient, items) {
                    return new GameEvent_3.GameEvent(recipient, TransferItemsGameEvent.type, {
                        recipient,
                        items,
                    });
                }
                TransferItemsGameEvent.create = create;
            })(TransferItemsGameEvent || (exports_45("TransferItemsGameEvent", TransferItemsGameEvent = {})));
        }
    };
});
System.register("world/events/SwitchGameModeGameEvent", ["engine/events/GameEvent"], function (exports_46, context_46) {
    "use strict";
    var GameEvent_4, SwitchGameModeGameEvent;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            }
        ],
        execute: function () {
            (function (SwitchGameModeGameEvent) {
                SwitchGameModeGameEvent.type = "switch_mode";
                class Args {
                }
                SwitchGameModeGameEvent.Args = Args;
                function create(from, to) {
                    return new GameEvent_4.GameEvent("system", SwitchGameModeGameEvent.type, { from, to });
                }
                SwitchGameModeGameEvent.create = create;
            })(SwitchGameModeGameEvent || (exports_46("SwitchGameModeGameEvent", SwitchGameModeGameEvent = {})));
        }
    };
});
System.register("world/events/RemoveObjectGameEvent", ["engine/events/GameEvent"], function (exports_47, context_47) {
    "use strict";
    var GameEvent_5, RemoveObjectGameEvent;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (GameEvent_5_1) {
                GameEvent_5 = GameEvent_5_1;
            }
        ],
        execute: function () {
            (function (RemoveObjectGameEvent) {
                RemoveObjectGameEvent.type = "remove_object";
                class Args {
                }
                RemoveObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_5.GameEvent("system", RemoveObjectGameEvent.type, { object });
                }
                RemoveObjectGameEvent.create = create;
            })(RemoveObjectGameEvent || (exports_47("RemoveObjectGameEvent", RemoveObjectGameEvent = {})));
        }
    };
});
System.register("world/events/AddObjectGameEvent", ["engine/events/GameEvent"], function (exports_48, context_48) {
    "use strict";
    var GameEvent_6, AddObjectGameEvent;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (GameEvent_6_1) {
                GameEvent_6 = GameEvent_6_1;
            }
        ],
        execute: function () {
            (function (AddObjectGameEvent) {
                AddObjectGameEvent.type = "add_object";
                class Args {
                }
                AddObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_6.GameEvent("system", AddObjectGameEvent.type, { object });
                }
                AddObjectGameEvent.create = create;
            })(AddObjectGameEvent || (exports_48("AddObjectGameEvent", AddObjectGameEvent = {})));
        }
    };
});
System.register("engine/ActionData", [], function (exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    function convertToActionData(object, objectAction) {
        const iconPos = objectAction.iconPosition;
        const actionIcon = object.skin.getCellsAt(iconPos);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon };
    }
    exports_49("convertToActionData", convertToActionData);
    function getNpcInteraction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
    }
    exports_49("getNpcInteraction", getNpcInteraction);
    function getNpcCollisionAction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
    }
    exports_49("getNpcCollisionAction", getNpcCollisionAction);
    function getItemUsageAction(item) {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }
        // This is a default usage action.
        const defaultAction = interactions[0];
        return convertToActionData(item, defaultAction);
    }
    exports_49("getItemUsageAction", getItemUsageAction);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/Scene", ["engine/graphics/Cell", "engine/events/EventLoop", "engine/graphics/GraphicsEngine", "engine/objects/Npc", "engine/Camera", "utils/layer", "engine/Performance", "world/events/TransferItemsGameEvent", "world/events/SwitchGameModeGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent", "engine/ActionData", "engine/objects/Particle", "engine/WeatherSystem", "world/sprites/waterRippleSprite", "engine/data/Vector2", "engine/data/Box2"], function (exports_50, context_50) {
    "use strict";
    var Cell_2, EventLoop_3, GraphicsEngine_2, Npc_2, Camera_1, utils, Performance_1, TransferItemsGameEvent_1, SwitchGameModeGameEvent_1, RemoveObjectGameEvent_1, AddObjectGameEvent_1, ActionData_1, Particle_4, WeatherSystem_1, waterRippleSprite_2, Vector2_14, Box2_3, defaultLightLevelAtNight, defaultLightLevelAtDay, defaultTemperatureAtNight, defaultTemperatureAtDay, defaultMoisture, voidCell, Scene;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
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
            function (ActionData_1_1) {
                ActionData_1 = ActionData_1_1;
            },
            function (Particle_4_1) {
                Particle_4 = Particle_4_1;
            },
            function (WeatherSystem_1_1) {
                WeatherSystem_1 = WeatherSystem_1_1;
            },
            function (waterRippleSprite_2_1) {
                waterRippleSprite_2 = waterRippleSprite_2_1;
            },
            function (Vector2_14_1) {
                Vector2_14 = Vector2_14_1;
            },
            function (Box2_3_1) {
                Box2_3 = Box2_3_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            defaultLightLevelAtDay = 15;
            defaultTemperatureAtNight = 4; // @todo depends on biome.
            defaultTemperatureAtDay = 7; // @todo depends on biome.
            defaultMoisture = 5; // @todo depends on biome.
            voidCell = new Cell_2.Cell(' ', 'transparent', 'black');
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
                    this.debugDrawSignals = false;
                    this.debugDisableGameTime = false;
                }
                get objects() {
                    var _a;
                    return ((_a = this.level) === null || _a === void 0 ? void 0 : _a.objects) || [];
                }
                get particles() {
                    var _a;
                    return ((_a = this.level) === null || _a === void 0 ? void 0 : _a.particles) || [];
                }
                get levelBox() {
                    var _a, _b;
                    return new Box2_3.Box2(Vector2_14.Vector2.zero, (((_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.size) === null || _b === void 0 ? void 0 : _b.clone()) || Vector2_14.Vector2.zero).sub(new Vector2_14.Vector2(1, 1)));
                }
                get windBox() {
                    var _a, _b;
                    const margin = (((_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.wind) === null || _b === void 0 ? void 0 : _b.clone()) || Vector2_14.Vector2.zero).multiplyScalar(2);
                    return this.levelBox.clone().expandByVector(margin);
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_3.emitEvent(SwitchGameModeGameEvent_1.SwitchGameModeGameEvent.create("scene", "dialog"));
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
                    var _a, _b, _c, _d, _e, _f;
                    const scene = this;
                    if (!this.debugDisableGameTime) {
                        this.gameTime += ticks;
                    }
                    (_a = this.level) === null || _a === void 0 ? void 0 : _a.update(ticks, this);
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
                    for (const particle of ((_d = scene.level) === null || _d === void 0 ? void 0 : _d.weatherParticles) || []) {
                        particle.update(ticks, scene);
                    }
                    for (const particle of scene.particles) {
                        particle.update(ticks, scene);
                    }
                    this.camera.update();
                    perf.measure(updateBlocked);
                    perf.measure(updateTransparency);
                    perf.measure(updateLights);
                    perf.measure(updateWeather);
                    perf.measure(updateTemperature);
                    perf.measure(updateMoisture);
                    perf.measure((_e = this.level) === null || _e === void 0 ? void 0 : _e.signalProcessor.update.bind((_f = this.level) === null || _f === void 0 ? void 0 : _f.signalProcessor)(this));
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
                                    const cellPos = new Vector2_14.Vector2(x, y);
                                    const result = object.position.clone().sub(object.originPoint).add(cellPos);
                                    if (!scene.isPositionValid(result))
                                        continue;
                                    blockedLayer[result.y][result.x] = true;
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
                                    const cellPos = new Vector2_14.Vector2(x, y);
                                    const result = object.position.clone().sub(object.originPoint).add(cellPos);
                                    if (!scene.isPositionValid(result))
                                        continue;
                                    transparencyLayer[result.y][result.x] = value;
                                }
                            }
                        }
                        if (scene.level) {
                            scene.level.transparencyLayer = transparencyLayer;
                        }
                    }
                    function updateWeather() {
                        if (!scene.level) {
                            return;
                        }
                        scene.level.cloudLayer = [];
                        fillLayer(scene.level.cloudLayer, 15 - Math.round(15 * WeatherSystem_1.getWeatherSkyTransparency(scene.level.weatherType)) | 0);
                        // TODO: implement random noise clouds.
                        const weatherTicksOverflow = scene.level.weatherTicks - 300;
                        if (weatherTicksOverflow >= 0) {
                            updateWeatherParticles();
                            scene.level.weatherTicks = weatherTicksOverflow;
                        }
                        updateWeatherLayer();
                        const windTicksOverflow = scene.level.windTicks - 1000;
                        if (windTicksOverflow >= 0) {
                            updateWeatherWind();
                            scene.level.windTicks = windTicksOverflow;
                        }
                        function updateWeatherParticles() {
                            const box = scene.windBox;
                            for (let y = box.min.y; y < box.max.y; y++) {
                                for (let x = box.min.x; x < box.max.x; x++) {
                                    const levelPosition = new Vector2_14.Vector2(x, y);
                                    if (!scene.isRoofHoleAt(levelPosition)) {
                                        continue;
                                    }
                                    const existingParticle = getWeatherParticleAt(levelPosition);
                                    if (existingParticle) {
                                        continue;
                                    }
                                    const newParticle = WeatherSystem_1.createWeatherParticle(scene.level.weatherType, levelPosition);
                                    if (!newParticle) {
                                        continue;
                                    }
                                    scene.level.weatherParticles.push(newParticle);
                                }
                            }
                        }
                        function updateWeatherLayer() {
                            const layer = [];
                            for (let y = 0; y < scene.camera.size.height; y++) {
                                for (let x = 0; x < scene.camera.size.width; x++) {
                                    const cameraPos = new Vector2_14.Vector2(x, y);
                                    const levelPosition = scene.cameraTransformation(cameraPos);
                                    const existingParticle = getWeatherParticleAt(levelPosition);
                                    if (!existingParticle) {
                                        continue;
                                    }
                                    const cells = existingParticle.skin.getCellsAt(Vector2_14.Vector2.zero);
                                    // TODO: here I assume that there can not be a composite skin in a weather particle.
                                    const cell = cells[0];
                                    if (!cell) {
                                        continue;
                                    }
                                    if (!layer[y]) {
                                        layer[y] = [];
                                    }
                                    layer[y][x] = cell;
                                }
                            }
                            scene.level.weatherLayer = layer;
                        }
                        function getWeatherParticleAt(position) {
                            return scene.level.weatherParticles.find(p => p.position.equals(position));
                        }
                        function updateWeatherWind() {
                            // Push weather particles with wind direction.
                            for (const particle of scene.level.weatherParticles) {
                                particle.position.add(scene.level.wind);
                            }
                            // Remove weather particles out of level bounds (+border).
                            for (const particle of scene.level.weatherParticles) {
                                if (!scene.windBox.containsPoint(particle.position)) {
                                    scene.removeWeatherParticle(particle);
                                }
                            }
                            // Push particles with wind direction.
                            for (const particle of scene.particles) {
                                particle.position.add(scene.level.wind);
                            }
                            // Remove particles out of level bounds (+border).
                            for (const particle of scene.particles) {
                                if (!scene.windBox.containsPoint(particle.position)) {
                                    scene.removeParticle(particle);
                                }
                            }
                        }
                    }
                    function updateLights() {
                        var _a, _b;
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
                        for (let y = 0; y < scene.level.size.height; y++) {
                            for (let x = 0; x < scene.level.size.width; x++) {
                                const cloudValue = ((_a = scene.level.cloudLayer[y]) === null || _a === void 0 ? void 0 : _a[x]) || 0;
                                const roofValue = ((_b = scene.level.roofLayer[y]) === null || _b === void 0 ? void 0 : _b[x]) || 0;
                                const cloudOpacity = (maxValue - cloudValue) / maxValue;
                                const roofOpacity = (maxValue - roofValue) / maxValue;
                                const opacity = cloudOpacity * roofOpacity;
                                const cellLightLevel = Math.round(scene.globalLightLevel * opacity) | 0;
                                if (cellLightLevel === 0) {
                                    continue;
                                }
                                const position = new Vector2_14.Vector2(x, y);
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
                                const charPos = new Vector2_14.Vector2(left, top);
                                const position = obj.position.clone().sub(obj.originPoint).add(charPos);
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
                                    const layerPos = new Vector2_14.Vector2(x, y);
                                    meanPoint(scene.level.temperatureLayer, newTemperatureLayer, layerPos);
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
                                const charPos = new Vector2_14.Vector2(left, top);
                                const position = obj.position.clone().sub(obj.originPoint).add(charPos);
                                if (!scene.isPositionValid(position)) {
                                    continue;
                                }
                                addEmitter(scene.level.temperatureLayer, position, temperature);
                            }
                        }
                    }
                    function fillLayer(layer, defaultValue) {
                        var _a;
                        const size = ((_a = scene.level) === null || _a === void 0 ? void 0 : _a.size) || Vector2_14.Vector2.zero;
                        utils.fillLayer(size, defaultValue, layer);
                    }
                    function addEmitter(layer, position, level) {
                        const [left, top] = position;
                        if (layer[top] &&
                            typeof layer[top][left] !== "undefined" &&
                            layer[top][left] < level) {
                            layer[top][left] = level;
                        }
                    }
                    function meanPoint(array, newArray, [x, y], speed = 2) {
                        if (!array) {
                            return;
                        }
                        if (y >= array.length || x >= array[y].length) {
                            return;
                        }
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
                                    const nextPosition = new Vector2_14.Vector2(j, i);
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
                    drawTileEffects();
                    // sort objects by origin point
                    this.level.objects.sort((a, b) => a.position.y - b.position.y);
                    GraphicsEngine_2.drawObjects(ctx, this.camera, this.objects);
                    GraphicsEngine_2.drawParticles(ctx, this.camera, this.particles);
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
                    if (scene.debugDrawSignals) {
                        drawSignals();
                    }
                    function drawTiles() {
                        drawLayer(scene.level.tiles, scene.cameraTransformation.bind(scene), c => c ? c.skin.getCellsAt(Vector2_14.Vector2.zero)[0] : voidCell);
                    }
                    function drawTileEffects() {
                        drawLayer(scene.level.tiles, scene.cameraTransformation.bind(scene), c => getTileEffect(c));
                        function getTileEffect(tile) {
                            if (!tile) {
                                return undefined;
                            }
                            if (tile.category === "solid" && tile.snowLevel > 0) {
                                return new Cell_2.Cell(' ', undefined, `#fff${(tile.snowLevel * 2).toString(16)}`);
                            }
                            if (tile.category === "liquid" && tile.isDisturbed) {
                                const frame = waterRippleSprite_2.waterRippleSprite.frames[Particle_4.Particle.defaultFrameName][tile.disturbanceLevel];
                                // TODO: Here I assume that water ripple effect skin is not composite. 
                                return frame.getCellsAt(Vector2_14.Vector2.zero)[0];
                            }
                            return undefined;
                        }
                    }
                    function drawWeather() {
                        drawLayer(scene.level.weatherLayer, p => p, c => c, "weather");
                    }
                    function drawTemperatures() {
                        drawDebugLayer(scene.level.temperatureLayer);
                    }
                    function drawMoisture() {
                        drawDebugLayer(scene.level.moistureLayer);
                    }
                    function drawSignals() {
                        drawDebugLayerT(scene.level.signalProcessor.signalLayer, signalValue => signalValue, 1, -1);
                    }
                    function drawBlockedCells() {
                        drawLayer(scene.level.blockedLayer, scene.cameraTransformation.bind(scene), createCell);
                        function createCell(b) {
                            return b === true ? new Cell_2.Cell('⛌', `#f00c`, `#000c`) : undefined;
                        }
                    }
                    function drawLayer(layer, transformation, cellFactory, layerName = "objects") {
                        var _a;
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                const cameraPos = new Vector2_14.Vector2(x, y);
                                const resultPos = transformation(cameraPos);
                                const value = (_a = layer[resultPos.y]) === null || _a === void 0 ? void 0 : _a[resultPos.x];
                                const cell = cellFactory(value);
                                if (!cell)
                                    continue;
                                GraphicsEngine_2.drawCell(ctx, scene.camera, cell, cameraPos, undefined, undefined, layerName);
                            }
                        }
                    }
                    function drawDebugLayer(layer, max = 15, min = 0) {
                        drawLayer(layer, scene.cameraTransformation.bind(scene), createCell);
                        function createCell(v) {
                            const value = v;
                            return new Cell_2.Cell((v || ' ').toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max));
                        }
                        function numberToHexColor(val, max = 15, min = 0) {
                            const alpha = 0.3;
                            if (!val) {
                                return `rgba(0, 0, 0, ${alpha})`;
                            }
                            const length = max - min;
                            const intVal = Math.round(val) | 0;
                            const red = Math.floor((intVal / length) * 255);
                            const blue = 255 - red;
                            return `rgba(${red}, 0, ${blue}, ${alpha})`;
                        }
                    }
                    function drawDebugLayerT(layer, converter, max = 15, min = 0) {
                        const numberLayer = utils.mapLayer(layer, v => converter(v));
                        drawDebugLayer(numberLayer, max, min);
                    }
                }
                cameraTransformation(position) {
                    return this.camera.position.clone().add(position);
                }
                isRoofHoleAt(pos) {
                    var _a;
                    let roofHoleVal = (_a = this.level.roofHolesLayer[pos.y]) === null || _a === void 0 ? void 0 : _a[pos.x];
                    return roofHoleVal || typeof roofHoleVal === "undefined";
                }
                getParticleAt(pos) {
                    if (!this.windBox.containsPoint(pos)) {
                        return undefined;
                    }
                    return this.particles.find(p => p.position.equals(pos));
                }
                tryAddParticle(particle) {
                    const existingParticle = this.getParticleAt(particle.position);
                    if (existingParticle) {
                        this.removeParticle(existingParticle);
                    }
                    this.particles.push(particle);
                    return true;
                }
                removeParticle(particle) {
                    this.level.particles = this.particles.filter(x => x !== particle);
                }
                removeWeatherParticle(particle) {
                    this.level.weatherParticles = this.level.weatherParticles.filter(x => x !== particle);
                }
                isPositionValid(position) {
                    return this.levelBox.containsPoint(position);
                }
                isPositionBlocked(position) {
                    var _a;
                    const layer = this.level.blockedLayer;
                    return ((_a = layer[position.y]) === null || _a === void 0 ? void 0 : _a[position.x]) === true;
                }
                isParticlePositionBlocked(position) {
                    return !!this.getParticleAt(position);
                }
                getPositionTransparency(position) {
                    var _a;
                    const layer = this.level.transparencyLayer;
                    const transparencyValue = ((_a = layer[position.y]) === null || _a === void 0 ? void 0 : _a[position.x]) || 0;
                    return (15 - transparencyValue) / 15;
                }
                getActionsAt(position) {
                    const scene = this;
                    const actions = [];
                    for (const object of scene.objects) {
                        if (!object.enabled)
                            continue;
                        //
                        const objectPos = object.position;
                        const objectOrigin = object.originPoint;
                        const result = position.clone().sub(objectPos).add(objectOrigin);
                        for (const action of object.actions) {
                            const aPos = action.position;
                            if (aPos.equals(result)) {
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
                        if (object.position.equals(position)) {
                            return object;
                        }
                    }
                    return undefined;
                }
                getTemperatureAt(position) {
                    var _a, _b;
                    return ((_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.temperatureLayer[position.y]) === null || _b === void 0 ? void 0 : _b[position.x]) || 0;
                }
                getLightAt(position) {
                    var _a, _b;
                    return ((_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.lightLayer[position.y]) === null || _b === void 0 ? void 0 : _b[position.x]) || 0;
                }
                getWeatherAt(position) {
                    var _a, _b, _c, _d, _e;
                    const value = (_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.roofHolesLayer[position.y]) === null || _b === void 0 ? void 0 : _b[position.x];
                    const isHole = typeof value === "undefined" || value;
                    if (!isHole && ((_c = this.level) === null || _c === void 0 ? void 0 : _c.weatherType) !== "mist" && ((_d = this.level) === null || _d === void 0 ? void 0 : _d.weatherType) !== "heavy_mist") {
                        return undefined;
                    }
                    return ((_e = this.level) === null || _e === void 0 ? void 0 : _e.weatherType) || undefined;
                }
                getTileAt(position) {
                    var _a, _b, _c;
                    return (_c = (_b = (_a = this.level) === null || _a === void 0 ? void 0 : _a.tiles) === null || _b === void 0 ? void 0 : _b[position.y]) === null || _c === void 0 ? void 0 : _c[position.x];
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
            exports_50("Scene", Scene);
        }
    };
});
System.register("world/behaviors/WanderingBehavior", [], function (exports_51, context_51) {
    "use strict";
    var WanderingBehavior;
    var __moduleName = context_51 && context_51.id;
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
            exports_51("WanderingBehavior", WanderingBehavior);
        }
    };
});
System.register("world/events/MountGameEvent", ["engine/events/GameEvent"], function (exports_52, context_52) {
    "use strict";
    var GameEvent_7, MountGameEvent;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (GameEvent_7_1) {
                GameEvent_7 = GameEvent_7_1;
            }
        ],
        execute: function () {
            (function (MountGameEvent) {
                MountGameEvent.type = "mount";
                class Args {
                }
                MountGameEvent.Args = Args;
                function create(mounter, mount, newState) {
                    return new GameEvent_7.GameEvent(mounter, MountGameEvent.type, {
                        mounter,
                        mount,
                        newState,
                    });
                }
                MountGameEvent.create = create;
            })(MountGameEvent || (exports_52("MountGameEvent", MountGameEvent = {})));
        }
    };
});
System.register("world/behaviors/MountBehavior", ["world/behaviors/WanderingBehavior", "engine/events/EventLoop", "world/events/MountGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent", "engine/data/Vector2"], function (exports_53, context_53) {
    "use strict";
    var WanderingBehavior_1, EventLoop_4, MountGameEvent_1, RemoveObjectGameEvent_2, AddObjectGameEvent_2, Vector2_15, MountBehavior;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (WanderingBehavior_1_1) {
                WanderingBehavior_1 = WanderingBehavior_1_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (MountGameEvent_1_1) {
                MountGameEvent_1 = MountGameEvent_1_1;
            },
            function (RemoveObjectGameEvent_2_1) {
                RemoveObjectGameEvent_2 = RemoveObjectGameEvent_2_1;
            },
            function (AddObjectGameEvent_2_1) {
                AddObjectGameEvent_2 = AddObjectGameEvent_2_1;
            },
            function (Vector2_15_1) {
                Vector2_15 = Vector2_15_1;
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
                    mounter.mount.position = Vector2_15.Vector2.zero;
                    // Move mounter on top of the mount.
                    mounter.position = mounter.cursorPosition.clone();
                    // Remove mount from the scene.
                    EventLoop_4.emitEvent(RemoveObjectGameEvent_2.RemoveObjectGameEvent.create(this.mountObject));
                    EventLoop_4.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "mounted"));
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
                    mount.position = mounter.position.clone();
                    // Add mount back to the scene.
                    EventLoop_4.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(mount));
                    // Move mounter forward.
                    mounter.position = mounter.cursorPosition.clone();
                    EventLoop_4.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "unmounted"));
                }
            };
            exports_53("MountBehavior", MountBehavior);
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/behaviors/MountBehavior", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Npc", "engine/data/Vector2"], function (exports_54, context_54) {
    "use strict";
    var Item_1, ObjectSkin_3, ObjectPhysics_5, MountBehavior_1, EventLoop_5, GameEvent_8, Npc_3, Vector2_16, lamp, SwordItem, sword, victoryItem, bambooSeed, honeyPot, seaShell, glasses, Saddle, saddle;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            },
            function (MountBehavior_1_1) {
                MountBehavior_1 = MountBehavior_1_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
            },
            function (GameEvent_8_1) {
                GameEvent_8 = GameEvent_8_1;
            },
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (Vector2_16_1) {
                Vector2_16 = Vector2_16_1;
            }
        ],
        execute: function () {
            exports_54("lamp", lamp = () => {
                const physics = new ObjectPhysics_5.ObjectPhysics(` `, `x`, `a`);
                physics.lightsMap = { 'x': { intensity: 'f', color: [255, 255, 255] } };
                const item = Item_1.Item.create("lamp", new ObjectSkin_3.ObjectSkin(`🏮`), physics);
                return item;
            });
            SwordItem = class SwordItem extends Item_1.Item {
                constructor() {
                    super(Vector2_16.Vector2.zero, new ObjectSkin_3.ObjectSkin(`🗡`));
                    this.type = "sword";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            EventLoop_5.emitEvent(new GameEvent_8.GameEvent(ctx.initiator, 'attack', {
                                object: ctx.initiator,
                                subject: ctx.subject,
                            }));
                        }
                    });
                }
            };
            exports_54("SwordItem", SwordItem);
            exports_54("sword", sword = () => new SwordItem());
            exports_54("victoryItem", victoryItem = () => Item_1.Item.create("victory_item", new ObjectSkin_3.ObjectSkin(`W`)));
            exports_54("bambooSeed", bambooSeed = () => Item_1.Item.create("bamboo_seed", new ObjectSkin_3.ObjectSkin(`▄`, `T`, { 'T': ['#99bc20', 'transparent'] })));
            exports_54("honeyPot", honeyPot = () => Item_1.Item.create("honey_pot", new ObjectSkin_3.ObjectSkin(`🍯`)));
            // TODO: reveals invisible underwater chests.
            exports_54("seaShell", seaShell = () => Item_1.Item.create("sea_shell", new ObjectSkin_3.ObjectSkin(`🐚`)));
            exports_54("glasses", glasses = () => Item_1.Item.create("glasses", new ObjectSkin_3.ObjectSkin(`👓`)));
            Saddle = class Saddle extends Item_1.Item {
                constructor() {
                    super(Vector2_16.Vector2.zero, new ObjectSkin_3.ObjectSkin(`🐾`, `T`, { 'T': ['#99bc20', 'transparent'] }));
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
            exports_54("Saddle", Saddle);
            exports_54("saddle", saddle = () => new Saddle());
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items", "engine/objects/NpcMovementOptions", "engine/data/Vector2"], function (exports_55, context_55) {
    "use strict";
    var Npc_4, ObjectSkin_4, items_1, NpcMovementOptions_2, Vector2_17, hero;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            },
            function (NpcMovementOptions_2_1) {
                NpcMovementOptions_2 = NpcMovementOptions_2_1;
            },
            function (Vector2_17_1) {
                Vector2_17 = Vector2_17_1;
            }
        ],
        execute: function () {
            exports_55("hero", hero = new class extends Npc_4.Npc {
                constructor() {
                    super(new ObjectSkin_4.ObjectSkin('🐱'), Vector2_17.Vector2.zero);
                    this.type = "human";
                    this.showCursor = true;
                    this.movementOptions = {
                        ...NpcMovementOptions_2.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    const aSword = items_1.sword();
                    const aLamp = items_1.lamp();
                    this.inventory.items.push(aLamp);
                    this.inventory.items.push(items_1.saddle());
                    this.inventory.items.push(items_1.glasses());
                    this.inventory.items.push(aSword);
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
System.register("ui/UIElement", ["engine/data/Vector2"], function (exports_56, context_56) {
    "use strict";
    var Vector2_18, UIElement;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [
            function (Vector2_18_1) {
                Vector2_18 = Vector2_18_1;
            }
        ],
        execute: function () {
            UIElement = class UIElement {
                constructor(parent) {
                    this.parent = parent;
                    this.position = Vector2_18.Vector2.zero;
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
                    let pos = this.position.clone();
                    let parent = this.parent;
                    while (parent) {
                        pos.add(parent.position);
                        parent = parent.parent;
                    }
                    return pos;
                }
            };
            exports_56("UIElement", UIElement);
        }
    };
});
System.register("ui/UIPanel", ["engine/data/Vector2", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "ui/UIElement"], function (exports_57, context_57) {
    "use strict";
    var Vector2_19, Cell_3, GraphicsEngine_3, UIElement_1, UIPanel;
    var __moduleName = context_57 && context_57.id;
    return {
        setters: [
            function (Vector2_19_1) {
                Vector2_19 = Vector2_19_1;
            },
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
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
                    const pos = this.position;
                    for (let y = 0; y < this.size.height; y++) {
                        for (let x = 0; x < this.size.width; x++) {
                            const localPos = new Vector2_19.Vector2(x, y);
                            const result = pos.clone().add(localPos);
                            GraphicsEngine_3.drawCell(ctx, undefined, this.getCell(localPos), result, undefined, undefined, "ui");
                        }
                    }
                }
                getCell([x, y]) {
                    if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
                        return new Cell_3.Cell(' ', 'black', this.borderColor, undefined, 15);
                    }
                    else {
                        return new Cell_3.Cell(' ', 'white', this.backgroundColor, undefined, 15);
                    }
                }
            };
            exports_57("UIPanel", UIPanel);
        }
    };
});
System.register("ui/UISceneObject", ["engine/graphics/GraphicsEngine", "ui/UIElement"], function (exports_58, context_58) {
    "use strict";
    var GraphicsEngine_4, UIElement_2, UISceneObject;
    var __moduleName = context_58 && context_58.id;
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
            exports_58("UISceneObject", UISceneObject);
        }
    };
});
System.register("ui/HealthBarUi", ["engine/graphics/GraphicsEngine", "engine/graphics/Cell", "ui/UIElement", "engine/data/Vector2"], function (exports_59, context_59) {
    "use strict";
    var GraphicsEngine_5, Cell_4, UIElement_3, Vector2_20, HealthBarUi;
    var __moduleName = context_59 && context_59.id;
    return {
        setters: [
            function (GraphicsEngine_5_1) {
                GraphicsEngine_5 = GraphicsEngine_5_1;
            },
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            },
            function (UIElement_3_1) {
                UIElement_3 = UIElement_3_1;
            },
            function (Vector2_20_1) {
                Vector2_20 = Vector2_20_1;
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
                        const heartCell = new Cell_4.Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent');
                        GraphicsEngine_5.drawCell(ctx, undefined, heartCell, this.position.clone().add(new Vector2_20.Vector2(i, 0)), undefined, undefined, "ui");
                    }
                }
            };
            exports_59("HealthBarUi", HealthBarUi);
        }
    };
});
System.register("ui/playerUi", ["engine/graphics/GraphicsEngine", "engine/objects/Npc", "engine/ActionData", "ui/UIPanel", "ui/UIElement", "ui/UISceneObject", "ui/HealthBarUi", "engine/data/Vector2"], function (exports_60, context_60) {
    "use strict";
    var GraphicsEngine_6, Npc_5, ActionData_2, UIPanel_1, UIElement_4, UISceneObject_1, HealthBarUi_1, Vector2_21, PlayerUi;
    var __moduleName = context_60 && context_60.id;
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
            },
            function (Vector2_21_1) {
                Vector2_21 = Vector2_21_1;
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
                    this.panel = new UIPanel_1.UIPanel(this, Vector2_21.Vector2.zero, new Vector2_21.Vector2(camera.size.width, 1));
                    this.panel.borderColor = '#000a';
                    this.heroSprite = new UISceneObject_1.UISceneObject(this, npc);
                    this.heroSprite.position = Vector2_21.Vector2.zero;
                    this.heroHealthBar = new HealthBarUi_1.HealthBarUi(this, npc, new Vector2_21.Vector2(1, 0));
                }
                draw(ctx) {
                    super.draw(ctx);
                    const right = this.camera.size.width - 1;
                    for (const cell of this.actionUnderCursor || []) {
                        GraphicsEngine_6.drawCell(ctx, this.camera, cell, new Vector2_21.Vector2(right, 0), undefined, undefined, "ui");
                    }
                }
                getNpcUnderCursor(scene) {
                    const npcObjects = scene.objects
                        .filter(x => x.enabled && x instanceof Npc_5.Npc)
                        .map(x => x);
                    for (let o of npcObjects) {
                        if (o.position.equals(this.npc.cursorPosition)) {
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
                            this.objectUnderCursorHealthBar = new HealthBarUi_1.HealthBarUi(this, npcUnderCursor, new Vector2_21.Vector2(right - npcUnderCursor.maxHealth, 0));
                            this.objectUnderCursorSprite = new UISceneObject_1.UISceneObject(this, npcUnderCursor);
                            this.objectUnderCursorSprite.position = new Vector2_21.Vector2(right, 0);
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
            exports_60("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/objects/house", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_61, context_61) {
    "use strict";
    var StaticGameObject_1, ObjectSkin_5, ObjectPhysics_6, Vector2_22, windowHorizontalSkin, wallSkin, physicsUnitBlockedTransparent, physicsUnitBlocked, windowHorizontal, wall;
    var __moduleName = context_61 && context_61.id;
    function house(options) {
        return new StaticGameObject_1.StaticGameObject(new Vector2_22.Vector2(2, 2), new ObjectSkin_5.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }), new ObjectPhysics_6.ObjectPhysics(`
 ... 
 . .`, ''), Vector2_22.Vector2.from(options.position));
    }
    exports_61("house", house);
    return {
        setters: [
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (Vector2_22_1) {
                Vector2_22 = Vector2_22_1;
            }
        ],
        execute: function () {
            windowHorizontalSkin = () => new ObjectSkin_5.ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
            wallSkin = () => new ObjectSkin_5.ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
            physicsUnitBlockedTransparent = (transparency) => new ObjectPhysics_6.ObjectPhysics('.', '', '', '', transparency || '0');
            physicsUnitBlocked = () => new ObjectPhysics_6.ObjectPhysics('.');
            exports_61("windowHorizontal", windowHorizontal = (options) => new StaticGameObject_1.StaticGameObject(Vector2_22.Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2_22.Vector2.from(options.position)));
            exports_61("wall", wall = (options) => new StaticGameObject_1.StaticGameObject(Vector2_22.Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2_22.Vector2.from(options.position)));
        }
    };
});
System.register("world/objects/fence", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_62, context_62) {
    "use strict";
    var ObjectSkin_6, StaticGameObject_2, ObjectPhysics_7, Vector2_23;
    var __moduleName = context_62 && context_62.id;
    function fence(options) {
        return new StaticGameObject_2.StaticGameObject(Vector2_23.Vector2.zero, new ObjectSkin_6.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_7.ObjectPhysics('.'), Vector2_23.Vector2.from(options.position));
    }
    exports_62("fence", fence);
    return {
        setters: [
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            },
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            },
            function (Vector2_23_1) {
                Vector2_23 = Vector2_23_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/events/TeleportToEndpointGameEvent", ["engine/events/GameEvent"], function (exports_63, context_63) {
    "use strict";
    var GameEvent_9, TeleportToEndpointGameEvent;
    var __moduleName = context_63 && context_63.id;
    return {
        setters: [
            function (GameEvent_9_1) {
                GameEvent_9 = GameEvent_9_1;
            }
        ],
        execute: function () {
            (function (TeleportToEndpointGameEvent) {
                TeleportToEndpointGameEvent.type = "teleport_to_endpoint";
                class Args {
                }
                TeleportToEndpointGameEvent.Args = Args;
                function create(id, teleport, object) {
                    return new GameEvent_9.GameEvent(teleport, TeleportToEndpointGameEvent.type, {
                        id,
                        teleport,
                        object,
                    });
                }
                TeleportToEndpointGameEvent.create = create;
            })(TeleportToEndpointGameEvent || (exports_63("TeleportToEndpointGameEvent", TeleportToEndpointGameEvent = {})));
        }
    };
});
System.register("world/objects/door", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/events/EventLoop", "world/events/TeleportToEndpointGameEvent", "engine/data/Vector2"], function (exports_64, context_64) {
    "use strict";
    var ObjectSkin_7, StaticGameObject_3, ObjectPhysics_8, EventLoop_6, TeleportToEndpointGameEvent_1, Vector2_24, Door;
    var __moduleName = context_64 && context_64.id;
    function door(id, options) {
        return new Door(id, options);
    }
    exports_64("door", door);
    return {
        setters: [
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            },
            function (EventLoop_6_1) {
                EventLoop_6 = EventLoop_6_1;
            },
            function (TeleportToEndpointGameEvent_1_1) {
                TeleportToEndpointGameEvent_1 = TeleportToEndpointGameEvent_1_1;
            },
            function (Vector2_24_1) {
                Vector2_24 = Vector2_24_1;
            }
        ],
        execute: function () {
            Door = class Door extends StaticGameObject_3.StaticGameObject {
                constructor(id, options) {
                    super(Vector2_24.Vector2.zero, new ObjectSkin_7.ObjectSkin(`🚪`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_8.ObjectPhysics(` `), Vector2_24.Vector2.from(options.position));
                    this.id = id;
                    this.setAction({
                        type: "collision",
                        action: ctx => EventLoop_6.emitEvent(TeleportToEndpointGameEvent_1.TeleportToEndpointGameEvent.create(id, ctx.obj, ctx.initiator))
                    });
                }
                bindToLevel(level) {
                    super.bindToLevel(level);
                    if (!level.portals[this.id]) {
                        level.portals[this.id] = [];
                    }
                    if (!level.portals[this.id].find(x => x.equals(this.position))) {
                        level.portals[this.id].push(this.position);
                    }
                }
            };
            exports_64("Door", Door);
        }
    };
});
System.register("world/events/PlayerMessageGameEvent", ["engine/events/GameEvent"], function (exports_65, context_65) {
    "use strict";
    var GameEvent_10, PlayerMessageGameEvent;
    var __moduleName = context_65 && context_65.id;
    return {
        setters: [
            function (GameEvent_10_1) {
                GameEvent_10 = GameEvent_10_1;
            }
        ],
        execute: function () {
            (function (PlayerMessageGameEvent) {
                PlayerMessageGameEvent.type = "player_message";
                class Args {
                }
                PlayerMessageGameEvent.Args = Args;
                function create(message) {
                    return new GameEvent_10.GameEvent(null, PlayerMessageGameEvent.type, { message });
                }
                PlayerMessageGameEvent.create = create;
            })(PlayerMessageGameEvent || (exports_65("PlayerMessageGameEvent", PlayerMessageGameEvent = {})));
        }
    };
});
System.register("world/actions", ["engine/events/EventLoop", "world/events/PlayerMessageGameEvent", "world/events/TransferItemsGameEvent"], function (exports_66, context_66) {
    "use strict";
    var EventLoop_7, PlayerMessageGameEvent_1, TransferItemsGameEvent_2;
    var __moduleName = context_66 && context_66.id;
    function storageAction(obj) {
        return (ctx) => {
            const items = obj.inventory.items;
            if (items.length === 0) {
                EventLoop_7.emitEvent(PlayerMessageGameEvent_1.PlayerMessageGameEvent.create("Chest is empty."));
                return;
            }
            obj.inventory.items = [];
            EventLoop_7.emitEvent(TransferItemsGameEvent_2.TransferItemsGameEvent.create(ctx.initiator, items));
        };
    }
    exports_66("storageAction", storageAction);
    return {
        setters: [
            function (EventLoop_7_1) {
                EventLoop_7 = EventLoop_7_1;
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
System.register("world/objects/chest", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/actions", "engine/data/Vector2"], function (exports_67, context_67) {
    "use strict";
    var StaticGameObject_4, ObjectSkin_8, ObjectPhysics_9, actions_1, Vector2_25, Chest, chest;
    var __moduleName = context_67 && context_67.id;
    return {
        setters: [
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            },
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            },
            function (Vector2_25_1) {
                Vector2_25 = Vector2_25_1;
            }
        ],
        execute: function () {
            Chest = class Chest extends StaticGameObject_4.StaticGameObject {
                constructor(position) {
                    super(Vector2_25.Vector2.zero, new ObjectSkin_8.ObjectSkin(`🧰`), new ObjectPhysics_9.ObjectPhysics(`.`, ''), position);
                    this.setAction(actions_1.storageAction(this));
                }
            };
            exports_67("default", Chest);
            exports_67("chest", chest = () => new Chest(Vector2_25.Vector2.from([2, 10])));
        }
    };
});
System.register("engine/data/TileInfo", [], function (exports_68, context_68) {
    "use strict";
    var TileInfo;
    var __moduleName = context_68 && context_68.id;
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
            exports_68("TileInfo", TileInfo);
        }
    };
});
System.register("engine/data/Tiles", ["engine/components/ObjectSkin", "engine/objects/Tile", "engine/data/Vector2", "engine/data/TileInfo"], function (exports_69, context_69) {
    "use strict";
    var ObjectSkin_9, Tile_1, Vector2_26, TileInfo_1, Tiles;
    var __moduleName = context_69 && context_69.id;
    return {
        setters: [
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (Vector2_26_1) {
                Vector2_26 = Vector2_26_1;
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
                            const position = new Vector2_26.Vector2(x, y);
                            const skin = new ObjectSkin_9.ObjectSkin(' ', '.', { '.': ['transparent', tileInfo.color] });
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
            exports_69("Tiles", Tiles);
            Tiles.defaultTile = new TileInfo_1.TileInfo('#331', '<default_tile>');
        }
    };
});
System.register("world/levels/devHub", ["engine/Level", "world/objects/house", "world/objects/fence", "world/objects/door", "world/objects/chest", "world/items", "engine/data/Tiles", "engine/data/Vector2"], function (exports_70, context_70) {
    "use strict";
    var Level_1, house_1, fence_1, door_1, chest_1, items_2, Tiles_1, Vector2_27, fences, width, height, house1, doors, chest, objects, level, devHubLevel;
    var __moduleName = context_70 && context_70.id;
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
            },
            function (Vector2_27_1) {
                Vector2_27 = Vector2_27_1;
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
                door_1.door('sheeps_door', { position: [2, 10] }),
                door_1.door('particles', { position: [4, 10] }),
                door_1.door('mistland', { position: [6, 10] }),
                door_1.door('volcanic', { position: [8, 10] }),
                door_1.door('signals', { position: [10, 10] }),
            ];
            chest = new chest_1.default(new Vector2_27.Vector2(7, 7));
            chest.inventory.addItems([items_2.bambooSeed()]);
            objects = [...fences, house1, ...doors, chest];
            level = new Level_1.Level('devHub', objects, Tiles_1.Tiles.createEmpty(width, height));
            exports_70("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/sprites/smokeSprite", ["engine/data/Sprite"], function (exports_71, context_71) {
    "use strict";
    var Sprite_6, smokeSpriteRaw, smokeSprite;
    var __moduleName = context_71 && context_71.id;
    return {
        setters: [
            function (Sprite_6_1) {
                Sprite_6 = Sprite_6_1;
            }
        ],
        execute: function () {
            smokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#aaaA
color:T,transparent,#aaa8
color:Y,transparent,#aaa5

particle
'''''''
RRTTYYY`;
            exports_71("smokeSprite", smokeSprite = Sprite_6.Sprite.parse(smokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Smoke", ["engine/data/Face", "engine/data/Vector2", "engine/objects/Particle", "world/sprites/smokeSprite"], function (exports_72, context_72) {
    "use strict";
    var Face_5, Vector2_28, Particle_5, smokeSprite_1, Smoke;
    var __moduleName = context_72 && context_72.id;
    return {
        setters: [
            function (Face_5_1) {
                Face_5 = Face_5_1;
            },
            function (Vector2_28_1) {
                Vector2_28 = Vector2_28_1;
            },
            function (Particle_5_1) {
                Particle_5 = Particle_5_1;
            },
            function (smokeSprite_1_1) {
                smokeSprite_1 = smokeSprite_1_1;
            }
        ],
        execute: function () {
            Smoke = class Smoke extends Particle_5.Particle {
                constructor(position, state = 0) {
                    super(smokeSprite_1.smokeSprite, position, state);
                    this.type = Smoke.ParticleType;
                }
                onNext(scene) {
                    spread(this);
                    function spread(particle) {
                        if (!particle.hasNext()) {
                            return;
                        }
                        const particlePos = particle.position;
                        const newState = particle.state + 1;
                        const newPositions = Face_5.Faces
                            .map(x => Vector2_28.Vector2.fromFace(x))
                            .map(x => particlePos.clone().add(x));
                        for (const newPosition of newPositions) {
                            spreadTo(newPosition, newState);
                        }
                    }
                    function spreadTo(newPosition, newState) {
                        const particle = scene.getParticleAt(newPosition);
                        if (!particle) {
                            scene.tryAddParticle(new Smoke(newPosition, newState));
                        }
                        else if (particle.type === Smoke.ParticleType && particle.state > newState) {
                            scene.removeParticle(particle);
                            scene.tryAddParticle(new Smoke(newPosition, newState));
                        }
                    }
                }
            };
            exports_72("Smoke", Smoke);
            Smoke.ParticleType = "smoke";
        }
    };
});
System.register("world/objects/campfire", ["engine/components/ObjectPhysics", "engine/data/Vector2", "engine/data/Sprite", "engine/objects/StaticGameObject", "world/objects/particles/Smoke"], function (exports_73, context_73) {
    "use strict";
    var ObjectPhysics_10, Vector2_29, Sprite_7, StaticGameObject_5, Smoke_1, Campfire;
    var __moduleName = context_73 && context_73.id;
    function campfire(options) {
        return new Campfire(Vector2_29.Vector2.from(options.position));
    }
    exports_73("campfire", campfire);
    return {
        setters: [
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            },
            function (Vector2_29_1) {
                Vector2_29 = Vector2_29_1;
            },
            function (Sprite_7_1) {
                Sprite_7 = Sprite_7_1;
            },
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (Smoke_1_1) {
                Smoke_1 = Smoke_1_1;
            }
        ],
        execute: function () {
            Campfire = class Campfire extends StaticGameObject_5.StaticGameObject {
                constructor(position) {
                    const sprite = Sprite_7.Sprite.parseSimple('🔥💨');
                    sprite.frames["0"][0].setForegroundAt([0, 0], 'red');
                    super(Vector2_29.Vector2.zero, sprite.frames["0"][0], new ObjectPhysics_10.ObjectPhysics(` `, 'F', 'F'), position);
                    this.smokeTicks = 0;
                    this._sprite = sprite;
                    this.type = "campfire";
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    const isRainyWeather = scene.level.weatherType === 'rain' ||
                        scene.level.weatherType === 'rain_and_snow';
                    const isUnderTheSky = scene.isRoofHoleAt(this.position);
                    if (isRainyWeather && isUnderTheSky) {
                        this.skin = this._sprite.frames["1"][0];
                        this.physics.lights[0] = `6`;
                        this.physics.temperatures[0] = `8`;
                    }
                    else {
                        this.skin = this._sprite.frames["0"][0];
                        this.physics.lights[0] = `F`;
                        this.physics.temperatures[0] = `F`;
                        this.smokeTicks += ticks;
                        const smokeTicksOverflow = this.smokeTicks - 2000;
                        if (smokeTicksOverflow >= 0) {
                            const _ = this.scene.tryAddParticle(new Smoke_1.Smoke(this.position));
                            this.smokeTicks = smokeTicksOverflow;
                        }
                    }
                }
            };
            exports_73("Campfire", Campfire);
        }
    };
});
System.register("world/objects/mushroom", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_74, context_74) {
    "use strict";
    var StaticGameObject_6, ObjectSkin_10, ObjectPhysics_11, Vector2_30, mushroom;
    var __moduleName = context_74 && context_74.id;
    return {
        setters: [
            function (StaticGameObject_6_1) {
                StaticGameObject_6 = StaticGameObject_6_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (Vector2_30_1) {
                Vector2_30 = Vector2_30_1;
            }
        ],
        execute: function () {
            exports_74("mushroom", mushroom = (options) => {
                const physics = new ObjectPhysics_11.ObjectPhysics(` `, `x`);
                physics.lightsMap = { 'x': { intensity: '8', color: [255, 255, 0] } };
                const object = new StaticGameObject_6.StaticGameObject(Vector2_30.Vector2.zero, new ObjectSkin_10.ObjectSkin(`🍄`), physics, Vector2_30.Vector2.from(options.position));
                return object;
            });
        }
    };
});
System.register("world/levels/dungeon", ["engine/Level", "world/objects/door", "world/objects/campfire", "utils/layer", "world/objects/house", "engine/data/Tiles", "world/objects/mushroom"], function (exports_75, context_75) {
    "use strict";
    var Level_2, door_2, campfire_1, layer_2, house_2, Tiles_2, mushroom_1, walls, campfires, mushrooms, doors, objects, level, dungeonLevel;
    var __moduleName = context_75 && context_75.id;
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
            function (layer_2_1) {
                layer_2 = layer_2_1;
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
            level.roofHolesLayer = layer_2.fillLayer(level.size, false);
            if (false) { // add test hole
                level.roofHolesLayer[7][8] = true;
                level.roofHolesLayer[8][7] = true;
                level.roofHolesLayer[8][8] = true;
                level.roofHolesLayer[8][9] = true;
                level.roofHolesLayer[9][8] = true;
            }
            level.roofLayer = layer_2.fillLayer(level.size, 15);
            if (true) { // add gradient
                layer_2.forLayer(level.roofLayer, (l, [x, y]) => {
                    const v = 8 + Math.sin(x / 2) * 8;
                    const roofValue = Math.min(15, Math.max(0, Math.round(v)));
                    l[y][x] = roofValue;
                    if (roofValue === 0) {
                        level.roofHolesLayer[y][x] = true;
                    }
                });
            }
            exports_75("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/npcs/bee", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions", "engine/data/Vector2"], function (exports_76, context_76) {
    "use strict";
    var Npc_6, ObjectSkin_11, WanderingBehavior_2, NpcMovementOptions_3, Vector2_31, Bee;
    var __moduleName = context_76 && context_76.id;
    function bee(options) {
        return new Bee(Vector2_31.Vector2.from(options.position));
    }
    exports_76("bee", bee);
    return {
        setters: [
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (WanderingBehavior_2_1) {
                WanderingBehavior_2 = WanderingBehavior_2_1;
            },
            function (NpcMovementOptions_3_1) {
                NpcMovementOptions_3 = NpcMovementOptions_3_1;
            },
            function (Vector2_31_1) {
                Vector2_31 = Vector2_31_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_6.Npc {
                constructor(position) {
                    super(new ObjectSkin_11.ObjectSkin(`🐝`, `.`, {
                        '.': ['yellow', 'transparent'],
                    }), position);
                    this.type = "bee";
                    this.realm = "sky";
                    this.movementOptions = NpcMovementOptions_3.defaultMovementOptions.flying;
                    this.behaviors.push(new WanderingBehavior_2.WanderingBehavior());
                }
            };
            exports_76("Bee", Bee);
        }
    };
});
System.register("world/behaviors/PreyGroupBehavior", ["world/behaviors/WanderingBehavior"], function (exports_77, context_77) {
    "use strict";
    var WanderingBehavior_3, PreyGroupBehavior;
    var __moduleName = context_77 && context_77.id;
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
            exports_77("PreyGroupBehavior", PreyGroupBehavior);
        }
    };
});
System.register("world/npcs/duck", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/data/Vector2"], function (exports_78, context_78) {
    "use strict";
    var Npc_7, ObjectSkin_12, PreyGroupBehavior_1, Vector2_32, Duck;
    var __moduleName = context_78 && context_78.id;
    function duck(options) {
        return new Duck(Vector2_32.Vector2.from(options.position));
    }
    exports_78("duck", duck);
    return {
        setters: [
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (PreyGroupBehavior_1_1) {
                PreyGroupBehavior_1 = PreyGroupBehavior_1_1;
            },
            function (Vector2_32_1) {
                Vector2_32 = Vector2_32_1;
            }
        ],
        execute: function () {
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_7.Npc {
                constructor(position) {
                    super(new ObjectSkin_12.ObjectSkin(`🦆`, `.`, {
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
                        duck.skin.setBackgroundAt([0, 0], "#FF000055");
                    }
                    else if (duck.parameters["stress"] > 1) {
                        duck.skin.setBackgroundAt([0, 0], "#FF8C0055");
                    }
                    else if (duck.parameters["stress"] > 0) {
                        duck.skin.setBackgroundAt([0, 0], "#FFFF0055");
                    }
                    else {
                        duck.skin.setBackgroundAt([0, 0], "transparent");
                    }
                }
            };
        }
    };
});
System.register("world/npcs/sheep", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/data/Vector2"], function (exports_79, context_79) {
    "use strict";
    var Npc_8, ObjectSkin_13, PreyGroupBehavior_2, Vector2_33, Sheep;
    var __moduleName = context_79 && context_79.id;
    function sheep(options) {
        return new Sheep(Vector2_33.Vector2.from(options.position));
    }
    exports_79("sheep", sheep);
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (PreyGroupBehavior_2_1) {
                PreyGroupBehavior_2 = PreyGroupBehavior_2_1;
            },
            function (Vector2_33_1) {
                Vector2_33 = Vector2_33_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_8.Npc {
                constructor(position) {
                    super(new ObjectSkin_13.ObjectSkin(`🐑`, `.`, {
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
                        sheep.skin.setBackgroundAt([0, 0], '#FF000055');
                    }
                    else if (sheep.parameters["stress"] > 1) {
                        sheep.skin.setBackgroundAt([0, 0], '#FF8C0055');
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        sheep.skin.setBackgroundAt([0, 0], '#FFFF0055');
                    }
                    else {
                        sheep.skin.setBackgroundAt([0, 0], 'transparent');
                    }
                }
            };
        }
    };
});
System.register("world/objects/lamp", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_80, context_80) {
    "use strict";
    var StaticGameObject_7, ObjectSkin_14, ObjectPhysics_12, Vector2_34, Lamp, lamp;
    var __moduleName = context_80 && context_80.id;
    return {
        setters: [
            function (StaticGameObject_7_1) {
                StaticGameObject_7 = StaticGameObject_7_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
            },
            function (Vector2_34_1) {
                Vector2_34 = Vector2_34_1;
            }
        ],
        execute: function () {
            Lamp = class Lamp extends StaticGameObject_7.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_12.ObjectPhysics(` 
 
.`, `B`);
                    super(new Vector2_34.Vector2(0, 2), new ObjectSkin_14.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                        'L': ['yellow', 'transparent'],
                        'H': ['#666', 'transparent'],
                    }), physics, Vector2_34.Vector2.from(options.position));
                    this.setLampState(options.isOn === true);
                    this.setAction({
                        position: new Vector2_34.Vector2(0, 2),
                        action: (ctx) => ctx.obj.toggle(),
                        iconPosition: Vector2_34.Vector2.zero
                    });
                }
                setLampState(isOn) {
                    const o = this;
                    o.parameters["is_on"] = isOn;
                    o.skin.setForegroundAt([0, 0], isOn ? 'yellow' : 'black');
                    o.physics.lights[0] = isOn ? 'B' : '0';
                }
                toggle() {
                    const isOn = this.parameters["is_on"];
                    this.setLampState(!isOn);
                }
            };
            exports_80("Lamp", Lamp);
            exports_80("lamp", lamp = (options) => {
                const object = new Lamp(options);
                return object;
            });
        }
    };
});
System.register("world/objects/bamboo", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/data/Vector2", "engine/events/EventLoop", "engine/objects/StaticGameObject", "world/events/RemoveObjectGameEvent", "world/events/TransferItemsGameEvent", "world/items"], function (exports_81, context_81) {
    "use strict";
    var ObjectPhysics_13, ObjectSkin_15, Vector2_35, EventLoop_8, StaticGameObject_8, RemoveObjectGameEvent_3, TransferItemsGameEvent_3, items_3;
    var __moduleName = context_81 && context_81.id;
    function bamboo(options) {
        const object = new StaticGameObject_8.StaticGameObject(new Vector2_35.Vector2(0, 4), new ObjectSkin_15.ObjectSkin(`▄
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
        }), new ObjectPhysics_13.ObjectPhysics(` 
 
 
 
 
.`, ``), Vector2_35.Vector2.from(options.position));
        object.type = "bamboo";
        // TODO: only using an axe.
        object.setAction({
            position: new Vector2_35.Vector2(0, 5),
            action: ctx => {
                EventLoop_8.emitEvent(RemoveObjectGameEvent_3.RemoveObjectGameEvent.create(ctx.obj));
                EventLoop_8.emitEvent(TransferItemsGameEvent_3.TransferItemsGameEvent.create(ctx.initiator, [items_3.bambooSeed()]));
            }
        });
        return object;
    }
    exports_81("bamboo", bamboo);
    return {
        setters: [
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (Vector2_35_1) {
                Vector2_35 = Vector2_35_1;
            },
            function (EventLoop_8_1) {
                EventLoop_8 = EventLoop_8_1;
            },
            function (StaticGameObject_8_1) {
                StaticGameObject_8 = StaticGameObject_8_1;
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
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_82, context_82) {
    "use strict";
    var Sprite_8, treeSpriteRaw, treeSprite;
    var __moduleName = context_82 && context_82.id;
    return {
        setters: [
            function (Sprite_8_1) {
                Sprite_8 = Sprite_8_1;
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
            exports_82("treeSprite", treeSprite = Sprite_8.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/StaticGameObject"], function (exports_83, context_83) {
    "use strict";
    var StaticGameObject_9, Tree;
    var __moduleName = context_83 && context_83.id;
    return {
        setters: [
            function (StaticGameObject_9_1) {
                StaticGameObject_9 = StaticGameObject_9_1;
            }
        ],
        execute: function () {
            Tree = class Tree extends StaticGameObject_9.StaticGameObject {
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
                                const { width, height } = this.skin.size;
                                for (let y = 0; y < height; y++) {
                                    for (let x = 0; x < width; x++) {
                                        if (this.physics.tops[y] && this.physics.tops[y][x] !== ' ') {
                                            this.skin.setBackgroundAt([x, y], 'white');
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
            exports_83("Tree", Tree);
            ;
        }
    };
});
System.register("world/objects/pineTree", ["engine/components/ObjectPhysics", "engine/data/Vector2", "world/sprites/tree", "world/objects/Tree"], function (exports_84, context_84) {
    "use strict";
    var ObjectPhysics_14, Vector2_36, tree_1, Tree_1, PineTree;
    var __moduleName = context_84 && context_84.id;
    function pineTree(options) {
        return new PineTree(Vector2_36.Vector2.from(options.position));
    }
    exports_84("pineTree", pineTree);
    return {
        setters: [
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            },
            function (Vector2_36_1) {
                Vector2_36 = Vector2_36_1;
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
                    super(new Vector2_36.Vector2(1, 3), tree_1.treeSprite, new ObjectPhysics_14.ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), position);
                }
            };
        }
    };
});
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_85, context_85) {
    "use strict";
    var Sprite_9, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_85 && context_85.id;
    return {
        setters: [
            function (Sprite_9_1) {
                Sprite_9 = Sprite_9_1;
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
            exports_85("sakuraSprite", sakuraSprite = Sprite_9.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/sakuraTree", ["engine/components/ObjectPhysics", "engine/data/Vector2", "world/sprites/sakura", "world/objects/Tree"], function (exports_86, context_86) {
    "use strict";
    var ObjectPhysics_15, Vector2_37, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_86 && context_86.id;
    function sakuraTree(options) {
        return new SakuraTree(Vector2_37.Vector2.from(options.position));
    }
    exports_86("sakuraTree", sakuraTree);
    return {
        setters: [
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            },
            function (Vector2_37_1) {
                Vector2_37 = Vector2_37_1;
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
                    super(new Vector2_37.Vector2(2, 3), sakura_1.sakuraSprite, new ObjectPhysics_15.ObjectPhysics(`
    
    
  .`, '', '', ` .. 
....
    
    `), position);
                }
            };
        }
    };
});
System.register("world/objects/beehive", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/items", "world/actions", "engine/data/Vector2"], function (exports_87, context_87) {
    "use strict";
    var StaticGameObject_10, ObjectSkin_16, ObjectPhysics_16, items_4, actions_2, Vector2_38;
    var __moduleName = context_87 && context_87.id;
    function beehive(options) {
        const obj = new StaticGameObject_10.StaticGameObject(Vector2_38.Vector2.zero, new ObjectSkin_16.ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }), new ObjectPhysics_16.ObjectPhysics(`.`), Vector2_38.Vector2.from(options.position));
        obj.inventory.addItems([items_4.honeyPot()]);
        obj.setAction(actions_2.storageAction(obj));
        return obj;
    }
    exports_87("beehive", beehive);
    return {
        setters: [
            function (StaticGameObject_10_1) {
                StaticGameObject_10 = StaticGameObject_10_1;
            },
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (items_4_1) {
                items_4 = items_4_1;
            },
            function (actions_2_1) {
                actions_2 = actions_2_1;
            },
            function (Vector2_38_1) {
                Vector2_38 = Vector2_38_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/natural", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_88, context_88) {
    "use strict";
    var StaticGameObject_11, ObjectSkin_17, ObjectPhysics_17, Vector2_39, createUnitSkin, createUnitPhysics, createUnitStaticObject, flower, wheat, hotspring;
    var __moduleName = context_88 && context_88.id;
    return {
        setters: [
            function (StaticGameObject_11_1) {
                StaticGameObject_11 = StaticGameObject_11_1;
            },
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (Vector2_39_1) {
                Vector2_39 = Vector2_39_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_17.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            createUnitPhysics = () => new ObjectPhysics_17.ObjectPhysics(` `);
            createUnitStaticObject = (options) => new StaticGameObject_11.StaticGameObject(Vector2_39.Vector2.zero, createUnitSkin(options.sym, options.color), createUnitPhysics(), Vector2_39.Vector2.from(options.position));
            exports_88("flower", flower = (options) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' }));
            exports_88("wheat", wheat = (options) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' }));
            exports_88("hotspring", hotspring = (options) => new StaticGameObject_11.StaticGameObject(Vector2_39.Vector2.zero, createUnitSkin(`♨`, 'lightblue'), new ObjectPhysics_17.ObjectPhysics(' ', ' ', 'A'), Vector2_39.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/pillar", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/data/Vector2", "engine/objects/StaticGameObject"], function (exports_89, context_89) {
    "use strict";
    var ObjectPhysics_18, ObjectSkin_18, Vector2_40, StaticGameObject_12, pillar;
    var __moduleName = context_89 && context_89.id;
    return {
        setters: [
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            },
            function (Vector2_40_1) {
                Vector2_40 = Vector2_40_1;
            },
            function (StaticGameObject_12_1) {
                StaticGameObject_12 = StaticGameObject_12_1;
            }
        ],
        execute: function () {
            exports_89("pillar", pillar = (options) => new StaticGameObject_12.StaticGameObject(new Vector2_40.Vector2(0, 3), new ObjectSkin_18.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_18.ObjectPhysics(` 
 
 
. `), Vector2_40.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/shop", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/data/Vector2", "engine/objects/StaticGameObject"], function (exports_90, context_90) {
    "use strict";
    var ObjectPhysics_19, ObjectSkin_19, Vector2_41, StaticGameObject_13, shop;
    var __moduleName = context_90 && context_90.id;
    return {
        setters: [
            function (ObjectPhysics_19_1) {
                ObjectPhysics_19 = ObjectPhysics_19_1;
            },
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (Vector2_41_1) {
                Vector2_41 = Vector2_41_1;
            },
            function (StaticGameObject_13_1) {
                StaticGameObject_13 = StaticGameObject_13_1;
            }
        ],
        execute: function () {
            exports_90("shop", shop = (options) => new StaticGameObject_13.StaticGameObject(new Vector2_41.Vector2(2, 3), new ObjectSkin_19.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_19.ObjectPhysics(`       
       
 ..... `), Vector2_41.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/arc", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/data/Vector2", "engine/objects/StaticGameObject"], function (exports_91, context_91) {
    "use strict";
    var ObjectPhysics_20, ObjectSkin_20, Vector2_42, StaticGameObject_14, arc;
    var __moduleName = context_91 && context_91.id;
    return {
        setters: [
            function (ObjectPhysics_20_1) {
                ObjectPhysics_20 = ObjectPhysics_20_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (Vector2_42_1) {
                Vector2_42 = Vector2_42_1;
            },
            function (StaticGameObject_14_1) {
                StaticGameObject_14 = StaticGameObject_14_1;
            }
        ],
        execute: function () {
            exports_91("arc", arc = (options) => new StaticGameObject_14.StaticGameObject(new Vector2_42.Vector2(2, 3), new ObjectSkin_20.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_20.ObjectPhysics(`     
     
     
.   .`), Vector2_42.Vector2.from(options.position)));
        }
    };
});
System.register("world/tiles", ["engine/data/TileInfo"], function (exports_92, context_92) {
    "use strict";
    var TileInfo_2, tiles;
    var __moduleName = context_92 && context_92.id;
    return {
        setters: [
            function (TileInfo_2_1) {
                TileInfo_2 = TileInfo_2_1;
            }
        ],
        execute: function () {
            exports_92("tiles", tiles = {
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
System.register("world/levels/ggj2020demo/tiles", ["engine/data/Tiles", "world/tiles"], function (exports_93, context_93) {
    "use strict";
    var Tiles_3, tiles_1, levelTiles;
    var __moduleName = context_93 && context_93.id;
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
            exports_93("levelTiles", levelTiles = Tiles_3.Tiles.parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
System.register("world/levels/ggj2020demo/level", ["engine/Level", "world/npcs/bee", "world/npcs/duck", "world/npcs/sheep", "world/objects/lamp", "world/objects/house", "world/objects/bamboo", "world/objects/pineTree", "world/objects/sakuraTree", "world/objects/beehive", "world/objects/natural", "world/levels/ggj2020demo/objects/pillar", "world/levels/ggj2020demo/objects/shop", "world/levels/ggj2020demo/objects/arc", "world/levels/ggj2020demo/tiles", "world/objects/fence", "world/objects/door"], function (exports_94, context_94) {
    "use strict";
    var Level_3, bee_1, duck_1, sheep_1, lamp_1, house_3, bamboo_1, pineTree_1, sakuraTree_1, beehive_1, natural_1, pillar_1, shop_1, arc_1, tiles_2, fence_2, door_3, levelHeight, levelWidth, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, doors, objects, level;
    var __moduleName = context_94 && context_94.id;
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
            exports_94("level", level = new Level_3.Level('ggj2020demo', objects, tiles_2.levelTiles));
        }
    };
});
System.register("engine/components/CompositeObjectSkin", ["engine/data/Vector2", "engine/components/ObjectSkin"], function (exports_95, context_95) {
    "use strict";
    var Vector2_43, ObjectSkin_21, CompositeObjectSkin;
    var __moduleName = context_95 && context_95.id;
    return {
        setters: [
            function (Vector2_43_1) {
                Vector2_43 = Vector2_43_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            }
        ],
        execute: function () {
            CompositeObjectSkin = class CompositeObjectSkin extends ObjectSkin_21.ObjectSkin {
                get size() {
                    return this.skins
                        .map(x => x.size)
                        .reduce((a, x) => a.max(x), new Vector2_43.Vector2());
                }
                constructor(skins) {
                    super();
                    this.skins = skins;
                }
                setForegroundAt(position, foreground) {
                    for (const skin of this.skins) {
                        skin.setForegroundAt(position, foreground);
                    }
                }
                setBackgroundAt(position, background) {
                    for (const skin of this.skins) {
                        skin.setBackgroundAt(position, background);
                    }
                }
                getCellsAt(position) {
                    return this.skins.flatMap(x => x.getCellsAt(position));
                }
                isEmptyCellAt(position) {
                    return this.skins.map(x => x.isEmptyCellAt(position)).reduce((a, x) => a && (a = x), true);
                }
            };
            exports_95("CompositeObjectSkin", CompositeObjectSkin);
        }
    };
});
System.register("world/objects/signals/LightSource", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Sides", "engine/components/CompositeObjectSkin", "engine/data/Vector2"], function (exports_96, context_96) {
    "use strict";
    var StaticGameObject_15, ObjectSkin_22, ObjectPhysics_21, Sides_1, CompositeObjectSkin_1, Vector2_44, LightSource;
    var __moduleName = context_96 && context_96.id;
    return {
        setters: [
            function (StaticGameObject_15_1) {
                StaticGameObject_15 = StaticGameObject_15_1;
            },
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (ObjectPhysics_21_1) {
                ObjectPhysics_21 = ObjectPhysics_21_1;
            },
            function (Sides_1_1) {
                Sides_1 = Sides_1_1;
            },
            function (CompositeObjectSkin_1_1) {
                CompositeObjectSkin_1 = CompositeObjectSkin_1_1;
            },
            function (Vector2_44_1) {
                Vector2_44 = Vector2_44_1;
            }
        ],
        execute: function () {
            LightSource = class LightSource extends StaticGameObject_15.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_21.ObjectPhysics(` `, `x`);
                    physics.lightsMap = { 'x': { intensity: options.intensity || 'F', color: options.color } };
                    physics.signalCells.push({
                        position: new Vector2_44.Vector2(),
                        sides: Sides_1.SidesHelper.all(),
                        inputSides: Sides_1.SidesHelper.all(),
                    });
                    const lightColor = `rgb(${options.color[0]}, ${options.color[1]}, ${options.color[2]})`;
                    const mainSkin = new ObjectSkin_22.ObjectSkin(`⏺`, `L`, {
                        'L': [undefined, 'transparent'],
                    });
                    const skin = new CompositeObjectSkin_1.CompositeObjectSkin([mainSkin, new ObjectSkin_22.ObjectSkin('⭘', '.', { '.': [lightColor, 'transparent'] })]);
                    super(Vector2_44.Vector2.zero, skin, physics, Vector2_44.Vector2.from(options.position));
                    this._isOn = false;
                    this._maxIntensity = 'F';
                    this._mainSkin = mainSkin;
                    this.type = "light_source";
                    this._color = lightColor;
                    this._maxIntensity = options.intensity || 'F';
                    this._requiresSignal = typeof options.requiresSignal === "undefined" ? true : options.requiresSignal;
                    this.setAction(ctx => ctx.obj.toggle());
                    this.setLampState(!this._requiresSignal);
                }
                initialize() {
                    this.setLampState(false);
                }
                processSignalTransfer(transfer) {
                    const isSignaled = transfer.signal.value > 0;
                    if (isSignaled) {
                        this.setLampState(true);
                    }
                    return [];
                }
                setLampState(isOn) {
                    this._isOn = isOn;
                    this._mainSkin.setForegroundAt([0, 0], isOn ? this._color : 'black');
                    this.physics.lightsMap['x'].intensity = isOn ? this._maxIntensity : '0';
                }
                toggle() {
                    this.setLampState(!this._isOn);
                }
            };
            exports_96("LightSource", LightSource);
        }
    };
});
System.register("world/levels/house", ["engine/Level", "world/objects/door", "utils/layer", "world/objects/house", "engine/data/Tiles", "world/tiles", "world/objects/signals/LightSource"], function (exports_97, context_97) {
    "use strict";
    var Level_4, door_4, layer_3, house_4, Tiles_4, tiles_3, LightSource_1, walls, margin, left, top, width, height, campfires, lightSources, doors, objects, level, houseLevel;
    var __moduleName = context_97 && context_97.id;
    return {
        setters: [
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (door_4_1) {
                door_4 = door_4_1;
            },
            function (layer_3_1) {
                layer_3 = layer_3_1;
            },
            function (house_4_1) {
                house_4 = house_4_1;
            },
            function (Tiles_4_1) {
                Tiles_4 = Tiles_4_1;
            },
            function (tiles_3_1) {
                tiles_3 = tiles_3_1;
            },
            function (LightSource_1_1) {
                LightSource_1 = LightSource_1_1;
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
                new LightSource_1.LightSource({ position: [6, 10], color: [255, 0, 0], requiresSignal: false }),
                new LightSource_1.LightSource({ position: [12, 10], color: [0, 255, 0], requiresSignal: false }),
                new LightSource_1.LightSource({ position: [9, 13], color: [0, 0, 255], requiresSignal: false }),
            ];
            doors = [
                door_4.door('house', { position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...doors, ...campfires, ...lightSources];
            level = new Level_4.Level('house', objects, Tiles_4.Tiles.createEmptyMap(20, 20, () => tiles_3.tiles.bridge_stone));
            level.roofHolesLayer = layer_3.fillLayer(level.size, true);
            level.roofLayer = layer_3.fillLayer(level.size, 0);
            if (true) { // add gradient
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        level.roofHolesLayer[top + y][left + x] = false;
                        level.roofLayer[top + y][left + x] = 15;
                    }
                }
            }
            exports_97("houseLevel", houseLevel = level);
        }
    };
});
System.register("world/levels/intro", ["world/objects/chest", "world/objects/lamp", "world/objects/house", "engine/events/EventLoop", "engine/events/GameEvent", "engine/Level", "world/objects/pineTree", "world/objects/door", "world/objects/bamboo", "engine/objects/Npc", "engine/components/ObjectSkin", "engine/data/Tiles", "world/items", "engine/data/Vector2"], function (exports_98, context_98) {
    "use strict";
    var chest_2, lamp_2, house_5, EventLoop_9, GameEvent_11, Level_5, pineTree_2, door_5, bamboo_2, Npc_9, ObjectSkin_23, Tiles_5, items_5, Vector2_45, lamps, doors, house1, tree1, chest1, trees, ulan, npcs, objects, introLevel;
    var __moduleName = context_98 && context_98.id;
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
            function (EventLoop_9_1) {
                EventLoop_9 = EventLoop_9_1;
            },
            function (GameEvent_11_1) {
                GameEvent_11 = GameEvent_11_1;
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
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (Tiles_5_1) {
                Tiles_5 = Tiles_5_1;
            },
            function (items_5_1) {
                items_5 = items_5_1;
            },
            function (Vector2_45_1) {
                Vector2_45 = Vector2_45_1;
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
            exports_98("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x2, y] }));
                }
            }
            ulan = new Npc_9.Npc(new ObjectSkin_23.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), new Vector2_45.Vector2(4, 4));
            ulan.setAction((ctx) => {
                const o = ctx.obj;
                EventLoop_9.emitEvent(new GameEvent_11.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            npcs = [
                ulan,
            ];
            objects = [house1, chest1, tree1, ...trees, ...lamps, ...npcs, ...doors];
            exports_98("introLevel", introLevel = new Level_5.Level('intro', objects, Tiles_5.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/headStone", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_99, context_99) {
    "use strict";
    var ObjectSkin_24, StaticGameObject_16, ObjectPhysics_22, Vector2_46, headStone;
    var __moduleName = context_99 && context_99.id;
    return {
        setters: [
            function (ObjectSkin_24_1) {
                ObjectSkin_24 = ObjectSkin_24_1;
            },
            function (StaticGameObject_16_1) {
                StaticGameObject_16 = StaticGameObject_16_1;
            },
            function (ObjectPhysics_22_1) {
                ObjectPhysics_22 = ObjectPhysics_22_1;
            },
            function (Vector2_46_1) {
                Vector2_46 = Vector2_46_1;
            }
        ],
        execute: function () {
            exports_99("headStone", headStone = (options) => new StaticGameObject_16.StaticGameObject(Vector2_46.Vector2.zero, new ObjectSkin_24.ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_22.ObjectPhysics('.'), Vector2_46.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/lights", ["world/objects/campfire", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/headStone", "world/objects/house", "engine/data/Tiles", "world/objects/door"], function (exports_100, context_100) {
    "use strict";
    var campfire_2, Level_6, pineTree_3, fence_3, headStone_1, house_6, Tiles_6, door_6, fences, headStones, walls, tree2, campfires, doors, objects, level, lightsLevel;
    var __moduleName = context_100 && context_100.id;
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
            exports_100("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/objects/particles/Mist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle"], function (exports_101, context_101) {
    "use strict";
    var ObjectSkin_25, Sprite_10, Particle_6, Mist;
    var __moduleName = context_101 && context_101.id;
    return {
        setters: [
            function (ObjectSkin_25_1) {
                ObjectSkin_25 = ObjectSkin_25_1;
            },
            function (Sprite_10_1) {
                Sprite_10 = Sprite_10_1;
            },
            function (Particle_6_1) {
                Particle_6 = Particle_6_1;
            }
        ],
        execute: function () {
            Mist = class Mist extends Particle_6.Particle {
                constructor(position) {
                    const sprite = new Sprite_10.Sprite();
                    const skin = new ObjectSkin_25.ObjectSkin(' ', '.', { '.': [undefined, '#fff'] });
                    sprite.frames[Particle_6.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "mist";
                }
            };
            exports_101("Mist", Mist);
        }
    };
});
System.register("world/levels/mistlandLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/campfire", "world/objects/particles/Mist", "world/objects/pineTree", "engine/data/Vector2"], function (exports_102, context_102) {
    "use strict";
    var Level_7, fence_4, door_7, Tiles_7, campfire_3, Mist_1, pineTree_4, Vector2_47, fences, width, height, trees, fires, doors, objects, mistlandLevel;
    var __moduleName = context_102 && context_102.id;
    return {
        setters: [
            function (Level_7_1) {
                Level_7 = Level_7_1;
            },
            function (fence_4_1) {
                fence_4 = fence_4_1;
            },
            function (door_7_1) {
                door_7 = door_7_1;
            },
            function (Tiles_7_1) {
                Tiles_7 = Tiles_7_1;
            },
            function (campfire_3_1) {
                campfire_3 = campfire_3_1;
            },
            function (Mist_1_1) {
                Mist_1 = Mist_1_1;
            },
            function (pineTree_4_1) {
                pineTree_4 = pineTree_4_1;
            },
            function (Vector2_47_1) {
                Vector2_47 = Vector2_47_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 24;
            height = 24;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_4.fence({ position: [x, 0] }));
                    fences.push(fence_4.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_4.fence({ position: [0, y] }));
                    fences.push(fence_4.fence({ position: [width - 1, y] }));
                }
            }
            trees = [
                pineTree_4.pineTree({ position: [5, 12] }),
                pineTree_4.pineTree({ position: [12, 5] }),
            ];
            fires = [
                new campfire_3.Campfire(new Vector2_47.Vector2(12, 12)),
            ];
            doors = [
                door_7.door('mistland', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...trees, ...fires];
            exports_102("mistlandLevel", mistlandLevel = new class extends Level_7.Level {
                constructor() {
                    super('mistland', objects, Tiles_7.Tiles.createEmpty(width, height));
                    this.wind = new Vector2_47.Vector2(1, 0);
                }
                onLoaded(scene) {
                    super.onLoaded(scene);
                    this.fillMist(scene);
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.fillMist(scene);
                }
                fillMist(scene) {
                    const box = scene.windBox;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const p = new Vector2_47.Vector2(x, y);
                            if (scene.isParticlePositionBlocked(p)) {
                                continue;
                            }
                            scene.tryAddParticle(new Mist_1.Mist(p));
                        }
                    }
                }
            }());
        }
    };
});
System.register("world/levels/particlesLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/campfire", "engine/data/Vector2"], function (exports_103, context_103) {
    "use strict";
    var Level_8, fence_5, door_8, Tiles_8, campfire_4, Vector2_48, fences, width, height, fires, doors, objects, particlesLevel;
    var __moduleName = context_103 && context_103.id;
    return {
        setters: [
            function (Level_8_1) {
                Level_8 = Level_8_1;
            },
            function (fence_5_1) {
                fence_5 = fence_5_1;
            },
            function (door_8_1) {
                door_8 = door_8_1;
            },
            function (Tiles_8_1) {
                Tiles_8 = Tiles_8_1;
            },
            function (campfire_4_1) {
                campfire_4 = campfire_4_1;
            },
            function (Vector2_48_1) {
                Vector2_48 = Vector2_48_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 24;
            height = 24;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_5.fence({ position: [x, 0] }));
                    fences.push(fence_5.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_5.fence({ position: [0, y] }));
                    fences.push(fence_5.fence({ position: [width - 1, y] }));
                }
            }
            fires = [
                new campfire_4.Campfire(new Vector2_48.Vector2(10, 10)),
                new campfire_4.Campfire(new Vector2_48.Vector2(5, 20)),
            ];
            doors = [
                door_8.door('particles', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...fires];
            exports_103("particlesLevel", particlesLevel = new class extends Level_8.Level {
                constructor() {
                    super('particles', objects, Tiles_8.Tiles.createEmpty(width, height));
                    this.wind = new Vector2_48.Vector2(1, 1);
                }
                onLoaded(scene) {
                    super.onLoaded(scene);
                    this.changeWeather("snow");
                }
            }());
        }
    };
});
System.register("world/behaviors/HunterBehavior", ["world/behaviors/WanderingBehavior"], function (exports_104, context_104) {
    "use strict";
    var WanderingBehavior_4, HunterBehavior;
    var __moduleName = context_104 && context_104.id;
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
            exports_104("HunterBehavior", HunterBehavior);
        }
    };
});
System.register("world/npcs/wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/HunterBehavior", "engine/objects/NpcMovementOptions", "engine/data/Vector2"], function (exports_105, context_105) {
    "use strict";
    var Npc_10, ObjectSkin_26, HunterBehavior_1, NpcMovementOptions_4, Vector2_49, Wolf;
    var __moduleName = context_105 && context_105.id;
    function wolf(options) {
        return new Wolf(Vector2_49.Vector2.from(options.position));
    }
    exports_105("wolf", wolf);
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
            },
            function (Vector2_49_1) {
                Vector2_49 = Vector2_49_1;
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
                        wolf.skin.setBackgroundAt([0, 0], '#FF000055');
                    }
                    else if (wolf.parameters["state"] === "hunting") {
                        wolf.skin.setBackgroundAt([0, 0], 'violet');
                    }
                    else if (wolf.parameters["state"] === "wandering") {
                        wolf.skin.setBackgroundAt([0, 0], 'yellow');
                    }
                    else {
                        wolf.skin.setBackgroundAt([0, 0], 'transparent');
                    }
                }
            };
            ;
        }
    };
});
System.register("world/levels/sheep", ["world/objects/campfire", "world/npcs/sheep", "world/npcs/wolf", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/door", "engine/data/Tiles"], function (exports_106, context_106) {
    "use strict";
    var campfire_5, sheep_2, wolf_1, Level_9, pineTree_5, fence_6, door_9, Tiles_9, sheeps, wolves, fences, tree2, campfires, doors, objects, sheepLevel;
    var __moduleName = context_106 && context_106.id;
    return {
        setters: [
            function (campfire_5_1) {
                campfire_5 = campfire_5_1;
            },
            function (sheep_2_1) {
                sheep_2 = sheep_2_1;
            },
            function (wolf_1_1) {
                wolf_1 = wolf_1_1;
            },
            function (Level_9_1) {
                Level_9 = Level_9_1;
            },
            function (pineTree_5_1) {
                pineTree_5 = pineTree_5_1;
            },
            function (fence_6_1) {
                fence_6 = fence_6_1;
            },
            function (door_9_1) {
                door_9 = door_9_1;
            },
            function (Tiles_9_1) {
                Tiles_9 = Tiles_9_1;
            }
        ],
        execute: function () {
            sheeps = [];
            wolves = [];
            fences = [];
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(fence_6.fence({ position: [x, 1] }));
                    fences.push(fence_6.fence({ position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(fence_6.fence({ position: [1, y] }));
                    fences.push(fence_6.fence({ position: [18, y] }));
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
            tree2 = pineTree_5.pineTree({ position: [7, 9] });
            campfires = [
                campfire_5.campfire({ position: [10, 10] }),
            ];
            doors = [
                door_9.door('sheep_door', { position: [4, 2] }),
                door_9.door('sheep_door', { position: [14, 14] }),
                door_9.door('intro_door', { position: [2, 2] }),
                door_9.door('sheeps_door', { position: [2, 4] }),
            ];
            objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...doors];
            exports_106("sheepLevel", sheepLevel = new Level_9.Level('sheep', objects, Tiles_9.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/signals/detectors/LightDetector", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Sides", "engine/data/Vector2", "engine/data/Face"], function (exports_107, context_107) {
    "use strict";
    var StaticGameObject_17, ObjectSkin_27, ObjectPhysics_23, Sides_2, Vector2_50, Face_6, LightDetector;
    var __moduleName = context_107 && context_107.id;
    return {
        setters: [
            function (StaticGameObject_17_1) {
                StaticGameObject_17 = StaticGameObject_17_1;
            },
            function (ObjectSkin_27_1) {
                ObjectSkin_27 = ObjectSkin_27_1;
            },
            function (ObjectPhysics_23_1) {
                ObjectPhysics_23 = ObjectPhysics_23_1;
            },
            function (Sides_2_1) {
                Sides_2 = Sides_2_1;
            },
            function (Vector2_50_1) {
                Vector2_50 = Vector2_50_1;
            },
            function (Face_6_1) {
                Face_6 = Face_6_1;
            }
        ],
        execute: function () {
            LightDetector = class LightDetector extends StaticGameObject_17.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_23.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_50.Vector2.zero,
                        sides: Sides_2.SidesHelper.all(),
                        detectorOf: {
                            light: 10,
                        },
                    });
                    super(Vector2_50.Vector2.zero, new ObjectSkin_27.ObjectSkin(`☀️`, `L`, {
                        'L': ['black', 'gray'],
                    }), physics, Vector2_50.Vector2.from(options.position));
                    this.type = "light_detector";
                }
                updateSource(scene) {
                    const lightLevelAt = scene.getLightAt(this.position);
                    const lightSignalLevel = (lightLevelAt >= 10) ? 1 : -1;
                    this.setEnabled(lightSignalLevel > 0);
                    return Face_6.Faces.map(x => ({ direction: x, signal: { type: "light", value: lightSignalLevel } }));
                }
                setEnabled(value) {
                    this.skin.setForegroundAt([0, 0], value ? 'white' : 'black');
                }
            };
            exports_107("LightDetector", LightDetector);
        }
    };
});
System.register("world/objects/signals/Invertor", ["engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/data/Face", "engine/data/Sprite", "engine/data/Vector2"], function (exports_108, context_108) {
    "use strict";
    var StaticGameObject_18, ObjectPhysics_24, Face_7, Sprite_11, Vector2_51, Invertor;
    var __moduleName = context_108 && context_108.id;
    return {
        setters: [
            function (StaticGameObject_18_1) {
                StaticGameObject_18 = StaticGameObject_18_1;
            },
            function (ObjectPhysics_24_1) {
                ObjectPhysics_24 = ObjectPhysics_24_1;
            },
            function (Face_7_1) {
                Face_7 = Face_7_1;
            },
            function (Sprite_11_1) {
                Sprite_11 = Sprite_11_1;
            },
            function (Vector2_51_1) {
                Vector2_51 = Vector2_51_1;
            }
        ],
        execute: function () {
            Invertor = class Invertor extends StaticGameObject_18.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_24.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_51.Vector2.zero,
                        inputSides: {
                            left: true,
                        },
                        sides: {
                            right: true,
                        },
                        invertorOf: true,
                    });
                    const sprite = Sprite_11.Sprite.parseSimple('><^V'); //('▶️◀️🔼🔽')
                    super(Vector2_51.Vector2.zero, sprite.frames["0"][0], physics, Vector2_51.Vector2.from(options.position));
                    this._face = "right";
                    this._isOn = true;
                    this._sprite = sprite;
                    this.type = "invertor";
                    this.setAction(ctx => ctx.obj.rotate());
                    this.faceTo("right");
                }
                initialize() {
                    this._isOn = true;
                }
                processSignalTransfer(transfer) {
                    const signalCell = this.physics.signalCells[0];
                    const outSide = Object.entries(signalCell.sides).filter(x => x[1]).map(x => x[0])[0];
                    const controlSignalDirection = Face_7.FaceHelper.getNextClockwise(outSide);
                    if (transfer.direction === controlSignalDirection) {
                        this._isOn = false;
                        return [];
                    }
                    const enabledInputs = Object.entries(signalCell.inputSides).filter(x => x[1]).map(x => x[0]);
                    if (!enabledInputs.includes(transfer.direction)) {
                        return [];
                    }
                    const invertedSignal = this.invertSignal(transfer.signal);
                    return [{ direction: Face_7.FaceHelper.getOpposite(transfer.direction), signal: invertedSignal }];
                }
                invertSignal(signal) {
                    const newValue = this._isOn ? (signal.value > 0 ? -1 : 1) : signal.value;
                    return { type: signal.type, value: newValue };
                }
                rotate() {
                    this.faceTo(Face_7.FaceHelper.getNextClockwise(this._face));
                }
                faceTo(face) {
                    this._face = face;
                    const signalCell = this.physics.signalCells[0];
                    signalCell.sides = {};
                    signalCell.sides[face] = true;
                    signalCell.inputSides = {};
                    signalCell.inputSides[Face_7.FaceHelper.getOpposite(face)] = true;
                    if (this._face === "right") {
                        this.skin = this._sprite.frames["0"][0];
                    }
                    else if (this._face === "left") {
                        this.skin = this._sprite.frames["1"][0];
                    }
                    else if (this._face === "top") {
                        this.skin = this._sprite.frames["2"][0];
                    }
                    else if (this._face === "bottom") {
                        this.skin = this._sprite.frames["3"][0];
                    }
                }
            };
            exports_108("Invertor", Invertor);
        }
    };
});
System.register("world/objects/signals/Pipe", ["engine/components/ObjectPhysics", "engine/data/Orientation", "engine/data/Vector2", "engine/data/Sides", "engine/data/Sprite", "engine/objects/StaticGameObject", "engine/data/Face"], function (exports_109, context_109) {
    "use strict";
    var ObjectPhysics_25, Orientation_1, Vector2_52, Sides_3, Sprite_12, StaticGameObject_19, Face_8, Pipe;
    var __moduleName = context_109 && context_109.id;
    return {
        setters: [
            function (ObjectPhysics_25_1) {
                ObjectPhysics_25 = ObjectPhysics_25_1;
            },
            function (Orientation_1_1) {
                Orientation_1 = Orientation_1_1;
            },
            function (Vector2_52_1) {
                Vector2_52 = Vector2_52_1;
            },
            function (Sides_3_1) {
                Sides_3 = Sides_3_1;
            },
            function (Sprite_12_1) {
                Sprite_12 = Sprite_12_1;
            },
            function (StaticGameObject_19_1) {
                StaticGameObject_19 = StaticGameObject_19_1;
            },
            function (Face_8_1) {
                Face_8 = Face_8_1;
            }
        ],
        execute: function () {
            Pipe = class Pipe extends StaticGameObject_19.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_25.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_52.Vector2.zero,
                        sides: Sides_3.SidesHelper.horizontal(),
                    });
                    const sprite = Sprite_12.Sprite.parseSimple('═‖');
                    super(Vector2_52.Vector2.zero, sprite.frames["0"][0], physics, Vector2_52.Vector2.from(options.position));
                    this._sprite = sprite;
                    this.type = "pipe";
                    this.setAction(ctx => ctx.obj.rotate());
                    this.setOrientation(options.orientation || "horizontal");
                }
                processSignalTransfer(transfer) {
                    const signalCell = this.physics.signalCells[0];
                    ;
                    const enabledInputs = Object.entries(signalCell.inputSides).filter(x => x[1]).map(x => x[0]);
                    if (!enabledInputs.includes(transfer.direction)) {
                        return [];
                    }
                    return [{ direction: Face_8.FaceHelper.getOpposite(transfer.direction), signal: transfer.signal }];
                }
                rotate() {
                    this.setOrientation(Orientation_1.OrientationHelper.rotate(this._orientation));
                }
                setOrientation(orientation) {
                    this._orientation = orientation;
                    if (this._orientation === "horizontal") {
                        this.skin = this._sprite.frames["0"][0];
                    }
                    else {
                        this.skin = this._sprite.frames["1"][0];
                    }
                    const signalCell = this.physics.signalCells[0];
                    signalCell.sides = Sides_3.SidesHelper.fromOrientation(this._orientation);
                    signalCell.inputSides = Sides_3.SidesHelper.fromOrientation(this._orientation);
                }
            };
            exports_109("Pipe", Pipe);
        }
    };
});
System.register("world/objects/signals/Lever", ["engine/components/ObjectPhysics", "engine/data/Vector2", "engine/data/Sides", "engine/data/Sprite", "engine/objects/StaticGameObject", "engine/data/Face"], function (exports_110, context_110) {
    "use strict";
    var ObjectPhysics_26, Vector2_53, Sides_4, Sprite_13, StaticGameObject_20, Face_9, Lever;
    var __moduleName = context_110 && context_110.id;
    return {
        setters: [
            function (ObjectPhysics_26_1) {
                ObjectPhysics_26 = ObjectPhysics_26_1;
            },
            function (Vector2_53_1) {
                Vector2_53 = Vector2_53_1;
            },
            function (Sides_4_1) {
                Sides_4 = Sides_4_1;
            },
            function (Sprite_13_1) {
                Sprite_13 = Sprite_13_1;
            },
            function (StaticGameObject_20_1) {
                StaticGameObject_20 = StaticGameObject_20_1;
            },
            function (Face_9_1) {
                Face_9 = Face_9_1;
            }
        ],
        execute: function () {
            Lever = class Lever extends StaticGameObject_20.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_26.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_53.Vector2.zero,
                        sides: Sides_4.SidesHelper.all(),
                    });
                    const sprite = Sprite_13.Sprite.parseSimple('⫯⫰');
                    sprite.frames["0"][0].setForegroundAt([0, 0], 'yellow');
                    sprite.frames["0"][0].setBackgroundAt([0, 0], 'gray');
                    sprite.frames["1"][0].setForegroundAt([0, 0], 'black');
                    sprite.frames["1"][0].setBackgroundAt([0, 0], 'gray');
                    super(Vector2_53.Vector2.zero, sprite.frames["1"][0], physics, Vector2_53.Vector2.from(options.position));
                    this._isOn = false;
                    this._sprite = sprite;
                    this.type = "lever";
                    this.setAction(ctx => ctx.obj.toggle());
                    this.setOn(false);
                }
                updateSource(scene) {
                    if (!this._isOn) {
                        return [];
                    }
                    return Face_9.Faces.map(x => ({ direction: x, signal: { type: "mind", value: 1 } }));
                }
                toggle() {
                    this.setOn(!this._isOn);
                }
                setOn(isOn) {
                    this._isOn = isOn;
                    const signalCell = this.physics.signalCells[0];
                    if (this._isOn) {
                        this.skin = this._sprite.frames["0"][0];
                        signalCell.sourceOf = 1;
                    }
                    else {
                        this.skin = this._sprite.frames["1"][0];
                        signalCell.sourceOf = undefined;
                    }
                }
            };
            exports_110("Lever", Lever);
        }
    };
});
System.register("world/objects/signals/detectors/WeatherDetector", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Sides", "engine/data/Vector2", "engine/data/Face"], function (exports_111, context_111) {
    "use strict";
    var StaticGameObject_21, ObjectSkin_28, ObjectPhysics_27, Sides_5, Vector2_54, Face_10, WeatherDetector;
    var __moduleName = context_111 && context_111.id;
    return {
        setters: [
            function (StaticGameObject_21_1) {
                StaticGameObject_21 = StaticGameObject_21_1;
            },
            function (ObjectSkin_28_1) {
                ObjectSkin_28 = ObjectSkin_28_1;
            },
            function (ObjectPhysics_27_1) {
                ObjectPhysics_27 = ObjectPhysics_27_1;
            },
            function (Sides_5_1) {
                Sides_5 = Sides_5_1;
            },
            function (Vector2_54_1) {
                Vector2_54 = Vector2_54_1;
            },
            function (Face_10_1) {
                Face_10 = Face_10_1;
            }
        ],
        execute: function () {
            WeatherDetector = class WeatherDetector extends StaticGameObject_21.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_27.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_54.Vector2.zero,
                        sides: Sides_5.SidesHelper.all(),
                        detectorOf: {
                            weather: 1,
                        },
                    });
                    super(Vector2_54.Vector2.zero, new ObjectSkin_28.ObjectSkin(`🗲`, `L`, {
                        'L': ['black', 'gray'],
                    }), physics, Vector2_54.Vector2.from(options.position));
                    this.type = "weather_detector";
                }
                updateSource(scene) {
                    const weatherAt = scene.getWeatherAt(this.position);
                    const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : -1;
                    this.setEnabled(weatherLevel > 0);
                    return Face_10.Faces.map(x => ({ direction: x, signal: { type: "weather", value: weatherLevel } }));
                }
                setEnabled(value) {
                    this.skin.setForegroundAt([0, 0], value ? 'white' : 'black');
                }
            };
            exports_111("WeatherDetector", WeatherDetector);
        }
    };
});
System.register("world/objects/signals/detectors/LifeDetector", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Sides", "engine/data/Vector2", "engine/data/Face"], function (exports_112, context_112) {
    "use strict";
    var StaticGameObject_22, ObjectSkin_29, ObjectPhysics_28, Sides_6, Vector2_55, Face_11, LifeDetector;
    var __moduleName = context_112 && context_112.id;
    return {
        setters: [
            function (StaticGameObject_22_1) {
                StaticGameObject_22 = StaticGameObject_22_1;
            },
            function (ObjectSkin_29_1) {
                ObjectSkin_29 = ObjectSkin_29_1;
            },
            function (ObjectPhysics_28_1) {
                ObjectPhysics_28 = ObjectPhysics_28_1;
            },
            function (Sides_6_1) {
                Sides_6 = Sides_6_1;
            },
            function (Vector2_55_1) {
                Vector2_55 = Vector2_55_1;
            },
            function (Face_11_1) {
                Face_11 = Face_11_1;
            }
        ],
        execute: function () {
            LifeDetector = class LifeDetector extends StaticGameObject_22.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_28.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_55.Vector2.zero,
                        sides: Sides_6.SidesHelper.all(),
                        detectorOf: {
                            life: 1,
                        },
                    });
                    super(Vector2_55.Vector2.zero, new ObjectSkin_29.ObjectSkin(`🙑`, `L`, {
                        'L': ['black', 'gray'],
                    }), physics, Vector2_55.Vector2.from(options.position));
                    this.type = "life_detector";
                }
                updateSource(scene) {
                    const npcsAt = [
                        scene.getNpcAt(this.position),
                        ...Face_11.Faces
                            .map(x => Vector2_55.Vector2.fromFace(x))
                            .map(x => this.position.clone().add(x))
                            .map(x => scene.getNpcAt(x))
                    ];
                    const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : -1;
                    this.setEnabled(lifeLevel > 0);
                    return Face_11.Faces.map(x => ({ direction: x, signal: { type: "life", value: lifeLevel } }));
                }
                setEnabled(value) {
                    this.skin.setForegroundAt([0, 0], value ? 'lime' : 'black');
                }
            };
            exports_112("LifeDetector", LifeDetector);
        }
    };
});
System.register("world/objects/signals/detectors/FireDetector", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Sides", "engine/data/Vector2", "engine/data/Face"], function (exports_113, context_113) {
    "use strict";
    var StaticGameObject_23, ObjectSkin_30, ObjectPhysics_29, Sides_7, Vector2_56, Face_12, FireDetector;
    var __moduleName = context_113 && context_113.id;
    return {
        setters: [
            function (StaticGameObject_23_1) {
                StaticGameObject_23 = StaticGameObject_23_1;
            },
            function (ObjectSkin_30_1) {
                ObjectSkin_30 = ObjectSkin_30_1;
            },
            function (ObjectPhysics_29_1) {
                ObjectPhysics_29 = ObjectPhysics_29_1;
            },
            function (Sides_7_1) {
                Sides_7 = Sides_7_1;
            },
            function (Vector2_56_1) {
                Vector2_56 = Vector2_56_1;
            },
            function (Face_12_1) {
                Face_12 = Face_12_1;
            }
        ],
        execute: function () {
            FireDetector = class FireDetector extends StaticGameObject_23.StaticGameObject {
                constructor(options) {
                    const physics = new ObjectPhysics_29.ObjectPhysics(` `);
                    physics.signalCells.push({
                        position: Vector2_56.Vector2.zero,
                        sides: Sides_7.SidesHelper.all(),
                        detectorOf: {
                            fire: 8,
                        },
                    });
                    super(Vector2_56.Vector2.zero, new ObjectSkin_30.ObjectSkin(`㊋`, `L`, {
                        'L': ['black', 'gray'],
                    }), physics, Vector2_56.Vector2.from(options.position));
                    this.type = "fire_detector";
                }
                updateSource(scene) {
                    const temperatureAt = scene.getTemperatureAt(this.position);
                    const temperatureLevel = (temperatureAt >= 8) ? 1 : -1;
                    this.setEnabled(temperatureLevel > 0);
                    return Face_12.Faces.map(x => ({ direction: x, signal: { type: "fire", value: temperatureLevel } }));
                }
                setEnabled(value) {
                    this.skin.setForegroundAt([0, 0], value ? 'red' : 'black');
                }
            };
            exports_113("FireDetector", FireDetector);
        }
    };
});
System.register("world/levels/signalsLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/signals/detectors/LightDetector", "world/objects/signals/Invertor", "world/objects/signals/Pipe", "world/objects/signals/Lever", "world/objects/signals/detectors/WeatherDetector", "world/objects/signals/detectors/LifeDetector", "world/objects/signals/detectors/FireDetector", "world/objects/signals/LightSource", "engine/data/Vector2"], function (exports_114, context_114) {
    "use strict";
    var Level_10, fence_7, door_10, Tiles_10, LightDetector_1, Invertor_1, Pipe_1, Lever_1, WeatherDetector_1, LifeDetector_1, FireDetector_1, LightSource_2, Vector2_57, fences, width, height, elements, doors, objects, signalsLevel;
    var __moduleName = context_114 && context_114.id;
    return {
        setters: [
            function (Level_10_1) {
                Level_10 = Level_10_1;
            },
            function (fence_7_1) {
                fence_7 = fence_7_1;
            },
            function (door_10_1) {
                door_10 = door_10_1;
            },
            function (Tiles_10_1) {
                Tiles_10 = Tiles_10_1;
            },
            function (LightDetector_1_1) {
                LightDetector_1 = LightDetector_1_1;
            },
            function (Invertor_1_1) {
                Invertor_1 = Invertor_1_1;
            },
            function (Pipe_1_1) {
                Pipe_1 = Pipe_1_1;
            },
            function (Lever_1_1) {
                Lever_1 = Lever_1_1;
            },
            function (WeatherDetector_1_1) {
                WeatherDetector_1 = WeatherDetector_1_1;
            },
            function (LifeDetector_1_1) {
                LifeDetector_1 = LifeDetector_1_1;
            },
            function (FireDetector_1_1) {
                FireDetector_1 = FireDetector_1_1;
            },
            function (LightSource_2_1) {
                LightSource_2 = LightSource_2_1;
            },
            function (Vector2_57_1) {
                Vector2_57 = Vector2_57_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 24;
            height = 24;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_7.fence({ position: [x, 0] }));
                    fences.push(fence_7.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_7.fence({ position: [0, y] }));
                    fences.push(fence_7.fence({ position: [width - 1, y] }));
                }
            }
            elements = [
                new LightSource_2.LightSource({ position: [13, 3], color: [0, 255, 0], intensity: 'B', }),
                new Pipe_1.Pipe({ position: [12, 3], orientation: "horizontal" }),
                new Lever_1.Lever({ position: [11, 3] }),
                //
                new LifeDetector_1.LifeDetector({ position: [12, 6] }),
                new WeatherDetector_1.WeatherDetector({ position: [8, 8] }),
                new FireDetector_1.FireDetector({ position: [6, 6] }),
                //
                new LightDetector_1.LightDetector({ position: [9, 10] }),
                new Pipe_1.Pipe({ position: [10, 10] }),
                new Invertor_1.Invertor({ position: [11, 10] }),
                new Pipe_1.Pipe({ position: [12, 10] }),
                new LightSource_2.LightSource({ position: [13, 10], color: [255, 255, 255], intensity: 'B', }),
                new Pipe_1.Pipe({ position: [11, 11], orientation: "vertical" }),
                new Lever_1.Lever({ position: [11, 12] }),
            ];
            doors = [
                door_10.door('signals', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...elements];
            exports_114("signalsLevel", signalsLevel = new class extends Level_10.Level {
                constructor() {
                    super('signals', objects, Tiles_10.Tiles.createEmpty(width, height));
                    this.wind = new Vector2_57.Vector2(1, 1);
                }
                onLoaded(scene) {
                    super.onLoaded(scene);
                }
            }());
        }
    };
});
System.register("world/npcs/turtle", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_115, context_115) {
    "use strict";
    var Npc_11, ObjectSkin_31, MountBehavior_2, NpcMovementOptions_5, Turtle;
    var __moduleName = context_115 && context_115.id;
    return {
        setters: [
            function (Npc_11_1) {
                Npc_11 = Npc_11_1;
            },
            function (ObjectSkin_31_1) {
                ObjectSkin_31 = ObjectSkin_31_1;
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
                    super(new ObjectSkin_31.ObjectSkin(`🐢`), position);
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
                        turtle.skin.setBackgroundAt([0, 0], "#FFFF0055");
                    }
                    else {
                        turtle.skin.setBackgroundAt([0, 0], "#FF00FF55");
                    }
                }
            };
            exports_115("Turtle", Turtle);
        }
    };
});
System.register("world/npcs/deer", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/data/Vector2"], function (exports_116, context_116) {
    "use strict";
    var Npc_12, ObjectSkin_32, MountBehavior_3, Vector2_58, Deer;
    var __moduleName = context_116 && context_116.id;
    function deer(options) {
        return new Deer(Vector2_58.Vector2.from(options.position));
    }
    exports_116("deer", deer);
    return {
        setters: [
            function (Npc_12_1) {
                Npc_12 = Npc_12_1;
            },
            function (ObjectSkin_32_1) {
                ObjectSkin_32 = ObjectSkin_32_1;
            },
            function (MountBehavior_3_1) {
                MountBehavior_3 = MountBehavior_3_1;
            },
            function (Vector2_58_1) {
                Vector2_58 = Vector2_58_1;
            }
        ],
        execute: function () {
            Deer = class Deer extends Npc_12.Npc {
                constructor(position) {
                    super(new ObjectSkin_32.ObjectSkin(`🦌`), position);
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
                        deer.skin.setBackgroundAt([0, 0], "#FFFF0055");
                    }
                    else {
                        deer.skin.setBackgroundAt([0, 0], "#FF00FF55");
                    }
                }
            };
            exports_116("Deer", Deer);
        }
    };
});
System.register("world/npcs/snail", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior"], function (exports_117, context_117) {
    "use strict";
    var Npc_13, ObjectSkin_33, MountBehavior_4, Snail;
    var __moduleName = context_117 && context_117.id;
    return {
        setters: [
            function (Npc_13_1) {
                Npc_13 = Npc_13_1;
            },
            function (ObjectSkin_33_1) {
                ObjectSkin_33 = ObjectSkin_33_1;
            },
            function (MountBehavior_4_1) {
                MountBehavior_4 = MountBehavior_4_1;
            }
        ],
        execute: function () {
            Snail = class Snail extends Npc_13.Npc {
                constructor(position) {
                    super(new ObjectSkin_33.ObjectSkin(`🐌`), position);
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
                        snail.skin.setBackgroundAt([0, 0], "#FFFF0055");
                    }
                    else {
                        snail.skin.setBackgroundAt([0, 0], "#FF00FF55");
                    }
                }
            };
            exports_117("Snail", Snail);
        }
    };
});
System.register("world/npcs/Fish", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions"], function (exports_118, context_118) {
    "use strict";
    var Npc_14, ObjectSkin_34, WanderingBehavior_5, NpcMovementOptions_6, Fish;
    var __moduleName = context_118 && context_118.id;
    return {
        setters: [
            function (Npc_14_1) {
                Npc_14 = Npc_14_1;
            },
            function (ObjectSkin_34_1) {
                ObjectSkin_34 = ObjectSkin_34_1;
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
                    super(new ObjectSkin_34.ObjectSkin(`🐟`), position);
                    this.type = "fish";
                    this.realm = "water";
                    this.movementOptions = NpcMovementOptions_6.defaultMovementOptions.waterborne;
                    this.behaviors.push(new WanderingBehavior_5.WanderingBehavior());
                }
            };
            exports_118("Fish", Fish);
        }
    };
});
System.register("world/npcs/Ghost", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior"], function (exports_119, context_119) {
    "use strict";
    var Npc_15, ObjectSkin_35, WanderingBehavior_6, Ghost;
    var __moduleName = context_119 && context_119.id;
    return {
        setters: [
            function (Npc_15_1) {
                Npc_15 = Npc_15_1;
            },
            function (ObjectSkin_35_1) {
                ObjectSkin_35 = ObjectSkin_35_1;
            },
            function (WanderingBehavior_6_1) {
                WanderingBehavior_6 = WanderingBehavior_6_1;
            }
        ],
        execute: function () {
            Ghost = class Ghost extends Npc_15.Npc {
                constructor(position) {
                    super(new ObjectSkin_35.ObjectSkin(`👻`), position);
                    this.type = "ghost";
                    this.realm = "soul";
                    this.movementOptions = {
                        flyingSpeed: 4,
                    };
                    this.behaviors.push(new WanderingBehavior_6.WanderingBehavior());
                }
            };
            exports_119("Ghost", Ghost);
        }
    };
});
System.register("world/npcs/Dragon", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_120, context_120) {
    "use strict";
    var Npc_16, ObjectSkin_36, MountBehavior_5, NpcMovementOptions_7, Dragon;
    var __moduleName = context_120 && context_120.id;
    return {
        setters: [
            function (Npc_16_1) {
                Npc_16 = Npc_16_1;
            },
            function (ObjectSkin_36_1) {
                ObjectSkin_36 = ObjectSkin_36_1;
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
                    super(new ObjectSkin_36.ObjectSkin(`🐉`), position);
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
                        dragon.skin.setBackgroundAt([0, 0], "#FFFF0055");
                    }
                    else {
                        dragon.skin.setBackgroundAt([0, 0], "#FF00FF55");
                    }
                }
            };
            exports_120("Dragon", Dragon);
        }
    };
});
System.register("world/npcs/Monkey", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "world/items"], function (exports_121, context_121) {
    "use strict";
    var Npc_17, ObjectSkin_37, WanderingBehavior_7, items_6, Monkey;
    var __moduleName = context_121 && context_121.id;
    return {
        setters: [
            function (Npc_17_1) {
                Npc_17 = Npc_17_1;
            },
            function (ObjectSkin_37_1) {
                ObjectSkin_37 = ObjectSkin_37_1;
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
                    super(new ObjectSkin_37.ObjectSkin(`🐒`), position);
                    this.type = "monkey";
                    this.behaviors.push(new WanderingBehavior_7.WanderingBehavior());
                    const aLamp = items_6.lamp();
                    this.inventory.items.push(aLamp);
                    this.equipment.equip(aLamp);
                }
            };
            exports_121("Monkey", Monkey);
        }
    };
});
System.register("world/levels/terrain", ["engine/Level", "world/objects/door", "engine/data/Tiles", "world/npcs/turtle", "world/npcs/deer", "world/npcs/snail", "world/tiles", "world/npcs/Fish", "world/npcs/Ghost", "world/npcs/bee", "world/npcs/Dragon", "world/npcs/Monkey", "engine/data/Vector2"], function (exports_122, context_122) {
    "use strict";
    var Level_11, door_11, Tiles_11, turtle_1, deer_1, snail_1, tiles_4, Fish_1, Ghost_1, bee_2, Dragon_1, Monkey_1, Vector2_59, doors, mounts, npcs, objects, levelTiles, terrainLevel;
    var __moduleName = context_122 && context_122.id;
    return {
        setters: [
            function (Level_11_1) {
                Level_11 = Level_11_1;
            },
            function (door_11_1) {
                door_11 = door_11_1;
            },
            function (Tiles_11_1) {
                Tiles_11 = Tiles_11_1;
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
            },
            function (Vector2_59_1) {
                Vector2_59 = Vector2_59_1;
            }
        ],
        execute: function () {
            doors = [
                door_11.door('terrain_door', { position: [2, 2] }),
            ];
            mounts = [
                new turtle_1.Turtle(Vector2_59.Vector2.from([3, 5])),
                new turtle_1.Turtle(Vector2_59.Vector2.from([9, 7])),
                new deer_1.Deer(Vector2_59.Vector2.from([2, 5])),
                new deer_1.Deer(Vector2_59.Vector2.from([3, 18])),
                new snail_1.Snail(Vector2_59.Vector2.from([1, 1])),
                new Dragon_1.Dragon(Vector2_59.Vector2.from([2, 6])),
            ];
            npcs = [
                new Fish_1.Fish(Vector2_59.Vector2.from([15, 8])),
                new Fish_1.Fish(Vector2_59.Vector2.from([8, 4])),
                new bee_2.Bee(Vector2_59.Vector2.from([3, 15])),
                new Ghost_1.Ghost(Vector2_59.Vector2.from([8, 14])),
                new Monkey_1.Monkey(Vector2_59.Vector2.from([6, 15])),
            ];
            objects = [...doors, ...mounts, ...npcs];
            levelTiles = Tiles_11.Tiles.parseTiles(`                                 
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
            exports_122("terrainLevel", terrainLevel = new Level_11.Level('terrain', objects, levelTiles));
        }
    };
});
System.register("world/objects/particles/VolcanicGasMist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle"], function (exports_123, context_123) {
    "use strict";
    var ObjectSkin_38, Sprite_14, Particle_7, VolcanicGasMist;
    var __moduleName = context_123 && context_123.id;
    return {
        setters: [
            function (ObjectSkin_38_1) {
                ObjectSkin_38 = ObjectSkin_38_1;
            },
            function (Sprite_14_1) {
                Sprite_14 = Sprite_14_1;
            },
            function (Particle_7_1) {
                Particle_7 = Particle_7_1;
            }
        ],
        execute: function () {
            VolcanicGasMist = class VolcanicGasMist extends Particle_7.Particle {
                constructor(position) {
                    const sprite = new Sprite_14.Sprite();
                    const skin = new ObjectSkin_38.ObjectSkin(' ', '.', { '.': [undefined, '#a002'] });
                    sprite.frames[Particle_7.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "volcanic_gas_mist";
                }
            };
            exports_123("VolcanicGasMist", VolcanicGasMist);
        }
    };
});
System.register("world/sprites/darkSmokeSprite", ["engine/data/Sprite"], function (exports_124, context_124) {
    "use strict";
    var Sprite_15, darkSmokeSpriteRaw, darkSmokeSprite;
    var __moduleName = context_124 && context_124.id;
    return {
        setters: [
            function (Sprite_15_1) {
                Sprite_15 = Sprite_15_1;
            }
        ],
        execute: function () {
            darkSmokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#333c
color:T,transparent,#444a
color:Y,transparent,#5558

particle
''''''''''
RRRRTTTYYY`;
            exports_124("darkSmokeSprite", darkSmokeSprite = Sprite_15.Sprite.parse(darkSmokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/DarkSmoke", ["engine/data/Face", "engine/data/Vector2", "engine/objects/Particle", "world/sprites/darkSmokeSprite"], function (exports_125, context_125) {
    "use strict";
    var Face_13, Vector2_60, Particle_8, darkSmokeSprite_1, DarkSmoke;
    var __moduleName = context_125 && context_125.id;
    return {
        setters: [
            function (Face_13_1) {
                Face_13 = Face_13_1;
            },
            function (Vector2_60_1) {
                Vector2_60 = Vector2_60_1;
            },
            function (Particle_8_1) {
                Particle_8 = Particle_8_1;
            },
            function (darkSmokeSprite_1_1) {
                darkSmokeSprite_1 = darkSmokeSprite_1_1;
            }
        ],
        execute: function () {
            DarkSmoke = class DarkSmoke extends Particle_8.Particle {
                constructor(position, state = 0) {
                    super(darkSmokeSprite_1.darkSmokeSprite, position, state);
                    this.type = DarkSmoke.ParticleType;
                }
                onNext(scene) {
                    spread(this);
                    function spread(particle) {
                        if (!particle.hasNext()) {
                            return;
                        }
                        const particlePos = particle.position;
                        const newState = particle.state + 1;
                        const newPositions = Face_13.Faces
                            .map(x => Vector2_60.Vector2.fromFace(x))
                            .map(x => particlePos.clone().add(x));
                        for (const newPosition of newPositions) {
                            spreadTo(newPosition, newState);
                        }
                    }
                    function spreadTo(newPosition, newState) {
                        const particle = scene.getParticleAt(newPosition);
                        if (!particle) {
                            scene.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                        else if (particle.type === DarkSmoke.ParticleType && particle.state > newState) {
                            scene.removeParticle(particle);
                            scene.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                        else {
                            scene.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                    }
                }
            };
            exports_125("DarkSmoke", DarkSmoke);
            DarkSmoke.ParticleType = "dark_smoke";
        }
    };
});
System.register("world/objects/volcanicMouth", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/data/Vector2", "engine/objects/StaticGameObject", "world/objects/particles/DarkSmoke"], function (exports_126, context_126) {
    "use strict";
    var ObjectPhysics_30, ObjectSkin_39, Vector2_61, StaticGameObject_24, DarkSmoke_1, VolcanicMouth;
    var __moduleName = context_126 && context_126.id;
    function volcanicMouth(options) {
        return new VolcanicMouth(Vector2_61.Vector2.from(options.position));
    }
    exports_126("volcanicMouth", volcanicMouth);
    return {
        setters: [
            function (ObjectPhysics_30_1) {
                ObjectPhysics_30 = ObjectPhysics_30_1;
            },
            function (ObjectSkin_39_1) {
                ObjectSkin_39 = ObjectSkin_39_1;
            },
            function (Vector2_61_1) {
                Vector2_61 = Vector2_61_1;
            },
            function (StaticGameObject_24_1) {
                StaticGameObject_24 = StaticGameObject_24_1;
            },
            function (DarkSmoke_1_1) {
                DarkSmoke_1 = DarkSmoke_1_1;
            }
        ],
        execute: function () {
            VolcanicMouth = class VolcanicMouth extends StaticGameObject_24.StaticGameObject {
                constructor(position) {
                    super(Vector2_61.Vector2.zero, new ObjectSkin_39.ObjectSkin(` `, `V`, {
                        V: [undefined, 'darkred'],
                    }), new ObjectPhysics_30.ObjectPhysics(` `, '8', 'F'), position);
                    this.smokeTicks = 0;
                    this.type = "volcanic_mouth";
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.smokeTicks += ticks;
                    const smokeTicksOverflow = this.smokeTicks - 2000;
                    if (smokeTicksOverflow >= 0) {
                        const _ = this.scene.tryAddParticle(new DarkSmoke_1.DarkSmoke(this.position));
                        this.smokeTicks = smokeTicksOverflow;
                    }
                }
            };
            exports_126("VolcanicMouth", VolcanicMouth);
        }
    };
});
System.register("world/objects/volcano", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_127, context_127) {
    "use strict";
    var StaticGameObject_25, ObjectSkin_40, ObjectPhysics_31, Vector2_62;
    var __moduleName = context_127 && context_127.id;
    function volcano(options) {
        return new StaticGameObject_25.StaticGameObject(new Vector2_62.Vector2(0, 2), new ObjectSkin_40.ObjectSkin(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: ["black", "darkred"],
            o: ["black", "saddlebrown"]
        }), new ObjectPhysics_31.ObjectPhysics(`        
 ...... 
........`, ''), Vector2_62.Vector2.from(options.position));
    }
    exports_127("volcano", volcano);
    return {
        setters: [
            function (StaticGameObject_25_1) {
                StaticGameObject_25 = StaticGameObject_25_1;
            },
            function (ObjectSkin_40_1) {
                ObjectSkin_40 = ObjectSkin_40_1;
            },
            function (ObjectPhysics_31_1) {
                ObjectPhysics_31 = ObjectPhysics_31_1;
            },
            function (Vector2_62_1) {
                Vector2_62 = Vector2_62_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/volcanicLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/particles/VolcanicGasMist", "world/objects/volcanicMouth", "world/objects/volcano", "engine/data/Vector2"], function (exports_128, context_128) {
    "use strict";
    var Level_12, fence_8, door_12, Tiles_12, VolcanicGasMist_1, volcanicMouth_1, volcano_1, Vector2_63, fences, width, height, trees, volcanoes, fires, doors, objects, volcanicLevel;
    var __moduleName = context_128 && context_128.id;
    return {
        setters: [
            function (Level_12_1) {
                Level_12 = Level_12_1;
            },
            function (fence_8_1) {
                fence_8 = fence_8_1;
            },
            function (door_12_1) {
                door_12 = door_12_1;
            },
            function (Tiles_12_1) {
                Tiles_12 = Tiles_12_1;
            },
            function (VolcanicGasMist_1_1) {
                VolcanicGasMist_1 = VolcanicGasMist_1_1;
            },
            function (volcanicMouth_1_1) {
                volcanicMouth_1 = volcanicMouth_1_1;
            },
            function (volcano_1_1) {
                volcano_1 = volcano_1_1;
            },
            function (Vector2_63_1) {
                Vector2_63 = Vector2_63_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 24;
            height = 24;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_8.fence({ position: [x, 0] }));
                    fences.push(fence_8.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_8.fence({ position: [0, y] }));
                    fences.push(fence_8.fence({ position: [width - 1, y] }));
                }
            }
            trees = [
            // TODO: add burnt tree trunks.
            ];
            volcanoes = [
                volcano_1.volcano({ position: [9, 14] }),
            ];
            fires = [
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([12, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([12, 13])),
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([13, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([13, 13])),
                //
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([10, 5])),
                new volcanicMouth_1.VolcanicMouth(Vector2_63.Vector2.from([3, 16])),
            ];
            doors = [
                door_12.door('volcanic', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...trees, ...volcanoes, ...fires];
            exports_128("volcanicLevel", volcanicLevel = new class extends Level_12.Level {
                constructor() {
                    super('volcanic', objects, Tiles_12.Tiles.createEmpty(width, height));
                    this.wind = new Vector2_63.Vector2(1, 0);
                }
                onLoaded(scene) {
                    super.onLoaded(scene);
                    this.fillGasMist(scene);
                    this.changeWeather("ashfall");
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.fillGasMist(scene);
                }
                fillGasMist(scene) {
                    const box = scene.windBox;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const p = new Vector2_63.Vector2(x, y);
                            if (scene.isParticlePositionBlocked(p)) {
                                continue;
                            }
                            scene.tryAddParticle(new VolcanicGasMist_1.VolcanicGasMist(p));
                        }
                    }
                }
            }());
        }
    };
});
System.register("world/levels/levels", ["world/levels/devHub", "world/levels/dungeon", "world/levels/ggj2020demo/level", "world/levels/house", "world/levels/intro", "world/levels/lights", "world/levels/mistlandLevel", "world/levels/particlesLevel", "world/levels/sheep", "world/levels/signalsLevel", "world/levels/terrain", "world/levels/volcanicLevel"], function (exports_129, context_129) {
    "use strict";
    var devHub_1, dungeon_1, level_1, house_7, intro_1, lights_1, mistlandLevel_1, particlesLevel_1, sheep_3, signalsLevel_1, terrain_1, volcanicLevel_1, dict, rawLevels, levels;
    var __moduleName = context_129 && context_129.id;
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
            function (mistlandLevel_1_1) {
                mistlandLevel_1 = mistlandLevel_1_1;
            },
            function (particlesLevel_1_1) {
                particlesLevel_1 = particlesLevel_1_1;
            },
            function (sheep_3_1) {
                sheep_3 = sheep_3_1;
            },
            function (signalsLevel_1_1) {
                signalsLevel_1 = signalsLevel_1_1;
            },
            function (terrain_1_1) {
                terrain_1 = terrain_1_1;
            },
            function (volcanicLevel_1_1) {
                volcanicLevel_1 = volcanicLevel_1_1;
            }
        ],
        execute: function () {
            dict = { devHubLevel: devHub_1.devHubLevel, introLevel: intro_1.introLevel, lightsLevel: lights_1.lightsLevel, sheepLevel: sheep_3.sheepLevel, level: level_1.level, dungeonLevel: dungeon_1.dungeonLevel, houseLevel: house_7.houseLevel, terrainLevel: terrain_1.terrainLevel, particlesLevel: particlesLevel_1.particlesLevel, mistlandLevel: mistlandLevel_1.mistlandLevel, volcanicLevel: volcanicLevel_1.volcanicLevel, signalsLevel: signalsLevel_1.signalsLevel };
            exports_129("rawLevels", rawLevels = dict);
            exports_129("levels", levels = {});
            for (const item of Object.values(dict)) {
                levels[item.id] = item;
            }
        }
    };
});
System.register("utils/misc", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "engine/data/Vector2"], function (exports_130, context_130) {
    "use strict";
    var ObjectSkin_41, StaticGameObject_26, ObjectPhysics_32, Vector2_64;
    var __moduleName = context_130 && context_130.id;
    function createTextObjectSkin(text, color, background) {
        const textSkin = new ObjectSkin_41.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [color, background] });
        return textSkin;
    }
    exports_130("createTextObjectSkin", createTextObjectSkin);
    function createTextObject(text, pos) {
        const skin = createTextObjectSkin(text);
        const t = new StaticGameObject_26.StaticGameObject(Vector2_64.Vector2.zero, skin, new ObjectPhysics_32.ObjectPhysics(), pos);
        t.type = "victory_text_object";
        return t;
    }
    exports_130("createTextObject", createTextObject);
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
    exports_130("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkin_41_1) {
                ObjectSkin_41 = ObjectSkin_41_1;
            },
            function (StaticGameObject_26_1) {
                StaticGameObject_26 = StaticGameObject_26_1;
            },
            function (ObjectPhysics_32_1) {
                ObjectPhysics_32 = ObjectPhysics_32_1;
            },
            function (Vector2_64_1) {
                Vector2_64 = Vector2_64_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/events/LoadLevelGameEvent", ["engine/events/GameEvent"], function (exports_131, context_131) {
    "use strict";
    var GameEvent_12, LoadLevelGameEvent;
    var __moduleName = context_131 && context_131.id;
    return {
        setters: [
            function (GameEvent_12_1) {
                GameEvent_12 = GameEvent_12_1;
            }
        ],
        execute: function () {
            (function (LoadLevelGameEvent) {
                LoadLevelGameEvent.type = "load_level";
                class Args {
                }
                LoadLevelGameEvent.Args = Args;
                function create(level) {
                    return new GameEvent_12.GameEvent("system", LoadLevelGameEvent.type, { level });
                }
                LoadLevelGameEvent.create = create;
            })(LoadLevelGameEvent || (exports_131("LoadLevelGameEvent", LoadLevelGameEvent = {})));
        }
    };
});
System.register("world/events/TeleportToPositionGameEvent", ["engine/events/GameEvent"], function (exports_132, context_132) {
    "use strict";
    var GameEvent_13, TeleportToPositionGameEvent;
    var __moduleName = context_132 && context_132.id;
    return {
        setters: [
            function (GameEvent_13_1) {
                GameEvent_13 = GameEvent_13_1;
            }
        ],
        execute: function () {
            (function (TeleportToPositionGameEvent) {
                TeleportToPositionGameEvent.type = "teleport_to_position";
                class Args {
                }
                TeleportToPositionGameEvent.Args = Args;
                function create(object, position) {
                    return new GameEvent_13.GameEvent("system", TeleportToPositionGameEvent.type, {
                        object,
                        position
                    });
                }
                TeleportToPositionGameEvent.create = create;
            })(TeleportToPositionGameEvent || (exports_132("TeleportToPositionGameEvent", TeleportToPositionGameEvent = {})));
        }
    };
});
System.register("ui/UIText", ["engine/data/Vector2", "engine/graphics/GraphicsEngine", "utils/misc", "ui/UIElement"], function (exports_133, context_133) {
    "use strict";
    var Vector2_65, GraphicsEngine_7, misc_1, UIElement_5, UIText;
    var __moduleName = context_133 && context_133.id;
    return {
        setters: [
            function (Vector2_65_1) {
                Vector2_65 = Vector2_65_1;
            },
            function (GraphicsEngine_7_1) {
                GraphicsEngine_7 = GraphicsEngine_7_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
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
                    this.skin = misc_1.createTextObjectSkin(text, color, background);
                }
                draw(ctx) {
                    super.draw(ctx);
                    GraphicsEngine_7.drawObjectSkinAt(ctx, undefined, this.skin, Vector2_65.Vector2.zero, this.getAbsolutePosition(), "ui");
                }
            };
            exports_133("UIText", UIText);
        }
    };
});
System.register("ui/UIItem", ["engine/data/Vector2", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "ui/UIElement", "ui/UISceneObject", "ui/UIText"], function (exports_134, context_134) {
    "use strict";
    var Vector2_66, Cell_5, GraphicsEngine_8, UIElement_6, UISceneObject_2, UIText_1, UIItem;
    var __moduleName = context_134 && context_134.id;
    return {
        setters: [
            function (Vector2_66_1) {
                Vector2_66 = Vector2_66_1;
            },
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
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
                    this.uiText.position = new Vector2_66.Vector2(1, 0);
                }
                draw(ctx) {
                    this.drawBackground(ctx);
                    super.draw(ctx);
                }
                drawBackground(ctx) {
                    if (this.isSelected) {
                        const pos0 = this.getAbsolutePosition();
                        const actualWidth = 1 + this.uiText.text.length;
                        for (let x = 0; x < actualWidth; x++) {
                            const borders = [
                                'white',
                                x === actualWidth - 1 ? 'white' : '',
                                'white',
                                x === 0 ? 'white' : ''
                            ];
                            const newPos = pos0.clone().add(new Vector2_66.Vector2(x, 0));
                            GraphicsEngine_8.drawCell(ctx, undefined, new Cell_5.Cell(' '), newPos, 0.2, borders, "ui");
                        }
                    }
                }
            };
            exports_134("UIItem", UIItem);
        }
    };
});
System.register("ui/UIInventory", ["controls", "engine/data/Vector2", "engine/events/EventLoop", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "engine/objects/Npc", "world/events/SwitchGameModeGameEvent", "ui/UIElement", "ui/UIItem", "ui/UIPanel"], function (exports_135, context_135) {
    "use strict";
    var controls_1, Vector2_67, EventLoop_10, Cell_6, GraphicsEngine_9, Npc_18, SwitchGameModeGameEvent_2, UIElement_7, UIItem_1, UIPanel_2, UIInventory;
    var __moduleName = context_135 && context_135.id;
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (Vector2_67_1) {
                Vector2_67 = Vector2_67_1;
            },
            function (EventLoop_10_1) {
                EventLoop_10 = EventLoop_10_1;
            },
            function (Cell_6_1) {
                Cell_6 = Cell_6_1;
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
                    const position = new Vector2_67.Vector2(0, camera.size.height - dialogHeight);
                    const size = new Vector2_67.Vector2(dialogWidth, dialogHeight);
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
                        EventLoop_10.emitEvent(SwitchGameModeGameEvent_2.SwitchGameModeGameEvent.create("inventory", "scene"));
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
                        const uiItem = new UIItem_1.UIItem(this.uiPanel, item, new Vector2_67.Vector2(2, 1 + index));
                        uiItem.isSelected = index === this.selectedItemIndex;
                        this.uiItems.push(uiItem);
                        index += 1;
                    }
                }
                draw(ctx) {
                    super.draw(ctx);
                    for (const uiItem of this.uiItems) {
                        if (this.object instanceof Npc_18.Npc) {
                            const cursorCell = createEquipmentCell(uiItem.item, this.object);
                            if (cursorCell) {
                                const pos = uiItem.getAbsolutePosition();
                                const position = pos.clone().add(new Vector2_67.Vector2(-1, 0));
                                GraphicsEngine_9.drawCell(ctx, undefined, cursorCell, position, undefined, undefined, "ui");
                            }
                        }
                    }
                    function createEquipmentCell(item, object) {
                        if (item === object.equipment.objectInMainHand) {
                            return new Cell_6.Cell('✋', undefined, 'transparent');
                        }
                        else if (item === object.equipment.objectWearable) {
                            return new Cell_6.Cell('👕', undefined, 'transparent');
                        }
                        return undefined;
                    }
                }
            };
            exports_135("UIInventory", UIInventory);
        }
    };
});
System.register("main", ["engine/events/GameEvent", "engine/events/EventLoop", "engine/Scene", "engine/ActionData", "engine/graphics/GraphicsEngine", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "engine/WeatherSystem", "world/levels/levels", "world/events/TeleportToEndpointGameEvent", "controls", "world/events/MountGameEvent", "world/events/PlayerMessageGameEvent", "world/events/SwitchGameModeGameEvent", "world/events/AddObjectGameEvent", "world/events/TransferItemsGameEvent", "utils/misc", "world/events/LoadLevelGameEvent", "world/events/RemoveObjectGameEvent", "world/events/TeleportToPositionGameEvent", "ui/UIPanel", "ui/UIInventory", "world/levels/signalsLevel", "engine/data/Vector2"], function (exports_136, context_136) {
    "use strict";
    var GameEvent_14, EventLoop_11, Scene_1, ActionData_3, GraphicsEngine_10, CanvasContext_1, hero_1, playerUi_1, WeatherSystem_2, levels_1, TeleportToEndpointGameEvent_2, controls_2, MountGameEvent_2, PlayerMessageGameEvent_2, SwitchGameModeGameEvent_3, AddObjectGameEvent_3, TransferItemsGameEvent_4, misc_2, LoadLevelGameEvent_1, RemoveObjectGameEvent_4, TeleportToPositionGameEvent_1, UIPanel_3, UIInventory_1, signalsLevel_2, Vector2_68, canvas, ctx, Game, game, scene, debug, leftPad, topPad, heroUi, uiInventory, ticksPerStep, startTime;
    var __moduleName = context_136 && context_136.id;
    function loadLevel(level) {
        scene.level = level;
        scene.level.objects = scene.level.objects;
        for (const object of scene.level.objects) {
            object.scene = scene;
            object.bindToLevel(scene.level);
        }
        hero_1.hero.position = new Vector2_68.Vector2(9, 7);
        scene.camera.follow(hero_1.hero, level);
        level.onLoaded(scene);
    }
    function teleportToEndpoint(portalId, teleport, object) {
        const portalPositions = scene.level.portals[portalId];
        if ((portalPositions === null || portalPositions === void 0 ? void 0 : portalPositions.length) === 2) {
            // Pair portal is on the same level.
            const portalPositionIndex = portalPositions.findIndex(x => x.equals(teleport.position));
            const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
            teleportTo(scene.level.id, pairPortalPosition.clone().add(new Vector2_68.Vector2(0, 1)));
        }
        else {
            // Find other level with this portal id.
            const pairPortals = Object.entries(levels_1.levels)
                .filter(([levelId, _]) => { var _a; return levelId !== ((_a = scene.level) === null || _a === void 0 ? void 0 : _a.id); })
                .filter(([___, level]) => { var _a; return ((_a = level.portals[portalId]) === null || _a === void 0 ? void 0 : _a.length) === 1; })
                .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0] }));
            if ((pairPortals === null || pairPortals === void 0 ? void 0 : pairPortals.length) !== 0) {
                const pairPortal = pairPortals[0];
                teleportTo(pairPortal.levelId, pairPortal.position.clone().add(new Vector2_68.Vector2(0, 1)));
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
            EventLoop_11.emitEvent(TeleportToPositionGameEvent_1.TeleportToPositionGameEvent.create(object, position));
        }
    }
    function selectLevel(prevLevel, level) {
        console.log(`Selecting level "${level.id}".`);
        if (prevLevel) {
            EventLoop_11.emitEvent(RemoveObjectGameEvent_4.RemoveObjectGameEvent.create(hero_1.hero));
        }
        EventLoop_11.emitEvent(LoadLevelGameEvent_1.LoadLevelGameEvent.create(level));
        EventLoop_11.emitEvent(AddObjectGameEvent_3.AddObjectGameEvent.create(hero_1.hero));
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
                EventLoop_11.emitEvent(SwitchGameModeGameEvent_3.SwitchGameModeGameEvent.create(game.mode, "scene"));
                controls_2.Controls.Escape.isHandled = true;
            }
        }
    }
    function handleSceneControls() {
        const controlObject = hero_1.hero;
        let doMove = false;
        if (controls_2.Controls.Up.isDown) {
            controlObject.direction = Vector2_68.Vector2.top;
            doMove = !controls_2.Controls.Up.isShiftDown;
        }
        else if (controls_2.Controls.Down.isDown) {
            controlObject.direction = Vector2_68.Vector2.bottom;
            doMove = !controls_2.Controls.Down.isShiftDown;
        }
        else if (controls_2.Controls.Left.isDown) {
            controlObject.direction = Vector2_68.Vector2.left;
            doMove = !controls_2.Controls.Left.isShiftDown;
        }
        else if (controls_2.Controls.Right.isDown) {
            controlObject.direction = Vector2_68.Vector2.right;
            doMove = !controls_2.Controls.Right.isShiftDown;
        }
        if (doMove) {
            if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
                controlObject.move();
            }
        }
        if (controls_2.Controls.Inventory.isDown && !controls_2.Controls.Inventory.isHandled) {
            updateInventory(); // TODO: handle somewhere else
            EventLoop_11.emitEvent(SwitchGameModeGameEvent_3.SwitchGameModeGameEvent.create(game.mode, "inventory"));
            controls_2.Controls.Inventory.isHandled = true;
        }
        else if (controls_2.Controls.Interact.isDown && !controls_2.Controls.Interact.isHandled) {
            interact();
            controls_2.Controls.Interact.isHandled = true;
        }
        if (controls_2.Controls.Equip.isDown && !controls_2.Controls.Equip.isHandled) {
            hero_1.hero.equipment.toggleEquip();
            controls_2.Controls.Equip.isHandled = true;
        }
        if (controls_2.Controls.DebugP.isDown && !controls_2.Controls.DebugP.isHandled) {
            debugToggleWind(controls_2.Controls.DebugP.isShiftDown);
            controls_2.Controls.DebugP.isHandled = true;
        }
        if (controls_2.Controls.DebugO.isDown && !controls_2.Controls.DebugO.isHandled) {
            debugProgressDay(controls_2.Controls.DebugO.isShiftDown ? 0.25 : 0.5);
            controls_2.Controls.DebugO.isHandled = true;
        }
    }
    function debugToggleWind(isShift) {
        // Iterates coordinate values: [-1, 0, 1].
        const index = isShift ? 1 : 0;
        const coord = scene.level.wind.getAt(index);
        const newCoord = (coord === 1) ? -1 : coord + 1;
        scene.level.wind.setAt(index, newCoord);
        EventLoop_11.emitEvent(new GameEvent_14.GameEvent("system", "wind_changed", {
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
        const uiPanel = new UIPanel_3.UIPanel(null, new Vector2_68.Vector2(0, scene.camera.size.height - dialogHeight), new Vector2_68.Vector2(dialogWidth, dialogHeight));
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
        EventLoop_11.eventLoop([game, scene, ...scene.objects]);
        game.draw();
    }
    return {
        setters: [
            function (GameEvent_14_1) {
                GameEvent_14 = GameEvent_14_1;
            },
            function (EventLoop_11_1) {
                EventLoop_11 = EventLoop_11_1;
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
            function (WeatherSystem_2_1) {
                WeatherSystem_2 = WeatherSystem_2_1;
            },
            function (levels_1_1) {
                levels_1 = levels_1_1;
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
            function (misc_2_1) {
                misc_2 = misc_2_1;
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
            },
            function (signalsLevel_2_1) {
                signalsLevel_2 = signalsLevel_2_1;
            },
            function (Vector2_68_1) {
                Vector2_68 = Vector2_68_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = new CanvasContext_1.CanvasContext(canvas);
            // TODO: more ideas:
            // 1. 🎲 Game die, activate to randomize. ⚀⚁⚂⚃⚄⚅
            // 2. 🎄 Christmas tree with blinking color lights. 
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
                        args.object.position = args.position.clone();
                    }
                    else if (ev.type === MountGameEvent_2.MountGameEvent.type) {
                        const args = ev.args;
                        EventLoop_11.emitEvent(PlayerMessageGameEvent_2.PlayerMessageGameEvent.create(`${args.mounter.type} ${args.newState} ${args.mount.type}`));
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
                            EventLoop_11.emitEvent(AddObjectGameEvent_3.AddObjectGameEvent.create(misc_2.createTextObject(`VICTORY!`, new Vector2_68.Vector2(6, 6))));
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
                selectLevel(null, signalsLevel_2.signalsLevel);
                scene.debugDisableGameTime = true;
                debugProgressDay(0.5);
            }
            exports_136("leftPad", leftPad = (canvas.width - GraphicsEngine_10.cellStyle.size.width * scene.camera.size.width) / 2);
            exports_136("topPad", topPad = (canvas.height - GraphicsEngine_10.cellStyle.size.height * scene.camera.size.height) / 2);
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, scene.camera);
            controls_2.enableGameInput();
            ticksPerStep = 33;
            startTime = new Date();
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window._ = {
                selectLevel: selectLevel,
                levels: levels_1.rawLevels,
                weatherTypes: Object.fromEntries(WeatherSystem_2.weatherTypes.map(x => [x, x])),
                changeWeather: (x) => scene.level.changeWeather(x),
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
                toggleDebugDrawSignals: () => {
                    console.log("Toggled debugDrawSignals");
                    scene.debugDrawSignals = !scene.debugDrawSignals;
                },
            };
        }
    };
});
System.register("world/objects/particles/WaterRipple", ["engine/objects/Particle", "world/sprites/waterRippleSprite"], function (exports_137, context_137) {
    "use strict";
    var Particle_9, waterRippleSprite_3, WaterRipple;
    var __moduleName = context_137 && context_137.id;
    return {
        setters: [
            function (Particle_9_1) {
                Particle_9 = Particle_9_1;
            },
            function (waterRippleSprite_3_1) {
                waterRippleSprite_3 = waterRippleSprite_3_1;
            }
        ],
        execute: function () {
            WaterRipple = class WaterRipple extends Particle_9.Particle {
                constructor(position, state = 0) {
                    super(waterRippleSprite_3.waterRippleSprite, position, state, { decaySpeed: 200, });
                    this.type = "waterripple";
                }
            };
            exports_137("WaterRipple", WaterRipple);
        }
    };
});
//# sourceMappingURL=app.js.map