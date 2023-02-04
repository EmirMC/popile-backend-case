import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ValidateUserDto } from 'src/user/dto/validate-user.dto';
import { UserDetail } from 'src/user/user-detail.interface';
import { UserService } from 'src/user/user.service';
import { TokenDto } from './token.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(body: ValidateUserDto): Promise<TokenDto> {
    const user = await this.userService.fineByEmail(body.email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch)
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    return await this.createToken(this.userService._getUserDetail(user));
  }

  public async register(body: CreateUserDto): Promise<TokenDto> {
    body.password = await bcrypt.hash(body.password, 12);
    const candidate = await this.userService.fineByEmail(body.email);
    if (candidate)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const user = await this.userService.create(body);
    return await this.createToken(this.userService._getUserDetail(user));
  }

  public async createToken(user: UserDetail): Promise<TokenDto> {
    const token = await this.jwtService.signAsync(user);
    return { token: token };
  }
}
