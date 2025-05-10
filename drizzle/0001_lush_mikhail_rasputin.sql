CREATE TYPE "public"."status" AS ENUM('pending_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "community_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"claimed_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"social_links" json
);
--> statement-breakpoint
CREATE TABLE "community_themes" (
	"id" text PRIMARY KEY NOT NULL,
	"community_profile_id" text NOT NULL,
	"name" text NOT NULL,
	"styles" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'pending_review' NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_likes" (
	"user_id" text NOT NULL,
	"community_theme_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "theme_likes_user_id_community_theme_id_pk" PRIMARY KEY("user_id","community_theme_id")
);
--> statement-breakpoint
CREATE TABLE "theme_moderation" (
	"id" text PRIMARY KEY NOT NULL,
	"community_theme_id" text NOT NULL,
	"admin_user_id" text NOT NULL,
	"status" "status" NOT NULL,
	"feedback" text,
	"moderated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "theme" ALTER COLUMN "styles" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "community_profiles" ADD CONSTRAINT "community_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_themes" ADD CONSTRAINT "community_themes_community_profile_id_community_profiles_id_fk" FOREIGN KEY ("community_profile_id") REFERENCES "public"."community_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_likes" ADD CONSTRAINT "theme_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_likes" ADD CONSTRAINT "theme_likes_community_theme_id_community_themes_id_fk" FOREIGN KEY ("community_theme_id") REFERENCES "public"."community_themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_moderation" ADD CONSTRAINT "theme_moderation_community_theme_id_community_themes_id_fk" FOREIGN KEY ("community_theme_id") REFERENCES "public"."community_themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_moderation" ADD CONSTRAINT "theme_moderation_admin_user_id_user_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;