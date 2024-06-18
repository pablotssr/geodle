import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Leaderboard from "../Leaderboard/Leaderboard";

const LeaderboardModal = () => {
    return (
        <div id="leaderboard">
            <label
                htmlFor="leaderboard-modal"
                className="btn btn-circle btn-ghost"
            >
                <FontAwesomeIcon icon={faTrophy} />
            </label>
            <input
                type="checkbox"
                id="leaderboard-modal"
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h2 className="text-2xl text-center font-bold mb-4 text-base-content">
                        Leaderboard
                    </h2>
                    <label
                        htmlFor="leaderboard-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <Leaderboard />
                </div>
                <label className="modal-backdrop" htmlFor="leaderboard-modal">
                    Close
                </label>
            </div>
        </div>
    );
};

export default LeaderboardModal;
