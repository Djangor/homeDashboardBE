import { Module } from '@nestjs/common';
import { CryptoController } from "./crypto.controller";
import { CryptoService } from "./crypto.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [CryptoModule, HttpModule],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
