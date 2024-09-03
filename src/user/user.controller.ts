import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ReplyFormat } from 'src/utils/requestBuilder';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * to test middleware
   * @returns
   */
  @Get()
  async getHello(): Promise<ReplyFormat> {
    return this.userService.findUsers();
  }

  /**
   * user login
   * @param body
   * @returns
   */
  @Post('/login')
  async login(@Body() body: LoginUserDto): Promise<ReplyFormat> {
    return this.userService.loginUser(body);
  }

  /**
   * user register
   * @param body
   * @returns
   */
  @Post('/register')
  async register(@Body() body: RegisterUserDto): Promise<ReplyFormat> {
    return this.userService.signup(body);
  }

  /**
   *
   * @param body user logout
   * @returns
   */
  @Post('/logout')
  async logOut(@Body() body: LogoutUserDto): Promise<ReplyFormat> {
    return this.userService.logout(body);
  }
}
