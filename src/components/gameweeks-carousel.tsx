import { useState } from "react";
import { FixturesView } from "./fixtures-view";
import { type Gameweek } from "~/pages/schemas/gameweek";

type GameweekCarouselProps = {
  gameweeks: Gameweek[];
};

export function GameweekCarousel({ gameweeks }: GameweekCarouselProps) {
  const [currentGameweek, setCurrentGameweek] = useState(0);

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
                className="btn-circle btn btn border-none bg-transparent"
                disabled={currentGameweek === 0}
              >
                ❮
              </button>
              <div>{gameweek.number}</div>
              <button
                onClick={goToNextGameweek}
                className="btn-circle btn btn border-none bg-transparent"
                disabled={currentGameweek === gameweeks.length - 1}
              >
                ❯
              </button>
            </div>
            <div className="w-full pt-8">
              <FixturesView fixtures={gameweek.fixtures} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
