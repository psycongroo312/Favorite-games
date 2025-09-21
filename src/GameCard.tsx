import React from "react";

interface GameCardProps {
  name: string;
}

const GameCard = ({ name }: GameCardProps) => {
  const [gameName, setGameName] = React.useState("");
  const [gameSavedName, setGameSaveName] = React.useState<string>();

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleSaveGame = () => {
    if (gameName.trim()) {
      setGameSaveName(gameName);
      setGameName("");
    }
  };

  const handleClearGame = () => {
    setGameSaveName("");
  };

  return (
    <div className="w-36 h-48 mb-1.5">
      <div className="cursor-pointer h-40 bg-gray-500 text-center text-amber-50">
        <input
          onChange={handleGameName}
          value={gameName}
          className="w-32 pl-1 m-auto"
          placeholder="Name game"
        ></input>
        <div className="flex justify-center-safe gap-2 m-2">
          <button
            className="border-1 p-1 cursor-pointer"
            onClick={handleSaveGame}
          >
            Select
          </button>
          <button
            className="border-1 p-1 cursor-pointer"
            onClick={handleClearGame}
          >
            Clear
          </button>
        </div>
        <p>{gameSavedName}</p>
      </div>
      <div>
        <h2 className="text-center">{name}</h2>
      </div>
    </div>
  );
};

export default GameCard;
