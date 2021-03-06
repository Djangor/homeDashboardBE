import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IqairModule } from './iqair/iqair.module';
import { GoogleModule } from "./google/google.module";
import { BringModule} from "./bring/bring.module";
import { WeatherModule } from "./weather/weather.module";
import { CryptoModule} from "./crypto/crypto.module";

@Module({
  imports: [IqairModule, GoogleModule, BringModule, WeatherModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
