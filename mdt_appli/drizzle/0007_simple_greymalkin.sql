ALTER TABLE "users" RENAME COLUMN "role" TO "role_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;