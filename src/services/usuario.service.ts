import { Injectable } from "@nestjs/common";
import { Usuario } from "src/entities/usuario";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Page } from "src/interfaces/page";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    private repository: Repository<Usuario>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository<Usuario>(Usuario);
    }

    private getRepository(transaction?: EntityManager) {
        if (transaction) {
            return transaction.getRepository<Usuario>(Usuario);
        }

        return this.repository;
    }

    /**
     * Retorna a lista de usuários de forma paginada.
     * @param page Página atual (padrão: 1)
     * @param limit Quantidade de registros por página (padrão: 10)
     * @returns Objeto Page contendo os dados, total de registros e informações de paginação.
     */
    public async findAll(page: number = 1, limit: number = 10, transaction?: EntityManager): Promise<Page<Usuario>> {
        const repository = this.getRepository(transaction);

        // findAndCount retorna [dados, totalDeRegistros]
        const [data, total] = await repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;

        return {
            data,
            total,
            page,
            limit,
            hasNextPage
        };
    }

    public async hasEmail(email: string, transaction?: EntityManager): Promise<boolean> {
        const repository = this.getRepository(transaction);

        const usuario: Usuario | null = await repository.findOne({
            where: {
                email: email,
            },
        });

        if (!usuario) {
            return false;
        }

        return true;
    }

    public async findByEmail(email: string, transaction?: EntityManager): Promise<Usuario> {
        const repository = this.getRepository(transaction);

        const usuario: Usuario | null = await repository.findOne({
            where: {
                email: email,
            },
        });

        if (!usuario) {
            throw new Error('Endereço de e-mail não localizado');
        }

        return usuario;
    }

    public async save(usuario: Usuario, transaction?: EntityManager): Promise<Usuario> {
        // Nome não deve ser vázio
        if (!usuario.nome || usuario.nome.length === 0) {
            throw new Error('Nome de usuário não deve ser vázio');
        }

        // Sobrenome não deve ser vázio
        if (!usuario.sobrenome || usuario.sobrenome.length === 0) {
            throw new Error('Sobrenome de usuário não deve ser vázio');
        }

        // E-mail não deve ser vázio
        if (!usuario.email || usuario.email.length === 0) {
            throw new Error('Endereço de e-mail de usuário não deve ser vázio');
        }

        // Senha não deve ser vázio
        if (!usuario.senha || usuario.senha.length === 0) {
            throw new Error('Senha de usuário não deve ser vázio');
        }

        // Criptografando a senha de usuário
        usuario.senha = await bcrypt.hash(usuario.senha, 12);


        const repository = this.getRepository(transaction);
        return repository.save(usuario);
    }

    public async show(id: number, transaction?: EntityManager): Promise<Usuario> {
        const repository = this.getRepository(transaction);
        const usuario: Usuario | null = await repository.findOne({
            where: {
                id: id,
            },
        });

        if (!usuario) {
            throw new Error('ID de usuário não localizado');
        }

        return usuario;
    }

    public async update(dados: Usuario, transaction?: EntityManager): Promise<Usuario> {
        const repository = this.getRepository(transaction);
        if (!dados) {
            throw new Error('ID de usuário é obrigatório');
        }

        // Nome não deve ser vázio
        if (!dados.nome || dados.nome.length === 0) {
            throw new Error('Nome de usuário não deve ser vázio');
        }

        // Sobrenome não deve ser vázio
        if (!dados.sobrenome || dados.sobrenome.length === 0) {
            throw new Error('Sobrenome de usuário não deve ser vázio');
        }

        // E-mail não deve ser vázio
        if (!dados.email || dados.email.length === 0) {
            throw new Error('Endereço de e-mail de usuário não deve ser vázio');
        }

        // Senha não deve ser vázio
        // if (!dados.senha || dados.senha.length === 0) {
        //     throw new Error('Senha de usuário não deve ser vázio');
        // }

        return repository.save(dados);
    }

    public async delete(id: number, transaction?: EntityManager): Promise<void> {
        const repository = this.getRepository(transaction);
        if (!id) {
            throw new Error('ID de usuário é obrigatório');
        }

        await repository.delete(id);
    }
}
