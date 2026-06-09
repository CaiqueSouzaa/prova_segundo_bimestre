import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthApplication } from "src/applications/auth.application";
import { AuthSignInDTO } from "src/dto/auth/auth-signin.dto";

@ApiTags('Autenticação')
@Controller('login')
export class AuthController {
    constructor(
        private readonly authApplication: AuthApplication,
    ) { }

    @Post('')
    @ApiOperation({ summary: 'Realiza login e obter token de sessão' })
    @ApiBody({
        type: AuthSignInDTO,
        description: 'Dados de login - Endereço de e-mail e senha',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    email: 'joao.silva@email.com',
                    senha: 'SenhaForte123',
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Usuário logado com sucesso',
        schema: {
            example: {
                token: 'eoijdf...'
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async signIn(@Body() dto: AuthSignInDTO) {
        return this.authApplication.signIn(dto);
    }
}
