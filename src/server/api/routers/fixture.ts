import { useSession } from "next-auth/react";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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

      const fixturesWithPredictions = fixtures.map((f) => {
        const prediction = null;

        return {
          ...f,
          prediction,
        };
      });

      return fixturesWithPredictions;
    }),

  getGWFixturesWithPredictions: protectedProcedure
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

      const fixIds = fixtures.map((f) => f.fixtureId);

      const predictions = await ctx.prisma.predictions.findMany({
        where: {
          userId: ctx.session.user.id,
          fixtureId: {
            in: fixIds,
          },
        },
      });

      const fixturesWithPredictions = fixtures.map((f) => {
        const prediction = predictions.find((p) => p.fixtureId === f.fixtureId);

        return {
          ...f,
          prediction,
        };
      });

      return fixturesWithPredictions;
    }),
});
