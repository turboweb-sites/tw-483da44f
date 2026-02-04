import { Trophy } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export default function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-6 px-4">
      <div className="text-white">
        <p className="text-sm text-gray-400">Score</p>
        <p className="text-3xl font-bold">{score}</p>
      </div>
      
      <div className="text-white text-right">
        <p className="text-sm text-gray-400 flex items-center justify-end gap-1">
          <Trophy size={16} />
          High Score
        </p>
        <p className="text-3xl font-bold">{highScore}</p>
      </div>
    </div>
  );
}