import { IsNotEmpty, IsString } from "class-validator";

export class AuthSignInDTO {
    @IsString({
        message: 'O campo email deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo email não deve ser vázio',
    })
    email: string;

    @IsString({
        message: 'O campo senha deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo senha não deve ser vázio',
    })
    senha: string;
}
