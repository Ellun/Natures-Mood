DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  user_id SERIAL UNIQUE PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password_digest TEXT
);

CREATE TABLE location (
  location_id SERIAL UNIQUE PRIMARY KEY,
  user_id INT REFERENCES users ON DELETE CASCADE,
  zip INT,
  full_location VARCHAR(255)
);
