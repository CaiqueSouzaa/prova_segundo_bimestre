import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class VendaUpdateDTO {
    id: number;

    @IsNumber({}, {
        message: 'O campo cliente_id deve ser um valor inteiro',
    })
    @IsOptional()
    cliente_id: number;
}
