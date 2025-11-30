import { FallingAsh } from "../../world/objects/particles/FallingAsh";
import { HeavyRaindrop, LightRaindrop, Raindrop } from "../../world/objects/particles/Raindrop";
import { Snowflake } from "../../world/objects/particles/Snowflake";
import { ThunderBolt } from "../../world/objects/particles/ThunderBolt";
import { mistSprite } from "../../world/sprites/mistSprite";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { Particle } from "../objects/Particle";
import { WeatherType } from "./WeatherType";

export function createWeatherParticle(weatherType: WeatherType, p: Vector2): Particle | undefined {
    const state = 0; //Math.random() * 100 | 0;  // TODO: random/large state is not working.
    if (weatherType === 'rain') {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new LightRaindrop(p, state) 
            : undefined;
    }

    if (weatherType === 'storm') {
        const lightningProbability = 0.005;
        const dropProbability = 0.1;
        const randomValue = Math.random();

        if (randomValue < lightningProbability) {
            return new ThunderBolt(p, state);
        }

        if (randomValue < lightningProbability + dropProbability) {
            return new HeavyRaindrop(p, state);
        }

        return undefined;
    }
    
    if (weatherType === 'ashfall') {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new FallingAsh(p, state) 
            : undefined;
    }
    
    if (weatherType === "snow") {
        const probability = 0.05;
        return (Math.random() / probability | 0) === 0
            ? new Snowflake(p, state) 
            : undefined;
    }
    
    if (weatherType === "rain_and_snow") {
        const probability = 0.1;
        const r = Math.random() / probability | 0;
        return r === 0
            ? new LightRaindrop(p, state)
            : (r === 1 ? new Snowflake(p, state) : undefined);
    }
    
    if (weatherType === "mist") {
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
        case 'storm':
            return 0.5;
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

export interface IWeatherParticle {
    isWeatherParticle: true;
    weatherType: WeatherType;
}

export function isWeatherPaticle(x: any): x is IWeatherParticle {
    return ("isWeatherParticle" in x) && x.isWeatherParticle && ("weatherType" in x) && x.weatherType;
}