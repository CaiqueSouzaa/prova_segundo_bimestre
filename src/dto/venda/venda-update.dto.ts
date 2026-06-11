import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class VendaUpdateDTO {
    id: number;

    // null = remover cliente | number = definir cliente | ausente = sem alteração
    @ValidateIf((o) => o.cliente_id !== null)
    @IsNumber({}, {
        message: 'O campo cliente_id deve ser um valor inteiro',
    })
    @IsOptional()
    cliente_id?: number | null;
}
