import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";

export type GammeweekWithFixtures = RouterOutputs["gameweek"]["getAll"][number];

export const gameweekRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const gameweeks = await ctx.prisma.gameweek.findMany({
      include: {
        fixtures: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });

    return gameweeks;
  }),
});
