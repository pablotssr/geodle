import { HintsProps } from "@/app/lib/definitions";
import { useEffect, useState } from "react";

const Hints = ({ randomCity, nbTries, gamemode }: HintsProps) => {
    const [hint, setHint] = useState<string | null>(null);
    const handleHintClick = (value: string) => {
        setHint(value);
    };

    const trials = gamemode === "word" ? [2, 3, 4] : [3, 6, 9];

    useEffect(() => {
        setHint("");
    }, [randomCity]);

    return (
        <div className="flex items-center gap-2 flex-col">
            <h4 className="font-bold text-lg">Hints</h4>
            <div className="flex flex-row gap-2">
                <div
                    className="tooltip"
                    data-tip={`Unlockable after ${trials[0]} trials`}
                >
                    <button
                        className="btn btn-neutral"
                        disabled={nbTries < trials[0]}
                        onClick={() =>
                            randomCity.additionalData &&
                            handleHintClick(
                                randomCity.additionalData.region_name
                            )
                        }
                    >
                        Region
                    </button>
                </div>
                <div
                    className="tooltip"
                    data-tip={`Unlockable after ${trials[1]} trials`}
                >
                    <button
                        className="btn btn-neutral"
                        disabled={nbTries < trials[1]}
                        onClick={() =>
                            randomCity.additionalData &&
                            handleHintClick(
                                randomCity.additionalData.department_name
                            )
                        }
                    >
                        Department
                    </button>
                </div>
                <div
                    className="tooltip"
                    data-tip={`Unlockable after ${trials[2]} trials`}
                >
                    <button
                        className="btn btn-neutral"
                        disabled={nbTries < trials[2]}
                        onClick={() =>
                            randomCity.additionalData &&
                            handleHintClick(randomCity.additionalData.zip_code)
                        }
                    >
                        Zip Code
                    </button>
                </div>
            </div>
            {hint && hint !== null && (
                <span className="capitalize">{hint}</span>
            )}
        </div>
    );
};

export default Hints;
