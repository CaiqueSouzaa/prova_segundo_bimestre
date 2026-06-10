import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { VendaApplication } from "src/applications/venda.application";
import { VendaModule } from "./venda.module";
import { VendaController } from "src/controllers/venda/venda.controller";
import { UsuarioModule } from "../usuario/usuario.module";
import { ClienteModule } from "../cliente/cliente.module";
import { ItemVendaModule } from "../item-venda/item-venda.module";
import { ItemModule } from "../item/item.module";
import { ObterIdUsuarioLogadoMiddleware } from "src/middlewares/obter-id-usuario-logado.middleware";

@Module({
    imports: [
        UsuarioModule,
        ClienteModule,
        ItemModule,
        VendaModule,
        ItemVendaModule,
    ],
    controllers: [
        VendaController,
    ],
    providers: [
        VendaApplication,
    ],
    exports: [],
})
export class VendaApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ObterIdUsuarioLogadoMiddleware)
            .forRoutes('vendas');
    }
}
