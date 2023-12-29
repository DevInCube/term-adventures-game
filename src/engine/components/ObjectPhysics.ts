export class ObjectPhysics {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];
    public tops: (string)[];
    public transparency: (string)[];
    public lightsMap: { [key: string]: { intensity: string, color: [number, number, number], } } | undefined;

    constructor(
        collisionsMask: string = '', 
        lightMask: string = '',
        temperatureMask: string = '',
        topMask: string = '',
        transparencyMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
        this.tops = topMask.split('\n');
        this.transparency = transparencyMask !== '' 
            ? transparencyMask.split('\n')
            : this.collisions.map(x => x === '.' ? 'F' : '0');
    } 
}