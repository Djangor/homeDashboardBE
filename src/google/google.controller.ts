import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('getAuthorizationURL')
  getAuthorizationUrl(): Promise<any> {
    return this.googleService.getAuthorizationUrl();
  }

  @Get('setAccessCode?')
  setAuthorizationCode(@Query('code') code: string): object {
    return this.googleService.setAccessCode(code);
  }

  @Get('getCalendarEntries')
  getCalendarEntries(): Promise<any> {
    return this.googleService.getCalendarEntries();
  }

  @Get('getTaskEntries')
  getTaskEntries(): Promise<any> {
    return this.googleService.getTaskEntries();
  }

}
