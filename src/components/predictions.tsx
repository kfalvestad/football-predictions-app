import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { GameweekCarousel } from "./gameweeks-carousel";
import { FixturesView } from "./fixtures";

export function PredictionView() {
  const [selectedGameweek, setSelectedGameweek] = useState(-1);
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

  const currentGW = gameweeks?.find((gw) => gw.isCurrent)?.number;

  useEffect(() => {
    setSelectedGameweek((currentGW as number) - 1 || 0);
  }, [currentGW]);

  if (gameweeksLoading) {
    return <LoadingPage />;
  }

  if (!gameweeks) {
    return <div>Something went wrong</div>;
  }

  const handleGWChange = (input: number) => {
    if (
      (selectedGameweek === 0 && input === -1) ||
      (selectedGameweek === gameweeks.length - 1 && input === 1)
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

    setSelectedGameweek(selectedGameweek + input);
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
      <div className="flex flex-col ">
        <div className="flex w-full items-center justify-between pb-8 pl-24 pr-24 pt-8 shadow-md">
          <div>
            <button
              className="btn bg-orange-200 hover:bg-orange-100"
              onClick={handleClick}
              disabled={!hasPendingChanges || mutation.isLoading}
            >
              Update
            </button>
          </div>
          <div>
            <GameweekCarousel
              gameweeks={gameweeks}
              selectedGW={selectedGameweek}
              changeGW={handleGWChange}
            />
          </div>
          {currentGW && (
            <div>
              <span
                className="hover:cursor-pointer hover:underline"
                onClick={() =>
                  selectedGameweek !== currentGW - 1
                    ? setSelectedGameweek(currentGW - 1)
                    : null
                }
              >
                Go to current
              </span>
            </div>
          )}
        </div>
        <div className="h-screen overflow-y-auto p-10">
          <FixturesView
            selectedGW={selectedGameweek + 1}
            update={{ updatedPredictions, handleUpdates }}
            em={{ errorMessages, setErrorMessages }}
          />
        </div>
      </div>
    </>
  );
}
