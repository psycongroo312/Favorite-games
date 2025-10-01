import GameCard from "./GameCard";
import { cardNames } from "./data/cards";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 mb-2.5">
      <header className="flex justify-center py-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">
          FAVORITE GAMES
        </h1>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6 p-4">
        {cardNames.map((name) => (
          <GameCard key={name} name={name} />
        ))}
      </main>
    </div>
  );
}
