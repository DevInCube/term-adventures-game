System.register("engine/events/GameEvent", [], function (exports_1, context_1) {
    "use strict";
    var GameEvent;
    var __moduleName = context_1 && context_1.id;
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
            exports_1("GameEvent", GameEvent);
        }
    };
});
System.register("engine/components/ObjectSkin", [], function (exports_2, context_2) {
    "use strict";
    var ObjectSkin;
    var __moduleName = context_2 && context_2.id;
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
            exports_2("ObjectSkin", ObjectSkin);
        }
    };
});
System.register("engine/components/ObjectPhysics", [], function (exports_3, context_3) {
    "use strict";
    var ObjectPhysics;
    var __moduleName = context_3 && context_3.id;
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
            exports_3("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("engine/graphics/Cell", [], function (exports_4, context_4) {
    "use strict";
    var Cell;
    var __moduleName = context_4 && context_4.id;
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
                constructor(character = ' ', textColor = 'white', backgroundColor = 'black') {
                    this.character = character;
                    this.textColor = textColor;
                    this.backgroundColor = backgroundColor;
                }
            };
            exports_4("Cell", Cell);
        }
    };
});
System.register("engine/events/EventLoop", [], function (exports_5, context_5) {
    "use strict";
    var events;
    var __moduleName = context_5 && context_5.id;
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
    exports_5("eventLoop", eventLoop);
    function emitEvent(ev) {
        events.push(ev);
        console.log("event: ", ev);
    }
    exports_5("emitEvent", emitEvent);
    return {
        setters: [],
        execute: function () {
            events = [];
        }
    };
});
System.register("engine/Level", [], function (exports_6, context_6) {
    "use strict";
    var Level;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Level = class Level {
                constructor(id, objects, tiles = [], width = 20, height = 20) {
                    this.id = id;
                    this.objects = objects;
                    this.tiles = tiles;
                    this.width = width;
                    this.height = height;
                    this.blockedLayer = [];
                    this.transparencyLayer = [];
                    this.lightLayer = [];
                    this.weatherTicks = 0;
                    this.temperatureTicks = 0;
                    this.temperatureLayer = [];
                    this.moistureLayer = [];
                    this.weatherLayer = [];
                    this.cloudLayer = [];
                    this.roofLayer = [];
                    this.roofHolesLayer = [];
                    this.weatherType = 'normal';
                    this.isWindy = true;
                    this.portals = {};
                }
            };
            exports_6("Level", Level);
        }
    };
});
System.register("engine/Camera", [], function (exports_7, context_7) {
    "use strict";
    var followOffset, Camera;
    var __moduleName = context_7 && context_7.id;
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
            exports_7("Camera", Camera);
        }
    };
});
System.register("engine/graphics/CellInfo", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/graphics/CanvasContext", ["main", "engine/graphics/GraphicsEngine"], function (exports_9, context_9) {
    "use strict";
    var main_1, GraphicsEngine_1, CanvasContext;
    var __moduleName = context_9 && context_9.id;
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
            CanvasContext = class CanvasContext {
                constructor(context) {
                    this.context = context;
                    this.previous = [];
                    this.current = [];
                }
                add(position, cellInfo) {
                    const [top, left] = position;
                    if (!this.current[top])
                        this.current[top] = [];
                    if (!this.current[top][left])
                        this.current[top][left] = [];
                    this.current[top][left].push(cellInfo);
                }
                draw() {
                    for (let y = 0; y < this.current.length; y++) {
                        for (let x = 0; x < this.current[y].length; x++) {
                            if (!(this.current[y] && this.current[y][x]))
                                continue;
                            if (!(this.previous[y] && this.previous[y][x]) ||
                                !(CanvasContext.compare(this.current[y][x], this.previous[y][x]))) {
                                for (let c of this.current[y][x]) {
                                    this.drawCellInfo(y, x, c);
                                }
                            }
                        }
                    }
                    this.previous = this.current;
                    this.current = [];
                }
                static compare(_this, array) {
                    // if the other array is a falsy value, return
                    if (!_this || !array)
                        return false;
                    // compare lengths - can save a lot of time 
                    if (_this.length !== array.length)
                        return false;
                    for (let i = 0, l = _this.length; i < l; i++) {
                        if (!compare(_this[i], array[i])) {
                            // Warning - two different object instances will never be equal: {x:20} !== {x:20}
                            return false;
                        }
                    }
                    return true;
                    function compare(a, b) {
                        return a.transparent === b.transparent
                            && a.border[0] === b.border[0]
                            && a.border[1] === b.border[1]
                            && a.border[2] === b.border[2]
                            && a.border[3] === b.border[3]
                            && a.cell.character === b.cell.character
                            && a.cell.textColor === b.cell.textColor
                            && a.cell.backgroundColor === b.cell.backgroundColor;
                    }
                }
                drawCellInfo(topPos, leftPos, cellInfo) {
                    const ctx = this.context;
                    //
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
            };
            exports_9("CanvasContext", CanvasContext);
        }
    };
});
System.register("engine/graphics/GraphicsEngine", ["engine/graphics/Cell", "engine/objects/Npc"], function (exports_10, context_10) {
    "use strict";
    var Cell_1, Npc_1, GraphicsEngine, cellStyle, emptyCollisionChar;
    var __moduleName = context_10 && context_10.id;
    function drawObjects(ctx, camera, objects) {
        const importantObjects = objects.filter(x => x.important);
        for (const object of objects) {
            if (!object.enabled)
                continue;
            drawObject(ctx, camera, object, importantObjects);
            // reset object highlight.
            object.highlighted = false;
        }
        // draw cursors
        for (const object of objects) {
            if (!object.enabled)
                continue;
            if (object instanceof Npc_1.Npc &&
                (object.direction[0] || object.direction[1])) {
                if (object.objectInMainHand) {
                    object.objectInMainHand.highlighted = object.showCursor;
                    object.objectInMainHand.highlighColor = 'yellow';
                    drawObject(ctx, camera, object.objectInMainHand, []);
                }
                if (object.objectInSecondaryHand) {
                    drawObject(ctx, camera, object.objectInSecondaryHand, []);
                }
            }
        }
    }
    exports_10("drawObjects", drawObjects);
    function drawObjectAt(ctx, camera, obj, position) {
        for (let y = 0; y < obj.skin.grid.length; y++) {
            for (let x = 0; x < obj.skin.grid[y].length; x++) {
                const cell = getCellAt(obj.skin, x, y);
                const left = position[0] - obj.originPoint[0] + x;
                const top = position[1] - obj.originPoint[1] + y;
                drawCell(ctx, camera, cell, left, top);
            }
        }
    }
    exports_10("drawObjectAt", drawObjectAt);
    function drawObject(ctx, camera, obj, importantObjects) {
        let showOnlyCollisions = isInFrontOfImportantObject();
        for (let y = 0; y < obj.skin.grid.length; y++) {
            for (let x = 0; x < obj.skin.grid[y].length; x++) {
                const cell = getCellAt(obj.skin, x, y);
                if (cell.isEmpty)
                    continue;
                const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
                const cellBorders = getCellBorders(obj, x, y);
                const left = obj.position[0] - obj.originPoint[0] + x;
                const top = obj.position[1] - obj.originPoint[1] + y;
                drawCell(ctx, camera, cell, left - camera.position.left, top - camera.position.top, transparent, cellBorders);
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
        const cellColor = (skin.raw_colors[y] && skin.raw_colors[y][x]) || ['', ''];
        const char = skin.grid[y][x];
        const cell = new Cell_1.Cell(char, cellColor[0], cellColor[1]);
        return cell;
    }
    function isCollision(object, left, top) {
        const cchar = (object.physics.collisions[top] && object.physics.collisions[top][left]) || emptyCollisionChar;
        return cchar !== emptyCollisionChar;
    }
    exports_10("isCollision", isCollision);
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
    exports_10("isPositionBehindTheObject", isPositionBehindTheObject);
    function drawCell(ctx, camera, cell, leftPos, topPos, transparent = false, border = [null, null, null, null]) {
        if (cell.isEmpty)
            return;
        if (leftPos < 0 ||
            topPos < 0 ||
            leftPos >= camera.size.width ||
            topPos >= camera.size.height) {
            return;
        }
        ctx.add([topPos, leftPos], { cell, transparent, border });
    }
    exports_10("drawCell", drawCell);
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
            exports_10("GraphicsEngine", GraphicsEngine);
            exports_10("cellStyle", cellStyle = {
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
System.register("engine/objects/Item", ["engine/objects/SceneObject"], function (exports_11, context_11) {
    "use strict";
    var SceneObject_1, Item;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
            };
            exports_11("Item", Item);
        }
    };
});
System.register("utils/layer", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
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
    exports_12("fillLayer", fillLayer);
    function forLayerOf(layer, iteration, defaultValue) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer[y][x] || defaultValue);
            }
        }
    }
    exports_12("forLayerOf", forLayerOf);
    function forLayer(layer, iteration) {
        for (let y = 0; y < layer.length; y++) {
            for (let x = 0; x < layer[y].length; x++) {
                iteration(layer, x, y);
            }
        }
    }
    exports_12("forLayer", forLayer);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/Scene", ["engine/events/GameEvent", "engine/graphics/Cell", "engine/events/EventLoop", "engine/graphics/GraphicsEngine", "engine/objects/Npc", "engine/Camera", "utils/layer"], function (exports_13, context_13) {
    "use strict";
    var GameEvent_1, Cell_2, EventLoop_1, GraphicsEngine_2, Npc_2, Camera_1, utils, defaultLightLevelAtNight, defaultLightLevelAtDay, defaultTemperatureAtNight, defaultTemperatureAtDay, defaultMoisture, bedrockCell, Scene;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (GameEvent_1_1) {
                GameEvent_1 = GameEvent_1_1;
            },
            function (Cell_2_1) {
                Cell_2 = Cell_2_1;
            },
            function (EventLoop_1_1) {
                EventLoop_1 = EventLoop_1_1;
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
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            defaultLightLevelAtDay = 15;
            defaultTemperatureAtNight = 4; // @todo depends on biome.
            defaultTemperatureAtDay = 7; // @todo depends on biome.
            defaultMoisture = 5; // @todo depends on biome.
            bedrockCell = new Cell_2.Cell(' ', 'transparent', '#331');
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
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
                    }
                    if (ev.type === "transfer_items") {
                        const items = ev.args["items"];
                        const recipient = ev.args["recipient"];
                        recipient.inventory.addItems(items);
                        // TODO: show message to player.
                    }
                }
                update(ticks) {
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
                        if (!obj.enabled)
                            continue;
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
                                    scene.level.blockedLayer[top][left] = true;
                                }
                            }
                        }
                    }
                    function updateTransparency() {
                        scene.level.transparencyLayer = [];
                        fillLayer(scene.level.transparencyLayer, 0);
                        for (const object of scene.level.objects) {
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
                                    scene.level.transparencyLayer[top][left] = value;
                                }
                            }
                        }
                    }
                    function getSkyTransparency() {
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
                                    if (typeof roofHoleVal === "undefined")
                                        roofHoleVal = true;
                                    if (!roofHoleVal && weatherType !== 'mist')
                                        continue;
                                    const cell = createCell();
                                    if (!cell)
                                        continue;
                                    addCell(cell, x, y);
                                }
                            }
                            function addCell(cell, x, y) {
                                if (!scene.level.weatherLayer[y])
                                    scene.level.weatherLayer[y] = [];
                                scene.level.weatherLayer[y][x] = cell;
                            }
                            function createCell() {
                                const rainColor = 'cyan';
                                const snowColor = '#fff9';
                                const mistColor = '#fff2';
                                if (weatherType === 'rain') {
                                    const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                                    return new Cell_2.Cell(sym, rainColor, 'transparent');
                                }
                                else if (weatherType === 'snow') {
                                    const r = (Math.random() * 8 | 0);
                                    if (r === 0)
                                        return new Cell_2.Cell('❅', snowColor, 'transparent');
                                    else if (r === 1)
                                        return new Cell_2.Cell('❆', snowColor, 'transparent');
                                    else if (r === 2)
                                        return new Cell_2.Cell('✶', snowColor, 'transparent');
                                    else if (r === 3)
                                        return new Cell_2.Cell('•', snowColor, 'transparent');
                                }
                                else if (weatherType === 'rain_and_snow') {
                                    const r = Math.random() * 3 | 0;
                                    if (r === 1)
                                        return new Cell_2.Cell('✶', snowColor, 'transparent');
                                    else if (r === 2)
                                        return new Cell_2.Cell('`', rainColor, 'transparent');
                                }
                                else if (weatherType === 'mist') {
                                    if ((Math.random() * 2 | 0) === 1)
                                        return new Cell_2.Cell('*', 'transparent', mistColor);
                                }
                                return undefined;
                            }
                        }
                    }
                    function updateLights() {
                        // clear
                        scene.level.lightLayer = [];
                        fillLayer(scene.level.lightLayer, 0);
                        const maxValue = 15;
                        for (let y = 0; y < scene.level.height; y++) {
                            for (let x = 0; x < scene.level.width; x++) {
                                const cloudValue = (scene.level.cloudLayer[y] && scene.level.cloudLayer[y][x]) || 0;
                                const roofValue = (scene.level.roofLayer[y] && scene.level.roofLayer[y][x]) || 0;
                                const cloudOpacity = (maxValue - cloudValue) / maxValue;
                                const roofOpacity = (maxValue - roofValue) / maxValue;
                                const opacity = cloudOpacity * roofOpacity;
                                const cellLightLevel = Math.round(scene.globalLightLevel * opacity) | 0;
                                const position = [x, y];
                                addEmitter(scene.level.lightLayer, position, cellLightLevel);
                                spreadPoint(scene.level.lightLayer, position, 0);
                            }
                        }
                        const lightObjects = [
                            ...scene.level.objects,
                            ...scene.level.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInMainHand)
                                .map((x) => x.objectInMainHand),
                            ...scene.level.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInSecondaryHand)
                                .map((x) => x.objectInSecondaryHand)
                        ];
                        for (const obj of lightObjects) {
                            if (!obj.enabled)
                                continue;
                            for (const [top, string] of obj.physics.lights.entries()) {
                                for (const [left, char] of string.split('').entries()) {
                                    const lightLevel = Number.parseInt(char, 16);
                                    const aleft = obj.position[0] - obj.originPoint[0] + left;
                                    const atop = obj.position[1] - obj.originPoint[1] + top;
                                    const position = [aleft, atop];
                                    if (!scene.isPositionValid(position)) {
                                        continue;
                                    }
                                    addEmitter(scene.level.lightLayer, position, lightLevel);
                                    spreadPoint(scene.level.lightLayer, position, 0);
                                }
                            }
                        }
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
                                    .filter(x => (x instanceof Npc_2.Npc) && x.objectInMainHand)
                                    .map((x) => x.objectInMainHand),
                                ...scene.level.objects
                                    .filter(x => (x instanceof Npc_2.Npc) && x.objectInSecondaryHand)
                                    .map((x) => x.objectInSecondaryHand)
                            ];
                            for (const obj of temperatureObjects) {
                                if (!obj.enabled)
                                    continue;
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
                    function fillLayer(layer, defaultValue) {
                        utils.fillLayer(layer, scene.level.width, scene.level.height, defaultValue);
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
                        for (let i = Math.max(0, y - 1); i <= Math.min(array.length - 1, y + 1); i++)
                            for (let j = Math.max(0, x - 1); j <= Math.min(array[i].length - 1, x + 1); j++)
                                if ((i === y || j === x) && !(i === y && j === x)
                                    && array[i][j] > maxValue)
                                    maxValue = array[i][j];
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
                        // @todo check water tiles
                        scene.level.moistureLayer = [];
                        fillLayer(scene.level.moistureLayer, scene.globalMoisture);
                    }
                }
                draw(ctx) {
                    const scene = this;
                    drawTiles();
                    // sort objects by origin point
                    this.level.objects.sort((a, b) => a.position[1] - b.position[1]);
                    GraphicsEngine_2.drawObjects(ctx, this.camera, this.level.objects);
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
                        drawLayer(scene.level.tiles, cameraTransformation, c => c || bedrockCell);
                    }
                    function drawWeather() {
                        // Currently is linked with camera, not the level.
                        drawLayer(scene.level.weatherLayer, p => p, c => c);
                    }
                    function drawLights() {
                        drawLayer(scene.level.lightLayer, cameraTransformation, createCell);
                        function createCell(v) {
                            const value = v || 0;
                            return new Cell_2.Cell(' ', undefined, numberToLightColor(value));
                        }
                        function numberToLightColor(val, max = 15) {
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
                        function createCell(b) {
                            return b === true ? new Cell_2.Cell('⛌', `#f00c`, `#000c`) : undefined;
                        }
                    }
                    function cameraTransformation(position) {
                        const [x, y] = position;
                        const top = scene.camera.position.top + y;
                        const left = scene.camera.position.left + x;
                        return [left, top];
                    }
                    function drawLayer(layer, transformation, cellFactory) {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                const [left, top] = transformation([x, y]);
                                const value = (layer[top] && layer[top][left]);
                                const cell = cellFactory(value);
                                if (!cell)
                                    continue;
                                GraphicsEngine_2.drawCell(ctx, scene.camera, cell, x, y);
                            }
                        }
                    }
                    function drawDebugLayer(layer, max = 15) {
                        drawLayer(layer, cameraTransformation, createCell);
                        function createCell(v) {
                            const value = v || 0;
                            return new Cell_2.Cell(value.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max));
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
                getNpcAction(npc) {
                    const scene = this;
                    for (const object of scene.level.objects) {
                        if (!object.enabled)
                            continue;
                        //
                        const left = npc.position[0] + npc.direction[0];
                        const top = npc.position[1] + npc.direction[1];
                        //
                        const pleft = left - object.position[0] + object.originPoint[0];
                        const ptop = top - object.position[1] + object.originPoint[1];
                        for (const [[aleft, atop], actionFunc, [ileft, itop]] of object.actions) {
                            if (aleft === pleft &&
                                atop === ptop) {
                                const actionIconChar = object.skin.grid[itop][ileft];
                                const [fgColor, bgColor] = object.skin.raw_colors[itop][ileft];
                                const actionIcon = new Cell_2.Cell(actionIconChar, fgColor, bgColor);
                                return { object, action: actionFunc, actionIcon };
                            }
                        }
                    }
                    return undefined;
                }
            };
            exports_13("Scene", Scene);
        }
    };
});
System.register("engine/objects/Inventory", [], function (exports_14, context_14) {
    "use strict";
    var Inventory;
    var __moduleName = context_14 && context_14.id;
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
            exports_14("Inventory", Inventory);
        }
    };
});
System.register("engine/objects/SceneObject", ["engine/objects/Inventory"], function (exports_15, context_15) {
    "use strict";
    var Inventory_1, SceneObject;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (Inventory_1_1) {
                Inventory_1 = Inventory_1_1;
            }
        ],
        execute: function () {
            SceneObject = class SceneObject {
                constructor(originPoint, skin, physics, position) {
                    this.originPoint = originPoint;
                    this.skin = skin;
                    this.physics = physics;
                    this.position = position;
                    this.enabled = true;
                    this.highlighted = false;
                    this.highlighColor = '#0ff';
                    this.important = false;
                    this.parameters = {};
                    this.actions = [];
                    this.inventory = new Inventory_1.Inventory();
                    this.ticks = 0;
                    //
                }
                // add cb params
                setAction(left, top, action, ileft = left, itop = top) {
                    this.actions.push([[left, top], action, [ileft, itop]]);
                }
                handleEvent(ev) { }
                update(ticks, scene) {
                    this.ticks += ticks;
                }
            };
            exports_15("SceneObject", SceneObject);
        }
    };
});
System.register("engine/objects/StaticGameObject", ["engine/objects/SceneObject"], function (exports_16, context_16) {
    "use strict";
    var SceneObject_2, StaticGameObject;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_2.SceneObject {
                constructor(originPoint, skin, physics, position = [0, 0]) {
                    super(originPoint, skin, physics, position);
                }
            };
            exports_16("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_17, context_17) {
    "use strict";
    var ObjectSkin_1, StaticGameObject_1, ObjectPhysics_1;
    var __moduleName = context_17 && context_17.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_17("distanceTo", distanceTo);
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_1.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_1.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_17("createTextObject", createTextObject);
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
    exports_17("deepCopy", deepCopy);
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
System.register("engine/objects/Behavior", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/objects/Npc", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "utils/misc", "engine/events/EventLoop", "engine/events/GameEvent"], function (exports_19, context_19) {
    "use strict";
    var SceneObject_3, ObjectSkin_2, ObjectPhysics_2, misc_1, EventLoop_2, GameEvent_2, Npc;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (EventLoop_2_1) {
                EventLoop_2 = EventLoop_2_1;
            },
            function (GameEvent_2_1) {
                GameEvent_2 = GameEvent_2_1;
            }
        ],
        execute: function () {
            Npc = class Npc extends SceneObject_3.SceneObject {
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
                    super(originPoint, skin, new ObjectPhysics_2.ObjectPhysics(`.`, ``), position);
                    this.type = "undefined";
                    this.direction = [0, 1];
                    this.showCursor = false;
                    this.moveSpeed = 2; // cells per second
                    this.moveSpeedPenalty = 0;
                    this.moveTick = 0;
                    this.objectInMainHand = null;
                    this.objectInSecondaryHand = null;
                    this.health = 1;
                    this.maxHealth = 3;
                    this.basicAttack = 1;
                    this.attackTick = 0;
                    this.attackSpeed = 1; // atk per second
                    this.behaviors = [];
                    this.important = true;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    this.moveTick += ticks;
                    this.attackTick += ticks;
                    //
                    const obj = this;
                    if (obj.objectInMainHand) {
                        obj.objectInMainHand.position = [
                            obj.cursorPosition[0],
                            obj.cursorPosition[1],
                        ];
                    }
                    if (obj.objectInSecondaryHand) {
                        obj.objectInSecondaryHand.position = [
                            obj.position[0] + obj.direction[1],
                            obj.position[1] - obj.direction[0],
                        ];
                    }
                    const tile = scene.level.tiles[obj.position[1]] && scene.level.tiles[obj.position[1]][obj.position[0]];
                    // TODO: npc type: walking, water, flying. etc.
                    // TODO: tyle as a class with tile typing.
                    if ((tile === null || tile === void 0 ? void 0 : tile.backgroundColor) === '#358') { // water
                        obj.moveSpeedPenalty = 5;
                    }
                    else {
                        obj.moveSpeedPenalty = 0;
                    }
                    for (const b of obj.behaviors) {
                        b.update(ticks, scene, obj);
                    }
                }
                move() {
                    const obj = this;
                    if (obj.moveTick >= 1000 / Math.max(1, obj.moveSpeed - obj.moveSpeedPenalty)) {
                        obj.position[0] += obj.direction[0];
                        obj.position[1] += obj.direction[1];
                        //
                        obj.moveTick = 0;
                    }
                }
                attack(target) {
                    if (this.attackTick > 1000 / this.attackSpeed) {
                        this.attackTick = 0;
                        EventLoop_2.emitEvent(new GameEvent_2.GameEvent(this, "attack", {
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
                        EventLoop_2.emitEvent(new GameEvent_2.GameEvent(ev.args.object, "damage", Object.create(ev.args)));
                        if (this.health <= 0) {
                            this.enabled = false;
                            EventLoop_2.emitEvent(new GameEvent_2.GameEvent(this, "death", { object: this, cause: { type: "attacked", by: ev.args.object } }));
                        }
                    }
                    for (const b of this.behaviors) {
                        b.handleEvent(ev, this);
                    }
                }
                runAway(scene, enemiesNearby) {
                    const possibleDirs = [
                        { direction: [-1, 0] },
                        { direction: [+1, 0] },
                        { direction: [0, -1] },
                        { direction: [0, +1] },
                    ];
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        pd.available = !scene.isPositionBlocked(position);
                        if (enemiesNearby.length)
                            pd.distance = misc_1.distanceTo(position, enemiesNearby[0].position);
                    }
                    const direction = possibleDirs.filter(x => x.available);
                    direction.sort((x, y) => y.distance - x.distance);
                    if (direction.length) {
                        this.direction = direction[0].direction;
                        this.move();
                    }
                }
                approach(scene, target) {
                    const possibleDirs = [
                        { direction: [-1, 0] },
                        { direction: [+1, 0] },
                        { direction: [0, -1] },
                        { direction: [0, +1] },
                    ];
                    for (let pd of possibleDirs) {
                        const position = [
                            this.position[0] + pd.direction[0],
                            this.position[1] + pd.direction[1],
                        ];
                        pd.available = !scene.isPositionBlocked(position);
                        pd.distance = misc_1.distanceTo(position, target.position);
                    }
                    const direction = possibleDirs.filter(x => x.available);
                    direction.sort((x, y) => x.distance - y.distance);
                    if (direction.length) {
                        this.direction = direction[0].direction;
                        this.move();
                    }
                }
                moveRandomly(koef = 100) {
                    if ((Math.random() * koef | 0) === 0) {
                        this.direction[0] = (Math.random() * 3 | 0) - 1;
                        if (this.direction[0] === 0) {
                            this.direction[1] = (Math.random() * 3 | 0) - 1;
                        }
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
                        if (object instanceof SceneObject_3.SceneObject && callback(object)) {
                            if (this.distanceTo(object) < radius) {
                                nearObjects.push(object);
                            }
                        }
                    }
                    return nearObjects;
                }
            };
            exports_19("Npc", Npc);
        }
    };
});
System.register("world/objects/campfire", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_20, context_20) {
    "use strict";
    var ObjectPhysics_3, ObjectSkin_3, StaticGameObject_2, Campfire;
    var __moduleName = context_20 && context_20.id;
    function campfire(options) {
        return new Campfire(options.position);
    }
    exports_20("campfire", campfire);
    return {
        setters: [
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            },
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            }
        ],
        execute: function () {
            Campfire = class Campfire extends StaticGameObject_2.StaticGameObject {
                constructor(position) {
                    super([0, 0], new ObjectSkin_3.ObjectSkin(`🔥`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_3.ObjectPhysics(` `, 'F', 'F'), position);
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
            exports_20("Campfire", Campfire);
        }
    };
});
System.register("world/behaviors/PreyGroupBehavior", [], function (exports_21, context_21) {
    "use strict";
    var PreyGroupBehavior;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            PreyGroupBehavior = class PreyGroupBehavior {
                constructor(options = {}) {
                    this.options = options;
                    this.state = "still";
                    this.stress = 0;
                    this.enemies = [];
                }
                update(ticks, scene, object) {
                    var _a, _b;
                    object.direction = [0, 0];
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
                        object.moveRandomly();
                    }
                    if (!scene.isPositionBlocked(object.cursorPosition)) {
                        object.move();
                    }
                    else if (this.stress > 0 && enemiesNearby) {
                        object.runAway(scene, enemiesNearby);
                    }
                    object.parameters['stress'] = this.stress;
                }
                handleEvent(ev, object) {
                }
            };
            exports_21("PreyGroupBehavior", PreyGroupBehavior);
        }
    };
});
System.register("world/npcs/sheep", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior"], function (exports_22, context_22) {
    "use strict";
    var Npc_3, ObjectSkin_4, PreyGroupBehavior_1, Sheep;
    var __moduleName = context_22 && context_22.id;
    function sheep(options) {
        return new Sheep(options.position);
    }
    exports_22("sheep", sheep);
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (PreyGroupBehavior_1_1) {
                PreyGroupBehavior_1 = PreyGroupBehavior_1_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_3.Npc {
                constructor(position) {
                    super(new ObjectSkin_4.ObjectSkin(`🐑`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                    this.behaviors.push(new PreyGroupBehavior_1.PreyGroupBehavior());
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
System.register("world/behaviors/HunterBehavior", ["world/objects/campfire"], function (exports_23, context_23) {
    "use strict";
    var campfire_1, HunterBehavior;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (campfire_1_1) {
                campfire_1 = campfire_1_1;
            }
        ],
        execute: function () {
            HunterBehavior = class HunterBehavior {
                constructor(options) {
                    this.options = options;
                    this.hungerTicks = 0;
                    this.hunger = 3;
                    this.state = "still";
                }
                update(ticks, scene, object) {
                    var _a, _b, _c;
                    this.hungerTicks += ticks;
                    object.direction = [0, 0];
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
                    const enemiesNearby = object.getObjectsNearby(scene, ((_b = this.options) === null || _b === void 0 ? void 0 : _b.enemiesRadius) || 5, x => x instanceof campfire_1.Campfire); // TODO: static object typing.
                    if (enemiesNearby.length) {
                        this.state = "feared";
                        this.enemies = enemiesNearby;
                        this.target = undefined;
                    }
                    if (this.state === "hunting" && this.target) {
                        if (object.distanceTo(this.target) <= 1) {
                            object.attack(this.target);
                        }
                        object.approach(scene, this.target);
                    }
                    else if (this.state === "feared") {
                        object.runAway(scene, enemiesNearby);
                    }
                    else if (this.state === "wandering") {
                        object.moveRandomly(((_c = this.options) === null || _c === void 0 ? void 0 : _c.randomMoveKoef) || 10);
                        if (!scene.isPositionBlocked(object.cursorPosition)) {
                            object.move();
                        }
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
            exports_23("HunterBehavior", HunterBehavior);
        }
    };
});
System.register("world/npcs/wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/HunterBehavior"], function (exports_24, context_24) {
    "use strict";
    var Npc_4, ObjectSkin_5, HunterBehavior_1, Wolf;
    var __moduleName = context_24 && context_24.id;
    function wolf(options) {
        return new Wolf(options.position);
    }
    exports_24("wolf", wolf);
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (HunterBehavior_1_1) {
                HunterBehavior_1 = HunterBehavior_1_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_4.Npc {
                constructor(position) {
                    super(new ObjectSkin_5.ObjectSkin(`🐺`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "wolf";
                    this.moveSpeed = 4;
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
System.register("engine/data/SpriteInfo", [], function (exports_25, context_25) {
    "use strict";
    var SpriteInfo;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            exports_25("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["engine/components/ObjectSkin", "engine/data/SpriteInfo"], function (exports_26, context_26) {
    "use strict";
    var ObjectSkin_6, SpriteInfo_1, Sprite;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
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
                                sprite.frames[name].push(new ObjectSkin_6.ObjectSkin(bodies[k], colors[k], colorsDict));
                            }
                        }
                        else {
                            i += 1;
                        }
                    }
                    return sprite;
                }
            };
            exports_26("Sprite", Sprite);
        }
    };
});
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_27, context_27) {
    "use strict";
    var Sprite_1, treeSpriteRaw, treeSprite;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
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
            exports_27("treeSprite", treeSprite = Sprite_1.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/StaticGameObject"], function (exports_28, context_28) {
    "use strict";
    var StaticGameObject_3, Tree;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            }
        ],
        execute: function () {
            Tree = class Tree extends StaticGameObject_3.StaticGameObject {
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
            exports_28("Tree", Tree);
            ;
        }
    };
});
System.register("world/objects/pineTree", ["engine/components/ObjectPhysics", "world/sprites/tree", "world/objects/Tree"], function (exports_29, context_29) {
    "use strict";
    var ObjectPhysics_4, tree_1, Tree_1, PineTree;
    var __moduleName = context_29 && context_29.id;
    function pineTree(options) {
        return new PineTree(options.position);
    }
    exports_29("pineTree", pineTree);
    return {
        setters: [
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
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
                    super([1, 3], tree_1.treeSprite, new ObjectPhysics_4.ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), position);
                }
            };
        }
    };
});
System.register("world/objects/fence", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_30, context_30) {
    "use strict";
    var ObjectSkin_7, StaticGameObject_4, ObjectPhysics_5;
    var __moduleName = context_30 && context_30.id;
    function fence(options) {
        return new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_7.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_5.ObjectPhysics('.'), options.position);
    }
    exports_30("fence", fence);
    return {
        setters: [
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/door", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_31, context_31) {
    "use strict";
    var ObjectSkin_8, StaticGameObject_5, ObjectPhysics_6;
    var __moduleName = context_31 && context_31.id;
    function door(options) {
        return new StaticGameObject_5.StaticGameObject([0, 0], new ObjectSkin_8.ObjectSkin(`🚪`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics_6.ObjectPhysics(` `), options.position);
    }
    exports_31("door", door);
    return {
        setters: [
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/sheep", ["world/objects/campfire", "world/npcs/sheep", "world/npcs/wolf", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/door"], function (exports_32, context_32) {
    "use strict";
    var campfire_2, sheep_1, wolf_1, Level_1, pineTree_1, fence_1, door_1, sheeps, wolves, fences, tree2, campfires, doors, objects, sheepLevel;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (campfire_2_1) {
                campfire_2 = campfire_2_1;
            },
            function (sheep_1_1) {
                sheep_1 = sheep_1_1;
            },
            function (wolf_1_1) {
                wolf_1 = wolf_1_1;
            },
            function (Level_1_1) {
                Level_1 = Level_1_1;
            },
            function (pineTree_1_1) {
                pineTree_1 = pineTree_1_1;
            },
            function (fence_1_1) {
                fence_1 = fence_1_1;
            },
            function (door_1_1) {
                door_1 = door_1_1;
            }
        ],
        execute: function () {
            sheeps = [];
            wolves = [];
            fences = [];
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(fence_1.fence({ position: [x, 1] }));
                    fences.push(fence_1.fence({ position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(fence_1.fence({ position: [1, y] }));
                    fences.push(fence_1.fence({ position: [18, y] }));
                }
            }
            if (true) { // random sheeps
                for (let y = 2; y < 17; y++) {
                    const parts = 4;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newSheep = sheep_1.sheep({ position: [x, y] });
                        sheeps.push(newSheep);
                    }
                }
            }
            wolves.push(wolf_1.wolf({ position: [15, 15] }));
            tree2 = pineTree_1.pineTree({ position: [7, 9] });
            campfires = [
                campfire_2.campfire({ position: [10, 10] }),
            ];
            doors = [
                door_1.door({ position: [4, 2] }),
                door_1.door({ position: [14, 14] }),
                door_1.door({ position: [2, 2] }),
            ];
            objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...doors];
            exports_32("sheepLevel", sheepLevel = new Level_1.Level('sheep', objects));
            sheepLevel.portals['sheep_door'] = [[4, 2], [14, 14]];
            sheepLevel.portals['intro_door'] = [[2, 2]];
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_33, context_33) {
    "use strict";
    var Item_1, ObjectSkin_9, ObjectPhysics_7, lamp, sword, emptyHand, bambooSeed;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            }
        ],
        execute: function () {
            exports_33("lamp", lamp = () => new Item_1.Item([0, 0], new ObjectSkin_9.ObjectSkin(`🏮`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(` `, `f`, `a`), [0, 0]));
            exports_33("sword", sword = () => new Item_1.Item([0, 0], new ObjectSkin_9.ObjectSkin(`🗡`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(), [0, 0]));
            exports_33("emptyHand", emptyHand = () => new Item_1.Item([0, 0], new ObjectSkin_9.ObjectSkin(` `, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(), [0, 0]));
            exports_33("bambooSeed", bambooSeed = () => new Item_1.Item([0, 0], new ObjectSkin_9.ObjectSkin(`▄`, `T`, { 'T': ['#99bc20', 'transparent'] }), new ObjectPhysics_7.ObjectPhysics(), [0, 0]));
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items"], function (exports_34, context_34) {
    "use strict";
    var Npc_5, ObjectSkin_10, items_1, hero;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            }
        ],
        execute: function () {
            exports_34("hero", hero = new class extends Npc_5.Npc {
                constructor() {
                    super(new ObjectSkin_10.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [9, 7]);
                    this.type = "human";
                    this.moveSpeed = 10;
                    this.showCursor = true;
                    const aSword = items_1.sword();
                    const aLamp = items_1.lamp();
                    this.inventory.items.push(aSword);
                    this.inventory.items.push(aLamp);
                    this.objectInMainHand = aSword;
                    this.objectInSecondaryHand = aLamp;
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
System.register("ui/playerUi", ["engine/graphics/GraphicsEngine", "engine/graphics/Cell", "engine/objects/Npc"], function (exports_35, context_35) {
    "use strict";
    var GraphicsEngine_3, Cell_3, Npc_6, PlayerUi;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (GraphicsEngine_3_1) {
                GraphicsEngine_3 = GraphicsEngine_3_1;
            },
            function (Cell_3_1) {
                Cell_3 = Cell_3_1;
            },
            function (Npc_6_1) {
                Npc_6 = Npc_6_1;
            }
        ],
        execute: function () {
            PlayerUi = class PlayerUi {
                constructor(npc, camera) {
                    this.npc = npc;
                    this.camera = camera;
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                }
                draw(ctx) {
                    const ui = this;
                    // UI panel background.
                    for (let i = 0; i < this.camera.size.width; i++) {
                        GraphicsEngine_3.drawCell(ctx, this.camera, new Cell_3.Cell(' ', 'white', '#000a'), i, 0);
                    }
                    drawHealth(this.npc, [0, 0]);
                    const right = this.camera.size.width - 1;
                    if (this.objectUnderCursor) {
                        if (this.objectUnderCursor instanceof Npc_6.Npc) {
                            GraphicsEngine_3.drawObjectAt(ctx, this.camera, this.objectUnderCursor, [right, 0]);
                            drawHealth(this.objectUnderCursor, [right - this.objectUnderCursor.maxHealth, 0]);
                        }
                    }
                    else if (this.actionUnderCursor) {
                        GraphicsEngine_3.drawCell(ctx, this.camera, this.actionUnderCursor, right, 0);
                    }
                    function drawHealth(npc, position) {
                        for (let i = 0; i < npc.maxHealth; i++) {
                            const heartCell = new Cell_3.Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
                            GraphicsEngine_3.drawCell(ctx, ui.camera, heartCell, position[0] + i, position[1]);
                        }
                    }
                }
                update(ticks, scene) {
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    for (let o of scene.level.objects) {
                        if (!o.enabled)
                            continue;
                        if (o instanceof Npc_6.Npc) {
                            if (o.position[0] === this.npc.cursorPosition[0]
                                && o.position[1] === this.npc.cursorPosition[1]) {
                                o.highlighted = true;
                                this.objectUnderCursor = o;
                                return;
                            }
                        }
                    }
                    const actionData = scene.getNpcAction(this.npc);
                    if (actionData) {
                        actionData.object.highlighted = true;
                        this.actionUnderCursor = actionData.actionIcon;
                    }
                }
            };
            exports_35("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/objects/chest", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_36, context_36) {
    "use strict";
    var StaticGameObject_6, ObjectSkin_11, ObjectPhysics_8, Chest, chest;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (StaticGameObject_6_1) {
                StaticGameObject_6 = StaticGameObject_6_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            }
        ],
        execute: function () {
            Chest = class Chest extends StaticGameObject_6.StaticGameObject {
                constructor(position) {
                    super([0, 0], new ObjectSkin_11.ObjectSkin(`🧰`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), new ObjectPhysics_8.ObjectPhysics(`.`, ''), position);
                    this.setAction(0, 0, (ctx) => {
                        const items = this.inventory.items;
                        if (items.length === 0) {
                            console.log("Chest is empty.");
                            // TODO: emit player message event.
                        }
                        this.inventory.items = [];
                        ctx.initiator.inventory.addItems(items);
                    });
                }
            };
            exports_36("default", Chest);
            exports_36("chest", chest = () => new Chest([2, 10]));
        }
    };
});
System.register("world/objects/lamp", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_37, context_37) {
    "use strict";
    var StaticGameObject_7, ObjectSkin_12, ObjectPhysics_9, lamp;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (StaticGameObject_7_1) {
                StaticGameObject_7 = StaticGameObject_7_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            }
        ],
        execute: function () {
            exports_37("lamp", lamp = (options) => {
                const object = new StaticGameObject_7.StaticGameObject([0, 2], new ObjectSkin_12.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                    'L': ['yellow', 'transparent'],
                    'H': ['#666', 'transparent'],
                }), new ObjectPhysics_9.ObjectPhysics(` 
 
.`, `B`), options.position);
                object.parameters["is_on"] = true;
                object.setAction(0, 2, (ctx) => {
                    const o = ctx.obj;
                    o.parameters["is_on"] = !o.parameters["is_on"];
                    o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
                    o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
                }, 0, 0);
                return object;
            });
        }
    };
});
System.register("world/objects/house", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_38, context_38) {
    "use strict";
    var StaticGameObject_8, ObjectSkin_13, ObjectPhysics_10, windowHorizontalSkin, wallSkin, physicsUnitBlockedTransparent, physicsUnitBlocked, windowHorizontal, wall;
    var __moduleName = context_38 && context_38.id;
    function house(options) {
        return new StaticGameObject_8.StaticGameObject([2, 2], new ObjectSkin_13.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }), new ObjectPhysics_10.ObjectPhysics(`
 ... 
 . .`, ''), options.position);
    }
    exports_38("house", house);
    return {
        setters: [
            function (StaticGameObject_8_1) {
                StaticGameObject_8 = StaticGameObject_8_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            }
        ],
        execute: function () {
            windowHorizontalSkin = () => new ObjectSkin_13.ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
            wallSkin = () => new ObjectSkin_13.ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
            physicsUnitBlockedTransparent = (transparency) => new ObjectPhysics_10.ObjectPhysics('.', '', '', '', transparency || '0');
            physicsUnitBlocked = () => new ObjectPhysics_10.ObjectPhysics('.');
            exports_38("windowHorizontal", windowHorizontal = (options) => new StaticGameObject_8.StaticGameObject([0, 0], windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), options.position));
            exports_38("wall", wall = (options) => new StaticGameObject_8.StaticGameObject([0, 0], wallSkin(), physicsUnitBlocked(), options.position));
        }
    };
});
System.register("world/objects/bamboo", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_39, context_39) {
    "use strict";
    var ObjectPhysics_11, ObjectSkin_14, StaticGameObject_9;
    var __moduleName = context_39 && context_39.id;
    function bamboo(options) {
        return new StaticGameObject_9.StaticGameObject([0, 4], new ObjectSkin_14.ObjectSkin(`▄
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
        }), new ObjectPhysics_11.ObjectPhysics(` 
 
 
 
 
.`, ``), options.position);
    }
    exports_39("bamboo", bamboo);
    return {
        setters: [
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (StaticGameObject_9_1) {
                StaticGameObject_9 = StaticGameObject_9_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/levels/intro", ["world/objects/chest", "world/objects/lamp", "world/objects/house", "utils/misc", "engine/events/EventLoop", "engine/events/GameEvent", "engine/Level", "world/objects/pineTree", "world/objects/door", "world/objects/bamboo", "engine/objects/Npc", "engine/components/ObjectSkin", "world/items"], function (exports_40, context_40) {
    "use strict";
    var chest_1, lamp_1, house_1, misc_2, EventLoop_3, GameEvent_3, Level_2, pineTree_2, door_2, bamboo_1, Npc_7, ObjectSkin_15, items_2, lamps, doors, house1, tree1, chest1, trees, ulan, npcs, objects, introLevel;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (chest_1_1) {
                chest_1 = chest_1_1;
            },
            function (lamp_1_1) {
                lamp_1 = lamp_1_1;
            },
            function (house_1_1) {
                house_1 = house_1_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (Level_2_1) {
                Level_2 = Level_2_1;
            },
            function (pineTree_2_1) {
                pineTree_2 = pineTree_2_1;
            },
            function (door_2_1) {
                door_2 = door_2_1;
            },
            function (bamboo_1_1) {
                bamboo_1 = bamboo_1_1;
            },
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (items_2_1) {
                items_2 = items_2_1;
            }
        ],
        execute: function () {
            lamps = [
                lamp_1.lamp({ position: [2, 5] }),
                lamp_1.lamp({ position: [17, 5] }),
            ];
            doors = [
                door_2.door({ position: [10, 10] }),
            ];
            house1 = house_1.house({ position: [5, 10] });
            tree1 = pineTree_2.pineTree({ position: [2, 12] });
            chest1 = chest_1.chest();
            exports_40("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(bamboo_1.bamboo({ position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(bamboo_1.bamboo({ position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(0, 5, (ctx) => {
                        const obj = ctx.obj;
                        obj.enabled = false;
                        // console.log("Cut tree"); @todo sent event
                        EventLoop_3.emitEvent(new GameEvent_3.GameEvent(obj, "transfer_items", {
                            recipient: ctx.initiator,
                            items: [items_2.bambooSeed()],
                        }));
                    });
                }
            }
            ulan = new Npc_7.Npc(new ObjectSkin_15.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (ctx) => {
                const o = ctx.obj;
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            npcs = [
                ulan,
            ];
            objects = [house1, chest1, tree1, ...trees, ...lamps, ...npcs, ...doors];
            exports_40("introLevel", introLevel = new Level_2.Level('intro', objects));
            introLevel.portals['intro_door'] = [[10, 10]];
            // scripts
            chest1.setAction(0, 0, function () {
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(chest1, "add_object", { object: misc_2.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
System.register("world/npcs/bee", ["engine/objects/Npc", "engine/components/ObjectSkin"], function (exports_41, context_41) {
    "use strict";
    var Npc_8, ObjectSkin_16, Bee;
    var __moduleName = context_41 && context_41.id;
    function bee(options) {
        return new Bee(options.position);
    }
    exports_41("bee", bee);
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_8.Npc {
                constructor(position) {
                    super(new ObjectSkin_16.ObjectSkin(`🐝`, `.`, {
                        '.': ['yellow', 'transparent'],
                    }), position);
                    this.type = "bee";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const self = this;
                    self.direction = [0, 0];
                    //
                    this.moveRandomly();
                    if (!scene.isPositionBlocked(self.cursorPosition)) {
                        self.move();
                    }
                }
            };
        }
    };
});
System.register("world/npcs/duck", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/behaviors/PreyGroupBehavior"], function (exports_42, context_42) {
    "use strict";
    var Npc_9, ObjectSkin_17, PreyGroupBehavior_2, Duck;
    var __moduleName = context_42 && context_42.id;
    function duck(options) {
        return new Duck(options.position);
    }
    exports_42("duck", duck);
    return {
        setters: [
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (PreyGroupBehavior_2_1) {
                PreyGroupBehavior_2 = PreyGroupBehavior_2_1;
            }
        ],
        execute: function () {
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_9.Npc {
                constructor(position) {
                    super(new ObjectSkin_17.ObjectSkin(`🦆`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), position);
                    this.type = "duck";
                    this.maxHealth = 1;
                    this.health = 1;
                    this.behaviors.push(new PreyGroupBehavior_2.PreyGroupBehavior());
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
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_43, context_43) {
    "use strict";
    var Sprite_2, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (Sprite_2_1) {
                Sprite_2 = Sprite_2_1;
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
            exports_43("sakuraSprite", sakuraSprite = Sprite_2.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/sakuraTree", ["engine/components/ObjectPhysics", "world/sprites/sakura", "world/objects/Tree"], function (exports_44, context_44) {
    "use strict";
    var ObjectPhysics_12, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_44 && context_44.id;
    function sakuraTree(options) {
        return new SakuraTree(options.position);
    }
    exports_44("sakuraTree", sakuraTree);
    return {
        setters: [
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
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
                    super([2, 3], sakura_1.sakuraSprite, new ObjectPhysics_12.ObjectPhysics(`
    
    
  .`, '', '', ` .. 
....
    
    `), position);
                }
            };
        }
    };
});
System.register("world/objects/beehive", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_45, context_45) {
    "use strict";
    var StaticGameObject_10, ObjectSkin_18, ObjectPhysics_13;
    var __moduleName = context_45 && context_45.id;
    function beehive(options) {
        return new StaticGameObject_10.StaticGameObject([0, 0], new ObjectSkin_18.ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }), new ObjectPhysics_13.ObjectPhysics(`.`), options.position);
    }
    exports_45("beehive", beehive);
    return {
        setters: [
            function (StaticGameObject_10_1) {
                StaticGameObject_10 = StaticGameObject_10_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            },
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("world/objects/natural", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_46, context_46) {
    "use strict";
    var StaticGameObject_11, ObjectSkin_19, ObjectPhysics_14, createUnitSkin, createUnitPhysics, createUnitStaticObject, flower, wheat, hotspring;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (StaticGameObject_11_1) {
                StaticGameObject_11 = StaticGameObject_11_1;
            },
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_19.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            createUnitPhysics = () => new ObjectPhysics_14.ObjectPhysics(` `);
            createUnitStaticObject = (options) => new StaticGameObject_11.StaticGameObject([0, 0], createUnitSkin(options.sym, options.color), createUnitPhysics(), options.position);
            exports_46("flower", flower = (options) => createUnitStaticObject(Object.assign(Object.assign({}, options), { sym: `❁`, color: 'red' })));
            exports_46("wheat", wheat = (options) => createUnitStaticObject(Object.assign(Object.assign({}, options), { sym: `♈`, color: 'yellow' })));
            exports_46("hotspring", hotspring = (options) => new StaticGameObject_11.StaticGameObject([0, 0], createUnitSkin(`♨`, 'lightblue'), new ObjectPhysics_14.ObjectPhysics(' ', ' ', 'A'), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/pillar", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_47, context_47) {
    "use strict";
    var ObjectPhysics_15, ObjectSkin_20, StaticGameObject_12, pillar;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (StaticGameObject_12_1) {
                StaticGameObject_12 = StaticGameObject_12_1;
            }
        ],
        execute: function () {
            exports_47("pillar", pillar = (options) => new StaticGameObject_12.StaticGameObject([0, 3], new ObjectSkin_20.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_15.ObjectPhysics(` 
 
 
. `), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/shop", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_48, context_48) {
    "use strict";
    var ObjectPhysics_16, ObjectSkin_21, StaticGameObject_13, shop;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            },
            function (StaticGameObject_13_1) {
                StaticGameObject_13 = StaticGameObject_13_1;
            }
        ],
        execute: function () {
            exports_48("shop", shop = (options) => new StaticGameObject_13.StaticGameObject([2, 3], new ObjectSkin_21.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_16.ObjectPhysics(`       
       
 ..... `), options.position));
        }
    };
});
System.register("world/levels/ggj2020demo/objects/arc", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_49, context_49) {
    "use strict";
    var ObjectPhysics_17, ObjectSkin_22, StaticGameObject_14, arc;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (StaticGameObject_14_1) {
                StaticGameObject_14 = StaticGameObject_14_1;
            }
        ],
        execute: function () {
            exports_49("arc", arc = (options) => new StaticGameObject_14.StaticGameObject([2, 3], new ObjectSkin_22.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_17.ObjectPhysics(`     
     
     
.   .`), options.position));
        }
    };
});
System.register("engine/data/Tiles", ["engine/graphics/Cell"], function (exports_50, context_50) {
    "use strict";
    var Cell_4, Tiles;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            }
        ],
        execute: function () {
            Tiles = class Tiles {
                static parseTiles(str, colors) {
                    let common = {};
                    return str
                        .split('\n')
                        .map(mapLine);
                    function mapLine(line) {
                        return line
                            .split('')
                            .map(mapCell);
                    }
                    function mapCell(s) {
                        return s === ' ' ? null : createCell(s);
                    }
                    function createCell(s) {
                        return common[s] || (common[s] = new Cell_4.Cell(' ', 'transparent', colors[s]));
                    }
                }
            };
            exports_50("Tiles", Tiles);
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/data/Tiles"], function (exports_51, context_51) {
    "use strict";
    var Tiles_1, tiles;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (Tiles_1_1) {
                Tiles_1 = Tiles_1_1;
            }
        ],
        execute: function () {
            exports_51("tiles", tiles = Tiles_1.Tiles.parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
                'g': '#350',
                'G': '#240',
                'w': '#358',
                'W': '#246',
                'b': '#444',
                'B': '#333',
                's': '#b80',
            }));
        }
    };
});
System.register("world/levels/ggj2020demo/level", ["engine/Level", "world/npcs/bee", "world/npcs/duck", "world/npcs/sheep", "world/objects/lamp", "world/objects/house", "world/objects/bamboo", "world/objects/pineTree", "world/objects/sakuraTree", "world/objects/beehive", "world/objects/natural", "world/levels/ggj2020demo/objects/pillar", "world/levels/ggj2020demo/objects/shop", "world/levels/ggj2020demo/objects/arc", "world/levels/ggj2020demo/tiles", "world/objects/fence"], function (exports_52, context_52) {
    "use strict";
    var Level_3, bee_1, duck_1, sheep_2, lamp_2, house_2, bamboo_2, pineTree_3, sakuraTree_1, beehive_1, natural_1, pillar_1, shop_1, arc_1, tiles_1, fence_2, levelWidth, levelHeight, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheepList, wheats, flowers, bamboos, beehives, bees, hotsprings, objects, level;
    var __moduleName = context_52 && context_52.id;
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
            function (sheep_2_1) {
                sheep_2 = sheep_2_1;
            },
            function (lamp_2_1) {
                lamp_2 = lamp_2_1;
            },
            function (house_2_1) {
                house_2 = house_2_1;
            },
            function (bamboo_2_1) {
                bamboo_2 = bamboo_2_1;
            },
            function (pineTree_3_1) {
                pineTree_3 = pineTree_3_1;
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
            function (tiles_1_1) {
                tiles_1 = tiles_1_1;
            },
            function (fence_2_1) {
                fence_2 = fence_2_1;
            }
        ],
        execute: function () {
            levelWidth = 51;
            levelHeight = 30;
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
            ].map((x) => pineTree_3.pineTree(x));
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
                house_2.house({ position: [25, 5] }),
                house_2.house({ position: [15, 25] }),
                house_2.house({ position: [13, 3] }),
                house_2.house({ position: [3, 10] }),
            ];
            lamps = [
                lamp_2.lamp({ position: [27, 5] }),
                lamp_2.lamp({ position: [13, 25] }),
                lamp_2.lamp({ position: [15, 3] }),
                lamp_2.lamp({ position: [1, 10] }),
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
            ].map((x) => sheep_2.sheep(x));
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
            ].map((x) => bamboo_2.bamboo(x));
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
            objects = [
                ...fences, ...extraFences,
                ...trees, ...sakuras, ...bamboos,
                ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                ...flowers, ...lamps, ...wheats,
                ...hotsprings,
                ...ducks, ...bees, ...sheepList,
            ];
            exports_52("level", level = new Level_3.Level('ggj2020demo', objects, tiles_1.tiles, levelWidth, levelHeight));
        }
    };
});
System.register("world/levels/devHub", ["engine/Level", "world/objects/house", "world/objects/fence", "world/objects/door", "world/objects/chest", "world/items"], function (exports_53, context_53) {
    "use strict";
    var Level_4, house_3, fence_3, door_3, chest_2, items_3, fences, house1, doors, chest, objects, level, devHubLevel;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (house_3_1) {
                house_3 = house_3_1;
            },
            function (fence_3_1) {
                fence_3 = fence_3_1;
            },
            function (door_3_1) {
                door_3 = door_3_1;
            },
            function (chest_2_1) {
                chest_2 = chest_2_1;
            },
            function (items_3_1) {
                items_3 = items_3_1;
            }
        ],
        execute: function () {
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < 20; x++) {
                    fences.push(fence_3.fence({ position: [x, 0] }));
                    fences.push(fence_3.fence({ position: [x, 19] }));
                }
                for (let y = 1; y < 19; y++) {
                    fences.push(fence_3.fence({ position: [0, y] }));
                    fences.push(fence_3.fence({ position: [19, y] }));
                }
            }
            house1 = house_3.house({ position: [6, 2] });
            doors = [
                door_3.door({ position: [2, 2] }),
                door_3.door({ position: [2, 4] }),
                door_3.door({ position: [6, 2] }),
            ];
            chest = new chest_2.default([7, 7]);
            chest.inventory.addItems([items_3.bambooSeed()]);
            objects = [...fences, house1, ...doors, chest];
            level = new Level_4.Level('devHub', objects);
            level.portals['lights'] = [[2, 2]];
            level.portals['dungeon'] = [[2, 4]];
            level.portals['house'] = [[6, 2]];
            exports_53("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/levels/dungeon", ["engine/Level", "world/objects/door", "world/objects/campfire", "utils/layer", "world/objects/house"], function (exports_54, context_54) {
    "use strict";
    var Level_5, door_4, campfire_3, layer_1, house_4, walls, campfires, doors, objects, level, dungeonLevel;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [
            function (Level_5_1) {
                Level_5 = Level_5_1;
            },
            function (door_4_1) {
                door_4 = door_4_1;
            },
            function (campfire_3_1) {
                campfire_3 = campfire_3_1;
            },
            function (layer_1_1) {
                layer_1 = layer_1_1;
            },
            function (house_4_1) {
                house_4 = house_4_1;
            }
        ],
        execute: function () {
            walls = [];
            if (true) { // add border walls
                for (let x = 0; x < 20; x++) {
                    walls.push(house_4.wall({ position: [x, 0] }));
                    walls.push(house_4.wall({ position: [x, 19] }));
                }
                for (let y = 1; y < 19; y++) {
                    walls.push(house_4.wall({ position: [0, y] }));
                    walls.push(house_4.wall({ position: [19, y] }));
                }
            }
            if (true) { // add random walls
                for (let y = 2; y < 17; y += 2) {
                    const parts = 2;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newHeadStone = house_4.wall({ position: [x, y] });
                        walls.push(newHeadStone);
                    }
                }
            }
            campfires = [
                campfire_3.campfire({ position: [3, 3] }),
                campfire_3.campfire({ position: [10, 13] }),
            ];
            doors = [
                door_4.door({ position: [2, 2] }),
            ];
            objects = [...walls, ...doors, ...campfires];
            level = new Level_5.Level('dungeon', objects);
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
            level.portals['dungeon'] = [[2, 2]];
            exports_54("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/levels/house", ["engine/Level", "world/objects/door", "utils/layer", "world/objects/house"], function (exports_55, context_55) {
    "use strict";
    var Level_6, door_5, layer_2, house_5, walls, margin, left, top, width, height, campfires, doors, objects, level, houseLevel;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (Level_6_1) {
                Level_6 = Level_6_1;
            },
            function (door_5_1) {
                door_5 = door_5_1;
            },
            function (layer_2_1) {
                layer_2 = layer_2_1;
            },
            function (house_5_1) {
                house_5 = house_5_1;
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
                    const object = (x < 6 || x > 9) ? house_5.wall : house_5.windowHorizontal;
                    walls.push(object({ position: [margin + x, top] }));
                    walls.push(object({ position: [margin + x, margin + height - 1] }));
                }
                for (let y = 0; y < height; y++) {
                    walls.push(house_5.wall({ position: [left, margin + y] }));
                    walls.push(house_5.wall({ position: [margin + width - 1, margin + y] }));
                }
            }
            campfires = [
            //campfire({ position: [10, 13] }),
            ];
            doors = [
                door_5.door({ position: [left + 2, top + 2] }),
            ];
            objects = [...walls, ...doors, ...campfires];
            level = new Level_6.Level('house', objects);
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
            level.portals['house'] = [[left + 2, top + 2]];
            exports_55("houseLevel", houseLevel = level);
        }
    };
});
System.register("world/objects/headStone", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_56, context_56) {
    "use strict";
    var ObjectSkin_23, StaticGameObject_15, ObjectPhysics_18, headStone;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (StaticGameObject_15_1) {
                StaticGameObject_15 = StaticGameObject_15_1;
            },
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            }
        ],
        execute: function () {
            exports_56("headStone", headStone = (options) => new StaticGameObject_15.StaticGameObject([0, 0], new ObjectSkin_23.ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_18.ObjectPhysics('.'), options.position));
        }
    };
});
System.register("world/levels/lights", ["world/objects/campfire", "engine/Level", "world/objects/pineTree", "world/objects/fence", "world/objects/headStone", "world/objects/house"], function (exports_57, context_57) {
    "use strict";
    var campfire_4, Level_7, pineTree_4, fence_4, headStone_1, house_6, fences, headStones, walls, tree2, campfires, objects, level, lightsLevel;
    var __moduleName = context_57 && context_57.id;
    return {
        setters: [
            function (campfire_4_1) {
                campfire_4 = campfire_4_1;
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
            function (headStone_1_1) {
                headStone_1 = headStone_1_1;
            },
            function (house_6_1) {
                house_6 = house_6_1;
            }
        ],
        execute: function () {
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
                campfire_4.campfire({ position: [5, 4] }),
                campfire_4.campfire({ position: [9, 4] }),
                campfire_4.campfire({ position: [13, 4] }),
                //
                campfire_4.campfire({ position: [3, 17] }),
            ];
            objects = [...fences, ...walls, tree2, ...campfires, ...headStones];
            level = new Level_7.Level('lights', objects);
            level.portals['lights'] = [[7, 12]];
            exports_57("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/levels/levels", ["world/levels/devHub", "world/levels/dungeon", "world/levels/ggj2020demo/level", "world/levels/house", "world/levels/intro", "world/levels/lights", "world/levels/sheep"], function (exports_58, context_58) {
    "use strict";
    var devHub_1, dungeon_1, level_1, house_7, intro_1, lights_1, sheep_3, list, levels;
    var __moduleName = context_58 && context_58.id;
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
            }
        ],
        execute: function () {
            list = [devHub_1.devHubLevel, intro_1.introLevel, lights_1.lightsLevel, sheep_3.sheepLevel, level_1.level, dungeon_1.dungeonLevel, house_7.houseLevel];
            exports_58("levels", levels = {});
            for (const item of list) {
                levels[item.id] = item;
            }
        }
    };
});
System.register("main", ["world/levels/sheep", "world/items", "engine/events/GameEvent", "engine/events/EventLoop", "engine/Scene", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "engine/objects/Npc", "world/levels/intro", "world/levels/ggj2020demo/level", "world/levels/levels", "world/levels/lights", "world/levels/devHub", "world/levels/dungeon"], function (exports_59, context_59) {
    "use strict";
    var sheep_4, items_4, GameEvent_4, EventLoop_4, Scene_1, Cell_5, GraphicsEngine_4, CanvasContext_1, hero_1, playerUi_1, Npc_10, intro_2, level_2, levels_1, lights_2, devHub_2, dungeon_2, canvas, ctx, debugInput, Game, game, scene, leftPad, topPad, heroUi, ticksPerStep;
    var __moduleName = context_59 && context_59.id;
    function runDebugCommand(rawInput) {
        console.log(`DEBUG: ${rawInput}`);
        const tokens = rawInput.split(' ');
        if (tokens[0] === 'time') {
            if (tokens[1] === 'set') {
                const time = parseFloat(tokens[2]);
                scene.gameTime = time * scene.ticksPerDay;
            }
            else if (tokens[1] === 'get') {
                console.log(scene.gameTime);
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
                if (portalPosition[0] !== hero_1.hero.position[0] ||
                    portalPosition[1] !== hero_1.hero.position[1]) {
                    continue;
                }
                if (portalPositions.length === 2) {
                    // Pair portal is on the same level.
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
                        // TODO add portal cooldown.
                        console.log(`Pair portal for "${portalId}" was not found.`);
                    }
                }
                break;
            }
        }
        function teleportTo(levelId, position) {
            if (!scene.level) {
                return;
            }
            if (levelId !== scene.level.id) {
                selectLevel(levels_1.levels[levelId]);
            }
            hero_1.hero.position[0] = position[0];
            hero_1.hero.position[1] = position[1];
            // TODO: raise game event.
        }
    }
    function selectLevel(level) {
        console.log(`Selecting level "${level.id}".`);
        scene.level = level;
        scene.level.objects = scene.level.objects.filter(x => x !== hero_1.hero).concat([hero_1.hero]);
        hero_1.hero.position = [9, 7];
        scene.camera.follow(hero_1.hero, level);
    }
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
    function onkeydown(ev) {
        // const raw_key = ev.key.toLowerCase();
        const key_code = ev.code;
        if (key_code === "KeyE") {
            if (game.mode !== 'inventory') {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "switch_mode", { from: game.mode, to: "inventory" }));
            }
            else {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
            }
            return;
        }
        if (game.mode === 'scene') {
            // onSceneInput();
        }
        else if (game.mode === 'dialog') {
            if (key_code === "Escape") {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
            }
        }
        else if (game.mode === 'inventory') {
            if (key_code === "Escape") {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
            }
        }
    }
    function onkeypress(code) {
        const raw_key = code.key.toLowerCase();
        const key_code = code.code;
        // console.log(raw_key, key_code);
        if (game.mode === 'scene') {
            onSceneInput();
        }
        else if (game.mode === 'dialog') {
            //
        }
        onInterval();
        function onSceneInput() {
            if (raw_key === 'w') {
                hero_1.hero.direction = [0, -1];
            }
            else if (raw_key === 's') {
                hero_1.hero.direction = [0, +1];
            }
            else if (raw_key === 'a') {
                hero_1.hero.direction = [-1, 0];
            }
            else if (raw_key === 'd') {
                hero_1.hero.direction = [+1, 0];
            }
            else if (raw_key === ' ') {
                // TODO 'sword' type
                // hero.objectInMainHand === sword
                if (false) {
                    const npc = getNpcUnderCursor(hero_1.hero);
                    if (npc) {
                        EventLoop_4.emitEvent(new GameEvent_4.GameEvent(hero_1.hero, 'attack', {
                            object: hero_1.hero,
                            subject: npc
                        }));
                    }
                    return;
                }
                const actionData = getActionUnderCursor();
                if (actionData) {
                    actionData.action({ obj: actionData.object, initiator: hero_1.hero });
                }
                onInterval();
                return;
            }
            else {
                // debug keys
                if (code.shiftKey) {
                    if (key_code === 'Digit1') {
                        hero_1.hero.objectInMainHand = items_4.emptyHand();
                    }
                    else if (key_code === 'Digit2') {
                        hero_1.hero.objectInMainHand = items_4.sword();
                    }
                    else if (key_code === "KeyQ") {
                        selectLevel(devHub_2.devHubLevel);
                    }
                    else if (key_code === "KeyR") {
                        selectLevel(sheep_4.sheepLevel);
                    }
                    else if (key_code === "KeyE") {
                        selectLevel(level_2.level);
                    }
                    else if (key_code === "KeyT") {
                        selectLevel(lights_2.lightsLevel);
                    }
                    else if (key_code === "KeyY") {
                        selectLevel(intro_2.introLevel);
                    }
                    else if (key_code === "KeyU") {
                        selectLevel(dungeon_2.dungeonLevel);
                    }
                    return;
                }
                const oldWeatherType = scene.level.weatherType;
                if (raw_key === '1') { // debug
                    scene.level.weatherType = 'normal';
                }
                else if (raw_key === '2') { // debug
                    scene.level.weatherType = 'rain';
                }
                else if (raw_key === '3') { // debug
                    scene.level.weatherType = 'snow';
                }
                else if (raw_key === '4') { // debug
                    scene.level.weatherType = 'rain_and_snow';
                }
                else if (raw_key === '5') { // debug
                    scene.level.weatherType = 'mist';
                }
                if (oldWeatherType !== scene.level.weatherType) {
                    EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "weather_changed", {
                        from: oldWeatherType,
                        to: scene.level.weatherType,
                    }));
                }
                // wind
                if (raw_key === 'p') {
                    scene.level.isWindy = !scene.level.isWindy;
                    EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "wind_changed", {
                        from: !scene.level.isWindy,
                        to: scene.level.isWindy,
                    }));
                }
                //
                if (raw_key === 'q') { // debug
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
                return; // skip
            }
            if (!code.shiftKey) {
                if (!scene.isPositionBlocked(hero_1.hero.cursorPosition)) {
                    hero_1.hero.move();
                }
            }
        }
    }
    function getActionUnderCursor() {
        return scene.getNpcAction(hero_1.hero);
    }
    function getNpcUnderCursor(npc) {
        for (let object of scene.level.objects) {
            if (!object.enabled)
                continue;
            if (!(object instanceof Npc_10.Npc))
                continue;
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
                    GraphicsEngine_4.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'black', '#555'), x, scene.camera.size.height - dialogHeight + y);
                else
                    GraphicsEngine_4.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'white', '#333'), x, scene.camera.size.height - dialogHeight + y);
            }
        }
    }
    function drawInventory() {
        const dialogWidth = scene.camera.size.width;
        const dialogHeight = scene.camera.size.height / 2 - 3;
        for (let y = 0; y < dialogHeight; y++) {
            for (let x = 0; x < dialogWidth; x++) {
                if (x === 0 || x === dialogWidth - 1 || y === 0 || y === dialogHeight - 1)
                    GraphicsEngine_4.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'black', '#555'), x, scene.camera.size.height - dialogHeight + y);
                else
                    GraphicsEngine_4.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'white', '#333'), x, scene.camera.size.height - dialogHeight + y);
            }
        }
        const top = scene.camera.size.height - dialogHeight + 1;
        let y = 0;
        for (const item of hero_1.hero.inventory.items) {
            GraphicsEngine_4.drawObjectAt(ctx, scene.camera, item, [2, top + y]);
            y += 1;
        }
    }
    function onInterval() {
        game.update(ticksPerStep);
        EventLoop_4.eventLoop([game, scene, ...scene.level.objects]);
        game.draw();
    }
    return {
        setters: [
            function (sheep_4_1) {
                sheep_4 = sheep_4_1;
            },
            function (items_4_1) {
                items_4 = items_4_1;
            },
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Cell_5_1) {
                Cell_5 = Cell_5_1;
            },
            function (GraphicsEngine_4_1) {
                GraphicsEngine_4 = GraphicsEngine_4_1;
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
            function (Npc_10_1) {
                Npc_10 = Npc_10_1;
            },
            function (intro_2_1) {
                intro_2 = intro_2_1;
            },
            function (level_2_1) {
                level_2 = level_2_1;
            },
            function (levels_1_1) {
                levels_1 = levels_1_1;
            },
            function (lights_2_1) {
                lights_2 = lights_2_1;
            },
            function (devHub_2_1) {
                devHub_2 = devHub_2_1;
            },
            function (dungeon_2_1) {
                dungeon_2 = dungeon_2_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = new CanvasContext_1.CanvasContext(canvas.getContext("2d"));
            debugInput = document.getElementById("debug");
            debugInput.addEventListener('keyup', function (ev) {
                const input = ev.target;
                if (ev.key === 'Enter' && input.value) {
                    runDebugCommand(input.value);
                }
            });
            debugInput.addEventListener('focusin', function (ev) { disableGameInput(); });
            debugInput.addEventListener('focusout', function (ev) { enableGameInput(); });
            Game = class Game {
                constructor() {
                    this.mode = "scene"; // "dialog", "inventory", ...
                }
                handleEvent(ev) {
                    if (ev.type === "switch_mode") {
                        this.mode = ev.args.to;
                    }
                    else if (ev.type === "add_object") {
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
                    else if (this.mode === "inventory") {
                        drawInventory();
                    }
                    ctx.draw();
                }
                update(ticks) {
                    heroUi.update(ticks, scene);
                    if (this.mode === "scene") {
                        checkPortals();
                        scene.update(ticks);
                    }
                }
            };
            game = new Game();
            scene = new Scene_1.Scene();
            selectLevel(devHub_2.devHubLevel);
            exports_59("leftPad", leftPad = (ctx.context.canvas.width - GraphicsEngine_4.cellStyle.size.width * scene.camera.size.width) / 2);
            exports_59("topPad", topPad = (ctx.context.canvas.height - GraphicsEngine_4.cellStyle.size.height * scene.camera.size.height) / 2);
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, scene.camera);
            enableGameInput();
            ticksPerStep = 33;
            // initial events
            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "weather_changed", { from: scene.level.weatherType, to: scene.level.weatherType }));
            EventLoop_4.emitEvent(new GameEvent_4.GameEvent("system", "wind_changed", { from: scene.level.isWindy, to: scene.level.isWindy }));
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window.command = new class {
                getItem(itemName) {
                    console.log('Not implemented yet');
                }
                takeItem(itemName) {
                    if (itemName === 'sword') {
                        hero_1.hero.objectInMainHand = items_4.sword();
                    }
                    else if (itemName === 'lamp') {
                        hero_1.hero.objectInMainHand = items_4.lamp();
                    }
                }
                takeItem2(itemName) {
                    if (itemName === 'lamp') {
                        hero_1.hero.objectInSecondaryHand = items_4.lamp();
                    }
                    else {
                        hero_1.hero.objectInSecondaryHand = null;
                    }
                }
            };
        }
    };
});
//# sourceMappingURL=app.js.map