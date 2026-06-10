import { Injectable } from "@nestjs/common";
import { FindAllDTO } from "src/dto/find-all.dto";
import { VendaCreateDTO } from "src/dto/venda/venda-create.dto";
import { Cliente } from "src/entities/cliente";
import { Item } from "src/entities/item";
import { ItemVenda } from "src/entities/item-venda";
import { Usuario } from "src/entities/usuario";
import { Venda } from "src/entities/venda";
import { Page } from "src/interfaces/page";
import { ItemVendaMapper } from "src/mappers/item-venda.mapper";
import { VendaMapper } from "src/mappers/venda.mapper";
import { ClienteService } from "src/services/cliente.service";
import { ItemVendaService } from "src/services/item-venda.service";
import { ItemService } from "src/services/item.service";
import { UsuarioService } from "src/services/usuario.service";
import { VendaService } from "src/services/venda.service";
import { DataSource } from "typeorm";

@Injectable()
export class VendaApplication {
    constructor(
        private readonly dataSource: DataSource,
        private readonly vendaService: VendaService,
        private readonly usuarioService: UsuarioService,
        private readonly clienteService: ClienteService,
        private readonly itemService: ItemService,
        private readonly itemVendaService: ItemVendaService,
    ) { }

    public async findAll({ page = 1, limit = 10 }: FindAllDTO): Promise<Page<Venda>> {
        const results: Page<Venda> = await this.dataSource.manager.transaction(async (t) => {
            const result = await this.vendaService.findAll(Number(page), Number(limit), t);
            result.data.forEach(venda => {
                delete (venda.usuario as any).senha;
                delete (venda.usuario as any).email;

                if (venda.cliente) {
                    delete (venda.cliente as any).cpf;
                }
            });
            return result;
        });

        return results;
    }

    public async save(dto: VendaCreateDTO) {
        return await this.dataSource.manager.transaction(async (t) => {
            const entity: Venda = VendaMapper.createToEntity(dto);

            // Checando se o usuário existe
            const user: Usuario = await this.usuarioService.show(dto.usuario_id, t);
            entity.usuario = user;

            // Se o DTO tiver cliente, verificar se o ID de cliente existe
            if (dto.cliente_id) {
                const client: Cliente = await this.clienteService.show(dto.cliente_id, t);
                entity.cliente = client;
            }

            // Registrando a entidade Venda
            const savedVenda = await this.vendaService.save(entity, t);

            // Checando se o código dos itens existem
            const itens: ItemVenda[] = dto.itens.map(ItemVendaMapper.createToEntity);

            for (const i of itens) {
                const item: Item = await this.itemService.show(i.item.codigo, t);

                if (!i.valor) {
                    i.valor = item.valor;
                }

                i.item = item;

                // Atribuindo o ID da venda na entidade ItemVenda
                i.venda = savedVenda;

                // Salvando a entidade ItemVenda
                await this.itemVendaService.save(i, t);
            }

            delete (savedVenda.usuario as any).senha;
            delete (savedVenda.usuario as any).email;

            if (savedVenda.cliente) {
                delete (savedVenda.cliente as any).cpf;
            }

            return {
                id: savedVenda.id,
                itens: itens.map((i) => {
                    return {
                        produto: i.item.nome,
                        quantia: i.quantia,
                        valor_unitario: i.valor,
                        valor_total_item: i.quantia * i.valor,
                    };
                }),
                total: itens.map((i: ItemVenda) => i.quantia * i.valor).reduce((a, b) => a + b),
                vendedor: {
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                }
            };
        });
    }

    public async show(id: number): Promise<Venda> {
        return await this.dataSource.manager.transaction(async (t) => {
            const item = await this.vendaService.show(id, t);

            delete (item.usuario as any).email;
            delete (item.usuario as any).senha;

            if (item.cliente) {
                delete (item.cliente as any).cpf;
            }

            return item;
        });
    }

    public async delete(id: number): Promise<void> {
        await this.dataSource.manager.transaction(async (t) => {
            await this.vendaService.show(id, t);

            await this.vendaService.delete(id, t);
        });
    }
}
