import { GameState, GRID_SIZE } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
}

export default function GameBoard({ gameState }: GameBoardProps) {
  const cellSize = 20;
  const boardSize = GRID_SIZE * cellSize;
  
  const renderCell = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
    const isSnakeBody = gameState.snake.some((segment, index) => 
      index > 0 && segment.x === x && segment.y === y
    );
    const isFood = gameState.food.x === x && gameState.food.y === y;
    
    return (
      <div
        key={`${x}-${y}`}
        className={`absolute transition-all duration-100 ${
          isSnakeHead 
            ? 'bg-green-400 rounded-sm z-20' 
            : isSnakeBody 
            ? 'bg-green-500 rounded-sm z-10' 
            : isFood 
            ? 'bg-red-500 rounded-full animate-pulse z-30' 
            : ''
        }`}
        style={{
          left: x * cellSize,
          top: y * cellSize,
          width: cellSize - 1,
          height: cellSize - 1,
        }}
      />
    );
  };
  
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push(renderCell(x, y));
    }
  }
  
  return (
    <div 
      className="relative bg-gray-900 rounded-lg mx-auto border-4 border-gray-700"
      style={{ width: boardSize, height: boardSize }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={`h-${i}`}>
            <div 
              className="absolute bg-gray-600"
              style={{
                left: 0,
                top: i * cellSize,
                width: '100%',
                height: 1,
              }}
            />
            <div 
              className="absolute bg-gray-600"
              style={{
                left: i * cellSize,
                top: 0,
                width: 1,
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>
      
      {cells}
    </div>
  );
}