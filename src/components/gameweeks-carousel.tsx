import type { Gameweek } from "@prisma/client";

export function GameweekCarousel(props: {
  gameweeks: Gameweek[];
  selectedGW: number;
  changeGW: (input: number) => void;
}) {
  const { gameweeks, selectedGW: gw, changeGW } = props;

  return (
    <div className="carousel w-full">
      {gameweeks.map((gameweek, index) => (
        <div
          key={gameweek.number}
          className={`carousel-item relative w-full ${
            index === gw ? "visible" : "hidden"
          }`}
        >
          <div className="flex w-full flex-col space-y-4">
            <div>
              <div className="mx-auto flex items-center space-x-5">
                <button
                  onClick={() => changeGW(-1)}
                  className="btn-circle btn border-none bg-transparent"
                  disabled={gw === 0}
                >
                  ❮
                </button>
                <div
                  className={`text-2xl ${
                    gameweek.isCurrent ? "underline" : ""
                  }`}
                >
                  {gameweek.number}
                </div>
                <button
                  onClick={() => changeGW(1)}
                  className="btn-circle btn border-none bg-transparent"
                  disabled={gw === gameweeks.length - 1}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
