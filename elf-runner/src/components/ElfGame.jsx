import { useEffect, useRef, useState, useCallback } from 'react';
import elfCharacter from "../assets/e_68.png";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const GROUND_HEIGHT = 20;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 40;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const INITIAL_SPEED = 6;
const SPEED_INCREMENT = 0.001;

const img = new Image();
img.src = elfCharacter;


export default function ElfGame() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('dinoHighScore') || '0', 10);
  });

  // Game state refs (to avoid stale closures in game loop)
  const playerRef = useRef({ x: 50, y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT, vy: 0, isJumping: false });
  const obstaclesRef = useRef([]);
  const speedRef = useRef(INITIAL_SPEED);
  const scoreRef = useRef(0);
  const frameCountRef = useRef(0);

  const resetGame = useCallback(() => {
    playerRef.current = { x: 50, y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT, vy: 0, isJumping: false };
    obstaclesRef.current = [];
    speedRef.current = INITIAL_SPEED;
    scoreRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
  }, []);

  const jump = useCallback(() => {
    const player = playerRef.current;
    if (!player.isJumping) {
      player.vy = JUMP_FORCE;
      player.isJumping = true;
    }
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const handleInput = useCallback((e) => {
    if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'ArrowUp') return;
    e.preventDefault();

    if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
    } else if (gameState === 'playing') {
      jump();
    }
  }, [gameState, startGame, jump]);

  // Input listeners
  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      const player = playerRef.current;
      const obstacles = obstaclesRef.current;

      // Update player physics
      player.vy += GRAVITY;
      player.y += player.vy;

      const groundY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
      if (player.y >= groundY) {
        player.y = groundY;
        player.vy = 0;
        player.isJumping = false;
      }

      // Spawn obstacles
      frameCountRef.current++;
      if (frameCountRef.current % Math.floor(100 / (speedRef.current / INITIAL_SPEED)) === 0) {
        if (Math.random() < 0.5 || obstacles.length === 0) {
          obstacles.push({
            x: GAME_WIDTH,
            y: GAME_HEIGHT - GROUND_HEIGHT - OBSTACLE_HEIGHT,
            width: OBSTACLE_WIDTH + Math.random() * 15,
            height: OBSTACLE_HEIGHT + Math.random() * 20,
          });
        }
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speedRef.current;
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
        }
      }

      // Collision detection
      const playerBox = {
        x: player.x + 5,
        y: player.y + 5,
        width: PLAYER_WIDTH - 10,
        height: PLAYER_HEIGHT - 5,
      };

      for (const obs of obstacles) {
        if (
          playerBox.x < obs.x + obs.width &&
          playerBox.x + playerBox.width > obs.x &&
          playerBox.y < obs.y + obs.height &&
          playerBox.y + playerBox.height > obs.y
        ) {
          // Game over
          setGameState('gameover');
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('dinoHighScore', scoreRef.current.toString());
          }
          return;
        }
      }

      // Update score and speed
      scoreRef.current++;
      speedRef.current += SPEED_INCREMENT;
      setScore(scoreRef.current);

      // Render
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Ground
      ctx.fillStyle = '#535353';
      ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);

      // Player (Elf png)
      ctx.fillStyle = '#535353';
      ctx.drawImage(img, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Obstacles (cacti)
      ctx.fillStyle = '#535353';
      for (const obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      }

      // Score
      ctx.fillStyle = '#535353';
      ctx.font = '16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`HI ${highScore.toString().padStart(5, '0')}  ${scoreRef.current.toString().padStart(5, '0')}`, GAME_WIDTH - 10, 25);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, highScore]);

  // Render idle/gameover overlays
  const renderOverlay = () => {
    if (gameState === 'idle') {
      return (
        <div style={overlayStyle}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🦖</div>
          <div>Press SPACE or tap to start</div>
        </div>
      );
    }
    if (gameState === 'gameover') {
      return (
        <div style={overlayStyle}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>GAME OVER</div>
          <div style={{ margin: '10px 0' }}>Score: {score}</div>
          <div style={{ fontSize: '14px' }}>Press SPACE or tap to restart</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={containerStyle}
      onClick={handleInput}
      onTouchStart={handleInput}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={canvasStyle}
      />
      {renderOverlay()}
    </div>
  );
}

const containerStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: `${GAME_WIDTH}px`,
  margin: '50px auto',
  cursor: 'pointer',
  userSelect: 'none',
};

const canvasStyle = {
  display: 'block',
  width: '100%',
  height: 'auto',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const overlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: '#535353',
  fontFamily: 'monospace',
};
