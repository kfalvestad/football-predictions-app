import { Sidebar } from "~/components/sidebar";
import type { NextPage } from "next";
import { PredictionView } from "~/components/predictions";

const Home: NextPage = () => {
  return (
    <>
      <style>{`
        body {
          overflow: hidden;
        }
      `}</style>

      <div className="flex">
        <div className="flex-1">
          <PredictionView />
        </div>
        <div className="w-auto">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
