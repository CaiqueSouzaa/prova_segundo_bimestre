import { Module } from "@nestjs/common";
import { VendaService } from "src/services/venda.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        VendaService,
    ],
    exports: [
        VendaService,
    ],
})
export class VendaModule {}
