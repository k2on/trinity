import { db, schema } from "@trinity/db";
import { createConfig } from "@koons/auth";
import { Planetscale } from "./planetscale";
import { Google } from "./google";

const google = Google({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "ND",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "ND",
});

export const authConfig = createConfig({
    db: new Planetscale({
        db,
        users: schema.users,
        sessions: schema.sessions,
        accounts: schema.accounts,
    }),
    providers: {
        oauth: { google },
    },
});
