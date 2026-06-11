-- Script de Carga Inicial (Seed)

-- Limpar dados existentes (opcional e seguro apenas para ambiente de teste)
TRUNCATE TABLE tb_itens_vendas, tb_vendas, tb_itens, tb_usuarios, tb_clientes RESTART IDENTITY CASCADE;

-- Inserir 10 Usuários
INSERT INTO tb_usuarios (email, senha, nome, sobrenome)
SELECT 
    'usuario' || i || '@vendas.com',
    '$2b$10$xyz123hashfalso1234567890', -- bcrypt hash falso
    'Vendedor ' || i,
    'Sobrenome ' || i
FROM generate_series(1, 10) AS i;

-- Inserir 20 Clientes
INSERT INTO tb_clientes (cpf, nome, sobrenome)
SELECT 
    LPAD(i::text, 11, '0'),
    'Cliente ' || i,
    'Sobrenome Cliente ' || i
FROM generate_series(1, 20) AS i;

-- Inserir 30 Itens
INSERT INTO tb_itens (codigo, nome, quantia, valor)
SELECT 
    'PROD-' || LPAD(i::text, 4, '0'),
    'Produto Teste ' || i,
    (RANDOM() * 100 + 10)::numeric(10,2),
    (RANDOM() * 500 + 5)::numeric(10,2)
FROM generate_series(1, 30) AS i;

-- Inserir 50 Vendas
INSERT INTO tb_vendas (cliente_id, usuario_id, data_venda)
SELECT 
    (MOD(i, 20) + 1), -- Distribui vendas entre os 20 clientes
    (MOD(i, 10) + 1), -- Distribui vendas entre os 10 usuarios
    CURRENT_TIMESTAMP - (i || ' days')::interval
FROM generate_series(1, 50) AS i;

-- Inserir 100 Itens de Vendas (cerca de 2 itens por venda)
INSERT INTO tb_itens_vendas (venda_id, item_codigo, quantia, valor)
SELECT 
    (MOD(i, 50) + 1), -- Referencia uma das 50 vendas
    'PROD-' || LPAD((MOD(i, 30) + 1)::text, 4, '0'), -- Referencia um dos 30 produtos
    (RANDOM() * 5 + 1)::numeric(10,2),
    (RANDOM() * 500 + 5)::numeric(10,2)
FROM generate_series(1, 100) AS i;

-- No total: 10 usuários + 20 clientes + 30 itens + 50 vendas + 100 itens de venda = 210 registros fictícios criados.
