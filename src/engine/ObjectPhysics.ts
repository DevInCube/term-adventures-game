export class ObjectPhysics {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];

    constructor(
        collisionsMask: string = '', 
        lightMask: string = '',
        temperatureMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
    }
}