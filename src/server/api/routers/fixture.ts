import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";

export type FixtureWithTeams =
  RouterOutputs["fixture"]["getGWFixtures"][number];

export const fixtureRouter = createTRPCRouter({
  getGWFixtures: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const fixtures = await ctx.prisma.fixture.findMany({
        where: {
          gameweekNumber: input,
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });

      return fixtures;
    }),
});
