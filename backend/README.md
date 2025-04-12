# Biblioteca Virtual Pública (backend)

Este projeto é uma aplicação backend para uma biblioteca virtual pública. 
Ele fornece um sistema completo de cadastro, login e manipulação de usuários por operações CRUD.

## Pré-requisitos:

* **Java 21** (Utilizando Liberica JDK)
* **Docker** (Se for windows é Docker Hub, se for Linux tem que ser Docker e Docker Compose).
* **PostgreSQL** (não é necessário instalar, o banco será executado automaticamente via Docker Compose).

## Executar o Projeto:

Como entre as depedências do projeto tem `spring-boot-docker-compose`, 
basta executar o projeto no arquivo `BibliotecaApplication`, 
que automaticamente o serviço do compose executará o banco de dados PostgreSQL.

Por padrão o serviço estará disponível em `http://localhost:8080`.

Usuário Administrador será criado automáticamente, 
para saber ou alterar informações, elas estão em `application.properties`.
