import { ClienteCreateDTO } from "src/dto/cliente/cliente-create.dto";
import { ClienteUpdateDTO } from "src/dto/cliente/cliente-update.dto";
import { Cliente } from "src/entities/cliente";

export class ClienteMapper {
    static createToEntity(dto: ClienteCreateDTO): Cliente {
        const usuario: Cliente = new Cliente();

        usuario.nome = dto.nome;
        usuario.sobrenome = dto.sobrenome;
        usuario.cpf = dto.cpf;

        return usuario;
    }

    static updateToEntity(dto: ClienteUpdateDTO, dados: Cliente): Cliente {
        const usuario: Cliente = new Cliente();

        usuario.nome = dto.nome || dados.nome;
        usuario.sobrenome = dto.sobrenome || dados.sobrenome;
        usuario.cpf = dto.cpf || dados.cpf;

        return usuario;
    }
}
