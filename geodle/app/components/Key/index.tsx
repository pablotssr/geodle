import { CharStatus } from "@/app/lib/definitions";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onLetterClick?: (letter: string) => void;
  status: CharStatus;
  type: "keyboard" | "cell";
};

export default function Key({ value, status, onLetterClick, type }: Props) {
  function handleOnLetterClick() {
    if (onLetterClick) onLetterClick(value);
  }

  const baseClasses =
    "transition flex justify-center items-center border-2 rounded w-16 h-16";
  const statusClasses =
    status === "correct"
      ? "bg-green-500 border-green-500 text-white"
      : status === "present"
      ? "bg-orange-500 border-orange-500 text-white"
      : status === "absent"
      ? "bg-base-200 border-base-200 text-black"
      : "";
  const typeClasses = type === "keyboard" ? "cursor-pointer" : "";

  return (
    <motion.div
      onClick={handleOnLetterClick}
      className={`${baseClasses} ${statusClasses} ${typeClasses}`}
      whileTap={{ scale: 0.9 }}
    >
      <div className="h-full flex justify-center items-center">
        <span className="font-bold text-lg lg:text-2xl">{value}</span>
      </div>
    </motion.div>
  );
}
