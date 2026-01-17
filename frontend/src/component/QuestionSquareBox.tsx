type Props = {
  num: number;
  state: string;
  onClick: () => void;
};

export default function SquareBox({ num, state, onClick }: Props) {
  let bg = "bg-gray-300"; // default notVisited

  if (state === "notAnswered") bg = "bg-red-500 text-white";
  if (state === "answered") bg = "bg-green-500 text-white";
  if (state === "review") bg = "bg-yellow-400";
  if (state === "answeredReview") bg = "bg-purple-500 text-white";

  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-md shadow cursor-pointer ${bg}`}
    >
      {num}
    </div>
  );
}
