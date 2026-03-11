import React from "react";
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

  const [roast, setRoast] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const buildSummaryText = () => {
    const allData = loadAllData();
    const lines = Object.entries(allData)
      .map(([name, { game, character }]) => {
        if (game || character) {
          const gameName = game?.name || "No game";
          const charName = character || "No character";
          return `${name}: ${gameName}${
            character ? `, Character: ${charName}` : ""
          }`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (!lines.length) {
      return "";
    }

    return `My Favorite Games:\n${lines.join("\n")}`;
  };

  const handleShare = async () => {
    const finalText = buildSummaryText();

    if (!finalText) {
      alert("No games or characters to share!");
      return;
    }

    try {
      await navigator.clipboard.writeText(finalText);
      alert("Your favorites have been copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard.");
    }
  };

  const handleRoast = async () => {
    const finalText = buildSummaryText();

    if (!finalText) {
      alert("Сначала добавь хотя бы одну игру или персонажа 😉");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/.netlify/functions/ai-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: finalText }),
      });

      if (!res.ok) {
        // В dev-режиме показываем заглушку, чтобы не требовать Netlify Dev
        if (import.meta.env.DEV) {
          setRoast(
            "Это тестовая прожарка в dev-режиме.\n\nПодними Netlify Functions (`netlify dev`) и добавь GROQ_API_KEY, чтобы увидеть настоящую прожарку от ИИ.",
          );
          return;
        }

        let errorMessage: string | undefined;
        try {
          const errorJson = await res.json();
          errorMessage = errorJson.error;
        } catch {
          // тело могло быть не JSON (например, HTML от Vite)
        }

        alert(
          "Ошибка: " +
            (errorMessage ??
              `сервер ИИ вернул статус ${res.status}. Попробуй позже.`),
        );
        return;
      }

      const json = await res.json();
      if (json.roast) {
        setRoast(json.roast);
      } else {
        if (import.meta.env.DEV) {
          setRoast(
            "Это тестовая прожарка в dev-режиме.\n\nОтвет от ИИ пришёл в неожиданном формате, но в проде (Netlify) всё ок.",
          );
          return;
        }
        alert("Ошибка: " + (json.error ?? "неизвестная ошибка от ИИ"));
      }
    } catch (e) {
      console.error(e);
      if (import.meta.env.DEV) {
        setRoast(
          "Это тестовая прожарка в dev-режиме.\n\nНе удалось достучаться до /.netlify/functions/ai-roast. Для реальной прожарки запусти `netlify dev` или открой деплой на Netlify.",
        );
      } else {
        alert("Не удалось связаться с ИИ");
      }
    } finally {
      setIsLoading(false);
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
              <button
                onClick={handleRoast}
                disabled={isLoading}
                className="bg-purple-900 hover:bg-red-700 text-white font-semibold py-1.5 px-3 text-sm rounded-lg shadow-md transition-colors duration-200"
              >
                {isLoading ? "Загрузка" : "Прожарка игрового вкуса"}
              </button>
            </div>
          </div>
          {roast && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 px-4 py-8">
              <div className="bg-slate-900 border-4 border-red-500 rounded-3xl max-w-xl w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
                <button
                  onClick={() => setRoast(null)}
                  className="absolute top-4 right-4 text-3xl text-red-400 hover:text-white"
                >
                  ✕
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4 sm:mb-6 pr-8">
                  Прожарка готова
                </h2>
                <div className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-slate-200">
                  {roast}
                </div>
                <button
                  onClick={async () => {
                    try {
                      if (roast) {
                        await navigator.clipboard.writeText(roast);
                        alert("прожарка скопирована в буфер обмена");
                      }
                    } catch (error) {
                      console.error("Error copying roast:", error);
                      alert("Не удалось скопировать прожарку");
                    }
                  }}
                  className="mt-4 sm:mt-6 w-full py-3 sm:py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-bold"
                >
                  Скопировать прожарку
                </button>
              </div>
            </div>
          )}
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
                  href="https://www.instagram.com/medicalmechanica312"
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
