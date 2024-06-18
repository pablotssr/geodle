import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TutorialModal = () => {
    return (
        <div id="tutorial">
            <label
                htmlFor="tutorial-modal"
                className="btn btn-circle btn-ghost"
            >
                <FontAwesomeIcon icon={faInfoCircle} />
            </label>
            <input
                type="checkbox"
                id="tutorial-modal"
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">How to play?</h3>
                    <label
                        htmlFor="tutorial-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <div className="flex gap-2 flex-col py-4">
                        <p>Geodle is a French city guessing game. </p>
                        <p>
                            There are 2 different game modes, a Wordle and a
                            Map.
                        </p>
                        <p>
                            All towns are prefectures or sub-prefectures of
                            different French departments.
                        </p>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor="tutorial-modal">
                    Close
                </label>
            </div>
        </div>
    );
};

export default TutorialModal;
