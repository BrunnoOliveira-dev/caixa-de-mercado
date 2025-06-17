# Explicação do Projeto: Caixa de Mercado

## Visão Geral
Este projeto é um sistema de ponto de venda (caixa de mercado) dividido em três partes principais:
- **Front-end**: Interface do usuário para operação do caixa.
- **Back-end (Node.js)**: Servidor responsável por servir as páginas e arquivos estáticos.
- **API (Java/Spring Boot)**: Responsável pela lógica de negócio, persistência e manipulação dos dados (produtos, vendas, clientes, etc).

---

## Estrutura do Projeto

```
caixa-de-mercado/
│
├── front_end/           # Interface do usuário (HTML, CSS, JS)
│   ├── pages/           # Páginas principais (Home, Caixa)
│   └── src/             # Arquivos estáticos (css, js)
│
├── back_end/            # Servidor Node.js (Express)
│   ├── index.js         # Inicialização do servidor
│   └── router/          # Rotas para servir páginas
│
└── api/                 # API em Java (Spring Boot)
    └── demo/            # Código-fonte da API
```

---

## Tecnologias Utilizadas
- **Front-end**: HTML, CSS (Bootstrap), JavaScript
- **Back-end**: Node.js, Express
- **API**: Java, Spring Boot

---

## Como Funciona

### 1. Front-end
- O usuário acessa as páginas `Home.html` e `Caixa.html` para operar o sistema.
- O arquivo `caixa.js` gerencia o carrinho, busca produtos e calcula troco.
- As páginas usam Bootstrap para um visual moderno e responsivo.

### 2. Back-end (Node.js)
- Servidor Express serve as páginas HTML e arquivos estáticos (CSS/JS).
- As rotas principais são:
  - `/` → Página inicial (Home)
  - `/caixa` → Página do caixa
- O servidor roda normalmente em `http://localhost:3000`.

### 3. API (Java/Spring Boot)
- Responsável por fornecer dados dos produtos, clientes, vendas, etc.
- Exemplo: ao buscar um produto pelo código de barras, o front-end faz uma requisição para `http://localhost:8080/api/produtos/barras/{codigo}`.
- A API responde com os dados do produto, que são exibidos e manipulados no front-end.

---

## Banco de Dados

A API (Java/Spring Boot) utiliza um banco de dados relacional para armazenar e gerenciar as informações do sistema. O banco de dados é fundamental para garantir a persistência dos dados de produtos, clientes, funcionários, vendas e outros registros.

### Principais Entidades
- **Produto**: Armazena informações como nome, marca, código de barras, preço unitário e quantidade em estoque.
- **Cliente**: Dados dos clientes cadastrados (nome, CPF, etc).
- **Venda**: Registra cada venda realizada, incluindo produtos vendidos, valores, data e método de pagamento.
- **Funcionário**: Informações dos funcionários do sistema.
- **Caixa**: Controle de operações do caixa e movimentações financeiras.

### Funcionamento
- A API utiliza o Spring Data JPA para mapear as entidades Java para tabelas do banco de dados.
- As operações de cadastro, consulta, atualização e remoção são feitas por meio dos repositórios e serviços da API.
- O banco de dados pode ser configurado no arquivo `application.properties` (em `api/demo/src/main/resources`).

### Observações
- O projeto pode ser facilmente adaptado para diferentes bancos de dados relacionais (MySQL, PostgreSQL, H2, etc).
- É importante garantir que o banco esteja rodando e configurado corretamente para que a API funcione.

---

## Fluxo Principal
1. O usuário acessa o sistema pelo navegador.
2. O servidor Node.js entrega a página solicitada.
3. O usuário busca produtos e adiciona ao carrinho.
4. O front-end faz requisições à API para obter informações dos produtos.
5. O usuário finaliza a venda, podendo escolher o método de pagamento e visualizar o troco.

---

## Observações
- O projeto pode ser expandido para incluir relatórios, cadastro de clientes, controle de estoque, etc.
- Para rodar o sistema, é necessário iniciar tanto o back-end (Node.js) quanto a API (Java/Spring Boot).

---

**Dúvidas ou sugestões? Consulte o código ou entre em contato com o desenvolvedor.**
