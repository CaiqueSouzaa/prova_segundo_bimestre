import { ItemCreateDTO } from "src/dto/item/item-create.dto";
import { ItemUpdateDTO } from "src/dto/item/item-update.dto";
import { Item } from "src/entities/item";

export class ItemMapper {
    static createToEntity(dto: ItemCreateDTO): Item {
        const item: Item = new Item();

        item.codigo = dto.codigo
        item.nome = dto.nome;

        return item;
    }

    static updateToEntity(dto: ItemUpdateDTO, dados: Item): Item {
        const item: Item = new Item();

        item.nome = dto.nome || dados.nome;

        return item;
    }
}
