ALTER TABLE "Submission" RENAME COLUMN runtTime TO runTime;

ALTER TABLE "Submission" ADD COLUMN user_id BIGINT;
ALTER TABLE "Submission" ADD COLUMN problem_id BIGINT;

ALTER TABLE "Submission" ADD CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT fk_submission_problem FOREIGN KEY (problem_id) REFERENCES "Problem"(id) ON DELETE CASCADE;
