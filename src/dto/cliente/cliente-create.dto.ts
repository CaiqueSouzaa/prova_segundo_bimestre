import { IsNotEmpty, IsString } from "class-validator";

export class ClienteCreateDTO {
    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    nome: string;

    @IsString({
        message: 'O campo sobrenome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo sobrenome é obrigatório e não deve ser vázio'
    })
    sobrenome: string;

    @IsString({
        message: 'O campo cpf deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo cpf é obrigatório e não deve ser vázio'
    })
    cpf: string;
}
