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
  zip INT UNIQUE,
  full_location VARCHAR(255),
  weather VARCHAR(255),
  temperature VARCHAR(255),
  time_added VARCHAR(255)
);
