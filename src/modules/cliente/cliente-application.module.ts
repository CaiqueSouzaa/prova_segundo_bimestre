import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClienteModule } from "./cliente.module";
import { ClienteApplication } from "src/applications/cliente.application";
import { ClienteController } from "src/controllers/cliente/cliente.controller";
import { ObterIdUsuarioLogadoMiddleware } from "src/middlewares/obter-id-usuario-logado.middleware";

@Module({
    imports: [
        ClienteModule,
    ],
    controllers: [
        ClienteController,
    ],
    providers: [
        ClienteApplication,
    ],
    exports: [],
})
export class ClienteApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ObterIdUsuarioLogadoMiddleware)
            .forRoutes('clientes');
    }
}