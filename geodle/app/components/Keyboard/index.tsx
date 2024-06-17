import { Row } from "@/app/lib/definitions";
import { useEffect, useMemo } from "react";
import Key from "../Key/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons/faPaperPlane";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";

const firstRow = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"];
const secondRow = ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"];
const thirdRow = ["W", "X", "C", "V", "B", "N", "-", "'"];

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
    const cell = cells.find(
      (cell) => cell.value === key && cell.status === "absent"
    );
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
      if (
        key.length === 1 &&
        ((key >= "A" && key <= "Z") || key === "-" || key === "'")
      ) {
        onLetterClick(key);
      }
    }

    function spaceKeyListener(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        onLetterClick(" ");
      }
    }

    window.addEventListener("keyup", listener);
    window.addEventListener("keydown", spaceKeyListener);

    return () => {
      window.removeEventListener("keyup", listener);
      window.removeEventListener("keydown", spaceKeyListener);
    };
  }, [onLetterClick, onSubmit, onDelete]);

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-center space-x-2">
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
			<div className="flex items-center justify-center space-x-2">
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
			<div className="flex items-center justify-center  space-x-2">
				{thirdRow.map((key) => (
					<Key
						key={key}
						value={key}
						onLetterClick={(letter) => onLetterClick(letter)}
						status={checkStatus(key)}
						type="keyboard"
					/>
				))}
			</div>
			<div className="flex items-center justify-center space-x-2">
				<Key
					key={" "}
					value={" "}
					onLetterClick={(letter) => onLetterClick(letter)}
					status={checkStatus(" ")}
					type="spacebar"
				/>
				<div className="tooltip" data-tip="Delete last input letter">
					<button
						className="border-2hidden lg:inline-flex items-center justify-center w-12 h-12 bg-red-500 border-red-500 text-white rounded"
						onClick={onDelete}
					>
						<div className="flex items-center justify-center">
							<FontAwesomeIcon icon={faDeleteLeft} />
						</div>
					</button>
				</div>
				<div className="tooltip" data-tip="Submit your word">
					<button
						className="border-2 hidden lg:inline-flex items-center justify-center w-12 h-12 bg-green-500 border-green-500 text-white rounded"
						onClick={onSubmit}
					>
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</div>
				<div className="tooltip" data-tip="Pick a new city">
					<button
						className="border-2	 hidden lg:inline-flex items-center justify-center w-12 h-12 bg-orange-500 border-orange-500 text-white rounded"
						onClick={onReset}
					>
						<FontAwesomeIcon icon={faArrowsRotate} />
					</button>
				</div>
			</div>
		</div>
	);
}
