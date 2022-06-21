import { Module } from '@nestjs/common';
import { IqairController } from "./iqair.controller";
import { IqairService } from "./iqair.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [IqairModule, HttpModule],
  controllers: [IqairController],
  providers: [IqairService],
})
export class IqairModule {}
