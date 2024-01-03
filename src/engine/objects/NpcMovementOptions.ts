// Number values are in cells per second.
export class NpcMovementOptions {
    public walkingSpeed: number;
    public flyingSpeed: number;
    public swimmingSpeed: number;
    public climbingSpeed: number;
}

export const defaultMovementOptions: { [key: string]: NpcMovementOptions } = {
    walking: <NpcMovementOptions>{
        walkingSpeed: 4,
        swimmingSpeed: 1,
    },
    waterborne: <NpcMovementOptions>{
        swimmingSpeed: 10,
    },
    amphibious: <NpcMovementOptions>{
        walkingSpeed: 1,
        swimmingSpeed: 4,
    },
    flying: <NpcMovementOptions>{
        walkingSpeed: 3,
        flyingSpeed: 10,
    }
}