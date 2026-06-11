import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781185542546 implements MigrationInterface {
    name = 'Migration1781185542546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_clientes" ("id" SERIAL NOT NULL, "cpf" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_1d94b7b0f761df7030a898928dc" UNIQUE ("cpf"), CONSTRAINT "PK_0a9a6ad7d3d902b2d06855a9076" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_usuarios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "nome" character varying NOT NULL, "sobrenome" character varying NOT NULL, CONSTRAINT "UQ_ee293a06076c7f1cdeb7fcbc774" UNIQUE ("email"), CONSTRAINT "PK_b8032a3a700575eaa4722bf3801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_vendas" ("id" SERIAL NOT NULL, "data_venda" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" integer, "usuario_id" integer, CONSTRAINT "PK_103b3553af23f1aeadc70cbcbc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_tb_vendas_cliente_id" ON "tb_vendas"  ("cliente_id") `);
        await queryRunner.query(`CREATE INDEX "idx_tb_vendas_data_venda" ON "tb_vendas"  ("data_venda") `);
        await queryRunner.query(`CREATE TABLE "tb_itens" ("codigo" character varying NOT NULL, "nome" character varying NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', CONSTRAINT "PK_e0483acf84ee20e7e206d486800" PRIMARY KEY ("codigo"))`);
        await queryRunner.query(`CREATE TABLE "tb_itens_vendas" ("id" SERIAL NOT NULL, "quantia" numeric(10,2) NOT NULL DEFAULT '0.00', "valor" numeric(10,2) NOT NULL DEFAULT '0.00', "venda_id" integer, "item_id" character varying, CONSTRAINT "PK_2fc6a7993a57902d567f74740b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_tb_itens_vendas_venda_id" ON "tb_itens_vendas"  ("venda_id") `);
        await queryRunner.query(`ALTER TABLE "tb_vendas" ADD CONSTRAINT "FK_9244db2bbfd3dd82deae34e5c07" FOREIGN KEY ("cliente_id") REFERENCES "tb_clientes"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" ADD CONSTRAINT "FK_126b68e377763ccb959bbcb77d0" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuarios"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_cfb0050730f3224a956ccbb283a" FOREIGN KEY ("venda_id") REFERENCES "tb_vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" ADD CONSTRAINT "FK_0555c2ce71605359d39e522f042" FOREIGN KEY ("item_id") REFERENCES "tb_itens"("codigo") ON DELETE CASCADE ON UPDATE CASCADE`);

        // Criação de dados fakes

        // Usuários
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

        // -- =====================================================
        // -- DADOS FAKES - Clientes
        // -- =====================================================
        await queryRunner.query(`
            INSERT INTO TB_CLIENTES (CPF, NOME, SOBRENOME) VALUES
                ('041.892.730-15', 'Mariana',   'Figueiredo'),
                ('382.014.960-77', 'Carlos',    'Drummond'),
                ('519.347.820-63', 'Isabela',   'Carvalho'),
                ('274.601.853-90', 'Roberto',   'Nascimento'),
                ('738.295.014-28', 'Fernanda',  'Azevedo'),
                ('195.823.047-56', 'Thiago',    'Monteiro'),
                ('463.718.205-34', 'Camila',    'Teixeira'),
                ('827.054.391-62', 'Eduardo',   'Cavalcante'),
                ('350.682.174-09', 'Luciana',   'Barbosa'),
                ('614.039.782-41', 'Rafael',    'Guimarães'),
                ('902.371.548-67', 'Patrícia',  'Mendes'),
                ('187.456.023-85', 'Guilherme', 'Rezende'),
                ('543.209.867-13', 'Aline',     'Correia'),
                ('076.834.512-49', 'Marcelo',   'Vieira'),
                ('729.145.680-32', 'Juliana',   'Moreira');
        `);

        // -- =====================================================
        // -- DADOS FAKES - Itens
        // -- =====================================================
        await queryRunner.query(`
            INSERT INTO TB_ITENS (CODIGO, NOME, QUANTIA, VALOR) VALUES
                ('NB-DEL-001', 'Notebook Dell Inspiron 15',       12.00,  3299.90),
                ('NB-LEN-002', 'Notebook Lenovo IdeaPad 3',        8.00,  2799.99),
                ('MON-LG-001', 'Monitor LG 24" Full HD',          20.00,   899.00),
                ('TEC-LOG-001', 'Teclado Logitech MX Keys',       35.00,   499.90),
                ('MOU-LOG-001', 'Mouse Logitech MX Master 3',     40.00,   399.90),
                ('HD-SEA-001', 'HD Externo Seagate 1TB',          25.00,   289.90),
                ('SSD-KIN-001', 'SSD Kingston 480GB',             18.00,   219.90),
                ('FNO-SAM-001', 'Smartphone Samsung Galaxy A54',   9.00,  1899.00),
                ('TAB-AMA-001', 'Tablet Amazon Fire HD 10',       14.00,   699.00),
                ('FNE-JBL-001', 'Fone de Ouvido JBL Tune 520BT',  50.00,  249.90),
                ('CAB-USB-001', 'Cabo USB-C 2m Baseus',          100.00,   49.90),
                ('CAR-ANC-001', 'Carregador Anker 65W GaN',       30.00,  199.90),
                ('WEB-LOC-001', 'Webcam Logitech C920 HD',        15.00,  349.90),
                ('IMP-CAN-001', 'Impressora Canon PIXMA G3160',    6.00,  699.00),
                ('ROT-TP-001',  'Roteador TP-Link Archer C6',     22.00,  249.90);
        `);

        // -- =====================================================
        // -- DADOS FAKES - Vendas
        // -- (usuario_id entre 1 e 5, cliente_id entre 1 e 15)
        // -- =====================================================
        await queryRunner.query(`
            INSERT INTO TB_VENDAS (DATA_VENDA, CLIENTE_ID, USUARIO_ID) VALUES
                ('2024-01-08 09:14:00', 3,  2),
                ('2024-01-15 10:52:00', 7,  3),
                ('2024-01-22 14:30:00', 1,  1),
                ('2024-02-03 11:05:00', 12, 4),
                ('2024-02-14 16:48:00', 5,  2),
                ('2024-02-28 09:30:00', 9,  5),
                ('2024-03-05 13:22:00', 2,  3),
                ('2024-03-19 15:41:00', 14, 1),
                ('2024-03-27 08:55:00', 6,  2),
                ('2024-04-02 17:10:00', 11, 4),
                ('2024-04-15 10:33:00', 4,  5),
                ('2024-04-30 12:00:00', 8,  1),
                ('2024-05-10 14:20:00', 15, 3),
                ('2024-05-21 09:45:00', 10, 2),
                ('2024-05-31 16:05:00', 13, 4),
                ('2024-06-11 11:18:00', 1,  5),
                ('2024-06-25 14:55:00', 7,  1),
                ('2024-07-08 09:00:00', 3,  3),
                ('2024-07-19 15:30:00', 12, 2),
                ('2024-08-02 10:15:00', 6,  4);
        `);

        // -- =====================================================
        // -- DADOS FAKES - Itens Vendas
        // -- (venda_id entre 1 e 20, item_id = CODIGO da TB_ITENS)
        // -- =====================================================
        await queryRunner.query(`
            INSERT INTO TB_ITENS_VENDAS (VENDA_ID, ITEM_ID, QUANTIA, VALOR) VALUES
                -- Venda 1
                (1,  'NB-DEL-001',  1.00, 3299.90),
                (1,  'MOU-LOG-001', 1.00,  399.90),
                -- Venda 2
                (2,  'MON-LG-001',  1.00,  899.00),
                (2,  'TEC-LOG-001', 1.00,  499.90),
                (2,  'CAB-USB-001', 2.00,   49.90),
                -- Venda 3
                (3,  'FNO-SAM-001', 1.00,  249.90),
                (3,  'CAR-ANC-001', 1.00,  199.90),
                -- Venda 4
                (4,  'NB-LEN-002',  1.00, 2799.99),
                (4,  'SSD-KIN-001', 1.00,  219.90),
                (4,  'MOU-LOG-001', 1.00,  399.90),
                -- Venda 5
                (5,  'FNE-JBL-001', 2.00,  249.90),
                (5,  'CAB-USB-001', 3.00,   49.90),
                -- Venda 6
                (6,  'IMP-CAN-001', 1.00,  699.00),
                (6,  'CAB-USB-001', 1.00,   49.90),
                -- Venda 7
                (7,  'ROT-TP-001',  1.00,  249.90),
                (7,  'CAB-USB-001', 2.00,   49.90),
                -- Venda 8
                (8,  'TAB-AMA-001', 1.00,  699.00),
                (8,  'FNO-SAM-001', 1.00,  249.90),
                (8,  'CAR-ANC-001', 1.00,  199.90),
                -- Venda 9
                (9,  'WEB-LOC-001', 1.00,  349.90),
                (9,  'TEC-LOG-001', 1.00,  499.90),
                -- Venda 10
                (10, 'FNO-SAM-001', 1.00,  249.90),
                (10, 'CAB-USB-001', 2.00,   49.90),
                (10, 'CAR-ANC-001', 1.00,  199.90),
                -- Venda 11
                (11, 'HD-SEA-001',  1.00,  289.90),
                (11, 'SSD-KIN-001', 1.00,  219.90),
                -- Venda 12
                (12, 'FNO-SAM-001', 1.00, 1899.00),
                (12, 'CAR-ANC-001', 1.00,  199.90),
                (12, 'CAB-USB-001', 2.00,   49.90),
                -- Venda 13
                (13, 'NB-DEL-001',  1.00, 3299.90),
                (13, 'MON-LG-001',  1.00,  899.00),
                (13, 'TEC-LOG-001', 1.00,  499.90),
                (13, 'MOU-LOG-001', 1.00,  399.90),
                -- Venda 14
                (14, 'ROT-TP-001',  1.00,  249.90),
                -- Venda 15
                (15, 'TAB-AMA-001', 1.00,  699.00),
                (15, 'FNO-SAM-001', 1.00,  249.90),
                -- Venda 16
                (16, 'HD-SEA-001',  2.00,  289.90),
                (16, 'CAB-USB-001', 1.00,   49.90),
                -- Venda 17
                (17, 'WEB-LOC-001', 1.00,  349.90),
                (17, 'MOU-LOG-001', 1.00,  399.90),
                -- Venda 18
                (18, 'SSD-KIN-001', 2.00,  219.90),
                (18, 'HD-SEA-001',  1.00,  289.90),
                -- Venda 19
                (19, 'NB-LEN-002',  1.00, 2799.99),
                (19, 'MOU-LOG-001', 1.00,  399.90),
                (19, 'TEC-LOG-001', 1.00,  499.90),
                -- Venda 20
                (20, 'IMP-CAN-001', 1.00,  699.00),
                (20, 'CAB-USB-001', 3.00,   49.90);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_0555c2ce71605359d39e522f042"`);
        await queryRunner.query(`ALTER TABLE "tb_itens_vendas" DROP CONSTRAINT "FK_cfb0050730f3224a956ccbb283a"`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" DROP CONSTRAINT "FK_126b68e377763ccb959bbcb77d0"`);
        await queryRunner.query(`ALTER TABLE "tb_vendas" DROP CONSTRAINT "FK_9244db2bbfd3dd82deae34e5c07"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tb_itens_vendas_venda_id"`);
        await queryRunner.query(`DROP TABLE "tb_itens_vendas"`);
        await queryRunner.query(`DROP TABLE "tb_itens"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tb_vendas_data_venda"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tb_vendas_cliente_id"`);
        await queryRunner.query(`DROP TABLE "tb_vendas"`);
        await queryRunner.query(`DROP TABLE "tb_usuarios"`);
        await queryRunner.query(`DROP TABLE "tb_clientes"`);
    }

}
