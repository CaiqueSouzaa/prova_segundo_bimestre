# tb_usuarios 
Tabela responsável por armazenar os dados dos usuários do sistema, usuários estes que manipularão os dados.
 Nome | Tipo | Constraints | Descrição |
| -------- | -------- | -------- | -------- |
| id  | integer  | PK | ID de registro da tabela |
| email  | varchar(100)  | Unique, Not Null | Endereço de e-mail usado para login no sistema, não devendo existir outros usuários com o mesmo endereço de e-mail no sistema |
| senha  | varchar(100)  | Not Null | Senha criptografada em formato bcrypt para login no sistema |
| nome  | varchar(50)  | Not Null  | Nome do usuário no sistema |
| sobrenome  | varchar(100)  | Not Null  | Sobrenome do usuário no sistema |

---

# tb_clientes
Tabela responsável por armazenar os dados dos clientes. Os clientes não são usuários.
 Nome | Tipo | Constraints | Descrição |
| -------- | -------- | -------- | -------- |
| id  | integer  | PK | ID de registro da tabela |
| cpf  | varchar(11)  | Unique, Not Null | Número do CPF do cliente, não devendo existir outros clientes com o mesmo CPF |
| nome  | varchar(50)  | Not Null  | Nome do cliente |
| sobrenome  | varchar(100)  | Not Null  | Sobrenome do cliente |

---

# tb_itens
Tabela responsável pelo estoque dos itens.
 Nome | Tipo | Constraints | Descrição |
| -------- | -------- | -------- | -------- |
| codigo  | varchar(25)  | PK | Código do item |
| nome  | varchar(250)  | Not Null  | Nome do item |
| quantia  | decimal(10, 2)  | Not Null, default 0.00  | Quantia de itens disponíveis |
| valor  | decimal(10, 2)  | Not Null, default 0.00  | Valor do item - O item possui um valor base, porém o mesmo pode ser alterado no momento da venda |

---

# tb_vendas
Tabela responsável por armazenar as vendas realizadas. Uma venda pode ser realizada para clientes não cadastrados, sendo possível que a coluna "cliente_id" seja nula.
 Nome | Tipo | Constraints | Descrição |
| -------- | -------- | -------- | -------- |
| id  | integer  | PK | ID de registro da tabela |
| cliente_id  | integer  | FK, Null | ID do cliente que está realizando a compra. Essa coluna pode ser nula, pois vendas podem ser realizadas para clientes não cadastrados |
| usuario_id  | integer  | FK, Not Null  | ID do usuário que está realizando a venda. Diferentemente da coluna cliente_id, a coluna usuario_id é obrigatória, pois precisamos saber quem está realizando a venda |
| data_venda  | timestamp  | Not Null  | Momento atual em que a venda foi realizada |

---

# tb_itens_vendas
Tabela responsável por armazenar os itens, quantias e valores das vendas. As vendas podem possuir um ou mais itens, sendo necessário essa tabela para permitir tal configuração.
 Nome | Tipo | Constraints | Descrição |
| -------- | -------- | -------- | -------- |
| id  | integer  | PK | ID de registro da tabela |
| venda_id  | integer  | FK, Not Null | ID da venda. Uma venda pode ter mais de um item. Essa coluna serve para especificar que muitos itens podem fazer parte da mesma "ordem de venda" |
| item_codigo  | varchar(25)  | FK, Not Null  | Código do item que está sendo vendido |
| quantia  | decimal(10, 2)  | Not Null, default 0.00  | Quantia do item em questão que está sendo vendido |
| valor  | decimal(10, 2)  | Not Null, default 0.00  | Por mais que exista o valor do item na tabela de itens, a coluna "valor" em "tb_itens_vendas" permite definir um valor personalizado para o item em questão |