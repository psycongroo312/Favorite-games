import { type Game } from "../data/games";

export interface ApiGame {
  id: number;
  name: string;
  background_image: string;
}

export const searchGames = async (query: string): Promise<ApiGame[]> => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?search=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching games:", error);
    return [];
  }
};

export const convertApiToGame = (apiGame: ApiGame): Game => {
  return {
    name: apiGame.name,
    imageUrl:
      apiGame.background_image ||
      "https://via.placeholder.com/300x200?text=No+Image",
  };
};
