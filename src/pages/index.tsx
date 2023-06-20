import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { GameweekCarousel } from "~/components/gameweeks-carousel";
import { Sidebar } from "~/components/sidebar";
import { UpdateButton } from "~/components/update-button";
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
function useState<T>(arg0: never[]): [any, any] {
  throw new Error("Function not implemented.");
}
