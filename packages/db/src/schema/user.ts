import { relations, sql } from "drizzle-orm";
import {
    index,
    int,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";

import { createTable } from "./_table";
import { uuid } from "../util";

export const users = createTable("user", {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 256 }),
    profileImageUrl: varchar("profileImageUrl", { length: 256 }),
    pushToken: varchar("pushToken", { length: 256 }),
    pushTokenUpdatedAt: timestamp("pushTokenUpdatedAt"),
    createdAt: timestamp("createdAt")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updatedAt"),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
}));

export const accounts = createTable(
    "account",
    {
        userId: varchar("userId", { length: 255 }).notNull(),
        // .references(() => users.id),
        type: varchar("type", { length: 255 })
            .$type<"email" | "oauth" | "oidc">()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_userId_idx").on(account.userId),
    }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        sessionToken: varchar("sessionToken", { length: 255 }).notNull(),
        userId: varchar("userId", { length: 255 }).notNull(),
        // .references(() => users.id),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        agent: text("agent").notNull(),
        ip: varchar("ip", { length: 255 }).notNull(),
        createdAt: timestamp("createdAt")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        lastUsedAt: timestamp("lastUsedAt"),
        revokedAt: timestamp("revokedAt"),
    },
    (session) => ({
        userIdIdx: index("session_userId_idx").on(session.userId),
    }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const blockedUsers = createTable(
    "blockedUsers",
    {
        userId: uuid("userId").notNull(),
        blockedUserId: uuid("blockedUserId").notNull(),
        createdAt: timestamp("createdAt")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (blockedUsers) => ({
        compoundKey: primaryKey({
            columns: [blockedUsers.userId, blockedUsers.blockedUserId],
        }),
    }),
);
