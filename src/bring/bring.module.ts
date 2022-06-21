import { Module } from '@nestjs/common';
import { BringController } from "./bring.controller";
import { BringService } from "./bring.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [BringModule, HttpModule],
  controllers: [BringController],
  providers: [BringService],
})
export class BringModule {}
