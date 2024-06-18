import React from "react";

const Leaderboard = () => {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Name</th>
                            <th>Gamemode</th>
                            <th>City</th>
                            <th>Trials</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-base-200">
                            <th>1</th>
                            <td>Assia de nasdas</td>
                            <td>Wordle</td>
                            <td>Montauban</td>
                            <td>5</td>
                        </tr>
                        <tr className="">
                            <th>2</th>
                            <td>Simon Bite</td>
                            <td>Map</td>
                            <td>Paris</td>
                            <td>11</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
