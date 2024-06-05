import { GameStates, Row } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import Key from "../Key";
import Keyboard from "../Keyboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameResultModal from "../Modal/GameResultModal";

export default function GamePanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [text, setText] = useState("");
  const [solution, setSolution] = useState("");
  const [gameState, setGameState] =
    useState<keyof typeof GameStates>("playing");

  const word = "cannes";
  const nbEssais = 5;

  const handleLetterClick = (letter: string) => {
    if (text.length >= word.length) return;
    setText((prevText) => prevText + letter);
  };

  const handleReset = () => {
    const temp: Row[] = Array(nbEssais).fill(
      Array(word.length).fill({ value: "", status: "guessing" })
    );
    setRows(temp);
    setCurrentRowIndex(0);
    setSolution(loadSolution());
    setGameState("playing");
    setText("");
  };

  const loadSolution = () => {
    // Logic to fetch the city (solution)
    return word;
  };

  const deleteChar = () => {
    setText((prevText) => prevText.slice(0, -1));
  };

  const handleSubmit = () => {
    if (text.length !== word.length) {
      toast.error(
        text.length < word.length
          ? "Please fill in the word"
          : "Please delete some letters in the word"
      );
      return;
    }

    // Check if the city exists
    // if (!checker(text)) {
    // 	toast.error("Word not found");
    // 	return;
    // }

    getStatuses();
    if (text.toLowerCase() === solution.toLowerCase()) {
      setGameState("win");
      return;
    }
    if (currentRowIndex === nbEssais - 1 && text.toLowerCase() !== solution.toLowerCase()) {
      setGameState("lose");
      return;
    }
    setText("");
    setCurrentRowIndex((prev) => prev + 1);
  };

  const getStatuses = () => {
    const currentRow = [...rows[currentRowIndex]];
    for (let i = 0; i < currentRow.length; i++) {
      if (solution.toLowerCase().includes(text[i].toLowerCase())) {
        currentRow[i].status =
          solution[i].toLowerCase() === text[i].toLowerCase() ? "correct" : "present";
      } else {
        currentRow[i].status = "absent";
      }
    }
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[currentRowIndex] = currentRow;
      return newRows;
    });
  };

  useEffect(() => {
    handleReset();
  }, []);

  useEffect(() => {
    if (rows.length === 0) return;
    const currentRow = rows[currentRowIndex].map((cell, i) => ({
      ...cell,
      value: text[i] || "",
    }));
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[currentRowIndex] = currentRow;
      return newRows;
    });
  }, [text]);

  return (
    <>
      <div className="flex justify-center items-center h-full flex-col space-y-20">
        <div className="space-y-4">
          {rows.map((play, index) => (
            <div key={index} className="flex space-x-4">
              {play.map((guess, idx) => (
                <Key
                  key={idx}
                  value={guess.value}
                  status={guess.status as any}
                  onLetterClick={handleLetterClick}
                  type="cell"
                />
              ))}
            </div>
          ))}
        </div>
        <Keyboard
          onLetterClick={handleLetterClick}
          onSubmit={handleSubmit}
          rows={rows.slice(0, currentRowIndex)}
          onDelete={deleteChar}
          onReset={handleReset}
        />
      </div>
      <GameResultModal gameState={gameState} resetGame={handleReset} />
    </>
  );
}
