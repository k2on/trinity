import {
    and,
    db,
    desc,
    eq,
    ilike,
    inArray,
    InferSelectModel,
    isNotNull,
    isNull,
    ne,
    notInArray,
    schema,
    sql,
} from "@trinity/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { randomUUID } from "crypto";

export const userRouter = createTRPCRouter({
    me: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.session.user();
    }),
    pushToken: protectedProcedure
        .input(z.object({ token: z.string().or(z.null()) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(schema.users)
                .set({
                    pushToken: input.token,
                    pushTokenUpdatedAt: new Date(),
                })
                .where(eq(schema.users.id, ctx.session.userId));
            return true;
        }),
    block: protectedProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(schema.blockedUsers).values({
                userId: ctx.session.userId,
                blockedUserId: input.userId,
            });
            return true;
        }),
});
