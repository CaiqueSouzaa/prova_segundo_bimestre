import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { VendaApplication } from "src/applications/venda.application";
import { FindAllDTO } from "src/dto/find-all.dto";
import { IdDTO } from "src/dto/id.dto";
import { VendaCreateDTO } from "src/dto/venda/venda-create.dto";
import { AuthGuard } from "src/guards/auth.guard";
import type { IdRequest } from "src/interfaces/id-request";

@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth') 
@Controller('vendas')
export class VendaController {
    constructor(
        private readonly vendaApplication: VendaApplication,
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Retorna uma lista de todos as vendas' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
    @ApiResponse({
        status: 200,
        description: 'Lista de vendas retornada com sucesso.',
        schema: {
            example: {
                data: [
                    {
                        id: 1,
                        cliente: {
                            id: 4,
                            nome: 'João',
                            sobrenome: 'Sales',
                        },
                        usuario: {
                            id: 2,
                            nome: 'Fulano',
                            sobrenome: 'Pancho',
                        }
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
        return this.vendaApplication.findAll(dto);
    }

    @Post('')
    @ApiOperation({ summary: 'Cria uma nova venda' })
    @ApiBody({
        type: VendaCreateDTO,
        description: 'Dados para criação da venda. O campo valor é opcional, recebendo como valor padrão o valor cadastrado no item',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    cliente_id: 4,
                    itens: [
                        {
                            codigo: 'ES-0001',
                            quantia: 1.00,
                        },
                        {
                            codigo: 'ES-0002',
                            quantia: 8.00,
                            valor: 14.00,
                        },
                        {
                            codigo: 'ES-0003',
                            quantia: 14.00,
                            valor: 3.99,
                        },
                    ],
                },
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Venda criada com sucesso.',
        schema: {
            example: {
                id: 1,
                cliente: {
                    id: 4,
                    nome: 'João',
                    sobrenome: 'Sales',
                },
                usuario: {
                    id: 2,
                    nome: 'Fulano',
                    sobrenome: 'Pancho',
                }
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    public async save(@Request() request: IdRequest, @Body() dto: VendaCreateDTO) {
        dto.usuario_id = request.userId;

        return this.vendaApplication.save(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna os dados de uma venda específica pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da venda', type: Number, example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Venda retornada com sucesso.',
        schema: {
            example: {
                id: 1,
                cliente: {
                    id: 4,
                    nome: 'João',
                    sobrenome: 'Sales',
                },
                usuario: {
                    id: 2,
                    nome: 'Fulano',
                    sobrenome: 'Pancho',
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    public async show(@Param() { id }: IdDTO) {
        return this.vendaApplication.show(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma venda pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da venda', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'Venda removida com sucesso.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param() { id }: IdDTO) {
        return this.vendaApplication.delete(id);
    }
}
