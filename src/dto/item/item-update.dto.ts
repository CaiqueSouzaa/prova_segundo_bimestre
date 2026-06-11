import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class ItemUpdateDTO {
    codigo: string;

    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    nome: string;

    @IsNumber({}, {
        message: 'O campo quantia deve ser um número'
    })
    @IsOptional()
    quantia: number;


    @IsNumber({}, {
        message: 'O campo valor deve ser um número'
    })
    @IsOptional()
    valor: number;
}
