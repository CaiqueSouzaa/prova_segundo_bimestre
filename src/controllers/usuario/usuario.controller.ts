import { Controller, Get, Query, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsuarioApplication } from "src/applications/usuario.application";
import { UsuarioFindAllDTO } from "src/dto/usuario/usuario-find-all.dto";
import { IdDTO } from "src/dto/id.dto";
import { UsuarioCreateDTO } from "src/dto/usuario/usuario-create.dto";
import { UsuarioUpdateDTO } from "src/dto/usuario/usuario-update.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@ApiTags('Usuários')
@ApiBearerAuth('JWT-auth') 
@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly usuarioApplication: UsuarioApplication,
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Retorna uma lista de todos os usuários' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de usuários retornada com sucesso.',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        email: "teste@teste.com",
                        nome: "João",
                        sobrenome: "Silva"
                    }
                ],
                total: 1,
                page: 1,
                limit: 10,
                hasNextPage: false
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async findAll(@Query() dto: UsuarioFindAllDTO) {
        return this.usuarioApplication.findAll(dto);
    }

    @Post('')
    @ApiOperation({ summary: 'Cria um novo usuário' })
    @ApiBody({ 
        type: UsuarioCreateDTO, 
        description: 'Dados para criação do usuário',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    email: 'joao.silva@email.com',
                    senha: 'SenhaForte123',
                    nome: 'João',
                    sobrenome: 'Silva'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Usuário criado com sucesso.',
        schema: {
            example: {
                id: 1,
                email: 'joao.silva@email.com',
                nome: 'João',
                sobrenome: 'Silva'
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    public async save(@Body() dto: UsuarioCreateDTO) {
        return this.usuarioApplication.save(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna os dados de um usuário específico pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do usuário', type: Number, example: 1 })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuário retornado com sucesso.',
        schema: {
            example: {
                id: 1,
                email: 'joao.silva@email.com',
                nome: 'João',
                sobrenome: 'Silva'
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async show(@Param() { id }: IdDTO) {
        return this.usuarioApplication.show(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza os dados de um usuário pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do usuário', type: Number, example: 1 })
    @ApiBody({ 
        type: UsuarioUpdateDTO, 
        description: 'Dados para atualização do usuário',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    nome: 'José',
                    sobrenome: 'Camargo',
                    email: 'jose.camargo@email.com'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuário atualizado com sucesso.',
        schema: {
            example: {
                id: 1,
                email: 'jose.camargo@email.com',
                nome: 'José',
                sobrenome: 'Carmargo'
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async update(@Param() { id }: IdDTO, @Body() dto: UsuarioUpdateDTO) {
        dto.id = id;
        return this.usuarioApplication.update(dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um usuário pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do usuário', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param() { id }: IdDTO) {
        return this.usuarioApplication.delete(id);
    }
}
