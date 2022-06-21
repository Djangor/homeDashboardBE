import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IqairModule } from './iqair/iqair.module';
import { GoogleModule } from "./google/google.module";

@Module({
  imports: [IqairModule, GoogleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
