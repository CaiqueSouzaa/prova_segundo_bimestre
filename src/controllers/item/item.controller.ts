import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ItemApplication } from "src/applications/item.application";
import { FindAllDTO } from "src/dto/find-all.dto";
import { ItemCreateDTO } from "src/dto/item/item-create.dto";
import { ItemShowDTO } from "src/dto/item/item-show.dto";
import { ItemUpdateDTO } from "src/dto/item/item-update.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@ApiTags('Itens')
@ApiBearerAuth('JWT-auth')
@Controller('itens')
export class ItemController {
    constructor(
        private readonly itemApplication: ItemApplication,
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Retorna uma lista de todos os itens' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
    @ApiResponse({
        status: 200,
        description: 'Lista de itens retornada com sucesso.',
        schema: {
            example: {
                data: [
                    {
                        codigo: 'ES-0001',
                        nome: "Teclado",
                        quantia: 10.00,
                        valor: 150.00
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
        return this.itemApplication.findAll(dto);
    }

    @Post('')
    @ApiOperation({ summary: 'Cria um novo item' })
    @ApiBody({
        type: ItemCreateDTO,
        description: 'Dados para criação do item',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    codigo: 'ES-0001',
                    nome: 'Teclado',
                    quantia: 10,
                    valor: 150.45
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Item criado com sucesso.',
        schema: {
            example: {
                codigo: 'ES-0001',
                nome: 'Teclado',
                quantia: 10.00,
                valor: 150.45
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Requisição inválida (Ex: Código já existente ou valores/quantias negativas).' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @HttpCode(HttpStatus.CREATED)
    public async save(@Body() dto: ItemCreateDTO) {
        return this.itemApplication.save(dto);
    }

    @Get(':codigo')
    @ApiOperation({ summary: 'Retorna os dados de um item específico pelo código' })
    @ApiParam({ name: 'codigo', description: 'Código do item', type: String, example: 'ES-0001' }) // <- CORRIGIDO PARA String
    @ApiResponse({
        status: 200,
        description: 'Item retornado com sucesso.',
        schema: {
            example: {
                codigo: 'ES-0001',
                nome: 'Teclado',
                quantia: 10.00,
                valor: 150.45
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Item não localizado.' })
    @HttpCode(HttpStatus.OK)
    public async show(@Param() { codigo }: ItemShowDTO) {
        return this.itemApplication.show(codigo);
    }

    @Put(':codigo')
    @ApiOperation({ summary: 'Atualiza os dados de um item pelo código' })
    @ApiParam({ name: 'codigo', description: 'Código do item', type: String, example: 'ES-0001' }) // <- CORRIGIDO PARA String
    @ApiBody({
        type: ItemUpdateDTO,
        description: 'Dados para atualização do item',
        examples: {
            exemplo: {
                summary: 'Exemplo de requisição',
                value: {
                    nome: 'Teclado #01',
                    quantia: 34,
                    valor: 19.90
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Item updated com sucesso.',
        schema: {
            example: {
                codigo: 'ES-0001',
                nome: 'Teclado #01',
                quantia: 34.00, // <- CORRIGIDO (estava fixo em 0.00)
                valor: 19.90,   // <- CORRIGIDO (estava fixo em 0.00)
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Requisição inválida (Ex: Nome vazio ou valores negativos).' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Item não localizado.' })
    @HttpCode(HttpStatus.OK)
    public async update(@Param() { codigo }: ItemShowDTO, @Body() dto: ItemUpdateDTO) {
        dto.codigo = codigo;
        return this.itemApplication.update(dto);
    }

    @Delete(':codigo')
    @ApiOperation({ summary: 'Remove um item pelo código' })
    @ApiParam({ name: 'codigo', description: 'Código do item', type: String, example: 'ES-0001' }) // <- CORRIGIDO PARA String
    @ApiResponse({ status: 204, description: 'Item removido com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Item não localizado.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param() { codigo }: ItemShowDTO) {
        return this.itemApplication.delete(codigo);
    }
}