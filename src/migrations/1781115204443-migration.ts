import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781115204443 implements MigrationInterface {
    name = 'Migration1781115204443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_venda" ("id" SERIAL NOT NULL, "data_venda" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" integer, "usuario_id" integer, CONSTRAINT "PK_3b1cbfa751ba42d551e0e461f29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "quantia" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "valor" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "tb_venda" ADD CONSTRAINT "FK_50a8cc710b7fc4f25733f168d0a" FOREIGN KEY ("cliente_id") REFERENCES "tb_clientes"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "tb_venda" ADD CONSTRAINT "FK_7f09c9214bbb6319420255aa9ba" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuarios"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_venda" DROP CONSTRAINT "FK_7f09c9214bbb6319420255aa9ba"`);
        await queryRunner.query(`ALTER TABLE "tb_venda" DROP CONSTRAINT "FK_50a8cc710b7fc4f25733f168d0a"`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "valor" SET DEFAULT 0.00`);
        await queryRunner.query(`ALTER TABLE "tb_itens" ALTER COLUMN "quantia" SET DEFAULT 0.00`);
        await queryRunner.query(`DROP TABLE "tb_venda"`);
    }

}
