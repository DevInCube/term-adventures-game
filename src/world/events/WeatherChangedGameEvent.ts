import { GameEvent } from "../../engine/events/GameEvent";
import { WeatherType } from "../../engine/weather/WeatherType";

export namespace WeatherChangedGameEvent {
    export const type = "weather_changed";

    export class Args {
        from: WeatherType;
        to: WeatherType;
    }

    export function create(from: WeatherType, to: WeatherType) {
        return new GameEvent(
            "system",
            WeatherChangedGameEvent.type,
            <WeatherChangedGameEvent.Args>{
                from,
                to,
            });
    }
}
