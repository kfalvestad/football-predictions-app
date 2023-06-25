import { type Dispatch, type SetStateAction, useState } from "react";
import { type Fixture } from "~/pages/schemas/fixture";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useSession } from "next-auth/react";
import type { Predictions } from "@prisma/client";

type FixtureProps = {
  fixture: Fixture;
  index: number;
  oldPrediction: Predictions | null;
  errorMessage: boolean;
  onUpdate: (
    prediction: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    },
    index: number
  ) => void;
};

export function Fixture({
  fixture,
  index,
  oldPrediction,
  errorMessage,
  onUpdate,
}: FixtureProps) {
  const [homePrediction, setHomePrediction] = useState<number | null>(
    oldPrediction?.homeScore ?? null
  );
  const [awayPrediction, setAwayPrediction] = useState<number | null>(
    oldPrediction?.awayScore ?? null
  );

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
  };

  const updatePredictions = () => {
    if (
      !(
        homePrediction === oldPrediction?.homeScore &&
        awayPrediction === oldPrediction?.awayScore
      )
    ) {
      onUpdate(
        {
          fixture: fixture.fixtureId,
          homePrediction,
          awayPrediction,
        },
        index
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="flex-1 text-center">{fixture.homeTeam.name}</div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={99}
            value={homePrediction === null ? "" : homePrediction}
            onChange={(e) => handlePredictionChange(e, setHomePrediction)}
            onBlur={updatePredictions}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:outline-none  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            type="tel"
            min={0}
            max={99}
            value={awayPrediction === null ? "" : awayPrediction}
            onChange={(e) => handlePredictionChange(e, setAwayPrediction)}
            onBlur={updatePredictions}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex-1 text-center">{fixture.awayTeam.name}</div>
        {errorMessage && (
          <div className="col-span-4 mt-2 flex justify-center text-red-500">
            Please enter a score for both teams
          </div>
        )}
        <div className="col-span-4 mt-2 flex justify-center">
          {new Date(fixture.kickoffTime).toLocaleString("no-NO")}
        </div>
      </div>
    </div>
  );
}

type FixturesViewProps = {
  cgw: number;
  update: {
    updatedPredictions: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[];
    handleUpdates: (
      newPredictions: {
        fixture: number;
        homePrediction: number | null;
        awayPrediction: number | null;
      }[]
    ) => void;
  };
  em: {
    errorMessages: boolean[];
    setErrorMessages: Dispatch<SetStateAction<boolean[]>>;
  };
};

export function FixturesView({
  cgw,
  update: { updatedPredictions, handleUpdates },
  em: { errorMessages, setErrorMessages },
}: FixturesViewProps) {
  const session = useSession();

  const { data: fixtures, isLoading: fixturesLoading } =
    api.fixture.getGWFixtures.useQuery(cgw);

  if (fixturesLoading) {
    return <LoadingPage />;
  }

  if (!fixtures) {
    return <div>Something went wrong</div>;
  }

  const initializedPredictions = fixtures.map((fixture) => {
    return {
      fixture: fixture.fixtureId,
      homePrediction: null,
      awayPrediction: null,
    };
  });

  if (updatedPredictions.length === 0) {
    handleUpdates(initializedPredictions);
    setErrorMessages(Array(initializedPredictions.length).fill(false));
  }

  const handlePredictionChange = (
    prediction: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    },
    index: number
  ) => {
    const newPredictions = [...updatedPredictions];
    newPredictions[index] = prediction;
    handleUpdates(newPredictions);
  };

  return (
    <div className="mx-auto w-1/2">
      <ul className="space-y-20">
        {fixtures.map((fixture) => {
          const currentIndex = initializedPredictions.findIndex(
            (p) => p.fixture === fixture.fixtureId
          );

          return (
            <li key={fixture.fixtureId}>
              <Fixture
                fixture={fixture}
                index={currentIndex}
                onUpdate={handlePredictionChange}
                oldPrediction={null}
                errorMessage={errorMessages[currentIndex] ?? false}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
