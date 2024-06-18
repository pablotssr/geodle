import { City, GameStates } from "@/app/lib/definitions";
import { useState, useEffect, useRef } from "react";
import WinModal from "./WinModal";

export default function GameResultModal({
  city,
  gameState,
  resetGame,
  essais,
}: {
  city: City
  gameState: keyof typeof GameStates;
  resetGame: () => void;
  essais: number;
}) {

  const [isOpen, setIsOpen] = useState(false);
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gameState === "win" || gameState === "lose") {
      setIsOpen(true);
    }
  }, [gameState]);

  useEffect(() => {
    if (!isOpen && gameState !== "playing" && playAgainButtonRef.current) {
      playAgainButtonRef.current.blur();
    }
  }, [isOpen, gameState]);


  return (
    <>
      <input
        type="checkbox"
        id="game-result-modal"
        className="modal-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(false)}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="modal-header text-center">
            <h3 className="font-bold text-lg">
              {gameState === "win" ? "You win!" : "You lost!"}
            </h3>
            <label
              htmlFor="game-result-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsOpen(false)}>
              ✕
            </label>
          </div>
          <WinModal city={city} gameState={gameState} essais={essais}/>
          <div className="modal-footer">
            <div className="flex items-center justify-end">
              <button
                ref={playAgainButtonRef}
                className="btn btn-primary"
                onClick={() => {
                  setIsOpen(false);
                  resetGame();
                }}>
                Play again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}