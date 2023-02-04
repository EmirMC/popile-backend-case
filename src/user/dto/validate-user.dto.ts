import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
