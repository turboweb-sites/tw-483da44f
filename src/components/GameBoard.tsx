import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  isGameOver: boolean;
  isPaused: boolean;
}

export default function GameBoard({ snake, food, isGameOver, isPaused }: GameBoardProps) {
  const GRID_SIZE = 20;
  const cells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const isSnakeHead = snake[0]?.x === col && snake[0]?.y === row;
      const isSnakeBody = snake.slice(1).some(segment => segment.x === col && segment.y === row);
      const isFood = food.x === col && food.y === row;

      let cellClass = 'relative border border-gray-700 bg-gray-800';
      
      if (isSnakeHead) {
        cellClass += ' snake-head';
      } else if (isSnakeBody) {
        cellClass += ' snake-segment';
      } else if (isFood) {
        cellClass += ' food';
      }

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`game-cell ${cellClass}`}
        />
      );
    }
  }

  return (
    <div className="relative mb-6">
      <div className="grid grid-cols-20 gap-0 aspect-square max-w-xl mx-auto rounded-lg overflow-hidden border-2 border-gray-700">
        {cells}
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center animate-slide-in">
            <h2 className="text-4xl font-bold text-red-500 mb-2">Game Over!</h2>
            <p className="text-xl text-white">Score: {snake.length - 1}</p>
            <p className="text-gray-400 mt-2">Press "New Game" to play again</p>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && !isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center animate-pulse">
            <h2 className="text-4xl font-bold text-yellow-500">Paused</h2>
            <p className="text-gray-400 mt-2">Press Resume or Spacebar to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}