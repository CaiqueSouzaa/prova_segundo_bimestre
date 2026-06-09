import { Module } from "@nestjs/common";
import { UsuarioModule } from "./usuario.module";
import { UsuarioApplication } from "src/applications/usuario.application";
import { UsuarioController } from "src/controllers/usuario.controller";

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
export class UsuarioApplicationModule {}
