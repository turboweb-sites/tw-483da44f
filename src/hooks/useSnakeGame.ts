import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Direction, Position, GRID_SIZE, INITIAL_SPEED } from '../types/game';

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const getRandomFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export default function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: getRandomFood(INITIAL_SNAKE),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    gameOver: false,
    paused: true,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0')
  });
  
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  
  const moveSnake = useCallback(() => {
    if (gameState.gameOver || gameState.paused) return;
    
    setGameState(prev => {
      const head = { ...prev.snake[0] };
      const direction = prev.nextDirection;
      
      // Move head based on direction
      switch (direction) {
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
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, gameOver: true };
      }
      
      // Check self collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true };
      }
      
      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      
      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 10;
        newFood = getRandomFood(newSnake);
      } else {
        newSnake.pop();
      }
      
      // Update high score
      const newHighScore = Math.max(newScore, prev.highScore);
      if (newHighScore > prev.highScore) {
        localStorage.setItem('snakeHighScore', newHighScore.toString());
      }
      
      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHighScore,
        direction: direction
      };
    });
  }, [gameState.gameOver, gameState.paused]);
  
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) return;
    
    const keyMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'w': 'UP',
      's': 'DOWN',
      'a': 'LEFT',
      'd': 'RIGHT',
      'W': 'UP',
      'S': 'DOWN',
      'A': 'LEFT',
      'D': 'RIGHT'
    };
    
    if (e.key === ' ') {
      e.preventDefault();
      if (gameState.paused) {
        resumeGame();
      } else {
        pauseGame();
      }
      return;
    }
    
    const newDirection = keyMap[e.key];
    if (!newDirection) return;
    
    setGameState(prev => {
      // Prevent going back into itself
      const opposites: Record<Direction, Direction> = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
      };
      
      if (opposites[prev.direction] === newDirection) {
        return prev;
      }
      
      return { ...prev, nextDirection: newDirection };
    });
  }, [gameState.gameOver, gameState.paused]);
  
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: false }));
  }, []);
  
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: true }));
  }, []);
  
  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: false }));
  }, []);
  
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      snake: INITIAL_SNAKE,
      food: getRandomFood(INITIAL_SNAKE),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      gameOver: false,
      paused: false,
      score: 0,
      highScore: prev.highScore
    }));
  }, []);
  
  // Game loop
  useEffect(() => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    
    if (!gameState.paused && !gameState.gameOver) {
      gameInterval.current = setInterval(moveSnake, INITIAL_SPEED);
    }
    
    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, [moveSnake, gameState.paused, gameState.gameOver]);
  
  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleKeyPress
  };
}