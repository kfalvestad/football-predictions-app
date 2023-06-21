import { GameweekCarousel } from "~/components/gameweeks-carousel";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const gameweeks = api.gameweek.getAll.useQuery();
  const predictions = api.prediction.getAll.useQuery();

  return (
    <>
      <div className="flex">
        <div className="flex w-auto flex-1 justify-center">
          <div className="m-10">
            <GameweekCarousel
              gameweeks={gameweeks.data ? gameweeks.data : []}
              predictions={predictions.data ? predictions.data : []}
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
