DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  user_id SERIAL UNIQUE PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password_digest TEXT
);
