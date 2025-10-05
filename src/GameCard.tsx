import React from "react";
import { searchGames, convertApiToGame } from "./services/gameApi";
import { type Game } from "./data/games";
import { saveCardData, loadCardData, clearCardData } from "./utils/storage";

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
    "Favorite OST",
    "Best Song",
    "Best Level (World Map/Stage/Area)",
  ];
  const isCharacterCard = characterCards.includes(name);

  const [characterName, setCharacterName] = React.useState("");
  const [savedCharacter, setSavedCharacter] = React.useState("");
  const [gameName, setGameName] = React.useState("");
  const [savedGame, setSavedGame] = React.useState<Game | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const savedData = loadCardData(name);
    setSavedGame(savedData.game);
    setSavedCharacter(savedData.character);
  }, [name]);

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
    let foundGame: Game | null = null;

    if (gameName.trim()) {
      setIsLoading(true);
      try {
        foundGame = await findGame(gameName);
        setSavedGame(foundGame);
      } catch (error) {
        console.error("Search failed:", error);
        setSavedGame(null);
      } finally {
        setIsLoading(false);
      }
    }

    let characterToSave = savedCharacter;
    if (isCharacterCard && characterName.trim()) {
      characterToSave = characterName.trim();
      setSavedCharacter(characterToSave);
    }

    if (foundGame || characterToSave) {
      saveCardData(name, foundGame, characterToSave);
    }

    setGameName("");
    if (isCharacterCard) {
      setCharacterName("");
    }
  };

  return (
    <div className="w-full max-w-44 h-[330px] mb-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-lg hover:shadow-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 mx-auto">
      <input
        onChange={handleGameName}
        value={gameName}
        className="w-full pl-2 mb-1 bg-slate-700 text-cyan-100 placeholder-slate-400 border border-slate-600 rounded focus:border-cyan-400 focus:outline-none text-base"
        placeholder="Name game"
        disabled={isLoading}
      />
      {isCharacterCard && (
        <input
          onChange={handleCharacterName}
          value={characterName}
          className="w-full pl-2 bg-slate-700 text-purple-100 placeholder-slate-400 border border-slate-600 rounded focus:border-purple-400 focus:outline-none text-base"
          placeholder="Name character/song/ost"
        />
      )}

      <div className="flex justify-center gap-1 m-1">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-2 text-xs rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          onClick={handleSaveGame}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Select"}
        </button>
        <button
          onClick={() => {
            setSavedGame(null);
            setSavedCharacter("");
            clearCardData(name);
          }}
          className="bg-slate-600 hover:bg-slate-700 text-cyan-100 font-semibold py-1 px-2 text-xs rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          disabled={isLoading}
        >
          Clear
        </button>
      </div>

      <div className="h-52 bg-gradient-to-br from-purple-900 to-blue-900 text-center text-cyan-100 flex items-center justify-center rounded-lg border border-slate-600 shadow-inner">
        {isLoading ? (
          <p className="text-cyan-300 font-medium">Searching game...</p>
        ) : savedGame ? (
          <div>
            <img
              src={savedGame.imageUrl}
              alt={savedGame.name}
              className="w-28 h-32 mx-auto mb-2 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
            <p className="text-sm font-semibold text-cyan-200">
              {isCharacterCard
                ? savedCharacter || savedGame.name
                : savedGame.name}
            </p>
          </div>
        ) : isCharacterCard && savedCharacter ? (
          <div>
            <div className="w-28 h-32 mx-auto mb-2 bg-slate-700 border border-slate-500 rounded flex items-center justify-center">
              <span className="text-xs text-slate-400">No game image</span>
            </div>
            <p className="text-sm font-semibold text-purple-200">
              {savedCharacter}
            </p>
          </div>
        ) : (
          <p className="text-slate-400 font-medium">No game selected</p>
        )}
      </div>

      <div className="flex justify-center items-center h-10 px-1">
        <h2 className="text-center text-cyan-100 font-bold text-xs leading-tight">
          {name}
        </h2>
      </div>
    </div>
  );
};

export default GameCard;
