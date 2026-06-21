import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeeds } from './seeds/seed';
import { UsuarioApplicationModule } from './modules/usuario/usuario-application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthApplicationModule } from './modules/auth/auth-application.module';
import { ClienteApplicationModule } from './modules/cliente/cliente-application.module';
import { ItemApplicationModule } from './modules/item/item-application.module';
import { VendaApplicationModule } from './modules/venda/venda-application.module';

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
    ItemApplicationModule,
    VendaApplicationModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await runSeeds(this.dataSource);
  }
}
