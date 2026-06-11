import { Injectable } from "@nestjs/common";
import { Venda } from "src/entities/venda";
import { Page } from "src/interfaces/page";
import { EntityManager, Repository, DataSource } from "typeorm";

@Injectable()
export class VendaService {
    private repository: Repository<Venda>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository<Venda>(Venda);
    }

    private getRepository(transaction?: EntityManager) {
        if (transaction) {
            return transaction.getRepository<Venda>(Venda);
        }

        return this.repository;
    }

    public async findAll(page: number = 1, limit: number = 10, transaction?: EntityManager): Promise<Page<Venda>> {
        const repository = this.getRepository(transaction);

        // findAndCount retorna [dados, totalDeRegistros]
        const [data, total] = await repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: {
                usuario: true,
                cliente: true,
            },
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

    public async save(venda: Venda, transaction?: EntityManager): Promise<Venda> {
        if (!venda.usuario || !venda.usuario.id) {
            throw new Error('ID de usuario não deve ser vázio');
        }

        const repository = this.getRepository(transaction);
        return repository.save(venda);
    }

    public async show(id: number, transaction?: EntityManager): Promise<Venda> {
        const repository = this.getRepository(transaction);
        const venda: Venda | null = await repository.findOne({
            where: {
                id: id,
            },
            relations: {
                usuario: true,
                cliente: true,
            },
        });

        if (!venda) {
            throw new Error('ID de venda não localizado');
        }

        return venda;
    }

    public async update(dados: Venda, transaction?: EntityManager): Promise<Venda> {
        if (!dados.id) {
            throw new Error('ID de venda é obrigatório');
        }

        const repository = this.getRepository(transaction);

        // Atualiza somente o campo cliente_id da venda
        await repository.createQueryBuilder()
            .update(Venda)
            .set({ cliente: dados.cliente ?? null })
            .where('id = :id', { id: dados.id })
            .execute();

        return this.show(dados.id, transaction);
    }

    public async delete(id: number, transaction?: EntityManager): Promise<void> {
        const repository = this.getRepository(transaction);
        if (!id) {
            throw new Error('ID de venda é obrigatório');
        }

        await repository.delete(id);
    }
}
