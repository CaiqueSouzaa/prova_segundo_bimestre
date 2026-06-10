import { Injectable } from "@nestjs/common";
import { Item } from "src/entities/item";
import { Page } from "src/interfaces/page";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class ItemService {
    private repository: Repository<Item>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository<Item>(Item);
    }

    private getRepository(transaction?: EntityManager) {
        if (transaction) {
            return transaction.getRepository<Item>(Item);
        }

        return this.repository;
    }
    
        /**
         * Retorna a lista de itens de forma paginada.
         * @param page Página atual (padrão: 1)
         * @param limit Quantidade de registros por página (padrão: 10)
         * @returns Objeto Page contendo os dados, total de registros e informações de paginação.
         */
        public async findAll(page: number = 1, limit: number = 10, transaction?: EntityManager): Promise<Page<Item>> {
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
    
        public async hasCodigo(codigo: string, transaction?: EntityManager): Promise<boolean> {
            const repository = this.getRepository(transaction);
    
            const item: Item | null = await repository.findOne({
                where: {
                    codigo: codigo,
                },
            });
    
            if (!item) {
                return false;
            }
    
            return true;
        }
    
        public async findByCodigo(codigo: string, transaction?: EntityManager): Promise<Item> {
            const repository = this.getRepository(transaction);
    
            const item: Item | null = await repository.findOne({
                where: {
                    codigo: codigo,
                },
            });
    
            if (!item) {
                throw new Error('Código não localizado');
            }
    
            return item;
        }
    
        public async save(item: Item, transaction?: EntityManager): Promise<Item> {
            // Nome não deve ser vázio
            if (!item.nome || item.nome.length === 0) {
                throw new Error('Nome de item não deve ser vázio');
            }
    
            const repository = this.getRepository(transaction);
            return repository.save(item);
        }
    
        public async show(codigo: string, transaction?: EntityManager): Promise<Item> {
            const repository = this.getRepository(transaction);
            const item: Item | null = await repository.findOne({
                where: {
                    codigo: codigo,
                },
            });
    
            if (!item) {
                throw new Error(`Código de item [${ codigo }] não localizado`);
            }
    
            return item;
        }
    
        public async update(dados: Item, transaction?: EntityManager): Promise<Item> {
            const repository = this.getRepository(transaction);
            if (!dados) {
                throw new Error('Código de item é obrigatório');
            }
    
            // Nome não deve ser vázio
            if (!dados.nome || dados.nome.length === 0) {
                throw new Error('Nome de item não deve ser vázio');
            }
    
            return repository.save(dados);
        }
    
        public async delete(codigo: string, transaction?: EntityManager): Promise<void> {
            const repository = this.getRepository(transaction);
            if (!codigo) {
                throw new Error('Código de item é obrigatório');
            }
    
            await repository.delete(codigo);
        }
}
