ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "display_name" varchar(80);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar(255);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar(255);

ALTER TABLE "users" ALTER COLUMN "display_name" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;