import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { z } from "zod";
import { FixtureView } from "~/components/fixture-view";

const Home: NextPage = () => {
  const gameweeks = api.gameweek.getAll.useQuery();
  return (
    <>
      {gameweeks.data?.map((gameweek) => (
        <div key={gameweek.number}>
          <div>{gameweek.number}</div>
          <ul className="space-y-20">
            {gameweek.fixtures.map((fixture) => (
              <li key={fixture.fixtureId}>
                <FixtureView fixture={fixture}></FixtureView>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
