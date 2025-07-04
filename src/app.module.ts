import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // ✅ Import AuthModule

@Module({
  imports: [AuthModule], // ✅ Register it here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
