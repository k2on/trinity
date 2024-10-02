import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import os from "os";

const tokenDir = path.join(
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
    "koonstack",
);

const tokenPath = path.join(tokenDir, "token");

export const getToken = () => {
    if (!existsSync(tokenPath)) return null;
    const token = readFileSync(tokenPath, "utf-8");
    return token;
};

export const setToken = (token: string) => {
    mkdirSync(tokenDir, { recursive: true });
    writeFileSync(tokenPath, token);
};
