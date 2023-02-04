import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ValidateUserDto } from 'src/user/dto/validate-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: ValidateUserDto) {
    return this.authService.validateUser(body);
  }

  @Post('register')
  public async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
