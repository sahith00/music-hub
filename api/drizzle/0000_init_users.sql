CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL
);
