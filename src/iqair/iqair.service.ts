import { Injectable } from '@nestjs/common';
import { CONSTANTS } from "../Constants";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class IqairService {

  constructor(private httpService: HttpService) {}

  privateCacheEntry: object;
  privateCacheTSD: number;
  publicCacheEntry: object;
  publicCacheTSD: number;

  async getOutdoorQuality(): Promise<any> {
    const currNow = Date.now();
    if (currNow - this.publicCacheTSD < CONSTANTS.iqAir.publicCacheMS && this.publicCacheEntry) {
      console.log('taking cached entries iqAirOutdoor');
      return this.publicCacheEntry;
    } else {
      const source$ = this.httpService.get(CONSTANTS.iqAir.publicLink + CONSTANTS.iqAir.iqAirKey);
      const response = await lastValueFrom(source$);
      console.log('getting outdoor iqair data: ' + JSON.stringify(response.data));
      const answer = {
        currentPM2: response.data.data.current.pollution.aqius,
        temp: response.data.data.current.weather.tp,
        city: response.data.data.city
      };
      this.publicCacheEntry = answer;
      this.publicCacheTSD = Date.now();
      return answer;
    }
  }

  async getIndoorQuality(): Promise<any> {
    const currNow = Date.now();
    if (currNow - this.privateCacheTSD < CONSTANTS.iqAir.privateCacheMS && this.privateCacheEntry) {
      console.log('taking cached entries iqAirIndoor');
      return this.privateCacheEntry;
    } else {
      const source$ = this.httpService.get(CONSTANTS.iqAir.privateLink);
      const response = await lastValueFrom(source$);
      console.log('getting indoor iqair data: ' + JSON.stringify(response.data.current));
      const answer = {currentPM2: response.data.current.p2, currentCO2: response.data.current.co};
      this.privateCacheEntry = answer;
      this.privateCacheTSD = Date.now();
      return answer;
    }
  }

}
