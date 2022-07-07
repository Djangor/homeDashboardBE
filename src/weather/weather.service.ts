import { Injectable } from '@nestjs/common';
import { CONSTANTS } from "../Constants";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class WeatherService {

  constructor(private httpService: HttpService) {}

  cachedWeather: object;
  cachedWeatherTSD: number;

  //taken from magicMirror Weather plugin
  convertWeatherType(weatherType): string {
    const weatherTypes = {
      "01d": "wi-day-sunny",
      "02d": "wi-day-cloudy",
      "03d": "wi-cloudy",
      "04d": "wi-cloudy-windy",
      "09d": "wi-showers",
      "10d": "wi-rain",
      "11d": "wi-thunderstorm",
      "13d": "wi-snow",
      "50d": "wi-fog",
      "01n": "wi-night-clear",
      "02n": "wi-night-cloudy",
      "03n": "wi-night-cloudy",
      "04n": "wi-night-cloudy",
      "09n": "wi-night-showers",
      "10n": "wi-night-rain",
      "11n": "wi-night-thunderstorm",
      "13n": "wi-night-snow",
      "50n": "wi-night-alt-cloudy-windy"
    };

    return weatherTypes.hasOwnProperty(weatherType) ? weatherTypes[weatherType] : null;
  }

  convertResponse(apiResponse): object {
    function pad(n){
      return n<10 ? '0'+n : n}
    const currentWeather = apiResponse.list[0];
    const upcomingWeather = apiResponse.list[1];
    let weather = {currentTemp: currentWeather.main.temp,
      currentWeatherType: this.convertWeatherType(currentWeather.weather[0].icon),
      upcomingTemp: upcomingWeather.main.temp,
      upcomingWeatherType: this.convertWeatherType(upcomingWeather.weather[0].icon),
      forecast: []};
    for (let i=1;i<=3;i++) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i);
      const nextDateStr = nextDate.getFullYear() + '-' + pad(nextDate.getMonth() + 1) + '-' + pad(nextDate.getDate()) + ' 12:00:00';
      const nextEntry = apiResponse.list.filter(function(forecast) {
        return forecast.dt_txt === nextDateStr
      });
      if (nextEntry && nextEntry.length > 0) {
        weather.forecast.push({weatherType: this.convertWeatherType(nextEntry[0].weather[0].icon)})
      }
    }

    return weather;
  }

  async getWeather(): Promise<any> {
      const currNow = Date.now();
      if (currNow - this.cachedWeatherTSD < CONSTANTS.bring.cacheMS && this.cachedWeather) {
        console.log('taking cached entries');
        return(this.cachedWeather);
      } else {
        const source$ = this.httpService.get(CONSTANTS.weather.url);
        const response = await lastValueFrom(source$);
        const weather = this.convertResponse(response.data);
        this.cachedWeatherTSD = Date.now();
        this.cachedWeather = weather;
        return weather;
      }
  }

}

