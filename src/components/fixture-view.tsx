import { type Fixture, type Team } from "@prisma/client";

type FixtureViewProps = {
  fixture: Fixture & {
    homeTeam: Team;
    awayTeam: Team;
  };
};

export function FixtureView({ fixture }: FixtureViewProps) {
  return (
    <>
      <div className="flex justify-center space-x-8">
        <div>{fixture.homeTeam.name}</div>
        <div className="relative h-24 w-24">
          <input
            type="tel"
            min={0}
            max={30}
            className="block h-10 w-10 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          ></input>
        </div>
        <div className="relative h-24 w-24">
          <input
            type="tel"
            min={0}
            max={30}
            className="block h-10 w-10 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          ></input>
        </div>
        <div>{fixture.awayTeam.name}</div>
      </div>
      <div className="flex justify-center">
        {new Date(fixture.kickoffTime).toLocaleString("no-NO")}
      </div>
    </>
  );
}
