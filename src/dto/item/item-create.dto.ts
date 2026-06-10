import { IsNotEmpty, IsString } from "class-validator";

export class ItemCreateDTO {
    @IsString({
        message: 'O campo codigo deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo codigo é obrigatório e não deve ser vázio'
    })
    codigo: string;

    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    nome: string;
}
