import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from 'src/controllers/item/item.controller';
import { ItemApplication } from 'src/applications/item.application';
import { ItemCreateDTO } from 'src/dto/item/item-create.dto';
import { ItemUpdateDTO } from 'src/dto/item/item-update.dto';
import { ItemShowDTO } from 'src/dto/item/item-show.dto';
import { FindAllDTO } from 'src/dto/find-all.dto';
import { Item } from 'src/entities/item';
import { Page } from 'src/interfaces/page';

describe('ItemController', () => {
  let controller: ItemController;
  let application: ItemApplication;

  const mockItemApplication = {
    findAll: jest.fn(),
    save: jest.fn(),
    show: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemApplication,
          useValue: mockItemApplication,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    application = module.get<ItemApplication>(ItemApplication);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista paginada de itens (Page<Item>)', async () => {
      // Arrange
      const dto: FindAllDTO = { page: 1, limit: 10 };

      const mockItem = new Item();
      mockItem.codigo = 'ES-0001';
      mockItem.nome = 'Teclado';
      mockItem.quantia = 23.00;
      mockItem.valor = 53.99;

      const mockPage: Page<Item> = {
        data: [mockItem],
        total: 1,
        page: 1,
        limit: 10,
        hasNextPage: false,
      };

      mockItemApplication.findAll.mockResolvedValue(mockPage);

      // Act
      const result = await controller.findAll(dto);

      // Assert
      expect(result).toEqual(mockPage);
      expect(application.findAll).toHaveBeenCalledTimes(1);
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });

    it('deve repassar corretamente os parâmetros page e limit para o ItemApplication', async () => {
      // Arrange
      const dto: FindAllDTO = { page: 3, limit: 25 };

      const mockPage: Page<Item> = {
        data: [],
        total: 0,
        page: 3,
        limit: 25,
        hasNextPage: false,
      };

      mockItemApplication.findAll.mockResolvedValue(mockPage);

      // Act
      const result = await controller.findAll(dto);

      // Assert
      expect(result).toEqual(mockPage);
      expect(application.findAll).toHaveBeenCalledTimes(1);
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });

    it('deve repassar objeto vazio quando nenhum query parameter for enviado', async () => {
      // Arrange
      const dto: FindAllDTO = {} as FindAllDTO;

      mockItemApplication.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        hasNextPage: false,
      });

      // Act
      await controller.findAll(dto);

      // Assert
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções lançadas pelo ItemApplication', async () => {
      // Arrange
      const dto: FindAllDTO = { page: 1, limit: 10 };
      const erroEsperado = new Error('Erro de banco de dados');

      mockItemApplication.findAll.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.findAll(dto)).rejects.toThrow(erroEsperado);
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });
  });

  describe('save', () => {
    it('deve criar um novo item e retornar a entidade Item', async () => {
      // Arrange
      const dto: ItemCreateDTO = {
        codigo: 'ES-0001',
        nome: 'Teclado',
      };

      const mockItem = new Item();
      mockItem.codigo = dto.codigo;
      mockItem.nome = dto.nome;
      mockItem.quantia = 0.00;
      mockItem.valor = 0.00;

      mockItemApplication.save.mockResolvedValue(mockItem);

      // Act
      const result = await controller.save(dto);

      // Assert
      expect(result).toEqual(mockItem);
      expect(application.save).toHaveBeenCalledTimes(1);
      expect(application.save).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções quando o código já está em uso', async () => {
      // Arrange
      const dto: ItemCreateDTO = {
        codigo: 'ES-0001',
        nome: 'Teclado',
      };

      const erroEsperado = new Error('Código não disponível para uso');
      mockItemApplication.save.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.save(dto)).rejects.toThrow(erroEsperado);
      expect(application.save).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções quando o nome do item está vazio', async () => {
      // Arrange
      const dto: ItemCreateDTO = {
        codigo: 'ES-0002',
        nome: '',
      };

      const erroEsperado = new Error('Nome de item não deve ser vázio');
      mockItemApplication.save.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.save(dto)).rejects.toThrow(erroEsperado);
      expect(application.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('show', () => {
    it('deve retornar os dados de um item específico pelo código', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'ES-0001' };

      const mockItem = new Item();
      mockItem.codigo = param.codigo;
      mockItem.nome = 'Teclado';
      mockItem.quantia = 23.00;
      mockItem.valor = 53.99;

      mockItemApplication.show.mockResolvedValue(mockItem);

      // Act
      const result = await controller.show(param);

      // Assert
      expect(result).toEqual(mockItem);
      expect(application.show).toHaveBeenCalledTimes(1);
      expect(application.show).toHaveBeenCalledWith(param.codigo);
    });

    it('deve repassar exceções quando o item não for encontrado', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'XX-9999' };
      const erroEsperado = new Error('Código de item não localizado');

      mockItemApplication.show.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.show(param)).rejects.toThrow(erroEsperado);
      expect(application.show).toHaveBeenCalledWith(param.codigo);
    });
  });

  describe('update', () => {
    it('deve atribuir o código ao DTO, chamar o update e retornar o item atualizado', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'ES-0001' };
      const dto: ItemUpdateDTO = {
        codigo: '',
        nome: 'Teclado #01',
      };

      const mockItem = new Item();
      mockItem.codigo = param.codigo;
      mockItem.nome = dto.nome;
      mockItem.quantia = 0.00;
      mockItem.valor = 0.00;

      mockItemApplication.update.mockResolvedValue(mockItem);

      // Act
      const result = await controller.update(param, dto);

      // Assert
      expect(dto.codigo).toEqual(param.codigo);
      expect(result).toEqual(mockItem);
      expect(application.update).toHaveBeenCalledTimes(1);
      expect(application.update).toHaveBeenCalledWith(dto);
    });

    it('deve sobrescrever o codigo do DTO com o codigo recebido via param', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'ES-0001' };
      const dto: ItemUpdateDTO = {
        codigo: 'CODIGO-DIFERENTE',
        nome: 'Teclado',
      };

      mockItemApplication.update.mockResolvedValue(new Item());

      // Act
      await controller.update(param, dto);

      // Assert
      expect(dto.codigo).toEqual(param.codigo);
    });

    it('deve repassar exceções lançadas pela camada de aplicação (ex: item não encontrado)', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'XX-9999' };
      const dto: ItemUpdateDTO = { codigo: '', nome: 'Novo Nome' };

      const erroEsperado = new Error('Código de item não localizado');
      mockItemApplication.update.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.update(param, dto)).rejects.toThrow(erroEsperado);
      expect(application.update).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções quando o nome do item está vazio', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'ES-0001' };
      const dto: ItemUpdateDTO = { codigo: '', nome: '' };

      const erroEsperado = new Error('Nome de item não deve ser vázio');
      mockItemApplication.update.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.update(param, dto)).rejects.toThrow(erroEsperado);
      expect(application.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('deve chamar o método delete da aplicação com o código correto', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'ES-0001' };

      mockItemApplication.delete.mockResolvedValue(undefined);

      // Act
      await controller.delete(param);

      // Assert
      expect(application.delete).toHaveBeenCalledTimes(1);
      expect(application.delete).toHaveBeenCalledWith(param.codigo);
    });

    it('deve repassar exceções caso o item não seja encontrado', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: 'XX-9999' };
      const erroEsperado = new Error('Código de item não localizado');

      mockItemApplication.delete.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.delete(param)).rejects.toThrow(erroEsperado);
      expect(application.delete).toHaveBeenCalledWith(param.codigo);
    });

    it('deve repassar exceções quando o código do item é inválido', async () => {
      // Arrange
      const param: ItemShowDTO = { codigo: '' };
      const erroEsperado = new Error('Código de item é obrigatório');

      mockItemApplication.delete.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.delete(param)).rejects.toThrow(erroEsperado);
      expect(application.delete).toHaveBeenCalledWith(param.codigo);
    });
  });
});