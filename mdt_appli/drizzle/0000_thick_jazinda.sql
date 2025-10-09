CREATE TABLE "blood_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blood_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citizens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"birth_date" varchar(20),
	"birth_place" varchar(100),
	"nationality_id" integer,
	"height" integer,
	"weight" integer,
	"phone_number" varchar(50),
	"license_id" varchar(50),
	"job" varchar(50),
	"address" varchar(250),
	"city" varchar(100),
	"is_wanted" boolean DEFAULT false,
	"wanted_level" integer DEFAULT 0,
	"note" varchar(255),
	"photo_url" varchar(255),
	"created_by" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(50),
	"status_id" integer,
	"blood_type_id" integer,
	"gender_id" integer
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jobs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nationalities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "nationalities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ranks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL,
	"job_id" integer DEFAULT 1 NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "statuses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"email" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_login" timestamp with time zone,
	"last_login" timestamp with time zone,
	"number" integer,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"phone_number" varchar(50),
	"is_disable" boolean DEFAULT false,
	"job_id" integer,
	"rank_id" integer,
	"role" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_nationality_id_nationalities_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."nationalities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_blood_type_id_blood_types_id_fk" FOREIGN KEY ("blood_type_id") REFERENCES "public"."blood_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizens" ADD CONSTRAINT "citizens_gender_id_genders_id_fk" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranks" ADD CONSTRAINT "ranks_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_rank_id_ranks_id_fk" FOREIGN KEY ("rank_id") REFERENCES "public"."ranks"("id") ON DELETE no action ON UPDATE no action;