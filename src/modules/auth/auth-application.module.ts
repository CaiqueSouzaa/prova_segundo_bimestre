import { Module } from "@nestjs/common";
import { UsuarioModule } from "../usuario/usuario.module";
import { AuthApplication } from "src/applications/auth.application";
import { AuthController } from "src/controllers/auth/auth.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
          global: true,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: '1d',
              },
            };
          },
        }),
        UsuarioModule,
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthApplication,
    ],
    exports: [],
})
export class AuthApplicationModule {}