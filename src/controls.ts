export type TouchArea = [number, number, number, number];

export type Control = {
    isHandled: boolean,
    isDown: boolean,
    isShiftDown: boolean,
    code: string,
    area?: TouchArea,
    touchID: number,
};

export const Controls: { [sey: string]: Control } = {
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
    DebugO: create("KeyO"),
    DebugP: create("KeyP"),
};

function create(code: string, area?: TouchArea) : Control {
    return {
        isHandled: false,
        isDown: false,
        isShiftDown: false,
        code,
        area,
        touchID: -1,
    }
}

function findControlByCode(code: string): Control | undefined {
    return Object.entries(Controls).find(x => x[1].code === code)?.[1];
}

function findControlByTouchArea(x: number, y: number): Control | undefined {
    for (const [_, o] of Object.entries(Controls)) {
        if (!o.area) {
            return;
        }

        if (x < o.area[0] * window.innerWidth / 100) continue;
        if (y < o.area[1] * window.innerHeight / 100) continue;
        if (x > o.area[2] * window.innerWidth / 100) continue;
        if (y > o.area[3] * window.innerHeight / 100) continue;
        return o;
    }

    return undefined;
}

function findControlByTouchID(touchId: number): Control | undefined {
    return Object.entries(Controls).find(x => x[1].touchID === touchId)?.[1];
}

// exported

export function enableGameInput() {
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

// event listeners

// keyboard

function onkeyup(ev: KeyboardEvent) {
    const control = findControlByCode(ev.code);
    if (!control) {
        return;
    }

    control.isHandled = false;
    control.isDown = false;
    control.isShiftDown = false;
}

function onkeydown(ev: KeyboardEvent) {
    const control = findControlByCode(ev.code);
    if (!control) {
        return;
    }

    control.isDown = true;
    control.isShiftDown = ev.shiftKey;
}

// touch screen

function isTouchDevice() {
    return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
    );
}

function ontouchstart(ev: TouchEvent) {
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

function ontouchend(ev: TouchEvent) {
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
