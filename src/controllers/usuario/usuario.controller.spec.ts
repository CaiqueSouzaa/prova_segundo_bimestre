import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from 'src/controllers/usuario/usuario.controller';
import { UsuarioApplication } from 'src/applications/usuario.application';
import { UsuarioFindAllDTO } from 'src/dto/usuario/usuario-find-all.dto';
import { UsuarioCreateDTO } from 'src/dto/usuario/usuario-create.dto';
import { UsuarioUpdateDTO } from 'src/dto/usuario/usuario-update.dto';
import { Page } from 'src/interfaces/page';
import { Usuario } from 'src/entities/usuario';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let application: UsuarioApplication;

  const mockUsuarioApplication = {
    findAll: jest.fn(),
    save: jest.fn(),
    show: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioApplication,
          useValue: mockUsuarioApplication,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    application = module.get<UsuarioApplication>(UsuarioApplication);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista paginada de usuários (Page<Usuario>)', async () => {
      // Arrange
      const dto: UsuarioFindAllDTO = { page: 1, limit: 10 };
      
      const mockUsuario = new Usuario();
      mockUsuario.id = 1;
      mockUsuario.nome = 'João';
      mockUsuario.sobrenome = 'Silva';
      mockUsuario.email = 'joao@email.com';

      const mockPage: Page<Usuario> = {
        data: [mockUsuario],
        total: 1,
        page: 1,
        limit: 10,
        hasNextPage: false,
      };

      mockUsuarioApplication.findAll.mockResolvedValue(mockPage);

      // Act
      const result = await controller.findAll(dto);

      // Assert
      expect(result).toEqual(mockPage);
      expect(application.findAll).toHaveBeenCalledTimes(1);
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });

    it('deve repassar corretamente os parâmetros page e limit para o UsuarioApplication', async () => {
      // Arrange
      const dto: UsuarioFindAllDTO = { page: 3, limit: 25 };
      
      const mockPage: Page<Usuario> = {
        data: [],
        total: 0,
        page: 3,
        limit: 25,
        hasNextPage: false,
      };

      mockUsuarioApplication.findAll.mockResolvedValue(mockPage);

      // Act
      const result = await controller.findAll(dto);

      // Assert
      expect(result).toEqual(mockPage);
      expect(application.findAll).toHaveBeenCalledTimes(1);
      expect(application.findAll).toHaveBeenCalledWith(dto);
    });

    it('deve repassar objeto vazio quando nenhum query parameter for enviado', async () => {
      // Arrange
      const dto: UsuarioFindAllDTO = {} as UsuarioFindAllDTO;
      
      mockUsuarioApplication.findAll.mockResolvedValue({
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
  });

  describe('save', () => {
    it('deve criar um novo usuário e retornar a entidade Usuario', async () => {
      // Arrange
      const dto: UsuarioCreateDTO = {
        nome: 'Maria',
        sobrenome: 'Souza',
        email: 'maria@email.com',
        senha: 'senha-super-secreta',
      };

      const mockUsuario = new Usuario();
      mockUsuario.id = 2;
      mockUsuario.nome = dto.nome;
      mockUsuario.sobrenome = dto.sobrenome;
      mockUsuario.email = dto.email;

      mockUsuarioApplication.save.mockResolvedValue(mockUsuario);

      // Act
      const result = await controller.save(dto);

      // Assert
      expect(result).toEqual(mockUsuario);
      expect(application.save).toHaveBeenCalledTimes(1);
      expect(application.save).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções lançadas pelo UsuarioApplication', async () => {
      // Arrange
      const dto: UsuarioCreateDTO = {
        nome: 'Maria',
        sobrenome: 'Souza',
        email: 'maria@email.com',
        senha: 'senha',
      };

      const erroEsperado = new Error('Endereço de e-mail não disponível para uso');
      mockUsuarioApplication.save.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.save(dto)).rejects.toThrow(erroEsperado);
      expect(application.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('show', () => {
    it('deve retornar os dados de um usuário específico pelo ID', async () => {
      // Arrange
      const dto = { id: 1 };
      
      const mockUsuario = new Usuario();
      mockUsuario.id = dto.id;
      mockUsuario.nome = 'João';
      mockUsuario.sobrenome = 'Silva';
      mockUsuario.email = 'joao@email.com';

      mockUsuarioApplication.show.mockResolvedValue(mockUsuario);

      // Act
      const result = await controller.show(dto);

      // Assert
      expect(result).toEqual(mockUsuario);
      expect(application.show).toHaveBeenCalledTimes(1);
      expect(application.show).toHaveBeenCalledWith(dto.id);
    });

    it('deve repassar exceções quando o usuário não for encontrado', async () => {
      // Arrange
      const dto = { id: 999 };
      const erroEsperado = new Error('ID de usuário não localizado');
      
      mockUsuarioApplication.show.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.show(dto)).rejects.toThrow(erroEsperado);
      expect(application.show).toHaveBeenCalledWith(dto.id);
    });
  });

  describe('update', () => {
    it('deve atribuir o ID ao DTO, chamar o update e retornar o usuário atualizado', async () => {
      // Arrange
      const idDto = { id: 1 };
      const dto: UsuarioUpdateDTO = {
        nome: 'José',
        sobrenome: 'Ferreira',
      };
      
      const mockUsuario = new Usuario();
      mockUsuario.id = idDto.id;
      mockUsuario.nome = dto.nome;
      mockUsuario.sobrenome = dto.sobrenome;
      mockUsuario.email = 'emailantigo@email.com'; // O e-mail não foi atualizado no DTO

      mockUsuarioApplication.update.mockResolvedValue(mockUsuario);

      // Act
      const result = await controller.update(idDto, dto);

      // Assert
      expect(dto.id).toEqual(idDto.id);
      expect(result).toEqual(mockUsuario);
      expect(application.update).toHaveBeenCalledTimes(1);
      expect(application.update).toHaveBeenCalledWith(dto);
    });

    it('deve repassar exceções lançadas pela camada de aplicação (ex: e-mail em uso)', async () => {
      // Arrange
      const idDto = { id: 1 };
      const dto: UsuarioUpdateDTO = { email: 'emuso@email.com' };
      
      const erroEsperado = new Error('Endereço de e-mail não disponível para uso');
      mockUsuarioApplication.update.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.update(idDto, dto)).rejects.toThrow(erroEsperado);
      expect(application.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('deve chamar o método delete da aplicação com o ID correto', async () => {
      // Arrange
      const dto = { id: 1 };
      
      // O método delete na aplicação não retorna nada (void)
      mockUsuarioApplication.delete.mockResolvedValue(undefined);

      // Act
      await controller.delete(dto);

      // Assert
      expect(application.delete).toHaveBeenCalledTimes(1);
      expect(application.delete).toHaveBeenCalledWith(dto.id);
    });

    it('deve repassar exceções caso ocorra erro na exclusão (ex: usuário não encontrado)', async () => {
      // Arrange
      const dto = { id: 999 };
      const erroEsperado = new Error('ID de usuário não localizado');
      
      mockUsuarioApplication.delete.mockRejectedValue(erroEsperado);

      // Act & Assert
      await expect(controller.delete(dto)).rejects.toThrow(erroEsperado);
      expect(application.delete).toHaveBeenCalledWith(dto.id);
    });
  });
});
