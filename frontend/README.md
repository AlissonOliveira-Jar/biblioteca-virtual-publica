# Frontend da Biblioteca Virtual Pública

Este repositório contém o código do frontend da aplicação Biblioteca Virtual Pública, construído com React. Ele permite que utilizadores se cadastrem, façam login, e acedam a uma dashboard protegida.

## Tecnologias Utilizadas

* **React:** Biblioteca JavaScript para construir interfaces de utilizador.
* **React Router DOM:** Para gerir a navegação e o roteamento das páginas da aplicação.
* **Axios:** Cliente HTTP para fazer requisições ao backend.
* **Styled Components:** Para escrever CSS dentro do JavaScript e criar componentes estilizados reutilizáveis.
* **Docker:** Para containerização do ambiente de desenvolvimento e execução.

## Como Configurar e Executar

Este frontend faz parte de uma aplicação maior orquestrada com Docker Compose. Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina.

Para subir a aplicação no nível do diretório biblioteca use:

```base
docker-compose up --build
```

depois acesse a aplicação em:

```curl
localhost:3000
```

## Rotas Principais

A aplicação frontend define as seguintes rotas de navegação:

* `/`: **Landing Page**. A tela inicial para utilizadores não autenticados.
* `/cadastro`: **Tela de Cadastro**. Formulário para novos utilizadores criarem uma conta.
* `/login`: **Tela de Login**. Formulário para utilizadores existentes acederem às suas contas.
* `/dashboard`: **Tela Principal (Protegida)**. A dashboard acessível apenas para utilizadores autenticados. Tentativas de acesso direto sem login serão redirecionadas para a tela de login.

## Fluxo de Autenticação

1. Ao aceder à aplicação (`/`), o utilizador vê a **Landing Page**.
2. A partir da Landing Page (ou diretamente pela URL), o utilizador pode ir para as telas de **Cadastro** ou **Login**.
3. Após um **Login bem-sucedido**, o utilizador é redirecionado para a **Dashboard**. O token JWT é armazenado no Local Storage do navegador.
4. A **Dashboard** só é acessível se houver um token JWT válido no Local Storage (Rota Protegida).
5. Na Dashboard, o utilizador pode clicar em "Sair" (Logout), o que chama o endpoint de logout no backend (para invalidação server-side), remove o token do Local Storage e redireciona para a tela de Login.

## Comunicação com o Backend

O frontend comunica com o backend através de requisições HTTP (usando Axios). A URL base da API do backend é configurada através da variável de ambiente `REACT_APP_API_BASE_URL` no Docker Compose (`http://backend_biblioteca:8080/api`).

## Estilização

A estilização da aplicação é feita utilizando a biblioteca Styled Components, com estilos definidos em arquivos na pasta `src/styles/` para promover a reutilização e a consistência visual.
