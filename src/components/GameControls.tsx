import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../types/game';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onDirectionChange: (direction: Direction) => void;
}

export default function GameControls({
  isPlaying,
  isPaused,
  isGameOver,
  onStart,
  onPause,
  onResume,
  onReset,
  onDirectionChange,
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      {/* Main Control Buttons */}
      <div className="flex gap-4 justify-center">
        {!isPlaying || isGameOver ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            {isGameOver ? 'New Game' : 'Start Game'}
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Resume
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        {isPlaying && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        )}
      </div>

      {/* Direction Controls (Mobile) */}
      <div className="md:hidden">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onDirectionChange('UP')}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
            disabled={!isPlaying || isPaused}
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onDirectionChange('LEFT')}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
              disabled={!isPlaying || isPaused}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => onDirectionChange('DOWN')}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
              disabled={!isPlaying || isPaused}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => onDirectionChange('RIGHT')}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
              disabled={!isPlaying || isPaused}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}