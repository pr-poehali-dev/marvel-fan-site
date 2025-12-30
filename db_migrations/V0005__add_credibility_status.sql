-- Добавление поля credibility_status в таблицу news для живого рейтинга

ALTER TABLE news ADD COLUMN credibility_status VARCHAR(50);

UPDATE news SET credibility_status = 
    CASE 
        WHEN credibility_rating >= 5 THEN 'official'
        WHEN credibility_rating >= 3 THEN 'confirmed_rumor'
        ELSE 'unverified_rumor'
    END;