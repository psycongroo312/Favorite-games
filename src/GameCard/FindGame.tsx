import { searchGames, convertApiToGame } from "../services/gameApi";
import { type Game } from "../data/games";

const FindGame = async (searchName: string): Promise<Game | null> => {
  try {
    const results = await searchGames(searchName);
    if (results.length > 0) {
      return convertApiToGame(results[0]);
    }
    return null;
  } catch (error) {
    console.error("Error finding game:", error);
    return null;
  }
};

export default FindGame;
