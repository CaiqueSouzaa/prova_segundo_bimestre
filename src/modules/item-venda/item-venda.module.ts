import { Module } from "@nestjs/common";
import { ItemVendaService } from "src/services/item-venda.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        ItemVendaService,
    ],
    exports: [
        ItemVendaService,
    ],
})
export class ItemVendaModule {}
