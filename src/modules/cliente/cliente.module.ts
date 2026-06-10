import { Module } from "@nestjs/common";
import { ClienteService } from "src/services/cliente.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        ClienteService,
    ],
    exports: [
        ClienteService,
    ],
})
export class ClienteModule {}
