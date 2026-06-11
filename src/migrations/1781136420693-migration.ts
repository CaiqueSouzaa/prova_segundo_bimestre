import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781136420693 implements MigrationInterface {
    name = 'Migration1781136420693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_clientes" ("id" SERIAL NOT NULL, "cpf" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_1d94b7b0f761df7030a898928dc" UNIQUE ("cpf"), CONSTRAINT "PK_0a9a6ad7d3d902b2d06855a9076" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_usuarios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_ee293a06076c7f1cdeb7fcbc774" UNIQUE ("email"), CONSTRAINT "PK_b8032a3a700575eaa4722bf3801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_vendas" ("id" SERIAL NOT NULL, "data_venda" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" integer, "usuario_id" integer, CONSTRAINT "PK_103b3553af23f1aeadc70cbcbc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_itens" ("codigo" character varying NOT NULL, "nome" character varying NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', CONSTRAINT "PK_e0483acf84ee20e7e206d486800" PRIMARY KEY ("codigo"))`);
        await queryRunner.query(`CREATE TABLE "tb_itens_vendas" ("id" SERIAL NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', "venda_id" integer, "item_id" character varying, CONSTRAINT "PK_2fc6a7993a57902d567f74740b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" ADD CONSTRAINT "FK_9244db2bbfd3dd82deae34e5c07" FOREIGN KEY ("cliente_id") REFERENCES "tb_clientes"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" ADD CONSTRAINT "FK_126b68e377763ccb959bbcb77d0" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuarios"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_cfb0050730f3224a956ccbb283a" FOREIGN KEY ("venda_id") REFERENCES "tb_vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_0555c2ce71605359d39e522f042" FOREIGN KEY ("item_id") REFERENCES "tb_itens"("codigo") ON DELETE CASCADE ON UPDATE CASCADE`);
        
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
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_0555c2ce71605359d39e522f042"`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_cfb0050730f3224a956ccbb283a"`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" DROP CONSTRAINT "FK_126b68e377763ccb959bbcb77d0"`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" DROP CONSTRAINT "FK_9244db2bbfd3dd82deae34e5c07"`);
        await queryRunner.query(`DROP TABLE "tb_itens_vendas"`);
        await queryRunner.query(`DROP TABLE "tb_itens"`);
        await queryRunner.query(`DROP TABLE "tb_vendas"`);
        await queryRunner.query(`DROP TABLE "tb_usuarios"`);
        await queryRunner.query(`DROP TABLE "tb_clientes"`);
    }
}
