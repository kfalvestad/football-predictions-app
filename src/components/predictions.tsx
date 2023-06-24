import { useState } from "react";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { GameweekCarousel } from "./gameweeks-carousel";
import { FixturesView } from "./fixtures";
import { set } from "lodash";

export function PredictionView() {
  const [currentGameweek, setCurrentGameweek] = useState(0);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [updatedPredictions, setUpdatedPredictions] = useState<
    {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[]
  >([]);
  const [errorMessages, setErrorMessages] = useState<boolean[]>([]);

  const { data: gameweeks, isLoading: gameweeksLoading } =
    api.gameweek.getAll.useQuery();

  if (gameweeksLoading) {
    return <LoadingPage />;
  }

  if (!gameweeks) {
    return <div>Something went wrong</div>;
  }

  setCurrentGameweek(gameweeks.find((gw) => gw.isCurrent)?.number || 0);

  const handleGWChange = (input: number) => {
    if (currentGameweek > 0 && currentGameweek < gameweeks.length - 1) {
      if (hasPendingChanges) {
        if (
          !window.confirm(
            "You have unsaved predictions, are you sure you want to continue?"
          )
        ) {
          return;
        }
      }
      setCurrentGameweek(currentGameweek + input);
    }
  };

  const handleUpdates = (
    newPredictions: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[]
  ) => {
    setUpdatedPredictions(newPredictions);
    for (const p of newPredictions) {
      if (p.homePrediction !== null && p.awayPrediction !== null) {
        return setHasPendingChanges(true);
      }

      setHasPendingChanges(false);
    }
  };

  const mutation = api.prediction.postMany.useMutation({
    onSuccess: () => {
      alert("Predictions updated!");
      setHasPendingChanges(false);
      setUpdatedPredictions([]);
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
      .filter((p, i) => {
        if (p.homePrediction === null && p.awayPrediction === null) {
          return false;
        } else if (p.homePrediction === null || p.awayPrediction === null) {
          setErrorMessages((old) => {
            const newErrorMessages = [...old];
            newErrorMessages[i] = true;
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
      <div className="flex flex-col">
        <div>
          <GameweekCarousel
            gameweeks={gameweeks}
            cgw={currentGameweek}
            changeGW={handleGWChange}
          />
        </div>
        <div className="mx-auto w-1/2 pb-10 pt-10">
          <FixturesView
            cgw={currentGameweek + 1}
            update={{ updatedPredictions, handleUpdates }}
            em={{ errorMessages, setErrorMessages }}
          />
        </div>
      </div>
    </>
  );
}
