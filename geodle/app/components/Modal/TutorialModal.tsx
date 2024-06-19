import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Key from "../Key/Key";

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
                    <div className="flex flex-col pt-2 pb-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <p>
                                Geodle is a French city guessing game. There are
                                2 different game modes, a Wordle and a Map.
                            </p>
                            <p>
                                All towns are prefectures or sub-prefectures of
                                the various French departments.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex-col flex gap-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-md font-bold">
                                        Wordle:
                                    </h3>
                                    <p>
                                        The different colors of the cells
                                        represent a state for the letter in the
                                        name of the city to be guessed.
                                    </p>
                                </div>
                                <div className="flex flex-row justify-evenly gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="cursor-default">
                                            <Key
                                                value={"Z"}
                                                status={"guessing"}
                                                type={"cell"}
                                            />
                                        </div>
                                        <span className="font-bold">
                                            Guessing
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <Key
                                            value={"A"}
                                            status={"absent"}
                                            type={"cell"}
                                        />
                                        <span className="font-bold">
                                            Absent
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Key
                                            value={"Z"}
                                            status={"present"}
                                            type={"cell"}
                                        />
                                        <span className="font-bold">
                                            Present
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Key
                                            value={"A"}
                                            status={"correct"}
                                            type={"cell"}
                                        />
                                        <span className="font-bold">
                                            Correct
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col flex gap-4">
                                <div className="flex-col flex gap-1">
                                    <h3 className="text-md font-bold">Map:</h3>
                                    <p>
                                        The different colors of the markers
                                        correspond to the distance between the
                                        guess and the solution.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row gap-4 justify-evenly">
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <img
                                                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
                                                alt="Red Marker"
                                                className="h-8"
                                            />
                                            <span className="font-bold">
                                                Far
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <img
                                                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png"
                                                alt="Orange Marker"
                                                className="h-8"
                                            />
                                            <span className="font-bold">
                                                Intermediate
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <img
                                                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png"
                                                alt="Yellow Marker"
                                                className="h-8"
                                            />
                                            <span className="font-bold">
                                                Near
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <img
                                                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
                                                alt="Green Marker"
                                                className="h-8"
                                            />
                                            <span className="font-bold">
                                                Solution
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
