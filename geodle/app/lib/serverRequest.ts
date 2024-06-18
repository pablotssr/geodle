'use server';
import {sql} from "@vercel/postgres";

export async function registerUser(username: string) {
    try {
      const result = await sql`
        INSERT INTO users (username)
        VALUES (${username})
        RETURNING id
      `;
      const userId = result.rows[0].id;

      return { success: true, message: 'Inscription réussie.', userId};
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { success: false, message: 'Erreur lors de l\'inscription.' };
    }
  }
 
  export async function getLatestUsers() {
    try {
      const result = await sql`
        SELECT * FROM score INNER JOIN users ON users.id = score.userId WHERE score.date >= NOW() - INTERVAL '12 HOURS'
      `;
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
    }
  }

  export async function registerScore(score: number, jeu: string, nomville: string, username: string) {
    try {
      await sql`
        INSERT INTO score (essais, typejeu, nomville, userId)
        VALUES (${score}, ${jeu}, ${nomville}, ${username})
      `;
      return { success: true, message: 'score de :' + score };
    } catch (error) {
      console.error('cacapisse', error);
      return { success: false, message: 'prout' };
    }
  }
