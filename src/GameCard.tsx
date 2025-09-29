import React from "react";
import { searchGames, convertApiToGame } from "./services/gameApi";
import { type Game } from "./data/games";

interface GameCardProps {
  name: string;
}

const GameCard = ({ name }: GameCardProps) => {
  const characterCards = [
    "Favourite Protagonist",
    "Favourite Male",
    "Best Girl",
    "Most Hated Character",
    "Best Boss",
  ];
  const isCharacterCard = characterCards.includes(name);

  const [characterName, setCharacterName] = React.useState("");
  const [savedCharacter, setSavedCharacter] = React.useState("");
  const [gameName, setGameName] = React.useState("");
  const [savedGame, setSavedGame] = React.useState<Game | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCharacterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value);
  };

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const findGame = async (searchName: string): Promise<Game | null> => {
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

  const handleSaveGame = async () => {
    // Поиск игры
    if (gameName.trim()) {
      setIsLoading(true);
      try {
        const foundGame = await findGame(gameName);
        setSavedGame(foundGame);
      } catch (error) {
        console.error("Search failed:", error);
        setSavedGame(null);
      } finally {
        setIsLoading(false);
      }
    }

    // Сохранение персонажа (независимо)
    if (isCharacterCard && characterName.trim()) {
      setSavedCharacter(characterName.trim());
    }

    // Очистка инпутов
    setGameName("");
    if (isCharacterCard) {
      setCharacterName("");
    }
  };

  return (
    <div className="w-44 h-80 mb-1.5 bg-gray-200">
      <input
        onChange={handleGameName}
        value={gameName}
        className="w-32 pl-1 mb-1"
        placeholder="Name game"
        disabled={isLoading}
      />
      {isCharacterCard && (
        <input
          onChange={handleCharacterName}
          value={characterName}
          className="w-32 pl-1"
          placeholder="Character name"
        />
      )}

      <div className="flex justify-center-safe gap-2 m-1">
        <button
          className="border-1 p-0.5 cursor-pointer disabled:opacity-50"
          onClick={handleSaveGame}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Select"}
        </button>
        <button
          onClick={() => {
            setSavedGame(null);
            setSavedCharacter("");
          }}
          className="border-1 p-1 cursor-pointer"
          disabled={isLoading}
        >
          Clear
        </button>
      </div>

      <div className="h-52 bg-gray-500 text-center text-amber-50 flex items-center justify-center">
        {isLoading ? (
          <p>Searching game...</p>
        ) : savedGame ? (
          <div>
            <img
              src={savedGame.imageUrl}
              alt={savedGame.name}
              className="w-32 h-40 mx-auto mb-2 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
            <p className="text-sm">
              {isCharacterCard
                ? savedCharacter || savedGame.name
                : savedGame.name}
            </p>
          </div>
        ) : isCharacterCard && savedCharacter ? (
          <div>
            <div className="w-32 h-40 mx-auto mb-2 bg-gray-600 flex items-center justify-center">
              <span className="text-xs">No game image</span>
            </div>
            <p className="text-sm">{savedCharacter}</p>
          </div>
        ) : (
          <p>No game selected</p>
        )}
      </div>

      <div>
        <h2 className="text-center font-semibold">{name}</h2>
      </div>
    </div>
  );
};

export default GameCard;
