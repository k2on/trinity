import { TRPCRouterRecord } from "@trpc/server";

import { and, count, eq, gt, ne } from "@acme/db";
import { CalendarService, User } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const friendsRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: User.id,
        name: User.name,
        image: User.image,
      })
      .from(User)
      .leftJoin(CalendarService, eq(User.id, CalendarService.userId))
      .where(ne(User.id, ctx.session.user.id))
      .groupBy(User.id)
      .having(gt(count(CalendarService.id), 0));
  }),
} satisfies TRPCRouterRecord;
