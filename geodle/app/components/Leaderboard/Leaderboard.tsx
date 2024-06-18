import { useEffect, useState } from "react";
import { getLatestUsers } from "@/app/lib/serverRequest";
import { QueryResultRow } from "@vercel/postgres";

const Leaderboard = () => {
    const [latestUsers, setLatestUsers] = useState<QueryResultRow[]>([]);

    useEffect(() => {
        async function fetchLatestUsers() {
            try {
                const response = await getLatestUsers();
                if (response && response.rows) {
                    setLatestUsers(response.rows);
                } else {
                    console.error(
                        "Empty response or missing 'rows' property:",
                        response
                    );
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchLatestUsers();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-96">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Gamemode</th>
                            <th>City</th>
                            <th>Trials</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latestUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className={index % 2 === 0 ? "bg-base-200" : ""}
                            >
                                <td>{user.username}</td>
                                <td>
                                    {user.typejeu === "map" ? "Map" : "Wordle"}
                                </td>
                                <td>{user.nomville}</td>
                                <td className="flex justify-center">
                                    {user.essais <= 3 && (
                                        <div className="rounded w-fit px-2 dark:text-black bg-green-300">
                                            {user.essais}
                                        </div>
                                    )}
                                    {user.essais > 3 && user.essais <= 5 && (
                                        <div className="rounded w-fit px-2 dark:text-black bg-orange-300">
                                            {user.essais}
                                        </div>
                                    )}
                                    {user.essais > 5 && (
                                        <div className="text-center dark:text-black rounded w-fit px-2 bg-red-300">
                                            {user.essais}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
