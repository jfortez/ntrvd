import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TRPCError } from '@trpc/server';
import { compareSync } from 'bcrypt';
import { Response } from 'express';
import { LoginUser } from '../user/user.schema';

export type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }

    const isValidPassword = compareSync(password, user.password);
    if (!isValidPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Contraseña incorrecta',
      });
    }

    return user;
  }

  async login(loginData: LoginUser) {
    const user = await this.validateUser(loginData.email, loginData.password);
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return token;
  }

  logout(res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Expira inmediatamente
    });

    return { message: 'Sesión cerrada correctamente' };
  }
}
