import { z } from "zod";

export const teamSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  stadium: z.string(),
});

export type Team = z.infer<typeof teamSchema>;
