import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../Button';
import { IoPlay, IoPause, IoRefresh } from 'react-icons/io5';
import './index.css';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 5, y: 5 }];
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 200;

export const PixelSnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 10, y: 5 },
    direction: INITIAL_DIRECTION,
    isGameOver: false,
    isPaused: false,
    score: 0
  });

  const gameLoopRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      attempts++;
    } while (
      gameState.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
      attempts < maxAttempts
    );
    
    return newFood;
  }, [gameState.snake]);

  // Check if position is valid (within bounds and not colliding with snake)
  const isValidPosition = useCallback((pos: Position): boolean => {
    // Check bounds
    if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) {
      return false;
    }
    
    // Check collision with snake body (skip head for movement validation)
    return !gameState.snake.slice(1).some(segment => segment.x === pos.x && segment.y === pos.y);
  }, [gameState.snake]);

  // Move snake based on current direction
  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const head = { ...gameState.snake[0] };
    
    switch (gameState.direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check for collisions
    if (!isValidPosition(head)) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
      return;
    }

    const newSnake = [head, ...gameState.snake];
    
    // Check if food is eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      const newFood = generateFood();
      setGameState(prev => ({
        ...prev,
        snake: newSnake,
        food: newFood,
        score: prev.score + 10
      }));
    } else {
      newSnake.pop(); // Remove tail if no food eaten
      setGameState(prev => ({
        ...prev,
        snake: newSnake
      }));
    }
  }, [gameState, isValidPosition, generateFood]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.isGameOver) return;

    const key = event.key.toLowerCase();
    let newDirection = gameState.direction;

    switch (key) {
      case 'w':
      case 'arrowup':
        if (gameState.direction !== 'DOWN') newDirection = 'UP';
        break;
      case 's':
      case 'arrowdown':
        if (gameState.direction !== 'UP') newDirection = 'DOWN';
        break;
      case 'a':
      case 'arrowleft':
        if (gameState.direction !== 'RIGHT') newDirection = 'LEFT';
        break;
      case 'd':
      case 'arrowright':
        if (gameState.direction !== 'LEFT') newDirection = 'RIGHT';
        break;
      case ' ':
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        return;
    }

    if (newDirection !== gameState.direction) {
      setGameState(prev => ({ ...prev, direction: newDirection }));
    }
  }, [gameState.direction, gameState.isGameOver]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 10, y: 5 },
      direction: INITIAL_DIRECTION,
      isGameOver: false,
      isPaused: false,
      score: 0
    });
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Draw game on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas with fallback color
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--project-list-panel-bg-color')
      .trim() || '#0B141C';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid with fallback color
    const gridColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--card-border-color')
      .trim() || 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake with fallback colors
    const primaryColor = getComputedStyle(document.body)
      .getPropertyValue('--primary-color')
      .trim() || '#16825D';
    const secondaryColor = getComputedStyle(document.body)
      .getPropertyValue('--secondary-color')
      .trim() || '#6A1E55';

    console.log(primaryColor, secondaryColor);
    
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = primaryColor;
      } else {
        // Body
        ctx.fillStyle = secondaryColor;
      }
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw food with fallback color
    const tertiaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--tertiary-color')
      .trim() || '#A64D79';
    ctx.fillStyle = tertiaryColor;
    ctx.fillRect(
      gameState.food.x * cellSize + 2,
      gameState.food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
  }, [gameState.snake, gameState.food]);

  // Game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    if (!gameState.isGameOver && !gameState.isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, moveSnake]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Draw game when state changes
  useEffect(() => {
    drawGame();
  }, [drawGame, gameState]);

  return (
    <div className="pixel-snake-game">
      <div className="game-header">
        <h3 className="game-title">Pixel <span>Snake</span></h3>
        <div className="game-score">Score: {gameState.score}</div>
      </div>
      
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="game-canvas"
        />
        
        {gameState.isGameOver && (
          <div className="game-overlay">
            <div className="game-over-message">
              <h4>Game Over!</h4>
              <p>Final Score: {gameState.score}</p>
              <Button 
                variant="primary" 
                label="Play Again" 
                icon={<IoRefresh />} 
                onClick={resetGame}
              />
            </div>
          </div>
        )}
        
        {gameState.isPaused && !gameState.isGameOver && (
          <div className="game-overlay">
            <div className="game-paused-message">
              <h4>Paused</h4>
              <p>Press Space or click Play to continue</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="game-controls">
        <Button
          variant={gameState.isPaused ? "primary" : "secondary"}
          label={gameState.isPaused ? "Play" : "Pause"}
          icon={gameState.isPaused ? <IoPlay /> : <IoPause />}
          onClick={togglePause}
          disabled={gameState.isGameOver}
        />
        <Button
          variant="outline"
          label="Reset"
          icon={<IoRefresh />}
          onClick={resetGame}
        />
      </div>
      
      <div className="game-instructions">
        <p>Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move</p>
        <p>Press <strong>Space</strong> to pause/resume</p>
      </div>
    </div>
  );
}; 