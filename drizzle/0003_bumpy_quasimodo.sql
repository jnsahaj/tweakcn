CREATE TABLE "community_theme_tag" (
	"community_theme_id" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "community_theme_tag_community_theme_id_tag_pk" PRIMARY KEY("community_theme_id","tag")
);
--> statement-breakpoint
ALTER TABLE "community_theme_tag" ADD CONSTRAINT "community_theme_tag_community_theme_id_community_theme_id_fk" FOREIGN KEY ("community_theme_id") REFERENCES "public"."community_theme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_theme_tag_tag_idx" ON "community_theme_tag" USING btree ("tag");