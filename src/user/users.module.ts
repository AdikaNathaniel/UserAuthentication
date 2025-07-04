import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
