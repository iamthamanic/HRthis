-- Initialisierung der gemeinsamen PostgreSQL-Datenbank
-- Erstelle separate Datenbanken für verschiedene Anwendungen

-- HRThis Datenbank
CREATE DATABASE hrthis_db;
CREATE USER hrthis_user WITH ENCRYPTED PASSWORD 'hrthis_password';
GRANT ALL PRIVILEGES ON DATABASE hrthis_db TO hrthis_user;

-- Weitere Anwendungen können hier hinzugefügt werden
-- Beispiel für weitere Apps:
-- CREATE DATABASE app2_db;
-- CREATE USER app2_user WITH ENCRYPTED PASSWORD 'app2_password';
-- GRANT ALL PRIVILEGES ON DATABASE app2_db TO app2_user;

-- CREATE DATABASE app3_db;
-- CREATE USER app3_user WITH ENCRYPTED PASSWORD 'app3_password';
-- GRANT ALL PRIVILEGES ON DATABASE app3_db TO app3_user;