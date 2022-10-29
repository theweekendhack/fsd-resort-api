CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name varchar(50)  NOT NULL,
    last_name varchar(50)  NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    date_created timestamp DEFAULT CURRENT_TIMESTAMP,
    isadmin boolean DEFAULT false
);


CREATE TABLE resorts (
    id SERIAL PRIMARY KEY,
    title varchar(75) UNIQUE NOT NULL,
    description text NOT NULL,
    type varchar(50)  NOT NULL,
    rules text,
    location varchar(50) NOT NULL,
    photo_url text NOT NULL,
    bestseller boolean default false,
    price  numeric(7,2) NOT NULL,
    date_created timestamp DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users
  
);

