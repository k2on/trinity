import { varchar } from "drizzle-orm/mysql-core";

export const uuid = (name?: string) => varchar(name || "id", { length: 191 });
