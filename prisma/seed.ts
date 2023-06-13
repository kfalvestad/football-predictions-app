import { fetchFixtures, fetchBootstrap } from "fpl-api";

import { prisma } from "../src/server/db";

async function main() {
  const { teams, events } = await fetchBootstrap();
  const fixtures = await fetchFixtures();

  for (const team of teams) {
    await prisma.team.upsert({
      where: { teamId: team.id },
      update: {},
      create: {
        teamId: team.id,
        name: team.name,
        stadium: "",
      },
    });
  }

  for (const event of events) {
    await prisma.gameweek.upsert({
      where: { number: event.id },
      update: {},
      create: {
        number: event.id,
        played: event.finished,
        deadline: event.deadline_time,
      },
    });
  }

  for (const fixture of fixtures) {
    await prisma.fixture.upsert({
      where: { fixtureId: fixture.id },
      update: {},
      create: {
        fixtureId: fixture.id,
        homeTeamId: fixture.team_h,
        awayTeamId: fixture.team_a,
        homeTeamScore: fixture.team_h_score ? fixture.team_h_score : undefined,
        awayTeamScore: fixture.team_a_score ? fixture.team_a_score : undefined,
        gameweekNumber: fixture.event,
        played: fixture.finished,
        started: fixture.started,
        kickoffTime: fixture.kickoff_time,
        open: !fixture.started,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
