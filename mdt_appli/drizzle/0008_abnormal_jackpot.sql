ALTER TABLE "citizens" RENAME COLUMN "note" TO "description";--> statement-breakpoint
ALTER TABLE "citizens" ADD COLUMN "eye_color" varchar(50);--> statement-breakpoint
ALTER TABLE "citizens" ADD COLUMN "hair_color" varchar(50);--> statement-breakpoint
ALTER TABLE "citizens" ADD COLUMN "origin" varchar(50);--> statement-breakpoint
ALTER TABLE "citizens" ADD COLUMN "has_tattoo" boolean;--> statement-breakpoint
ALTER TABLE "citizens" DROP COLUMN "license_id";