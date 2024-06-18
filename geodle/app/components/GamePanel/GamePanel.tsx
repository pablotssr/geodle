import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    GameStates,
    Row,
    Statuses,
    GamePanelProps,
    City,
} from "@/app/lib/definitions";
import Key from "../Key/Key";
import Keyboard from "../Keyboard/Keyboard";
import GameResultModal from "../Modal/GameResultModal";
import { useCityData } from "@/app/context/CityDataContext";
import Hints from "../Hints/Hints";

export default function GamePanel({ city }: GamePanelProps) {
    const { generateRandomCity } = useCityData();
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [text, setText] = useState<string>("");
    const [nbTries, setNbTries] = useState<number>(0);
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
        toast.info("A new city has been generated!");
    };

    const deleteChar = () => {
        if (gameState === "playing") {
            const newText = text.slice(0, -1);
            setText(newText);

            setRows((prevRows) => {
                const newRows = [...prevRows];
                const newCurrentRow = [...newRows[currentRowIndex]];
                newCurrentRow[newText.length] = {
                    value: "",
                    status: "guessing",
                };
                newRows[currentRowIndex] = newCurrentRow;
                return newRows;
            });
        }
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
        setNbTries((prev) => prev + 1);
    };

    const getStatuses = () => {
        const currentRow = [...rows[currentRowIndex]];
        const solutionUpperCase = solution.toUpperCase();
        const textUpperCase = text.toUpperCase();

        // Count occurrences of each letter in the solution
        const letterCounts: { [key: string]: number } = {};
        for (let char of solutionUpperCase) {
            if (!letterCounts[char]) {
                letterCounts[char] = 0;
            }
            letterCounts[char]++;
        }

        // First pass: mark correct letters
        for (let i = 0; i < currentRow.length; i++) {
            if (solutionUpperCase[i] === textUpperCase[i]) {
                currentRow[i].status = "correct";
                letterCounts[textUpperCase[i]]--;
            }
        }

        // Second pass: mark present and absent letters
        for (let i = 0; i < currentRow.length; i++) {
            if (currentRow[i].status !== "correct") {
                if (letterCounts[textUpperCase[i]] > 0) {
                    currentRow[i].status = "present";
                    letterCounts[textUpperCase[i]]--;
                } else {
                    currentRow[i].status = "absent";
                }
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
            <div className="flex justify-center items-center h-full flex-col gap-4">
                <div className="space-y-2">
                    {rows.map((play, index) => (
                        <div key={index} className="flex space-x-2">
                            {play.map((guess, idx) => (
                                <Key
                                    key={idx}
                                    value={guess.value}
                                    status={
                                        guess.status as keyof typeof Statuses
                                    }
                                    type="cell"
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <Hints
                    randomCity={city}
                    nbTries={currentRowIndex}
                    gamemode="word"
                />

                <Keyboard
                    onLetterClick={handleLetterClick}
                    onSubmit={handleSubmit}
                    rows={rows.slice(0, currentRowIndex)}
                    onDelete={deleteChar}
                    onReset={handleReset}
                />
            </div>

            <GameResultModal
                city={city}
                essais={nbTries + 1}
                gameState={gameState}
                resetGame={() => handleReset()}
            />
        </>
    );
}
