import { GameStates } from "@/app/lib/definitions";
import { useState, useEffect, useRef } from "react";
import { registerUser, registerScore } from "@/app/lib/serverRequest";

export default function GameResultModal({
  gameState,
  resetGame,
  essais,
  nomville
}: {
  gameState: keyof typeof GameStates;
  resetGame: () => void;
  essais: number;
  nomville: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(""); // State to hold username input
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Call registerUser function here
    const registrationResult = await registerUser(username);
    if (registrationResult.success) {
      const currentPath = window.location.pathname;
      const currentPage = currentPath.split('/')[1];

      registerScore(essais,currentPage,nomville, registrationResult.userId)
      // Optionally, you can handle success state here
    } else {
      console.error("Registration failed:", registrationResult.message);
      // Optionally, you can handle failure state here
    }
  };
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
          <div className="modal-body mt-4">
            {gameState === "lose" && <p>Better try again!</p>}
            {gameState === "win" && (
              <>
                <p>Congratulations on your win!</p>
                {/* Form for username input */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Register Username
                  </button>
                </form>
              </>
            )}
          </div>
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