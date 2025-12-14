System.register("controls", [], function (exports_1, context_1) {
    "use strict";
    var Controls;
    var __moduleName = context_1 && context_1.id;
    function create(code, area) {
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
            if (!o.area) {
                return;
            }
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
        if (!isTouchDevice()) {
            console.log('Enabled game input.');
            return;
        }
        console.log('Touch input is supported.');
        document.addEventListener("touchstart", ontouchstart);
        document.addEventListener("touchend", ontouchend);
    }
    exports_1("enableGameInput", enableGameInput);
    // event listeners
    // keyboard
    function onkeyup(ev) {
        const control = findControlByCode(ev.code);
        if (!control) {
            return;
        }
        control.isHandled = false;
        control.isDown = false;
        control.isShiftDown = false;
    }
    function onkeydown(ev) {
        const control = findControlByCode(ev.code);
        if (!control) {
            return;
        }
        control.isDown = true;
        control.isShiftDown = ev.shiftKey;
        // Prevent default browser actions for game controls
        ev.preventDefault();
    }
    // touch screen
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0));
    }
    function ontouchstart(ev) {
        for (let touchId = 0; touchId < ev.touches.length; touchId++) {
            const touch = ev.touches[touchId];
            const control = findControlByTouchArea(touch.clientX, touch.clientY);
            if (!control) {
                continue;
            }
            control.isDown = true;
            control.touchID = touchId;
        }
    }
    function ontouchend(ev) {
        for (let touchId = 0; touchId < ev.changedTouches.length; touchId++) {
            const control = findControlByTouchID(touchId);
            if (!control) {
                continue;
            }
            control.isHandled = false;
            control.isDown = false;
            control.touchID = -1;
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
                Target: create("KeyR"),
                Interact: create("Space", [25, 25, 75, 75]),
                //
                Equip: create("KeyQ", [0, 75, 25, 100]),
                Keys: create("KeyK"),
                DebugO: create("KeyO"),
                DebugP: create("KeyP"),
                DebugL: create("KeyL"),
                DebugF3: create("F3"),
            });
        }
    };
});
System.register("engine/events/GameEventHandler", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
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
System.register("engine/events/EventLoop", [], function (exports_4, context_4) {
    "use strict";
    var events;
    var __moduleName = context_4 && context_4.id;
    function eventLoop(handlers) {
        while (events.length > 0) {
            const ev = events.shift();
            if (!ev) {
                continue;
            }
            for (const obj of handlers) {
                obj.handleEvent(ev);
            }
        }
    }
    exports_4("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_4("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("utils/math", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    exports_5("clamp", clamp);
    // Cumulative moving average.
    function average(values) {
        return values.reduce((a, x, i) => a + (x - a) / (i + 1), 0);
    }
    exports_5("average", average);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/color", ["engine/math/Color", "utils/math"], function (exports_6, context_6) {
    "use strict";
    var Color_1, math_1;
    var __moduleName = context_6 && context_6.id;
    function numberToColor(val, max = 15, min = 0) {
        const length = max - min;
        const intVal = Math.round(val) | 0;
        const red = Math.round(intVal / length);
        const blue = Math.round((255 - red) / 255);
        return new Color_1.Color(red, 0, blue, 1);
    }
    exports_6("numberToColor", numberToColor);
    function rgbToHsl(r, g, b, a) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        // Lightness
        const l = (max + min) / 2;
        let h = 0;
        let s = 0;
        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));
            if (max === r) {
                h = ((g - b) / delta) % 6;
            }
            else if (max === g) {
                h = (b - r) / delta + 2;
            }
            else {
                h = (r - g) / delta + 4;
            }
            h *= 60;
            if (h < 0)
                h += 360;
        }
        return [h, s, l, a];
    }
    exports_6("rgbToHsl", rgbToHsl);
    function _clamp01(value) {
        return math_1.clamp(value, 0, 1);
    }
    function hslToRgb(h, s, l, a = 1) {
        // Clamp inputs first (defensive)
        h = ((h % 360) + 360) % 360;
        s = _clamp01(s);
        l = _clamp01(l);
        a = _clamp01(a);
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const hp = h / 60;
        const x = c * (1 - Math.abs((hp % 2) - 1));
        let r1 = 0, g1 = 0, b1 = 0;
        if (hp >= 0 && hp < 1) {
            r1 = c;
            g1 = x;
            b1 = 0;
        }
        else if (hp >= 1 && hp < 2) {
            r1 = x;
            g1 = c;
            b1 = 0;
        }
        else if (hp >= 2 && hp < 3) {
            r1 = 0;
            g1 = c;
            b1 = x;
        }
        else if (hp >= 3 && hp < 4) {
            r1 = 0;
            g1 = x;
            b1 = c;
        }
        else if (hp >= 4 && hp < 5) {
            r1 = x;
            g1 = 0;
            b1 = c;
        }
        else {
            r1 = c;
            g1 = 0;
            b1 = x;
        }
        const m = l - c / 2;
        return new Color_1.Color(_clamp01(r1 + m), _clamp01(g1 + m), _clamp01(b1 + m), a);
    }
    exports_6("hslToRgb", hslToRgb);
    function mixColors(colors) {
        const totalIntensity = math_1.clamp(colors.reduce((a, x) => a += x.intensity / 15, 0), 0, 1);
        const mixedColor = new Color_1.Color(math_1.clamp(colors.reduce((a, x) => a += x.color.r * (x.intensity / 15), 0) / totalIntensity, 0, 1), math_1.clamp(colors.reduce((a, x) => a += x.color.g * (x.intensity / 15), 0) / totalIntensity, 0, 1), math_1.clamp(colors.reduce((a, x) => a += x.color.b * (x.intensity / 15), 0) / totalIntensity, 0, 1));
        return mixedColor;
    }
    exports_6("mixColors", mixColors);
    return {
        setters: [
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (math_1_1) {
                math_1 = math_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/math/Color", ["utils/color", "utils/math"], function (exports_7, context_7) {
    "use strict";
    var color_1, math_2, Color;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (color_1_1) {
                color_1 = color_1_1;
            },
            function (math_2_1) {
                math_2 = math_2_1;
            }
        ],
        execute: function () {
            Color = class Color {
                constructor(r, g, b, a = 1) {
                    this.r = 1;
                    this.g = 1;
                    this.b = 1;
                    this.a = 1;
                    if (typeof r === "number" && typeof g === "number" && typeof b === "number" && typeof a === "number") {
                        this.setRGBA(r, g, b, a);
                    }
                    else if (typeof r === "number") {
                        this.setHex(r);
                    }
                    else if (typeof r === "string") {
                        const [rValue, gValue, bValue, aValue] = Color._hexStringToRGBA(r);
                        this.setRGBA(rValue, gValue, bValue, aValue);
                    }
                    else if (r instanceof Color) {
                        this.copy(r);
                    }
                }
                copy(c) {
                    this.r = c.r;
                    this.g = c.g;
                    this.b = c.b;
                    this.a = c.a;
                }
                equals(c) {
                    return (c.r === this.r &&
                        c.g === this.g &&
                        c.b === this.b &&
                        c.a === this.a);
                }
                setRGBA(r, g, b, a) {
                    if (r > 1 || g > 1 || b > 1 || a > 1) {
                        throw new Error(`Invalid color component: (${r},${g},${b},${a}).`);
                    }
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    this.a = a;
                }
                setHex(hex) {
                    hex = Math.floor(hex);
                    this.r = (hex >> 24 & 255) / 255;
                    this.g = (hex >> 16 & 255) / 255;
                    this.b = (hex >> 8 & 255) / 255;
                    this.a = (hex & 255) / 255;
                }
                getHex() {
                    return (Math.round(math_2.clamp(this.r * 255, 0, 255)) * 256 * 256 * 256 +
                        Math.round(math_2.clamp(this.g * 255, 0, 255)) * 256 * 256 +
                        Math.round(math_2.clamp(this.b * 255, 0, 255)) * 256 +
                        Math.round(math_2.clamp(this.a * 255, 0, 255)));
                }
                getHexString() {
                    return `#${this.getHex().toString(16)}`;
                }
                getLightness() {
                    const [_, __, l, ___] = color_1.rgbToHsl(this.r, this.g, this.b, this.a);
                    return l;
                }
                setLightness(lightness) {
                    const [h, s, _, a1] = color_1.rgbToHsl(this.r, this.g, this.b, this.a);
                    const [r, g, b, a2] = color_1.hslToRgb(h, s, lightness, a1);
                    this.setRGBA(r, g, b, a2);
                }
                setAlpha(alpha) {
                    this.a = alpha;
                    return this;
                }
                to() {
                    return [this.r, this.g, this.b, this.a];
                }
                getStyle() {
                    return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
                }
                *[Symbol.iterator]() {
                    yield this.r;
                    yield this.g;
                    yield this.b;
                    yield this.a;
                }
                static from(array, offset = 0) {
                    return new Color(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
                }
                static fromRGBA(r, g, b, a) {
                    return new Color(r, g, b, a);
                }
                static fromHexString(hex) {
                    const [r, g, b, a] = this._hexStringToRGBA(hex);
                    return new Color(r, g, b, a);
                }
                static _hexStringToRGBA(hex) {
                    if (!hex.startsWith("#")) {
                        throw new Error(`Invalid hex string: ${hex}.`);
                    }
                    hex = hex.replace(/^#/, "").toLowerCase();
                    if (![3, 4, 6, 8].includes(hex.length)) {
                        throw new Error("Invalid hex color length");
                    }
                    // Expand 3 or 4 digits to 6 or 8 digits.
                    if (hex.length === 3 || hex.length === 4) {
                        hex = hex.split("").map(ch => ch + ch).join("");
                    }
                    const r = parseInt(hex.slice(0, 2), 16) / 255;
                    const g = parseInt(hex.slice(2, 4), 16) / 255;
                    const b = parseInt(hex.slice(4, 6), 16) / 255;
                    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
                    return [r, g, b, a];
                }
            };
            exports_7("Color", Color);
        }
    };
});
System.register("engine/math/Rotation", [], function (exports_8, context_8) {
    "use strict";
    var forward, back, left, right, opposite, none, all, Rotations;
    var __moduleName = context_8 && context_8.id;
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
            exports_8("Rotations", Rotations = {
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
System.register("engine/math/Vector2", ["engine/math/Rotation"], function (exports_9, context_9) {
    "use strict";
    var Rotation_1, Vector2;
    var __moduleName = context_9 && context_9.id;
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
                copy(v) {
                    this.x = v.x;
                    this.y = v.y;
                    return this;
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
            exports_9("Vector2", Vector2);
        }
    };
});
System.register("engine/data/CellSprite", [], function (exports_10, context_10) {
    "use strict";
    var _a, CellSprite;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            CellSprite = class CellSprite {
                constructor() {
                    this.char = ' ';
                }
                equals(other) {
                    return other.char === this.char;
                }
                static fromChar(char) {
                    const cellSprite = new _a();
                    cellSprite.char = char;
                    return cellSprite;
                }
            };
            exports_10("CellSprite", CellSprite);
            _a = CellSprite;
            CellSprite.empty = _a.fromChar(' ');
            ;
        }
    };
});
System.register("engine/math/Colors", ["engine/math/Color"], function (exports_11, context_11) {
    "use strict";
    var Color_2, Colors;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (Color_2_1) {
                Color_2 = Color_2_1;
            }
        ],
        execute: function () {
            Colors = class Colors {
            };
            exports_11("Colors", Colors);
            Colors.Transparent = new Color_2.Color(0, 0, 0, 0);
            Colors.Black = new Color_2.Color(0, 0, 0, 1);
            Colors.White = new Color_2.Color(1, 1, 1, 1);
            Colors.Red = new Color_2.Color(1, 0, 0, 1);
            Colors.Green = new Color_2.Color(0, 1, 0, 1);
            Colors.Blue = new Color_2.Color(0, 0, 1, 1);
            Colors.Yellow = new Color_2.Color(1, 1, 0, 1);
            Colors.Purple = new Color_2.Color(1, 0, 1, 1);
            Colors.Violet = new Color_2.Color(0.5, 0, 0.5, 1);
            Colors.Orange = new Color_2.Color(1, 0.5, 0, 1);
            Colors.Brown = new Color_2.Color(0.5, 0.25, 0, 1);
            Colors.Gray = new Color_2.Color(0.5, 0.5, 0.5, 1);
            Colors.Cyan = new Color_2.Color(0, 1, 1, 1);
            Colors.Lime = new Color_2.Color(0.5, 1, 0, 1);
            Colors.Sienna = new Color_2.Color(0.533, 0.176, 0.09, 1);
            Colors.SaddleBrown = new Color_2.Color(0.533, 0.176, 0.09, 1);
            // Light colors
            Colors.LightRed = new Color_2.Color(1, 0.5, 0.5, 1);
            Colors.LightGreen = new Color_2.Color(0.5, 1, 0.5, 1);
            Colors.LightBlue = new Color_2.Color(0.5, 0.5, 1, 1);
            Colors.LightYellow = new Color_2.Color(1, 1, 0.5, 1);
            Colors.LightPurple = new Color_2.Color(1, 0.5, 1, 1);
            Colors.LightOrange = new Color_2.Color(1, 0.75, 0.5, 1);
            Colors.LightBrown = new Color_2.Color(0.75, 0.375, 0, 1);
            Colors.LightGray = new Color_2.Color(0.75, 0.75, 0.75, 1);
            // Dark colors
            Colors.DarkRed = new Color_2.Color(0.5, 0, 0, 1);
            Colors.DarkGreen = new Color_2.Color(0, 0.5, 0, 1);
            Colors.DarkBlue = new Color_2.Color(0, 0, 0.5, 1);
            Colors.DarkYellow = new Color_2.Color(0.5, 0.5, 0, 1);
            Colors.DarkPurple = new Color_2.Color(0.5, 0, 0.5, 1);
            Colors.DarkOrange = new Color_2.Color(0.5, 0.25, 0, 1);
            Colors.DarkBrown = new Color_2.Color(0.25, 0.125, 0, 1);
            Colors.DarkGray = new Color_2.Color(0.25, 0.25, 0.25, 1);
        }
    };
});
System.register("engine/graphics/Cell", ["engine/data/CellSprite", "engine/math/Colors", "engine/math/Vector2"], function (exports_12, context_12) {
    "use strict";
    var CellSprite_1, Colors_1, Vector2_1, defaultCellDrawOptions, Cell;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (CellSprite_1_1) {
                CellSprite_1 = CellSprite_1_1;
            },
            function (Colors_1_1) {
                Colors_1 = Colors_1_1;
            },
            function (Vector2_1_1) {
                Vector2_1 = Vector2_1_1;
            }
        ],
        execute: function () {
            exports_12("defaultCellDrawOptions", defaultCellDrawOptions = {
                miniCellPosition: new Vector2_1.Vector2(0, 0),
                scale: 1,
                bold: false,
                opacity: 1,
                border: undefined,
            });
            Cell = class Cell {
                get isEmpty() {
                    const result = (this.character.equals(CellSprite_1.CellSprite.empty) || !this.textColor) &&
                        (!this.backgroundColor || this.backgroundColor.equals(Colors_1.Colors.Transparent)) &&
                        !this.options.border;
                    return result;
                }
                constructor(character = CellSprite_1.CellSprite.empty, textColor = Colors_1.Colors.White, backgroundColor = Colors_1.Colors.Transparent) {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                    this.options = {};
                }
            };
            exports_12("Cell", Cell);
        }
    };
});
System.register("engine/math/Box2", [], function (exports_13, context_13) {
    "use strict";
    var Box2;
    var __moduleName = context_13 && context_13.id;
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
            exports_13("Box2", Box2);
        }
    };
});
System.register("engine/math/Grid", ["engine/math/Vector2"], function (exports_14, context_14) {
    "use strict";
    var Vector2_2, Grid;
    var __moduleName = context_14 && context_14.id;
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
                    if (position.y < 0 || position.y >= this.size.height) {
                        return undefined;
                    }
                    if (position.x < 0 || position.x >= this.size.width) {
                        return undefined;
                    }
                    return this._elements[this._getIndex(position)];
                }
                setAt(position, value) {
                    if (position.y < 0 || position.y >= this.size.height) {
                        return;
                    }
                    if (position.x < 0 || position.x >= this.size.width) {
                        return;
                    }
                    this._elements[this._getIndex(position)] = value;
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
                _getIndex(position) {
                    const index = position.y * this.size.width +
                        position.x;
                    return index;
                }
            };
            exports_14("Grid", Grid);
        }
    };
});
System.register("engine/components/ObjectSkin", ["engine/math/Vector2", "engine/graphics/Cell", "engine/math/Grid", "engine/math/Colors", "engine/data/CellSprite"], function (exports_15, context_15) {
    "use strict";
    var Vector2_3, Cell_1, Grid_1, Colors_2, CellSprite_2, ObjectSkin;
    var __moduleName = context_15 && context_15.id;
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
            },
            function (Colors_2_1) {
                Colors_2 = Colors_2_1;
            },
            function (CellSprite_2_1) {
                CellSprite_2 = CellSprite_2_1;
            }
        ],
        execute: function () {
            ObjectSkin = class ObjectSkin {
                get size() {
                    return this.cells.size;
                }
                constructor(cells = new Grid_1.Grid(ObjectSkin.defaultSize)) {
                    this.cells = cells;
                }
                isEmptyCellAt(position) {
                    if (!this.cells.containsPosition(position)) {
                        return true;
                    }
                    const cell = this.cells.at(position);
                    if (typeof cell === "undefined") {
                        return true;
                    }
                    return cell.isEmpty;
                }
                getCellsAt(position) {
                    const cell = this.cells.at(position);
                    if (!cell) {
                        return [];
                    }
                    return [cell];
                }
                char(options, position = new Vector2_3.Vector2()) {
                    this.getCellAt(position).character = CellSprite_2.CellSprite.fromChar(options);
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
                option(options, position = new Vector2_3.Vector2()) {
                    const cell = this.getCellAt(position);
                    cell.options = { ...cell.options, ...options };
                    return this;
                }
                getPositions() {
                    const positions = [];
                    for (let y = 0; y < this.size.y; y++) {
                        for (let x = 0; x < this.size.x; x++) {
                            if (this.isEmptyCellAt(new Vector2_3.Vector2(x, y))) {
                                continue;
                            }
                            positions.push(new Vector2_3.Vector2(x, y));
                        }
                    }
                    return positions;
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
                    return new Cell_1.Cell(CellSprite_2.CellSprite.empty, undefined, Colors_2.Colors.Transparent);
                }
            };
            exports_15("ObjectSkin", ObjectSkin);
            ObjectSkin.defaultSize = new Vector2_3.Vector2(1, 1);
        }
    };
});
System.register("engine/math/Vector3", [], function (exports_16, context_16) {
    "use strict";
    var Vector3;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [],
        execute: function () {
            Vector3 = class Vector3 {
                get width() {
                    return this.x;
                }
                get height() {
                    return this.y;
                }
                get depth() {
                    return this.z;
                }
                get length() {
                    return this.distanceTo(Vector3.zero);
                }
                constructor(x = 0, y = 0, z = 0) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                copy(v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                    return this;
                }
                clone() {
                    return new Vector3(this.x, this.y, this.z);
                }
                distanceTo(v) {
                    return Math.sqrt((this.x - v.x) ** 2 +
                        (this.y - v.y) ** 2) +
                        (this.z - v.z) ** 2;
                }
                equals(p) {
                    return (this.x === p.x &&
                        this.y === p.y &&
                        this.z === p.z);
                }
                getAt(index) {
                    switch (index) {
                        case 0: return this.x;
                        case 1: return this.y;
                        case 2: return this.z;
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
                        case 2:
                            this.z = value;
                            break;
                        default: throw new Error(`Index is out of range: ${index}`);
                    }
                    return this;
                }
                add(v) {
                    this.x += v.x;
                    this.y += v.y;
                    this.z += v.z;
                    return this;
                }
                sub(v) {
                    this.x -= v.x;
                    this.y -= v.y;
                    this.z -= v.z;
                    return this;
                }
                multiply(v) {
                    this.x *= v.x;
                    this.y *= v.y;
                    this.z *= v.z;
                    return this;
                }
                multiplyScalar(s) {
                    this.x *= s;
                    this.y *= s;
                    this.z *= s;
                    return this;
                }
                negate() {
                    this.x = -this.x;
                    this.y = -this.y;
                    this.z = -this.z;
                    return this;
                }
                max(v) {
                    this.x = Math.max(this.x, v.x);
                    this.y = Math.max(this.y, v.y);
                    this.z = Math.max(this.z, v.z);
                    return this;
                }
                to() {
                    return [this.x, this.y, this.z];
                }
                *[Symbol.iterator]() {
                    yield this.x;
                    yield this.y;
                    yield this.z;
                }
                static from([x, y, z]) {
                    return new Vector3(x, y, z);
                }
                static get zero() {
                    return new Vector3();
                }
                static get top() {
                    return new Vector3(0, -1, 0);
                }
                static get bottom() {
                    return new Vector3(0, +1, 0);
                }
                static get left() {
                    return new Vector3(-1, 0, 0);
                }
                static get right() {
                    return new Vector3(+1, 0, 0);
                }
                static get front() {
                    return new Vector3(0, 0, 1);
                }
                static get back() {
                    return new Vector3(0, 0, -1);
                }
                static get directions() {
                    return [
                        Vector3.right,
                        Vector3.bottom,
                        Vector3.left,
                        Vector3.top,
                        Vector3.front,
                        Vector3.back,
                    ];
                }
                static add(p1, p2) {
                    return p1.add(p2);
                }
            };
            exports_16("Vector3", Vector3);
        }
    };
});
System.register("engine/components/ObjectPhysics", ["utils/math", "engine/math/Color", "engine/math/Vector2"], function (exports_17, context_17) {
    "use strict";
    var math_3, Color_3, Vector2_4, ObjectPhysics;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (math_3_1) {
                math_3 = math_3_1;
            },
            function (Color_3_1) {
                Color_3 = Color_3_1;
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
                collision(position = Vector2_4.Vector2.zero) {
                    const collision = this.collisions.find(x => x.equals(position));
                    if (!collision) {
                        this.collisions.push(position);
                    }
                    this.material({ position, opacity: 1 });
                    return this;
                }
                light(options) {
                    if (typeof options === "number") {
                        this.light({ position: Vector2_4.Vector2.zero, intensity: options, color: new Color_3.Color(1, 1, 1) });
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
                        const number = math_3.clamp(Number.parseInt(options, 16) / 15, 0, 1);
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
            exports_17("ObjectPhysics", ObjectPhysics);
            ;
        }
    };
});
System.register("engine/objects/Behavior", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/typing", [], function (exports_19, context_19) {
    "use strict";
    var isNotNullable;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            exports_19("isNotNullable", isNotNullable = (x) => x !== null && typeof x !== "undefined");
        }
    };
});
System.register("engine/effects/ActiveEffect", [], function (exports_20, context_20) {
    "use strict";
    var ActiveEffect;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            ActiveEffect = class ActiveEffect {
                constructor(effect, activator) {
                    this.effect = effect;
                    this.activator = activator;
                    this.time = 0;
                }
                start(npc) {
                    this.onStarted(npc);
                }
                update(ticks, _npc) {
                    this.time += ticks;
                }
                isExpired() {
                    return this.time >= this.effect.ticks;
                }
                onStarted(_npc) {
                }
            };
            exports_20("ActiveEffect", ActiveEffect);
        }
    };
});
System.register("engine/effects/Effect", ["engine/effects/ActiveEffect"], function (exports_21, context_21) {
    "use strict";
    var ActiveEffect_1, Effect;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (ActiveEffect_1_1) {
                ActiveEffect_1 = ActiveEffect_1_1;
            }
        ],
        execute: function () {
            Effect = class Effect {
                constructor(name, type, value, ticks = 0) {
                    this.name = name;
                    this.type = type;
                    this.value = value;
                    this.ticks = ticks;
                    this.isStackable = false;
                    this.isMaxOverridable = false;
                }
                activate(activator) {
                    return new ActiveEffect_1.ActiveEffect(this, activator);
                }
            };
            exports_21("Effect", Effect);
        }
    };
});
System.register("engine/objects/EquipmentTags", [], function (exports_22, context_22) {
    "use strict";
    var EquipmentTags;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [],
        execute: function () {
            (function (EquipmentTags) {
                EquipmentTags.isWearable = Symbol("isWearable");
                EquipmentTags.isHandheld = Symbol("isHandheld");
                EquipmentTags.isRing = Symbol("isRing");
                EquipmentTags.isSpecial = Symbol("isSpecial");
            })(EquipmentTags || (exports_22("EquipmentTags", EquipmentTags = {})));
            ;
        }
    };
});
System.register("engine/objects/Item", ["engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_23, context_23) {
    "use strict";
    var Object2D_1, ObjectPhysics_1, Vector2_5, Item;
    var __moduleName = context_23 && context_23.id;
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
                    this.isItem = true;
                    this.effects = [];
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
            exports_23("Item", Item);
        }
    };
});
System.register("engine/objects/Equipment", ["utils/typing", "engine/math/Vector2", "engine/objects/EquipmentTags"], function (exports_24, context_24) {
    "use strict";
    var typing_1, Vector2_6, EquipmentTags_1, itemTypeStyle, defaultStyle, Equipment;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (typing_1_1) {
                typing_1 = typing_1_1;
            },
            function (Vector2_6_1) {
                Vector2_6 = Vector2_6_1;
            },
            function (EquipmentTags_1_1) {
                EquipmentTags_1 = EquipmentTags_1_1;
            }
        ],
        execute: function () {
            // TODO: event and player message.
            itemTypeStyle = "color:blue;font-weight:bold;";
            defaultStyle = "color:black;font-weight:normal;";
            Equipment = class Equipment {
                constructor(object) {
                    this.object = object;
                    this.items = [];
                    this.objectWearable = null;
                    this.objectSpecial = null;
                    this.objectInMainHand = null;
                    this.ring = null;
                    this._lastObjectInMainHand = null;
                }
                getEquippedItems() {
                    const equipped = [this.objectWearable, this.objectInMainHand, this.ring]
                        .filter(typing_1.isNotNullable);
                    return equipped;
                }
                getEffects() {
                    return this.getEquippedItems().flatMap(x => x.effects);
                }
                toggleHandheldEquip() {
                    if (this.objectInMainHand) {
                        this._lastObjectInMainHand = this.objectInMainHand;
                        this.unequipObjectInMainHand();
                    }
                    else if (this._lastObjectInMainHand) {
                        this.equipObjectInMainHand(this._lastObjectInMainHand);
                    }
                }
                equip(item) {
                    if (EquipmentTags_1.EquipmentTags.isWearable in item) {
                        if (item === this.objectWearable) {
                            this.unequipWearable();
                            return;
                        }
                        this.equipWearable(item);
                        return;
                    }
                    if (EquipmentTags_1.EquipmentTags.isSpecial in item) {
                        if (item === this.objectSpecial) {
                            this.unequipSpecial();
                            return;
                        }
                        this.equipSpecial(item);
                        return;
                    }
                    if (EquipmentTags_1.EquipmentTags.isHandheld in item) {
                        if (item === this.objectInMainHand) {
                            this.unequipObjectInMainHand();
                            return;
                        }
                        this.equipObjectInMainHand(item);
                        return;
                    }
                    if (EquipmentTags_1.EquipmentTags.isRing in item) {
                        if (item === this.ring) {
                            this.unequipRing();
                            return;
                        }
                        this.equipRing(item);
                        return;
                    }
                }
                equipObjectInMainHand(item) {
                    this.unequipObjectInMainHand();
                    if (!item) {
                        return;
                    }
                    this.objectInMainHand = item;
                    this.object.add(item);
                    item.position = Vector2_6.Vector2.right;
                    console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                    this.printEffects(item);
                }
                unequipObjectInMainHand() {
                    const item = this.objectInMainHand;
                    if (!item) {
                        return;
                    }
                    this.objectInMainHand = null;
                    item.removeFromParent();
                    item.position = Vector2_6.Vector2.zero;
                    console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
                }
                equipWearable(item) {
                    this.unequipWearable();
                    if (!item) {
                        return;
                    }
                    this.objectWearable = item;
                    this.object.add(item);
                    item.position = Vector2_6.Vector2.zero;
                    console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                    this.printEffects(item);
                }
                unequipWearable() {
                    const item = this.objectWearable;
                    if (!item) {
                        return;
                    }
                    this.objectWearable = null;
                    item.removeFromParent();
                    console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
                }
                equipSpecial(item) {
                    this.unequipSpecial();
                    if (!item) {
                        return;
                    }
                    this.objectSpecial = item;
                    this.object.add(item);
                    item.position = Vector2_6.Vector2.zero;
                    console.log(`Equipped %c${item.type}%c as special object.`, itemTypeStyle, defaultStyle);
                }
                unequipSpecial() {
                    const item = this.objectSpecial;
                    if (!item) {
                        return;
                    }
                    this.objectSpecial = null;
                    item.removeFromParent();
                    console.log(`Unequipped %c${item.type}%c as special object.`, itemTypeStyle, defaultStyle);
                }
                equipRing(item) {
                    this.unequipRing();
                    if (!item) {
                        return;
                    }
                    this.ring = item;
                    this.object.add(item);
                    item.position = Vector2_6.Vector2.zero;
                    console.log(`Equipped %c${item.type}%c as ring object.`, itemTypeStyle, defaultStyle);
                    this.printEffects(item);
                }
                unequipRing() {
                    const item = this.ring;
                    if (!item) {
                        return;
                    }
                    this.ring = null;
                    item.removeFromParent();
                    console.log(`Unequipped %c${item.type}%c as ring object.`, itemTypeStyle, defaultStyle);
                }
                printEffects(item) {
                    for (const effect of item.effects) {
                        console.log(`Effect: ${effect.name}.${effect.type} (${effect.value})`, effect);
                    }
                }
            };
            exports_24("Equipment", Equipment);
        }
    };
});
System.register("engine/objects/TileCategory", [], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/components/CompositeObjectSkin", ["engine/math/Vector2", "engine/components/ObjectSkin"], function (exports_26, context_26) {
    "use strict";
    var Vector2_7, ObjectSkin_1, CompositeObjectSkin;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (Vector2_7_1) {
                Vector2_7 = Vector2_7_1;
            },
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            }
        ],
        execute: function () {
            CompositeObjectSkin = class CompositeObjectSkin extends ObjectSkin_1.ObjectSkin {
                get size() {
                    return this.skins
                        .map(x => x.size)
                        .reduce((a, x) => a.max(x), new Vector2_7.Vector2());
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
            exports_26("CompositeObjectSkin", CompositeObjectSkin);
        }
    };
});
System.register("engine/effects/SlownessEffect", ["engine/effects/Effect"], function (exports_27, context_27) {
    "use strict";
    var Effect_1, SlownessEffect, MudSlownessEffect, SnowSlownessEffect, SandSlownessEffect, SlownessReductionEffect;
    var __moduleName = context_27 && context_27.id;
    function isSlowness(x) {
        return ("isSlowness" in x);
    }
    exports_27("isSlowness", isSlowness);
    function isSlownessReduction(x) {
        return ("isSlownessReduction" in x);
    }
    exports_27("isSlownessReduction", isSlownessReduction);
    return {
        setters: [
            function (Effect_1_1) {
                Effect_1 = Effect_1_1;
            }
        ],
        execute: function () {
            SlownessEffect = class SlownessEffect extends Effect_1.Effect {
                constructor(type, movementPenalty, ticks = 0) {
                    super("slowness", type, movementPenalty, ticks);
                    this.type = type;
                    this.movementPenalty = movementPenalty;
                    this.isSlowness = true;
                }
            };
            exports_27("SlownessEffect", SlownessEffect);
            MudSlownessEffect = class MudSlownessEffect extends SlownessEffect {
                constructor(movementPenalty) {
                    super("mud", movementPenalty, 1000);
                    this.isMud = true;
                    this.isStackable = false;
                    this.isMaxOverridable = true;
                }
            };
            exports_27("MudSlownessEffect", MudSlownessEffect);
            SnowSlownessEffect = class SnowSlownessEffect extends SlownessEffect {
                constructor(movementPenalty) {
                    super("snow", movementPenalty, 2000);
                    this.isSnow = true;
                    this.isStackable = false;
                    this.isMaxOverridable = true;
                }
            };
            exports_27("SnowSlownessEffect", SnowSlownessEffect);
            SandSlownessEffect = class SandSlownessEffect extends SlownessEffect {
                constructor(movementPenalty) {
                    super("sand", movementPenalty, 1000);
                    this.isSand = true;
                    this.isStackable = false;
                    this.isMaxOverridable = true;
                }
            };
            exports_27("SandSlownessEffect", SandSlownessEffect);
            SlownessReductionEffect = class SlownessReductionEffect extends Effect_1.Effect {
                constructor(slownessType, reduction) {
                    super("slowness_reduction", slownessType, reduction);
                    this.slownessType = slownessType;
                    this.reduction = reduction;
                    this.isSlownessReduction = true;
                }
            };
            exports_27("SlownessReductionEffect", SlownessReductionEffect);
        }
    };
});
System.register("utils/hash", [], function (exports_28, context_28) {
    "use strict";
    var stringHash;
    var __moduleName = context_28 && context_28.id;
    // https://stackoverflow.com/a/7616484
    function hash(str) {
        if (str.length === 0) {
            return 0;
        }
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
    return {
        setters: [],
        execute: function () {
            exports_28("stringHash", stringHash = hash);
        }
    };
});
System.register("utils/random", [], function (exports_29, context_29) {
    "use strict";
    var createRandom32;
    var __moduleName = context_29 && context_29.id;
    // https://stackoverflow.com/a/47593316
    function mulberry32(a) {
        return function () {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    return {
        setters: [],
        execute: function () {
            exports_29("createRandom32", createRandom32 = mulberry32);
        }
    };
});
System.register("utils/Lazy", [], function (exports_30, context_30) {
    "use strict";
    var Lazy;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [],
        execute: function () {
            Lazy = class Lazy {
                get value() {
                    var _a;
                    return (_a = this._value) !== null && _a !== void 0 ? _a : (this._value = this._initializer());
                }
                constructor(_initializer) {
                    this._initializer = _initializer;
                }
            };
            exports_30("Lazy", Lazy);
        }
    };
});
System.register("utils/unicode", [], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
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
    exports_31("groupUnicode", groupUnicode);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/data/ObjectSkinBuilder", ["utils/unicode", "engine/graphics/Cell", "engine/components/ObjectSkin", "engine/math/Grid", "engine/math/Colors", "engine/data/CellSprite"], function (exports_32, context_32) {
    "use strict";
    var unicode_1, Cell_2, ObjectSkin_2, Grid_2, Colors_3, CellSprite_3, ObjectSkinBuilder;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (unicode_1_1) {
                unicode_1 = unicode_1_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (Grid_2_1) {
                Grid_2 = Grid_2_1;
            },
            function (Colors_3_1) {
                Colors_3 = Colors_3_1;
            },
            function (CellSprite_3_1) {
                CellSprite_3 = CellSprite_3_1;
            }
        ],
        execute: function () {
            ObjectSkinBuilder = class ObjectSkinBuilder {
                get size() {
                    return this.characters.size;
                }
                constructor(charactersMask = '', colorsMask = '', colorsMap = {}) {
                    this.colors = this.getRawColors(colorsMask, colorsMap);
                    this.characters = Grid_2.Grid.from(charactersMask.split('\n').filter(line => line.length > 0).map(unicode_1.groupUnicode));
                }
                build() {
                    const cells = new Grid_2.Grid(this.size).fill(v => this.getCellsAt(v)[0]);
                    return new ObjectSkin_2.ObjectSkin(cells);
                }
                getRawColors(colorsMask, colorsMap) {
                    const colorsMaskItems = colorsMask.split('\n').filter(line => line.length > 0).map(line => line.split(''));
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
                    const cell = new Cell_2.Cell(CellSprite_3.CellSprite.fromChar(char), cellColor[0] ? cellColor[0] : undefined, cellColor[1] ? cellColor[1] : undefined);
                    return [cell];
                }
            };
            exports_32("ObjectSkinBuilder", ObjectSkinBuilder);
            ObjectSkinBuilder.defaultRawColor = [undefined, Colors_3.Colors.Transparent];
        }
    };
});
System.register("engine/data/SpriteInfo", ["engine/math/Vector2"], function (exports_33, context_33) {
    "use strict";
    var Vector2_8, SpriteInfo;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (Vector2_8_1) {
                Vector2_8 = Vector2_8_1;
            }
        ],
        execute: function () {
            SpriteInfo = class SpriteInfo {
                constructor() {
                    this.size = new Vector2_8.Vector2();
                }
                get width() {
                    return this.size.width;
                }
                get height() {
                    return this.size.height;
                }
            };
            exports_33("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["utils/unicode", "engine/components/ObjectSkin", "engine/math/Color", "engine/data/ObjectSkinBuilder", "engine/data/SpriteInfo"], function (exports_34, context_34) {
    "use strict";
    var unicode_2, ObjectSkin_3, Color_4, ObjectSkinBuilder_1, SpriteInfo_1, Sprite;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (unicode_2_1) {
                unicode_2 = unicode_2_1;
            },
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (Color_4_1) {
                Color_4 = Color_4_1;
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
                        const skin = new ObjectSkin_3.ObjectSkin().char(char);
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
                            colorsDict[colorParts[0]] = [Color_4.Color.fromHexString(colorParts[1]), Color_4.Color.fromHexString(colorParts[2])];
                        }
                        else
                            throw new Error(`unknown key: '${key}'`);
                        i += 1;
                    }
                    i++;
                    //console.log(info);
                    const sprite = new Sprite();
                    while (i < lines.length) {
                        if (!lines[i].startsWith(info.name)) {
                            i += 1;
                            continue;
                        }
                        const name = lines[i].substr(info.name.length);
                        //console.log(name);
                        i += 1;
                        // Group Unicode characters properly to handle emojis and multi-byte characters
                        const firstLineChars = unicode_2.groupUnicode(lines[i]);
                        const framesCount = firstLineChars.length / info.width;
                        const bodies = Array(framesCount).fill(``);
                        for (let y = 0; y < info.height; y++) {
                            const lineChars = unicode_2.groupUnicode(lines[i + y]);
                            for (let x = 0; x < framesCount; x++) {
                                const startIdx = x * info.width;
                                const part = lineChars.slice(startIdx, startIdx + info.width).join('');
                                bodies[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                            }
                        }
                        i += info.height;
                        //
                        const colors = Array(framesCount).fill(``);
                        for (let y = 0; y < info.height; y++) {
                            const lineChars = unicode_2.groupUnicode(lines[i + y]);
                            for (let x = 0; x < framesCount; x++) {
                                const startIdx = x * info.width;
                                const part = lineChars.slice(startIdx, startIdx + info.width).join('');
                                colors[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' ');
                            }
                        }
                        i += info.height;
                        for (let k = 0; k < framesCount; k++) {
                            if (k === 0) {
                                sprite.frames[name] = [];
                            }
                            const skin = new ObjectSkinBuilder_1.ObjectSkinBuilder(bodies[k], colors[k], colorsDict)
                                .build();
                            sprite.frames[name].push(skin);
                        }
                    }
                    return sprite;
                }
            };
            exports_34("Sprite", Sprite);
        }
    };
});
System.register("engine/objects/Particle", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_35, context_35) {
    "use strict";
    var ObjectPhysics_2, Vector2_9, Object2D_2, Particle;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            },
            function (Vector2_9_1) {
                Vector2_9 = Vector2_9_1;
            },
            function (Object2D_2_1) {
                Object2D_2 = Object2D_2_1;
            }
        ],
        execute: function () {
            Particle = class Particle extends Object2D_2.Object2D {
                constructor(sprite, position, state, options = {
                    decaySpeed: 1000,
                    origin: Vector2_9.Vector2.zero,
                }) {
                    const initialFrame = Particle.getFrameSkinAt(sprite, state);
                    super(options.origin, initialFrame, new ObjectPhysics_2.ObjectPhysics(), position);
                    this.sprite = sprite;
                    this.state = state;
                    this.options = options;
                    this.decayTicks = 0;
                    this.type = "<particle>";
                    this.renderOrder = 1;
                    this.layer = "particles";
                }
                update(ticks) {
                    super.update(ticks);
                    if (!this.options.decaySpeed) {
                        return;
                    }
                    this.decayTicks = Object2D_2.Object2D.updateValue(this.decayTicks, ticks, this.options.decaySpeed, () => {
                        if (!this.hasNext()) {
                            this.onRemove();
                            this.removeFromParent();
                        }
                        else {
                            this.next();
                            this.onNext();
                        }
                    });
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
            exports_35("Particle", Particle);
            Particle.defaultFrameName = 'particle';
        }
    };
});
System.register("engine/objects/SpriteAnimation", ["engine/objects/Object2D", "engine/objects/Particle"], function (exports_36, context_36) {
    "use strict";
    var Object2D_3, Particle_1, SpriteAnimation;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (Object2D_3_1) {
                Object2D_3 = Object2D_3_1;
            },
            function (Particle_1_1) {
                Particle_1 = Particle_1_1;
            }
        ],
        execute: function () {
            SpriteAnimation = class SpriteAnimation {
                constructor(sprite, period = 200) {
                    this.sprite = sprite;
                    this.period = period;
                    this._currentFrame = 0;
                    this._maxFrames = 0;
                    this._ticks = 0;
                    this.isPlaying = false;
                    this.isLooped = false;
                    this._maxFrames = sprite.frames[Particle_1.Particle.defaultFrameName].length;
                }
                play(options = { isLooped: false }) {
                    var _a;
                    this.isPlaying = true;
                    this.isLooped = (_a = options.isLooped) !== null && _a !== void 0 ? _a : false;
                }
                stop() {
                    this.isPlaying = false;
                }
                update(ticks) {
                    if (!this.isPlaying) {
                        return;
                    }
                    this._ticks = Object2D_3.Object2D.updateValue(this._ticks, ticks, this.period, () => {
                        this._currentFrame = Object2D_3.Object2D.updateValue(this._currentFrame, 1, this._maxFrames, () => {
                            if (!this.isLooped) {
                                this.stop();
                            }
                            else {
                                this._currentFrame = 0;
                            }
                        });
                    });
                }
                getFrame() {
                    const index = this._currentFrame % this._maxFrames;
                    return this.sprite.frames[Particle_1.Particle.defaultFrameName][index];
                }
            };
            exports_36("SpriteAnimation", SpriteAnimation);
        }
    };
});
System.register("engine/objects/Tile", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/components/CompositeObjectSkin", "engine/effects/SlownessEffect", "utils/hash", "utils/random", "utils/Lazy", "utils/typing", "engine/math/Color", "engine/math/Colors"], function (exports_37, context_37) {
    "use strict";
    var Object2D_4, ObjectSkin_4, ObjectPhysics_3, Vector2_10, CompositeObjectSkin_1, SlownessEffect_1, hash_1, random_1, Lazy_1, typing_2, Color_5, Colors_4, _position, Tile;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (Object2D_4_1) {
                Object2D_4 = Object2D_4_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            },
            function (Vector2_10_1) {
                Vector2_10 = Vector2_10_1;
            },
            function (CompositeObjectSkin_1_1) {
                CompositeObjectSkin_1 = CompositeObjectSkin_1_1;
            },
            function (SlownessEffect_1_1) {
                SlownessEffect_1 = SlownessEffect_1_1;
            },
            function (hash_1_1) {
                hash_1 = hash_1_1;
            },
            function (random_1_1) {
                random_1 = random_1_1;
            },
            function (Lazy_1_1) {
                Lazy_1 = Lazy_1_1;
            },
            function (typing_2_1) {
                typing_2 = typing_2_1;
            },
            function (Color_5_1) {
                Color_5 = Color_5_1;
            },
            function (Colors_4_1) {
                Colors_4 = Colors_4_1;
            }
        ],
        execute: function () {
            _position = new Vector2_10.Vector2();
            Tile = class Tile extends Object2D_4.Object2D {
                constructor(skin, position) {
                    super(Vector2_10.Vector2.zero, skin, new ObjectPhysics_3.ObjectPhysics(), position);
                    this.snowLevel = 0;
                    this.snowTicks = 0;
                    this.mudLevel = 0;
                    this.mudTicks = 0;
                    this.sandLevel = 0;
                    this.sandTicks = 0;
                    this.renderOrder = -1;
                    this._originalSkin = skin;
                    this._maxSnowVariant = new Lazy_1.Lazy(() => {
                        const snowVariants = [' ', ' ', '︵', '𓂃'];
                        const snowVariant = random_1.createRandom32(this.getSeed("snow"))() * snowVariants.length | 0;
                        return snowVariants[snowVariant];
                    });
                    this._maxMudVariant = new Lazy_1.Lazy(() => {
                        const mudVariants = [' ', '࿔', '🌫', '⛆'];
                        const mudVariant = random_1.createRandom32(this.getSeed("mud"))() * mudVariants.length | 0;
                        return mudVariants[mudVariant];
                    });
                    this._maxSandVariant = new Lazy_1.Lazy(() => {
                        const sandVariants = [' ', ' ', '︵', '𓂃'];
                        const sandVariant = random_1.createRandom32(this.getSeed("sand"))() * sandVariants.length | 0;
                        return sandVariants[sandVariant];
                    });
                    // TODO: disable tile world matrix auto update.
                }
                update(ticks) {
                    var _a;
                    super.update(ticks);
                    if (this.category === "solid") {
                        this.snowTicks = Object2D_4.Object2D.updateValue(this.snowTicks, ticks, 3000, () => {
                            const temp = this.parent.scene.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                            if (temp >= 8) {
                                this.decreaseSnow();
                                //this.increaseMud();
                            }
                        });
                        this.mudTicks = Object2D_4.Object2D.updateValue(this.mudTicks, ticks, 3000, () => {
                            const temp = this.parent.scene.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                            if (temp >= 8) {
                                this.decreaseMud();
                                // TODO: increase moisture.
                            }
                        });
                        this.sandTicks = Object2D_4.Object2D.updateValue(this.sandTicks, ticks, 3000, () => {
                            // TODO: fluctuate with wind? or move in the direction of wind?
                        });
                    }
                    (_a = this.disturbanceAnimation) === null || _a === void 0 ? void 0 : _a.update(ticks);
                    this.updateSkin();
                }
                increaseMud() {
                    if (this.category !== "solid" || this.mudLevel >= Tile.maxMudLevel) {
                        return;
                    }
                    this.mudLevel += 1;
                    this.removeMudEffect();
                    this.addMudEffect();
                }
                decreaseMud() {
                    if (this.category !== "solid") {
                        return;
                    }
                    this.removeMudEffect();
                    if (this.mudLevel === 0) {
                        return;
                    }
                    this.mudLevel -= 1;
                    this.addMudEffect();
                }
                removeMudEffect() {
                    const index = this.effects.findIndex(x => "isMud" in x);
                    if (index !== -1) {
                        this.effects.splice(index, 1);
                    }
                }
                addMudEffect() {
                    if (this.mudLevel === 0) {
                        return;
                    }
                    const mudEffect = new SlownessEffect_1.MudSlownessEffect(0.1 * this.mudLevel);
                    this.effects.push(mudEffect);
                }
                increaseSnow() {
                    if (this.category !== "solid" || this.snowLevel >= Tile.maxSnowLevel) {
                        return;
                    }
                    this.snowLevel += 1;
                    this.removeSnowEffect();
                    this.addSnowEffect();
                }
                decreaseSnow() {
                    if (this.category !== "solid") {
                        return;
                    }
                    this.removeSnowEffect();
                    if (this.snowLevel === 0) {
                        return;
                    }
                    this.snowLevel -= 1;
                    this.addSnowEffect();
                }
                removeSnowEffect() {
                    const index = this.effects.findIndex(x => "isSnow" in x);
                    if (index !== -1) {
                        this.effects.splice(index, 1);
                    }
                }
                addSnowEffect() {
                    if (this.snowLevel === 0) {
                        return;
                    }
                    const snowEffect = new SlownessEffect_1.SnowSlownessEffect(0.1 * this.snowLevel);
                    this.effects.push(snowEffect);
                }
                addSandEffect() {
                    if (this.sandLevel === 0) {
                        return;
                    }
                    const sandEffect = new SlownessEffect_1.SandSlownessEffect(0.1 * this.sandLevel);
                    this.effects.push(sandEffect);
                }
                setSandLevel(level) {
                    if (this.category !== "solid") {
                        return this;
                    }
                    this.sandLevel = level;
                    this.addSandEffect();
                    return this;
                }
                addSoftDisturbance() {
                    var _a;
                    if (this.category !== "liquid") {
                        return;
                    }
                    (_a = this.disturbanceAnimation) === null || _a === void 0 ? void 0 : _a.play();
                }
                addHardDisturbance() {
                    var _a;
                    if (this.category === "solid" &&
                        (this.snowLevel > 0 || this.mudLevel > 0 || this.sandLevel > 0)) {
                        return;
                    }
                    (_a = this.disturbanceAnimation) === null || _a === void 0 ? void 0 : _a.play();
                }
                updateSkin() {
                    const tileEffect = this.getTileEffect();
                    this.skin = tileEffect
                        ? new CompositeObjectSkin_1.CompositeObjectSkin([this._originalSkin, tileEffect])
                        : this._originalSkin;
                }
                getSeed(propertyName) {
                    const fullName = `${this.scene.name}.${propertyName}`;
                    const positionVal = this.position.x + this.position.y * 10000;
                    const val = hash_1.stringHash(fullName) ^ positionVal;
                    return val;
                }
                getTileOverlayFrame() {
                    const tile = this;
                    if (tile.category === "solid") {
                        if (tile.snowLevel > 0) {
                            const snowColor = `#fff${(tile.snowLevel * 2).toString(16)}`;
                            const frame = new ObjectSkin_4.ObjectSkin().background(Color_5.Color.fromHexString(snowColor));
                            if (tile.snowLevel === Tile.maxSnowLevel) {
                                frame.char(this._maxSnowVariant.value).color(Colors_4.Colors.Gray);
                            }
                            return frame;
                        }
                        if (tile.mudLevel > 0) {
                            const mudColor = `#000${(tile.mudLevel).toString(16)}`;
                            const frame = new ObjectSkin_4.ObjectSkin().background(Color_5.Color.fromHexString(mudColor));
                            if (tile.mudLevel === Tile.maxMudLevel) {
                                frame.char(this._maxMudVariant.value).color(Color_5.Color.fromHexString(`#0ff${2}`));
                            }
                            return frame;
                        }
                        if (tile.sandLevel > 0) {
                            const sandColor = `#640${(tile.sandLevel * 2).toString(16)}`;
                            const frame = new ObjectSkin_4.ObjectSkin().background(Color_5.Color.fromHexString(sandColor));
                            if (tile.sandLevel === Tile.maxSandLevel) {
                                frame.char(this._maxSandVariant.value).color(Colors_4.Colors.Black);
                            }
                            return frame;
                        }
                    }
                    return undefined;
                }
                getTileDisturbanceFrame() {
                    var _a, _b;
                    if (!((_a = this.disturbanceAnimation) === null || _a === void 0 ? void 0 : _a.isPlaying)) {
                        return undefined;
                    }
                    return (_b = this.disturbanceAnimation) === null || _b === void 0 ? void 0 : _b.getFrame();
                }
                getTileEffect() {
                    const frames = [this.getTileOverlayFrame(), this.getTileDisturbanceFrame()]
                        .filter(typing_2.isNotNullable);
                    if (frames.length === 0) {
                        return undefined;
                    }
                    if (frames.length === 1) {
                        return frames[0];
                    }
                    return new CompositeObjectSkin_1.CompositeObjectSkin(frames);
                }
            };
            exports_37("Tile", Tile);
            Tile.maxSnowLevel = 4;
            Tile.maxMudLevel = 4;
            Tile.maxSandLevel = 4;
        }
    };
});
System.register("engine/objects/NpcMovementOptions", [], function (exports_38, context_38) {
    "use strict";
    var NpcMovementOptions, defaultMovementOptions;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [],
        execute: function () {
            // Number values are in cells per second.
            NpcMovementOptions = class NpcMovementOptions {
            };
            exports_38("NpcMovementOptions", NpcMovementOptions);
            exports_38("defaultMovementOptions", defaultMovementOptions = {
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
System.register("engine/signaling/SignalType", [], function (exports_39, context_39) {
    "use strict";
    var SignalTypes, SignalColors;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [],
        execute: function () {
            exports_39("SignalTypes", SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"]);
            exports_39("SignalColors", SignalColors = ["white", "green", "red", "cyan", "yellow", "blue"]);
        }
    };
});
System.register("engine/signaling/Signal", [], function (exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/SignalTransfer", [], function (exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/ISignalProcessor", [], function (exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    function isAnISignalProcessor(obj) {
        return ("processSignalTransfer" in obj &&
            typeof obj.processSignalTransfer === "function");
    }
    exports_42("isAnISignalProcessor", isAnISignalProcessor);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/signaling/SignalProcessor", ["engine/signaling/ISignalProcessor", "engine/math/Grid", "engine/math/Vector2", "engine/math/Rotation"], function (exports_43, context_43) {
    "use strict";
    var ISignalProcessor_1, Grid_3, Vector2_11, Rotation_2, _position, SignalProcessor;
    var __moduleName = context_43 && context_43.id;
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
            _position = new Vector2_11.Vector2();
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
                    const key = SignalProcessor.getPositionKey(object.getWorldPosition(_position));
                    const inputTransfers = (this._prevSignalTransfers.get(key) || [])
                        .map(input => {
                        const inputCellRotation = input.rotation;
                        // Convert global to local rotations.
                        const relativeObjectRotation = Rotation_2.Rotations.normalize(inputCellRotation - object.globalRotation);
                        return { rotation: relativeObjectRotation, signal: input.signal };
                    });
                    const outputTransfers = object.processSignalTransfer(inputTransfers);
                    this.registerOutputsAt(object.getWorldPosition(_position), outputTransfers);
                    const inputs = outputTransfers
                        .map(output => {
                        const relativeObjectRotation = output.rotation;
                        // Convert local to global rotations.
                        const outputCellRotation = Rotation_2.Rotations.normalize(object.globalRotation + relativeObjectRotation);
                        const globalDirection = Vector2_11.Vector2.right.rotate(outputCellRotation);
                        const inputPosition = object.getWorldPosition(new Vector2_11.Vector2()).add(globalDirection);
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
                        const value = cellSignalsMap.get(output.signal.type) || 0;
                        cellSignalsMap.set(output.signal.type, Math.max(value, output.signal.value));
                    }
                    const newValue = Object.fromEntries(cellSignalsMap);
                    this.signalLayer.setAt(outputPosition, newValue);
                }
                static getPositionKey(position) {
                    return `${position.x}:${position.y}`;
                }
            };
            exports_43("SignalProcessor", SignalProcessor);
        }
    };
});
System.register("engine/ActionData", ["engine/math/Vector2"], function (exports_44, context_44) {
    "use strict";
    var Vector2_12, _position;
    var __moduleName = context_44 && context_44.id;
    function convertToActionData(object, objectAction) {
        const iconPos = objectAction.iconPosition;
        const actionIcon = object.skin.getCellsAt(iconPos);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon };
    }
    exports_44("convertToActionData", convertToActionData);
    function getNpcInteraction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.getWorldCursorPosition(_position)).filter(x => x.type === "interaction")[0];
    }
    exports_44("getNpcInteraction", getNpcInteraction);
    function getNpcCollisionAction(npc) {
        if (!npc.scene) {
            return;
        }
        return npc.scene.getActionsAt(npc.getWorldPosition(_position)).filter(x => x.type === "collision")[0];
    }
    exports_44("getNpcCollisionAction", getNpcCollisionAction);
    function getItemUsageAction(item) {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }
        // This is a default usage action.
        const defaultAction = interactions[0];
        return convertToActionData(item, defaultAction);
    }
    exports_44("getItemUsageAction", getItemUsageAction);
    return {
        setters: [
            function (Vector2_12_1) {
                Vector2_12 = Vector2_12_1;
            }
        ],
        execute: function () {
            _position = new Vector2_12.Vector2();
        }
    };
});
System.register("world/sprites/fallingAshSprite", ["engine/data/Sprite"], function (exports_45, context_45) {
    "use strict";
    var Sprite_1, fallingAshSpriteRaw, fallingAshSprite;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            }
        ],
        execute: function () {
            fallingAshSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#aaa9,#0000

particle
ᣟ˙·.
RRRR`;
            exports_45("fallingAshSprite", fallingAshSprite = Sprite_1.Sprite.parse(fallingAshSpriteRaw));
        }
    };
});
System.register("world/objects/particles/WeatherParticle", ["engine/objects/Particle"], function (exports_46, context_46) {
    "use strict";
    var Particle_2, WeatherParticle;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (Particle_2_1) {
                Particle_2 = Particle_2_1;
            }
        ],
        execute: function () {
            WeatherParticle = class WeatherParticle extends Particle_2.Particle {
                constructor(sprite, position, state = 0, options = { decaySpeed: WeatherParticle.DefaultDecaySpeed }) {
                    var _a;
                    super(sprite, position, state, {
                        decaySpeed: (_a = options.decaySpeed) !== null && _a !== void 0 ? _a : WeatherParticle.DefaultDecaySpeed,
                    });
                }
            };
            exports_46("WeatherParticle", WeatherParticle);
            WeatherParticle.DefaultDecaySpeed = 300;
        }
    };
});
System.register("world/objects/particles/FallingAsh", ["engine/math/Vector2", "world/sprites/fallingAshSprite", "world/objects/particles/WeatherParticle"], function (exports_47, context_47) {
    "use strict";
    var Vector2_13, fallingAshSprite_1, WeatherParticle_1, FallingAsh;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (Vector2_13_1) {
                Vector2_13 = Vector2_13_1;
            },
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
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.getWorldPosition(new Vector2_13.Vector2()));
                    tile === null || tile === void 0 ? void 0 : tile.addSoftDisturbance();
                }
            };
            exports_47("FallingAsh", FallingAsh);
        }
    };
});
System.register("engine/effects/WetnessEffect", ["engine/effects/Effect"], function (exports_48, context_48) {
    "use strict";
    var Effect_2, WetnessEffect, WaterWetnessEffect;
    var __moduleName = context_48 && context_48.id;
    function isWetness(x) {
        return ("isWetness" in x);
    }
    exports_48("isWetness", isWetness);
    return {
        setters: [
            function (Effect_2_1) {
                Effect_2 = Effect_2_1;
            }
        ],
        execute: function () {
            WetnessEffect = class WetnessEffect extends Effect_2.Effect {
                constructor(type, ticks = 0) {
                    super("wetness", type, ticks);
                    this.type = type;
                    this.isWetness = true;
                }
            };
            exports_48("WetnessEffect", WetnessEffect);
            WaterWetnessEffect = class WaterWetnessEffect extends WetnessEffect {
                constructor() {
                    super("water", 1000);
                    this.isWater = true;
                    this.isStackable = false;
                    this.isMaxOverridable = true;
                }
            };
            exports_48("WaterWetnessEffect", WaterWetnessEffect);
        }
    };
});
System.register("world/sprites/heavyRainDropSprite", ["engine/data/Sprite"], function (exports_49, context_49) {
    "use strict";
    var Sprite_2, heavyRainDropSpriteRaw, heavyRainDropSprite;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (Sprite_2_1) {
                Sprite_2 = Sprite_2_1;
            }
        ],
        execute: function () {
            exports_49("heavyRainDropSpriteRaw", heavyRainDropSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0ff9,#0000

particle
˚∘𓈒
RRR`);
            exports_49("heavyRainDropSprite", heavyRainDropSprite = Sprite_2.Sprite.parse(heavyRainDropSpriteRaw));
        }
    };
});
System.register("world/sprites/rainDropSprite", ["engine/data/Sprite"], function (exports_50, context_50) {
    "use strict";
    var Sprite_3, rainDropSpriteRaw, rainDropSprite;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (Sprite_3_1) {
                Sprite_3 = Sprite_3_1;
            }
        ],
        execute: function () {
            exports_50("rainDropSpriteRaw", rainDropSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0ff9,#0000

particle
ᣟ˙·.
RRRR`);
            exports_50("rainDropSprite", rainDropSprite = Sprite_3.Sprite.parse(rainDropSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Raindrop", ["engine/effects/WetnessEffect", "engine/math/Vector2", "world/sprites/heavyRainDropSprite", "world/sprites/rainDropSprite", "world/objects/particles/WeatherParticle"], function (exports_51, context_51) {
    "use strict";
    var WetnessEffect_1, Vector2_14, heavyRainDropSprite_1, rainDropSprite_1, WeatherParticle_2, Raindrop, LightRaindrop, HeavyRaindrop;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (WetnessEffect_1_1) {
                WetnessEffect_1 = WetnessEffect_1_1;
            },
            function (Vector2_14_1) {
                Vector2_14 = Vector2_14_1;
            },
            function (heavyRainDropSprite_1_1) {
                heavyRainDropSprite_1 = heavyRainDropSprite_1_1;
            },
            function (rainDropSprite_1_1) {
                rainDropSprite_1 = rainDropSprite_1_1;
            },
            function (WeatherParticle_2_1) {
                WeatherParticle_2 = WeatherParticle_2_1;
            }
        ],
        execute: function () {
            Raindrop = class Raindrop extends WeatherParticle_2.WeatherParticle {
                constructor(sprite, position, state = 0, options = { decaySpeed: WeatherParticle_2.WeatherParticle.DefaultDecaySpeed }) {
                    super(sprite, position, state, options);
                    this.type = "raindrop";
                    this.hostEffects.push(new WetnessEffect_1.WetnessEffect("rain"));
                }
                onRemove() {
                    var _a;
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.getWorldPosition(new Vector2_14.Vector2()));
                    tile === null || tile === void 0 ? void 0 : tile.addSoftDisturbance();
                    tile === null || tile === void 0 ? void 0 : tile.decreaseSnow();
                    tile === null || tile === void 0 ? void 0 : tile.increaseMud();
                }
            };
            exports_51("Raindrop", Raindrop);
            LightRaindrop = class LightRaindrop extends Raindrop {
                constructor(position, state = 0) {
                    super(rainDropSprite_1.rainDropSprite, position, state);
                }
            };
            exports_51("LightRaindrop", LightRaindrop);
            HeavyRaindrop = class HeavyRaindrop extends Raindrop {
                constructor(position, state = 0) {
                    super(heavyRainDropSprite_1.heavyRainDropSprite, position, state, { decaySpeed: WeatherParticle_2.WeatherParticle.DefaultDecaySpeed / 2 });
                }
            };
            exports_51("HeavyRaindrop", HeavyRaindrop);
        }
    };
});
System.register("world/sprites/snowFlakeSprite", ["engine/data/Sprite"], function (exports_52, context_52) {
    "use strict";
    var Sprite_4, snowFlakeSpriteRaw, snowFlakeSprite;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (Sprite_4_1) {
                Sprite_4 = Sprite_4_1;
            }
        ],
        execute: function () {
            exports_52("snowFlakeSpriteRaw", snowFlakeSpriteRaw = `width:1
height:1
name:
empty:'
color:S,#fff9,#0000

particle
❆❅✶•·.
SSSSSS`);
            exports_52("snowFlakeSprite", snowFlakeSprite = Sprite_4.Sprite.parse(snowFlakeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Snowflake", ["engine/math/Vector2", "world/sprites/snowFlakeSprite", "world/objects/particles/WeatherParticle"], function (exports_53, context_53) {
    "use strict";
    var Vector2_15, snowFlakeSprite_1, WeatherParticle_3, Snowflake;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (Vector2_15_1) {
                Vector2_15 = Vector2_15_1;
            },
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
                    const tile = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.scene.tilesObject.getTileAt(this.getWorldPosition(new Vector2_15.Vector2()));
                    tile === null || tile === void 0 ? void 0 : tile.addSoftDisturbance();
                    tile === null || tile === void 0 ? void 0 : tile.increaseSnow();
                }
            };
            exports_53("Snowflake", Snowflake);
        }
    };
});
System.register("engine/effects/DamageEffect", ["engine/objects/Object2D", "engine/effects/ActiveEffect", "engine/effects/Effect"], function (exports_54, context_54) {
    "use strict";
    var Object2D_5, ActiveEffect_2, Effect_3, DamageEffect, DamageActiveEffect, PoisonDamageEffect, DamageReductionEffect, FireDamageEffect, ThunderDamageEffect;
    var __moduleName = context_54 && context_54.id;
    function isDamageReduction(x) {
        return ("isDamageReduction" in x);
    }
    exports_54("isDamageReduction", isDamageReduction);
    return {
        setters: [
            function (Object2D_5_1) {
                Object2D_5 = Object2D_5_1;
            },
            function (ActiveEffect_2_1) {
                ActiveEffect_2 = ActiveEffect_2_1;
            },
            function (Effect_3_1) {
                Effect_3 = Effect_3_1;
            }
        ],
        execute: function () {
            DamageEffect = class DamageEffect extends Effect_3.Effect {
                constructor(type, damageValue, damageInterval, damageTicksDuration = 1) {
                    super("damage", type, damageValue, damageTicksDuration * damageInterval);
                    this.type = type;
                    this.damageValue = damageValue;
                    this.damageInterval = damageInterval;
                    this.isDamage = true;
                    this.isStackable = true;
                }
                activate(activator) {
                    return new DamageActiveEffect(this, activator);
                }
            };
            exports_54("DamageEffect", DamageEffect);
            DamageActiveEffect = class DamageActiveEffect extends ActiveEffect_2.ActiveEffect {
                constructor(damageEffect, activator) {
                    super(damageEffect, activator);
                    this.damageEffect = damageEffect;
                    this.activator = activator;
                    this.damageTicks = 0;
                }
                onStarted(npc) {
                    super.onStarted(npc);
                    this._damage(npc);
                }
                update(ticks, npc) {
                    super.update(ticks, npc);
                    this.damageTicks = Object2D_5.Object2D.updateValue(this.damageTicks, ticks, this.damageEffect.damageInterval, () => {
                        this._damage(npc);
                    });
                }
                _damage(npc) {
                    npc.damage(this.damageEffect.damageValue, this.damageEffect.type, this.activator);
                }
            };
            exports_54("DamageActiveEffect", DamageActiveEffect);
            PoisonDamageEffect = class PoisonDamageEffect extends DamageEffect {
                constructor() {
                    super("poison", 2, 1000, 5);
                    this.isPoison = true;
                    this.isStackable = false;
                }
            };
            exports_54("PoisonDamageEffect", PoisonDamageEffect);
            DamageReductionEffect = class DamageReductionEffect extends Effect_3.Effect {
                constructor(damageType, reduction) {
                    super("damage_reduction", damageType, reduction);
                    this.damageType = damageType;
                    this.reduction = reduction;
                    this.isDamageReduction = true;
                }
            };
            exports_54("DamageReductionEffect", DamageReductionEffect);
            FireDamageEffect = class FireDamageEffect extends DamageEffect {
                constructor() {
                    super("fire", 1, 1000, 3);
                    this.isFire = true;
                    this.isStackable = false;
                }
            };
            exports_54("FireDamageEffect", FireDamageEffect);
            // TODO: increased break (stun) damage.
            ThunderDamageEffect = class ThunderDamageEffect extends DamageEffect {
                constructor() {
                    super("thunder", 1, 1000, 1);
                    this.isThunder = true;
                    this.isStackable = false;
                }
            };
            exports_54("ThunderDamageEffect", ThunderDamageEffect);
        }
    };
});
System.register("world/sprites/thunderBoltSprite", ["engine/data/Sprite"], function (exports_55, context_55) {
    "use strict";
    var Sprite_5, thunderBoltSpriteRaw, thunderBoltSprite;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (Sprite_5_1) {
                Sprite_5 = Sprite_5_1;
            }
        ],
        execute: function () {
            exports_55("thunderBoltSpriteRaw", thunderBoltSpriteRaw = `width:1
height:4
name:
empty:'
color:R,#fa0,#0000

particle
ϟ↯⚕↯
↯⚕↯ϟ
⚕↯ϟ↯
↯ϟ↯⚕
RRRR
RRRR
RRRR
RRRR`);
            exports_55("thunderBoltSprite", thunderBoltSprite = Sprite_5.Sprite.parse(thunderBoltSpriteRaw));
        }
    };
});
System.register("world/objects/particles/ThunderBolt", ["engine/effects/DamageEffect", "engine/math/Vector2", "engine/objects/Particle", "world/sprites/thunderBoltSprite"], function (exports_56, context_56) {
    "use strict";
    var DamageEffect_1, Vector2_16, Particle_3, thunderBoltSprite_1, ThunderBolt;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [
            function (DamageEffect_1_1) {
                DamageEffect_1 = DamageEffect_1_1;
            },
            function (Vector2_16_1) {
                Vector2_16 = Vector2_16_1;
            },
            function (Particle_3_1) {
                Particle_3 = Particle_3_1;
            },
            function (thunderBoltSprite_1_1) {
                thunderBoltSprite_1 = thunderBoltSprite_1_1;
            }
        ],
        execute: function () {
            ThunderBolt = class ThunderBolt extends Particle_3.Particle {
                constructor(position, state = 0) {
                    super(thunderBoltSprite_1.thunderBoltSprite, position, state, { decaySpeed: 100, origin: new Vector2_16.Vector2(0, 3) });
                    this.isWeatherParticle = true;
                    this.weatherType = "storm";
                    this.type = "thunder_bolt";
                    this.isMovableByWind = false;
                    this.physics.light('f');
                    this.hostEffects.push(new DamageEffect_1.ThunderDamageEffect());
                }
            };
            exports_56("ThunderBolt", ThunderBolt);
        }
    };
});
System.register("world/sprites/mistSprite", ["engine/data/Sprite"], function (exports_57, context_57) {
    "use strict";
    var Sprite_6, mistSpriteRaw, mistSprite;
    var __moduleName = context_57 && context_57.id;
    return {
        setters: [
            function (Sprite_6_1) {
                Sprite_6 = Sprite_6_1;
            }
        ],
        execute: function () {
            mistSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#fff6
color:T,#0000,#fff4
color:Y,#0000,#fff2

particle
''''''''''
YTRRRRRTTY`;
            exports_57("mistSprite", mistSprite = Sprite_6.Sprite.parse(mistSpriteRaw));
        }
    };
});
System.register("engine/weather/WeatherType", [], function (exports_58, context_58) {
    "use strict";
    var weatherTypes;
    var __moduleName = context_58 && context_58.id;
    return {
        setters: [],
        execute: function () {
            exports_58("weatherTypes", weatherTypes = [
                'normal',
                'rain',
                'ashfall',
                'snow',
                'rain_and_snow',
                'mist',
                'heavy_mist',
                'storm',
            ]);
        }
    };
});
System.register("engine/weather/WeatherHelper", ["world/objects/particles/FallingAsh", "world/objects/particles/Raindrop", "world/objects/particles/Snowflake", "world/objects/particles/ThunderBolt", "world/sprites/mistSprite", "engine/objects/Particle"], function (exports_59, context_59) {
    "use strict";
    var FallingAsh_1, Raindrop_1, Snowflake_1, ThunderBolt_1, mistSprite_1, Particle_4;
    var __moduleName = context_59 && context_59.id;
    function createWeatherParticle(weatherType, p) {
        const state = 0; //Math.random() * 100 | 0;  // TODO: random/large state is not working.
        if (weatherType === 'rain') {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new Raindrop_1.LightRaindrop(p, state)
                : undefined;
        }
        if (weatherType === 'storm') {
            const lightningProbability = 0.005;
            const dropProbability = 0.1;
            const randomValue = Math.random();
            if (randomValue < lightningProbability) {
                return new ThunderBolt_1.ThunderBolt(p, state);
            }
            if (randomValue < lightningProbability + dropProbability) {
                return new Raindrop_1.HeavyRaindrop(p, state);
            }
            return undefined;
        }
        if (weatherType === 'ashfall') {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new FallingAsh_1.FallingAsh(p, state)
                : undefined;
        }
        if (weatherType === "snow") {
            const probability = 0.05;
            return (Math.random() / probability | 0) === 0
                ? new Snowflake_1.Snowflake(p, state)
                : undefined;
        }
        if (weatherType === "rain_and_snow") {
            const probability = 0.1;
            const r = Math.random() / probability | 0;
            return r === 0
                ? new Raindrop_1.LightRaindrop(p, state)
                : (r === 1 ? new Snowflake_1.Snowflake(p, state) : undefined);
        }
        if (weatherType === "mist") {
            const probability = 0.1;
            return (Math.random() / probability | 0) === 0
                ? new Particle_4.Particle(mistSprite_1.mistSprite, p, state, {
                    decaySpeed: 300,
                })
                : undefined;
        }
        return undefined;
    }
    exports_59("createWeatherParticle", createWeatherParticle);
    function getWeatherSkyTransparency(weatherType) {
        switch (weatherType) {
            case 'storm':
                return 0.5;
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
    exports_59("getWeatherSkyTransparency", getWeatherSkyTransparency);
    function isWeatherPaticle(x) {
        return ("isWeatherParticle" in x) && x.isWeatherParticle && ("weatherType" in x) && x.weatherType;
    }
    exports_59("isWeatherPaticle", isWeatherPaticle);
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
            function (ThunderBolt_1_1) {
                ThunderBolt_1 = ThunderBolt_1_1;
            },
            function (mistSprite_1_1) {
                mistSprite_1 = mistSprite_1_1;
            },
            function (Particle_4_1) {
                Particle_4 = Particle_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/objects/special/ParticlesObject", ["engine/math/Vector2", "engine/objects/Object2D"], function (exports_60, context_60) {
    "use strict";
    var Vector2_17, Object2D_6, _position, ParticlesObject;
    var __moduleName = context_60 && context_60.id;
    return {
        setters: [
            function (Vector2_17_1) {
                Vector2_17 = Vector2_17_1;
            },
            function (Object2D_6_1) {
                Object2D_6 = Object2D_6_1;
            }
        ],
        execute: function () {
            _position = new Vector2_17.Vector2();
            ParticlesObject = class ParticlesObject extends Object2D_6.Object2D {
                constructor() {
                    super();
                    this.type = "particles";
                }
                getParticlesAt(position) {
                    return this.children.filter(p => p.getWorldPosition(_position).equals(position));
                }
                getParticleAt(position) {
                    const child = this.children.find(p => p.getWorldPosition(_position).equals(position));
                    return child ? child : undefined;
                }
                tryAddParticle(particle) {
                    const existingParticle = this.getParticleAt(particle.getWorldPosition(_position));
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
            exports_60("ParticlesObject", ParticlesObject);
        }
    };
});
System.register("engine/objects/special/WeatherParticlesObject", ["engine/weather/WeatherHelper", "engine/math/Vector2", "engine/objects/Object2D", "engine/objects/special/ParticlesObject"], function (exports_61, context_61) {
    "use strict";
    var WeatherHelper_1, Vector2_18, Object2D_7, ParticlesObject_1, WeatherParticlesObject;
    var __moduleName = context_61 && context_61.id;
    return {
        setters: [
            function (WeatherHelper_1_1) {
                WeatherHelper_1 = WeatherHelper_1_1;
            },
            function (Vector2_18_1) {
                Vector2_18 = Vector2_18_1;
            },
            function (Object2D_7_1) {
                Object2D_7 = Object2D_7_1;
            },
            function (ParticlesObject_1_1) {
                ParticlesObject_1 = ParticlesObject_1_1;
            }
        ],
        execute: function () {
            WeatherParticlesObject = class WeatherParticlesObject extends ParticlesObject_1.ParticlesObject {
                constructor() {
                    super();
                    this.weatherTicks = 0;
                    this.type = "weather_particles";
                }
                update(ticks) {
                    super.update(ticks);
                    this.weatherTicks = Object2D_7.Object2D.updateValue(this.weatherTicks, ticks, 300, () => {
                        this.updateWeatherParticles();
                    });
                }
                updateWeatherParticles() {
                    const box = this.scene.windBox;
                    const weatherType = this.scene.weather.weatherType;
                    for (let y = box.min.y; y < box.max.y; y++) {
                        for (let x = box.min.x; x < box.max.x; x++) {
                            const levelPosition = new Vector2_18.Vector2(x, y);
                            if (!this.scene.isRoofHoleAt(levelPosition)) {
                                continue;
                            }
                            const existingParticle = this.getParticleAt(levelPosition);
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
            exports_61("WeatherParticlesObject", WeatherParticlesObject);
        }
    };
});
System.register("engine/objects/special/TilesObject", ["engine/objects/Object2D"], function (exports_62, context_62) {
    "use strict";
    var Object2D_8, TilesObject;
    var __moduleName = context_62 && context_62.id;
    return {
        setters: [
            function (Object2D_8_1) {
                Object2D_8 = Object2D_8_1;
            }
        ],
        execute: function () {
            TilesObject = class TilesObject extends Object2D_8.Object2D {
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
            exports_62("TilesObject", TilesObject);
        }
    };
});
System.register("engine/objects/special/LayerObject", ["engine/objects/Object2D"], function (exports_63, context_63) {
    "use strict";
    var Object2D_9, LayerObject;
    var __moduleName = context_63 && context_63.id;
    return {
        setters: [
            function (Object2D_9_1) {
                Object2D_9 = Object2D_9_1;
            }
        ],
        execute: function () {
            LayerObject = class LayerObject extends Object2D_9.Object2D {
                disable() {
                    this.enabled = false;
                    this.visible = false;
                    return this;
                }
                toggle() {
                    this.enabled = !this.enabled;
                    this.visible = !this.visible;
                    return this;
                }
            };
            exports_63("LayerObject", LayerObject);
        }
    };
});
System.register("engine/math/Box3", [], function (exports_64, context_64) {
    "use strict";
    var Box3;
    var __moduleName = context_64 && context_64.id;
    return {
        setters: [],
        execute: function () {
            Box3 = class Box3 {
                constructor(min, max) {
                    this.min = min;
                    this.max = max;
                }
                clone() {
                    return new Box3(this.min.clone(), this.max.clone());
                }
                containsPoint(position) {
                    return (position.x >= this.min.x &&
                        position.y >= this.min.y &&
                        position.z >= this.min.z &&
                        position.x <= this.max.x &&
                        position.y <= this.max.y &&
                        position.z <= this.max.z);
                }
                expandByVector(v) {
                    this.min.sub(v);
                    this.max.add(v);
                    return this;
                }
            };
            exports_64("Box3", Box3);
        }
    };
});
System.register("engine/math/Grid3", ["engine/math/Grid", "engine/math/Vector2", "engine/math/Vector3"], function (exports_65, context_65) {
    "use strict";
    var Grid_4, Vector2_19, Vector3_1, Grid3;
    var __moduleName = context_65 && context_65.id;
    return {
        setters: [
            function (Grid_4_1) {
                Grid_4 = Grid_4_1;
            },
            function (Vector2_19_1) {
                Vector2_19 = Vector2_19_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            }
        ],
        execute: function () {
            Grid3 = class Grid3 {
                get width() {
                    return this.size.width;
                }
                get height() {
                    return this.size.height;
                }
                get depth() {
                    return this.size.depth;
                }
                constructor(size) {
                    this.size = size;
                    this._elements = [];
                }
                atDepth(depth) {
                    if (depth < 0 || depth >= this.size.depth) {
                        throw new Error(`Invalid depth: ${depth}.`);
                    }
                    const size = new Vector2_19.Vector2(this.size.width, this.size.height);
                    const sub = new Grid_4.Grid(size).fill(pos => this.at(new Vector3_1.Vector3(pos.x, pos.y, depth)));
                    return sub;
                }
                at(position) {
                    if (position.z < 0 || position.z >= this.size.depth) {
                        return undefined;
                    }
                    if (position.y < 0 || position.y >= this.size.height) {
                        return undefined;
                    }
                    if (position.x < 0 || position.x >= this.size.width) {
                        return undefined;
                    }
                    return this._elements[this._getIndex(position)];
                }
                setAt(position, value) {
                    if (position.z < 0 || position.z >= this.size.depth) {
                        return;
                    }
                    if (position.y < 0 || position.y >= this.size.height) {
                        return;
                    }
                    if (position.x < 0 || position.x >= this.size.width) {
                        return;
                    }
                    this._elements[this._getIndex(position)] = value;
                }
                containsPosition([x, y, z]) {
                    return (x >= 0 &&
                        x < this.size.width &&
                        y >= 0 &&
                        y < this.size.height &&
                        z >= 0 &&
                        z < this.size.depth);
                }
                traverse(iteration) {
                    const position = new Vector3_1.Vector3();
                    for (position.z = 0; position.z < this.depth; position.z++) {
                        for (position.y = 0; position.y < this.height; position.y++) {
                            for (position.x = 0; position.x < this.width; position.x++) {
                                const value = this.at(position);
                                iteration(value, position, this);
                            }
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
                    const newLayer = new Grid3(this.size);
                    this.traverse((oldValue, position) => {
                        const newValue = converter(oldValue, position, this);
                        newLayer.setAt(position, newValue);
                    });
                    return newLayer;
                }
                subGrid(box) {
                    const size = box.max.clone().sub(box.min);
                    if (size.width < 0 || size.height < 0 || size.depth < 0) {
                        throw new Error(`Invalid sub-grid size: ${size.width}, ${size.height}, ${size.depth}.`);
                    }
                    const sub = new Grid3(size).fill(pos => this.at(pos.clone().add(box.min)));
                    return sub;
                }
                *[Symbol.iterator]() {
                    for (const item of this._elements) {
                        yield item;
                    }
                }
                static from(arrays) {
                    const grid = new Grid3(this.getSize(arrays)).fill(v => { var _a, _b; return (_b = (_a = arrays[v.z]) === null || _a === void 0 ? void 0 : _a[v.y]) === null || _b === void 0 ? void 0 : _b[v.x]; });
                    return grid;
                }
                static getSize(arrays) {
                    const size = arrays.length > 0 && arrays[0].length > 0 && arrays[0][0].length > 0
                        ? new Vector3_1.Vector3(arrays[0][0].length, arrays[0].length, arrays.length)
                        : new Vector3_1.Vector3();
                    return size;
                }
                _getIndex(position) {
                    const index = position.z * this.size.width * this.size.height +
                        position.y * this.size.width +
                        position.x;
                    return index;
                }
            };
            exports_65("Grid3", Grid3);
        }
    };
});
System.register("engine/objects/special/BlockedCacheObject", ["engine/math/Vector2", "engine/objects/Object2D", "engine/math/Grid3", "engine/math/Vector3"], function (exports_66, context_66) {
    "use strict";
    var Vector2_20, Object2D_10, Grid3_1, Vector3_2, _position, BlockedCacheObject;
    var __moduleName = context_66 && context_66.id;
    return {
        setters: [
            function (Vector2_20_1) {
                Vector2_20 = Vector2_20_1;
            },
            function (Object2D_10_1) {
                Object2D_10 = Object2D_10_1;
            },
            function (Grid3_1_1) {
                Grid3_1 = Grid3_1_1;
            },
            function (Vector3_2_1) {
                Vector3_2 = Vector3_2_1;
            }
        ],
        execute: function () {
            _position = new Vector2_20.Vector2();
            BlockedCacheObject = class BlockedCacheObject extends Object2D_10.Object2D {
                constructor(size) {
                    super();
                    this.layer = "ui";
                    this.type = "blocked_cache";
                    this.blockedLayer = new Grid3_1.Grid3(size);
                }
                update(ticks) {
                    super.update(ticks);
                    this.updateBlocked();
                }
                isPositionBlocked(position) {
                    return !!this.blockedLayer.at(position);
                }
                getBlockerAt(position) {
                    return this.blockedLayer.at(position);
                }
                updateBlocked() {
                    this.blockedLayer.fillValue(undefined);
                    const objects = this.scene.children
                        .filter(x => x !== this)
                        .filter(x => x.enabled);
                    for (const object of objects) {
                        this.updateBlockedByObject(object);
                    }
                }
                updateBlockedByObject(object) {
                    if (!object.enabled) {
                        return;
                    }
                    for (const child of object.children) {
                        this.updateBlockedByObject(child);
                    }
                    for (const cellPos of object.physics.collisions) {
                        const position2 = object.getWorldPosition(_position).sub(object.originPoint).add(cellPos);
                        const position3 = new Vector3_2.Vector3(position2.x, position2.y, 0);
                        if (!this.blockedLayer.containsPosition(position3)) {
                            continue;
                        }
                        this.blockedLayer.setAt(position3, object);
                    }
                }
            };
            exports_66("BlockedCacheObject", BlockedCacheObject);
        }
    };
});
System.register("engine/objects/special/BlockedLayerObject", ["engine/graphics/Cell", "engine/components/ObjectSkin", "engine/objects/special/LayerObject", "engine/math/Color", "engine/math/Colors", "engine/data/CellSprite"], function (exports_67, context_67) {
    "use strict";
    var Cell_3, ObjectSkin_5, LayerObject_1, Color_6, Colors_5, CellSprite_4, BlockedLayerObject;
    var __moduleName = context_67 && context_67.id;
    return {
        setters: [
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (LayerObject_1_1) {
                LayerObject_1 = LayerObject_1_1;
            },
            function (Color_6_1) {
                Color_6 = Color_6_1;
            },
            function (Colors_5_1) {
                Colors_5 = Colors_5_1;
            },
            function (CellSprite_4_1) {
                CellSprite_4 = CellSprite_4_1;
            }
        ],
        execute: function () {
            BlockedLayerObject = class BlockedLayerObject extends LayerObject_1.LayerObject {
                constructor(blocked) {
                    super();
                    this.blocked = blocked;
                    this.layer = "ui";
                    this.type = "blocked_layer";
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createBlockedSkin();
                }
                createBlockedSkin() {
                    return new ObjectSkin_5.ObjectSkin(this.blocked.blockedLayer.atDepth(0).map(v => createCell(!!v)));
                    function createCell(b) {
                        return b === true
                            ? new Cell_3.Cell(CellSprite_4.CellSprite.fromChar('⛌'), Color_6.Color.fromHexString(`#f00a`), Color_6.Color.fromHexString(`#000a`))
                            : new Cell_3.Cell(CellSprite_4.CellSprite.empty, undefined, Colors_5.Colors.Transparent);
                    }
                }
            };
            exports_67("BlockedLayerObject", BlockedLayerObject);
        }
    };
});
System.register("engine/objects/special/SignalsLayerObject", ["engine/math/Vector2", "engine/graphics/Cell", "engine/components/ObjectSkin", "engine/signaling/SignalType", "engine/components/CompositeObjectSkin", "engine/math/Grid", "engine/objects/special/LayerObject", "engine/math/Colors", "engine/math/Color", "engine/data/CellSprite"], function (exports_68, context_68) {
    "use strict";
    var Vector2_21, Cell_4, ObjectSkin_6, SignalType_1, SignalType_2, CompositeObjectSkin_2, Grid_5, LayerObject_2, Colors_6, Color_7, CellSprite_5, SignalsLayerObject;
    var __moduleName = context_68 && context_68.id;
    return {
        setters: [
            function (Vector2_21_1) {
                Vector2_21 = Vector2_21_1;
            },
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
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
            },
            function (LayerObject_2_1) {
                LayerObject_2 = LayerObject_2_1;
            },
            function (Colors_6_1) {
                Colors_6 = Colors_6_1;
            },
            function (Color_7_1) {
                Color_7 = Color_7_1;
            },
            function (CellSprite_5_1) {
                CellSprite_5 = CellSprite_5_1;
            }
        ],
        execute: function () {
            SignalsLayerObject = class SignalsLayerObject extends LayerObject_2.LayerObject {
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
                    const filledLayers = Object.values(layers)
                        .map(x => x.map(x => x || new Cell_4.Cell(CellSprite_5.CellSprite.empty, undefined, Colors_6.Colors.Transparent)))
                        .map(x => new ObjectSkin_6.ObjectSkin(x));
                    return new CompositeObjectSkin_2.CompositeObjectSkin(filledLayers);
                    function createCell(signalType, v) {
                        const index = SignalType_1.SignalTypes.indexOf(signalType);
                        const signalColor = SignalType_2.SignalColors[index];
                        const cellOptions = {
                            miniCellPosition: new Vector2_21.Vector2(0.5 + ((index % 2) - 1) * 0.33, ((index / 2) | 0) * 0.33),
                            scale: 0.333,
                            bold: true,
                            opacity: 1,
                            border: undefined,
                        };
                        // Invert text for light bg colors.
                        const text = v > 0 ? v.toString(16) : '·';
                        const textColor = ((index === 0 || index === 3 || index === 4)) ? Colors_6.Colors.Black : Colors_6.Colors.White;
                        const backgroundColor = Color_7.Color.fromHexString(signalColor);
                        const cell = new Cell_4.Cell(CellSprite_5.CellSprite.fromChar(text), textColor, backgroundColor);
                        cell.options = cellOptions;
                        return cell;
                    }
                }
            };
            exports_68("SignalsLayerObject", SignalsLayerObject);
        }
    };
});
System.register("engine/objects/special/DebugDrawOptions", ["utils/color", "engine/math/Colors", "engine/math/Vector2"], function (exports_69, context_69) {
    "use strict";
    var color_2, Colors_7, Vector2_22, defaultDebugDrawOptions;
    var __moduleName = context_69 && context_69.id;
    return {
        setters: [
            function (color_2_1) {
                color_2 = color_2_1;
            },
            function (Colors_7_1) {
                Colors_7 = Colors_7_1;
            },
            function (Vector2_22_1) {
                Vector2_22 = Vector2_22_1;
            }
        ],
        execute: function () {
            exports_69("defaultDebugDrawOptions", defaultDebugDrawOptions = {
                drawUndefined: false,
                textColor: _ => Colors_7.Colors.White,
                backgroundColor: v => color_2.numberToColor(v, 15, 0),
                cellOptions: {
                    bold: false,
                    miniCellPosition: Vector2_22.Vector2.zero,
                    opacity: 0.5,
                    scale: 1,
                    border: undefined,
                },
            });
        }
    };
});
System.register("engine/objects/special/NumberGridObject", ["engine/graphics/Cell", "engine/components/ObjectSkin", "engine/objects/special/LayerObject", "engine/objects/special/DebugDrawOptions", "engine/math/Colors", "engine/data/CellSprite"], function (exports_70, context_70) {
    "use strict";
    var Cell_5, ObjectSkin_7, LayerObject_3, DebugDrawOptions_1, Colors_8, CellSprite_6, NumberGridObject;
    var __moduleName = context_70 && context_70.id;
    return {
        setters: [
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (LayerObject_3_1) {
                LayerObject_3 = LayerObject_3_1;
            },
            function (DebugDrawOptions_1_1) {
                DebugDrawOptions_1 = DebugDrawOptions_1_1;
            },
            function (Colors_8_1) {
                Colors_8 = Colors_8_1;
            },
            function (CellSprite_6_1) {
                CellSprite_6 = CellSprite_6_1;
            }
        ],
        execute: function () {
            NumberGridObject = class NumberGridObject extends LayerObject_3.LayerObject {
                constructor(gridProvider, drawOptions = DebugDrawOptions_1.defaultDebugDrawOptions) {
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
                createSkinFromGrid(grid, drawOptions = DebugDrawOptions_1.defaultDebugDrawOptions) {
                    const alpha = drawOptions.cellOptions.opacity || Cell_5.defaultCellDrawOptions.opacity;
                    const cellLayer = grid
                        .map((value, _) => createCell(value));
                    return new ObjectSkin_7.ObjectSkin(cellLayer);
                    function createCell(v) {
                        const value = v;
                        if (typeof v === "undefined" && !drawOptions.drawUndefined) {
                            return new Cell_5.Cell(CellSprite_6.CellSprite.empty, undefined, Colors_8.Colors.Transparent);
                        }
                        const textColor = typeof value !== "undefined"
                            ? drawOptions.textColor(value)
                            : Colors_8.Colors.Gray;
                        const backgroundColor = typeof value !== "undefined"
                            ? drawOptions.backgroundColor(value)
                            : Colors_8.Colors.Black;
                        const char = typeof v !== "undefined"
                            ? v
                            : ' ';
                        const cell = new Cell_5.Cell(CellSprite_6.CellSprite.fromChar(char.toString(16)), textColor.setAlpha(alpha), backgroundColor.setAlpha(alpha));
                        cell.options = drawOptions.cellOptions;
                        return cell;
                    }
                }
            };
            exports_70("NumberGridObject", NumberGridObject);
        }
    };
});
System.register("engine/lights/Light", ["engine/math/Color", "engine/objects/Object2D"], function (exports_71, context_71) {
    "use strict";
    var Color_8, Object2D_11, Light;
    var __moduleName = context_71 && context_71.id;
    return {
        setters: [
            function (Color_8_1) {
                Color_8 = Color_8_1;
            },
            function (Object2D_11_1) {
                Object2D_11 = Object2D_11_1;
            }
        ],
        execute: function () {
            Light = class Light extends Object2D_11.Object2D {
                // TODO: change intensity from [0..F] to [0..1] everywhere.
                constructor(color, intensity = 15) {
                    super();
                    this.intensity = intensity;
                    this.color = new Color_8.Color(color);
                    this.type = "light";
                }
            };
            exports_71("Light", Light);
        }
    };
});
System.register("engine/lights/SkyLight", ["engine/lights/Light"], function (exports_72, context_72) {
    "use strict";
    var Light_1, SkyLight;
    var __moduleName = context_72 && context_72.id;
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
            exports_72("SkyLight", SkyLight);
        }
    };
});
System.register("engine/lights/Lights", ["utils/color", "engine/math/Color", "engine/math/Vector2", "utils/math", "engine/math/Grid3", "engine/math/Vector3", "engine/math/Colors"], function (exports_73, context_73) {
    "use strict";
    var color_3, Color_9, Vector2_23, math_4, Grid3_2, Vector3_3, Colors_9, Lights;
    var __moduleName = context_73 && context_73.id;
    return {
        setters: [
            function (color_3_1) {
                color_3 = color_3_1;
            },
            function (Color_9_1) {
                Color_9 = Color_9_1;
            },
            function (Vector2_23_1) {
                Vector2_23 = Vector2_23_1;
            },
            function (math_4_1) {
                math_4 = math_4_1;
            },
            function (Grid3_2_1) {
                Grid3_2 = Grid3_2_1;
            },
            function (Vector3_3_1) {
                Vector3_3 = Vector3_3_1;
            },
            function (Colors_9_1) {
                Colors_9 = Colors_9_1;
            }
        ],
        execute: function () {
            Lights = class Lights {
                constructor(scene) {
                    this.scene = scene;
                    this.opacityLayer = new Grid3_2.Grid3(scene.size3);
                    this.lightLayer = new Grid3_2.Grid3(scene.size3)
                        .fill(position => ({ position, color: Colors_9.Colors.White, intensity: 0 }));
                }
                update() {
                    const objects = [];
                    this.scene.traverseVisible(x => objects.push(x));
                    this.updateOpacity(objects);
                    this.updateLights(objects);
                }
                getLightInfoAt(position) {
                    const position3 = new Vector3_3.Vector3(position.x, position.y, 0);
                    const lightInfo3 = this.lightLayer.at(position3);
                    return lightInfo3 ? { position, color: lightInfo3.color, intensity: lightInfo3.intensity } : undefined;
                }
                getLightInfoAt3(position) {
                    return this.lightLayer.at(position);
                }
                updateOpacity(objects) {
                    const opacityLayer = new Grid3_2.Grid3(this.scene.size3).fillValue(0);
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
                    this.lightLayer = new Grid3_2.Grid3(this.scene.size3)
                        .fill(position => ({ position, color: new Color_9.Color(1, 1, 1), intensity: 0 }));
                    const lightLayers = [];
                    const layers = [
                        this.scene.weather.cloudLayer,
                        this.scene.roofLayer,
                    ].map(x => this._expandToGrid3(x));
                    const skyLightLayer = this.createSkyLightLayer(this.scene.skyLight, layers, this.scene.size3);
                    lightLayers.push(skyLightLayer);
                    const lights = objects.flatMap(x => this.getObjectLights(x).map(y => ({ object: x, lightInfo: y })));
                    lightLayers.push(...lights.map(x => this.createLightLayer(x.object, x.lightInfo, this.scene.size3)));
                    this.mergeLightLayers(lightLayers, this.lightLayer);
                }
                // Uses 2d grid as an XY slice for each depth level (Z) of 3d grid.
                _expandToGrid3(grid) {
                    return new Grid3_2.Grid3(this.scene.size3)
                        .fill(position => grid.at(new Vector2_23.Vector2(position.x, position.y)) || 0);
                }
                // transparencyLayers - transparency [0..F].
                createSkyLightLayer(skyLight, transparencyLayers, size) {
                    const skyLightLayer = new Grid3_2.Grid3(this.scene.size3).fillValue(0);
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
                        this.spreadPoint(grid, null, position, position, 0);
                    });
                    return { intensityLayer: skyLightLayer, color: skyLight.color, };
                }
                getPositionOpacity(position) {
                    const opacity = this.opacityLayer.at(position);
                    const result = typeof opacity !== "undefined" ? opacity : 1;
                    return result;
                }
                _mapObjectPosition2To3(obj, position) {
                    const position2 = obj.getWorldPosition(new Vector2_23.Vector2()).sub(obj.originPoint).add(position);
                    const projectedDepth = -position.y + obj.originPoint.y;
                    return new Vector3_3.Vector3(position2.x, position2.y + projectedDepth, projectedDepth);
                }
                getObjectLights(obj) {
                    const lights = obj.physics.lights;
                    return lights.map(x => ({ ...x, position: this._mapObjectPosition2To3(obj, x.position) }));
                }
                getObjectMaterials(obj) {
                    const materials = obj.physics.materials;
                    return materials.map(x => ({ ...x, position: this._mapObjectPosition2To3(obj, x.position) }));
                }
                createLightLayer(sourceObject, lightInfo, size) {
                    const minLightIntensity = 0;
                    const layer = new Grid3_2.Grid3(size).fillValue(minLightIntensity);
                    this.addEmitter(layer, lightInfo.position, lightInfo.intensity);
                    this.spreadPoint(layer, sourceObject, lightInfo.position, lightInfo.position, minLightIntensity);
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
                        v.color.copy(color_3.mixColors(colors));
                    });
                }
                addEmitter(layer, position, level) {
                    const value = layer.at(position);
                    if (typeof value !== "undefined" &&
                        value < level) {
                        layer.setAt(position, level);
                    }
                }
                getPositionOpacity2(sourceObject, sourcePosition, position) {
                    if (!sourcePosition.equals(position)) {
                        return this.getPositionOpacity(position);
                    }
                    // Light sources should not be blocked by themselves.
                    const blocker = this.scene.blockedCacheObject.getBlockerAt(position);
                    return blocker && blocker !== sourceObject ? 1 : 0;
                }
                spreadPoint(array, sourceObject, sourcePosition, position, min, decay = Lights.defaultDecay) {
                    const positionOpacity = this.getPositionOpacity2(sourceObject, sourcePosition, position);
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
                    const relative = new Vector3_3.Vector3();
                    for (const direction of Vector3_3.Vector3.directions) {
                        relative.copy(direction);
                        const nextPosition = position.clone().add(relative);
                        if (!array.containsPosition(nextPosition)) {
                            continue;
                        }
                        if (array.at(nextPosition) >= nextIntensity) {
                            continue;
                        }
                        array.setAt(nextPosition, nextIntensity);
                        this.spreadPoint(array, sourceObject, sourcePosition, nextPosition, min, decay);
                    }
                }
            };
            exports_73("Lights", Lights);
            Lights.maxIntensity = 15;
            Lights.maxTransparency = 15;
            Lights.defaultOpacity = 1;
            Lights.defaultDecay = 2;
        }
    };
});
System.register("world/events/WeatherChangedGameEvent", ["engine/events/GameEvent"], function (exports_74, context_74) {
    "use strict";
    var GameEvent_1, WeatherChangedGameEvent;
    var __moduleName = context_74 && context_74.id;
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
            })(WeatherChangedGameEvent || (exports_74("WeatherChangedGameEvent", WeatherChangedGameEvent = {})));
        }
    };
});
System.register("engine/weather/Weather", ["engine/events/EventLoop", "engine/math/Vector2", "engine/weather/WeatherHelper", "engine/objects/Object2D", "utils/math", "engine/math/Grid", "world/events/WeatherChangedGameEvent"], function (exports_75, context_75) {
    "use strict";
    var EventLoop_1, Vector2_24, WeatherHelper_2, Object2D_12, math_5, Grid_6, WeatherChangedGameEvent_1, _position, Weather;
    var __moduleName = context_75 && context_75.id;
    return {
        setters: [
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
            },
            function (Vector2_24_1) {
                Vector2_24 = Vector2_24_1;
            },
            function (WeatherHelper_2_1) {
                WeatherHelper_2 = WeatherHelper_2_1;
            },
            function (Object2D_12_1) {
                Object2D_12 = Object2D_12_1;
            },
            function (math_5_1) {
                math_5 = math_5_1;
            },
            function (Grid_6_1) {
                Grid_6 = Grid_6_1;
            },
            function (WeatherChangedGameEvent_1_1) {
                WeatherChangedGameEvent_1 = WeatherChangedGameEvent_1_1;
            }
        ],
        execute: function () {
            _position = new Vector2_24.Vector2();
            Weather = class Weather {
                constructor(scene) {
                    this.scene = scene;
                    this.ticksPerDay = 1200000;
                    this.gameTime = 0;
                    this.weatherType = 'normal';
                    this.wind = Vector2_24.Vector2.zero;
                    this.windTicks = 0;
                    this.temperatureTicks = 0;
                    this.cloudLayer = new Grid_6.Grid(scene.size);
                    this.globalTemperature = scene.defaultTemperatureAtDay;
                    this.temperatureLayer = new Grid_6.Grid(scene.size).fillValue(this.globalTemperature);
                    this.moistureLayer = new Grid_6.Grid(scene.size).fillValue(scene.defaultMoisture);
                }
                update(ticks) {
                    if (!this.scene.debugDisableGameTime) {
                        this.gameTime += ticks;
                    }
                    const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
                    // 0.125 (1/8) so the least amount of sunlight is at 03:00
                    const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
                    this.scene.skyLight.intensity = math_5.clamp(this.scene.defaultLightIntensityAtNight + Math.round(sunlightPercent * (this.scene.defaultLightIntensityAtDay - this.scene.defaultLightIntensityAtNight)), 0, 15);
                    this.globalTemperature = this.scene.defaultTemperatureAtNight + Math.round(sunlightPercent * (this.scene.defaultTemperatureAtDay - this.scene.defaultTemperatureAtNight));
                    this.updateWeather(ticks);
                    this.updateTemperature(ticks);
                    this.updateMoisture();
                }
                getWeatherInfoAt(position) {
                    const weatherType = this._getWeatherTypeAt(position) || "normal";
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
                _getWeatherTypeAt(position) {
                    const particles = this.scene.particlesObject.getParticlesAt(position);
                    const weatherParticles = particles.filter(WeatherHelper_2.isWeatherPaticle);
                    if (weatherParticles.length > 0 && WeatherHelper_2.isWeatherPaticle(weatherParticles[0])) {
                        const weatherParticle = weatherParticles[0];
                        return weatherParticle.weatherType;
                    }
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
                    this.windTicks = Object2D_12.Object2D.updateValue(this.windTicks, ticks, 1000, () => {
                        this.updateWeatherWind();
                    });
                }
                updateWeatherWind() {
                    const scene = this.scene;
                    // Push weather particles with wind direction.
                    for (const particle of scene.weatherParticlesObject.children) {
                        particle.position.add(this.wind);
                    }
                    // Remove weather particles out of level bounds (+border).
                    for (const particle of scene.weatherParticlesObject.children) {
                        if (!scene.windBox.containsPoint(particle.getWorldPosition(_position))) {
                            scene.weatherParticlesObject.remove(particle);
                        }
                    }
                    // Push particles with wind direction.
                    for (const particle of scene.particlesObject.children) {
                        if (!particle.isMovableByWind) {
                            continue;
                        }
                        particle.position.add(this.wind);
                    }
                    // Remove particles out of level bounds (+border).
                    for (const particle of scene.particlesObject.children) {
                        if (!scene.windBox.containsPoint(particle.getWorldPosition(_position))) {
                            scene.particlesObject.remove(particle);
                        }
                    }
                }
                updateTemperature(ticks) {
                    this.temperatureTicks = Object2D_12.Object2D.updateValue(this.temperatureTicks, ticks, 1000, () => {
                        this.updateNormalize();
                        const objects = [];
                        this.scene.traverse(x => objects.push(x));
                        this.updateDeviate(objects);
                    });
                }
                updateNormalize() {
                    this.temperatureLayer.traverse((value, pos, layer) => {
                        const direction = -Math.sign(value - this.globalTemperature);
                        layer.setAt(pos, value + direction);
                    });
                }
                createTemperatureSources(objects) {
                    const temperatures = objects.flatMap(x => this.getObjectTemperatures(x));
                    const temperatureSourceMap = new Map();
                    for (const { position, temperature } of temperatures) {
                        const key = position.x + 10000 * position.y;
                        if (!temperatureSourceMap.has(key)) {
                            temperatureSourceMap.set(key, { position, temperature: 0 });
                        }
                        const item = temperatureSourceMap.get(key);
                        if (!item) {
                            continue;
                        }
                        item.temperature = Math.max(item.temperature, temperature);
                    }
                    return [...temperatureSourceMap.values()];
                }
                updateDeviate(objects) {
                    const sources = this.createTemperatureSources(objects);
                    for (const { position, temperature } of sources) {
                        this.temperatureLayer.setAt(position, temperature);
                    }
                    const newTemperatureLayer = new Grid_6.Grid(this.scene.size).fillValue(this.globalTemperature);
                    this.temperatureLayer.traverse((_, position) => {
                        const newValue = this.meanPoint(this.temperatureLayer, position);
                        newTemperatureLayer.setAt(position, newValue);
                    });
                    for (const { position, temperature } of sources) {
                        newTemperatureLayer.setAt(position, temperature);
                    }
                    this.temperatureLayer = newTemperatureLayer;
                }
                meanPoint(array, position) {
                    let sum = 0;
                    let counter = 0;
                    const [x, y] = position;
                    const pos = new Vector2_24.Vector2();
                    for (pos.y = Math.max(0, y - 1); pos.y <= Math.min(array.height - 1, y + 1); pos.y++) {
                        for (pos.x = Math.max(0, x - 1); pos.x <= Math.min(array.width - 1, x + 1); pos.x++) {
                            if (!(pos.y === y || pos.x === x)) {
                                continue;
                            }
                            const value = array.at(pos);
                            if (typeof value === "undefined") {
                                continue;
                            }
                            sum += value;
                            counter += 1;
                        }
                    }
                    const meanValue = Math.round(sum / counter) | 0;
                    return meanValue;
                }
                getObjectTemperatures(obj) {
                    const objectTemperatures = obj.physics.temperatures;
                    return objectTemperatures.map(x => ({ ...x, position: obj.getWorldPosition(new Vector2_24.Vector2()).sub(obj.originPoint).add(x.position) }));
                }
                updateMoisture() {
                    // TODO: check water tiles.
                }
            };
            exports_75("Weather", Weather);
        }
    };
});
System.register("engine/Level", ["engine/Scene", "engine/math/Vector2", "engine/events/EventLoop", "engine/events/GameEvent", "engine/signaling/SignalProcessor", "engine/math/Box2", "engine/ActionData", "engine/objects/Npc", "engine/objects/special/WeatherParticlesObject", "engine/objects/special/ParticlesObject", "engine/objects/special/TilesObject", "engine/objects/special/BlockedLayerObject", "engine/objects/special/SignalsLayerObject", "engine/objects/special/NumberGridObject", "engine/math/Color", "engine/lights/SkyLight", "engine/lights/Lights", "engine/weather/Weather", "engine/math/Grid", "engine/objects/special/BlockedCacheObject", "engine/math/Vector3"], function (exports_76, context_76) {
    "use strict";
    var Scene_1, Vector2_25, EventLoop_2, GameEvent_2, SignalProcessor_1, Box2_1, ActionData_1, Npc_1, WeatherParticlesObject_1, ParticlesObject_2, TilesObject_1, BlockedLayerObject_1, SignalsLayerObject_1, NumberGridObject_1, Color_10, SkyLight_1, Lights_1, Weather_1, Grid_7, BlockedCacheObject_1, Vector3_4, _position, Level;
    var __moduleName = context_76 && context_76.id;
    return {
        setters: [
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Vector2_25_1) {
                Vector2_25 = Vector2_25_1;
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
            function (ParticlesObject_2_1) {
                ParticlesObject_2 = ParticlesObject_2_1;
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
            function (Color_10_1) {
                Color_10 = Color_10_1;
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
            function (Grid_7_1) {
                Grid_7 = Grid_7_1;
            },
            function (BlockedCacheObject_1_1) {
                BlockedCacheObject_1 = BlockedCacheObject_1_1;
            },
            function (Vector3_4_1) {
                Vector3_4 = Vector3_4_1;
            }
        ],
        execute: function () {
            _position = new Vector2_25.Vector2();
            Level = class Level extends Scene_1.Scene {
                get portals() {
                    const portals = this.children.filter(x => x.type === "portal");
                    const map = {};
                    for (const portal of portals) {
                        if (!map[portal.name]) {
                            map[portal.name] = [];
                        }
                        map[portal.name].push(portal.getWorldPosition(new Vector2_25.Vector2()));
                    }
                    return map;
                }
                get box() {
                    const size2 = new Vector2_25.Vector2(this.size.width, this.size.height);
                    return new Box2_1.Box2(Vector2_25.Vector2.zero, ((size2 === null || size2 === void 0 ? void 0 : size2.clone()) || Vector2_25.Vector2.zero).sub(new Vector2_25.Vector2(1, 1)));
                }
                get windBox() {
                    var _a;
                    const margin = (((_a = this.weather.wind) === null || _a === void 0 ? void 0 : _a.clone()) || Vector2_25.Vector2.zero).multiplyScalar(2);
                    return this.box.clone().expandByVector(margin);
                }
                constructor(id, objects, tiles) {
                    super();
                    this.isLevel = true;
                    this._isLoaded = false;
                    this.defaultLightIntensityAtNight = 4;
                    this.defaultLightIntensityAtDay = 15;
                    this.defaultTemperatureAtNight = 4;
                    this.defaultTemperatureAtDay = 7;
                    this.defaultMoisture = 5;
                    this.debugDisableGameTime = false;
                    this.debugTickFreeze = false;
                    this.debugTickStep = 0;
                    this.type = "level";
                    this.name = id;
                    this.background = new Color_10.Color(0, 131 / 255, 143 / 255);
                    const size2 = new Vector2_25.Vector2(tiles.size.width, tiles.size.height);
                    this.size = size2;
                    this.size3 = new Vector3_4.Vector3(size2.width, size2.height, Level.defaultMaxDepth);
                    this.lights = new Lights_1.Lights(this);
                    this.weather = new Weather_1.Weather(this);
                    this.signalProcessor = new SignalProcessor_1.SignalProcessor(this);
                    this.roofLayer = new Grid_7.Grid(size2);
                    this.roofHolesLayer = new Grid_7.Grid(size2);
                    this.tilesObject = new TilesObject_1.TilesObject(tiles);
                    this.add(this.tilesObject);
                    for (const object of objects) {
                        this.add(object);
                    }
                    this.particlesObject = new ParticlesObject_2.ParticlesObject();
                    this.add(this.particlesObject);
                    this.weatherParticlesObject = new WeatherParticlesObject_1.WeatherParticlesObject();
                    this.add(this.weatherParticlesObject);
                    this.blockedCacheObject = new BlockedCacheObject_1.BlockedCacheObject(this.size3);
                    this.add(this.blockedCacheObject);
                    this.blockedLayerObject = new BlockedLayerObject_1.BlockedLayerObject(this.blockedCacheObject).disable();
                    this.add(this.blockedLayerObject);
                    this.signalsLayerObject = new SignalsLayerObject_1.SignalsLayerObject().disable();
                    this.add(this.signalsLayerObject);
                    this.temperatureLayerObject = new NumberGridObject_1.NumberGridObject(() => this.weather.temperatureLayer).disable();
                    this.add(this.temperatureLayerObject);
                    this.moistureLayerObject = new NumberGridObject_1.NumberGridObject(() => this.weather.moistureLayer).disable();
                    this.add(this.moistureLayerObject);
                    this.opacityLayerObject = new NumberGridObject_1.NumberGridObject(() => this.lights.opacityLayer.atDepth(0).map(v => v > 0 ? (v * 15) | 0 : undefined)).disable();
                    this.add(this.opacityLayerObject);
                    this.lightLayerObject = new NumberGridObject_1.NumberGridObject(() => this.lights.lightLayer.atDepth(0).map(v => v.intensity)).disable();
                    this.add(this.lightLayerObject);
                    this.skyLight = new SkyLight_1.SkyLight(new Color_10.Color(1, 1, 1), 15);
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
                    return this.blockedCacheObject.isPositionBlocked(position);
                }
                getNpcAt(position) {
                    for (let object of this.children) {
                        if (!object.enabled)
                            continue;
                        if (!(object instanceof Npc_1.Npc))
                            continue;
                        //
                        if (object.getWorldPosition(_position).equals(position)) {
                            return object;
                        }
                    }
                    return undefined;
                }
                getActionsAt(cellPosition) {
                    const scene = this;
                    const actions = [];
                    scene.traverseVisible(object => {
                        const objectPos = object.getWorldPosition(_position);
                        const objectOrigin = object.originPoint;
                        const result = objectPos.negate().add(cellPosition).add(objectOrigin);
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
            exports_76("Level", Level);
            Level.defaultMaxDepth = 6;
        }
    };
});
System.register("world/events/DamageGameEvent", ["engine/events/GameEvent"], function (exports_77, context_77) {
    "use strict";
    var GameEvent_3, DamageGameEvent;
    var __moduleName = context_77 && context_77.id;
    return {
        setters: [
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            }
        ],
        execute: function () {
            (function (DamageGameEvent) {
                DamageGameEvent.type = "damage";
                class Args {
                }
                DamageGameEvent.Args = Args;
                function create(object, subject, damageValue, damageType) {
                    return new GameEvent_3.GameEvent(object, DamageGameEvent.type, {
                        object,
                        subject,
                        damageValue,
                        damageType,
                    });
                }
                DamageGameEvent.create = create;
            })(DamageGameEvent || (exports_77("DamageGameEvent", DamageGameEvent = {})));
        }
    };
});
System.register("world/events/DeathGameEvent", ["engine/events/GameEvent"], function (exports_78, context_78) {
    "use strict";
    var GameEvent_4, DeathGameEvent;
    var __moduleName = context_78 && context_78.id;
    return {
        setters: [
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            }
        ],
        execute: function () {
            (function (DeathGameEvent) {
                DeathGameEvent.type = "death";
                class Args {
                }
                DeathGameEvent.Args = Args;
                function create(object, cause, by) {
                    return new GameEvent_4.GameEvent(object, DeathGameEvent.type, {
                        object,
                        cause,
                        by,
                    });
                }
                DeathGameEvent.create = create;
            })(DeathGameEvent || (exports_78("DeathGameEvent", DeathGameEvent = {})));
        }
    };
});
System.register("engine/effects/CloakEffect", ["engine/effects/Effect"], function (exports_79, context_79) {
    "use strict";
    var Effect_4, CloakEffect, LightCloakEffect;
    var __moduleName = context_79 && context_79.id;
    function isCloak(x) {
        return ("isCloak" in x);
    }
    exports_79("isCloak", isCloak);
    function isLight(x) {
        return ("isLight" in x);
    }
    exports_79("isLight", isLight);
    return {
        setters: [
            function (Effect_4_1) {
                Effect_4 = Effect_4_1;
            }
        ],
        execute: function () {
            CloakEffect = class CloakEffect extends Effect_4.Effect {
                constructor(type, level, ticks = 0) {
                    super("cloak", type, level, ticks);
                    this.type = type;
                    this.level = level;
                    this.isCloak = true;
                    this.isStackable = true;
                    this.isMaxOverridable = true;
                }
            };
            exports_79("CloakEffect", CloakEffect);
            LightCloakEffect = class LightCloakEffect extends CloakEffect {
                constructor(level, ticks = 0) {
                    super("light", level, ticks);
                    this.level = level;
                    this.isLight = true;
                }
            };
            exports_79("LightCloakEffect", LightCloakEffect);
        }
    };
});
System.register("world/sprites/damage/slashDamageSprite", ["engine/data/Sprite"], function (exports_80, context_80) {
    "use strict";
    var Sprite_7, slashDamageSpriteRaw, slashDamageSprite;
    var __moduleName = context_80 && context_80.id;
    return {
        setters: [
            function (Sprite_7_1) {
                Sprite_7 = Sprite_7_1;
            }
        ],
        execute: function () {
            slashDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
◟◝ノ◝◞
RRRRR`;
            exports_80("slashDamageSprite", slashDamageSprite = Sprite_7.Sprite.parse(slashDamageSpriteRaw));
        }
    };
});
System.register("world/sprites/damage/pierceDamageSprite", ["engine/data/Sprite"], function (exports_81, context_81) {
    "use strict";
    var Sprite_8, pierceDamageSpriteRaw, pierceDamageSprite;
    var __moduleName = context_81 && context_81.id;
    return {
        setters: [
            function (Sprite_8_1) {
                Sprite_8 = Sprite_8_1;
            }
        ],
        execute: function () {
            pierceDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
➷➴⟡✦ㆍ
RRRRR`;
            exports_81("pierceDamageSprite", pierceDamageSprite = Sprite_8.Sprite.parse(pierceDamageSpriteRaw));
        }
    };
});
System.register("world/sprites/damage/fireDamageSprite", ["engine/data/Sprite"], function (exports_82, context_82) {
    "use strict";
    var Sprite_9, fireDamageSpriteRaw, fireDamageSprite;
    var __moduleName = context_82 && context_82.id;
    return {
        setters: [
            function (Sprite_9_1) {
                Sprite_9 = Sprite_9_1;
            }
        ],
        execute: function () {
            fireDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
🔥💥🔥💥
RRRR`;
            exports_82("fireDamageSprite", fireDamageSprite = Sprite_9.Sprite.parse(fireDamageSpriteRaw));
        }
    };
});
System.register("world/sprites/damage/poisonDamageSprite", ["engine/data/Sprite"], function (exports_83, context_83) {
    "use strict";
    var Sprite_10, poisonDamageSpriteRaw, poisonDamageSprite;
    var __moduleName = context_83 && context_83.id;
    return {
        setters: [
            function (Sprite_10_1) {
                Sprite_10 = Sprite_10_1;
            }
        ],
        execute: function () {
            poisonDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
🧪☠️🧪☠️
RRRR`;
            exports_83("poisonDamageSprite", poisonDamageSprite = Sprite_10.Sprite.parse(poisonDamageSpriteRaw));
        }
    };
});
System.register("engine/objects/WeaponTags", [], function (exports_84, context_84) {
    "use strict";
    var WeaponTags;
    var __moduleName = context_84 && context_84.id;
    return {
        setters: [],
        execute: function () {
            (function (WeaponTags) {
                WeaponTags.isRanged = Symbol("isRanged");
                WeaponTags.isSlash = Symbol("isSlash");
                WeaponTags.isPierce = Symbol("isPierce");
                WeaponTags.isBlunt = Symbol("isBlunt");
            })(WeaponTags || (exports_84("WeaponTags", WeaponTags = {})));
        }
    };
});
System.register("world/sprites/damage/bluntDamageSprite", ["engine/data/Sprite"], function (exports_85, context_85) {
    "use strict";
    var Sprite_11, bluntDamageSpriteRaw, bluntDamageSprite;
    var __moduleName = context_85 && context_85.id;
    return {
        setters: [
            function (Sprite_11_1) {
                Sprite_11 = Sprite_11_1;
            }
        ],
        execute: function () {
            bluntDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
✴💥💢
RRR`;
            exports_85("bluntDamageSprite", bluntDamageSprite = Sprite_11.Sprite.parse(bluntDamageSpriteRaw));
        }
    };
});
System.register("engine/effects/LightEffect", ["engine/effects/Effect"], function (exports_86, context_86) {
    "use strict";
    var Effect_5, LightEffect;
    var __moduleName = context_86 && context_86.id;
    function isLuminocite(x) {
        return ("isLuminocite" in x);
    }
    exports_86("isLuminocite", isLuminocite);
    return {
        setters: [
            function (Effect_5_1) {
                Effect_5 = Effect_5_1;
            }
        ],
        execute: function () {
            LightEffect = class LightEffect extends Effect_5.Effect {
                constructor(type, level, color, ticks = 0) {
                    super("light", type, level, ticks);
                    this.type = type;
                    this.level = level;
                    this.color = color;
                    this.isLuminocite = true;
                    this.isStackable = true;
                    this.isMaxOverridable = true;
                }
            };
            exports_86("LightEffect", LightEffect);
        }
    };
});
System.register("world/sprites/stunSprite", ["engine/data/Sprite"], function (exports_87, context_87) {
    "use strict";
    var Sprite_12, stunSpriteRaw, stunSprite;
    var __moduleName = context_87 && context_87.id;
    return {
        setters: [
            function (Sprite_12_1) {
                Sprite_12 = Sprite_12_1;
            }
        ],
        execute: function () {
            stunSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#F55F,#0000

particle
࿔๑꩜𖦹꩜๑࿔
RRRRRRR`;
            exports_87("stunSprite", stunSprite = Sprite_12.Sprite.parse(stunSpriteRaw));
        }
    };
});
System.register("world/sprites/damage/thunderDamageSprite", ["engine/data/Sprite"], function (exports_88, context_88) {
    "use strict";
    var Sprite_13, thunderDamageSpriteRaw, thunderDamageSprite;
    var __moduleName = context_88 && context_88.id;
    return {
        setters: [
            function (Sprite_13_1) {
                Sprite_13 = Sprite_13_1;
            }
        ],
        execute: function () {
            thunderDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
↯ϟ⚡︎🗲
RRRR`;
            exports_88("thunderDamageSprite", thunderDamageSprite = Sprite_13.Sprite.parse(thunderDamageSpriteRaw));
        }
    };
});
System.register("engine/objects/Npc", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/events/EventLoop", "engine/objects/Equipment", "engine/objects/NpcMovementOptions", "engine/math/Vector2", "utils/math", "engine/effects/DamageEffect", "engine/effects/SlownessEffect", "world/events/DamageGameEvent", "world/events/DeathGameEvent", "engine/effects/CloakEffect", "world/sprites/damage/slashDamageSprite", "engine/objects/Particle", "world/sprites/damage/pierceDamageSprite", "world/sprites/damage/fireDamageSprite", "world/sprites/damage/poisonDamageSprite", "engine/objects/WeaponTags", "world/sprites/damage/bluntDamageSprite", "engine/effects/LightEffect", "world/sprites/stunSprite", "world/sprites/damage/thunderDamageSprite", "engine/math/Vector3"], function (exports_89, context_89) {
    "use strict";
    var Object2D_13, ObjectSkin_8, ObjectPhysics_4, EventLoop_3, Equipment_1, NpcMovementOptions_1, Vector2_26, math_6, DamageEffect_2, SlownessEffect_2, DamageGameEvent_1, DeathGameEvent_1, CloakEffect_1, slashDamageSprite_1, Particle_5, pierceDamageSprite_1, fireDamageSprite_1, poisonDamageSprite_1, WeaponTags_1, bluntDamageSprite_1, LightEffect_1, stunSprite_1, thunderDamageSprite_1, Vector3_5, _position, _position2, _direction, Npc;
    var __moduleName = context_89 && context_89.id;
    return {
        setters: [
            function (Object2D_13_1) {
                Object2D_13 = Object2D_13_1;
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
            function (Equipment_1_1) {
                Equipment_1 = Equipment_1_1;
            },
            function (NpcMovementOptions_1_1) {
                NpcMovementOptions_1 = NpcMovementOptions_1_1;
            },
            function (Vector2_26_1) {
                Vector2_26 = Vector2_26_1;
            },
            function (math_6_1) {
                math_6 = math_6_1;
            },
            function (DamageEffect_2_1) {
                DamageEffect_2 = DamageEffect_2_1;
            },
            function (SlownessEffect_2_1) {
                SlownessEffect_2 = SlownessEffect_2_1;
            },
            function (DamageGameEvent_1_1) {
                DamageGameEvent_1 = DamageGameEvent_1_1;
            },
            function (DeathGameEvent_1_1) {
                DeathGameEvent_1 = DeathGameEvent_1_1;
            },
            function (CloakEffect_1_1) {
                CloakEffect_1 = CloakEffect_1_1;
            },
            function (slashDamageSprite_1_1) {
                slashDamageSprite_1 = slashDamageSprite_1_1;
            },
            function (Particle_5_1) {
                Particle_5 = Particle_5_1;
            },
            function (pierceDamageSprite_1_1) {
                pierceDamageSprite_1 = pierceDamageSprite_1_1;
            },
            function (fireDamageSprite_1_1) {
                fireDamageSprite_1 = fireDamageSprite_1_1;
            },
            function (poisonDamageSprite_1_1) {
                poisonDamageSprite_1 = poisonDamageSprite_1_1;
            },
            function (WeaponTags_1_1) {
                WeaponTags_1 = WeaponTags_1_1;
            },
            function (bluntDamageSprite_1_1) {
                bluntDamageSprite_1 = bluntDamageSprite_1_1;
            },
            function (LightEffect_1_1) {
                LightEffect_1 = LightEffect_1_1;
            },
            function (stunSprite_1_1) {
                stunSprite_1 = stunSprite_1_1;
            },
            function (thunderDamageSprite_1_1) {
                thunderDamageSprite_1 = thunderDamageSprite_1_1;
            },
            function (Vector3_5_1) {
                Vector3_5 = Vector3_5_1;
            }
        ],
        execute: function () {
            _position = new Vector2_26.Vector2();
            _position2 = new Vector2_26.Vector2();
            _direction = new Vector2_26.Vector2();
            Npc = class Npc extends Object2D_13.Object2D {
                get activeEffects() {
                    return Object.freeze(this._activeEffects);
                }
                get attackValue() {
                    return this.basicAttack; // @todo
                }
                get stubAttackValue() {
                    return this.stunAttack;
                }
                get attackDamageType() {
                    // TODO: use this.equipment.objectInMainHand damage type.
                    const weapon = this.equipment.objectInMainHand;
                    if (weapon) {
                        if (WeaponTags_1.WeaponTags.isSlash in weapon) {
                            return "slash";
                        }
                        else if (WeaponTags_1.WeaponTags.isPierce in weapon) {
                            return "pierce";
                        }
                        else if (WeaponTags_1.WeaponTags.isBlunt in weapon) {
                            return "blunt";
                        }
                    }
                    return this.defaultDamageType;
                }
                constructor(skin = new ObjectSkin_8.ObjectSkin(), position = Vector2_26.Vector2.zero, originPoint = Vector2_26.Vector2.zero) {
                    super(originPoint, skin, new ObjectPhysics_4.ObjectPhysics().collision(), position);
                    this._isLogHeroEffectsEnabled = false;
                    this.movementOptions = NpcMovementOptions_1.defaultMovementOptions.walking;
                    this.moveTick = 0;
                    this.equipment = new Equipment_1.Equipment(this);
                    this.health = 1;
                    this.maxHealth = 3;
                    this.stunValue = 0;
                    this.maxStunValue = 10;
                    this.isStunned = false; // Can not attack or move.
                    this.stunTicks = 0;
                    this.stunDuration = 3000;
                    this.defaultDamageType = "blunt";
                    this.basicAttack = 1;
                    this.stunAttack = 1;
                    this.attackTick = 0;
                    this.attackSpeed = 1; // atk per second
                    this.movementPenalty = 1;
                    this.sightLightLevel = 0;
                    this.cloakLightLevel = 0;
                    this.behaviors = [];
                    this.mount = null;
                    this.target = undefined;
                    this.isUnobstructed = true;
                    this._activeEffects = [];
                    this._isMoveRequested = false;
                    this.damageFlashDuration = 400;
                    this.damageFlashTicks = 0;
                    this.stunParticle = new Particle_5.Particle(stunSprite_1.stunSprite, Vector2_26.Vector2.zero, 1);
                }
                getWorldCursorPosition(target) {
                    return this.getWorldPosition(target).add(this.getWorldDirection(_position2));
                }
                update(ticks) {
                    var _a, _b;
                    super.update(ticks);
                    this.moveTick += ticks;
                    this.attackTick += ticks;
                    this.stunTicks += ticks;
                    if (this.damageFlashTicks > 0) {
                        this.damageFlashTicks = Math.max(0, this.damageFlashTicks - ticks);
                    }
                    // reset values
                    this.movementPenalty = 1;
                    this.cloakLightLevel = 0;
                    this.physics.lights = [];
                    //
                    // Apply effects from tiles.
                    const tile = this.scene.tilesObject.getTileAt(this.getWorldPosition(_position));
                    const tileEffects = tile.effects;
                    for (const newEffect of tileEffects) {
                        const added = this.tryAddEffect(newEffect, tile);
                        if (this.name === 'hero' && added && this._isLogHeroEffectsEnabled) {
                            console.log(`Added tile effect '${newEffect.name}.${newEffect.type}' to ${this.type}.`);
                        }
                    }
                    // Apply effects from particles.
                    const particles = [
                        ...(((_a = this.scene.particlesObject) === null || _a === void 0 ? void 0 : _a.getParticlesAt(this.getWorldPosition(_position))) || []),
                        ...(((_b = this.scene.weatherParticlesObject) === null || _b === void 0 ? void 0 : _b.getParticlesAt(this.getWorldPosition(_position))) || []),
                    ];
                    for (const particle of particles) {
                        for (const newEffect of particle.hostEffects) {
                            const added = this.tryAddEffect(newEffect, particle);
                            if (this.name === 'hero' && added && this._isLogHeroEffectsEnabled) {
                                console.log(`Added particle effect '${newEffect.name}.${newEffect.type}' to ${this.type}.`);
                            }
                        }
                    }
                    //
                    for (const b of this.behaviors) {
                        b.update(ticks, this);
                    }
                    if (!this.isStunned && this.stunValue >= this.maxStunValue) {
                        this.stun();
                    }
                    if (this.isStunned && this.stunTicks >= this.stunDuration) {
                        this.unstun();
                    }
                    if (this._isMoveRequested) {
                        this.calculateMove();
                        this._isMoveRequested = false;
                    }
                    this.cloakLightLevel = this._calculateCloakLightLevel();
                    const extraLights = this._calculateExtraLights();
                    this.physics.lights = extraLights;
                    //
                    for (const activeEffect of this._activeEffects) {
                        activeEffect.update(ticks, this);
                    }
                    this._clearActiveEffects();
                }
                _clearActiveEffects() {
                    for (let i = this._activeEffects.length - 1; i >= 0; i--) {
                        const activeEffect = this._activeEffects[i];
                        if (!activeEffect.isExpired()) {
                            continue;
                        }
                        this._activeEffects.splice(i, 1);
                        if (this.name === 'hero' && this._isLogHeroEffectsEnabled) {
                            console.log(`Removed active effect '${activeEffect.effect.name}.${activeEffect.effect.type}'.`);
                        }
                    }
                }
                stun() {
                    if (this.isStunned) {
                        return;
                    }
                    this.stunValue = 0;
                    this.isStunned = true;
                    this.stunTicks = 0;
                    this._addOverlayParticle(this.stunParticle);
                    console.log(`${this.type} is stunned.`);
                }
                unstun() {
                    if (!this.isStunned) {
                        return;
                    }
                    this.isStunned = false;
                    this.stunTicks = 0;
                    this.stunParticle.removeFromParent();
                    console.log(`${this.type} is no longer stunned.`);
                }
                addActiveEffect(activeEffect) {
                    activeEffect.start(this);
                    this._activeEffects.push(activeEffect);
                }
                tryAddEffect(newEffect, damager) {
                    if (newEffect.isStackable) {
                        this.addActiveEffect(newEffect.activate(damager));
                        return true;
                    }
                    const existingIndex = this._activeEffects
                        .map(x => x.effect)
                        .findIndex(x => x.name === newEffect.name && x.type === newEffect.type);
                    if (existingIndex === -1) {
                        this.addActiveEffect(newEffect.activate(damager));
                        return true;
                    }
                    if (newEffect.isMaxOverridable &&
                        newEffect.value > this._activeEffects[existingIndex].effect.value) {
                        this._activeEffects.splice(existingIndex, 1);
                        this.addActiveEffect(newEffect.activate(damager));
                        return true;
                    }
                    return false;
                }
                move() {
                    this._isMoveRequested = true;
                }
                calculateMove() {
                    if (this.isStunned) {
                        return;
                    }
                    const position = this.getWorldCursorPosition(_position);
                    const tile = this.scene.tilesObject.getTileAt(position);
                    const moveSpeed = this.calculateMoveSpeed(tile);
                    const moveSpeedPenalty = this.getTotalMovementPenalty();
                    // console.log(`Slowness is ${moveSpeedPenalty}.`);
                    const resultSpeed = Math.round(moveSpeed * (1 - moveSpeedPenalty)) | 0;
                    if (resultSpeed <= 0) {
                        return;
                    }
                    if (this.moveTick >= 1000 / Math.max(1, resultSpeed)) {
                        this.doMove();
                        this.moveTick = 0;
                    }
                }
                doMove() {
                    var _a;
                    const position = this.getWorldPosition(_position);
                    const tile = (_a = this.scene) === null || _a === void 0 ? void 0 : _a.tilesObject.getTileAt(position);
                    if (this.realm === "ground") {
                        tile === null || tile === void 0 ? void 0 : tile.addHardDisturbance();
                    }
                    this.position.add(this.getWorldDirection(_direction));
                    this.updateMatrixWorld();
                    if (this.realm === "ground") {
                        tile === null || tile === void 0 ? void 0 : tile.decreaseSnow();
                    }
                }
                attack(target) {
                    if (this.isStunned) {
                        return;
                    }
                    const overflow = this.attackTick - 1000 / this.attackSpeed;
                    if (overflow >= 0) {
                        this.attackTick = 0;
                        EventLoop_3.emitEvent(DamageGameEvent_1.DamageGameEvent.create(this, target, this.attackValue, this.attackDamageType));
                    }
                }
                distanceTo(other) {
                    const thisPosition = this.getWorldPosition(_position);
                    const otherPosition = other.getWorldPosition(_position2);
                    return thisPosition.distanceTo(otherPosition);
                }
                damage(value, type, damager) {
                    const resultDamage = this.calculateResultDamage(value, type);
                    console.log(`${this.type} got ${resultDamage} ${type} damage from ${damager.type}.`);
                    this.health = Math.max(0, this.health - resultDamage);
                    this.damageFlashTicks = this.damageFlashDuration;
                    if (!this.isStunned) {
                        this.stunValue += 1; // TODO: implement break damage system;
                    }
                    const particle = this.getDamageParticle(type);
                    if (particle) {
                        this._addOverlayParticle(particle);
                    }
                    if (this.health === 0) {
                        this.enabled = false;
                        EventLoop_3.emitEvent(DeathGameEvent_1.DeathGameEvent.create(this, type, damager));
                    }
                }
                _addOverlayParticle(particle) {
                    particle.layer = "objects"; // Removes default particles layer transparency.
                    this.add(particle);
                }
                getDamageParticle(type) {
                    const options = {
                        decaySpeed: 100,
                    };
                    if (type === "slash") {
                        return new Particle_5.Particle(slashDamageSprite_1.slashDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    if (type === "pierce") {
                        return new Particle_5.Particle(pierceDamageSprite_1.pierceDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    if (type === "blunt") {
                        return new Particle_5.Particle(bluntDamageSprite_1.bluntDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    if (type === "fire") {
                        return new Particle_5.Particle(fireDamageSprite_1.fireDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    if (type === "thunder") {
                        return new Particle_5.Particle(thunderDamageSprite_1.thunderDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    if (type === "poison") {
                        return new Particle_5.Particle(poisonDamageSprite_1.poisonDamageSprite, Vector2_26.Vector2.zero, 1, options);
                    }
                    return undefined;
                }
                getDamageOverlayAlpha() {
                    if (this.damageFlashTicks <= 0) {
                        return 0;
                    }
                    const progress = 1 - this.damageFlashTicks / this.damageFlashDuration;
                    const blink = Math.sin(progress * Math.PI * 4);
                    const intensity = Math.abs(blink);
                    return math_6.clamp(0.25 + intensity * 0.4, 0, 1);
                }
                _getAllEffects() {
                    return [...this._activeEffects.map(x => x.effect), ...this.equipment.getEffects()];
                }
                getTotalMovementPenalty() {
                    const effects = this._getAllEffects()
                        .filter(SlownessEffect_2.isSlowness);
                    const slownessValues = effects
                        .map(x => ({
                        type: x.type,
                        slowness: x.movementPenalty * (1 - this.getTotalSlownessReduction(x.type)),
                    }));
                    const sum = slownessValues.reduce((a, x) => a += x.slowness, 0);
                    const result = math_6.clamp(sum, 0, 1);
                    return result;
                }
                getTotalSlownessReduction(type) {
                    const effects = this._getAllEffects()
                        .filter(SlownessEffect_2.isSlownessReduction)
                        .filter(x => x.type === type);
                    const sum = effects.reduce((a, x) => a += x.reduction, 0);
                    const result = math_6.clamp(sum, 0, 1);
                    return result;
                }
                getTotalDamageReduction(type) {
                    const effects = this._getAllEffects()
                        .filter(DamageEffect_2.isDamageReduction)
                        .filter(x => x.type === type);
                    const sum = effects.reduce((a, x) => a += x.reduction, 0);
                    const result = math_6.clamp(sum, 0, 1);
                    return result;
                }
                calculateResultDamage(value, type) {
                    // TODO: add stun damage multiplier.
                    const reduction = this.getTotalDamageReduction(type);
                    return value * (1 - reduction);
                }
                calculateSightLightLevel() {
                    return this.sightLightLevel;
                }
                _calculateCloakLightLevel() {
                    const effects = this._getAllEffects()
                        .filter(CloakEffect_1.isCloak)
                        .filter(CloakEffect_1.isLight);
                    const sum = effects.reduce((a, x) => a += x.value, this.cloakLightLevel);
                    const result = math_6.clamp(sum, 0, 15);
                    return result;
                }
                _calculateExtraLights() {
                    const effects = this._getAllEffects()
                        .filter(LightEffect_1.isLuminocite);
                    return effects.map(x => ({ position: Vector2_26.Vector2.zero, intensity: x.value, color: x.color }));
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === DamageGameEvent_1.DamageGameEvent.type) {
                        const args = ev.args;
                        if (args.subject === this) {
                            this.damage(args.damageValue, args.damageType, args.object);
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
                        const position = this.getWorldPosition(_position).add(pd.direction);
                        if (enemiesNearby.length) {
                            const distances = enemiesNearby.map(x => position.distanceTo(x.getWorldPosition(_position2)));
                            const nearestEnemyDistance = Math.min(...distances);
                            pd.distance = nearestEnemyDistance;
                        }
                    }
                    const directions = possibleDirs;
                    directions.sort((x, y) => y.distance - x.distance);
                    if (!directions.length) {
                        return;
                    }
                    this.lookAt(this._getDirection(directions));
                    this.move();
                }
                approach(target) {
                    const npcPosition = this.getWorldPosition(_position);
                    const targetPosition = target.getWorldPosition(_position2);
                    if (npcPosition.distanceTo(targetPosition) <= 1.0) {
                        return;
                    }
                    const freeDirections = this.getFreeDirections();
                    if (freeDirections.length === 0) {
                        return;
                    }
                    const possibleDirs = freeDirections
                        .map(x => {
                        const position = this.getWorldPosition(_position).add(x);
                        return {
                            direction: x,
                            distance: position.distanceTo(targetPosition),
                        };
                    });
                    const directions = possibleDirs;
                    directions.sort((x, y) => x.distance - y.distance);
                    if (!directions.length) {
                        return;
                    }
                    this.lookAt(this._getDirection(directions));
                    this.move();
                }
                _getDirection(direction) {
                    if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                        const randIndex = Math.random() * 2 | 0;
                        return direction[randIndex].direction;
                    }
                    return direction[0].direction;
                }
                faceRandomDirection(koef = 100) {
                    if ((Math.random() * koef | 0) === 0) {
                        const directions = Vector2_26.Vector2.directions;
                        const randomIndex = Math.random() * directions.length | 0;
                        this.lookAt(directions[randomIndex]);
                    }
                }
                getFreeDirections() {
                    // Detect all possible free positions.
                    const directions = Vector2_26.Vector2.directions
                        .map(direction => {
                        const position = this.getWorldPosition(_position).add(direction);
                        const position3 = new Vector3_5.Vector3(position.x, position.y, 0);
                        return ({
                            direction,
                            isBlocked: this.scene.isPositionBlocked(position3)
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
                        this.lookAt(freeDirections[0]);
                        this.move();
                        return;
                    }
                    // Select random free position.
                    const randomIndex = Math.random() * freeDirections.length | 0;
                    this.lookAt(freeDirections[randomIndex]);
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
                        if (object instanceof Npc &&
                            callback(object) &&
                            this.distanceTo(object) < radius) {
                            enemies.push(object);
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
                        if (callback(object) &&
                            this.distanceTo(object) < radius) {
                            nearObjects.push(object);
                        }
                    }
                    return nearObjects;
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
                    if (isInWater) {
                        return obj.movementOptions.swimmingSpeed;
                    }
                    if (isOnMountain) {
                        return obj.movementOptions.climbingSpeed;
                    }
                    return obj.movementOptions.walkingSpeed;
                }
            };
            exports_89("Npc", Npc);
        }
    };
});
System.register("engine/objects/Inventory", [], function (exports_90, context_90) {
    "use strict";
    var Inventory;
    var __moduleName = context_90 && context_90.id;
    return {
        setters: [],
        execute: function () {
            Inventory = class Inventory {
                constructor() {
                    this.items = [];
                }
                addItems(newItems) {
                    this.items.push(...newItems);
                }
            };
            exports_90("Inventory", Inventory);
        }
    };
});
System.register("engine/graphics/Layers", [], function (exports_91, context_91) {
    "use strict";
    var Layers;
    var __moduleName = context_91 && context_91.id;
    return {
        setters: [],
        execute: function () {
            exports_91("Layers", Layers = ["objects", "particles", "ui"]);
        }
    };
});
System.register("engine/cameras/Camera", ["engine/Level", "engine/math/Box2", "engine/math/Box3", "engine/math/Vector2", "engine/math/Vector3", "engine/objects/Object2D"], function (exports_92, context_92) {
    "use strict";
    var Level_1, Box2_2, Box3_1, Vector2_27, Vector3_6, Object2D_14, followOffset, Camera;
    var __moduleName = context_92 && context_92.id;
    return {
        setters: [
            function (Level_1_1) {
                Level_1 = Level_1_1;
            },
            function (Box2_2_1) {
                Box2_2 = Box2_2_1;
            },
            function (Box3_1_1) {
                Box3_1 = Box3_1_1;
            },
            function (Vector2_27_1) {
                Vector2_27 = Vector2_27_1;
            },
            function (Vector3_6_1) {
                Vector3_6 = Vector3_6_1;
            },
            function (Object2D_14_1) {
                Object2D_14 = Object2D_14_1;
            }
        ],
        execute: function () {
            exports_92("followOffset", followOffset = 4);
            Camera = class Camera extends Object2D_14.Object2D {
                constructor() {
                    super(...arguments);
                    this.size = new Vector2_27.Vector2(48, 32);
                }
                get box() {
                    const position = this.getWorldPosition(new Vector2_27.Vector2());
                    const position2 = position.clone().add(this.size);
                    return new Box2_2.Box2(position, position2);
                }
                get box3() {
                    const position = this.getWorldPosition(new Vector2_27.Vector2());
                    const position2 = position.clone().add(this.size);
                    const height = Level_1.Level.defaultMaxDepth;
                    return new Box3_1.Box3(new Vector3_6.Vector3(position.x, position.y, 0), new Vector3_6.Vector3(position2.x, position2.y, height));
                }
            };
            exports_92("Camera", Camera);
        }
    };
});
System.register("engine/cameras/FollowCamera", ["engine/math/Vector2", "engine/cameras/Camera"], function (exports_93, context_93) {
    "use strict";
    var Vector2_28, Camera_1, FollowCamera;
    var __moduleName = context_93 && context_93.id;
    return {
        setters: [
            function (Vector2_28_1) {
                Vector2_28 = Vector2_28_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            }
        ],
        execute: function () {
            FollowCamera = class FollowCamera extends Camera_1.Camera {
                constructor(followObject, boundingSize) {
                    super();
                    this.followObject = followObject;
                    this.boundingSize = boundingSize;
                    this.followObject = followObject;
                    this.boundingSize = boundingSize;
                    this.centerCamera();
                }
                update(ticks) {
                    super.update(ticks);
                    const cameraRightBottom = this.position.clone()
                        .add(this.size)
                        .sub(new Vector2_28.Vector2(1, 1));
                    const leftRel = this.followObject.position.x - this.position.x;
                    if (leftRel < Camera_1.followOffset) {
                        this.position.x = (Math.max(0, this.followObject.position.x - Camera_1.followOffset));
                    }
                    const topRel = this.followObject.position.y - this.position.y;
                    if (topRel < Camera_1.followOffset) {
                        this.position.y = (Math.max(0, this.followObject.position.y - Camera_1.followOffset));
                    }
                    const rightRel = cameraRightBottom.x - this.followObject.position.x;
                    if (rightRel < Camera_1.followOffset) {
                        this.position.x = Math.min(this.boundingSize.width - this.size.width, this.followObject.position.x - (this.size.width - 1) + Camera_1.followOffset);
                    }
                    const bottomRel = cameraRightBottom.y - this.followObject.position.y;
                    if (bottomRel < Camera_1.followOffset) {
                        this.position.y = Math.min(this.boundingSize.height - this.size.height, this.followObject.position.y - (this.size.height - 1) + Camera_1.followOffset);
                    }
                    if (cameraRightBottom.x > this.boundingSize.width) {
                        this.position.x = (this.boundingSize.width - this.size.width);
                    }
                    if (cameraRightBottom.y > this.boundingSize.height) {
                        this.position.y = (this.boundingSize.height - this.size.height);
                    }
                    this.centerCamera();
                }
                centerCamera() {
                    if (this.boundingSize.x < this.size.x) {
                        this.position.x = Math.round((this.boundingSize.x - this.size.x) / 2);
                    }
                    if (this.boundingSize.y < this.size.y) {
                        this.position.y = Math.round((this.boundingSize.y - this.size.y) / 2);
                    }
                }
            };
            exports_93("FollowCamera", FollowCamera);
        }
    };
});
System.register("engine/graphics/CellInfo", [], function (exports_94, context_94) {
    "use strict";
    var __moduleName = context_94 && context_94.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/graphics/cellStyle", ["engine/math/Vector2"], function (exports_95, context_95) {
    "use strict";
    var Vector2_29, cellStyle;
    var __moduleName = context_95 && context_95.id;
    return {
        setters: [
            function (Vector2_29_1) {
                Vector2_29 = Vector2_29_1;
            }
        ],
        execute: function () {
            exports_95("cellStyle", cellStyle = {
                borderColor: "#1114",
                borderWidth: 1,
                default: {
                    textColor: '#fff',
                    backgroundColor: '#335'
                },
                size: new Vector2_29.Vector2(24, 24),
                charSize: 20,
            });
        }
    };
});
System.register("engine/graphics/CanvasContext", ["engine/math/Color", "engine/math/Colors", "engine/math/Grid3", "engine/math/Rotation", "engine/math/Vector2", "engine/math/Vector3", "engine/graphics/Cell", "engine/graphics/cellStyle"], function (exports_96, context_96) {
    "use strict";
    var Color_11, Colors_10, Grid3_3, Rotation_3, Vector2_30, Vector3_7, Cell_6, cellStyle_1, CanvasContext;
    var __moduleName = context_96 && context_96.id;
    return {
        setters: [
            function (Color_11_1) {
                Color_11 = Color_11_1;
            },
            function (Colors_10_1) {
                Colors_10 = Colors_10_1;
            },
            function (Grid3_3_1) {
                Grid3_3 = Grid3_3_1;
            },
            function (Rotation_3_1) {
                Rotation_3 = Rotation_3_1;
            },
            function (Vector2_30_1) {
                Vector2_30 = Vector2_30_1;
            },
            function (Vector3_7_1) {
                Vector3_7 = Vector3_7_1;
            },
            function (Cell_6_1) {
                Cell_6 = Cell_6_1;
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
                    this.objectsBuffer = document.createElement("canvas");
                    this.weatherBuffer = document.createElement("canvas");
                    this.shadowMaskBuffer = document.createElement("canvas");
                    this.lightColorBuffer = document.createElement("canvas");
                    this.uiBuffer = document.createElement("canvas");
                }
                beginDraw(background, gridSize) {
                    this.background = background;
                    this.size = new Vector2_30.Vector2(gridSize.x, gridSize.y);
                    this.size3 = gridSize;
                    this.setCanvasSize(this.size.clone().multiply(cellStyle_1.cellStyle.size));
                    this.objects = new Grid3_3.Grid3(gridSize).fill(() => []);
                    this.particles = new Grid3_3.Grid3(gridSize).fill(() => []);
                    this.ui = new Grid3_3.Grid3(new Vector3_7.Vector3(gridSize.x, gridSize.y, 1)).fill(() => []);
                }
                setCanvasSize(canvasSize) {
                    const buffers = [
                        this.buffer,
                        this.objectsBuffer,
                        this.weatherBuffer,
                        this.shadowMaskBuffer,
                        this.lightColorBuffer,
                        this.uiBuffer,
                    ];
                    for (const buffer of buffers) {
                        buffer.width = canvasSize.width;
                        buffer.height = canvasSize.height;
                    }
                }
                add(layerName, position, cellInfo) {
                    var _a;
                    const layer = this.getLayer(layerName);
                    (_a = layer.at(position)) === null || _a === void 0 ? void 0 : _a.push(...cellInfo);
                }
                getLayer(layerName) {
                    if (layerName === "objects") {
                        return this.objects;
                    }
                    else if (layerName === "particles") {
                        return this.particles;
                    }
                    else if (layerName === "ui") {
                        return this.ui;
                    }
                    throw new Error(`Layer "${layerName}" not found.`);
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
                    const cellSize3 = new Vector3_7.Vector3(cellStyle_1.cellStyle.size.width, cellStyle_1.cellStyle.size.height, 1);
                    this.lights.traverse((v, pos) => {
                        if (pos.z !== 0) {
                            return; // TEST: only ground lights.
                        }
                        const pixelPos = pos.clone().multiply(cellSize3);
                        // Draw light colors.
                        this._lightColorContext.fillStyle = v === null || v === void 0 ? void 0 : v.color.getStyle();
                        this._lightColorContext.fillRect(pixelPos.x, pixelPos.y, cellStyle_1.cellStyle.size.width, cellStyle_1.cellStyle.size.height);
                        // Draw shadows mask.
                        const intensity = ((v === null || v === void 0 ? void 0 : v.intensity) || 0) / 15;
                        this._shadowMaskContext.fillStyle = new Color_11.Color(intensity, intensity, intensity).getStyle();
                        this._shadowMaskContext.fillRect(pixelPos.x, pixelPos.y, cellStyle_1.cellStyle.size.width, cellStyle_1.cellStyle.size.height);
                    });
                    this.ui.traverse((uiCells, pos) => {
                        if (pos.z !== 0) {
                            throw new Error("UI cells must be on layer 0.");
                        }
                        for (const c of uiCells) {
                            this.drawCellInfoOn(this._uiContext, pos, c, false);
                        }
                    });
                    const ctx = this._context;
                    // TODO: add physical material reflectiveness. Try with black reflective tiles. 
                    if (this.background) {
                        ctx.fillStyle = this.background.getStyle();
                        ctx.fillRect(0, 0, this.size.width * cellStyle_1.cellStyle.size.width, this.size.height * cellStyle_1.cellStyle.size.height);
                    }
                    ctx.globalCompositeOperation = "source-over"; // multiply | overlay | luminosity
                    ctx.drawImage(this.objectsBuffer, 0, 0);
                    ctx.drawImage(this.weatherBuffer, 0, 0);
                    // TODO: remove this.
                    if (false) {
                        ctx.globalCompositeOperation = "multiply";
                        ctx.drawImage(this.shadowMaskBuffer, 0, 0);
                        ctx.globalCompositeOperation = "multiply";
                        ctx.drawImage(this.lightColorBuffer, 0, 0);
                    }
                    ctx.globalCompositeOperation = "source-over";
                    ctx.drawImage(this.uiBuffer, 0, 0);
                    (_a = this.canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(this.buffer, 0, 0);
                }
                applyLight(color, light) {
                    if (!light) {
                        return color.getStyle();
                    }
                    const lightLevel = (light === null || light === void 0 ? void 0 : light.intensity) || 0;
                    const lightColor = (light === null || light === void 0 ? void 0 : light.color) || Colors_10.Colors.White;
                    const REFLECTIVENESS = 0.0;
                    const newColor = new Color_11.Color(color.r, color.g, color.b, color.a);
                    newColor.setLightness(newColor.getLightness() * lightLevel / 15);
                    // Direct colored light
                    const dr = newColor.r * lightColor.r;
                    const dg = newColor.g * lightColor.g;
                    const db = newColor.b * lightColor.b;
                    // Reflectiveness modulated by lightColor
                    const reflectFactor = (lightLevel / 15) * REFLECTIVENESS;
                    const rr = reflectFactor * lightColor.r;
                    const rg = reflectFactor * lightColor.g;
                    const rb = reflectFactor * lightColor.b;
                    newColor.r = Math.min(1, dr + rr);
                    newColor.g = Math.min(1, dg + rg);
                    newColor.b = Math.min(1, db + rb);
                    return newColor.getStyle();
                }
                drawCellInfoOn(ctx, cellPos3, cellInfo, useLight = true) {
                    const cellPos = new Vector2_30.Vector2(cellPos3.x, cellPos3.y);
                    const cellDrawPosition = new Vector2_30.Vector2()
                        .add(cellPos.clone().multiply(cellStyle_1.cellStyle.size))
                        .add(cellStyle_1.cellStyle.size.clone().multiply(cellInfo.cell.options.miniCellPosition || Cell_6.defaultCellDrawOptions.miniCellPosition));
                    const cellScale = cellInfo.cell.options.scale || Cell_6.defaultCellDrawOptions.scale;
                    const cellDrawSize = cellStyle_1.cellStyle.size.clone().multiplyScalar(cellScale);
                    const fontSize = Math.max(3, (cellStyle_1.cellStyle.charSize * cellScale) | 0);
                    const light = useLight ? this.lights.at(cellPos3) : undefined;
                    //
                    ctx.globalAlpha = cellInfo.extraOpacity;
                    ctx.fillStyle = this.applyLight(cellInfo.cell.backgroundColor, light);
                    ctx.fillRect(cellDrawPosition.x, cellDrawPosition.y, cellDrawSize.width, cellDrawSize.height);
                    if (cellInfo.cell.character.char) {
                        ctx.font = (cellInfo.cell.options.bold ? "bold " : "") + `${fontSize}px monospace`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = this.applyLight(cellInfo.cell.textColor, light);
                        ctx.fillText(cellInfo.cell.character.char, cellDrawPosition.x + cellDrawSize.width / 2, cellDrawPosition.y + cellDrawSize.height / 2 + 2);
                    }
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
                            ctx.strokeStyle = topBorder.getStyle();
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, cellDrawSize.width - 2, 0);
                        }
                        if (rightBorder) {
                            ctx.strokeStyle = rightBorder.getStyle();
                            ctx.strokeRect(cellDrawPosition.x + cellDrawSize.width - 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
                        }
                        if (bottomBorder) {
                            ctx.strokeStyle = bottomBorder.getStyle();
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + cellDrawSize.height - 1, cellDrawSize.width - 2, 0);
                        }
                        if (leftBorder) {
                            ctx.strokeStyle = leftBorder.getStyle();
                            ctx.strokeRect(cellDrawPosition.x + 1, cellDrawPosition.y + 1, 0, cellDrawSize.height - 2);
                        }
                    }
                }
            };
            exports_96("CanvasContext", CanvasContext);
        }
    };
});
System.register("engine/renderers/CanvasRenderer", ["utils/math", "engine/cameras/FollowCamera", "engine/math/Box2", "engine/math/Vector2", "engine/math/Rotation", "engine/graphics/Cell", "engine/math/Vector3", "engine/math/Color", "engine/data/CellSprite"], function (exports_97, context_97) {
    "use strict";
    var math_7, FollowCamera_1, Box2_3, Vector2_31, Rotation_4, Cell_7, Vector3_8, Color_12, CellSprite_7, _p1, _p2, CanvasRenderer;
    var __moduleName = context_97 && context_97.id;
    function renderSort(a, b) {
        if (a.renderOrder !== b.renderOrder) {
            return a.renderOrder - b.renderOrder;
        }
        else /*if (a.position.y !== b.position.y)*/ {
            return a.getWorldPosition(_p1).y - b.getWorldPosition(_p2).y;
        }
    }
    return {
        setters: [
            function (math_7_1) {
                math_7 = math_7_1;
            },
            function (FollowCamera_1_1) {
                FollowCamera_1 = FollowCamera_1_1;
            },
            function (Box2_3_1) {
                Box2_3 = Box2_3_1;
            },
            function (Vector2_31_1) {
                Vector2_31 = Vector2_31_1;
            },
            function (Rotation_4_1) {
                Rotation_4 = Rotation_4_1;
            },
            function (Cell_7_1) {
                Cell_7 = Cell_7_1;
            },
            function (Vector3_8_1) {
                Vector3_8 = Vector3_8_1;
            },
            function (Color_12_1) {
                Color_12 = Color_12_1;
            },
            function (CellSprite_7_1) {
                CellSprite_7 = CellSprite_7_1;
            }
        ],
        execute: function () {
            _p1 = new Vector2_31.Vector2();
            _p2 = new Vector2_31.Vector2();
            CanvasRenderer = class CanvasRenderer {
                constructor(canvas, ctx) {
                    this.canvas = canvas;
                    this.ctx = ctx;
                }
                render(scene, camera) {
                    scene.updateMatrixWorld();
                    if (!camera.parent) {
                        camera.updateMatrixWorld();
                    }
                    const renderList = this.getSceneRenderList(scene);
                    renderList.sort(renderSort);
                    const unobstructedObjects = [];
                    scene.traverseVisible(x => {
                        if ("isUnobstructed" in x) {
                            unobstructedObjects.push(x);
                        }
                    });
                    this.renderObjects(renderList, scene, camera, unobstructedObjects);
                }
                getSceneRenderList(scene) {
                    const allObjects = [];
                    scene.traverseVisible(x => allObjects.push(x));
                    return allObjects;
                }
                renderObjects(objects, scene, camera, unobstructedObjects) {
                    for (const object of objects) {
                        this.renderObject(object, scene, camera, unobstructedObjects);
                        // TODO: move to updates.
                        // reset object highlight.
                        object.highlighted = false;
                    }
                }
                renderObject(object, scene, camera, unobstructedObjects) {
                    object.onBeforeRender(this, scene, camera);
                    const objectPosition = object.getWorldPosition(_p1);
                    const objectRadius = Math.max(...object.skin.size);
                    const objects = unobstructedObjects
                        .filter(x => x !== object &&
                        x !== object.parent &&
                        x.renderOrder <= object.renderOrder &&
                        x.getWorldPosition(_p2).distanceTo(objectPosition) <= objectRadius);
                    const isInFrontOfAnyObject = this.isInFrontOfAnyObject(object, objects);
                    const { width, height } = object.skin.size;
                    const cameraBox = new Box2_3.Box2(new Vector2_31.Vector2(), camera.size.clone().sub(new Vector2_31.Vector2(1, 1)));
                    const skinPos = new Vector2_31.Vector2();
                    for (skinPos.y = 0; skinPos.y < height; skinPos.y++) {
                        for (skinPos.x = 0; skinPos.x < width; skinPos.x++) {
                            const { position, position3 } = getResultPositions();
                            if (!cameraBox.containsPoint(position)) {
                                continue;
                            }
                            const cells = object.skin.getCellsAt(skinPos).filter(x => !x.isEmpty);
                            const extraOpacity = getExtraPositionalOpacity(skinPos);
                            const extraBorder = this.getExtraCellBorders(object, skinPos);
                            const damageOverlayAlpha = this.getDamageOverlayAlpha(object);
                            const cellInfos = [];
                            for (const cell of cells) {
                                cellInfos.push({ cell, extraOpacity, extraBorder });
                                if (damageOverlayAlpha > 0) {
                                    cellInfos.push(this.createDamageOverlayCellInfo(damageOverlayAlpha));
                                }
                            }
                            this.ctx.add(object.layer, position3, cellInfos);
                        }
                    }
                    function getResultPositions() {
                        if (object.layer === "ui") {
                            const levelPos = object.getWorldPosition(_p1)
                                .sub(object.originPoint)
                                .add(skinPos);
                            const resultPos = levelPos.sub(camera.getWorldPosition(_p2)).clone();
                            return { position: resultPos, position3: new Vector3_8.Vector3(resultPos.x, resultPos.y, 0) };
                        }
                        // Use projected depth.
                        const levelPos = object.getWorldPosition(_p1)
                            .sub(object.originPoint);
                        const p1 = levelPos.sub(camera.getWorldPosition(_p2)).clone();
                        const depth = object.originPoint.y - skinPos.y;
                        const skinPos3 = new Vector3_8.Vector3(skinPos.x, skinPos.y, 0);
                        const resultPos3 = new Vector3_8.Vector3(p1.x, p1.y, depth).add(skinPos3);
                        const resultY = resultPos3.y + depth;
                        const resultPos = new Vector2_31.Vector2(resultPos3.x, resultY);
                        return { position: resultPos, position3: resultPos3 };
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
                        if (!camera.followObject) {
                            return 1;
                        }
                        const distance = camera.followObject.getWorldPosition(_p1).distanceTo(object.getWorldPosition(_p2));
                        const fullVisibilityRange = 1.2;
                        if (distance < fullVisibilityRange) {
                            return 0.2;
                        }
                        const distanceKoef = 0.2;
                        const transparency = math_7.clamp(Math.sqrt(distance * distanceKoef), 0, 1);
                        return transparency;
                    }
                }
                getExtraCellBorders(obj, position) {
                    if (!obj.highlighted) {
                        return {};
                    }
                    const entries = Rotation_4.Rotations.all
                        .map(x => {
                        const dir = _p1.copy(Vector2_31.Vector2.right).rotate(x);
                        const pos = _p2.copy(position).add(dir);
                        const borderColor = obj.skin.isEmptyCellAt(pos) ? obj.highlighColor : undefined;
                        return [x, borderColor];
                    })
                        .filter(x => x[1]);
                    return Object.fromEntries(entries);
                }
                isPositionBehindTheObject(object, position) {
                    const objectLeftTop = object.getWorldPosition(_p2).sub(object.originPoint);
                    const localSkinPos = _p1.copy(position).sub(objectLeftTop);
                    return !object.skin.isEmptyCellAt(localSkinPos);
                }
                isInFrontOfAnyObject(object, objects) {
                    for (const o of objects) {
                        if (this.isPositionBehindTheObject(object, o.getWorldPosition(_p1))) {
                            return true;
                        }
                    }
                    return false;
                }
                getDamageOverlayAlpha(object) {
                    const candidate = object;
                    const alpha = typeof candidate.getDamageOverlayAlpha === "function"
                        ? candidate.getDamageOverlayAlpha()
                        : 0;
                    return math_7.clamp(alpha, 0, 1);
                }
                createDamageOverlayCellInfo(alpha) {
                    const cell = new Cell_7.Cell(CellSprite_7.CellSprite.empty, undefined, Color_12.Color.fromRGBA(1, 0, 0, 0.6));
                    return {
                        cell,
                        extraOpacity: alpha,
                        extraBorder: {},
                    };
                }
            };
            exports_97("CanvasRenderer", CanvasRenderer);
        }
    };
});
System.register("engine/objects/Object2D", ["engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/objects/Inventory", "engine/math/Vector2", "engine/math/Color"], function (exports_98, context_98) {
    "use strict";
    var ObjectSkin_9, ObjectPhysics_5, Inventory_1, Vector2_32, Color_13, _position, Object2D;
    var __moduleName = context_98 && context_98.id;
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
            function (Vector2_32_1) {
                Vector2_32 = Vector2_32_1;
            },
            function (Color_13_1) {
                Color_13 = Color_13_1;
            }
        ],
        execute: function () {
            // Buffers.
            _position = new Vector2_32.Vector2();
            Object2D = class Object2D {
                static isObject2D(x) { return x.isObject2D === true; }
                get scene() {
                    let level = undefined;
                    this.traverseAncestors(x => {
                        if (x && "isLevel" in x) {
                            level = x;
                        }
                    });
                    return level;
                }
                get globalRotation() {
                    this.updateWorldMatrix(true, false);
                    return this._worldRotation;
                }
                constructor(originPoint = new Vector2_32.Vector2(), skin = new ObjectSkin_9.ObjectSkin(), physics = new ObjectPhysics_5.ObjectPhysics(), position = new Vector2_32.Vector2()) {
                    this.originPoint = originPoint;
                    this.skin = skin;
                    this.physics = physics;
                    this.position = position;
                    this.isObject2D = true;
                    this.parent = null;
                    this.children = [];
                    this.name = "";
                    this.type = "<object>";
                    this.enabled = true;
                    this.visible = true;
                    this.layer = "objects";
                    this.renderOrder = 0;
                    this._rotation = 0;
                    this._worldRotation = 0;
                    this._worldPosition = Vector2_32.Vector2.zero;
                    this.highlighted = false;
                    this.highlighColor = Color_13.Color.fromHexString('#0ff');
                    this.parameters = {};
                    this.actions = [];
                    this.inventory = new Inventory_1.Inventory();
                    this.realm = "ground";
                    this.hostEffects = []; // Effects that object can apply to other objects.
                    this.isMovableByWind = true;
                    this.ticks = 0;
                }
                getWorldPosition(target) {
                    this.updateWorldMatrix(true, false);
                    return target.copy(this._worldPosition);
                }
                getWorldDirection(target) {
                    return target.copy(Vector2_32.Vector2.right).rotate(this.globalRotation);
                }
                updateMatrixWorld() {
                    this.updateThisWorld();
                    for (const child of this.children) {
                        child.updateMatrixWorld();
                    }
                }
                updateWorldMatrix(updateParents, updateChildren) {
                    if (updateParents && this.parent) {
                        this.parent.updateWorldMatrix(true, false);
                    }
                    this.updateThisWorld();
                    if (updateChildren) {
                        for (const child of this.children) {
                            child.updateWorldMatrix(false, true);
                        }
                    }
                }
                updateThisWorld() {
                    if (!this.parent) {
                        this._worldPosition.copy(this.position);
                        this._worldRotation = this._rotation;
                    }
                    else {
                        this._worldPosition.copy(this.parent._worldPosition).add(_position.copy(this.position).rotate(this.parent._worldRotation));
                        this._worldRotation = this.parent._worldRotation + this._rotation;
                    }
                }
                translateX(x) {
                    this.position.x += x;
                    return this;
                }
                translateY(y) {
                    this.position.y += y;
                    return this;
                }
                rotate(rotation = 1) {
                    this._rotation = this._rotation + rotation;
                    return this;
                }
                lookAt(position) {
                    const degrees = position.angle;
                    this._rotation = (degrees / 360) * 4 | 0;
                    this.updateMatrixWorld();
                }
                add(object) {
                    if (object === this) {
                        throw new Error("Can not add an object to itself.");
                    }
                    if (object.parent !== null) {
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
                        const position = options.position || Vector2_32.Vector2.zero;
                        const iconPosition = options.iconPosition || position;
                        this.actions.push({
                            type,
                            position,
                            callback: options.action,
                            iconPosition,
                        });
                    }
                }
                handleEvent(ev) {
                }
                onBeforeRender(renderer, scene, camera) {
                }
                update(ticks) {
                    this.ticks += ticks;
                    this.updateChildren(ticks);
                }
                updateChildren(ticks) {
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
                        children[i].traverse(callback);
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
            exports_98("Object2D", Object2D);
        }
    };
});
System.register("engine/Scene", ["engine/objects/Object2D"], function (exports_99, context_99) {
    "use strict";
    var Object2D_15, Scene;
    var __moduleName = context_99 && context_99.id;
    return {
        setters: [
            function (Object2D_15_1) {
                Object2D_15 = Object2D_15_1;
            }
        ],
        execute: function () {
            Scene = class Scene extends Object2D_15.Object2D {
                constructor() {
                    super();
                    this.isScene = true;
                    this.background = undefined;
                }
            };
            exports_99("Scene", Scene);
        }
    };
});
System.register("world/behaviors/WanderingBehavior", [], function (exports_100, context_100) {
    "use strict";
    var WanderingBehavior;
    var __moduleName = context_100 && context_100.id;
    return {
        setters: [],
        execute: function () {
            WanderingBehavior = class WanderingBehavior {
                constructor(options = {}) {
                    this.options = options;
                }
                update(ticks, object) {
                }
                act(ticks, object) {
                    object.faceRandomDirection();
                    object.moveRandomly();
                }
                handleEvent(ev, object) {
                }
            };
            exports_100("WanderingBehavior", WanderingBehavior);
        }
    };
});
System.register("world/events/MountGameEvent", ["engine/events/GameEvent"], function (exports_101, context_101) {
    "use strict";
    var GameEvent_5, MountGameEvent;
    var __moduleName = context_101 && context_101.id;
    return {
        setters: [
            function (GameEvent_5_1) {
                GameEvent_5 = GameEvent_5_1;
            }
        ],
        execute: function () {
            (function (MountGameEvent) {
                MountGameEvent.type = "mount";
                class Args {
                }
                MountGameEvent.Args = Args;
                function create(mounter, mount, newState) {
                    return new GameEvent_5.GameEvent(mounter, MountGameEvent.type, {
                        mounter,
                        mount,
                        newState,
                    });
                }
                MountGameEvent.create = create;
            })(MountGameEvent || (exports_101("MountGameEvent", MountGameEvent = {})));
        }
    };
});
System.register("world/events/RemoveObjectGameEvent", ["engine/events/GameEvent"], function (exports_102, context_102) {
    "use strict";
    var GameEvent_6, RemoveObjectGameEvent;
    var __moduleName = context_102 && context_102.id;
    return {
        setters: [
            function (GameEvent_6_1) {
                GameEvent_6 = GameEvent_6_1;
            }
        ],
        execute: function () {
            (function (RemoveObjectGameEvent) {
                RemoveObjectGameEvent.type = "remove_object";
                class Args {
                }
                RemoveObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_6.GameEvent("system", RemoveObjectGameEvent.type, { object });
                }
                RemoveObjectGameEvent.create = create;
            })(RemoveObjectGameEvent || (exports_102("RemoveObjectGameEvent", RemoveObjectGameEvent = {})));
        }
    };
});
System.register("world/events/AddObjectGameEvent", ["engine/events/GameEvent"], function (exports_103, context_103) {
    "use strict";
    var GameEvent_7, AddObjectGameEvent;
    var __moduleName = context_103 && context_103.id;
    return {
        setters: [
            function (GameEvent_7_1) {
                GameEvent_7 = GameEvent_7_1;
            }
        ],
        execute: function () {
            (function (AddObjectGameEvent) {
                AddObjectGameEvent.type = "add_object";
                class Args {
                }
                AddObjectGameEvent.Args = Args;
                function create(object) {
                    return new GameEvent_7.GameEvent("system", AddObjectGameEvent.type, { object });
                }
                AddObjectGameEvent.create = create;
            })(AddObjectGameEvent || (exports_103("AddObjectGameEvent", AddObjectGameEvent = {})));
        }
    };
});
System.register("world/behaviors/MountBehavior", ["world/behaviors/WanderingBehavior", "engine/events/EventLoop", "world/events/MountGameEvent", "world/events/RemoveObjectGameEvent", "world/events/AddObjectGameEvent", "engine/math/Vector2", "engine/math/Vector3"], function (exports_104, context_104) {
    "use strict";
    var WanderingBehavior_1, EventLoop_4, MountGameEvent_1, RemoveObjectGameEvent_1, AddObjectGameEvent_1, Vector2_33, Vector3_9, _position, _direction, MountBehavior;
    var __moduleName = context_104 && context_104.id;
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
            function (Vector2_33_1) {
                Vector2_33 = Vector2_33_1;
            },
            function (Vector3_9_1) {
                Vector3_9 = Vector3_9_1;
            }
        ],
        execute: function () {
            _position = new Vector2_33.Vector2();
            _direction = new Vector2_33.Vector2();
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
                act(ticks, object) {
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
                    mounter.mount.position.copy(Vector2_33.Vector2.zero);
                    // Move mounter on top of the mount.
                    mounter.position.add(mounter.getWorldDirection(_direction));
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
                    const cursorPosition = mounter.getWorldCursorPosition(_position);
                    if (mounter.scene.isPositionBlocked(new Vector3_9.Vector3(cursorPosition.x, cursorPosition.y, 0))) {
                        console.log(`Can not unmount ${mounter.type}. Position blocked.`);
                        return;
                    }
                    this.mounterObject = null;
                    this.state = "wild";
                    // Unlink mount and mounter.
                    mounter.mount = null;
                    mount.removeFromParent();
                    // Move mount to the mounter position.
                    mount.position.copy(mounter.position);
                    // Add mount back to the scene.
                    EventLoop_4.emitEvent(AddObjectGameEvent_1.AddObjectGameEvent.create(mount));
                    // Move mounter forward.
                    mounter.position.add(mounter.getWorldDirection(_direction));
                    EventLoop_4.emitEvent(MountGameEvent_1.MountGameEvent.create(mounter, this.mountObject, "unmounted"));
                }
            };
            exports_104("MountBehavior", MountBehavior);
        }
    };
});
System.register("world/sprites/fireBallSprite", ["engine/data/Sprite"], function (exports_105, context_105) {
    "use strict";
    var Sprite_14, fireBallSpriteRaw, fireBallSprite;
    var __moduleName = context_105 && context_105.id;
    return {
        setters: [
            function (Sprite_14_1) {
                Sprite_14 = Sprite_14_1;
            }
        ],
        execute: function () {
            exports_105("fireBallSpriteRaw", fireBallSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#fa09,#0000
color:G,#6669,#0000

particle
_·✨🔥☁
RRRRG`);
            exports_105("fireBallSprite", fireBallSprite = Sprite_14.Sprite.parse(fireBallSpriteRaw));
        }
    };
});
System.register("world/objects/particles/FireBall", ["engine/effects/DamageEffect", "engine/objects/Particle", "world/sprites/fireBallSprite"], function (exports_106, context_106) {
    "use strict";
    var DamageEffect_3, Particle_6, fireBallSprite_1, FireBall;
    var __moduleName = context_106 && context_106.id;
    return {
        setters: [
            function (DamageEffect_3_1) {
                DamageEffect_3 = DamageEffect_3_1;
            },
            function (Particle_6_1) {
                Particle_6 = Particle_6_1;
            },
            function (fireBallSprite_1_1) {
                fireBallSprite_1 = fireBallSprite_1_1;
            }
        ],
        execute: function () {
            FireBall = class FireBall extends Particle_6.Particle {
                constructor(position, state = 0) {
                    super(fireBallSprite_1.fireBallSprite, position, state, { decaySpeed: 100 });
                    this.type = "fire_ball";
                    this.physics.light('f').temperature('f');
                    this.hostEffects.push(new DamageEffect_3.FireDamageEffect());
                }
            };
            exports_106("FireBall", FireBall);
        }
    };
});
System.register("world/objects/particles/DelayedParticle", ["engine/math/Vector2", "engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle"], function (exports_107, context_107) {
    "use strict";
    var Vector2_34, ObjectSkin_10, Sprite_15, Particle_7, DelayedParticle;
    var __moduleName = context_107 && context_107.id;
    return {
        setters: [
            function (Vector2_34_1) {
                Vector2_34 = Vector2_34_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (Sprite_15_1) {
                Sprite_15 = Sprite_15_1;
            },
            function (Particle_7_1) {
                Particle_7 = Particle_7_1;
            }
        ],
        execute: function () {
            DelayedParticle = class DelayedParticle extends Particle_7.Particle {
                constructor(delayTicks, particle) {
                    const sprite = new Sprite_15.Sprite();
                    const emptySkin = new ObjectSkin_10.ObjectSkin();
                    sprite.frames[Particle_7.Particle.defaultFrameName] = [emptySkin];
                    super(sprite, particle.position, 0, {
                        decaySpeed: undefined,
                    });
                    this.delayTicks = delayTicks;
                    this.particle = particle;
                    this.remainingTicks = delayTicks;
                    this.type = "delayed_particle";
                    this.visible = false;
                    this.isMovableByWind = false;
                }
                update(ticks) {
                    super.update(ticks);
                    this.remainingTicks -= ticks;
                    if (this.remainingTicks > 0) {
                        return;
                    }
                    this.addParticle();
                    this.removeFromParent();
                }
                addParticle() {
                    const scene = this.scene;
                    if (!(scene && scene.particlesObject)) {
                        return;
                    }
                    const particlePos = this.particle.getWorldPosition(new Vector2_34.Vector2());
                    // Check if particle already exists at this position
                    const existingParticle = scene.particlesObject.getParticleAt(particlePos);
                    if (existingParticle) {
                        scene.particlesObject.remove(existingParticle);
                    }
                    this.particle.position = this.position.clone();
                    scene.particlesObject.add(this.particle);
                }
            };
            exports_107("DelayedParticle", DelayedParticle);
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/behaviors/MountBehavior", "engine/objects/Npc", "engine/math/Vector2", "engine/effects/DamageEffect", "engine/effects/SlownessEffect", "engine/effects/CloakEffect", "engine/objects/EquipmentTags", "world/objects/particles/FireBall", "world/objects/particles/DelayedParticle", "engine/objects/WeaponTags", "engine/effects/LightEffect", "world/objects/particles/ThunderBolt", "engine/math/Colors"], function (exports_108, context_108) {
    "use strict";
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, Item_1, ObjectSkin_11, ObjectPhysics_6, MountBehavior_1, Npc_2, Vector2_35, DamageEffect_4, SlownessEffect_3, CloakEffect_2, EquipmentTags_2, FireBall_1, DelayedParticle_1, WeaponTags_2, LightEffect_2, ThunderBolt_2, Colors_11, LampItem, SwordItem, PoisonDaggerItem, HammerItem, BowItem, FireWandItem, ThunderStaffItem, victoryItem, bambooSeed, honeyPot, seaShell, GlassesItem, MudBootsItem, SaddleItem, RingItem, LightRingItem, CloakItem;
    var __moduleName = context_108 && context_108.id;
    function isRangedItem(x) {
        return (WeaponTags_2.WeaponTags.isRanged in x &&
            "range" in x);
    }
    exports_108("isRangedItem", isRangedItem);
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (MountBehavior_1_1) {
                MountBehavior_1 = MountBehavior_1_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            },
            function (Vector2_35_1) {
                Vector2_35 = Vector2_35_1;
            },
            function (DamageEffect_4_1) {
                DamageEffect_4 = DamageEffect_4_1;
            },
            function (SlownessEffect_3_1) {
                SlownessEffect_3 = SlownessEffect_3_1;
            },
            function (CloakEffect_2_1) {
                CloakEffect_2 = CloakEffect_2_1;
            },
            function (EquipmentTags_2_1) {
                EquipmentTags_2 = EquipmentTags_2_1;
            },
            function (FireBall_1_1) {
                FireBall_1 = FireBall_1_1;
            },
            function (DelayedParticle_1_1) {
                DelayedParticle_1 = DelayedParticle_1_1;
            },
            function (WeaponTags_2_1) {
                WeaponTags_2 = WeaponTags_2_1;
            },
            function (LightEffect_2_1) {
                LightEffect_2 = LightEffect_2_1;
            },
            function (ThunderBolt_2_1) {
                ThunderBolt_2 = ThunderBolt_2_1;
            },
            function (Colors_11_1) {
                Colors_11 = Colors_11_1;
            }
        ],
        execute: function () {
            LampItem = class LampItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🏮`), new ObjectPhysics_6.ObjectPhysics().light('f').temperature('a'));
                    this[_a] = true;
                    this.type = "lamp";
                }
            };
            exports_108("LampItem", LampItem);
            _a = EquipmentTags_2.EquipmentTags.isHandheld;
            SwordItem = class SwordItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🗡`));
                    this[_b] = true;
                    this[_c] = true;
                    this.type = "sword";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            ctx.initiator.attack(ctx.subject);
                        }
                    });
                }
            };
            exports_108("SwordItem", SwordItem);
            _b = EquipmentTags_2.EquipmentTags.isHandheld, _c = WeaponTags_2.WeaponTags.isSlash;
            PoisonDaggerItem = class PoisonDaggerItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🗡️`));
                    this[_d] = true;
                    this[_e] = true;
                    this.type = "poison_dagger";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            ctx.initiator.attack(ctx.subject);
                            if (ctx.subject instanceof Npc_2.Npc) {
                                ctx.subject.tryAddEffect(new DamageEffect_4.PoisonDamageEffect(), ctx.initiator);
                            }
                        }
                    });
                }
            };
            exports_108("PoisonDaggerItem", PoisonDaggerItem);
            _d = EquipmentTags_2.EquipmentTags.isHandheld, _e = WeaponTags_2.WeaponTags.isSlash;
            HammerItem = class HammerItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🔨`));
                    this[_f] = true;
                    this[_g] = true;
                    this.type = "hammer";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            ctx.initiator.attack(ctx.subject);
                        }
                    });
                }
            };
            exports_108("HammerItem", HammerItem);
            _f = EquipmentTags_2.EquipmentTags.isHandheld, _g = WeaponTags_2.WeaponTags.isBlunt;
            BowItem = class BowItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🏹`));
                    this[_h] = true;
                    this[_j] = true;
                    this[_k] = true;
                    this.range = 8;
                    this.isTarget = true;
                    this.type = "bow";
                    this.setUsage(ctx => {
                        if (ctx.subject) {
                            ctx.initiator.attack(ctx.subject);
                            // TODO: create arrow object (`➵`) on the scene
                        }
                    });
                }
            };
            exports_108("BowItem", BowItem);
            _h = EquipmentTags_2.EquipmentTags.isHandheld, _j = WeaponTags_2.WeaponTags.isRanged, _k = WeaponTags_2.WeaponTags.isPierce;
            FireWandItem = class FireWandItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🪄`));
                    this[_l] = true;
                    this[_m] = true;
                    this.range = 3;
                    this.type = "fire_wand";
                    this.setUsage(ctx => {
                        if (!ctx.initiator.scene) {
                            return;
                        }
                        const activatorPos = ctx.initiator.getWorldPosition(new Vector2_35.Vector2());
                        const scene = ctx.initiator.scene;
                        const particlesObject = scene.particlesObject;
                        for (let y = -this.range; y <= this.range; y++) {
                            for (let x = -this.range; x <= this.range; x++) {
                                const d = new Vector2_35.Vector2(x, y);
                                const distance = d.length;
                                if (distance > this.range || distance === 0) {
                                    continue;
                                }
                                const fireBallPos = activatorPos.clone().add(d);
                                fireBallPos.x = Math.round(fireBallPos.x);
                                fireBallPos.y = Math.round(fireBallPos.y);
                                const delayTicks = Math.round(distance * 150);
                                const fireBall = new FireBall_1.FireBall(fireBallPos, 0);
                                const delayedParticle = new DelayedParticle_1.DelayedParticle(delayTicks, fireBall);
                                particlesObject.add(delayedParticle);
                            }
                        }
                    });
                }
            };
            exports_108("FireWandItem", FireWandItem);
            _l = EquipmentTags_2.EquipmentTags.isHandheld, _m = WeaponTags_2.WeaponTags.isRanged;
            ThunderStaffItem = class ThunderStaffItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🦯`));
                    this[_o] = true;
                    this[_p] = true;
                    this.range = 1;
                    this.type = "thunder_staff";
                    this.setUsage(ctx => {
                        if (!ctx.initiator.scene) {
                            return;
                        }
                        const activatorPos = ctx.initiator.getWorldPosition(new Vector2_35.Vector2());
                        const scene = ctx.initiator.scene;
                        const particlesObject = scene.particlesObject;
                        for (let y = -this.range; y <= this.range; y++) {
                            for (let x = -this.range; x <= this.range; x++) {
                                const d = new Vector2_35.Vector2(x, y);
                                const distance = d.length;
                                if (distance > this.range || distance === 0) {
                                    continue;
                                }
                                const thunderBoltPos = activatorPos.clone().add(d);
                                thunderBoltPos.x = Math.round(thunderBoltPos.x);
                                thunderBoltPos.y = Math.round(thunderBoltPos.y);
                                const delayTicks = Math.round(distance * 150);
                                const thunderBolt = new ThunderBolt_2.ThunderBolt(thunderBoltPos, 0);
                                const delayedParticle = new DelayedParticle_1.DelayedParticle(delayTicks, thunderBolt);
                                particlesObject.add(delayedParticle);
                            }
                        }
                    });
                }
            };
            exports_108("ThunderStaffItem", ThunderStaffItem);
            _o = EquipmentTags_2.EquipmentTags.isHandheld, _p = WeaponTags_2.WeaponTags.isRanged;
            exports_108("victoryItem", victoryItem = () => Item_1.Item.create("victory_item", new ObjectSkin_11.ObjectSkin().char(`W`)));
            exports_108("bambooSeed", bambooSeed = () => Item_1.Item.create("bamboo_seed", new ObjectSkin_11.ObjectSkin().char(`▄`).color(Colors_11.Colors.Lime)));
            exports_108("honeyPot", honeyPot = () => Item_1.Item.create("honey_pot", new ObjectSkin_11.ObjectSkin().char(`🍯`)));
            // TODO: reveals invisible underwater chests.
            exports_108("seaShell", seaShell = () => Item_1.Item.create("sea_shell", new ObjectSkin_11.ObjectSkin().char(`🐚`)));
            GlassesItem = class GlassesItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`👓`));
                    this[_q] = true;
                    this.type = "glasses";
                }
            };
            exports_108("GlassesItem", GlassesItem);
            _q = EquipmentTags_2.EquipmentTags.isWearable;
            ;
            MudBootsItem = class MudBootsItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🥾`));
                    this[_r] = true;
                    this.type = "mud_boots";
                    this.visible = false;
                    this.effects.push(new SlownessEffect_3.SlownessReductionEffect("mud", 1));
                }
            };
            exports_108("MudBootsItem", MudBootsItem);
            _r = EquipmentTags_2.EquipmentTags.isWearable;
            ;
            SaddleItem = class SaddleItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char(`🐾`));
                    this[_s] = true;
                    this.type = "saddle";
                    this.setUsage(ctx => {
                        if (ctx.initiator.mount) {
                            const mountBeh = ctx.initiator.mount.behaviors
                                .find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.unmount();
                            }
                        }
                        else if (ctx.subject instanceof Npc_2.Npc) {
                            const mountBeh = ctx.subject.behaviors
                                .find(x => x instanceof MountBehavior_1.MountBehavior);
                            if (mountBeh) {
                                mountBeh.mount(ctx.initiator);
                            }
                        }
                    });
                }
            };
            exports_108("SaddleItem", SaddleItem);
            _s = EquipmentTags_2.EquipmentTags.isHandheld;
            RingItem = class RingItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char('💍'));
                    this[_t] = true;
                    this.type = "ring";
                    this.visible = false;
                    this.effects.push(new DamageEffect_4.DamageReductionEffect("poison", 0.5));
                    this.effects.push(new DamageEffect_4.DamageReductionEffect("fire", 1));
                }
            };
            exports_108("RingItem", RingItem);
            _t = EquipmentTags_2.EquipmentTags.isRing;
            LightRingItem = class LightRingItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char('💍'));
                    this[_u] = true;
                    this.type = "light_ring";
                    this.visible = false;
                    this.effects.push(new LightEffect_2.LightEffect("light", 15, Colors_11.Colors.Blue));
                }
            };
            exports_108("LightRingItem", LightRingItem);
            _u = EquipmentTags_2.EquipmentTags.isRing;
            CloakItem = class CloakItem extends Item_1.Item {
                constructor() {
                    super(Vector2_35.Vector2.zero, new ObjectSkin_11.ObjectSkin().char('🧥'));
                    this[_v] = true;
                    this.type = "cloak";
                    this.visible = false;
                    this.effects.push(new CloakEffect_2.LightCloakEffect(8));
                }
            };
            exports_108("CloakItem", CloakItem);
            _v = EquipmentTags_2.EquipmentTags.isWearable;
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items", "engine/objects/NpcMovementOptions", "engine/objects/Object2D", "engine/math/Vector2", "engine/math/Colors"], function (exports_109, context_109) {
    "use strict";
    var Npc_3, ObjectSkin_12, items_1, NpcMovementOptions_2, Object2D_16, Vector2_36, Colors_12, hero;
    var __moduleName = context_109 && context_109.id;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            },
            function (NpcMovementOptions_2_1) {
                NpcMovementOptions_2 = NpcMovementOptions_2_1;
            },
            function (Object2D_16_1) {
                Object2D_16 = Object2D_16_1;
            },
            function (Vector2_36_1) {
                Vector2_36 = Vector2_36_1;
            },
            function (Colors_12_1) {
                Colors_12 = Colors_12_1;
            }
        ],
        execute: function () {
            exports_109("hero", hero = new class extends Npc_3.Npc {
                constructor() {
                    super(new ObjectSkin_12.ObjectSkin().char('🐱'));
                    this.name = "hero";
                    this.type = "human";
                    const health = 99;
                    this.health = health;
                    this.maxHealth = health;
                    //this.stunValue = 10; // TEST: stunned hero.
                    this.movementOptions = {
                        ...NpcMovementOptions_2.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    this.inventory.items.push(...[
                        new items_1.SwordItem(),
                        new items_1.PoisonDaggerItem(),
                        new items_1.HammerItem(),
                        new items_1.BowItem(),
                        new items_1.FireWandItem(),
                        new items_1.ThunderStaffItem(),
                        new items_1.LampItem(),
                        new items_1.MudBootsItem(),
                        new items_1.SaddleItem(),
                        new items_1.GlassesItem(),
                        new items_1.RingItem(),
                        new items_1.LightRingItem(),
                        new items_1.CloakItem(),
                    ]);
                    this.equipment.equip(this.inventory.items[0]);
                    const cursorSkin = new ObjectSkin_12.ObjectSkin()
                        .background(Colors_12.Colors.Transparent)
                        .option({ border: [Colors_12.Colors.Yellow, Colors_12.Colors.Yellow, Colors_12.Colors.Yellow, Colors_12.Colors.Yellow] });
                    this.add(new Object2D_16.Object2D(Vector2_36.Vector2.zero, cursorSkin).translateX(1));
                }
            });
        }
    };
});
System.register("ui/UIElement", ["engine/objects/Object2D"], function (exports_110, context_110) {
    "use strict";
    var Object2D_17, UIElement;
    var __moduleName = context_110 && context_110.id;
    return {
        setters: [
            function (Object2D_17_1) {
                Object2D_17 = Object2D_17_1;
            }
        ],
        execute: function () {
            UIElement = class UIElement extends Object2D_17.Object2D {
                constructor(parent) {
                    super();
                    this.layer = "ui";
                    parent === null || parent === void 0 ? void 0 : parent.add(this);
                }
            };
            exports_110("UIElement", UIElement);
        }
    };
});
System.register("ui/UIPanel", ["engine/graphics/Cell", "ui/UIElement", "engine/components/ObjectSkin", "engine/math/Grid", "engine/math/Color", "engine/math/Colors", "engine/data/CellSprite"], function (exports_111, context_111) {
    "use strict";
    var Cell_8, UIElement_1, ObjectSkin_13, Grid_8, Color_14, Colors_13, CellSprite_8, UIPanel;
    var __moduleName = context_111 && context_111.id;
    return {
        setters: [
            function (Cell_8_1) {
                Cell_8 = Cell_8_1;
            },
            function (UIElement_1_1) {
                UIElement_1 = UIElement_1_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (Grid_8_1) {
                Grid_8 = Grid_8_1;
            },
            function (Color_14_1) {
                Color_14 = Color_14_1;
            },
            function (Colors_13_1) {
                Colors_13 = Colors_13_1;
            },
            function (CellSprite_8_1) {
                CellSprite_8 = CellSprite_8_1;
            }
        ],
        execute: function () {
            UIPanel = class UIPanel extends UIElement_1.UIElement {
                constructor(parent, position, size) {
                    super(parent);
                    this.borderColor = Color_14.Color.fromHexString('#555');
                    this.backgroundColor = Color_14.Color.fromHexString('#333');
                    this.position = position;
                    this.size = size;
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createBackgroundAndBorders();
                }
                createBackgroundAndBorders() {
                    return new ObjectSkin_13.ObjectSkin(new Grid_8.Grid(this.size).fill(v => this.getCell(v)));
                }
                getCell([x, y]) {
                    const cellSprite = CellSprite_8.CellSprite.empty;
                    if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
                        return new Cell_8.Cell(cellSprite, Colors_13.Colors.Black, this.borderColor);
                    }
                    else {
                        return new Cell_8.Cell(cellSprite, Colors_13.Colors.White, this.backgroundColor);
                    }
                }
            };
            exports_111("UIPanel", UIPanel);
        }
    };
});
System.register("ui/UISceneObject", ["ui/UIElement"], function (exports_112, context_112) {
    "use strict";
    var UIElement_2, UISceneObject;
    var __moduleName = context_112 && context_112.id;
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
            exports_112("UISceneObject", UISceneObject);
        }
    };
});
System.register("utils/misc", ["engine/data/ObjectSkinBuilder", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2"], function (exports_113, context_113) {
    "use strict";
    var ObjectSkinBuilder_2, Object2D_18, ObjectPhysics_7, Vector2_37;
    var __moduleName = context_113 && context_113.id;
    function createTextObjectSkin(text, color, background) {
        const textSkin = new ObjectSkinBuilder_2.ObjectSkinBuilder(text, ''.padEnd(text.length, '.'), { '.': [color, background] }).build();
        return textSkin;
    }
    exports_113("createTextObjectSkin", createTextObjectSkin);
    function createTextObject(text, pos) {
        const skin = createTextObjectSkin(text);
        const t = new Object2D_18.Object2D(Vector2_37.Vector2.zero, skin, new ObjectPhysics_7.ObjectPhysics(), pos);
        t.type = "victory_text_object";
        return t;
    }
    exports_113("createTextObject", createTextObject);
    function deepCopy(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj)
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
    exports_113("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkinBuilder_2_1) {
                ObjectSkinBuilder_2 = ObjectSkinBuilder_2_1;
            },
            function (Object2D_18_1) {
                Object2D_18 = Object2D_18_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            },
            function (Vector2_37_1) {
                Vector2_37 = Vector2_37_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("ui/HealthBarUi", ["ui/UIElement", "utils/misc"], function (exports_114, context_114) {
    "use strict";
    var UIElement_3, misc_1, HealthBarUi;
    var __moduleName = context_114 && context_114.id;
    return {
        setters: [
            function (UIElement_3_1) {
                UIElement_3 = UIElement_3_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
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
                    return misc_1.createTextObjectSkin((npc.health | 0).toString() + "/" + npc.maxHealth.toString());
                }
            };
            exports_114("HealthBarUi", HealthBarUi);
        }
    };
});
System.register("ui/UIObjectSkin", ["ui/UIElement"], function (exports_115, context_115) {
    "use strict";
    var UIElement_4, UIObjectSkin;
    var __moduleName = context_115 && context_115.id;
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
            exports_115("UIObjectSkin", UIObjectSkin);
        }
    };
});
System.register("ui/StunBarUi", ["ui/UIElement", "utils/misc"], function (exports_116, context_116) {
    "use strict";
    var UIElement_5, misc_2, StunBarUi;
    var __moduleName = context_116 && context_116.id;
    return {
        setters: [
            function (UIElement_5_1) {
                UIElement_5 = UIElement_5_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
            StunBarUi = class StunBarUi extends UIElement_5.UIElement {
                constructor(parent, npc) {
                    super(parent);
                    this.npc = npc;
                    this.skin = this.createSkin(this.npc);
                }
                update(ticks) {
                    this.skin = this.createSkin(this.npc);
                }
                createSkin(npc) {
                    return misc_2.createTextObjectSkin((npc.stunValue | 0).toString() + "/" + npc.maxStunValue.toString());
                }
            };
            exports_116("StunBarUi", StunBarUi);
        }
    };
});
System.register("ui/UIAnimationObject", ["engine/objects/SpriteAnimation", "ui/UIElement"], function (exports_117, context_117) {
    "use strict";
    var SpriteAnimation_1, UIElement_6, UIAnimationObject;
    var __moduleName = context_117 && context_117.id;
    return {
        setters: [
            function (SpriteAnimation_1_1) {
                SpriteAnimation_1 = SpriteAnimation_1_1;
            },
            function (UIElement_6_1) {
                UIElement_6 = UIElement_6_1;
            }
        ],
        execute: function () {
            UIAnimationObject = class UIAnimationObject extends UIElement_6.UIElement {
                constructor(parent, sprite) {
                    super(parent);
                    this._animation = new SpriteAnimation_1.SpriteAnimation(sprite);
                    this._animation.play({ isLooped: true });
                }
                update(ticks) {
                    super.update(ticks);
                    this._animation.update(ticks);
                    this.skin = this._animation.getFrame();
                }
            };
            exports_117("UIAnimationObject", UIAnimationObject);
        }
    };
});
System.register("ui/playerUi", ["engine/objects/Npc", "engine/ActionData", "ui/UIPanel", "ui/UIElement", "ui/UISceneObject", "ui/HealthBarUi", "engine/math/Vector2", "engine/components/ObjectSkin", "ui/UIObjectSkin", "engine/math/Grid", "engine/graphics/Cell", "world/items", "ui/StunBarUi", "world/sprites/stunSprite", "ui/UIAnimationObject", "engine/math/Colors", "engine/data/CellSprite"], function (exports_118, context_118) {
    "use strict";
    var Npc_4, ActionData_2, UIPanel_1, UIElement_7, UISceneObject_1, HealthBarUi_1, Vector2_38, ObjectSkin_14, UIObjectSkin_1, Grid_9, Cell_9, items_2, StunBarUi_1, stunSprite_2, UIAnimationObject_1, Colors_14, CellSprite_9, _position, _position2, PlayerUi;
    var __moduleName = context_118 && context_118.id;
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
            function (UIElement_7_1) {
                UIElement_7 = UIElement_7_1;
            },
            function (UISceneObject_1_1) {
                UISceneObject_1 = UISceneObject_1_1;
            },
            function (HealthBarUi_1_1) {
                HealthBarUi_1 = HealthBarUi_1_1;
            },
            function (Vector2_38_1) {
                Vector2_38 = Vector2_38_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (UIObjectSkin_1_1) {
                UIObjectSkin_1 = UIObjectSkin_1_1;
            },
            function (Grid_9_1) {
                Grid_9 = Grid_9_1;
            },
            function (Cell_9_1) {
                Cell_9 = Cell_9_1;
            },
            function (items_2_1) {
                items_2 = items_2_1;
            },
            function (StunBarUi_1_1) {
                StunBarUi_1 = StunBarUi_1_1;
            },
            function (stunSprite_2_1) {
                stunSprite_2 = stunSprite_2_1;
            },
            function (UIAnimationObject_1_1) {
                UIAnimationObject_1 = UIAnimationObject_1_1;
            },
            function (Colors_14_1) {
                Colors_14 = Colors_14_1;
            },
            function (CellSprite_9_1) {
                CellSprite_9 = CellSprite_9_1;
            }
        ],
        execute: function () {
            _position = new Vector2_38.Vector2();
            _position2 = new Vector2_38.Vector2();
            PlayerUi = class PlayerUi extends UIElement_7.UIElement {
                constructor(npc, camera) {
                    super(null);
                    this.npc = npc;
                    this.camera = camera;
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    this.objectUnderCursorSprite = null;
                    this.actionUnderCursorSprite = null;
                    this.objectUnderCursorHealthBar = null;
                    this.range = null;
                    this.panel = new UIPanel_1.UIPanel(this, Vector2_38.Vector2.zero, new Vector2_38.Vector2(camera.size.width, 1));
                    this.panel.borderColor = Colors_14.Colors.Black;
                    this.heroSprite = new UISceneObject_1.UISceneObject(this, npc);
                    this.heroSprite.position = Vector2_38.Vector2.zero;
                    this.heroHealthBar = new HealthBarUi_1.HealthBarUi(this, npc);
                    this.heroHealthBar.position = new Vector2_38.Vector2(1, 0);
                    this.stunSprite = new UIAnimationObject_1.UIAnimationObject(this, stunSprite_2.stunSprite);
                    this.stunSprite.position = new Vector2_38.Vector2(7, 0);
                    this.heroStunBar = new StunBarUi_1.StunBarUi(this, npc);
                    this.heroStunBar.position = new Vector2_38.Vector2(8, 0);
                }
                getNpcUnderCursor(scene) {
                    const npcObjects = scene.children
                        .filter(x => x.enabled && x instanceof Npc_4.Npc)
                        .map(x => x);
                    const npcCursorPosition = this.npc.getWorldCursorPosition(_position2);
                    for (let o of npcObjects) {
                        if (o.getWorldPosition(_position).equals(npcCursorPosition)) {
                            return o;
                        }
                    }
                    return undefined;
                }
                getRange(parent, position, range) {
                    const offset = new Vector2_38.Vector2(range, range);
                    const grid = new Grid_9.Grid(new Vector2_38.Vector2(2 * range + 1, 2 * range + 1));
                    const buffer = new Vector2_38.Vector2();
                    const highlightCell = new Cell_9.Cell(CellSprite_9.CellSprite.empty, undefined, Colors_14.Colors.LightRed.setAlpha(0x22 / 0xff));
                    const d = new Vector2_38.Vector2();
                    for (d.y = -range; d.y <= range; d.y++) {
                        for (d.x = -range; d.x <= range; d.x++) {
                            if (d.length > range) {
                                continue;
                            }
                            const result = buffer.copy(offset).add(d);
                            grid.setAt(result, highlightCell);
                        }
                    }
                    const skin = new ObjectSkin_14.ObjectSkin(grid);
                    const skinEl = new UIObjectSkin_1.UIObjectSkin(parent, skin);
                    skinEl.position = position.clone().sub(offset);
                    return skinEl;
                }
                update(ticks) {
                    super.update(ticks);
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    const right = this.camera.size.width - 1;
                    if (this.npc.scene) {
                        if (this.range) {
                            this.remove(this.range);
                        }
                        if (this.npc.enabled &&
                            this.npc.equipment.objectInMainHand &&
                            items_2.isRangedItem(this.npc.equipment.objectInMainHand)) {
                            const range = this.npc.equipment.objectInMainHand.range;
                            const heroWorldPos = this.npc.getWorldPosition(new Vector2_38.Vector2());
                            const cameraWorldPos = this.camera.getWorldPosition(_position2);
                            const screenPosition = heroWorldPos.sub(cameraWorldPos);
                            const playerUiWorldPos = this.getWorldPosition(_position);
                            const playerUiOffset = playerUiWorldPos.sub(cameraWorldPos);
                            const relativeToPlayerUi = screenPosition.sub(playerUiOffset);
                            this.range = this.getRange(this, relativeToPlayerUi, range);
                        }
                        else {
                            this.range = null;
                        }
                        const npcUnderCursor = this.npc.target && this.npc.target.enabled
                            ? this.npc.target
                            : this.getNpcUnderCursor(this.npc.scene);
                        if (this.npc.enabled && npcUnderCursor) {
                            if (npcUnderCursor !== this.objectUnderCursor) {
                                npcUnderCursor.highlighted = true;
                                this.objectUnderCursor = npcUnderCursor;
                                this.remove(this.objectUnderCursorSprite);
                                this.remove(this.objectUnderCursorHealthBar);
                                // TODO: this is re-created each tick, so they are not updated.
                                this.objectUnderCursorHealthBar = new HealthBarUi_1.HealthBarUi(this, npcUnderCursor);
                                const digits = this.objectUnderCursorHealthBar.skin.size.width;
                                this.objectUnderCursorHealthBar.position = new Vector2_38.Vector2(right - digits, 0);
                                this.objectUnderCursorSprite = new UIObjectSkin_1.UIObjectSkin(this, npcUnderCursor.skin);
                                this.objectUnderCursorSprite.position = new Vector2_38.Vector2(right, 0);
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
                        this.actionUnderCursor = new ObjectSkin_14.ObjectSkin(Grid_9.Grid.from([actionData.actionIcon]));
                        this.remove(this.actionUnderCursorSprite);
                        this.actionUnderCursorSprite = new UIObjectSkin_1.UIObjectSkin(this, this.actionUnderCursor);
                        this.actionUnderCursorSprite.position = new Vector2_38.Vector2(right, 0);
                    }
                    else {
                        this.remove(this.actionUnderCursorSprite);
                        this.actionUnderCursorSprite = null;
                    }
                }
            };
            exports_118("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/events/TeleportToEndpointGameEvent", ["engine/events/GameEvent"], function (exports_119, context_119) {
    "use strict";
    var GameEvent_8, TeleportToEndpointGameEvent;
    var __moduleName = context_119 && context_119.id;
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
            })(TeleportToEndpointGameEvent || (exports_119("TeleportToEndpointGameEvent", TeleportToEndpointGameEvent = {})));
        }
    };
});
System.register("world/objects/portal", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/events/EventLoop", "world/events/TeleportToEndpointGameEvent", "engine/math/Vector2", "engine/math/Colors"], function (exports_120, context_120) {
    "use strict";
    var ObjectSkin_15, Object2D_19, ObjectPhysics_8, EventLoop_5, TeleportToEndpointGameEvent_1, Vector2_39, Colors_15, Portal;
    var __moduleName = context_120 && context_120.id;
    function portal(id, options = { position: [0, 0] }) {
        return new Portal(id, options);
    }
    exports_120("portal", portal);
    return {
        setters: [
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (Object2D_19_1) {
                Object2D_19 = Object2D_19_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
            },
            function (TeleportToEndpointGameEvent_1_1) {
                TeleportToEndpointGameEvent_1 = TeleportToEndpointGameEvent_1_1;
            },
            function (Vector2_39_1) {
                Vector2_39 = Vector2_39_1;
            },
            function (Colors_15_1) {
                Colors_15 = Colors_15_1;
            }
        ],
        execute: function () {
            Portal = class Portal extends Object2D_19.Object2D {
                constructor(name, options) {
                    super(Vector2_39.Vector2.zero, new ObjectSkin_15.ObjectSkin().char(`🌀`).color(Colors_15.Colors.Red).background(Colors_15.Colors.Black), new ObjectPhysics_8.ObjectPhysics().light(9), Vector2_39.Vector2.from(options.position));
                    this.name = name;
                    this.type = "portal";
                    this.setAction({
                        type: "collision",
                        action: ctx => EventLoop_5.emitEvent(TeleportToEndpointGameEvent_1.TeleportToEndpointGameEvent.create(name, ctx.obj, ctx.initiator))
                    });
                }
            };
            exports_120("Portal", Portal);
        }
    };
});
System.register("engine/data/TileInfo", ["engine/math/Colors"], function (exports_121, context_121) {
    "use strict";
    var Colors_16, TileInfo;
    var __moduleName = context_121 && context_121.id;
    return {
        setters: [
            function (Colors_16_1) {
                Colors_16 = Colors_16_1;
            }
        ],
        execute: function () {
            TileInfo = class TileInfo {
                constructor(color = Colors_16.Colors.Transparent, type = 'undefined_tile', category = "solid") {
                    this.color = color;
                    this.type = type;
                    this.category = category;
                    this.effects = [];
                }
                addEffect(effect) {
                    this.effects.push(effect);
                    return this;
                }
                addDisturbanceSprite(sprite) {
                    this.disturbanceSprite = sprite;
                    return this;
                }
                addPhysics(physics) {
                    this.objectPhysics = physics;
                    return this;
                }
            };
            exports_121("TileInfo", TileInfo);
        }
    };
});
System.register("engine/data/Tiles", ["engine/components/ObjectSkin", "engine/objects/Tile", "engine/data/TileInfo", "engine/math/Grid", "engine/math/Vector2", "engine/objects/SpriteAnimation", "engine/math/Color"], function (exports_122, context_122) {
    "use strict";
    var ObjectSkin_16, Tile_1, TileInfo_1, Grid_10, Vector2_40, SpriteAnimation_2, Color_15, Tiles;
    var __moduleName = context_122 && context_122.id;
    return {
        setters: [
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (TileInfo_1_1) {
                TileInfo_1 = TileInfo_1_1;
            },
            function (Grid_10_1) {
                Grid_10 = Grid_10_1;
            },
            function (Vector2_40_1) {
                Vector2_40 = Vector2_40_1;
            },
            function (SpriteAnimation_2_1) {
                SpriteAnimation_2 = SpriteAnimation_2_1;
            },
            function (Color_15_1) {
                Color_15 = Color_15_1;
            }
        ],
        execute: function () {
            Tiles = class Tiles {
                static createEmptyMap(size, callback) {
                    const grid = new Grid_10.Grid(size).fill(callback);
                    return grid.map(this.createTile);
                }
                static createEmpty(size) {
                    return this.createEmptyMap(size, () => Tiles.defaultTile);
                }
                static createEmptyRandomized(size) {
                    return this.createEmptyMap(size, () => {
                        const alpha = 0.9 + Math.random() * 0.1;
                        const tileInfo = new TileInfo_1.TileInfo(Color_15.Color.fromHexString('#242').setAlpha(alpha), '<default_tile>');
                        return tileInfo;
                    });
                }
                static createEmptyDefault() {
                    return this.createEmpty(this.defaultSize);
                }
                static parseTiles(str, tilesMap) {
                    if (!tilesMap[' ']) {
                        tilesMap[' '] = Tiles.defaultTile;
                    }
                    const tileInfos = str
                        .split('\n')
                        .map(mapLine);
                    return Grid_10.Grid.from(tileInfos).map(this.createTile);
                    function mapLine(line) {
                        return line
                            .split('')
                            .map(mapTileInfo);
                    }
                    function mapTileInfo(s) {
                        const tileInfo = tilesMap[s];
                        return tileInfo;
                    }
                }
                static createTile(tileInfo, position) {
                    const skin = new ObjectSkin_16.ObjectSkin().background(tileInfo.color);
                    const tile = new Tile_1.Tile(skin, position.clone());
                    tile.type = tileInfo.type;
                    tile.category = tileInfo.category;
                    tile.effects = [...tileInfo.effects];
                    tile.disturbanceAnimation = tileInfo.disturbanceSprite
                        ? new SpriteAnimation_2.SpriteAnimation(tileInfo.disturbanceSprite)
                        : undefined;
                    tile.physics = tileInfo.objectPhysics || tile.physics;
                    return tile;
                }
            };
            exports_122("Tiles", Tiles);
            Tiles.defaultTile = new TileInfo_1.TileInfo(Color_15.Color.fromHexString('#242'), '<default_tile>');
            Tiles.defaultSize = new Vector2_40.Vector2(20, 20);
        }
    };
});
System.register("world/sprites/tracksSprite", ["engine/data/Sprite"], function (exports_123, context_123) {
    "use strict";
    var Sprite_16, tracksSpriteRaw, tracksSprite;
    var __moduleName = context_123 && context_123.id;
    return {
        setters: [
            function (Sprite_16_1) {
                Sprite_16 = Sprite_16_1;
            }
        ],
        execute: function () {
            tracksSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#555F,#0000
color:r,#5558,#0000
color:o,#5552,#0000

particle
.....
RRrro`;
            exports_123("tracksSprite", tracksSprite = Sprite_16.Sprite.parse(tracksSpriteRaw));
        }
    };
});
System.register("world/sprites/lavaDisturbanceSprite", ["engine/data/Sprite"], function (exports_124, context_124) {
    "use strict";
    var Sprite_17, lavaDisturbanceSpriteRaw, lavaDisturbanceSprite;
    var __moduleName = context_124 && context_124.id;
    return {
        setters: [
            function (Sprite_17_1) {
                Sprite_17 = Sprite_17_1;
            }
        ],
        execute: function () {
            lavaDisturbanceSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#fc5,#0000

particle
.·ᣟᣟ·.
RRRRRR`;
            exports_124("lavaDisturbanceSprite", lavaDisturbanceSprite = Sprite_17.Sprite.parse(lavaDisturbanceSpriteRaw));
        }
    };
});
System.register("world/sprites/waterRippleSprite", ["engine/data/Sprite"], function (exports_125, context_125) {
    "use strict";
    var Sprite_18, waterRippleSpriteRaw, waterRippleSprite;
    var __moduleName = context_125 && context_125.id;
    return {
        setters: [
            function (Sprite_18_1) {
                Sprite_18 = Sprite_18_1;
            }
        ],
        execute: function () {
            waterRippleSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#082e54,#0000

particle
·◌○⨀Ⓞ◯
RRRRRR`;
            exports_125("waterRippleSprite", waterRippleSprite = Sprite_18.Sprite.parse(waterRippleSpriteRaw));
        }
    };
});
System.register("world/tiles", ["engine/components/ObjectPhysics", "engine/data/TileInfo", "engine/effects/CloakEffect", "engine/effects/DamageEffect", "engine/effects/SlownessEffect", "engine/effects/WetnessEffect", "world/sprites/tracksSprite", "world/sprites/lavaDisturbanceSprite", "world/sprites/waterRippleSprite", "engine/math/Color"], function (exports_126, context_126) {
    "use strict";
    var ObjectPhysics_9, TileInfo_2, CloakEffect_3, DamageEffect_5, SlownessEffect_4, WetnessEffect_2, tracksSprite_1, lavaDisturbanceSprite_1, waterRippleSprite_1, Color_16, tiles;
    var __moduleName = context_126 && context_126.id;
    return {
        setters: [
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            },
            function (TileInfo_2_1) {
                TileInfo_2 = TileInfo_2_1;
            },
            function (CloakEffect_3_1) {
                CloakEffect_3 = CloakEffect_3_1;
            },
            function (DamageEffect_5_1) {
                DamageEffect_5 = DamageEffect_5_1;
            },
            function (SlownessEffect_4_1) {
                SlownessEffect_4 = SlownessEffect_4_1;
            },
            function (WetnessEffect_2_1) {
                WetnessEffect_2 = WetnessEffect_2_1;
            },
            function (tracksSprite_1_1) {
                tracksSprite_1 = tracksSprite_1_1;
            },
            function (lavaDisturbanceSprite_1_1) {
                lavaDisturbanceSprite_1 = lavaDisturbanceSprite_1_1;
            },
            function (waterRippleSprite_1_1) {
                waterRippleSprite_1 = waterRippleSprite_1_1;
            },
            function (Color_16_1) {
                Color_16 = Color_16_1;
            }
        ],
        execute: function () {
            exports_126("tiles", tiles = {
                mountain: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#986A6A'), 'mountain', "elevated"),
                water: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#358'), 'water', "liquid")
                    .addDisturbanceSprite(waterRippleSprite_1.waterRippleSprite)
                    .addEffect(new WetnessEffect_2.WaterWetnessEffect()),
                water_deep: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#246'), 'water_deep', "liquid")
                    .addDisturbanceSprite(waterRippleSprite_1.waterRippleSprite)
                    .addEffect(new WetnessEffect_2.WaterWetnessEffect()),
                grass: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#350'), 'grass'),
                grass_tall: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#240'), 'grass_tall')
                    .addEffect(new CloakEffect_3.LightCloakEffect(1)),
                sand: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#b80'), 'sand', "solid")
                    .addDisturbanceSprite(tracksSprite_1.tracksSprite)
                    .addEffect(new SlownessEffect_4.SlownessEffect("sand", 0.2)),
                bridge_stone: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#444'), 'bridge_stone', "solid"),
                bridge_stone_dark: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#333'), 'bridge_stone_dark', "solid"),
                lava: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#c33'), 'lava', "liquid")
                    .addDisturbanceSprite(lavaDisturbanceSprite_1.lavaDisturbanceSprite)
                    .addPhysics(new ObjectPhysics_9.ObjectPhysics().light('5').temperature('9'))
                    .addEffect(new SlownessEffect_4.SlownessEffect("lava", 0.5))
                    .addEffect(new DamageEffect_5.FireDamageEffect()),
                ice: new TileInfo_2.TileInfo(Color_16.Color.fromHexString('#789'), 'ice', "solid")
                    .addPhysics(new ObjectPhysics_9.ObjectPhysics().temperature('0')),
            });
        }
    };
});
System.register("world/objects/fence", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Colors"], function (exports_127, context_127) {
    "use strict";
    var ObjectSkin_17, Object2D_20, ObjectPhysics_10, Vector2_41, Colors_17;
    var __moduleName = context_127 && context_127.id;
    function fence(options) {
        const object = new Object2D_20.Object2D(Vector2_41.Vector2.zero, new ObjectSkin_17.ObjectSkin().char(`☗`).color(Colors_17.Colors.Sienna), new ObjectPhysics_10.ObjectPhysics().collision(), Vector2_41.Vector2.from(options.position));
        object.type = "fence";
        return object;
    }
    exports_127("fence", fence);
    return {
        setters: [
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (Object2D_20_1) {
                Object2D_20 = Object2D_20_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            },
            function (Vector2_41_1) {
                Vector2_41 = Vector2_41_1;
            },
            function (Colors_17_1) {
                Colors_17 = Colors_17_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/lamp", ["engine/objects/Object2D", "engine/data/ObjectSkinBuilder", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Colors"], function (exports_128, context_128) {
    "use strict";
    var Object2D_21, ObjectSkinBuilder_3, ObjectPhysics_11, Vector2_42, Colors_18, Lamp, lamp;
    var __moduleName = context_128 && context_128.id;
    return {
        setters: [
            function (Object2D_21_1) {
                Object2D_21 = Object2D_21_1;
            },
            function (ObjectSkinBuilder_3_1) {
                ObjectSkinBuilder_3 = ObjectSkinBuilder_3_1;
            },
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (Vector2_42_1) {
                Vector2_42 = Vector2_42_1;
            },
            function (Colors_18_1) {
                Colors_18 = Colors_18_1;
            }
        ],
        execute: function () {
            Lamp = class Lamp extends Object2D_21.Object2D {
                constructor(options) {
                    const origin = new Vector2_42.Vector2(0, 2);
                    const physics = new ObjectPhysics_11.ObjectPhysics()
                        .collision(origin)
                        .light(Lamp._intensity);
                    const skin = new ObjectSkinBuilder_3.ObjectSkinBuilder(`
⬤
█
█
`, `
L
H
H
`, {
                        'L': [Colors_18.Colors.Yellow, Colors_18.Colors.Transparent],
                        'H': [Colors_18.Colors.Gray, Colors_18.Colors.Transparent],
                    }).build();
                    super(origin, skin, physics, Vector2_42.Vector2.from(options.position));
                    this.setLampState(options.isOn === true);
                    this.setAction({
                        position: origin,
                        action: (ctx) => ctx.obj.toggle(),
                        iconPosition: Vector2_42.Vector2.zero
                    });
                }
                setLampState(isOn) {
                    const o = this;
                    o.parameters["is_on"] = isOn;
                    o.skin.color(isOn ? Colors_18.Colors.Yellow : Colors_18.Colors.Black);
                    o.physics.lights[0].intensity = Number.parseInt(isOn ? Lamp._intensity : '0', 16);
                }
                toggle() {
                    const isOn = this.parameters["is_on"];
                    this.setLampState(!isOn);
                }
            };
            exports_128("Lamp", Lamp);
            Lamp._intensity = 'F';
            exports_128("lamp", lamp = (options) => {
                const object = new Lamp(options);
                return object;
            });
        }
    };
});
System.register("world/objects/natural", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Colors"], function (exports_129, context_129) {
    "use strict";
    var Object2D_22, ObjectSkin_18, ObjectPhysics_12, Vector2_43, Colors_19, createUnitSkin, createUnitStaticObject, flower, bush, wheat, hotspring, cactus;
    var __moduleName = context_129 && context_129.id;
    return {
        setters: [
            function (Object2D_22_1) {
                Object2D_22 = Object2D_22_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            },
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
            },
            function (Vector2_43_1) {
                Vector2_43 = Vector2_43_1;
            },
            function (Colors_19_1) {
                Colors_19 = Colors_19_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = Colors_19.Colors.Black) => new ObjectSkin_18.ObjectSkin().char(sym).color(color);
            createUnitStaticObject = (options) => new Object2D_22.Object2D(Vector2_43.Vector2.zero, createUnitSkin(options.sym, options.color), new ObjectPhysics_12.ObjectPhysics(), Vector2_43.Vector2.from(options.position));
            exports_129("flower", flower = (options) => createUnitStaticObject({ ...options, sym: `❁`, color: Colors_19.Colors.Red }));
            exports_129("bush", bush = (options) => new Object2D_22.Object2D(Vector2_43.Vector2.zero, createUnitSkin(`🌳`, Colors_19.Colors.Green), new ObjectPhysics_12.ObjectPhysics().material(0.8), Vector2_43.Vector2.from(options.position)));
            exports_129("wheat", wheat = (options) => createUnitStaticObject({ ...options, sym: `⸙`, color: Colors_19.Colors.Yellow })); // 🌾
            exports_129("hotspring", hotspring = (options) => new Object2D_22.Object2D(Vector2_43.Vector2.zero, createUnitSkin(`♨`, Colors_19.Colors.LightBlue), new ObjectPhysics_12.ObjectPhysics().temperature('A'), Vector2_43.Vector2.from(options.position)));
            exports_129("cactus", cactus = (options) => createUnitStaticObject({ ...options, sym: `🌵`, color: Colors_19.Colors.Green }));
        }
    };
});
System.register("world/levels/bridgeLevel", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/tiles", "world/objects/fence", "world/objects/lamp", "world/objects/natural"], function (exports_130, context_130) {
    "use strict";
    var Level_2, portal_1, Tiles_1, tiles_1, fence_1, lamp_1, natural_1, bridgeY, portals, foliage, width, fences, objects, levelTiles, bridgeLevel;
    var __moduleName = context_130 && context_130.id;
    return {
        setters: [
            function (Level_2_1) {
                Level_2 = Level_2_1;
            },
            function (portal_1_1) {
                portal_1 = portal_1_1;
            },
            function (Tiles_1_1) {
                Tiles_1 = Tiles_1_1;
            },
            function (tiles_1_1) {
                tiles_1 = tiles_1_1;
            },
            function (fence_1_1) {
                fence_1 = fence_1_1;
            },
            function (lamp_1_1) {
                lamp_1 = lamp_1_1;
            },
            function (natural_1_1) {
                natural_1 = natural_1_1;
            }
        ],
        execute: function () {
            bridgeY = 7;
            portals = [
                portal_1.portal('bridge_portal_west', { position: [1, bridgeY + 2] }),
            ];
            foliage = [
                natural_1.bush({ position: [2, 2] }),
                natural_1.bush({ position: [6, 1] }),
                natural_1.bush({ position: [12, 3] }),
                natural_1.bush({ position: [17, 2] }),
                natural_1.bush({ position: [4, 19] }),
            ];
            width = 33;
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    if (x % 9 === 3) {
                        fences.push(lamp_1.lamp({ position: [x, bridgeY], isOn: true }));
                        fences.push(lamp_1.lamp({ position: [x, bridgeY + 5], isOn: true }));
                    }
                    else {
                        fences.push(fence_1.fence({ position: [x, bridgeY] }));
                        fences.push(fence_1.fence({ position: [x, bridgeY + 5] }));
                    }
                }
            }
            objects = [...portals, ...fences, ...foliage];
            levelTiles = Tiles_1.Tiles.parseTiles(`                                 
                                 
                                 
MMMMMMMMMM       MM              
MMMMMMMMMMMMMMMMMMMMMMMMMM  MMMMM
MM     MMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
bbbbbbbbbbbbbbbbbbbbBbbbbbbbBbbbb
bbBbbbbbbbbbBbbbbbbbbbbbBbbbbbbbb
bbbbbBbbbbbbbbbbbbbbbbbbbbbbbbbBb
bbbbbbbbbBbbbbbbbbbbbbbbbbbBbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
wwwwMMMMMMMMMwwwwwwwwwwwMMMMMMMMM
MMMwwwwwwwwwwwMMMMMMMMMwwwwwwwwww
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
           MMMMMM                
                                 
                                 `, {
                'M': tiles_1.tiles.mountain,
                'w': tiles_1.tiles.water,
                'b': tiles_1.tiles.bridge_stone,
                'B': tiles_1.tiles.bridge_stone_dark,
            });
            exports_130("bridgeLevel", bridgeLevel = new Level_2.Level('bridge', objects, levelTiles));
        }
    };
});
System.register("world/levels/desert", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "engine/math/Vector2", "world/tiles", "engine/objects/Tile", "world/objects/natural"], function (exports_131, context_131) {
    "use strict";
    var Level_3, portal_2, Tiles_2, Vector2_44, tiles_2, Tile_2, natural_2, portals, cactuses, objects, levelTiles, desertLevel;
    var __moduleName = context_131 && context_131.id;
    return {
        setters: [
            function (Level_3_1) {
                Level_3 = Level_3_1;
            },
            function (portal_2_1) {
                portal_2 = portal_2_1;
            },
            function (Tiles_2_1) {
                Tiles_2 = Tiles_2_1;
            },
            function (Vector2_44_1) {
                Vector2_44 = Vector2_44_1;
            },
            function (tiles_2_1) {
                tiles_2 = tiles_2_1;
            },
            function (Tile_2_1) {
                Tile_2 = Tile_2_1;
            },
            function (natural_2_1) {
                natural_2 = natural_2_1;
            }
        ],
        execute: function () {
            portals = [
                portal_2.portal('desert_portal_west', { position: [2, 2] }),
            ];
            cactuses = [
                { position: [7, 4] },
                { position: [17, 15] },
                { position: [26, 24] },
                { position: [14, 7] },
                { position: [24, 13] },
                { position: [37, 9] },
                { position: [8, 11] },
            ].map((x) => natural_2.cactus(x));
            objects = [...portals, ...cactuses];
            levelTiles = Tiles_2.Tiles.createEmptyMap(new Vector2_44.Vector2(40, 30), () => tiles_2.tiles.sand)
                .map(tile => tile.setSandLevel(Math.round(Math.random() * Tile_2.Tile.maxSandLevel) | 0)); // TODO: seeded random.
            exports_131("desertLevel", desertLevel = new Level_3.Level('desert', objects, levelTiles));
            desertLevel.defaultTemperatureAtDay = 15;
            desertLevel.defaultTemperatureAtNight = 0;
        }
    };
});
System.register("engine/data/ObjectPhysicsBuilder", ["utils/math", "engine/math/Color", "engine/math/Vector2", "engine/components/ObjectPhysics"], function (exports_132, context_132) {
    "use strict";
    var math_8, Color_17, Vector2_45, ObjectPhysics_13, ObjectPhysicsBuilder;
    var __moduleName = context_132 && context_132.id;
    return {
        setters: [
            function (math_8_1) {
                math_8 = math_8_1;
            },
            function (Color_17_1) {
                Color_17 = Color_17_1;
            },
            function (Vector2_45_1) {
                Vector2_45 = Vector2_45_1;
            },
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
            }
        ],
        execute: function () {
            ObjectPhysicsBuilder = class ObjectPhysicsBuilder {
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '', opacityMask = '') {
                    this.collisions = collisionsMask.split('\n').filter(line => line.length > 0);
                    this.lights = lightMask.split('\n').filter(line => line.length > 0);
                    this.temperatures = temperatureMask.split('\n').filter(line => line.length > 0);
                    this.opacity = opacityMask !== ''
                        ? opacityMask.split('\n').filter(line => line.length > 0)
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
                        .reduce((a, x) => a = x(a), new ObjectPhysics_13.ObjectPhysics());
                    return physics;
                }
                setMaterials(physics) {
                    for (const [top, string] of this.opacity.entries()) {
                        for (const [left, char] of string.split('').entries()) {
                            if (!char) {
                                continue;
                            }
                            const opacity = math_8.clamp(Number.parseInt(char, 16) / 15, 0, 1);
                            const position = new Vector2_45.Vector2(left, top);
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
                            const position = new Vector2_45.Vector2(left, top);
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
                            const position = new Vector2_45.Vector2(left, top);
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
                            const cellPos = new Vector2_45.Vector2(x, y);
                            physics.collision(cellPos);
                        }
                    }
                    return physics;
                }
                getLight(char) {
                    let color = new Color_17.Color(1, 1, 1);
                    const intensity = Number.parseInt(char, 16);
                    return { color, intensity };
                }
            };
            exports_132("ObjectPhysicsBuilder", ObjectPhysicsBuilder);
        }
    };
});
System.register("world/objects/house", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/data/ObjectSkinBuilder", "engine/data/ObjectPhysicsBuilder", "engine/math/Vector2", "engine/components/ObjectPhysics", "engine/math/Colors", "engine/math/Color"], function (exports_133, context_133) {
    "use strict";
    var Object2D_23, ObjectSkin_19, ObjectSkinBuilder_4, ObjectPhysicsBuilder_1, Vector2_46, ObjectPhysics_14, Colors_20, Color_18, windowHorizontalSkin, wallSkin, physicsUnitBlockedTransparent, physicsUnitBlocked, windowHorizontal, wall;
    var __moduleName = context_133 && context_133.id;
    function house(options) {
        const object = new Object2D_23.Object2D(new Vector2_46.Vector2(2, 2), new ObjectSkinBuilder_4.ObjectSkinBuilder(`
 /^\\ 
==*==
 ▓ ▓ 
`, `
 BBB 
BBSBB
 WDW
`, {
            B: [undefined, Colors_20.Colors.Black],
            S: [undefined, Color_18.Color.fromHexString('#004')],
            W: [Colors_20.Colors.Black, Colors_20.Colors.DarkRed],
            D: [Colors_20.Colors.Black, Colors_20.Colors.SaddleBrown]
        }).build(), new ObjectPhysicsBuilder_1.ObjectPhysicsBuilder(`
     
 ... 
 . . 
`).build(), Vector2_46.Vector2.from(options.position));
        object.type = "big_house";
        return object;
    }
    exports_133("house", house);
    return {
        setters: [
            function (Object2D_23_1) {
                Object2D_23 = Object2D_23_1;
            },
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (ObjectSkinBuilder_4_1) {
                ObjectSkinBuilder_4 = ObjectSkinBuilder_4_1;
            },
            function (ObjectPhysicsBuilder_1_1) {
                ObjectPhysicsBuilder_1 = ObjectPhysicsBuilder_1_1;
            },
            function (Vector2_46_1) {
                Vector2_46 = Vector2_46_1;
            },
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            },
            function (Colors_20_1) {
                Colors_20 = Colors_20_1;
            },
            function (Color_18_1) {
                Color_18 = Color_18_1;
            }
        ],
        execute: function () {
            windowHorizontalSkin = () => new ObjectSkin_19.ObjectSkin().char(`🪟`).color(Colors_20.Colors.Blue);
            wallSkin = () => new ObjectSkin_19.ObjectSkin().background(Colors_20.Colors.Gray);
            physicsUnitBlockedTransparent = (transparency) => new ObjectPhysics_14.ObjectPhysics().material(transparency || '0');
            physicsUnitBlocked = () => new ObjectPhysics_14.ObjectPhysics().collision();
            exports_133("windowHorizontal", windowHorizontal = (options) => new Object2D_23.Object2D(Vector2_46.Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2_46.Vector2.from(options.position)));
            exports_133("wall", wall = (options) => new Object2D_23.Object2D(Vector2_46.Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2_46.Vector2.from(options.position)));
        }
    };
});
System.register("world/events/PlayerMessageGameEvent", ["engine/events/GameEvent"], function (exports_134, context_134) {
    "use strict";
    var GameEvent_9, PlayerMessageGameEvent;
    var __moduleName = context_134 && context_134.id;
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
            })(PlayerMessageGameEvent || (exports_134("PlayerMessageGameEvent", PlayerMessageGameEvent = {})));
        }
    };
});
System.register("world/events/TransferItemsGameEvent", ["engine/events/GameEvent"], function (exports_135, context_135) {
    "use strict";
    var GameEvent_10, TransferItemsGameEvent;
    var __moduleName = context_135 && context_135.id;
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
            })(TransferItemsGameEvent || (exports_135("TransferItemsGameEvent", TransferItemsGameEvent = {})));
        }
    };
});
System.register("world/actions", ["engine/events/EventLoop", "world/events/PlayerMessageGameEvent", "world/events/TransferItemsGameEvent"], function (exports_136, context_136) {
    "use strict";
    var EventLoop_6, PlayerMessageGameEvent_1, TransferItemsGameEvent_1;
    var __moduleName = context_136 && context_136.id;
    function storageAction(obj) {
        return (ctx) => {
            const items = obj.inventory.items;
            if (items.length === 0) {
                EventLoop_6.emitEvent(PlayerMessageGameEvent_1.PlayerMessageGameEvent.create("Chest is empty."));
                return;
            }
            obj.inventory.items = [];
            EventLoop_6.emitEvent(TransferItemsGameEvent_1.TransferItemsGameEvent.create(ctx.initiator, items));
        };
    }
    exports_136("storageAction", storageAction);
    return {
        setters: [
            function (EventLoop_6_1) {
                EventLoop_6 = EventLoop_6_1;
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
System.register("world/objects/chest", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/actions", "engine/math/Vector2"], function (exports_137, context_137) {
    "use strict";
    var Object2D_24, ObjectSkin_20, ObjectPhysics_15, actions_1, Vector2_47, Chest;
    var __moduleName = context_137 && context_137.id;
    return {
        setters: [
            function (Object2D_24_1) {
                Object2D_24 = Object2D_24_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            },
            function (Vector2_47_1) {
                Vector2_47 = Vector2_47_1;
            }
        ],
        execute: function () {
            Chest = class Chest extends Object2D_24.Object2D {
                constructor() {
                    super(Vector2_47.Vector2.zero, new ObjectSkin_20.ObjectSkin().char(`🧰`), new ObjectPhysics_15.ObjectPhysics().collision(), Vector2_47.Vector2.zero);
                    this.setAction(actions_1.storageAction(this));
                }
            };
            exports_137("Chest", Chest);
        }
    };
});
System.register("world/npcs/target", ["engine/objects/Npc", "engine/components/ObjectSkin", "engine/math/Vector2"], function (exports_138, context_138) {
    "use strict";
    var Npc_5, ObjectSkin_21, Vector2_48, Target;
    var __moduleName = context_138 && context_138.id;
    function target(options) {
        return new Target(Vector2_48.Vector2.from(options.position));
    }
    exports_138("target", target);
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            },
            function (Vector2_48_1) {
                Vector2_48 = Vector2_48_1;
            }
        ],
        execute: function () {
            Target = class Target extends Npc_5.Npc {
                constructor(position = Vector2_48.Vector2.zero) {
                    super(new ObjectSkin_21.ObjectSkin().char(`🎯`), position);
                    this.type = "target";
                    this.realm = "ground";
                    this.health = 99;
                    this.maxHealth = 99;
                }
            };
            exports_138("Target", Target);
        }
    };
});
System.register("world/objects/Door", ["engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/components/ObjectSkin", "engine/math/Rotation"], function (exports_139, context_139) {
    "use strict";
    var Object2D_25, ObjectPhysics_16, Vector2_49, ObjectSkin_22, Rotation_5, Door, door;
    var __moduleName = context_139 && context_139.id;
    return {
        setters: [
            function (Object2D_25_1) {
                Object2D_25 = Object2D_25_1;
            },
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (Vector2_49_1) {
                Vector2_49 = Vector2_49_1;
            },
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (Rotation_5_1) {
                Rotation_5 = Rotation_5_1;
            }
        ],
        execute: function () {
            Door = class Door extends Object2D_25.Object2D {
                constructor(options) {
                    const origin = Vector2_49.Vector2.zero;
                    const physics = new ObjectPhysics_16.ObjectPhysics()
                        .signal({
                        position: Vector2_49.Vector2.zero,
                        outputs: Rotation_5.Rotations.all,
                        inputs: Rotation_5.Rotations.all,
                    });
                    super(origin, new ObjectSkin_22.ObjectSkin(), physics, Vector2_49.Vector2.from(options.position));
                    this._isSignaled = false;
                    this.type = "door";
                    this.setDoorState(options.isOpened === true);
                    this._requiresSignal = typeof options.requiresSignal === "undefined" ? false : options.requiresSignal;
                    this.setAction({
                        position: Vector2_49.Vector2.zero,
                        action: (ctx) => {
                            const door = ctx.obj;
                            if (!door._requiresSignal) {
                                door.toggle();
                            }
                        },
                        iconPosition: Vector2_49.Vector2.zero,
                    });
                }
                processSignalTransfer(transfers) {
                    const isSignaled = transfers.filter(x => x.signal.value > 0).length > 0;
                    if (this._isSignaled != isSignaled) {
                        this.setDoorState(isSignaled);
                        this._isSignaled = isSignaled;
                    }
                    return [];
                }
                setDoorState(isOpened) {
                    const o = this;
                    o.parameters["is_opened"] = isOpened;
                    o.physics.collisions = isOpened ? [] : [Vector2_49.Vector2.zero];
                    o.physics.material({ position: Vector2_49.Vector2.zero, opacity: isOpened ? 0 : 1 });
                    o.skin.char(isOpened ? `𓉸` : `🚪`);
                }
                toggle() {
                    const isOpened = this.parameters["is_opened"];
                    this.setDoorState(!isOpened);
                }
            };
            exports_139("Door", Door);
            exports_139("door", door = (options) => {
                const object = new Door(options);
                return object;
            });
        }
    };
});
System.register("world/objects/signals/LightSource", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/components/CompositeObjectSkin", "engine/math/Vector2", "engine/math/Rotation", "engine/math/Colors"], function (exports_140, context_140) {
    "use strict";
    var Object2D_26, ObjectSkin_23, ObjectPhysics_17, CompositeObjectSkin_3, Vector2_50, Rotation_6, Colors_21, LightSource;
    var __moduleName = context_140 && context_140.id;
    return {
        setters: [
            function (Object2D_26_1) {
                Object2D_26 = Object2D_26_1;
            },
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (CompositeObjectSkin_3_1) {
                CompositeObjectSkin_3 = CompositeObjectSkin_3_1;
            },
            function (Vector2_50_1) {
                Vector2_50 = Vector2_50_1;
            },
            function (Rotation_6_1) {
                Rotation_6 = Rotation_6_1;
            },
            function (Colors_21_1) {
                Colors_21 = Colors_21_1;
            }
        ],
        execute: function () {
            LightSource = class LightSource extends Object2D_26.Object2D {
                constructor(options) {
                    const origin = new Vector2_50.Vector2(0, options.depth || 0);
                    const lightColor = options.color || Colors_21.Colors.White;
                    const physics = new ObjectPhysics_17.ObjectPhysics()
                        .light({
                        intensity: Number.parseInt(options.intensity || 'F'),
                        color: lightColor,
                        position: Vector2_50.Vector2.zero,
                    })
                        .signal({
                        position: origin,
                        outputs: Rotation_6.Rotations.all,
                        inputs: Rotation_6.Rotations.all,
                    });
                    const mainSkin = new ObjectSkin_23.ObjectSkin().char(`⬤`).color(lightColor);
                    const circleSkin = new ObjectSkin_23.ObjectSkin().char('⭘').color(lightColor);
                    const skin = new CompositeObjectSkin_3.CompositeObjectSkin([mainSkin, circleSkin]);
                    super(origin, skin, physics, Vector2_50.Vector2.from(options.position));
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
                    this._mainSkin.color(isOn ? this._color : Colors_21.Colors.Black);
                    this.physics.lights[0].intensity = isOn ? this._maxIntensity : 0;
                }
                toggle() {
                    this.setLampState(!this._isOn);
                }
            };
            exports_140("LightSource", LightSource);
        }
    };
});
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_141, context_141) {
    "use strict";
    var Sprite_19, treeSpriteRaw, treeSprite;
    var __moduleName = context_141 && context_141.id;
    return {
        setters: [
            function (Sprite_19_1) {
                Sprite_19 = Sprite_19_1;
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
color:H,#533009,#0000

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
            exports_141("treeSprite", treeSprite = Sprite_19.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/Object2D", "world/events/WeatherChangedGameEvent"], function (exports_142, context_142) {
    "use strict";
    var Object2D_27, WeatherChangedGameEvent_2, Tree;
    var __moduleName = context_142 && context_142.id;
    return {
        setters: [
            function (Object2D_27_1) {
                Object2D_27 = Object2D_27_1;
            },
            function (WeatherChangedGameEvent_2_1) {
                WeatherChangedGameEvent_2 = WeatherChangedGameEvent_2_1;
            }
        ],
        execute: function () {
            Tree = class Tree extends Object2D_27.Object2D {
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
            exports_142("Tree", Tree);
            ;
        }
    };
});
System.register("world/objects/pineTree", ["engine/components/ObjectPhysics", "engine/math/Vector2", "world/sprites/tree", "world/objects/Tree"], function (exports_143, context_143) {
    "use strict";
    var ObjectPhysics_18, Vector2_51, tree_1, Tree_1, PineTree;
    var __moduleName = context_143 && context_143.id;
    function pineTree(options) {
        return new PineTree(Vector2_51.Vector2.from(options.position));
    }
    exports_143("pineTree", pineTree);
    return {
        setters: [
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            },
            function (Vector2_51_1) {
                Vector2_51 = Vector2_51_1;
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
                    const origin = new Vector2_51.Vector2(1, 3);
                    super(origin, tree_1.treeSprite, new ObjectPhysics_18.ObjectPhysics().collision(origin), position);
                }
            };
        }
    };
});
System.register("world/levels/devHub", ["engine/Level", "world/objects/house", "world/objects/fence", "world/objects/portal", "world/objects/chest", "world/items", "engine/data/Tiles", "engine/math/Vector2", "world/npcs/target", "world/objects/Door", "world/objects/lamp", "world/objects/signals/LightSource", "world/objects/pineTree", "engine/math/Colors"], function (exports_144, context_144) {
    "use strict";
    var Level_4, house_1, fence_2, portal_3, chest_1, items_3, Tiles_3, Vector2_52, target_1, Door_1, lamp_2, LightSource_1, pineTree_1, Colors_22, fences, width, height, house1, portals, chest, targetPractice, aDoor, lightSourceY, treeY, tree2Y, lightsDemo, objects, level, devHubLevel;
    var __moduleName = context_144 && context_144.id;
    return {
        setters: [
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (house_1_1) {
                house_1 = house_1_1;
            },
            function (fence_2_1) {
                fence_2 = fence_2_1;
            },
            function (portal_3_1) {
                portal_3 = portal_3_1;
            },
            function (chest_1_1) {
                chest_1 = chest_1_1;
            },
            function (items_3_1) {
                items_3 = items_3_1;
            },
            function (Tiles_3_1) {
                Tiles_3 = Tiles_3_1;
            },
            function (Vector2_52_1) {
                Vector2_52 = Vector2_52_1;
            },
            function (target_1_1) {
                target_1 = target_1_1;
            },
            function (Door_1_1) {
                Door_1 = Door_1_1;
            },
            function (lamp_2_1) {
                lamp_2 = lamp_2_1;
            },
            function (LightSource_1_1) {
                LightSource_1 = LightSource_1_1;
            },
            function (pineTree_1_1) {
                pineTree_1 = pineTree_1_1;
            },
            function (Colors_22_1) {
                Colors_22 = Colors_22_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 44;
            height = 44;
            if (true) { // add fence
                for (let x = 0; x < width; x++) {
                    fences.push(fence_2.fence({ position: [x, 0] }));
                    fences.push(fence_2.fence({ position: [x, height - 1] }));
                }
                for (let y = 1; y < height - 1; y++) {
                    fences.push(fence_2.fence({ position: [0, y] }));
                    fences.push(fence_2.fence({ position: [width - 1, y] }));
                }
            }
            house1 = house_1.house({ position: [6, 2] });
            portals = [
                portal_3.portal('lights', { position: [2, 2] }),
                portal_3.portal('dungeon', { position: [2, 4] }),
                portal_3.portal('intro', { position: [2, 8] }),
                portal_3.portal('house', { position: [6, 2] }),
                portal_3.portal('terrain_portal', { position: [6, 6] }),
                portal_3.portal('ggj2020demo_portal', { position: [12, 2] }),
                portal_3.portal('sheeps_portal', { position: [2, 10] }),
                portal_3.portal('particles', { position: [4, 10] }),
                portal_3.portal('mistland', { position: [6, 10] }),
                portal_3.portal('volcanic', { position: [8, 10] }),
                portal_3.portal('signals', { position: [10, 10] }),
                portal_3.portal('signal_lights', { position: [12, 10] }),
                portal_3.portal('effects_level').translateX(2).translateY(12),
                portal_3.portal('target_practice').translateX(4).translateY(12),
                portal_3.portal('bridge_portal_west').translateX(6).translateY(12),
                portal_3.portal('iceberg_portal_west').translateX(8).translateY(12),
                portal_3.portal('huge_tree_portal_west').translateX(10).translateY(12),
                portal_3.portal('desert_portal_west').translateX(12).translateY(12),
            ];
            chest = new chest_1.Chest().translateX(7).translateY(7);
            chest.inventory.addItems([items_3.bambooSeed()]);
            targetPractice = new target_1.Target().translateX(11).translateY(7);
            aDoor = Door_1.door({ position: [9, 5], isOpened: false });
            lightSourceY = 24;
            treeY = lightSourceY + 1; // TODO: put trees in front of light sources (+1).
            tree2Y = treeY - 5;
            lightsDemo = [
                new lamp_2.Lamp({ position: [23, 7], isOn: true }),
                pineTree_1.pineTree({ position: [5, treeY] }),
                pineTree_1.pineTree({ position: [5, tree2Y] }),
                new LightSource_1.LightSource({ position: [5, lightSourceY], depth: 0, intensity: 'F', requiresSignal: false }),
                pineTree_1.pineTree({ position: [20, treeY] }),
                pineTree_1.pineTree({ position: [20, tree2Y] }),
                new LightSource_1.LightSource({ position: [20, lightSourceY], depth: 1, intensity: 'F', requiresSignal: false }),
                pineTree_1.pineTree({ position: [35, treeY] }),
                pineTree_1.pineTree({ position: [35, tree2Y] }),
                new LightSource_1.LightSource({ position: [35, lightSourceY], depth: 2, intensity: 'F', requiresSignal: false }),
                new LightSource_1.LightSource({ position: [35, 7], depth: 0, color: Colors_22.Colors.Blue, intensity: 'F', requiresSignal: false }),
            ];
            objects = [...fences, house1, ...portals, chest, targetPractice, aDoor, ...lightsDemo];
            level = new Level_4.Level('devHub', objects, Tiles_3.Tiles.createEmpty(new Vector2_52.Vector2(width, height)));
            exports_144("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/sprites/smokeSprite", ["engine/data/Sprite"], function (exports_145, context_145) {
    "use strict";
    var Sprite_20, smokeSpriteRaw, smokeSprite;
    var __moduleName = context_145 && context_145.id;
    return {
        setters: [
            function (Sprite_20_1) {
                Sprite_20 = Sprite_20_1;
            }
        ],
        execute: function () {
            smokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#aaaA
color:T,#0000,#aaa8
color:Y,#0000,#aaa5

particle
'''''''
RRTTYYY`;
            exports_145("smokeSprite", smokeSprite = Sprite_20.Sprite.parse(smokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/Smoke", ["engine/math/Vector2", "engine/objects/Particle", "world/sprites/smokeSprite"], function (exports_146, context_146) {
    "use strict";
    var Vector2_53, Particle_8, smokeSprite_1, Smoke;
    var __moduleName = context_146 && context_146.id;
    return {
        setters: [
            function (Vector2_53_1) {
                Vector2_53 = Vector2_53_1;
            },
            function (Particle_8_1) {
                Particle_8 = Particle_8_1;
            },
            function (smokeSprite_1_1) {
                smokeSprite_1 = smokeSprite_1_1;
            }
        ],
        execute: function () {
            Smoke = class Smoke extends Particle_8.Particle {
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
                        const newPositions = Vector2_53.Vector2.directions
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
            exports_146("Smoke", Smoke);
            Smoke.ParticleType = "smoke";
        }
    };
});
System.register("world/objects/campfire", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "world/objects/particles/Smoke", "engine/math/Colors"], function (exports_147, context_147) {
    "use strict";
    var ObjectPhysics_19, Vector2_54, Sprite_21, Object2D_28, Smoke_1, Colors_23, _position, Campfire;
    var __moduleName = context_147 && context_147.id;
    return {
        setters: [
            function (ObjectPhysics_19_1) {
                ObjectPhysics_19 = ObjectPhysics_19_1;
            },
            function (Vector2_54_1) {
                Vector2_54 = Vector2_54_1;
            },
            function (Sprite_21_1) {
                Sprite_21 = Sprite_21_1;
            },
            function (Object2D_28_1) {
                Object2D_28 = Object2D_28_1;
            },
            function (Smoke_1_1) {
                Smoke_1 = Smoke_1_1;
            },
            function (Colors_23_1) {
                Colors_23 = Colors_23_1;
            }
        ],
        execute: function () {
            _position = new Vector2_54.Vector2();
            Campfire = class Campfire extends Object2D_28.Object2D {
                constructor(position) {
                    const sprite = Sprite_21.Sprite.parseSimple('🔥💨');
                    sprite.frames["0"][0].color(Colors_23.Colors.Red);
                    const firePhysics = new ObjectPhysics_19.ObjectPhysics().light("F").temperature("F");
                    const smokePhysics = new ObjectPhysics_19.ObjectPhysics().light("6").temperature("8");
                    super(Vector2_54.Vector2.zero, sprite.frames["0"][0], firePhysics, position);
                    this.smokeTicks = 0;
                    this._sprite = sprite;
                    this.firePhysics = firePhysics;
                    this.smokePhysics = smokePhysics;
                    this.type = "campfire";
                }
                update(ticks) {
                    super.update(ticks);
                    const position = this.getWorldPosition(_position);
                    const weatherInfo = this.scene.weather.getWeatherInfoAt(position);
                    const positionWeather = weatherInfo.weatherType;
                    const isRainyWeather = positionWeather in ["rain", "rain_and_snow"];
                    if (isRainyWeather) {
                        this.skin = this._sprite.frames["1"][0];
                        this.physics = this.smokePhysics;
                    }
                    else {
                        this.skin = this._sprite.frames["0"][0];
                        this.physics = this.firePhysics;
                        this.smokeTicks = Object2D_28.Object2D.updateValue(this.smokeTicks, ticks, 2000, () => {
                            const smokePosition = position.clone();
                            const smoke = new Smoke_1.Smoke(smokePosition);
                            const _ = this.scene.particlesObject.tryAddParticle(smoke);
                        });
                    }
                }
            };
            exports_147("Campfire", Campfire);
        }
    };
});
System.register("world/objects/mushroom", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Color"], function (exports_148, context_148) {
    "use strict";
    var Object2D_29, ObjectSkin_24, ObjectPhysics_20, Vector2_55, Color_19, mushroom;
    var __moduleName = context_148 && context_148.id;
    return {
        setters: [
            function (Object2D_29_1) {
                Object2D_29 = Object2D_29_1;
            },
            function (ObjectSkin_24_1) {
                ObjectSkin_24 = ObjectSkin_24_1;
            },
            function (ObjectPhysics_20_1) {
                ObjectPhysics_20 = ObjectPhysics_20_1;
            },
            function (Vector2_55_1) {
                Vector2_55 = Vector2_55_1;
            },
            function (Color_19_1) {
                Color_19 = Color_19_1;
            }
        ],
        execute: function () {
            exports_148("mushroom", mushroom = (options) => {
                const physics = new ObjectPhysics_20.ObjectPhysics().light({ intensity: 8, color: new Color_19.Color(1, 1, 0), position: new Vector2_55.Vector2() });
                const object = new Object2D_29.Object2D(Vector2_55.Vector2.zero, new ObjectSkin_24.ObjectSkin().char(`🍄`), physics, Vector2_55.Vector2.from(options.position));
                return object;
            });
        }
    };
});
System.register("world/levels/dungeon", ["engine/Level", "world/objects/portal", "world/objects/campfire", "world/objects/house", "engine/data/Tiles", "world/objects/mushroom", "engine/math/Grid", "utils/math", "engine/math/Vector2"], function (exports_149, context_149) {
    "use strict";
    var Level_5, portal_4, campfire_1, house_2, Tiles_4, mushroom_1, Grid_11, math_9, Vector2_56, walls, campfires, mushrooms, portals, objects, level, dungeonLevel;
    var __moduleName = context_149 && context_149.id;
    return {
        setters: [
            function (Level_5_1) {
                Level_5 = Level_5_1;
            },
            function (portal_4_1) {
                portal_4 = portal_4_1;
            },
            function (campfire_1_1) {
                campfire_1 = campfire_1_1;
            },
            function (house_2_1) {
                house_2 = house_2_1;
            },
            function (Tiles_4_1) {
                Tiles_4 = Tiles_4_1;
            },
            function (mushroom_1_1) {
                mushroom_1 = mushroom_1_1;
            },
            function (Grid_11_1) {
                Grid_11 = Grid_11_1;
            },
            function (math_9_1) {
                math_9 = math_9_1;
            },
            function (Vector2_56_1) {
                Vector2_56 = Vector2_56_1;
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
                new campfire_1.Campfire(new Vector2_56.Vector2(3, 3)),
                new campfire_1.Campfire(new Vector2_56.Vector2(10, 13)),
            ];
            mushrooms = [
                mushroom_1.mushroom({ position: [3, 12] }),
            ];
            portals = [
                portal_4.portal('dungeon', { position: [2, 2] }),
            ];
            objects = [...walls, ...portals, ...campfires, ...mushrooms];
            level = new Level_5.Level('dungeon', objects, Tiles_4.Tiles.createEmptyDefault());
            level.roofHolesLayer = new Grid_11.Grid(level.size).fillValue(false);
            level.roofLayer = new Grid_11.Grid(level.size).fillValue(15);
            if (true) { // add gradient
                level.roofLayer.traverse((_, pos, l) => {
                    const v = 8 + Math.sin(pos.x / 2) * 8;
                    const roofValue = math_9.clamp(Math.round(v), 0, 15);
                    l.setAt(pos, roofValue);
                    if (roofValue === 0) {
                        level.roofHolesLayer.setAt(pos, true);
                    }
                });
            }
            exports_149("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/objects/IceCube", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_150, context_150) {
    "use strict";
    var ObjectPhysics_21, ObjectSkin_25, Vector2_57, Object2D_30, IceCube;
    var __moduleName = context_150 && context_150.id;
    return {
        setters: [
            function (ObjectPhysics_21_1) {
                ObjectPhysics_21 = ObjectPhysics_21_1;
            },
            function (ObjectSkin_25_1) {
                ObjectSkin_25 = ObjectSkin_25_1;
            },
            function (Vector2_57_1) {
                Vector2_57 = Vector2_57_1;
            },
            function (Object2D_30_1) {
                Object2D_30 = Object2D_30_1;
            }
        ],
        execute: function () {
            IceCube = class IceCube extends Object2D_30.Object2D {
                constructor() {
                    super(Vector2_57.Vector2.zero, new ObjectSkin_25.ObjectSkin().char('🧊'), new ObjectPhysics_21.ObjectPhysics().temperature('0'), Vector2_57.Vector2.zero);
                    this.type = "ice_cube";
                }
            };
            exports_150("IceCube", IceCube);
        }
    };
});
System.register("world/behaviors/HunterBehavior", ["engine/objects/Object2D", "utils/math"], function (exports_151, context_151) {
    "use strict";
    var Object2D_31, math_10, HunterBehavior;
    var __moduleName = context_151 && context_151.id;
    return {
        setters: [
            function (Object2D_31_1) {
                Object2D_31 = Object2D_31_1;
            },
            function (math_10_1) {
                math_10 = math_10_1;
            }
        ],
        execute: function () {
            HunterBehavior = class HunterBehavior {
                constructor(options) {
                    this.options = options;
                    this.hungerTicks = 0;
                    this.hunger = 3;
                }
                update(ticks, object) {
                    var _a;
                    const scene = object.scene;
                    this.hungerTicks = Object2D_31.Object2D.updateValue(this.hungerTicks, ticks, 2000, () => {
                        this.hunger += 1;
                    });
                    //
                    if (this.hunger >= 3) {
                        const sightLightLevel = object.calculateSightLightLevel();
                        const preyList = object.getObjectsNearby(scene, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.preyRadius) || 6, x => this.options.preyTypes.includes(x.type))
                            .map(x => x)
                            .filter(isPreyVisible);
                        if (!preyList.length) {
                            this.target = undefined;
                        }
                        else if (!this.target) {
                            this.target = preyList[0];
                        }
                        function isPreyVisible(prey) {
                            var _a, _b;
                            const cloakLightLevel = prey.cloakLightLevel;
                            const lightLevel = (_b = (_a = scene.lights.getLightInfoAt(prey.position)) === null || _a === void 0 ? void 0 : _a.intensity) !== null && _b !== void 0 ? _b : 0;
                            return sightLightLevel >= math_10.clamp(cloakLightLevel - lightLevel, 0, 15);
                        }
                    }
                }
                act(ticks, object) {
                    if (!this.target) {
                        return;
                    }
                    if (object.distanceTo(this.target) <= 1.0) {
                        object.attack(this.target);
                    }
                    object.approach(this.target);
                }
                handleEvent(ev, object) {
                }
            };
            exports_151("HunterBehavior", HunterBehavior);
        }
    };
});
System.register("world/behaviors/FearBehavior", ["utils/math"], function (exports_152, context_152) {
    "use strict";
    var math_11, FearBehavior;
    var __moduleName = context_152 && context_152.id;
    return {
        setters: [
            function (math_11_1) {
                math_11 = math_11_1;
            }
        ],
        execute: function () {
            FearBehavior = class FearBehavior {
                constructor(options) {
                    this.options = options;
                    this.enemies = [];
                    this.fearedFriends = [];
                }
                update(ticks, object) {
                    var _a, _b;
                    const scene = object.scene;
                    const friendTypes = this.options.friendTypes;
                    const sightLightLevel = object.calculateSightLightLevel();
                    this.enemies = object.getMobsNearby(scene, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.enemiesRadius) || 5, x => {
                        if (typeof friendTypes !== "undefined" && friendTypes) {
                            return !friendTypes.includes(x.type);
                        }
                        return this.options.enemyTypes.includes(x.type);
                    })
                        .map(x => x)
                        .filter(isEnemyVisible);
                    if (friendTypes) {
                        this.fearedFriends = object.getMobsNearby(scene, ((_b = this.options) === null || _b === void 0 ? void 0 : _b.friendsRadius) || 2, x => {
                            return (friendTypes.includes(x.type) &&
                                (x.parameters["stress"] | 0) > 0);
                        });
                    }
                    function isEnemyVisible(prey) {
                        var _a, _b;
                        const cloakLightLevel = prey.cloakLightLevel;
                        const lightLevel = (_b = (_a = scene.lights.getLightInfoAt(prey.position)) === null || _a === void 0 ? void 0 : _a.intensity) !== null && _b !== void 0 ? _b : 0;
                        return sightLightLevel >= math_11.clamp(cloakLightLevel - lightLevel, 0, 15);
                    }
                }
                act(ticks, object) {
                    object.runAway(this.enemies);
                }
                handleEvent(ev, object) {
                }
            };
            exports_152("FearBehavior", FearBehavior);
        }
    };
});
System.register("world/npcs/wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/HunterBehavior", "engine/objects/NpcMovementOptions", "engine/math/Vector2", "world/behaviors/FearBehavior", "world/behaviors/WanderingBehavior", "world/events/DeathGameEvent", "engine/math/Colors", "engine/math/Color"], function (exports_153, context_153) {
    "use strict";
    var Npc_6, ObjectSkin_26, HunterBehavior_1, NpcMovementOptions_3, Vector2_58, FearBehavior_1, WanderingBehavior_2, DeathGameEvent_2, Colors_24, Color_20, Wolf;
    var __moduleName = context_153 && context_153.id;
    function wolf(options) {
        const position = Vector2_58.Vector2.from(options.position);
        return new Wolf().translateX(position.x).translateY(position.y);
    }
    exports_153("wolf", wolf);
    return {
        setters: [
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            },
            function (ObjectSkin_26_1) {
                ObjectSkin_26 = ObjectSkin_26_1;
            },
            function (HunterBehavior_1_1) {
                HunterBehavior_1 = HunterBehavior_1_1;
            },
            function (NpcMovementOptions_3_1) {
                NpcMovementOptions_3 = NpcMovementOptions_3_1;
            },
            function (Vector2_58_1) {
                Vector2_58 = Vector2_58_1;
            },
            function (FearBehavior_1_1) {
                FearBehavior_1 = FearBehavior_1_1;
            },
            function (WanderingBehavior_2_1) {
                WanderingBehavior_2 = WanderingBehavior_2_1;
            },
            function (DeathGameEvent_2_1) {
                DeathGameEvent_2 = DeathGameEvent_2_1;
            },
            function (Colors_24_1) {
                Colors_24 = Colors_24_1;
            },
            function (Color_20_1) {
                Color_20 = Color_20_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_6.Npc {
                constructor() {
                    super(new ObjectSkin_26.ObjectSkin().char(`🐺`));
                    this.state = "still";
                    this.type = "wolf";
                    this.defaultDamageType = "slash";
                    this.maxHealth = 10;
                    this.health = 5;
                    this.movementOptions = {
                        ...NpcMovementOptions_3.defaultMovementOptions.walking,
                        walkingSpeed: 5,
                    };
                    this.hunter = new HunterBehavior_1.HunterBehavior({
                        preyTypes: ['sheep', 'human'],
                    });
                    this.fear = new FearBehavior_1.FearBehavior({
                        enemyTypes: ['campfire'],
                    });
                    this.wanderer = new WanderingBehavior_2.WanderingBehavior();
                    this.behaviors.push(...[this.hunter, this.fear, this.wanderer]);
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    if (this.fear.enemies.length > 0) {
                        this.fear.act(ticks, this);
                        this.state = "feared";
                    }
                    else if (this.hunter.target) {
                        this.hunter.act(ticks, this);
                        this.state = "hunting";
                    }
                    else if (this.hunter.hunger > 3) {
                        this.wanderer.act(ticks, this);
                        this.state = "wandering";
                    }
                    else {
                        this.state = "still";
                    }
                }
                onBeforeRender(renderer, scene, camera) {
                    super.onBeforeRender(renderer, scene, camera);
                    if (this.state === "feared") {
                        this.skin.background(new Color_20.Color(Colors_24.Colors.DarkRed).setAlpha(0x55 / 0xff));
                    }
                    else if (this.state === "hunting") {
                        this.skin.background(Colors_24.Colors.Violet);
                    }
                    else if (this.state === "wandering") {
                        this.skin.background(Colors_24.Colors.Yellow);
                    }
                    else {
                        this.skin.background(Colors_24.Colors.Transparent);
                    }
                }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === DeathGameEvent_2.DeathGameEvent.type) {
                        const args = ev.args;
                        if (args.object === this.hunter.target) {
                            this.hunter.target = undefined;
                            if (args.by === this) {
                                // TODO: use loot for this.
                                this.hunter.hunger = 0;
                            }
                        }
                    }
                }
            };
            exports_153("Wolf", Wolf);
            ;
        }
    };
});
System.register("world/levels/effectsLevel", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/objects/campfire", "engine/math/Vector2", "world/tiles", "world/objects/IceCube", "world/hero", "engine/effects/DamageEffect", "world/npcs/wolf"], function (exports_154, context_154) {
    "use strict";
    var Level_6, portal_5, Tiles_5, campfire_2, Vector2_59, tiles_3, IceCube_1, hero_1, DamageEffect_6, wolf_1, fences, fires, portals, wolfs, objects, levelTiles, effectsLevel;
    var __moduleName = context_154 && context_154.id;
    return {
        setters: [
            function (Level_6_1) {
                Level_6 = Level_6_1;
            },
            function (portal_5_1) {
                portal_5 = portal_5_1;
            },
            function (Tiles_5_1) {
                Tiles_5 = Tiles_5_1;
            },
            function (campfire_2_1) {
                campfire_2 = campfire_2_1;
            },
            function (Vector2_59_1) {
                Vector2_59 = Vector2_59_1;
            },
            function (tiles_3_1) {
                tiles_3 = tiles_3_1;
            },
            function (IceCube_1_1) {
                IceCube_1 = IceCube_1_1;
            },
            function (hero_1_1) {
                hero_1 = hero_1_1;
            },
            function (DamageEffect_6_1) {
                DamageEffect_6 = DamageEffect_6_1;
            },
            function (wolf_1_1) {
                wolf_1 = wolf_1_1;
            }
        ],
        execute: function () {
            fences = [];
            fires = [
                new campfire_2.Campfire(new Vector2_59.Vector2(10, 10)),
                new campfire_2.Campfire(new Vector2_59.Vector2(5, 20)),
                new IceCube_1.IceCube().translateX(4).translateY(6),
            ];
            portals = [
                portal_5.portal('effects_level', { position: [2, 2] }),
            ];
            wolfs = [
                new wolf_1.Wolf().translateX(5).translateY(2),
                new wolf_1.Wolf().translateX(2).translateY(5),
            ];
            objects = [...fences, ...portals, ...fires, ...wolfs];
            levelTiles = Tiles_5.Tiles.parseTiles(`                                 
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
    L   ssssswWWWWWWWWWWWwwwwwww     
   LLL     sssswwwwwwwwwsss          
     L       sswwwwwwwss             
              ssswwwwss              
               sswwwwsss             
                ssssssssss           
                                     
                                     
                                     `, {
                'M': tiles_3.tiles.mountain,
                'w': tiles_3.tiles.water,
                'W': tiles_3.tiles.water_deep,
                's': tiles_3.tiles.sand,
                'L': tiles_3.tiles.lava,
            });
            exports_154("effectsLevel", effectsLevel = new class extends Level_6.Level {
                constructor() {
                    super('effects', objects, levelTiles);
                    this.weather.wind = new Vector2_59.Vector2(1, 1);
                }
                onLoaded() {
                    super.onLoaded();
                    this.weather.changeWeather("rain");
                    const poisonActiveEffect = new DamageEffect_6.PoisonDamageEffect().activate(this);
                    hero_1.hero.addActiveEffect(poisonActiveEffect);
                }
            }());
        }
    };
});
System.register("world/npcs/bee", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions", "engine/math/Vector2", "engine/math/Colors"], function (exports_155, context_155) {
    "use strict";
    var Npc_7, ObjectSkin_27, WanderingBehavior_3, NpcMovementOptions_4, Vector2_60, Colors_25, Bee;
    var __moduleName = context_155 && context_155.id;
    function bee(options) {
        return new Bee(Vector2_60.Vector2.from(options.position));
    }
    exports_155("bee", bee);
    return {
        setters: [
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            },
            function (ObjectSkin_27_1) {
                ObjectSkin_27 = ObjectSkin_27_1;
            },
            function (WanderingBehavior_3_1) {
                WanderingBehavior_3 = WanderingBehavior_3_1;
            },
            function (NpcMovementOptions_4_1) {
                NpcMovementOptions_4 = NpcMovementOptions_4_1;
            },
            function (Vector2_60_1) {
                Vector2_60 = Vector2_60_1;
            },
            function (Colors_25_1) {
                Colors_25 = Colors_25_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_7.Npc {
                constructor(position) {
                    super(new ObjectSkin_27.ObjectSkin().char(`🐝`).color(Colors_25.Colors.Yellow), position);
                    this.type = "bee";
                    this.realm = "sky";
                    this.movementOptions = NpcMovementOptions_4.defaultMovementOptions.flying;
                    this.behaviors.push(new WanderingBehavior_3.WanderingBehavior());
                }
            };
            exports_155("Bee", Bee);
        }
    };
});
System.register("world/behaviors/PreyGroupBehavior", ["world/behaviors/WanderingBehavior", "world/behaviors/FearBehavior"], function (exports_156, context_156) {
    "use strict";
    var WanderingBehavior_4, FearBehavior_2, PreyGroupBehavior;
    var __moduleName = context_156 && context_156.id;
    return {
        setters: [
            function (WanderingBehavior_4_1) {
                WanderingBehavior_4 = WanderingBehavior_4_1;
            },
            function (FearBehavior_2_1) {
                FearBehavior_2 = FearBehavior_2_1;
            }
        ],
        execute: function () {
            PreyGroupBehavior = class PreyGroupBehavior {
                constructor(options) {
                    this.options = options;
                    this.state = "still";
                    this.stress = 0;
                    this.fear = new FearBehavior_2.FearBehavior({
                        enemyTypes: [],
                        friendTypes: options.friendTypes,
                        enemiesRadius: options.enemiesRadius,
                    });
                    this.wander = new WanderingBehavior_4.WanderingBehavior();
                }
                update(ticks, object) {
                    this.fear.update(ticks, object);
                    this.wander.update(ticks, object);
                    const { enemies, stress } = this.getEnemiesAndStress();
                    if (stress === 0) {
                        this.wander.act(ticks, object);
                    }
                    else {
                        object.runAway(enemies);
                    }
                    this.stress = stress;
                    if (stress === 3) {
                        this.state = "feared";
                    }
                    else if (stress === 0) {
                        this.state = "wandering";
                    }
                    else {
                        this.state = "feared_2";
                    }
                    object.parameters['stress'] = stress;
                }
                getEnemiesAndStress() {
                    if (this.fear.enemies.length) {
                        return { enemies: this.fear.enemies, stress: 3 };
                    }
                    if (this.fear.fearedFriends.length) {
                        const sheepsStress = Math.max(...this.fear.fearedFriends.map(x => x.parameters["stress"] | 0));
                        const stress = sheepsStress - 1;
                        if (this.stress > 0) {
                            const enemies = this.fear.fearedFriends[0].parameters["enemies"] || this.fear.fearedFriends;
                            return { enemies, stress };
                        }
                    }
                    return { enemies: [], stress: 0 };
                }
                act(ticks, object) {
                }
                handleEvent(ev, object) {
                }
            };
            exports_156("PreyGroupBehavior", PreyGroupBehavior);
        }
    };
});
System.register("world/npcs/duck", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/math/Vector2", "engine/math/Colors", "engine/math/Color"], function (exports_157, context_157) {
    "use strict";
    var Npc_8, ObjectSkin_28, PreyGroupBehavior_1, Vector2_61, Colors_26, Color_21, Duck;
    var __moduleName = context_157 && context_157.id;
    function duck(options) {
        return new Duck(Vector2_61.Vector2.from(options.position));
    }
    exports_157("duck", duck);
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_28_1) {
                ObjectSkin_28 = ObjectSkin_28_1;
            },
            function (PreyGroupBehavior_1_1) {
                PreyGroupBehavior_1 = PreyGroupBehavior_1_1;
            },
            function (Vector2_61_1) {
                Vector2_61 = Vector2_61_1;
            },
            function (Colors_26_1) {
                Colors_26 = Colors_26_1;
            },
            function (Color_21_1) {
                Color_21 = Color_21_1;
            }
        ],
        execute: function () {
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_8.Npc {
                constructor(position) {
                    super(new ObjectSkin_28.ObjectSkin().char(`🦆`), position);
                    this.type = "duck";
                    this.movementOptions = {
                        walkingSpeed: 2,
                        swimmingSpeed: 5,
                    };
                    this.behaviors.push(new PreyGroupBehavior_1.PreyGroupBehavior({ friendTypes: [this.type] }));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const duck = this;
                    //
                    if (duck.parameters["state"] === "feared") {
                        duck.skin.background(new Color_21.Color(Colors_26.Colors.Red).setAlpha(0x55 / 0xff));
                    }
                    else if (duck.parameters["stress"] > 1) {
                        duck.skin.background(new Color_21.Color(Colors_26.Colors.Orange).setAlpha(0x55 / 0xff));
                    }
                    else if (duck.parameters["stress"] > 0) {
                        duck.skin.background(new Color_21.Color(Colors_26.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        duck.skin.background(Colors_26.Colors.Transparent);
                    }
                }
            };
        }
    };
});
System.register("world/npcs/sheep", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior", "engine/math/Vector2", "engine/math/Colors", "engine/math/Color"], function (exports_158, context_158) {
    "use strict";
    var Npc_9, ObjectSkin_29, PreyGroupBehavior_2, Vector2_62, Colors_27, Color_22, Sheep;
    var __moduleName = context_158 && context_158.id;
    function sheep(options) {
        return new Sheep(Vector2_62.Vector2.from(options.position));
    }
    exports_158("sheep", sheep);
    return {
        setters: [
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (ObjectSkin_29_1) {
                ObjectSkin_29 = ObjectSkin_29_1;
            },
            function (PreyGroupBehavior_2_1) {
                PreyGroupBehavior_2 = PreyGroupBehavior_2_1;
            },
            function (Vector2_62_1) {
                Vector2_62 = Vector2_62_1;
            },
            function (Colors_27_1) {
                Colors_27 = Colors_27_1;
            },
            function (Color_22_1) {
                Color_22 = Color_22_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_9.Npc {
                constructor(position) {
                    super(new ObjectSkin_29.ObjectSkin().char(`🐑`), position);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                    this.behaviors.push(new PreyGroupBehavior_2.PreyGroupBehavior({ friendTypes: [this.type] }));
                }
                update(ticks) {
                    super.update(ticks);
                    //
                    const sheep = this;
                    //
                    // update skin
                    if (sheep.parameters["state"] === "feared") {
                        sheep.skin.background(new Color_22.Color(Colors_27.Colors.Red).setAlpha(0x55 / 0xff));
                    }
                    else if (sheep.parameters["stress"] > 1) {
                        sheep.skin.background(new Color_22.Color(Colors_27.Colors.Orange).setAlpha(0x55 / 0xff));
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        sheep.skin.background(new Color_22.Color(Colors_27.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        sheep.skin.background(Colors_27.Colors.Transparent);
                    }
                }
            };
        }
    };
});
System.register("world/objects/bamboo", ["engine/components/ObjectPhysics", "engine/data/ObjectSkinBuilder", "engine/math/Vector2", "engine/events/EventLoop", "engine/objects/Object2D", "world/events/RemoveObjectGameEvent", "world/events/TransferItemsGameEvent", "world/items", "engine/math/Color", "engine/math/Colors"], function (exports_159, context_159) {
    "use strict";
    var ObjectPhysics_22, ObjectSkinBuilder_5, Vector2_63, EventLoop_7, Object2D_32, RemoveObjectGameEvent_2, TransferItemsGameEvent_2, items_4, Color_23, Colors_28;
    var __moduleName = context_159 && context_159.id;
    function bamboo(options) {
        const origin = new Vector2_63.Vector2(0, 5);
        const object = new Object2D_32.Object2D(origin, new ObjectSkinBuilder_5.ObjectSkinBuilder(`▄
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
            'T': [Color_23.Color.fromHexString('#99bc20'), Colors_28.Colors.Transparent],
            'L': [Color_23.Color.fromHexString('#517201'), Colors_28.Colors.Transparent],
            'H': [Color_23.Color.fromHexString('#394902'), Colors_28.Colors.Transparent],
            'D': [Color_23.Color.fromHexString('#574512'), Colors_28.Colors.Transparent],
        }).build(), new ObjectPhysics_22.ObjectPhysics().collision(origin), Vector2_63.Vector2.from(options.position));
        object.type = "bamboo";
        // TODO: only using an axe.
        object.setAction({
            position: origin,
            action: ctx => {
                EventLoop_7.emitEvent(RemoveObjectGameEvent_2.RemoveObjectGameEvent.create(ctx.obj));
                EventLoop_7.emitEvent(TransferItemsGameEvent_2.TransferItemsGameEvent.create(ctx.initiator, [items_4.bambooSeed()]));
            }
        });
        return object;
    }
    exports_159("bamboo", bamboo);
    return {
        setters: [
            function (ObjectPhysics_22_1) {
                ObjectPhysics_22 = ObjectPhysics_22_1;
            },
            function (ObjectSkinBuilder_5_1) {
                ObjectSkinBuilder_5 = ObjectSkinBuilder_5_1;
            },
            function (Vector2_63_1) {
                Vector2_63 = Vector2_63_1;
            },
            function (EventLoop_7_1) {
                EventLoop_7 = EventLoop_7_1;
            },
            function (Object2D_32_1) {
                Object2D_32 = Object2D_32_1;
            },
            function (RemoveObjectGameEvent_2_1) {
                RemoveObjectGameEvent_2 = RemoveObjectGameEvent_2_1;
            },
            function (TransferItemsGameEvent_2_1) {
                TransferItemsGameEvent_2 = TransferItemsGameEvent_2_1;
            },
            function (items_4_1) {
                items_4 = items_4_1;
            },
            function (Color_23_1) {
                Color_23 = Color_23_1;
            },
            function (Colors_28_1) {
                Colors_28 = Colors_28_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_160, context_160) {
    "use strict";
    var Sprite_22, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_160 && context_160.id;
    return {
        setters: [
            function (Sprite_22_1) {
                Sprite_22 = Sprite_22_1;
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
color:H,#533009,#0000

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
            exports_160("sakuraSprite", sakuraSprite = Sprite_22.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/sakuraTree", ["engine/components/ObjectPhysics", "engine/math/Vector2", "world/sprites/sakura", "world/objects/Tree"], function (exports_161, context_161) {
    "use strict";
    var ObjectPhysics_23, Vector2_64, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_161 && context_161.id;
    function sakuraTree(options) {
        return new SakuraTree(Vector2_64.Vector2.from(options.position));
    }
    exports_161("sakuraTree", sakuraTree);
    return {
        setters: [
            function (ObjectPhysics_23_1) {
                ObjectPhysics_23 = ObjectPhysics_23_1;
            },
            function (Vector2_64_1) {
                Vector2_64 = Vector2_64_1;
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
                    const origin = new Vector2_64.Vector2(2, 3);
                    super(origin, sakura_1.sakuraSprite, new ObjectPhysics_23.ObjectPhysics().collision(origin), position);
                }
            };
        }
    };
});
System.register("world/objects/beehive", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "world/items", "world/actions", "engine/math/Vector2", "engine/math/Colors"], function (exports_162, context_162) {
    "use strict";
    var Object2D_33, ObjectSkin_30, ObjectPhysics_24, items_5, actions_2, Vector2_65, Colors_29;
    var __moduleName = context_162 && context_162.id;
    function beehive(options) {
        const obj = new Object2D_33.Object2D(Vector2_65.Vector2.zero, new ObjectSkin_30.ObjectSkin().char(`☷`).color(Colors_29.Colors.Black).background(Colors_29.Colors.Orange), new ObjectPhysics_24.ObjectPhysics().collision(), Vector2_65.Vector2.from(options.position));
        obj.inventory.addItems([items_5.honeyPot()]);
        obj.setAction(actions_2.storageAction(obj));
        return obj;
    }
    exports_162("beehive", beehive);
    return {
        setters: [
            function (Object2D_33_1) {
                Object2D_33 = Object2D_33_1;
            },
            function (ObjectSkin_30_1) {
                ObjectSkin_30 = ObjectSkin_30_1;
            },
            function (ObjectPhysics_24_1) {
                ObjectPhysics_24 = ObjectPhysics_24_1;
            },
            function (items_5_1) {
                items_5 = items_5_1;
            },
            function (actions_2_1) {
                actions_2 = actions_2_1;
            },
            function (Vector2_65_1) {
                Vector2_65 = Vector2_65_1;
            },
            function (Colors_29_1) {
                Colors_29 = Colors_29_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/ggj2020demo/objects/pillar", ["engine/components/ObjectPhysics", "engine/data/ObjectSkinBuilder", "engine/math/Colors", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_163, context_163) {
    "use strict";
    var ObjectPhysics_25, ObjectSkinBuilder_6, Colors_30, Vector2_66, Object2D_34, pillar;
    var __moduleName = context_163 && context_163.id;
    return {
        setters: [
            function (ObjectPhysics_25_1) {
                ObjectPhysics_25 = ObjectPhysics_25_1;
            },
            function (ObjectSkinBuilder_6_1) {
                ObjectSkinBuilder_6 = ObjectSkinBuilder_6_1;
            },
            function (Colors_30_1) {
                Colors_30 = Colors_30_1;
            },
            function (Vector2_66_1) {
                Vector2_66 = Vector2_66_1;
            },
            function (Object2D_34_1) {
                Object2D_34 = Object2D_34_1;
            }
        ],
        execute: function () {
            exports_163("pillar", pillar = (options) => {
                const origin = new Vector2_66.Vector2(0, 3);
                const skin = new ObjectSkinBuilder_6.ObjectSkinBuilder(`
▄
█
█
▓`, `
L
H
H
B
`, {
                    'L': [Colors_30.Colors.Yellow, Colors_30.Colors.Transparent],
                    'H': [Colors_30.Colors.White, Colors_30.Colors.Transparent],
                    'B': [Colors_30.Colors.Gray, Colors_30.Colors.Transparent],
                })
                    .build();
                const physics = new ObjectPhysics_25.ObjectPhysics().collision(origin);
                return new Object2D_34.Object2D(origin, skin, physics, Vector2_66.Vector2.from(options.position));
            });
        }
    };
});
System.register("world/levels/ggj2020demo/objects/shop", ["engine/data/ObjectPhysicsBuilder", "engine/data/ObjectSkinBuilder", "engine/math/Colors", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_164, context_164) {
    "use strict";
    var ObjectPhysicsBuilder_2, ObjectSkinBuilder_7, Colors_31, Vector2_67, Object2D_35, shop;
    var __moduleName = context_164 && context_164.id;
    return {
        setters: [
            function (ObjectPhysicsBuilder_2_1) {
                ObjectPhysicsBuilder_2 = ObjectPhysicsBuilder_2_1;
            },
            function (ObjectSkinBuilder_7_1) {
                ObjectSkinBuilder_7 = ObjectSkinBuilder_7_1;
            },
            function (Colors_31_1) {
                Colors_31 = Colors_31_1;
            },
            function (Vector2_67_1) {
                Vector2_67 = Vector2_67_1;
            },
            function (Object2D_35_1) {
                Object2D_35 = Object2D_35_1;
            }
        ],
        execute: function () {
            exports_164("shop", shop = (options) => new Object2D_35.Object2D(new Vector2_67.Vector2(2, 3), new ObjectSkinBuilder_7.ObjectSkinBuilder(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': [Colors_31.Colors.LightGray, Colors_31.Colors.Brown],
                'H': [Colors_31.Colors.Gray, Colors_31.Colors.Transparent],
                'B': [Colors_31.Colors.Brown, Colors_31.Colors.Transparent],
                'T': [Colors_31.Colors.Orange, Colors_31.Colors.Brown],
            }).build(), new ObjectPhysicsBuilder_2.ObjectPhysicsBuilder(`       
       
 ..... `).build(), Vector2_67.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/arc", ["engine/data/ObjectPhysicsBuilder", "engine/data/ObjectSkinBuilder", "engine/math/Colors", "engine/math/Vector2", "engine/objects/Object2D"], function (exports_165, context_165) {
    "use strict";
    var ObjectPhysicsBuilder_3, ObjectSkinBuilder_8, Colors_32, Vector2_68, Object2D_36, arc;
    var __moduleName = context_165 && context_165.id;
    return {
        setters: [
            function (ObjectPhysicsBuilder_3_1) {
                ObjectPhysicsBuilder_3 = ObjectPhysicsBuilder_3_1;
            },
            function (ObjectSkinBuilder_8_1) {
                ObjectSkinBuilder_8 = ObjectSkinBuilder_8_1;
            },
            function (Colors_32_1) {
                Colors_32 = Colors_32_1;
            },
            function (Vector2_68_1) {
                Vector2_68 = Vector2_68_1;
            },
            function (Object2D_36_1) {
                Object2D_36 = Object2D_36_1;
            }
        ],
        execute: function () {
            exports_165("arc", arc = (options) => new Object2D_36.Object2D(new Vector2_68.Vector2(2, 3), new ObjectSkinBuilder_8.ObjectSkinBuilder(`
▟▄▄▄▙
█   █
█   █
█   █
`, `
LLLLL
H   H
H   H
B   B`, {
                'L': [Colors_32.Colors.Orange, Colors_32.Colors.Brown],
                'H': [Colors_32.Colors.White, Colors_32.Colors.Transparent],
                'B': [Colors_32.Colors.Gray, Colors_32.Colors.Transparent],
            }).build(), new ObjectPhysicsBuilder_3.ObjectPhysicsBuilder(`
          
     
     
.   .
`).build().collision(), Vector2_68.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/data/Tiles", "world/tiles"], function (exports_166, context_166) {
    "use strict";
    var Tiles_6, tiles_4, levelTiles;
    var __moduleName = context_166 && context_166.id;
    return {
        setters: [
            function (Tiles_6_1) {
                Tiles_6 = Tiles_6_1;
            },
            function (tiles_4_1) {
                tiles_4 = tiles_4_1;
            }
        ],
        execute: function () {
            exports_166("levelTiles", levelTiles = Tiles_6.Tiles.parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
                'g': tiles_4.tiles.grass,
                'G': tiles_4.tiles.grass_tall,
                'w': tiles_4.tiles.water,
                'W': tiles_4.tiles.water_deep,
                'b': tiles_4.tiles.bridge_stone,
                'B': tiles_4.tiles.bridge_stone_dark,
                's': tiles_4.tiles.sand,
            }));
        }
    };
});
System.register("world/levels/ggj2020demo/level", ["engine/Level", "world/npcs/bee", "world/npcs/duck", "world/npcs/sheep", "world/objects/lamp", "world/objects/house", "world/objects/bamboo", "world/objects/pineTree", "world/objects/sakuraTree", "world/objects/beehive", "world/objects/natural", "world/levels/ggj2020demo/objects/pillar", "world/levels/ggj2020demo/objects/shop", "world/levels/ggj2020demo/objects/arc", "world/levels/ggj2020demo/tiles", "world/objects/fence", "world/objects/portal"], function (exports_167, context_167) {
    "use strict";
    var Level_7, bee_1, duck_1, sheep_1, lamp_3, house_3, bamboo_1, pineTree_2, sakuraTree_1, beehive_1, natural_3, pillar_1, shop_1, arc_1, tiles_5, fence_3, portal_6, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, portals, objects, level;
    var __moduleName = context_167 && context_167.id;
    return {
        setters: [
            function (Level_7_1) {
                Level_7 = Level_7_1;
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
            function (lamp_3_1) {
                lamp_3 = lamp_3_1;
            },
            function (house_3_1) {
                house_3 = house_3_1;
            },
            function (bamboo_1_1) {
                bamboo_1 = bamboo_1_1;
            },
            function (pineTree_2_1) {
                pineTree_2 = pineTree_2_1;
            },
            function (sakuraTree_1_1) {
                sakuraTree_1 = sakuraTree_1_1;
            },
            function (beehive_1_1) {
                beehive_1 = beehive_1_1;
            },
            function (natural_3_1) {
                natural_3 = natural_3_1;
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
            function (tiles_5_1) {
                tiles_5 = tiles_5_1;
            },
            function (fence_3_1) {
                fence_3 = fence_3_1;
            },
            function (portal_6_1) {
                portal_6 = portal_6_1;
            }
        ],
        execute: function () {
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < tiles_5.levelTiles.width; x++) {
                    fences.push(fence_3.fence({ position: [x, 0] }));
                    fences.push(fence_3.fence({ position: [x, tiles_5.levelTiles.height - 1] }));
                }
                for (let y = 1; y < tiles_5.levelTiles.height - 1; y++) {
                    fences.push(fence_3.fence({ position: [0, y] }));
                    fences.push(fence_3.fence({ position: [tiles_5.levelTiles.width - 1, y] }));
                }
            }
            extraFences = [
                fence_3.fence({ position: [28, 7] }),
                fence_3.fence({ position: [29, 7] }),
                fence_3.fence({ position: [30, 7] }),
                fence_3.fence({ position: [31, 7] }),
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
            ].map((x) => pineTree_2.pineTree(x));
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
                lamp_3.lamp({ position: [27, 5], isOn: true }),
                lamp_3.lamp({ position: [13, 25], isOn: true }),
                lamp_3.lamp({ position: [15, 3], isOn: true }),
                lamp_3.lamp({ position: [1, 10], isOn: true }),
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
            ].map((x) => natural_3.wheat(x));
            flowers = [
                { position: [7, 4] },
                { position: [37, 5] },
                { position: [46, 4] },
                { position: [44, 7] },
                { position: [34, 3] },
                { position: [37, 3] },
                { position: [38, 1] },
            ].map((x) => natural_3.flower(x));
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
            ].map((x) => natural_3.hotspring(x));
            portals = [
                new portal_6.Portal("ggj2020demo_portal", { position: [2, 2] }),
            ];
            objects = [
                ...fences, ...extraFences,
                ...trees, ...sakuras, ...bamboos,
                ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                ...flowers, ...lamps, ...wheats,
                ...hotsprings,
                ...ducks, ...bees, ...sheepList,
                ...portals,
            ];
            exports_167("level", level = new Level_7.Level('ggj2020demo', objects, tiles_5.levelTiles));
        }
    };
});
System.register("world/levels/house", ["engine/Level", "world/objects/portal", "world/objects/house", "engine/data/Tiles", "world/objects/signals/LightSource", "engine/math/Vector2", "engine/math/Grid", "world/objects/Door", "engine/math/Colors"], function (exports_168, context_168) {
    "use strict";
    var Level_8, portal_7, house_4, Tiles_7, LightSource_2, Vector2_69, Grid_12, Door_2, Colors_33, walls, margin, left, top, levelWidth, levelHeight, width, height, campfires, x, y, lightSources, portals, objects, level, houseLevel;
    var __moduleName = context_168 && context_168.id;
    return {
        setters: [
            function (Level_8_1) {
                Level_8 = Level_8_1;
            },
            function (portal_7_1) {
                portal_7 = portal_7_1;
            },
            function (house_4_1) {
                house_4 = house_4_1;
            },
            function (Tiles_7_1) {
                Tiles_7 = Tiles_7_1;
            },
            function (LightSource_2_1) {
                LightSource_2 = LightSource_2_1;
            },
            function (Vector2_69_1) {
                Vector2_69 = Vector2_69_1;
            },
            function (Grid_12_1) {
                Grid_12 = Grid_12_1;
            },
            function (Door_2_1) {
                Door_2 = Door_2_1;
            },
            function (Colors_33_1) {
                Colors_33 = Colors_33_1;
            }
        ],
        execute: function () {
            walls = [];
            margin = 2;
            left = margin;
            top = margin;
            levelWidth = 21;
            levelHeight = 20;
            width = levelWidth - margin * 2;
            height = levelHeight - margin * 2;
            if (true) { // add border walls
                for (let x = 0; x < width; x++) {
                    const object = (x < 6 || x > 10) ? house_4.wall : house_4.windowHorizontal;
                    walls.push(object({ position: [margin + x, top] }));
                    walls.push(object({ position: [margin + x, margin + height - 1] }));
                }
                for (let y = 0; y < height; y++) {
                    if (y === 2) {
                        walls.push(Door_2.door({ position: [left, margin + y], isOpened: false }));
                        walls.push(Door_2.door({ position: [margin + width - 1, margin + y], isOpened: false }));
                        continue;
                    }
                    walls.push(house_4.wall({ position: [left, margin + y] }));
                    walls.push(house_4.wall({ position: [margin + width - 1, margin + y] }));
                }
            }
            campfires = [
            //campfire({ position: [10, 13] }),
            ];
            x = 8;
            y = 8;
            lightSources = [
                new LightSource_2.LightSource({ position: [x, y], color: Colors_33.Colors.Red, requiresSignal: false }),
                new LightSource_2.LightSource({ position: [x + 4, y], color: Colors_33.Colors.Green, requiresSignal: false }),
                new LightSource_2.LightSource({ position: [x + 2, y + 3], color: Colors_33.Colors.Blue, requiresSignal: false }),
            ];
            portals = [
                portal_7.portal('house', { position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...portals, ...campfires, ...lightSources];
            level = new Level_8.Level('house', objects, Tiles_7.Tiles.createEmpty(new Vector2_69.Vector2(levelWidth, levelHeight)));
            level.roofHolesLayer = new Grid_12.Grid(level.size).fillValue(true);
            level.roofLayer = new Grid_12.Grid(level.size).fillValue(0);
            if (true) { // add gradient
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        level.roofHolesLayer.setAt(new Vector2_69.Vector2(left + x, top + y), false);
                        level.roofLayer.setAt(new Vector2_69.Vector2(left + x, top + y), 15);
                    }
                }
            }
            exports_168("houseLevel", houseLevel = level);
        }
    };
});
System.register("world/sprites/treeLeaves", ["engine/data/Sprite"], function (exports_169, context_169) {
    "use strict";
    var Sprite_23, treeLeavesSpriteRaw, treeLeavesSprite;
    var __moduleName = context_169 && context_169.id;
    return {
        setters: [
            function (Sprite_23_1) {
                Sprite_23 = Sprite_23_1;
            }
        ],
        execute: function () {
            treeLeavesSpriteRaw = `width:4
height:3
name:
empty:'
color:o,#0c0,#0a0
color:0,#0a0,#080
color:1,#080,#060
color:S,#060,#040
color:H,#533009,#0000

no wind
'░░'
░░░░
░░░░
'oo'
o010
01S1
wind
'▒▒'
▒▒▒▒
▒▒▒▒
'oo'
o010
01S1`;
            exports_169("treeLeavesSprite", treeLeavesSprite = Sprite_23.Sprite.parse(treeLeavesSpriteRaw));
        }
    };
});
System.register("world/objects/TreeLeaves", ["engine/components/ObjectPhysics", "engine/objects/Object2D", "engine/math/Vector2", "world/events/WeatherChangedGameEvent", "world/sprites/treeLeaves"], function (exports_170, context_170) {
    "use strict";
    var ObjectPhysics_26, Object2D_37, Vector2_70, WeatherChangedGameEvent_3, treeLeaves_1, TreeLeaves;
    var __moduleName = context_170 && context_170.id;
    return {
        setters: [
            function (ObjectPhysics_26_1) {
                ObjectPhysics_26 = ObjectPhysics_26_1;
            },
            function (Object2D_37_1) {
                Object2D_37 = Object2D_37_1;
            },
            function (Vector2_70_1) {
                Vector2_70 = Vector2_70_1;
            },
            function (WeatherChangedGameEvent_3_1) {
                WeatherChangedGameEvent_3 = WeatherChangedGameEvent_3_1;
            },
            function (treeLeaves_1_1) {
                treeLeaves_1 = treeLeaves_1_1;
            }
        ],
        execute: function () {
            TreeLeaves = class TreeLeaves extends Object2D_37.Object2D {
                constructor(position) {
                    super(Vector2_70.Vector2.zero, TreeLeaves.sprite.frames["wind"][0], new ObjectPhysics_26.ObjectPhysics(), position);
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
                            this.skin = TreeLeaves.sprite.frames[this.currentFrameName][0];
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
                    else if (ev.type === WeatherChangedGameEvent_3.WeatherChangedGameEvent.type) {
                        const args = ev.args;
                        this.isSnowy = args.to === 'snow';
                    }
                }
            };
            exports_170("TreeLeaves", TreeLeaves);
            TreeLeaves.sprite = treeLeaves_1.treeLeavesSprite;
            ;
        }
    };
});
System.register("world/sprites/hugeTreeTrunkSprite", ["engine/data/Sprite"], function (exports_171, context_171) {
    "use strict";
    var Sprite_24, hugeTreeTrunkSpriteRaw, hugeTreeTrunkSprite;
    var __moduleName = context_171 && context_171.id;
    return {
        setters: [
            function (Sprite_24_1) {
                Sprite_24 = Sprite_24_1;
            }
        ],
        execute: function () {
            hugeTreeTrunkSpriteRaw = `width:9
height:7
name:
empty:'
color:H,#533009,#533009

default
██''''''█
'██'''███
''██'███'
'''████''
'''█████'
'''█████'
''███████
HH''''''H
'HH'''HHH
''HH'HHH'
'''HHHH''
'''HHHHH'
'''HHHHH'
''HHHHHHH`;
            exports_171("hugeTreeTrunkSprite", hugeTreeTrunkSprite = Sprite_24.Sprite.parse(hugeTreeTrunkSpriteRaw));
        }
    };
});
System.register("world/objects/hugeTreeTrunk", ["engine/objects/Object2D", "engine/data/ObjectPhysicsBuilder", "engine/math/Vector2", "world/sprites/hugeTreeTrunkSprite"], function (exports_172, context_172) {
    "use strict";
    var Object2D_38, ObjectPhysicsBuilder_4, Vector2_71, hugeTreeTrunkSprite_1;
    var __moduleName = context_172 && context_172.id;
    function hugeTreeTrunk(options) {
        return new Object2D_38.Object2D(new Vector2_71.Vector2(7, 4), hugeTreeTrunkSprite_1.hugeTreeTrunkSprite.frames["default"][0], new ObjectPhysicsBuilder_4.ObjectPhysicsBuilder(`
         
         
         
         
    ...  
   ..... 
  ... ...
`).build(), Vector2_71.Vector2.from(options.position));
    }
    exports_172("hugeTreeTrunk", hugeTreeTrunk);
    return {
        setters: [
            function (Object2D_38_1) {
                Object2D_38 = Object2D_38_1;
            },
            function (ObjectPhysicsBuilder_4_1) {
                ObjectPhysicsBuilder_4 = ObjectPhysicsBuilder_4_1;
            },
            function (Vector2_71_1) {
                Vector2_71 = Vector2_71_1;
            },
            function (hugeTreeTrunkSprite_1_1) {
                hugeTreeTrunkSprite_1 = hugeTreeTrunkSprite_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/hugeTreeLevel", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/tiles", "world/objects/TreeLeaves", "engine/math/Vector2", "world/objects/hugeTreeTrunk"], function (exports_173, context_173) {
    "use strict";
    var Level_9, portal_8, Tiles_8, tiles_6, TreeLeaves_1, Vector2_72, hugeTreeTrunk_1, origin, positionsMap, positions, leaves, trunkPosition, trunk, portals, objects, levelTiles, level, hugeTreeLevel;
    var __moduleName = context_173 && context_173.id;
    return {
        setters: [
            function (Level_9_1) {
                Level_9 = Level_9_1;
            },
            function (portal_8_1) {
                portal_8 = portal_8_1;
            },
            function (Tiles_8_1) {
                Tiles_8 = Tiles_8_1;
            },
            function (tiles_6_1) {
                tiles_6 = tiles_6_1;
            },
            function (TreeLeaves_1_1) {
                TreeLeaves_1 = TreeLeaves_1_1;
            },
            function (Vector2_72_1) {
                Vector2_72 = Vector2_72_1;
            },
            function (hugeTreeTrunk_1_1) {
                hugeTreeTrunk_1 = hugeTreeTrunk_1_1;
            }
        ],
        execute: function () {
            origin = Vector2_72.Vector2.from([1, 2]);
            positionsMap = `
         x                     
            x     x            
               x               
      x   x  x                 
                x   x          
     x     x                   
  x     x      x      x        
                  x            
      x     x                  
 x  x    x      x  x   x       
                          x    
     x     x        x          
  x     x     x  x     x       
                               
   x        x     x     x      
x     x  x     x     x     x   
                               
    x      x       x           
       x       x      x        
`;
            positions = positionsMap.split('\n')
                .filter(rowString => rowString.length > 0)
                .map(rowString => rowString.split(''))
                .map((row, y) => row.map((cell, x) => cell === 'x' ? Vector2_72.Vector2.from([x, y]) : null))
                .flat()
                .filter(row => row !== null);
            leaves = positions
                .filter(position => position !== null)
                .map(position => new TreeLeaves_1.TreeLeaves(position.add(origin)));
            trunkPosition = [origin.x + 19, origin.y + 21];
            trunk = hugeTreeTrunk_1.hugeTreeTrunk({ position: trunkPosition });
            portals = [
                portal_8.portal('huge_tree_portal_west', { position: [trunkPosition[0] - 2, trunkPosition[1] + 2] }),
            ];
            objects = [...portals, ...leaves, trunk];
            levelTiles = Tiles_8.Tiles.parseTiles(`                                 
             I              I    
   II                     IIII   
                           II    
 I            IIII               
       II    IIIIIII             
    IIIIIIIIIIIIIIIIIIII         
   IIIIIIIIIIIIIIIIII  I         
     IIIIIIIIIIIIIIIIIIII        
      IIIIIIIIIIIIIIIII          
 IIIIIIIIIIIIIIIIIIIIIIIII       
  IIIIIIIIIIIIIIIIIIIIIIIIII     
 IIIIIIIIIIIIIIIIIIIIIIIIIIII    
   IIIIIIIIIIIIIIIIIIIIIIIII     
      IIIIIIIIIIIIIIIIIIIIIIIIII 
     IIIIIIIIIIIIIIIIIIIIIIIIII  
 I    IIIIIIIIIIIIIIIIIIIIIIIII  
     IIIIIIIIIIIIIIIIIIIIIIIII   
    IIIIIIIIIIIIIIIIIIIIIIIIIII  
   IIIIIIIIIIIIIIIIIIIIIIIIIIIII 
  IIIIIIIIIIIIIIIIIIIIIIIIIIIIII 
 II IIIIIIIIIIIIIIIIIIIIIIIIIIII 
 IIIIIIIIIIIIIIIIIIIIIIIIIIIIII  
      IIIIIIIIIIIIIIIIIIIIIIIIII 
         III    IIIIIIIIIIII     
  II          IIIII    III    I  
                        I        
                                 `, {
                ' ': tiles_6.tiles.grass_tall,
                'I': tiles_6.tiles.grass,
            });
            level = new Level_9.Level('hugeTree', objects, levelTiles);
            // TODO: needs 3D levels to work properly.
            // level.roofHolesLayer = new Grid<boolean>(level.size).fillValue(true);
            // level.roofLayer = new Grid<number>(level.size).fillValue(0);
            // if (true) { // add leaves shadow
            //     const shadowOffset = new Vector2(0, 5);
            //     const skinPositions = leaves[0].skin.getPositions();
            //     for (const position of positions) {
            //         for (const skinPosition of skinPositions) {
            //             const newPosition = position.clone().add(skinPosition).add(shadowOffset).clone();
            //             level.roofLayer.setAt(newPosition, 15);
            //             level.roofHolesLayer.setAt(newPosition, false);
            //         }
            //     }
            // }
            exports_173("hugeTreeLevel", hugeTreeLevel = level);
        }
    };
});
System.register("world/levels/icebergLevel", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/tiles"], function (exports_174, context_174) {
    "use strict";
    var Level_10, portal_9, Tiles_9, tiles_7, portals, objects, levelTiles, icebergLevel;
    var __moduleName = context_174 && context_174.id;
    return {
        setters: [
            function (Level_10_1) {
                Level_10 = Level_10_1;
            },
            function (portal_9_1) {
                portal_9 = portal_9_1;
            },
            function (Tiles_9_1) {
                Tiles_9 = Tiles_9_1;
            },
            function (tiles_7_1) {
                tiles_7 = tiles_7_1;
            }
        ],
        execute: function () {
            portals = [
                portal_9.portal('iceberg_portal_west', { position: [7, 7] }),
            ];
            objects = [...portals];
            levelTiles = Tiles_9.Tiles.parseTiles(`                                 
             I              I    
   II                     IIII   
                           II    
 I            IIII               
       II    IIIIIII             
    IIIIIIIIIIIIIIIIIIII         
   IIIIIIIIIIIIIIIIII  I         
     IIIIIIIIIIIIIIIIIIII        
      IIIIIIIIIIIIIIIII          
 IIIIIIIIIIIIIIIIIIIIIIIII       
  IIIIIIIIIIIIIIIIIIIIIIIIII     
 IIIIIIIIIIIIIIIIIIIIIIIIIIII    
   IIIIIIIIIIIIIIIIIIIIIIIII     
      IIIIIIIIIIIIIIIIIIIIIIIIII 
     IIIIIIIIIIIIIIIIIIIIIIIIII  
 I    IIIIIIIIIIIIIIIIIIIIIIIII  
     IIIIIIIIIIIIIIIIIIIIIIIII   
    IIIIIIIIIIIIIIIIIIIIIIIIIII  
   IIIIIIIIIIIIIIIIIIIIIIIIIIIII 
  IIIIIIIIIIIIIIIIIIIIIIIIIIIIII 
 II IIIIIIIIIIIIIIIIIIIIIIIIIIII 
 IIIIIIIIIIIIIIIIIIIIIIIIIIIIII  
      IIIIIIIIIIIIIIIIIIIIIIIIII 
         III    IIIIIIIIIIII     
  II          IIIII    III    I  
                        I        
                                 `, {
                ' ': tiles_7.tiles.water,
                'I': tiles_7.tiles.ice,
            });
            exports_174("icebergLevel", icebergLevel = new Level_10.Level('iceberg', objects, levelTiles));
            icebergLevel.defaultTemperatureAtDay = 2;
            icebergLevel.defaultTemperatureAtNight = 0;
            icebergLevel.weather.changeWeather("snow");
        }
    };
});
System.register("world/levels/intro", ["world/objects/chest", "world/objects/lamp", "world/objects/house", "engine/events/EventLoop", "engine/events/GameEvent", "engine/Level", "world/objects/pineTree", "world/objects/portal", "world/objects/bamboo", "engine/objects/Npc", "engine/components/ObjectSkin", "engine/data/Tiles", "world/items", "engine/math/Vector2"], function (exports_175, context_175) {
    "use strict";
    var chest_2, lamp_4, house_5, EventLoop_8, GameEvent_11, Level_11, pineTree_3, portal_10, bamboo_2, Npc_10, ObjectSkin_31, Tiles_10, items_6, Vector2_73, lamps, portals, house1, tree1, chest1, trees, ulan, npcs, objects, introLevel;
    var __moduleName = context_175 && context_175.id;
    return {
        setters: [
            function (chest_2_1) {
                chest_2 = chest_2_1;
            },
            function (lamp_4_1) {
                lamp_4 = lamp_4_1;
            },
            function (house_5_1) {
                house_5 = house_5_1;
            },
            function (EventLoop_8_1) {
                EventLoop_8 = EventLoop_8_1;
            },
            function (GameEvent_11_1) {
                GameEvent_11 = GameEvent_11_1;
            },
            function (Level_11_1) {
                Level_11 = Level_11_1;
            },
            function (pineTree_3_1) {
                pineTree_3 = pineTree_3_1;
            },
            function (portal_10_1) {
                portal_10 = portal_10_1;
            },
            function (bamboo_2_1) {
                bamboo_2 = bamboo_2_1;
            },
            function (Npc_10_1) {
                Npc_10 = Npc_10_1;
            },
            function (ObjectSkin_31_1) {
                ObjectSkin_31 = ObjectSkin_31_1;
            },
            function (Tiles_10_1) {
                Tiles_10 = Tiles_10_1;
            },
            function (items_6_1) {
                items_6 = items_6_1;
            },
            function (Vector2_73_1) {
                Vector2_73 = Vector2_73_1;
            }
        ],
        execute: function () {
            lamps = [
                lamp_4.lamp({ position: [2, 5] }),
                lamp_4.lamp({ position: [17, 5] }),
            ];
            portals = [
                portal_10.portal('intro', { position: [2, 2] }),
                portal_10.portal('intro_portal', { position: [10, 10] }),
            ];
            house1 = house_5.house({ position: [5, 10] });
            tree1 = pineTree_3.pineTree({ position: [2, 12] });
            chest1 = new chest_2.Chest().translateX(2).translateY(10);
            chest1.inventory.addItems([items_6.victoryItem()]);
            exports_175("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(bamboo_2.bamboo({ position: [x2, y] }));
                }
            }
            ulan = new Npc_10.Npc(new ObjectSkin_31.ObjectSkin().char('🐻'), new Vector2_73.Vector2(4, 4));
            ulan.setAction((ctx) => {
                const o = ctx.obj;
                EventLoop_8.emitEvent(new GameEvent_11.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            npcs = [
                ulan,
            ];
            objects = [house1, chest1, tree1, ...trees, ...lamps, ...npcs, ...portals];
            exports_175("introLevel", introLevel = new Level_11.Level('intro', objects, Tiles_10.Tiles.createEmptyDefault()));
        }
    };
});
System.register("world/objects/headStone", ["engine/components/ObjectSkin", "engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Colors"], function (exports_176, context_176) {
    "use strict";
    var ObjectSkin_32, Object2D_39, ObjectPhysics_27, Vector2_74, Colors_34, headStone;
    var __moduleName = context_176 && context_176.id;
    return {
        setters: [
            function (ObjectSkin_32_1) {
                ObjectSkin_32 = ObjectSkin_32_1;
            },
            function (Object2D_39_1) {
                Object2D_39 = Object2D_39_1;
            },
            function (ObjectPhysics_27_1) {
                ObjectPhysics_27 = ObjectPhysics_27_1;
            },
            function (Vector2_74_1) {
                Vector2_74 = Vector2_74_1;
            },
            function (Colors_34_1) {
                Colors_34 = Colors_34_1;
            }
        ],
        execute: function () {
            exports_176("headStone", headStone = (options) => new Object2D_39.Object2D(Vector2_74.Vector2.zero, new ObjectSkin_32.ObjectSkin().char(`🪦`).color(Colors_34.Colors.Sienna), new ObjectPhysics_27.ObjectPhysics().collision(), Vector2_74.Vector2.from(options.position)));
        }
    };
});
System.register("world/levels/lights", ["world/objects/campfire", "engine/Level", "world/objects/pineTree", "world/objects/headStone", "world/objects/house", "engine/data/Tiles", "world/objects/portal", "engine/math/Vector2"], function (exports_177, context_177) {
    "use strict";
    var campfire_3, Level_12, pineTree_4, headStone_1, house_6, Tiles_11, portal_11, Vector2_75, fences, headStones, walls, tree2, campfires, portals, objects, level, lightsLevel;
    var __moduleName = context_177 && context_177.id;
    return {
        setters: [
            function (campfire_3_1) {
                campfire_3 = campfire_3_1;
            },
            function (Level_12_1) {
                Level_12 = Level_12_1;
            },
            function (pineTree_4_1) {
                pineTree_4 = pineTree_4_1;
            },
            function (headStone_1_1) {
                headStone_1 = headStone_1_1;
            },
            function (house_6_1) {
                house_6 = house_6_1;
            },
            function (Tiles_11_1) {
                Tiles_11 = Tiles_11_1;
            },
            function (portal_11_1) {
                portal_11 = portal_11_1;
            },
            function (Vector2_75_1) {
                Vector2_75 = Vector2_75_1;
            }
        ],
        execute: function () {
            fences = [];
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
            tree2 = pineTree_4.pineTree({ position: [7, 12] });
            campfires = [
                new campfire_3.Campfire(new Vector2_75.Vector2(5, 4)),
                new campfire_3.Campfire(new Vector2_75.Vector2(9, 4)),
                new campfire_3.Campfire(new Vector2_75.Vector2(13, 4)),
                //
                new campfire_3.Campfire(new Vector2_75.Vector2(3, 17)),
            ];
            portals = [
                new portal_11.Portal("lights", { position: [9, 8] }),
            ];
            objects = [...fences, ...walls, tree2, ...campfires, ...headStones, ...portals];
            level = new Level_12.Level('lights', objects, Tiles_11.Tiles.createEmptyDefault());
            exports_177("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/objects/particles/Mist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle", "engine/math/Colors"], function (exports_178, context_178) {
    "use strict";
    var ObjectSkin_33, Sprite_25, Particle_9, Colors_35, Mist;
    var __moduleName = context_178 && context_178.id;
    return {
        setters: [
            function (ObjectSkin_33_1) {
                ObjectSkin_33 = ObjectSkin_33_1;
            },
            function (Sprite_25_1) {
                Sprite_25 = Sprite_25_1;
            },
            function (Particle_9_1) {
                Particle_9 = Particle_9_1;
            },
            function (Colors_35_1) {
                Colors_35 = Colors_35_1;
            }
        ],
        execute: function () {
            Mist = class Mist extends Particle_9.Particle {
                constructor(position) {
                    const sprite = new Sprite_25.Sprite();
                    const skin = new ObjectSkin_33.ObjectSkin().background(Colors_35.Colors.White);
                    sprite.frames[Particle_9.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "mist";
                }
            };
            exports_178("Mist", Mist);
        }
    };
});
System.register("world/levels/mistlandLevel", ["engine/Level", "world/objects/fence", "world/objects/portal", "engine/data/Tiles", "world/objects/campfire", "world/objects/particles/Mist", "world/objects/pineTree", "engine/math/Vector2", "world/objects/natural"], function (exports_179, context_179) {
    "use strict";
    var Level_13, fence_4, portal_12, Tiles_12, campfire_4, Mist_1, pineTree_5, Vector2_76, natural_4, fences, width, height, trees, fires, portals, objects, mistlandLevel;
    var __moduleName = context_179 && context_179.id;
    return {
        setters: [
            function (Level_13_1) {
                Level_13 = Level_13_1;
            },
            function (fence_4_1) {
                fence_4 = fence_4_1;
            },
            function (portal_12_1) {
                portal_12 = portal_12_1;
            },
            function (Tiles_12_1) {
                Tiles_12 = Tiles_12_1;
            },
            function (campfire_4_1) {
                campfire_4 = campfire_4_1;
            },
            function (Mist_1_1) {
                Mist_1 = Mist_1_1;
            },
            function (pineTree_5_1) {
                pineTree_5 = pineTree_5_1;
            },
            function (Vector2_76_1) {
                Vector2_76 = Vector2_76_1;
            },
            function (natural_4_1) {
                natural_4 = natural_4_1;
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
                pineTree_5.pineTree({ position: [5, 12] }),
                pineTree_5.pineTree({ position: [12, 5] }),
                natural_4.bush({ position: [10, 10] }),
                natural_4.bush({ position: [11, 10] }),
                natural_4.bush({ position: [12, 10] }),
            ];
            fires = [
                new campfire_4.Campfire(new Vector2_76.Vector2(12, 12)),
            ];
            portals = [
                portal_12.portal('mistland', { position: [2, 2] }),
            ];
            objects = [...fences, ...portals, ...trees, ...fires];
            exports_179("mistlandLevel", mistlandLevel = new class extends Level_13.Level {
                constructor() {
                    super('mistland', objects, Tiles_12.Tiles.createEmpty(new Vector2_76.Vector2(width, height)));
                    this.weather.wind = new Vector2_76.Vector2(1, 0);
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
                            const p = new Vector2_76.Vector2(x, y);
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
System.register("world/levels/particlesLevel", ["engine/Level", "world/objects/fence", "world/objects/portal", "engine/data/Tiles", "world/objects/campfire", "engine/math/Vector2"], function (exports_180, context_180) {
    "use strict";
    var Level_14, fence_5, portal_13, Tiles_13, campfire_5, Vector2_77, fences, width, height, fires, portals, objects, particlesLevel;
    var __moduleName = context_180 && context_180.id;
    return {
        setters: [
            function (Level_14_1) {
                Level_14 = Level_14_1;
            },
            function (fence_5_1) {
                fence_5 = fence_5_1;
            },
            function (portal_13_1) {
                portal_13 = portal_13_1;
            },
            function (Tiles_13_1) {
                Tiles_13 = Tiles_13_1;
            },
            function (campfire_5_1) {
                campfire_5 = campfire_5_1;
            },
            function (Vector2_77_1) {
                Vector2_77 = Vector2_77_1;
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
                new campfire_5.Campfire(new Vector2_77.Vector2(10, 10)),
                new campfire_5.Campfire(new Vector2_77.Vector2(5, 20)),
            ];
            portals = [
                portal_13.portal('particles', { position: [2, 2] }),
            ];
            objects = [...fences, ...portals, ...fires];
            exports_180("particlesLevel", particlesLevel = new class extends Level_14.Level {
                constructor() {
                    super('particles', objects, Tiles_13.Tiles.createEmpty(new Vector2_77.Vector2(width, height)));
                    this.weather.wind = new Vector2_77.Vector2(1, 1);
                }
                onLoaded() {
                    super.onLoaded();
                    this.weather.changeWeather("snow");
                }
            }());
        }
    };
});
System.register("world/levels/sheep", ["world/objects/campfire", "world/npcs/sheep", "world/npcs/wolf", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/portal", "engine/data/Tiles", "engine/math/Vector2"], function (exports_181, context_181) {
    "use strict";
    var campfire_6, sheep_2, wolf_2, Level_15, pineTree_6, fence_6, portal_14, Tiles_14, Vector2_78, sheeps, wolves, fences, tree2, campfires, portals, objects, sheepLevel;
    var __moduleName = context_181 && context_181.id;
    return {
        setters: [
            function (campfire_6_1) {
                campfire_6 = campfire_6_1;
            },
            function (sheep_2_1) {
                sheep_2 = sheep_2_1;
            },
            function (wolf_2_1) {
                wolf_2 = wolf_2_1;
            },
            function (Level_15_1) {
                Level_15 = Level_15_1;
            },
            function (pineTree_6_1) {
                pineTree_6 = pineTree_6_1;
            },
            function (fence_6_1) {
                fence_6 = fence_6_1;
            },
            function (portal_14_1) {
                portal_14 = portal_14_1;
            },
            function (Tiles_14_1) {
                Tiles_14 = Tiles_14_1;
            },
            function (Vector2_78_1) {
                Vector2_78 = Vector2_78_1;
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
            wolves.push(wolf_2.wolf({ position: [15, 15] }));
            tree2 = pineTree_6.pineTree({ position: [7, 9] });
            campfires = [
                new campfire_6.Campfire(new Vector2_78.Vector2(10, 10)),
            ];
            portals = [
                portal_14.portal('sheep_portal', { position: [4, 2] }),
                portal_14.portal('sheep_portal', { position: [14, 14] }),
                portal_14.portal('intro_portal', { position: [2, 2] }),
                portal_14.portal('sheeps_portal', { position: [2, 4] }),
            ];
            objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...portals];
            exports_181("sheepLevel", sheepLevel = new Level_15.Level('sheep', objects, Tiles_14.Tiles.createEmptyRandomized(new Vector2_78.Vector2(20, 20))));
        }
    };
});
System.register("world/objects/signals/Invertor", ["engine/objects/Object2D", "engine/components/ObjectPhysics", "engine/data/Sprite", "engine/math/Vector2", "engine/math/Rotation", "engine/components/CompositeObjectSkin", "engine/math/Colors"], function (exports_182, context_182) {
    "use strict";
    var Object2D_40, ObjectPhysics_28, Sprite_26, Vector2_79, Rotation_7, CompositeObjectSkin_4, Colors_36, Invertor;
    var __moduleName = context_182 && context_182.id;
    return {
        setters: [
            function (Object2D_40_1) {
                Object2D_40 = Object2D_40_1;
            },
            function (ObjectPhysics_28_1) {
                ObjectPhysics_28 = ObjectPhysics_28_1;
            },
            function (Sprite_26_1) {
                Sprite_26 = Sprite_26_1;
            },
            function (Vector2_79_1) {
                Vector2_79 = Vector2_79_1;
            },
            function (Rotation_7_1) {
                Rotation_7 = Rotation_7_1;
            },
            function (CompositeObjectSkin_4_1) {
                CompositeObjectSkin_4 = CompositeObjectSkin_4_1;
            },
            function (Colors_36_1) {
                Colors_36 = Colors_36_1;
            }
        ],
        execute: function () {
            Invertor = class Invertor extends Object2D_40.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_28.ObjectPhysics().signal({
                        position: Vector2_79.Vector2.zero,
                        inputs: [Rotation_7.Rotations.back],
                        outputs: [Rotation_7.Rotations.forward],
                    });
                    const sprite = Sprite_26.Sprite.parseSimple('▷▽◁△');
                    const skin = sprite.frames["0"][0];
                    const indicatorSprite = Sprite_26.Sprite.parseSimple('▶▼◀▲');
                    const indicatorSkin = indicatorSprite.frames["0"][0];
                    const lockedFrame = Sprite_26.Sprite.parseSimple('◯').frames["0"][0].color(Colors_36.Colors.White);
                    super(Vector2_79.Vector2.zero, new CompositeObjectSkin_4.CompositeObjectSkin([indicatorSkin, skin]), physics, Vector2_79.Vector2.from((options === null || options === void 0 ? void 0 : options.position) || [0, 0]));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this._lockedFrame = lockedFrame;
                    this.type = "invertor";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const controlTransfers = transfers
                        .filter(x => Rotation_7.Rotations.equals(x.rotation, Rotation_7.Rotations.right));
                    const isInverting = controlTransfers.length === 0;
                    const outputs = transfers
                        .filter(x => Rotation_7.Rotations.equals(x.rotation, Rotation_7.Rotations.back))
                        .map(transfer => {
                        const invertedSignal = isInverting
                            ? this.invertSignal(transfer.signal)
                            : transfer.signal;
                        const outputDirection = Rotation_7.Rotations.normalize(transfer.rotation + Rotation_7.Rotations.opposite);
                        return { rotation: outputDirection, signal: invertedSignal };
                    });
                    this.setHighlight(outputs.length > 0);
                    this.setInverting(isInverting);
                    return outputs;
                }
                invertSignal(signal) {
                    const newValue = signal.value === 0 ? 1 : 0;
                    return { type: signal.type, value: newValue };
                }
                onBeforeRender(renderer, scene, camera) {
                    const frameName = Rotation_7.Rotations.normalize(this.globalRotation).toString();
                    const frame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0];
                    const frames = [indicatorFrame, frame, this._lockedFrame];
                    this.skin = new CompositeObjectSkin_4.CompositeObjectSkin(frames);
                }
                setHighlight(isHighlighted) {
                    for (const frame of Object.values(this._indicatorSprite.frames)) {
                        frame[0].color(isHighlighted ? Colors_36.Colors.White : Colors_36.Colors.Black);
                    }
                }
                setInverting(isInverting) {
                    this._lockedFrame.color(isInverting ? Colors_36.Colors.Transparent : Colors_36.Colors.White);
                }
            };
            exports_182("Invertor", Invertor);
        }
    };
});
System.register("world/objects/signals/Pipe", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation", "engine/math/Colors"], function (exports_183, context_183) {
    "use strict";
    var ObjectPhysics_29, Vector2_80, Sprite_27, Object2D_41, CompositeObjectSkin_5, Rotation_8, Colors_37, Pipe;
    var __moduleName = context_183 && context_183.id;
    return {
        setters: [
            function (ObjectPhysics_29_1) {
                ObjectPhysics_29 = ObjectPhysics_29_1;
            },
            function (Vector2_80_1) {
                Vector2_80 = Vector2_80_1;
            },
            function (Sprite_27_1) {
                Sprite_27 = Sprite_27_1;
            },
            function (Object2D_41_1) {
                Object2D_41 = Object2D_41_1;
            },
            function (CompositeObjectSkin_5_1) {
                CompositeObjectSkin_5 = CompositeObjectSkin_5_1;
            },
            function (Rotation_8_1) {
                Rotation_8 = Rotation_8_1;
            },
            function (Colors_37_1) {
                Colors_37 = Colors_37_1;
            }
        ],
        execute: function () {
            Pipe = class Pipe extends Object2D_41.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_29.ObjectPhysics().signal({
                        position: Vector2_80.Vector2.zero,
                        inputs: [Rotation_8.Rotations.forward, Rotation_8.Rotations.back],
                        outputs: [Rotation_8.Rotations.forward, Rotation_8.Rotations.back],
                    });
                    const sprite = Sprite_27.Sprite.parseSimple('═║');
                    const indicatorSprite = Sprite_27.Sprite.parseSimple('─│');
                    super(Vector2_80.Vector2.zero, sprite.frames["0"][0], physics, Vector2_80.Vector2.from(options.position));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this.type = "pipe";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const signalCell = this.physics.signalCells[0];
                    const outputs = transfers
                        .filter(x => signalCell.inputs.includes(Rotation_8.Rotations.normalize(x.rotation)))
                        .map(x => ({ rotation: Rotation_8.Rotations.normalize(x.rotation + Rotation_8.Rotations.opposite), signal: x.signal }));
                    this.setHighlight(outputs.length > 0);
                    return outputs;
                }
                onBeforeRender(renderer, scene, camera) {
                    const frameName = (Rotation_8.Rotations.normalize(this.globalRotation) % 2).toString();
                    const pipeFrame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0];
                    this.skin = new CompositeObjectSkin_5.CompositeObjectSkin([pipeFrame, indicatorFrame]);
                }
                setHighlight(isHighlighted) {
                    for (const frame of Object.values(this._indicatorSprite.frames)) {
                        frame[0].color(isHighlighted ? Colors_37.Colors.White : Colors_37.Colors.Black);
                    }
                }
            };
            exports_183("Pipe", Pipe);
        }
    };
});
System.register("engine/math/Orientation", [], function (exports_184, context_184) {
    "use strict";
    var Orientations, OrientationHelper;
    var __moduleName = context_184 && context_184.id;
    return {
        setters: [],
        execute: function () {
            exports_184("Orientations", Orientations = ["horizontal", "vertical"]);
            OrientationHelper = class OrientationHelper {
                static rotate(orientation) {
                    return orientation === "horizontal"
                        ? "vertical"
                        : "horizontal";
                }
            };
            exports_184("OrientationHelper", OrientationHelper);
        }
    };
});
System.register("world/objects/signals/Lever", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/math/Rotation", "engine/math/Colors"], function (exports_185, context_185) {
    "use strict";
    var ObjectPhysics_30, Vector2_81, Sprite_28, Object2D_42, Rotation_9, Colors_38, Lever;
    var __moduleName = context_185 && context_185.id;
    return {
        setters: [
            function (ObjectPhysics_30_1) {
                ObjectPhysics_30 = ObjectPhysics_30_1;
            },
            function (Vector2_81_1) {
                Vector2_81 = Vector2_81_1;
            },
            function (Sprite_28_1) {
                Sprite_28 = Sprite_28_1;
            },
            function (Object2D_42_1) {
                Object2D_42 = Object2D_42_1;
            },
            function (Rotation_9_1) {
                Rotation_9 = Rotation_9_1;
            },
            function (Colors_38_1) {
                Colors_38 = Colors_38_1;
            }
        ],
        execute: function () {
            Lever = class Lever extends Object2D_42.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_30.ObjectPhysics().signal({
                        position: Vector2_81.Vector2.zero,
                        inputs: Rotation_9.Rotations.none,
                        outputs: Rotation_9.Rotations.all,
                    });
                    const sprite = Sprite_28.Sprite.parseSimple('⫰⫯');
                    sprite.frames["0"][0].color(Colors_38.Colors.Black);
                    sprite.frames["0"][0].background(Colors_38.Colors.Gray);
                    sprite.frames["1"][0].color(Colors_38.Colors.Yellow);
                    sprite.frames["1"][0].background(Colors_38.Colors.Gray);
                    super(Vector2_81.Vector2.zero, sprite.frames["1"][0], physics, Vector2_81.Vector2.from(options.position));
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
                    return Rotation_9.Rotations.all.map(x => ({ rotation: x, signal: { type: "mind", value: 1 } }));
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
            exports_185("Lever", Lever);
        }
    };
});
System.register("world/objects/signals/PipeT", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation", "engine/math/Colors"], function (exports_186, context_186) {
    "use strict";
    var ObjectPhysics_31, Vector2_82, Sprite_29, Object2D_43, CompositeObjectSkin_6, Rotation_10, Colors_39, PipeT;
    var __moduleName = context_186 && context_186.id;
    return {
        setters: [
            function (ObjectPhysics_31_1) {
                ObjectPhysics_31 = ObjectPhysics_31_1;
            },
            function (Vector2_82_1) {
                Vector2_82 = Vector2_82_1;
            },
            function (Sprite_29_1) {
                Sprite_29 = Sprite_29_1;
            },
            function (Object2D_43_1) {
                Object2D_43 = Object2D_43_1;
            },
            function (CompositeObjectSkin_6_1) {
                CompositeObjectSkin_6 = CompositeObjectSkin_6_1;
            },
            function (Rotation_10_1) {
                Rotation_10 = Rotation_10_1;
            },
            function (Colors_39_1) {
                Colors_39 = Colors_39_1;
            }
        ],
        execute: function () {
            PipeT = class PipeT extends Object2D_43.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_31.ObjectPhysics().signal({
                        position: Vector2_82.Vector2.zero,
                        inputs: [Rotation_10.Rotations.forward, Rotation_10.Rotations.left, Rotation_10.Rotations.right],
                        outputs: [Rotation_10.Rotations.forward, Rotation_10.Rotations.left, Rotation_10.Rotations.right],
                    });
                    const sprite = Sprite_29.Sprite.parseSimple('╠╦╣╩');
                    const indicatorSprite = Sprite_29.Sprite.parseSimple('├┬┤┴');
                    super(Vector2_82.Vector2.zero, sprite.frames["0"][0], physics, Vector2_82.Vector2.from(options.position));
                    this._sprite = sprite;
                    this._indicatorSprite = indicatorSprite;
                    this.type = "pipe_t";
                    this.setAction(ctx => ctx.obj.rotate());
                }
                processSignalTransfer(transfers) {
                    const signalCell = this.physics.signalCells[0];
                    const outputs = transfers
                        .filter(x => signalCell.inputs.includes(Rotation_10.Rotations.normalize(x.rotation)))
                        .flatMap(transfer => {
                        return Rotation_10.Rotations.all
                            .filter(x => !Rotation_10.Rotations.equals(x, Rotation_10.Rotations.back))
                            .map(x => Rotation_10.Rotations.normalize(transfer.rotation + x + Rotation_10.Rotations.opposite))
                            .map(outputDirection => ({ rotation: outputDirection, signal: transfer.signal }));
                    })
                        .filter(x => signalCell.outputs.includes(x.rotation));
                    this.setHighlight(outputs.length > 0);
                    return outputs;
                }
                onBeforeRender(renderer, scene, camera) {
                    const frameName = Rotation_10.Rotations.normalize(this.globalRotation).toString();
                    const pipeFrame = this._sprite.frames[frameName][0];
                    const indicatorFrame = this._indicatorSprite.frames[frameName][0];
                    this.skin = new CompositeObjectSkin_6.CompositeObjectSkin([pipeFrame, indicatorFrame]);
                }
                setHighlight(isHighlighted) {
                    for (const frame of Object.values(this._indicatorSprite.frames)) {
                        frame[0].color(isHighlighted ? Colors_39.Colors.White : Colors_39.Colors.Black);
                    }
                }
            };
            exports_186("PipeT", PipeT);
        }
    };
});
System.register("world/objects/signals/PipeX", ["engine/components/ObjectPhysics", "engine/math/Vector2", "engine/data/Sprite", "engine/objects/Object2D", "engine/components/CompositeObjectSkin", "engine/math/Rotation", "engine/math/Colors"], function (exports_187, context_187) {
    "use strict";
    var ObjectPhysics_32, Vector2_83, Sprite_30, Object2D_44, CompositeObjectSkin_7, Rotation_11, Colors_40, PipeX;
    var __moduleName = context_187 && context_187.id;
    return {
        setters: [
            function (ObjectPhysics_32_1) {
                ObjectPhysics_32 = ObjectPhysics_32_1;
            },
            function (Vector2_83_1) {
                Vector2_83 = Vector2_83_1;
            },
            function (Sprite_30_1) {
                Sprite_30 = Sprite_30_1;
            },
            function (Object2D_44_1) {
                Object2D_44 = Object2D_44_1;
            },
            function (CompositeObjectSkin_7_1) {
                CompositeObjectSkin_7 = CompositeObjectSkin_7_1;
            },
            function (Rotation_11_1) {
                Rotation_11 = Rotation_11_1;
            },
            function (Colors_40_1) {
                Colors_40 = Colors_40_1;
            }
        ],
        execute: function () {
            PipeX = class PipeX extends Object2D_44.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_32.ObjectPhysics().signal({
                        position: Vector2_83.Vector2.zero,
                        inputs: Rotation_11.Rotations.all,
                        outputs: Rotation_11.Rotations.all,
                    });
                    const innerSprite = Sprite_30.Sprite.parseSimple('┼');
                    const indicatorSkin = innerSprite.frames["0"][0];
                    const sprite = Sprite_30.Sprite.parseSimple('╬');
                    const pipeSkin = sprite.frames["0"][0];
                    super(Vector2_83.Vector2.zero, new CompositeObjectSkin_7.CompositeObjectSkin([pipeSkin, indicatorSkin]), physics, Vector2_83.Vector2.from(options.position));
                    this.type = "pipe_x";
                    this._indicatorSkin = indicatorSkin;
                }
                processSignalTransfer(transfers) {
                    const outputs = transfers
                        .flatMap(transfer => {
                        return Rotation_11.Rotations.all
                            .filter(x => !Rotation_11.Rotations.equals(x, Rotation_11.Rotations.back))
                            .map(x => Rotation_11.Rotations.normalize(transfer.rotation + x + Rotation_11.Rotations.opposite))
                            .map(x => ({ rotation: x, signal: transfer.signal }));
                    });
                    this.setHighlight(outputs.length > 0);
                    return outputs;
                }
                setHighlight(isHighlighted) {
                    this._indicatorSkin.color(isHighlighted ? Colors_40.Colors.White : Colors_40.Colors.Black);
                }
            };
            exports_187("PipeX", PipeX);
        }
    };
});
System.register("world/levels/signalLightsLevel", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/objects/signals/Invertor", "world/objects/signals/Pipe", "world/objects/signals/Lever", "world/objects/signals/LightSource", "engine/math/Vector2", "world/objects/signals/PipeT", "world/objects/signals/PipeX", "utils/color", "engine/math/Rotation", "engine/data/TileInfo", "engine/math/Color"], function (exports_188, context_188) {
    "use strict";
    var Level_16, portal_15, Tiles_15, Invertor_1, Pipe_1, Lever_1, LightSource_3, Vector2_84, PipeT_1, PipeX_1, color_4, Rotation_12, TileInfo_3, Color_24, fences, width, height, _position, elements, portals, objects, signalLightsLevel;
    var __moduleName = context_188 && context_188.id;
    return {
        setters: [
            function (Level_16_1) {
                Level_16 = Level_16_1;
            },
            function (portal_15_1) {
                portal_15 = portal_15_1;
            },
            function (Tiles_15_1) {
                Tiles_15 = Tiles_15_1;
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
            function (LightSource_3_1) {
                LightSource_3 = LightSource_3_1;
            },
            function (Vector2_84_1) {
                Vector2_84 = Vector2_84_1;
            },
            function (PipeT_1_1) {
                PipeT_1 = PipeT_1_1;
            },
            function (PipeX_1_1) {
                PipeX_1 = PipeX_1_1;
            },
            function (color_4_1) {
                color_4 = color_4_1;
            },
            function (Rotation_12_1) {
                Rotation_12 = Rotation_12_1;
            },
            function (TileInfo_3_1) {
                TileInfo_3 = TileInfo_3_1;
            },
            function (Color_24_1) {
                Color_24 = Color_24_1;
            }
        ],
        execute: function () {
            fences = [];
            width = 20;
            height = 20;
            if (true) { // add signal pipes
                const padding = 2;
                const center = new Vector2_84.Vector2(9, 9);
                for (let x = padding + 1; x < width - padding - 1; x++) {
                    fences.push(new PipeT_1.PipeT({ position: [x, padding] }).rotate(Rotation_12.Rotations.left));
                    fences.push(new PipeT_1.PipeT({ position: [x, height - padding - 1] }).rotate(Rotation_12.Rotations.right));
                    const angleTop = new Vector2_84.Vector2(x, padding - 1).sub(center).angle;
                    fences.push(new LightSource_3.LightSource({ position: [x, padding - 1], color: color_4.hslToRgb(angleTop, 1, 0.5) }));
                    const angleBottom = new Vector2_84.Vector2(x, height - (padding - 1) - 1).sub(center).angle;
                    fences.push(new LightSource_3.LightSource({ position: [x, height - (padding - 1) - 1], color: color_4.hslToRgb(angleBottom, 1, 0.5) }));
                }
                for (let y = 1 + padding; y < height - padding - 1; y++) {
                    fences.push(new PipeT_1.PipeT({ position: [padding, y] }).rotate(Rotation_12.Rotations.back));
                    fences.push(new PipeT_1.PipeT({ position: [width - padding - 1, y] }).rotate(Rotation_12.Rotations.forward));
                    const angleLeft = new Vector2_84.Vector2(padding - 1, y).sub(center).angle;
                    fences.push(new LightSource_3.LightSource({ position: [padding - 1, y], color: color_4.hslToRgb(angleLeft, 1, 0.5) }));
                    const angleRight = new Vector2_84.Vector2(width - (padding - 1) - 1, y).sub(center).angle;
                    fences.push(new LightSource_3.LightSource({ position: [width - (padding - 1) - 1, y], color: color_4.hslToRgb(angleRight, 1, 0.5) }));
                }
                fences.push(new PipeX_1.PipeX({ position: [padding, padding] }));
                fences.push(new PipeX_1.PipeX({ position: [width - padding - 1, padding] }));
                fences.push(new PipeX_1.PipeX({ position: [padding, height - padding - 1] }));
                fences.push(new PipeX_1.PipeX({ position: [width - padding - 1, height - padding - 1] }));
            }
            _position = new Vector2_84.Vector2();
            fences = fences.filter(x => !x.getWorldPosition(_position).equals(new Vector2_84.Vector2(9, 2)) && !x.getWorldPosition(_position).equals(new Vector2_84.Vector2(10, 2)));
            elements = [
                new Lever_1.Lever({ position: [9, 4] }),
                new Pipe_1.Pipe({ position: [9, 3] }).rotate(),
                new PipeX_1.PipeX({ position: [9, 2] }),
                new Invertor_1.Invertor({ position: [10, 2] }).rotate(Rotation_12.Rotations.back),
            ];
            portals = [
                portal_15.portal('signal_lights', { position: [9, 9] }),
            ];
            objects = [...fences, ...portals, ...elements];
            exports_188("signalLightsLevel", signalLightsLevel = new class extends Level_16.Level {
                constructor() {
                    super('signalLights', objects, Tiles_15.Tiles.createEmptyMap(new Vector2_84.Vector2(width, height), () => new TileInfo_3.TileInfo(Color_24.Color.fromHexString('#666'), '<test_floor>')));
                    this.weather.wind = new Vector2_84.Vector2(1, 1);
                }
            }());
        }
    };
});
System.register("world/objects/signals/detectors/LightDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation", "engine/math/Colors"], function (exports_189, context_189) {
    "use strict";
    var Object2D_45, ObjectSkin_34, ObjectPhysics_33, Vector2_85, Rotation_13, Colors_41, _position, LightDetector;
    var __moduleName = context_189 && context_189.id;
    return {
        setters: [
            function (Object2D_45_1) {
                Object2D_45 = Object2D_45_1;
            },
            function (ObjectSkin_34_1) {
                ObjectSkin_34 = ObjectSkin_34_1;
            },
            function (ObjectPhysics_33_1) {
                ObjectPhysics_33 = ObjectPhysics_33_1;
            },
            function (Vector2_85_1) {
                Vector2_85 = Vector2_85_1;
            },
            function (Rotation_13_1) {
                Rotation_13 = Rotation_13_1;
            },
            function (Colors_41_1) {
                Colors_41 = Colors_41_1;
            }
        ],
        execute: function () {
            _position = new Vector2_85.Vector2();
            LightDetector = class LightDetector extends Object2D_45.Object2D {
                constructor(options) {
                    const skin = new ObjectSkin_34.ObjectSkin().char(`☀`).color(Colors_41.Colors.Black).background(Colors_41.Colors.Gray);
                    const physics = new ObjectPhysics_33.ObjectPhysics().signal({
                        position: Vector2_85.Vector2.zero,
                        inputs: Rotation_13.Rotations.none,
                        outputs: Rotation_13.Rotations.all,
                    });
                    super(Vector2_85.Vector2.zero, skin, physics, Vector2_85.Vector2.from(options.position));
                    this.type = "light_detector";
                }
                processSignalTransfer(transfers) {
                    const lightInfoAt = this.scene.lights.getLightInfoAt(this.getWorldPosition(_position));
                    const lightLevelAt = (lightInfoAt === null || lightInfoAt === void 0 ? void 0 : lightInfoAt.intensity) || 0;
                    const lightSignalLevel = (lightLevelAt >= 10) ? 1 : 0;
                    this.setEnabled(lightSignalLevel > 0);
                    return Rotation_13.Rotations.all.map(x => ({ rotation: x, signal: { type: "light", value: lightSignalLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? Colors_41.Colors.White : Colors_41.Colors.Black);
                }
            };
            exports_189("LightDetector", LightDetector);
        }
    };
});
System.register("world/objects/signals/detectors/WeatherDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation", "engine/math/Colors"], function (exports_190, context_190) {
    "use strict";
    var Object2D_46, ObjectSkin_35, ObjectPhysics_34, Vector2_86, Rotation_14, Colors_42, _position, WeatherDetector;
    var __moduleName = context_190 && context_190.id;
    return {
        setters: [
            function (Object2D_46_1) {
                Object2D_46 = Object2D_46_1;
            },
            function (ObjectSkin_35_1) {
                ObjectSkin_35 = ObjectSkin_35_1;
            },
            function (ObjectPhysics_34_1) {
                ObjectPhysics_34 = ObjectPhysics_34_1;
            },
            function (Vector2_86_1) {
                Vector2_86 = Vector2_86_1;
            },
            function (Rotation_14_1) {
                Rotation_14 = Rotation_14_1;
            },
            function (Colors_42_1) {
                Colors_42 = Colors_42_1;
            }
        ],
        execute: function () {
            _position = new Vector2_86.Vector2();
            WeatherDetector = class WeatherDetector extends Object2D_46.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_34.ObjectPhysics().signal({
                        position: Vector2_86.Vector2.zero,
                        inputs: Rotation_14.Rotations.none,
                        outputs: Rotation_14.Rotations.all,
                    });
                    const skin = new ObjectSkin_35.ObjectSkin().char(`🗲`).color(Colors_42.Colors.Black).background(Colors_42.Colors.Gray);
                    super(Vector2_86.Vector2.zero, skin, physics, Vector2_86.Vector2.from(options.position));
                    this.type = "weather_detector";
                }
                processSignalTransfer(transfers) {
                    const weatherLevel = this.getWeatherLevelAtPosition();
                    this.setEnabled(weatherLevel > 0);
                    return Rotation_14.Rotations.all.map(x => ({ rotation: x, signal: { type: "weather", value: weatherLevel } }));
                }
                getWeatherLevelAtPosition() {
                    const weatherAt = this.scene.weather.getWeatherInfoAt(this.getWorldPosition(_position)).weatherType;
                    const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : 0;
                    return weatherLevel;
                }
                setEnabled(value) {
                    this.skin.color(value ? Colors_42.Colors.Cyan : Colors_42.Colors.Black);
                }
            };
            exports_190("WeatherDetector", WeatherDetector);
        }
    };
});
System.register("world/objects/signals/detectors/LifeDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation", "engine/math/Colors"], function (exports_191, context_191) {
    "use strict";
    var Object2D_47, ObjectSkin_36, ObjectPhysics_35, Vector2_87, Rotation_15, Colors_43, _position, LifeDetector;
    var __moduleName = context_191 && context_191.id;
    return {
        setters: [
            function (Object2D_47_1) {
                Object2D_47 = Object2D_47_1;
            },
            function (ObjectSkin_36_1) {
                ObjectSkin_36 = ObjectSkin_36_1;
            },
            function (ObjectPhysics_35_1) {
                ObjectPhysics_35 = ObjectPhysics_35_1;
            },
            function (Vector2_87_1) {
                Vector2_87 = Vector2_87_1;
            },
            function (Rotation_15_1) {
                Rotation_15 = Rotation_15_1;
            },
            function (Colors_43_1) {
                Colors_43 = Colors_43_1;
            }
        ],
        execute: function () {
            _position = new Vector2_87.Vector2();
            LifeDetector = class LifeDetector extends Object2D_47.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_35.ObjectPhysics().signal({
                        position: Vector2_87.Vector2.zero,
                        inputs: Rotation_15.Rotations.none,
                        outputs: Rotation_15.Rotations.all,
                    });
                    const skin = new ObjectSkin_36.ObjectSkin().char(`🙑`).color(Colors_43.Colors.Black).background(Colors_43.Colors.Gray);
                    super(Vector2_87.Vector2.zero, skin, physics, Vector2_87.Vector2.from(options.position));
                    this.type = "life_detector";
                }
                processSignalTransfer(transfers) {
                    const npcsAt = [
                        this.scene.getNpcAt(this.getWorldPosition(_position)),
                        ...Vector2_87.Vector2.directions
                            .map(x => this.getWorldPosition(_position).add(x))
                            .map(x => this.scene.getNpcAt(x))
                    ];
                    const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : 0;
                    this.setEnabled(lifeLevel > 0);
                    return Rotation_15.Rotations.all.map(x => ({ rotation: x, signal: { type: "life", value: lifeLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? Colors_43.Colors.Lime : Colors_43.Colors.Black);
                }
            };
            exports_191("LifeDetector", LifeDetector);
        }
    };
});
System.register("world/objects/signals/detectors/FireDetector", ["engine/objects/Object2D", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "engine/math/Vector2", "engine/math/Rotation", "engine/math/Colors"], function (exports_192, context_192) {
    "use strict";
    var Object2D_48, ObjectSkin_37, ObjectPhysics_36, Vector2_88, Rotation_16, Colors_44, _position, FireDetector;
    var __moduleName = context_192 && context_192.id;
    return {
        setters: [
            function (Object2D_48_1) {
                Object2D_48 = Object2D_48_1;
            },
            function (ObjectSkin_37_1) {
                ObjectSkin_37 = ObjectSkin_37_1;
            },
            function (ObjectPhysics_36_1) {
                ObjectPhysics_36 = ObjectPhysics_36_1;
            },
            function (Vector2_88_1) {
                Vector2_88 = Vector2_88_1;
            },
            function (Rotation_16_1) {
                Rotation_16 = Rotation_16_1;
            },
            function (Colors_44_1) {
                Colors_44 = Colors_44_1;
            }
        ],
        execute: function () {
            _position = new Vector2_88.Vector2();
            FireDetector = class FireDetector extends Object2D_48.Object2D {
                constructor(options) {
                    const physics = new ObjectPhysics_36.ObjectPhysics().signal({
                        position: Vector2_88.Vector2.zero,
                        inputs: Rotation_16.Rotations.none,
                        outputs: Rotation_16.Rotations.all,
                    });
                    const skin = new ObjectSkin_37.ObjectSkin().char(`㊋`).color(Colors_44.Colors.Black).background(Colors_44.Colors.Gray);
                    super(Vector2_88.Vector2.zero, skin, physics, Vector2_88.Vector2.from(options.position));
                    this.type = "fire_detector";
                }
                processSignalTransfer(transfers) {
                    const temperatureAt = this.scene.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                    const temperatureLevel = (temperatureAt >= 8) ? 1 : 0;
                    this.setEnabled(temperatureLevel > 0);
                    return Rotation_16.Rotations.all.map(x => ({ rotation: x, signal: { type: "fire", value: temperatureLevel } }));
                }
                setEnabled(value) {
                    this.skin.color(value ? Colors_44.Colors.Red : Colors_44.Colors.Black);
                }
            };
            exports_192("FireDetector", FireDetector);
        }
    };
});
System.register("engine/objects/Group", ["engine/objects/Object2D"], function (exports_193, context_193) {
    "use strict";
    var Object2D_49, Group;
    var __moduleName = context_193 && context_193.id;
    return {
        setters: [
            function (Object2D_49_1) {
                Object2D_49 = Object2D_49_1;
            }
        ],
        execute: function () {
            Group = class Group extends Object2D_49.Object2D {
                constructor() {
                    super();
                    this.type = "group";
                }
            };
            exports_193("Group", Group);
        }
    };
});
System.register("world/levels/signalsLevel", ["engine/Level", "world/objects/fence", "world/objects/portal", "engine/data/Tiles", "world/objects/signals/detectors/LightDetector", "world/objects/signals/Invertor", "world/objects/signals/Pipe", "world/objects/signals/Lever", "world/objects/signals/detectors/WeatherDetector", "world/objects/signals/detectors/LifeDetector", "world/objects/signals/detectors/FireDetector", "world/objects/signals/LightSource", "engine/math/Vector2", "engine/objects/Group", "world/objects/Door", "engine/math/Colors"], function (exports_194, context_194) {
    "use strict";
    var Level_17, fence_7, portal_16, Tiles_16, LightDetector_1, Invertor_2, Pipe_2, Lever_2, WeatherDetector_1, LifeDetector_1, FireDetector_1, LightSource_4, Vector2_89, Group_1, Door_3, Colors_45, fences, width, height, elements, portals, objects, signalsLevel;
    var __moduleName = context_194 && context_194.id;
    return {
        setters: [
            function (Level_17_1) {
                Level_17 = Level_17_1;
            },
            function (fence_7_1) {
                fence_7 = fence_7_1;
            },
            function (portal_16_1) {
                portal_16 = portal_16_1;
            },
            function (Tiles_16_1) {
                Tiles_16 = Tiles_16_1;
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
            function (LightSource_4_1) {
                LightSource_4 = LightSource_4_1;
            },
            function (Vector2_89_1) {
                Vector2_89 = Vector2_89_1;
            },
            function (Group_1_1) {
                Group_1 = Group_1_1;
            },
            function (Door_3_1) {
                Door_3 = Door_3_1;
            },
            function (Colors_45_1) {
                Colors_45 = Colors_45_1;
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
                    .add(new Door_3.Door({ position: [2, 0], requiresSignal: true }))
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new Lever_2.Lever({ position: [0, 0] })),
                //
                new LifeDetector_1.LifeDetector({ position: [12, 6] }),
                new Group_1.Group()
                    .translateX(8)
                    .translateY(8)
                    .add(new WeatherDetector_1.WeatherDetector({ position: [0, 0] }))
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new Door_3.Door({ position: [2, 0] })),
                new FireDetector_1.FireDetector({ position: [6, 6] }),
                //
                new Group_1.Group()
                    .translateX(11)
                    .translateY(10)
                    .add(new LightDetector_1.LightDetector({ position: [-2, 0] }))
                    .add(new Pipe_2.Pipe({ position: [-1, 0] }))
                    .add(new Invertor_2.Invertor())
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new LightSource_4.LightSource({ position: [2, 0], intensity: 'B', }))
                    .add(new Pipe_2.Pipe({ position: [0, 1] }).rotate())
                    .add(new Lever_2.Lever({ position: [0, 2] })),
                // Parent-children rotations example:
                new Group_1.Group()
                    .translateX(3)
                    .translateY(15)
                    .rotate(1)
                    .add(new LightSource_4.LightSource({ position: [2, 0], color: Colors_45.Colors.Green, intensity: 'B', }))
                    .add(new Pipe_2.Pipe({ position: [1, 0] }))
                    .add(new Lever_2.Lever({ position: [0, 0] }))
            ];
            portals = [
                portal_16.portal('signals', { position: [2, 2] }),
            ];
            objects = [...fences, ...portals, ...elements];
            exports_194("signalsLevel", signalsLevel = new class extends Level_17.Level {
                constructor() {
                    super('signals', objects, Tiles_16.Tiles.createEmpty(new Vector2_89.Vector2(width, height)));
                    this.weather.wind = new Vector2_89.Vector2(1, 1);
                }
            }());
        }
    };
});
System.register("world/levels/targetPractice", ["engine/Level", "world/objects/portal", "world/objects/house", "engine/data/Tiles", "world/objects/signals/LightSource", "world/npcs/target"], function (exports_195, context_195) {
    "use strict";
    var Level_18, portal_17, house_7, Tiles_17, LightSource_5, target_2, walls, margin, left, top, width, height, campfires, lightSources, targets, portals, objects, level, targetPracticeLevel;
    var __moduleName = context_195 && context_195.id;
    return {
        setters: [
            function (Level_18_1) {
                Level_18 = Level_18_1;
            },
            function (portal_17_1) {
                portal_17 = portal_17_1;
            },
            function (house_7_1) {
                house_7 = house_7_1;
            },
            function (Tiles_17_1) {
                Tiles_17 = Tiles_17_1;
            },
            function (LightSource_5_1) {
                LightSource_5 = LightSource_5_1;
            },
            function (target_2_1) {
                target_2 = target_2_1;
            }
        ],
        execute: function () {
            walls = [];
            margin = 1;
            left = margin;
            top = margin;
            width = 20 - margin * 2;
            height = 20 - margin * 2;
            if (true) {
                for (let x = 0; x < width; x++) {
                    const object = house_7.wall;
                    walls.push(object({ position: [margin + x, top] }));
                    walls.push(object({ position: [margin + x, margin + height - 1] }));
                }
                for (let y = 0; y < height; y++) {
                    walls.push(house_7.wall({ position: [left, margin + y] }));
                    walls.push(house_7.wall({ position: [margin + width - 1, margin + y] }));
                }
            }
            campfires = [
            //campfire({ position: [10, 13] }),
            ];
            lightSources = [
                new LightSource_5.LightSource({ position: [2, 2], requiresSignal: false }),
                new LightSource_5.LightSource({ position: [2, 17], requiresSignal: false }),
                new LightSource_5.LightSource({ position: [17, 2], requiresSignal: false }),
                new LightSource_5.LightSource({ position: [17, 17], requiresSignal: false }),
            ];
            targets = [
                target_2.target({ position: [10, 10] }),
                target_2.target({ position: [16, 16] }),
                target_2.target({ position: [6, 7] }),
            ];
            portals = [
                portal_17.portal('target_practice', { position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...portals, ...campfires, ...lightSources, ...targets];
            level = new Level_18.Level('targetPractice', objects, Tiles_17.Tiles.createEmptyDefault());
            exports_195("targetPracticeLevel", targetPracticeLevel = level);
        }
    };
});
System.register("world/npcs/turtle", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions", "engine/math/Colors", "engine/math/Color"], function (exports_196, context_196) {
    "use strict";
    var Npc_11, ObjectSkin_38, MountBehavior_2, NpcMovementOptions_5, Colors_46, Color_25, Turtle;
    var __moduleName = context_196 && context_196.id;
    return {
        setters: [
            function (Npc_11_1) {
                Npc_11 = Npc_11_1;
            },
            function (ObjectSkin_38_1) {
                ObjectSkin_38 = ObjectSkin_38_1;
            },
            function (MountBehavior_2_1) {
                MountBehavior_2 = MountBehavior_2_1;
            },
            function (NpcMovementOptions_5_1) {
                NpcMovementOptions_5 = NpcMovementOptions_5_1;
            },
            function (Colors_46_1) {
                Colors_46 = Colors_46_1;
            },
            function (Color_25_1) {
                Color_25 = Color_25_1;
            }
        ],
        execute: function () {
            Turtle = class Turtle extends Npc_11.Npc {
                constructor(position) {
                    super(new ObjectSkin_38.ObjectSkin().char(`🐢`), position);
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
                        turtle.skin.background(new Color_25.Color(Colors_46.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        turtle.skin.background(new Color_25.Color(Colors_46.Colors.Purple).setAlpha(0x55 / 0xff));
                    }
                }
            };
            exports_196("Turtle", Turtle);
        }
    };
});
System.register("world/npcs/deer", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/math/Vector2", "engine/math/Colors", "engine/math/Color"], function (exports_197, context_197) {
    "use strict";
    var Npc_12, ObjectSkin_39, MountBehavior_3, Vector2_90, Colors_47, Color_26, Deer;
    var __moduleName = context_197 && context_197.id;
    function deer(options) {
        return new Deer(Vector2_90.Vector2.from(options.position));
    }
    exports_197("deer", deer);
    return {
        setters: [
            function (Npc_12_1) {
                Npc_12 = Npc_12_1;
            },
            function (ObjectSkin_39_1) {
                ObjectSkin_39 = ObjectSkin_39_1;
            },
            function (MountBehavior_3_1) {
                MountBehavior_3 = MountBehavior_3_1;
            },
            function (Vector2_90_1) {
                Vector2_90 = Vector2_90_1;
            },
            function (Colors_47_1) {
                Colors_47 = Colors_47_1;
            },
            function (Color_26_1) {
                Color_26 = Color_26_1;
            }
        ],
        execute: function () {
            Deer = class Deer extends Npc_12.Npc {
                constructor(position) {
                    super(new ObjectSkin_39.ObjectSkin().char(`🦌`), position);
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
                        deer.skin.background(new Color_26.Color(Colors_47.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        deer.skin.background(new Color_26.Color(Colors_47.Colors.Purple).setAlpha(0x55 / 0xff));
                    }
                }
            };
            exports_197("Deer", Deer);
        }
    };
});
System.register("world/npcs/snail", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/math/Colors", "engine/math/Color"], function (exports_198, context_198) {
    "use strict";
    var Npc_13, ObjectSkin_40, MountBehavior_4, Colors_48, Color_27, Snail;
    var __moduleName = context_198 && context_198.id;
    return {
        setters: [
            function (Npc_13_1) {
                Npc_13 = Npc_13_1;
            },
            function (ObjectSkin_40_1) {
                ObjectSkin_40 = ObjectSkin_40_1;
            },
            function (MountBehavior_4_1) {
                MountBehavior_4 = MountBehavior_4_1;
            },
            function (Colors_48_1) {
                Colors_48 = Colors_48_1;
            },
            function (Color_27_1) {
                Color_27 = Color_27_1;
            }
        ],
        execute: function () {
            Snail = class Snail extends Npc_13.Npc {
                constructor(position) {
                    super(new ObjectSkin_40.ObjectSkin().char(`🐌`), position);
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
                        snail.skin.background(new Color_27.Color(Colors_48.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        snail.skin.background(new Color_27.Color(Colors_48.Colors.Purple).setAlpha(0x55 / 0xff));
                    }
                }
            };
            exports_198("Snail", Snail);
        }
    };
});
System.register("world/npcs/Fish", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "engine/objects/NpcMovementOptions"], function (exports_199, context_199) {
    "use strict";
    var Npc_14, ObjectSkin_41, WanderingBehavior_5, NpcMovementOptions_6, Fish;
    var __moduleName = context_199 && context_199.id;
    return {
        setters: [
            function (Npc_14_1) {
                Npc_14 = Npc_14_1;
            },
            function (ObjectSkin_41_1) {
                ObjectSkin_41 = ObjectSkin_41_1;
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
                    super(new ObjectSkin_41.ObjectSkin().char(`🐟`), position);
                    this.type = "fish";
                    this.realm = "water";
                    this.movementOptions = NpcMovementOptions_6.defaultMovementOptions.waterborne;
                    this.behaviors.push(new WanderingBehavior_5.WanderingBehavior());
                }
            };
            exports_199("Fish", Fish);
        }
    };
});
System.register("world/npcs/Ghost", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior"], function (exports_200, context_200) {
    "use strict";
    var Npc_15, ObjectSkin_42, WanderingBehavior_6, Ghost;
    var __moduleName = context_200 && context_200.id;
    return {
        setters: [
            function (Npc_15_1) {
                Npc_15 = Npc_15_1;
            },
            function (ObjectSkin_42_1) {
                ObjectSkin_42 = ObjectSkin_42_1;
            },
            function (WanderingBehavior_6_1) {
                WanderingBehavior_6 = WanderingBehavior_6_1;
            }
        ],
        execute: function () {
            Ghost = class Ghost extends Npc_15.Npc {
                constructor(position) {
                    super(new ObjectSkin_42.ObjectSkin().char(`👻`), position);
                    this.type = "ghost";
                    this.realm = "soul";
                    this.movementOptions = {
                        flyingSpeed: 4,
                    };
                    this.behaviors.push(new WanderingBehavior_6.WanderingBehavior());
                }
            };
            exports_200("Ghost", Ghost);
        }
    };
});
System.register("world/npcs/Dragon", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/MountBehavior", "engine/objects/NpcMovementOptions", "engine/math/Colors", "engine/math/Color"], function (exports_201, context_201) {
    "use strict";
    var Npc_16, ObjectSkin_43, MountBehavior_5, NpcMovementOptions_7, Colors_49, Color_28, Dragon;
    var __moduleName = context_201 && context_201.id;
    return {
        setters: [
            function (Npc_16_1) {
                Npc_16 = Npc_16_1;
            },
            function (ObjectSkin_43_1) {
                ObjectSkin_43 = ObjectSkin_43_1;
            },
            function (MountBehavior_5_1) {
                MountBehavior_5 = MountBehavior_5_1;
            },
            function (NpcMovementOptions_7_1) {
                NpcMovementOptions_7 = NpcMovementOptions_7_1;
            },
            function (Colors_49_1) {
                Colors_49 = Colors_49_1;
            },
            function (Color_28_1) {
                Color_28 = Color_28_1;
            }
        ],
        execute: function () {
            Dragon = class Dragon extends Npc_16.Npc {
                constructor(position) {
                    super(new ObjectSkin_43.ObjectSkin().char(`🐉`), position);
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
                        dragon.skin.background(new Color_28.Color(Colors_49.Colors.Yellow).setAlpha(0x55 / 0xff));
                    }
                    else {
                        dragon.skin.background(new Color_28.Color(Colors_49.Colors.Purple).setAlpha(0x55 / 0xff));
                    }
                }
            };
            exports_201("Dragon", Dragon);
        }
    };
});
System.register("world/npcs/Monkey", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/WanderingBehavior", "world/items"], function (exports_202, context_202) {
    "use strict";
    var Npc_17, ObjectSkin_44, WanderingBehavior_7, items_7, Monkey;
    var __moduleName = context_202 && context_202.id;
    return {
        setters: [
            function (Npc_17_1) {
                Npc_17 = Npc_17_1;
            },
            function (ObjectSkin_44_1) {
                ObjectSkin_44 = ObjectSkin_44_1;
            },
            function (WanderingBehavior_7_1) {
                WanderingBehavior_7 = WanderingBehavior_7_1;
            },
            function (items_7_1) {
                items_7 = items_7_1;
            }
        ],
        execute: function () {
            Monkey = class Monkey extends Npc_17.Npc {
                constructor(position) {
                    super(new ObjectSkin_44.ObjectSkin().char(`🐒`), position);
                    this.type = "monkey";
                    this.behaviors.push(new WanderingBehavior_7.WanderingBehavior());
                    this.inventory.items.push(new items_7.LampItem());
                    this.equipment.equip(this.inventory.items[0]);
                }
            };
            exports_202("Monkey", Monkey);
        }
    };
});
System.register("world/levels/terrain", ["engine/Level", "world/objects/portal", "engine/data/Tiles", "world/npcs/turtle", "world/npcs/deer", "world/npcs/snail", "world/tiles", "world/npcs/Fish", "world/npcs/Ghost", "world/npcs/bee", "world/npcs/Dragon", "world/npcs/Monkey", "engine/math/Vector2"], function (exports_203, context_203) {
    "use strict";
    var Level_19, portal_18, Tiles_18, turtle_1, deer_1, snail_1, tiles_8, Fish_1, Ghost_1, bee_2, Dragon_1, Monkey_1, Vector2_91, portals, mounts, npcs, objects, levelTiles, terrainLevel;
    var __moduleName = context_203 && context_203.id;
    return {
        setters: [
            function (Level_19_1) {
                Level_19 = Level_19_1;
            },
            function (portal_18_1) {
                portal_18 = portal_18_1;
            },
            function (Tiles_18_1) {
                Tiles_18 = Tiles_18_1;
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
            function (tiles_8_1) {
                tiles_8 = tiles_8_1;
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
            function (Vector2_91_1) {
                Vector2_91 = Vector2_91_1;
            }
        ],
        execute: function () {
            portals = [
                portal_18.portal('terrain_portal', { position: [2, 2] }),
            ];
            mounts = [
                new turtle_1.Turtle(Vector2_91.Vector2.from([3, 5])),
                new turtle_1.Turtle(Vector2_91.Vector2.from([9, 7])),
                new deer_1.Deer(Vector2_91.Vector2.from([2, 5])),
                new deer_1.Deer(Vector2_91.Vector2.from([3, 18])),
                new snail_1.Snail(Vector2_91.Vector2.from([1, 1])),
                new Dragon_1.Dragon(Vector2_91.Vector2.from([2, 6])),
            ];
            npcs = [
                new Fish_1.Fish(Vector2_91.Vector2.from([15, 8])),
                new Fish_1.Fish(Vector2_91.Vector2.from([8, 4])),
                new bee_2.Bee(Vector2_91.Vector2.from([3, 15])),
                new Ghost_1.Ghost(Vector2_91.Vector2.from([8, 14])),
                new Monkey_1.Monkey(Vector2_91.Vector2.from([6, 15])),
            ];
            objects = [...portals, ...mounts, ...npcs];
            levelTiles = Tiles_18.Tiles.parseTiles(`     MMMMM                       
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
                'M': tiles_8.tiles.mountain,
                'w': tiles_8.tiles.water,
                'W': tiles_8.tiles.water_deep,
                's': tiles_8.tiles.sand,
            });
            exports_203("terrainLevel", terrainLevel = new Level_19.Level('terrain', objects, levelTiles));
        }
    };
});
System.register("world/objects/particles/VolcanicGasMist", ["engine/components/ObjectSkin", "engine/data/Sprite", "engine/objects/Particle", "engine/math/Colors", "engine/math/Color"], function (exports_204, context_204) {
    "use strict";
    var ObjectSkin_45, Sprite_31, Particle_10, Colors_50, Color_29, VolcanicGasMist;
    var __moduleName = context_204 && context_204.id;
    return {
        setters: [
            function (ObjectSkin_45_1) {
                ObjectSkin_45 = ObjectSkin_45_1;
            },
            function (Sprite_31_1) {
                Sprite_31 = Sprite_31_1;
            },
            function (Particle_10_1) {
                Particle_10 = Particle_10_1;
            },
            function (Colors_50_1) {
                Colors_50 = Colors_50_1;
            },
            function (Color_29_1) {
                Color_29 = Color_29_1;
            }
        ],
        execute: function () {
            VolcanicGasMist = class VolcanicGasMist extends Particle_10.Particle {
                constructor(position) {
                    const sprite = new Sprite_31.Sprite();
                    const skin = new ObjectSkin_45.ObjectSkin().background(new Color_29.Color(Colors_50.Colors.DarkRed).setAlpha(0x22 / 0xff));
                    sprite.frames[Particle_10.Particle.defaultFrameName] = [skin];
                    super(sprite, position, 0, {
                        decaySpeed: undefined,
                    });
                    this.type = "volcanic_gas_mist";
                }
            };
            exports_204("VolcanicGasMist", VolcanicGasMist);
        }
    };
});
System.register("world/sprites/darkSmokeSprite", ["engine/data/Sprite"], function (exports_205, context_205) {
    "use strict";
    var Sprite_32, darkSmokeSpriteRaw, darkSmokeSprite;
    var __moduleName = context_205 && context_205.id;
    return {
        setters: [
            function (Sprite_32_1) {
                Sprite_32 = Sprite_32_1;
            }
        ],
        execute: function () {
            darkSmokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#333c
color:T,#0000,#444a
color:Y,#0000,#5558

particle
''''''''''
RRRRTTTYYY`;
            exports_205("darkSmokeSprite", darkSmokeSprite = Sprite_32.Sprite.parse(darkSmokeSpriteRaw));
        }
    };
});
System.register("world/objects/particles/DarkSmoke", ["engine/math/Vector2", "engine/objects/Particle", "world/sprites/darkSmokeSprite"], function (exports_206, context_206) {
    "use strict";
    var Vector2_92, Particle_11, darkSmokeSprite_1, DarkSmoke;
    var __moduleName = context_206 && context_206.id;
    return {
        setters: [
            function (Vector2_92_1) {
                Vector2_92 = Vector2_92_1;
            },
            function (Particle_11_1) {
                Particle_11 = Particle_11_1;
            },
            function (darkSmokeSprite_1_1) {
                darkSmokeSprite_1 = darkSmokeSprite_1_1;
            }
        ],
        execute: function () {
            DarkSmoke = class DarkSmoke extends Particle_11.Particle {
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
                        const newPositions = Vector2_92.Vector2.directions
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
            exports_206("DarkSmoke", DarkSmoke);
            DarkSmoke.ParticleType = "dark_smoke";
        }
    };
});
System.register("world/objects/volcanicMouth", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/math/Colors", "engine/math/Vector2", "engine/objects/Object2D", "world/objects/particles/DarkSmoke"], function (exports_207, context_207) {
    "use strict";
    var ObjectPhysics_37, ObjectSkin_46, Colors_51, Vector2_93, Object2D_50, DarkSmoke_1, VolcanicMouth;
    var __moduleName = context_207 && context_207.id;
    function volcanicMouth(options) {
        return new VolcanicMouth(Vector2_93.Vector2.from(options.position));
    }
    exports_207("volcanicMouth", volcanicMouth);
    return {
        setters: [
            function (ObjectPhysics_37_1) {
                ObjectPhysics_37 = ObjectPhysics_37_1;
            },
            function (ObjectSkin_46_1) {
                ObjectSkin_46 = ObjectSkin_46_1;
            },
            function (Colors_51_1) {
                Colors_51 = Colors_51_1;
            },
            function (Vector2_93_1) {
                Vector2_93 = Vector2_93_1;
            },
            function (Object2D_50_1) {
                Object2D_50 = Object2D_50_1;
            },
            function (DarkSmoke_1_1) {
                DarkSmoke_1 = DarkSmoke_1_1;
            }
        ],
        execute: function () {
            VolcanicMouth = class VolcanicMouth extends Object2D_50.Object2D {
                constructor(position) {
                    const skin = new ObjectSkin_46.ObjectSkin().background(Colors_51.Colors.DarkRed);
                    const physics = new ObjectPhysics_37.ObjectPhysics().light('8').temperature('F');
                    super(Vector2_93.Vector2.zero, skin, physics, position);
                    this.smokeTicks = 0;
                    this.type = "volcanic_mouth";
                }
                update(ticks) {
                    super.update(ticks);
                    this.smokeTicks += ticks;
                    const smokeTicksOverflow = this.smokeTicks - 2000;
                    if (smokeTicksOverflow >= 0) {
                        const _ = this.scene.particlesObject.tryAddParticle(new DarkSmoke_1.DarkSmoke(this.position.clone()));
                        this.smokeTicks = smokeTicksOverflow;
                    }
                }
            };
            exports_207("VolcanicMouth", VolcanicMouth);
        }
    };
});
System.register("world/objects/volcano", ["engine/objects/Object2D", "engine/data/ObjectSkinBuilder", "engine/data/ObjectPhysicsBuilder", "engine/math/Vector2", "engine/math/Colors"], function (exports_208, context_208) {
    "use strict";
    var Object2D_51, ObjectSkinBuilder_9, ObjectPhysicsBuilder_5, Vector2_94, Colors_52;
    var __moduleName = context_208 && context_208.id;
    function volcano(options) {
        return new Object2D_51.Object2D(new Vector2_94.Vector2(0, 2), new ObjectSkinBuilder_9.ObjectSkinBuilder(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: [Colors_52.Colors.Black, Colors_52.Colors.DarkRed],
            o: [Colors_52.Colors.Black, Colors_52.Colors.SaddleBrown]
        }).build(), new ObjectPhysicsBuilder_5.ObjectPhysicsBuilder(`        
 ...... 
........`).build(), Vector2_94.Vector2.from(options.position));
    }
    exports_208("volcano", volcano);
    return {
        setters: [
            function (Object2D_51_1) {
                Object2D_51 = Object2D_51_1;
            },
            function (ObjectSkinBuilder_9_1) {
                ObjectSkinBuilder_9 = ObjectSkinBuilder_9_1;
            },
            function (ObjectPhysicsBuilder_5_1) {
                ObjectPhysicsBuilder_5 = ObjectPhysicsBuilder_5_1;
            },
            function (Vector2_94_1) {
                Vector2_94 = Vector2_94_1;
            },
            function (Colors_52_1) {
                Colors_52 = Colors_52_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/volcanicLevel", ["engine/Level", "world/objects/fence", "world/objects/portal", "engine/data/Tiles", "world/objects/particles/VolcanicGasMist", "world/objects/volcanicMouth", "world/objects/volcano", "engine/math/Vector2"], function (exports_209, context_209) {
    "use strict";
    var Level_20, fence_8, portal_19, Tiles_19, VolcanicGasMist_1, volcanicMouth_1, volcano_1, Vector2_95, fences, width, height, trees, volcanoes, fires, portals, objects, volcanicLevel;
    var __moduleName = context_209 && context_209.id;
    return {
        setters: [
            function (Level_20_1) {
                Level_20 = Level_20_1;
            },
            function (fence_8_1) {
                fence_8 = fence_8_1;
            },
            function (portal_19_1) {
                portal_19 = portal_19_1;
            },
            function (Tiles_19_1) {
                Tiles_19 = Tiles_19_1;
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
            function (Vector2_95_1) {
                Vector2_95 = Vector2_95_1;
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
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([12, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([12, 13])),
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([13, 12])),
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([13, 13])),
                //
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([10, 5])),
                new volcanicMouth_1.VolcanicMouth(Vector2_95.Vector2.from([3, 16])),
            ];
            portals = [
                portal_19.portal('volcanic', { position: [2, 2] }),
            ];
            objects = [...fences, ...portals, ...trees, ...volcanoes, ...fires];
            exports_209("volcanicLevel", volcanicLevel = new class extends Level_20.Level {
                constructor() {
                    super('volcanic', objects, Tiles_19.Tiles.createEmpty(new Vector2_95.Vector2(width, height)));
                    this.weather.wind = new Vector2_95.Vector2(1, 0);
                    this.defaultTemperatureAtDay = 10;
                    this.defaultTemperatureAtNight = 8;
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
                            const p = new Vector2_95.Vector2(x, y);
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
System.register("world/levels/levels", ["world/levels/bridgeLevel", "world/levels/desert", "world/levels/devHub", "world/levels/dungeon", "world/levels/effectsLevel", "world/levels/ggj2020demo/level", "world/levels/house", "world/levels/hugeTreeLevel", "world/levels/icebergLevel", "world/levels/intro", "world/levels/lights", "world/levels/mistlandLevel", "world/levels/particlesLevel", "world/levels/sheep", "world/levels/signalLightsLevel", "world/levels/signalsLevel", "world/levels/targetPractice", "world/levels/terrain", "world/levels/volcanicLevel"], function (exports_210, context_210) {
    "use strict";
    var bridgeLevel_1, desert_1, devHub_1, dungeon_1, effectsLevel_1, level_1, house_8, hugeTreeLevel_1, icebergLevel_1, intro_1, lights_1, mistlandLevel_1, particlesLevel_1, sheep_3, signalLightsLevel_1, signalsLevel_1, targetPractice_1, terrain_1, volcanicLevel_1, dict, rawLevels, levels;
    var __moduleName = context_210 && context_210.id;
    return {
        setters: [
            function (bridgeLevel_1_1) {
                bridgeLevel_1 = bridgeLevel_1_1;
            },
            function (desert_1_1) {
                desert_1 = desert_1_1;
            },
            function (devHub_1_1) {
                devHub_1 = devHub_1_1;
            },
            function (dungeon_1_1) {
                dungeon_1 = dungeon_1_1;
            },
            function (effectsLevel_1_1) {
                effectsLevel_1 = effectsLevel_1_1;
            },
            function (level_1_1) {
                level_1 = level_1_1;
            },
            function (house_8_1) {
                house_8 = house_8_1;
            },
            function (hugeTreeLevel_1_1) {
                hugeTreeLevel_1 = hugeTreeLevel_1_1;
            },
            function (icebergLevel_1_1) {
                icebergLevel_1 = icebergLevel_1_1;
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
            function (targetPractice_1_1) {
                targetPractice_1 = targetPractice_1_1;
            },
            function (terrain_1_1) {
                terrain_1 = terrain_1_1;
            },
            function (volcanicLevel_1_1) {
                volcanicLevel_1 = volcanicLevel_1_1;
            }
        ],
        execute: function () {
            dict = {
                devHubLevel: devHub_1.devHubLevel,
                introLevel: intro_1.introLevel,
                lightsLevel: lights_1.lightsLevel,
                sheepLevel: sheep_3.sheepLevel,
                level: level_1.level,
                dungeonLevel: dungeon_1.dungeonLevel,
                houseLevel: house_8.houseLevel,
                terrainLevel: terrain_1.terrainLevel,
                particlesLevel: particlesLevel_1.particlesLevel,
                mistlandLevel: mistlandLevel_1.mistlandLevel,
                volcanicLevel: volcanicLevel_1.volcanicLevel,
                signalsLevel: signalsLevel_1.signalsLevel,
                signalLightsLevel: signalLightsLevel_1.signalLightsLevel,
                effectsLevel: effectsLevel_1.effectsLevel,
                targetPracticeLevel: targetPractice_1.targetPracticeLevel,
                bridgeLevel: bridgeLevel_1.bridgeLevel,
                icebergLevel: icebergLevel_1.icebergLevel,
                hugeTreeLevel: hugeTreeLevel_1.hugeTreeLevel,
                desertLevel: desert_1.desertLevel,
            };
            exports_210("rawLevels", rawLevels = dict);
            exports_210("levels", levels = {});
            for (const item of Object.values(dict)) {
                levels[item.name] = item;
            }
        }
    };
});
System.register("world/events/LoadLevelGameEvent", ["engine/events/GameEvent"], function (exports_211, context_211) {
    "use strict";
    var GameEvent_12, LoadLevelGameEvent;
    var __moduleName = context_211 && context_211.id;
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
            })(LoadLevelGameEvent || (exports_211("LoadLevelGameEvent", LoadLevelGameEvent = {})));
        }
    };
});
System.register("world/events/TeleportToPositionGameEvent", ["engine/events/GameEvent"], function (exports_212, context_212) {
    "use strict";
    var GameEvent_13, TeleportToPositionGameEvent;
    var __moduleName = context_212 && context_212.id;
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
            })(TeleportToPositionGameEvent || (exports_212("TeleportToPositionGameEvent", TeleportToPositionGameEvent = {})));
        }
    };
});
System.register("ui/UIText", ["utils/misc", "ui/UIElement"], function (exports_213, context_213) {
    "use strict";
    var misc_3, UIElement_8, UIText;
    var __moduleName = context_213 && context_213.id;
    return {
        setters: [
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (UIElement_8_1) {
                UIElement_8 = UIElement_8_1;
            }
        ],
        execute: function () {
            UIText = class UIText extends UIElement_8.UIElement {
                constructor(parent, text = '', color, background) {
                    super(parent);
                    this.text = text;
                    this.color = color;
                    this.background = background;
                    this.skin = misc_3.createTextObjectSkin(text, color, background);
                }
            };
            exports_213("UIText", UIText);
        }
    };
});
System.register("ui/UIItem", ["engine/math/Vector2", "engine/graphics/Cell", "ui/UIElement", "ui/UISceneObject", "ui/UIText", "engine/components/ObjectSkin", "engine/math/Grid", "engine/math/Colors", "engine/data/CellSprite"], function (exports_214, context_214) {
    "use strict";
    var Vector2_96, Cell_10, UIElement_9, UISceneObject_2, UIText_1, ObjectSkin_47, Grid_13, Colors_53, CellSprite_10, UIItem;
    var __moduleName = context_214 && context_214.id;
    return {
        setters: [
            function (Vector2_96_1) {
                Vector2_96 = Vector2_96_1;
            },
            function (Cell_10_1) {
                Cell_10 = Cell_10_1;
            },
            function (UIElement_9_1) {
                UIElement_9 = UIElement_9_1;
            },
            function (UISceneObject_2_1) {
                UISceneObject_2 = UISceneObject_2_1;
            },
            function (UIText_1_1) {
                UIText_1 = UIText_1_1;
            },
            function (ObjectSkin_47_1) {
                ObjectSkin_47 = ObjectSkin_47_1;
            },
            function (Grid_13_1) {
                Grid_13 = Grid_13_1;
            },
            function (Colors_53_1) {
                Colors_53 = Colors_53_1;
            },
            function (CellSprite_10_1) {
                CellSprite_10 = CellSprite_10_1;
            }
        ],
        execute: function () {
            UIItem = class UIItem extends UIElement_9.UIElement {
                constructor(parent, item, position) {
                    super(parent);
                    this.item = item;
                    this.isSelected = false;
                    this.position = position;
                    this.uiObject = new UISceneObject_2.UISceneObject(this, item);
                    this.uiText = new UIText_1.UIText(this, item.type, Colors_53.Colors.White, Colors_53.Colors.Transparent);
                    this.uiText.position = new Vector2_96.Vector2(1, 0);
                }
                update(ticks) {
                    super.update(ticks);
                    this.skin = this.createBackground();
                }
                createBackground() {
                    const cells = [];
                    const actualWidth = 1 + this.uiText.text.length;
                    for (let x = 0; x < actualWidth; x++) {
                        const cell = new Cell_10.Cell(CellSprite_10.CellSprite.empty, undefined, Colors_53.Colors.Transparent);
                        if (this.isSelected) {
                            cell.backgroundColor = Colors_53.Colors.Gray;
                            const borders = {
                                3: Colors_53.Colors.White,
                                0: x === actualWidth - 1 ? Colors_53.Colors.White : Colors_53.Colors.Transparent,
                                1: Colors_53.Colors.White,
                                2: x === 0 ? Colors_53.Colors.White : Colors_53.Colors.Transparent
                            };
                            cell.options.border = borders;
                        }
                        cells.push(cell);
                    }
                    const skin = new ObjectSkin_47.ObjectSkin(Grid_13.Grid.from([cells]));
                    return skin;
                }
            };
            exports_214("UIItem", UIItem);
        }
    };
});
System.register("ui/UIEquipment", ["engine/math/Vector2", "engine/graphics/Cell", "ui/UIElement", "engine/components/ObjectSkin", "engine/math/Grid", "engine/objects/EquipmentTags", "engine/math/Colors", "engine/math/Color", "engine/data/CellSprite"], function (exports_215, context_215) {
    "use strict";
    var Vector2_97, Cell_11, UIElement_10, ObjectSkin_48, Grid_14, EquipmentTags_3, Colors_54, Color_30, CellSprite_11, UIEquipment;
    var __moduleName = context_215 && context_215.id;
    return {
        setters: [
            function (Vector2_97_1) {
                Vector2_97 = Vector2_97_1;
            },
            function (Cell_11_1) {
                Cell_11 = Cell_11_1;
            },
            function (UIElement_10_1) {
                UIElement_10 = UIElement_10_1;
            },
            function (ObjectSkin_48_1) {
                ObjectSkin_48 = ObjectSkin_48_1;
            },
            function (Grid_14_1) {
                Grid_14 = Grid_14_1;
            },
            function (EquipmentTags_3_1) {
                EquipmentTags_3 = EquipmentTags_3_1;
            },
            function (Colors_54_1) {
                Colors_54 = Colors_54_1;
            },
            function (Color_30_1) {
                Color_30 = Color_30_1;
            },
            function (CellSprite_11_1) {
                CellSprite_11 = CellSprite_11_1;
            }
        ],
        execute: function () {
            UIEquipment = class UIEquipment extends UIElement_10.UIElement {
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
                    const defaultCell = new Cell_11.Cell(CellSprite_11.CellSprite.empty, undefined, Colors_54.Colors.Transparent);
                    const cells = new Grid_14.Grid(new Vector2_97.Vector2(1, this.uiItems.length))
                        .fill(v => {
                        const uiItem = this.uiItems[v.y];
                        const item = uiItem.item;
                        const isSelected = uiItem.isSelected;
                        return (createEquipmentCell(item, this.object) ||
                            (isSelected ? createEquipmentCategoryCell(item) : undefined) ||
                            defaultCell);
                    });
                    return new ObjectSkin_48.ObjectSkin(cells);
                    function createEquipmentCell(item, object) {
                        if (item === object.equipment.objectInMainHand) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('✋'), undefined, Colors_54.Colors.Transparent);
                        }
                        else if (item === object.equipment.objectWearable) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('👕'), undefined, Colors_54.Colors.Transparent);
                        }
                        else if (item === object.equipment.ring) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('⭕'), undefined, Colors_54.Colors.Transparent);
                        }
                        else if (item === object.equipment.objectSpecial) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('💎'), undefined, Colors_54.Colors.Transparent);
                        }
                        return undefined;
                    }
                    function createEquipmentCategoryCell(item) {
                        const color = new Color_30.Color(Colors_54.Colors.Black).setAlpha(0x22 / 0xff);
                        if (EquipmentTags_3.EquipmentTags.isHandheld in item) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('✋'), color, Colors_54.Colors.Transparent);
                        }
                        else if (EquipmentTags_3.EquipmentTags.isWearable in item) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('👕'), color, Colors_54.Colors.Transparent);
                        }
                        else if (EquipmentTags_3.EquipmentTags.isRing in item) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('⭕'), color, Colors_54.Colors.Transparent);
                        }
                        else if (EquipmentTags_3.EquipmentTags.isSpecial in item) {
                            return new Cell_11.Cell(CellSprite_11.CellSprite.fromChar('💎'), color, Colors_54.Colors.Transparent);
                        }
                        return undefined;
                    }
                }
            };
            exports_215("UIEquipment", UIEquipment);
        }
    };
});
System.register("ui/UIDialog", ["controls", "engine/math/Vector2", "ui/UIElement", "ui/UIPanel"], function (exports_216, context_216) {
    "use strict";
    var controls_1, Vector2_98, UIElement_11, UIPanel_2, UIDialog;
    var __moduleName = context_216 && context_216.id;
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (Vector2_98_1) {
                Vector2_98 = Vector2_98_1;
            },
            function (UIElement_11_1) {
                UIElement_11 = UIElement_11_1;
            },
            function (UIPanel_2_1) {
                UIPanel_2 = UIPanel_2_1;
            }
        ],
        execute: function () {
            UIDialog = class UIDialog extends UIElement_11.UIElement {
                constructor(size, parent = null) {
                    super(parent);
                    this.close();
                    this.uiPanel = new UIPanel_2.UIPanel(this, new Vector2_98.Vector2(), size);
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
            exports_216("UIDialog", UIDialog);
        }
    };
});
System.register("ui/UIInventory", ["controls", "engine/math/Vector2", "engine/objects/Npc", "ui/UIItem", "ui/UIEquipment", "ui/UIDialog"], function (exports_217, context_217) {
    "use strict";
    var controls_2, Vector2_99, Npc_18, UIItem_1, UIEquipment_1, UIDialog_1, UIInventory;
    var __moduleName = context_217 && context_217.id;
    return {
        setters: [
            function (controls_2_1) {
                controls_2 = controls_2_1;
            },
            function (Vector2_99_1) {
                Vector2_99 = Vector2_99_1;
            },
            function (Npc_18_1) {
                Npc_18 = Npc_18_1;
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
                constructor(object, cameraSize) {
                    const dialogWidth = cameraSize.width;
                    const dialogHeight = cameraSize.height / 2;
                    const position = new Vector2_99.Vector2(0, cameraSize.height - dialogHeight);
                    const size = new Vector2_99.Vector2(dialogWidth, dialogHeight);
                    super(size, null);
                    this.object = object;
                    this.cameraSize = cameraSize;
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
                        this.selectedItemIndex = (this.selectedItemIndex + 1) % this.uiItems.length;
                        controls_2.Controls.Down.isHandled = true;
                    }
                    if (controls_2.Controls.Up.isDown && !controls_2.Controls.Up.isHandled) {
                        this.selectedItemIndex = (this.selectedItemIndex - 1 + this.uiItems.length) % this.uiItems.length;
                        controls_2.Controls.Up.isHandled = true;
                    }
                    if (controls_2.Controls.Interact.isDown && !controls_2.Controls.Interact.isHandled) {
                        if (this.object instanceof Npc_18.Npc) {
                            this.object.equipment.equip(this.selectedItem);
                        }
                        controls_2.Controls.Interact.isHandled = true;
                    }
                    if (controls_2.Controls.Inventory.isDown && !controls_2.Controls.Inventory.isHandled) {
                        this.close();
                        controls_2.Controls.Inventory.isHandled = true;
                    }
                    if (prevSelectedIndex !== this.selectedItemIndex) {
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
                        const uiItem = new UIItem_1.UIItem(this.uiPanel, item, new Vector2_99.Vector2(2, 1 + index));
                        uiItem.isSelected = index === this.selectedItemIndex;
                        this.uiItems.push(uiItem);
                        index += 1;
                    }
                    this.uiEquipment.removeFromParent();
                    this.uiEquipment = new UIEquipment_1.UIEquipment(this.uiPanel, this.object, this.uiItems);
                    this.uiEquipment.position = new Vector2_99.Vector2(1, 1);
                }
            };
            exports_217("UIInventory", UIInventory);
        }
    };
});
System.register("ui/UIKeysDialog", ["controls", "engine/math/Colors", "engine/math/Vector2", "ui/UIDialog", "ui/UIText"], function (exports_218, context_218) {
    "use strict";
    var controls_3, Colors_55, Vector2_100, UIDialog_2, UIText_2, UIKeysDialog;
    var __moduleName = context_218 && context_218.id;
    return {
        setters: [
            function (controls_3_1) {
                controls_3 = controls_3_1;
            },
            function (Colors_55_1) {
                Colors_55 = Colors_55_1;
            },
            function (Vector2_100_1) {
                Vector2_100 = Vector2_100_1;
            },
            function (UIDialog_2_1) {
                UIDialog_2 = UIDialog_2_1;
            },
            function (UIText_2_1) {
                UIText_2 = UIText_2_1;
            }
        ],
        execute: function () {
            UIKeysDialog = class UIKeysDialog extends UIDialog_2.UIDialog {
                constructor(cameraSize) {
                    const dialogWidth = cameraSize.width;
                    const dialogHeight = cameraSize.height;
                    const position = new Vector2_100.Vector2(0, cameraSize.height - dialogHeight);
                    const size = new Vector2_100.Vector2(dialogWidth, dialogHeight);
                    super(size, null);
                    this.uiTexts = [];
                    this.position = position;
                    this.refresh();
                }
                handleControls() {
                    super.handleControls();
                    if (controls_3.Controls.Keys.isDown && !controls_3.Controls.Keys.isHandled) {
                        this.close();
                        controls_3.Controls.Keys.isHandled = true;
                    }
                }
                refresh() {
                    for (const text of this.uiTexts) {
                        text.removeFromParent();
                    }
                    this.uiTexts = [];
                    const controlEntries = Object.entries(controls_3.Controls);
                    let y = 2;
                    const title = new UIText_2.UIText(this.uiPanel, "Controls", Colors_55.Colors.Yellow, Colors_55.Colors.Transparent);
                    title.position = new Vector2_100.Vector2(2, 1);
                    this.uiTexts.push(title);
                    for (const [name, control] of controlEntries) {
                        const keyName = this.formatKeyCode(control.code);
                        const text = `${name.padEnd(10)} ${keyName}`;
                        const uiText = new UIText_2.UIText(this.uiPanel, text, Colors_55.Colors.White, Colors_55.Colors.Transparent);
                        uiText.position = new Vector2_100.Vector2(2, y);
                        this.uiTexts.push(uiText);
                        y += 1;
                    }
                }
                formatKeyCode(code) {
                    if (code.startsWith("Key")) {
                        return code.substring(3);
                    }
                    return code.toUpperCase();
                }
            };
            exports_218("UIKeysDialog", UIKeysDialog);
        }
    };
});
System.register("ui/UILockPicking", ["controls", "engine/math/Vector2", "ui/UIDialog", "ui/UIElement", "engine/components/ObjectSkin", "engine/graphics/Cell", "engine/math/Grid", "ui/UIText", "engine/math/Colors", "engine/data/CellSprite"], function (exports_219, context_219) {
    "use strict";
    var controls_4, Vector2_101, UIDialog_3, UIElement_12, ObjectSkin_49, Cell_12, Grid_15, UIText_3, Colors_56, CellSprite_12, UILock, UILockPicking;
    var __moduleName = context_219 && context_219.id;
    return {
        setters: [
            function (controls_4_1) {
                controls_4 = controls_4_1;
            },
            function (Vector2_101_1) {
                Vector2_101 = Vector2_101_1;
            },
            function (UIDialog_3_1) {
                UIDialog_3 = UIDialog_3_1;
            },
            function (UIElement_12_1) {
                UIElement_12 = UIElement_12_1;
            },
            function (ObjectSkin_49_1) {
                ObjectSkin_49 = ObjectSkin_49_1;
            },
            function (Cell_12_1) {
                Cell_12 = Cell_12_1;
            },
            function (Grid_15_1) {
                Grid_15 = Grid_15_1;
            },
            function (UIText_3_1) {
                UIText_3 = UIText_3_1;
            },
            function (Colors_56_1) {
                Colors_56 = Colors_56_1;
            },
            function (CellSprite_12_1) {
                CellSprite_12 = CellSprite_12_1;
            }
        ],
        execute: function () {
            UILock = class UILock extends UIElement_12.UIElement {
                constructor(parent, pauseDurationTicks, activeDurationTicks) {
                    super(parent);
                    this.pauseDurationTicks = pauseDurationTicks;
                    this.activeDurationTicks = activeDurationTicks;
                    this.isActive = false;
                    this.isSelected = false;
                    this.isUnlocked = false;
                    this.isFailed = false;
                }
                update(ticks) {
                    super.update(ticks);
                    if (!this.isUnlocked && !this.isFailed) {
                        this.isActive = this.ticks % (this.pauseDurationTicks + this.activeDurationTicks) >= this.pauseDurationTicks;
                    }
                    this.skin = this.createBackground();
                }
                createBackground() {
                    const cells = [];
                    const icon = this.isUnlocked ? '🔓' : '🔒';
                    const color = this.isUnlocked
                        ? Colors_56.Colors.Green
                        : !this.isSelected
                            ? Colors_56.Colors.Gray
                            : this.isActive
                                ? Colors_56.Colors.Yellow
                                : Colors_56.Colors.Red;
                    cells[0] = [new Cell_12.Cell(CellSprite_12.CellSprite.fromChar(icon), undefined, color)];
                    const indicator = this.isSelected ? '^' : ' ';
                    cells[1] = [new Cell_12.Cell(CellSprite_12.CellSprite.fromChar(indicator), Colors_56.Colors.White, Colors_56.Colors.Transparent)];
                    const skin = new ObjectSkin_49.ObjectSkin(Grid_15.Grid.from(cells));
                    return skin;
                }
            };
            UILockPicking = class UILockPicking extends UIDialog_3.UIDialog {
                constructor(object, cameraSize) {
                    const dialogWidth = cameraSize.width;
                    const dialogHeight = cameraSize.height;
                    const position = new Vector2_101.Vector2(0, cameraSize.height - dialogHeight);
                    const size = new Vector2_101.Vector2(dialogWidth, dialogHeight);
                    super(size, null);
                    this.object = object;
                    this.cameraSize = cameraSize;
                    this.uiLocks = [];
                    this.state = 'picking';
                    this.selectedLockIndex = -1;
                    this.position = position;
                    this.selectedLockIndex = 0;
                    const x = 7;
                    const y = this.uiPanel.size.y / 2;
                    this.unlockedTitle = new UIText_3.UIText(this.uiPanel, "Unlocked", Colors_56.Colors.Green, Colors_56.Colors.Transparent);
                    this.unlockedTitle.position = new Vector2_101.Vector2(x - 1, y + 2);
                    this.failedTitle = new UIText_3.UIText(this.uiPanel, "Failed", Colors_56.Colors.Red, Colors_56.Colors.Transparent);
                    this.failedTitle.position = new Vector2_101.Vector2(x, y + 2);
                }
                handleControls() {
                    super.handleControls();
                    if (this.state === 'picking') {
                        const prevSelectedIndex = this.selectedLockIndex;
                        const currentLock = this.uiLocks[this.selectedLockIndex];
                        currentLock.isSelected = true;
                        if (controls_4.Controls.Interact.isDown && !controls_4.Controls.Interact.isHandled) {
                            currentLock.isUnlocked = currentLock.isActive;
                            currentLock.isFailed = !currentLock.isActive;
                            this.selectedLockIndex += currentLock.isUnlocked ? 1 : 0;
                            if (!currentLock.isUnlocked) {
                                this.state = 'failed';
                            }
                            else if (this.selectedLockIndex >= this.uiLocks.length) {
                                this.selectedLockIndex = this.uiLocks.length - 1;
                                this.state = 'success';
                            }
                            controls_4.Controls.Interact.isHandled = true;
                        }
                        if (prevSelectedIndex !== this.selectedLockIndex) {
                            this.uiLocks[prevSelectedIndex].isSelected = false;
                            this.uiLocks[this.selectedLockIndex].isSelected = true;
                        }
                    }
                    else if (this.state === 'failed' || this.state === 'success') {
                        const title = this.state === 'failed' ? this.failedTitle : this.unlockedTitle;
                        title.visible = true;
                        if (controls_4.Controls.Interact.isDown && !controls_4.Controls.Interact.isHandled) {
                            this.close();
                            controls_4.Controls.Interact.isHandled = true;
                        }
                    }
                }
                refresh() {
                    this.uiLocks = [];
                    for (const child of [...this.uiPanel.children]) {
                        this.uiPanel.remove(child);
                    }
                    const locks = [
                        new UILock(this.uiPanel, 1500, 450),
                        new UILock(this.uiPanel, 1000, 250),
                        new UILock(this.uiPanel, 500, 150),
                        new UILock(this.uiPanel, 500, 250),
                    ];
                    const borderWidth = 1;
                    const x = (this.uiPanel.size.width - this.uiLocks.length) / 2 - borderWidth * 2;
                    const y = this.uiPanel.size.y / 2;
                    this.uiLocks.push(...locks.map((lock, index) => lock.translateX(x + index).translateY(y)));
                    const title = new UIText_3.UIText(this.uiPanel, "Pick the lock", Colors_56.Colors.White, Colors_56.Colors.Transparent);
                    title.position = new Vector2_101.Vector2(3, y - 2);
                    this.uiPanel.add(title);
                    this.uiPanel.add(this.unlockedTitle);
                    this.uiPanel.add(this.failedTitle);
                    this.unlockedTitle.visible = false;
                    this.failedTitle.visible = false;
                    this.state = 'picking';
                    this.selectedLockIndex = 0;
                }
            };
            exports_219("UILockPicking", UILockPicking);
        }
    };
});
System.register("ui/UIDebugPanel", ["engine/math/Vector2", "ui/UIPanel", "ui/UIText", "engine/math/Color", "utils/misc"], function (exports_220, context_220) {
    "use strict";
    var Vector2_102, UIPanel_3, UIText_4, Color_31, misc_4, UIDebugPanel;
    var __moduleName = context_220 && context_220.id;
    return {
        setters: [
            function (Vector2_102_1) {
                Vector2_102 = Vector2_102_1;
            },
            function (UIPanel_3_1) {
                UIPanel_3 = UIPanel_3_1;
            },
            function (UIText_4_1) {
                UIText_4 = UIText_4_1;
            },
            function (Color_31_1) {
                Color_31 = Color_31_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            }
        ],
        execute: function () {
            UIDebugPanel = class UIDebugPanel extends UIPanel_3.UIPanel {
                constructor(parent, position) {
                    const size = new Vector2_102.Vector2(12, 4);
                    super(parent, position, size);
                    this.frameCount = 0;
                    this.updateCount = 0;
                    this.lastTime = 0;
                    this.fps = 0;
                    this.ups = 0;
                    // Hide by default
                    this.visible = false;
                    // Create FPS text
                    this.fpsText = new UIText_4.UIText(this, "FPS: 0", Color_31.Color.fromHexString('#00FF00'), undefined);
                    this.fpsText.position = new Vector2_102.Vector2(1, 1);
                    // Create UPS text
                    this.upsText = new UIText_4.UIText(this, "UPS: 0", Color_31.Color.fromHexString('#00FFFF'), undefined);
                    this.upsText.position = new Vector2_102.Vector2(1, 2);
                }
                toggle() {
                    this.visible = !this.visible;
                }
                update(ticks) {
                    super.update(ticks);
                    // Update the counter for updates per second
                    this.updateCount++;
                }
                // Called when a frame is rendered
                onFrameRendered() {
                    this.frameCount++;
                    const currentTime = performance.now();
                    // Calculate FPS and UPS every second
                    if (this.lastTime === 0) {
                        this.lastTime = currentTime;
                    }
                    const elapsed = currentTime - this.lastTime;
                    if (elapsed >= 1000) {
                        this.fps = Math.round((this.frameCount * 1000) / elapsed);
                        this.ups = Math.round((this.updateCount * 1000) / elapsed);
                        // Update text displays
                        this.fpsText.text = `FPS: ${this.fps}`;
                        this.upsText.text = `UPS: ${this.ups}`;
                        // Recreate skins with new text
                        this.fpsText.skin = misc_4.createTextObjectSkin(this.fpsText.text, this.fpsText.color, undefined);
                        this.upsText.skin = misc_4.createTextObjectSkin(this.upsText.text, this.upsText.color, undefined);
                        // Reset counters
                        this.frameCount = 0;
                        this.updateCount = 0;
                        this.lastTime = currentTime;
                    }
                }
            };
            exports_220("UIDebugPanel", UIDebugPanel);
        }
    };
});
System.register("main", ["engine/events/GameEvent", "engine/events/EventLoop", "engine/Scene", "engine/ActionData", "engine/graphics/cellStyle", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "engine/Level", "engine/weather/WeatherType", "world/levels/levels", "world/levels/devHub", "world/events/TeleportToEndpointGameEvent", "controls", "world/events/MountGameEvent", "world/events/PlayerMessageGameEvent", "world/events/AddObjectGameEvent", "world/events/TransferItemsGameEvent", "utils/misc", "world/events/LoadLevelGameEvent", "world/events/RemoveObjectGameEvent", "world/events/TeleportToPositionGameEvent", "ui/UIInventory", "ui/UIDialog", "ui/UIKeysDialog", "engine/math/Vector2", "engine/renderers/CanvasRenderer", "engine/cameras/Camera", "engine/cameras/FollowCamera", "world/items", "ui/UILockPicking", "world/objects/chest", "engine/math/Vector3", "ui/UIDebugPanel"], function (exports_221, context_221) {
    "use strict";
    var GameEvent_14, EventLoop_9, Scene_2, ActionData_3, cellStyle_2, CanvasContext_1, hero_2, playerUi_1, Level_21, WeatherType_1, levels_1, devHub_2, TeleportToEndpointGameEvent_2, controls_5, MountGameEvent_2, PlayerMessageGameEvent_2, AddObjectGameEvent_2, TransferItemsGameEvent_3, misc_5, LoadLevelGameEvent_1, RemoveObjectGameEvent_3, TeleportToPositionGameEvent_1, UIInventory_1, UIDialog_4, UIKeysDialog_1, Vector2_103, CanvasRenderer_1, Camera_2, FollowCamera_2, items_8, UILockPicking_1, chest_3, Vector3_10, UIDebugPanel_1, camera, canvasSize, canvas, ctx, renderer, ui, dialog, uiInventory, uiKeysDialog, uiLockPicking, debugPanel, Game, game, scene, debug, heroUi, start, previousTimeStamp;
    var __moduleName = context_221 && context_221.id;
    function loadLevel(level) {
        scene = level;
        hero_2.hero.position = new Vector2_103.Vector2(9, 7);
        camera = new FollowCamera_2.FollowCamera(hero_2.hero, level.size);
        camera.add(ui);
        level.onLoaded();
    }
    function teleportToEndpoint(portalId, teleport, object) {
        const portalPositions = scene.portals[portalId];
        if ((portalPositions === null || portalPositions === void 0 ? void 0 : portalPositions.length) === 2) {
            // Pair portal is on the same level.
            const teleportPosition = teleport.getWorldPosition(new Vector2_103.Vector2());
            const portalPositionIndex = portalPositions
                .findIndex(x => x.equals(teleportPosition));
            const pairPortalPosition = portalPositions[(portalPositionIndex + 1) % 2];
            const teleportedObjectPosition = pairPortalPosition.clone().add(new Vector2_103.Vector2(0, 1));
            teleportTo(scene.name, teleportedObjectPosition);
        }
        else {
            // Find other level with this portal id.
            const pairPortals = Object.entries(levels_1.levels)
                .filter(([levelId, _]) => levelId !== scene.name)
                .filter(([___, level]) => { var _a; return ((_a = level.portals[portalId]) === null || _a === void 0 ? void 0 : _a.length) === 1; })
                .map(([levelId, level]) => ({ levelId, position: level.portals[portalId][0] }));
            if ((pairPortals === null || pairPortals === void 0 ? void 0 : pairPortals.length) !== 0) {
                const pairPortal = pairPortals[0];
                const position = pairPortal.position.clone().add(new Vector2_103.Vector2(0, 1));
                teleportTo(pairPortal.levelId, position);
            }
            else {
                console.log(`Pair portal for "${portalId}" was not found.`);
            }
        }
        function teleportTo(levelId, position) {
            if (levelId !== scene.name) {
                selectLevel(scene, levels_1.levels[levelId]);
            }
            EventLoop_9.emitEvent(TeleportToPositionGameEvent_1.TeleportToPositionGameEvent.create(object, position));
        }
    }
    function selectLevel(prevLevel, level) {
        console.log(`Selecting level "${level.name}".`);
        if (prevLevel) {
            EventLoop_9.emitEvent(RemoveObjectGameEvent_3.RemoveObjectGameEvent.create(hero_2.hero));
        }
        EventLoop_9.emitEvent(LoadLevelGameEvent_1.LoadLevelGameEvent.create(level));
        EventLoop_9.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(hero_2.hero));
    }
    function handleControls() {
        // TODO: opened dialogs stack?
        if (dialog.enabled) {
            dialog.handleControls();
        }
        else if (uiKeysDialog.enabled) {
            uiKeysDialog.handleControls();
        }
        else if (uiLockPicking.enabled) {
            uiLockPicking.handleControls();
        }
        else if (uiInventory.enabled) {
            uiInventory.handleControls();
        }
        else {
            handleSceneControls();
        }
    }
    function handleSceneControls() {
        const controlObject = hero_2.hero;
        let doMove = false;
        if (controls_5.Controls.Up.isDown) {
            controlObject.lookAt(Vector2_103.Vector2.top);
            doMove = !controls_5.Controls.Up.isShiftDown;
        }
        else if (controls_5.Controls.Down.isDown) {
            controlObject.lookAt(Vector2_103.Vector2.bottom);
            doMove = !controls_5.Controls.Down.isShiftDown;
        }
        else if (controls_5.Controls.Left.isDown) {
            controlObject.lookAt(Vector2_103.Vector2.left);
            doMove = !controls_5.Controls.Left.isShiftDown;
        }
        else if (controls_5.Controls.Right.isDown) {
            controlObject.lookAt(Vector2_103.Vector2.right);
            doMove = !controls_5.Controls.Right.isShiftDown;
        }
        if (doMove) {
            const position = controlObject.getWorldCursorPosition(new Vector2_103.Vector2());
            const position3 = new Vector3_10.Vector3(position.x, position.y, 0);
            if (!scene.isPositionBlocked(position3)) {
                controlObject.move();
            }
        }
        if (controls_5.Controls.Keys.isDown && !controls_5.Controls.Keys.isHandled) {
            uiKeysDialog.refresh();
            uiKeysDialog.open();
            controls_5.Controls.Keys.isHandled = true;
        }
        else if (controls_5.Controls.Inventory.isDown && !controls_5.Controls.Inventory.isHandled) {
            uiInventory.refresh();
            uiInventory.open();
            controls_5.Controls.Inventory.isHandled = true;
        }
        else if (controls_5.Controls.Interact.isDown && !controls_5.Controls.Interact.isHandled) {
            interact();
            controls_5.Controls.Interact.isHandled = true;
        }
        if (controls_5.Controls.Target.isDown && !controls_5.Controls.Target.isHandled) {
            target(controls_5.Controls.Target.isShiftDown);
            controls_5.Controls.Target.isHandled = true;
        }
        if (controls_5.Controls.Equip.isDown && !controls_5.Controls.Equip.isHandled) {
            hero_2.hero.equipment.toggleHandheldEquip();
            controls_5.Controls.Equip.isHandled = true;
        }
        if (controls_5.Controls.DebugP.isDown && !controls_5.Controls.DebugP.isHandled) {
            debugToggleWind(controls_5.Controls.DebugP.isShiftDown);
            controls_5.Controls.DebugP.isHandled = true;
        }
        if (controls_5.Controls.DebugO.isDown && !controls_5.Controls.DebugO.isHandled) {
            debugProgressDay(controls_5.Controls.DebugO.isShiftDown ? 0.25 : 0.5);
            controls_5.Controls.DebugO.isHandled = true;
        }
        if (controls_5.Controls.DebugL.isDown && !controls_5.Controls.DebugL.isHandled) {
            uiLockPicking.refresh();
            uiLockPicking.open();
            controls_5.Controls.DebugL.isHandled = true;
        }
        if (controls_5.Controls.DebugF3.isDown && !controls_5.Controls.DebugF3.isHandled) {
            debugPanel.toggle();
            controls_5.Controls.DebugF3.isHandled = true;
        }
    }
    function debugToggleWind(isShift) {
        // Iterates coordinate values: [-1, 0, 1].
        const oldWind = scene.weather.wind.clone();
        const index = isShift ? 1 : 0;
        const coord = scene.weather.wind.getAt(index);
        const newCoord = (coord === 1) ? -1 : coord + 1;
        scene.weather.wind.setAt(index, newCoord);
        EventLoop_9.emitEvent(new GameEvent_14.GameEvent("system", "wind_changed", {
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
                initiator: hero_2.hero,
                subject: actionData.object,
            });
            return;
        }
        // Second, check if hero's main hand item has any usage actions. 
        const item = hero_2.hero.equipment.objectInMainHand;
        if (!item) {
            return;
        }
        const itemActionData = ActionData_3.getItemUsageAction(item);
        if (!itemActionData) {
            return;
        }
        const subject = items_8.isRangedItem(item) && "isTarget" in item
            ? (hero_2.hero.target && hero_2.hero.distanceTo(hero_2.hero.target) <= item.range ? hero_2.hero.target : null)
            : scene.getNpcAt(item.getWorldPosition(new Vector2_103.Vector2()));
        // Allow using items without a subject (e.g., saddle for unmounting)
        itemActionData.action({
            obj: itemActionData.object,
            initiator: hero_2.hero,
            subject: subject || undefined,
        });
    }
    function target(reverse) {
        const item = hero_2.hero.equipment.objectInMainHand;
        if (!(item && items_8.isRangedItem(item))) {
            return;
        }
        // TODO: highlight range when equiped.
        // TODO: clear target when ranged weapon unequiped.
        const radius = item.range;
        const targets = hero_2.hero.getMobsNearby(hero_2.hero.scene, radius, x => true);
        if (!targets) {
            return;
        }
        let nextTargetIndex = hero_2.hero.target
            ? (targets.indexOf(hero_2.hero.target) + (reverse ? -1 : 1))
            : 0;
        if (nextTargetIndex < 0) {
            nextTargetIndex = targets.length - 1;
        }
        if (nextTargetIndex >= targets.length) {
            nextTargetIndex = 0;
        }
        // TODO: different highlights if target is in range or out of it
        if (hero_2.hero.target) {
            hero_2.hero.target.highlighted = false;
        }
        hero_2.hero.target = targets[nextTargetIndex];
        if (hero_2.hero.target) {
            hero_2.hero.target.highlighted = true;
        }
        // TODO: remove target if dead.
    }
    function getActionUnderCursor() {
        return ActionData_3.getNpcInteraction(hero_2.hero);
    }
    function createDialog(camera) {
        // background
        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        const uiPanel = new UIDialog_4.UIDialog(new Vector2_103.Vector2(dialogWidth, dialogHeight))
            .translateY(camera.size.height - dialogHeight);
        return uiPanel;
    }
    function onLoop(ticksMillis) {
        handleControls();
        game.update(ticksMillis);
        const handlers = [game];
        scene.traverse(x => handlers.push(x));
        EventLoop_9.eventLoop(handlers);
        game.draw();
    }
    function step(timeStamp) {
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
    return {
        setters: [
            function (GameEvent_14_1) {
                GameEvent_14 = GameEvent_14_1;
            },
            function (EventLoop_9_1) {
                EventLoop_9 = EventLoop_9_1;
            },
            function (Scene_2_1) {
                Scene_2 = Scene_2_1;
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
            function (hero_2_1) {
                hero_2 = hero_2_1;
            },
            function (playerUi_1_1) {
                playerUi_1 = playerUi_1_1;
            },
            function (Level_21_1) {
                Level_21 = Level_21_1;
            },
            function (WeatherType_1_1) {
                WeatherType_1 = WeatherType_1_1;
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
            function (controls_5_1) {
                controls_5 = controls_5_1;
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
            function (misc_5_1) {
                misc_5 = misc_5_1;
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
            function (UIDialog_4_1) {
                UIDialog_4 = UIDialog_4_1;
            },
            function (UIKeysDialog_1_1) {
                UIKeysDialog_1 = UIKeysDialog_1_1;
            },
            function (Vector2_103_1) {
                Vector2_103 = Vector2_103_1;
            },
            function (CanvasRenderer_1_1) {
                CanvasRenderer_1 = CanvasRenderer_1_1;
            },
            function (Camera_2_1) {
                Camera_2 = Camera_2_1;
            },
            function (FollowCamera_2_1) {
                FollowCamera_2 = FollowCamera_2_1;
            },
            function (items_8_1) {
                items_8 = items_8_1;
            },
            function (UILockPicking_1_1) {
                UILockPicking_1 = UILockPicking_1_1;
            },
            function (chest_3_1) {
                chest_3 = chest_3_1;
            },
            function (Vector3_10_1) {
                Vector3_10 = Vector3_10_1;
            },
            function (UIDebugPanel_1_1) {
                UIDebugPanel_1 = UIDebugPanel_1_1;
            }
        ],
        execute: function () {
            camera = new Camera_2.Camera();
            canvasSize = camera.size.clone().multiply(cellStyle_2.cellStyle.size);
            canvas = document.getElementById("canvas");
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            ctx = new CanvasContext_1.CanvasContext(canvas);
            renderer = new CanvasRenderer_1.CanvasRenderer(canvas, ctx);
            // TODO: more ideas:
            // 1. 🎲 Game die, activate to randomize. ⚀⚁⚂⚃⚄⚅
            // 2. 🎄 Christmas tree with blinking color lights. 
            ui = new Scene_2.Scene();
            camera.add(ui);
            dialog = createDialog(camera);
            ui.add(dialog);
            uiInventory = new UIInventory_1.UIInventory(hero_2.hero, camera.size);
            ui.add(uiInventory);
            uiKeysDialog = new UIKeysDialog_1.UIKeysDialog(camera.size);
            ui.add(uiKeysDialog);
            uiLockPicking = new UILockPicking_1.UILockPicking(new chest_3.Chest(), camera.size);
            ui.add(uiLockPicking);
            debugPanel = new UIDebugPanel_1.UIDebugPanel(null, new Vector2_103.Vector2(1, 1));
            ui.add(debugPanel);
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
                        console.log(`${args.object.type} teleported to ${args.position.x} ${args.position.y}.`);
                    }
                    else if (ev.type === MountGameEvent_2.MountGameEvent.type) {
                        const args = ev.args;
                        const message = `${args.mounter.type} ${args.newState} ${args.mount.type}`;
                        EventLoop_9.emitEvent(PlayerMessageGameEvent_2.PlayerMessageGameEvent.create(message));
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
                            EventLoop_9.emitEvent(AddObjectGameEvent_2.AddObjectGameEvent.create(misc_5.createTextObject(`VICTORY!`, new Vector2_103.Vector2(6, 6))));
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
                        console.log(`${args.object.type} added to the scene ${scene.name} at ${args.object.position.x} ${args.object.position.y}.`);
                    }
                    else if (ev.type === RemoveObjectGameEvent_3.RemoveObjectGameEvent.type) {
                        const args = ev.args;
                        scene.remove(args.object);
                        console.log(`${args.object.type} removed from scene ${scene.name}.`);
                    }
                }
                draw() {
                    const cameraSize3 = new Vector3_10.Vector3(camera.size.width, camera.size.height, Level_21.Level.defaultMaxDepth);
                    ctx.beginDraw(scene.background, cameraSize3);
                    renderer.render(scene, camera);
                    ctx.setLights(scene.lights.lightLayer.subGrid(camera.box3));
                    renderer.render(ui, camera);
                    ctx.endDraw();
                    // Update debug panel after rendering
                    debugPanel.onFrameRendered();
                }
                update(ticks) {
                    const collisionActionData = ActionData_3.getNpcCollisionAction(hero_2.hero);
                    if (collisionActionData) {
                        collisionActionData.action({
                            obj: collisionActionData.object,
                            initiator: hero_2.hero,
                            subject: collisionActionData.object,
                        });
                    }
                    scene.update(ticks);
                    camera.update(ticks);
                }
            };
            game = new Game();
            scene = devHub_2.devHubLevel;
            debug = true;
            if (debug) {
                selectLevel(null, scene);
                // TODO: this disables day progress for first level only.
                scene.debugDisableGameTime = true;
                debugProgressDay(0.5);
            }
            heroUi = new playerUi_1.PlayerUi(hero_2.hero, camera);
            ui.add(heroUi);
            controls_5.enableGameInput();
            start = 0;
            previousTimeStamp = 0;
            window.requestAnimationFrame(step);
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
                toggleDebugDrawLights: () => {
                    const o = scene.lightLayerObject.toggle();
                    console.log(`Toggled debugDrawLights ${o.visible}`);
                },
                toggleDebugDrawOpacity: () => {
                    const o = scene.opacityLayerObject.toggle();
                    console.log(`Toggled debugDrawOpacity ${o.visible}`);
                },
                stats: () => {
                    console.log(`health: ${hero_2.hero.health} / ${hero_2.hero.maxHealth}`);
                    console.log(`sightLightLevel: ${hero_2.hero.sightLightLevel}`);
                    console.log(`cloakLightLevel: ${hero_2.hero.cloakLightLevel}`);
                    console.log(`movementPenalty: ${hero_2.hero.movementPenalty}`);
                    console.log(`children: ${hero_2.hero.children.length}`);
                },
                effects: () => {
                    for (const item of hero_2.hero.equipment.getEquippedItems()) {
                        const effects = item.effects;
                        if (effects.length <= 0) {
                            continue;
                        }
                        for (const effect of item.effects) {
                            console.log(`${item.type}: ${effect.name}.${effect.type} (${effect.value})`, effect);
                        }
                    }
                    for (const effect of hero_2.hero.activeEffects.map(x => x.effect)) {
                        console.log(`${effect.name}.${effect.type} (${effect.value})`, effect);
                    }
                },
                target: () => {
                    if (hero_2.hero.target && hero_2.hero.target.enabled) {
                        console.log(hero_2.hero.target);
                        return;
                    }
                    const objects = scene.children
                        .filter(x => x.enabled);
                    const npcCursorPosition = hero_2.hero.getWorldCursorPosition(new Vector2_103.Vector2());
                    const position = new Vector2_103.Vector2();
                    for (let o of objects) {
                        if (o.getWorldPosition(position).equals(npcCursorPosition)) {
                            console.log(o);
                        }
                    }
                },
            };
        }
    };
});
System.register("world/objects/particles/WaterRipple", ["engine/objects/Particle", "world/sprites/waterRippleSprite"], function (exports_222, context_222) {
    "use strict";
    var Particle_12, waterRippleSprite_2, WaterRipple;
    var __moduleName = context_222 && context_222.id;
    return {
        setters: [
            function (Particle_12_1) {
                Particle_12 = Particle_12_1;
            },
            function (waterRippleSprite_2_1) {
                waterRippleSprite_2 = waterRippleSprite_2_1;
            }
        ],
        execute: function () {
            WaterRipple = class WaterRipple extends Particle_12.Particle {
                constructor(position, state = 0) {
                    super(waterRippleSprite_2.waterRippleSprite, position, state, { decaySpeed: 200, });
                    this.type = "waterripple";
                }
            };
            exports_222("WaterRipple", WaterRipple);
        }
    };
});
System.register("world/sprites/dustSprite", ["engine/data/Sprite"], function (exports_223, context_223) {
    "use strict";
    var Sprite_33, dustSpriteRaw, dustSprite;
    var __moduleName = context_223 && context_223.id;
    return {
        setters: [
            function (Sprite_33_1) {
                Sprite_33 = Sprite_33_1;
            }
        ],
        execute: function () {
            dustSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#555,#0000

particle
.·ᣟᣟ·.
RRRRRR`;
            exports_223("dustSprite", dustSprite = Sprite_33.Sprite.parse(dustSpriteRaw));
        }
    };
});
System.register("world/sprites/damage/genericDamageSprite", ["engine/data/Sprite"], function (exports_224, context_224) {
    "use strict";
    var Sprite_34, genericDamageSpriteRaw, genericDamageSprite;
    var __moduleName = context_224 && context_224.id;
    return {
        setters: [
            function (Sprite_34_1) {
                Sprite_34 = Sprite_34_1;
            }
        ],
        execute: function () {
            genericDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#F55F,#0000

particle
◟◝ノ◞
RRRR`;
            exports_224("genericDamageSprite", genericDamageSprite = Sprite_34.Sprite.parse(genericDamageSpriteRaw));
        }
    };
});
//# sourceMappingURL=app.js.map