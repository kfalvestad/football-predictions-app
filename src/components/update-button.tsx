import { api } from "~/utils/api";

type UpdateButtonProps = {
  updatedPredictions: {
    fixture: number;
    homePrediction: number;
    awayPrediction: number;
  }[];
};

export function UpdateButton({ updatedPredictions }: UpdateButtonProps) {
  const ctx = api.useContext();

  const mutation = api.prediction.postMany.useMutation({
    onSuccess: () => {
      alert("Predictions updated!");
      updatedPredictions = [];
      void ctx.gameweek.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Failed to post, please try again later");
      }
    },
  });

  const handleClick = () => {
    mutation.mutate(updatedPredictions);
  };

  return (
    <button
      onClick={handleClick}
      className="btn mt-2 flex w-full bg-green-500 hover:bg-green-600"
      disabled={updatedPredictions.length === 0}
    >
      Update predictions{" "}
    </button>
  );
}
