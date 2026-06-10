import { Injectable } from "@nestjs/common";
import { ClienteCreateDTO } from "src/dto/cliente/cliente-create.dto";
import { ClienteUpdateDTO } from "src/dto/cliente/cliente-update.dto";
import { FindAllDTO } from "src/dto/find-all.dto";
import { Cliente } from "src/entities/cliente";
import { Page } from "src/interfaces/page";
import { ClienteMapper } from "src/mappers/cliente.mapper";
import { ClienteService } from "src/services/cliente.service";
import { DataSource } from "typeorm";

@Injectable()
export class ClienteApplication {
    constructor(
        private readonly dataSource: DataSource,
        private readonly clienteService: ClienteService,
    ) { }

    public async findAll({ page = 1, limit = 10 }: FindAllDTO): Promise<Page<Cliente>> {
        return await this.dataSource.manager.transaction(async (t) => {
            const result = await this.clienteService.findAll(Number(page), Number(limit), t);
            return result;
        });
    }

    public async save(dto: ClienteCreateDTO): Promise<Cliente> {
        return await this.dataSource.manager.transaction(async (t) => {
            const entity: Cliente = ClienteMapper.createToEntity(dto);

            // Verificando se o endereço de e-mail informado já está cadastrado
            const hasCpf: boolean = await this.clienteService.hasCpf(entity.cpf, t);

            if (hasCpf) {
                throw new Error('CPF não disponível para uso');
            }

            const savedCliente = await this.clienteService.save(entity, t);
            return savedCliente;
        });
    }

    public async show(id: number): Promise<Cliente> {
        return await this.dataSource.manager.transaction(async (t) => {
            const cliente = await this.clienteService.show(id, t);
            delete (cliente as any).senha;
            return cliente;
        });
    }

    public async update(dto: ClienteUpdateDTO): Promise<Cliente> {
        return await this.dataSource.manager.transaction(async (t) => {
            const dados: Cliente = await this.clienteService.show(dto.id, t);

            const entity: Cliente = ClienteMapper.updateToEntity(dto, dados);
            entity.id = dados.id;

            // Checando se já existe usuário com o endereço de e-mail informado
            const hasCPF: boolean = await this.clienteService.hasCpf(entity.cpf, t);

            if (hasCPF && entity.cpf !== dados.cpf) {
                throw new Error('CPF não disponível para uso');
            }

            const updatedUsuario = await this.clienteService.update(entity, t);
            return updatedUsuario;
        });
    }

    public async delete(id: number): Promise<void> {
        await this.dataSource.manager.transaction(async (t) => {
            await this.clienteService.show(id, t);

            await this.clienteService.delete(id, t);
        });
    }
}
