import { Injectable } from "@nestjs/common";
import { Usuario } from "src/entities/usuario";
import { UsuarioService } from "src/services/usuario.service";
import { DataSource } from "typeorm";
import { Page } from "src/interfaces/page";
import { UsuarioFindAllDTO } from "src/dto/usuario/usuario-find-all.dto";
import { UsuarioCreateDTO } from "src/dto/usuario/usuario-create.dto";
import { UsuarioMapper } from "src/mappers/usuario.mapper";
import { UsuarioUpdateDTO } from "src/dto/usuario/usuario-update.dto";

@Injectable()
export class UsuarioApplication {
    constructor(
        private dataSource: DataSource,
        private readonly usuarioService: UsuarioService,
    ) { }

    public async findAll({page = 1, limit = 10}: UsuarioFindAllDTO): Promise<Page<Usuario>> {
        return await this.dataSource.manager.transaction(async (t) => {
            const result = await this.usuarioService.findAll(Number(page), Number(limit), t);
            result.data.forEach(usuario => delete (usuario as any).senha);
            return result;
        });
    }

    public async save(dto: UsuarioCreateDTO): Promise<Usuario> {
        return await this.dataSource.manager.transaction(async (t) => {
            const entity: Usuario = UsuarioMapper.createToEntity(dto);

            // Verificando se o endereço de e-mail informado já está cadastrado
            const hasEmail: boolean = await this.usuarioService.hasEmail(entity.email);

            if (hasEmail) {
                throw new Error('Endereço de e-mail não disponível para uso');
            }
            
            const savedUsuario = await this.usuarioService.save(entity, t);
            delete (savedUsuario as any).senha;
            return savedUsuario;
        });
    }

    public async show(id: number): Promise<Usuario> {
        return await this.dataSource.manager.transaction(async (t) => {
            const usuario = await this.usuarioService.show(id, t);
            delete (usuario as any).senha;
            return usuario;
        });
    }

    public async update(dto: UsuarioUpdateDTO): Promise<Usuario> {
        return await this.dataSource.manager.transaction(async (t) => {
            // Buscar pelos dados atuais do usãrio
            const dados: Usuario = await this.usuarioService.show(dto.id);

            const entity: Usuario = UsuarioMapper.updateToEntity(dto, dados);
            entity.id = dados.id;
            entity.senha = dados.senha;

            // Checando se já existe usuário com o endereço de e-mail informado
            const hasEmail: boolean = await this.usuarioService.hasEmail(entity.email);

            if (hasEmail && entity.email !== dados.email) {
                throw new Error('Endereço de e-mail não disponível para uso');
            }

            const updatedUsuario = await this.usuarioService.update(entity, t);
            delete (updatedUsuario as any).senha;
            return updatedUsuario;
        });
    }

    public async delete(id: number): Promise<void> {
        await this.dataSource.manager.transaction(async (t) => {
            await this.usuarioService.show(id, t);

            await this.usuarioService.delete(id, t);
        });
    }
}
