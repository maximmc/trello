CREATE TABLE task(
    taskId VARCHAR(255) NOT NULL PRIMARY KEY,
    taskTitle VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    parentId VARCHAR(255) NOT NULL,
    ord INTEGER
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

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE EXTENSION IF NOT EXISTS pgcrypto;