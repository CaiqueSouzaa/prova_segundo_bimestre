import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781017622026 implements MigrationInterface {
    name = 'Migration1781017622026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_usuarios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_ee293a06076c7f1cdeb7fcbc774" UNIQUE ("email"), CONSTRAINT "PK_b8032a3a700575eaa4722bf3801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            INSERT INTO
                TB_USUARIOS (EMAIL, SENHA, NOME, SOBRENOME)
            VALUES
                (
                    'admin@email.com',
                    '$2b$12$23Ki2BsMeAZDBaDEwLvE8uhQVqTNFQRBBiFN2ARu0DybdBmfUIZn.',
                    'Administrador',
                    'Administrador'
                ), (
                    'caique@email.com',
                    '$2b$12$z.IAFJL1/wjgcJ7kuZBH7uD64SPWYD2TGn8i6UUmrqpw5UzUOP3pa',
                    'Caique',
                    'Souza'
                ), (
                    'fulano@email.com',
                    '$2a$12$oeMbiZbbhLZ8s3kZPFiru.fIdw5VlwV7dlItBy0beMPRI5JnSCYuq',
                    'Fulano',
                    'Carmo'
                ), (
                    'joaquin@email.com',
                    '$2a$12$Ppjy/5aI5Ln/l7TQNi/.GuH.bKHAhEmqvp4abp7u8.ms1Nq3G2L.m',
                    'Joaquin',
                    'Gonzales'
                ), (
                    'rodolfo@email.com',
                    '$2a$12$3VgwnbKPdlnlShgUEi5yEOF4F52bsDyrLXlUP5w3XWgYyjMGNJo/i',
                    'Rodolfo',
                    'Luneta'
                );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tb_usuarios"`);
    }

}
