import React from "react";
import Constants from "expo-constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink, TRPCLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import { observable } from "@trpc/server/observable";

import type { AppRouter } from "@trinity/api";

import { Platform } from "react-native";
import { queryClient } from "./query";
import { store } from "./store";
// import { useAuth } from "./auth";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@trinity/api";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
    /**
     * Gets the IP address of your host-machine. If it cannot automatically find it,
     * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
     * you don't have anything else running on it, or you'd have to change it.
     *
     * **NOTE**: This is only for development. In production, you'll want to set the
     * baseUrl to your production API URL.
     */

    const useProd = false;

    const devBase = Constants.expoConfig?.hostUri ?? "localhost:8081";
    const devUrl = `http://${devBase}`;

    return process.env.NODE_ENV == "production" || useProd
        ? Platform.OS == "web"
            ? window.location.origin
            : "https://trinity.li"
        : devUrl;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

export function TRPCProvider(props: { children: React.ReactNode }) {
    const { data: token } = store.getToken.useQuery();
    const trpcClient = api.createClient({
        transformer: superjson,
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
                headers: async () => {
                    const headers = new Map<string, string>();
                    headers.set("x-trpc-source", "expo-react");
                    if (token) headers.set("Authorization", token);
                    return Object.fromEntries(headers);
                },
            }),
            loggerLink({
                enabled: (opts) =>
                    process.env.NODE_ENV === "development" ||
                    (opts.direction === "down" && opts.result instanceof Error),
                colorMode: "ansi",
            }),
        ],
    });

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            {props.children}
        </api.Provider>
    );
}
