import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // JwtStrategy
  ],
})
export class AuthModule {}
