import { z } from "zod";
import { fixtureSchema } from "./fixture";

export const gameweekSchema = z.object({
  number: z.number(),
  played: z.boolean(),
  deadline: z.string(),
  fixtures: z.array(fixtureSchema),
});

export type Gameweek = z.infer<typeof gameweekSchema>;
