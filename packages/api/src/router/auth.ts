import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { authConfig } from "@trinity/auth";
import { makeRoutes } from "@koons/auth";

const {
    config,
    oauthCallback,
    sendOtp,
    verifyOtp,
    listSessions,
    logout,
    revokeAll,
    revoke,
} = makeRoutes(authConfig);

export const authRouter = createTRPCRouter({
    config: publicProcedure.query(config.query),
    oauthCallback: publicProcedure
        .input(oauthCallback.input)
        .mutation(oauthCallback.mutation),
    sendOtp: publicProcedure.input(sendOtp.input).mutation(sendOtp.mutation),
    verifyOtp: publicProcedure
        .input(verifyOtp.input)
        .mutation(verifyOtp.mutation),
    listSessions: protectedProcedure.query(listSessions.query),
    logout: protectedProcedure.mutation(logout.mutation),
    revokeAll: protectedProcedure.mutation(revokeAll.mutation),
    revoke: protectedProcedure.input(revoke.input).mutation(revoke.mutation),
});
