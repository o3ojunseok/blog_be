import { Body, Controller, Post, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './requestDto/create-user.dto';
import { UpdateUserDto } from './requestDto/update-user.dto';
import { LoginUserDto } from './requestDto/login-user.dto';
import { User } from './user.entity';
import { Public } from '../auth/public.decorator';
import { Content } from 'src/content/content.entity';
import { ResponseTimeInterceptor } from 'src/response-time.interceptor';
import { UserResponseDto } from './responseDto/create-user.response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    ) {}

  @Get('list')
  async findAllUser(): Promise<User[]> {
    return await this.userService.findAllUser();
  }

  @Get('list/:id')
  async findOneUser(@Param('id') id: number): Promise<User> {
    return await this.userService.findOneUser(id);
  }

  @Get('content/:id')
  async findOneUserWithContent(@Param('id') id: number): Promise<Content[]> {
    return await this.userService.findOneUserWithContent(id);
  }

  @Post('name/check')
  async findOneUserNameCheck(@Body() user_name: string): Promise<UserResponseDto> {
    return await this.userService.findOneUserName(user_name);
  }

  @Post('signup')
  @UseInterceptors(ResponseTimeInterceptor)
  @Public()
  async userSignUp(@Body() createData: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.signUpUser(createData);
  }

  @Post('validate')
  async validatePassword(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.userService.validateUser(loginUserDto);
  }

  @Post('update/:id')
  async userUpdate(@Param('id') id: number, @Body() updateData: UpdateUserDto): Promise<UserResponseDto> {
    return await this.userService.updateUser(id, updateData);
  }

  @Post('update/pw/:id')
  async updatePassword(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.userService.updatePassword(id, updateUserDto);
  }

  @Post('delete/:id')
  async deleteUser(@Param('id') id: number): Promise<string> {
    return await this.userService.deleteUser(id);
  }
}
