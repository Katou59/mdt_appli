CREATE TABLE "fines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"label" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(50) NOT NULL,
	"amount" integer NOT NULL,
	"minimal_amount" integer NOT NULL,
	"maximal_amount" integer NOT NULL,
	"jail_time" integer NOT NULL,
	"minimum_jail_time" integer NOT NULL,
	"maximal_jail_time" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fines" ADD CONSTRAINT "fines_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;