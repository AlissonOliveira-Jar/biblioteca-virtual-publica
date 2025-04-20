# Biblioteca Virtual Pública (backend)

Este projeto é uma aplicação backend para uma biblioteca virtual pública. 
Ele fornece um sistema completo de cadastro, login e de usuário bem como esqueci senha e redefinição.
Operações CRUD para: User, Livro, Artigo, Autor e Editora.
mas para certas operações dependerá da sua role, se você é um User, Bibliotecario ou Administrador.

Tanto o backend e o frontend possuem os seus próprios Dockerfile e estão a ser orquestrados pelo compose.yaml

## Pré-requisitos:

* **Java 21** (Utilizando Liberica JDK)
* **Docker** (Se for windows é Docker Hub, se for Linux tem que ser Docker e Docker Compose).
* **PostgreSQL** (não é necessário instalar, o banco será executado automaticamente via Docker Compose).

## Executar o Projeto:

Como entre as dependências do projeto tem `spring-boot-docker-compose`,
basta executar o projeto no arquivo `BibliotecaApplication`,
que automaticamente o serviço do compose executará o banco de dados PostgreSQL.

Por padrão, o serviço estará disponível em `http://localhost:8080`.

**Documentação da API (Swagger UI):**

A documentação de todos os endpoints da API está disponível através do Swagger UI no seguinte endereço:

`http://localhost:8080/swagger-ui/index.html`

Você poderá explorar todos os endpoints, seus parâmetros, exemplos de requisição e resposta, 
e até mesmo interagir com a API diretamente através desta interface.

**Especificação OpenAPI (JSON):**

A especificação da API no formato JSON também pode ser acessada em:

`http://localhost:8080/v3/api-docs`

Usuário Administrador será criado automaticamente,
para saber ou alterar informações, elas estão em `application.properties`.

## Esqueci a Senha
Para essa funcionalidade ser usada é necessário adicionar um e-mail real, caso utilize autenticação de dois fatores,
você precisará criar uma senha em `https://myaccount.google.com/` na opção segurança busque por "senhas de app",
será gerada uma senha única que você utilizará no campo `spring.mail.password=` que está no application.properties.
