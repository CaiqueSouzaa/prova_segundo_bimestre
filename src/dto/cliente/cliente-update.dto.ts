import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ClienteUpdateDTO {
    id: number;

    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    nome: string;

    @IsString({
        message: 'O campo sobrenome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo sobrenome é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    sobrenome: string;

    @IsString({
        message: 'O campo cpf deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo cpf é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    cpf: string;
}
