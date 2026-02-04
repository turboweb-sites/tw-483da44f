import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, GameState } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

export default function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Move snake
  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      if (gameState !== 'playing') return currentSnake;

      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (directionRef.current) {
        case 'UP':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % GRID_SIZE;
          break;
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameOver');
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood());
        // Increase speed
        setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, food, generateFood]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(moveSnake, speed);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState, moveSnake, speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const key = e.key.toLowerCase();
      
      // Pause/Resume
      if (key === ' ' || key === 'p') {
        e.preventDefault();
        if (gameState === 'playing') {
          setGameState('paused');
        }
        return;
      }

      // Direction changes
      const newDirection = (() => {
        switch (key) {
          case 'arrowup':
          case 'w':
            return directionRef.current !== 'DOWN' ? 'UP' : null;
          case 'arrowdown':
          case 's':
            return directionRef.current !== 'UP' ? 'DOWN' : null;
          case 'arrowleft':
          case 'a':
            return directionRef.current !== 'RIGHT' ? 'LEFT' : null;
          case 'arrowright':
          case 'd':
            return directionRef.current !== 'LEFT' ? 'RIGHT' : null;
          default:
            return null;
        }
      })();

      if (newDirection) {
        e.preventDefault();
        directionRef.current = newDirection;
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Game controls
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('playing');
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('idle');
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const changeDirection = (newDirection: Direction) => {
    if (gameState !== 'playing') return;
    
    // Prevent opposite direction
    if (
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }
    
    directionRef.current = newDirection;
    setDirection(newDirection);
  };

  return {
    snake,
    food,
    score,
    highScore,
    isPlaying: gameState === 'playing',
    isPaused: gameState === 'paused',
    isGameOver: gameState === 'gameOver',
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    changeDirection,
  };
}