"use server";
import { sql } from "@vercel/postgres";

export async function registerUser(username: string) {
    try {
        const result = await sql`
        INSERT INTO users (username)
        VALUES (${username})
        RETURNING id
      `;
        const userId = result.rows[0].id;

        return { success: true, message: "Registration successful.", userId };
    } catch (error) {
        console.error("Error during registration:", error);
        return { success: false, message: "Error during registration." };
    }
}

export async function getLatestUsers() {
    try {
        const result = await sql`
        SELECT * FROM score INNER JOIN users ON users.id = score.userId WHERE score.date >= NOW() - INTERVAL '12 HOURS'
      `;
        return result;
    } catch (error) {
        console.error("Error during registration:", error);
    }
}

export async function registerScore(
    score: number,
    jeu: string,
    nomville: string,
    username: string
) {
    try {
        await sql`
        INSERT INTO score (essais, typejeu, nomville, userId)
        VALUES (${score}, ${jeu}, ${nomville}, ${username})
      `;
        return { success: true, message: "User score successfully registered:"};
    } catch (error) {
        console.error("Error when registering user score.", error);
        return { success: false, message: "Error when registering user score." };
    }
}
