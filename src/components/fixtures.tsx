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
  const { data: session } = useSession();

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
    <div className="flex flex-col p-5 shadow-md shadow-slate-200">
      <div className="flex justify-around">
        <div className="flex w-1/3 min-w-0 flex-col truncate">
          <span className="text-center font-medium">
            {fixture.homeTeam.name}
          </span>
        </div>
        <div className="flex w-1/3 min-w-0 flex-col">
          <div className="flex w-auto justify-evenly">
            {session && (
              <>
                <input
                  type="tel"
                  min={0}
                  max={99}
                  value={homePrediction === null ? "" : homePrediction}
                  onChange={(e) => handlePredictionChange(e, setHomePrediction)}
                  onBlur={updatePredictions}
                  className="h-10 w-14 rounded-xl border-black bg-slate-300 p-2.5 text-center text-lg text-gray-900 hover:border-2 focus:border-2 focus:outline-none"
                />
                <input
                  type="tel"
                  min={0}
                  max={99}
                  value={awayPrediction === null ? "" : awayPrediction}
                  onChange={(e) => handlePredictionChange(e, setAwayPrediction)}
                  onBlur={updatePredictions}
                  className="h-10 w-14 rounded-xl border-black bg-slate-300 p-2.5 text-center text-lg text-gray-900 hover:border-2 focus:border-2 focus:outline-none"
                />
              </>
            )}
            {!session && (
              <>
                <span className="h-10 w-14 p-2.5 text-center text-lg text-gray-900">
                  0
                </span>
                <span className="h-10 w-14 p-2.5 text-center text-lg text-gray-900">
                  0
                </span>
              </>
            )}
          </div>
          <div className="flex justify-center truncate">
            {new Date(fixture.kickoffTime).toLocaleString("no-NO")}
          </div>
        </div>
        <div className="flex w-1/3 min-w-0 flex-col truncate">
          <span className="text-center font-medium">
            {fixture.awayTeam.name}
          </span>
        </div>
      </div>
      {errorMessage && (
        <span className="flex justify-center text-red-500">
          Please enter a score for both teams
        </span>
      )}
    </div>
  );
}

type FixturesViewProps = {
  selectedGW: number;
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
  selectedGW: gw,
  update: { updatedPredictions, handleUpdates },
  em: { errorMessages, setErrorMessages },
}: FixturesViewProps) {
  const { data: fixtures, isLoading: fixturesLoading } =
    api.fixture.getGWFixtures.useQuery(gw);

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
    <div className="mx-auto lg:w-1/2">
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
