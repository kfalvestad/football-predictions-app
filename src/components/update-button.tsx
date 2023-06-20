import { api } from "~/utils/api";

type UpdateButtonProps = {
  updatedPredictions: {
    fixture: number;
    homePrediction: number;
    awayPrediction: number;
  }[];
};

export function UpdateButton({ updatedPredictions }: UpdateButtonProps) {
  const mutation = api.prediction.postMany.useMutation();

  const handleClick = () => {
    mutation.mutate(updatedPredictions);
    updatedPredictions = [];
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
