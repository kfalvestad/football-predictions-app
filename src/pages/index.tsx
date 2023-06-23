import { GameweekCarousel } from "~/components/gameweeks-carousel";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <style>{`
        body {
          overflow: hidden;
        }
      `}</style>
      <div className="flex">
        <div className="h-screen flex-1 p-10">
          <GameweekCarousel />
        </div>
        <div className="w-auto">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
