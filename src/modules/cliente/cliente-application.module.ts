import { Module } from "@nestjs/common";
import { ClienteModule } from "./cliente.module";
import { ClienteApplication } from "src/applications/cliente.application";
import { ClienteController } from "src/controllers/cliente/cliente.controller";

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
export class ClienteApplicationModule {}
