import { GameState, BOARD_SIZE } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
}

export default function GameBoard({ gameState }: GameBoardProps) {
  const { snake, food } = gameState;

  const isSnakeCell = (x: number, y: number) => {
    return snake.some((segment, index) => {
      if (segment.x === x && segment.y === y) {
        return { isSnake: true, isHead: index === 0 };
      }
      return false;
    });
  };

  const getCellClass = (x: number, y: number) => {
    const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
    
    if (snakeIndex !== -1) {
      if (snakeIndex === 0) {
        return 'bg-snake shadow-lg shadow-snake/50 rounded-sm scale-110 z-10';
      }
      return 'bg-snake-dark rounded-sm';
    }
    
    if (food.x === x && food.y === y) {
      return 'bg-food shadow-lg shadow-food-glow/50 animate-pulse-food rounded-full';
    }
    
    return 'bg-board-lines/20';
  };

  return (
    <div className="relative bg-board rounded-2xl p-4 shadow-2xl">
      <div 
        className="grid gap-[2px] mx-auto"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          width: 'min(100%, 600px)',
          aspectRatio: '1'
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          
          return (
            <div
              key={`${x}-${y}`}
              className={`game-cell ${getCellClass(x, y)}`}
            />
          );
        })}
      </div>
    </div>
  );
}