-- 1. Histórico de compras completo de um cliente (JOIN complexo)
-- Motivo: Importante para visualização detalhada do que cada cliente comprou, cruzando 4 tabelas diferentes. Otimizada por índices no CPF e nas FKs.
SELECT 
    c.nome AS cliente_nome,
    v.data_venda,
    i.nome AS item_comprado,
    iv.quantia,
    iv.valor AS valor_unitario_pago,
    (iv.quantia * iv.valor) AS subtotal
FROM tb_vendas v
JOIN tb_clientes c ON v.cliente_id = c.id
JOIN tb_itens_vendas iv ON iv.venda_id = v.id
JOIN tb_itens i ON iv.item_id = i.codigo
WHERE c.cpf = '00000000001'
ORDER BY v.data_venda DESC;

-- 2. Vendas realizadas em um determinado período (Filtro por data)
-- Motivo: Rotina crítica de fechamento de caixa ou relatórios mensais de faturamento. Otimizada pelo índice B-Tree criado no data_venda.
SELECT 
    v.id AS venda_id,
    c.nome AS cliente,
    u.nome AS vendedor,
    v.data_venda
FROM tb_vendas v
LEFT JOIN tb_clientes c ON v.cliente_id = c.id
LEFT JOIN tb_usuarios u ON v.usuario_id = u.id
WHERE v.data_venda >= '2023-01-01 00:00:00' 
  AND v.data_venda <= '2023-12-31 23:59:59'
ORDER BY v.data_venda ASC;
