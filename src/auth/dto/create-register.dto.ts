import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
