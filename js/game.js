export const PIECES = {
  EMPTY: 0,
  WP: 1,
  WN: 2,
  WB: 3,
  WR: 4,
  WQ: 5,
  WK: 6,
  BP: 7,
  BN: 8,
  BB: 9,
  BR: 10,
  BQ: 11,
  BK: 12,
};

const pieceSymbols = {
  [PIECES.WP]: '♙',
  [PIECES.WN]: '♘',
  [PIECES.WB]: '♗',
  [PIECES.WR]: '♖',
  [PIECES.WQ]: '♕',
  [PIECES.WK]: '♔',
  [PIECES.BP]: '♟',
  [PIECES.BN]: '♞',
  [PIECES.BB]: '♝',
  [PIECES.BR]: '♜',
  [PIECES.BQ]: '♛',
  [PIECES.BK]: '♚',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export class ChessGame {
  constructor() {
    this.board = [];
    this.currentPlayer = 'white';
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.gameOver = false;
    this.winner = null;
    this.lastMove = null;
    this.gameResult = 'playing';
    this.moveHistory = [];

    // Draw-rule state.
    this.halfmoveClock = 0;
    this.positionCounts = new Map();
    this.drawOffer = null;

    // Track castling rights
    this.castlingRights = {
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true
    };
    
    // Track en passant target
    this.enPassantTarget = null;
    
    // For promotion callback
    this.promotionCallback = null;
    
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(PIECES.EMPTY));
    this.currentPlayer = 'white';
    this.selected = null;
    this.validMoves = [];
    this.history = [];
    this.gameOver = false;
    this.winner = null;
    this.lastMove = null;
    this.gameResult = 'playing';
    this.enPassantTarget = null;
    this.promotionCallback = null;
    this.moveHistory = [];

    this.halfmoveClock = 0;
    this.positionCounts = new Map();
    this.drawOffer = null;

    this.castlingRights = {
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true
    };

    const backRankWhite = [PIECES.WR, PIECES.WN, PIECES.WB, PIECES.WQ, PIECES.WK, PIECES.WB, PIECES.WN, PIECES.WR];
    const backRankBlack = [PIECES.BR, PIECES.BN, PIECES.BB, PIECES.BQ, PIECES.BK, PIECES.BB, PIECES.BN, PIECES.BR];

    this.board[0] = [...backRankBlack];
    this.board[1] = Array(8).fill(PIECES.BP);
    this.board[6] = Array(8).fill(PIECES.WP);
    this.board[7] = [...backRankWhite];

    this.recordCurrentPosition();
    this.updateValidMoves();
  }

  isWhite(piece) {
    return piece >= PIECES.WP && piece <= PIECES.WK;
  }

  isBlack(piece) {
    return piece >= PIECES.BP && piece <= PIECES.BK;
  }

  isOpponent(piece, player) {
    return player === 'white' ? this.isBlack(piece) : this.isWhite(piece);
  }

  getPieceSymbol(piece) {
    return pieceSymbols[piece] || '';
  }

  coordLabel(row, col) {
    return `${FILES[col]}${8 - row}`;
  }

  isInside(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // Check if a player is in check
  isInCheck(board = this.board, player = this.currentPlayer) {
    const kingPiece = player === 'white' ? PIECES.WK : PIECES.BK;
    const opponent = player === 'white' ? 'black' : 'white';
    
    // Find the king
    let kingRow = -1, kingCol = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === kingPiece) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    // If no king found, it's checkmate
    if (kingRow === -1) return true;
    
    // Check if any opponent piece attacks the king's position
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && this.isOpponent(piece, player)) {
          const moves = this.getPieceMoves(r, c, board, opponent, true);
          for (const move of moves) {
            if (move.toRow === kingRow && move.toCol === kingCol) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  getPieceMoves(row, col, board = this.board, player = this.currentPlayer, forCheck = false) {
    const piece = board[row][col];
    if (!piece || piece === PIECES.EMPTY) return [];

    const moves = [];
    const friendly = (p) => player === 'white' ? this.isWhite(p) : this.isBlack(p);

    if (!friendly(piece)) return [];

    // Pawn moves
    if (piece === PIECES.WP || piece === PIECES.BP) {
      const step = player === 'white' ? -1 : 1;
      const startRow = player === 'white' ? 6 : 1;
      const oneStep = row + step;
      if (this.isInside(oneStep, col) && board[oneStep][col] === PIECES.EMPTY) {
        moves.push({ fromRow: row, fromCol: col, toRow: oneStep, toCol: col, capture: false });
        const twoStep = row + step * 2;
        if (row === startRow && board[twoStep][col] === PIECES.EMPTY) {
          moves.push({ fromRow: row, fromCol: col, toRow: twoStep, toCol: col, capture: false });
        }
      }

      // Captures
      [-1, 1].forEach((dc) => {
        const targetRow = row + step;
        const targetCol = col + dc;
        if (this.isInside(targetRow, targetCol)) {
          const targetPiece = board[targetRow][targetCol];
          if (targetPiece && this.isOpponent(targetPiece, player)) {
            moves.push({ fromRow: row, fromCol: col, toRow: targetRow, toCol: targetCol, capture: true });
          }
          // En passant
          if (!forCheck && this.enPassantTarget) {
            if (targetRow === this.enPassantTarget.row && targetCol === this.enPassantTarget.col) {
              moves.push({ 
                fromRow: row, fromCol: col, 
                toRow: targetRow, toCol: targetCol, 
                capture: true, 
                enPassant: true 
              });
            }
          }
        }
      });
    }

    // Knight moves
    if (piece === PIECES.WN || piece === PIECES.BN) {
      const leaps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      leaps.forEach(([dr, dc]) => {
        const nr = row + dr;
        const nc = col + dc;
        if (!this.isInside(nr, nc)) return;
        const targetPiece = board[nr][nc];
        if (!targetPiece || !friendly(targetPiece)) {
          moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc, capture: Boolean(targetPiece) });
        }
      });
    }

    // Bishop, Rook, Queen moves
    if (piece === PIECES.WB || piece === PIECES.BB || piece === PIECES.WQ || piece === PIECES.BQ || piece === PIECES.WR || piece === PIECES.BR) {
      const directions = [];
      if (piece === PIECES.WB || piece === PIECES.BB || piece === PIECES.WQ || piece === PIECES.BQ) {
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (piece === PIECES.WR || piece === PIECES.BR || piece === PIECES.WQ || piece === PIECES.BQ) {
        directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      directions.forEach(([dr, dc]) => {
        let nr = row + dr;
        let nc = col + dc;
        while (this.isInside(nr, nc)) {
          const targetPiece = board[nr][nc];
          if (targetPiece === PIECES.EMPTY) {
            moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc, capture: false });
          } else {
            if (this.isOpponent(targetPiece, player)) {
              moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc, capture: true });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      });
    }

    // King moves
    if (piece === PIECES.WK || piece === PIECES.BK) {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];

      kingMoves.forEach(([dr, dc]) => {
        const nr = row + dr;
        const nc = col + dc;
        if (!this.isInside(nr, nc)) return;
        const targetPiece = board[nr][nc];
        if (!targetPiece || this.isOpponent(targetPiece, player)) {
          moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc, capture: Boolean(targetPiece) });
        }
      });

      // Castling (only if not checking for check)
      if (!forCheck) {
        const castlingMoves = this.getCastlingMoves(row, col, board, player);
        moves.push(...castlingMoves);
      }
    }

    return moves;
  }

  // Get castling moves
  getCastlingMoves(row, col, board, player) {
    const piece = board[row][col];
    if ((player === 'white' && piece !== PIECES.WK) || 
        (player === 'black' && piece !== PIECES.BK)) return [];
    
    const moves = [];
    const rank = player === 'white' ? 7 : 0;
    
    // King-side castling
    if (this.castlingRights[`${player}KingSide`]) {
      if (board[rank][5] === PIECES.EMPTY && board[rank][6] === PIECES.EMPTY) {
        const rookPiece = player === 'white' ? PIECES.WR : PIECES.BR;
        if (board[rank][7] === rookPiece) {
          // Check if king passes through check
          const testBoard1 = board.map(r => [...r]);
          testBoard1[rank][5] = piece;
          testBoard1[rank][4] = PIECES.EMPTY;
          const testBoard2 = board.map(r => [...r]);
          testBoard2[rank][6] = piece;
          testBoard2[rank][4] = PIECES.EMPTY;
          
          if (!this.isInCheck(board, player) && 
              !this.isInCheck(testBoard1, player) && 
              !this.isInCheck(testBoard2, player)) {
            moves.push({ 
              fromRow: row, fromCol: col, 
              toRow: rank, toCol: 6, 
              capture: false, 
              castling: 'king-side' 
            });
          }
        }
      }
    }
    
    // Queen-side castling
    if (this.castlingRights[`${player}QueenSide`]) {
      if (board[rank][1] === PIECES.EMPTY && board[rank][2] === PIECES.EMPTY && board[rank][3] === PIECES.EMPTY) {
        const rookPiece = player === 'white' ? PIECES.WR : PIECES.BR;
        if (board[rank][0] === rookPiece) {
          const testBoard1 = board.map(r => [...r]);
          testBoard1[rank][3] = piece;
          testBoard1[rank][4] = PIECES.EMPTY;
          const testBoard2 = board.map(r => [...r]);
          testBoard2[rank][2] = piece;
          testBoard2[rank][4] = PIECES.EMPTY;
          
          if (!this.isInCheck(board, player) && 
              !this.isInCheck(testBoard1, player) && 
              !this.isInCheck(testBoard2, player)) {
            moves.push({ 
              fromRow: row, fromCol: col, 
              toRow: rank, toCol: 2, 
              capture: false, 
              castling: 'queen-side' 
            });
          }
        }
      }
    }
    
    return moves;
  }

  // Modified getAllLegalMoves to filter out moves that leave king in check
  getAllLegalMoves(player = this.currentPlayer, board = this.board) {
    const moves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if ((player === 'white' && this.isWhite(piece)) || (player === 'black' && this.isBlack(piece))) {
          const pieceMoves = this.getPieceMoves(row, col, board, player);
          for (const move of pieceMoves) {
            // Simulate the move
            const testBoard = board.map(r => [...r]);
            testBoard[move.toRow][move.toCol] = testBoard[move.fromRow][move.fromCol];
            testBoard[move.fromRow][move.fromCol] = PIECES.EMPTY;
            
            // Handle en passant capture in test
            if (move.enPassant) {
              const epRow = player === 'white' ? move.toRow + 1 : move.toRow - 1;
              testBoard[epRow][move.toCol] = PIECES.EMPTY;
            }
            
            // Handle castling in test
            if (move.castling) {
              const rank = move.toRow;
              if (move.castling === 'king-side') {
                testBoard[rank][5] = testBoard[rank][7];
                testBoard[rank][7] = PIECES.EMPTY;
              } else if (move.castling === 'queen-side') {
                testBoard[rank][3] = testBoard[rank][0];
                testBoard[rank][0] = PIECES.EMPTY;
              }
            }
            
            // Check if the move leaves own king in check
            if (!this.isInCheck(testBoard, player)) {
              moves.push(move);
            }
          }
        }
      }
    }
    return moves;
  }

  // Position identity for repetition: board + side to move +
  // castling rights + en-passant target.
  getPositionKey() {
    const boardKey = this.board.map(row => row.join(',')).join('/');
    const castlingKey = [
      this.castlingRights.whiteKingSide ? 'K' : '',
      this.castlingRights.whiteQueenSide ? 'Q' : '',
      this.castlingRights.blackKingSide ? 'k' : '',
      this.castlingRights.blackQueenSide ? 'q' : '',
    ].join('') || '-';
    const epKey = this.enPassantTarget
      ? `${this.enPassantTarget.row},${this.enPassantTarget.col}`
      : '-';

    return `${boardKey}|${this.currentPlayer}|${castlingKey}|${epKey}`;
  }

  recordCurrentPosition() {
    const key = this.getPositionKey();
    this.positionCounts.set(key, (this.positionCounts.get(key) || 0) + 1);
  }

  getCurrentPositionRepetitions() {
    return this.positionCounts.get(this.getPositionKey()) || 0;
  }

  canClaimThreefold() {
    return this.getCurrentPositionRepetitions() >= 3;
  }

  canClaimFiftyMoveDraw() {
    return this.halfmoveClock >= 100;
  }

  isFivefoldRepetition() {
    return this.getCurrentPositionRepetitions() >= 5;
  }

  isSeventyFiveMoveDraw() {
    return this.halfmoveClock >= 150;
  }

  // Standard insufficient-material cases that are unambiguously dead:
  // K vs K, K+B vs K, K+N vs K, and same-colored B vs B.
  isInsufficientMaterial() {
    const pieces = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece === PIECES.EMPTY || piece === PIECES.WK || piece === PIECES.BK) continue;
        pieces.push({ piece, row, col });
      }
    }

    if (pieces.length === 0) return true;

    // Pawns, rooks and queens can participate in mating positions.
    if (pieces.some(({ piece }) =>
      [PIECES.WP, PIECES.BP, PIECES.WR, PIECES.BR, PIECES.WQ, PIECES.BQ].includes(piece)
    )) {
      return false;
    }

    if (pieces.length === 1) {
      return [PIECES.WB, PIECES.BB, PIECES.WN, PIECES.BN].includes(pieces[0].piece);
    }

    if (
      pieces.length === 2 &&
      pieces.every(({ piece }) => piece === PIECES.WB || piece === PIECES.BB)
    ) {
      const squareColors = pieces.map(({ row, col }) => (row + col) % 2);
      return squareColors[0] === squareColors[1];
    }

    return false;
  }

  // Browser-friendly dead-position coverage. A complete proof that no
  // possible legal continuation can ever produce mate is a much larger
  // state-space problem, so the engine uses the provable dead-material
  // positions here plus the explicit stalemate/repetition/counter rules.
  isDeadPosition() {
    return this.isInsufficientMaterial();
  }

  getDrawClaimReasons() {
    const reasons = [];
    if (this.canClaimThreefold()) reasons.push('threefold-repetition');
    if (this.canClaimFiftyMoveDraw()) reasons.push('fifty-move-rule');
    return reasons;
  }

  claimDraw(reason = null) {
    if (this.gameOver) {
      return { type: 'DRAW_CLAIM_REJECTED', reason: 'game-over' };
    }

    const available = this.getDrawClaimReasons();
    const claimReason = reason || available[0];

    if (!claimReason || !available.includes(claimReason)) {
      return {
        type: 'DRAW_CLAIM_REJECTED',
        reason: 'not-claimable',
        available,
      };
    }

    this.gameOver = true;
    this.winner = null;
    this.gameResult = claimReason;
    this.drawOffer = null;

    return {
      type: 'DRAW_CLAIMED',
      gameOver: true,
      winner: null,
      gameResult: claimReason,
    };
  }

  // Mutual agreement: first click offers; the opponent's click accepts.
  offerDraw() {
    if (this.gameOver) return { type: 'DRAW_OFFER_REJECTED', reason: 'game-over' };

    if (!this.drawOffer) {
      this.drawOffer = this.currentPlayer;
      return { type: 'DRAW_OFFERED', by: this.currentPlayer };
    }

    if (this.drawOffer === this.currentPlayer) {
      return { type: 'DRAW_OFFER_ALREADY_PENDING', by: this.currentPlayer };
    }

    this.gameOver = true;
    this.winner = null;
    this.gameResult = 'agreement';
    this.drawOffer = null;

    return {
      type: 'DRAW_AGREED',
      gameOver: true,
      winner: null,
      gameResult: 'agreement',
    };
  }

  // Complete draw/checkmate evaluation.
  updateValidMoves() {
    this.validMoves = this.getAllLegalMoves(this.currentPlayer, this.board);

    // Checkmate and stalemate take priority because there are no legal moves.
    if (this.validMoves.length === 0) {
      this.gameOver = true;

      if (this.isInCheck(this.board, this.currentPlayer)) {
        this.winner = this.currentPlayer === 'white' ? 'black' : 'white';
        this.gameResult = 'checkmate';
      } else {
        this.winner = null;
        this.gameResult = 'stalemate';
      }
      return;
    }

    // Automatic draw rules.
    if (this.isFivefoldRepetition()) {
      this.gameOver = true;
      this.winner = null;
      this.gameResult = 'fivefold-repetition';
      return;
    }

    if (this.isSeventyFiveMoveDraw()) {
      this.gameOver = true;
      this.winner = null;
      this.gameResult = 'seventy-five-move-rule';
      return;
    }

    if (this.isInsufficientMaterial()) {
      this.gameOver = true;
      this.winner = null;
      this.gameResult = 'insufficient-material';
      return;
    }

    if (this.isDeadPosition()) {
      this.gameOver = true;
      this.winner = null;
      this.gameResult = 'dead-position';
      return;
    }

    this.gameOver = false;
    this.winner = null;
    this.gameResult = this.isInCheck(this.board, this.currentPlayer) ? 'check' : 'playing';
  }

  selectSquare(row, col) {
    if (this.gameOver) return { type: 'INVALID' };

    const piece = this.board[row][col];
    const ownsPiece = (this.currentPlayer === 'white' && this.isWhite(piece)) || (this.currentPlayer === 'black' && this.isBlack(piece));

    if (ownsPiece) {
      const ownMoves = this.validMoves.filter((move) => move.fromRow === row && move.fromCol === col);
      if (ownMoves.length) {
        this.selected = { row, col };
        return { type: 'SELECTED', row, col };
      }
    }

    if (this.selected) {
      const move = this.validMoves.find((item) => 
        item.fromRow === this.selected.row && 
        item.fromCol === this.selected.col && 
        item.toRow === row && 
        item.toCol === col
      );
      if (move) {
        return this.makeMove(move);
      }
    }

    this.selected = null;
    return { type: 'DESELECTED' };
  }

  makeMove(move) {
    // Save state for undo
    this.history.push({
      board: this.board.map((row) => [...row]),
      currentPlayer: this.currentPlayer,
      lastMove: this.lastMove,
      castlingRights: { ...this.castlingRights },
      enPassantTarget: this.enPassantTarget
        ? { ...this.enPassantTarget }
        : null,
      halfmoveClock: this.halfmoveClock,
      positionCounts: new Map(this.positionCounts),
      drawOffer: this.drawOffer,
    });

    const { fromRow, fromCol, toRow, toCol, capture } = move;
    const piece = this.board[fromRow][fromCol];

    // Store captured piece for display
    const capturedPiece = this.board[toRow][toCol];

    // Handle en passant
    if (move.enPassant) {
      const epRow = this.currentPlayer === 'white' ? toRow + 1 : toRow - 1;
      this.board[epRow][toCol] = PIECES.EMPTY;
    }

    // Handle castling
    if (move.castling) {
      const rank = toRow;
      if (move.castling === 'king-side') {
        this.board[rank][5] = this.board[rank][7];
        this.board[rank][7] = PIECES.EMPTY;
      } else if (move.castling === 'queen-side') {
        this.board[rank][3] = this.board[rank][0];
        this.board[rank][0] = PIECES.EMPTY;
      }
    }

    // Make the move
    this.board[fromRow][fromCol] = PIECES.EMPTY;
    this.board[toRow][toCol] = piece;

    // Update en passant target
    this.enPassantTarget = null;
    if ((piece === PIECES.WP || piece === PIECES.BP) && Math.abs(toRow - fromRow) === 2) {
      this.enPassantTarget = {
        row: (fromRow + toRow) / 2,
        col: fromCol
      };
    }

    // Update castling rights
    if (piece === PIECES.WK) {
      this.castlingRights.whiteKingSide = false;
      this.castlingRights.whiteQueenSide = false;
    }
    if (piece === PIECES.BK) {
      this.castlingRights.blackKingSide = false;
      this.castlingRights.blackQueenSide = false;
    }
    if (piece === PIECES.WR) {
      if (fromRow === 7 && fromCol === 0) this.castlingRights.whiteQueenSide = false;
      if (fromRow === 7 && fromCol === 7) this.castlingRights.whiteKingSide = false;
    }
    if (piece === PIECES.BR) {
      if (fromRow === 0 && fromCol === 0) this.castlingRights.blackQueenSide = false;
      if (fromRow === 0 && fromCol === 7) this.castlingRights.blackKingSide = false;
    }
    // If a rook is captured
    if (toRow === 7 && toCol === 0) this.castlingRights.whiteQueenSide = false;
    if (toRow === 7 && toCol === 7) this.castlingRights.whiteKingSide = false;
    if (toRow === 0 && toCol === 0) this.castlingRights.blackQueenSide = false;
    if (toRow === 0 && toCol === 7) this.castlingRights.blackKingSide = false;

    // Handle pawn promotion
    let promotedPiece = null;
    if ((piece === PIECES.WP && toRow === 0) || (piece === PIECES.BP && toRow === 7)) {
      // Default to queen for AI, but allow human to choose
      if (this.promotionCallback) {
        promotedPiece = this.promotionCallback(piece, this.currentPlayer);
      } else {
        // Default to queen
        promotedPiece = piece === PIECES.WP ? PIECES.WQ : PIECES.BQ;
      }
      this.board[toRow][toCol] = promotedPiece;
    }

    const isPawnMove = piece === PIECES.WP || piece === PIECES.BP;
    const isCapture = Boolean(capture || move.enPassant || capturedPiece);
    this.halfmoveClock = (isPawnMove || isCapture)
      ? 0
      : this.halfmoveClock + 1;

    this.drawOffer = null;

    this.lastMove = {
      from: this.coordLabel(fromRow, fromCol),
      to: this.coordLabel(toRow, toCol),
      piece: this.getPieceSymbol(piece),
      capture: capture || Boolean(move.enPassant),
      castling: move.castling || null,
      enPassant: move.enPassant || null,
      promotion: promotedPiece ? this.getPieceSymbol(promotedPiece) : null,
    };

    this.moveHistory.push({
      piece: this.getPieceSymbol(piece),
      from: this.coordLabel(fromRow, fromCol),
      to: this.coordLabel(toRow, toCol),
      capture: capture || Boolean(move.enPassant),
      castling: move.castling || null,
      promotion: promotedPiece ? this.getPieceSymbol(promotedPiece) : null,
    });

    this.selected = null;
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.recordCurrentPosition();
    this.updateValidMoves();

    return {
      type: 'MOVE_COMPLETED',
      move,
      gameOver: this.gameOver,
      winner: this.winner,
      gameResult: this.gameResult,
    };
  }

  undo() {
    if (!this.history.length) return false;
    const previous = this.history.pop();
    this.board = previous.board.map((row) => [...row]);
    this.currentPlayer = previous.currentPlayer;
    this.lastMove = previous.lastMove;
    this.castlingRights = { ...previous.castlingRights };
    this.enPassantTarget = previous.enPassantTarget
      ? { ...previous.enPassantTarget }
      : null;
    this.halfmoveClock = previous.halfmoveClock;
    this.positionCounts = new Map(previous.positionCounts);
    this.drawOffer = previous.drawOffer;
    this.selected = null;
    this.gameOver = false;
    this.winner = null;
    this.gameResult = 'playing';
    this.moveHistory.pop();
    this.updateValidMoves();
    return true;
  }

  getPieceCount() {
    let white = 0;
    let black = 0;
    for (const row of this.board) {
      for (const piece of row) {
        if (this.isWhite(piece)) white++;
        if (this.isBlack(piece)) black++;
      }
    }
    return { white, black };
  }

  getCapturedPieces() {
    const initialWhite = {
      [PIECES.WP]: 8, [PIECES.WN]: 2, [PIECES.WB]: 2, [PIECES.WR]: 2, [PIECES.WQ]: 1
    };
    const initialBlack = {
      [PIECES.BP]: 8, [PIECES.BN]: 2, [PIECES.BB]: 2, [PIECES.BR]: 2, [PIECES.BQ]: 1
    };

    const pieceValues = {
      [PIECES.WP]: 1, [PIECES.BP]: 1,
      [PIECES.WN]: 3, [PIECES.BN]: 3,
      [PIECES.WB]: 3, [PIECES.BB]: 3,
      [PIECES.WR]: 5, [PIECES.BR]: 5,
      [PIECES.WQ]: 9, [PIECES.BQ]: 9,
    };

    const currentCount = {};
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece) {
          currentCount[piece] = (currentCount[piece] || 0) + 1;
        }
      }
    }

    // Pieces captured by White (Black pieces taken off board)
    const capturedByWhite = [];
    let whiteScore = 0;
    for (const [pStr, max] of Object.entries(initialBlack)) {
      const p = Number(pStr);
      const missing = max - (currentCount[p] || 0);
      for (let i = 0; i < missing; i++) {
        capturedByWhite.push({ piece: p, symbol: pieceSymbols[p], value: pieceValues[p] });
        whiteScore += pieceValues[p];
      }
    }

    // Pieces captured by Black (White pieces taken off board)
    const capturedByBlack = [];
    let blackScore = 0;
    for (const [pStr, max] of Object.entries(initialWhite)) {
      const p = Number(pStr);
      const missing = max - (currentCount[p] || 0);
      for (let i = 0; i < missing; i++) {
        capturedByBlack.push({ piece: p, symbol: pieceSymbols[p], value: pieceValues[p] });
        blackScore += pieceValues[p];
      }
    }

    const lead = whiteScore - blackScore;

    return {
      capturedByWhite,
      capturedByBlack,
      whiteScore,
      blackScore,
      lead,
    };
  }

  // Get move in algebraic notation
  getMoveNotation(move) {
    const piece = this.board[move.toRow][move.toCol];
    let notation = '';
    
    if (move.castling === 'king-side') return 'O-O';
    if (move.castling === 'queen-side') return 'O-O-O';
    
    const pieceSymbols = {
      [PIECES.WP]: '', [PIECES.BP]: '',
      [PIECES.WN]: 'N', [PIECES.BN]: 'N',
      [PIECES.WB]: 'B', [PIECES.BB]: 'B',
      [PIECES.WR]: 'R', [PIECES.BR]: 'R',
      [PIECES.WQ]: 'Q', [PIECES.BQ]: 'Q',
      [PIECES.WK]: 'K', [PIECES.BK]: 'K',
    };
    
    notation += pieceSymbols[piece] || '';
    if (move.capture) notation += 'x';
    notation += this.coordLabel(move.toRow, move.toCol);
    if (move.promotion) notation += '=' + move.promotion;
    
    return notation;
  }

  // Set promotion callback for human player
  setPromotionCallback(callback) {
    this.promotionCallback = callback;
  }
}