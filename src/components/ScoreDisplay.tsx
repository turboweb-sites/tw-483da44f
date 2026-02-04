import { Trophy, Target } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

export default function ScoreDisplay({ score, highScore }: ScoreDisplayProps) {
  return (
    <div className="flex justify-center gap-8 mb-6">
      <div className="bg-gray-700 rounded-lg px-6 py-3 flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-400" />
        <div>
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-2xl font-bold text-white">{score}</p>
        </div>
      </div>
      
      <div className="bg-gray-700 rounded-lg px-6 py-3 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <div>
          <p className="text-gray-400 text-sm">High Score</p>
          <p className="text-2xl font-bold text-white">{highScore}</p>
        </div>
      </div>
    </div>
  );
}