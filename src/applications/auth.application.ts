import { Injectable } from "@nestjs/common";
import { UsuarioService } from "../services/usuario.service";
import { Usuario } from "src/entities/usuario";
import * as bcrypt from 'bcrypt';
import { AuthSignInDTO } from "src/dto/auth/auth-signin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthApplication {
    constructor(
        private jwtService: JwtService,
        private readonly usuarioService: UsuarioService,
    ) { }

    public async signIn(dto: AuthSignInDTO) {
        let user: Usuario | null = null;

        try {
            user = await this.usuarioService.findByEmail(dto.email);
        } catch (err: any) {
            throw new Error('Endereço de e-mail ou senha incorretos');
        }

        const isValid: boolean = await bcrypt.compare(dto.senha, user.senha);

        if (!isValid) {
            throw new Error('Endereço de e-mail ou senha incorretos');
        }

        const payload = {
            id: user.id,
            nome: user.nome,
            sobrenome: user.sobrenome,
        };

        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
