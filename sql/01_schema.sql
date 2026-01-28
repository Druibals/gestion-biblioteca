/**
 * ***Initial Schema Documentation***
 * 
 * Descripción:
 * schema.ddl es un archivo o módulo que contiene definiciones de estructura 
 * de base de datos utilizando lenguaje DDL (Data Definition Language).
 * 
 * Propósito:
 * - Definir la estructura de tablas, índices, vistas y otros objetos de base de datos
 * - Establecer relaciones entre entidades mediante claves primarias y foráneas
 * - Especificar restricciones de datos (NOT NULL, UNIQUE, CHECK, etc.)
 * - Documentar el esquema lógico de la base de datos
 * - Facilitar la creación reproducible y versionable de la estructura DB
 * - Servir como base para migraciones y actualizaciones de esquema
 */


-- Tabla: authors
 CREATE TABLE authors
(
    author_id bigint GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    CONSTRAINT pk_authors PRIMARY KEY (author_id)
);

-- Tabla: users
CREATE TABLE users
(
    user_id bigint GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    email text NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Tabla: books
CREATE TABLE books
(
    book_id bigint GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    publish_year integer NOT NULL,
    author_id bigint NOT NULL,
    CONSTRAINT pk_books PRIMARY KEY (book_id),
    CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors (author_id),
    CONSTRAINT chk_books_publish_year CHECK (publish_year BETWEEN 1000 AND EXTRACT(YEAR FROM CURRENT_DATE))
);
CREATE INDEX ix_books_author_id ON books(author_id);

-- Tabla: copies
CREATE TABLE copies
(
    copy_id bigint GENERATED ALWAYS AS IDENTITY,
    copy_code text NOT NULL,
    book_id bigint NOT NULL,
    CONSTRAINT pk_copies PRIMARY KEY (copy_id),
    CONSTRAINT fk_copies_book FOREIGN KEY (book_id) REFERENCES books (book_id),
    CONSTRAINT uq_copies_copy_code UNIQUE (copy_code),
    CONSTRAINT chk_copies_copy_code CHECK (LENGTH(copy_code) > 0)
);
CREATE INDEX ix_copies_book_id ON copies(book_id);

-- Tabla: loans
CREATE TABLE loans
(
    loan_id bigint GENERATED ALWAYS AS IDENTITY,
    loan_date date DEFAULT CURRENT_DATE NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT pk_loans PRIMARY KEY (loan_id),
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT chk_loans_loan_date CHECK (loan_date <= CURRENT_DATE)
);
CREATE INDEX ix_loans_user_id ON loans(user_id);

-- Tabla: loan_items
CREATE TABLE loan_items
(
    loan_item_id bigint GENERATED ALWAYS AS IDENTITY,
    loan_id bigint NOT NULL,
    copy_id bigint NOT NULL,
    due_date date NOT NULL,
    return_date date,
    CONSTRAINT pk_loan_items PRIMARY KEY (loan_item_id),
    CONSTRAINT fk_loan_items_loan FOREIGN KEY (loan_id) REFERENCES loans (loan_id),
    CONSTRAINT fk_loan_items_copy FOREIGN KEY (copy_id) REFERENCES copies (copy_id),
    CONSTRAINT uq_loan_items_loan_copy UNIQUE (loan_id, copy_id)
);
CREATE INDEX ix_loan_items_loan_id ON loan_items(loan_id);
CREATE INDEX ix_loan_items_copy_id ON loan_items(copy_id);

CREATE UNIQUE INDEX uix_loan_items_active
ON loan_items(copy_id)
WHERE return_date IS NULL;

