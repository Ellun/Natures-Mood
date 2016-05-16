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
  full_location VARCHAR(255),
  zip INT,
  weather VARCHAR(255),
  temperature VARCHAR(255),
  relative_humidity VARCHAR(255),
  precip_1hr_string VARCHAR(255),
  observation_time VARCHAR(255),
  time_added VARCHAR(255)
);
