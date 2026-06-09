import { IsInt, IsNumberString, IsOptional } from "class-validator";

export class UsuarioFindAllDTO {
    @IsNumberString({}, {
        message: 'O campo page deve ser um valor inteiro'
    })
    @IsOptional()
    page: number;

    @IsNumberString({}, {
        message: 'O campo page deve ser um valor inteiro'
    })
    @IsOptional()
    limit: number;
}
