import type { Gameweek } from "@prisma/client";

export function GameweekCarousel(props: {
  gameweeks: Gameweek[];
  cgw: number;
  changeGW: (input: number) => void;
}) {
  const { gameweeks, cgw, changeGW } = props;

  return (
    <div className="carousel h-screen w-full overflow-y-auto">
      {gameweeks.map((gameweek, index) => (
        <div
          key={gameweek.number}
          className={`carousel-item relative w-full ${
            index === cgw ? "visible" : "hidden"
          }`}
        >
          <div className="flex w-full flex-col space-y-4">
            <div className="sticky top-0 z-10 flex bg-white p-5 shadow-md">
              <div className="mx-auto flex items-center space-x-5">
                <button
                  onClick={() => changeGW(-1)}
                  className="btn-circle btn border-none bg-transparent"
                  disabled={cgw === 0}
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
                  disabled={cgw === gameweeks.length - 1}
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
