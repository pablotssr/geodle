import { IndiceProps } from "@/app/lib/definitions";
import { useState } from "react";

const Hints = ({ randomCity, nbTries, gamemode }: IndiceProps) => {
    const [indice, setIndice] = useState<string | null>(null);
    const handleIndiceClick = (value: string) => {
        setIndice(value);
    };

    return (
        <div className="flex items-center gap-4 flex-col">
            <h4 className="font-bold text-lg">Indice :</h4>
            <div className="flex flex-row gap-2">
                <button
                    className="btn btn-neutral"
                    disabled={gamemode === "map" ? nbTries < 3 : gamemode === "word" ? nbTries < 2 : false}
                    onClick={() =>
                        randomCity.additionalData &&
                        handleIndiceClick(randomCity.additionalData.region_name)
                    }
                >
                    Region
                </button>
                <button
                    className="btn btn-neutral"
                    disabled={gamemode === "map" ? nbTries < 6 : gamemode === "word" ? nbTries < 3 : false}
                    onClick={() =>
                        randomCity.additionalData &&
                        handleIndiceClick(
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
                        handleIndiceClick(randomCity.additionalData.zip_code)
                    }
                >
                    Zip Code
                </button>
            </div>
            {indice && indice !== null && <span>{indice}</span>}
        </div>
    );
};

export default Hints;
