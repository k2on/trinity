import {
    MySqlColumn,
    MySqlDatabase,
    MySqlTableWithColumns,
} from "drizzle-orm/mysql-core";
import { and, db, eq, isNull, schema } from "@trinity/db";
import {
    createConfig,
    Adapter,
    Account,
    SessionForUser,
    SessionObj,
    User,
} from "@koons/auth";

export class Planetscale extends Adapter {
    constructor(
        private config: {
            db: MySqlDatabase<any, any>;
            users: MySqlUserTable;
            sessions: MySqlSessionTable;
            accounts: MySqlAccountTable;
        },
    ) {
        super();
    }

    async getSessionFromTokenAndUpdateLastUsedAt(
        token: string,
    ): Promise<SessionObj[] | null> {
        const where = and(
            eq(this.config.sessions.sessionToken, token),
            isNull(this.config.sessions.revokedAt),
        );
        await this.config.db
            .update(this.config.sessions)
            .set({ lastUsedAt: new Date() })
            .where(where);
        return await this.config.db
            .select()
            .from(this.config.sessions)
            .where(where);
    }

    async getUserFromId(id: string): Promise<User | null> {
        const [user] = await this.config.db
            .select()
            .from(this.config.users)
            .where(eq(this.config.users.id, id));
        return user || null;
    }

    async getAccountFromProviderAccountId(options: {
        provider: string;
        userId: string;
    }): Promise<Account | null> {
        const [account] = await this.config.db
            .select()
            .from(this.config.accounts)
            .where(
                and(
                    eq(this.config.accounts.provider, options.provider),
                    eq(this.config.accounts.providerAccountId, options.userId),
                ),
            );
        return account || null;
    }

    async getUserFromEmail(email: string): Promise<User | null> {
        const [user] = await this.config.db
            .select()
            .from(this.config.users)
            .where(eq(this.config.users.email, email));
        return user || null;
    }

    async createUser(
        input:
            | {
                  id: string;
                  name: string;
                  email: string;
                  phone: string | null;
                  profileImageUrl: string | null;
              }
            | {
                  id: string;
                  name: string;
                  email: string | null;
                  phone: string;
                  profileImageUrl: string | null;
              },
    ): Promise<void> {
        await this.config.db.insert(this.config.users).values(input);
    }

    async createAccount(input: {
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string;
        expires_at: number;
        token_type: string;
        scope: string;
        id_token: any;
        session_state: any;
    }): Promise<void> {
        await this.config.db.insert(this.config.accounts).values(input);
    }

    async createSession(input: {
        id: string;
        userId: string;
        sessionToken: string;
        expires: Date;
        agent: string;
        ip: string;
    }): Promise<void> {
        await this.config.db.insert(this.config.sessions).values(input);
    }

    async getSessionsForUser(userId: string): Promise<SessionForUser[]> {
        return await this.config.db
            .select({
                id: this.config.sessions.id,
                agent: this.config.sessions.agent,
                ip: this.config.sessions.ip,
                expires: this.config.sessions.expires,
                createdAt: this.config.sessions.createdAt,
                lastUsedAt: this.config.sessions.lastUsedAt,
            })
            .from(this.config.sessions)
            .where(
                and(
                    eq(this.config.sessions.userId, userId),
                    isNull(this.config.sessions.revokedAt),
                ),
            );
    }

    async revokeSession(id: string): Promise<void> {
        await this.config.db
            .update(this.config.sessions)
            .set({ revokedAt: new Date() })
            .where(eq(this.config.sessions.id, id));
    }

    async revokeAllFromUser(id: string): Promise<void> {
        await this.config.db
            .update(this.config.sessions)
            .set({ revokedAt: new Date() })
            .where(eq(this.config.sessions.userId, id));
    }

    async getSessionForUserFromId(options: {
        sessionId: string;
        userId: string;
    }): Promise<SessionObj | null> {
        const [session] = await this.config.db
            .select()
            .from(this.config.sessions)
            .where(
                and(
                    eq(this.config.sessions.id, options.sessionId),
                    eq(this.config.sessions.userId, options.userId),
                ),
            );
        return session || null;
    }

    async getAccountForProviderByUserId(options: {
        userId: string;
        provider: string;
    }): Promise<Account | null> {
        const [account] = await this.config.db
            .select()
            .from(this.config.accounts)
            .where(
                and(
                    eq(this.config.accounts.userId, options.userId),
                    eq(this.config.accounts.provider, options.provider),
                ),
            );
        return account || null;
    }

    async getUserFromPhone(phone: string): Promise<User | null> {
        const [user] = await this.config.db
            .select()
            .from(this.config.users)
            .where(eq(this.config.users.phone, phone));
        return user || null;
    }
}

export interface Register {}

export type UserId = Register extends {
    UserId: infer _UserId;
}
    ? _UserId
    : string;

export type MySqlUserTable = MySqlTableWithColumns<{
    dialect: "mysql";
    columns: {
        id: MySqlColumn<
            {
                name: any;
                tableName: any;
                dataType: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                notNull: true;
                hasDefault: boolean; // must be boolean instead of any to allow default values
                enumValues: any;
                baseColumn: any;
            },
            {}
        >;
        name: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        email: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        phone: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        profileImageUrl: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
    };
    schema: any;
    name: any;
}>;

export type MySqlSessionTable = MySqlTableWithColumns<{
    dialect: "mysql";
    columns: {
        id: MySqlColumn<
            {
                name: any;
                tableName: any;
                dataType: any;
                columnType: any;
                data: string;
                driverParam: any;
                notNull: true;
                hasDefault: boolean; // must be boolean instead of any to allow default values
                enumValues: any;
                baseColumn: any;
            },
            {}
        >;
        createdAt: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: Date;
                driverParam: any;
                hasDefault: true;
                name: any;
            },
            {}
        >;
        revokedAt: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: Date;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        lastUsedAt: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: Date;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        expires: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: Date;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        sessionToken: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        userId: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: UserId;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        ip: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        agent: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
    };
    schema: any;
    name: any;
}>;

export type MySqlAccountTable = MySqlTableWithColumns<{
    dialect: "mysql";
    columns: {
        userId: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        provider: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        providerAccountId: MySqlColumn<
            {
                dataType: any;
                notNull: true;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        access_token: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        refresh_token: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        expires_at: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: number;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
        scope: MySqlColumn<
            {
                dataType: any;
                notNull: false;
                enumValues: any;
                tableName: any;
                columnType: any;
                data: string;
                driverParam: any;
                hasDefault: false;
                name: any;
            },
            {}
        >;
    };
    schema: any;
    name: any;
}>;
