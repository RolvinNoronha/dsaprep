CREATE TABLE "Submission" (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    languageId INTEGER NOT NULL,
    error TEXT,
    runtTime FLOAT,
    memory FLOAT,
    message TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    testCase TEXT,
    yourOutput TEXT,
    expectedOutput TEXT
);