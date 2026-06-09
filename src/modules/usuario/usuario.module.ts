import { Module } from "@nestjs/common";
import { UsuarioService } from "src/services/usuario.service";

@Module({
    imports: [],
    providers: [
        UsuarioService,
    ],
    exports: [
        UsuarioService,
    ]
})
export class UsuarioModule {}
