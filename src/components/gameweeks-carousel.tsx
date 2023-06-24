import { useState } from "react";
import { FixturesView } from "./fixtures-view";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";

export function GameweekCarousel() {
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
  const { data: predictions } = api.prediction.getAll.useQuery();

  if (gameweeksLoading) {
    return <LoadingPage />;
  }

  if (!gameweeks) {
    return <div>Something went wrong</div>;
  }

  const goToPreviousGameweek = () => {
    if (currentGameweek > 0) {
      if (hasPendingChanges) {
        if (
          !window.confirm(
            "You have unsaved predictions, are you sure you want to continue?"
          )
        ) {
          return;
        }
      }
      setCurrentGameweek(currentGameweek - 1);
    }
  };

  const goToNextGameweek = () => {
    if (currentGameweek < gameweeks.length - 1) {
      if (hasPendingChanges) {
        if (
          !window.confirm(
            "You have unsaved predictions, are you sure you want to continue?"
          )
        ) {
          return;
        }
      }
      setCurrentGameweek(currentGameweek + 1);
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
    <div className="carousel h-screen w-full overflow-y-auto">
      {gameweeks.map((gameweek, index) => (
        <div
          key={gameweek.number}
          className={`carousel-item relative w-full ${
            index === currentGameweek ? "visible" : "hidden"
          }`}
        >
          <div className="flex w-full flex-col space-y-4">
            <div className="sticky top-0 z-10 flex bg-white p-5 shadow-md">
              <div className="absolute md:left-10">
                <button
                  className="btn mt-2 flex w-full bg-orange-200 hover:bg-orange-100"
                  onClick={handleClick}
                  disabled={!hasPendingChanges || mutation.isLoading}
                >
                  Update
                </button>
              </div>
              <div className="mx-auto flex items-center space-x-5">
                <button
                  onClick={goToPreviousGameweek}
                  className="btn-circle btn border-none bg-transparent"
                  disabled={currentGameweek === 0}
                >
                  ❮
                </button>
                <div className="text-2xl">{gameweek.number}</div>
                <button
                  onClick={goToNextGameweek}
                  className="btn-circle btn border-none bg-transparent"
                  disabled={currentGameweek === gameweeks.length - 1}
                >
                  ❯
                </button>
              </div>
            </div>
            <div className="mx-auto w-1/2 pb-10 pt-10">
              <FixturesView
                gw={currentGameweek + 1}
                predictions={predictions ?? []}
                pc={{ hasPendingChanges, setHasPendingChanges }}
                up={{ updatedPredictions, setUpdatedPredictions }}
                em={{ errorMessages, setErrorMessages }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
