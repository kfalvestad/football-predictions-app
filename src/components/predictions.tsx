import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { GameweekCarousel } from "./gameweeks-carousel";
import { FixturesView } from "./fixtures";

export function PredictionView() {
  const [currentGameweek, setCurrentGameweek] = useState(-1);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [updatedPredictions, setUpdatedPredictions] = useState<
    {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[]
  >([]);
  const [errorMessages, setErrorMessages] = useState<boolean[]>([]);

  const ctx = api.useContext();

  const mutation = api.prediction.postMany.useMutation({
    onSuccess: () => {
      alert("Predictions updated!");
      setUpdatedPredictions([]);
      setHasPendingChanges(false);
      void ctx.fixture.getGWFixtures.invalidate();
      void ctx.prediction.getForFixtures.invalidate();
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

  const { data: gameweeks, isLoading: gameweeksLoading } =
    api.gameweek.getAll.useQuery();

  useEffect(() => {
    setCurrentGameweek(
      (gameweeks?.find((gw) => gw.isCurrent)?.number as number) - 1 || 0
    );
  }, [gameweeks]);

  if (gameweeksLoading) {
    return <LoadingPage />;
  }

  if (!gameweeks) {
    return <div>Something went wrong</div>;
  }

  const handleGWChange = (input: number) => {
    if (
      (currentGameweek === 0 && input === -1) ||
      (currentGameweek === gameweeks.length - 1 && input === 1)
    ) {
      return;
    }

    if (hasPendingChanges) {
      if (
        window.confirm(
          "You have unsaved predictions, do you want to save changes?"
        )
      ) {
        handleClick();
      } else {
        return;
      }
    }

    setCurrentGameweek(currentGameweek + input);
  };

  const handleUpdates = (
    newPredictions: {
      fixture: number;
      homePrediction: number | null;
      awayPrediction: number | null;
    }[]
  ) => {
    setUpdatedPredictions(newPredictions);

    const hasUpdates = newPredictions.some(
      (p) => p.homePrediction !== null && p.awayPrediction !== null
    );

    setHasPendingChanges(hasUpdates);
  };

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

    mutation.mutate(predictionsToUpdate);
  };

  return (
    <>
      <button
        className="btn absolute left-10 top-32 flex bg-orange-200 hover:bg-orange-100"
        onClick={handleClick}
        disabled={!hasPendingChanges || mutation.isLoading}
      >
        Update
      </button>
      <div className="flex flex-col">
        <div>
          <GameweekCarousel
            gameweeks={gameweeks}
            cgw={currentGameweek}
            changeGW={handleGWChange}
          />
        </div>
        <div className="h-screen w-full overflow-y-auto pb-10 pt-10">
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
