import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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