import { useState } from "react";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { GameweekCarousel } from "./gameweeks-carousel";
import { FixturesView } from "./fixtures-view";

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

  return (
    <>
      <div>
        <GameweekCarousel gw={currentGameweek} changeGW={handleGWChange} />
      </div>
      <div>
        <FixturesView gw={currentGameweek + 1} />
      </div>
    </>
  );
}
