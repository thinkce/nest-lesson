import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }
    signin() {
        return "Welcome to signin page";
    }
    signup() {
        return "Welcome to Sign up page";
    }
}
