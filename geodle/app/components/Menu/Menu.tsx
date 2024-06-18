"use client";
import Link from "next/link";
import Image from "next/image";
import Leaderboard from "../Leaderboard/Leaderboard";

export default function MenuPage() {
    return (
        <div className="p-6 space-y-4 flex gap-8 flex-col">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-center font-bold">
                    Choose your gamemode
                </h2>
                <div className="flex flew-row gap-8">
                    <Link className="" href="/wordle">
                        <div className="card card-compact w-96 bg-base-100 shadow-xl">
                            <figure>
                                <div className="w-[400px] h-[189px] relative">
                                    <Image
                                        src="/wordle.png"
                                        alt="Wordle Gamemode"
                                        width={400}
                                        height={189}
                                        layout="intrinsic"
                                        objectFit="cover"
                                    />
                                </div>
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
                                <div className="w-[400px] h-[189px] relative">
                                    <Image
                                        src="/map_placeholder.png"
                                        alt="Map Gamemode"
                                        width={400}
                                        height={189}
                                        layout="intrinsic"
                                        objectFit="cover"
                                    />
                                </div>
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
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-center font-bold text-base-content">
                    Leaderboard
                </h2>
                <Leaderboard />
            </div>
        </div>
    );
}
