import { Controller, Get } from '@nestjs/common';
import { IqairService } from './iqair.service';

@Controller('iqair')
export class IqairController {
  constructor(private readonly iqairService: IqairService) {}

  @Get('getIndoorQuality')
  getIndoorQuality(): Promise<any> {
    return this.iqairService.getIndoorQuality();
  }

  @Get('getOutdoorQuality')
  getOutdoorQuality(): Promise<any> {
    return this.iqairService.getOutdoorQuality();
  }
}
