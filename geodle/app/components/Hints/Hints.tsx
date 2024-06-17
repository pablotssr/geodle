import { HintsProps } from "@/app/lib/definitions";
import { useEffect, useState } from "react";

const Hints = ({ randomCity, nbTries, gamemode }: HintsProps) => {
    const [hint, setHint] = useState<string | null>(null);
    const handleHintClick = (value: string) => {
        setHint(value);
    };
    // Enlever les indices quand reset

    useEffect(() =>{
        setHint("");
    },[randomCity])
    return (
        <div className="flex items-center gap-2 flex-col">
            <h4 className="font-bold text-lg">Hints</h4>
            <div className="flex flex-row gap-2">
                <button
                    className="btn btn-neutral"
                    disabled={gamemode === "map" ? nbTries < 3 : gamemode === "word" ? nbTries < 2 : false}
                    onClick={() =>
                        randomCity.additionalData &&
                        handleHintClick(randomCity.additionalData.region_name)
                    }
                >
                    Region
                </button>
                <button
                    className="btn btn-neutral"
                    disabled={gamemode === "map" ? nbTries < 6 : gamemode === "word" ? nbTries < 3 : false}
                    onClick={() =>
                        randomCity.additionalData &&
                        handleHintClick(
                            randomCity.additionalData.department_name
                        )
                    }
                >
                    Department
                </button>
                <button
                    className="btn btn-neutral"
                    disabled={gamemode === "map" ? nbTries < 9 : gamemode === "word" ? nbTries < 4 : false}
                    onClick={() =>
                        randomCity.additionalData &&
                        handleHintClick(randomCity.additionalData.zip_code)
                    }
                >
                    Zip Code
                </button>
            </div>
            {hint && hint !== null && <span className="capitalize">{hint}</span>}
        </div>
    );
};

export default Hints;
