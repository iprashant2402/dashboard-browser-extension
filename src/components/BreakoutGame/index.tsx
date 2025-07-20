import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../Button';
import { IoPlay, IoPause, IoRefresh, IoArrowBack } from 'react-icons/io5';
import './index.css';

interface Position {
  x: number;
  y: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isDestroyed: boolean;
}

interface GameState {
  paddle: Position;
  ball: Position;
  ballVelocity: Position;
  bricks: Brick[];
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  lives: number;
  isGameWon: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 5;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 45;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;
const INITIAL_BALL_SPEED = 3;

export const BreakoutGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    paddle: { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30 },
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
    ballVelocity: { x: INITIAL_BALL_SPEED, y: -INITIAL_BALL_SPEED },
    bricks: [],
    isGameOver: false,
    isPaused: false,
    score: 0,
    lives: 3,
    isGameWon: false
  });

  const gameLoopRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseXRef = useRef<number>(0);
  const paddleXRef = useRef<number>(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);

  // Initialize bricks
  const initializeBricks = useCallback((): Brick[] => {
    const bricks: Brick[] = [];
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)', 
      'var(--tertiary-color)',
      'var(--primary-color)',
      'var(--secondary-color)'
    ];

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: colors[row],
          isDestroyed: false
        });
      }
    }
    return bricks;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    paddleXRef.current = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
    setGameState({
      paddle: { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30 },
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
      ballVelocity: { x: INITIAL_BALL_SPEED, y: -INITIAL_BALL_SPEED },
      bricks: initializeBricks(),
      isGameOver: false,
      isPaused: false,
      score: 0,
      lives: 3,
      isGameWon: false
    });
  }, [initializeBricks]);

  // Initialize bricks on first render
  useEffect(() => {
    if (gameState.bricks.length === 0) {
      setGameState(prev => ({ ...prev, bricks: initializeBricks() }));
    }
  }, [gameState.bricks.length, initializeBricks]);

  // Handle mouse movement for paddle with throttling
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    // Throttle mouse updates to reduce jitter
    if (Math.abs(mouseX - mouseXRef.current) > 2) {
      mouseXRef.current = mouseX;
      
      if (!gameState.isGameOver && !gameState.isPaused) {
        // Update paddle position directly without triggering state update
        paddleXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, mouseX - PADDLE_WIDTH / 2));
      }
    }
  }, [gameState.isGameOver, gameState.isPaused]);

  // Check collision between ball and rectangle
  const checkCollision = useCallback((ball: Position, rect: { x: number; y: number; width: number; height: number }): boolean => {
    return ball.x + BALL_RADIUS > rect.x &&
           ball.x - BALL_RADIUS < rect.x + rect.width &&
           ball.y + BALL_RADIUS > rect.y &&
           ball.y - BALL_RADIUS < rect.y + rect.height;
  }, []);

  // Update ball position and check collisions
  const updateBall = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const newBall = {
        x: prev.ball.x + prev.ballVelocity.x,
        y: prev.ball.y + prev.ballVelocity.y
      };

      let newVelocity = { ...prev.ballVelocity };
      let newScore = prev.score;
      let newLives = prev.lives;
      let newBricks = [...prev.bricks];
      let isGameWon = false;

      // Wall collisions
      if (newBall.x - BALL_RADIUS <= 0 || newBall.x + BALL_RADIUS >= CANVAS_WIDTH) {
        newVelocity.x = -newVelocity.x;
      }

      if (newBall.y - BALL_RADIUS <= 0) {
        newVelocity.y = -newVelocity.y;
      }

      // Bottom wall - lose life
      if (newBall.y + BALL_RADIUS >= CANVAS_HEIGHT) {
        newLives--;
        if (newLives <= 0) {
          return { ...prev, isGameOver: true };
        } else {
          // Reset ball position
          newBall.x = CANVAS_WIDTH / 2;
          newBall.y = CANVAS_HEIGHT - 50;
          newVelocity = { x: INITIAL_BALL_SPEED, y: -INITIAL_BALL_SPEED };
        }
      }

      // Paddle collision
      if (checkCollision(newBall, {
        x: paddleXRef.current,
        y: prev.paddle.y,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
      })) {
        newVelocity.y = -Math.abs(newVelocity.y);
        
        // Add some angle based on where ball hits paddle
        const hitPosition = (newBall.x - paddleXRef.current) / PADDLE_WIDTH;
        newVelocity.x = (hitPosition - 0.5) * 4;
      }

      // Brick collisions
      newBricks.forEach((brick, index) => {
        if (!brick.isDestroyed && checkCollision(newBall, brick)) {
          newBricks[index] = { ...brick, isDestroyed: true };
          newVelocity.y = -newVelocity.y;
          newScore += 10;
        }
      });

      // Check if all bricks are destroyed
      if (newBricks.every(brick => brick.isDestroyed)) {
        isGameWon = true;
      }

      return {
        ...prev,
        ball: newBall,
        ballVelocity: newVelocity,
        bricks: newBricks,
        score: newScore,
        lives: newLives,
        isGameWon
      };
    });
  }, [checkCollision]);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

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

    // Get theme colors
    const bgColor = getComputedStyle(document.body)
      .getPropertyValue('--project-list-panel-bg-color')
      .trim() || '#0B141C';
    const primaryColor = getComputedStyle(document.body)
      .getPropertyValue('--primary-color')
      .trim() || '#16825D';
    const secondaryColor = getComputedStyle(document.body)
      .getPropertyValue('--secondary-color')
      .trim() || '#6A1E55';
    const tertiaryColor = getComputedStyle(document.body)
      .getPropertyValue('--tertiary-color')
      .trim() || '#A64D79';
    const textColor = getComputedStyle(document.body)
      .getPropertyValue('--layout-text-color')
      .trim() || '#FFFFFF';

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddle
    ctx.fillStyle = primaryColor;
    ctx.fillRect(
      paddleXRef.current,
      gameState.paddle.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Draw ball
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw bricks
    gameState.bricks.forEach(brick => {
      if (!brick.isDestroyed) {
        let brickColor = brick.color;
        // Convert CSS variable to actual color
        if (brickColor.startsWith('var(--')) {
          const varName = brickColor.match(/var\(([^)]+)\)/)?.[1];
          if (varName) {
            brickColor = getComputedStyle(document.body)
              .getPropertyValue(varName)
              .trim() || tertiaryColor;
          }
        }
        
        ctx.fillStyle = brickColor;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        // Add border
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Draw UI
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, CANVAS_WIDTH - 80, 30);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    if (!gameState.isGameOver && !gameState.isPaused && !gameState.isGameWon) {
      gameLoopRef.current = setInterval(updateBall, 20); // ~50 FPS for better performance
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.isGameWon, updateBall]);

  // Mouse event listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Draw game when state changes
  useEffect(() => {
    drawGame();
  }, [drawGame, gameState]);

  return (
    <div className="breakout-game">
      <div className="game-header">
        <div className="game-header-left">
          <Button
            variant="clear"
            icon={<IoArrowBack />}
            onClick={onBack}
            className="back-button"
          />
          <h3 className="game-title">Break<span>out</span></h3>
        </div>
        <div className="game-score">Score: {gameState.score}</div>
      </div>
      
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
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
        
        {gameState.isGameWon && (
          <div className="game-overlay">
            <div className="game-won-message">
              <h4>You Won!</h4>
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
        
        {gameState.isPaused && !gameState.isGameOver && !gameState.isGameWon && (
          <div className="game-overlay">
            <div className="game-paused-message">
              <h4>Paused</h4>
              <p>Click Play to continue</p>
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
          disabled={gameState.isGameOver || gameState.isGameWon}
        />
        <Button
          variant="outline"
          label="Reset"
          icon={<IoRefresh />}
          onClick={resetGame}
        />
      </div>
      
      <div className="game-instructions">
        <p>Move your <strong>mouse</strong> to control the paddle</p>
        <p>Break all bricks to win!</p>
      </div>
    </div>
  );
}; 