import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const predictionRouter = createTRPCRouter({
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

      try {
        await prisma.predictions.update({
          where: {
            userId_fixtureId: {
              userId: ctx.session.user.id,
              fixtureId: input.fixture,
            },
          },
          data: {
            homeScore: input.homePrediction,
            awayScore: input.awayPrediction,
          },
        });
      } catch (error) {
        /*         await prisma.predictions.create({
          data: {
            userId: ctx.session.user.id,
            fixtureId: input.fixture,
            homeScore: input.homePrediction,
            awayScore: input.awayPrediction,
          },
        }); */
        console.log(error);
      }
    }),
});
