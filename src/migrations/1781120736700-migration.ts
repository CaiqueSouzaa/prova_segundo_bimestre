import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781120736700 implements MigrationInterface {
    name = 'Migration1781120736700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_itens_vendas" ("id" SERIAL NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', "venda_id" integer, "item_id" character varying, CONSTRAINT "PK_2fc6a7993a57902d567f74740b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "quantia" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "valor" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_cfb0050730f3224a956ccbb283a" FOREIGN KEY ("venda_id") REFERENCES "tb_venda"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_0555c2ce71605359d39e522f042" FOREIGN KEY ("item_id") REFERENCES "tb_itens"("codigo") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_0555c2ce71605359d39e522f042"`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_cfb0050730f3224a956ccbb283a"`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "valor" SET DEFAULT 0.00`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "quantia" SET DEFAULT 0.00`);
        await queryRunner.query(`DROP TABLE "tb_itens_vendas"`);
    }

}
