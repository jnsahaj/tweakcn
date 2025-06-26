import { ThemeStyles } from "@/types/theme";
import {
  pgTable,
  json,
  timestamp,
  boolean,
  text,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  isWhitelisted: boolean("is_whitelisted").default(false).notNull(),
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

export const theme = pgTable(
  "theme",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    styles: json("styles").$type<ThemeStyles>().notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    isCommunity: boolean("is_community").default(false).notNull(),
    publishedAt: timestamp("published_at"),
    featured: boolean("featured").default(false).notNull(),
    featuredAt: timestamp("featured_at"),
    likeCount: integer("like_count").default(0).notNull(),
  },
  (table) => [
    index("theme_community_idx").on(table.isCommunity),
    index("theme_featured_idx").on(table.featured),
    index("theme_like_count_idx").on(table.likeCount),
  ]
);

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [index("tag_name_idx").on(table.name), index("tag_slug_idx").on(table.slug)]
);

export const themeTag = pgTable(
  "theme_tag",
  {
    themeId: text("theme_id")
      .notNull()
      .references(() => theme.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.themeId, table.tagId] }),
    index("theme_tag_theme_idx").on(table.themeId),
    index("theme_tag_tag_idx").on(table.tagId),
  ]
);

export const themeLike = pgTable(
  "theme_like",
  {
    themeId: text("theme_id")
      .notNull()
      .references(() => theme.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    likedAt: timestamp("liked_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.themeId, table.userId] }),
    index("theme_like_theme_idx").on(table.themeId),
    index("theme_like_user_idx").on(table.userId),
    index("theme_like_liked_at_idx").on(table.likedAt),
  ]
);
