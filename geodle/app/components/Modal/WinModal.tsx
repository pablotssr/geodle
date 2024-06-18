import { City, GameStates } from "@/app/lib/definitions";
import { registerUser, registerScore } from "@/app/lib/serverRequest";
import { useState } from "react";
import { toast } from "react-toastify";

interface WinModalProps {
    city: City;
    gameState: keyof typeof GameStates;
    essais: number;
}

const WinModal: React.FC<WinModalProps> = ({ city, gameState, essais }) => {
    const [username, setUsername] = useState(""); // State to hold username input

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const registrationResult = await registerUser(username);
        if (registrationResult.success) {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split("/")[1];

            registerScore(
                essais,
                currentPage,
                city.nom_commune,
                registrationResult.userId
            );
            toast.success("Score sent to the leaderboard.");
        } else {
            console.error("Registration failed:", registrationResult.message);
            toast.error("Error when sending your score.");
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
                <div className="flex flex-col gap-4">
                    <p>Congratulations on your win!</p>
                    <div className="flex flex-col justify-center items-center">
                        <form onSubmit={handleSubmit} className="join mb-4">
                            <div className="mb-2 join-item">
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="w-4 h-4 opacity-70"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="grow"
                                        id="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        required
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary join-item"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WinModal;
