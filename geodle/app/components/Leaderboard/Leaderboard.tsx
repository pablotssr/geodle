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
                    console.error("Empty response or missing 'rows' property:", response);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchLatestUsers();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ranking</th>
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
                                <th>{index + 1}</th>
                                <td>{user.username}</td>
                                <td>
                                    {user.typejeu === "map" ? "Map" : "Wordle"}
                                </td>
                                <td>{user.nomville}</td>
                                <td>{user.essais}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
