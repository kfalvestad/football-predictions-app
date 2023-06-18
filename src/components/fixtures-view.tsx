import { type Fixture } from "~/pages/schemas/fixture";

type FixtureViewProps = {
  fixture: Fixture;
};

export function FixtureView({ fixture }: FixtureViewProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex-1 items-start">{fixture.homeTeam.name}</div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={30}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={30}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          />
        </div>
        <div className="flex-1 items-end">{fixture.awayTeam.name}</div>
        <div className="col-span-4 mt-2 flex justify-center">
          {new Date(fixture.kickoffTime).toLocaleString("no-NO")}
        </div>
      </div>
    </div>
  );
}

type FixturesViewProps = {
  fixtures: Fixture[];
};

export function FixturesView({ fixtures }: FixturesViewProps) {
  return (
    <>
      <ul className="space-y-20">
        {fixtures.map((fixture) => (
          <li key={fixture.fixtureId}>
            <FixtureView fixture={fixture}></FixtureView>
          </li>
        ))}
      </ul>
    </>
  );
}
