import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import useSnakeGame from '../hooks/useSnakeGame';

export default function Game() {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleKeyPress
  } = useSnakeGame();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-3xl w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
        Snake Game
      </h1>
      
      <ScoreBoard score={gameState.score} highScore={gameState.highScore} />
      
      <div className="relative">
        <GameBoard gameState={gameState} />
        
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-gray-300 mb-6">Score: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw size={20} />
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
        {!gameState.gameOver && (
          <>
            {gameState.paused ? (
              <button
                onClick={resumeGame}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Play size={20} />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseGame}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Pause size={20} />
                Pause
              </button>
            )}
          </>
        )}
        
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
      
      <div className="mt-6 text-center text-gray-400">
        <p className="text-sm">Use arrow keys or WASD to move</p>
        <p className="text-sm">Press Space to pause/resume</p>
      </div>
    </div>
  );
}