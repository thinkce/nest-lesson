import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {

    }
    async signin(dto: AuthDto) {
        const user: any = await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          }
        });
        if(!user){
          throw new ForbiddenException("Invalid email");
        }
        const checkPassword = await argon.verify(user.password, dto.password);
        if(!checkPassword){
          throw new ForbiddenException("Password incorrect");
        }

        return this.signToken(user.id, user.email);;
    }
    async signup(dto: AuthDto) {
        const password = await argon.hash(dto.password);
        try{
          const user: any = await this.prisma.user.create({
            data: {
              email: dto.email,
              password,
            }
          });

          return this.signToken(user.id, user.email);
        }catch (e) {
          if(e instanceof PrismaClientKnownRequestError){
            if(e.code == 'P2002'){
              throw new ForbiddenException('Credential taken',);
            }
          }
          throw e;
        }
    }
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
          sub: userId,
          email,
        };
        const token = await this.jwt.signAsync(payload, {
          expiresIn: "15m",
          secret: this.config.get("JWT_SECRET_KEY")
        });
        return {
          access_token: token,
        };
    }
}
