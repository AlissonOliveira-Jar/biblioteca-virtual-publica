# Biblioteca Virtual Pública (backend)

Este projeto é uma aplicação backend para uma biblioteca virtual pública. 
Ele fornece um sistema completo de cadastro, login e manipulação de usuários por operações CRUD.

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
