import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781096198096 implements MigrationInterface {
    name = 'Migration1781096198096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_clientes" ("id" SERIAL NOT NULL, "cpf" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_1d94b7b0f761df7030a898928dc" UNIQUE ("cpf"), CONSTRAINT "PK_0a9a6ad7d3d902b2d06855a9076" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_itens" ("codigo" character varying NOT NULL, "nome" character varying NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', CONSTRAINT "PK_e0483acf84ee20e7e206d486800" PRIMARY KEY ("codigo"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tb_itens"`);
        await queryRunner.query(`DROP TABLE "tb_clientes"`);
    }

}
