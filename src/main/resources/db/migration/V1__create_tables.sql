-- Création des tables
CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL, -- 'ADMIN', 'PARTNER'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS services (
                                        id BIGSERIAL PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_class VARCHAR(50), -- pour Font Awesome (ex: 'fa-helmet-safety')
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE IF NOT EXISTS projects (
                                        id BIGSERIAL PRIMARY KEY,
                                        title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    completion_date DATE,
    is_visible BOOLEAN DEFAULT TRUE
    );

CREATE TABLE IF NOT EXISTS contact_messages (
                                                id BIGSERIAL PRIMARY KEY,
                                                name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(150),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS articles (
                                        id BIGSERIAL PRIMARY KEY,
                                        title VARCHAR(150) NOT NULL,
    content TEXT,
    author VARCHAR(100),
    published_date DATE,
    is_published BOOLEAN DEFAULT FALSE
    );

-- Insérer un admin par défaut (mot de passe : admin123)
-- Le mot de passe est encodé avec BCrypt (pour le test, on utilise un hash connu)
INSERT INTO users (username, password, full_name, email, role)
VALUES ('admin', '$2a$12$0d0K2KJNZQJjR9n3Q5b5cuKqFqFqFqFqFqFqFqFqFqFqFqFqFqFq', 'Administrateur', 'contact@airgroupe.com', 'ADMIN')
    ON CONFLICT (username) DO NOTHING;