import React from "react";
import { mockGames } from "./data/games";
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

  const handleCharacterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value);
  };

  const handleGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleSaveGame = () => {
    // Сохраняем игру независимо
    if (gameName.trim()) {
      const foundGame = findGame(gameName);
      if (foundGame) {
        setSavedGame(foundGame);
      } else {
        setSavedGame(null); // игра не найдена, но это ОК
      }
    }

    // Сохраняем персонажа независимо (только для карточек персонажей)
    if (isCharacterCard && characterName.trim()) {
      setSavedCharacter(characterName.trim());
    }

    // Очищаем инпуты
    setGameName("");
    if (isCharacterCard) {
      setCharacterName("");
    }
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
          className="border-1 p-0.5 cursor-pointer"
          onClick={handleSaveGame}
        >
          Select
        </button>
        <button
          onClick={() => {
            setSavedGame(null);
            setSavedCharacter("");
          }}
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
            <p className="text-sm">
              {isCharacterCard ? savedCharacter : savedGame.name}
            </p>
          </div>
        ) : isCharacterCard && savedCharacter ? (
          // Показать персонажа даже если игры нет
          <div>
            <div className="w-32 h-40 m-auto pt-2 bg-gray-600 flex items-center justify-center">
              <span>No game image</span>
            </div>
            <p className="text-sm">{savedCharacter}</p>
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
