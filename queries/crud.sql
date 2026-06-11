-- Consultas Básicas CRUD do Sistema

-- CREATE (Inserção)
INSERT INTO tb_clientes (cpf, nome, sobrenome) VALUES ('111.222.333-44', 'João', 'Silva');
INSERT INTO tb_itens (codigo, nome, quantia, valor) VALUES ('ITEM001', 'Produto Teste', 100, 49.90);

-- READ (Leitura / Consultas)
SELECT * FROM tb_clientes WHERE cpf = '111.222.333-44';
SELECT * FROM tb_itens WHERE codigo = 'ITEM001';

-- UPDATE (Atualização)
UPDATE tb_itens SET valor = 59.90 WHERE codigo = 'ITEM001';
UPDATE tb_clientes SET nome = 'Flavio' WHERE id = 1;

-- DELETE (Remoção)
-- OBS: Vendas cadastradas para este cliente terão a FK definida como NULL devido ao ON DELETE SET NULL
DELETE FROM tb_clientes WHERE id = 1;
