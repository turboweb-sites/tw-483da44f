import { useState, useEffect, useCallback } from 'react';
import Game from './components/Game';
import { Trophy, Gamepad2 } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleHighScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-snake" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-snake to-green-300 bg-clip-text text-transparent">
              Snake Game
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-gray-400">High Score:</span>
            <span className="font-bold text-yellow-400">{highScore}</span>
          </div>
        </div>

        {/* Game */}
        <Game onHighScore={handleHighScore} />

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400">
          <p className="mb-2 text-lg">Use arrow keys or WASD to control the snake</p>
          <p className="text-sm">Press SPACE to pause • ESC to restart</p>
        </div>
      </div>
    </div>
  );
}