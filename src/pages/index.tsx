import { GameweekCarousel } from "~/components/gameweeks-carousel";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { data: gameweeks } = api.gameweek.getAll.useQuery();
  const { data: predictions } = api.prediction.getAll.useQuery();

  return (
    <>
      <div className="flex">
        <div className="flex w-auto flex-1 justify-center">
          <div className="m-10">
            <GameweekCarousel
              gameweeks={gameweeks ? gameweeks : []}
              predictions={predictions ? predictions : []}
            />
          </div>
        </div>
        <div className="w-auto">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
