CREATE TABLE "community_theme" (
	"id" text PRIMARY KEY NOT NULL,
	"theme_id" text NOT NULL,
	"user_id" text NOT NULL,
	"published_at" timestamp NOT NULL,
	CONSTRAINT "community_theme_theme_id_unique" UNIQUE("theme_id")
);
--> statement-breakpoint
CREATE TABLE "theme_like" (
	"user_id" text NOT NULL,
	"theme_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "theme_like_user_id_theme_id_pk" PRIMARY KEY("user_id","theme_id")
);
--> statement-breakpoint
ALTER TABLE "community_theme" ADD CONSTRAINT "community_theme_theme_id_theme_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."theme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_theme" ADD CONSTRAINT "community_theme_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_like" ADD CONSTRAINT "theme_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_like" ADD CONSTRAINT "theme_like_theme_id_community_theme_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."community_theme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_theme_published_at_idx" ON "community_theme" USING btree ("published_at");
