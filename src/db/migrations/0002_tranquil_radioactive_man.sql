CREATE TABLE "password_reset_tokens" (
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"used_at" timestamp,
	"user_id" text NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;