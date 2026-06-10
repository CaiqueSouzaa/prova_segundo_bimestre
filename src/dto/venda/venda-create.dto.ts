import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemVendaCreateDTO } from './item-venda-create.dto';

export class VendaCreateDTO {
    usuario_id: number;

    @IsNumber({}, {
        message: 'O campo cliente_id deve ser um valor inteiro',
    })
    @IsNotEmpty({
        message: 'O campo cliente_id não deve ser vazio',
    })
    @IsOptional()
    cliente_id: number;

    @IsArray({
        message: 'O campo itens deve ser uma lista de itens',
    })
    @IsNotEmpty({
        message: 'O campo itens não deve ser vazio',
    })
    @ValidateNested({ each: true })
    @Type(() => ItemVendaCreateDTO)
    itens: ItemVendaCreateDTO[];
}
