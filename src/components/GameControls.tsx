import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types/game';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled: boolean;
}

export default function GameControls({ onDirectionChange, disabled }: GameControlsProps) {
  const buttonClass = (isDisabled: boolean) => `
    p-4 rounded-lg transition-all ${
      isDisabled 
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
        : 'bg-gray-700 hover:bg-gray-600 active:scale-95 text-white'
    }
  `;

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-2 w-48">
        <div />
        <button
          onClick={() => onDirectionChange('UP')}
          disabled={disabled}
          className={buttonClass(disabled)}
          aria-label="Move Up"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />
        
        <button
          onClick={() => onDirectionChange('LEFT')}
          disabled={disabled}
          className={buttonClass(disabled)}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
          className={buttonClass(disabled)}
          aria-label="Move Down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          disabled={disabled}
          className={buttonClass(disabled)}
          aria-label="Move Right"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}