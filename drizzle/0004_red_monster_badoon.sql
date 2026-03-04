ALTER TABLE "community_theme" ADD COLUMN "like_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "community_theme" SET "like_count" = (
  SELECT COUNT(*) FROM "theme_like" WHERE "theme_like"."theme_id" = "community_theme"."id"
);--> statement-breakpoint
CREATE INDEX "community_theme_like_count_idx" ON "community_theme" USING btree ("like_count");