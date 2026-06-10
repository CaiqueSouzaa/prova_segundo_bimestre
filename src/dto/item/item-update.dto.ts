import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
