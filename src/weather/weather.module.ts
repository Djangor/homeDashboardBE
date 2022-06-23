import { Module } from '@nestjs/common';
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [WeatherModule, HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
