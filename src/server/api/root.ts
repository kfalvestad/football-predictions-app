import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { gameweekRouter } from "./routers/gameweek";
import { predictionRouter } from "./routers/prediction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  gameweek: gameweekRouter,
  prediction: predictionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
