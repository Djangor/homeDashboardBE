import { Module } from '@nestjs/common';
import { GoogleController } from "./google.controller";
import { GoogleService } from "./google.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [GoogleModule, HttpModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
