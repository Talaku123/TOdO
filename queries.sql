CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(1000) NOT NULL,
  date CHAR(31) NOT NULL  
);

 CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(1000) NOT NULL,
  date  CHAR(31) NOT NULL  
);