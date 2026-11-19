-- Minimal DDL mirroring the tables the webhook writes to (with this change applied).
CREATE TABLE subscription(id text PRIMARY KEY,status text NOT NULL,"modifiedAt" timestamptz);
