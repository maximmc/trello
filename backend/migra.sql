CREATE TABLE task(
    taskId VARCHAR(255) NOT NULL,
    taskTitle VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    parentId VARCHAR(255) NOT NULL,
    ord INTEGER PRIMARY KEY
);

CREATE TABLE users(
    tableId SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pass VARCHAR(255)
);

CREATE TABLE card(
    cardId VARCHAR(255) NOT NULL,
    cardTitle VARCHAR(255),
    userId VARCHAR(255) NOT NULL
);