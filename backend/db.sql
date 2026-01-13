CREATE TABLE artists (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT, image TEXT, birth_date DATE, birth_year_start INTEGER, birth_year_end   INTEGER, death_date DATE, death_year_start INTEGER, death_year_end   INTEGER, CHECK (birth_year_start IS NULL OR birth_year_start <> 0), CHECK (birth_year_end   IS NULL OR birth_year_end   <> 0), CHECK (birth_year_start IS NULL OR birth_year_end IS NULL OR birth_year_end >= birth_year_start), CHECK (birth_date IS NULL OR (birth_year_start IS NULL AND birth_year_end IS NULL)));

CREATE TABLE works_of_arts (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, year INT, description TEXT, picture TEXT);

CREATE TABLE artist_works (artist_id INT NOT NULL, work_of_art_id INT NOT NULL, PRIMARY KEY (artist_id, work_of_art_id), CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE, CONSTRAINT fk_work FOREIGN KEY (work_of_art_id) REFERENCES works_of_arts(id) ON DELETE CASCADE);
