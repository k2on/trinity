import { defineConfig, type Config } from "drizzle-kit";

function getURI() {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw Error("No database url in .env");
    return uri;
}

export default defineConfig({
  schema: "./src/schema",
  driver: "mysql2",
  dbCredentials: {
    uri: getURI(),
  },
  tablesFilter: ["trinity*"],
});
