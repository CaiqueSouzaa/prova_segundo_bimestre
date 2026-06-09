import { UsuarioCreateDTO } from "src/dto/usuario/usuario-create.dto";
import { UsuarioUpdateDTO } from "src/dto/usuario/usuario-update.dto";
import { Usuario } from "src/entities/usuario";

export class UsuarioMapper {
    static createToEntity(dto: UsuarioCreateDTO): Usuario {
        const usuario: Usuario = new Usuario();

        usuario.nome = dto.nome;
        usuario.sobrenome = dto.sobrenome;
        usuario.email = dto.email;
        usuario.senha = dto.senha;

        return usuario;
    }

    static updateToEntity(dto: UsuarioUpdateDTO, dados: Usuario): Usuario {
        const usuario: Usuario = new Usuario();

        usuario.nome = dto.nome || dados.nome;
        usuario.sobrenome = dto.sobrenome || dados.sobrenome;
        usuario.email = dto.email || dados.email;

        return usuario;
    }
}
