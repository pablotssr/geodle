import { CharStatus } from "@/app/lib/definitions";

type Props = {
  value: string;
  onLetterClick?: (letter: string) => void;
  status: CharStatus;
  type: "keyboard" | "cell" | "spacebar";
};

export default function Key({ value, status, onLetterClick, type }: Props) {
  function handleOnLetterClick() {
    if (onLetterClick) onLetterClick(value);
  }

  return (
    <div
      onClick={handleOnLetterClick}
      className={
        "bg-base-200 transition flex justify-center items-center border-2 rounded h-12 text-uppercase " +
        (status === "correct"
          ? "bg-green-500 border-green-500 text-white "
          : status === "present"
          ? "bg-orange-500 border-orange-500 text-white "
          : status === "absent"
          ? "bg-gray-500 border-gray-500 text-white "
          : "transparent ") +
        (type === "keyboard" ? "cursor-pointer " : "") +
        (type === "spacebar" ? "cursor-pointer w-64" : "w-12")
      }>
      <div className="h-full flex justify-center items-center">
        <span className="font-bold text-lg lg:text-2xl">{value}</span>
      </div>
    </div>
  );
}
