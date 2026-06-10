import { ItemVendaCreateDTO } from "src/dto/venda/item-venda-create.dto";
import { Item } from "src/entities/item";
import { ItemVenda } from "src/entities/item-venda";
import { Venda } from "src/entities/venda";

export class ItemVendaMapper {
    static createToEntity(dto: ItemVendaCreateDTO): ItemVenda {
        const itemVenda: ItemVenda = new ItemVenda();
        const venda: Venda = new Venda();
        const item: Item = new Item();

        venda.id = dto.vendaId;

        item.codigo = dto.codigo;

        itemVenda.venda = venda;
        
        itemVenda.item = item;
        itemVenda.quantia = dto.quantia;
        itemVenda.valor = dto.valor;

        return itemVenda;
    }
}
