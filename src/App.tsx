import GameCard from "./GameCard";
import { cardNames } from "./data/cards";
import "./index.css";
import { clearAllData, hasSavedData, loadAllData } from "./utils/storage";

export default function App() {
  const handleClearAll = () => {
    if (hasSavedData()) {
      const confirmed = window.confirm(
        "Are you sure you want to clear all saved games? This action cannot be undone.",
      );
      if (confirmed) {
        clearAllData();
        window.location.reload();
      }
    }
  };

  const handleShare = async () => {
    const allData = loadAllData();
    const shareText = Object.entries(allData)
      .map(([name, { game, character }]) => {
        if (game || character) {
          const gameName = game?.name || "No game";
          const charName = character || "No character";
          return `${name}: ${gameName}${character ? `, Character: ${charName}` : ""}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");

    if (!shareText) {
      alert("No games or characters to share!");
      return;
    }

    const finalText = `My Favorite Games:\n${shareText}`;
    try {
      await navigator.clipboard.writeText(finalText);
      alert("Your favorites have been copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-slate-900">
        <header className="py-4 px-2 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-300 to-violet-300 font-mono text-center">
              FAVORITE GAMES
            </h1>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleClearAll}
                className="bg-purple-900 hover:bg-red-700 text-white font-semibold py-1.5 px-3 text-sm rounded-lg shadow-md transition-colors duration-200"
                title="Clear all saved games"
              >
                Clear All
              </button>
              <button
                onClick={handleShare}
                className="bg-purple-900 hover:bg-red-700 text-white font-semibold py-1.5 px-3 text-sm rounded-lg shadow-md transition-colors duration-200"
              >
                Share
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 p-2 sm:p-4">
          {cardNames.map((name) => (
            <GameCard key={name} name={name} />
          ))}
        </main>

        <footer className="bg-slate-800/50 border-t border-slate-700 mt-4">
          <div className="max-w-7xl mx-auto px-2 py-3">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex items-center space-x-1">
                <span className="text-sm">🎮</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">
                  CYBERSHIGER
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <a
                  href="https://www.instagram.com/medicalmechanica312?igsh=MWVtN2Rhc3o5dmc5aw=="
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Contact
                </a>
                <span className="text-slate-600">Made from the heart</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
