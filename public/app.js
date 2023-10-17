System.register("engine/GameEvent", [], function (exports_1, context_1) {
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
System.register("engine/ObjectSkin", [], function (exports_2, context_2) {
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
System.register("engine/ObjectPhysics", [], function (exports_3, context_3) {
    "use strict";
    var ObjectPhysics;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            ObjectPhysics = class ObjectPhysics {
                constructor(collisionsMask = '', lightMask = '', temperatureMask = '') {
                    this.collisions = collisionsMask.split('\n');
                    this.lights = lightMask.split('\n');
                    this.temperatures = temperatureMask.split('\n');
                }
            };
            exports_3("ObjectPhysics", ObjectPhysics);
        }
    };
});
System.register("engine/Cell", [], function (exports_4, context_4) {
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
System.register("engine/EventLoop", [], function (exports_5, context_5) {
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
                constructor(sceneObjects, tiles = [], width = 20, height = 20) {
                    this.sceneObjects = sceneObjects;
                    this.tiles = tiles;
                    this.width = width;
                    this.height = height;
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
                        const leftRel = this.npc.position[0] - this.position.left;
                        if (leftRel < followOffset) {
                            this.position.left = Math.max(0, this.npc.position[0] - followOffset);
                        }
                        const topRel = this.npc.position[1] - this.position.top;
                        if (topRel < followOffset) {
                            this.position.top = Math.max(0, this.npc.position[1] - followOffset);
                        }
                        const rightRel = (this.position.left + this.size.width) - this.npc.position[0];
                        if (rightRel < followOffset) {
                            this.position.left = Math.min(this.level.width - this.size.width, this.npc.position[0] - this.size.width + followOffset);
                        }
                        const bottomRel = (this.position.top + this.size.height) - this.npc.position[1];
                        if (bottomRel < followOffset) {
                            this.position.top = Math.min(this.level.height - this.size.height, this.npc.position[1] - this.size.height + followOffset);
                        }
                    }
                }
            };
            exports_7("Camera", Camera);
        }
    };
});
System.register("engine/GraphicsEngine", ["engine/Cell", "engine/Npc", "main"], function (exports_8, context_8) {
    "use strict";
    var Cell_1, Npc_1, main_1, GraphicsEngine, CanvasContext, cellStyle, emptyCollisionChar;
    var __moduleName = context_8 && context_8.id;
    function drawObjects(ctx, camera, objects) {
        for (let object of objects) {
            if (!object.enabled)
                continue;
            drawObject(ctx, camera, object, objects.filter(x => x.important));
            // reset object highlight.
            object.highlighted = false;
        }
        // draw cursors
        for (let object of objects) {
            if (object instanceof Npc_1.Npc
                && (object.direction[0] || object.direction[1])) {
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
    exports_8("drawObjects", drawObjects);
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
    exports_8("drawObjectAt", drawObjectAt);
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
                if (isPositionBehindTheObject(obj, o.position[0], o.position[1]))
                    return true;
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
    exports_8("isCollision", isCollision);
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
    exports_8("isPositionBehindTheObject", isPositionBehindTheObject);
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
    exports_8("drawCell", drawCell);
    return {
        setters: [
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Npc_1_1) {
                Npc_1 = Npc_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            }
        ],
        execute: function () {
            GraphicsEngine = class GraphicsEngine {
            };
            exports_8("GraphicsEngine", GraphicsEngine);
            CanvasContext = class CanvasContext {
                constructor(context) {
                    this.context = context;
                    this.previous = [];
                    this.current = [];
                }
                add(position, cellInfo) {
                    if (!this.current[position[0]])
                        this.current[position[0]] = [];
                    if (!this.current[position[0]][position[1]])
                        this.current[position[0]][position[1]] = [];
                    this.current[position[0]][position[1]].push(cellInfo);
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
                    if (_this.length != array.length)
                        return false;
                    for (let i = 0, l = _this.length; i < l; i++) {
                        if (!compare(_this[i], array[i])) {
                            // Warning - two different object instances will never be equal: {x:20} != {x:20}
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
                    const left = main_1.leftPad + leftPos * cellStyle.size.width;
                    const top = main_1.topPad + topPos * cellStyle.size.height;
                    //
                    ctx.globalAlpha = cellInfo.transparent ? 0.2 : 1;
                    ctx.fillStyle = cellInfo.cell.backgroundColor;
                    ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
                    ctx.font = `${cellStyle.charSize}px monospace`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    // ctx.globalAlpha = 1;
                    ctx.fillStyle = cellInfo.cell.textColor;
                    ctx.fillText(cellInfo.cell.character, left + cellStyle.size.width / 2, top + cellStyle.size.height / 2 + 2);
                    if (cellStyle.borderWidth > 0) {
                        ctx.strokeStyle = cellStyle.borderColor;
                        ctx.lineWidth = cellStyle.borderWidth;
                        // palette borders
                        ctx.strokeRect(left, top, cellStyle.size.width, cellStyle.size.height);
                    }
                    // cell borders
                    addObjectBorders();
                    function addObjectBorders() {
                        const borderWidth = 2;
                        ctx.lineWidth = borderWidth;
                        ctx.globalAlpha = cellInfo.transparent ? 0.3 : 0.6;
                        if (cellInfo.border[0]) {
                            ctx.strokeStyle = cellInfo.border[0];
                            ctx.strokeRect(left + 1, top + 1, cellStyle.size.width - 2, 0);
                        }
                        if (cellInfo.border[1]) {
                            ctx.strokeStyle = cellInfo.border[1];
                            ctx.strokeRect(left + cellStyle.size.width - 1, top + 1, 0, cellStyle.size.height - 2);
                        }
                        if (cellInfo.border[2]) {
                            ctx.strokeStyle = cellInfo.border[2];
                            ctx.strokeRect(left + 1, top + cellStyle.size.height - 1, cellStyle.size.width - 2, 0);
                        }
                        if (cellInfo.border[3]) {
                            ctx.strokeStyle = cellInfo.border[3];
                            ctx.strokeRect(left + 1, top + 1, 0, cellStyle.size.height - 2);
                        }
                    }
                }
            };
            exports_8("CanvasContext", CanvasContext);
            exports_8("cellStyle", cellStyle = {
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
System.register("engine/Item", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_9, context_9) {
    "use strict";
    var SceneObject_1, ObjectSkin_1, ObjectPhysics_1, Item;
    var __moduleName = context_9 && context_9.id;
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
            exports_9("Item", Item);
        }
    };
});
System.register("engine/Scene", ["engine/GameEvent", "engine/Cell", "engine/EventLoop", "engine/GraphicsEngine", "engine/Npc", "engine/Camera"], function (exports_10, context_10) {
    "use strict";
    var GameEvent_1, Cell_2, EventLoop_1, GraphicsEngine_1, Npc_2, Camera_1, defaultLightLevelAtNight, defaultTemperatureAtNight, defaultTemperatureAtDay, defaultMoisture, bedrockCell, Scene;
    var __moduleName = context_10 && context_10.id;
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
            function (GraphicsEngine_1_1) {
                GraphicsEngine_1 = GraphicsEngine_1_1;
            },
            function (Npc_2_1) {
                Npc_2 = Npc_2_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            }
        ],
        execute: function () {
            defaultLightLevelAtNight = 4;
            defaultTemperatureAtNight = 4; // @todo depends on biome.
            defaultTemperatureAtDay = 7; // @todo depends on biome.
            defaultMoisture = 5; // @todo depends on biome.
            bedrockCell = new Cell_2.Cell(' ', 'transparent', '#331');
            Scene = class Scene {
                constructor() {
                    this.objects = [];
                    this.camera = new Camera_1.Camera();
                    this.weatherType = 'normal';
                    this.weatherTicks = 0;
                    this.isWindy = true;
                    this.timePeriod = 'day';
                    this.tiles = [];
                    this.lightLayer = [];
                    this.temperatureTicks = 0;
                    this.temperatureLayer = [];
                    this.moistureLayer = [];
                    this.weatherLayer = [];
                    this.dayLightLevel = 15;
                    this.globalLightLevel = 0;
                    this.globalTemperature = 7;
                    this.globalMoisture = defaultMoisture;
                    this.debugDrawTemperatures = false;
                    this.debugDrawMoisture = false;
                }
                handleEvent(ev) {
                    if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
                        EventLoop_1.emitEvent(new GameEvent_1.GameEvent(this, "switch_mode", { from: "scene", to: "dialog" }));
                    }
                }
                update(ticks) {
                    this.weatherTicks += ticks;
                    this.temperatureTicks += ticks;
                    // update all enabled objects
                    for (const obj of this.objects) {
                        if (!obj.enabled)
                            continue;
                        obj.update(ticks, this);
                    }
                    this.camera.update();
                    const scene = this;
                    updateWeather();
                    updateLights();
                    updateTemperature();
                    updateMoisture();
                    function updateWeather() {
                        if (scene.weatherType === 'rain') {
                            scene.dayLightLevel = 12;
                        }
                        else {
                            scene.dayLightLevel = 15;
                        }
                        if (scene.weatherTicks > 300) {
                            scene.weatherTicks = 0;
                            scene.weatherLayer = [];
                            for (let y = 0; y < scene.camera.size.height; y++) {
                                for (let x = 0; x < scene.camera.size.width; x++) {
                                    createCell(x, y);
                                }
                            }
                            function addCell(cell, x, y) {
                                if (!scene.weatherLayer[y])
                                    scene.weatherLayer[y] = [];
                                scene.weatherLayer[y][x] = cell;
                            }
                            function createCell(x, y) {
                                if (scene.weatherType === 'rain') {
                                    const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                                    addCell(new Cell_2.Cell(sym, 'cyan', '#0000'), x, y);
                                }
                                else if (scene.weatherType === 'snow') {
                                    const r = (Math.random() * 6 | 0);
                                    if (r === 0)
                                        addCell(new Cell_2.Cell('❄', 'white', 'transparent'), x, y);
                                    else if (r === 1)
                                        addCell(new Cell_2.Cell('❅', 'white', 'transparent'), x, y);
                                    else if (r === 2)
                                        addCell(new Cell_2.Cell('❆', 'white', 'transparent'), x, y);
                                }
                                else if (scene.weatherType === 'rain_and_snow') {
                                    const r = Math.random() * 3 | 0;
                                    if (r === 1)
                                        addCell(new Cell_2.Cell('❄', 'white', 'transparent'), x, y);
                                    else if (r === 2)
                                        addCell(new Cell_2.Cell('`', 'cyan', 'transparent'), x, y);
                                }
                                else if (scene.weatherType === 'mist') {
                                    if ((Math.random() * 2 | 0) === 1)
                                        addCell(new Cell_2.Cell('*', 'transparent', '#fff2'), x, y);
                                }
                            }
                        }
                    }
                    function updateLights() {
                        // clear
                        if (scene.timePeriod === 'night') {
                            scene.globalLightLevel = defaultLightLevelAtNight;
                        }
                        else {
                            scene.globalLightLevel = scene.dayLightLevel;
                        }
                        scene.lightLayer = [];
                        fillLayer(scene.lightLayer, scene.globalLightLevel);
                        const lightObjects = [
                            ...scene.objects,
                            ...scene.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInMainHand)
                                .map((x) => x.objectInMainHand),
                            ...scene.objects
                                .filter(x => (x instanceof Npc_2.Npc) && x.objectInSecondaryHand)
                                .map((x) => x.objectInSecondaryHand)
                        ];
                        for (let obj of lightObjects) {
                            for (let line of obj.physics.lights.entries()) {
                                for (let left = 0; left < line[1].length; left++) {
                                    const char = line[1][left];
                                    const lightLevel = Number.parseInt(char, 16);
                                    const aleft = -scene.camera.position.left + obj.position[0] - obj.originPoint[0] + left;
                                    const atop = -scene.camera.position.top + obj.position[1] - obj.originPoint[1] + line[0];
                                    if (aleft < 0 || atop < 0 || aleft >= scene.camera.size.width || atop >= scene.camera.size.height)
                                        continue;
                                    // console.log('add light', scene.lightLayer);
                                    addEmitter(scene.lightLayer, aleft, atop, lightLevel);
                                    spreadPoint(scene.lightLayer, aleft, atop, defaultLightLevelAtNight);
                                }
                            }
                        }
                    }
                    function updateTemperature() {
                        if (scene.timePeriod === 'night') {
                            scene.globalTemperature = defaultTemperatureAtNight;
                        }
                        else {
                            scene.globalTemperature = defaultTemperatureAtDay;
                        }
                        if (scene.temperatureLayer.length === 0) {
                            scene.temperatureLayer = [];
                            fillLayer(scene.temperatureLayer, scene.globalTemperature);
                        }
                        if (scene.temperatureTicks > 1000) {
                            scene.temperatureTicks = 0;
                            // Cool down step.
                            for (let y = 0; y < scene.temperatureLayer.length; y++) {
                                for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                                    // cool down slower than warm up.
                                    scene.temperatureLayer[y][x] -= 1;
                                }
                            }
                            // iterate temp points (sources) in objects
                            const temperatureObjects = [
                                ...scene.objects,
                                ...scene.objects
                                    .filter(x => (x instanceof Npc_2.Npc) && x.objectInMainHand)
                                    .map((x) => x.objectInMainHand),
                                ...scene.objects
                                    .filter(x => (x instanceof Npc_2.Npc) && x.objectInSecondaryHand)
                                    .map((x) => x.objectInSecondaryHand)
                            ];
                            for (let obj of temperatureObjects) {
                                for (let line of obj.physics.temperatures.entries()) {
                                    for (let left = 0; left < line[1].length; left++) {
                                        const char = line[1][left];
                                        const temperature = Number.parseInt(char, 16);
                                        const aleft = -scene.camera.position.left + obj.position[0] - obj.originPoint[0] + left;
                                        const atop = -scene.camera.position.top + obj.position[1] - obj.originPoint[1] + line[0];
                                        if (aleft < 0 || atop < 0 || aleft >= scene.camera.size.width || atop >= scene.camera.size.height)
                                            continue;
                                        addEmitter(scene.temperatureLayer, aleft, atop, temperature);
                                    }
                                }
                            }
                            var newTemperatureLayer = [];
                            fillLayer(newTemperatureLayer, scene.globalTemperature);
                            for (let y = 0; y < scene.temperatureLayer.length; y++) {
                                for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                                    meanPoint(scene.temperatureLayer, newTemperatureLayer, x, y);
                                }
                            }
                            scene.temperatureLayer = newTemperatureLayer;
                            for (let y = 0; y < scene.temperatureLayer.length; y++) {
                                for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                                    if (scene.temperatureLayer[y][x] < scene.globalTemperature) {
                                        scene.temperatureLayer[y][x] = scene.globalTemperature;
                                    }
                                }
                            }
                        }
                    }
                    function fillLayer(layer, defaultValue) {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                if (!layer[y])
                                    layer[y] = [];
                                if (!layer[y][x])
                                    layer[y][x] = defaultValue;
                            }
                        }
                    }
                    function addEmitter(layer, left, top, level) {
                        if (layer[top] &&
                            typeof layer[top][left] != "undefined" &&
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
                        newArray[y][x] = Math.max(array[y][x], maxValue - speed);
                    }
                    function spreadPoint(array, x, y, min, speed = 2) {
                        if (!array)
                            return;
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
                                    spreadPoint(array, i, j, min, speed);
                                }
                    }
                    function updateMoisture() {
                        // @todo check water tiles
                        scene.moistureLayer = [];
                        fillLayer(scene.moistureLayer, scene.globalMoisture);
                    }
                }
                draw(ctx) {
                    const scene = this;
                    // tiles
                    for (let y = 0; y < scene.camera.size.height; y++) {
                        const top = scene.camera.position.top + y;
                        for (let x = 0; x < scene.camera.size.width; x++) {
                            const left = scene.camera.position.left + x;
                            var cell = (this.tiles[top] && this.tiles[top][left]) || bedrockCell;
                            GraphicsEngine_1.drawCell(ctx, scene.camera, cell, x, y);
                        }
                    }
                    // sort objects by origin point
                    this.objects.sort((a, b) => a.position[1] - b.position[1]);
                    GraphicsEngine_1.drawObjects(ctx, this.camera, this.objects);
                    drawWeather();
                    drawLights();
                    if (scene.debugDrawTemperatures) {
                        drawTemperatures();
                    }
                    if (scene.debugDrawMoisture) {
                        drawMoisture();
                    }
                    function drawWeather() {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                if (scene.weatherLayer[y] && scene.weatherLayer[y][x])
                                    GraphicsEngine_1.drawCell(ctx, scene.camera, scene.weatherLayer[y][x], x, y);
                            }
                        }
                    }
                    function drawLights() {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                const lightLevel = (scene.lightLayer[y] && scene.lightLayer[y][x]) || 0;
                                const lightCell = new Cell_2.Cell(' ', undefined, numberToLightColor(lightLevel));
                                GraphicsEngine_1.drawCell(ctx, scene.camera, lightCell, x, y);
                            }
                        }
                        function numberToLightColor(val, max = 15) {
                            return `#000${(max - val).toString(16)}`;
                        }
                    }
                    function drawTemperatures() {
                        drawLayer(scene.temperatureLayer);
                    }
                    function drawMoisture() {
                        drawLayer(scene.moistureLayer);
                    }
                    function drawLayer(layer, max = 15) {
                        for (let y = 0; y < scene.camera.size.height; y++) {
                            for (let x = 0; x < scene.camera.size.width; x++) {
                                const value = layer[y][x] | 0;
                                GraphicsEngine_1.drawCell(ctx, scene.camera, new Cell_2.Cell(value.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max)), x, y);
                            }
                        }
                        function numberToHexColor(number, max = 15) {
                            const red = Math.floor((number / max) * 255);
                            const blue = 255 - red;
                            const alpha = 0.2;
                            return `rgba(${red}, 0, ${blue}, ${alpha})`;
                        }
                    }
                }
                isPositionBlocked(position) {
                    for (let object of this.objects) {
                        if (!object.enabled)
                            continue;
                        const pleft = position[0] - object.position[0] + object.originPoint[0];
                        const ptop = position[1] - object.position[1] + object.originPoint[1];
                        if (GraphicsEngine_1.isCollision(object, pleft, ptop)) {
                            return true;
                        }
                    }
                    return false;
                }
                getNpcAction(npc) {
                    const scene = this;
                    for (let object of scene.objects) {
                        if (!object.enabled)
                            continue;
                        //
                        const left = npc.position[0] + npc.direction[0];
                        const top = npc.position[1] + npc.direction[1];
                        //
                        const pleft = left - object.position[0] + object.originPoint[0];
                        const ptop = top - object.position[1] + object.originPoint[1];
                        for (let action of object.actions) {
                            if (action[0][0] === pleft &&
                                action[0][1] === ptop) {
                                const actionFunc = action[1];
                                const actionIconPosition = action[2];
                                const actionIconChar = object.skin.grid[actionIconPosition[1]][actionIconPosition[0]];
                                const actionIconColor = object.skin.raw_colors[actionIconPosition[1]][actionIconPosition[0]];
                                const actionIcon = new Cell_2.Cell(actionIconChar, actionIconColor[0], actionIconColor[1]);
                                return { object, action: actionFunc, actionIcon };
                            }
                        }
                    }
                    return undefined;
                }
            };
            exports_10("Scene", Scene);
        }
    };
});
System.register("engine/StaticGameObject", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_11, context_11) {
    "use strict";
    var SceneObject_2, ObjectSkin_2, ObjectPhysics_2, StaticGameObject;
    var __moduleName = context_11 && context_11.id;
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
                constructor(originPoint, skin, physics, position) {
                    super(originPoint, skin, physics, position);
                }
                new() { return new StaticGameObject([0, 0], new ObjectSkin_2.ObjectSkin(), new ObjectPhysics_2.ObjectPhysics(), [0, 0]); }
            };
            exports_11("StaticGameObject", StaticGameObject);
        }
    };
});
System.register("utils/misc", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics"], function (exports_12, context_12) {
    "use strict";
    var ObjectSkin_3, StaticGameObject_1, ObjectPhysics_3;
    var __moduleName = context_12 && context_12.id;
    function distanceTo(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 +
            (a[1] - b[1]) ** 2);
    }
    exports_12("distanceTo", distanceTo);
    function createTextObject(text, x, y) {
        const colors = new ObjectSkin_3.ObjectSkin(text, ''.padEnd(text.length, '.'), { '.': [undefined, undefined] });
        const t = new StaticGameObject_1.StaticGameObject([0, 0], colors, new ObjectPhysics_3.ObjectPhysics(), [x, y]);
        return t;
    }
    exports_12("createTextObject", createTextObject);
    function clone(o, params = {}) {
        return Object.assign(o.new(), deepCopy(o), params);
    }
    exports_12("clone", clone);
    function deepCopy(obj) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
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
    exports_12("deepCopy", deepCopy);
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
System.register("engine/SceneObject", ["engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_13, context_13) {
    "use strict";
    var ObjectSkin_4, ObjectPhysics_4, SceneObject;
    var __moduleName = context_13 && context_13.id;
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
            exports_13("SceneObject", SceneObject);
        }
    };
});
System.register("engine/Npc", ["engine/SceneObject", "engine/ObjectSkin", "engine/ObjectPhysics", "utils/misc", "engine/EventLoop", "engine/GameEvent"], function (exports_14, context_14) {
    "use strict";
    var SceneObject_3, ObjectSkin_5, ObjectPhysics_5, misc_1, EventLoop_2, GameEvent_2, Npc;
    var __moduleName = context_14 && context_14.id;
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
                }
                move() {
                    const obj = this;
                    if (obj.moveTick >= 1000 / obj.moveSpeed) {
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
                    for (const object of scene.objects) {
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
                    for (const object of scene.objects) {
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
            exports_14("Npc", Npc);
        }
    };
});
System.register("engine/SpriteLoader", ["engine/ObjectSkin"], function (exports_15, context_15) {
    "use strict";
    var ObjectSkin_6, SpriteInfo, Sprite;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (ObjectSkin_6_1) {
                ObjectSkin_6 = ObjectSkin_6_1;
            }
        ],
        execute: function () {
            SpriteInfo = class SpriteInfo {
            };
            Sprite = class Sprite {
                constructor() {
                    this.frames = {};
                }
                static parse(str) {
                    const info = new SpriteInfo();
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
            exports_15("Sprite", Sprite);
        }
    };
});
System.register("world/sprites/tree", ["engine/SpriteLoader"], function (exports_16, context_16) {
    "use strict";
    var SpriteLoader_1, treeSpriteRaw, treeSprite;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
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
            exports_16("treeSprite", treeSprite = SpriteLoader_1.Sprite.parse(treeSpriteRaw));
            //console.log(treeSprite);
        }
    };
});
System.register("world/objects", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics", "utils/misc", "world/sprites/tree"], function (exports_17, context_17) {
    "use strict";
    var StaticGameObject_2, ObjectSkin_7, ObjectPhysics_6, misc_2, tree_1, house, Tree, tree, trees, bamboo, lamp, chest, flower, flowers, Campfire;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (StaticGameObject_2_1) {
                StaticGameObject_2 = StaticGameObject_2_1;
            },
            function (ObjectSkin_7_1) {
                ObjectSkin_7 = ObjectSkin_7_1;
            },
            function (ObjectPhysics_6_1) {
                ObjectPhysics_6 = ObjectPhysics_6_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (tree_1_1) {
                tree_1 = tree_1_1;
            }
        ],
        execute: function () {
            exports_17("house", house = new StaticGameObject_2.StaticGameObject([2, 2], new ObjectSkin_7.ObjectSkin(` /^\\ 
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
 . .`, ''), [5, 10]));
            Tree = class Tree extends StaticGameObject_2.StaticGameObject {
                constructor() {
                    super([1, 3], tree_1.treeSprite.frames['no wind'][0], new ObjectPhysics_6.ObjectPhysics(`


 .`, ''), [2, 12]);
                }
                new() { return new Tree(); }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const o = this;
                    if (o.ticks > 300) {
                        o.ticks = 0;
                        if (o.parameters["animate"]) {
                            o.parameters["tick"] = !o.parameters["tick"];
                            o.skin = o.parameters["tick"]
                                ? tree_1.treeSprite.frames['no wind'][0]
                                : tree_1.treeSprite.frames['wind'][0];
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
                        if (ev.args.to === 'snow') {
                            o.skin.raw_colors[0][1][1] = 'white';
                            o.skin.raw_colors[1][0][1] = 'white';
                            o.skin.raw_colors[1][1][1] = '#ccc';
                            o.skin.raw_colors[1][2][1] = '#ccc';
                        }
                        else {
                            o.skin.raw_colors[0][1][1] = '#0a0';
                            o.skin.raw_colors[1][0][1] = '#0a0';
                            o.skin.raw_colors[1][1][1] = '#080';
                            o.skin.raw_colors[1][2][1] = '#080';
                        }
                    }
                }
            };
            ;
            exports_17("tree", tree = new Tree());
            exports_17("trees", trees = []);
            bamboo = new StaticGameObject_2.StaticGameObject([0, 4], new ObjectSkin_7.ObjectSkin(`▄
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
            }), new ObjectPhysics_6.ObjectPhysics(` 
 
 
 
 
.`, ``), [0, 0]);
            if (true) { // random trees
                for (let y = 6; y < 18; y++) {
                    const x = (Math.random() * 8 + 1) | 0;
                    trees.push(misc_2.clone(bamboo, { position: [x, y] }));
                    const x2 = (Math.random() * 8 + 8) | 0;
                    trees.push(misc_2.clone(bamboo, { position: [x2, y] }));
                }
                for (let tree of trees) {
                    tree.setAction(0, 5, (obj) => {
                        obj.enabled = false;
                        // console.log("Cut tree"); @todo sent event
                    });
                }
            }
            exports_17("lamp", lamp = new StaticGameObject_2.StaticGameObject([0, 2], new ObjectSkin_7.ObjectSkin(`⬤
█
█`, `L
H
H`, {
                'L': ['yellow', 'transparent'],
                'H': ['#666', 'transparent'],
            }), new ObjectPhysics_6.ObjectPhysics(` 
 
.`, `B`), [0, 0]));
            lamp.parameters["is_on"] = true;
            lamp.setAction(0, 2, (o) => {
                o.parameters["is_on"] = !o.parameters["is_on"];
                o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
                o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
            }, 0, 0);
            exports_17("chest", chest = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_7.ObjectSkin(`S`, `V`, {
                V: ['yellow', 'violet'],
            }), new ObjectPhysics_6.ObjectPhysics(`.`, ''), [2, 10]));
            flower = new StaticGameObject_2.StaticGameObject([0, 0], new ObjectSkin_7.ObjectSkin(`❁`, `V`, {
                V: ['red', 'transparent'],
            }), new ObjectPhysics_6.ObjectPhysics(` `, 'F'), [2, 10]);
            exports_17("flowers", flowers = []);
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
            Campfire = class Campfire extends StaticGameObject_2.StaticGameObject {
                constructor() {
                    super([0, 0], new ObjectSkin_7.ObjectSkin(`🔥`, `V`, {
                        V: ['red', 'transparent'],
                    }), new ObjectPhysics_6.ObjectPhysics(` `, 'F', 'F'), [10, 10]);
                }
                new() { return new Campfire(); }
                handleEvent(ev) {
                    super.handleEvent(ev);
                    //
                    if (ev.type === 'weather_changed') {
                        if (ev.args["to"] == 'rain') {
                            this.skin.grid[0][0] = `💨`;
                            this.physics.lights[0] = `6`;
                            this.physics.temperatures[0] = `8`;
                        }
                        else if (ev.args["to"] == 'rain_and_snow') {
                            this.skin.grid[0][0] = `🔥`;
                            this.physics.lights[0] = `A`;
                            this.physics.temperatures[0] = `A`;
                        }
                        else {
                            this.skin.grid[0][0] = `🔥`;
                            this.physics.lights[0] = `F`;
                            this.physics.temperatures[0] = `F`;
                        }
                    }
                }
            };
            exports_17("Campfire", Campfire);
        }
    };
});
System.register("world/npcs/Sheep", ["engine/Npc", "engine/ObjectSkin"], function (exports_18, context_18) {
    "use strict";
    var Npc_3, ObjectSkin_8, Sheep;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (Npc_3_1) {
                Npc_3 = Npc_3_1;
            },
            function (ObjectSkin_8_1) {
                ObjectSkin_8 = ObjectSkin_8_1;
            }
        ],
        execute: function () {
            Sheep = class Sheep extends Npc_3.Npc {
                constructor() {
                    super(new ObjectSkin_8.ObjectSkin(`🐑`, `.`, {
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
            exports_18("Sheep", Sheep);
        }
    };
});
System.register("world/npcs/Wolf", ["engine/Npc", "engine/ObjectSkin", "world/objects"], function (exports_19, context_19) {
    "use strict";
    var Npc_4, ObjectSkin_9, objects_1, Wolf;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (Npc_4_1) {
                Npc_4 = Npc_4_1;
            },
            function (ObjectSkin_9_1) {
                ObjectSkin_9 = ObjectSkin_9_1;
            },
            function (objects_1_1) {
                objects_1 = objects_1_1;
            }
        ],
        execute: function () {
            Wolf = class Wolf extends Npc_4.Npc {
                constructor() {
                    super(new ObjectSkin_9.ObjectSkin(`🐺`, `.`, {
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
                    const firesNearby = this.getObjectsNearby(scene, 5, x => x instanceof objects_1.Campfire);
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
            exports_19("Wolf", Wolf);
            ;
        }
    };
});
System.register("world/levels/sheep", ["engine/ObjectSkin", "engine/StaticGameObject", "engine/ObjectPhysics", "utils/misc", "world/objects", "world/npcs/Sheep", "world/npcs/Wolf", "engine/Level"], function (exports_20, context_20) {
    "use strict";
    var ObjectSkin_10, StaticGameObject_3, ObjectPhysics_7, misc_3, objects_2, Sheep_1, Wolf_1, Level_1, vFence, hFence, sheeps, wolves, fences, sheep, wolf, tree2, campfire, campfires, sheepLevel;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (ObjectSkin_10_1) {
                ObjectSkin_10 = ObjectSkin_10_1;
            },
            function (StaticGameObject_3_1) {
                StaticGameObject_3 = StaticGameObject_3_1;
            },
            function (ObjectPhysics_7_1) {
                ObjectPhysics_7 = ObjectPhysics_7_1;
            },
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (objects_2_1) {
                objects_2 = objects_2_1;
            },
            function (Sheep_1_1) {
                Sheep_1 = Sheep_1_1;
            },
            function (Wolf_1_1) {
                Wolf_1 = Wolf_1_1;
            },
            function (Level_1_1) {
                Level_1 = Level_1_1;
            }
        ],
        execute: function () {
            vFence = new StaticGameObject_3.StaticGameObject([0, 0], new ObjectSkin_10.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_7.ObjectPhysics('.'), [0, 0]);
            hFence = new StaticGameObject_3.StaticGameObject([0, 0], new ObjectSkin_10.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_7.ObjectPhysics('.'), [0, 0]);
            sheeps = [];
            wolves = [];
            fences = [];
            sheep = new Sheep_1.Sheep();
            if (true) { // add fence
                for (let x = 1; x < 19; x++) {
                    fences.push(misc_3.clone(hFence, { position: [x, 1] }));
                    fences.push(misc_3.clone(hFence, { position: [x, 18] }));
                }
                for (let y = 2; y < 18; y++) {
                    fences.push(misc_3.clone(vFence, { position: [1, y] }));
                    fences.push(misc_3.clone(vFence, { position: [18, y] }));
                }
            }
            if (true) { // random sheeps
                for (let y = 2; y < 17; y++) {
                    const parts = 4;
                    for (let p = 0; p < parts; p++) {
                        const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
                        const newSheep = misc_3.clone(sheep, { position: [x, y] });
                        sheeps.push(newSheep);
                    }
                }
            }
            wolf = new Wolf_1.Wolf();
            wolves.push(wolf);
            tree2 = misc_3.clone(objects_2.tree, { position: [7, 9] });
            campfire = new objects_2.Campfire();
            campfires = [
                misc_3.clone(campfire, [10, 10]),
            ];
            exports_20("sheepLevel", sheepLevel = new Level_1.Level([...sheeps, ...wolves, ...fences, tree2, ...campfires]));
        }
    };
});
System.register("world/items", ["engine/Item", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_21, context_21) {
    "use strict";
    var Item_1, ObjectSkin_11, ObjectPhysics_8, lamp, sword, emptyHand;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (Item_1_1) {
                Item_1 = Item_1_1;
            },
            function (ObjectSkin_11_1) {
                ObjectSkin_11 = ObjectSkin_11_1;
            },
            function (ObjectPhysics_8_1) {
                ObjectPhysics_8 = ObjectPhysics_8_1;
            }
        ],
        execute: function () {
            exports_21("lamp", lamp = new Item_1.Item([0, 0], new ObjectSkin_11.ObjectSkin(`🏮`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_8.ObjectPhysics(` `, `f`, `a`), [0, 0]));
            exports_21("sword", sword = new Item_1.Item([0, 0], new ObjectSkin_11.ObjectSkin(`🗡`, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_8.ObjectPhysics(), [0, 0]));
            exports_21("emptyHand", emptyHand = new Item_1.Item([0, 0], new ObjectSkin_11.ObjectSkin(` `, `.`, { '.': [undefined, 'transparent'] }), new ObjectPhysics_8.ObjectPhysics(), [0, 0]));
        }
    };
});
System.register("world/hero", ["engine/Npc", "engine/ObjectSkin", "world/items"], function (exports_22, context_22) {
    "use strict";
    var Npc_5, ObjectSkin_12, items_1, hero;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (Npc_5_1) {
                Npc_5 = Npc_5_1;
            },
            function (ObjectSkin_12_1) {
                ObjectSkin_12 = ObjectSkin_12_1;
            },
            function (items_1_1) {
                items_1 = items_1_1;
            }
        ],
        execute: function () {
            exports_22("hero", hero = new class extends Npc_5.Npc {
                constructor() {
                    super(new ObjectSkin_12.ObjectSkin('🐱', '.', { '.': [undefined, 'transparent'] }), [9, 7]);
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
System.register("ui/playerUi", ["engine/GraphicsEngine", "engine/Cell", "engine/Npc"], function (exports_23, context_23) {
    "use strict";
    var GraphicsEngine_2, Cell_3, Npc_6, PlayerUi;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (GraphicsEngine_2_1) {
                GraphicsEngine_2 = GraphicsEngine_2_1;
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
                        GraphicsEngine_2.drawCell(ctx, this.camera, new Cell_3.Cell(' ', 'white', 'black'), i, 0);
                    }
                    drawHealth(this.npc, [0, 0]);
                    const right = this.camera.size.width - 1;
                    if (this.objectUnderCursor) {
                        if (this.objectUnderCursor instanceof Npc_6.Npc) {
                            GraphicsEngine_2.drawObjectAt(ctx, this.camera, this.objectUnderCursor, [right, 0]);
                            drawHealth(this.objectUnderCursor, [right - this.objectUnderCursor.maxHealth, 0]);
                        }
                    }
                    else if (this.actionUnderCursor) {
                        GraphicsEngine_2.drawCell(ctx, this.camera, this.actionUnderCursor, right, 0);
                    }
                    function drawHealth(npc, position) {
                        for (let i = 0; i < npc.maxHealth; i++) {
                            const heartCell = new Cell_3.Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
                            GraphicsEngine_2.drawCell(ctx, ui.camera, heartCell, position[0] + i, position[1]);
                        }
                    }
                }
                update(ticks, scene) {
                    this.objectUnderCursor = null;
                    this.actionUnderCursor = null;
                    for (let o of scene.objects) {
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
            exports_23("PlayerUi", PlayerUi);
        }
    };
});
System.register("world/npcs", ["engine/ObjectSkin", "engine/EventLoop", "engine/GameEvent", "engine/Npc"], function (exports_24, context_24) {
    "use strict";
    var ObjectSkin_13, EventLoop_3, GameEvent_3, Npc_7, ulan, npcs;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (ObjectSkin_13_1) {
                ObjectSkin_13 = ObjectSkin_13_1;
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
            ulan = new Npc_7.Npc(new ObjectSkin_13.ObjectSkin('🐻', `.`, {
                '.': [undefined, 'transparent'],
            }), [4, 4]);
            ulan.setAction(0, 0, (o) => {
                EventLoop_3.emitEvent(new GameEvent_3.GameEvent(o, "user_action", {
                    subtype: "npc_talk",
                    object: o,
                }));
            });
            exports_24("npcs", npcs = [
                ulan,
            ]);
        }
    };
});
System.register("world/levels/intro", ["world/objects", "utils/misc", "engine/EventLoop", "engine/GameEvent", "world/npcs", "engine/Level"], function (exports_25, context_25) {
    "use strict";
    var objects_3, misc_4, EventLoop_4, GameEvent_4, npcs_1, Level_2, lamps, introLevel;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (objects_3_1) {
                objects_3 = objects_3_1;
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
            }
        ],
        execute: function () {
            lamps = [
                misc_4.clone(objects_3.lamp, { position: [2, 5] }),
                misc_4.clone(objects_3.lamp, { position: [17, 5] }),
            ];
            exports_25("introLevel", introLevel = new Level_2.Level([...objects_3.flowers, objects_3.house, objects_3.chest, objects_3.tree, ...objects_3.trees, ...lamps, ...npcs_1.npcs]));
            // scripts
            objects_3.chest.setAction(0, 0, function () {
                EventLoop_4.emitEvent(new GameEvent_4.GameEvent(objects_3.chest, "add_object", { object: misc_4.createTextObject(`VICTORY!`, 6, 6) }));
            });
        }
    };
});
System.register("world/npcs/Bee", ["engine/Npc", "engine/ObjectSkin"], function (exports_26, context_26) {
    "use strict";
    var Npc_8, ObjectSkin_14, Bee;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (Npc_8_1) {
                Npc_8 = Npc_8_1;
            },
            function (ObjectSkin_14_1) {
                ObjectSkin_14 = ObjectSkin_14_1;
            }
        ],
        execute: function () {
            Bee = class Bee extends Npc_8.Npc {
                constructor() {
                    super(new ObjectSkin_14.ObjectSkin(`🐝`, `.`, {
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
            exports_26("Bee", Bee);
        }
    };
});
System.register("world/objects/artificial", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_27, context_27) {
    "use strict";
    var StaticGameObject_4, ObjectSkin_15, ObjectPhysics_9, vFence, hFence, beehive;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (StaticGameObject_4_1) {
                StaticGameObject_4 = StaticGameObject_4_1;
            },
            function (ObjectSkin_15_1) {
                ObjectSkin_15 = ObjectSkin_15_1;
            },
            function (ObjectPhysics_9_1) {
                ObjectPhysics_9 = ObjectPhysics_9_1;
            }
        ],
        execute: function () {
            exports_27("vFence", vFence = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_15.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]));
            exports_27("hFence", hFence = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_15.ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }), new ObjectPhysics_9.ObjectPhysics('.'), [0, 0]));
            exports_27("beehive", beehive = new StaticGameObject_4.StaticGameObject([0, 0], new ObjectSkin_15.ObjectSkin(`☷`, `R`, {
                'R': ['black', 'orange'],
            }), new ObjectPhysics_9.ObjectPhysics(`.`), [0, 0]));
        }
    };
});
System.register("world/objects/natural", ["engine/StaticGameObject", "engine/ObjectSkin", "engine/ObjectPhysics"], function (exports_28, context_28) {
    "use strict";
    var StaticGameObject_5, ObjectSkin_16, ObjectPhysics_10, createUnitSkin, unitPhysics, createUnitStaticObject, flower, wheat, hotspring, duck, bamboo, Tree, tree, SakuraTree, sakura;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (StaticGameObject_5_1) {
                StaticGameObject_5 = StaticGameObject_5_1;
            },
            function (ObjectSkin_16_1) {
                ObjectSkin_16 = ObjectSkin_16_1;
            },
            function (ObjectPhysics_10_1) {
                ObjectPhysics_10 = ObjectPhysics_10_1;
            }
        ],
        execute: function () {
            createUnitSkin = (sym, color = 'black') => new ObjectSkin_16.ObjectSkin(sym, `u`, {
                u: [color, 'transparent'],
            });
            unitPhysics = new ObjectPhysics_10.ObjectPhysics(` `);
            createUnitStaticObject = (sym, color = 'black') => new StaticGameObject_5.StaticGameObject([0, 0], createUnitSkin(sym, color), unitPhysics, [0, 0]);
            exports_28("flower", flower = createUnitStaticObject(`❁`, 'red'));
            exports_28("wheat", wheat = createUnitStaticObject(`♈`, 'yellow'));
            exports_28("hotspring", hotspring = createUnitStaticObject(`♨`, 'lightblue'));
            exports_28("duck", duck = createUnitStaticObject(`🦆`, 'white'));
            exports_28("bamboo", bamboo = new StaticGameObject_5.StaticGameObject([0, 4], new ObjectSkin_16.ObjectSkin(`▄
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
            }), new ObjectPhysics_10.ObjectPhysics(` 
     
     
     
     
    .`, ``), [0, 0]));
            Tree = class Tree extends StaticGameObject_5.StaticGameObject {
                constructor() {
                    super([1, 3], new ObjectSkin_16.ObjectSkin(` ░ 
░░░
░░░
 █`, ` o 
o01
01S
 H`, {
                        'o': ['#0c0', '#0a0'],
                        '0': ['#0a0', '#080'],
                        '1': ['#080', '#060'],
                        'S': ['#060', '#040'],
                        'H': ['sienna', 'transparent'],
                    }), new ObjectPhysics_10.ObjectPhysics(`
    
    
 .`, ''), [2, 12]);
                }
                new() { return new Tree(); }
                update(ticks, scene) {
                    super.update(ticks, scene);
                    //
                    const o = this;
                    if (o.ticks > 300) {
                        o.ticks = 0;
                        if (o.parameters["animate"]) {
                            o.parameters["tick"] = !o.parameters["tick"];
                            o.skin.characters[0] = o.parameters["tick"] ? ` ░ ` : ` ▒ `;
                            o.skin.characters[1] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
                            o.skin.characters[2] = o.parameters["tick"] ? `░░░` : `▒▒▒`;
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
                        if (ev.args.to === 'snow') {
                            o.skin.raw_colors[0][1][1] = 'white';
                            o.skin.raw_colors[1][0][1] = 'white';
                            o.skin.raw_colors[1][1][1] = '#ccc';
                            o.skin.raw_colors[1][2][1] = '#ccc';
                        }
                        else {
                            o.skin.raw_colors[0][1][1] = '#0a0';
                            o.skin.raw_colors[1][0][1] = '#0a0';
                            o.skin.raw_colors[1][1][1] = '#080';
                            o.skin.raw_colors[1][2][1] = '#080';
                        }
                    }
                }
            };
            ;
            exports_28("tree", tree = new Tree());
            SakuraTree = class SakuraTree extends StaticGameObject_5.StaticGameObject {
                constructor() {
                    super([2, 3], new ObjectSkin_16.ObjectSkin(` ░░ 
░░░░
 ░░
  █`, ` oo 
o01o
 1S
  H`, {
                        'o': ['#c3829e', '#fcd1d7'],
                        '0': ['#fcd1d7', '#e9b1cd'],
                        '1': ['#e9b1cd', '#c3829e'],
                        'S': ['#c3829e', '#562135'],
                        'H': ['sienna', 'transparent'],
                    }), new ObjectPhysics_10.ObjectPhysics(`
    
    
 .`, ''), [2, 12]);
                }
                new() { return new SakuraTree(); }
            };
            ;
            exports_28("sakura", sakura = new SakuraTree());
        }
    };
});
System.register("world/levels/ggj2020demo/objects", ["engine/ObjectPhysics", "engine/ObjectSkin", "engine/StaticGameObject"], function (exports_29, context_29) {
    "use strict";
    var ObjectPhysics_11, ObjectSkin_17, StaticGameObject_6, pillar, arc, shop;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (ObjectPhysics_11_1) {
                ObjectPhysics_11 = ObjectPhysics_11_1;
            },
            function (ObjectSkin_17_1) {
                ObjectSkin_17 = ObjectSkin_17_1;
            },
            function (StaticGameObject_6_1) {
                StaticGameObject_6 = StaticGameObject_6_1;
            }
        ],
        execute: function () {
            exports_29("pillar", pillar = new StaticGameObject_6.StaticGameObject([0, 3], new ObjectSkin_17.ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
                'L': ['yellow', 'transparent'],
                'H': ['white', 'transparent'],
                'B': ['#777', 'transparent'],
            }), new ObjectPhysics_11.ObjectPhysics(` 
 
 
. `), [0, 0]));
            exports_29("arc", arc = new StaticGameObject_6.StaticGameObject([2, 3], new ObjectSkin_17.ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
                'L': ['orange', 'brown'],
                'H': ['white', 'transparent'],
                'B': ['gray', 'transparent'],
            }), new ObjectPhysics_11.ObjectPhysics(`     
     
     
.   .`), [0, 0]));
            exports_29("shop", shop = new StaticGameObject_6.StaticGameObject([2, 3], new ObjectSkin_17.ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
                'L': ['lightgray', 'brown'],
                'H': ['gray', 'transparent'],
                'B': ['brown', 'transparent'],
                'T': ['orange', 'brown'],
            }), new ObjectPhysics_11.ObjectPhysics(`       
       
 ..... `), [0, 0]));
        }
    };
});
System.register("world/levels/ggj2020demo/tiles", ["engine/Cell"], function (exports_30, context_30) {
    "use strict";
    var Cell_4, tiles;
    var __moduleName = context_30 && context_30.id;
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
            exports_30("tiles", tiles = parseTiles(`gggggggGGggggggggggggggggggGGgggg ggggggggGGgg ggG
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
System.register("world/levels/ggj2020demo/level", ["engine/Level", "utils/misc", "world/npcs/Bee", "world/npcs/Sheep", "world/objects", "world/objects/artificial", "world/objects/natural", "world/levels/ggj2020demo/objects", "world/levels/ggj2020demo/tiles"], function (exports_31, context_31) {
    "use strict";
    var Level_3, misc_5, Bee_1, Sheep_2, objects_4, artificial_1, natural_1, objects_5, tiles_1, levelWidth, levelHeight, fences, extraFences, trees, sakuras, houses, lamps, pillars, arcs, shops, ducks, sheep, sheepList, wheats, flowers, bamboos, beehives, bee, bees, hotsprings, level;
    var __moduleName = context_31 && context_31.id;
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
            function (Sheep_2_1) {
                Sheep_2 = Sheep_2_1;
            },
            function (objects_4_1) {
                objects_4 = objects_4_1;
            },
            function (artificial_1_1) {
                artificial_1 = artificial_1_1;
            },
            function (natural_1_1) {
                natural_1 = natural_1_1;
            },
            function (objects_5_1) {
                objects_5 = objects_5_1;
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
            ].map(x => misc_5.clone(objects_4.tree, x));
            sakuras = [
                { position: [37, 22] },
                { position: [42, 18] },
                { position: [47, 19] },
                { position: [40, 24] },
                { position: [43, 22] },
                { position: [26, 24] },
                { position: [32, 20] },
            ].map(x => misc_5.clone(natural_1.sakura, x));
            houses = [
                misc_5.clone(objects_4.house, { position: [25, 5] }),
                misc_5.clone(objects_4.house, { position: [15, 25] }),
                misc_5.clone(objects_4.house, { position: [13, 3] }),
                misc_5.clone(objects_4.house, { position: [3, 10] }),
            ];
            lamps = [
                misc_5.clone(objects_4.lamp, { position: [27, 5] }),
                misc_5.clone(objects_4.lamp, { position: [13, 25] }),
                misc_5.clone(objects_4.lamp, { position: [15, 3] }),
                misc_5.clone(objects_4.lamp, { position: [1, 10] }),
            ];
            pillars = [
                misc_5.clone(objects_5.pillar, { position: [7, 21] }),
                misc_5.clone(objects_5.pillar, { position: [20, 24] }),
                misc_5.clone(objects_5.pillar, { position: [30, 20] }),
            ];
            arcs = [
                misc_5.clone(objects_5.arc, { position: [16, 16] }),
                misc_5.clone(objects_5.arc, { position: [32, 25] }),
            ];
            shops = [
                { position: [18, 10] }
            ].map(x => misc_5.clone(objects_5.shop, x));
            ducks = [
                { position: [40, 10] },
                { position: [38, 12] },
                { position: [44, 25] },
                { position: [40, 26] },
                { position: [7, 28] },
            ].map(x => misc_5.clone(natural_1.duck, x));
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
            ].map(x => misc_5.clone(natural_1.bamboo, x));
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
            exports_31("level", level = new Level_3.Level([
                ...fences, ...extraFences,
                ...trees, ...sakuras, ...bamboos,
                ...arcs, ...shops, ...houses, ...pillars, ...beehives,
                ...flowers, ...lamps, ...wheats,
                ...hotsprings,
                ...ducks, ...bees, ...sheepList,
            ], tiles_1.tiles, levelWidth, levelHeight));
        }
    };
});
System.register("main", ["world/levels/sheep", "world/items", "engine/GameEvent", "engine/EventLoop", "engine/Scene", "engine/Cell", "engine/GraphicsEngine", "world/hero", "ui/playerUi", "engine/Npc", "utils/misc", "world/levels/intro", "world/levels/ggj2020demo/level"], function (exports_32, context_32) {
    "use strict";
    var sheep_1, items_2, GameEvent_5, EventLoop_5, Scene_1, Cell_5, GraphicsEngine_3, hero_1, playerUi_1, Npc_9, misc_6, intro_1, level_1, canvas, ctx, Game, game, scene, leftPad, topPad, heroUi, currentLevel, ticksPerStep;
    var __moduleName = context_32 && context_32.id;
    function selectLevel(level) {
        scene.tiles = level.tiles;
        scene.objects = [...level.sceneObjects];
        scene.objects.push(hero_1.hero);
        currentLevel = level;
        scene.camera.follow(hero_1.hero, level);
    }
    function getActionUnderCursor() {
        return scene.getNpcAction(hero_1.hero);
    }
    function getNpcUnderCursor(npc) {
        for (let object of scene.objects) {
            if (!object.enabled)
                continue;
            if (!(object instanceof Npc_9.Npc))
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
                    GraphicsEngine_3.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'black', '#555'), x, scene.camera.size.height - dialogHeight + y);
                else
                    GraphicsEngine_3.drawCell(ctx, scene.camera, new Cell_5.Cell(' ', 'white', '#333'), x, scene.camera.size.height - dialogHeight + y);
            }
        }
    }
    function onInterval() {
        game.update(ticksPerStep);
        EventLoop_5.eventLoop([game, scene, ...scene.objects]);
        game.draw();
    }
    return {
        setters: [
            function (sheep_1_1) {
                sheep_1 = sheep_1_1;
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
            function (GraphicsEngine_3_1) {
                GraphicsEngine_3 = GraphicsEngine_3_1;
            },
            function (hero_1_1) {
                hero_1 = hero_1_1;
            },
            function (playerUi_1_1) {
                playerUi_1 = playerUi_1_1;
            },
            function (Npc_9_1) {
                Npc_9 = Npc_9_1;
            },
            function (misc_6_1) {
                misc_6 = misc_6_1;
            },
            function (intro_1_1) {
                intro_1 = intro_1_1;
            },
            function (level_1_1) {
                level_1 = level_1_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = new GraphicsEngine_3.CanvasContext(canvas.getContext("2d"));
            Game = class Game {
                constructor() {
                    this.mode = "scene"; // "dialog", "inventory", ...
                }
                handleEvent(ev) {
                    if (ev.type === "switch_mode") {
                        this.mode = ev.args.to;
                    }
                    else if (ev.type === "add_object") {
                        scene.objects.push(ev.args.object);
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
                    if (this.mode === "scene")
                        scene.update(ticks);
                }
            };
            game = new Game();
            scene = new Scene_1.Scene();
            selectLevel(sheep_1.sheepLevel);
            exports_32("leftPad", leftPad = (ctx.context.canvas.width - GraphicsEngine_3.cellStyle.size.width * scene.camera.size.width) / 2);
            exports_32("topPad", topPad = (ctx.context.canvas.height - GraphicsEngine_3.cellStyle.size.height * scene.camera.size.height) / 2);
            heroUi = new playerUi_1.PlayerUi(hero_1.hero, scene.camera);
            currentLevel = null;
            document.addEventListener("keydown", function (ev) {
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
            });
            document.addEventListener("keypress", function (code) {
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
                                hero_1.hero.objectInMainHand = misc_6.clone(items_2.emptyHand);
                            }
                            else if (key_code === 'Digit2') {
                                hero_1.hero.objectInMainHand = misc_6.clone(items_2.sword);
                            }
                            else if (key_code === "KeyQ") {
                                selectLevel(intro_1.introLevel);
                            }
                            else if (key_code === "KeyR") {
                                selectLevel(sheep_1.sheepLevel);
                            }
                            else if (key_code === "KeyE") {
                                selectLevel(level_1.level);
                            }
                            return;
                        }
                        const oldWeatherType = scene.weatherType;
                        if (raw_key === '1') { // debug
                            scene.weatherType = 'normal';
                        }
                        else if (raw_key === '2') { // debug
                            scene.weatherType = 'rain';
                        }
                        else if (raw_key === '3') { // debug
                            scene.weatherType = 'snow';
                        }
                        else if (raw_key === '4') { // debug
                            scene.weatherType = 'rain_and_snow';
                        }
                        else if (raw_key === '5') { // debug
                            scene.weatherType = 'mist';
                        }
                        if (oldWeatherType !== scene.weatherType) {
                            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "weather_changed", {
                                from: oldWeatherType,
                                to: scene.weatherType,
                            }));
                        }
                        // wind
                        if (raw_key === 'e') {
                            scene.isWindy = !scene.isWindy;
                            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "wind_changed", {
                                from: !scene.isWindy,
                                to: scene.isWindy,
                            }));
                        }
                        //
                        if (raw_key === 'q') { // debug
                            scene.timePeriod = scene.timePeriod === 'day' ? 'night' : 'day';
                            //
                            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "time_changed", {
                                from: scene.timePeriod === 'day' ? 'night' : 'day',
                                to: scene.timePeriod,
                            }));
                        }
                        if (raw_key === 't') {
                            scene.debugDrawTemperatures = !scene.debugDrawTemperatures;
                        }
                        if (raw_key === 'm') {
                            scene.debugDrawMoisture = !scene.debugDrawMoisture;
                        }
                        return; // skip
                    }
                    if (!code.shiftKey) {
                        if (!scene.isPositionBlocked(hero_1.hero.cursorPosition)) {
                            hero_1.hero.move();
                        }
                    }
                }
            });
            ticksPerStep = 33;
            // initial events
            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "weather_changed", { from: scene.weatherType, to: scene.weatherType }));
            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "wind_changed", { from: scene.isWindy, to: scene.isWindy }));
            EventLoop_5.emitEvent(new GameEvent_5.GameEvent("system", "time_changed", { from: scene.timePeriod, to: scene.timePeriod }));
            //
            onInterval(); // initial run
            setInterval(onInterval, ticksPerStep);
            window.command = new class {
                getItem(itemName) {
                    console.log('Not implemented yet');
                }
                takeItem(itemName) {
                    if (itemName === 'sword') {
                        hero_1.hero.objectInMainHand = misc_6.clone(items_2.sword);
                    }
                    else if (itemName === 'lamp') {
                        hero_1.hero.objectInMainHand = misc_6.clone(items_2.lamp);
                    }
                }
                takeItem2(itemName) {
                    if (itemName === 'lamp') {
                        hero_1.hero.objectInSecondaryHand = misc_6.clone(items_2.lamp);
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