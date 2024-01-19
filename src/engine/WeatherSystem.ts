import { FallingAsh } from "../world/objects/particles/FallingAsh";
import { Raindrop } from "../world/objects/particles/Raindrop";
import { Snowflake } from "../world/objects/particles/Snowflake";
import { mistSprite } from "../world/sprites/mistSprite";
import { Particle } from "./objects/Particle";

export const weatherTypes = ["normal", "rain", "ashfall", "snow", "rain_and_snow", "mist", "heavy_mist"] as const;
export type WeatherType = (typeof weatherTypes)[number];

export function createWeatherParticle(weatherType: WeatherType, p: [number, number]): Particle | undefined {
    const state = 0; //Math.random() * 100 | 0;  // TODO: random/large state is not working.
    if (weatherType === 'rain') {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new Raindrop(p, state) 
            : undefined;
    } else if (weatherType === 'ashfall') {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new FallingAsh(p, state) 
            : undefined;
    } else if (weatherType === "snow") {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new Snowflake(p, state) 
            : undefined;
    } else if (weatherType === "rain_and_snow") {
        const probability = 0.1;
        const r = Math.random() / probability | 0;
        return r === 0
            ? new Raindrop(p, state)
            : (r === 1 ? new Snowflake(p, state) : undefined);
    } else if (weatherType === "mist") {
        const probability = 0.1;
        return (Math.random() / probability | 0) === 0
            ? new Particle(mistSprite, p, state, {
                decaySpeed: 300,
            }) 
            : undefined;
    }

    return undefined;
}

export function getWeatherSkyTransparency(weatherType: WeatherType): number {
    switch (weatherType) {
        case 'rain':
        case 'ashfall':
        case 'snow':
        case 'rain_and_snow':
            return 0.8;
        case 'mist':
            return 0.7;
        default:
            return 1;
    }
}
