import { Row } from "@/app/lib/definitions";
import { useEffect, useMemo } from "react";
import Key from "../Key";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

const firstRow = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"];
const secondRow = ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"];
const thirdRow = ["W", "X", "C", "V", "B", "N"];

type Props = {
  onLetterClick: (letter: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
  onReset: () => void;
  rows: Row[];
};

export default function Keyboard({
  onLetterClick,
  onSubmit,
  rows,
  onDelete,
  onReset,
}: Props) {
  const cells = useMemo(() => rows.flat(), [rows]);

  const checkStatus = (key: string) => {
    const cell = cells.find((cell) => cell.value === key && cell.status === "absent");
    return cell ? "absent" : "guessing";
  };

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.code === "Enter") {
        onSubmit();
      } else if (e.code === "Backspace") {
        onDelete();
      }
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= "A" && key <= "Z") onLetterClick(key);
    }
    window.addEventListener("keyup", listener);
    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [onSubmit, onDelete, onLetterClick]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center space-x-4">
        {firstRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={(letter) => onLetterClick(letter)}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4">
        {secondRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={(letter) => onLetterClick(letter)}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4">
        {thirdRow.map((key) => (
          <Key
            key={key}
            value={key}
            onLetterClick={(letter) => onLetterClick(letter)}
            status={checkStatus(key)}
            type="keyboard"
          />
        ))}
        <button
          className="border-2 border-white hidden lg:inline-flex items-center justify-center w-16 h-16"
          onClick={onSubmit}
        >
          Enter
        </button>
        <button
          className="border-2 border-white hidden lg:inline-flex items-center justify-center w-16 h-16"
          onClick={onDelete}
        >
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faDeleteLeft} />
          </div>
        </button>
        <button
          className="border-2 border-white hidden lg:inline-flex items-center justify-center w-16 h-16"
          onClick={onReset}
        >
          <div className="flex items-center justify-center">Reset</div>
        </button>
      </div>
    </div>
  );
}
