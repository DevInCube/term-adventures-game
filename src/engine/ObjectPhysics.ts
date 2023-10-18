export class ObjectPhysics {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];
    public tops: (string)[];

    constructor(
        collisionsMask: string = '', 
        lightMask: string = '',
        temperatureMask: string = '',
        topMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
        this.tops = topMask.split('\n');
    }
}