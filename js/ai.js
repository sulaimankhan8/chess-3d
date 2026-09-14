import { PIECES } from './game.js';

// Comprehensive opening book repertoire with multiple variations and weights
const OPENING_BOOK = {
  // --- ROOT (White 1st Move) ---
  '': [
    { move: 'e2e4', weight: 50 },
    { move: 'd2d4', weight: 35 },
    { move: 'c2c4', weight: 10 },
    { move: 'g1f3', weight: 5 },
  ],

  // --- RESPONSES TO 1. e4 ---
  'e2e4': [
    { move: 'e7e5', weight: 42 }, // Open Game (King's Pawn)
    { move: 'c7c5', weight: 36 }, // Sicilian Defense
    { move: 'e7e6', weight: 12 }, // French Defense
    { move: 'c7c6', weight: 7 },  // Caro-Kann Defense
    { move: 'g8f6', weight: 3 },  // Alekhine Defense
  ],

  // 1. e4 e5
  'e2e4 e7e5': [
    { move: 'g1f3', weight: 80 },
    { move: 'f1c4', weight: 10 },
    { move: 'b1c3', weight: 10 },
  ],
  'e2e4 e7e5 g1f3': [
    { move: 'b8c6', weight: 70 }, // Standard / Italian / Spanish
    { move: 'g8f6', weight: 20 }, // Petrov Defense
    { move: 'd7d6', weight: 10 }, // Philidor Defense
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4': [
    { move: 'f8c5', weight: 55 }, // Giuoco Piano
    { move: 'g8f6', weight: 45 }, // Two Knights Defense
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5': [
    { move: 'c2c3', weight: 50 },
    { move: 'd2d3', weight: 30 },
    { move: 'e1g1', weight: 20 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6': [
    { move: 'd2d3', weight: 60 },
    { move: 'g1g5', weight: 20 },
    { move: 'd2d4', weight: 20 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5': [
    { move: 'a7a6', weight: 70 }, // Morphy Defense
    { move: 'g8f6', weight: 25 }, // Berlin Defense
    { move: 'd7d6', weight: 5 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6': [
    { move: 'b5a4', weight: 85 },
    { move: 'b5c6', weight: 15 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4': [
    { move: 'g8f6', weight: 80 },
    { move: 'd7d6', weight: 20 },
  ],
  'e2e4 e7e5 g1f3 b8c6 d2d4': [
    { move: 'e5d4', weight: 95 }, // Scotch Game
    { move: 'b8d4', weight: 5 },
  ],
  'e2e4 e7e5 g1f3 b8c6 d2d4 e5d4': [
    { move: 'f3d4', weight: 90 },
    { move: 'c2c3', weight: 10 },
  ],
  'e2e4 e7e5 f1c4': [
    { move: 'g8f6', weight: 60 },
    { move: 'b8c6', weight: 40 },
  ],
  // Defense against early Scholar's Mate / Wayward Queen Attack (1. e4 e5 2. Qh5)
  'e2e4 e7e5 d1h5': [
    { move: 'b8c6', weight: 100 }, // Protects e5 pawn solidly
  ],
  'e2e4 e7e5 d1h5 b8c6 f1c4': [
    { move: 'g7g6', weight: 100 }, // Blocks mate threat on f7
  ],
  'e2e4 e7e5 d1h5 b8c6 f1c4 g7g6 h5f3': [
    { move: 'g8f6', weight: 100 }, // Blocks mate threat on f7 and develops knight
  ],
  'e2e4 e7e5 d1f3': [
    { move: 'g8f6', weight: 80 },
    { move: 'b8c6', weight: 20 },
  ],
  'e2e4 e7e5 f2f4': [
    { move: 'e5f4', weight: 75 }, // King's Gambit Accepted
    { move: 'd7d5', weight: 25 }, // Falkbeer Countergambit
  ],

  // 1. e4 c5 (Sicilian)
  'e2e4 c7c5': [
    { move: 'g1f3', weight: 75 },
    { move: 'b1c3', weight: 15 },
    { move: 'c2c3', weight: 10 },
  ],
  'e2e4 c7c5 g1f3': [
    { move: 'd7d6', weight: 50 }, // Classical / Najdorf / Dragon prep
    { move: 'b8c6', weight: 30 }, // Open Sicilian
    { move: 'e7e6', weight: 20 }, // French Sicilian / Kan / Taimanov
  ],
  'e2e4 c7c5 g1f3 d7d6': [
    { move: 'd2d4', weight: 85 },
    { move: 'f1b5', weight: 15 },
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4': [
    { move: 'c5d4', weight: 98 },
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4': [
    { move: 'g8f6', weight: 85 },
    { move: 'a7a6', weight: 15 },
  ],
  'e2e4 c7c5 g1f3 b8c6': [
    { move: 'd2d4', weight: 75 },
    { move: 'f1b5', weight: 25 },
  ],
  'e2e4 c7c5 g1f3 b8c6 d2d4': [
    { move: 'c5d4', weight: 95 },
  ],
  'e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4': [
    { move: 'g8f6', weight: 60 },
    { move: 'e7e5', weight: 25 },
    { move: 'g7g6', weight: 15 },
  ],
  'e2e4 c7c5 b1c3': [
    { move: 'b8c6', weight: 60 },
    { move: 'g7g6', weight: 25 },
    { move: 'd7d6', weight: 15 },
  ],
  'e2e4 c7c5 c2c3': [
    { move: 'd7d5', weight: 60 },
    { move: 'g8f6', weight: 40 },
  ],

  // 1. e4 e6 (French)
  'e2e4 e7e6': [
    { move: 'd2d4', weight: 85 },
    { move: 'd2d3', weight: 15 },
  ],
  'e2e4 e7e6 d2d4': [
    { move: 'd7d5', weight: 98 },
  ],
  'e2e4 e7e6 d2d4 d7d5': [
    { move: 'b1c3', weight: 45 },
    { move: 'e4e5', weight: 35 },
    { move: 'b1d2', weight: 20 },
  ],
  'e2e4 e7e6 d2d4 d7d5 e4e5': [
    { move: 'c7c5', weight: 85 },
    { move: 'b8c6', weight: 15 },
  ],
  'e2e4 e7e6 d2d4 d7d5 b1c3': [
    { move: 'g8f6', weight: 50 },
    { move: 'f8b4', weight: 40 },
    { move: 'd5e4', weight: 10 },
  ],

  // 1. e4 c7c6 (Caro-Kann)
  'e2e4 c7c6': [
    { move: 'd2d4', weight: 85 },
    { move: 'g1f3', weight: 15 },
  ],
  'e2e4 c7c6 d2d4': [
    { move: 'd7d5', weight: 98 },
  ],
  'e2e4 c7c6 d2d4 d7d5': [
    { move: 'b1c3', weight: 45 },
    { move: 'e4e5', weight: 35 },
    { move: 'e4d5', weight: 20 },
  ],
  'e2e4 c7c6 d2d4 d7d5 e4e5': [
    { move: 'c8f5', weight: 85 },
    { move: 'c6c5', weight: 15 },
  ],
  'e2e4 c7c6 d2d4 d7d5 b1c3': [
    { move: 'd5e4', weight: 90 },
  ],

  // --- RESPONSES TO 1. d4 ---
  'd2d4': [
    { move: 'g8f6', weight: 50 }, // Indian Defenses
    { move: 'd7d5', weight: 35 }, // Queen's Gambit Declined / Slav setup
    { move: 'e7e6', weight: 10 },
    { move: 'f7f5', weight: 5 },  // Dutch Defense
  ],

  // 1. d4 g8f6
  'd2d4 g8f6': [
    { move: 'c2c4', weight: 65 },
    { move: 'g1f3', weight: 20 },
    { move: 'c1f4', weight: 15 }, // London System
  ],
  'd2d4 g8f6 c2c4': [
    { move: 'e7e6', weight: 45 }, // Nimzo / Queen's Indian setup
    { move: 'g7g6', weight: 40 }, // King's Indian / Grünfeld
    { move: 'c7c5', weight: 15 }, // Benoni
  ],
  'd2d4 g8f6 c2c4 e7e6': [
    { move: 'b1c3', weight: 55 },
    { move: 'g1f3', weight: 45 },
  ],
  'd2d4 g8f6 c2c4 e7e6 b1c3': [
    { move: 'f8b4', weight: 75 }, // Nimzo-Indian Defense
    { move: 'd7d5', weight: 25 },
  ],
  'd2d4 g8f6 c2c4 g7g6': [
    { move: 'b1c3', weight: 70 },
    { move: 'g1f3', weight: 30 },
  ],
  'd2d4 g8f6 c2c4 g7g6 b1c3': [
    { move: 'd7d5', weight: 50 }, // Grünfeld
    { move: 'f8g7', weight: 50 }, // King's Indian
  ],
  'd2d4 g8f6 c1f4': [
    { move: 'd7d5', weight: 50 },
    { move: 'c7c5', weight: 30 },
    { move: 'g7g6', weight: 20 },
  ],

  // 1. d4 d7d5
  'd2d4 d7d5': [
    { move: 'c2c4', weight: 65 }, // Queen's Gambit
    { move: 'g1f3', weight: 20 },
    { move: 'c1f4', weight: 15 }, // London System
  ],
  'd2d4 d7d5 c2c4': [
    { move: 'e7e6', weight: 55 }, // Queen's Gambit Declined
    { move: 'c7c6', weight: 35 }, // Slav Defense
    { move: 'd5c4', weight: 10 }, // Queen's Gambit Accepted
  ],
  'd2d4 d7d5 c2c4 e7e6': [
    { move: 'b1c3', weight: 60 },
    { move: 'g1f3', weight: 40 },
  ],
  'd2d4 d7d5 c2c4 e7e6 b1c3': [
    { move: 'g8f6', weight: 70 },
    { move: 'c7c6', weight: 20 },
    { move: 'f8e7', weight: 10 },
  ],
  'd2d4 d7d5 c2c4 c7c6': [
    { move: 'g1f3', weight: 60 },
    { move: 'b1c3', weight: 40 },
  ],
  'd2d4 d7d5 c2c4 c7c6 g1f3': [
    { move: 'g8f6', weight: 80 },
    { move: 'e7e6', weight: 20 },
  ],

  // --- RESPONSES TO 1. c4 (English) ---
  'c2c4': [
    { move: 'e7e5', weight: 45 },
    { move: 'c7c5', weight: 30 },
    { move: 'g8f6', weight: 15 },
    { move: 'e7e6', weight: 10 },
  ],

  // --- RESPONSES TO 1. Nf3 (Reti) ---
  'g1f3': [
    { move: 'd7d5', weight: 45 },
    { move: 'g8f6', weight: 35 },
    { move: 'c7c5', weight: 20 },
  ],
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export class ChessAI {
  constructor(difficulty = 'easy') {
    this.difficulty = difficulty;
    this.pieceValues = {
      [PIECES.WP]: 100,
      [PIECES.WN]: 320,
      [PIECES.WB]: 335,
      [PIECES.WR]: 500,
      [PIECES.WQ]: 900,
      [PIECES.WK]: 20000,
      [PIECES.BP]: 100,
      [PIECES.BN]: 320,
      [PIECES.BB]: 335,
      [PIECES.BR]: 500,
      [PIECES.BQ]: 900,
      [PIECES.BK]: 20000,
    };

    // Positional square tables (from White's perspective; mirrored for Black)
    this.pawnSquareTable = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,  0,  0,  0,  0,  0,  0,  0],
    ];

    this.knightSquareTable = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50],
    ];

    this.bishopSquareTable = [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20],
    ];

    this.rookSquareTable = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [0,  0,  0,  5,  5,  0,  0,  0],
    ];

    this.queenSquareTable = [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20],
    ];

    this.kingMidgameSquareTable = [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [20, 20,  0,  0,  0,  0, 20, 20],
      [20, 30, 10,  0,  0, 10, 30, 20],
    ];

    this.kingEndgameSquareTable = [
      [-50,-40,-30,-20,-20,-30,-40,-50],
      [-30,-20,-10,  0,  0,-10,-20,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-30,  0,  0,  0,  0,-30,-30],
      [-50,-30,-30,-30,-30,-30,-30,-50],
    ];

    // Transposition Table and Search caches
    this.tt = new Map();
    this.killerMoves = [];
    this.historyTable = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => Array(8).fill(0)))
    );
  }

  setDifficulty(level) {
    this.difficulty = level;
  }

  // Convert coordinate numbers to chess notation string e.g. e2e4
  moveToString(move) {
    if (!move) return '';
    return `${FILES[move.fromCol]}${8 - move.fromRow}${FILES[move.toCol]}${8 - move.toRow}`;
  }

  // Check opening book for current move history
  getBookMove(game, player = 'black') {
    if (!game.moveHistory) return null;

    const historyKey = game.moveHistory
      .map((m) => `${m.from}${m.to}`)
      .join(' ');

    const bookEntries = OPENING_BOOK[historyKey];
    if (!bookEntries || bookEntries.length === 0) return null;

    const totalWeight = bookEntries.reduce((acc, entry) => acc + entry.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosenStr = bookEntries[0].move;

    for (const entry of bookEntries) {
      if (rand < entry.weight) {
        chosenStr = entry.move;
        break;
      }
      rand -= entry.weight;
    }

    const legalMoves = game.getAllLegalMoves(player);
    const matchedMove = legalMoves.find((m) => this.moveToString(m) === chosenStr);
    return matchedMove || null;
  }

  getBoardHash(board, player) {
    let hash = player === 'white' ? 'w:' : 'b:';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) hash += `${r}${c}${p},`;
      }
    }
    return hash;
  }

  getBestMove(game, player = 'black') {
    const moves = game.getAllLegalMoves(player);
    if (!moves.length) return null;

    // 1. Try opening book first
    const bookMove = this.getBookMove(game, player);
    if (bookMove) {
      return bookMove;
    }

    // 2. Clear / refresh search structures
    this.killerMoves = Array.from({ length: 20 }, () => []);
    if (this.tt.size > 20000) {
      this.tt.clear();
    }

    // Determine target search depth
    let maxDepth = 4;
    if (this.difficulty === 'easy') maxDepth = 2;
    else if (this.difficulty === 'medium') maxDepth = 3;
    else if (this.difficulty === 'hard') maxDepth = 4;
    else if (this.difficulty === 'master') maxDepth = 5;

    const rootBoard = game.board.map((row) => [...row]);
    let bestMove = moves[0];
    let bestScore = -Infinity;

    // Iterative Deepening: start from depth 1 up to maxDepth
    for (let currentDepth = 1; currentDepth <= maxDepth; currentDepth++) {
      let alpha = -Infinity;
      const beta = Infinity;
      const orderedMoves = this.orderMoves(moves, rootBoard, player, 0, bestMove);
      let currentBestMove = null;
      let currentBestScore = -Infinity;

      for (const move of orderedMoves) {
        const nextBoard = this.applyMoveToBoard(rootBoard, move);
        const score = this.minimax(
          nextBoard,
          player === 'white' ? 'black' : 'white',
          currentDepth - 1,
          alpha,
          beta,
          player,
          game,
          1
        );

        if (score > currentBestScore) {
          currentBestScore = score;
          currentBestMove = move;
        }

        if (score > alpha) {
          alpha = score;
        }
      }

      if (currentBestMove) {
        bestMove = currentBestMove;
        bestScore = currentBestScore;
      }

      // If checkmate found, break immediately
      if (bestScore >= 18000) break;
    }

    // Easy mode: slight temperature/variety among close moves
    if (this.difficulty === 'easy') {
      const topCandidates = moves.filter((m) => {
        const nextB = this.applyMoveToBoard(rootBoard, m);
        const sc = this.evaluateBoard(nextB, player);
        return sc >= bestScore - 60;
      });
      if (topCandidates.length > 1) {
        return topCandidates[Math.floor(Math.random() * topCandidates.length)];
      }
    }

    return bestMove;
  }

  minimax(board, currentPlayer, depth, alpha, beta, maximizingPlayer, game, ply) {
    const isMaximizing = currentPlayer === maximizingPlayer;
    const boardHash = this.getBoardHash(board, currentPlayer);
    const ttEntry = this.tt.get(boardHash);

    if (ttEntry && ttEntry.depth >= depth) {
      if (ttEntry.flag === 0) return ttEntry.score; // EXACT
      if (ttEntry.flag === 1 && ttEntry.score > alpha) alpha = ttEntry.score; // LOWERBOUND
      else if (ttEntry.flag === 2 && ttEntry.score < beta) beta = ttEntry.score; // UPPERBOUND
      if (alpha >= beta) return ttEntry.score;
    }

    const legalMoves = this.getLegalMovesForBoard(board, currentPlayer, game);

    // Terminal or depth reached
    if (depth <= 0 || !legalMoves.length) {
      if (!legalMoves.length) {
        if (this.isPlayerInCheckOnBoard(board, currentPlayer, game)) {
          return isMaximizing ? -20000 + ply : 20000 - ply;
        }
        return 0; // Stalemate
      }
      const qDepth = this.difficulty === 'easy' ? 1 : (this.difficulty === 'master' ? 5 : 4);
      return this.quiescence(board, alpha, beta, maximizingPlayer, currentPlayer, game, qDepth, ply);
    }

    // Check extension: if currently in check, extend search depth by 1
    const inCheck = this.isPlayerInCheckOnBoard(board, currentPlayer, game);
    const effectiveDepth = inCheck && depth < 6 ? depth + 1 : depth;

    const ttMove = ttEntry ? ttEntry.bestMove : null;
    const orderedMoves = this.orderMoves(legalMoves, board, currentPlayer, ply, ttMove);
    let bestMove = null;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of orderedMoves) {
        const nextBoard = this.applyMoveToBoard(board, move);
        const score = this.minimax(
          nextBoard,
          currentPlayer === 'white' ? 'black' : 'white',
          effectiveDepth - 1,
          alpha,
          beta,
          maximizingPlayer,
          game,
          ply + 1
        );

        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }

        if (score > alpha) {
          alpha = score;
        }

        if (beta <= alpha) {
          // Beta Cutoff -> Record Killer Move and History
          if (!move.capture && ply < 20) {
            this.recordKillerMove(ply, move);
            this.historyTable[move.fromRow][move.fromCol][move.toRow][move.toCol] += depth * depth;
          }
          break;
        }
      }

      // Store in Transposition Table
      const flag = maxScore <= alpha ? 2 : (maxScore >= beta ? 1 : 0);
      this.tt.set(boardHash, { depth, score: maxScore, flag, bestMove });
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of orderedMoves) {
        const nextBoard = this.applyMoveToBoard(board, move);
        const score = this.minimax(
          nextBoard,
          currentPlayer === 'white' ? 'black' : 'white',
          effectiveDepth - 1,
          alpha,
          beta,
          maximizingPlayer,
          game,
          ply + 1
        );

        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }

        if (score < beta) {
          beta = score;
        }

        if (beta <= alpha) {
          if (!move.capture && ply < 20) {
            this.recordKillerMove(ply, move);
            this.historyTable[move.fromRow][move.fromCol][move.toRow][move.toCol] += depth * depth;
          }
          break;
        }
      }

      const flag = minScore <= alpha ? 2 : (minScore >= beta ? 1 : 0);
      this.tt.set(boardHash, { depth, score: minScore, flag, bestMove });
      return minScore;
    }
  }

  // Quiescence search on tactical captures to eliminate blunders
  quiescence(board, alpha, beta, maximizingPlayer, currentPlayer, game, qDepth, ply) {
    const standPat = this.evaluateBoard(board, maximizingPlayer);
    if (qDepth <= 0) return standPat;

    const isMaximizing = currentPlayer === maximizingPlayer;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;

      const legalMoves = this.getLegalMovesForBoard(board, currentPlayer, game);
      const captureMoves = legalMoves.filter((m) => m.capture || m.promotedPiece);

      for (const move of this.orderMoves(captureMoves, board, currentPlayer, ply)) {
        const nextBoard = this.applyMoveToBoard(board, move);
        const score = this.quiescence(
          nextBoard,
          alpha,
          beta,
          maximizingPlayer,
          currentPlayer === 'white' ? 'black' : 'white',
          game,
          qDepth - 1,
          ply + 1
        );
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
      }
      return alpha;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;

      const legalMoves = this.getLegalMovesForBoard(board, currentPlayer, game);
      const captureMoves = legalMoves.filter((m) => m.capture || m.promotedPiece);

      for (const move of this.orderMoves(captureMoves, board, currentPlayer, ply)) {
        const nextBoard = this.applyMoveToBoard(board, move);
        const score = this.quiescence(
          nextBoard,
          alpha,
          beta,
          maximizingPlayer,
          currentPlayer === 'white' ? 'black' : 'white',
          game,
          qDepth - 1,
          ply + 1
        );
        if (score <= alpha) return alpha;
        if (score < beta) beta = score;
      }
      return beta;
    }
  }

  recordKillerMove(ply, move) {
    if (!this.killerMoves[ply]) this.killerMoves[ply] = [];
    const km = this.killerMoves[ply];
    if (!km.some((m) => m.fromRow === move.fromRow && m.fromCol === move.fromCol && m.toRow === move.toRow && m.toCol === move.toCol)) {
      km.unshift(move);
      if (km.length > 2) km.pop();
    }
  }

  isPlayerInCheckOnBoard(board, player, game) {
    const originalBoard = game.board;
    const originalPlayer = game.currentPlayer;

    game.board = board;
    game.currentPlayer = player;
    const inCheck = game.isInCheck(board, player);

    game.board = originalBoard;
    game.currentPlayer = originalPlayer;
    return inCheck;
  }

  getLegalMovesForBoard(board, player, game) {
    const originalBoard = game.board;
    const originalPlayer = game.currentPlayer;

    game.board = board;
    game.currentPlayer = player;
    const moves = game.getAllLegalMoves(player, board);

    game.board = originalBoard;
    game.currentPlayer = originalPlayer;
    return moves;
  }

  orderMoves(moves, board, player, ply = 0, ttMove = null) {
    return [...moves].sort((a, b) => {
      const aScore = this.scoreMove(board, a, player, ply, ttMove);
      const bScore = this.scoreMove(board, b, player, ply, ttMove);
      return bScore - aScore;
    });
  }

  scoreMove(board, move, player, ply = 0, ttMove = null) {
    // 1. Transposition table principal variation move
    if (ttMove && move.fromRow === ttMove.fromRow && move.fromCol === ttMove.fromCol && move.toRow === ttMove.toRow && move.toCol === ttMove.toCol) {
      return 2000000;
    }

    let score = 0;
    const movingPiece = board[move.fromRow][move.fromCol];
    const targetPiece = board[move.toRow][move.toCol];

    // 2. MVV-LVA Captures
    if (move.capture) {
      const victimValue = this.getPieceValue(targetPiece || (player === 'white' ? PIECES.BP : PIECES.WP));
      const attackerValue = this.getPieceValue(movingPiece);
      score += 100000 + (victimValue * 10) - (attackerValue / 10);
    }

    // 3. Killer Moves
    if (this.killerMoves[ply]) {
      const km = this.killerMoves[ply];
      if (km[0] && move.fromRow === km[0].fromRow && move.fromCol === km[0].fromCol && move.toRow === km[0].toRow && move.toCol === km[0].toCol) {
        score += 50000;
      } else if (km[1] && move.fromRow === km[1].fromRow && move.fromCol === km[1].fromCol && move.toRow === km[1].toRow && move.toCol === km[1].toCol) {
        score += 40000;
      }
    }

    // 4. Castling & Promotion
    if (move.castling) score += 35000;
    if ((movingPiece === PIECES.WP && move.toRow === 0) || (movingPiece === PIECES.BP && move.toRow === 7)) {
      score += 60000;
    }

    // 5. History table score
    score += this.historyTable[move.fromRow][move.fromCol][move.toRow][move.toCol] || 0;

    // 6. Central control
    const centerBias = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [0,  2,  3,  3,  3,  3,  2,  0],
      [0,  3,  8, 12, 12,  8,  3,  0],
      [0,  3, 12, 18, 18, 12,  3,  0],
      [0,  3, 12, 18, 18, 12,  3,  0],
      [0,  3,  8, 12, 12,  8,  3,  0],
      [0,  2,  3,  3,  3,  3,  2,  0],
      [0,  0,  0,  0,  0,  0,  0,  0],
    ];
    score += centerBias[move.toRow][move.toCol];

    return score;
  }

  applyMoveToBoard(board, move) {
    const nextBoard = board.map((row) => [...row]);
    const piece = nextBoard[move.fromRow][move.fromCol];
    nextBoard[move.fromRow][move.fromCol] = PIECES.EMPTY;
    nextBoard[move.toRow][move.toCol] = piece;

    if (move.enPassant) {
      const captureRow = (piece === PIECES.WP) ? move.toRow + 1 : move.toRow - 1;
      nextBoard[captureRow][move.toCol] = PIECES.EMPTY;
    }

    if (move.castling) {
      const rank = move.toRow;
      if (move.castling === 'king-side') {
        nextBoard[rank][5] = nextBoard[rank][7];
        nextBoard[rank][7] = PIECES.EMPTY;
      } else if (move.castling === 'queen-side') {
        nextBoard[rank][3] = nextBoard[rank][0];
        nextBoard[rank][0] = PIECES.EMPTY;
      }
    }

    if ((piece === PIECES.WP && move.toRow === 0) || (piece === PIECES.BP && move.toRow === 7)) {
      nextBoard[move.toRow][move.toCol] = (piece === PIECES.WP) ? PIECES.WQ : PIECES.BQ;
    }

    return nextBoard;
  }

  // Comprehensive chess positional evaluation function
  evaluateBoard(board, player) {
    let score = 0;
    let whiteBishops = 0;
    let blackBishops = 0;
    let totalPieces = 0;

    const whitePawnsPerCol = [0,0,0,0,0,0,0,0];
    const blackPawnsPerCol = [0,0,0,0,0,0,0,0];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece || piece === PIECES.EMPTY) continue;

        totalPieces++;
        const isW = this.isWhite(piece);
        const value = this.getPieceValue(piece);
        const pst = this.getSquareTable(piece, row, col);
        let pieceScore = value + pst;

        // Count pawns per file for structure analysis
        if (piece === PIECES.WP) whitePawnsPerCol[col]++;
        else if (piece === PIECES.BP) blackPawnsPerCol[col]++;

        // Bishop count
        if (piece === PIECES.WB) whiteBishops++;
        else if (piece === PIECES.BB) blackBishops++;

        // Rook on open or semi-open file
        if (piece === PIECES.WR) {
          if (whitePawnsPerCol[col] === 0) {
            pieceScore += (blackPawnsPerCol[col] === 0) ? 35 : 20; // Open or semi-open
          }
          if (row === 1) pieceScore += 35; // Rook on 7th rank
        } else if (piece === PIECES.BR) {
          if (blackPawnsPerCol[col] === 0) {
            pieceScore += (whitePawnsPerCol[col] === 0) ? 35 : 20;
          }
          if (row === 6) pieceScore += 35;
        }

        score += isW ? pieceScore : -pieceScore;
      }
    }

    // Bishop Pair bonus (+50)
    if (whiteBishops >= 2) score += 50;
    if (blackBishops >= 2) score -= 50;

    // Pawn structure evaluation
    for (let col = 0; col < 8; col++) {
      // Doubled pawns
      if (whitePawnsPerCol[col] > 1) score -= (whitePawnsPerCol[col] - 1) * 25;
      if (blackPawnsPerCol[col] > 1) score += (blackPawnsPerCol[col] - 1) * 25;

      // Isolated pawns
      const leftW = col > 0 ? whitePawnsPerCol[col - 1] : 0;
      const rightW = col < 7 ? whitePawnsPerCol[col + 1] : 0;
      if (whitePawnsPerCol[col] > 0 && leftW === 0 && rightW === 0) score -= 20;

      const leftB = col > 0 ? blackPawnsPerCol[col - 1] : 0;
      const rightB = col < 7 ? blackPawnsPerCol[col + 1] : 0;
      if (blackPawnsPerCol[col] > 0 && leftB === 0 && rightB === 0) score += 20;
    }

    return player === 'white' ? score : -score;
  }

  getSquareTable(piece, row, col) {
    const isWhitePiece = this.isWhite(piece);
    const r = isWhitePiece ? row : 7 - row;
    const c = col;

    if (piece === PIECES.WP || piece === PIECES.BP) {
      return this.pawnSquareTable[r][c];
    }
    if (piece === PIECES.WN || piece === PIECES.BN) {
      return this.knightSquareTable[r][c];
    }
    if (piece === PIECES.WB || piece === PIECES.BB) {
      return this.bishopSquareTable[r][c];
    }
    if (piece === PIECES.WR || piece === PIECES.BR) {
      return this.rookSquareTable[r][c];
    }
    if (piece === PIECES.WQ || piece === PIECES.BQ) {
      return this.queenSquareTable[r][c];
    }
    if (piece === PIECES.WK || piece === PIECES.BK) {
      return this.kingMidgameSquareTable[r][c];
    }
    return 0;
  }

  isWhite(piece) {
    return piece >= PIECES.WP && piece <= PIECES.WK;
  }

  getPieceValue(piece) {
    return this.pieceValues[piece] || 0;
  }
}

