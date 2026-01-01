CREATE TABLE "Problem" (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    exampleTestCases TEXT,
    constraints TEXT
);
