import { City, GameStates } from "@/app/lib/definitions";

interface WinModalProps {
    city: City;
    gameState: keyof typeof GameStates;
}

const WinModal: React.FC<WinModalProps> = ({ city, gameState }) => {
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
                </div>
            )}
        </div>
    );
};

export default WinModal;
