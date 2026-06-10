import { Controller, Get, Query, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IdDTO } from "src/dto/id.dto";
import { UsuarioCreateDTO } from "src/dto/usuario/usuario-create.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ClienteApplication } from "src/applications/cliente.application";
import { FindAllDTO } from "src/dto/find-all.dto";
import { ClienteUpdateDTO } from "src/dto/cliente/cliente-update.dto";
import { ClienteCreateDTO } from "src/dto/cliente/cliente-create.dto";

// @UseGuards(AuthGuard)
@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth') 
@Controller('clientes')
export class ClienteController {
    constructor(
        private readonly clienteApplication: ClienteApplication,
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Retorna uma lista de todos os clientes' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de clientes retornada com sucesso.',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        cpf: "38274859391",
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
    public async findAll(@Query() dto: FindAllDTO) {
        return this.clienteApplication.findAll(dto);
    }

    @Post('')
    @ApiOperation({ summary: 'Cria um novo cliente' })
    @ApiBody({ 
        type: UsuarioCreateDTO, 
        description: 'Dados para criação do cliente',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    cpf: '38274859391',
                    nome: 'João',
                    sobrenome: 'Silva'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Cliente criado com sucesso.',
        schema: {
            example: {
                id: 1,
                cpf: '38274859391',
                nome: 'João',
                sobrenome: 'Silva'
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    public async save(@Body() dto: ClienteCreateDTO) {
        return this.clienteApplication.save(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna os dados de um cliente específico pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do cliente', type: Number, example: 1 })
    @ApiResponse({ 
        status: 200, 
        description: 'Cliente retornado com sucesso.',
        schema: {
            example: {
                id: 1,
                cpf: '38274859391',
                nome: 'João',
                sobrenome: 'Silva'
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async show(@Param() { id }: IdDTO) {
        return this.clienteApplication.show(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza os dados de um cliente pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do cliente', type: Number, example: 1 })
    @ApiBody({ 
        type: ClienteUpdateDTO, 
        description: 'Dados para atualização do cliente',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    nome: 'José',
                    sobrenome: 'Camargo',
                    cpf: '38274859391'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Cliente atualizado com sucesso.',
        schema: {
            example: {
                id: 1,
                cpf: '38274859391',
                nome: 'José',
                sobrenome: 'Carmargo'
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async update(@Param() { id }: IdDTO, @Body() dto: ClienteUpdateDTO) {
        dto.id = id;
        return this.clienteApplication.update(dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um cliente pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do cliente', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'Cliente removido com sucesso.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param() { id }: IdDTO) {
        return this.clienteApplication.delete(id);
    }
}
