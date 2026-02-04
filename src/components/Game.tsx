import { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import { GameState, Direction, Position, BOARD_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../types/game';
import { PlayCircle, PauseCircle, RotateCcw, Zap } from 'lucide-react';

interface GameProps {
  onHighScore: (score: number) => void;
}

export default function Game({ onHighScore }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: [{ x: 10, y: 10 }],
    food: generateFood([{ x: 10, y: 10 }]),
    direction: 'RIGHT',
    score: 0,
    highScore: 0,
    isGameOver: false,
    isPaused: true,
    speed: INITIAL_SPEED,
  }));

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  function generateFood(snake: Position[]): Position {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) return prevState;

      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (prevState.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        onHighScore(prevState.score);
        return { ...prevState, isGameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        onHighScore(prevState.score);
        return { ...prevState, isGameOver: true };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        const newScore = prevState.score + 10;
        const newSpeed = Math.max(50, prevState.speed - SPEED_INCREMENT);
        
        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
          speed: newSpeed,
        };
      } else {
        newSnake.pop();
      }

      return { ...prevState, snake: newSnake };
    });
  }, [onHighScore]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      return;
    }

    if (e.key === 'Escape') {
      resetGame();
      return;
    }

    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) return prevState;

      let newDirection = prevState.direction;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (prevState.direction !== 'DOWN') newDirection = 'UP';
          break;
        case 'arrowdown':
        case 's':
          if (prevState.direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'arrowleft':
        case 'a':
          if (prevState.direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'arrowright':
        case 'd':
          if (prevState.direction !== 'LEFT') newDirection = 'RIGHT';
          break;
      }

      return { ...prevState, direction: newDirection };
    });
  }, []);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false, isGameOver: false }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: 'RIGHT',
      score: 0,
      highScore: gameState.highScore,
      isGameOver: false,
      isPaused: true,
      speed: INITIAL_SPEED,
    });
  };

  // Game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    if (!gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, gameState.speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.speed, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="space-y-6">
      {/* Score and Speed */}
      <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-3xl font-bold text-snake">{gameState.score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Speed <Zap className="w-3 h-3" />
            </p>
            <p className="text-xl font-bold text-yellow-400">
              {Math.round((INITIAL_SPEED - gameState.speed) / SPEED_INCREMENT) + 1}x
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!gameState.isGameOver && (
            <button
              onClick={gameState.isPaused ? startGame : pauseGame}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label={gameState.isPaused ? 'Play' : 'Pause'}
            >
              {gameState.isPaused ? (
                <PlayCircle className="w-6 h-6 text-snake" />
              ) : (
                <PauseCircle className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          )}
          <button
            onClick={resetGame}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Restart"
          >
            <RotateCcw className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard gameState={gameState} />

      {/* Game Controls */}
      <GameControls
        onDirectionChange={(direction) => {
          setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            
            // Prevent opposite direction
            if (
              (direction === 'UP' && prev.direction === 'DOWN') ||
              (direction === 'DOWN' && prev.direction === 'UP') ||
              (direction === 'LEFT' && prev.direction === 'RIGHT') ||
              (direction === 'RIGHT' && prev.direction === 'LEFT')
            ) {
              return prev;
            }
            
            return { ...prev, direction };
          });
        }}
        disabled={gameState.isGameOver || gameState.isPaused}
      />

      {/* Game Over Overlay */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-game-over">
          <div className="bg-gray-800 p-8 rounded-xl text-center space-y-4">
            <h2 className="text-4xl font-bold text-red-400">Game Over!</h2>
            <p className="text-2xl">Final Score: <span className="font-bold text-snake">{gameState.score}</span></p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-snake hover:bg-snake-dark text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center space-y-4">
            <PauseCircle className="w-16 h-16 text-yellow-400 mx-auto" />
            <p className="text-2xl font-bold">Game Paused</p>
            <p className="text-gray-400">Press SPACE to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}