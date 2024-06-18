import { City, GameStates } from "@/app/lib/definitions";
import { registerUser, registerScore } from "@/app/lib/serverRequest";
import { useState } from "react";

interface WinModalProps {
    city: City;
    gameState: keyof typeof GameStates;
    essais: number
}

const WinModal: React.FC<WinModalProps> = ({ city, gameState, essais }) => {
  const [username, setUsername] = useState(""); // State to hold username input

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Call registerUser function here
        const registrationResult = await registerUser(username);
        if (registrationResult.success) {
          const currentPath = window.location.pathname;
          const currentPage = currentPath.split('/')[1];
    
          registerScore(essais,currentPage, city.nom_commune, registrationResult.userId)
          // Optionally, you can handle success state here
        } else {
          console.error("Registration failed:", registrationResult.message);
          // Optionally, you can handle failure state here
        }
      };  

    return (
        <div className="modal-body mt-4">
            {gameState === "lose" && (
                <div>
                    <p>Better try again!</p>
                    <p>
                        The city to be found was: 
                        <strong> {city.nom_commune}</strong>
                    </p>
                </div>
            )}
            {gameState === "win" && (
                <div>
                    <p>Congratulations on your win!</p>
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
                </div>
            )}
        </div>
    );
};

export default WinModal;
