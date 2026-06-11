import { ItemCreateDTO } from "src/dto/item/item-create.dto";
import { ItemUpdateDTO } from "src/dto/item/item-update.dto";
import { Item } from "src/entities/item";

export class ItemMapper {
    static createToEntity(dto: ItemCreateDTO): Item {
        const item: Item = new Item();

        item.codigo = dto.codigo
        item.nome = dto.nome;

        if (dto.quantia && dto.quantia > 0) {
            item.quantia = dto.quantia;
        }

        if (dto.valor && dto.valor > 0) {
            item.valor = dto.valor;
        }

        return item;
    }

    static updateToEntity(dto: ItemUpdateDTO, dados: Item): Item {
        const item: Item = new Item();

        item.nome = dto.nome || dados.nome;
        item.quantia = dto.quantia || dados.quantia;
        item.valor = dto.valor || dados.valor;

        return item;
    }
}
