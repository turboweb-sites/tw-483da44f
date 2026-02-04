import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import ScoreDisplay from './components/ScoreDisplay';
import useSnakeGame from './hooks/useSnakeGame';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const {
    snake,
    food,
    score,
    highScore,
    isPlaying,
    isPaused,
    isGameOver,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    changeDirection,
  } = useSnakeGame();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full animate-slide-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Snake Game</h1>
          </div>
          <p className="text-gray-400">Use arrow keys or WASD to control the snake</p>
        </div>

        {/* Score Display */}
        <ScoreDisplay score={score} highScore={highScore} />

        {/* Game Board */}
        <GameBoard 
          snake={snake} 
          food={food} 
          isGameOver={isGameOver}
          isPaused={isPaused}
        />

        {/* Game Controls */}
        <GameControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isGameOver={isGameOver}
          onStart={startGame}
          onPause={pauseGame}
          onResume={resumeGame}
          onReset={resetGame}
          onDirectionChange={changeDirection}
        />

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🎮 Controls: Arrow Keys or WASD</p>
          <p>⏸️ Pause/Resume: Spacebar or P</p>
        </div>
      </div>
    </div>
  );
}