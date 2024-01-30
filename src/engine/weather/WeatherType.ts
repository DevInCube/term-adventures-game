export const weatherTypes = ["normal", "rain", "ashfall", "snow", "rain_and_snow", "mist", "heavy_mist"] as const;
export type WeatherType = (typeof weatherTypes)[number];
