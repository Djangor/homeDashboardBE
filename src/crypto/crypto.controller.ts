import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('getRates')
  getLists(): Promise<any> {
    return this.cryptoService.getRates();
  }

}
