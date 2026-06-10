import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsuarioModule } from "./usuario.module";
import { UsuarioApplication } from "src/applications/usuario.application";
import { UsuarioController } from "src/controllers/usuario/usuario.controller";
import { ObterIdUsuarioLogadoMiddleware } from "src/middlewares/obter-id-usuario-logado.middleware";

@Module({
    imports: [
        UsuarioModule,
    ],
    controllers: [
        UsuarioController,
    ],
    providers: [
        UsuarioApplication,
    ],
    exports: [],
})
export class UsuarioApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ObterIdUsuarioLogadoMiddleware)
            .forRoutes('usuarios');
    }
}
