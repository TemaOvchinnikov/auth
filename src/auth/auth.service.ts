import { CreateLoginDto } from './dto/create-login.dto';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UsersService } from './../users/users.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(createLoginDto: CreateLoginDto): Promise<any> {
    return await this.usersService.findOne({
      email: createLoginDto.email,
    });
  }

  public async validateEmail(email: string, inputEmail: string) {
    if (email === inputEmail) {
      throw new ConflictException('Choose another email');
    }
  }

  public async validatePassport(password: string, hash: string) {
    if (!(await bcrypt.compare(password, hash))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }

  public async login(user): Promise<any> {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  public async register(createRegisterDto: CreateRegisterDto): Promise<any> {
    const user = await this.validateUser(createRegisterDto);

    if (user) {
      await this.validateEmail(user.email, createRegisterDto.email);
    }

    createRegisterDto.password = await bcrypt.hash(
      createRegisterDto.password,
      12,
    );

    const payload = await this.usersService.create(createRegisterDto);

    return {
      access_token: this.jwtService.sign({
        username: payload.username,
        sub: payload.id,
      }),
    };
  }

  public async logout(): Promise<any> {}
}
