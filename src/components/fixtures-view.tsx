import { Dispatch, SetStateAction, useState } from "react";
import { type Fixture } from "~/pages/schemas/fixture";
import { type Prediction } from "~/pages/schemas/prediction";
import { api } from "~/utils/api";

type FixtureViewProps = {
  fixture: Fixture;
  index: number;
  oldPrediction: Prediction | null;
  errorMessage: boolean[];
  onUpdate: (
    prediction: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    },
    index: number
  ) => void;
};

export function FixtureView({
  fixture,
  index,
  oldPrediction,
  errorMessage,
  onUpdate,
}: FixtureViewProps) {
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
      ) &&
      !(homePrediction === null && awayPrediction === null)
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
            onBlur={updatePredictions}
            onChange={(e) => handlePredictionChange(e, setAwayPrediction)}
            className="h-10 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex-1 text-center">{fixture.awayTeam.name}</div>
        {errorMessage[index] && (
          <div className="col-span-4 mt-2 flex justify-center text-red-500">
            Please enter a valid prediction
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
  fixtures: Fixture[];
  predictions: Prediction[];
  pc: {
    hasPendingChanges: boolean;
    setHasPendingChanges: Dispatch<SetStateAction<boolean>>;
  };
};

export function FixturesView({
  fixtures,
  predictions,
  pc: { hasPendingChanges, setHasPendingChanges },
}: FixturesViewProps) {
  const initializedPredictions = fixtures.map((fixture) => {
    return {
      fixture: fixture.fixtureId,
      homePrediction: null,
      awayPrediction: null,
    };
  });

  const [updatedPredictions, setUpdatedPredictions] = useState<
    {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[]
  >(initializedPredictions);

  const [errorMessages, setErrorMessages] = useState<boolean[]>(
    Array(initializedPredictions.length).fill(false)
  );

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
    setUpdatedPredictions(newPredictions);

    if (!hasPendingChanges) {
      setHasPendingChanges(true);
    }
  };

  const mutation = api.prediction.postMany.useMutation({
    onSuccess: () => {
      alert("Predictions updated!");
      setUpdatedPredictions(initializedPredictions);
      setHasPendingChanges(false);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Failed to post, please try again later");
      }
    },
  });

  const handleClick = () => {
    const predictionsToUpdate = updatedPredictions
      .filter((p) => {
        if (p.homePrediction === null && p.awayPrediction === null) {
          return false;
        } else if (p.homePrediction === null || p.awayPrediction === null) {
          console.log("Home:", p.homePrediction, "Away:", p.awayPrediction);
          setErrorMessages((old) => {
            const newErrorMessages = [...old];
            newErrorMessages[
              initializedPredictions.findIndex((i) => i.fixture === p.fixture)
            ] = true;
            return newErrorMessages;
          });
        } else {
          return true;
        }
      })
      .map((p) => {
        return {
          fixture: p.fixture,
          homePrediction: p.homePrediction as number,
          awayPrediction: p.awayPrediction as number,
        };
      });

    mutation.mutate(predictionsToUpdate);
  };

  return (
    <>
      <ul className="space-y-20">
        {fixtures.map((fixture) => {
          const oldPrediction = predictions.find(
            (p) => p.fixtureId === fixture.fixtureId
          );

          return (
            <li key={fixture.fixtureId}>
              <FixtureView
                index={initializedPredictions.findIndex(
                  (p) => p.fixture === fixture.fixtureId
                )}
                fixture={fixture}
                onUpdate={handlePredictionChange}
                oldPrediction={oldPrediction ? oldPrediction : null}
                errorMessage={errorMessages}
              ></FixtureView>
            </li>
          );
        })}
      </ul>
    </>
  );
}
