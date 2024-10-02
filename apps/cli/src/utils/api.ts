import type { AppRouter } from "@trinity/api";
import { createTRPCProxyClient, httpLink, TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";
import { getToken } from "./store";

export const getBaseUrl = () => {
    const useProd = false;

    const devUrl = `http://localhost:8081`;

    return process.env.NODE_ENV == "production" || useProd
        ? "https://trinity.li"
        : devUrl;
};

export const api = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpLink({
            url: `${getBaseUrl()}/api/trpc`,
            async headers() {
                const headers = new Map<string, string>();
                headers.set("x-trpc-source", "cli");
                const token = getToken();
                if (token) headers.set("Authorization", token);
                return Object.fromEntries(headers);
            },
        }),
    ],
});
