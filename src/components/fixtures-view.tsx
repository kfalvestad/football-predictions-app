import { useState } from "react";
import { type Fixture } from "~/pages/schemas/fixture";

type FixtureViewProps = {
  fixture: Fixture;
  onUpdate: (prediction: {
    fixture: number;
    homePrediction: number;
    awayPrediction: number;
  }) => void;
};

export function FixtureView({ fixture, onUpdate }: FixtureViewProps) {
  const [homePrediction, setHomePrediction] = useState<number | null>(null);
  const [awayPrediction, setAwayPrediction] = useState<number | null>(null);

  const handlePredictionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPrediction: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setPrediction(null);
    } else {
      const prediction = parseInt(value);
      if (!isNaN(prediction) && prediction >= 0 && prediction < 100) {
        setPrediction(prediction);
      }
    }

    if (homePrediction !== null && awayPrediction !== null) {
      onUpdate({ fixture: fixture.fixtureId, homePrediction, awayPrediction });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex-1 items-start">{fixture.homeTeam.name}</div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={99}
            value={homePrediction === null ? "" : homePrediction}
            onChange={(e) => handlePredictionChange(e, setHomePrediction)}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:outline-none  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder=""
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={99}
            value={awayPrediction === null ? "" : awayPrediction}
            onChange={(e) => handlePredictionChange(e, setAwayPrediction)}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
  onUpdate: (prediction: {
    fixture: number;
    homePrediction: number;
    awayPrediction: number;
  }) => void;
};

export function FixturesView({ fixtures, onUpdate }: FixturesViewProps) {
  return (
    <>
      <ul className="space-y-20">
        {fixtures.map((fixture) => (
          <li key={fixture.fixtureId}>
            <FixtureView fixture={fixture} onUpdate={onUpdate}></FixtureView>
          </li>
        ))}
      </ul>
    </>
  );
}
