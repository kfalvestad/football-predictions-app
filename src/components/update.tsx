import { api } from "~/utils/api";

type updatePredictionsProps = {
  updatedPredictions: {
    fixture: number;
    homePrediction: number;
    awayPrediction: number;
  }[];
};

export function UpdateButton({ updatedPredictions }: updatePredictionsProps) {
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

  mutation.mutate(updatedPredictions);
}
