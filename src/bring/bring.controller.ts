import { Controller, Get, Query } from '@nestjs/common';
import { BringService } from './bring.service';

@Controller('bring')
export class BringController {
  constructor(private readonly bringService: BringService) {}

  @Get('getLists')
  getLists(): Promise<any> {
    return this.bringService.getLists();
  }

  @Get('getItems')
  getItems(): Promise<any> {
    return this.bringService.getItems();
  }

}
