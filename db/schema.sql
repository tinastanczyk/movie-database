DROP DATABASE IF EXISTS movie_db;
CREATE DATABASE movie_db;

USE movie_db;

CREATE TABLE movies(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE reviews(
  id INT NOT NULL AUTO_INCREMENT,
  movie_id INT,
  review TEXT NOT NULL,
  FOREIGN KEY (movie_id)
  REFERENCES movies(id)
  ON DELETE SET NULL,
  PRIMARY KEY(id)
);