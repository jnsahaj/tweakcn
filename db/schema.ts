import { ThemeStyles } from "@/types/theme";
import {
  pgTable,
  json,
  timestamp,
  boolean,
  text,
  pgEnum,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const theme = pgTable("theme", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  styles: json("styles").$type<ThemeStyles>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const statusEnum = pgEnum("status", ["pending_review", "approved", "rejected"]);
export interface SocialLinks {
  github?: string;
  twitter?: string;
  website?: string;
}

export const community_profile = pgTable("community_profiles", {
  id: text("id").primaryKey(),
  display_name: text("display_name").notNull(),
  bio: text("bio"),
  image: text("image"),
  user_id: text("user_id").references(() => user.id, { onDelete: "set null" }), // Nullable, set null on user delete
  created_at: timestamp("created_at").notNull().defaultNow(),
  claimed_at: timestamp("claimed_at"),
  is_active: boolean("is_active").notNull().default(true),
  social_links: json("social_links").$type<SocialLinks>(),
});

export const community_theme = pgTable("community_themes", {
  id: text("id").primaryKey(),
  community_profile_id: text("community_profile_id")
    .notNull()
    .references(() => community_profile.id, { onDelete: "cascade" }),
  theme_id: text("theme_id")
    .notNull()
    .references(() => theme.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  status: statusEnum("status").notNull().default("pending_review"),
  likes_count: integer("likes_count").notNull().default(0),
});

export const theme_like = pgTable(
  "theme_likes",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    community_theme_id: text("community_theme_id")
      .notNull()
      .references(() => community_theme.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return [primaryKey({ columns: [table.user_id, table.community_theme_id] })];
  }
);

export const theme_moderation = pgTable("theme_moderation", {
  id: text("id").primaryKey(),
  community_theme_id: text("community_theme_id")
    .notNull()
    .references(() => community_theme.id, { onDelete: "cascade" }),
  admin_user_id: text("admin_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }), // Assuming admin is also a user
  status: statusEnum("status").notNull(),
  feedback: text("feedback"),
  moderated_at: timestamp("moderated_at").notNull().defaultNow(),
});
