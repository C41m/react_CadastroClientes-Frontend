# Cadastro Clientes v1

Projeto realizado com as tecnologias .Net 8.0 Core (ASP.NET Core, Entity Framework Core e Swagger) para desenvolvimento da API e React JS (Typescript, HTML, CSS e Bootstrap) para o front-end. Para banco de dados, usei SQL Server com tabelas devidamente relacionadas e a arquitetura de desenvolvimento é MVC.

A comunicação entre o back-end e o front-end é feita através de requisições HTTP, utilizando o protocolo RESTful para a troca de dados.

## Funcionalidades

### Cidades

#### 1. Cadastro

    1. Inserir dados em todo formulário. Todos os campos são **obrigatórios**.
    2. Não pode existir a mesma cidade em determinado estado.

#### 2. Busca por nome de cidade ou estado

    1. Os dados são capturados da API quando o modal abre e se acontecer alguma alteração dentro dele, como adição, alteração ou exclusão.
    2. Como os dados aqui já são previamente capturados, essa busca em específico, procura por registros dentro da lista salva.
    3. O campo é dinâmico e busca as letras digitadas.

#### 3. Exclusão

    1. Para excluir, basta clicar no ícone de lixeira do lado do registro e confirmar no modal.
    2. Não é permitido a exclusão de cidades que estejam já vinculados com algum cliente.

#### 4. Edição

    1. Para editar, basta clicar no ícone de papel e caneta ao lado do registro e adicionar os novos dados. Após isso, clicar no ícone do disquete ao lado. Caso desejar cancelar durante a edição, só apertar no x.
    2. **Importante**: Quando uma cidade vinculada a um cliente é alterada, a cidade registrada para esse cliente também será afetada.

### Clientes

#### 1. Cadastro de clientes

    1. Inserir dados em todo formulário. Todos os campos são **obrigatórios**.
    2. Os dados de ESTADO e CIDADE são ligados diretamente ao banco de dados, ou seja, é **fundamental** o cadastro destes antes.
    3. O formulário não trata dados de pessoas repetidas (por enquanto).

#### 2. Busca por nome e sobrenome

    1. Ao contrário do que acontece na no *modal de cidades*, a metodologia usada aqui foi diferente. Qualquer registro nos campos, seja ele no nome ou sobrenome vai ser diretamente buscado via API ao apertar em "Pesquisar".
    2. Não é preciso do nome completo, uma parte ou uma letra deste já é possível realizar buscas e retornar uma lista de resultados, senão obtiver nenhuma semelhança, sistema avisará via notificação.
    3. Enquanto os dados estiverem filtrados, um aviso permacerá na tela acima da tabela.
    4. Para voltar, basta apertar em "Limpar".

#### 3. Exclusão

    1. Para excluir, basta clicar no ícone de lixeira do lado do registro e confirmar no modal.

#### 4. Edição

    1. Para editar, basta clicar no ícone de papel e caneta ao lado do cliente e o formulário com os dados para edição aparece para alteração.

### Geral

    1. Pode ser feito a ordenação da tabela principal clicando no cabeçalho da coluna desejada.
