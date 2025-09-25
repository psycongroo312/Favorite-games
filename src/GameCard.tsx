import React from "react";
import { mockGames } from "./data/games";
import { type Game } from "./data/games";

interface GameCardProps {
  name: string;
}

const GameCard = ({ name }: GameCardProps) => {
  const [gameName, setGameName] = React.useState("");
  const [savedGame, setSavedGame] = React.useState<Game | null>(null);

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleSaveGame = () => {
    const foundGame = findGame(gameName);
    if (foundGame) {
      setSavedGame(foundGame);
    } else {
      setSavedGame(null);
    }
    setGameName("");
  };

  const findGame = (searchName: string): Game | null => {
    const found = mockGames.find(
      (game) => game.name.toLowerCase() === searchName.toLowerCase(),
    );
    return found || null;
  };

  return (
    <div className="w-44 h-80 mb-1.5 bg-gray-200">
      <input
        onChange={handleGameName}
        value={gameName}
        className="w-32 pl-1"
        placeholder="Name game"
      ></input>
      <div className="flex justify-center-safe gap-2 m-1">
        <button
          className="border-1 p-0.5 cursor-pointer"
          onClick={handleSaveGame}
        >
          Select
        </button>
        <button
          onClick={() => setSavedGame(null)}
          className="border-1 p-1 cursor-pointer"
        >
          Clear
        </button>
      </div>
      <div className="h-52 bg-gray-500 text-center text-amber-50">
        {savedGame ? (
          <div>
            <img
              src={savedGame.imageUrl}
              alt={savedGame.name}
              className="w-32 h-40 m-auto pt-2"
            />
            <p className="text-sm">{savedGame.name}</p>
          </div>
        ) : (
          <p>No game selected</p>
        )}
      </div>
      <div>
        <h2 className="text-center">{name}</h2>
      </div>
    </div>
  );
};

export default GameCard;
