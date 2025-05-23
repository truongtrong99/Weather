/**
 * Interface representing a weather condition
 */
export interface IWeatherCondition {
  text: string;
  icon: string;
  code: number;
}

/**
 * Interface representing a forecast day
 */
export interface IForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: IWeatherCondition;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: IHourForecast[];
}

/**
 * Interface representing an hourly forecast
 */
export interface IHourForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: IWeatherCondition;
  chance_of_rain: number;
  chance_of_snow: number;
}

/**
 * Interface representing the weather data structure
 */
export interface IWeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: IWeatherCondition;
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
  forecast?: {
    forecastday: IForecastDay[];
  };
}
