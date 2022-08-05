import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {
  }

  async editUser(userId: any, dto: EditUserDto) {
    const uid = userId.id;
    const user = await this.prisma.user.update({

      where: {
        id: uid,
      },
      data: {
        ...dto,
      },
    });
    delete user.password;
    return user;
  }
}
