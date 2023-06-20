import { z } from "zod";

export const predictionSchema = z.object({
  userId: z.string(),
  fixtureId: z.number(),
  homeScore: z.number(),
  awayScore: z.number(),
});

export type Prediction = z.infer<typeof predictionSchema>;
