import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TRPCError } from '@trpc/server';
import { compareSync } from 'bcrypt';
import { Response } from 'express';
import { LoginUser } from '../user/user.schema';

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

  async login(loginData: LoginUser, res: Response) {
    const user = await this.validateUser(loginData.email, loginData.password);
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Configuración segura de la cookie
    res.cookie('token', token, {
      httpOnly: true, // Previene acceso desde JavaScript del cliente
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // Protección contra CSRF
      path: '/', // Cookie disponible en toda la aplicación
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    });

    return {
      user,
      message: 'Inicio de sesión exitoso',
    };
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
