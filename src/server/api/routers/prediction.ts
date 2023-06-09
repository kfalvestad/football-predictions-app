import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const predictionRouter = createTRPCRouter({
  getForFixtures: protectedProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      const predictions = await ctx.prisma.predictions.findMany({
        where: {
          userId: ctx.session.user.id,
          fixtureId: {
            in: input,
          },
        },
      });

      return predictions;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const predictions = await ctx.prisma.predictions.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return predictions;
  }),

  post: protectedProcedure
    .input(
      z.object({
        fixture: z.number(),
        homePrediction: z.number().gte(0).lt(100),
        awayPrediction: z.number().gte(0).lt(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      await prisma.predictions.upsert({
        where: {
          userId_fixtureId: {
            userId: ctx.session.user.id,
            fixtureId: input.fixture,
          },
        },
        update: {
          homeScore: input.homePrediction,
          awayScore: input.awayPrediction,
        },
        create: {
          userId: ctx.session.user.id,
          fixtureId: input.fixture,
          homeScore: input.homePrediction,
          awayScore: input.awayPrediction,
        },
      });
    }),

  postMany: protectedProcedure
    .input(
      z.array(
        z.object({
          fixture: z.number(),
          homePrediction: z.number().gte(0).lt(100),
          awayPrediction: z.number().gte(0).lt(100),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      await prisma.$transaction(
        input.map((prediction) =>
          prisma.predictions.upsert({
            where: {
              userId_fixtureId: {
                userId: ctx.session.user.id,
                fixtureId: prediction.fixture,
              },
            },
            update: {
              homeScore: prediction.homePrediction,
              awayScore: prediction.awayPrediction,
            },
            create: {
              userId: ctx.session.user.id,
              fixtureId: prediction.fixture,
              homeScore: prediction.homePrediction,
              awayScore: prediction.awayPrediction,
            },
          })
        )
      );
    }),
});
