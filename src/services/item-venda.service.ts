import { Injectable } from "@nestjs/common";
import { ItemVenda } from "src/entities/item-venda";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class ItemVendaService {
    private repository: Repository<ItemVenda>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository<ItemVenda>(ItemVenda);
    }

    private getRepository(transaction?: EntityManager) {
        if (transaction) {
            return transaction.getRepository<ItemVenda>(ItemVenda);
        }

        return this.repository;
    }

    public async findByVendaId(id: number, transaction?: EntityManager): Promise<ItemVenda[]> {
        const repository = this.getRepository(transaction);

        return repository.find({
            where: {
                venda: {
                    id: id,
                },
            },
            relations: {
                venda: true,
                item: true
            },
            select: {
                venda: {
                    id: true,
                },
                item: {
                    codigo: true,
                    nome: true
                }
            }
        });
    }

    public async findAll(transaction?: EntityManager): Promise<ItemVenda[]> {
        const repository = this.getRepository(transaction);

        return repository.find();
    }

    public async save(itemVenda: ItemVenda, transaction?: EntityManager): Promise<ItemVenda> {
        if (!itemVenda.venda || !itemVenda.venda.id) {
            throw new Error('ID de venda não deve ser vázio');
        }

        if (!itemVenda.item || !itemVenda.item.codigo) {
            throw new Error('ID de item não deve ser vázio');
        }

        // A quantia não deve ser negatica ou 0
        if (itemVenda.quantia <= 0) {
            throw new Error('A quantia de itens deve ser superior a 0');
        }

        // O valor não deve ser negatica ou 0
        if (itemVenda.valor <= 0) {
            throw new Error('O valor dos itens deve ser superior a 0');
        }

        const repository = this.getRepository(transaction);
        return repository.save(itemVenda);
    }

    public async show(id: number, transaction?: EntityManager): Promise<ItemVenda> {
        const repository = this.getRepository(transaction);
        const itemVenda: ItemVenda | null = await repository.findOne({
            where: {
                id: id,
            },
        });

        if (!itemVenda) {
            throw new Error('ID de registro não localizado');
        }

        return itemVenda;
    }

    public async delete(id: number, transaction?: EntityManager): Promise<void> {
        const repository = this.getRepository(transaction);
        if (!id) {
            throw new Error('ID de registro é obrigatório');
        }

        await repository.delete(id);
    }
}
