CREATE Table user (
    id INT NOT NULL AUTO_INCREMENT,
    username text not NULL,
    email text not NULL,
    p_hash text not NULL,
    PRIMARY KEY (id)
);

CREATE Table posts (
    id INT NOT NULL AUTO_INCREMENT,
    content text not NULL,
    likes INT not NULL,
    author INT NOT NULL,
    time TIMESTAMP not NULL Default CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES user(id)
);