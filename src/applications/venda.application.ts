import { Injectable } from "@nestjs/common";
import { FindAllDTO } from "src/dto/find-all.dto";
import { VendaCreateDTO } from "src/dto/venda/venda-create.dto";
import { VendaUpdateDTO } from "src/dto/venda/venda-update.dto";
import { Cliente } from "src/entities/cliente";
import { Item } from "src/entities/item";
import { ItemVenda } from "src/entities/item-venda";
import { Usuario } from "src/entities/usuario";
import { Venda } from "src/entities/venda";
import { CupomFiscal } from "src/interfaces/cupom-fiscal";
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

                // Verificando se há estoque disponível para o item
                if (i.quantia > item.quantia) {
                    throw new Error(`Não há estoque o suficiente para o item [${item.codigo}]. Estoque disponível [${item.quantia}] - Solicitado [${i.quantia}]`);
                }

                // Salvando a entidade ItemVenda
                await this.itemVendaService.save(i, t);

                // Debitando o saldo do item
                item.quantia = item.quantia - i.quantia;
                await this.itemService.update(item);
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
                        subtotal: i.quantia * i.valor,
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

    public async show(id: number) {
        return await this.dataSource.manager.transaction(async (t) => {
            const venda = await this.vendaService.show(id, t);

            // Buscando por todos os itens da venda em questão
            const itensVenda: ItemVenda[] = await this.itemVendaService.findByVendaId(id, t);


            delete (venda.usuario as any).email;
            delete (venda.usuario as any).senha;

            if (venda.cliente) {
                delete (venda.cliente as any).cpf;
            }

            const itensCupom = itensVenda.map(i => {
                return {
                    produto: i.item.nome,
                    quantia: i.quantia,
                    valor_unitario: i.valor,
                    subtotal: i.quantia * i.valor,
                };
            });

            const cupomFiscal: CupomFiscal = {
                id: venda.id,
                itens: itensCupom,
                total: itensCupom.map(i => i.subtotal).reduce((a, b) => a + b),
                vendedor: {
                    nome: venda.usuario.nome,
                    sobrenome: venda.usuario.sobrenome,
                }
            };

            // Se a venda tiver cliente, adicionar o cliente no cupom fiscal
            if (venda.cliente) {
                cupomFiscal.cliente = {
                    nome: venda.cliente.nome,
                    sobrenome: venda.cliente.sobrenome,
                }
            }

            return cupomFiscal;
        });
    }

    public async update(dto: VendaUpdateDTO) {
        return await this.dataSource.manager.transaction(async (t) => {
            // Verificando se o ID de venda existe
            const venda: Venda = await this.vendaService.show(dto.id, t);
            const toUpdate: Venda = VendaMapper.updateToEntity(dto, venda);

            // Se a DTO possuir ID de cliente, verificar se o cliente existe
            if (toUpdate.cliente.id) {
                await this.clienteService.show(toUpdate.cliente.id, t);
            }

            console.log(toUpdate);

            return await this.vendaService.update(toUpdate, t);
        });
    }

    public async delete(id: number): Promise<void> {
        await this.dataSource.manager.transaction(async (t) => {
            await this.vendaService.show(id, t);

            await this.vendaService.delete(id, t);
        });
    }
}
