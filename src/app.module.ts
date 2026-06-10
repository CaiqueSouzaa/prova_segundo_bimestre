import { Module } from '@nestjs/common';
import { UsuarioApplicationModule } from './modules/usuario/usuario-application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthApplicationModule } from './modules/auth/auth-application.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ClienteApplicationModule } from './modules/cliente/cliente-application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get<string>('DB_DATABASE'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          entities: [__dirname + '/**/entities/*{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          migrationsRun: true,
        };
      },
    }),
    UsuarioApplicationModule,
    AuthApplicationModule,
    ClienteApplicationModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
