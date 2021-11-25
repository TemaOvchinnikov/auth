import { ReqBody } from './decorators/reqbody.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { ReqUser } from './decorators/requser.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@ReqUser() reqUser) {
    return this.authService.login(reqUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@ReqUser() reqUser) {
    return this.authService.logout();
  }

  /*
  @UseGuards(LocalAuthGuard)
  @Post('/register')
  async register(
    @ReqBody(new ValidationPipe({ validateCustomDecorators: true }))
    createRegisterDto: CreateRegisterDto,
  ) {
    return this.authService.register(createRegisterDto);
  }
  */

  @Post('/register')
  async register(@Body() createRegisterDto: CreateRegisterDto) {
    return this.authService.register(createRegisterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@ReqUser() reqUser) {
    return reqUser;
  }
}
