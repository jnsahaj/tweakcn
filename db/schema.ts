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
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  styles: json("styles").$type<ThemeStyles>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const aiUsage = pgTable("ai_usage", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  modelId: text("model_id").notNull(),
  promptTokens: text("prompt_tokens").notNull().default("0"),
  completionTokens: text("completion_tokens").notNull().default("0"),
  daysSinceEpoch: text("days_since_epoch").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  modifiedAt: timestamp("modifiedAt"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  recurringInterval: text("recurringInterval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: timestamp("canceledAt"),
  startedAt: timestamp("startedAt").notNull(),
  endsAt: timestamp("endsAt"),
  endedAt: timestamp("endedAt"),
  customerId: text("customerId").notNull(),
  productId: text("productId").notNull(),
  discountId: text("discountId"),
  checkoutId: text("checkoutId").notNull(),
  customerCancellationReason: text("customerCancellationReason"),
  customerCancellationComment: text("customerCancellationComment"),
  metadata: text("metadata"), // JSON string
  customFieldData: text("customFieldData"), // JSON string
  userId: text("userId").references(() => user.id),
});

// OAuth 2.0 tables

export const oauthApp = pgTable("oauth_app", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientId: text("client_id").notNull().unique(),
  clientSecretHash: text("client_secret_hash").notNull(),
  redirectUris: json("redirect_uris").$type<string[]>().notNull(),
  scopes: json("scopes").$type<string[]>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const oauthAuthorizationCode = pgTable("oauth_authorization_code", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  appId: text("app_id")
    .notNull()
    .references(() => oauthApp.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  scopes: json("scopes").$type<string[]>().notNull(),
  redirectUri: text("redirect_uri").notNull(),
  codeChallenge: text("code_challenge"),
  codeChallengeMethod: text("code_challenge_method"),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull(),
});

export const oauthToken = pgTable("oauth_token", {
  id: text("id").primaryKey(),
  accessTokenHash: text("access_token_hash").notNull().unique(),
  refreshTokenHash: text("refresh_token_hash").unique(),
  appId: text("app_id")
    .notNull()
    .references(() => oauthApp.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  scopes: json("scopes").$type<string[]>().notNull(),
  accessTokenExpiresAt: timestamp("access_token_expires_at").notNull(),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Community themes

export const communityTheme = pgTable(
  "community_theme",
  {
    id: text("id").primaryKey(),
    themeId: text("theme_id")
      .notNull()
      .unique()
      .references(() => theme.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    publishedAt: timestamp("published_at").notNull(),
  },
  (table) => [index("community_theme_published_at_idx").on(table.publishedAt)]
);

export const themeLike = pgTable(
  "theme_like",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    themeId: text("theme_id")
      .notNull()
      .references(() => communityTheme.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.themeId] })]
);
