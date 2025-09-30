import GameCard from "./GameCard";
import { cardNames } from "./data/cards";
import "./index.css";

export default function App() {
  return (
    <div className="mb-2.5">
      <header className="flex justify-center">
        <h1 className="text-3xl font-semibold">Favorite games</h1>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6 p-4">
        {cardNames.map((name) => (
          <GameCard key={name} name={name} />
        ))}
      </main>
    </div>
  );
}
