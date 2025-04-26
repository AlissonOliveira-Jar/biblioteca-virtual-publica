-- public.tb_artigos definição

-- Drop table

-- DROP TABLE public.tb_artigos;

CREATE TABLE public.tb_artigos (
	id uuid NOT NULL,
	created_at timestamptz(6) NOT NULL,
	data_publicacao date NULL,
	doi varchar(255) NOT NULL,
	numero varchar(255) NULL,
	pagina_final int4 NULL,
	pagina_inicial int4 NULL,
	palavras_chave varchar(255) NULL,
	resumo text NULL,
	revista varchar(255) NULL,
	titulo varchar(255) NOT NULL,
	updated_at timestamptz(6) NULL,
	"version" int4 NULL,
	volume varchar(255) NULL,
	CONSTRAINT tb_artigos_pkey PRIMARY KEY (id),
	CONSTRAINT uk7d2r5imyrys3ggvf94j6o32yg UNIQUE (doi)
);


-- public.tb_autores definição

-- Drop table

-- DROP TABLE public.tb_autores;

CREATE TABLE public.tb_autores (
	id uuid NOT NULL,
	biografia text NULL,
	created_at timestamptz(6) NOT NULL,
	data_falescimento date NULL,
	data_nascimento date NULL,
	nacionalidade varchar(255) NULL,
	nome varchar(255) NOT NULL,
	updated_at timestamptz(6) NULL,
	"version" int4 NULL,
	CONSTRAINT tb_autores_pkey PRIMARY KEY (id)
);


-- public.tb_editoras definição

-- Drop table

-- DROP TABLE public.tb_editoras;

CREATE TABLE public.tb_editoras (
	id uuid NOT NULL,
	created_at timestamptz(6) NOT NULL,
	data_fundacao date NULL,
	nome varchar(255) NOT NULL,
	pais varchar(255) NULL,
	updated_at timestamptz(6) NULL,
	"version" int4 NULL,
	website varchar(255) NULL,
	CONSTRAINT tb_editoras_pkey PRIMARY KEY (id),
	CONSTRAINT uklggl5f0ujw78m1lsngk2feers UNIQUE (nome)
);


-- public.tb_users definição

-- Drop table

-- DROP TABLE public.tb_users;

CREATE TABLE public.tb_users (
	id uuid NOT NULL,
	created_at timestamptz(6) NOT NULL,
	email varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	updated_at timestamptz(6) NULL,
	"version" int4 NULL,
	reset_token varchar(255) NULL,
	reset_token_expiry timestamptz(6) NULL,
	CONSTRAINT tb_users_pkey PRIMARY KEY (id),
	CONSTRAINT ukgrd22228p1miaivbn9yg178pm UNIQUE (email)
);
CREATE INDEX idx_user_email ON public.tb_users USING btree (email);


-- public.artigo_autor definição

-- Drop table

-- DROP TABLE public.artigo_autor;

CREATE TABLE public.artigo_autor (
	artigo_id uuid NOT NULL,
	autor_id uuid NOT NULL,
	CONSTRAINT fk8pprie0e5p4eqwtgnm0gci9jx FOREIGN KEY (artigo_id) REFERENCES public.tb_artigos(id),
	CONSTRAINT fkdbjmkaulk7f4vocpltrwsy4ka FOREIGN KEY (autor_id) REFERENCES public.tb_autores(id)
);


-- public.tb_livros definição

-- Drop table

-- DROP TABLE public.tb_livros;

CREATE TABLE public.tb_livros (
	id uuid NOT NULL,
	created_at timestamptz(6) NOT NULL,
	data_publicacao date NULL,
	edicao int4 NULL,
	genero varchar(255) NULL,
	isbn varchar(255) NOT NULL,
	numero_paginas int4 NULL,
	resumo text NULL,
	titulo varchar(255) NOT NULL,
	updated_at timestamptz(6) NULL,
	"version" int4 NULL,
	autor_id uuid NOT NULL,
	editora_id uuid NULL,
	CONSTRAINT tb_livros_pkey PRIMARY KEY (id),
	CONSTRAINT ukjck1rad44tvcnfnymuf4r8cdu UNIQUE (isbn),
	CONSTRAINT fk40pfb5d5wfbssgc5rrjifb27h FOREIGN KEY (editora_id) REFERENCES public.tb_editoras(id),
	CONSTRAINT fk45mpyjglx2a6jh4vyx1vf0gd1 FOREIGN KEY (autor_id) REFERENCES public.tb_autores(id)
);


-- public.user_roles definição

-- Drop table

-- DROP TABLE public.user_roles;

CREATE TABLE public.user_roles (
	user_id uuid NOT NULL,
	roles varchar(255) NULL,
	CONSTRAINT fkq67ct9vcyegsufvaeotuni42d FOREIGN KEY (user_id) REFERENCES public.tb_users(id)
);