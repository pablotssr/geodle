import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GameStates,
  Row,
  Statuses,
  GamePanelProps,
  City,
} from "@/app/lib/definitions";
import Key from "../Key";
import Keyboard from "../Keyboard";
import GameResultModal from "../Modal/GameResultModal";
import { useCityData } from "@/app/context/CityDataContext";

export default function GamePanel({ city }: GamePanelProps) {
  const { generateRandomCity } = useCityData();
  const [rows, setRows] = useState<Row[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [text, setText] = useState<string>("");
  const [solution, setSolution] = useState<string>(city.nom_commune);
  const [gameState, setGameState] =
    useState<keyof typeof GameStates>("playing");
  const nbEssais = 5;

  useEffect(() => {
    initializeGame(city);
  }, [city]);

  const initializeGame = (newCity: City) => {
    const citySolution = newCity.nom_commune;
    setSolution(citySolution);
    const temp: Row[] = Array.from({ length: nbEssais }, () =>
      Array.from({ length: citySolution.length }, () => ({
        value: "",
        status: "guessing",
      }))
    );
    setRows(temp);
    setCurrentRowIndex(0);
    setGameState("playing");
    setText("");
  };

  const handleLetterClick = (letter: string) => {
    if (text.length >= solution.length || gameState !== "playing") return;
    const newText = text + letter;
    setText(newText);

    setRows((prevRows) => {
      const newRows = [...prevRows];
      const newCurrentRow = [...newRows[currentRowIndex]];
      newText.split("").forEach((char, idx) => {
        if (newCurrentRow[idx]) {
          newCurrentRow[idx].value = char;
        }
      });
      newRows[currentRowIndex] = newCurrentRow;
      return newRows;
    });
  };

  const handleReset = () => {
    generateRandomCity();
  };

  const deleteChar = () => {
    const newText = text.slice(0, -1);
    setText(newText);

    setRows((prevRows) => {
      const newRows = [...prevRows];
      const newCurrentRow = [...newRows[currentRowIndex]];
      newCurrentRow[newText.length] = { value: "", status: "guessing" };
      newRows[currentRowIndex] = newCurrentRow;
      return newRows;
    });
  };

  const handleSubmit = () => {
    if (gameState === "playing") {
      if (text.length !== solution.length) {
        toast.error(
          text.length < solution.length
            ? "Please fill in the word"
            : "Please delete some letters in the word"
        );
        return;
      }
    }

    getStatuses();
    if (text.toUpperCase() === solution.toUpperCase()) {
      setGameState("win");
      return;
    }
    if (
      currentRowIndex === nbEssais - 1 &&
      text.toUpperCase() !== solution.toUpperCase()
    ) {
      setGameState("lose");
      return;
    }
    setText("");
    setCurrentRowIndex((prev) => prev + 1);
  };

  const getStatuses = () => {
    const currentRow = [...rows[currentRowIndex]];
    for (let i = 0; i < currentRow.length; i++) {
      if (solution.toUpperCase().includes(text[i].toUpperCase())) {
        currentRow[i].status =
          solution[i].toUpperCase() === text[i].toUpperCase()
            ? "correct"
            : "present";
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

  return (
    <>
      <div className="flex justify-center items-center h-full flex-col space-y-16">
        <div className="space-y-2">
          {rows.map((play, index) => (
            <div key={index} className="flex space-x-2">
              {play.map((guess, idx) => (
                <Key
                  key={idx}
                  value={guess.value}
                  status={guess.status as keyof typeof Statuses}
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
      <GameResultModal gameState={gameState} resetGame={() => handleReset()} />
    </>
  );
}
