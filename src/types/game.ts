export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  paused: boolean;
  score: number;
  highScore: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;