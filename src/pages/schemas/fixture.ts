import { z } from "zod";
import { teamSchema } from "./team";
import { predictionSchema } from "./prediction";

export const fixtureSchema = z.object({
  fixtureId: z.number(),
  homeTeamId: z.number(),
  awayTeamId: z.number(),
  homeTeam: teamSchema,
  awayTeam: teamSchema,
  homeTeamScore: z.number().nullable(),
  awayTeamScore: z.number().nullable(),
  gameweekNumber: z.number(),
  started: z.boolean(),
  played: z.boolean(),
  kickoffTime: z.string(),
  predictions: z.array(predictionSchema).nullable(),
  open: z.boolean(),
});

export type Fixture = z.infer<typeof fixtureSchema>;
