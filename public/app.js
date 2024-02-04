System.register("utils/math", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    exports_1("clamp", clamp);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/math/Color", ["utils/math"], function (exports_2, context_2) {
    "use strict";
    var math_1, Color;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (math_1_1) {
                math_1 = math_1_1;
            }
        ],
        execute: function () {
            Color = class Color {
                constructor(r, g, b) {
                    this.r = 1;
                    this.g = 1;
                    this.b = 1;
                    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
                        this.setRGB(r, g, b);
                    }
                    else if (typeof r === "number") {
                        this.setHex(r);
                    }
                    else if (typeof r === "string") {
                        this.setStyle(r);
                    }
                    else if (r instanceof Color) {
                        this.copy(r);
                    }
                }
                copy(c) {
                    this.r = c.r;
                    this.g = c.g;
                    this.b = c.b;
                }
                equals(c) {
                    return (c.r === this.r &&
                        c.g === this.g &&
                        c.b === this.b);
                }
                setRGB(r, g, b) {
                    if (r > 1 || g > 1 || b > 1) {
                        throw new Error(`Invalid color component: (${r},${g},${b}).`);
                    }
                    this.r = r;
                    this.g = g;
                    this.b = b;
                }
                setHex(hex) {
                    hex = Math.floor(hex);
                    this.r = (hex >> 16 & 255) / 255;
                    this.g = (hex >> 8 & 255) / 255;
                    this.b = (hex & 255) / 255;
                }
                setStyle(style) {
                    throw new Error("Not implemented.");
                }
                getHex() {
                    return (Math.round(math_1.clamp(this.r * 255, 0, 255)) * 65536 +
                        Math.round(math_1.clamp(this.g * 255, 0, 255)) * 256 +
                        Math.round(math_1.clamp(this.b * 255, 0, 255)));
                }
                to() {
                    return [this.r, this.g, this.b];
                }
                getStyle() {
                    return `rgb(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)})`;
                }
                *[Symbol.iterator]() {
                    yield this.r;
                    yield this.g;
                    yield this.b;
                }
                static from(array, offset = 0) {
                    return new Color(array[offset], array[offset + 1], array[offset + 2]);
                }
            };
            exports_2("Color", Color);
        }
    };
});
System.register("engine/events/GameEvent", [], function (exports_3, context_3) {
    "use strict";
    var GameEvent;
    var __moduleName = context_3 && context_3.id;
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
            exports_3("GameEvent", GameEvent);
        }
    };
});
System.register("engine/math/Rotation", [], function (exports_4, context_4) {
    "use strict";
    var forward, back, left, right, opposite, none, all, Rotations;
    var __moduleName = context_4 && context_4.id;
    function normalize(rotation) {
        return (4 + (4 + rotation) % 4) % 4;
    }
    function equals(a, b) {
        return normalize(a) === normalize(b);
    }
    return {
        setters: [],
        execute: function () {
            forward = 0;
            back = 2;
            left = 3;
            right = 1;
            opposite = 2;
            none = [];
            all = [forward, right, back, left];
            exports_4("Rotations", Rotations = {
                forward,
                back,
                left,
                right,
                opposite,
                none,
                all,
                normalize,
                equals,
            });
        }
    };
});
System.register("engine/math/Vector2", ["engine/math/Rotation"], function (exports_5, context_5) {
    "use strict";
    var Rotation_1, Vector2;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (Rotation_1_1) {
                Rotation_1 = Rotation_1_1;
            }
        ],
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
                get angle() {
                    const angle = Math.atan2(this.y, this.x); // radians
                    const degrees = 180 * angle / Math.PI; // degrees
                    return (360 + Math.round(degrees)) % 360; // round number, avoid decimal fragments
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
                multiply(v) {
                    this.x *= v.x;
                    this.y *= v.y;
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
                rotateClockwise() {
                    const t = this.x;
                    this.x = -this.y;
                    this.y = t;
                    return this;
                }
                rotate(rotations) {
                    rotations = Rotation_1.Rotations.normalize(rotations);
                    while (rotations-- > 0) {
                        this.rotateClockwise();
                    }
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
                static get directions() {
                    return [
                        Vector2.right,
                        Vector2.bottom,
                        Vector2.left,
                        Vector2.top,
                    ];
                }
                static add(p1, p2) {
                    return p1.add(p2);
                }
            };
            exports_5("Vector2", Vector2);
        }
    };
});
System.register("engine/graphics/Cell", ["engine/math/Vector2"], function (exports_6, context_6) {
    "use strict";
    var Vector2_1, defaultCellDrawOptions, Cell;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Vector2_1_1) {
                Vector2_1 = Vector2_1_1;
            }
        ],
        execute: function () {
            exports_6("defaultCellDrawOptions", defaultCellDrawOptions = {
                miniCellPosition: new Vector2_1.Vector2(0, 0),
                scale: 1,
                bold: false,
                opacity: 1,
                border: undefined,
            });
            Cell = class Cell {
                get isEmpty() {
                    const result = this.character === ' ' &&
                        this.textColor === '' &&
                        this.backgroundColor === '';
                    return result;
                }
                constructor(character = ' ', textColor = 'white', backgroundColor = 'black') {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                    this.options = defaultCellDrawOptions;
                }
            };
            exports_6("Cell", Cell);
        }
    };
});
System.register("engine/math/Box2", [], function (exports_7, context_7) {
    "use strict";
    var Box2;
    var __moduleName = context_7 && context_7.id;
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
            exports_7("Box2", Box2);
        }
    };
});
System.register("engine/math/Grid", ["engine/math/Vector2"], function (exports_8, context_8) {
    "use strict";
    var Vector2_2, Grid;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Vector2_2_1) {
                Vector2_2 = Vector2_2_1;
            }
        ],
        execute: function () {
            Grid = class Grid {
                get width() {
                    return this.size.width;
                }
                get height() {
                    return this.size.height;
                }
                constructor(size) {
                    this.size = size;
                    this._elements = [];
                }
                at(position) {
                    if (position.x < 0) {
                        return undefined;
                    }
                    return this._elements[position.y * this.size.width + position.x];
                }
                setAt(position, value) {
                    if (position.x < 0) {
                        return;
                    }
                    this._elements[position.y * this.size.width + position.x] = value;
                }
                containsPosition([x, y]) {
                    return (x >= 0 &&
                        x < this.size.width &&
                        y >= 0 &&
                        y < this.size.height);
                }
                traverse(iteration) {
                    const position = new Vector2_2.Vector2();
                    for (position.y = 0; position.y < this.height; position.y++) {
                        for (position.x = 0; position.x < this.width; position.x++) {
                            const value = this.at(position);
                            iteration(value, position, this);
                        }
                    }
                }
                fillValue(value) {
                    this.traverse((_, pos) => this.setAt(pos, value));
                    return this;
                }
                fill(factory) {
                    this.traverse((_, position) => {
                        const newValue = factory(position, this);
                        this.setAt(position, newValue);
                    });
                    return this;
                }
                map(converter) {
                    const newLayer = new Grid(this.size);
                    this.traverse((oldValue, position) => {
                        const newValue = converter(oldValue, position, this);
                        newLayer.setAt(position, newValue);
                    });
                    return newLayer;
                }
                subGrid(box) {
                    const size = box.max.clone().sub(box.min);
                    if (size.width < 0 || size.height < 0) {
                        throw new Error(`Invalid sub-grid size: ${size.width}, ${size.height}.`);
                    }
                    const sub = new Grid(size).fill(pos => this.at(pos.clone().add(box.min)));
                    return sub;
                }
                *[Symbol.iterator]() {
                    for (const item of this._elements) {
                        yield item;
                    }
                }
                static from(arrays) {
                    const grid = new Grid(this.getSize(arrays)).fill(v => { var _a; return (_a = arrays[v.y]) === null || _a === void 0 ? void 0 : _a[v.x]; });
                    return grid;
                }
                static getSize(arrays) {
                    const size = arrays.length > 0
                        ? new Vector2_2.Vector2(arrays[0].length, arrays.length)
                        : new Vector2_2.Vector2();
                    return size;
                }
            };
            exports_8("Grid", Grid);
        }
    };
});
System.register("engine/components/ObjectSkin", ["engine/math/Vector2", "engine/graphics/Cell", "engine/math/Grid"], function (exports_9, context_9) {
    "use strict";
    var Vector2_3, Cell_1, Grid_1, ObjectSkin;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (Vector2_3_1) {
                Vector2_3 = Vector2_3_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Grid_1_1) {
                Grid_1 = Grid_1_1;
            }
        ],
        execute: function () {
            ObjectSkin = class ObjectSkin {
                get size() {
                    return this.cells.size;
                }
                constructor(cells = new Grid_1.Grid(ObjectSkin.defaultSize)) {
                    this.cells = cells;
                    if (!cells) {
                        throw new Error('Cells grid is empty.');
                    }
                }
                isEmptyCellAt(position) {
                    if (!this.cells.containsPosition(position)) {
                        return true;
                    }
                    return this.cells.at(position).isEmpty;
                }
                getCellsAt(position) {
                    const cell = this.cells.at(position);
                    if (!cell) {
                        // TODO: why?
                        //console.error(`Cell is not defined at ${x},${y}.`);
                        return [];
                    }
                    return [cell];
                }
                char(options, position = new Vector2_3.Vector2()) {
                    this.getCellAt(position).character = options;
                    return this;
                }
                color(options, position = new Vector2_3.Vector2()) {
                    this.getCellAt(position).textColor = options;
                    return this;
                }
                background(options, position = new Vector2_3.Vector2()) {
                    this.getCellAt(position).backgroundColor = options;
                    return this;
                }
                getCellAt(position = new Vector2_3.Vector2()) {
                    if (!this.cells.containsPosition(position)) {
                        return ObjectSkin.createDefaultCell();
                    }
                    const cell = this.cells.at(position);
                    if (!cell) {
                        const newCell = ObjectSkin.createDefaultCell();
                        this.cells.setAt(position, newCell);
                        return newCell;
                    }
                    return cell;
                }
                static createDefaultCell() {
                    return new Cell_1.Cell(' ', undefined, 'transparent');
                }
            };
            exports_9("ObjectSkin", ObjectSkin);
            ObjectSkin.defaultSize = new Vector2_3.Vector2(1, 1);
        }
    };
});
System.register("engine/components/ObjectPhysics", ["utils/math", "engine/math/Color", "engine/math/Vector2"], function (exports_10, context_10) {
    "use strict";
    var math_2, Color_1, Vector2_4, ObjectPhysics;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (math_2_1) {
                math_2 = math_2_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Vector2_4_1) {
                Vector2_4 = Vector2_4_1;
            }
        ],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor() {
                    this.collisions = [];
                    this.lights = [];
                    this.temperatures = [];
                    this.materials = [];
                    this.signalCells = [];
                }
                collision(position = new Vector2_4.Vector2()) {
                    const collision = this.collisions.find(x => x.equals(position));
                    if (!collision) {
                        this.collisions.push(position);
                    }
                    this.material({ position, opacity: 1 });
                    return this;
                }
                light(options) {
                    if (typeof options === "number") {
                        this.light({ position: new Vector2_4.Vector2(), intensity: options, color: new Color_1.Color(1, 1, 1) });
                    }
                    else if (typeof options === "string") {
                        const number = Number.parseInt(options, 16);
                        this.light(number);
                    }
                    else {
                        const light = this.lights.find(x => x.position.equals(options.position));
                        if (light) {
                            light.color = options.color;
                            light.intensity = options.intensity;
                        }
                        else {
                            this.lights.push(options);
                        }
                    }
                    return this;
                }
                temperature(options) {
                    if (typeof options === "number") {
                        this.temperature({ position: new Vector2_4.Vector2(), temperature: options });
                    }
                    else if (typeof options === "string") {
                        const number = Number.parseInt(options, 16);
                        this.temperature(number);
                    }
                    else {
                        const temperature = this.temperatures.find(x => x.position.equals(options.position));
                        if (temperature) {
                            temperature.temperature = options.temperature;
                        }
                        else {
                            this.temperatures.push(options);
                        }
                    }
                    return this;
                }
                material(options) {
                    if (typeof options === "number") {
                        this.material({ position: new Vector2_4.Vector2(), opacity: options });
                    }
                    else if (typeof options === "string") {
                        const number = math_2.clamp(Number.parseInt(options, 16) / 15, 0, 1);
                        this.material(number);
                    }
                    else {
                        const material = this.materials.find(x => x.position.equals(options.position));
                        if (material) {
                            material.opacity = options.opacity;
                        }
                        else {
                            this.materials.push(options);
                        }
                    }
                    return this;
                }
                signal(options) {
                    const signalCell = this.signalCells.find(x => x.position.equals(options.position));
                    if (signalCell) {
                        signalCell.outputs = options.outputs;
                        signalCell.inputs = options.inputs;
                    }
                    else {
                        this.signalCells.push(options);
                    }
                    return this;
                }
            };
            exports_10("ObjectPhysics", ObjectPhysics);
            ;
        }
    };
});
System.register("engine/events/EventLoop", [], function (exports_11, context_11) {
    "use strict";
    var events;
    var __moduleName = context_11 && context_11.id;
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
    exports_11("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_11("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("engine/objects/Behavior", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Item", ["engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_13, context_13) {
    "use strict";
    var Object2D_1, ObjectPhysics_1, Vector2_5, Item;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (Object2D_1_1) {
                Object2D_1 = Object2D_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            },
            function (Vector2_5_1) {
                Vector2_5 = Vector2_5_1;
            }
        ],
        execute: function () {
            Item = class Item extends Object2D_1.Object2D {
                constructor(originPoint, skin, physics = new ObjectPhysics_1.ObjectPhysics(), position = Vector2_5.Vector2.zero) {
                    super(originPoint, skin, physics, position);
                }
                setUsage(action) {
                    this.setAction({
                        type: "usage",
                        action,
                    });
                }
                static create(type, skin, physics = new ObjectPhysics_1.ObjectPhysics()) {
                    const item = new Item(Vector2_5.Vector2.zero, skin, physics);
                    item.type = type;
                    return item;
                }
            };
            exports_13("Item", Item);
        }
    };
});
System.register("engine/objects/Equipment", ["engine/math/Vector2"], function (exports_14, context_14) {
    "use strict";
    var Vector2_6, Equipment;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (Vector2_6_1) {
                Vector2_6 = Vector2_6_1;
            }
        ],
        execute: function () {
            Equipment = class Equipment {
                constructor(object) {
                    this.object = object;
                    this.items = [];
                    this.objectWearable = null;
                    this.objectInMainHand = null;
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
                        item.removeFromParent();
                        console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                        return;
                    }
                    // TODO: wearable category.
                    if (item.type === "glasses") {
                        this.objectWearable = item;
                        this.object.add(item);
                        item.position = Vector2_6.Vector2.zero;
                        console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                        return;
                    }
                    // TODO: unequip handhold-equippable.
                    if (item === this.objectInMainHand) {
                        this.unequipObjectInMainHand();
                        return;
                    }
                    this.equipObjectInMainHand(item);
                    // TODO: equippable items categories
                    //this.items.push(item);
                }
                equipObjectInMainHand(item) {
                    // TODO: event and player message.
                    const itemTypeStyle = "color:blue;font-weight:bold;";
                    const defaultStyle = "color:black;font-weight:normal;";
                    this.unequipObjectInMainHand();
                    if (item) {
                        this.objectInMainHand = item;
                        this.object.add(item);
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
                        item.removeFromParent();
                        item.position = Vector2_6.Vector2.zero;
                        console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                    }
                }
            };
            exports_14("Equipment", Equipment);
        }
    };
});
System.register("engine/objects/TileCategory", [], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/unicode", [], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
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
    exports_16("groupUnicode", groupUnicode);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/data/ObjectSkinBuilder", ["utils/unicode", "engine/graphics/Cell", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_17, context_17) {
    "use strict";
    var unicode_1, Cell_2, ObjectSkin_1, Grid_2, ObjectSkinBuilder;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (unicode_1_1) {
                unicode_1 = unicode_1_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (Grid_2_1) {
                Grid_2 = Grid_2_1;
            }
        ],
        execute: function () {
            ObjectSkinBuilder = class ObjectSkinBuilder {
                get size() {
                    return this.characters.size;
                }
                constructor(charactersMask = '', colorsMask = '', colorsMap = {}) {
                    this.colors = this.getRawColors(colorsMask, colorsMap);
                    this.characters = Grid_2.Grid.from(charactersMask.split('\n').map(unicode_1.groupUnicode));
                }
                build() {
                    const cells = new Grid_2.Grid(this.size).fill(v => this.getCellsAt(v)[0]);
                    return new ObjectSkin_1.ObjectSkin(cells);
                }
                getRawColors(colorsMask, colorsMap) {
                    const colorsMaskItems = colorsMask.split('\n').map(line => line.split(''));
                    const rawColors = Grid_2.Grid.from(colorsMaskItems).map(colorMaskItemToRawColor);
                    return rawColors;
                    function colorMaskItemToRawColor(v) {
                        const cellColor = v || ' ';
                        const color = colorsMap[cellColor];
                        const newValue = color ? color : ObjectSkinBuilder.defaultRawColor;
                        return newValue;
                    }
                }
                getCellsAt(position) {
                    const cellColor = this.colors.at(position) || ObjectSkinBuilder.defaultRawColor;
                    const char = this.characters.at(position);
                    const cell = new Cell_2.Cell(char, cellColor[0], cellColor[1]);
                    return [cell];
                }
            };
            exports_17("ObjectSkinBuilder", ObjectSkinBuilder);
            ObjectSkinBuilder.defaultRawColor = [undefined, 'transparent'];
        }
    };
});
System.register("engine/data/SpriteInfo", ["engine/math/Vector2"], function (exports_18, context_18) {
    "use strict";
    var Vector2_7, SpriteInfo;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (Vector2_7_1) {
                Vector2_7 = Vector2_7_1;
            }
        ],
        execute: function () {
            SpriteInfo = class SpriteInfo {
                constructor() {
                    this.size = new Vector2_7.Vector2();
                }
                get width() {
                    return this.size.width;
                }
                get height() {
                    return this.size.height;
                }
            };
            exports_18("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["utils/unicode", "engine/components/ObjectSkin", "engine/data/ObjectSkinBuilder", "engine/data/SpriteInfo"], function (exports_19, context_19) {
    "use strict";
    var unicode_2, ObjectSkin_2, ObjectSkinBuilder_1, SpriteInfo_1, Sprite;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (unicode_2_1) {
                unicode_2 = unicode_2_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (ObjectSkinBuilder_1_1) {
                ObjectSkinBuilder_1 = ObjectSkinBuilder_1_1;
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
                        const skin = new ObjectSkin_2.ObjectSkin().char(char);
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
                            info.size.x = Number(value);
                        else if (key === 'height')
                            info.size.y = Number(value);
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
                                sprite.frames[name].push(new ObjectSkinBuilder_1.ObjectSkinBuilder(bodies[k], colors[k], colorsDict).build());
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
System.register("engine/objects/Particle", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_21, context_21) {
    "use strict";
    var ObjectPhysics_2, Vector2_8, Object2D_2, Particle;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            },
            function (Vector2_8_1) {
                Vector2_8 = Vector2_8_1;
            },
            function (Object2D_2_1) {
                Object2D_2 = Object2D_2_1;
            }
        ],
        execute: function () {
            Particle = class Particle extends Object2D_2.Object2D {
                constructor(sprite, position, state, options = {
                    decaySpeed: 1000,
                }) {
                    const initialFrame = Particle.getFrameSkinAt(sprite, state);
                    super(Vector2_8.Vector2.zero, initialFrame, new ObjectPhysics_2.ObjectPhysics(), position);
                    this.sprite = sprite;
                    this.state = state;
                    this.options = options;
                    this.decayTicks = 0;
                    this.renderOrder = 1;
                    this.layer = "particles";
                }
                update(ticks) {
                    super.update(ticks);
                    if (this.options.decaySpeed) {
                        this.decayTicks += ticks;
                        const decayTicksOverflow = this.decayTicks - this.options.decaySpeed;
                        if (decayTicksOverflow >= 0) {
                            if (!this.hasNext()) {
                                this.onRemove();
                                this.removeFromParent();
                            }
                            else {
                                this.next();
                                this.onNext();
                            }
                            this.decayTicks = decayTicksOverflow;
                        }
                    }
                }
                onNext() {
                }
                onRemove() {
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
System.register("engine/components/CompositeObjectSkin", ["engine/math/Vector2", "engine/components/ObjectSkin"], function (exports_22, context_22) {
    "use strict";
    var Vector2_9, ObjectSkin_3, CompositeObjectSkin;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (Vector2_9_1) {
                Vector2_9 = Vector2_9_1;
            },
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            }
        ],
        execute: function () {
            CompositeObjectSkin = class CompositeObjectSkin extends ObjectSkin_3.ObjectSkin {
                get size() {
                    return this.skins
                        .map(x => x.size)
                        .reduce((a, x) => a.max(x), new Vector2_9.Vector2());
                }
                constructor(skins) {
                    super();
                    this.skins = skins;
                    if (skins.filter(x => !x).length > 0) {
                        throw new Error('Undefined skin not allowed.');
                    }
                }
                color(options, position) {
                    for (const skin of this.skins) {
                        skin.color(options, position);
                    }
                    return this;
                }
                background(options, position) {
                    for (const skin of this.skins) {
                        skin.background(options, position);
                    }
                    return this;
                }
                getCellsAt(position) {
                    return this.skins.flatMap(x => x.getCellsAt(position));
                }
                isEmptyCellAt(position) {
                    return this.skins.map(x => x.isEmptyCellAt(position)).reduce((a, x) => a && (a = x), true);
                }
            };
            exports_22("CompositeObjectSkin", CompositeObjectSkin);
        }
    };
});
System.register("engine/objects/Tile", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/sprites/waterRippleSprite", "engine/objects/Particle", "engine/math/Vector2", "engine/components/CompositeObjectSkin"], function (exports_23, context_23) {
    "use strict";
    var Object2D_3, ObjectSkin_4, ObjectPhysics_3, waterRippleSprite_1, Particle_1, Vector2_10, CompositeObjectSkin_1, Tile;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (Object2D_3_1) {
                Object2D_3 = Object2D_3_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
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
            function (Vector2_10_1) {
                Vector2_10 = Vector2_10_1;
            },
            function (CompositeObjectSkin_1_1) {
                CompositeObjectSkin_1 = CompositeObjectSkin_1_1;
            }
        ],
        execute: function () {
            Tile = class Tile extends Object2D_3.Object2D {
                get totalMovementPenalty() {
                    return this.movementPenalty * (1 - 0.1 * this.snowLevel);
                }
                constructor(skin, position) {
                    super(Vector2_10.Vector2.zero, skin, new ObjectPhysics_3.ObjectPhysics(), position);
                    this.movementPenalty = 1;
                    this.snowLevel = 0;
                    this.snowTicks = 0;
                    this.disturbanceLevel = 0;
                    this.disturbanceTicks = 0;
                    this.disturbanceMaxValue = waterRippleSprite_1.waterRippleSprite.frames[Particle_1.Particle.defaultFrameName].length;
                    this.renderOrder = -1;
                    this._originalSkin = skin;
                }
                update(ticks) {
                    super.update(ticks);
                    if (this.category === "solid") {
                        this.snowTicks += Object2D_3.Object2D.updateValue(this.snowTicks, ticks, 3000, () => {
                            const temp = this.parent.scene.weather.getWeatherInfoAt(this.position).temperature;
                            if (temp >= 8) {
                                this.decreaseSnow();
                            }
                        });
                    }
                    else if (this.category === "liquid" && this.isDisturbed) {
                        this.disturbanceTicks = Object2D_3.Object2D.updateValue(this.disturbanceTicks, ticks, 200, () => {
                            this.disturbanceLevel = Object2D_3.Object2D.updateValue(this.disturbanceLevel, 1, this.disturbanceMaxValue, () => {
                                this.isDisturbed = false;
                            });
                        });
                    }
                    this.updateSkin();
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
                updateSkin() {
                    const tileEffect = this.getTileEffect();
                    this.skin = tileEffect ? new CompositeObjectSkin_1.CompositeObjectSkin([this._originalSkin, tileEffect]) : this._originalSkin;
                }
                getTileEffect() {
                    const tile = this;
                    if (tile.category === "solid" && tile.snowLevel > 0) {
                        const snowColor = `#fff${(tile.snowLevel * 2).toString(16)}`;
                        const frame = new ObjectSkin_4.ObjectSkin().background(snowColor);
                        return frame;
                    }
                    if (tile.category === "liquid" && tile.isDisturbed) {
                        const frame = waterRippleSprite_1.waterRippleSprite.frames[Particle_1.Particle.defaultFrameName][tile.disturbanceLevel];
                        return frame;
                    }
                    return undefined;
                }
            };
            exports_23("Tile", Tile);
            Tile.maxSnowLevel = 4;
        }
    };
});
System.register("engine/objects/NpcMovementOptions", [], function (exports_24, context_24) {
    "use strict";
    var NpcMovementOptions, defaultMovementOptions;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [],
        execute: function () {
            // Number values are in cells per second.
            NpcMovementOptions = class NpcMovementOptions {
            };
            exports_24("NpcMovementOptions", NpcMovementOptions);
            exports_24("defaultMovementOptions", defaultMovementOptions = {
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
System.register("engine/signaling/SignalType", [], function (exports_25, context_25) {
    "use strict";
    var SignalTypes, SignalColors;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [],
        execute: function () {
            exports_25("SignalTypes", SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"]);
            exports_25("SignalColors", SignalColors = ["white", "green", "red", "cyan", "yellow", "blue"]);
        }
    };
});
System.register("engine/signaling/Signal", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/SignalTransfer", [], function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/ISignalProcessor", [], function (exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    function isAnISignalProcessor(obj) {
        return ("processSignalTransfer" in obj &&
            typeof obj.processSignalTransfer === "function");
    }
    exports_28("isAnISignalProcessor", isAnISignalProcessor);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/SignalProcessor", ["engine/signaling/ISignalProcessor", "engine/math/Grid", "engine/math/Vector2", "engine/math/Rotation"], function (exports_29, context_29) {
    "use strict";
    var ISignalProcessor_1, Grid_3, Vector2_11, Rotation_2, SignalProcessor;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (ISignalProcessor_1_1) {
                ISignalProcessor_1 = ISignalProcessor_1_1;
            },
            function (Grid_3_1) {
                Grid_3 = Grid_3_1;
            },
            function (Vector2_11_1) {
                Vector2_11 = Vector2_11_1;
            },
            function (Rotation_2_1) {
                Rotation_2 = Rotation_2_1;
            }
        ],
        execute: function () {
            SignalProcessor = class SignalProcessor {
                constructor(scene) {
                    this.scene = scene;
                    this._prevSignalTransfers = new Map();
                    this._signalTransfers = new Map();
                    this.signalLayer = new Grid_3.Grid(scene.size);
                }
                update() {
                    // clear
                    this.clearLayer();
                    this._prevSignalTransfers = this._signalTransfers;
                    this._signalTransfers = new Map();
                    this.scene.traverse(x => this.updateSignalObject(x));
                }
                updateSignalObject(object) {
                    if (!ISignalProcessor_1.isAnISignalProcessor(object)) {
                        return;
                    }
                    // TODO: this works for 1 cell objects only.
                    const key = SignalProcessor.getPositionKey(object.position);
                    const inputTransfers = (this._prevSignalTransfers.get(key) || [])
                        .map(input => {
                        const inputCellRotation = input.rotation;
                        // Convert global to local rotations.
                        const relativeObjectRotation = Rotation_2.Rotations.normalize(inputCellRotation - object.rotation);
                        return { rotation: relativeObjectRotation, signal: input.signal };
                    });
                    const outputTransfers = object.processSignalTransfer(inputTransfers);
                    this.registerOutputsAt(object.position, outputTransfers);
                    const inputs = outputTransfers
                        .map(output => {
                        const relativeObjectRotation = output.rotation;
                        // Convert local to global rotations.
                        const outputCellRotation = Rotation_2.Rotations.normalize(object.rotation + relativeObjectRotation);
                        const globalDirection = Vector2_11.Vector2.right.rotate(outputCellRotation);
                        const inputPosition = object.position.clone().add(globalDirection);
                        const inputCellRotation = Rotation_2.Rotations.normalize(outputCellRotation + Rotation_2.Rotations.opposite);
                        return { position: inputPosition, rotation: inputCellRotation, signal: output.signal };
                    });
                    for (const input of inputs) {
                        const key = SignalProcessor.getPositionKey(input.position);
                        this._signalTransfers.set(key, (this._signalTransfers.get(key) || []).concat([input]));
                    }
                }
                clearLayer() {
                    this.signalLayer.fillValue(undefined);
                }
                registerOutputsAt(outputPosition, outputs) {
                    if (outputs.length === 0) {
                        return;
                    }
                    const cellSignalsMap = new Map();
                    for (const output of outputs) {
                        cellSignalsMap.set(output.signal.type, Math.max(cellSignalsMap.get(output.signal.type) || 0, output.signal.value));
                    }
                    const newValue = Object.fromEntries(cellSignalsMap);
                    this.signalLayer.setAt(outputPosition, newValue);
                }
                static getPositionKey(position) {
                    return `${position.x}:${position.y}`;
                }
            };
            exports_29("SignalProcessor", SignalProcessor);
        }
    };
});
System.register("engine/ActionData", [], function (exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    function convertToActionData(object, objectAction) {
        const iconPos = objectAction.iconPosition;
        const actionIcon = object.skin.getCellsAt(iconPos);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon };
    }
    exports_30("convertToActionData", convertToActionData);
    function getNpcInteraction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
    }
    exports_30("getNpcInteraction", getNpcInteraction);
    function getNpcCollisionAction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
    }
    exports_30("getNpcCollisionAction", getNpcCollisionAction);
    function getItemUsageAction(item) {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }
        // This is a default usage action.
        const defaultAction = interactions[0];
        return convertToActionData(item, defaultAction);
    }
    exports_30("getItemUsageAction", getItemUsageAction);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("world/sprites/fallingAshSprite", ["engine/data/Sprite"], function (exports_31, context_31) {
    "use strict";
    var Sprite_2, fallingAshSpriteRaw, fallingAshSprite;
    var __moduleName = context_31 && context_31.id;
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
            exports_31("fallingAshSprite", fallingAshSprite = Sprite_2.Sprite.parse(fallingAshSpriteRaw));
        }
    };
});
System.register("world/objects/particles/WeatherParticle", ["engine/objects/Particle"], function (exports_32, context_32) {
    "use strict";
    var Particle_2, WeatherParticle;
    var __moduleName = context_32 && context_32.id;
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
            };
            exports_32("WeatherParticle", WeatherParticle);
            WeatherParticle.DefaultDecaySpeed = 300;
        }
    };
});
System.register("world/objects/particles/FallingAsh", ["world/sprites/fallingAshSprite", "world/objects/particles/WeatherParticle"], function (exports_33, context_33) {
    "use strict";
    var fallingAshSprite_1, WeatherParticle_1, FallingAsh;
    var __moduleName = context_33 && context_33.id;
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
                onRemove() {
                    var _a;
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                }
            };
            exports_33("FallingAsh", FallingAsh);
        }
    };
});
System.register("world/sprites/rainDropSprite", ["engine/data/Sprite"], function (exports_34, context_34) {
    "use strict";
    var Sprite_3, rainDropSpriteRaw, rainDropSprite;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (Sprite_3_1) {
                Sprite_3 = Sprite_3_1;
            }
        ],
        execute: function () {
            exports_34("rainDropSpriteRaw", rainDropSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0ff9,transparent

particle
ᣟ˙·.
RRRR`);
            exports_34("rainDropSprite", rainDropSprite = Sprite_3.Sprite.parse(rainDropSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Raindrop", ["world/sprites/rainDropSprite", "world/objects/particles/WeatherParticle"], function (exports_35, context_35) {
    "use strict";
    var rainDropSprite_1, WeatherParticle_2, Raindrop;
    var __moduleName = context_35 && context_35.id;
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
                onRemove() {
                    var _a;
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                }
            };
            exports_35("Raindrop", Raindrop);
        }
    };
});
System.register("world/sprites/snowFlakeSprite", ["engine/data/Sprite"], function (exports_36, context_36) {
    "use strict";
    var Sprite_4, snowFlakeSpriteRaw, snowFlakeSprite;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (Sprite_4_1) {
                Sprite_4 = Sprite_4_1;
            }
        ],
        execute: function () {
            exports_36("snowFlakeSpriteRaw", snowFlakeSpriteRaw = `width:1
height:1
name:
empty:'
color:S,#fff9,transparent

particle
❆❅✶•·.
SSSSSS`);
            exports_36("snowFlakeSprite", snowFlakeSprite = Sprite_4.Sprite.parse(snowFlakeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Snowflake", ["world/sprites/snowFlakeSprite", "world/objects/particles/WeatherParticle"], function (exports_37, context_37) {
    "use strict";
    var snowFlakeSprite_1, WeatherParticle_3, Snowflake;
    var __moduleName = context_37 && context_37.id;
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
                onRemove() {
                    var _a;
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.position);
                    tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                    tile === null || tile === void 0 ? void 0 : tile.increaseSnow();
                }
            };
            exports_37("Snowflake", Snowflake);
        }
    };
});
System.register("world/sprites/mistSprite", ["engine/data/Sprite"], function (exports_38, context_38) {
    "use strict";
    var Sprite_5, mistSpriteRaw, mistSprite;
    var __moduleName = context_38 && context_38.id;
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
            exports_38("mistSprite", mistSprite = Sprite_5.Sprite.parse(mistSpriteRaw));
        }
    };
});
System.register("engine/weather/WeatherType", [], function (exports_39, context_39) {
    "use strict";
    var weatherTypes;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [],
        execute: function () {
            exports_39("weatherTypes", weatherTypes = ["normal", "rain", "ashfall", "snow", "rain_and_snow", "mist", "heavy_mist"]);
        }
    };
});
System.register("engine/weather/WeatherHelper", ["world/objects/particles/FallingAsh", "world/objects/particles/Raindrop", "world/objects/particles/Snowflake", "world/sprites/mistSprite", "engine/objects/Particle"], function (exports_40, context_40) {
    "use strict";
    var FallingAsh_1, Raindrop_1, Snowflake_1, mistSprite_1, Particle_3;
    var __moduleName = context_40 && context_40.id;
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
    exports_40("createWeatherParticle", createWeatherParticle);
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
    exports_40("getWeatherSkyTransparency", getWeatherSkyTransparency);
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
        }
    };
});
System.register("engine/objects/special/WeatherParticlesObject", ["engine/weather/WeatherHelper", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_41, context_41) {
    "use strict";
    var WeatherHelper_1, Vector2_12, Object2D_4, WeatherParticlesObject;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (WeatherHelper_1_1) {
                WeatherHelper_1 = WeatherHelper_1_1;
            },
            function (Vector2_12_1) {
                Vector2_12 = Vector2_12_1;
            },
            function (Object2D_4_1) {
                Object2D_4 = Object2D_4_1;
            }
        ],
        execute: function () {
            WeatherParticlesObject = class WeatherParticlesObject extends Object2D_4.Object2D {
                constructor() {
                    super();
                    this.weatherTicks = 0;
                    this.type = "weather_particles";
                }
                update(ticks) {
                    super.update(ticks);
                    this.weatherTicks += ticks;
                    for (const particle of this.children) {
                        particle.update(ticks);
                    }
                    const weatherTicksOverflow = this.weatherTicks - 300;
                    if (weatherTicksOverflow >= 0) {
                        this.updateWeatherParticles();
                        this.weatherTicks = weatherTicksOverflow;
                    }
                }
                getWeatherParticleAt(position) {
                    const child = this.children.find(p => p.position.equals(position));
                    return child ? child : undefined;
                }
                updateWeatherParticles() {
                    const box = this.scene.windBox;
                    const weatherType = this.scene.weather.weatherType;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const levelPosition = new Vector2_12.Vector2(x, y);
                            if (!this.scene.isRoofHoleAt(levelPosition)) {
                                continue;
                            }
                            const existingParticle = this.getWeatherParticleAt(levelPosition);
                            if (existingParticle) {
                                continue;
                            }
                            const newParticle = WeatherHelper_1.createWeatherParticle(weatherType, levelPosition);
                            if (!newParticle) {
                                continue;
                            }
                            this.add(newParticle);
                        }
                    }
                }
            };
            exports_41("WeatherParticlesObject", WeatherParticlesObject);
        }
    };
});
System.register("engine/objects/special/ParticlesObject", ["engine/objects/Object2D"], function (exports_42, context_42) {
    "use strict";
    var Object2D_5, ParticlesObject;
    var __moduleName = context_42 && context_42.id;
    return {
        setters: [
            function (Object2D_5_1) {
                Object2D_5 = Object2D_5_1;
            }
        ],
        execute: function () {
            ParticlesObject = class ParticlesObject extends Object2D_5.Object2D {
                constructor() {
                    super();
                    this.type = "particles";
                }
                update(ticks) {
                    super.update(ticks);
                    for (const particle of this.children) {
                        particle.update(ticks);
                    }
                }
                getParticleAt(position) {
                    const child = this.children.find(p => p.position.equals(position));
                    return child ? child : undefined;
                }
                tryAddParticle(particle) {
                    const existingParticle = this.getParticleAt(particle.position);
                    if (existingParticle) {
                        this.remove(existingParticle);
                    }
                    this.add(particle);
                    return true;
                }
                isParticlePositionBlocked(position) {
                    return !!this.getParticleAt(position);
                }
            };
            exports_42("ParticlesObject", ParticlesObject);
        }
    };
});
System.register("engine/objects/special/TilesObject", ["engine/objects/Object2D"], function (exports_43, context_43) {
    "use strict";
    var Object2D_6, TilesObject;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (Object2D_6_1) {
                Object2D_6 = Object2D_6_1;
            }
        ],
        execute: function () {
            TilesObject = class TilesObject extends Object2D_6.Object2D {
                constructor(tiles) {
                    super();
                    this.tiles = tiles;
                    this.type = "tiles";
                    for (const tile of tiles) {
                        this.add(tile);
                    }
                }
                update(ticks) {
                    super.update(ticks);
                    for (const tile of this.children) {
                        tile.update(ticks);
                    }
                }
                getTileAt(position) {
                    return this.tiles.at(position);
                }
            };
            exports_43("TilesObject", TilesObject);
        }
    };
});
System.register("engine/objects/special/BlockedLayerObject", ["engine/graphics/Cell", "engine/objects/Object2D", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_44, context_44) {
    "use strict";
    var Cell_3, Object2D_7, ObjectSkin_5, Grid_4, BlockedLayerObject;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            },
            function (Object2D_7_1) {
                Object2D_7 = Object2D_7_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (Grid_4_1) {
                Grid_4 = Grid_4_1;
            }
        ],
        execute: function () {
            BlockedLayerObject = class BlockedLayerObject extends Object2D_7.Object2D {
                constructor(size) {
                    super();
                    this.layer = "ui";
                    this.type = "blocked_layer";
                    this.blockedLayer = new Grid_4.Grid(size);
                }
                update(ticks) {
                    super.update(ticks);
                    this.updateBlocked();
                    this.skin = this.createBlockedSkin();
                }
                isPositionBlocked(position) {
                    const layer = this.blockedLayer;
                    return layer.at(position) === true;
                }
                updateBlocked() {
                    const scene = this.scene;
                    this.blockedLayer.fillValue(false);
                    const objects = scene.children.filter(x => x !== this).filter(x => x.enabled);
                    for (const object of objects) {
                        for (const cellPos of object.physics.collisions) {
                            const result = object.position.clone().sub(object.originPoint).add(cellPos);
                            if (!this.blockedLayer.containsPosition(result)) {
                                continue;
                            }
                            this.blockedLayer.setAt(result, true);
                        }
                    }
                }
                createBlockedSkin() {
                    return new ObjectSkin_5.ObjectSkin(this.blockedLayer.map(v => createCell(v)));
                    function createCell(b) {
                        return b === true
                            ? new Cell_3.Cell('⛌', `#f00a`, `#000a`)
                            : new Cell_3.Cell(' ', undefined, 'transparent');
                    }
                }
            };
            exports_44("BlockedLayerObject", BlockedLayerObject);
        }
    };
});
System.register("engine/objects/special/SignalsLayerObject", ["engine/math/Vector2", "engine/graphics/Cell", "engine/objects/Object2D", "engine/components/ObjectSkin", "engine/signaling/SignalType", "engine/components/CompositeObjectSkin", "engine/math/Grid"], function (exports_45, context_45) {
    "use strict";
    var Vector2_13, Cell_4, Object2D_8, ObjectSkin_6, SignalType_1, SignalType_2, CompositeObjectSkin_2, Grid_5, SignalsLayerObject;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (Vector2_13_1) {
                Vector2_13 = Vector2_13_1;
            },
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            },
            function (Object2D_8_1) {
                Object2D_8 = Object2D_8_1;
            },
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            },
            function (SignalType_1_1) {
                SignalType_1 = SignalType_1_1;
                SignalType_2 = SignalType_1_1;
            },
            function (CompositeObjectSkin_2_1) {
                CompositeObjectSkin_2 = CompositeObjectSkin_2_1;
            },
            function (Grid_5_1) {
                Grid_5 = Grid_5_1;
            }
        ],
        execute: function () {
            SignalsLayerObject = class SignalsLayerObject extends Object2D_8.Object2D {
                constructor() {
                    super();
                    this.layer = "ui";
                    this.type = "signals_layer";
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createSignalsSkin();
                }
                createSignalsSkin() {
                    const scene = this.scene;
                    const layers = Object.fromEntries(SignalType_1.SignalTypes.map(x => [x, new Grid_5.Grid(scene.size).fillValue(undefined)]));
                    scene.signalProcessor.signalLayer.traverse((signals, position) => {
                        if (!signals) {
                            return;
                        }
                        for (const [signalType, value] of Object.entries(signals)) {
                            const cell = createCell(signalType, value);
                            layers[signalType].setAt(position, cell);
                        }
                    });
                    const filledLayers = Object.values(layers).map(x => x.map(x => x || new Cell_4.Cell(' ', undefined, 'transparent')));
                    return new CompositeObjectSkin_2.CompositeObjectSkin(filledLayers.map(x => new ObjectSkin_6.ObjectSkin(x)));
                    function createCell(signalType, v) {
                        const index = SignalType_1.SignalTypes.indexOf(signalType);
                        const signalColor = SignalType_2.SignalColors[index];
                        const cellOptions = {
                            miniCellPosition: new Vector2_13.Vector2(0.5 + ((index % 2) - 1) * 0.33, ((index / 2) | 0) * 0.33),
                            scale: 0.333,
                            bold: true,
                            opacity: 1,
                            border: undefined,
                        };
                        // Invert text for light bg colors.
                        const text = v > 0 ? v.toString(16) : '·';
                        const textColor = ((index === 0 || index === 3 || index === 4)) ? 'black' : 'white';
                        const backgroundColor = signalColor;
                        const cell = new Cell_4.Cell(text, textColor, backgroundColor);
                        cell.options = cellOptions;
                        return cell;
                    }
                }
            };
            exports_45("SignalsLayerObject", SignalsLayerObject);
        }
    };
});
System.register("utils/color", ["engine/math/Color", "utils/math"], function (exports_46, context_46) {
    "use strict";
    var Color_2, math_3;
    var __moduleName = context_46 && context_46.id;
    function numberToHexColor(val, max = 15, min = 0) {
        const length = max - min;
        const intVal = Math.round(val) | 0;
        const red = Math.floor((intVal / length) * 255);
        const blue = 255 - red;
        return `rgba(${red}, 0, ${blue})`;
    }
    exports_46("numberToHexColor", numberToHexColor);
    function hslToRgb(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(color);
        };
        return new Color_2.Color(f(0), f(8), f(4));
    }
    exports_46("hslToRgb", hslToRgb);
    function mixColors(colors) {
        const totalIntensity = math_3.clamp(colors.reduce((a, x) => a += x.intensity / 15, 0), 0, 1);
        const mixedColor = new Color_2.Color(math_3.clamp(colors.reduce((a, x) => a += x.color.r * (x.intensity / 15), 0) / totalIntensity, 0, 1), math_3.clamp(colors.reduce((a, x) => a += x.color.g * (x.intensity / 15), 0) / totalIntensity, 0, 1), math_3.clamp(colors.reduce((a, x) => a += x.color.b * (x.intensity / 15), 0) / totalIntensity, 0, 1));
        return mixedColor;
    }
    exports_46("mixColors", mixColors);
    return {
        setters: [
            function (Color_2_1) {
                Color_2 = Color_2_1;
            },
            function (math_3_1) {
                math_3 = math_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/objects/special/NumberGridObject", ["engine/math/Vector2", "engine/graphics/Cell", "engine/objects/Object2D", "engine/components/ObjectSkin", "utils/color"], function (exports_47, context_47) {
    "use strict";
    var Vector2_14, Cell_5, Object2D_9, ObjectSkin_7, color_1, NumberGridObject, defaultDebugDrawOptions;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (Vector2_14_1) {
                Vector2_14 = Vector2_14_1;
            },
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
            },
            function (Object2D_9_1) {
                Object2D_9 = Object2D_9_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            NumberGridObject = class NumberGridObject extends Object2D_9.Object2D {
                constructor(gridProvider, drawOptions = defaultDebugDrawOptions) {
                    super();
                    this.gridProvider = gridProvider;
                    this.drawOptions = drawOptions;
                    this.layer = "ui";
                    this.type = "number_layer";
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createSkin();
                }
                createSkin() {
                    const grid = this.gridProvider();
                    return this.createSkinFromGrid(grid, this.drawOptions);
                }
                createSkinFromGrid(grid, drawOptions = defaultDebugDrawOptions) {
                    const alpha = drawOptions.cellOptions.opacity;
                    const cellLayer = grid.map((value, _) => createCell(value) || new Cell_5.Cell(' ', undefined, 'transparent'));
                    return new ObjectSkin_7.ObjectSkin(cellLayer);
                    function createCell(v) {
                        const value = v;
                        if (typeof v === "undefined" && !drawOptions.drawUndefined) {
                            return undefined;
                        }
                        const textColor = typeof value !== "undefined"
                            ? `color-mix(in srgb, ${drawOptions.textColor(value)} ${alpha * 100}%, transparent)`
                            : `rgba(128, 128, 128, ${alpha})`;
                        const backgroundColor = typeof value !== "undefined"
                            ? `color-mix(in srgb, ${drawOptions.backgroundColor(value)} ${alpha * 100}%, transparent)`
                            : `rgba(0, 0, 0, ${alpha})`;
                        const char = typeof v !== "undefined"
                            ? v
                            : ' ';
                        const cell = new Cell_5.Cell(char.toString(16), textColor, backgroundColor);
                        cell.options = drawOptions.cellOptions;
                        return cell;
                    }
                }
            };
            exports_47("NumberGridObject", NumberGridObject);
            defaultDebugDrawOptions = {
                drawUndefined: false,
                textColor: _ => `white`,
                backgroundColor: v => color_1.numberToHexColor(v, 15, 0),
                cellOptions: {
                    bold: false,
                    miniCellPosition: Vector2_14.Vector2.zero,
                    opacity: 0.5,
                    scale: 1,
                    border: undefined,
                },
            };
        }
    };
});
System.register("engine/lights/Light", ["engine/math/Color", "engine/objects/Object2D"], function (exports_48, context_48) {
    "use strict";
    var Color_3, Object2D_10, Light;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (Color_3_1) {
                Color_3 = Color_3_1;
            },
            function (Object2D_10_1) {
                Object2D_10 = Object2D_10_1;
            }
        ],
        execute: function () {
            Light = class Light extends Object2D_10.Object2D {
                // TODO: change intensity from [0..F] to [0..1] everywhere.
                constructor(color, intensity = 15) {
                    super();
                    this.intensity = intensity;
                    this.color = new Color_3.Color(color);
                    this.type = "light";
                }
            };
            exports_48("Light", Light);
        }
    };
});
System.register("engine/lights/SkyLight", ["engine/lights/Light"], function (exports_49, context_49) {
    "use strict";
    var Light_1, SkyLight;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (Light_1_1) {
                Light_1 = Light_1_1;
            }
        ],
        execute: function () {
            SkyLight = class SkyLight extends Light_1.Light {
                constructor(color, intensity) {
                    super(color, intensity);
                    this.type = "sky_light";
                }
            };
            exports_49("SkyLight", SkyLight);
        }
    };
});
System.register("engine/lights/Lights", ["utils/color", "engine/math/Color", "engine/math/Vector2", "utils/math", "engine/math/Grid"], function (exports_50, context_50) {
    "use strict";
    var color_2, Color_4, Vector2_15, math_4, Grid_6, Lights;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (color_2_1) {
                color_2 = color_2_1;
            },
            function (Color_4_1) {
                Color_4 = Color_4_1;
            },
            function (Vector2_15_1) {
                Vector2_15 = Vector2_15_1;
            },
            function (math_4_1) {
                math_4 = math_4_1;
            },
            function (Grid_6_1) {
                Grid_6 = Grid_6_1;
            }
        ],
        execute: function () {
            Lights = class Lights {
                constructor(scene) {
                    this.scene = scene;
                    this.opacityLayer = new Grid_6.Grid(scene.size);
                    this.lightLayer = new Grid_6.Grid(scene.size);
                }
                update() {
                    const objects = [];
                    this.scene.traverseVisible(x => objects.push(x));
                    this.updateOpacity(objects);
                    this.updateLights(objects);
                }
                getLightInfoAt(position) {
                    return this.lightLayer.at(position);
                }
                updateOpacity(objects) {
                    const opacityLayer = new Grid_6.Grid(this.scene.size).fillValue(0);
                    const materials = objects.flatMap(x => this.getObjectMaterials(x));
                    for (const materialInfo of materials) {
                        if (materialInfo.opacity === 0) {
                            continue;
                        }
                        if (!opacityLayer.containsPosition(materialInfo.position)) {
                            continue;
                        }
                        opacityLayer.setAt(materialInfo.position, materialInfo.opacity);
                    }
                    this.opacityLayer = opacityLayer;
                }
                updateLights(objects) {
                    // Clear layers.
                    this.lightLayer = new Grid_6.Grid(this.scene.size).fill(position => ({ position, color: new Color_4.Color(1, 1, 1), intensity: 0 }));
                    const lightLayers = [];
                    const skyLightLayer = this.createSkyLightLayer(this.scene.skyLight, [this.scene.weather.cloudLayer, this.scene.roofLayer], this.scene.size);
                    lightLayers.push(skyLightLayer);
                    const lights = objects.flatMap(x => this.getObjectLights(x));
                    lightLayers.push(...lights.map(x => this.createLightLayer(x, this.scene.size)));
                    this.mergeLightLayers(lightLayers, this.lightLayer);
                }
                // transparencyLayers - transparency [0..F].
                createSkyLightLayer(skyLight, transparencyLayers, size) {
                    const skyLightLayer = new Grid_6.Grid(this.scene.size).fillValue(0);
                    skyLightLayer.traverse((v, position, grid) => {
                        const opacity = transparencyLayers
                            .map(layer => layer.at(position) || 0)
                            .map(transparency => (Lights.maxTransparency - transparency) / Lights.maxTransparency)
                            .reduce((a, opacity) => a * opacity, Lights.defaultOpacity);
                        const cellLightLevel = Math.round(skyLight.intensity * math_4.clamp(opacity, 0, 1)) | 0;
                        if (cellLightLevel === 0) {
                            return;
                        }
                        this.addEmitter(grid, position, cellLightLevel);
                        this.spreadPoint(grid, position, 0);
                    });
                    return { intensityLayer: skyLightLayer, color: skyLight.color, };
                }
                getPositionOpacity(position) {
                    const opacity = this.opacityLayer.at(position);
                    const result = typeof opacity !== "undefined" ? opacity : 1;
                    return result;
                }
                getObjectLights(obj) {
                    const lights = obj.physics.lights;
                    return lights.map(x => ({ ...x, position: obj.position.clone().sub(obj.originPoint).add(x.position) }));
                }
                getObjectMaterials(obj) {
                    const materials = obj.physics.materials;
                    return materials.map(x => ({ ...x, position: obj.position.clone().sub(obj.originPoint).add(x.position) }));
                }
                createLightLayer(lightInfo, size) {
                    const minLightIntensity = 0;
                    const layer = new Grid_6.Grid(size).fillValue(minLightIntensity);
                    this.addEmitter(layer, lightInfo.position, lightInfo.intensity);
                    this.spreadPoint(layer, lightInfo.position, minLightIntensity);
                    return { intensityLayer: layer, color: lightInfo.color };
                }
                mergeLightLayers(lightLayers, layer) {
                    if (!lightLayers.length) {
                        return;
                    }
                    layer.traverse((v, pos) => {
                        const colors = lightLayers
                            .map(layer => ({ color: layer.color, intensity: layer.intensityLayer.at(pos) }))
                            .filter(x => x.color && x.intensity);
                        const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;
                        v.intensity = math_4.clamp(intensity, 0, Lights.maxIntensity);
                        v.color.copy(color_2.mixColors(colors));
                    });
                }
                addEmitter(layer, position, level) {
                    const value = layer.at(position);
                    if (typeof value !== "undefined" &&
                        value < level) {
                        layer.setAt(position, level);
                    }
                }
                spreadPoint(array, position, min, decay = Lights.defaultDecay) {
                    const positionOpacity = this.getPositionOpacity(position);
                    if (positionOpacity === 1) {
                        return;
                    }
                    const currentIntensity = array.at(position);
                    const originalNextIntensity = currentIntensity - decay;
                    const positionTransparency = 1 - positionOpacity;
                    const nextIntensity = Math.round(originalNextIntensity * positionTransparency) | 0;
                    decay = decay + (originalNextIntensity - nextIntensity);
                    if (nextIntensity <= min) {
                        return;
                    }
                    const relative = new Vector2_15.Vector2();
                    for (relative.x = -1; relative.x <= 1; relative.x++) {
                        for (relative.y = -1; relative.y <= 1; relative.y++) {
                            if (relative.x === relative.y || relative.x + relative.y === 0) {
                                // Diagonals.
                                continue;
                            }
                            const nextPosition = position.clone().add(relative);
                            if (!array.containsPosition(nextPosition)) {
                                continue;
                            }
                            if (array.at(nextPosition) >= nextIntensity) {
                                continue;
                            }
                            array.setAt(nextPosition, nextIntensity);
                            this.spreadPoint(array, nextPosition, min, decay);
                        }
                    }
                }
            };
            exports_50("Lights", Lights);
            Lights.maxIntensity = 15;
            Lights.maxTransparency = 15;
            Lights.defaultOpacity = 1;
            Lights.defaultDecay = 2;
        }
    };
});
System.register("world/events/WeatherChangedGameEvent", ["engine/events/GameEvent"], function (exports_51, context_51) {
    "use strict";
    var GameEvent_1, WeatherChangedGameEvent;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            }
        ],
        execute: function () {
            (function (WeatherChangedGameEvent) {
                WeatherChangedGameEvent.type = "weather_changed";
                class Args {
                }
                WeatherChangedGameEvent.Args = Args;
                function create(from, to) {
                    return new GameEvent_1.GameEvent("system", WeatherChangedGameEvent.type, {
                        from,
                        to,
                    });
                }
                WeatherChangedGameEvent.create = create;
            })(WeatherChangedGameEvent || (exports_51("WeatherChangedGameEvent", WeatherChangedGameEvent = {})));
        }
    };
});
System.register("engine/weather/Weather", ["engine/events/EventLoop", "engine/math/Vector2", "engine/weather/WeatherHelper", "engine/objects/Object2D", "utils/math", "engine/math/Grid", "world/events/WeatherChangedGameEvent"], function (exports_52, context_52) {
    "use strict";
    var EventLoop_1, Vector2_16, WeatherHelper_2, Object2D_11, math_5, Grid_7, WeatherChangedGameEvent_1, defaultLightIntensityAtNight, defaultLightIntensityAtDay, defaultTemperatureAtNight, defaultTemperatureAtDay, defaultMoisture, Weather;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (Vector2_16_1) {
                Vector2_16 = Vector2_16_1;
            },
            function (WeatherHelper_2_1) {
                WeatherHelper_2 = WeatherHelper_2_1;
            },
            function (Object2D_11_1) {
                Object2D_11 = Object2D_11_1;
            },
            function (math_5_1) {
                math_5 = math_5_1;
            },
            function (Grid_7_1) {
                Grid_7 = Grid_7_1;
            },
            function (WeatherChangedGameEvent_1_1) {
                WeatherChangedGameEvent_1 = WeatherChangedGameEvent_1_1;
            }
        ],
        execute: function () {
            defaultLightIntensityAtNight = 4;
            defaultLightIntensityAtDay = 15;
            // TODO: depend on biome.
            defaultTemperatureAtNight = 4;
            defaultTemperatureAtDay = 7;
            defaultMoisture = 5;
            Weather = class Weather {
                constructor(scene) {
                    this.scene = scene;
                    this.globalTemperature = 7;
                    this.globalMoisture = defaultMoisture;
                    this.ticksPerDay = 120000;
                    this.gameTime = 0;
                    this.weatherType = 'normal';
                    this.wind = Vector2_16.Vector2.zero;
                    this.windTicks = 0;
                    this.temperatureTicks = 0;
                    this.cloudLayer = new Grid_7.Grid(scene.size);
                    this.temperatureLayer = new Grid_7.Grid(scene.size).fillValue(this.globalTemperature);
                    this.moistureLayer = new Grid_7.Grid(scene.size).fillValue(this.globalMoisture);
                }
                update(ticks) {
                    if (!this.scene.debugDisableGameTime) {
                        this.gameTime += ticks;
                    }
                    const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
                    // 0.125 (1/8) so the least amount of sunlight is at 03:00
                    const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
                    this.scene.skyLight.intensity = math_5.clamp(defaultLightIntensityAtNight + Math.round(sunlightPercent * (defaultLightIntensityAtDay - defaultLightIntensityAtNight)), 0, 15);
                    this.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));
                    this.updateWeather(ticks);
                    this.updateTemperature(ticks);
                    this.updateMoisture();
                }
                getWeatherInfoAt(position) {
                    const weatherType = this.getWeatherTypeAt(position) || "normal";
                    const temperature = this.temperatureLayer.at(position) || 0;
                    return { weatherType, temperature };
                }
                changeWeather(weatherType) {
                    const oldWeatherType = this.weatherType;
                    this.weatherType = weatherType;
                    if (oldWeatherType !== this.weatherType) {
                        EventLoop_1.emitEvent(WeatherChangedGameEvent_1.WeatherChangedGameEvent.create(oldWeatherType, this.weatherType));
                    }
                }
                getWeatherTypeAt(position) {
                    const value = this.scene.roofHolesLayer.at(position);
                    const isHole = typeof value === "undefined" || value;
                    if (!isHole && this.weatherType !== "mist" && this.weatherType !== "heavy_mist") {
                        return undefined;
                    }
                    return this.weatherType || undefined;
                }
                updateWeather(ticks) {
                    const defaultWeatherTransparency = WeatherHelper_2.getWeatherSkyTransparency(this.weatherType);
                    this.cloudLayer.fillValue(15 - Math.round(15 * defaultWeatherTransparency) | 0);
                    // TODO: implement random noise clouds.
                    this.windTicks = Object2D_11.Object2D.updateValue(this.windTicks, ticks, 1000, () => {
                        this.updateWeatherWind();
                    });
                }
                updateWeatherWind() {
                    const scene = this.scene;
                    // Push weather particles with wind direction.
                    for (const particle of scene.weatherObject.children) {
                        particle.position.add(this.wind);
                    }
                    // Remove weather particles out of level bounds (+border).
                    for (const particle of scene.weatherObject.children) {
                        if (!scene.windBox.containsPoint(particle.position)) {
                            scene.weatherObject.remove(particle);
                        }
                    }
                    // Push particles with wind direction.
                    for (const particle of scene.particlesObject.children) {
                        particle.position.add(this.wind);
                    }
                    // Remove particles out of level bounds (+border).
                    for (const particle of scene.particlesObject.children) {
                        if (!scene.windBox.containsPoint(particle.position)) {
                            scene.particlesObject.remove(particle);
                        }
                    }
                }
                updateTemperature(ticks) {
                    this.temperatureTicks = Object2D_11.Object2D.updateValue(this.temperatureTicks, ticks, 1000, () => {
                        // TODO: implement cold objects that can cooldown faster.
                        this.updateCoolDown();
                        const objects = [];
                        this.scene.traverse(x => objects.push(x));
                        this.updateHeatUp(objects);
                    });
                }
                updateCoolDown() {
                    this.temperatureLayer.traverse((value, pos, layer) => layer.setAt(pos, value - 1));
                }
                updateHeatUp(objects) {
                    const temperatures = objects.flatMap(x => this.getObjectTemperatures(x));
                    for (const { position, temperature } of temperatures) {
                        this.addEmitter(this.temperatureLayer, position, temperature);
                    }
                    var newTemperatureLayer = new Grid_7.Grid(this.scene.size).fillValue(this.globalTemperature);
                    this.temperatureLayer.traverse((_, position) => {
                        this.meanPoint(this.temperatureLayer, newTemperatureLayer, position);
                    });
                    this.temperatureLayer = newTemperatureLayer;
                    this.temperatureLayer.traverse((v, pos, grid) => {
                        if (v < this.globalTemperature) {
                            grid.setAt(pos, this.globalTemperature);
                        }
                    });
                }
                meanPoint(array, newArray, position, decay = 2) {
                    if (!array.containsPosition(position)) {
                        return;
                    }
                    let maxValue = array.at(position);
                    const [x, y] = position;
                    for (let i = Math.max(0, y - 1); i <= Math.min(array.height - 1, y + 1); i++) {
                        for (let j = Math.max(0, x - 1); j <= Math.min(array.width - 1, x + 1); j++) {
                            const pos = new Vector2_16.Vector2(j, i);
                            if ((i === y || j === x) &&
                                !(i === y && j === x) &&
                                array.at(pos) > maxValue) {
                                maxValue = array.at(pos);
                            }
                        }
                    }
                    const newValue = Math.max(array.at(position), maxValue - decay);
                    newArray.setAt(position, newValue);
                }
                getObjectTemperatures(obj) {
                    const objectTemperatures = obj.physics.temperatures;
                    return objectTemperatures.map(x => ({ ...x, position: obj.position.clone().sub(obj.originPoint).add(x.position) }));
                }
                addEmitter(layer, position, level) {
                    const value = layer.at(position);
                    if (typeof value !== "undefined" &&
                        value < level) {
                        layer.setAt(position, level);
                    }
                }
                updateMoisture() {
                    // TODO: check water tiles.
                }
            };
            exports_52("Weather", Weather);
        }
    };
});
System.register("engine/Level", ["engine/Scene", "engine/math/Vector2", "engine/events/EventLoop", "engine/events/GameEvent", "engine/signaling/SignalProcessor", "engine/math/Box2", "engine/ActionData", "engine/objects/Npc", "engine/objects/special/WeatherParticlesObject", "engine/objects/special/ParticlesObject", "engine/objects/special/TilesObject", "engine/objects/special/BlockedLayerObject", "engine/objects/special/SignalsLayerObject", "engine/objects/special/NumberGridObject", "engine/math/Color", "engine/lights/SkyLight", "engine/lights/Lights", "engine/weather/Weather", "engine/math/Grid"], function (exports_53, context_53) {
    "use strict";
    var Scene_1, Vector2_17, EventLoop_2, GameEvent_2, SignalProcessor_1, Box2_1, ActionData_1, Npc_1, WeatherParticlesObject_1, ParticlesObject_1, TilesObject_1, BlockedLayerObject_1, SignalsLayerObject_1, NumberGridObject_1, Color_5, SkyLight_1, Lights_1, Weather_1, Grid_8, Level;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Vector2_17_1) {
                Vector2_17 = Vector2_17_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            },
            function (SignalProcessor_1_1) {
                SignalProcessor_1 = SignalProcessor_1_1;
            },
            function (Box2_1_1) {
                Box2_1 = Box2_1_1;
            },
            function (ActionData_1_1) {
                ActionData_1 = ActionData_1_1;
            },
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            },
            function (WeatherParticlesObject_1_1) {
                WeatherParticlesObject_1 = WeatherParticlesObject_1_1;
            },
            function (ParticlesObject_1_1) {
                ParticlesObject_1 = ParticlesObject_1_1;
            },
            function (TilesObject_1_1) {
                TilesObject_1 = TilesObject_1_1;
            },
            function (BlockedLayerObject_1_1) {
                BlockedLayerObject_1 = BlockedLayerObject_1_1;
            },
            function (SignalsLayerObject_1_1) {
                SignalsLayerObject_1 = SignalsLayerObject_1_1;
            },
            function (NumberGridObject_1_1) {
                NumberGridObject_1 = NumberGridObject_1_1;
            },
            function (Color_5_1) {
                Color_5 = Color_5_1;
            },
            function (SkyLight_1_1) {
                SkyLight_1 = SkyLight_1_1;
            },
            function (Lights_1_1) {
                Lights_1 = Lights_1_1;
            },
            function (Weather_1_1) {
                Weather_1 = Weather_1_1;
            },
            function (Grid_8_1) {
                Grid_8 = Grid_8_1;
            }
        ],
        execute: function () {
            Level = class Level extends Scene_1.Scene {
                get portals() {
                    const doors = this.children.filter(x => x.type === "door");
                    const map = {};
                    for (const door of doors) {
                        if (!map[door.name]) {
                            map[door.name] = [];
                        }
                        map[door.name].push(door.position);
                    }
                    return map;
                }
                get box() {
                    var _a;
                    return new Box2_1.Box2(Vector2_17.Vector2.zero, (((_a = this.size) === null || _a === void 0 ? void 0 : _a.clone()) || Vector2_17.Vector2.zero).sub(new Vector2_17.Vector2(1, 1)));
                }
                get windBox() {
                    var _a;
                    const margin = (((_a = this.weather.wind) === null || _a === void 0 ? void 0 : _a.clone()) || Vector2_17.Vector2.zero).multiplyScalar(2);
                    return this.box.clone().expandByVector(margin);
                }
                constructor(id, objects, tiles) {
                    super();
                    this.isLevel = true;
                    this._isLoaded = false;
                    this.debugDisableGameTime = false;
                    this.debugTickFreeze = false;
                    this.debugTickStep = 0;
                    this.name = id;
                    this.background = new Color_5.Color(0, 131 / 255, 143 / 255);
                    this.size = tiles.size;
                    this.lights = new Lights_1.Lights(this);
                    this.weather = new Weather_1.Weather(this);
                    this.signalProcessor = new SignalProcessor_1.SignalProcessor(this);
                    this.roofLayer = new Grid_8.Grid(this.size);
                    this.roofHolesLayer = new Grid_8.Grid(this.size);
                    this.tilesObject = new TilesObject_1.TilesObject(tiles);
                    this.add(this.tilesObject);
                    for (const object of objects) {
                        this.add(object);
                    }
                    this.particlesObject = new ParticlesObject_1.ParticlesObject();
                    this.add(this.particlesObject);
                    this.weatherObject = new WeatherParticlesObject_1.WeatherParticlesObject();
                    this.add(this.weatherObject);
                    this.blockedLayerObject = new BlockedLayerObject_1.BlockedLayerObject(this.size);
                    this.blockedLayerObject.visible = false;
                    this.add(this.blockedLayerObject);
                    this.signalsLayerObject = new SignalsLayerObject_1.SignalsLayerObject();
                    this.signalsLayerObject.visible = false;
                    this.add(this.signalsLayerObject);
                    this.temperatureLayerObject = new NumberGridObject_1.NumberGridObject(() => this.weather.temperatureLayer);
                    this.temperatureLayerObject.visible = false;
                    this.add(this.temperatureLayerObject);
                    this.moistureLayerObject = new NumberGridObject_1.NumberGridObject(() => this.weather.moistureLayer);
                    this.moistureLayerObject.visible = false;
                    this.add(this.moistureLayerObject);
                    this.opacityLayerObject = new NumberGridObject_1.NumberGridObject(() => this.lights.opacityLayer.map(v => v > 0 ? (v * 15) | 0 : undefined));
                    this.opacityLayerObject.visible = false;
                    this.add(this.opacityLayerObject);
                    this.skyLight = new SkyLight_1.SkyLight(new Color_5.Color(1, 1, 1), 15);
                    this.add(this.skyLight);
                }
                onLoaded() {
                    if (this._isLoaded) {
                        return;
                    }
                    // Emit initial level events.
                    const level = this;
                    EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "weather_changed", { from: level.weather.weatherType, to: level.weather.weatherType }));
                    EventLoop_2.emitEvent(new GameEvent_2.GameEvent("system", "wind_changed", { from: level.weather.wind, to: level.weather.wind }));
                    this._isLoaded = true;
                }
                update(ticks) {
                    super.update(ticks);
                    this.weather.update(ticks);
                    this.lights.update();
                    if (!this.debugTickFreeze || this.debugTickStep > 0) {
                        this.signalProcessor.update.bind(this.signalProcessor)(this);
                        if (this.debugTickStep > 0) {
                            this.debugTickStep -= 1;
                        }
                    }
                }
                isRoofHoleAt(pos) {
                    let roofHoleVal = this.roofHolesLayer.at(pos);
                    return roofHoleVal || typeof roofHoleVal === "undefined";
                }
                isPositionValid(position) {
                    return this.box.containsPoint(position);
                }
                isPositionBlocked(position) {
                    return this.blockedLayerObject.isPositionBlocked(position);
                }
                getNpcAt(position) {
                    for (let object of this.children) {
                        if (!object.enabled)
                            continue;
                        if (!(object instanceof Npc_1.Npc))
                            continue;
                        //
                        if (object.position.equals(position)) {
                            return object;
                        }
                    }
                    return undefined;
                }
                getActionsAt(cellPosition) {
                    const scene = this;
                    const actions = [];
                    scene.traverseVisible(object => {
                        const objectPos = object.position;
                        const objectOrigin = object.originPoint;
                        const result = cellPosition.clone().sub(objectPos).add(objectOrigin);
                        for (const action of object.actions) {
                            const aPos = action.position;
                            if (aPos.equals(result)) {
                                actions.push(ActionData_1.convertToActionData(object, action));
                            }
                        }
                    });
                    return actions;
                }
            };
            exports_53("Level", Level);
        }
    };
});
System.register("engine/objects/Npc", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Equipment", "engine/objects/NpcMovementOptions", "engine/math/Vector2"], function (exports_54, context_54) {
    "use strict";
    var Object2D_12, ObjectSkin_8, ObjectPhysics_4, EventLoop_3, GameEvent_3, Equipment_1, NpcMovementOptions_1, Vector2_18, Npc;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [
            function (Object2D_12_1) {
                Object2D_12 = Object2D_12_1;
            },
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (Equipment_1_1) {
                Equipment_1 = Equipment_1_1;
            },
            function (NpcMovementOptions_1_1) {
                NpcMovementOptions_1 = NpcMovementOptions_1_1;
            },
            function (Vector2_18_1) {
                Vector2_18 = Vector2_18_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends Object2D_12.Object2D {
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
                constructor(skin = new ObjectSkin_8.ObjectSkin(), position = Vector2_18.Vector2.zero, originPoint = Vector2_18.Vector2.zero) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics().collision(), position);
                    // TODO: use object rotation.
                    this._direction = new Vector2_18.Vector2(0, 1);
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
                update(ticks) {
                    super.update(ticks);
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
                    const nextPos = obj.cursorPosition;
                    const tile = obj.scene.tilesObject.getTileAt(nextPos);
                    obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);
                    const moveSpeed = this.calculateMoveSpeed(tile);
                    const moveSpeedPenalty = obj.moveSpeedPenalty;
                    const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
                    if (resultSpeed <= 0) {
                        return;
                    }
                    if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
                        if (obj.realm === "ground") {
                            const tile = (_a = this.scene) === null || _a === void 0 ? void 0 : _a.tilesObject.getTileAt(obj.position);
                            tile === null || tile === void 0 ? void 0 : tile.addDisturbance();
                        }
                        // Assign to trigger property.
                        obj.position = obj.position.add(obj.direction);
                        if (obj.realm === "ground") {
                            const tile = (_b = this.scene) === null || _b === void 0 ? void 0 : _b.tilesObject.getTileAt(obj.position);
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
                }
                attack(target) {
                    if (this.attackTick > 1000 / this.attackSpeed) {
                        this.attackTick = 0;
                        EventLoop_3.emitEvent(new GameEvent_3.GameEvent(this, "attack", {
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
                        EventLoop_3.emitEvent(new GameEvent_3.GameEvent(ev.args.object, "damage", Object.create(ev.args)));
                        if (this.health <= 0) {
                            this.enabled = false;
                            EventLoop_3.emitEvent(new GameEvent_3.GameEvent(this, "death", { object: this, cause: { type: "attacked", by: ev.args.object } }));
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
                        const directions = Vector2_18.Vector2.directions;
                        const randomIndex = Math.random() * directions.length | 0;
                        this.direction = directions[randomIndex];
                    }
                }
                getFreeDirections() {
                    // Detect all possible free positions.
                    const directions = Vector2_18.Vector2.directions
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
                    for (const object of scene.children) {
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
                    for (const object of scene.children) {
                        if (!object.enabled)
                            continue;
                        if (object === this)
                            continue; // self check
                        if (object instanceof Object2D_12.Object2D && callback(object)) {
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
            exports_54("Npc", Npc);
        }
    };
});
System.register("engine/objects/Inventory", [], function (exports_55, context_55) {
    "use strict";
    var Inventory;
    var __moduleName = context_55 && context_55.id;
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
            exports_55("Inventory", Inventory);
        }
    };
});
System.register("engine/graphics/Layers", [], function (exports_56, context_56) {
    "use strict";
    var Layers;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [],
        execute: function () {
            exports_56("Layers", Layers = ["objects", "particles", "ui"]);
        }
    };
});
System.register("engine/objects/Object2D", ["engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/objects/Inventory", "engine/math/Vector2"], function (exports_57, context_57) {
    "use strict";
    var ObjectSkin_9, ObjectPhysics_5, Inventory_1, Vector2_19, Object2D;
    var __moduleName = context_57 && context_57.id;
    return {
        setters: [
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            },
            function (Inventory_1_1) {
                Inventory_1 = Inventory_1_1;
            },
            function (Vector2_19_1) {
                Vector2_19 = Vector2_19_1;
            }
        ],
        execute: function () {
            Object2D = class Object2D {
                get scene() {
                    let level = undefined;
                    this.traverseAncestors(x => {
                        if (x && "isLevel" in x) {
                            level = x;
                        }
                    });
                    return level;
                }
                get position() {
                    var _a, _b, _c;
                    return (((_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.position) === null || _b === void 0 ? void 0 : _b.clone()) || Vector2_19.Vector2.zero)
                        .add(this._position.clone().rotate(((_c = this.parent) === null || _c === void 0 ? void 0 : _c.rotation) || 0));
                }
                set position(value) {
                    if (!this._position.equals(value)) {
                        this._position = value.clone();
                    }
                }
                get rotation() {
                    var _a;
                    return (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.rotation) || 0) + this._rotation;
                }
                constructor(originPoint = new Vector2_19.Vector2(), skin = new ObjectSkin_9.ObjectSkin(), physics = new ObjectPhysics_5.ObjectPhysics(), _position = new Vector2_19.Vector2()) {
                    this.originPoint = originPoint;
                    this.skin = skin;
                    this.physics = physics;
                    this._position = _position;
                    this.parent = null;
                    this.children = [];
                    this.name = "";
                    this.type = "<undefined_item>";
                    this.enabled = true;
                    this.visible = true;
                    this.layer = "objects";
                    this.renderOrder = 0;
                    this._rotation = 0;
                    this.highlighted = false;
                    this.highlighColor = '#0ff';
                    this.important = false;
                    this.parameters = {};
                    this.actions = [];
                    this.inventory = new Inventory_1.Inventory();
                    this.realm = "ground";
                    this.ticks = 0;
                }
                translateX(x) {
                    this._position.x += x;
                    return this;
                }
                translateY(y) {
                    this._position.y += y;
                    return this;
                }
                // TODO: fix signal processors not updating their skin on rotate when tick is frozen.
                rotate(rotation = 1) {
                    this._rotation = this._rotation + rotation;
                    return this;
                }
                add(object) {
                    if (object === this) {
                        throw new Error("Can not add an object to itself.");
                    }
                    if (object.parent != null) {
                        object.parent.remove(object);
                    }
                    object.parent = this;
                    this.children.push(object);
                    return this;
                }
                remove(object) {
                    const index = this.children.indexOf(object);
                    if (index !== -1) {
                        object.parent = null;
                        this.children.splice(index, 1);
                    }
                }
                removeFromParent() {
                    const parent = this.parent;
                    if (parent !== null) {
                        parent.remove(this);
                    }
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
                        const position = options.position || Vector2_19.Vector2.zero;
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
                update(ticks) {
                    this.ticks += ticks;
                    for (const object of this.children) {
                        if (!object.enabled) {
                            continue;
                        }
                        object.update(ticks);
                    }
                }
                traverse(callback) {
                    if (this.enabled === false) {
                        return;
                    }
                    callback(this);
                    const children = this.children;
                    for (let i = 0, length = children.length; i < length; i++) {
                        children[i].traverseVisible(callback);
                    }
                }
                traverseVisible(callback) {
                    if (this.enabled === false || this.visible === false) {
                        return;
                    }
                    callback(this);
                    const children = this.children;
                    for (let i = 0, length = children.length; i < length; i++) {
                        children[i].traverseVisible(callback);
                    }
                }
                traverseAncestors(callback) {
                    const parent = this.parent;
                    if (!parent) {
                        return;
                    }
                    callback(parent);
                    parent.traverseAncestors(callback);
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
            exports_57("Object2D", Object2D);
        }
    };
});
System.register("engine/Scene", ["engine/objects/Object2D"], function (exports_58, context_58) {
    "use strict";
    var Object2D_13, Scene;
    var __moduleName = context_58 && context_58.id;
    return {
        setters: [
            function (Object2D_13_1) {
                Object2D_13 = Object2D_13_1;
            }
        ],
        execute: function () {
            Scene = class Scene extends Object2D_13.Object2D {
                constructor() {
                    super();
                    this.isScene = true;
                    this.background = undefined;
                }
            };
            exports_58("Scene", Scene);
        }
    };
});
System.register("engine/cameras/Camera", ["engine/math/Box2", "engine/math/Vector2"], function (exports_59, context_59) {
    "use strict";
    var Box2_2, Vector2_20, followOffset, Camera;
    var __moduleName = context_59 && context_59.id;
    return {
        setters: [
            function (Box2_2_1) {
                Box2_2 = Box2_2_1;
            },
            function (Vector2_20_1) {
                Vector2_20 = Vector2_20_1;
            }
        ],
        execute: function () {
            exports_59("followOffset", followOffset = 4);
            Camera = class Camera {
                constructor() {
                    this.position = Vector2_20.Vector2.zero;
                    this.size = new Vector2_20.Vector2(20, 20);
                }
                get box() {
                    return new Box2_2.Box2(this.position.clone(), this.position.clone().add(this.size));
                }
                update() {
                }
            };
            exports_59("Camera", Camera);
        }
    };
});
System.register("UI", ["engine/Scene"], function (exports_60, context_60) {
    "use strict";
    var Scene_2, UI;
    var __moduleName = context_60 && context_60.id;
    return {
        setters: [
            function (Scene_2_1) {
                Scene_2 = Scene_2_1;
            }
        ],
        execute: function () {
            UI = class UI extends Scene_2.Scene {
                constructor(camera) {
                    super();
                    this.camera = camera;
                }
                update(ticks) {
                    super.update(ticks);
                    this.position = this.camera.position.clone();
                }
            };
            exports_60("UI", UI);
        }
    };
});
System.register("controls", [], function (exports_61, context_61) {
    "use strict";
    var Controls;
    var __moduleName = context_61 && context_61.id;
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
    exports_61("enableGameInput", enableGameInput);
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
            exports_61("Controls", Controls = {
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
System.register("engine/graphics/cellStyle", ["engine/math/Vector2"], function (exports_62, context_62) {
    "use strict";
    var Vector2_21, cellStyle;
    var __moduleName = context_62 && context_62.id;
    return {
        setters: [
            function (Vector2_21_1) {
                Vector2_21 = Vector2_21_1;
            }
        ],
        execute: function () {
            exports_62("cellStyle", cellStyle = {
                borderColor: "#1114",
                borderWidth: 1,
                default: {
                    textColor: '#fff',
                    backgroundColor: '#335'
                },
                size: new Vector2_21.Vector2(32, 32),
                charSize: 26,
            });
        }
    };
});
System.register("engine/graphics/CellInfo", [], function (exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/graphics/CanvasContext", ["main", "engine/math/Color", "engine/math/Grid", "engine/math/Rotation", "engine/graphics/cellStyle"], function (exports_64, context_64) {
    "use strict";
    var main_1, Color_6, Grid_9, Rotation_3, cellStyle_1, CanvasContext;
    var __moduleName = context_64 && context_64.id;
    return {
        setters: [
            function (main_1_1) {
                main_1 = main_1_1;
            },
            function (Color_6_1) {
                Color_6 = Color_6_1;
            },
            function (Grid_9_1) {
                Grid_9 = Grid_9_1;
            },
            function (Rotation_3_1) {
                Rotation_3 = Rotation_3_1;
            },
            function (cellStyle_1_1) {
                cellStyle_1 = cellStyle_1_1;
            }
        ],
        execute: function () {
            // TODO: remove this and draw in GraphicsEngine.
            CanvasContext = class CanvasContext {
                constructor(canvas) {
                    this.canvas = canvas;
                    this.buffer = document.createElement("canvas");
                    this.buffer.width = canvas.width;
                    this.buffer.height = canvas.height;
                    this.objectsBuffer = this.createBuffer();
                    this.weatherBuffer = this.createBuffer();
                    this.shadowMaskBuffer = this.createBuffer();
                    this.lightColorBuffer = this.createBuffer();
                    this.uiBuffer = this.createBuffer();
                }
                beginDraw(background, size) {
                    this.background = background;
                    this.size = size;
                    this.objects = new Grid_9.Grid(size).fill(() => []);
                    this.particles = new Grid_9.Grid(size).fill(() => []);
                    this.ui = new Grid_9.Grid(size).fill(() => []);
                }
                createBuffer() {
                    const buffer = document.createElement("canvas");
                    buffer.width = this.canvas.width;
                    buffer.height = this.canvas.height;
                    return buffer;
                }
                add(layerName, position, cellInfo) {
                    if (layerName === "objects") {
                        this.objects.at(position).push(...cellInfo);
                    }
                    else if (layerName === "particles") {
                        this.particles.at(position).push(...cellInfo);
                    }
                    else if (layerName === "ui") {
                        this.ui.at(position).push(...cellInfo);
                    }
                }
                setLights(lights) {
                    this.lights = lights;
                }
                endDraw() {
                    var _a;
                    this._context = this.buffer.getContext("2d");
                    this._objectsContext = this.objectsBuffer.getContext("2d");
                    this._particlesContext = this.weatherBuffer.getContext("2d");
                    this._shadowMaskContext = this.shadowMaskBuffer.getContext("2d");
                    this._lightColorContext = this.lightColorBuffer.getContext("2d");
                    this._uiContext = this.uiBuffer.getContext("2d");
                    this._context.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._objectsContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._particlesContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._shadowMaskContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._lightColorContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this._uiContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    this.objects.traverse((objectCells, pos) => {
                        for (const c of objectCells) {
                            this.drawCellInfoOn(this._objectsContext, pos, c);
                        }
                    });
                    this.particles.traverse((particleCells, pos) => {
                        for (const c of particleCells) {
                            this.drawCellInfoOn(this._particlesContext, pos, c);
                        }
                    });
                    this.lights.traverse((v, pos) => {
                        const pixelPos = main_1.canvasPosition.clone().add(pos.clone().multiply(cellStyle_1.cellStyle.size));
                        // Draw light colors.
                        this._lightColorContext.fillStyle = v === null || v === void 0 ? void 0 : v.color.getStyle();
                        this._lightColorContext.fillRect(pixelPos.x, pixelPos.y, cellStyle_1.cellStyle.size.width, cellStyle_1.cellStyle.size.height);
                        // Draw shadows mask.
                        const intensity = ((v === null || v === void 0 ? void 0 : v.intensity) || 0) / 15;
                        this._shadowMaskContext.fillStyle = new Color_6.Color(intensity, intensity, intensity).getStyle();
                        this._shadowMaskContext.fillRect(pixelPos.x, pixelPos.y, cellStyle_1.cellStyle.size.width, cellStyle_1.cellStyle.size.height);
                    });
                    this.ui.traverse((uiCells, pos) => {
                        for (const c of uiCells) {
                            this.drawCellInfoOn(this._uiContext, pos, c);
                        }
                    });
                    const ctx = this._context;
                    // TODO: add physical material reflectiveness. Try with black reflective tiles. 
                    if (this.background) {
                        ctx.fillStyle = this.background.getStyle();
                        ctx.fillRect(main_1.canvasPosition.x, main_1.canvasPosition.y, this.size.width * cellStyle_1.cellStyle.size.width, this.size.height * cellStyle_1.cellStyle.size.height);
                    }
                    ctx.globalCompositeOperation = "source-over"; // multiply | overlay | luminosity
                    ctx.drawImage(this.objectsBuffer, 0, 0);
                    ctx.drawImage(this.weatherBuffer, 0, 0);
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(this.shadowMaskBuffer, 0, 0);
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(this.lightColorBuffer, 0, 0);
                    ctx.globalCompositeOperation = "source-over";
                    ctx.drawImage(this.uiBuffer, 0, 0);
                    (_a = this.canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(this.buffer, 0, 0);
                }
                drawCellInfoOn(ctx, cellPos, cellInfo) {
                    const cellDrawPosition = main_1.canvasPosition.clone()
                        .add(cellPos.clone().multiply(cellStyle_1.cellStyle.size))
                        .add(cellStyle_1.cellStyle.size.clone().multiply(cellInfo.cell.options.miniCellPosition));
                    const cellDrawSize = cellStyle_1.cellStyle.size.clone().multiplyScalar(cellInfo.cell.options.scale);
                    const fontSize = Math.max(3, (cellStyle_1.cellStyle.charSize * cellInfo.cell.options.scale) | 0);
                    //
                    ctx.globalAlpha = cellInfo.extraOpacity;
                    ctx.fillStyle = cellInfo.cell.backgroundColor;
                    ctx.fillRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
                    ctx.font = (cellInfo.cell.options.bold ? "bold " : "") + `${fontSize}px monospace`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = cellInfo.cell.textColor;
                    ctx.fillText(cellInfo.cell.character, cellDrawPosition.x + cellDrawSize.width / 2, cellDrawPosition.y + cellDrawSize.height / 2 + 2);
                    if (cellStyle_1.cellStyle.borderWidth > 0) {
                        ctx.strokeStyle = cellStyle_1.cellStyle.borderColor;
                        ctx.lineWidth = cellStyle_1.cellStyle.borderWidth;
                        ctx.strokeRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
                    }
                    drawCellBorders();
                    function drawCellBorders() {
                        const borderWidth = 2;
                        ctx.lineWidth = borderWidth;
                        ctx.globalAlpha = cellInfo.extraOpacity ? 0.3 : 0.6;
                        const [rightBorder, bottomBorder, leftBorder, topBorder] = Rotation_3.Rotations.all.map(x => { var _a; return cellInfo.extraBorder[x] || ((_a = cellInfo.cell.options.border) === null || _a === void 0 ? void 0 : _a[x]); });
                        if (topBorder) {
                            ctx.strokeStyle = topBorder;
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, cellDrawSize.width - 2, 0);
                        }
                        if (rightBorder) {
                            ctx.strokeStyle = rightBorder;
                            ctx.strokeRect(cellDrawPosition.x + cellDrawSize.width - 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
                        }
                        if (bottomBorder) {
                            ctx.strokeStyle = bottomBorder;
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + cellDrawSize.height - 1, cellDrawSize.width - 2, 0);
                        }
                        if (leftBorder) {
                            ctx.strokeStyle = leftBorder;
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
                        }
                    }
                }
            };
            exports_64("CanvasContext", CanvasContext);
        }
    };
});
System.register("world/behaviors/WanderingBehavior", [], function (exports_65, context_65) {
    "use strict";
    var WanderingBehavior;
    var __moduleName = context_65 && context_65.id;
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
            exports_65("WanderingBehavior", WanderingBehavior);
        }
    };
});
System.register("world/events/MountGameEvent", ["engine/events/GameEvent"], function (exports_66, context_66) {
    "use strict";
    var GameEvent_4, MountGameEvent;
    var __moduleName = context_66 && context_66.id;
    return {
        setters: [
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            }
        ],
        execute: function () {
            (function (MountGameEvent) {
                MountGameEvent.type = "mount";
                class Args {
                }
                MountGameEvent.Args = Args;
                function create(mounter, mount, newState) {
                    return new GameEvent_4.GameEvent(mounter, MountGameEvent.type, {
                        mounter,
                        mount,
                        newState,
                    });
                }
                MountGameEvent.create = create;
            })(MountGameEvent || (exports_66("MountGameEvent", MountGameEvent = {})));
        }
    };
});
System.register("world/events/RemoveObjectGameEvent", ["engine/events/GameEvent"], function (exports_67, context_67) {
    "use strict";
    var GameEvent_5, RemoveObjectGameEvent;
    var __moduleName = context_67 && context_67.id;
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
            })(RemoveObjectGameEvent || (exports_67("RemoveObjectGameEvent", RemoveObjectGameEvent = {})));
        }
    };
});
System.register("world/events/AddObjectGameEvent", ["engine/events/GameEvent"], function (exports_68, context_68) {
    "use strict";
    var GameEvent_6, AddObjectGameEvent;
    var __moduleName = context_68 && context_68.id;
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
            })(AddObjectGameEvent || (exports_68("AddObjectGameEvent", AddObjectGameEvent = {})));
        }
    };
});
System.register("world/behaviors/MountBehavior", ["world/behaviors/WanderingBehavior", "engine/events/EventLoop", "world/events/MountGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent", "engine/math/Vector2"], function (exports_69, context_69) {
    "use strict";
    var WanderingBehavior_1, EventLoop_4, MountGameEvent_1, RemoveObjectGameEvent_1, AddObjectGameEvent_1, Vector2_22, MountBehavior;
    var __moduleName = context_69 && context_69.id;
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
            function (RemoveObjectGameEvent_1_1) {
                RemoveObjectGameEvent_1 = RemoveObjectGameEvent_1_1;
            },
            function (AddObjectGameEvent_1_1) {
                AddObjectGameEvent_1 = AddObjectGameEvent_1_1;
            },
            function (Vector2_22_1) {
                Vector2_22 = Vector2_22_1;
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
                    mounter.add(this.mountObject);
                    // Update mount to have position relative to the mounter.
                    mounter.mount.position = Vector2_22.Vector2.zero;
                    // Move mounter on top of the mount.
                    mounter.position = mounter.cursorPosition.clone();
                    // Remove mount from the scene.
                    EventLoop_4.emitEvent(RemoveObjectGameEvent_1.RemoveObjectGameEvent.create(this.mountObject));
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
                    mount.removeFromParent();
                    // Move mount to the mounter position.
                    mount.position = mounter.position.clone();
                    // Add mount back to the scene.
                    EventLoop_4.emitEvent(AddObjectGameEvent_1.AddObjectGameEvent.create(mount));
                    // Move mounter forward.
                    mounter.position = mounter.cursorPosition.clone();
                    EventLoop_4.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "unmounted"));
                }
            };
            exports_69("MountBehavior", MountBehavior);
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/behaviors/MountBehavior", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Npc", "engine/math/Vector2"], function (exports_70, context_70) {
    "use strict";
    var Item_1, ObjectSkin_10, ObjectPhysics_6, MountBehavior_1, EventLoop_5, GameEvent_7, Npc_2, Vector2_23, lamp, SwordItem, sword, victoryItem, bambooSeed, honeyPot, seaShell, glasses, Saddle, saddle;
    var __moduleName = context_70 && context_70.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (MountBehavior_1_1) {
                MountBehavior_1 = MountBehavior_1_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
            },
            function (GameEvent_7_1) {
                GameEvent_7 = GameEvent_7_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            },
            function (Vector2_23_1) {
                Vector2_23 = Vector2_23_1;
            }
        ],
        execute: function () {
            exports_70("lamp", lamp = () => {
                const item = Item_1.Item.create("lamp", new ObjectSkin_10.ObjectSkin().char(`🏮`), new ObjectPhysics_6.ObjectPhysics().light('f').temperature('a'));
                return item;
            });
            SwordItem = class SwordItem extends Item_1.Item {
                constructor() {
                    super(Vector2_23.Vector2.zero, new ObjectSkin_10.ObjectSkin().char(`🗡`));
                    this.type = "sword";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            EventLoop_5.emitEvent(new GameEvent_7.GameEvent(ctx.initiator, 'attack', {
                                object: ctx.initiator,
                                subject: ctx.subject,
                            }));
                        }
                    });
                }
            };
            exports_70("SwordItem", SwordItem);
            exports_70("sword", sword = () => new SwordItem());
            exports_70("victoryItem", victoryItem = () => Item_1.Item.create("victory_item", new ObjectSkin_10.ObjectSkin().char(`W`)));
            exports_70("bambooSeed", bambooSeed = () => Item_1.Item.create("bamboo_seed", new ObjectSkin_10.ObjectSkin().char(`▄`).color('#99bc20')));
            exports_70("honeyPot", honeyPot = () => Item_1.Item.create("honey_pot", new ObjectSkin_10.ObjectSkin().char(`🍯`)));
            // TODO: reveals invisible underwater chests.
            exports_70("seaShell", seaShell = () => Item_1.Item.create("sea_shell", new ObjectSkin_10.ObjectSkin().char(`🐚`)));
            exports_70("glasses", glasses = () => Item_1.Item.create("glasses", new ObjectSkin_10.ObjectSkin().char(`👓`)));
            Saddle = class Saddle extends Item_1.Item {
                constructor() {
                    super(Vector2_23.Vector2.zero, new ObjectSkin_10.ObjectSkin().char(`🐾`).color('#99bc20'));
                    this.type = "saddle";
                    this.setUsage(ctx => {
                        if (ctx.initiator.mount) {
                            const mountBeh = ctx.initiator.mount.behaviors.find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.unmount();
                            }
                        }
                        else if (ctx.subject instanceof Npc_2.Npc) {
                            const mountBeh = ctx.subject.behaviors.find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.mount(ctx.initiator);
                            }
                        }
                    });
                }
            };
            exports_70("Saddle", Saddle);
            exports_70("saddle", saddle = () => new Saddle());
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items", "engine/objects/NpcMovementOptions"], function (exports_71, context_71) {
    "use strict";
    var Npc_3, ObjectSkin_11, items_1, NpcMovementOptions_2, hero;
    var __moduleName = context_71 && context_71.id;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            },
            function (NpcMovementOptions_2_1) {
                NpcMovementOptions_2 = NpcMovementOptions_2_1;
            }
        ],
        execute: function () {
            exports_71("hero", hero = new class extends Npc_3.Npc {
                constructor() {
                    super(new ObjectSkin_11.ObjectSkin().char('🐱'));
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
                update(ticks) {
                    super.update(ticks);
                    //
                    const obj = this;
                    obj.moveTick += ticks;
                }
            });
        }
    };
});
System.register("ui/UIElement", ["engine/objects/Object2D"], function (exports_72, context_72) {
    "use strict";
    var Object2D_14, UIElement;
    var __moduleName = context_72 && context_72.id;
    return {
        setters: [
            function (Object2D_14_1) {
                Object2D_14 = Object2D_14_1;
            }
        ],
        execute: function () {
            UIElement = class UIElement extends Object2D_14.Object2D {
                constructor(parent) {
                    super();
                    this.layer = "ui";
                    parent === null || parent === void 0 ? void 0 : parent.add(this);
                }
            };
            exports_72("UIElement", UIElement);
        }
    };
});
System.register("ui/UIPanel", ["engine/graphics/Cell", "ui/UIElement", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_73, context_73) {
    "use strict";
    var Cell_6, UIElement_1, ObjectSkin_12, Grid_10, UIPanel;
    var __moduleName = context_73 && context_73.id;
    return {
        setters: [
            function (Cell_6_1) {
                Cell_6 = Cell_6_1;
            },
            function (UIElement_1_1) {
                UIElement_1 = UIElement_1_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (Grid_10_1) {
                Grid_10 = Grid_10_1;
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
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createBackgroundAndBorders();
                }
                createBackgroundAndBorders() {
                    return new ObjectSkin_12.ObjectSkin(new Grid_10.Grid(this.size).fill(v => this.getCell(v)));
                }
                getCell([x, y]) {
                    if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
                        return new Cell_6.Cell(' ', 'black', this.borderColor);
                    }
                    else {
                        return new Cell_6.Cell(' ', 'white', this.backgroundColor);
                    }
                }
            };
            exports_73("UIPanel", UIPanel);
        }
    };
});
System.register("ui/UISceneObject", ["ui/UIElement"], function (exports_74, context_74) {
    "use strict";
    var UIElement_2, UISceneObject;
    var __moduleName = context_74 && context_74.id;
    return {
        setters: [
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
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.sceneObject.skin;
                }
            };
            exports_74("UISceneObject", UISceneObject);
        }
    };
});
System.register("ui/HealthBarUi", ["engine/graphics/Cell", "ui/UIElement", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_75, context_75) {
    "use strict";
    var Cell_7, UIElement_3, ObjectSkin_13, Grid_11, HealthBarUi;
    var __moduleName = context_75 && context_75.id;
    return {
        setters: [
            function (Cell_7_1) {
                Cell_7 = Cell_7_1;
            },
            function (UIElement_3_1) {
                UIElement_3 = UIElement_3_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (Grid_11_1) {
                Grid_11 = Grid_11_1;
            }
        ],
        execute: function () {
            HealthBarUi = class HealthBarUi extends UIElement_3.UIElement {
                constructor(parent, npc) {
                    super(parent);
                    this.npc = npc;
                    this.skin = this.createSkin(this.npc);
                }
                update(ticks) {
                    this.skin = this.createSkin(this.npc);
                }
                createSkin(npc) {
                    const cells = [];
                    for (let i = 0; i < npc.maxHealth; i++) {
                        const heartCell = new Cell_7.Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
                        cells.push(heartCell);
                    }
                    return new ObjectSkin_13.ObjectSkin(Grid_11.Grid.from([cells]));
                }
            };
            exports_75("HealthBarUi", HealthBarUi);
        }
    };
});
System.register("ui/UIObjectSkin", ["ui/UIElement"], function (exports_76, context_76) {
    "use strict";
    var UIElement_4, UIObjectSkin;
    var __moduleName = context_76 && context_76.id;
    return {
        setters: [
            function (UIElement_4_1) {
                UIElement_4 = UIElement_4_1;
            }
        ],
        execute: function () {
            UIObjectSkin = class UIObjectSkin extends UIElement_4.UIElement {
                constructor(parent, skin) {
                    super(parent);
                    this.skin = skin;
                }
            };
            exports_76("UIObjectSkin", UIObjectSkin);
        }
    };
});
System.register("ui/playerUi", ["engine/objects/Npc", "engine/ActionData", "ui/UIPanel", "ui/UIElement", "ui/UISceneObject", "ui/HealthBarUi", "engine/math/Vector2", "engine/components/ObjectSkin", "ui/UIObjectSkin", "engine/math/Grid"], function (exports_77, context_77) {
    "use strict";
    var Npc_4, ActionData_2, UIPanel_1, UIElement_5, UISceneObject_1, HealthBarUi_1, Vector2_24, ObjectSkin_14, UIObjectSkin_1, Grid_12, PlayerUi;
    var __moduleName = context_77 && context_77.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ActionData_2_1) {
                ActionData_2 = ActionData_2_1;
            },
            function (UIPanel_1_1) {
                UIPanel_1 = UIPanel_1_1;
            },
            function (UIElement_5_1) {
                UIElement_5 = UIElement_5_1;
            },
            function (UISceneObject_1_1) {
                UISceneObject_1 = UISceneObject_1_1;
            },
            function (HealthBarUi_1_1) {
                HealthBarUi_1 = HealthBarUi_1_1;
            },
            function (Vector2_24_1) {
                Vector2_24 = Vector2_24_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (UIObjectSkin_1_1) {
                UIObjectSkin_1 = UIObjectSkin_1_1;
            },
            function (Grid_12_1) {
                Grid_12 = Grid_12_1;
            }
        ],
        execute: function () {
            PlayerUi = class PlayerUi extends UIElement_5.UIElement {
                constructor(npc, camera) {
                    super(null);
                    this.npc = npc;
                    this.camera = camera;
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    this.objectUnderCursorSprite = null;
                    this.actionUnderCursorSprite = null;
                    this.objectUnderCursorHealthBar = null;
                    this.panel = new UIPanel_1.UIPanel(this, Vector2_24.Vector2.zero, new Vector2_24.Vector2(camera.size.width, 1));
                    this.panel.borderColor = '#000a';
                    this.heroSprite = new UISceneObject_1.UISceneObject(this, npc);
                    this.heroSprite.position = Vector2_24.Vector2.zero;
                    this.heroHealthBar = new HealthBarUi_1.HealthBarUi(this, npc);
                    this.heroHealthBar.position = new Vector2_24.Vector2(1, 0);
                }
                getNpcUnderCursor(scene) {
                    const npcObjects = scene.children
                        .filter(x => x.enabled && x instanceof Npc_4.Npc)
                        .map(x => x);
                    for (let o of npcObjects) {
                        if (o.position.equals(this.npc.cursorPosition)) {
                            return o;
                        }
                    }
                    return undefined;
                }
                update(ticks) {
                    super.update(ticks);
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    const right = this.camera.size.width - 1;
                    if (this.npc.scene) {
                        const npcUnderCursor = this.getNpcUnderCursor(this.npc.scene);
                        if (npcUnderCursor) {
                            if (npcUnderCursor !== this.objectUnderCursor) {
                                npcUnderCursor.highlighted = true;
                                this.objectUnderCursor = npcUnderCursor;
                                this.remove(this.objectUnderCursorSprite);
                                this.remove(this.objectUnderCursorHealthBar);
                                // TODO: this is re-created each tick, so they are not updated.
                                this.objectUnderCursorHealthBar = new HealthBarUi_1.HealthBarUi(this, npcUnderCursor);
                                this.objectUnderCursorHealthBar.position = new Vector2_24.Vector2(right - npcUnderCursor.maxHealth, 0);
                                this.objectUnderCursorSprite = new UIObjectSkin_1.UIObjectSkin(this, npcUnderCursor.skin);
                                this.objectUnderCursorSprite.position = new Vector2_24.Vector2(right, 0);
                            }
                        }
                        else {
                            this.remove(this.objectUnderCursorSprite);
                            this.remove(this.objectUnderCursorHealthBar);
                            this.objectUnderCursorSprite = null;
                            this.objectUnderCursorHealthBar = null;
                        }
                    }
                    const actionData = ActionData_2.getNpcInteraction(this.npc);
                    if (actionData) {
                        actionData.object.highlighted = true;
                        this.actionUnderCursor = new ObjectSkin_14.ObjectSkin(Grid_12.Grid.from([actionData.actionIcon]));
                        this.remove(this.actionUnderCursorSprite);
                        this.actionUnderCursorSprite = new UIObjectSkin_1.UIObjectSkin(this, this.actionUnderCursor);
                        this.actionUnderCursorSprite.position = new Vector2_24.Vector2(right, 0);
                    }
                    else {
                        this.remove(this.actionUnderCursorSprite);
                        this.actionUnderCursorSprite = null;
                    }
                }
            };
            exports_77("PlayerUi", PlayerUi);
        }
    };
});
System.register("engine/data/ObjectPhysicsBuilder", ["utils/math", "engine/math/Color", "engine/math/Vector2", "engine/components/ObjectPhysics"], function (exports_78, context_78) {
    "use strict";
    var math_6, Color_7, Vector2_25, ObjectPhysics_7, ObjectPhysicsBuilder;
    var __moduleName = context_78 && context_78.id;
    return {
        setters: [
            function (math_6_1) {
                math_6 = math_6_1;
            },
            function (Color_7_1) {
                Color_7 = Color_7_1;
            },
            function (Vector2_25_1) {
                Vector2_25 = Vector2_25_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            }
        ],
        execute: function () {
            ObjectPhysicsBuilder = class ObjectPhysicsBuilder {
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '', opacityMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                    this.temperatures = temperatureMask.split('\n');
                    this.opacity = opacityMask !== ''
                        ? opacityMask.split('\n')
                        : this.collisions.map(line => line.split('').map(x => x === '.' ? 'F' : '0').join(''));
                }
                build() {
                    const pipeline = [
                        this.setMaterials,
                        this.setTemperatures,
                        this.setLights,
                        this.setCollisions,
                    ];
                    const physics = pipeline
                        .map(x => x.bind(this))
                        .reduce((a, x) => a = x(a), new ObjectPhysics_7.ObjectPhysics());
                    return physics;
                }
                setMaterials(physics) {
                    for (const [top, string] of this.opacity.entries()) {
                        for (const [left, char] of string.split('').entries()) {
                            if (!char) {
                                continue;
                            }
                            const opacity = math_6.clamp(Number.parseInt(char, 16) / 15, 0, 1);
                            const position = new Vector2_25.Vector2(left, top);
                            physics.material({ position, opacity });
                        }
                    }
                    return physics;
                }
                setTemperatures(physics) {
                    for (const [top, string] of this.temperatures.entries()) {
                        for (const [left, char] of string.split('').entries()) {
                            if (char === '') {
                                continue;
                            }
                            const temperature = Number.parseInt(char, 16);
                            const position = new Vector2_25.Vector2(left, top);
                            physics.temperature({ position, temperature });
                        }
                    }
                    return physics;
                }
                setLights(physics) {
                    for (const [top, string] of this.lights.entries()) {
                        for (let [left, char] of string.split('').entries()) {
                            if (char === '') {
                                continue;
                            }
                            const light = this.getLight(char);
                            if (light.intensity === 0) {
                                continue;
                            }
                            const position = new Vector2_25.Vector2(left, top);
                            physics.light({ position: position, color: light.color, intensity: light.intensity });
                        }
                    }
                    return physics;
                }
                setCollisions(physics) {
                    for (let y = 0; y < this.collisions.length; y++) {
                        for (let x = 0; x < this.collisions[y].length; x++) {
                            if ((this.collisions[y][x] || ' ') === ' ') {
                                continue;
                            }
                            const cellPos = new Vector2_25.Vector2(x, y);
                            physics.collision(cellPos);
                        }
                    }
                    return physics;
                }
                getLight(char) {
                    let color = new Color_7.Color(1, 1, 1);
                    const intensity = Number.parseInt(char, 16);
                    return { color, intensity };
                }
            };
            exports_78("ObjectPhysicsBuilder", ObjectPhysicsBuilder);
        }
    };
});
System.register("world/objects/house", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/data/ObjectSkinBuilder", "engine/data/ObjectPhysicsBuilder", "engine/math/Vector2", "engine/components/ObjectPhysics"], function (exports_79, context_79) {
    "use strict";
    var Object2D_15, ObjectSkin_15, ObjectSkinBuilder_2, ObjectPhysicsBuilder_1, Vector2_26, ObjectPhysics_8, windowHorizontalSkin, wallSkin, physicsUnitBlockedTransparent, physicsUnitBlocked, windowHorizontal, wall;
    var __moduleName = context_79 && context_79.id;
    function house(options) {
        return new Object2D_15.Object2D(new Vector2_26.Vector2(2, 2), new ObjectSkinBuilder_2.ObjectSkinBuilder(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }).build(), new ObjectPhysicsBuilder_1.ObjectPhysicsBuilder(`     
 ... 
 . . `).build(), Vector2_26.Vector2.from(options.position));
    }
    exports_79("house", house);
    return {
        setters: [
            function (Object2D_15_1) {
                Object2D_15 = Object2D_15_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (ObjectSkinBuilder_2_1) {
                ObjectSkinBuilder_2 = ObjectSkinBuilder_2_1;
            },
            function (ObjectPhysicsBuilder_1_1) {
                ObjectPhysicsBuilder_1 = ObjectPhysicsBuilder_1_1;
            },
            function (Vector2_26_1) {
                Vector2_26 = Vector2_26_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            }
        ],
        execute: function () {
            windowHorizontalSkin = () => new ObjectSkin_15.ObjectSkin().char(`🪟`).color('blue');
            wallSkin = () => new ObjectSkin_15.ObjectSkin().background('#666');
            physicsUnitBlockedTransparent = (transparency) => new ObjectPhysics_8.ObjectPhysics().material(transparency || '0');
            physicsUnitBlocked = () => new ObjectPhysics_8.ObjectPhysics().collision();
            exports_79("windowHorizontal", windowHorizontal = (options) => new Object2D_15.Object2D(Vector2_26.Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2_26.Vector2.from(options.position)));
            exports_79("wall", wall = (options) => new Object2D_15.Object2D(Vector2_26.Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2_26.Vector2.from(options.position)));
        }
    };
});
System.register("world/objects/fence", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_80, context_80) {
    "use strict";
    var ObjectSkin_16, Object2D_16, ObjectPhysics_9, Vector2_27;
    var __moduleName = context_80 && context_80.id;
    function fence(options) {
        const object = new Object2D_16.Object2D(Vector2_27.Vector2.zero, new ObjectSkin_16.ObjectSkin().char(`☗`).color('Sienna'), new ObjectPhysics_9.ObjectPhysics().collision(), Vector2_27.Vector2.from(options.position));
        object.type = "fence";
        return object;
    }
    exports_80("fence", fence);
    return {
        setters: [
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (Object2D_16_1) {
                Object2D_16 = Object2D_16_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            },
            function (Vector2_27_1) {
                Vector2_27 = Vector2_27_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/events/TeleportToEndpointGameEvent", ["engine/events/GameEvent"], function (exports_81, context_81) {
    "use strict";
    var GameEvent_8, TeleportToEndpointGameEvent;
    var __moduleName = context_81 && context_81.id;
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
            })(TeleportToEndpointGameEvent || (exports_81("TeleportToEndpointGameEvent", TeleportToEndpointGameEvent = {})));
        }
    };
});
System.register("world/objects/door", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/events/EventLoop", "world/events/TeleportToEndpointGameEvent", "engine/math/Vector2"], function (exports_82, context_82) {
    "use strict";
    var ObjectSkin_17, Object2D_17, ObjectPhysics_10, EventLoop_6, TeleportToEndpointGameEvent_1, Vector2_28, Door;
    var __moduleName = context_82 && context_82.id;
    function door(id, options) {
        return new Door(id, options);
    }
    exports_82("door", door);
    return {
        setters: [
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (Object2D_17_1) {
                Object2D_17 = Object2D_17_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            },
            function (EventLoop_6_1) {
                EventLoop_6 = EventLoop_6_1;
            },
            function (TeleportToEndpointGameEvent_1_1) {
                TeleportToEndpointGameEvent_1 = TeleportToEndpointGameEvent_1_1;
            },
            function (Vector2_28_1) {
                Vector2_28 = Vector2_28_1;
            }
        ],
        execute: function () {
            Door = class Door extends Object2D_17.Object2D {
                constructor(name, options) {
                    super(Vector2_28.Vector2.zero, new ObjectSkin_17.ObjectSkin().char(`🚪`).color('red'), new ObjectPhysics_10.ObjectPhysics(), Vector2_28.Vector2.from(options.position));
                    this.name = name;
                    this.type = "door";
                    this.setAction({
                        type: "collision",
                        action: ctx => EventLoop_6.emitEvent(TeleportToEndpointGameEvent_1.TeleportToEndpointGameEvent.create(name, ctx.obj, ctx.initiator))
                    });
                }
            };
            exports_82("Door", Door);
        }
    };
});
System.register("world/events/PlayerMessageGameEvent", ["engine/events/GameEvent"], function (exports_83, context_83) {
    "use strict";
    var GameEvent_9, PlayerMessageGameEvent;
    var __moduleName = context_83 && context_83.id;
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
            })(PlayerMessageGameEvent || (exports_83("PlayerMessageGameEvent", PlayerMessageGameEvent = {})));
        }
    };
});
System.register("world/events/TransferItemsGameEvent", ["engine/events/GameEvent"], function (exports_84, context_84) {
    "use strict";
    var GameEvent_10, TransferItemsGameEvent;
    var __moduleName = context_84 && context_84.id;
    return {
        setters: [
            function (GameEvent_10_1) {
                GameEvent_10 = GameEvent_10_1;
            }
        ],
        execute: function () {
            (function (TransferItemsGameEvent) {
                TransferItemsGameEvent.type = "transfer_items";
                class Args {
                }
                TransferItemsGameEvent.Args = Args;
                function create(recipient, items) {
                    return new GameEvent_10.GameEvent(recipient, TransferItemsGameEvent.type, {
                        recipient,
                        items,
                    });
                }
                TransferItemsGameEvent.create = create;
            })(TransferItemsGameEvent || (exports_84("TransferItemsGameEvent", TransferItemsGameEvent = {})));
        }
    };
});
System.register("world/actions", ["engine/events/EventLoop", "world/events/PlayerMessageGameEvent", "world/events/TransferItemsGameEvent"], function (exports_85, context_85) {
    "use strict";
    var EventLoop_7, PlayerMessageGameEvent_1, TransferItemsGameEvent_1;
    var __moduleName = context_85 && context_85.id;
    function storageAction(obj) {
        return (ctx) => {
            const items = obj.inventory.items;
            if (items.length === 0) {
                EventLoop_7.emitEvent(PlayerMessageGameEvent_1.PlayerMessageGameEvent.create("Chest is empty."));
                return;
            }
            obj.inventory.items = [];
            EventLoop_7.emitEvent(TransferItemsGameEvent_1.TransferItemsGameEvent.create(ctx.initiator, items));
        };
    }
    exports_85("storageAction", storageAction);
    return {
        setters: [
            function (EventLoop_7_1) {
                EventLoop_7 = EventLoop_7_1;
            },
            function (PlayerMessageGameEvent_1_1) {
                PlayerMessageGameEvent_1 = PlayerMessageGameEvent_1_1;
            },
            function (TransferItemsGameEvent_1_1) {
                TransferItemsGameEvent_1 = TransferItemsGameEvent_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/chest", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/actions", "engine/math/Vector2"], function (exports_86, context_86) {
    "use strict";
    var Object2D_18, ObjectSkin_18, ObjectPhysics_11, actions_1, Vector2_29, Chest, chest;
    var __moduleName = context_86 && context_86.id;
    return {
        setters: [
            function (Object2D_18_1) {
                Object2D_18 = Object2D_18_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            },
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            },
            function (Vector2_29_1) {
                Vector2_29 = Vector2_29_1;
            }
        ],
        execute: function () {
            Chest = class Chest extends Object2D_18.Object2D {
                constructor(position) {
                    super(Vector2_29.Vector2.zero, new ObjectSkin_18.ObjectSkin().char(`🧰`), new ObjectPhysics_11.ObjectPhysics().collision(), position);
                    this.setAction(actions_1.storageAction(this));
                }
            };
            exports_86("default", Chest);
            exports_86("chest", chest = () => new Chest(Vector2_29.Vector2.from([2, 10])));
        }
    };
});
System.register("engine/data/TileInfo", [], function (exports_87, context_87) {
    "use strict";
    var TileInfo;
    var __moduleName = context_87 && context_87.id;
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
            exports_87("TileInfo", TileInfo);
        }
    };
});
System.register("engine/data/Tiles", ["engine/components/ObjectSkin", "engine/objects/Tile", "engine/data/TileInfo", "engine/math/Grid", "engine/math/Vector2"], function (exports_88, context_88) {
    "use strict";
    var ObjectSkin_19, Tile_1, TileInfo_1, Grid_13, Vector2_30, Tiles;
    var __moduleName = context_88 && context_88.id;
    return {
        setters: [
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (TileInfo_1_1) {
                TileInfo_1 = TileInfo_1_1;
            },
            function (Grid_13_1) {
                Grid_13 = Grid_13_1;
            },
            function (Vector2_30_1) {
                Vector2_30 = Vector2_30_1;
            }
        ],
        execute: function () {
            Tiles = class Tiles {
                static createEmptyMap(size, callback) {
                    const grid = new Grid_13.Grid(size).fill(callback);
                    return grid.map(this.createTile);
                }
                static createEmpty(size) {
                    return this.createEmptyMap(size, () => Tiles.defaultTile);
                }
                static createEmptyDefault() {
                    return this.createEmpty(this.defaultSize);
                }
                static parseTiles(str, map) {
                    const tileInfos = str
                        .split('\n')
                        .map(mapLine);
                    return Grid_13.Grid.from(tileInfos).map(this.createTile);
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
                static createTile(tileInfo, position) {
                    const skin = new ObjectSkin_19.ObjectSkin().background(tileInfo.color);
                    const tile = new Tile_1.Tile(skin, position.clone());
                    tile.type = tileInfo.type;
                    tile.category = tileInfo.category;
                    tile.movementPenalty = tileInfo.movementPenalty;
                    return tile;
                }
            };
            exports_88("Tiles", Tiles);
            Tiles.defaultTile = new TileInfo_1.TileInfo('#331', '<default_tile>');
            Tiles.defaultSize = new Vector2_30.Vector2(20, 20);
        }
    };
});
System.register("world/levels/devHub", ["engine/Level", "world/objects/house", "world/objects/fence", "world/objects/door", "world/objects/chest", "world/items", "engine/data/Tiles", "engine/math/Vector2"], function (exports_89, context_89) {
    "use strict";
    var Level_1, house_1, fence_1, door_1, chest_1, items_2, Tiles_1, Vector2_31, fences, width, height, house1, doors, chest, objects, level, devHubLevel;
    var __moduleName = context_89 && context_89.id;
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
            function (Vector2_31_1) {
                Vector2_31 = Vector2_31_1;
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
                door_1.door('signal_lights', { position: [12, 10] }),
            ];
            chest = new chest_1.default(new Vector2_31.Vector2(7, 7));
            chest.inventory.addItems([items_2.bambooSeed()]);
            objects = [...fences, house1, ...doors, chest];
            level = new Level_1.Level('devHub', objects, Tiles_1.Tiles.createEmpty(new Vector2_31.Vector2(width, height)));
            exports_89("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/sprites/smokeSprite", ["engine/data/Sprite"], function (exports_90, context_90) {
    "use strict";
    var Sprite_6, smokeSpriteRaw, smokeSprite;
    var __moduleName = context_90 && context_90.id;
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
            exports_90("smokeSprite", smokeSprite = Sprite_6.Sprite.parse(smokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Smoke", ["engine/math/Vector2", "engine/objects/Particle", "world/sprites/smokeSprite"], function (exports_91, context_91) {
    "use strict";
    var Vector2_32, Particle_4, smokeSprite_1, Smoke;
    var __moduleName = context_91 && context_91.id;
    return {
        setters: [
            function (Vector2_32_1) {
                Vector2_32 = Vector2_32_1;
            },
            function (Particle_4_1) {
                Particle_4 = Particle_4_1;
            },
            function (smokeSprite_1_1) {
                smokeSprite_1 = smokeSprite_1_1;
            }
        ],
        execute: function () {
            Smoke = class Smoke extends Particle_4.Particle {
                constructor(position, state = 0) {
                    super(smokeSprite_1.smokeSprite, position, state);
                    this.type = Smoke.ParticleType;
                }
                onNext() {
                    var _a;
                    const scene = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene;
                    const particles = scene.particlesObject;
                    spread(this);
                    function spread(particle) {
                        if (!particle.hasNext()) {
                            return;
                        }
                        const particlePos = particle.position;
                        const newState = particle.state + 1;
                        const newPositions = Vector2_32.Vector2.directions
                            .map(x => particlePos.clone().add(x));
                        for (const newPosition of newPositions) {
                            spreadTo(newPosition, newState);
                        }
                    }
                    function spreadTo(newPosition, newState) {
                        const particle = particles.getParticleAt(newPosition);
                        if (!particle) {
                            particles.tryAddParticle(new Smoke(newPosition, newState));
                        }
                        else if (particle.type === Smoke.ParticleType && particle.state > newState) {
                            particles.remove(particle);
                            particles.tryAddParticle(new Smoke(newPosition, newState));
                        }
                    }
                }
            };
            exports_91("Smoke", Smoke);
            Smoke.ParticleType = "smoke";
        }
    };
});
System.register("world/objects/campfire", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "world/objects/particles/Smoke"], function (exports_92, context_92) {
    "use strict";
    var ObjectPhysics_12, Vector2_33, Sprite_7, Object2D_19, Smoke_1, Campfire;
    var __moduleName = context_92 && context_92.id;
    function campfire(options) {
        return new Campfire(Vector2_33.Vector2.from(options.position));
    }
    exports_92("campfire", campfire);
    return {
        setters: [
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
            },
            function (Vector2_33_1) {
                Vector2_33 = Vector2_33_1;
            },
            function (Sprite_7_1) {
                Sprite_7 = Sprite_7_1;
            },
            function (Object2D_19_1) {
                Object2D_19 = Object2D_19_1;
            },
            function (Smoke_1_1) {
                Smoke_1 = Smoke_1_1;
            }
        ],
        execute: function () {
            Campfire = class Campfire extends Object2D_19.Object2D {
                constructor(position) {
                    const sprite = Sprite_7.Sprite.parseSimple('🔥💨');
                    sprite.frames["0"][0].color('red');
                    const firePhysics = new ObjectPhysics_12.ObjectPhysics().light("F").temperature("F");
                    const smokePhysics = new ObjectPhysics_12.ObjectPhysics().light("6").temperature("8");
                    super(Vector2_33.Vector2.zero, sprite.frames["0"][0], firePhysics, position);
                    this.smokeTicks = 0;
                    this._sprite = sprite;
                    this.firePhysics = firePhysics;
                    this.smokePhysics = smokePhysics;
                    this.type = "campfire";
                }
                update(ticks) {
                    super.update(ticks);
                    const positionWeather = this.scene.weather.getWeatherInfoAt(this.position).weatherType;
                    const isRainyWeather = positionWeather === 'rain' ||
                        positionWeather === 'rain_and_snow';
                    if (isRainyWeather) {
                        this.skin = this._sprite.frames["1"][0];
                        this.physics = this.smokePhysics;
                    }
                    else {
                        this.skin = this._sprite.frames["0"][0];
                        this.physics = this.firePhysics;
                        this.smokeTicks += ticks;
                        const smokeTicksOverflow = this.smokeTicks - 2000;
                        if (smokeTicksOverflow >= 0) {
                            const _ = this.scene.particlesObject.tryAddParticle(new Smoke_1.Smoke(this.position));
                            this.smokeTicks = smokeTicksOverflow;
                        }
                    }
                }
            };
            exports_92("Campfire", Campfire);
        }
    };
});
System.register("world/objects/mushroom", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Color"], function (exports_93, context_93) {
    "use strict";
    var Object2D_20, ObjectSkin_20, ObjectPhysics_13, Vector2_34, Color_8, mushroom;
    var __moduleName = context_93 && context_93.id;
    return {
        setters: [
            function (Object2D_20_1) {
                Object2D_20 = Object2D_20_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
            },
            function (Vector2_34_1) {
                Vector2_34 = Vector2_34_1;
            },
            function (Color_8_1) {
                Color_8 = Color_8_1;
            }
        ],
        execute: function () {
            exports_93("mushroom", mushroom = (options) => {
                const physics = new ObjectPhysics_13.ObjectPhysics().light({ intensity: 8, color: new Color_8.Color(1, 1, 0), position: new Vector2_34.Vector2() });
                const object = new Object2D_20.Object2D(Vector2_34.Vector2.zero, new ObjectSkin_20.ObjectSkin().char(`🍄`), physics, Vector2_34.Vector2.from(options.position));
                return object;
            });
        }
    };
});
System.register("world/levels/dungeon", ["engine/Level", "world/objects/door", "world/objects/campfire", "world/objects/house", "engine/data/Tiles", "world/objects/mushroom", "engine/math/Grid", "utils/math"], function (exports_94, context_94) {
    "use strict";
    var Level_2, door_2, campfire_1, house_2, Tiles_2, mushroom_1, Grid_14, math_7, walls, campfires, mushrooms, doors, objects, level, dungeonLevel;
    var __moduleName = context_94 && context_94.id;
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
            function (house_2_1) {
                house_2 = house_2_1;
            },
            function (Tiles_2_1) {
                Tiles_2 = Tiles_2_1;
            },
            function (mushroom_1_1) {
                mushroom_1 = mushroom_1_1;
            },
            function (Grid_14_1) {
                Grid_14 = Grid_14_1;
            },
            function (math_7_1) {
                math_7 = math_7_1;
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
            level.roofHolesLayer = new Grid_14.Grid(level.size).fillValue(false);
            level.roofLayer = new Grid_14.Grid(level.size).fillValue(15);
            if (true) { // add gradient
                level.roofLayer.traverse((_, pos, l) => {
                    const v = 8 + Math.sin(pos.x / 2) * 8;
                    const roofValue = math_7.clamp(Math.round(v), 0, 15);
                    l.setAt(pos, roofValue);
                    if (roofValue === 0) {
                        level.roofHolesLayer.setAt(pos, true);
                    }
                });
            }
            exports_94("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/npcs/bee", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions", "engine/math/Vector2"], function (exports_95, context_95) {
    "use strict";
    var Npc_5, ObjectSkin_21, WanderingBehavior_2, NpcMovementOptions_3, Vector2_35, Bee;
    var __moduleName = context_95 && context_95.id;
    function bee(options) {
        return new Bee(Vector2_35.Vector2.from(options.position));
    }
    exports_95("bee", bee);
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            },
            function (WanderingBehavior_2_1) {
                WanderingBehavior_2 = WanderingBehavior_2_1;
            },
            function (NpcMovementOptions_3_1) {
                NpcMovementOptions_3 = NpcMovementOptions_3_1;
            },
            function (Vector2_35_1) {
                Vector2_35 = Vector2_35_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_5.Npc {
                constructor(position) {
                    super(new ObjectSkin_21.ObjectSkin().char(`🐝`).color('yellow'), position);
                    this.type = "bee";
                    this.realm = "sky";
                    this.movementOptions = NpcMovementOptions_3.defaultMovementOptions.flying;
                    this.behaviors.push(new WanderingBehavior_2.WanderingBehavior());
                }
            };
            exports_95("Bee", Bee);
        }
    };
});
System.register("world/behaviors/PreyGroupBehavior", ["world/behaviors/WanderingBehavior"], function (exports_96, context_96) {
    "use strict";
    var WanderingBehavior_3, PreyGroupBehavior;
    var __moduleName = context_96 && context_96.id;
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
            exports_96("PreyGroupBehavior", PreyGroupBehavior);
        }
    };
});
System.register("world/npcs/duck", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/math/Vector2"], function (exports_97, context_97) {
    "use strict";
    var Npc_6, ObjectSkin_22, PreyGroupBehavior_1, Vector2_36, Duck;
    var __moduleName = context_97 && context_97.id;
    function duck(options) {
        return new Duck(Vector2_36.Vector2.from(options.position));
    }
    exports_97("duck", duck);
    return {
        setters: [
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            },
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (PreyGroupBehavior_1_1) {
                PreyGroupBehavior_1 = PreyGroupBehavior_1_1;
            },
            function (Vector2_36_1) {
                Vector2_36 = Vector2_36_1;
            }
        ],
        execute: function () {
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_6.Npc {
                constructor(position) {
                    super(new ObjectSkin_22.ObjectSkin().char(`🦆`), position);
                    this.type = "duck";
                    this.movementOptions = {
                        walkingSpeed: 2,
                        swimmingSpeed: 5,
                    };
                    this.behaviors.push(new PreyGroupBehavior_1.PreyGroupBehavior());
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const duck = this;
                    //
                    if (duck.parameters["state"] === "feared") {
                        duck.skin.background("#FF000055");
                    }
                    else if (duck.parameters["stress"] > 1) {
                        duck.skin.background("#FF8C0055");
                    }
                    else if (duck.parameters["stress"] > 0) {
                        duck.skin.background("#FFFF0055");
                    }
                    else {
                        duck.skin.background("transparent");
                    }
                }
            };
        }
    };
});
System.register("world/npcs/sheep", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/math/Vector2"], function (exports_98, context_98) {
    "use strict";
    var Npc_7, ObjectSkin_23, PreyGroupBehavior_2, Vector2_37, Sheep;
    var __moduleName = context_98 && context_98.id;
    function sheep(options) {
        return new Sheep(Vector2_37.Vector2.from(options.position));
    }
    exports_98("sheep", sheep);
    return {
        setters: [
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            },
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (PreyGroupBehavior_2_1) {
                PreyGroupBehavior_2 = PreyGroupBehavior_2_1;
            },
            function (Vector2_37_1) {
                Vector2_37 = Vector2_37_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_7.Npc {
                constructor(position) {
                    super(new ObjectSkin_23.ObjectSkin().char(`🐑`), position);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                    this.behaviors.push(new PreyGroupBehavior_2.PreyGroupBehavior());
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const sheep = this;
                    //
                    // update skin
                    if (sheep.parameters["state"] === "feared") {
                        sheep.skin.background('#FF000055');
                    }
                    else if (sheep.parameters["stress"] > 1) {
                        sheep.skin.background('#FF8C0055');
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        sheep.skin.background('#FFFF0055');
                    }
                    else {
                        sheep.skin.background('transparent');
                    }
                }
            };
        }
    };
});
System.register("world/objects/lamp", ["engine/objects/Object2D", "engine/data/ObjectSkinBuilder", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_99, context_99) {
    "use strict";
    var Object2D_21, ObjectSkinBuilder_3, ObjectPhysics_14, Vector2_38, Lamp, lamp;
    var __moduleName = context_99 && context_99.id;
    return {
        setters: [
            function (Object2D_21_1) {
                Object2D_21 = Object2D_21_1;
            },
            function (ObjectSkinBuilder_3_1) {
                ObjectSkinBuilder_3 = ObjectSkinBuilder_3_1;
            },
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            },
            function (Vector2_38_1) {
                Vector2_38 = Vector2_38_1;
            }
        ],
        execute: function () {
            Lamp = class Lamp extends Object2D_21.Object2D {
                constructor(options) {
                    const origin = new Vector2_38.Vector2(0, 2);
                    const physics = new ObjectPhysics_14.ObjectPhysics().collision(origin).light(`B`);
                    super(origin, new ObjectSkinBuilder_3.ObjectSkinBuilder(`⬤
█
█`, `L
H
H`, {
                        'L': ['yellow', 'transparent'],
                        'H': ['#666', 'transparent'],
                    }).build(), physics, Vector2_38.Vector2.from(options.position));
                    this.setLampState(options.isOn === true);
                    this.setAction({
                        position: new Vector2_38.Vector2(0, 2),
                        action: (ctx) => ctx.obj.toggle(),
                        iconPosition: Vector2_38.Vector2.zero
                    });
                }
                setLampState(isOn) {
                    const o = this;
                    o.parameters["is_on"] = isOn;
                    o.skin.color(isOn ? 'yellow' : 'black');
                    o.physics.lights[0].intensity = Number.parseInt(isOn ? 'B' : '0', 16);
                }
                toggle() {
                    const isOn = this.parameters["is_on"];
                    this.setLampState(!isOn);
                }
            };
            exports_99("Lamp", Lamp);
            exports_99("lamp", lamp = (options) => {
                const object = new Lamp(options);
                return object;
            });
        }
    };
});
System.register("world/objects/bamboo", ["engine/components/ObjectPhysics", "engine/data/ObjectSkinBuilder", "engine/math/Vector2", "engine/events/EventLoop", "engine/objects/Object2D", "world/events/RemoveObjectGameEvent", "world/events/TransferItemsGameEvent", "world/items"], function (exports_100, context_100) {
    "use strict";
    var ObjectPhysics_15, ObjectSkinBuilder_4, Vector2_39, EventLoop_8, Object2D_22, RemoveObjectGameEvent_2, TransferItemsGameEvent_2, items_3;
    var __moduleName = context_100 && context_100.id;
    function bamboo(options) {
        const origin = new Vector2_39.Vector2(0, 5);
        const object = new Object2D_22.Object2D(origin, new ObjectSkinBuilder_4.ObjectSkinBuilder(`▄
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
        }).build(), new ObjectPhysics_15.ObjectPhysics().collision(origin), Vector2_39.Vector2.from(options.position));
        object.type = "bamboo";
        // TODO: only using an axe.
        object.setAction({
            position: origin,
            action: ctx => {
                EventLoop_8.emitEvent(RemoveObjectGameEvent_2.RemoveObjectGameEvent.create(ctx.obj));
                EventLoop_8.emitEvent(TransferItemsGameEvent_2.TransferItemsGameEvent.create(ctx.initiator, [items_3.bambooSeed()]));
            }
        });
        return object;
    }
    exports_100("bamboo", bamboo);
    return {
        setters: [
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            },
            function (ObjectSkinBuilder_4_1) {
                ObjectSkinBuilder_4 = ObjectSkinBuilder_4_1;
            },
            function (Vector2_39_1) {
                Vector2_39 = Vector2_39_1;
            },
            function (EventLoop_8_1) {
                EventLoop_8 = EventLoop_8_1;
            },
            function (Object2D_22_1) {
                Object2D_22 = Object2D_22_1;
            },
            function (RemoveObjectGameEvent_2_1) {
                RemoveObjectGameEvent_2 = RemoveObjectGameEvent_2_1;
            },
            function (TransferItemsGameEvent_2_1) {
                TransferItemsGameEvent_2 = TransferItemsGameEvent_2_1;
            },
            function (items_3_1) {
                items_3 = items_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_101, context_101) {
    "use strict";
    var Sprite_8, treeSpriteRaw, treeSprite;
    var __moduleName = context_101 && context_101.id;
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
            exports_101("treeSprite", treeSprite = Sprite_8.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/Object2D", "world/events/WeatherChangedGameEvent"], function (exports_102, context_102) {
    "use strict";
    var Object2D_23, WeatherChangedGameEvent_2, Tree;
    var __moduleName = context_102 && context_102.id;
    return {
        setters: [
            function (Object2D_23_1) {
                Object2D_23 = Object2D_23_1;
            },
            function (WeatherChangedGameEvent_2_1) {
                WeatherChangedGameEvent_2 = WeatherChangedGameEvent_2_1;
            }
        ],
        execute: function () {
            Tree = class Tree extends Object2D_23.Object2D {
                constructor(originPoint, sprite, physics, position) {
                    super(originPoint, sprite.frames["wind"][0], physics, position);
                    this.sprite = sprite;
                    this.currentFrameName = "wind";
                    this.isSnowy = false;
                }
                update(ticks) {
                    super.update(ticks);
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
                    else if (ev.type === WeatherChangedGameEvent_2.WeatherChangedGameEvent.type) {
                        const args = ev.args;
                        this.isSnowy = args.to === 'snow';
                    }
                }
            };
            exports_102("Tree", Tree);
            ;
        }
    };
});
System.register("world/objects/pineTree", ["engine/components/ObjectPhysics", "engine/math/Vector2", "world/sprites/tree", "world/objects/Tree"], function (exports_103, context_103) {
    "use strict";
    var ObjectPhysics_16, Vector2_40, tree_1, Tree_1, PineTree;
    var __moduleName = context_103 && context_103.id;
    function pineTree(options) {
        return new PineTree(Vector2_40.Vector2.from(options.position));
    }
    exports_103("pineTree", pineTree);
    return {
        setters: [
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (Vector2_40_1) {
                Vector2_40 = Vector2_40_1;
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
                    const origin = new Vector2_40.Vector2(1, 3);
                    super(origin, tree_1.treeSprite, new ObjectPhysics_16.ObjectPhysics().collision(origin), position);
                }
            };
        }
    };
});
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_104, context_104) {
    "use strict";
    var Sprite_9, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_104 && context_104.id;
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
            exports_104("sakuraSprite", sakuraSprite = Sprite_9.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/sakuraTree", ["engine/components/ObjectPhysics", "engine/math/Vector2", "world/sprites/sakura", "world/objects/Tree"], function (exports_105, context_105) {
    "use strict";
    var ObjectPhysics_17, Vector2_41, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_105 && context_105.id;
    function sakuraTree(options) {
        return new SakuraTree(Vector2_41.Vector2.from(options.position));
    }
    exports_105("sakuraTree", sakuraTree);
    return {
        setters: [
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (Vector2_41_1) {
                Vector2_41 = Vector2_41_1;
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
                    const origin = new Vector2_41.Vector2(2, 3);
                    super(origin, sakura_1.sakuraSprite, new ObjectPhysics_17.ObjectPhysics().collision(origin), position);
                }
            };
        }
    };
});
System.register("world/objects/beehive", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/items", "world/actions", "engine/math/Vector2"], function (exports_106, context_106) {
    "use strict";
    var Object2D_24, ObjectSkin_24, ObjectPhysics_18, items_4, actions_2, Vector2_42;
    var __moduleName = context_106 && context_106.id;
    function beehive(options) {
        const obj = new Object2D_24.Object2D(Vector2_42.Vector2.zero, new ObjectSkin_24.ObjectSkin().char(`☷`).color('black').background('orange'), new ObjectPhysics_18.ObjectPhysics().collision(), Vector2_42.Vector2.from(options.position));
        obj.inventory.addItems([items_4.honeyPot()]);
        obj.setAction(actions_2.storageAction(obj));
        return obj;
    }
    exports_106("beehive", beehive);
    return {
        setters: [
            function (Object2D_24_1) {
                Object2D_24 = Object2D_24_1;
            },
            function (ObjectSkin_24_1) {
                ObjectSkin_24 = ObjectSkin_24_1;
            },
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            },
            function (items_4_1) {
                items_4 = items_4_1;
            },
            function (actions_2_1) {
                actions_2 = actions_2_1;
            },
            function (Vector2_42_1) {
                Vector2_42 = Vector2_42_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/natural", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_107, context_107) {
    "use strict";
    var Object2D_25, ObjectSkin_25, ObjectPhysics_19, Vector2_43, createUnitSkin, createUnitStaticObject, flower, wheat, hotspring;
    var __moduleName = context_107 && context_107.id;
    return {
        setters: [
            function (Object2D_25_1) {
                Object2D_25 = Object2D_25_1;
            },
            function (ObjectSkin_25_1) {
                ObjectSkin_25 = ObjectSkin_25_1;
            },
            function (ObjectPhysics_19_1) {
                ObjectPhysics_19 = ObjectPhysics_19_1;
            },
            function (Vector2_43_1) {
                Vector2_43 = Vector2_43_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_25.ObjectSkin().char(sym).color(color);
            createUnitStaticObject = (options) => new Object2D_25.Object2D(Vector2_43.Vector2.zero, createUnitSkin(options.sym, options.color), new ObjectPhysics_19.ObjectPhysics(), Vector2_43.Vector2.from(options.position));
            exports_107("flower", flower = (options) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' }));
            exports_107("wheat", wheat = (options) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' }));
            exports_107("hotspring", hotspring = (options) => new Object2D_25.Object2D(Vector2_43.Vector2.zero, createUnitSkin(`♨`, 'lightblue'), new ObjectPhysics_19.ObjectPhysics().temperature('A'), Vector2_43.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/pillar", ["engine/components/ObjectPhysics", "engine/data/ObjectSkinBuilder", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_108, context_108) {
    "use strict";
    var ObjectPhysics_20, ObjectSkinBuilder_5, Vector2_44, Object2D_26, pillar;
    var __moduleName = context_108 && context_108.id;
    return {
        setters: [
            function (ObjectPhysics_20_1) {
                ObjectPhysics_20 = ObjectPhysics_20_1;
            },
            function (ObjectSkinBuilder_5_1) {
                ObjectSkinBuilder_5 = ObjectSkinBuilder_5_1;
            },
            function (Vector2_44_1) {
                Vector2_44 = Vector2_44_1;
            },
            function (Object2D_26_1) {
                Object2D_26 = Object2D_26_1;
            }
        ],
        execute: function () {
            exports_108("pillar", pillar = (options) => {
                const origin = new Vector2_44.Vector2(0, 3);
                const skin = new ObjectSkinBuilder_5.ObjectSkinBuilder(`▄
█
█
▓`, `L
H
H
B`, {
                    'L': ['yellow', 'transparent'],
                    'H': ['white', 'transparent'],
                    'B': ['#777', 'transparent'],
                })
                    .build();
                const physics = new ObjectPhysics_20.ObjectPhysics().collision(origin);
                return new Object2D_26.Object2D(origin, skin, physics, Vector2_44.Vector2.from(options.position));
            });
        }
    };
});
System.register("world/levels/ggj2020demo/objects/shop", ["engine/data/ObjectPhysicsBuilder", "engine/data/ObjectSkinBuilder", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_109, context_109) {
    "use strict";
    var ObjectPhysicsBuilder_2, ObjectSkinBuilder_6, Vector2_45, Object2D_27, shop;
    var __moduleName = context_109 && context_109.id;
    return {
        setters: [
            function (ObjectPhysicsBuilder_2_1) {
                ObjectPhysicsBuilder_2 = ObjectPhysicsBuilder_2_1;
            },
            function (ObjectSkinBuilder_6_1) {
                ObjectSkinBuilder_6 = ObjectSkinBuilder_6_1;
            },
            function (Vector2_45_1) {
                Vector2_45 = Vector2_45_1;
            },
            function (Object2D_27_1) {
                Object2D_27 = Object2D_27_1;
            }
        ],
        execute: function () {
            exports_109("shop", shop = (options) => new Object2D_27.Object2D(new Vector2_45.Vector2(2, 3), new ObjectSkinBuilder_6.ObjectSkinBuilder(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }).build(), new ObjectPhysicsBuilder_2.ObjectPhysicsBuilder(`       
       
 ..... `).build(), Vector2_45.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/arc", ["engine/data/ObjectPhysicsBuilder", "engine/data/ObjectSkinBuilder", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_110, context_110) {
    "use strict";
    var ObjectPhysicsBuilder_3, ObjectSkinBuilder_7, Vector2_46, Object2D_28, arc;
    var __moduleName = context_110 && context_110.id;
    return {
        setters: [
            function (ObjectPhysicsBuilder_3_1) {
                ObjectPhysicsBuilder_3 = ObjectPhysicsBuilder_3_1;
            },
            function (ObjectSkinBuilder_7_1) {
                ObjectSkinBuilder_7 = ObjectSkinBuilder_7_1;
            },
            function (Vector2_46_1) {
                Vector2_46 = Vector2_46_1;
            },
            function (Object2D_28_1) {
                Object2D_28 = Object2D_28_1;
            }
        ],
        execute: function () {
            exports_110("arc", arc = (options) => new Object2D_28.Object2D(new Vector2_46.Vector2(2, 3), new ObjectSkinBuilder_7.ObjectSkinBuilder(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }).build(), new ObjectPhysicsBuilder_3.ObjectPhysicsBuilder(`     
     
     
.   .`).build(), Vector2_46.Vector2.from(options.position)));
        }
    };
});
System.register("world/tiles", ["engine/data/TileInfo"], function (exports_111, context_111) {
    "use strict";
    var TileInfo_2, tiles;
    var __moduleName = context_111 && context_111.id;
    return {
        setters: [
            function (TileInfo_2_1) {
                TileInfo_2 = TileInfo_2_1;
            }
        ],
        execute: function () {
            exports_111("tiles", tiles = {
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
System.register("world/levels/ggj2020demo/tiles", ["engine/data/Tiles", "world/tiles"], function (exports_112, context_112) {
    "use strict";
    var Tiles_3, tiles_1, levelTiles;
    var __moduleName = context_112 && context_112.id;
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
            exports_112("levelTiles", levelTiles = Tiles_3.Tiles.parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
System.register("world/levels/ggj2020demo/level", ["engine/Level", "world/npcs/bee", "world/npcs/duck", "world/npcs/sheep", "world/objects/lamp", "world/objects/house", "world/objects/bamboo", "world/objects/pineTree", "world/objects/sakuraTree", "world/objects/beehive", "world/objects/natural", "world/levels/ggj2020demo/objects/pillar", "world/levels/ggj2020demo/objects/shop", "world/levels/ggj2020demo/objects/arc", "world/levels/ggj2020demo/tiles", "world/objects/fence", "world/objects/door"], function (exports_113, context_113) {
    "use strict";
    var Level_3, bee_1, duck_1, sheep_1, lamp_1, house_3, bamboo_1, pineTree_1, sakuraTree_1, beehive_1, natural_1, pillar_1, shop_1, arc_1, tiles_2, fence_2, door_3, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, doors, objects, level;
    var __moduleName = context_113 && context_113.id;
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
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < tiles_2.levelTiles.width; x++) {
                    fences.push(fence_2.fence({ position: [x, 0] }));
                    fences.push(fence_2.fence({ position: [x, tiles_2.levelTiles.height - 1] }));
                }
                for (let y = 1; y < tiles_2.levelTiles.height - 1; y++) {
                    fences.push(fence_2.fence({ position: [0, y] }));
                    fences.push(fence_2.fence({ position: [tiles_2.levelTiles.width - 1, y] }));
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
            exports_113("level", level = new Level_3.Level('ggj2020demo', objects, tiles_2.levelTiles));
        }
    };
});
System.register("world/objects/signals/LightSource", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/components/CompositeObjectSkin", "engine/math/Vector2", "engine/math/Rotation"], function (exports_114, context_114) {
    "use strict";
    var Object2D_29, ObjectSkin_26, ObjectPhysics_21, CompositeObjectSkin_3, Vector2_47, Rotation_4, LightSource;
    var __moduleName = context_114 && context_114.id;
    return {
        setters: [
            function (Object2D_29_1) {
                Object2D_29 = Object2D_29_1;
            },
            function (ObjectSkin_26_1) {
                ObjectSkin_26 = ObjectSkin_26_1;
            },
            function (ObjectPhysics_21_1) {
                ObjectPhysics_21 = ObjectPhysics_21_1;
            },
            function (CompositeObjectSkin_3_1) {
                CompositeObjectSkin_3 = CompositeObjectSkin_3_1;
            },
            function (Vector2_47_1) {
                Vector2_47 = Vector2_47_1;
            },
            function (Rotation_4_1) {
                Rotation_4 = Rotation_4_1;
            }
        ],
        execute: function () {
            LightSource = class LightSource extends Object2D_29.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_21.ObjectPhysics()
                        .light({ intensity: Number.parseInt(options.intensity || 'F'), color: options.color, position: new Vector2_47.Vector2() })
                        .signal({
                        position: new Vector2_47.Vector2(),
                        outputs: Rotation_4.Rotations.all,
                        inputs: Rotation_4.Rotations.all,
                    });
                    const lightColor = options.color.getStyle();
                    const mainSkin = new ObjectSkin_26.ObjectSkin().char(`⏺`);
                    const circleSkin = new ObjectSkin_26.ObjectSkin().char('⭘').color(lightColor);
                    const skin = new CompositeObjectSkin_3.CompositeObjectSkin([mainSkin, circleSkin]);
                    super(Vector2_47.Vector2.zero, skin, physics, Vector2_47.Vector2.from(options.position));
                    this._isOn = false;
                    this._maxIntensity = 15;
                    this._mainSkin = mainSkin;
                    this.type = "light_source";
                    this._color = lightColor;
                    this._maxIntensity = Number.parseInt(options.intensity || 'F', 16);
                    this._requiresSignal = typeof options.requiresSignal === "undefined" ? true : options.requiresSignal;
                    this.setAction(ctx => ctx.obj.toggle());
                    this.setLampState(!this._requiresSignal);
                }
                processSignalTransfer(transfers) {
                    if (this._requiresSignal) {
                        const isSignaled = transfers.filter(x => x.signal.value > 0).length > 0;
                        this.setLampState(isSignaled);
                    }
                    return [];
                }
                setLampState(isOn) {
                    this._isOn = isOn;
                    this._mainSkin.color(isOn ? this._color : 'black');
                    this.physics.lights[0].intensity = isOn ? this._maxIntensity : 0;
                }
                toggle() {
                    this.setLampState(!this._isOn);
                }
            };
            exports_114("LightSource", LightSource);
        }
    };
});
System.register("world/levels/house", ["engine/Level", "world/objects/door", "world/objects/house", "engine/data/Tiles", "world/objects/signals/LightSource", "engine/math/Color", "engine/math/Vector2", "engine/math/Grid"], function (exports_115, context_115) {
    "use strict";
    var Level_4, door_4, house_4, Tiles_4, LightSource_1, Color_9, Vector2_48, Grid_15, walls, margin, left, top, width, height, campfires, lightSources, doors, objects, level, houseLevel;
    var __moduleName = context_115 && context_115.id;
    return {
        setters: [
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (door_4_1) {
                door_4 = door_4_1;
            },
            function (house_4_1) {
                house_4 = house_4_1;
            },
            function (Tiles_4_1) {
                Tiles_4 = Tiles_4_1;
            },
            function (LightSource_1_1) {
                LightSource_1 = LightSource_1_1;
            },
            function (Color_9_1) {
                Color_9 = Color_9_1;
            },
            function (Vector2_48_1) {
                Vector2_48 = Vector2_48_1;
            },
            function (Grid_15_1) {
                Grid_15 = Grid_15_1;
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
                new LightSource_1.LightSource({ position: [6, 10], color: new Color_9.Color(1, 0, 0), requiresSignal: false }),
                new LightSource_1.LightSource({ position: [12, 10], color: new Color_9.Color(0, 1, 0), requiresSignal: false }),
                new LightSource_1.LightSource({ position: [9, 13], color: new Color_9.Color(0, 0, 1), requiresSignal: false }),
            ];
            doors = [
                door_4.door('house', { position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...doors, ...campfires, ...lightSources];
            level = new Level_4.Level('house', objects, Tiles_4.Tiles.createEmptyDefault());
            level.roofHolesLayer = new Grid_15.Grid(level.size).fillValue(true);
            level.roofLayer = new Grid_15.Grid(level.size).fillValue(0);
            if (true) { // add gradient
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        level.roofHolesLayer.setAt(new Vector2_48.Vector2(left + x, top + y), false);
                        level.roofLayer.setAt(new Vector2_48.Vector2(left + x, top + y), 15);
                    }
                }
            }
            exports_115("houseLevel", houseLevel = level);
        }
    };
});
System.register("world/levels/intro", ["world/objects/chest", "world/objects/lamp", "world/objects/house", "engine/events/EventLoop", "engine/events/GameEvent", "engine/Level", "world/objects/pineTree", "world/objects/door", "world/objects/bamboo", "engine/objects/Npc", "engine/components/ObjectSkin", "engine/data/Tiles", "world/items", "engine/math/Vector2"], function (exports_116, context_116) {
    "use strict";
    var chest_2, lamp_2, house_5, EventLoop_9, GameEvent_11, Level_5, pineTree_2, door_5, bamboo_2, Npc_8, ObjectSkin_27, Tiles_5, items_5, Vector2_49, lamps, doors, house1, tree1, chest1, trees, ulan, npcs, objects, introLevel;
    var __moduleName = context_116 && context_116.id;
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
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_27_1) {
                ObjectSkin_27 = ObjectSkin_27_1;
            },
            function (Tiles_5_1) {
                Tiles_5 = Tiles_5_1;
            },
            function (items_5_1) {
                items_5 = items_5_1;
            },
            function (Vector2_49_1) {
                Vector2_49 = Vector2_49_1;
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
            exports_116("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x2, y] }));
                }
            }
            ulan = new Npc_8.Npc(new ObjectSkin_27.ObjectSkin().char('🐻'), new Vector2_49.Vector2(4, 4));
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
            exports_116("introLevel", introLevel = new Level_5.Level('intro', objects, Tiles_5.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/headStone", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_117, context_117) {
    "use strict";
    var ObjectSkin_28, Object2D_30, ObjectPhysics_22, Vector2_50, headStone;
    var __moduleName = context_117 && context_117.id;
    return {
        setters: [
            function (ObjectSkin_28_1) {
                ObjectSkin_28 = ObjectSkin_28_1;
            },
            function (Object2D_30_1) {
                Object2D_30 = Object2D_30_1;
            },
            function (ObjectPhysics_22_1) {
                ObjectPhysics_22 = ObjectPhysics_22_1;
            },
            function (Vector2_50_1) {
                Vector2_50 = Vector2_50_1;
            }
        ],
        execute: function () {
            exports_117("headStone", headStone = (options) => new Object2D_30.Object2D(Vector2_50.Vector2.zero, new ObjectSkin_28.ObjectSkin().char(`🪦`).color('Sienna'), new ObjectPhysics_22.ObjectPhysics().collision(), Vector2_50.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/lights", ["world/objects/campfire", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/headStone", "world/objects/house", "engine/data/Tiles", "world/objects/door"], function (exports_118, context_118) {
    "use strict";
    var campfire_2, Level_6, pineTree_3, fence_3, headStone_1, house_6, Tiles_6, door_6, fences, headStones, walls, tree2, campfires, doors, objects, level, lightsLevel;
    var __moduleName = context_118 && context_118.id;
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
            exports_118("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/objects/particles/Mist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle"], function (exports_119, context_119) {
    "use strict";
    var ObjectSkin_29, Sprite_10, Particle_5, Mist;
    var __moduleName = context_119 && context_119.id;
    return {
        setters: [
            function (ObjectSkin_29_1) {
                ObjectSkin_29 = ObjectSkin_29_1;
            },
            function (Sprite_10_1) {
                Sprite_10 = Sprite_10_1;
            },
            function (Particle_5_1) {
                Particle_5 = Particle_5_1;
            }
        ],
        execute: function () {
            Mist = class Mist extends Particle_5.Particle {
                constructor(position) {
                    const sprite = new Sprite_10.Sprite();
                    const skin = new ObjectSkin_29.ObjectSkin().background('#fff');
                    sprite.frames[Particle_5.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "mist";
                }
            };
            exports_119("Mist", Mist);
        }
    };
});
System.register("world/levels/mistlandLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/campfire", "world/objects/particles/Mist", "world/objects/pineTree", "engine/math/Vector2"], function (exports_120, context_120) {
    "use strict";
    var Level_7, fence_4, door_7, Tiles_7, campfire_3, Mist_1, pineTree_4, Vector2_51, fences, width, height, trees, fires, doors, objects, mistlandLevel;
    var __moduleName = context_120 && context_120.id;
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
            function (Vector2_51_1) {
                Vector2_51 = Vector2_51_1;
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
                new campfire_3.Campfire(new Vector2_51.Vector2(12, 12)),
            ];
            doors = [
                door_7.door('mistland', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...trees, ...fires];
            exports_120("mistlandLevel", mistlandLevel = new class extends Level_7.Level {
                constructor() {
                    super('mistland', objects, Tiles_7.Tiles.createEmpty(new Vector2_51.Vector2(width, height)));
                    this.weather.wind = new Vector2_51.Vector2(1, 0);
                }
                onLoaded() {
                    super.onLoaded();
                    this.fillMist(this);
                }
                update(ticks) {
                    super.update(ticks);
                    this.fillMist(this);
                }
                fillMist(scene) {
                    const box = scene.windBox;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const p = new Vector2_51.Vector2(x, y);
                            if (scene.particlesObject.isParticlePositionBlocked(p)) {
                                continue;
                            }
                            scene.particlesObject.tryAddParticle(new Mist_1.Mist(p));
                        }
                    }
                }
            }());
        }
    };
});
System.register("world/levels/particlesLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/campfire", "engine/math/Vector2"], function (exports_121, context_121) {
    "use strict";
    var Level_8, fence_5, door_8, Tiles_8, campfire_4, Vector2_52, fences, width, height, fires, doors, objects, particlesLevel;
    var __moduleName = context_121 && context_121.id;
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
            function (Vector2_52_1) {
                Vector2_52 = Vector2_52_1;
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
                new campfire_4.Campfire(new Vector2_52.Vector2(10, 10)),
                new campfire_4.Campfire(new Vector2_52.Vector2(5, 20)),
            ];
            doors = [
                door_8.door('particles', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...fires];
            exports_121("particlesLevel", particlesLevel = new class extends Level_8.Level {
                constructor() {
                    super('particles', objects, Tiles_8.Tiles.createEmpty(new Vector2_52.Vector2(width, height)));
                    this.weather.wind = new Vector2_52.Vector2(1, 1);
                }
                onLoaded() {
                    super.onLoaded();
                    this.weather.changeWeather("snow");
                }
            }());
        }
    };
});
System.register("world/behaviors/HunterBehavior", ["world/behaviors/WanderingBehavior"], function (exports_122, context_122) {
    "use strict";
    var WanderingBehavior_4, HunterBehavior;
    var __moduleName = context_122 && context_122.id;
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
            exports_122("HunterBehavior", HunterBehavior);
        }
    };
});
System.register("world/npcs/wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/HunterBehavior", "engine/objects/NpcMovementOptions", "engine/math/Vector2"], function (exports_123, context_123) {
    "use strict";
    var Npc_9, ObjectSkin_30, HunterBehavior_1, NpcMovementOptions_4, Vector2_53, Wolf;
    var __moduleName = context_123 && context_123.id;
    function wolf(options) {
        return new Wolf(Vector2_53.Vector2.from(options.position));
    }
    exports_123("wolf", wolf);
    return {
        setters: [
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (ObjectSkin_30_1) {
                ObjectSkin_30 = ObjectSkin_30_1;
            },
            function (HunterBehavior_1_1) {
                HunterBehavior_1 = HunterBehavior_1_1;
            },
            function (NpcMovementOptions_4_1) {
                NpcMovementOptions_4 = NpcMovementOptions_4_1;
            },
            function (Vector2_53_1) {
                Vector2_53 = Vector2_53_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_9.Npc {
                constructor(position) {
                    super(new ObjectSkin_30.ObjectSkin().char(`🐺`), position);
                    this.type = "wolf";
                    this.movementOptions = {
                        ...NpcMovementOptions_4.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    this.behaviors.push(new HunterBehavior_1.HunterBehavior({
                        preyType: 'sheep',
                    }));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const wolf = this;
                    //
                    if (wolf.parameters["state"] === "feared") {
                        wolf.skin.background('#FF000055');
                    }
                    else if (wolf.parameters["state"] === "hunting") {
                        wolf.skin.background('violet');
                    }
                    else if (wolf.parameters["state"] === "wandering") {
                        wolf.skin.background('yellow');
                    }
                    else {
                        wolf.skin.background('transparent');
                    }
                }
            };
            ;
        }
    };
});
System.register("world/levels/sheep", ["world/objects/campfire", "world/npcs/sheep", "world/npcs/wolf", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/door", "engine/data/Tiles"], function (exports_124, context_124) {
    "use strict";
    var campfire_5, sheep_2, wolf_1, Level_9, pineTree_5, fence_6, door_9, Tiles_9, sheeps, wolves, fences, tree2, campfires, doors, objects, sheepLevel;
    var __moduleName = context_124 && context_124.id;
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
            exports_124("sheepLevel", sheepLevel = new Level_9.Level('sheep', objects, Tiles_9.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/signals/Invertor", ["engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/data/Sprite", "engine/math/Vector2", "engine/math/Rotation", "engine/components/CompositeObjectSkin"], function (exports_125, context_125) {
    "use strict";
    var Object2D_31, ObjectPhysics_23, Sprite_11, Vector2_54, Rotation_5, CompositeObjectSkin_4, Invertor;
    var __moduleName = context_125 && context_125.id;
    return {
        setters: [
            function (Object2D_31_1) {
                Object2D_31 = Object2D_31_1;
            },
            function (ObjectPhysics_23_1) {
                ObjectPhysics_23 = ObjectPhysics_23_1;
            },
            function (Sprite_11_1) {
                Sprite_11 = Sprite_11_1;
            },
            function (Vector2_54_1) {
                Vector2_54 = Vector2_54_1;
            },
            function (Rotation_5_1) {
                Rotation_5 = Rotation_5_1;
            },
            function (CompositeObjectSkin_4_1) {
                CompositeObjectSkin_4 = CompositeObjectSkin_4_1;
            }
        ],
        execute: function () {
            Invertor = class Invertor extends Object2D_31.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_23.ObjectPhysics().signal({
                        position: Vector2_54.Vector2.zero,
                        inputs: [Rotation_5.Rotations.back],
                        outputs: [Rotation_5.Rotations.forward],
                    });
                    const sprite = Sprite_11.Sprite.parseSimple('▷▽◁△');
                    const skin = sprite.frames["0"][0];
                    const indicatorSprite = Sprite_11.Sprite.parseSimple('▶▼◀▲'); //('▶️🔽◀️🔼')
                    const indicatorSkin = indicatorSprite.frames["0"][0];
                    const lockedFrame = Sprite_11.Sprite.parseSimple('◯').frames["0"][0].color('white');
                    super(Vector2_54.Vector2.zero, new CompositeObjectSkin_4.CompositeObjectSkin([indicatorSkin, skin]), physics, Vector2_54.Vector2.from((options === null || options === void 0 ? void 0 : options.position) || [0, 0]));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this._lockedFrame = lockedFrame;
                    this.type = "invertor";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const controlTransfers = transfers
                        .filter(x => Rotation_5.Rotations.equals(x.rotation, Rotation_5.Rotations.right));
                    const isInverting = controlTransfers.length === 0;
                    const outputs = transfers
                        .filter(x => Rotation_5.Rotations.equals(x.rotation, Rotation_5.Rotations.back))
                        .map(transfer => {
                        const invertedSignal = isInverting ? this.invertSignal(transfer.signal) : transfer.signal;
                        const outputDirection = Rotation_5.Rotations.normalize(transfer.rotation + Rotation_5.Rotations.opposite);
                        return { rotation: outputDirection, signal: invertedSignal };
                    });
                    this.resetSkin(outputs.length > 0, isInverting);
                    return outputs;
                }
                invertSignal(signal) {
                    const newValue = signal.value === 0 ? 1 : 0;
                    return { type: signal.type, value: newValue };
                }
                resetSkin(isHighlighted = false, isInverting = true) {
                    const frameName = Rotation_5.Rotations.normalize(this.rotation).toString();
                    const frame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0].color(isHighlighted ? 'white' : 'black');
                    const frames = [indicatorFrame, frame];
                    if (!isInverting) {
                        frames.push(this._lockedFrame);
                    }
                    this.skin = new CompositeObjectSkin_4.CompositeObjectSkin(frames);
                }
            };
            exports_125("Invertor", Invertor);
        }
    };
});
System.register("world/objects/signals/Pipe", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation"], function (exports_126, context_126) {
    "use strict";
    var ObjectPhysics_24, Vector2_55, Sprite_12, Object2D_32, CompositeObjectSkin_5, Rotation_6, Pipe;
    var __moduleName = context_126 && context_126.id;
    return {
        setters: [
            function (ObjectPhysics_24_1) {
                ObjectPhysics_24 = ObjectPhysics_24_1;
            },
            function (Vector2_55_1) {
                Vector2_55 = Vector2_55_1;
            },
            function (Sprite_12_1) {
                Sprite_12 = Sprite_12_1;
            },
            function (Object2D_32_1) {
                Object2D_32 = Object2D_32_1;
            },
            function (CompositeObjectSkin_5_1) {
                CompositeObjectSkin_5 = CompositeObjectSkin_5_1;
            },
            function (Rotation_6_1) {
                Rotation_6 = Rotation_6_1;
            }
        ],
        execute: function () {
            Pipe = class Pipe extends Object2D_32.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_24.ObjectPhysics().signal({
                        position: Vector2_55.Vector2.zero,
                        inputs: [Rotation_6.Rotations.forward, Rotation_6.Rotations.back],
                        outputs: [Rotation_6.Rotations.forward, Rotation_6.Rotations.back],
                    });
                    const sprite = Sprite_12.Sprite.parseSimple('═║');
                    const indicatorSprite = Sprite_12.Sprite.parseSimple('─│');
                    super(Vector2_55.Vector2.zero, sprite.frames["0"][0], physics, Vector2_55.Vector2.from(options.position));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this.type = "pipe";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const signalCell = this.physics.signalCells[0];
                    const outputs = transfers
                        .filter(x => signalCell.inputs.includes(Rotation_6.Rotations.normalize(x.rotation)))
                        .map(x => ({ rotation: Rotation_6.Rotations.normalize(x.rotation + Rotation_6.Rotations.opposite), signal: x.signal }));
                    this.resetSkin(outputs.length > 0);
                    return outputs;
                }
                resetSkin(isHighlighted = false) {
                    const frameName = Rotation_6.Rotations.normalize(this.rotation).toString();
                    const pipeFrame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0].color(isHighlighted ? 'white' : 'black');
                    this.skin = new CompositeObjectSkin_5.CompositeObjectSkin([pipeFrame, indicatorFrame]);
                }
            };
            exports_126("Pipe", Pipe);
        }
    };
});
System.register("engine/math/Orientation", [], function (exports_127, context_127) {
    "use strict";
    var Orientations, OrientationHelper;
    var __moduleName = context_127 && context_127.id;
    return {
        setters: [],
        execute: function () {
            exports_127("Orientations", Orientations = ["horizontal", "vertical"]);
            OrientationHelper = class OrientationHelper {
                static rotate(orientation) {
                    return orientation === "horizontal"
                        ? "vertical"
                        : "horizontal";
                }
            };
            exports_127("OrientationHelper", OrientationHelper);
        }
    };
});
System.register("world/objects/signals/Lever", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/math/Rotation"], function (exports_128, context_128) {
    "use strict";
    var ObjectPhysics_25, Vector2_56, Sprite_13, Object2D_33, Rotation_7, Lever;
    var __moduleName = context_128 && context_128.id;
    return {
        setters: [
            function (ObjectPhysics_25_1) {
                ObjectPhysics_25 = ObjectPhysics_25_1;
            },
            function (Vector2_56_1) {
                Vector2_56 = Vector2_56_1;
            },
            function (Sprite_13_1) {
                Sprite_13 = Sprite_13_1;
            },
            function (Object2D_33_1) {
                Object2D_33 = Object2D_33_1;
            },
            function (Rotation_7_1) {
                Rotation_7 = Rotation_7_1;
            }
        ],
        execute: function () {
            Lever = class Lever extends Object2D_33.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_25.ObjectPhysics().signal({
                        position: Vector2_56.Vector2.zero,
                        inputs: Rotation_7.Rotations.none,
                        outputs: Rotation_7.Rotations.all,
                    });
                    const sprite = Sprite_13.Sprite.parseSimple('⫰⫯');
                    sprite.frames["0"][0].color('black');
                    sprite.frames["0"][0].background('gray');
                    sprite.frames["1"][0].color('yellow');
                    sprite.frames["1"][0].background('gray');
                    super(Vector2_56.Vector2.zero, sprite.frames["1"][0], physics, Vector2_56.Vector2.from(options.position));
                    this._isOn = false;
                    this._sprite = sprite;
                    this.type = "lever";
                    this.setAction(ctx => ctx.obj.toggle());
                    this.setOn(false);
                }
                processSignalTransfer(transfers) {
                    if (!this._isOn) {
                        return [];
                    }
                    return Rotation_7.Rotations.all.map(x => ({ rotation: x, signal: { type: "mind", value: 1 } }));
                }
                toggle() {
                    this.setOn(!this._isOn);
                }
                setOn(isOn) {
                    this._isOn = isOn;
                    const frameIndex = Number(this._isOn).toString();
                    this.skin = this._sprite.frames[frameIndex][0];
                }
            };
            exports_128("Lever", Lever);
        }
    };
});
System.register("world/objects/signals/PipeT", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation"], function (exports_129, context_129) {
    "use strict";
    var ObjectPhysics_26, Vector2_57, Sprite_14, Object2D_34, CompositeObjectSkin_6, Rotation_8, PipeT;
    var __moduleName = context_129 && context_129.id;
    return {
        setters: [
            function (ObjectPhysics_26_1) {
                ObjectPhysics_26 = ObjectPhysics_26_1;
            },
            function (Vector2_57_1) {
                Vector2_57 = Vector2_57_1;
            },
            function (Sprite_14_1) {
                Sprite_14 = Sprite_14_1;
            },
            function (Object2D_34_1) {
                Object2D_34 = Object2D_34_1;
            },
            function (CompositeObjectSkin_6_1) {
                CompositeObjectSkin_6 = CompositeObjectSkin_6_1;
            },
            function (Rotation_8_1) {
                Rotation_8 = Rotation_8_1;
            }
        ],
        execute: function () {
            PipeT = class PipeT extends Object2D_34.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_26.ObjectPhysics().signal({
                        position: Vector2_57.Vector2.zero,
                        inputs: [Rotation_8.Rotations.forward, Rotation_8.Rotations.left, Rotation_8.Rotations.right],
                        outputs: [Rotation_8.Rotations.forward, Rotation_8.Rotations.left, Rotation_8.Rotations.right],
                    });
                    const sprite = Sprite_14.Sprite.parseSimple('╠╦╣╩');
                    const indicatorSprite = Sprite_14.Sprite.parseSimple('├┬┤┴');
                    super(Vector2_57.Vector2.zero, sprite.frames["0"][0], physics, Vector2_57.Vector2.from(options.position));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this.type = "pipe_t";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const signalCell = this.physics.signalCells[0];
                    const outputs = transfers
                        .filter(x => signalCell.inputs.includes(Rotation_8.Rotations.normalize(x.rotation)))
                        .flatMap(transfer => {
                        return Rotation_8.Rotations.all
                            .filter(x => !Rotation_8.Rotations.equals(x, Rotation_8.Rotations.back))
                            .map(x => Rotation_8.Rotations.normalize(transfer.rotation + x + Rotation_8.Rotations.opposite))
                            .map(outputDirection => ({ rotation: outputDirection, signal: transfer.signal }));
                    })
                        .filter(x => signalCell.outputs.includes(x.rotation));
                    this.resetSkin(outputs.length > 0);
                    return outputs;
                }
                resetSkin(isHighlighted = false) {
                    const frameName = Rotation_8.Rotations.normalize(this.rotation).toString();
                    const pipeFrame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0].color(isHighlighted ? 'white' : 'black');
                    this.skin = new CompositeObjectSkin_6.CompositeObjectSkin([pipeFrame, indicatorFrame]);
                }
            };
            exports_129("PipeT", PipeT);
        }
    };
});
System.register("world/objects/signals/PipeX", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation"], function (exports_130, context_130) {
    "use strict";
    var ObjectPhysics_27, Vector2_58, Sprite_15, Object2D_35, CompositeObjectSkin_7, Rotation_9, PipeX;
    var __moduleName = context_130 && context_130.id;
    return {
        setters: [
            function (ObjectPhysics_27_1) {
                ObjectPhysics_27 = ObjectPhysics_27_1;
            },
            function (Vector2_58_1) {
                Vector2_58 = Vector2_58_1;
            },
            function (Sprite_15_1) {
                Sprite_15 = Sprite_15_1;
            },
            function (Object2D_35_1) {
                Object2D_35 = Object2D_35_1;
            },
            function (CompositeObjectSkin_7_1) {
                CompositeObjectSkin_7 = CompositeObjectSkin_7_1;
            },
            function (Rotation_9_1) {
                Rotation_9 = Rotation_9_1;
            }
        ],
        execute: function () {
            PipeX = class PipeX extends Object2D_35.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_27.ObjectPhysics().signal({
                        position: Vector2_58.Vector2.zero,
                        inputs: Rotation_9.Rotations.all,
                        outputs: Rotation_9.Rotations.all,
                    });
                    const innerSprite = Sprite_15.Sprite.parseSimple('┼');
                    const indicatorSkin = innerSprite.frames["0"][0];
                    const sprite = Sprite_15.Sprite.parseSimple('╬');
                    const pipeSkin = sprite.frames["0"][0];
                    super(Vector2_58.Vector2.zero, new CompositeObjectSkin_7.CompositeObjectSkin([pipeSkin, indicatorSkin]), physics, Vector2_58.Vector2.from(options.position));
                    this.type = "pipe_x";
                    this._indicatorSkin = indicatorSkin;
                }
                processSignalTransfer(transfers) {
                    const outputs = transfers
                        .flatMap(transfer => {
                        return Rotation_9.Rotations.all
                            .filter(x => !Rotation_9.Rotations.equals(x, Rotation_9.Rotations.back))
                            .map(x => Rotation_9.Rotations.normalize(transfer.rotation + x + Rotation_9.Rotations.opposite))
                            .map(x => ({ rotation: x, signal: transfer.signal }));
                    });
                    this.resetSkin(outputs.length > 0);
                    return outputs;
                }
                resetSkin(isHighlighted = false) {
                    this._indicatorSkin.color(isHighlighted ? 'white' : 'black');
                }
            };
            exports_130("PipeX", PipeX);
        }
    };
});
System.register("world/levels/signalLightsLevel", ["engine/Level", "world/objects/door", "engine/data/Tiles", "world/objects/signals/Invertor", "world/objects/signals/Pipe", "world/objects/signals/Lever", "world/objects/signals/LightSource", "engine/math/Vector2", "world/objects/signals/PipeT", "world/objects/signals/PipeX", "utils/color", "engine/math/Rotation"], function (exports_131, context_131) {
    "use strict";
    var Level_10, door_10, Tiles_10, Invertor_1, Pipe_1, Lever_1, LightSource_2, Vector2_59, PipeT_1, PipeX_1, color_3, Rotation_10, fences, width, height, elements, doors, objects, signalLightsLevel;
    var __moduleName = context_131 && context_131.id;
    return {
        setters: [
            function (Level_10_1) {
                Level_10 = Level_10_1;
            },
            function (door_10_1) {
                door_10 = door_10_1;
            },
            function (Tiles_10_1) {
                Tiles_10 = Tiles_10_1;
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
            function (LightSource_2_1) {
                LightSource_2 = LightSource_2_1;
            },
            function (Vector2_59_1) {
                Vector2_59 = Vector2_59_1;
            },
            function (PipeT_1_1) {
                PipeT_1 = PipeT_1_1;
            },
            function (PipeX_1_1) {
                PipeX_1 = PipeX_1_1;
            },
            function (color_3_1) {
                color_3 = color_3_1;
            },
            function (Rotation_10_1) {
                Rotation_10 = Rotation_10_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 20;
            height = 20;
            if (true) { // add signal pipes
                const padding = 2;
                const center = new Vector2_59.Vector2(9, 9);
                for (let x = padding + 1; x < width - padding - 1; x++) {
                    fences.push(new PipeT_1.PipeT({ position: [x, padding] }).rotate(Rotation_10.Rotations.left));
                    fences.push(new PipeT_1.PipeT({ position: [x, height - padding - 1] }).rotate(Rotation_10.Rotations.right));
                    const angleTop = new Vector2_59.Vector2(x, padding - 1).sub(center).angle;
                    fences.push(new LightSource_2.LightSource({ position: [x, padding - 1], color: color_3.hslToRgb(angleTop, 100, 50) }));
                    const angleBottom = new Vector2_59.Vector2(x, height - (padding - 1) - 1).sub(center).angle;
                    fences.push(new LightSource_2.LightSource({ position: [x, height - (padding - 1) - 1], color: color_3.hslToRgb(angleBottom, 100, 50) }));
                }
                for (let y = 1 + padding; y < height - padding - 1; y++) {
                    fences.push(new PipeT_1.PipeT({ position: [padding, y] }).rotate(Rotation_10.Rotations.back));
                    fences.push(new PipeT_1.PipeT({ position: [width - padding - 1, y] }).rotate(Rotation_10.Rotations.forward));
                    const angleLeft = new Vector2_59.Vector2(padding - 1, y).sub(center).angle;
                    fences.push(new LightSource_2.LightSource({ position: [padding - 1, y], color: color_3.hslToRgb(angleLeft, 100, 50) }));
                    const angleRight = new Vector2_59.Vector2(width - (padding - 1) - 1, y).sub(center).angle;
                    fences.push(new LightSource_2.LightSource({ position: [width - (padding - 1) - 1, y], color: color_3.hslToRgb(angleRight, 100, 50) }));
                }
                fences.push(new PipeX_1.PipeX({ position: [padding, padding] }));
                fences.push(new PipeX_1.PipeX({ position: [width - padding - 1, padding] }));
                fences.push(new PipeX_1.PipeX({ position: [padding, height - padding - 1] }));
                fences.push(new PipeX_1.PipeX({ position: [width - padding - 1, height - padding - 1] }));
            }
            fences = fences.filter(x => !x.position.equals(new Vector2_59.Vector2(9, 2)) && !x.position.equals(new Vector2_59.Vector2(10, 2)));
            elements = [
                new Lever_1.Lever({ position: [9, 4] }),
                new Pipe_1.Pipe({ position: [9, 3] }).rotate(),
                new PipeX_1.PipeX({ position: [9, 2] }),
                new Invertor_1.Invertor({ position: [10, 2] }).rotate(Rotation_10.Rotations.back),
            ];
            doors = [
                door_10.door('signal_lights', { position: [9, 9] }),
            ];
            objects = [...fences, ...doors, ...elements];
            exports_131("signalLightsLevel", signalLightsLevel = new class extends Level_10.Level {
                constructor() {
                    super('signalLights', objects, Tiles_10.Tiles.createEmpty(new Vector2_59.Vector2(width, height)));
                    this.weather.wind = new Vector2_59.Vector2(1, 1);
                }
            }());
        }
    };
});
System.register("world/objects/signals/detectors/LightDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation"], function (exports_132, context_132) {
    "use strict";
    var Object2D_36, ObjectSkin_31, ObjectPhysics_28, Vector2_60, Rotation_11, LightDetector;
    var __moduleName = context_132 && context_132.id;
    return {
        setters: [
            function (Object2D_36_1) {
                Object2D_36 = Object2D_36_1;
            },
            function (ObjectSkin_31_1) {
                ObjectSkin_31 = ObjectSkin_31_1;
            },
            function (ObjectPhysics_28_1) {
                ObjectPhysics_28 = ObjectPhysics_28_1;
            },
            function (Vector2_60_1) {
                Vector2_60 = Vector2_60_1;
            },
            function (Rotation_11_1) {
                Rotation_11 = Rotation_11_1;
            }
        ],
        execute: function () {
            LightDetector = class LightDetector extends Object2D_36.Object2D {
                constructor(options) {
                    const skin = new ObjectSkin_31.ObjectSkin().char(`☀`).color('black').background('gray');
                    const physics = new ObjectPhysics_28.ObjectPhysics().signal({
                        position: Vector2_60.Vector2.zero,
                        inputs: Rotation_11.Rotations.none,
                        outputs: Rotation_11.Rotations.all,
                    });
                    super(Vector2_60.Vector2.zero, skin, physics, Vector2_60.Vector2.from(options.position));
                    this.type = "light_detector";
                }
                processSignalTransfer(transfers) {
                    const lightInfoAt = this.scene.lights.getLightInfoAt(this.position);
                    const lightLevelAt = (lightInfoAt === null || lightInfoAt === void 0 ? void 0 : lightInfoAt.intensity) || 0;
                    const lightSignalLevel = (lightLevelAt >= 10) ? 1 : 0;
                    this.setEnabled(lightSignalLevel > 0);
                    return Rotation_11.Rotations.all.map(x => ({ rotation: x, signal: { type: "light", value: lightSignalLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? 'white' : 'black');
                }
            };
            exports_132("LightDetector", LightDetector);
        }
    };
});
System.register("world/objects/signals/detectors/WeatherDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation"], function (exports_133, context_133) {
    "use strict";
    var Object2D_37, ObjectSkin_32, ObjectPhysics_29, Vector2_61, Rotation_12, WeatherDetector;
    var __moduleName = context_133 && context_133.id;
    return {
        setters: [
            function (Object2D_37_1) {
                Object2D_37 = Object2D_37_1;
            },
            function (ObjectSkin_32_1) {
                ObjectSkin_32 = ObjectSkin_32_1;
            },
            function (ObjectPhysics_29_1) {
                ObjectPhysics_29 = ObjectPhysics_29_1;
            },
            function (Vector2_61_1) {
                Vector2_61 = Vector2_61_1;
            },
            function (Rotation_12_1) {
                Rotation_12 = Rotation_12_1;
            }
        ],
        execute: function () {
            WeatherDetector = class WeatherDetector extends Object2D_37.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_29.ObjectPhysics().signal({
                        position: Vector2_61.Vector2.zero,
                        inputs: Rotation_12.Rotations.none,
                        outputs: Rotation_12.Rotations.all,
                    });
                    super(Vector2_61.Vector2.zero, new ObjectSkin_32.ObjectSkin().char(`🗲`).color('black').background('gray'), physics, Vector2_61.Vector2.from(options.position));
                    this.type = "weather_detector";
                }
                processSignalTransfer(transfers) {
                    const weatherAt = this.scene.weather.getWeatherInfoAt(this.position).weatherType;
                    const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : 0;
                    this.setEnabled(weatherLevel > 0);
                    return Rotation_12.Rotations.all.map(x => ({ rotation: x, signal: { type: "weather", value: weatherLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? 'cyan' : 'black');
                }
            };
            exports_133("WeatherDetector", WeatherDetector);
        }
    };
});
System.register("world/objects/signals/detectors/LifeDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation"], function (exports_134, context_134) {
    "use strict";
    var Object2D_38, ObjectSkin_33, ObjectPhysics_30, Vector2_62, Rotation_13, LifeDetector;
    var __moduleName = context_134 && context_134.id;
    return {
        setters: [
            function (Object2D_38_1) {
                Object2D_38 = Object2D_38_1;
            },
            function (ObjectSkin_33_1) {
                ObjectSkin_33 = ObjectSkin_33_1;
            },
            function (ObjectPhysics_30_1) {
                ObjectPhysics_30 = ObjectPhysics_30_1;
            },
            function (Vector2_62_1) {
                Vector2_62 = Vector2_62_1;
            },
            function (Rotation_13_1) {
                Rotation_13 = Rotation_13_1;
            }
        ],
        execute: function () {
            LifeDetector = class LifeDetector extends Object2D_38.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_30.ObjectPhysics().signal({
                        position: Vector2_62.Vector2.zero,
                        inputs: Rotation_13.Rotations.none,
                        outputs: Rotation_13.Rotations.all,
                    });
                    super(Vector2_62.Vector2.zero, new ObjectSkin_33.ObjectSkin().char(`🙑`).color('black').background('gray'), physics, Vector2_62.Vector2.from(options.position));
                    this.type = "life_detector";
                }
                processSignalTransfer(transfers) {
                    const npcsAt = [
                        this.scene.getNpcAt(this.position),
                        ...Vector2_62.Vector2.directions
                            .map(x => this.position.clone().add(x))
                            .map(x => this.scene.getNpcAt(x))
                    ];
                    const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : 0;
                    this.setEnabled(lifeLevel > 0);
                    return Rotation_13.Rotations.all.map(x => ({ rotation: x, signal: { type: "life", value: lifeLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? 'lime' : 'black');
                }
            };
            exports_134("LifeDetector", LifeDetector);
        }
    };
});
System.register("world/objects/signals/detectors/FireDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation"], function (exports_135, context_135) {
    "use strict";
    var Object2D_39, ObjectSkin_34, ObjectPhysics_31, Vector2_63, Rotation_14, FireDetector;
    var __moduleName = context_135 && context_135.id;
    return {
        setters: [
            function (Object2D_39_1) {
                Object2D_39 = Object2D_39_1;
            },
            function (ObjectSkin_34_1) {
                ObjectSkin_34 = ObjectSkin_34_1;
            },
            function (ObjectPhysics_31_1) {
                ObjectPhysics_31 = ObjectPhysics_31_1;
            },
            function (Vector2_63_1) {
                Vector2_63 = Vector2_63_1;
            },
            function (Rotation_14_1) {
                Rotation_14 = Rotation_14_1;
            }
        ],
        execute: function () {
            FireDetector = class FireDetector extends Object2D_39.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_31.ObjectPhysics().signal({
                        position: Vector2_63.Vector2.zero,
                        inputs: Rotation_14.Rotations.none,
                        outputs: Rotation_14.Rotations.all,
                    });
                    super(Vector2_63.Vector2.zero, new ObjectSkin_34.ObjectSkin().char(`㊋`).color('black').background('gray'), physics, Vector2_63.Vector2.from(options.position));
                    this.type = "fire_detector";
                }
                processSignalTransfer(transfers) {
                    const temperatureAt = this.scene.weather.getWeatherInfoAt(this.position).temperature;
                    const temperatureLevel = (temperatureAt >= 8) ? 1 : 0;
                    this.setEnabled(temperatureLevel > 0);
                    return Rotation_14.Rotations.all.map(x => ({ rotation: x, signal: { type: "fire", value: temperatureLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? 'red' : 'black');
                }
            };
            exports_135("FireDetector", FireDetector);
        }
    };
});
System.register("engine/objects/Group", ["engine/objects/Object2D"], function (exports_136, context_136) {
    "use strict";
    var Object2D_40, Group;
    var __moduleName = context_136 && context_136.id;
    return {
        setters: [
            function (Object2D_40_1) {
                Object2D_40 = Object2D_40_1;
            }
        ],
        execute: function () {
            Group = class Group extends Object2D_40.Object2D {
                constructor() {
                    super();
                    this.type = "group";
                }
            };
            exports_136("Group", Group);
        }
    };
});
System.register("world/levels/signalsLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/signals/detectors/LightDetector", "world/objects/signals/Invertor", "world/objects/signals/Pipe", "world/objects/signals/Lever", "world/objects/signals/detectors/WeatherDetector", "world/objects/signals/detectors/LifeDetector", "world/objects/signals/detectors/FireDetector", "world/objects/signals/LightSource", "engine/math/Vector2", "engine/math/Color", "engine/objects/Group"], function (exports_137, context_137) {
    "use strict";
    var Level_11, fence_7, door_11, Tiles_11, LightDetector_1, Invertor_2, Pipe_2, Lever_2, WeatherDetector_1, LifeDetector_1, FireDetector_1, LightSource_3, Vector2_64, Color_10, Group_1, fences, width, height, elements, doors, objects, signalsLevel;
    var __moduleName = context_137 && context_137.id;
    return {
        setters: [
            function (Level_11_1) {
                Level_11 = Level_11_1;
            },
            function (fence_7_1) {
                fence_7 = fence_7_1;
            },
            function (door_11_1) {
                door_11 = door_11_1;
            },
            function (Tiles_11_1) {
                Tiles_11 = Tiles_11_1;
            },
            function (LightDetector_1_1) {
                LightDetector_1 = LightDetector_1_1;
            },
            function (Invertor_2_1) {
                Invertor_2 = Invertor_2_1;
            },
            function (Pipe_2_1) {
                Pipe_2 = Pipe_2_1;
            },
            function (Lever_2_1) {
                Lever_2 = Lever_2_1;
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
            function (LightSource_3_1) {
                LightSource_3 = LightSource_3_1;
            },
            function (Vector2_64_1) {
                Vector2_64 = Vector2_64_1;
            },
            function (Color_10_1) {
                Color_10 = Color_10_1;
            },
            function (Group_1_1) {
                Group_1 = Group_1_1;
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
                new Group_1.Group()
                    .translateX(11)
                    .translateY(3)
                    .add(new LightSource_3.LightSource({ position: [2, 0], color: new Color_10.Color(0, 1, 0), intensity: 'B', }))
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new Lever_2.Lever({ position: [0, 0] })),
                //
                new LifeDetector_1.LifeDetector({ position: [12, 6] }),
                new WeatherDetector_1.WeatherDetector({ position: [8, 8] }),
                new FireDetector_1.FireDetector({ position: [6, 6] }),
                //
                new Group_1.Group()
                    .translateX(11)
                    .translateY(10)
                    .add(new LightDetector_1.LightDetector({ position: [-2, 0] }))
                    .add(new Pipe_2.Pipe({ position: [-1, 0] }))
                    .add(new Invertor_2.Invertor())
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new LightSource_3.LightSource({ position: [2, 0], color: new Color_10.Color(1, 1, 1), intensity: 'B', }))
                    .add(new Pipe_2.Pipe({ position: [0, 1] }).rotate())
                    .add(new Lever_2.Lever({ position: [0, 2] })),
                // Parent-children rotations example:
                new Group_1.Group()
                    .translateX(3)
                    .translateY(15)
                    .rotate(1)
                    .add(new LightSource_3.LightSource({ position: [2, 0], color: new Color_10.Color(0, 1, 0), intensity: 'B', }))
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new Lever_2.Lever({ position: [0, 0] }))
            ];
            doors = [
                door_11.door('signals', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...elements];
            exports_137("signalsLevel", signalsLevel = new class extends Level_11.Level {
                constructor() {
                    super('signals', objects, Tiles_11.Tiles.createEmpty(new Vector2_64.Vector2(width, height)));
                    this.weather.wind = new Vector2_64.Vector2(1, 1);
                }
            }());
        }
    };
});
System.register("world/npcs/turtle", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_138, context_138) {
    "use strict";
    var Npc_10, ObjectSkin_35, MountBehavior_2, NpcMovementOptions_5, Turtle;
    var __moduleName = context_138 && context_138.id;
    return {
        setters: [
            function (Npc_10_1) {
                Npc_10 = Npc_10_1;
            },
            function (ObjectSkin_35_1) {
                ObjectSkin_35 = ObjectSkin_35_1;
            },
            function (MountBehavior_2_1) {
                MountBehavior_2 = MountBehavior_2_1;
            },
            function (NpcMovementOptions_5_1) {
                NpcMovementOptions_5 = NpcMovementOptions_5_1;
            }
        ],
        execute: function () {
            Turtle = class Turtle extends Npc_10.Npc {
                constructor(position) {
                    super(new ObjectSkin_35.ObjectSkin().char(`🐢`), position);
                    this.type = "turtle";
                    this.movementOptions = NpcMovementOptions_5.defaultMovementOptions.amphibious;
                    this.behaviors.push(new MountBehavior_2.MountBehavior(this));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const turtle = this;
                    //
                    // update skin
                    if (turtle.parameters["isMounted"]) {
                        turtle.skin.background("#FFFF0055");
                    }
                    else {
                        turtle.skin.background("#FF00FF55");
                    }
                }
            };
            exports_138("Turtle", Turtle);
        }
    };
});
System.register("world/npcs/deer", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/math/Vector2"], function (exports_139, context_139) {
    "use strict";
    var Npc_11, ObjectSkin_36, MountBehavior_3, Vector2_65, Deer;
    var __moduleName = context_139 && context_139.id;
    function deer(options) {
        return new Deer(Vector2_65.Vector2.from(options.position));
    }
    exports_139("deer", deer);
    return {
        setters: [
            function (Npc_11_1) {
                Npc_11 = Npc_11_1;
            },
            function (ObjectSkin_36_1) {
                ObjectSkin_36 = ObjectSkin_36_1;
            },
            function (MountBehavior_3_1) {
                MountBehavior_3 = MountBehavior_3_1;
            },
            function (Vector2_65_1) {
                Vector2_65 = Vector2_65_1;
            }
        ],
        execute: function () {
            Deer = class Deer extends Npc_11.Npc {
                constructor(position) {
                    super(new ObjectSkin_36.ObjectSkin().char(`🦌`), position);
                    this.type = "deer";
                    this.movementOptions = {
                        walkingSpeed: 10,
                        swimmingSpeed: 1,
                    };
                    this.behaviors.push(new MountBehavior_3.MountBehavior(this));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const deer = this;
                    //
                    // update skin
                    if (deer.parameters["isMounted"]) {
                        deer.skin.background("#FFFF0055");
                    }
                    else {
                        deer.skin.background("#FF00FF55");
                    }
                }
            };
            exports_139("Deer", Deer);
        }
    };
});
System.register("world/npcs/snail", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior"], function (exports_140, context_140) {
    "use strict";
    var Npc_12, ObjectSkin_37, MountBehavior_4, Snail;
    var __moduleName = context_140 && context_140.id;
    return {
        setters: [
            function (Npc_12_1) {
                Npc_12 = Npc_12_1;
            },
            function (ObjectSkin_37_1) {
                ObjectSkin_37 = ObjectSkin_37_1;
            },
            function (MountBehavior_4_1) {
                MountBehavior_4 = MountBehavior_4_1;
            }
        ],
        execute: function () {
            Snail = class Snail extends Npc_12.Npc {
                constructor(position) {
                    super(new ObjectSkin_37.ObjectSkin().char(`🐌`), position);
                    this.type = "snail";
                    this.movementOptions = {
                        climbingSpeed: 1,
                        walkingSpeed: 1,
                    };
                    this.behaviors.push(new MountBehavior_4.MountBehavior(this));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const snail = this;
                    //
                    // update skin
                    if (snail.parameters["isMounted"]) {
                        snail.skin.background("#FFFF0055");
                    }
                    else {
                        snail.skin.background("#FF00FF55");
                    }
                }
            };
            exports_140("Snail", Snail);
        }
    };
});
System.register("world/npcs/Fish", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions"], function (exports_141, context_141) {
    "use strict";
    var Npc_13, ObjectSkin_38, WanderingBehavior_5, NpcMovementOptions_6, Fish;
    var __moduleName = context_141 && context_141.id;
    return {
        setters: [
            function (Npc_13_1) {
                Npc_13 = Npc_13_1;
            },
            function (ObjectSkin_38_1) {
                ObjectSkin_38 = ObjectSkin_38_1;
            },
            function (WanderingBehavior_5_1) {
                WanderingBehavior_5 = WanderingBehavior_5_1;
            },
            function (NpcMovementOptions_6_1) {
                NpcMovementOptions_6 = NpcMovementOptions_6_1;
            }
        ],
        execute: function () {
            Fish = class Fish extends Npc_13.Npc {
                constructor(position) {
                    super(new ObjectSkin_38.ObjectSkin().char(`🐟`), position);
                    this.type = "fish";
                    this.realm = "water";
                    this.movementOptions = NpcMovementOptions_6.defaultMovementOptions.waterborne;
                    this.behaviors.push(new WanderingBehavior_5.WanderingBehavior());
                }
            };
            exports_141("Fish", Fish);
        }
    };
});
System.register("world/npcs/Ghost", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior"], function (exports_142, context_142) {
    "use strict";
    var Npc_14, ObjectSkin_39, WanderingBehavior_6, Ghost;
    var __moduleName = context_142 && context_142.id;
    return {
        setters: [
            function (Npc_14_1) {
                Npc_14 = Npc_14_1;
            },
            function (ObjectSkin_39_1) {
                ObjectSkin_39 = ObjectSkin_39_1;
            },
            function (WanderingBehavior_6_1) {
                WanderingBehavior_6 = WanderingBehavior_6_1;
            }
        ],
        execute: function () {
            Ghost = class Ghost extends Npc_14.Npc {
                constructor(position) {
                    super(new ObjectSkin_39.ObjectSkin().char(`👻`), position);
                    this.type = "ghost";
                    this.realm = "soul";
                    this.movementOptions = {
                        flyingSpeed: 4,
                    };
                    this.behaviors.push(new WanderingBehavior_6.WanderingBehavior());
                }
            };
            exports_142("Ghost", Ghost);
        }
    };
});
System.register("world/npcs/Dragon", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions"], function (exports_143, context_143) {
    "use strict";
    var Npc_15, ObjectSkin_40, MountBehavior_5, NpcMovementOptions_7, Dragon;
    var __moduleName = context_143 && context_143.id;
    return {
        setters: [
            function (Npc_15_1) {
                Npc_15 = Npc_15_1;
            },
            function (ObjectSkin_40_1) {
                ObjectSkin_40 = ObjectSkin_40_1;
            },
            function (MountBehavior_5_1) {
                MountBehavior_5 = MountBehavior_5_1;
            },
            function (NpcMovementOptions_7_1) {
                NpcMovementOptions_7 = NpcMovementOptions_7_1;
            }
        ],
        execute: function () {
            Dragon = class Dragon extends Npc_15.Npc {
                constructor(position) {
                    super(new ObjectSkin_40.ObjectSkin().char(`🐉`), position);
                    this.type = "dragon";
                    this.movementOptions = NpcMovementOptions_7.defaultMovementOptions.flying;
                    this.behaviors.push(new MountBehavior_5.MountBehavior(this));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const dragon = this;
                    //
                    // update skin
                    if (dragon.parameters["isMounted"]) {
                        dragon.skin.background("#FFFF0055");
                    }
                    else {
                        dragon.skin.background("#FF00FF55");
                    }
                }
            };
            exports_143("Dragon", Dragon);
        }
    };
});
System.register("world/npcs/Monkey", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "world/items"], function (exports_144, context_144) {
    "use strict";
    var Npc_16, ObjectSkin_41, WanderingBehavior_7, items_6, Monkey;
    var __moduleName = context_144 && context_144.id;
    return {
        setters: [
            function (Npc_16_1) {
                Npc_16 = Npc_16_1;
            },
            function (ObjectSkin_41_1) {
                ObjectSkin_41 = ObjectSkin_41_1;
            },
            function (WanderingBehavior_7_1) {
                WanderingBehavior_7 = WanderingBehavior_7_1;
            },
            function (items_6_1) {
                items_6 = items_6_1;
            }
        ],
        execute: function () {
            Monkey = class Monkey extends Npc_16.Npc {
                constructor(position) {
                    super(new ObjectSkin_41.ObjectSkin().char(`🐒`), position);
                    this.type = "monkey";
                    this.behaviors.push(new WanderingBehavior_7.WanderingBehavior());
                    const aLamp = items_6.lamp();
                    this.inventory.items.push(aLamp);
                    this.equipment.equip(aLamp);
                }
            };
            exports_144("Monkey", Monkey);
        }
    };
});
System.register("world/levels/terrain", ["engine/Level", "world/objects/door", "engine/data/Tiles", "world/npcs/turtle", "world/npcs/deer", "world/npcs/snail", "world/tiles", "world/npcs/Fish", "world/npcs/Ghost", "world/npcs/bee", "world/npcs/Dragon", "world/npcs/Monkey", "engine/math/Vector2"], function (exports_145, context_145) {
    "use strict";
    var Level_12, door_12, Tiles_12, turtle_1, deer_1, snail_1, tiles_3, Fish_1, Ghost_1, bee_2, Dragon_1, Monkey_1, Vector2_66, doors, mounts, npcs, objects, levelTiles, terrainLevel;
    var __moduleName = context_145 && context_145.id;
    return {
        setters: [
            function (Level_12_1) {
                Level_12 = Level_12_1;
            },
            function (door_12_1) {
                door_12 = door_12_1;
            },
            function (Tiles_12_1) {
                Tiles_12 = Tiles_12_1;
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
            function (tiles_3_1) {
                tiles_3 = tiles_3_1;
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
            function (Vector2_66_1) {
                Vector2_66 = Vector2_66_1;
            }
        ],
        execute: function () {
            doors = [
                door_12.door('terrain_door', { position: [2, 2] }),
            ];
            mounts = [
                new turtle_1.Turtle(Vector2_66.Vector2.from([3, 5])),
                new turtle_1.Turtle(Vector2_66.Vector2.from([9, 7])),
                new deer_1.Deer(Vector2_66.Vector2.from([2, 5])),
                new deer_1.Deer(Vector2_66.Vector2.from([3, 18])),
                new snail_1.Snail(Vector2_66.Vector2.from([1, 1])),
                new Dragon_1.Dragon(Vector2_66.Vector2.from([2, 6])),
            ];
            npcs = [
                new Fish_1.Fish(Vector2_66.Vector2.from([15, 8])),
                new Fish_1.Fish(Vector2_66.Vector2.from([8, 4])),
                new bee_2.Bee(Vector2_66.Vector2.from([3, 15])),
                new Ghost_1.Ghost(Vector2_66.Vector2.from([8, 14])),
                new Monkey_1.Monkey(Vector2_66.Vector2.from([6, 15])),
            ];
            objects = [...doors, ...mounts, ...npcs];
            levelTiles = Tiles_12.Tiles.parseTiles(`                                 
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
                'M': tiles_3.tiles.mountain,
                'w': tiles_3.tiles.water,
                'W': tiles_3.tiles.water_deep,
                's': tiles_3.tiles.sand,
            });
            exports_145("terrainLevel", terrainLevel = new Level_12.Level('terrain', objects, levelTiles));
        }
    };
});
System.register("world/objects/particles/VolcanicGasMist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle"], function (exports_146, context_146) {
    "use strict";
    var ObjectSkin_42, Sprite_16, Particle_6, VolcanicGasMist;
    var __moduleName = context_146 && context_146.id;
    return {
        setters: [
            function (ObjectSkin_42_1) {
                ObjectSkin_42 = ObjectSkin_42_1;
            },
            function (Sprite_16_1) {
                Sprite_16 = Sprite_16_1;
            },
            function (Particle_6_1) {
                Particle_6 = Particle_6_1;
            }
        ],
        execute: function () {
            VolcanicGasMist = class VolcanicGasMist extends Particle_6.Particle {
                constructor(position) {
                    const sprite = new Sprite_16.Sprite();
                    const skin = new ObjectSkin_42.ObjectSkin().background('#a002');
                    sprite.frames[Particle_6.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "volcanic_gas_mist";
                }
            };
            exports_146("VolcanicGasMist", VolcanicGasMist);
        }
    };
});
System.register("world/sprites/darkSmokeSprite", ["engine/data/Sprite"], function (exports_147, context_147) {
    "use strict";
    var Sprite_17, darkSmokeSpriteRaw, darkSmokeSprite;
    var __moduleName = context_147 && context_147.id;
    return {
        setters: [
            function (Sprite_17_1) {
                Sprite_17 = Sprite_17_1;
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
            exports_147("darkSmokeSprite", darkSmokeSprite = Sprite_17.Sprite.parse(darkSmokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/DarkSmoke", ["engine/math/Vector2", "engine/objects/Particle", "world/sprites/darkSmokeSprite"], function (exports_148, context_148) {
    "use strict";
    var Vector2_67, Particle_7, darkSmokeSprite_1, DarkSmoke;
    var __moduleName = context_148 && context_148.id;
    return {
        setters: [
            function (Vector2_67_1) {
                Vector2_67 = Vector2_67_1;
            },
            function (Particle_7_1) {
                Particle_7 = Particle_7_1;
            },
            function (darkSmokeSprite_1_1) {
                darkSmokeSprite_1 = darkSmokeSprite_1_1;
            }
        ],
        execute: function () {
            DarkSmoke = class DarkSmoke extends Particle_7.Particle {
                constructor(position, state = 0) {
                    super(darkSmokeSprite_1.darkSmokeSprite, position, state);
                    this.type = DarkSmoke.ParticleType;
                }
                onNext() {
                    var _a;
                    const scene = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene;
                    const particles = scene.particlesObject;
                    spread(this);
                    function spread(particle) {
                        if (!particle.hasNext()) {
                            return;
                        }
                        const particlePos = particle.position;
                        const newState = particle.state + 1;
                        const newPositions = Vector2_67.Vector2.directions
                            .map(x => particlePos.clone().add(x));
                        for (const newPosition of newPositions) {
                            spreadTo(newPosition, newState);
                        }
                    }
                    function spreadTo(newPosition, newState) {
                        const particle = particles.getParticleAt(newPosition);
                        if (!particle) {
                            particles.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                        else if (particle.type === DarkSmoke.ParticleType && particle.state > newState) {
                            particles.remove(particle);
                            particles.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                        else {
                            particles.tryAddParticle(new DarkSmoke(newPosition, newState));
                        }
                    }
                }
            };
            exports_148("DarkSmoke", DarkSmoke);
            DarkSmoke.ParticleType = "dark_smoke";
        }
    };
});
System.register("world/objects/volcanicMouth", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/math/Vector2", "engine/objects/Object2D", "world/objects/particles/DarkSmoke"], function (exports_149, context_149) {
    "use strict";
    var ObjectPhysics_32, ObjectSkin_43, Vector2_68, Object2D_41, DarkSmoke_1, VolcanicMouth;
    var __moduleName = context_149 && context_149.id;
    function volcanicMouth(options) {
        return new VolcanicMouth(Vector2_68.Vector2.from(options.position));
    }
    exports_149("volcanicMouth", volcanicMouth);
    return {
        setters: [
            function (ObjectPhysics_32_1) {
                ObjectPhysics_32 = ObjectPhysics_32_1;
            },
            function (ObjectSkin_43_1) {
                ObjectSkin_43 = ObjectSkin_43_1;
            },
            function (Vector2_68_1) {
                Vector2_68 = Vector2_68_1;
            },
            function (Object2D_41_1) {
                Object2D_41 = Object2D_41_1;
            },
            function (DarkSmoke_1_1) {
                DarkSmoke_1 = DarkSmoke_1_1;
            }
        ],
        execute: function () {
            VolcanicMouth = class VolcanicMouth extends Object2D_41.Object2D {
                constructor(position) {
                    super(Vector2_68.Vector2.zero, new ObjectSkin_43.ObjectSkin().background('darkred'), new ObjectPhysics_32.ObjectPhysics().light('8').temperature('F'), position);
                    this.smokeTicks = 0;
                    this.type = "volcanic_mouth";
                }
                update(ticks) {
                    super.update(ticks);
                    this.smokeTicks += ticks;
                    const smokeTicksOverflow = this.smokeTicks - 2000;
                    if (smokeTicksOverflow >= 0) {
                        const _ = this.scene.particlesObject.tryAddParticle(new DarkSmoke_1.DarkSmoke(this.position));
                        this.smokeTicks = smokeTicksOverflow;
                    }
                }
            };
            exports_149("VolcanicMouth", VolcanicMouth);
        }
    };
});
System.register("world/objects/volcano", ["engine/objects/Object2D", "engine/data/ObjectSkinBuilder", "engine/data/ObjectPhysicsBuilder", "engine/math/Vector2"], function (exports_150, context_150) {
    "use strict";
    var Object2D_42, ObjectSkinBuilder_8, ObjectPhysicsBuilder_4, Vector2_69;
    var __moduleName = context_150 && context_150.id;
    function volcano(options) {
        return new Object2D_42.Object2D(new Vector2_69.Vector2(0, 2), new ObjectSkinBuilder_8.ObjectSkinBuilder(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: ["black", "darkred"],
            o: ["black", "saddlebrown"]
        }).build(), new ObjectPhysicsBuilder_4.ObjectPhysicsBuilder(`        
 ...... 
........`).build(), Vector2_69.Vector2.from(options.position));
    }
    exports_150("volcano", volcano);
    return {
        setters: [
            function (Object2D_42_1) {
                Object2D_42 = Object2D_42_1;
            },
            function (ObjectSkinBuilder_8_1) {
                ObjectSkinBuilder_8 = ObjectSkinBuilder_8_1;
            },
            function (ObjectPhysicsBuilder_4_1) {
                ObjectPhysicsBuilder_4 = ObjectPhysicsBuilder_4_1;
            },
            function (Vector2_69_1) {
                Vector2_69 = Vector2_69_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/volcanicLevel", ["engine/Level", "world/objects/fence", "world/objects/door", "engine/data/Tiles", "world/objects/particles/VolcanicGasMist", "world/objects/volcanicMouth", "world/objects/volcano", "engine/math/Vector2"], function (exports_151, context_151) {
    "use strict";
    var Level_13, fence_8, door_13, Tiles_13, VolcanicGasMist_1, volcanicMouth_1, volcano_1, Vector2_70, fences, width, height, trees, volcanoes, fires, doors, objects, volcanicLevel;
    var __moduleName = context_151 && context_151.id;
    return {
        setters: [
            function (Level_13_1) {
                Level_13 = Level_13_1;
            },
            function (fence_8_1) {
                fence_8 = fence_8_1;
            },
            function (door_13_1) {
                door_13 = door_13_1;
            },
            function (Tiles_13_1) {
                Tiles_13 = Tiles_13_1;
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
            function (Vector2_70_1) {
                Vector2_70 = Vector2_70_1;
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
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([12, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([12, 13])),
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([13, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([13, 13])),
                //
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([10, 5])),
                new volcanicMouth_1.VolcanicMouth(Vector2_70.Vector2.from([3, 16])),
            ];
            doors = [
                door_13.door('volcanic', { position: [2, 2] }),
            ];
            objects = [...fences, ...doors, ...trees, ...volcanoes, ...fires];
            exports_151("volcanicLevel", volcanicLevel = new class extends Level_13.Level {
                constructor() {
                    super('volcanic', objects, Tiles_13.Tiles.createEmpty(new Vector2_70.Vector2(width, height)));
                    this.weather.wind = new Vector2_70.Vector2(1, 0);
                }
                onLoaded() {
                    super.onLoaded();
                    this.fillGasMist(this);
                    this.weather.changeWeather("ashfall");
                }
                update(ticks) {
                    super.update(ticks);
                    this.fillGasMist(this);
                }
                fillGasMist(scene) {
                    const box = scene.windBox;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const p = new Vector2_70.Vector2(x, y);
                            if (scene.particlesObject.isParticlePositionBlocked(p)) {
                                continue;
                            }
                            scene.particlesObject.tryAddParticle(new VolcanicGasMist_1.VolcanicGasMist(p));
                        }
                    }
                }
            }());
        }
    };
});
System.register("world/levels/levels", ["world/levels/devHub", "world/levels/dungeon", "world/levels/ggj2020demo/level", "world/levels/house", "world/levels/intro", "world/levels/lights", "world/levels/mistlandLevel", "world/levels/particlesLevel", "world/levels/sheep", "world/levels/signalLightsLevel", "world/levels/signalsLevel", "world/levels/terrain", "world/levels/volcanicLevel"], function (exports_152, context_152) {
    "use strict";
    var devHub_1, dungeon_1, level_1, house_7, intro_1, lights_1, mistlandLevel_1, particlesLevel_1, sheep_3, signalLightsLevel_1, signalsLevel_1, terrain_1, volcanicLevel_1, dict, rawLevels, levels;
    var __moduleName = context_152 && context_152.id;
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
            function (signalLightsLevel_1_1) {
                signalLightsLevel_1 = signalLightsLevel_1_1;
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
            dict = { devHubLevel: devHub_1.devHubLevel, introLevel: intro_1.introLevel, lightsLevel: lights_1.lightsLevel, sheepLevel: sheep_3.sheepLevel, level: level_1.level, dungeonLevel: dungeon_1.dungeonLevel, houseLevel: house_7.houseLevel, terrainLevel: terrain_1.terrainLevel, particlesLevel: particlesLevel_1.particlesLevel, mistlandLevel: mistlandLevel_1.mistlandLevel, volcanicLevel: volcanicLevel_1.volcanicLevel, signalsLevel: signalsLevel_1.signalsLevel, signalLightsLevel: signalLightsLevel_1.signalLightsLevel };
            exports_152("rawLevels", rawLevels = dict);
            exports_152("levels", levels = {});
            for (const item of Object.values(dict)) {
                levels[item.name] = item;
            }
        }
    };
});
System.register("utils/misc", ["engine/data/ObjectSkinBuilder", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_153, context_153) {
    "use strict";
    var ObjectSkinBuilder_9, Object2D_43, ObjectPhysics_33, Vector2_71;
    var __moduleName = context_153 && context_153.id;
    function createTextObjectSkin(text, color, background) {
        const textSkin = new ObjectSkinBuilder_9.ObjectSkinBuilder(text, ''.padEnd(text.length, '.'), { '.': [color, background] }).build();
        return textSkin;
    }
    exports_153("createTextObjectSkin", createTextObjectSkin);
    function createTextObject(text, pos) {
        const skin = createTextObjectSkin(text);
        const t = new Object2D_43.Object2D(Vector2_71.Vector2.zero, skin, new ObjectPhysics_33.ObjectPhysics(), pos);
        t.type = "victory_text_object";
        return t;
    }
    exports_153("createTextObject", createTextObject);
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
    exports_153("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkinBuilder_9_1) {
                ObjectSkinBuilder_9 = ObjectSkinBuilder_9_1;
            },
            function (Object2D_43_1) {
                Object2D_43 = Object2D_43_1;
            },
            function (ObjectPhysics_33_1) {
                ObjectPhysics_33 = ObjectPhysics_33_1;
            },
            function (Vector2_71_1) {
                Vector2_71 = Vector2_71_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/events/LoadLevelGameEvent", ["engine/events/GameEvent"], function (exports_154, context_154) {
    "use strict";
    var GameEvent_12, LoadLevelGameEvent;
    var __moduleName = context_154 && context_154.id;
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
            })(LoadLevelGameEvent || (exports_154("LoadLevelGameEvent", LoadLevelGameEvent = {})));
        }
    };
});
System.register("world/events/TeleportToPositionGameEvent", ["engine/events/GameEvent"], function (exports_155, context_155) {
    "use strict";
    var GameEvent_13, TeleportToPositionGameEvent;
    var __moduleName = context_155 && context_155.id;
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
            })(TeleportToPositionGameEvent || (exports_155("TeleportToPositionGameEvent", TeleportToPositionGameEvent = {})));
        }
    };
});
System.register("ui/UIText", ["utils/misc", "ui/UIElement"], function (exports_156, context_156) {
    "use strict";
    var misc_1, UIElement_6, UIText;
    var __moduleName = context_156 && context_156.id;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (UIElement_6_1) {
                UIElement_6 = UIElement_6_1;
            }
        ],
        execute: function () {
            UIText = class UIText extends UIElement_6.UIElement {
                constructor(parent, text = '', color, background) {
                    super(parent);
                    this.text = text;
                    this.color = color;
                    this.background = background;
                    this.skin = misc_1.createTextObjectSkin(text, color, background);
                }
            };
            exports_156("UIText", UIText);
        }
    };
});
System.register("ui/UIItem", ["engine/math/Vector2", "engine/graphics/Cell", "ui/UIElement", "ui/UISceneObject", "ui/UIText", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_157, context_157) {
    "use strict";
    var Vector2_72, Cell_8, UIElement_7, UISceneObject_2, UIText_1, ObjectSkin_44, Grid_16, UIItem;
    var __moduleName = context_157 && context_157.id;
    return {
        setters: [
            function (Vector2_72_1) {
                Vector2_72 = Vector2_72_1;
            },
            function (Cell_8_1) {
                Cell_8 = Cell_8_1;
            },
            function (UIElement_7_1) {
                UIElement_7 = UIElement_7_1;
            },
            function (UISceneObject_2_1) {
                UISceneObject_2 = UISceneObject_2_1;
            },
            function (UIText_1_1) {
                UIText_1 = UIText_1_1;
            },
            function (ObjectSkin_44_1) {
                ObjectSkin_44 = ObjectSkin_44_1;
            },
            function (Grid_16_1) {
                Grid_16 = Grid_16_1;
            }
        ],
        execute: function () {
            UIItem = class UIItem extends UIElement_7.UIElement {
                constructor(parent, item, position) {
                    super(parent);
                    this.item = item;
                    this.isSelected = false;
                    this.position = position;
                    this.uiObject = new UISceneObject_2.UISceneObject(this, item);
                    this.uiText = new UIText_1.UIText(this, item.type, 'white', 'transparent');
                    this.uiText.position = new Vector2_72.Vector2(1, 0);
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createBackground();
                }
                createBackground() {
                    const cells = [];
                    const actualWidth = 1 + this.uiText.text.length;
                    for (let x = 0; x < actualWidth; x++) {
                        // TODO: fix cell borders render.
                        const borders = [
                            'white',
                            x === actualWidth - 1 ? 'white' : '',
                            'white',
                            x === 0 ? 'white' : ''
                        ];
                        const cell = new Cell_8.Cell(' ', undefined, this.isSelected ? 'gray' : 'transparent');
                        cells.push(cell);
                    }
                    return new ObjectSkin_44.ObjectSkin(Grid_16.Grid.from([cells]));
                }
            };
            exports_157("UIItem", UIItem);
        }
    };
});
System.register("ui/UIEquipment", ["engine/math/Vector2", "engine/graphics/Cell", "ui/UIElement", "engine/components/ObjectSkin", "engine/math/Grid"], function (exports_158, context_158) {
    "use strict";
    var Vector2_73, Cell_9, UIElement_8, ObjectSkin_45, Grid_17, UIEquipment;
    var __moduleName = context_158 && context_158.id;
    return {
        setters: [
            function (Vector2_73_1) {
                Vector2_73 = Vector2_73_1;
            },
            function (Cell_9_1) {
                Cell_9 = Cell_9_1;
            },
            function (UIElement_8_1) {
                UIElement_8 = UIElement_8_1;
            },
            function (ObjectSkin_45_1) {
                ObjectSkin_45 = ObjectSkin_45_1;
            },
            function (Grid_17_1) {
                Grid_17 = Grid_17_1;
            }
        ],
        execute: function () {
            UIEquipment = class UIEquipment extends UIElement_8.UIElement {
                constructor(parent, object, uiItems) {
                    super(parent);
                    this.object = object;
                    this.uiItems = uiItems;
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createEquipmentSkin();
                }
                createEquipmentSkin() {
                    const defaultCell = new Cell_9.Cell(' ', undefined, 'transparent');
                    const cells = new Grid_17.Grid(new Vector2_73.Vector2(1, this.uiItems.length))
                        .fill(v => createEquipmentCell(this.uiItems[v.y].item, this.object) || defaultCell);
                    return new ObjectSkin_45.ObjectSkin(cells);
                    function createEquipmentCell(item, object) {
                        if (item === object.equipment.objectInMainHand) {
                            return new Cell_9.Cell('✋', undefined, 'transparent');
                        }
                        else if (item === object.equipment.objectWearable) {
                            return new Cell_9.Cell('👕', undefined, 'transparent');
                        }
                        return undefined;
                    }
                }
            };
            exports_158("UIEquipment", UIEquipment);
        }
    };
});
System.register("ui/UIDialog", ["controls", "engine/math/Vector2", "ui/UIElement", "ui/UIPanel"], function (exports_159, context_159) {
    "use strict";
    var controls_1, Vector2_74, UIElement_9, UIPanel_2, UIDialog;
    var __moduleName = context_159 && context_159.id;
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (Vector2_74_1) {
                Vector2_74 = Vector2_74_1;
            },
            function (UIElement_9_1) {
                UIElement_9 = UIElement_9_1;
            },
            function (UIPanel_2_1) {
                UIPanel_2 = UIPanel_2_1;
            }
        ],
        execute: function () {
            UIDialog = class UIDialog extends UIElement_9.UIElement {
                constructor(size, parent = null) {
                    super(parent);
                    this.close();
                    this.uiPanel = new UIPanel_2.UIPanel(this, new Vector2_74.Vector2(), size);
                }
                handleControls() {
                    if (controls_1.Controls.Escape.isDown && !controls_1.Controls.Escape.isHandled) {
                        this.close();
                        controls_1.Controls.Escape.isHandled = true;
                    }
                }
                open() {
                    this.enabled = true;
                    this.visible = true;
                }
                close() {
                    this.enabled = false;
                    this.visible = false;
                }
            };
            exports_159("UIDialog", UIDialog);
        }
    };
});
System.register("ui/UIInventory", ["controls", "engine/math/Vector2", "engine/objects/Npc", "ui/UIItem", "ui/UIEquipment", "ui/UIDialog"], function (exports_160, context_160) {
    "use strict";
    var controls_2, Vector2_75, Npc_17, UIItem_1, UIEquipment_1, UIDialog_1, UIInventory;
    var __moduleName = context_160 && context_160.id;
    return {
        setters: [
            function (controls_2_1) {
                controls_2 = controls_2_1;
            },
            function (Vector2_75_1) {
                Vector2_75 = Vector2_75_1;
            },
            function (Npc_17_1) {
                Npc_17 = Npc_17_1;
            },
            function (UIItem_1_1) {
                UIItem_1 = UIItem_1_1;
            },
            function (UIEquipment_1_1) {
                UIEquipment_1 = UIEquipment_1_1;
            },
            function (UIDialog_1_1) {
                UIDialog_1 = UIDialog_1_1;
            }
        ],
        execute: function () {
            UIInventory = class UIInventory extends UIDialog_1.UIDialog {
                get selectedItem() {
                    return this.uiItems[this.selectedItemIndex].item;
                }
                constructor(object, camera) {
                    const dialogWidth = camera.size.width;
                    const dialogHeight = camera.size.height / 2 - 3;
                    const position = new Vector2_75.Vector2(0, camera.size.height - dialogHeight);
                    const size = new Vector2_75.Vector2(dialogWidth, dialogHeight);
                    super(size, null);
                    this.object = object;
                    this.camera = camera;
                    this.uiItems = [];
                    this.selectedItemIndex = -1;
                    this.position = position;
                    this.uiEquipment = new UIEquipment_1.UIEquipment(this.uiPanel, object, this.uiItems);
                    this.selectedItemIndex = 0;
                }
                handleControls() {
                    super.handleControls();
                    const prevSelectedIndex = this.selectedItemIndex;
                    if (controls_2.Controls.Down.isDown && !controls_2.Controls.Down.isHandled) {
                        this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, this.uiItems.length - 1);
                        controls_2.Controls.Down.isHandled = true;
                    }
                    if (controls_2.Controls.Up.isDown && !controls_2.Controls.Up.isHandled) {
                        this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
                        controls_2.Controls.Up.isHandled = true;
                    }
                    if (controls_2.Controls.Interact.isDown && !controls_2.Controls.Interact.isHandled) {
                        if (this.object instanceof Npc_17.Npc) {
                            this.object.equipment.equip(this.selectedItem);
                        }
                        controls_2.Controls.Interact.isHandled = true;
                    }
                    if (controls_2.Controls.Inventory.isDown && !controls_2.Controls.Inventory.isHandled) {
                        this.close();
                        controls_2.Controls.Inventory.isHandled = true;
                    }
                    if (prevSelectedIndex != this.selectedItemIndex) {
                        this.uiItems[prevSelectedIndex].isSelected = false;
                        this.uiItems[this.selectedItemIndex].isSelected = true;
                    }
                }
                refresh() {
                    this.uiItems = [];
                    for (const child of [...this.uiPanel.children]) {
                        this.uiPanel.remove(child);
                    }
                    let index = 0;
                    for (const item of this.object.inventory.items) {
                        const uiItem = new UIItem_1.UIItem(this.uiPanel, item, new Vector2_75.Vector2(2, 1 + index));
                        uiItem.isSelected = index === this.selectedItemIndex;
                        this.uiItems.push(uiItem);
                        index += 1;
                    }
                    this.uiEquipment.removeFromParent();
                    this.uiEquipment = new UIEquipment_1.UIEquipment(this.uiPanel, this.object, this.uiItems);
                    this.uiEquipment.position = new Vector2_75.Vector2(1, 1);
                }
            };
            exports_160("UIInventory", UIInventory);
        }
    };
});
System.register("engine/cameras/FollowCamera", ["engine/math/Vector2", "engine/cameras/Camera"], function (exports_161, context_161) {
    "use strict";
    var Vector2_76, Camera_1, FollowCamera;
    var __moduleName = context_161 && context_161.id;
    return {
        setters: [
            function (Vector2_76_1) {
                Vector2_76 = Vector2_76_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            }
        ],
        execute: function () {
            FollowCamera = class FollowCamera extends Camera_1.Camera {
                constructor(_followObject, boundingSize) {
                    super();
                    this._followObject = _followObject;
                    this.boundingSize = boundingSize;
                    this._followObject = _followObject;
                    this.boundingSize = boundingSize;
                }
                update() {
                    super.update();
                    const cameraRightBottom = this.position.clone().add(this.size).sub(new Vector2_76.Vector2(1, 1));
                    const leftRel = this._followObject.position.x - this.position.x;
                    if (leftRel < Camera_1.followOffset) {
                        this.position.x = (Math.max(0, this._followObject.position.x - Camera_1.followOffset));
                    }
                    const topRel = this._followObject.position.y - this.position.y;
                    if (topRel < Camera_1.followOffset) {
                        this.position.y = (Math.max(0, this._followObject.position.y - Camera_1.followOffset));
                    }
                    const rightRel = cameraRightBottom.x - this._followObject.position.x;
                    if (rightRel < Camera_1.followOffset) {
                        this.position.x = (Math.min(this.boundingSize.width - this.size.width, this._followObject.position.x - (this.size.width - 1) + Camera_1.followOffset));
                    }
                    const bottomRel = cameraRightBottom.y - this._followObject.position.y;
                    if (bottomRel < Camera_1.followOffset) {
                        this.position.y = (Math.min(this.boundingSize.height - this.size.height, this._followObject.position.y - (this.size.height - 1) + Camera_1.followOffset));
                    }
                    if (cameraRightBottom.x > this.boundingSize.width) {
                        this.position.x = (this.boundingSize.width - this.size.width);
                    }
                    if (cameraRightBottom.y > this.boundingSize.height) {
                        this.position.y = (this.boundingSize.height - this.size.height);
                    }
                }
            };
            exports_161("FollowCamera", FollowCamera);
        }
    };
});
System.register("engine/renderers/CanvasRenderer", ["utils/math", "engine/cameras/FollowCamera", "engine/math/Box2", "engine/math/Vector2", "engine/math/Rotation"], function (exports_162, context_162) {
    "use strict";
    var math_8, FollowCamera_1, Box2_3, Vector2_77, Rotation_15, CanvasRenderer;
    var __moduleName = context_162 && context_162.id;
    function renderSort(a, b) {
        if (a.renderOrder !== b.renderOrder) {
            return a.renderOrder - b.renderOrder;
        }
        else /*if (a.position.y !== b.position.y)*/ {
            return a.position.y - b.position.y;
        }
    }
    return {
        setters: [
            function (math_8_1) {
                math_8 = math_8_1;
            },
            function (FollowCamera_1_1) {
                FollowCamera_1 = FollowCamera_1_1;
            },
            function (Box2_3_1) {
                Box2_3 = Box2_3_1;
            },
            function (Vector2_77_1) {
                Vector2_77 = Vector2_77_1;
            },
            function (Rotation_15_1) {
                Rotation_15 = Rotation_15_1;
            }
        ],
        execute: function () {
            CanvasRenderer = class CanvasRenderer {
                constructor(canvas, ctx) {
                    this.canvas = canvas;
                    this.ctx = ctx;
                }
                render(scene, camera) {
                    const renderList = this.getSceneRenderList(scene);
                    renderList.sort(renderSort);
                    this.renderObjects(renderList, scene, camera);
                }
                getSceneRenderList(scene) {
                    const allObjects = [];
                    scene.traverseVisible(x => allObjects.push(x));
                    return allObjects;
                }
                renderObjects(objects, scene, camera) {
                    for (const object of objects) {
                        this.renderObject(object, scene, camera);
                        // TODO: move to updates.
                        // reset object highlight.
                        object.highlighted = false;
                    }
                }
                renderObject(object, scene, camera) {
                    const importantObjects = scene.children.filter(x => x.important);
                    const objects = importantObjects.filter(x => x !== object.parent);
                    const isInFrontOfAnyObject = this.isInFrontOfAnyObject(object, objects);
                    const { width, height } = object.skin.size;
                    const cameraBox = new Box2_3.Box2(new Vector2_77.Vector2(), camera.size.clone().sub(new Vector2_77.Vector2(1, 1)));
                    const skinPos = new Vector2_77.Vector2();
                    for (skinPos.y = 0; skinPos.y < height; skinPos.y++) {
                        for (skinPos.x = 0; skinPos.x < width; skinPos.x++) {
                            const levelPos = object.position.clone().sub(object.originPoint).add(skinPos);
                            const resultPos = levelPos.clone().sub(camera.position);
                            if (!cameraBox.containsPoint(resultPos)) {
                                continue;
                            }
                            const cells = object.skin.getCellsAt(skinPos).filter(x => !x.isEmpty);
                            const extraOpacity = getExtraPositionalOpacity(skinPos);
                            const extraBorder = this.getExtraCellBorders(object, skinPos);
                            const cellInfos = cells.map(cell => ({ cell, extraOpacity, extraBorder }));
                            this.ctx.add(object.layer, resultPos, cellInfos);
                        }
                    }
                    function getExtraPositionalOpacity(skinPos) {
                        if (object.layer === "objects") {
                            const objectOpacity = isObjectPositionTransparent(skinPos) ? 0.2 : 1;
                            return objectOpacity;
                        }
                        else if (object.layer === "particles") {
                            return getParticleOpacity();
                        }
                        return 1;
                    }
                    function isObjectPositionTransparent(skinPos) {
                        return (isInFrontOfAnyObject &&
                            !object.physics.collisions.find(x => x.equals(skinPos)));
                    }
                    function getParticleOpacity() {
                        if (!(camera instanceof FollowCamera_1.FollowCamera)) {
                            return 1;
                        }
                        if (!camera._followObject) {
                            return 1;
                        }
                        const distance = camera._followObject.position.distanceTo(object.position);
                        const fullVisibilityRange = 1.2;
                        if (distance < fullVisibilityRange) {
                            return 0.2;
                        }
                        const distanceKoef = 0.2;
                        const transparency = math_8.clamp(Math.sqrt(distance * distanceKoef), 0, 1);
                        return transparency;
                    }
                }
                getExtraCellBorders(obj, position) {
                    if (!obj.highlighted) {
                        return [];
                    }
                    const entries = Rotation_15.Rotations.all
                        .map(x => {
                        const dir = Vector2_77.Vector2.right.rotate(x);
                        const pos = position.clone().add(dir);
                        const borderColor = obj.skin.isEmptyCellAt(pos) ? obj.highlighColor : undefined;
                        return [x, borderColor];
                    })
                        .filter(x => x[1]);
                    return Object.fromEntries(entries);
                }
                isPositionBehindTheObject(object, position) {
                    const resultPos = position.clone().sub(object.position).add(object.originPoint);
                    return !object.skin.isEmptyCellAt(resultPos);
                }
                isInFrontOfAnyObject(object, objects) {
                    for (const o of objects.filter(o => o.renderOrder <= object.renderOrder)) {
                        if (this.isPositionBehindTheObject(object, o.position)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
            exports_162("CanvasRenderer", CanvasRenderer);
        }
    };
});
System.register("main", ["engine/events/GameEvent", "engine/events/EventLoop", "engine/ActionData", "engine/graphics/cellStyle", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "engine/weather/WeatherType", "world/levels/levels", "world/events/TeleportToEndpointGameEvent", "controls", "world/events/MountGameEvent", "world/events/PlayerMessageGameEvent", "world/events/AddObjectGameEvent", "world/events/TransferItemsGameEvent", "utils/misc", "world/events/LoadLevelGameEvent", "world/events/RemoveObjectGameEvent", "world/events/TeleportToPositionGameEvent", "ui/UIInventory", "ui/UIDialog", "engine/math/Vector2", "world/levels/signalLightsLevel", "engine/renderers/CanvasRenderer", "engine/cameras/Camera", "UI", "engine/cameras/FollowCamera"], function (exports_163, context_163) {
    "use strict";
    var GameEvent_14, EventLoop_10, ActionData_3, cellStyle_2, CanvasContext_1, hero_1, playerUi_1, WeatherType_1, levels_1, TeleportToEndpointGameEvent_2, controls_3, MountGameEvent_2, PlayerMessageGameEvent_2, AddObjectGameEvent_2, TransferItemsGameEvent_3, misc_2, LoadLevelGameEvent_1, RemoveObjectGameEvent_3, TeleportToPositionGameEvent_1, UIInventory_1, UIDialog_2, Vector2_78, signalLightsLevel_2, CanvasRenderer_1, Camera_2, UI_1, FollowCamera_2, canvas, ctx, renderer, camera, ui, dialog, uiInventory, Game, game, scene, debug, canvasPosition, heroUi, ticksPerStep, startTime;
    var __moduleName = context_163 && context_163.id;
    function loadLevel(level) {
        scene = level;
        hero_1.hero.position = new Vector2_78.Vector2(9, 7);
        camera = new FollowCamera_2.FollowCamera(hero_1.hero, level.size);
        level.onLoaded();
    }
    function teleportToEndpoint(portalId, teleport, object) {
        const portalPositions = scene.portals[portalId];
        if ((portalPositions === null || portalPositions === void 0 ? void 0 : portalPositions.length) === 2) {
            // Pair portal is on the same level.
            const portalPositionIndex = portalPositions.findIndex(x => x.equals(teleport.position));
            const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
            teleportTo(scene.name, pairPortalPosition.clone().add(new Vector2_78.Vector2(0, 1)));
        }
        else {
            // Find other level with this portal id.
            const pairPortals = Object.entries(levels_1.levels)
                .filter(([levelId, _]) => levelId !== scene.name)
                .filter(([___, level]) => { var _a; return ((_a = level.portals[portalId]) === null || _a === void 0 ? void 0 : _a.length) === 1; })
                .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0] }));
            if ((pairPortals === null || pairPortals === void 0 ? void 0 : pairPortals.length) !== 0) {
                const pairPortal = pairPortals[0];
                teleportTo(pairPortal.levelId, pairPortal.position.clone().add(new Vector2_78.Vector2(0, 1)));
            }
            else {
                console.log(`Pair portal for "${portalId}" was not found.`);
            }
        }
        function teleportTo(levelId, position) {
            if (levelId !== scene.name) {
                selectLevel(scene, levels_1.levels[levelId]);
            }
            EventLoop_10.emitEvent(TeleportToPositionGameEvent_1.TeleportToPositionGameEvent.create(object, position));
        }
    }
    function selectLevel(prevLevel, level) {
        console.log(`Selecting level "${level.name}".`);
        if (prevLevel) {
            EventLoop_10.emitEvent(RemoveObjectGameEvent_3.RemoveObjectGameEvent.create(hero_1.hero));
        }
        EventLoop_10.emitEvent(LoadLevelGameEvent_1.LoadLevelGameEvent.create(level));
        EventLoop_10.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(hero_1.hero));
    }
    function handleControls() {
        // TODO: opened dialogs stack?
        if (dialog.enabled) {
            dialog.handleControls();
        }
        else if (uiInventory.enabled) {
            uiInventory.handleControls();
        }
        else {
            handleSceneControls();
        }
    }
    function handleSceneControls() {
        const controlObject = hero_1.hero;
        let doMove = false;
        if (controls_3.Controls.Up.isDown) {
            controlObject.direction = Vector2_78.Vector2.top;
            doMove = !controls_3.Controls.Up.isShiftDown;
        }
        else if (controls_3.Controls.Down.isDown) {
            controlObject.direction = Vector2_78.Vector2.bottom;
            doMove = !controls_3.Controls.Down.isShiftDown;
        }
        else if (controls_3.Controls.Left.isDown) {
            controlObject.direction = Vector2_78.Vector2.left;
            doMove = !controls_3.Controls.Left.isShiftDown;
        }
        else if (controls_3.Controls.Right.isDown) {
            controlObject.direction = Vector2_78.Vector2.right;
            doMove = !controls_3.Controls.Right.isShiftDown;
        }
        if (doMove) {
            if (!scene.isPositionBlocked(controlObject.cursorPosition)) {
                controlObject.move();
            }
        }
        if (controls_3.Controls.Inventory.isDown && !controls_3.Controls.Inventory.isHandled) {
            uiInventory.refresh();
            uiInventory.open();
            controls_3.Controls.Inventory.isHandled = true;
        }
        else if (controls_3.Controls.Interact.isDown && !controls_3.Controls.Interact.isHandled) {
            interact();
            controls_3.Controls.Interact.isHandled = true;
        }
        if (controls_3.Controls.Equip.isDown && !controls_3.Controls.Equip.isHandled) {
            hero_1.hero.equipment.toggleEquip();
            controls_3.Controls.Equip.isHandled = true;
        }
        if (controls_3.Controls.DebugP.isDown && !controls_3.Controls.DebugP.isHandled) {
            debugToggleWind(controls_3.Controls.DebugP.isShiftDown);
            controls_3.Controls.DebugP.isHandled = true;
        }
        if (controls_3.Controls.DebugO.isDown && !controls_3.Controls.DebugO.isHandled) {
            debugProgressDay(controls_3.Controls.DebugO.isShiftDown ? 0.25 : 0.5);
            controls_3.Controls.DebugO.isHandled = true;
        }
    }
    function debugToggleWind(isShift) {
        // Iterates coordinate values: [-1, 0, 1].
        const oldWind = scene.weather.wind.clone();
        const index = isShift ? 1 : 0;
        const coord = scene.weather.wind.getAt(index);
        const newCoord = (coord === 1) ? -1 : coord + 1;
        scene.weather.wind.setAt(index, newCoord);
        EventLoop_10.emitEvent(new GameEvent_14.GameEvent("system", "wind_changed", {
            from: oldWind,
            to: scene.weather.wind,
        }));
    }
    function debugProgressDay(partOfTheDay) {
        scene.weather.gameTime += scene.weather.ticksPerDay * partOfTheDay;
        console.log(`Changed time of the day to ${scene.weather.gameTime} (${getDayTimePeriodName(scene.weather.gameTime)}).`);
        function getDayTimePeriodName(ticks) {
            const dayTime = ticks % scene.weather.ticksPerDay;
            if (dayTime < scene.weather.ticksPerDay * 0.25) {
                return "Midnight";
            }
            else if (dayTime < scene.weather.ticksPerDay * 0.5) {
                return "Morning";
            }
            else if (dayTime < scene.weather.ticksPerDay * 0.75) {
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
    function createDialog(camera) {
        // background
        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        const uiPanel = new UIDialog_2.UIDialog(new Vector2_78.Vector2(dialogWidth, dialogHeight))
            .translateY(camera.size.height - dialogHeight);
        return uiPanel;
    }
    function onInterval() {
        handleControls();
        const elapsedTime = new Date().getMilliseconds() - startTime.getMilliseconds();
        startTime = new Date();
        const ticksMillis = Math.max(0, elapsedTime);
        game.update(ticksMillis);
        EventLoop_10.eventLoop([game, scene, ...scene.children]);
        game.draw();
    }
    return {
        setters: [
            function (GameEvent_14_1) {
                GameEvent_14 = GameEvent_14_1;
            },
            function (EventLoop_10_1) {
                EventLoop_10 = EventLoop_10_1;
            },
            function (ActionData_3_1) {
                ActionData_3 = ActionData_3_1;
            },
            function (cellStyle_2_1) {
                cellStyle_2 = cellStyle_2_1;
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
            function (WeatherType_1_1) {
                WeatherType_1 = WeatherType_1_1;
            },
            function (levels_1_1) {
                levels_1 = levels_1_1;
            },
            function (TeleportToEndpointGameEvent_2_1) {
                TeleportToEndpointGameEvent_2 = TeleportToEndpointGameEvent_2_1;
            },
            function (controls_3_1) {
                controls_3 = controls_3_1;
            },
            function (MountGameEvent_2_1) {
                MountGameEvent_2 = MountGameEvent_2_1;
            },
            function (PlayerMessageGameEvent_2_1) {
                PlayerMessageGameEvent_2 = PlayerMessageGameEvent_2_1;
            },
            function (AddObjectGameEvent_2_1) {
                AddObjectGameEvent_2 = AddObjectGameEvent_2_1;
            },
            function (TransferItemsGameEvent_3_1) {
                TransferItemsGameEvent_3 = TransferItemsGameEvent_3_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (LoadLevelGameEvent_1_1) {
                LoadLevelGameEvent_1 = LoadLevelGameEvent_1_1;
            },
            function (RemoveObjectGameEvent_3_1) {
                RemoveObjectGameEvent_3 = RemoveObjectGameEvent_3_1;
            },
            function (TeleportToPositionGameEvent_1_1) {
                TeleportToPositionGameEvent_1 = TeleportToPositionGameEvent_1_1;
            },
            function (UIInventory_1_1) {
                UIInventory_1 = UIInventory_1_1;
            },
            function (UIDialog_2_1) {
                UIDialog_2 = UIDialog_2_1;
            },
            function (Vector2_78_1) {
                Vector2_78 = Vector2_78_1;
            },
            function (signalLightsLevel_2_1) {
                signalLightsLevel_2 = signalLightsLevel_2_1;
            },
            function (CanvasRenderer_1_1) {
                CanvasRenderer_1 = CanvasRenderer_1_1;
            },
            function (Camera_2_1) {
                Camera_2 = Camera_2_1;
            },
            function (UI_1_1) {
                UI_1 = UI_1_1;
            },
            function (FollowCamera_2_1) {
                FollowCamera_2 = FollowCamera_2_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = new CanvasContext_1.CanvasContext(canvas);
            renderer = new CanvasRenderer_1.CanvasRenderer(canvas, ctx);
            // TODO: more ideas:
            // 1. 🎲 Game die, activate to randomize. ⚀⚁⚂⚃⚄⚅
            // 2. 🎄 Christmas tree with blinking color lights. 
            camera = new Camera_2.Camera();
            ui = new UI_1.UI(camera);
            dialog = createDialog(camera);
            ui.add(dialog);
            uiInventory = new UIInventory_1.UIInventory(hero_1.hero, camera);
            ui.add(uiInventory);
            Game = class Game {
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        dialog.open();
                    }
                    else if (ev.type === TransferItemsGameEvent_3.TransferItemsGameEvent.type) {
                        const args = ev.args;
                        args.recipient.inventory.addItems(args.items);
                        console.log(`${args.recipient.type} received ${args.items.length} items.`);
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
                        EventLoop_10.emitEvent(PlayerMessageGameEvent_2.PlayerMessageGameEvent.create(`${args.mounter.type} ${args.newState} ${args.mount.type}`));
                    }
                    else if (ev.type === PlayerMessageGameEvent_2.PlayerMessageGameEvent.type) {
                        // TODO: implement an actual player message in UI.
                        const args = ev.args;
                        const style = "color:steelblue;font-weight:bold;background-color:yellow";
                        console.log(`%c${args.message}`, style);
                    }
                    else if (ev.type === TransferItemsGameEvent_3.TransferItemsGameEvent.type) {
                        const args = ev.args;
                        if (args.items.find(x => x.type === "victory_item")) {
                            EventLoop_10.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(misc_2.createTextObject(`VICTORY!`, new Vector2_78.Vector2(6, 6))));
                        }
                    }
                    else if (ev.type === LoadLevelGameEvent_1.LoadLevelGameEvent.type) {
                        const args = ev.args;
                        loadLevel(args.level);
                        console.log(`Loaded scene ${args.level.name}.`);
                    }
                    else if (ev.type === AddObjectGameEvent_2.AddObjectGameEvent.type) {
                        const args = ev.args;
                        scene.add(args.object);
                        console.log(`${args.object.type} added to the scene ${scene.name}.`);
                    }
                    else if (ev.type === RemoveObjectGameEvent_3.RemoveObjectGameEvent.type) {
                        const args = ev.args;
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
                    camera.update();
                    ui.update(ticks);
                }
            };
            game = new Game();
            scene = signalLightsLevel_2.signalLightsLevel;
            debug = true;
            if (debug) {
                selectLevel(null, signalLightsLevel_2.signalLightsLevel);
                // TODO: this disables day progress for first level only.
                scene.debugDisableGameTime = true;
                debugProgressDay(0.5);
            }
            exports_163("canvasPosition", canvasPosition = new Vector2_78.Vector2((canvas.width - cellStyle_2.cellStyle.size.width * camera.size.width) / 2, (canvas.height - cellStyle_2.cellStyle.size.height * camera.size.height) / 2));
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, camera);
            ui.add(heroUi);
            controls_3.enableGameInput();
            ticksPerStep = 33;
            startTime = new Date();
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window._ = {
                selectLevel: selectLevel,
                levels: levels_1.rawLevels,
                weatherTypes: Object.fromEntries(WeatherType_1.weatherTypes.map(x => [x, x])),
                changeWeather: (x) => scene.weather.changeWeather(x),
                tick: {
                    freeze() {
                        console.log('Freezed signal tick updates.');
                        scene.debugTickFreeze = true;
                    },
                    unfreeze() {
                        console.log('Unfreezed signal ticking.');
                        scene.debugTickFreeze = false;
                    },
                    step(nSteps = 1) {
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
            };
        }
    };
});
System.register("world/objects/particles/WaterRipple", ["engine/objects/Particle", "world/sprites/waterRippleSprite"], function (exports_164, context_164) {
    "use strict";
    var Particle_8, waterRippleSprite_2, WaterRipple;
    var __moduleName = context_164 && context_164.id;
    return {
        setters: [
            function (Particle_8_1) {
                Particle_8 = Particle_8_1;
            },
            function (waterRippleSprite_2_1) {
                waterRippleSprite_2 = waterRippleSprite_2_1;
            }
        ],
        execute: function () {
            WaterRipple = class WaterRipple extends Particle_8.Particle {
                constructor(position, state = 0) {
                    super(waterRippleSprite_2.waterRippleSprite, position, state, { decaySpeed: 200, });
                    this.type = "waterripple";
                }
            };
            exports_164("WaterRipple", WaterRipple);
        }
    };
});
//# sourceMappingURL=app.js.map