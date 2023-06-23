import { useState } from "react";
import { FixturesView } from "./fixtures-view";
import { type Gameweek } from "~/pages/schemas/gameweek";
import { set } from "date-fns";
import { api } from "~/utils/api";
import type { Prediction } from "~/pages/schemas/prediction";

export function GameweekCarousel() {
  const [currentGameweek, setCurrentGameweek] = useState(0);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const { data: gameweeks, isLoading: gameweeksLoading } =
    api.gameweek.getAll.useQuery();
  const { data: predictions } = api.prediction.getAll.useQuery();

  if (gameweeksLoading) {
    return <div>Loading...</div>;
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
            <div className="sticky top-0 z-10 flex bg-white p-5 shadow-sm">
              <div className="absolute md:left-10">
                <button className="btn mt-2 flex w-full bg-orange-200 hover:bg-orange-100">
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
            <div className="mx-auto w-1/2 pb-10">
              <FixturesView
                fixtures={gameweek.fixtures}
                predictions={predictions ?? []}
                pc={{ hasPendingChanges, setHasPendingChanges }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
