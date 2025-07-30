import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthRouter } from './auth.router';
import { UserModule } from '@/user/user.module';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TOKEN_EXPIRATION } from '@/globals';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ConfigModule, // Importa ConfigModule si no es global
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], // Necesario si ConfigModule no es global
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: TOKEN_EXPIRATION },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AuthService, AuthRouter],
})
export class AuthModule {}
