"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestUsers } from "@/app/lib/serverRequest";

export default function MenuPage() {
    type GameType = "Wordle" | "Map";
    const [latestUsers, setLatestUsers] = useState([]);

    useEffect(() => {
        async function fetchLatestUsers() {
            try {
                const response = await getLatestUsers();
                setLatestUsers(response.rows); // Mettre à jour l'état avec les données reçues
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        }

        fetchLatestUsers();
    }, []);

    return (
        <div className="p-6 space-y-4 flex gap-2 flex-col">
            <h2 className="text-2xl text-center font-bold">
                Choose your gamemode
            </h2>
            <div className="flex flew-row gap-8">
                <Link className="" href="/word">
                    <div className="card card-compact w-96 bg-base-100 shadow-xl">
                        <figure>
                            <Image
                                className="h-48"
                                src="https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F27471bb0-730a-11ec-89e9-22d3d9c31ba2.jpg"
                                alt="Wordle Gamemode"
                                width={500}
                                height={300}
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Wordle</h2>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">
                                    Play Now
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link className="" href="/map">
                    <div className="card card-compact w-96 bg-base-100 shadow-xl">
                        <figure>
                            <Image
                                src="https://cdn.rohde-schwarz.com/pws/_tech/images/map-placeholder.png"
                                alt="Map Gamemode"
                                className="h-48"
                                width={500}
                                height={300}
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Map</h2>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">
                                    Play Now
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        <div>{/* Mapping through latestUsers to display each user */}
                {latestUsers.map(user => (
                        <div className="card-body">
                        {/* Condition pour afficher le type de jeu */}
                        {user.typejeu === "map" && (
                            <p>Map : {user.username} a trouvé {user.nomville} en {user.essais} essais !</p>
                        )}
                        {user.typejeu === "word" && (
                            <p>Word : {user.username} a trouvé {user.nomville} en {user.essais} essais !</p>
                        )}
                    </div>
                ))}</div>
        </div>
    );
}
