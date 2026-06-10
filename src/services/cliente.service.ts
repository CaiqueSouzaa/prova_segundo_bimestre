import { Injectable } from "@nestjs/common";
import { Cliente } from "src/entities/cliente";
import { Page } from "src/interfaces/page";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class ClienteService {
    private repository: Repository<Cliente>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository<Cliente>(Cliente);
    }

    private getRepository(transaction?: EntityManager) {
        if (transaction) {
            return transaction.getRepository<Cliente>(Cliente);
        }

        return this.repository;
    }

    /**
     * Retorna a lista de usuários de forma paginada.
     * @param page Página atual (padrão: 1)
     * @param limit Quantidade de registros por página (padrão: 10)
     * @returns Objeto Page contendo os dados, total de registros e informações de paginação.
     */
    public async findAll(page: number = 1, limit: number = 10, transaction?: EntityManager): Promise<Page<Cliente>> {
        const repository = this.getRepository(transaction);

        // findAndCount retorna [dados, totalDeRegistros]
        const [data, total] = await repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;

        return {
            data,
            total,
            page,
            limit,
            hasNextPage
        };
    }

    public async hasCpf(cpf: string, transaction?: EntityManager): Promise<boolean> {
        const repository = this.getRepository(transaction);

        const cliente: Cliente | null = await repository.findOne({
            where: {
                cpf: cpf,
            },
        });

        if (!cliente) {
            return false;
        }

        return true;
    }

    public async findBycpf(cpf: string, transaction?: EntityManager): Promise<Cliente> {
        const repository = this.getRepository(transaction);

        const cliente: Cliente | null = await repository.findOne({
            where: {
                cpf: cpf,
            },
        });

        if (!cliente) {
            throw new Error('CPF não localizado');
        }

        return cliente;
    }

    public async save(cliente: Cliente, transaction?: EntityManager): Promise<Cliente> {
        // Nome não deve ser vázio
        if (!cliente.nome || cliente.nome.length === 0) {
            throw new Error('Nome de cliente não deve ser vázio');
        }

        // Sobrenome não deve ser vázio
        if (!cliente.sobrenome || cliente.sobrenome.length === 0) {
            throw new Error('Sobrenome de cliente não deve ser vázio');
        }

        // CPF não deve ser vázio
        if (!cliente.cpf || cliente.cpf.length === 0) {
            throw new Error('CPF de cliente não deve ser vázio');
        }

        const repository = this.getRepository(transaction);
        return repository.save(cliente);
    }

    public async show(id: number, transaction?: EntityManager): Promise<Cliente> {
        const repository = this.getRepository(transaction);
        const cliente: Cliente | null = await repository.findOne({
            where: {
                id: id,
            },
        });

        if (!cliente) {
            throw new Error('ID de cliente não localizado');
        }

        return cliente;
    }

    public async update(dados: Cliente, transaction?: EntityManager): Promise<Cliente> {
        const repository = this.getRepository(transaction);
        if (!dados) {
            throw new Error('ID de cliente é obrigatório');
        }

        // Nome não deve ser vázio
        if (!dados.nome || dados.nome.length === 0) {
            throw new Error('Nome de cliente não deve ser vázio');
        }

        // Sobrenome não deve ser vázio
        if (!dados.sobrenome || dados.sobrenome.length === 0) {
            throw new Error('Sobrenome de cliente não deve ser vázio');
        }

        // CPF não deve ser vázio
        if (!dados.cpf || dados.cpf.length === 0) {
            throw new Error('CPF de cliente não deve ser vázio');
        }

        return repository.save(dados);
    }

    public async delete(id: number, transaction?: EntityManager): Promise<void> {
        const repository = this.getRepository(transaction);
        if (!id) {
            throw new Error('ID de cliente é obrigatório');
        }

        await repository.delete(id);
    }
}
