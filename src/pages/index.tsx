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
        <div className="h-screen flex-1 p-10">
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
