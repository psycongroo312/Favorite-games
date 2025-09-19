interface GameCardProps {
  name: string;
}

const GameCard = ({ name }: GameCardProps) => {
  return (
    <div className="w-36 h-48 mb-1.5">
      <div className=" cursor-pointer h-40 bg-gray-500 text-3xl text-center text-amber-50">
        <button>Select game</button>
      </div>
      <div>
        <h2 className="text-center">{name}</h2>
      </div>
    </div>
  );
};

export default GameCard;
