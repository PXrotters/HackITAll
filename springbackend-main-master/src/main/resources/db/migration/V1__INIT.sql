-- schema_banking_core.sql

-- OPTIONAL: Drop tables if they already exist (order matters)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS users;
-- Drop old tables if they exist
DROP TABLE IF EXISTS offered_book;
DROP TABLE IF EXISTS offer;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS roles;

------------------------------------------------------------
-- 1. USERS
------------------------------------------------------------
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL, -- Changed from password_hash to match code expectation of 'password'
    full_name       VARCHAR(100),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP
);

------------------------------------------------------------
-- 2. BANK_ACCOUNTS
------------------------------------------------------------
CREATE TABLE bank_accounts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    iban        VARCHAR(34) UNIQUE,
    currency    VARCHAR(3)  NOT NULL,          -- ex: 'RON', 'EUR'
    balance     DECIMAL(18,2) NOT NULL DEFAULT 0,
    name        VARCHAR(50),                   -- ex: 'Cont principal'
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_bank_accounts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 3. CATEGORIES
------------------------------------------------------------
CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,         -- ex: 'Food', 'Transport'
    type        VARCHAR(20)  NOT NULL,         -- 'EXPENSE' / 'INCOME'
    icon        VARCHAR(50),                   -- optional, doar pt UI
    user_id     BIGINT,                        -- NULL = categorie globala

    CONSTRAINT fk_categories_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

------------------------------------------------------------
-- 4. TRANSACTIONS
------------------------------------------------------------
CREATE TABLE transactions (
    id               BIGSERIAL PRIMARY KEY,
    account_id       BIGINT      NOT NULL,
    type             VARCHAR(20) NOT NULL,     -- 'DEBIT' / 'CREDIT'
    amount           DECIMAL(18,2) NOT NULL,
    description      VARCHAR(255),
    category_id      BIGINT,
    transaction_date TIMESTAMP    NOT NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id) REFERENCES bank_accounts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transactions_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
);
