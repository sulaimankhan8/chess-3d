import { ChessGame, PIECES } from './js/game.js';
import { ChessAI } from './js/ai.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== TEST SUITE 1: Basic Game Initialization & Moves ===');
const game = new ChessGame();
assert(game.currentPlayer === 'white', 'Game starts with white');
assert(game.board[7][4] === PIECES.WK, 'White King is on e1 (row 7, col 4)');
assert(game.board[0][4] === PIECES.BK, 'Black King is on e8 (row 0, col 4)');
assert(game.validMoves.length === 20, 'White has 20 opening moves (16 pawn + 4 knight)');

console.log('\n=== TEST SUITE 2: Playing Moves & Turn Switch ===');
const e2e4 = game.validMoves.find(m => m.fromRow === 6 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 4);
assert(e2e4 !== undefined, 'e2-e4 is a valid opening move');
game.makeMove(e2e4);
assert(game.currentPlayer === 'black', 'After e2-e4, it is black turn');
assert(game.board[4][4] === PIECES.WP, 'White pawn is now on e4');
assert(game.board[6][4] === PIECES.EMPTY, 'Square e2 is now empty');
assert(game.validMoves.length === 20, 'Black has 20 opening moves');

console.log('\n=== TEST SUITE 3: En Passant Execution (White captures Black) ===');
const epGame = new ChessGame();
// 1. e4 (row 6, col 4 -> row 4, col 4)
epGame.makeMove(epGame.validMoves.find(m => m.fromRow === 6 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 4));
// 1... a6 (row 1, col 0 -> row 2, col 0)
epGame.makeMove(epGame.validMoves.find(m => m.fromRow === 1 && m.fromCol === 0 && m.toRow === 2 && m.toCol === 0));
// 2. e5 (row 4, col 4 -> row 3, col 4)
epGame.makeMove(epGame.validMoves.find(m => m.fromRow === 4 && m.fromCol === 4 && m.toRow === 3 && m.toCol === 4));
// 2... d5 (row 1, col 3 -> row 3, col 3) - 2 step move triggering EP
epGame.makeMove(epGame.validMoves.find(m => m.fromRow === 1 && m.fromCol === 3 && m.toRow === 3 && m.toCol === 3));

assert(epGame.enPassantTarget !== null, 'En passant target exists after d7-d5');
assert(epGame.enPassantTarget.row === 2 && epGame.enPassantTarget.col === 3, 'En passant target square is d6 (row 2, col 3)');

const epMove = epGame.validMoves.find(m => m.enPassant);
assert(epMove !== undefined, 'White has an en passant move e5xd6');
epGame.makeMove(epMove);
assert(epGame.board[2][3] === PIECES.WP, 'White pawn is on d6 (row 2, col 3)');
assert(epGame.board[3][3] === PIECES.EMPTY, 'Black pawn on d5 (row 3, col 3) is captured and square is empty');
assert(epGame.board[3][4] === PIECES.EMPTY, 'White original square e5 is empty');

console.log('\n=== TEST SUITE 4: En Passant Execution (Black captures White) ===');
const epGame2 = new ChessGame();
// 1. a3
epGame2.makeMove(epGame2.validMoves.find(m => m.fromRow === 6 && m.fromCol === 0 && m.toRow === 5 && m.toCol === 0));
// 1... e5
epGame2.makeMove(epGame2.validMoves.find(m => m.fromRow === 1 && m.fromCol === 4 && m.toRow === 3 && m.toCol === 4));
// 2. a4
epGame2.makeMove(epGame2.validMoves.find(m => m.fromRow === 5 && m.fromCol === 0 && m.toRow === 4 && m.toCol === 0));
// 2... e4 (row 3, col 4 -> row 4, col 4)
epGame2.makeMove(epGame2.validMoves.find(m => m.fromRow === 3 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 4));
// 3. d4 (row 6, col 3 -> row 4, col 3) - 2 step move
epGame2.makeMove(epGame2.validMoves.find(m => m.fromRow === 6 && m.fromCol === 3 && m.toRow === 4 && m.toCol === 3));

const blackEpMove = epGame2.validMoves.find(m => m.enPassant);
assert(blackEpMove !== undefined, 'Black has an en passant move e4xd3');
epGame2.makeMove(blackEpMove);
assert(epGame2.board[5][3] === PIECES.BP, 'Black pawn is on d3 (row 5, col 3)');
assert(epGame2.board[4][3] === PIECES.EMPTY, 'White pawn on d4 (row 4, col 3) is captured and square is empty');

console.log('\n=== TEST SUITE 5: Castling (Kingside & Queenside) ===');
const castleGame = new ChessGame();
// Set up board for white kingside castling: clear f1, g1
castleGame.board[7][5] = PIECES.EMPTY;
castleGame.board[7][6] = PIECES.EMPTY;
castleGame.updateValidMoves();
const whiteKingsideCastle = castleGame.validMoves.find(m => m.castling === 'king-side');
assert(whiteKingsideCastle !== undefined, 'White has kingside castling available');
castleGame.makeMove(whiteKingsideCastle);
assert(castleGame.board[7][6] === PIECES.WK, 'White King is on g1 (row 7, col 6)');
assert(castleGame.board[7][5] === PIECES.WR, 'White Rook is on f1 (row 7, col 5)');
assert(castleGame.board[7][4] === PIECES.EMPTY, 'Square e1 is empty');
assert(castleGame.board[7][7] === PIECES.EMPTY, 'Square h1 is empty');

// Set up black queenside castling: clear d8, c8, b8
castleGame.board[0][1] = PIECES.EMPTY;
castleGame.board[0][2] = PIECES.EMPTY;
castleGame.board[0][3] = PIECES.EMPTY;
castleGame.updateValidMoves();
const blackQueensideCastle = castleGame.validMoves.find(m => m.castling === 'queen-side');
assert(blackQueensideCastle !== undefined, 'Black has queenside castling available');
castleGame.makeMove(blackQueensideCastle);
assert(castleGame.board[0][2] === PIECES.BK, 'Black King is on c8 (row 0, col 2)');
assert(castleGame.board[0][3] === PIECES.BR, 'Black Rook is on d8 (row 0, col 3)');
assert(castleGame.board[0][4] === PIECES.EMPTY, 'Square e8 is empty');
assert(castleGame.board[0][0] === PIECES.EMPTY, 'Square a8 is empty');

console.log('\n=== TEST SUITE 6: Fool\'s Mate (White Checkmated by Black) ===');
const foolsGame = new ChessGame();
// 1. f3
foolsGame.makeMove(foolsGame.validMoves.find(m => m.fromRow === 6 && m.fromCol === 5 && m.toRow === 5 && m.toCol === 5));
// 1... e5
foolsGame.makeMove(foolsGame.validMoves.find(m => m.fromRow === 1 && m.fromCol === 4 && m.toRow === 3 && m.toCol === 4));
// 2. g4
foolsGame.makeMove(foolsGame.validMoves.find(m => m.fromRow === 6 && m.fromCol === 6 && m.toRow === 4 && m.toCol === 6));
// 2... Qh4# (row 0, col 3 -> row 4, col 7)
const qh4 = foolsGame.validMoves.find(m => m.fromRow === 0 && m.fromCol === 3 && m.toRow === 4 && m.toCol === 7);
assert(qh4 !== undefined, 'Black has Qh4# move');
foolsGame.makeMove(qh4);
assert(foolsGame.gameOver === true, 'Game is over');
assert(foolsGame.gameResult === 'checkmate', 'Game result is checkmate');
assert(foolsGame.winner === 'black', 'Winner is Black');

console.log('\n=== TEST SUITE 7: Scholar\'s Mate (Black Checkmated by White) ===');
const scholarsGame = new ChessGame();
// 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 6 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 4));
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 1 && m.fromCol === 4 && m.toRow === 3 && m.toCol === 4));
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 7 && m.fromCol === 5 && m.toRow === 4 && m.toCol === 2));
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 0 && m.fromCol === 1 && m.toRow === 2 && m.toCol === 2));
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 7 && m.fromCol === 3 && m.toRow === 3 && m.toCol === 7));
scholarsGame.makeMove(scholarsGame.validMoves.find(m => m.fromRow === 0 && m.fromCol === 6 && m.toRow === 2 && m.toCol === 5));
const qxf7 = scholarsGame.validMoves.find(m => m.fromRow === 3 && m.fromCol === 7 && m.toRow === 1 && m.toCol === 5);
assert(qxf7 !== undefined, 'White has Qxf7# move');
scholarsGame.makeMove(qxf7);
assert(scholarsGame.gameOver === true, 'Game is over');
assert(scholarsGame.gameResult === 'checkmate', 'Game result is checkmate');
assert(scholarsGame.winner === 'white', 'Winner is White');

console.log('\n=== TEST SUITE 8: AI Engine (Minimax, Evaluation & Opening Book) ===');
const ai = new ChessAI('master');
const aiMoveWhite = ai.getBestMove(new ChessGame(), 'white');
assert(aiMoveWhite !== null, 'AI generates valid opening move for White');

const aiGameBlack = new ChessGame();
aiGameBlack.makeMove(aiGameBlack.validMoves.find(m => m.fromRow === 6 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 4)); // 1. e4
const aiMoveBlack = ai.getBestMove(aiGameBlack, 'black');
assert(aiMoveBlack !== null, 'AI generates valid opening response for Black');

console.log('\n=== TEST SUITE 9: FEN & UCI Move Parsing ===');
const fenGame = new ChessGame();
const fen = fenGame.getFEN();
assert(fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'FEN string starts with standard starting position');

const uciParsed = fenGame.parseUCIMove('e2e4', 'white');
assert(uciParsed !== null && uciParsed.fromRow === 6 && uciParsed.fromCol === 4 && uciParsed.toRow === 4 && uciParsed.toCol === 4, 'UCI e2e4 parsed correctly');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);
if (failed > 0) process.exit(1);
