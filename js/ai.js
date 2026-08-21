import { PIECES } from './game.js';

export class ChessAI {
  constructor(difficulty = 'easy') {
    this.difficulty = difficulty;
    this.pieceValues = {
      [PIECES.WP]: 100,
      [PIECES.WN]: 320,
      [PIECES.WB]: 330,
      [PIECES.WR]: 500,
      [PIECES.WQ]: 900,
      [PIECES.WK]: 20000,
      [PIECES.BP]: 100,
      [PIECES.BN]: 320,
      [PIECES.BB]: 330,
      [PIECES.BR]: 500,
      [PIECES.BQ]: 900,
      [PIECES.BK]: 20000,
    };

    this.pawnSquareTable = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [5, 10, 10, -20, -20, 10, 10, 5],
      [5, -5, -10, 0, 0, -10, -5, 5],
      [0, 0, 0, 20, 20, 0, 0, 0],
      [5, 5, 10, 25, 25, 10, 5, 5],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.knightSquareTable = [
      [-50, -40, -30, -30, -30, -30, -40, -50],
      [-40, -20, 0, 0, 0, 0, -20, -40],
      [-30, 0, 10, 15, 15, 10, 0, -30],
      [-30, 5, 15, 20, 20, 15, 5, -30],
      [-30, 0, 15, 20, 20, 15, 0, -30],
      [-30, 5, 10, 15, 15, 10, 5, -30],
      [-40, -20, 0, 5, 5, 0, -20, -40],
      [-50, -40, -30, -30, -30, -30, -40, -50],
    ];

    this.bishopSquareTable = [
      [-20, -10, -10, -10, -10, -10, -10, -20],
      [-10, 5, 0, 0, 0, 0, 5, -10],
      [-10, 10, 10, 10, 10, 10, 10, -10],
      [-10, 0, 10, 10, 10, 10, 0, -10],
      [-10, 5, 5, 10, 10, 5, 5, -10],
      [-10, 0, 5, 10, 10, 5, 0, -10],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-20, -10, -10, -10, -10, -10, -10, -20],
    ];

    this.rookSquareTable = [
      [0, 0, 0, 5, 5, 0, 0, 0],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [5, 10, 10, 10, 10, 10, 10, 5],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.queenSquareTable = [
      [-20, -10, -10, -5, -5, -10, -10, -20],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-10, 0, 5, 5, 5, 5, 0, -10],
      [-5, 0, 5, 5, 5, 5, 0, -5],
      [0, 0, 5, 5, 5, 5, 0, -5],
      [-10, 5, 5, 5, 5, 5, 0, -10],
      [-10, 0, 5, 0, 0, 0, 0, -10],
      [-20, -10, -10, -5, -5, -10, -10, -20],
    ];

    this.kingSquareTable = [
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-20, -30, -30, -40, -40, -30, -30, -20],
      [-10, -20, -20, -20, -20, -20, -20, -10],
      [20, 20, 0, 0, 0, 0, 20, 20],
      [20, 30, 10, 0, 0, 10, 30, 20],
    ];
  }

  setDifficulty(level) {
    this.difficulty = level;
  }

  getBestMove(game, player = 'black') {
    const moves = game.getAllLegalMoves(player);
    if (!moves.length) return null;

    const depth = this.difficulty === 'hard' ? 3 : 2;
    const rootBoard = game.board.map((row) => [...row]);
    let bestMove = moves[0];
    let bestScore = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    const orderedMoves = this.orderMoves(moves, rootBoard, player);

    for (const move of orderedMoves) {
      const nextBoard = this.applyMoveToBoard(rootBoard, move);
      const score = this.minimax(
        nextBoard,
        player === 'white' ? 'black' : 'white',
        depth - 1,
        alpha,
        beta,
        player,
        game
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
        alpha = Math.max(alpha, score);
      }
    }

    return bestMove;
  }

  minimax(board, currentPlayer, depth, alpha, beta, maximizingPlayer, game) {
    const legalMoves = this.getLegalMovesForBoard(board, currentPlayer, game);
    if (depth === 0 || !legalMoves.length) {
      return this.evaluateBoard(board, maximizingPlayer);
    }

    if (currentPlayer === maximizingPlayer) {
      let maxScore = -Infinity;
      for (const move of this.orderMoves(legalMoves, board, currentPlayer)) {
        const nextBoard = this.applyMoveToBoard(board, move);
        const score = this.minimax(
          nextBoard,
          currentPlayer === 'white' ? 'black' : 'white',
          depth - 1,
          alpha,
          beta,
          maximizingPlayer,
          game
        );
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    }

    let minScore = Infinity;
    for (const move of this.orderMoves(legalMoves, board, currentPlayer)) {
      const nextBoard = this.applyMoveToBoard(board, move);
      const score = this.minimax(
        nextBoard,
        currentPlayer === 'white' ? 'black' : 'white',
        depth - 1,
        alpha,
        beta,
        maximizingPlayer,
        game
      );
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }

  getLegalMovesForBoard(board, player, game) {
    const originalBoard = game.board.map((row) => [...row]);
    const originalPlayer = game.currentPlayer;

    game.board = board.map((row) => [...row]);
    game.currentPlayer = player;
    const moves = game.getAllLegalMoves(player);

    game.board = originalBoard;
    game.currentPlayer = originalPlayer;
    return moves;
  }

  orderMoves(moves, board, player) {
    return [...moves].sort((a, b) => {
      const aScore = this.scoreMove(board, a, player);
      const bScore = this.scoreMove(board, b, player);
      return bScore - aScore;
    });
  }

  scoreMove(board, move, player) {
    let score = 0;
    const piece = board[move.fromRow][move.fromCol];
    score += this.getPieceValue(piece) * 8;

    if (move.capture) {
      score += this.getPieceValue(board[move.toRow][move.toCol]) * 4;
    }

    const centerBias = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    score += centerBias[move.toRow][move.toCol] * 2;
    score += (player === 'white' ? -move.toRow : move.toRow) * 0.25;
    return score;
  }

  applyMoveToBoard(board, move) {
    const nextBoard = board.map((row) => [...row]);
    const piece = nextBoard[move.fromRow][move.fromCol];
    nextBoard[move.fromRow][move.fromCol] = PIECES.EMPTY;
    nextBoard[move.toRow][move.toCol] = piece;

    // Handle en passant capture
    if (move.enPassant) {
      const captureRow = (piece === PIECES.WP) ? move.toRow + 1 : move.toRow - 1;
      nextBoard[captureRow][move.toCol] = PIECES.EMPTY;
    }

    // Handle castling rook movement
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

    // Handle pawn promotion (default to queen)
    if ((piece === PIECES.WP && move.toRow === 0) || (piece === PIECES.BP && move.toRow === 7)) {
      nextBoard[move.toRow][move.toCol] = (piece === PIECES.WP) ? PIECES.WQ : PIECES.BQ;
    }

    return nextBoard;
  }

  evaluateBoard(board, player) {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece || piece === PIECES.EMPTY) continue;

        const value = this.getPieceValue(piece);
        const table = this.getSquareTable(piece, row, col);
        const pieceScore = value + (table * 0.35);

        score += this.isWhite(piece) ? pieceScore : -pieceScore;
      }
    }

    return player === 'white' ? score : -score;
  }

  getSquareTable(piece, row, col) {
    const isWhitePiece = this.isWhite(piece);
    const mirroredRow = isWhitePiece ? row : 7 - row;
    const mirroredCol = isWhitePiece ? col : 7 - col;

    if (piece === PIECES.WP || piece === PIECES.BP) {
      return this.pawnSquareTable[mirroredRow][mirroredCol];
    }
    if (piece === PIECES.WN || piece === PIECES.BN) {
      return this.knightSquareTable[mirroredRow][mirroredCol];
    }
    if (piece === PIECES.WB || piece === PIECES.BB) {
      return this.bishopSquareTable[mirroredRow][mirroredCol];
    }
    if (piece === PIECES.WR || piece === PIECES.BR) {
      return this.rookSquareTable[mirroredRow][mirroredCol];
    }
    if (piece === PIECES.WQ || piece === PIECES.BQ) {
      return this.queenSquareTable[mirroredRow][mirroredCol];
    }
    if (piece === PIECES.WK || piece === PIECES.BK) {
      return this.kingSquareTable[mirroredRow][mirroredCol];
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
