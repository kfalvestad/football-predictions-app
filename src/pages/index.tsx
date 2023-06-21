import { type NextPage } from "next";
import { GameweekCarousel } from "~/components/gameweeks-carousel";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const gameweeks = api.gameweek.getAll.useQuery();

  return (
    <div className="flex">
      <div className="flex w-auto flex-1 justify-center">
        <div className="m-10">
          <GameweekCarousel gameweeks={gameweeks.data ?? []} />
        </div>
      </div>
      <div className="w-auto">
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;
