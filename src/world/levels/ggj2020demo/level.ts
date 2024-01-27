import { Level } from "../../../engine/Level";
import { Object2D } from "../../../engine/objects/Object2D";
import { bee } from "../../npcs/bee";
import { duck } from "../../npcs/duck";
import { sheep } from "../../npcs/sheep";
import { lamp } from "../../objects/lamp";
import { house } from "../../objects/house";
import { bamboo } from "../../objects/bamboo";
import { pineTree } from "../../objects/pineTree";
import { sakuraTree } from "../../objects/sakuraTree";
import { beehive } from "../../objects/beehive";
import { flower, hotspring, wheat } from "../../objects/natural";
import { pillar } from "./objects/pillar";
import { shop } from "./objects/shop";
import { arc } from "./objects/arc";
import { levelTiles } from "./tiles";
import { fence } from "../../objects/fence";
import { Door } from "../../objects/door";

const levelHeight = levelTiles.length;
const levelWidth = levelTiles[0].length;

const fences: Object2D[] = [];
if (true) {  // add fence
    for (let x = 0; x < levelWidth; x++) {
        fences.push(fence({ position: [x, 0] }));
        fences.push(fence({ position: [x, levelHeight - 1] }));
    }
    for (let y = 1; y < levelHeight - 1; y++) {
        fences.push(fence({ position: [0, y] }));
        fences.push(fence({ position: [levelWidth - 1, y] }));
    }
}

const extraFences = [
    fence({ position: [28, 7] }),
    fence({ position: [29, 7] }),
    fence({ position: [30, 7] }),
    fence({ position: [31, 7] }),
]

const trees = [
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
].map((x: { position: [number,number] }) => pineTree(x));

const sakuras = [
    { position: [37, 22] },
    { position: [42, 18] },
    { position: [47, 19] },
    { position: [40, 24] },
    { position: [43, 22] },
    { position: [26, 24] },
    { position: [32, 20] },
].map((x: { position: [number,number] }) => sakuraTree(x));

const houses = [
    house({ position: [25, 5] }),
    house({ position: [15, 25] }),
    house({ position: [13, 3] }),
    house({ position: [3, 10] }),
]

const lamps = [
    lamp({ position: [27, 5] }),
    lamp({ position: [13, 25] }),
    lamp({ position: [15, 3] }),
    lamp({ position: [1, 10] }),
]

const pillars = [
    pillar({ position: [7, 21] }),
    pillar({ position: [20, 24] }),
    pillar({ position: [30, 20] }),
];

const arcs = [
    arc({ position: [16, 16] }),
    arc({ position: [32, 25] }),
]

const shops = [
    { position: [18, 10] }
].map((x: { position: [number,number] }) => shop(x));

const ducks = [
    { position: [40, 10] },
    { position: [38, 12] },
    { position: [44, 25] },
    { position: [40, 26] },
    { position: [7, 28] },
].map((x: { position: [number,number] }) => duck(x));

const sheepList = [
    { position: [44, 16] },
    { position: [48, 16] },
    { position: [43, 14] },
    { position: [46, 12] },
].map((x: { position: [number,number] }) => sheep(x));

const wheats = [
    { position: [31, 4] },
    { position: [31, 5] },
    { position: [30, 3] },
    { position: [31, 3] },
    { position: [28, 2] },
    { position: [29, 2] },
    { position: [29, 3] },
    { position: [29, 5] },
    { position: [28, 6] },
].map((x: { position: [number, number] }) => wheat(x));

const flowers = [
    { position: [7, 4] },
    { position: [37, 5] },
    { position: [46, 4] },
    { position: [44, 7] },
    { position: [34, 3] },
    { position: [37, 3] },
    { position: [38, 1] },
].map((x: { position: [number, number] }) => flower(x));

const bamboos = [
    { position: [4, 17] },
    { position: [6, 19] },
    { position: [3, 22] },
    { position: [2, 27] },
    { position: [1, 15] },
].map((x: { position: [number, number] }) => bamboo(x));

const beehives = [
    { position: [34, 2] },
    { position: [36, 2] },
    { position: [34, 4] },
    { position: [36, 4] },
    { position: [38, 2] },
    { position: [38, 4] },
].map((x: { position: [number, number] }) => beehive(x));

const bees = [
    { position: [35, 2] },
    { position: [34, 5] },
    { position: [40, 3] },
].map((x: { position: [number, number] }) => bee(x));

const hotsprings = [
    { position: [22, 18] },
    { position: [21, 15] },
    { position: [24, 19] },
].map((x: { position: [number, number] }) => hotspring(x));

const doors = [
    new Door("ggj2020demo_door", { position: [2, 2]}),
];

const objects = [
    ...fences, ...extraFences,
    ...trees, ...sakuras, ...bamboos,
    ...arcs, ...shops, ...houses, ...pillars, ...beehives,
    ...flowers, ...lamps, ...wheats,
    ...hotsprings,
    ...ducks, ...bees, ...sheepList,
    ...doors,
]; 
export const level = new Level(
    'ggj2020demo',
    objects,
    levelTiles
);