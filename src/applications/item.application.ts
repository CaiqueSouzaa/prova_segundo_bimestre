import { Injectable } from "@nestjs/common";
import { ItemCreateDTO } from "src/dto/item/item-create.dto";
import { FindAllDTO } from "src/dto/find-all.dto";
import { Item } from "src/entities/item";
import { Page } from "src/interfaces/page";
import { ItemMapper } from "src/mappers/item.mapper";
import { ItemService } from "src/services/item.service";
import { DataSource } from "typeorm";
import { ItemUpdateDTO } from "src/dto/item/item-update.dto";

@Injectable()
export class ItemApplication {
    constructor(
        private readonly dataSource: DataSource,
        private readonly itemService: ItemService,
    ) { }

    public async findAll({ page = 1, limit = 10 }: FindAllDTO): Promise<Page<Item>> {
        return await this.dataSource.manager.transaction(async (t) => {
            const result = await this.itemService.findAll(Number(page), Number(limit), t);
            result.data.forEach(usuario => delete (usuario as any).senha);
            return result;
        });
    }

    public async save(dto: ItemCreateDTO): Promise<Item> {
        return await this.dataSource.manager.transaction(async (t) => {
            const entity: Item = ItemMapper.createToEntity(dto);

            const hasCodigo: boolean = await this.itemService.hasCodigo(entity.codigo, t);

            if (hasCodigo) {
                throw new Error('Código não disponível para uso');
            }

            const savedCliente = await this.itemService.save(entity, t);
            return savedCliente;
        });
    }

    public async show(codigo: string): Promise<Item> {
        return await this.dataSource.manager.transaction(async (t) => {
            const cliente = await this.itemService.show(codigo, t);
            delete (cliente as any).senha;
            return cliente;
        });
    }

    public async update(dto: ItemUpdateDTO): Promise<Item> {
        return await this.dataSource.manager.transaction(async (t) => {
            const dados: Item = await this.itemService.show(dto.codigo, t);

            const entity: Item = ItemMapper.updateToEntity(dto, dados);
            entity.codigo = dados.codigo;

            const updatedUsuario = await this.itemService.update(entity, t);
            return updatedUsuario;
        });
    }

    public async delete(codigo: string): Promise<void> {
        await this.dataSource.manager.transaction(async (t) => {
            await this.itemService.show(codigo, t);

            await this.itemService.delete(codigo, t);
        });
    }
}
