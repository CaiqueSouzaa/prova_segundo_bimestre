import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { VendaApplication } from "src/applications/venda.application";
import { FindAllDTO } from "src/dto/find-all.dto";
import { IdDTO } from "src/dto/id.dto";
import { VendaCreateDTO } from "src/dto/venda/venda-create.dto";
import { VendaUpdateDTO } from "src/dto/venda/venda-update.dto";
import { AuthGuard } from "src/guards/auth.guard";
import type { IdRequest } from "src/interfaces/id-request";

@UseGuards(AuthGuard)
@ApiTags('Vendas') // <- ADICIONADO PARA ORGANIZAÇÃO NO SWAGGER
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
                        dataVenda: "2026-06-11T18:28:08.764Z",
                        usuario: {
                            id: 1,
                            email: "admin@email.com",
                            nome: "Administrador",
                            sobrenome: "Sistema"
                        },
                        cliente: {
                            id: 2,
                            cpf: "12345678901",
                            nome: "João",
                            sobrenome: "Silva"
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
    @ApiResponse({ status: 401, description: 'Não autorizado (Token ausente ou inválido).' })
    @HttpCode(HttpStatus.OK)
    public async findAll(@Query() dto: FindAllDTO) {
        return this.vendaApplication.findAll(dto);
    }

    @Post('')
    @ApiOperation({ summary: 'Cria uma nova venda' })
    @ApiBody({
        type: VendaCreateDTO,
        description: 'Dados para criação da venda',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    cliente_id: 1,
                    itens: [
                        {
                            item_codigo: "ES-0001",
                            quantia: 2
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Venda criada com sucesso. Retorna o Cupom Fiscal.', // <- CORRIGIDO PARA REALIDADE DA APPLICATION
        schema: {
            example: {
                id: 7,
                dataVenda: "2026-06-11T18:28:08.764Z",
                cliente: {
                    id: 1,
                    nome: "João",
                    sobrenome: "Silva"
                },
                usuario: {
                    id: 1,
                    nome: "Administrador",
                    sobrenome: "Sistema"
                },
                itens: [
                    {
                        codigo: "ES-0001",
                        nome: "Teclado",
                        quantia: 2,
                        valorUnitario: 150.00,
                        subTotal: 300.00
                    }
                ],
                valorTotal: 300.00
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Requisição inválida (Ex: Estoque insuficiente de um item ou quantia inválida).' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Cliente ou Item informado não localizado.' })
    @HttpCode(HttpStatus.CREATED)
    public async save(@Body() dto: VendaCreateDTO, @Request() req: IdRequest) {
        dto.usuario_id = req.userId;
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
                dataVenda: "2026-06-11T18:28:08.764Z",
                usuario: {
                    id: 1,
                    email: "admin@email.com",
                    nome: "Administrador",
                    sobrenome: "Sistema"
                },
                cliente: {
                    id: 2,
                    cpf: "12345678901",
                    nome: "João",
                    sobrenome: "Silva"
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'ID de venda não localizado.' })
    @HttpCode(HttpStatus.OK)
    public async show(@Param() { id }: IdDTO) {
        return this.vendaApplication.show(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza os dados de uma venda pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da venda', type: Number, example: 1 })
    @ApiBody({
        type: VendaUpdateDTO,
        description: 'Dados para atualização da venda',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    cliente_id: 2,
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Venda atualizada com sucesso.',
        schema: {
            example: { // <- CORRIGIDO DE ACORDO COM O OBJETO RETORNADO NA APPLICATION
                id: 7,
                usuario: {
                    id: 1,
                    nome: "Administrador",
                    sobrenome: "Sistema"
                },
                cliente: {
                    id: 2,
                    nome: "José",
                    sobrenome: "Camargo"
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Venda ou Cliente novo não localizado.' })
    @HttpCode(HttpStatus.OK)
    public async update(@Param() { id }: IdDTO, @Body() dto: VendaUpdateDTO) {
        dto.id = id;
        return this.vendaApplication.update(dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma venda pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da venda', type: Number, example: 1 })
    @ApiResponse({ status: 204, description: 'Venda removida com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'ID de venda não localizado.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param() { id }: IdDTO) {
        return this.vendaApplication.delete(id);
    }
}