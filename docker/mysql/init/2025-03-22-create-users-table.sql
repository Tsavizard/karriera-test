-- CREATE TABLE IF NOT EXISTS users (
--     id BINARY(12) PRIMARY KEY,
--     username VARCHAR(20) NOT NULL UNIQUE,
--     email VARCHAR(100) NOT NULL UNIQUE,
--     role VARCHAR(20) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     password_reset_token VARCHAR(255),
--     salt VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

--     INDEX idx_username (username),
--     INDEX idx_email (email)
-- );
