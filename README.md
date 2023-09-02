# Projeto de Gerenciamento de Dados Sensíveis

Este projeto é uma aplicação de gerenciamento de dados sensíveis, desenvolvida com o objetivo de fornecer funcionalidades para criar, acessar e excluir informações relacionadas a contas de usuário, credenciais, notas seguras, cartões e senhas de wifi. Ele é projetado para garantir a segurança dos dados e a privacidade dos usuários.

### Stacks principais do projeto:
- **NestJS**
- **PrismaORM**
- **Typescript**
- **Bibliotecas de Criptografia**:
   - `bcrypt`
   - `cryptr`
- **Testes automatizados**:
  - `jest`
  - `supertest`

<br>

## Como Executar

Para executar esta aplicação, siga estas etapas:

1. Clone o repositório para sua máquina local.

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
 - Faça uma cópia do arquivo `.env.example` e configure a variável de ambiente para desenvolvimento `.env.development`.
 
<br>

4. Aplique as migrações do banco de dados usando o Prisma em um ambiente de desenvolvimento:
   ```bash
   npm run dev:migration:generate
   npm run dev:migration:run
   ``` 

5. Executando a aplicação:
   ```bash
   npm run start:dev
   ```

<br>

## Documentação
- Após subir a aplicação em [http://localhost:3000](http://localhost:3000) a **documentação** estará em [http://localhost:3000/api](http://localhost:3000/api)


- Certifique-se de configurar o banco de dados e outras configurações conforme apropriado antes de usar a aplicação em um ambiente de produção. Consulte a documentação para obter mais detalhes sobre as configurações e funcionalidades adicionais.


## Testes
1. Configure as variáveis de ambiente:
 - Faça uma cópia do arquivo `.env.example` e configure a variável de ambiente para teste `.env.test`.

2. Aplique as migrações do banco de dados usando o Prisma em um ambiente de testes:
  
    ```bash
    npm run test:migration:generate
    npm run test:migration:run
    ``` 

3. Execute os comandos:
   ```bash
    # e2e tests
    $ npm run test:e2e

    # test coverage
    $ npm run test:e2e:cov
    ```

<br>

## Rotas e Funcionalidades

### ❤️ Health (`/health`)

- Rota somente para garantir que a aplicação está em pé.
- **GET** `/health`: Retorna a mensagem `"I am okay!"` com o status code `200 OK`.

### 👤 Usuários (`/users`)

- A aplicação permite que os usuários criem contas e as utilizem para acessar outras funcionalidades.

#### Criação de Contas

- Os usuários devem fornecer um e-mail válido e uma senha para criar uma conta.
- Se o e-mail já estiver em uso, a aplicação não permitirá a criação da conta (`409 Conflict`).
- A senha deve atender aos critérios de segurança, incluindo pelo menos 10 caracteres, 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial (`400 Bad Request`).
- As senhas são armazenadas criptografadas no banco de dados, usando a biblioteca [bcrypt](https://www.npmjs.com/package/bcrypt).

#### Acesso de Conta

- Os usuários devem utilizar o e-mail e senha cadastrados para acessar suas contas.
- Caso sejam fornecidos dados incompatíveis, a aplicação responderá com `401 Unauthorized`.
- Após um login bem-sucedido, os usuários receberão um token JWT para autenticação posterior.
- **Este token deve ser enviado em todas as requisições para identificar o usuário.**

### 🔑 Credenciais (`/credentials`)

- Credenciais se referem a informações de login para sites e serviços.

#### Criação de Credenciais

- Para registrar uma nova credencial, o usuário deve fornecer uma URL, um nome de usuário e uma senha.
- O usuário também deve informar um título/nome/rótulo para a credencial, uma vez que é possível cadastrar várias credenciais para um mesmo site.
- Caso nenhum dos dados seja enviado, a aplicação responderá com `400 Bad Request`.
- Cada credencial deve possuir um título/nome/rótulo único. Tentativas de criar duas credenciais com o mesmo nome serão impedidas (`409 Conflict`).
- As senhas das credenciais são criptografadas usando um segredo da aplicação, com o uso da biblioteca [cryptr](https://www.npmjs.com/package/cryptr).

#### Busca de Credenciais

- A aplicação permite a obtenção de todas as credenciais na rota `/credentials` ou de uma credencial específica através do seu ID na rota `/credentials/{id}`.
- Se um usuário tentar acessar uma credencial que não pertence a ele, a aplicação responderá com `403 Forbidden`.
- Se for enviado um ID inválido, a resposta será `400 Bad Request`.
- Se o ID não existir, a resposta será `404 Not Found`.
- Todas as credenciais retornadas aparecem com a senha descriptografada (`200 OK`).

#### Deletar Credenciais

- A aplicação permite a exclusão de credenciais com base no seu ID.
- Se for enviado um ID inválido, a resposta será `400 Bad Request`.
- Se o ID não existir, a resposta será `404 Not Found`.
- Se a credencial pertencer a outro usuário, a resposta será `403 Forbidden`.

### ✏️ Notas Seguras (`/notes`)

- Notas Seguras são informações em formato de texto.

#### Criação de Notas Seguras

- Para registrar uma nova nota segura, o usuário deve fornecer um título/nome/rótulo e o conteúdo da nota.
- Se nenhum dos dados for enviado, a aplicação responderá com `400 Bad Request`.
- Cada nota deve possuir um título único. Tentativas de criar duas notas com o mesmo nome serão impedidas (`409 Conflict`).

#### Busca de Notas Seguras

- A aplicação permite a obtenção de todas as notas seguras na rota `/notes` ou de uma nota segura específica através do seu ID na rota `/notes/{id}`.
- Se um usuário tentar acessar uma nota que não pertence a ele, a aplicação responderá com `403 Forbidden`.
- Se for enviado um ID inválido, a resposta será `400 Bad Request`.
- Se o ID não existir, a resposta será `404 Not Found`.

#### Deletar Notas Seguras

- A aplicação permite a exclusão de notas seguras com base no seu ID.
- Se for enviado um ID inválido, a resposta será `400 Bad Request`.
- Se o ID não existir, a resposta será `404 Not Found`.
- Se a nota pertencer a outro usuário, a resposta será `403 Forbidden`.

### 💳 Cartões (`/cards`)

- Os cartões representam cartões de crédito e/ou débito.

#### Criação de Cartões

- Para registrar um novo cartão, o usuário deve fornecer o número do cartão, o nome impresso, o código de segurança, a data de expiração, a senha, se ele é virtual e o seu tipo (crédito, débito ou ambos).
- Se nenhum dos dados for enviado, a aplicação responderá com `400 Bad Request`.
- Cada cartão deve possuir um título/nome/rótulo único. Tentativas de criar dois cartões com o mesmo nome serão impedidas (`409 Conflict`).
- O código de segurança e a senha do cartão são

 criptografados usando um segredo da aplicação, com o uso da biblioteca [cryptr](https://www.npmjs.com/package/cryptr).

#### Busca de Cartões

- A aplicação permite a obtenção de todos os cartões do usuário na rota `/cards` ou de um cartão específico através do seu ID na rota `/cards/{id}`.
- Se um usuário tentar acessar um cartão que não pertence a ele, a aplicação responderá com `403 Forbidden`.
- Se o cartão não existir, a resposta será `404 Not Found`.

#### Deletar Cartões

- A aplicação permite a exclusão de cartões com base no seu ID.
- Se o ID não existir, a resposta será `404 Not Found`.
- Se o cartão pertencer a outro usuário, a resposta será `403 Forbidden`.


### 📶 Wi-fi (`/wifi`)

- Wi-fi’s representam os dados de acesso a uma rede de internet.

#### Criação de Wi-fi

- Para registrar um novo wifi, o usuário deve fornecer o nome da rede, senha da rede e um título para diferenciar cada um dos dados.
- Por ser informação sensível, a senha da rede de internet deve ser criptografada usando um segredo da aplicação, com o uso da biblioteca [cryptr](https://www.npmjs.com/package/cryptr).

#### Busca de Redes Wi-fi

- A aplicação permite que o usuário obtenha todas as redes Wi-fi na rota `/wifi` ou uma rede específica através do seu ID na rota `/wifi/{id}`.
- Se um usuário tentar acessar uma rede Wi-fi que não pertence a ele ou que não existe, a aplicação responderá com `403 Forbidden` ou `404 Not Found`, respectivamente. 

#### Deleção de Redes Wi-fi

- A aplicação permite que uma rede Wi-fi seja deletada com base no seu ID.
- Se o ID não existir, a resposta será `404 Not Found`.
- Se o ID pertencer a uma rede Wi-fi de outra pessoa, a aplicação responderá com ``403 Forbidden`.

### 🗑️ Deletar Conta e todos os dados do usuário (`/erase`)

- A rota permite que o usuário exclua sua conta e todos os dados associados a ela.
- Quando essa ação ocorre, os dados de credenciais, notas, cartões e outros são deletados do banco de dados, bem como o próprio cadastro do usuário.
- Como é uma ação destrutiva, a senha deve ser enviada novamente no corpo da requisição para que a ação seja executada. Caso a senha esteja incorreta, a resposta será `401 Unauthorized`.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar pull requests para melhorar este projeto.
