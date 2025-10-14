CREATE TABLE "histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50),
	"entity_type" varchar(50),
	"entity_id" varchar(50),
	"action" varchar(50),
	"old_data" jsonb,
	"new_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_histories_entity_id" ON "histories" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "idx_histories_entity_type" ON "histories" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "idx_histories_action" ON "histories" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_histories_user_id" ON "histories" USING btree ("user_id");