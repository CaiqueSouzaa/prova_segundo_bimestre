import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemVendaCreateDTO {
    vendaId: number;

    @IsString({
        message: 'O campo codigo deve ser uma string'
    })
    @IsNotEmpty({
        message: 'O campo codigo não deve ser vazio'
    })
    codigo: string;

    @IsNumber({}, {
        message: 'O campo quantia deve ser um número'
    })
    quantia: number;

    @IsNumber({}, {
        message: 'O campo valor deve ser um número'
    })
    @IsOptional()
    valor: number;
}