-- Создание таблиц для интерактивной хронологии Marvel

-- Таблица фаз MCU
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица персонажей
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    real_name VARCHAR(200),
    description TEXT,
    image_url TEXT,
    first_appearance VARCHAR(200),
    actor VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица фильмов и сериалов
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    release_date DATE,
    chronological_order INTEGER,
    phase_id INTEGER REFERENCES phases(id),
    content_type VARCHAR(50) NOT NULL,
    image_url TEXT,
    duration_minutes INTEGER,
    director VARCHAR(200),
    box_office BIGINT,
    rating DECIMAL(3,1),
    universe VARCHAR(50) DEFAULT 'MCU',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Связь фильмов и персонажей (many-to-many)
CREATE TABLE movie_characters (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    character_id INTEGER REFERENCES characters(id),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(movie_id, character_id)
);

-- Таблица пасхалок и связей между фильмами
CREATE TABLE easter_eggs (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    timestamp_minutes INTEGER,
    references_movie_id INTEGER REFERENCES movies(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_movies_phase ON movies(phase_id);
CREATE INDEX idx_movies_chronological ON movies(chronological_order);
CREATE INDEX idx_movies_release_date ON movies(release_date);
CREATE INDEX idx_movie_characters_movie ON movie_characters(movie_id);
CREATE INDEX idx_movie_characters_character ON movie_characters(character_id);
CREATE INDEX idx_easter_eggs_movie ON easter_eggs(movie_id);