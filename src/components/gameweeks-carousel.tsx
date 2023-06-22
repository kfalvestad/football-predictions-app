import { useState } from "react";
import { FixturesView } from "./fixtures-view";
import { type Gameweek } from "~/pages/schemas/gameweek";
import { set } from "date-fns";
import { api } from "~/utils/api";
import type { Prediction } from "~/pages/schemas/prediction";

type GameweekCarouselProps = {
  gameweeks: Gameweek[];
  predictions: Prediction[];
};

export function GameweekCarousel({
  gameweeks,
  predictions,
}: GameweekCarouselProps) {
  const [currentGameweek, setCurrentGameweek] = useState(0);

  /*  const [updatedPredictions, setUpdatedPredictions] = useState<
    {
      fixture: number;
      homePrediction: number;
      awayPrediction: number;
    }[]
  >([]);

  const handlePredictionUpdate = (prediction: {
    fixture: number;
    homePrediction: number | null;
    awayPrediction: number | null;
  }) => {
    setUpdatedPredictions((prevState) => {
      const existingIndex = prevState.findIndex(
        (p) => p.fixture === prediction.fixture
      );

      if (existingIndex !== -1) {
        prevState.splice(existingIndex, 1);
      }

      if (
        prediction.homePrediction !== null &&
        prediction.awayPrediction !== null
      ) {
        console.log("predictions added", updatedPredictions);
        return [
          ...prevState,
          {
            fixture: prediction.fixture,
            homePrediction: prediction.homePrediction,
            awayPrediction: prediction.awayPrediction,
          },
        ];
      } else {
        console.log("predictions removed?", updatedPredictions);
        return [...prevState];
      }
    });
  }; */

  const goToPreviousGameweek = () => {
    if (currentGameweek > 0) {
      setCurrentGameweek(currentGameweek - 1);
    }
  };

  const goToNextGameweek = () => {
    if (currentGameweek < gameweeks.length - 1) {
      setCurrentGameweek(currentGameweek + 1);
    }
  };

  return (
    <div className="carousel flex h-screen w-full overflow-y-auto">
      {gameweeks.map((gameweek, index) => (
        <div
          key={gameweek.number}
          className={`carousel-item relative w-full ${
            index === currentGameweek ? "visible" : "hidden"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="sticky top-0 z-10 flex w-full items-center justify-center space-x-4 bg-white pb-5 shadow-sm">
              <button
                onClick={goToPreviousGameweek}
                className="btn-circle btn border-none bg-transparent"
                disabled={currentGameweek === 0}
              >
                ❮
              </button>
              <div>{gameweek.number}</div>
              <button
                onClick={goToNextGameweek}
                className="btn-circle btn border-none bg-transparent"
                disabled={currentGameweek === gameweeks.length - 1}
              >
                ❯
              </button>
            </div>
            <div className="w-full pt-8">
              <FixturesView
                fixtures={gameweek.fixtures}
                predictions={predictions}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
