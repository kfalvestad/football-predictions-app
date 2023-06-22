import _ from "lodash";
import { useState } from "react";
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

    if (
      !(
        homePrediction === oldPrediction?.homeScore &&
        awayPrediction === oldPrediction?.awayScore
      )
    ) {
      debouncedUpdate(
        {
          fixture: fixture.fixtureId,
          homePrediction,
          awayPrediction,
        },
        index
      );
    }
  };

  const debouncedUpdate = _.debounce(onUpdate, 500);

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
          />
        </div>
        <div className="flex-1 items-end">{fixture.awayTeam.name}</div>
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
};

export function FixturesView({ fixtures, predictions }: FixturesViewProps) {
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

  const [predictionsToUpdate, setPredictionsToUpdate] =
    useState<boolean>(false);

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

    if (predictionsToUpdate === false) {
      setPredictionsToUpdate(true);
    }
  };

  const ctx = api.useContext();

  const mutation = api.prediction.postMany.useMutation({
    onSuccess: () => {
      alert("Predictions updated!");
      setUpdatedPredictions(initializedPredictions);
      void ctx.gameweek.getAll.invalidate();
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
    console.log(updatedPredictions);
    const predictionsToUpdate = updatedPredictions
      .filter((p) => {
        if (p.homePrediction === null || p.awayPrediction === null) {
          setErrorMessages((old) => {
            const newErrorMessages = [...old];
            newErrorMessages[
              initializedPredictions.findIndex((i) => i.fixture === p.fixture)
            ] = true;
            return newErrorMessages;
          });
          return false;
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

    console.log(predictionsToUpdate);
    mutation.mutate(predictionsToUpdate);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="btn mt-2 flex w-full bg-green-500 hover:bg-green-600"
        disabled={!predictionsToUpdate}
      >
        Update Predictions
      </button>
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
