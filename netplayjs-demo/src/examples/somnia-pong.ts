import {
  NetplayPlayer,
  Game,
  DefaultInput,
  RollbackWrapper,
} from "netplayjs/src/index";

const [PONG_WIDTH, PONG_HEIGHT] = [600, 300];
const [PADDLE_WIDTH, PADDLE_HEIGHT] = [10, 100];
const [BALL_WIDTH, BALL_HEIGHT] = [10, 10];

const LEFT_PADDLE_X = 0 + 100;
const RIGHT_PADDLE_X = PONG_WIDTH - 100 - PADDLE_WIDTH;

const PADDLE_MOVE_SPEED = 300;
const BALL_MOVE_SPEED = 300;
const MATCH_MILLIS = 100000; // 100 seconds
const MATCH_POINTS = 5;
const GAME_VERSION = "1.1.0"; // Enhanced version with music

/** Clamps a value between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Check if two rectangles A and B overlap. */
function rectOverlap(
  aLeft: number,
  aRight: number,
  aTop: number,
  aBottom: number,
  bLeft: number,
  bRight: number,
  bTop: number,
  bBottom: number
) {
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

export class Pong extends Game {
  static timestep = 1000 / 60;
  static canvasSize = { width: PONG_WIDTH, height: PONG_HEIGHT };
  static highDPI = true;

  leftPaddle: number = PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2;
  rightPaddle: number = PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2;

  ballPosition: [number, number] = [
    PONG_WIDTH / 2 - BALL_WIDTH / 2,
    PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
  ];
  ballVelocity: [number, number] = [BALL_MOVE_SPEED, 0];

  leftScore: number = 0;
  rightScore: number = 0;
  
  // Game state for blockchain integration
  gameOver: boolean = false;
  matchStartTime: number = 0;
  resultSubmitted: boolean = false;
  
  // Sound effects
  private playSound(frequency: number, duration: number, type: string = 'sine') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type as OscillatorType;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Sound play failed:', e);
    }
  }

  checkGameOver(): void {
    if (this.gameOver) return;
    
    const timeElapsed = performance.now() - this.matchStartTime;
    const timeUp = timeElapsed >= MATCH_MILLIS;
    const pointsDone = this.leftScore >= MATCH_POINTS || this.rightScore >= MATCH_POINTS;
    
    if (timeUp || pointsDone) {
      this.gameOver = true;
      this.playSound(200, 0.5, 'sawtooth'); // Game over sound
      
      // Submit result to blockchain
      if (!this.resultSubmitted && (window as any).__somnia__) {
        this.resultSubmitted = true;
        
        const winner = this.leftScore > this.rightScore ? 
          (window as any).__somnia__.getMyAddress?.() || '0x0000000000000000000000000000000000000000' :
          '0x0000000000000000000000000000000000000000';
        
        (window as any).__somnia__?.submitResult({
          winnerAddress: winner,
          scoreA: this.leftScore,
          scoreB: this.rightScore
        });
      }
    }
  }

  tick(playerInputs: Map<NetplayPlayer, DefaultInput>): void {
    // Initialize match start time
    if (this.matchStartTime === 0) {
      this.matchStartTime = performance.now();
    }
    
    // Check for game over
    this.checkGameOver();
    
    // The delta time in seconds.
    let dt = Pong.timestep / 1000;

    // Move paddles up and down.
    for (const [player, input] of playerInputs.entries()) {
      const direction =
        (input.keysHeld["ArrowDown"] ? 1 : 0) +
        (input.keysHeld["ArrowUp"] ? -1 : 0);

      let paddlePos: number | null = null;
      if (input.touches.length > 0) {
        paddlePos = input.touches[0].y - PADDLE_HEIGHT / 2;
      } else if (input.mousePosition) {
        paddlePos = input.mousePosition.y - PADDLE_HEIGHT / 2;
      }

      if (player.getID() == 0) {
        if (paddlePos) this.leftPaddle = paddlePos;
        else this.leftPaddle += direction * PADDLE_MOVE_SPEED * dt;
      } else if (player.getID() == 1) {
        if (paddlePos) this.rightPaddle = paddlePos;
        else this.rightPaddle += direction * PADDLE_MOVE_SPEED * dt;
      }
    }

    // Clamp paddles onto the screen.
    this.leftPaddle = clamp(this.leftPaddle, 0, PONG_HEIGHT - PADDLE_HEIGHT);
    this.rightPaddle = clamp(this.rightPaddle, 0, PONG_HEIGHT - PADDLE_HEIGHT);

    // Apply ball velocity.
    this.ballPosition[0] += this.ballVelocity[0] * dt;
    this.ballPosition[1] += this.ballVelocity[1] * dt;

    // Bounce ball on bottom / top of screen.
    if (this.ballPosition[1] < 0) {
      this.ballPosition[1] = 0;
      this.ballVelocity[1] = -this.ballVelocity[1];
    }
    if (this.ballPosition[1] > PONG_HEIGHT - BALL_HEIGHT) {
      this.ballPosition[1] = PONG_HEIGHT - BALL_HEIGHT;
      this.ballVelocity[1] = -this.ballVelocity[1];
    }

    if (
      rectOverlap(
        this.ballPosition[0],
        this.ballPosition[0] + BALL_WIDTH,
        this.ballPosition[1],
        this.ballPosition[1] + BALL_HEIGHT,
        LEFT_PADDLE_X,
        LEFT_PADDLE_X + PADDLE_WIDTH,
        this.leftPaddle,
        this.leftPaddle + PADDLE_HEIGHT
      )
    ) {
      let offset =
        (this.ballPosition[1] +
          BALL_HEIGHT / 2 -
          (this.leftPaddle + PADDLE_HEIGHT / 2)) /
        PADDLE_HEIGHT;

      this.ballVelocity[0] = -this.ballVelocity[0];
      this.ballVelocity[1] = BALL_MOVE_SPEED * Math.sin(2 * offset);
      this.ballPosition[0] = LEFT_PADDLE_X + PADDLE_WIDTH;
      this.playSound(400, 0.1, 'sine'); // Paddle hit sound
    }

    if (
      rectOverlap(
        this.ballPosition[0],
        this.ballPosition[0] + BALL_WIDTH,
        this.ballPosition[1],
        this.ballPosition[1] + BALL_HEIGHT,
        RIGHT_PADDLE_X,
        RIGHT_PADDLE_X + PADDLE_WIDTH,
        this.rightPaddle,
        this.rightPaddle + PADDLE_HEIGHT
      )
    ) {
      let offset =
        (this.ballPosition[1] +
          BALL_HEIGHT / 2 -
          (this.rightPaddle + PADDLE_HEIGHT / 2)) /
        PADDLE_HEIGHT;

      this.ballVelocity[0] = -this.ballVelocity[0];
      this.ballVelocity[1] = BALL_MOVE_SPEED * Math.sin(2 * offset);
      this.ballPosition[0] = RIGHT_PADDLE_X - BALL_WIDTH;
      this.playSound(400, 0.1, 'sine'); // Paddle hit sound
    }

    if (this.ballPosition[0] > PONG_WIDTH) {
      this.leftScore += 1;
      this.playSound(800, 0.2, 'square'); // Score sound
      this.ballPosition = [
        PONG_WIDTH / 2 - BALL_WIDTH / 2,
        PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
      ];
      this.ballVelocity = [-BALL_MOVE_SPEED, 0];
    }
    if (this.ballPosition[0] < -BALL_HEIGHT) {
      this.rightScore += 1;
      this.playSound(800, 0.2, 'square'); // Score sound
      this.ballPosition = [
        PONG_WIDTH / 2 - BALL_WIDTH / 2,
        PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
      ];
      this.ballVelocity = [BALL_MOVE_SPEED, 0];
    }
  }

  draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;

    ctx.resetTransform();
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles.
    ctx.fillStyle = "black";
    ctx.fillRect(LEFT_PADDLE_X, this.leftPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "black";
    ctx.fillRect(RIGHT_PADDLE_X, this.rightPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball.
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.ballPosition[0],
      this.ballPosition[1],
      BALL_WIDTH,
      BALL_HEIGHT
    );

    // Draw scores.
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      this.leftScore.toString(),
      PONG_WIDTH * 0.3,
      PONG_HEIGHT * 0.2
    );
    ctx.fillText(
      this.rightScore.toString(),
      PONG_WIDTH * 0.7,
      PONG_HEIGHT * 0.2
    );

    // Draw time remaining
    if (this.matchStartTime > 0) {
      const timeElapsed = performance.now() - this.matchStartTime;
      const timeRemaining = Math.max(0, (MATCH_MILLIS - timeElapsed) / 1000);
      
      ctx.font = "20px Arial";
      ctx.fillStyle = timeRemaining < 10 ? "red" : "black";
      ctx.fillText(
        `Time: ${timeRemaining.toFixed(1)}s`,
        PONG_WIDTH / 2,
        PONG_HEIGHT * 0.1
      );
    }

    // Draw game over screen
    if (this.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, PONG_WIDTH, PONG_HEIGHT);
      
      ctx.fillStyle = "white";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      
      const winner = this.leftScore > this.rightScore ? "Left Player Wins!" : 
                    this.rightScore > this.leftScore ? "Right Player Wins!" : "Draw!";
      
      ctx.fillText(winner, PONG_WIDTH / 2, PONG_HEIGHT / 2);
      
      ctx.font = "24px Arial";
      ctx.fillText(
        `Final Score: ${this.leftScore} - ${this.rightScore}`,
        PONG_WIDTH / 2,
        PONG_HEIGHT / 2 + 40
      );
      
      if (this.resultSubmitted) {
        ctx.fillStyle = "#00ff00";
        ctx.fillText(
          "Result submitted to blockchain!",
          PONG_WIDTH / 2,
          PONG_HEIGHT / 2 + 80
        );
      }
    }
  }
}

new RollbackWrapper(Pong).start();
