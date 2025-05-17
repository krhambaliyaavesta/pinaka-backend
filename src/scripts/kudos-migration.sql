-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teams table
CREATE TABLE
    IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

-- Create categories table
CREATE TABLE
    IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

-- Create kudos_cards table
CREATE TABLE
    IF NOT EXISTS kudos_cards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        recipient_name VARCHAR(255) NOT NULL,
        team_id INTEGER NOT NULL REFERENCES teams (id),
        category_id INTEGER NOT NULL REFERENCES categories (id),
        message TEXT NOT NULL,
        created_by UUID NOT NULL REFERENCES users (id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW (),
        deleted_at TIMESTAMP
    );

-- Create index for optimizing filtering by team
CREATE INDEX IF NOT EXISTS kudos_cards_team_id_idx ON kudos_cards (team_id);

-- Create index for optimizing filtering by category
CREATE INDEX IF NOT EXISTS kudos_cards_category_id_idx ON kudos_cards (category_id);

-- Create index for optimizing filtering by creator
CREATE INDEX IF NOT EXISTS kudos_cards_created_by_idx ON kudos_cards (created_by);

-- Create index for optimizing filtering by creation date
CREATE INDEX IF NOT EXISTS kudos_cards_created_at_idx ON kudos_cards (created_at);

-- Create index for optimizing filtering by recipient
CREATE INDEX IF NOT EXISTS kudos_cards_recipient_name_idx ON kudos_cards (recipient_name);

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS kudos_cards_deleted_at_idx ON kudos_cards (deleted_at);

-- Insert default teams
INSERT INTO
    teams (name)
VALUES
    ('Engineering'),
    ('Product'),
    ('Design'),
    ('Marketing'),
    ('Sales'),
    ('Customer Support'),
    ('Operations'),
    ('Human Resources'),
    ('Finance') ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO
    categories (name)
VALUES
    ('Teamwork'),
    ('Innovation'),
    ('Helping Hand'),
    ('Problem Solving'),
    ('Leadership'),
    ('Customer Focus'),
    ('Quality Work'),
    ('Above and Beyond') ON CONFLICT (name) DO NOTHING;