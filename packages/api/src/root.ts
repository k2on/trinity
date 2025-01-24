import { authRouter } from "./router/auth";
import { friendsRouter } from "./router/friends";
import { postRouter } from "./router/post";
import { serviceRouter } from "./router/service";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  service: serviceRouter,
  friends: friendsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
