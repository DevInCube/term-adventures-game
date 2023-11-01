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
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '', topMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                    this.temperatures = temperatureMask.split('\n');
                    this.tops = topMask.split('\n');
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
System.register("engine/objects/Item", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_11, context_11) {
    "use strict";
    var SceneObject_1, ObjectSkin_1, ObjectPhysics_1, Item;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (SceneObject_1_1) {
                SceneObject_1 = SceneObject_1_1;
            },
            function (ObjectSkin_1_1) {
                ObjectSkin_1 = ObjectSkin_1_1;
            },
            function (ObjectPhysics_1_1) {
                ObjectPhysics_1 = ObjectPhysics_1_1;
            }
        ],
        execute: function () {
            Item = class Item extends SceneObject_1.SceneObject {
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
                new() {
                    return new Item([0, 0], new ObjectSkin_1.ObjectSkin(), new ObjectPhysics_1.ObjectPhysics(), [0, 0]);
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
                                    scene.level.blockedLayer[top][left] = true;
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
                                    const roofHoleVal = (roofHoles[top] && roofHoles[top][left]) || false;
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
                        fillLayer(scene.level.lightLayer, scene.globalLightLevel);
                        const maxValue = 15;
                        for (let y = 0; y < scene.level.height; y++) {
                            for (let x = 0; x < scene.level.width; x++) {
                                const cloudValue = (scene.level.cloudLayer[y] && scene.level.cloudLayer[y][x]) || 0;
                                const roofValue = (scene.level.roofLayer[y] && scene.level.roofLayer[y][x]) || 0;
                                const cloudOpacity = (maxValue - cloudValue) / maxValue;
                                const roofOpacity = (maxValue - roofValue) / maxValue;
                                const opacity = cloudOpacity * roofOpacity;
                                scene.level.lightLayer[y][x] = Math.round(scene.level.lightLayer[y][x] * opacity) | 0;
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
                        const [x, y] = position;
                        if (y >= array.length || x >= array[y].length)
                            return;
                        if (array[y][x] - speed <= min)
                            return;
                        for (let i = x - 1; i < x + 2; i++)
                            for (let j = y - 1; j < y + 2; j++)
                                if ((i === x || j === y) && !(i === x && j === y)
                                    && (j >= 0 && j < array.length && i >= 0 && i < array[j].length)
                                    && (array[j][i] + 1 < array[y][x])) {
                                    array[j][i] = array[y][x] - speed;
                                    const nextPosition = [i, j];
                                    if (scene.isPositionBlocked(nextPosition))
                                        continue;
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
                    return (layer[position[1]] && layer[position[1]][position[0]]) === true;
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
System.register("engine/objects/StaticGameObject", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_14, context_14) {
    "use strict";
    var SceneObject_2, ObjectSkin_2, ObjectPhysics_2, StaticGameObject;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (SceneObject_2_1) {
                SceneObject_2 = SceneObject_2_1;
            },
            function (ObjectSkin_2_1) {
                ObjectSkin_2 = ObjectSkin_2_1;
            },
            function (ObjectPhysics_2_1) {
                ObjectPhysics_2 = ObjectPhysics_2_1;
            }
        ],
        execute: function () {
            StaticGameObject = class StaticGameObject extends SceneObject_2.SceneObject {
                constructor(originPoint, skin, physics, position = [0, 0]) {
                    super(originPoint, skin, physics, position);
                }
                new() { return new StaticGameObject([0, 0], new ObjectSkin_2.ObjectSkin(), new ObjectPhysics_2.ObjectPhysics(), [0, 0]); }
            };
            exports_14("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics"], function (exports_15, context_15) {
    "use strict";
    var ObjectSkin_3, StaticGameObject_1, ObjectPhysics_3;
    var __moduleName = context_15 && context_15.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_15("distanceTo", distanceTo);
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_3.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_3.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_15("createTextObject", createTextObject);
    function clone(o, params = {}) {
        return Object.assign(o.new(), deepCopy(o), params);
    }
    exports_15("clone", clone);
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
    exports_15("deepCopy", deepCopy);
    return {
        setters: [
            function (ObjectSkin_3_1) {
                ObjectSkin_3 = ObjectSkin_3_1;
            },
            function (StaticGameObject_1_1) {
                StaticGameObject_1 = StaticGameObject_1_1;
            },
            function (ObjectPhysics_3_1) {
                ObjectPhysics_3 = ObjectPhysics_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("engine/objects/SceneObject", ["engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_16, context_16) {
    "use strict";
    var ObjectSkin_4, ObjectPhysics_4, SceneObject;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (ObjectSkin_4_1) {
                ObjectSkin_4 = ObjectSkin_4_1;
            },
            function (ObjectPhysics_4_1) {
                ObjectPhysics_4 = ObjectPhysics_4_1;
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
                    this.ticks = 0;
                    //
                }
                new() { return new SceneObject([0, 0], new ObjectSkin_4.ObjectSkin(), new ObjectPhysics_4.ObjectPhysics(), [0, 0]); }
                // add cb params
                setAction(left, top, action, ileft = left, itop = top) {
                    this.actions.push([[left, top], action, [ileft, itop]]);
                }
                handleEvent(ev) { }
                update(ticks, scene) {
                    this.ticks += ticks;
                }
            };
            exports_16("SceneObject", SceneObject);
        }
    };
});
System.register("engine/objects/Npc", ["engine/objects/SceneObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "utils/misc", "engine/events/EventLoop", "engine/events/GameEvent"], function (exports_17, context_17) {
    "use strict";
    var SceneObject_3, ObjectSkin_5, ObjectPhysics_5, misc_1, EventLoop_2, GameEvent_2, Npc;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (SceneObject_3_1) {
                SceneObject_3 = SceneObject_3_1;
            },
            function (ObjectSkin_5_1) {
                ObjectSkin_5 = ObjectSkin_5_1;
            },
            function (ObjectPhysics_5_1) {
                ObjectPhysics_5 = ObjectPhysics_5_1;
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
                constructor(skin = new ObjectSkin_5.ObjectSkin(), position = [0, 0], originPoint = [0, 0]) {
                    super(originPoint, skin, new ObjectPhysics_5.ObjectPhysics(`.`, ``), position);
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
                    this.important = true;
                }
                new() { return new Npc(); }
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
            exports_17("Npc", Npc);
        }
    };
});
System.register("world/objects/Campfire", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_18, context_18) {
    "use strict";
    var ObjectPhysics_6, ObjectSkin_6, StaticGameObject_2, Campfire;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            },
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            }
        ],
        execute: function () {
            Campfire = class Campfire extends StaticGameObject_2.StaticGameObject {
                constructor() {
                    super([0, 0], new ObjectSkin_6.ObjectSkin(`🔥`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_6.ObjectPhysics(` `, 'F', 'F'));
                }
                new() { return new Campfire(); }
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
            exports_18("Campfire", Campfire);
        }
    };
});
System.register("world/npcs/Sheep", ["engine/objects/Npc", "engine/components/ObjectSkin"], function (exports_19, context_19) {
    "use strict";
    var Npc_3, ObjectSkin_7, Sheep;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_3.Npc {
                constructor() {
                    super(new ObjectSkin_7.ObjectSkin(`🐑`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), [0, 0]);
                    this.type = "sheep";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                new() {
                    return new Sheep();
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const sheep = this;
                    const state = sheep.parameters["state"];
                    if (!state) {
                        //sheep.parameters["state"] = (Math.random() * 2 | 0) === 0 ? "wandering" : "still";
                    }
                    sheep.direction = [0, 0];
                    //
                    let enemiesNearby = this.getMobsNearby(scene, 5, x => x.type !== 'sheep');
                    const fearedSheeps = this.getMobsNearby(scene, 2, x => x.type === "sheep" && (x.parameters["stress"] | 0) > 0);
                    if (enemiesNearby.length || fearedSheeps.length) {
                        if (enemiesNearby.length) {
                            sheep.parameters["state"] = "feared";
                            sheep.parameters["stress"] = 3;
                            sheep.parameters["enemies"] = enemiesNearby;
                        }
                        else { // if (fearedSheeps.length) 
                            const sheepsStress = Math.max(...fearedSheeps.map(x => x.parameters["stress"] | 0));
                            //console.log(sheepsStress);
                            sheep.parameters["stress"] = sheepsStress - 1;
                            if (sheep.parameters["stress"] === 0) {
                                sheep.parameters["state"] = "still";
                                sheep.parameters["enemies"] = [];
                            }
                            else {
                                sheep.parameters["state"] = "feared_2";
                                sheep.parameters["enemies"] = fearedSheeps[0].parameters["enemies"];
                                enemiesNearby = fearedSheeps[0].parameters["enemies"];
                            }
                        }
                    }
                    else {
                        sheep.parameters["state"] = "wandering";
                        sheep.parameters["stress"] = 0;
                        sheep.parameters["enemies"] = [];
                    }
                    if (state === "wandering") {
                        this.moveRandomly();
                    }
                    if (!scene.isPositionBlocked(sheep.cursorPosition)) {
                        sheep.move();
                    }
                    else if (sheep.parameters["stress"] > 0) {
                        this.runAway(scene, enemiesNearby);
                    }
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
            exports_19("Sheep", Sheep);
        }
    };
});
System.register("world/npcs/Wolf", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/objects/Campfire"], function (exports_20, context_20) {
    "use strict";
    var Npc_4, ObjectSkin_8, Campfire_1, Wolf;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            },
            function (Campfire_1_1) {
                Campfire_1 = Campfire_1_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_4.Npc {
                constructor() {
                    super(new ObjectSkin_8.ObjectSkin(`🐺`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), [15, 15]);
                    this.type = "wolf";
                    this.moveSpeed = 4;
                    this.hungerTicks = 0;
                    this.parameters["hunger"] = 3;
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const wolf = this;
                    wolf.direction = [0, 0];
                    //
                    wolf.hungerTicks += ticks;
                    if (wolf.hungerTicks > 2000) {
                        wolf.parameters["hunger"] += 1;
                        wolf.hungerTicks = 0;
                    }
                    //
                    if (wolf.parameters["hunger"] >= 3) {
                        const preyList = this.getMobsNearby(scene, 6, npc => npc.type === 'sheep');
                        if (!preyList.length) {
                            wolf.parameters["state"] = "wandering";
                        }
                        else if (!wolf.parameters["target"]) {
                            wolf.parameters["target"] = preyList[0];
                            wolf.parameters["state"] = "hunting";
                        }
                    }
                    const target = wolf.parameters["target"];
                    const firesNearby = this.getObjectsNearby(scene, 5, x => x instanceof Campfire_1.Campfire); // TODO: static object typing.
                    if (firesNearby.length) {
                        wolf.parameters["state"] = "feared";
                        wolf.parameters["enemies"] = firesNearby;
                        wolf.parameters["target"] = undefined;
                    }
                    if (wolf.parameters["state"] === "hunting") {
                        if (wolf.distanceTo(target) <= 1) {
                            wolf.attack(target);
                        }
                        wolf.approach(scene, target);
                    }
                    else if (wolf.parameters["state"] === "feared") {
                        wolf.runAway(scene, firesNearby);
                    }
                    else if (wolf.parameters["state"] === "wandering") {
                        wolf.moveRandomly(10);
                        if (!scene.isPositionBlocked(wolf.cursorPosition)) {
                            wolf.move();
                        }
                    }
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
                handleEvent(ev) {
                    super.handleEvent(ev);
                    if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
                        this.parameters["target"] = null;
                        if (ev.args.cause.type === "attacked" && ev.args.cause.by === this) {
                            this.parameters["hunger"] = 0;
                            this.parameters["state"] = "still";
                        }
                    }
                }
            };
            exports_20("Wolf", Wolf);
            ;
        }
    };
});
System.register("engine/data/SpriteInfo", [], function (exports_21, context_21) {
    "use strict";
    var SpriteInfo;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            exports_21("SpriteInfo", SpriteInfo);
        }
    };
});
System.register("engine/data/Sprite", ["engine/components/ObjectSkin", "engine/data/SpriteInfo"], function (exports_22, context_22) {
    "use strict";
    var ObjectSkin_9, SpriteInfo_1, Sprite;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
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
                                sprite.frames[name].push(new ObjectSkin_9.ObjectSkin(bodies[k], colors[k], colorsDict));
                            }
                        }
                        else {
                            i += 1;
                        }
                    }
                    return sprite;
                }
            };
            exports_22("Sprite", Sprite);
        }
    };
});
System.register("world/objects/Tree", ["engine/objects/StaticGameObject"], function (exports_23, context_23) {
    "use strict";
    var StaticGameObject_3, Tree;
    var __moduleName = context_23 && context_23.id;
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
            exports_23("Tree", Tree);
            ;
        }
    };
});
System.register("world/sprites/tree", ["engine/data/Sprite"], function (exports_24, context_24) {
    "use strict";
    var Sprite_1, treeSpriteRaw, treeSprite;
    var __moduleName = context_24 && context_24.id;
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
            exports_24("treeSprite", treeSprite = Sprite_1.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects/PineTree", ["engine/components/ObjectPhysics", "world/sprites/tree", "world/objects/Tree"], function (exports_25, context_25) {
    "use strict";
    var ObjectPhysics_7, tree_1, Tree_1, PineTree;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
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
                constructor() {
                    super([1, 3], tree_1.treeSprite, new ObjectPhysics_7.ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), [2, 12]);
                }
                new() { return new PineTree(); }
            };
            exports_25("PineTree", PineTree);
        }
    };
});
System.register("world/objects/Door", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_26, context_26) {
    "use strict";
    var ObjectPhysics_8, ObjectSkin_10, StaticGameObject_4, Door;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            },
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            }
        ],
        execute: function () {
            Door = class Door extends StaticGameObject_4.StaticGameObject {
                constructor() {
                    super([0, 0], new ObjectSkin_10.ObjectSkin(`🚪`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_8.ObjectPhysics(` `), [10, 10]);
                }
                new() { return new Door(); }
            };
            exports_26("Door", Door);
        }
    };
});
System.register("world/levels/sheep", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "utils/misc", "world/objects/Campfire", "world/npcs/Sheep", "world/npcs/Wolf", "engine/Level", "world/objects/PineTree", "world/objects/Door"], function (exports_27, context_27) {
    "use strict";
    var ObjectSkin_11, StaticGameObject_5, ObjectPhysics_9, misc_2, Campfire_2, Sheep_1, Wolf_1, Level_1, PineTree_1, Door_1, vFence, hFence, sheeps, wolves, fences, sheep, wolf, tree2, campfire, campfires, door, doors, objects, sheepLevel;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (Campfire_2_1) {
                Campfire_2 = Campfire_2_1;
            },
            function (Sheep_1_1) {
                Sheep_1 = Sheep_1_1;
            },
            function (Wolf_1_1) {
                Wolf_1 = Wolf_1_1;
            },
            function (Level_1_1) {
                Level_1 = Level_1_1;
            },
            function (PineTree_1_1) {
                PineTree_1 = PineTree_1_1;
            },
            function (Door_1_1) {
                Door_1 = Door_1_1;
            }
        ],
        execute: function () {
            vFence = new StaticGameObject_5.StaticGameObject([0, 0], new ObjectSkin_11.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]);
            hFence = new StaticGameObject_5.StaticGameObject([0, 0], new ObjectSkin_11.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]);
            sheeps = [];
            wolves = [];
            fences = [];
            sheep = new Sheep_1.Sheep();
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(misc_2.clone(hFence, { position: [x, 1] }));
                    fences.push(misc_2.clone(hFence, { position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(misc_2.clone(vFence, { position: [1, y] }));
                    fences.push(misc_2.clone(vFence, { position: [18, y] }));
                }
            }
            if (true) { // random sheeps
                for (let y = 2; y < 17; y++) {
                    const parts = 4;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newSheep = misc_2.clone(sheep, { position: [x, y] });
                        sheeps.push(newSheep);
                    }
                }
            }
            wolf = new Wolf_1.Wolf();
            wolves.push(wolf);
            tree2 = misc_2.clone(new PineTree_1.PineTree(), { position: [7, 9] });
            campfire = new Campfire_2.Campfire();
            campfires = [
                misc_2.clone(campfire, { position: [10, 10] }),
            ];
            door = new Door_1.Door();
            doors = [
                misc_2.clone(door, { position: [4, 2] }),
                misc_2.clone(door, { position: [14, 14] }),
                misc_2.clone(door, { position: [2, 2] }),
            ];
            objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...doors];
            exports_27("sheepLevel", sheepLevel = new Level_1.Level('sheep', objects));
            sheepLevel.portals['sheep_door'] = [[4, 2], [14, 14]];
            sheepLevel.portals['intro_door'] = [[2, 2]];
        }
    };
});
System.register("world/items", ["engine/objects/Item", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_28, context_28) {
    "use strict";
    var Item_1, ObjectSkin_12, ObjectPhysics_10, lamp, sword, emptyHand;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            }
        ],
        execute: function () {
            exports_28("lamp", lamp = new Item_1.Item([0, 0], new ObjectSkin_12.ObjectSkin(`🏮`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_10.ObjectPhysics(` `, `f`, `a`), [0, 0]));
            exports_28("sword", sword = new Item_1.Item([0, 0], new ObjectSkin_12.ObjectSkin(`🗡`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_10.ObjectPhysics(), [0, 0]));
            exports_28("emptyHand", emptyHand = new Item_1.Item([0, 0], new ObjectSkin_12.ObjectSkin(` `, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_10.ObjectPhysics(), [0, 0]));
        }
    };
});
System.register("world/hero", ["engine/objects/Npc", "engine/components/ObjectSkin", "world/items"], function (exports_29, context_29) {
    "use strict";
    var Npc_5, ObjectSkin_13, items_1, hero;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            }
        ],
        execute: function () {
            exports_29("hero", hero = new class extends Npc_5.Npc {
                constructor() {
                    super(new ObjectSkin_13.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [9, 7]);
                    this.type = "human";
                    this.moveSpeed = 10;
                    this.showCursor = true;
                    this.objectInMainHand = items_1.sword;
                    this.objectInSecondaryHand = items_1.lamp;
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
System.register("ui/playerUi", ["engine/graphics/GraphicsEngine", "engine/graphics/Cell", "engine/objects/Npc"], function (exports_30, context_30) {
    "use strict";
    var GraphicsEngine_3, Cell_3, Npc_6, PlayerUi;
    var __moduleName = context_30 && context_30.id;
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
            exports_30("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/objects/Bamboo", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_31, context_31) {
    "use strict";
    var ObjectPhysics_11, ObjectSkin_14, StaticGameObject_6, bamboo;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            },
            function (StaticGameObject_6_1) {
                StaticGameObject_6 = StaticGameObject_6_1;
            }
        ],
        execute: function () {
            exports_31("bamboo", bamboo = new StaticGameObject_6.StaticGameObject([0, 4], new ObjectSkin_14.ObjectSkin(`▄
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
 
 
 
 
.`, ``), [0, 0]));
        }
    };
});
System.register("world/objects", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics", "utils/misc", "world/objects/Bamboo"], function (exports_32, context_32) {
    "use strict";
    var StaticGameObject_7, ObjectSkin_15, ObjectPhysics_12, misc_3, Bamboo_1, house, trees, lamp, chest, flower, flowers;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (StaticGameObject_7_1) {
                StaticGameObject_7 = StaticGameObject_7_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (ObjectPhysics_12_1) {
                ObjectPhysics_12 = ObjectPhysics_12_1;
            },
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (Bamboo_1_1) {
                Bamboo_1 = Bamboo_1_1;
            }
        ],
        execute: function () {
            exports_32("house", house = new StaticGameObject_7.StaticGameObject([2, 2], new ObjectSkin_15.ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
                B: [undefined, 'black'],
                S: [undefined, '#004'],
                W: ["black", "darkred"],
                D: ["black", "saddlebrown"]
            }), new ObjectPhysics_12.ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]));
            exports_32("trees", trees = []);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(misc_3.clone(Bamboo_1.bamboo, { position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(misc_3.clone(Bamboo_1.bamboo, { position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(0, 5, (obj) => {
                        obj.enabled = false;
                        // console.log("Cut tree"); @todo sent event
                    });
                }
            }
            exports_32("lamp", lamp = new StaticGameObject_7.StaticGameObject([0, 2], new ObjectSkin_15.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                'L': ['yellow', 'transparent'],
                'H': ['#666', 'transparent'],
            }), new ObjectPhysics_12.ObjectPhysics(` 
 
.`, `B`), [0, 0]));
            lamp.parameters["is_on"] = true;
            lamp.setAction(0, 2, (o) => {
                o.parameters["is_on"] = !o.parameters["is_on"];
                o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
                o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
            }, 0, 0);
            exports_32("chest", chest = new StaticGameObject_7.StaticGameObject([0, 0], new ObjectSkin_15.ObjectSkin(`S`, `V`, {
                V: ['yellow', 'violet'],
            }), new ObjectPhysics_12.ObjectPhysics(`.`, ''), [2, 10]));
            flower = new StaticGameObject_7.StaticGameObject([0, 0], new ObjectSkin_15.ObjectSkin(`❁`, `V`, {
                V: ['red', 'transparent'],
            }), new ObjectPhysics_12.ObjectPhysics(` `, 'F'), [2, 10]);
            exports_32("flowers", flowers = []);
            // for (let i = 0; i < 10; i++) {
            //     const fl = clone(flower, {position: [Math.random() * 20 | 0, Math.random() * 20 | 0]});
            //     flowers.push(fl);
            //     fl.onUpdate((ticks, o, scene) => {
            //         if (!o.parameters["inited"]) { 
            //             o.parameters["inited"] = true;
            //             o.skin.raw_colors[0][0][0] = ['red', 'yellow', 'violet'][(Math.random() * 3) | 0]
            //         }
            //     })
            // }
        }
    };
});
System.register("world/npcs", ["engine/components/ObjectSkin", "engine/events/EventLoop", "engine/events/GameEvent", "engine/objects/Npc"], function (exports_33, context_33) {
    "use strict";
    var ObjectSkin_16, EventLoop_3, GameEvent_3, Npc_7, ulan, npcs;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (EventLoop_3_1) {
                EventLoop_3 = EventLoop_3_1;
            },
            function (GameEvent_3_1) {
                GameEvent_3 = GameEvent_3_1;
            },
            function (Npc_7_1) {
                Npc_7 = Npc_7_1;
            }
        ],
        execute: function () {
            ulan = new Npc_7.Npc(new ObjectSkin_16.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (o) => {
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            exports_33("npcs", npcs = [
                ulan,
            ]);
        }
    };
});
System.register("world/levels/intro", ["world/objects", "utils/misc", "engine/events/EventLoop", "engine/events/GameEvent", "world/npcs", "engine/Level", "world/objects/PineTree", "world/objects/Door"], function (exports_34, context_34) {
    "use strict";
    var objects_1, misc_4, EventLoop_4, GameEvent_4, npcs_1, Level_2, PineTree_2, Door_2, lamps, door, doors, objects, introLevel;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (objects_1_1) {
                objects_1 = objects_1_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            },
            function (EventLoop_4_1) {
                EventLoop_4 = EventLoop_4_1;
            },
            function (GameEvent_4_1) {
                GameEvent_4 = GameEvent_4_1;
            },
            function (npcs_1_1) {
                npcs_1 = npcs_1_1;
            },
            function (Level_2_1) {
                Level_2 = Level_2_1;
            },
            function (PineTree_2_1) {
                PineTree_2 = PineTree_2_1;
            },
            function (Door_2_1) {
                Door_2 = Door_2_1;
            }
        ],
        execute: function () {
            lamps = [
                misc_4.clone(objects_1.lamp, { position: [2, 5] }),
                misc_4.clone(objects_1.lamp, { position: [17, 5] }),
            ];
            door = new Door_2.Door();
            doors = [
                misc_4.clone(door, { position: [10, 10] }),
            ];
            objects = [...objects_1.flowers, objects_1.house, objects_1.chest, new PineTree_2.PineTree(), ...objects_1.trees, ...lamps, ...npcs_1.npcs, ...doors];
            exports_34("introLevel", introLevel = new Level_2.Level('intro', objects));
            introLevel.portals['intro_door'] = [[10, 10]];
            // scripts
            objects_1.chest.setAction(0, 0, function () {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent(objects_1.chest, "add_object", { object: misc_4.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
System.register("world/npcs/Bee", ["engine/objects/Npc", "engine/components/ObjectSkin"], function (exports_35, context_35) {
    "use strict";
    var Npc_8, ObjectSkin_17, Bee;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_8.Npc {
                constructor() {
                    super(new ObjectSkin_17.ObjectSkin(`🐝`, `.`, {
                        '.': ['yellow', 'transparent'],
                    }), [0, 0]);
                    this.type = "bee";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                new() {
                    return new Bee();
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
            exports_35("Bee", Bee);
        }
    };
});
System.register("world/npcs/Duck", ["engine/objects/Npc", "engine/components/ObjectSkin"], function (exports_36, context_36) {
    "use strict";
    var Npc_9, ObjectSkin_18, Duck;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (ObjectSkin_18_1) {
                ObjectSkin_18 = ObjectSkin_18_1;
            }
        ],
        execute: function () {
            // TODO: behavior
            // Likes to wander and stay in water, has good speed in water
            Duck = class Duck extends Npc_9.Npc {
                constructor() {
                    super(new ObjectSkin_18.ObjectSkin(`🦆`, `.`, {
                        '.': [undefined, 'transparent'],
                    }), [0, 0]);
                    this.type = "duck";
                    this.maxHealth = 1;
                    this.health = 1;
                }
                new() {
                    return new Duck();
                }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const duck = this;
                    const state = duck.parameters["state"];
                    duck.direction = [0, 0];
                    // TODO: move fear and flee logic to some behavior class.
                    let enemiesNearby = this.getMobsNearby(scene, 5, x => x.type !== 'duck');
                    const fearedDucks = this.getMobsNearby(scene, 2, x => x.type === "duck" && (x.parameters["stress"] | 0) > 0);
                    if (enemiesNearby.length || fearedDucks.length) {
                        if (enemiesNearby.length) {
                            duck.parameters["state"] = "feared";
                            duck.parameters["stress"] = 3;
                            duck.parameters["enemies"] = enemiesNearby;
                        }
                        else {
                            const duckStress = Math.max(...fearedDucks.map(x => x.parameters["stress"] | 0));
                            duck.parameters["stress"] = duckStress - 1;
                            if (duck.parameters["stress"] === 0) {
                                duck.parameters["state"] = "still";
                                duck.parameters["enemies"] = [];
                            }
                            else {
                                duck.parameters["state"] = "feared_2";
                                duck.parameters["enemies"] = fearedDucks[0].parameters["enemies"];
                                enemiesNearby = fearedDucks[0].parameters["enemies"];
                            }
                        }
                    }
                    else {
                        duck.parameters["state"] = "wandering";
                        duck.parameters["stress"] = 0;
                        duck.parameters["enemies"] = [];
                    }
                    if (state === "wandering") {
                        this.moveRandomly();
                    }
                    if (!scene.isPositionBlocked(duck.cursorPosition)) {
                        duck.move();
                    }
                    else if (duck.parameters["stress"] > 0) {
                        this.runAway(scene, enemiesNearby);
                    }
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
            exports_36("Duck", Duck);
        }
    };
});
System.register("world/sprites/sakura", ["engine/data/Sprite"], function (exports_37, context_37) {
    "use strict";
    var Sprite_2, sakuraSpriteRaw, sakuraSprite;
    var __moduleName = context_37 && context_37.id;
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
            exports_37("sakuraSprite", sakuraSprite = Sprite_2.Sprite.parse(sakuraSpriteRaw));
            //console.log(sakuraSprite);
        }
    };
});
System.register("world/objects/SakuraTree", ["engine/components/ObjectPhysics", "world/sprites/sakura", "world/objects/Tree"], function (exports_38, context_38) {
    "use strict";
    var ObjectPhysics_13, sakura_1, Tree_2, SakuraTree;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (ObjectPhysics_13_1) {
                ObjectPhysics_13 = ObjectPhysics_13_1;
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
                constructor() {
                    super([2, 3], sakura_1.sakuraSprite, new ObjectPhysics_13.ObjectPhysics(`
    
    
  .`, '', '', ` .. 
....
    
    `), [2, 12]);
                }
                new() { return new SakuraTree(); }
            };
            exports_38("SakuraTree", SakuraTree);
        }
    };
});
System.register("world/objects/artificial", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_39, context_39) {
    "use strict";
    var StaticGameObject_8, ObjectSkin_19, ObjectPhysics_14, vFence, hFence, beehive;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (StaticGameObject_8_1) {
                StaticGameObject_8 = StaticGameObject_8_1;
            },
            function (ObjectSkin_19_1) {
                ObjectSkin_19 = ObjectSkin_19_1;
            },
            function (ObjectPhysics_14_1) {
                ObjectPhysics_14 = ObjectPhysics_14_1;
            }
        ],
        execute: function () {
            exports_39("vFence", vFence = new StaticGameObject_8.StaticGameObject([0, 0], new ObjectSkin_19.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_14.ObjectPhysics('.'), [0, 0]));
            exports_39("hFence", hFence = new StaticGameObject_8.StaticGameObject([0, 0], new ObjectSkin_19.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_14.ObjectPhysics('.'), [0, 0]));
            exports_39("beehive", beehive = new StaticGameObject_8.StaticGameObject([0, 0], new ObjectSkin_19.ObjectSkin(`☷`, `R`, {
                'R': ['black', 'orange'],
            }), new ObjectPhysics_14.ObjectPhysics(`.`), [0, 0]));
        }
    };
});
System.register("world/objects/natural", ["engine/objects/StaticGameObject", "engine/components/ObjectSkin", "engine/components/ObjectPhysics"], function (exports_40, context_40) {
    "use strict";
    var StaticGameObject_9, ObjectSkin_20, ObjectPhysics_15, createUnitSkin, unitPhysics, createUnitStaticObject, flower, wheat, hotspring;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (StaticGameObject_9_1) {
                StaticGameObject_9 = StaticGameObject_9_1;
            },
            function (ObjectSkin_20_1) {
                ObjectSkin_20 = ObjectSkin_20_1;
            },
            function (ObjectPhysics_15_1) {
                ObjectPhysics_15 = ObjectPhysics_15_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_20.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            unitPhysics = new ObjectPhysics_15.ObjectPhysics(` `);
            createUnitStaticObject = (sym, color = 'black') => new StaticGameObject_9.StaticGameObject([0, 0], createUnitSkin(sym, color), unitPhysics, [0, 0]);
            exports_40("flower", flower = createUnitStaticObject(`❁`, 'red'));
            exports_40("wheat", wheat = createUnitStaticObject(`♈`, 'yellow'));
            exports_40("hotspring", hotspring = new StaticGameObject_9.StaticGameObject([0, 0], createUnitSkin(`♨`, 'lightblue'), new ObjectPhysics_15.ObjectPhysics(' ', ' ', 'A'), [0, 0]));
        }
    };
});
System.register("world/levels/ggj2020demo/objects", ["engine/components/ObjectPhysics", "engine/components/ObjectSkin", "engine/objects/StaticGameObject"], function (exports_41, context_41) {
    "use strict";
    var ObjectPhysics_16, ObjectSkin_21, StaticGameObject_10, pillar, arc, shop;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (ObjectPhysics_16_1) {
                ObjectPhysics_16 = ObjectPhysics_16_1;
            },
            function (ObjectSkin_21_1) {
                ObjectSkin_21 = ObjectSkin_21_1;
            },
            function (StaticGameObject_10_1) {
                StaticGameObject_10 = StaticGameObject_10_1;
            }
        ],
        execute: function () {
            exports_41("pillar", pillar = new StaticGameObject_10.StaticGameObject([0, 3], new ObjectSkin_21.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_16.ObjectPhysics(` 
 
 
. `), [0, 0]));
            exports_41("arc", arc = new StaticGameObject_10.StaticGameObject([2, 3], new ObjectSkin_21.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_16.ObjectPhysics(`     
     
     
.   .`), [0, 0]));
            exports_41("shop", shop = new StaticGameObject_10.StaticGameObject([2, 3], new ObjectSkin_21.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_16.ObjectPhysics(`       
       
 ..... `), [0, 0]));
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/graphics/Cell"], function (exports_42, context_42) {
    "use strict";
    var Cell_4, tiles;
    var __moduleName = context_42 && context_42.id;
    function parseTiles(str, colors) {
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
            return common[s]
                ? common[s]
                : (common[s] = new Cell_4.Cell(' ', 'transparent', colors[s]));
        }
    }
    return {
        setters: [
            function (Cell_4_1) {
                Cell_4 = Cell_4_1;
            }
        ],
        execute: function () {
            exports_42("tiles", tiles = parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
System.register("world/levels/ggj2020demo/level", ["engine/Level", "utils/misc", "world/npcs/Bee", "world/npcs/Duck", "world/npcs/Sheep", "world/objects", "world/objects/Bamboo", "world/objects/PineTree", "world/objects/SakuraTree", "world/objects/artificial", "world/objects/natural", "world/levels/ggj2020demo/objects", "world/levels/ggj2020demo/tiles"], function (exports_43, context_43) {
    "use strict";
    var Level_3, misc_5, Bee_1, Duck_1, Sheep_2, objects_2, Bamboo_2, PineTree_3, SakuraTree_1, artificial_1, natural_1, objects_3, tiles_1, levelWidth, levelHeight, fences, extraFences, tree, trees, sakura, sakuras, houses, lamps, pillars, arcs, shops, duck, ducks, sheep, sheepList, wheats, flowers, bamboos, beehives, bee, bees, hotsprings, objects, level;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (Level_3_1) {
                Level_3 = Level_3_1;
            },
            function (misc_5_1) {
                misc_5 = misc_5_1;
            },
            function (Bee_1_1) {
                Bee_1 = Bee_1_1;
            },
            function (Duck_1_1) {
                Duck_1 = Duck_1_1;
            },
            function (Sheep_2_1) {
                Sheep_2 = Sheep_2_1;
            },
            function (objects_2_1) {
                objects_2 = objects_2_1;
            },
            function (Bamboo_2_1) {
                Bamboo_2 = Bamboo_2_1;
            },
            function (PineTree_3_1) {
                PineTree_3 = PineTree_3_1;
            },
            function (SakuraTree_1_1) {
                SakuraTree_1 = SakuraTree_1_1;
            },
            function (artificial_1_1) {
                artificial_1 = artificial_1_1;
            },
            function (natural_1_1) {
                natural_1 = natural_1_1;
            },
            function (objects_3_1) {
                objects_3 = objects_3_1;
            },
            function (tiles_1_1) {
                tiles_1 = tiles_1_1;
            }
        ],
        execute: function () {
            levelWidth = 51;
            levelHeight = 30;
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < levelWidth; x++) {
                    fences.push(misc_5.clone(artificial_1.hFence, { position: [x, 0] }));
                    fences.push(misc_5.clone(artificial_1.hFence, { position: [x, levelHeight - 1] }));
                }
                for (let y = 1; y < levelHeight - 1; y++) {
                    fences.push(misc_5.clone(artificial_1.vFence, { position: [0, y] }));
                    fences.push(misc_5.clone(artificial_1.vFence, { position: [levelWidth - 1, y] }));
                }
            }
            extraFences = [
                misc_5.clone(artificial_1.vFence, { position: [28, 7] }),
                misc_5.clone(artificial_1.vFence, { position: [29, 7] }),
                misc_5.clone(artificial_1.vFence, { position: [30, 7] }),
                misc_5.clone(artificial_1.vFence, { position: [31, 7] }),
            ];
            tree = new PineTree_3.PineTree();
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
            ].map(x => misc_5.clone(tree, x));
            sakura = new SakuraTree_1.SakuraTree();
            sakuras = [
                { position: [37, 22] },
                { position: [42, 18] },
                { position: [47, 19] },
                { position: [40, 24] },
                { position: [43, 22] },
                { position: [26, 24] },
                { position: [32, 20] },
            ].map(x => misc_5.clone(sakura, x));
            houses = [
                misc_5.clone(objects_2.house, { position: [25, 5] }),
                misc_5.clone(objects_2.house, { position: [15, 25] }),
                misc_5.clone(objects_2.house, { position: [13, 3] }),
                misc_5.clone(objects_2.house, { position: [3, 10] }),
            ];
            lamps = [
                misc_5.clone(objects_2.lamp, { position: [27, 5] }),
                misc_5.clone(objects_2.lamp, { position: [13, 25] }),
                misc_5.clone(objects_2.lamp, { position: [15, 3] }),
                misc_5.clone(objects_2.lamp, { position: [1, 10] }),
            ];
            pillars = [
                misc_5.clone(objects_3.pillar, { position: [7, 21] }),
                misc_5.clone(objects_3.pillar, { position: [20, 24] }),
                misc_5.clone(objects_3.pillar, { position: [30, 20] }),
            ];
            arcs = [
                misc_5.clone(objects_3.arc, { position: [16, 16] }),
                misc_5.clone(objects_3.arc, { position: [32, 25] }),
            ];
            shops = [
                { position: [18, 10] }
            ].map(x => misc_5.clone(objects_3.shop, x));
            duck = new Duck_1.Duck();
            ducks = [
                { position: [40, 10] },
                { position: [38, 12] },
                { position: [44, 25] },
                { position: [40, 26] },
                { position: [7, 28] },
            ].map(x => misc_5.clone(duck, x));
            sheep = new Sheep_2.Sheep();
            sheepList = [
                { position: [44, 16] },
                { position: [48, 16] },
                { position: [43, 14] },
                { position: [46, 12] },
            ].map(x => misc_5.clone(sheep, x));
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
            ].map(x => misc_5.clone(natural_1.wheat, x));
            flowers = [
                { position: [7, 4] },
                { position: [37, 5] },
                { position: [46, 4] },
                { position: [44, 7] },
                { position: [34, 3] },
                { position: [37, 3] },
                { position: [38, 1] },
            ].map(x => misc_5.clone(natural_1.flower, x));
            bamboos = [
                { position: [4, 17] },
                { position: [6, 19] },
                { position: [3, 22] },
                { position: [2, 27] },
                { position: [1, 15] },
            ].map(x => misc_5.clone(Bamboo_2.bamboo, x));
            beehives = [
                { position: [34, 2] },
                { position: [36, 2] },
                { position: [34, 4] },
                { position: [36, 4] },
                { position: [38, 2] },
                { position: [38, 4] },
            ].map(x => misc_5.clone(artificial_1.beehive, x));
            bee = new Bee_1.Bee();
            bees = [
                { position: [35, 2] },
                { position: [34, 5] },
                { position: [40, 3] },
            ].map(x => misc_5.clone(bee, x));
            hotsprings = [
                { position: [22, 18] },
                { position: [21, 15] },
                { position: [24, 19] },
            ].map(x => misc_5.clone(natural_1.hotspring, x));
            objects = [
                ...fences, ...extraFences,
                ...trees, ...sakuras, ...bamboos,
                ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                ...flowers, ...lamps, ...wheats,
                ...hotsprings,
                ...ducks, ...bees, ...sheepList,
            ];
            exports_43("level", level = new Level_3.Level('ggj2020demo', objects, tiles_1.tiles, levelWidth, levelHeight));
        }
    };
});
System.register("world/levels/devHub", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "utils/misc", "engine/Level", "world/objects/Door"], function (exports_44, context_44) {
    "use strict";
    var ObjectSkin_22, StaticGameObject_11, ObjectPhysics_17, misc_6, Level_4, Door_3, vFence, hFence, fences, door, doors, objects, level, devHubLevel;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (ObjectSkin_22_1) {
                ObjectSkin_22 = ObjectSkin_22_1;
            },
            function (StaticGameObject_11_1) {
                StaticGameObject_11 = StaticGameObject_11_1;
            },
            function (ObjectPhysics_17_1) {
                ObjectPhysics_17 = ObjectPhysics_17_1;
            },
            function (misc_6_1) {
                misc_6 = misc_6_1;
            },
            function (Level_4_1) {
                Level_4 = Level_4_1;
            },
            function (Door_3_1) {
                Door_3 = Door_3_1;
            }
        ],
        execute: function () {
            vFence = new StaticGameObject_11.StaticGameObject([0, 0], new ObjectSkin_22.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_17.ObjectPhysics('.'), [0, 0]);
            hFence = new StaticGameObject_11.StaticGameObject([0, 0], new ObjectSkin_22.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_17.ObjectPhysics('.'), [0, 0]);
            fences = [];
            if (true) { // add fence
                for (let x = 0; x < 20; x++) {
                    fences.push(misc_6.clone(hFence, { position: [x, 0] }));
                    fences.push(misc_6.clone(hFence, { position: [x, 19] }));
                }
                for (let y = 1; y < 19; y++) {
                    fences.push(misc_6.clone(vFence, { position: [0, y] }));
                    fences.push(misc_6.clone(vFence, { position: [19, y] }));
                }
            }
            door = new Door_3.Door();
            doors = [
                misc_6.clone(door, { position: [2, 2] }),
                misc_6.clone(door, { position: [2, 4] }),
            ];
            objects = [...fences, ...doors];
            level = new Level_4.Level('devHub', objects);
            level.portals['lights'] = [[2, 2]];
            level.portals['dungeon'] = [[2, 4]];
            exports_44("devHubLevel", devHubLevel = level);
        }
    };
});
System.register("world/levels/dungeon", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "utils/misc", "engine/Level", "world/objects/Door", "world/objects/Campfire", "utils/layer"], function (exports_45, context_45) {
    "use strict";
    var ObjectSkin_23, StaticGameObject_12, ObjectPhysics_18, misc_7, Level_5, Door_4, Campfire_3, layer_1, wallSkin, physicsUnitBlocked, wall, walls, campfire, campfires, door, doors, objects, level, dungeonLevel;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (ObjectSkin_23_1) {
                ObjectSkin_23 = ObjectSkin_23_1;
            },
            function (StaticGameObject_12_1) {
                StaticGameObject_12 = StaticGameObject_12_1;
            },
            function (ObjectPhysics_18_1) {
                ObjectPhysics_18 = ObjectPhysics_18_1;
            },
            function (misc_7_1) {
                misc_7 = misc_7_1;
            },
            function (Level_5_1) {
                Level_5 = Level_5_1;
            },
            function (Door_4_1) {
                Door_4 = Door_4_1;
            },
            function (Campfire_3_1) {
                Campfire_3 = Campfire_3_1;
            },
            function (layer_1_1) {
                layer_1 = layer_1_1;
            }
        ],
        execute: function () {
            wallSkin = new ObjectSkin_23.ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
            physicsUnitBlocked = new ObjectPhysics_18.ObjectPhysics('.');
            wall = new StaticGameObject_12.StaticGameObject([0, 0], wallSkin, physicsUnitBlocked, [0, 0]);
            walls = [];
            if (true) { // add border walls
                for (let x = 0; x < 20; x++) {
                    walls.push(misc_7.clone(wall, { position: [x, 0] }));
                    walls.push(misc_7.clone(wall, { position: [x, 19] }));
                }
                for (let y = 1; y < 19; y++) {
                    walls.push(misc_7.clone(wall, { position: [0, y] }));
                    walls.push(misc_7.clone(wall, { position: [19, y] }));
                }
            }
            if (true) { // add random walls
                for (let y = 2; y < 17; y += 2) {
                    const parts = 2;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newHeadStone = misc_7.clone(wall, { position: [x, y] });
                        walls.push(newHeadStone);
                    }
                }
            }
            campfire = new Campfire_3.Campfire();
            campfires = [
                misc_7.clone(campfire, { position: [3, 3] }),
                misc_7.clone(campfire, { position: [10, 13] }),
            ];
            door = new Door_4.Door();
            doors = [
                misc_7.clone(door, { position: [2, 2] }),
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
            exports_45("dungeonLevel", dungeonLevel = level);
        }
    };
});
System.register("world/levels/lights", ["engine/components/ObjectSkin", "engine/objects/StaticGameObject", "engine/components/ObjectPhysics", "utils/misc", "world/objects/Campfire", "engine/Level", "world/objects/PineTree"], function (exports_46, context_46) {
    "use strict";
    var ObjectSkin_24, StaticGameObject_13, ObjectPhysics_19, misc_8, Campfire_4, Level_6, PineTree_4, vFence, hFence, fences, headStone, headStones, tree2, campfire, campfires, objects, level, lightsLevel;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (ObjectSkin_24_1) {
                ObjectSkin_24 = ObjectSkin_24_1;
            },
            function (StaticGameObject_13_1) {
                StaticGameObject_13 = StaticGameObject_13_1;
            },
            function (ObjectPhysics_19_1) {
                ObjectPhysics_19 = ObjectPhysics_19_1;
            },
            function (misc_8_1) {
                misc_8 = misc_8_1;
            },
            function (Campfire_4_1) {
                Campfire_4 = Campfire_4_1;
            },
            function (Level_6_1) {
                Level_6 = Level_6_1;
            },
            function (PineTree_4_1) {
                PineTree_4 = PineTree_4_1;
            }
        ],
        execute: function () {
            vFence = new StaticGameObject_13.StaticGameObject([0, 0], new ObjectSkin_24.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_19.ObjectPhysics('.'), [0, 0]);
            hFence = new StaticGameObject_13.StaticGameObject([0, 0], new ObjectSkin_24.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_19.ObjectPhysics('.'), [0, 0]);
            fences = [];
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(misc_8.clone(hFence, { position: [x, 1] }));
                    fences.push(misc_8.clone(hFence, { position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(misc_8.clone(vFence, { position: [1, y] }));
                    fences.push(misc_8.clone(vFence, { position: [18, y] }));
                }
            }
            headStone = new StaticGameObject_13.StaticGameObject([0, 0], new ObjectSkin_24.ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_19.ObjectPhysics('.'), [0, 0]);
            headStones = [];
            if (true) { // random objects
                for (let y = 2; y < 17; y += 2) {
                    const parts = 2;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newHeadStone = misc_8.clone(headStone, { position: [x, y] });
                        headStones.push(newHeadStone);
                    }
                }
            }
            tree2 = misc_8.clone(new PineTree_4.PineTree(), { position: [7, 9] });
            campfire = new Campfire_4.Campfire();
            campfires = [
                misc_8.clone(campfire, { position: [3, 3] }),
            ];
            objects = [...fences, tree2, ...campfires, ...headStones];
            level = new Level_6.Level('lights', objects);
            level.portals['lights'] = [[7, 9]];
            exports_46("lightsLevel", lightsLevel = level);
        }
    };
});
System.register("world/levels/levels", ["world/levels/devHub", "world/levels/dungeon", "world/levels/ggj2020demo/level", "world/levels/intro", "world/levels/lights", "world/levels/sheep"], function (exports_47, context_47) {
    "use strict";
    var devHub_1, dungeon_1, level_1, intro_1, lights_1, sheep_1, list, levels;
    var __moduleName = context_47 && context_47.id;
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
            function (intro_1_1) {
                intro_1 = intro_1_1;
            },
            function (lights_1_1) {
                lights_1 = lights_1_1;
            },
            function (sheep_1_1) {
                sheep_1 = sheep_1_1;
            }
        ],
        execute: function () {
            list = [devHub_1.devHubLevel, intro_1.introLevel, lights_1.lightsLevel, sheep_1.sheepLevel, level_1.level, dungeon_1.dungeonLevel];
            exports_47("levels", levels = {});
            for (const item of list) {
                levels[item.id] = item;
            }
        }
    };
});
System.register("main", ["world/levels/sheep", "world/items", "engine/events/GameEvent", "engine/events/EventLoop", "engine/Scene", "engine/graphics/Cell", "engine/graphics/GraphicsEngine", "engine/graphics/CanvasContext", "world/hero", "ui/playerUi", "engine/objects/Npc", "utils/misc", "world/levels/intro", "world/levels/ggj2020demo/level", "world/levels/levels", "world/levels/lights", "world/levels/devHub", "world/levels/dungeon"], function (exports_48, context_48) {
    "use strict";
    var sheep_2, items_2, GameEvent_5, EventLoop_5, Scene_1, Cell_5, GraphicsEngine_4, CanvasContext_1, hero_1, playerUi_1, Npc_10, misc_9, intro_2, level_2, levels_1, lights_2, devHub_2, dungeon_2, canvas, ctx, debugInput, Game, game, scene, leftPad, topPad, heroUi, ticksPerStep;
    var __moduleName = context_48 && context_48.id;
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
        if (game.mode === 'scene') {
            // onSceneInput();
        }
        else if (game.mode === 'dialog') {
            if (key_code === "Escape") {
                EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "switch_mode", { from: game.mode, to: "scene" }));
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
                if (hero_1.hero.objectInMainHand === items_2.sword) {
                    const npc = getNpcUnderCursor(hero_1.hero);
                    if (npc) {
                        EventLoop_5.emitEvent(new GameEvent_5.GameEvent(hero_1.hero, 'attack', {
                            object: hero_1.hero,
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
            }
            else {
                // debug keys
                if (code.shiftKey) {
                    if (key_code === 'Digit1') {
                        hero_1.hero.objectInMainHand = misc_9.clone(items_2.emptyHand);
                    }
                    else if (key_code === 'Digit2') {
                        hero_1.hero.objectInMainHand = misc_9.clone(items_2.sword);
                    }
                    else if (key_code === "KeyQ") {
                        selectLevel(devHub_2.devHubLevel);
                    }
                    else if (key_code === "KeyR") {
                        selectLevel(sheep_2.sheepLevel);
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
                    EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "weather_changed", {
                        from: oldWeatherType,
                        to: scene.level.weatherType,
                    }));
                }
                // wind
                if (raw_key === 'e') {
                    scene.level.isWindy = !scene.level.isWindy;
                    EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "wind_changed", {
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
    function onInterval() {
        game.update(ticksPerStep);
        EventLoop_5.eventLoop([game, scene, ...scene.level.objects]);
        game.draw();
    }
    return {
        setters: [
            function (sheep_2_1) {
                sheep_2 = sheep_2_1;
            },
            function (items_2_1) {
                items_2 = items_2_1;
            },
            function (GameEvent_5_1) {
                GameEvent_5 = GameEvent_5_1;
            },
            function (EventLoop_5_1) {
                EventLoop_5 = EventLoop_5_1;
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
            function (misc_9_1) {
                misc_9 = misc_9_1;
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
            exports_48("leftPad", leftPad = (ctx.context.canvas.width - GraphicsEngine_4.cellStyle.size.width * scene.camera.size.width) / 2);
            exports_48("topPad", topPad = (ctx.context.canvas.height - GraphicsEngine_4.cellStyle.size.height * scene.camera.size.height) / 2);
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, scene.camera);
            enableGameInput();
            ticksPerStep = 33;
            // initial events
            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "weather_changed", { from: scene.level.weatherType, to: scene.level.weatherType }));
            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "wind_changed", { from: scene.level.isWindy, to: scene.level.isWindy }));
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window.command = new class {
                getItem(itemName) {
                    console.log('Not implemented yet');
                }
                takeItem(itemName) {
                    if (itemName === 'sword') {
                        hero_1.hero.objectInMainHand = misc_9.clone(items_2.sword);
                    }
                    else if (itemName === 'lamp') {
                        hero_1.hero.objectInMainHand = misc_9.clone(items_2.lamp);
                    }
                }
                takeItem2(itemName) {
                    if (itemName === 'lamp') {
                        hero_1.hero.objectInSecondaryHand = misc_9.clone(items_2.lamp);
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