export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
}

export const BOARD_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 5;