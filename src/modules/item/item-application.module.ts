import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ItemApplication } from "src/applications/item.application";
import { ItemModule } from "./item.module";
import { ItemController } from "src/controllers/item/item.controller";
import { ObterIdUsuarioLogadoMiddleware } from "src/middlewares/obter-id-usuario-logado.middleware";

@Module({
    imports: [
        ItemModule,
    ],
    controllers: [
        ItemController,
    ],
    providers: [
        ItemApplication,
    ],
    exports: [],
})
export class ItemApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ObterIdUsuarioLogadoMiddleware)
            .forRoutes('itens');
    }
}