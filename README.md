# 📚 Biblioteca Virtual Pública

> Uma plataforma moderna de leitura, gestão de acervo e interação social, construída com arquitetura de microsserviços e busca de alta performance.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.7-green)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Streaming-black)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Search_Engine-yellow)

## 📖 Sobre o Projeto

A **Biblioteca Virtual Pública** não é apenas um repositório de arquivos; é um ecossistema completo para leitores e bibliotecários. O projeto combina armazenamento seguro de livros (via Google Drive), uma experiência de leitura fluida no navegador e fortes elementos sociais e de gamificação.

O sistema utiliza uma abordagem de banco de dados híbrida (**PostgreSQL** para integridade relacional e **Elasticsearch** para busca textual avançada) e processamento assíncrono via **Kafka** para funcionalidades em tempo real como chat.

## 🚀 Funcionalidades Principais

### 🧠 Core & Acervo
* **Gestão Completa:** CRUD de Livros, Artigos, Autores e Editoras.
* **Busca Inteligente:** Pesquisa *full-text* indexada via Elasticsearch (título, resumo, autor).
* **Streaming de PDF:** Leitura de livros diretamente no navegador sem necessidade de download completo prévio.
* **Integração Google Drive:** Armazenamento seguro e escalável dos arquivos digitais.

### 🎮 Gamificação & Social
* **Sistema de XP:** Ganhe pontos e suba de nível baseando-se no número de páginas lidas.
* **Comentários em Threads:** Discussões aninhadas (estilo Reddit) em livros, com sistema de votos (útil/inútil).
* **Chat em Tempo Real:** Comunicação entre usuários via Apache Kafka.
* **Avaliações e Reviews:** Classificação de 1 a 5 estrelas e resenhas escritas.
* **Rankings:** Tabelas de liderança para usuários mais ativos e livros mais populares.

### 🛡️ Segurança & Moderação
* **Autenticação Híbrida:** Login via OAuth2 (Google) e JWT assinado com chaves RSA.
* **RBAC (Role-Based Access Control):** Perfis de `USER`, `BIBLIOTECARIO` e `ADMIN`.
* **Sistema de Denúncias:** Usuários podem reportar comentários ofensivos para análise da administração.
* **Shadow Ban:** Funcionalidade para banir usuários de comentar sem bloquear o acesso à leitura.

## 🏗️ Arquitetura

O sistema é totalmente conteinerizado com Docker.

## 🛠️ Tecnologias Utilizadas

### Backend
* **Linguagem:** Java 21
* **Framework:** Spring Boot 3.5.7
* **Segurança:** Spring Security (OAuth2 Resource Server), JWT (Nimbus JOSE)
* **Dados:** Spring Data JPA, Spring Data Elasticsearch, Flyway
* **Mensageria:** Apache Kafka
* **Documentação:** SpringDoc OpenAPI (Swagger UI)

### Frontend
* **Framework:** React 19
* **Build Tool:** Vite 7
* **Estilização:** TailwindCSS 4, Radix UI Themes
* **Gerenciamento de Estado/Dados:** React Query (implícito/sugerido), Axios
* **Formulários:** React Hook Form + Zod
* **Utilitários:** React PDF, React Icons

### Infraestrutura
* **Docker & Docker Compose**
* **PostgreSQL 18**
* **Elasticsearch & Kibana 9.2**
* **Zookeeper & Kafka**

## ⚙️ Como Executar

### Pré-requisitos
* Docker e Docker Compose instalados.
* Credenciais do Google Cloud Platform (`credentials.json`) para acesso à Drive API.

### Passo a Passo

### Passo a Passo

1.  **Clone o repositório:**
    Você pode visualizar o repositório [clicando aqui](https://github.com/AlissonOliveira-Jar/biblioteca-virtual-publica), ou rodar o comando abaixo para baixar:
    ```bash
    git clone https://github.com/AlissonOliveira-Jar/biblioteca-virtual-publica.git
    cd biblioteca-virtual-publica
    ```

2.  **Configuração de Ambiente:**
    Crie um arquivo `.env` na raiz do backend ou configure as variáveis no `docker-compose.yml`:
    ```env
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=biblioteca_virtual
    GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
    ```
    *Certifique-se de colocar o arquivo `google-drive-credentials.json` na raiz do projeto conforme mapeado no volume do Docker.*

3.  **Subir a Infraestrutura:**
    ```bash
    docker-compose up -d --build
    ```

4.  **Acessar a Aplicação:**
    * **Frontend:** `http://localhost:3000`
    * **Backend API:** `http://localhost:8080`
    * **Swagger (Doc):** `http://localhost:8080/swagger-ui.html`
    * **Kibana (Logs/Busca):** `http://localhost:5601`

## 🧪 Documentação da API

A API segue o padrão RESTful e está documentada via Swagger. Após subir o backend, acesse `/swagger-ui.html` para testar os endpoints de:
* `/api/auth` (Autenticação)
* `/api/livros` & `/api/artigos` (Acervo)
* `/api/chat` (Mensagens)
* `/api/gamificacao` (Pontuação)

---
**Desenvolvido por [Alisson Oliveira](https://github.com/AlissonOliveira-Jar), [Eduardo Semeâo](https://github.com/Eduardo-exe-hash) e [Murilo Aragão](https://github.com/Murilo751).**
