import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas';
import { Model } from 'mongoose';

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signUp({ firstName, lastName, email, password }: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(password);

    try {
      // save the new user in the db
      const user = await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hash,
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      // if (error instanceof PrismaClientKnownRequestError) {
      //   if (error.code === 'P2002') {
      //     throw new ForbiddenException('Credentials taken');
      //   }
      // }

      throw error;
    }
  }

  // async signIn(dto: AuthDto) {
  //   // find the user by email
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  //
  //   // if user does not exist throw exception
  //   if (!user) {
  //     throw new ForbiddenException('Credentials incorrect');
  //   }
  //   // compare password
  //   const pwMatches = await argon.verify(user.hash, dto.password);
  //
  //   // if password incorrect throw an exception
  //   if (!pwMatches) {
  //     throw new ForbiddenException('Credentials incorrect');
  //   }
  //
  //   return this.signToken(user.id, user.email);
  // }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
