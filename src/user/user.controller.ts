import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../Auth/guard';
import { GetUser } from '../Auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Get('me')
  getMe(@GetUser() user: User){
    return user;
  }

  @Patch('update')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto){
    return this.userService.editUser(userId, dto);
  }
}
