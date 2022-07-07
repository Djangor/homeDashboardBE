import { Injectable } from '@nestjs/common';
import { CONSTANTS } from "../Constants";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
const bringApi = require(`bring-shopping`);


@Injectable()
export class CryptoService {

  baseRate: number;

  constructor(private httpService: HttpService) {}

  getBaseRate(rates): void {
    const rate = rates.filter(rate => rate.symbol === CONSTANTS.crypto.baseCurr);
    this.baseRate = rate && rate.length > 0 ? rate[0].rateUsd : 1;
  }

  getSelectedRates(rates): object[] {
    const selection = [];
    rates.forEach(rate => {
      if (CONSTANTS.crypto.symbols.indexOf(rate.symbol) > -1) {
        const exRate = Math.round(((rate.rateUsd / this.baseRate) + Number.EPSILON) * 100) / 100;
        selection.push({symbol: rate.symbol, rate: exRate})
      } else if (CONSTANTS.crypto.inverseSymbols.indexOf(rate.symbol) > -1) {
        const exRate = Math.round(((1/rate.rateUsd*this.baseRate) + Number.EPSILON) * 100) / 100;
        selection.push({symbol: rate.symbol, rate: exRate})
      }
    })
    return selection;
  }

  async getRates(): Promise<any> {
    const source$ = this.httpService.get(CONSTANTS.crypto.url);
    const response = await lastValueFrom(source$);
    console.log(response.data.data);
    this.getBaseRate(response.data.data);
    return this.getSelectedRates(response.data.data);
  }


}

