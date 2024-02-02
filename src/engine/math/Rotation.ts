export type NormalRotation = 0 | 1 | 2 | 3;

function normalize(rotation: number): NormalRotation {
    return (4 + (4 + rotation) % 4) % 4 as NormalRotation;
}

function equals(a: number, b: number): boolean {
    return normalize(a) === normalize(b);
}

const forward: NormalRotation = 0;
const back: NormalRotation = 2;
const left: NormalRotation = 3;
const right: NormalRotation = 1;
const opposite: NormalRotation = 2;
const none: NormalRotation[] = [];
const all: NormalRotation[] = [forward, right, back, left];

export const Rotations = {
    forward,
    back,
    left,
    right,
    opposite,
    none,
    all,
    normalize,
    equals,
}