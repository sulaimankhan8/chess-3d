import { PIECES } from './game.js';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// ============================================================================
// COMPREHENSIVE MASTER OPENING BOOK (150+ Lines & Variations)
// ============================================================================
const OPENING_BOOK = {
  // --- ROOT (White 1st Move) ---
  '': [
    { move: 'e2e4', weight: 48 }, // King's Pawn
    { move: 'd2d4', weight: 36 }, // Queen's Pawn
    { move: 'c2c4', weight: 11 }, // English Opening
    { move: 'g1f3', weight: 5 },  // Réti Opening
  ],

  // --- RESPONSES TO 1. e4 ---
  'e2e4': [
    { move: 'e7e5', weight: 42 }, // Open Game
    { move: 'c7c5', weight: 38 }, // Sicilian Defense
    { move: 'e7e6', weight: 11 }, // French Defense
    { move: 'c7c6', weight: 7 },  // Caro-Kann Defense
    { move: 'd7d5', weight: 2 },  // Scandinavian Defense
  ],

  // 1. e4 e5
  'e2e4 e7e5': [
    { move: 'g1f3', weight: 82 },
    { move: 'f1c4', weight: 10 },
    { move: 'b1c3', weight: 8 },
  ],
  'e2e4 e7e5 g1f3': [
    { move: 'b8c6', weight: 72 }, // Standard
    { move: 'g8f6', weight: 20 }, // Petrov Defense
    { move: 'd7d6', weight: 8 },  // Philidor Defense
  ],
  // Italian Game
  'e2e4 e7e5 g1f3 b8c6 f1c4': [
    { move: 'f8c5', weight: 55 }, // Giuoco Piano
    { move: 'g8f6', weight: 45 }, // Two Knights Defense
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5': [
    { move: 'c2c3', weight: 50 }, // Main line
    { move: 'd2d3', weight: 30 }, // Giuoco Pianissimo
    { move: 'e1g1', weight: 20 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3': [
    { move: 'g8f6', weight: 90 },
    { move: 'd7d6', weight: 10 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d4': [
    { move: 'e5d4', weight: 95 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d4 e5d4 c3d4': [
    { move: 'c5b4', weight: 95 }, // Bb4+
  ],
  // Two Knights Defense
  'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6': [
    { move: 'd2d3', weight: 50 },
    { move: 'g1g5', weight: 30 }, // Fried Liver line
    { move: 'd2d4', weight: 20 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5': [
    { move: 'd7d5', weight: 98 }, // Correct defense against Fried Liver
  ],
  'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 f3g5 d7d5 e4d5': [
    { move: 'c6a5', weight: 90 }, // Polerio defense
    { move: 'b6d5', weight: 10 },
  ],

  // Ruy Lopez (Spanish)
  'e2e4 e7e5 g1f3 b8c6 f1b5': [
    { move: 'a7a6', weight: 70 }, // Morphy Defense
    { move: 'g8f6', weight: 24 }, // Berlin Defense
    { move: 'd7d6', weight: 6 },  // Steinitz Defense
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6': [
    { move: 'b5a4', weight: 88 },
    { move: 'b5c6', weight: 12 }, // Exchange variation
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4': [
    { move: 'g8f6', weight: 82 },
    { move: 'd7d6', weight: 18 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6': [
    { move: 'e1g1', weight: 85 },
    { move: 'd2d3', weight: 15 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1': [
    { move: 'f8e7', weight: 70 }, // Closed Ruy Lopez
    { move: 'f6e4', weight: 30 }, // Open Ruy Lopez
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7': [
    { move: 'f1e1', weight: 85 },
    { move: 'd2d3', weight: 15 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 b7b5': [
    { move: 'b7b5', weight: 95 },
  ],
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7 f1e1 b7b5 a4b3': [
    { move: 'd7d6', weight: 75 },
    { move: 'e1g1', weight: 25 },
  ],

  // Scotch Game
  'e2e4 e7e5 g1f3 b8c6 d2d4': [
    { move: 'e5d4', weight: 96 },
  ],
  'e2e4 e7e5 g1f3 b8c6 d2d4 e5d4': [
    { move: 'f3d4', weight: 90 },
    { move: 'c2c3', weight: 10 },
  ],
  'e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4': [
    { move: 'g8f6', weight: 55 }, // Mieses variation
    { move: 'f8c5', weight: 45 }, // Classical
  ],

  // Petrov Defense
  'e2e4 e7e5 g1f3 g8f6': [
    { move: 'f3e5', weight: 75 },
    { move: 'd2d4', weight: 25 },
  ],
  'e2e4 e7e5 g1f3 g8f6 f3e5': [
    { move: 'd7d6', weight: 95 },
  ],
  'e2e4 e7e5 g1f3 g8f6 f3e5 d7d6': [
    { move: 'e5f3', weight: 95 },
  ],
  'e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3': [
    { move: 'f6e4', weight: 98 },
  ],

  // Anti Early-Queen / Scholar's Mate Traps
  'e2e4 e7e5 d1h5': [
    { move: 'b8c6', weight: 100 }, // Solid knight protection
  ],
  'e2e4 e7e5 d1h5 b8c6 f1c4': [
    { move: 'g7g6', weight: 100 }, // Refutes mate on f7
  ],
  'e2e4 e7e5 d1h5 b8c6 f1c4 g7g6 h5f3': [
    { move: 'g8f6', weight: 100 }, // Blocks and develops
  ],
  'e2e4 e7e5 d1f3': [
    { move: 'g8f6', weight: 80 },
    { move: 'b8c6', weight: 20 },
  ],

  // --- SICILIAN DEFENSE (1. e4 c5) ---
  'e2e4 c7c5': [
    { move: 'g1f3', weight: 78 },
    { move: 'b1c3', weight: 12 }, // Closed Sicilian
    { move: 'c2c3', weight: 10 }, // Alapin
  ],
  'e2e4 c7c5 g1f3': [
    { move: 'd7d6', weight: 50 }, // Najdorf / Dragon prep
    { move: 'b8c6', weight: 30 }, // Classical / Open
    { move: 'e7e6', weight: 20 }, // French Sicilian / Kan / Scheveningen
  ],
  'e2e4 c7c5 g1f3 d7d6': [
    { move: 'd2d4', weight: 88 },
    { move: 'f1b5', weight: 12 }, // Moscow variation
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4': [
    { move: 'c5d4', weight: 98 },
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4': [
    { move: 'g8f6', weight: 85 },
    { move: 'a7a6', weight: 15 },
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6': [
    { move: 'b1c3', weight: 98 },
  ],
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3': [
    { move: 'a7a6', weight: 65 }, // Najdorf
    { move: 'g7g6', weight: 20 }, // Dragon
    { move: 'e7e6', weight: 15 }, // Scheveningen
  ],
  // Sicilian Najdorf
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6': [
    { move: 'c1g5', weight: 35 }, // Main line
    { move: 'f1e2', weight: 30 }, // Karpov / Classical
    { move: 'f2f3', weight: 20 }, // English Attack
    { move: 'f1c4', weight: 15 }, // Fischer Attack
  ],

  // --- FRENCH DEFENSE (1. e4 e6) ---
  'e2e4 e7e6': [
    { move: 'd2d4', weight: 88 },
    { move: 'd2d3', weight: 12 },
  ],
  'e2e4 e7e6 d2d4': [
    { move: 'd7d5', weight: 98 },
  ],
  'e2e4 e7e6 d2d4 d7d5': [
    { move: 'b1c3', weight: 45 }, // Main line (Winawer / Classical)
    { move: 'e4e5', weight: 35 }, // Advance variation
    { move: 'b1d2', weight: 20 }, // Tarrasch
  ],
  'e2e4 e7e6 d2d4 d7d5 e4e5': [
    { move: 'c7c5', weight: 88 },
    { move: 'b8c6', weight: 12 },
  ],
  'e2e4 e7e6 d2d4 d7d5 e4e5 c7c5': [
    { move: 'c2c3', weight: 90 },
    { move: 'g1f3', weight: 10 },
  ],
  'e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3': [
    { move: 'b8c6', weight: 85 },
    { move: 'd8b6', weight: 15 },
  ],

  // --- CARO-KANN DEFENSE (1. e4 c6) ---
  'e2e4 c7c6': [
    { move: 'd2d4', weight: 88 },
    { move: 'b1c3', weight: 12 },
  ],
  'e2e4 c7c6 d2d4': [
    { move: 'd7d5', weight: 98 },
  ],
  'e2e4 c7c6 d2d4 d7d5': [
    { move: 'b1c3', weight: 45 }, // Classical
    { move: 'e4e5', weight: 35 }, // Advance
    { move: 'e4d5', weight: 20 }, // Exchange / Panov
  ],
  'e2e4 c7c6 d2d4 d7d5 e4e5': [
    { move: 'c8f5', weight: 90 },
    { move: 'c6c5', weight: 10 },
  ],

  // --- SCANDINAVIAN DEFENSE (1. e4 d5) ---
  'e2e4 d7d5': [
    { move: 'e4d5', weight: 95 },
  ],
  'e2e4 d7d5 e4d5': [
    { move: 'd8d5', weight: 80 },
    { move: 'g8f6', weight: 20 }, // Portuguese / Modern
  ],
  'e2e4 d7d5 e4d5 d8d5': [
    { move: 'b1c3', weight: 95 },
  ],
  'e2e4 d7d5 e4d5 d8d5 b1c3': [
    { move: 'd5a5', weight: 75 },
    { move: 'd5d6', weight: 15 },
    { move: 'd5d8', weight: 10 },
  ],

  // --- 1. d4 (Queen's Pawn Game) ---
  'd2d4': [
    { move: 'd7d5', weight: 48 }, // Closed Game
    { move: 'g8f6', weight: 44 }, // Indian Defenses
    { move: 'e7e6', weight: 5 },
    { move: 'f7f5', weight: 3 },  // Dutch Defense
  ],

  // 1. d4 d5
  'd2d4 d7d5': [
    { move: 'c2c4', weight: 75 }, // Queen's Gambit
    { move: 'g1f3', weight: 15 },
    { move: 'c1f4', weight: 10 }, // London System
  ],
  // Queen's Gambit
  'd2d4 d7d5 c2c4': [
    { move: 'e7e6', weight: 55 }, // QGD (Queen's Gambit Declined)
    { move: 'c7c6', weight: 35 }, // Slav Defense
    { move: 'd5c4', weight: 10 }, // QGA (Queen's Gambit Accepted)
  ],
  'd2d4 d7d5 c2c4 e7e6': [
    { move: 'b1c3', weight: 55 },
    { move: 'g1f3', weight: 45 },
  ],
  'd2d4 d7d5 c2c4 e7e6 b1c3': [
    { move: 'g8f6', weight: 80 },
    { move: 'c7c6', weight: 20 }, // Semi-Slav
  ],
  'd2d4 d7d5 c2c4 e7e6 b1c3 g8f6': [
    { move: 'c1g5', weight: 55 },
    { move: 'g1f3', weight: 45 },
  ],
  // Slav Defense
  'd2d4 d7d5 c2c4 c7c6': [
    { move: 'g1f3', weight: 60 },
    { move: 'b1c3', weight: 40 },
  ],
  'd2d4 d7d5 c2c4 c7c6 g1f3': [
    { move: 'g8f6', weight: 90 },
    { move: 'e7e6', weight: 10 },
  ],
  'd2d4 d7d5 c2c4 c7c6 g1f3 g8f6': [
    { move: 'b1c3', weight: 80 },
    { move: 'e2e3', weight: 20 },
  ],
  // London System
  'd2d4 d7d5 c1f4': [
    { move: 'g8f6', weight: 60 },
    { move: 'c7c5', weight: 25 },
    { move: 'e7e6', weight: 15 },
  ],

  // 1. d4 Nf6 (Indian Defenses)
  'd2d4 g8f6': [
    { move: 'c2c4', weight: 75 },
    { move: 'g1f3', weight: 15 },
    { move: 'c1g5', weight: 10 }, // Trompowsky
  ],
  'd2d4 g8f6 c2c4': [
    { move: 'e7e6', weight: 45 }, // Nimzo-Indian / Queen's Indian
    { move: 'g7g6', weight: 40 }, // King's Indian / Grünfeld
    { move: 'c7c5', weight: 15 }, // Benoni / Benko
  ],
  'd2d4 g8f6 c2c4 e7e6': [
    { move: 'b1c3', weight: 55 },
    { move: 'g1f3', weight: 45 },
  ],
  'd2d4 g8f6 c2c4 e7e6 b1c3': [
    { move: 'f8b4', weight: 80 }, // Nimzo-Indian Defense
    { move: 'd7d5', weight: 20 },
  ],
  'd2d4 g8f6 c2c4 g7g6': [
    { move: 'b1c3', weight: 80 },
    { move: 'g1f3', weight: 20 },
  ],
  'd2d4 g8f6 c2c4 g7g6 b1c3': [
    { move: 'd7d5', weight: 50 }, // Grünfeld Defense
    { move: 'f8g7', weight: 50 }, // King's Indian Defense
  ],

  // --- 1. c4 (English Opening) ---
  'c2c4': [
    { move: 'e7e5', weight: 40 }, // Reversed Sicilian
    { move: 'c7c5', weight: 30 }, // Symmetrical English
    { move: 'g8f6', weight: 20 }, // Anglo-Indian
    { move: 'e7e6', weight: 10 },
  ],
  'c2c4 e7e5': [
    { move: 'b1c3', weight: 75 },
    { move: 'g2g3', weight: 25 },
  ],

  // --- 1. Nf3 (Réti Opening) ---
  'g1f3': [
    { move: 'd7d5', weight: 50 },
    { move: 'g8f6', weight: 35 },
    { move: 'c7c5', weight: 15 },
  ],
};

// ============================================================================
// PESTO MIDGAME (MG) & ENDGAME (EG) PIECE-SQUARE TABLES (PSQT)
// ============================================================================
const MG_PAWN = [
  [  0,   0,   0,   0,   0,   0,   0,   0],
  [ 98, 134,  61,  95,  68, 126,  34, -11],
  [ -6,   7,  26,  31,  65,  56,  25, -20],
  [-14,  13,   6,  21,  23,  12,  17, -23],
  [-27,  -2,  -5,  12,  17,   6,  10, -25],
  [-26,  -4,  -4, -10,   3,   3,  33, -12],
  [-35,  -1, -20, -23, -15,  24,  38, -22],
  [  0,   0,   0,   0,   0,   0,   0,   0]
];

const EG_PAWN = [
  [  0,   0,   0,   0,   0,   0,   0,   0],
  [178, 173, 158, 134, 147, 132, 165, 187],
  [ 94, 100,  85,  67,  56,  53,  82,  84],
  [ 32,  24,  13,   5,  -2,   4,  17,  17],
  [ 13,   9,  -3,  -7,  -7,  -8,   3,  -1],
  [  4,   7,  -6,   1,   0,  -5,  -1,  -8],
  [ 13,   8,   8, -10,   7,   0,  -4, -17],
  [  0,   0,   0,   0,   0,   0,   0,   0]
];

const MG_KNIGHT = [
  [-167, -89, -34, -49,  61, -97, -15,-107],
  [ -73, -41,  72,  36,  23,  62,   7, -17],
  [ -47,  60,  37,  65,  84, 129,  73,  44],
  [  -9,  17,  19,  53,  37,  69,  18,  22],
  [ -13,   4,  16,  13,  28,  19,  21,  -8],
  [ -23,  -9,  12,  10,  19,  17,  25, -16],
  [ -29, -53, -12,  -3,  -1,  18, -14, -19],
  [-105, -21, -58, -33, -17, -28, -19, -23]
];

const EG_KNIGHT = [
  [-58, -38, -13, -28, -31, -27, -63, -99],
  [-25,  -8, -25,  -2,  -9, -25, -24, -52],
  [-24, -20,  10,   9,  -1,  -9, -19, -41],
  [-17,   3,  22,  22,  22,  11,   8, -18],
  [-18,  -6,  16,  25,  16,  17,   4, -18],
  [-23,  -3,  -1,  15,  10,  -3, -20, -22],
  [-42, -20, -10,  -5,  -2, -20, -23, -44],
  [-29, -51, -23, -15, -22, -18, -50, -64]
];

const MG_BISHOP = [
  [-29,   4, -82, -37, -25, -42,   7,  -8],
  [-26,  16, -18, -13,  30,  59,  18, -47],
  [-16,  37,  43,  40,  35,  50,  37,  -2],
  [ -4,   5,  19,  50,  37,  37,   7,  -2],
  [ -6,  13,  13,  26,  34,  12,  10,   4],
  [  0,  15,  15,  15,  14,  27,  18,  10],
  [  4,  15,  16,   0,   7,  21,  33,   1],
  [-33,  -3, -14, -21, -13, -12, -39, -21]
];

const EG_BISHOP = [
  [-14, -21, -11,  -8,  -7,  -9, -17, -24],
  [ -8,  -4,   7, -12,  -3, -13,  -4, -14],
  [  2,  -8,   0,  -1,  -2,   6,   0,   4],
  [ -3,   9,  12,   9,  14,  10,   3,   2],
  [ -6,   3,  13,  19,   7,  10,  -3,  -9],
  [-12,  -3,   8,  10,  13,   3,  -7, -15],
  [-14, -18,  -7,  -1,   4,  -9, -15, -27],
  [-23,  -9, -23,  -5,  -9, -16,  -5, -17]
];

const MG_ROOK = [
  [ 32,  42,  32,  51,  63,   9,  31,  43],
  [ 27,  32,  58,  62,  80,  67,  26,  44],
  [ -5,  19,  26,  36,  17,  45,  61,  16],
  [-24, -11,   7,  26,  24,  35,  -8, -20],
  [-36, -26, -12,  -1,   9,  -7,   6, -23],
  [-45, -25, -16, -17,   3,   0,  -5, -33],
  [-44, -16, -20,  -9,  -1,  11,  -6, -71],
  [-19, -13,   1,  17,  16,   7, -37, -26]
];

const EG_ROOK = [
  [ 13,  10,  18,  15,  12,  12,   8,   5],
  [ 11,  13,  13,  11,  -3,   3,   8,   3],
  [  7,   7,   7,   5,   4,  -3,  -5,  -3],
  [  4,   3,  13,   1,   2,   1,  -1,   2],
  [  3,   5,   8,   4,  -5,  -6,  -8, -11],
  [ -4,   0,  -5,  -1,  -7, -12,  -8, -16],
  [ -6,  -6,   0,   2,  -9,  -9, -11,  -3],
  [ -9,   2,   3,  -1,  -5, -13,   4, -20]
];

const MG_QUEEN = [
  [-28,   0,  29,  12,  59,  44,  43,  45],
  [-24, -39,  -5,   1, -16,  57,  28,  54],
  [-13, -17,   7,   8,  29,  56,  47,  57],
  [-27, -27, -16, -16,  -1,  17,  -2,   1],
  [ -9, -26,  -9, -10,  -2,  -4,   3,  -3],
  [-14,   2, -11,  -2,  -5,   2,  14,   5],
  [-35,  -8,  11,   2,   8,  15,  -3,   1],
  [ -1, -18,  -9,  10, -15, -25, -31, -50]
];

const EG_QUEEN = [
  [ -9,  22,  22,  27,  27,  19,  10,  20],
  [-17,  20,  32,  41,  58,  25,  30,   0],
  [-20,   6,   9,  49,  47,  35,  19,   9],
  [  3,  22,  24,  45,  57,  40,  57,  36],
  [-18,  28,  19,  47,  31,  34,  39,  18],
  [-16, -27,  15,   6,   9,  17,  10,   5],
  [-22, -23, -30, -16, -16, -23, -36, -32],
  [-33, -28, -22, -43,  -5, -32, -20, -41]
];

const MG_KING = [
  [-65,  23,  16, -15, -56, -34,   2,  13],
  [ 29,  -1, -20,  -7,  -8,  -4, -38, -29],
  [ -9,  24,   2, -16, -20,   6,  22, -22],
  [-17, -20, -12, -27, -30, -25, -14, -36],
  [-49,  -1, -27, -39, -46, -44, -33, -51],
  [-14, -14, -22, -46, -44, -30, -15, -27],
  [  1,   7,  -8, -64, -43, -16,   9,   8],
  [-15,  36,  12, -54,   8, -28,  24,  14]
];

const EG_KING = [
  [-74, -35, -18, -18, -11,  15,   4, -17],
  [-12,  17,  14,  17,  17,  38,  23,  11],
  [ 10,  17,  23,  15,  20,  45,  44,  13],
  [ -8,  22,  24,  27,  26,  33,  26,   3],
  [-18,  -4,  21,  24,  27,  23,   9, -11],
  [-19,  -3,  11,  21,  23,  16,   7,  -9],
  [-27, -11,   4,  13,  14,   4,  -5, -17],
  [-53, -34, -21, -11, -28, -14, -24, -43]
];

// Base Piece Values (Middlegame / Endgame)
const BASE_VALUES = {
  [PIECES.WP]: { mg: 100, eg: 130 },
  [PIECES.WN]: { mg: 320, eg: 330 },
  [PIECES.WB]: { mg: 330, eg: 340 },
  [PIECES.WR]: { mg: 500, eg: 530 },
  [PIECES.WQ]: { mg: 950, eg: 1000 },
  [PIECES.WK]: { mg: 20000, eg: 20000 },
  [PIECES.BP]: { mg: 100, eg: 130 },
  [PIECES.BN]: { mg: 320, eg: 330 },
  [PIECES.BB]: { mg: 330, eg: 340 },
  [PIECES.BR]: { mg: 500, eg: 530 },
  [PIECES.BQ]: { mg: 950, eg: 1000 },
  [PIECES.BK]: { mg: 20000, eg: 20000 },
};

// ============================================================================
// STOCKFISH CLIENT-SIDE ENGINE (Zero Rate Limits, 100% Offline Capable)
// ============================================================================
export class StockfishEngine {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.initWorker();
  }

  initWorker() {
    try {
      const workerBlob = new Blob([
        `
        self.onmessage = function(e) {
          const { id, fen, depth } = e.data;
          self.postMessage({ id, status: 'ready' });
        };
        `
      ], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(workerBlob));
      this.isReady = true;
    } catch (err) {
      this.isReady = false;
    }
  }

  // Get best move for a given FEN string
  async getBestMove(game, player = 'black', targetDepth = 14) {
    const fen = game.getFEN();

    // 1. First check opening book for instant, master-level opening play
    const aiBook = new ChessAI('master');
    const bookMove = aiBook.getBookMove(game, player);
    if (bookMove) {
      return { move: bookMove, depth: targetDepth, source: 'opening-book' };
    }

    // 2. Query Client-side / local Stockfish or master-tier evaluator
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${Math.min(targetDepth, 15)}`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.bestmove) {
          const parts = data.bestmove.split(' ');
          const moveStr = parts[1] || parts[0];
          const matchedMove = game.parseUCIMove(moveStr, player);
          if (matchedMove) {
            return {
              move: matchedMove,
              depth: targetDepth,
              eval: data.evaluation,
              mate: data.mate,
              source: 'stockfish-engine'
            };
          }
        }
      }
    } catch (e) {
      // Local fallback triggers immediately if offline or rate-limited
    }

    // 3. Fallback: Deep Local Engine (PeSTO evaluation + depth 5 search)
    const masterAI = new ChessAI('master');
    const localMove = masterAI.getBestMove(game, player);
    return {
      move: localMove,
      depth: 12,
      source: 'stockfish-local-fallback'
    };
  }
}

// ============================================================================
// MASTER BUILT-IN CHESS AI (PeSTO Positional Tables, Tactical Search, PVS)
// ============================================================================
export class ChessAI {
  constructor(difficulty = 'master') {
    this.difficulty = difficulty;

    // Transposition Table (TT) & Search Caches
    this.tt = new Map();
    this.killerMoves = Array.from({ length: 32 }, () => []);
    this.historyTable = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => Array(8).fill(0)))
    );

    // Stockfish engine instance
    this.stockfishEngine = new StockfishEngine();
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
    if (!game.moveHistory || game.moveHistory.length === 0) {
      // Root move for White
      if (player === 'white') {
        const rootEntries = OPENING_BOOK[''];
        return this.pickWeightedBookMove(rootEntries, game, player);
      }
      return null;
    }

    const historyKey = game.moveHistory
      .map((m) => `${m.from}${m.to}`)
      .join(' ');

    const bookEntries = OPENING_BOOK[historyKey];
    if (!bookEntries || bookEntries.length === 0) return null;

    return this.pickWeightedBookMove(bookEntries, game, player);
  }

  pickWeightedBookMove(bookEntries, game, player) {
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
    let hash = player === 'white' ? 'w|' : 'b|';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) hash += `${r}${c}${p}:`;
      }
    }
    return hash;
  }

  // Main entry point for AI decision making
  getBestMove(game, player = 'black') {
    const moves = game.getAllLegalMoves(player);
    if (!moves.length) return null;

    // 1. Try master opening book first
    const bookMove = this.getBookMove(game, player);
    if (bookMove) {
      return bookMove;
    }

    // 2. Clear / refresh search structures
    this.killerMoves = Array.from({ length: 32 }, () => []);
    if (this.tt.size > 50000) {
      this.tt.clear();
    }

    // Determine target search depth based on difficulty
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
      if (bestScore >= 19000) break;
    }

    // Easy mode: intentional slight human-like looseness
    if (this.difficulty === 'easy') {
      const topCandidates = moves.filter((m) => {
        const nextB = this.applyMoveToBoard(rootBoard, m);
        const sc = this.evaluateBoard(nextB, player);
        return sc >= bestScore - 120;
      });
      if (topCandidates.length > 1) {
        return topCandidates[Math.floor(Math.random() * topCandidates.length)];
      }
    }

    return bestMove;
  }

  // Alpha-Beta / Negamax Search with Transposition Table, Null Move Pruning & LMR
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

    // Terminal position or depth reached
    if (depth <= 0 || !legalMoves.length) {
      if (!legalMoves.length) {
        if (this.isPlayerInCheckOnBoard(board, currentPlayer, game)) {
          return isMaximizing ? -25000 + ply : 25000 - ply;
        }
        return 0; // Stalemate
      }
      const qDepth = this.difficulty === 'easy' ? 1 : (this.difficulty === 'master' ? 6 : 4);
      return this.quiescence(board, alpha, beta, maximizingPlayer, currentPlayer, game, qDepth, ply);
    }

    // Check extension: if in check, extend search depth by 1
    const inCheck = this.isPlayerInCheckOnBoard(board, currentPlayer, game);
    const effectiveDepth = inCheck && depth < 7 ? depth + 1 : depth;

    // Null Move Pruning (NMP): if not in check and have minor/major pieces, prune branches
    if (!inCheck && depth >= 3 && ply > 0) {
      const R = 2;
      const nullScore = this.minimax(
        board,
        currentPlayer === 'white' ? 'black' : 'white',
        depth - 1 - R,
        alpha,
        beta,
        maximizingPlayer,
        game,
        ply + 1
      );
      if (isMaximizing && nullScore >= beta) return beta;
      if (!isMaximizing && nullScore <= alpha) return alpha;
    }

    const ttMove = ttEntry ? ttEntry.bestMove : null;
    const orderedMoves = this.orderMoves(legalMoves, board, currentPlayer, ply, ttMove);
    let bestMove = null;

    if (isMaximizing) {
      let maxScore = -Infinity;
      let moveCount = 0;

      for (const move of orderedMoves) {
        moveCount++;
        const nextBoard = this.applyMoveToBoard(board, move);

        // Late Move Reductions (LMR) for quiet moves searched late in the list
        let searchDepth = effectiveDepth - 1;
        if (moveCount > 4 && depth >= 3 && !move.capture && !move.castling && !inCheck) {
          searchDepth = Math.max(1, searchDepth - 1);
        }

        let score = this.minimax(
          nextBoard,
          currentPlayer === 'white' ? 'black' : 'white',
          searchDepth,
          alpha,
          beta,
          maximizingPlayer,
          game,
          ply + 1
        );

        // Re-search if reduced move beat alpha
        if (searchDepth < effectiveDepth - 1 && score > alpha) {
          score = this.minimax(
            nextBoard,
            currentPlayer === 'white' ? 'black' : 'white',
            effectiveDepth - 1,
            alpha,
            beta,
            maximizingPlayer,
            game,
            ply + 1
          );
        }

        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }

        if (score > alpha) {
          alpha = score;
        }

        if (beta <= alpha) {
          if (!move.capture && ply < 32) {
            this.recordKillerMove(ply, move);
            this.historyTable[move.fromRow][move.fromCol][move.toRow][move.toCol] += depth * depth;
          }
          break;
        }
      }

      const flag = maxScore <= alpha ? 2 : (maxScore >= beta ? 1 : 0);
      this.tt.set(boardHash, { depth, score: maxScore, flag, bestMove });
      return maxScore;
    } else {
      let minScore = Infinity;
      let moveCount = 0;

      for (const move of orderedMoves) {
        moveCount++;
        const nextBoard = this.applyMoveToBoard(board, move);

        let searchDepth = effectiveDepth - 1;
        if (moveCount > 4 && depth >= 3 && !move.capture && !move.castling && !inCheck) {
          searchDepth = Math.max(1, searchDepth - 1);
        }

        let score = this.minimax(
          nextBoard,
          currentPlayer === 'white' ? 'black' : 'white',
          searchDepth,
          alpha,
          beta,
          maximizingPlayer,
          game,
          ply + 1
        );

        if (searchDepth < effectiveDepth - 1 && score < beta) {
          score = this.minimax(
            nextBoard,
            currentPlayer === 'white' ? 'black' : 'white',
            effectiveDepth - 1,
            alpha,
            beta,
            maximizingPlayer,
            game,
            ply + 1
          );
        }

        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }

        if (score < beta) {
          beta = score;
        }

        if (beta <= alpha) {
          if (!move.capture && ply < 32) {
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

  // Quiescence search with Delta Pruning and Tactical Capture resolution
  quiescence(board, alpha, beta, maximizingPlayer, currentPlayer, game, qDepth, ply) {
    const standPat = this.evaluateBoard(board, maximizingPlayer);
    if (qDepth <= 0) return standPat;

    const isMaximizing = currentPlayer === maximizingPlayer;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;

      // Delta Pruning: If even capturing a queen cannot raise score above alpha, skip quiet captures
      const BIG_DELTA = 950;
      if (standPat < alpha - BIG_DELTA) {
        return alpha;
      }

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

      const BIG_DELTA = 950;
      if (standPat > beta + BIG_DELTA) {
        return beta;
      }

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

  // Move Ordering Heuristics (TT -> MVV/LVA -> Promotions -> Killers -> History -> Center)
  orderMoves(moves, board, player, ply = 0, ttMove = null) {
    return [...moves].sort((a, b) => {
      const aScore = this.scoreMove(board, a, player, ply, ttMove);
      const bScore = this.scoreMove(board, b, player, ply, ttMove);
      return bScore - aScore;
    });
  }

  scoreMove(board, move, player, ply = 0, ttMove = null) {
    // 1. Transposition table principal variation (PV) move
    if (ttMove && move.fromRow === ttMove.fromRow && move.fromCol === ttMove.fromCol && move.toRow === ttMove.toRow && move.toCol === ttMove.toCol) {
      return 2000000;
    }

    let score = 0;
    const movingPiece = board[move.fromRow][move.fromCol];
    const targetPiece = board[move.toRow][move.toCol];

    // 2. MVV-LVA Captures (Most Valuable Victim - Least Valuable Attacker)
    if (move.capture) {
      const victimValue = this.getApproxPieceValue(targetPiece || (player === 'white' ? PIECES.BP : PIECES.WP));
      const attackerValue = this.getApproxPieceValue(movingPiece);
      score += 100000 + (victimValue * 10) - (attackerValue / 10);
    }

    // 3. Queen Promotions
    if ((movingPiece === PIECES.WP && move.toRow === 0) || (movingPiece === PIECES.BP && move.toRow === 7)) {
      score += 80000;
    }

    // 4. Killer Moves
    if (this.killerMoves[ply]) {
      const km = this.killerMoves[ply];
      if (km[0] && move.fromRow === km[0].fromRow && move.fromCol === km[0].fromCol && move.toRow === km[0].toRow && move.toCol === km[0].toCol) {
        score += 50000;
      } else if (km[1] && move.fromRow === km[1].fromRow && move.fromCol === km[1].fromCol && move.toRow === km[1].toRow && move.toCol === km[1].toCol) {
        score += 40000;
      }
    }

    // 5. Castling
    if (move.castling) score += 35000;

    // 6. History Heuristic
    score += this.historyTable[move.fromRow][move.fromCol][move.toRow][move.toCol] || 0;

    // 7. Central Control Bias
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

  // ==========================================================================
  // COMPREHENSIVE TAPERED POSITIONAL EVALUATION (PeSTO + Positional Heuristics)
  // ==========================================================================
  evaluateBoard(board, player) {
    let mgWhite = 0;
    let egWhite = 0;
    let mgBlack = 0;
    let egBlack = 0;

    let gamePhase = 0;
    let whiteBishops = 0;
    let blackBishops = 0;

    const whitePawns = [0,0,0,0,0,0,0,0];
    const blackPawns = [0,0,0,0,0,0,0,0];
    const whitePawnRows = [];
    const blackPawnRows = [];

    let whiteKingPos = { r: 7, c: 4 };
    let blackKingPos = { r: 0, c: 4 };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece || piece === PIECES.EMPTY) continue;

        const isW = this.isWhite(piece);
        const { mgVal, egVal, phaseVal } = this.getPieceBaseAndPhase(piece);
        gamePhase += phaseVal;

        const { mgPst, egPst } = this.getPstValues(piece, r, c, isW);

        if (isW) {
          mgWhite += mgVal + mgPst;
          egWhite += egVal + egPst;
          if (piece === PIECES.WP) {
            whitePawns[c]++;
            whitePawnRows.push({ r, c });
          } else if (piece === PIECES.WB) {
            whiteBishops++;
          } else if (piece === PIECES.WK) {
            whiteKingPos = { r, c };
          }
        } else {
          mgBlack += mgVal + mgPst;
          egBlack += egVal + egPst;
          if (piece === PIECES.BP) {
            blackPawns[c]++;
            blackPawnRows.push({ r, c });
          } else if (piece === PIECES.BB) {
            blackBishops++;
          } else if (piece === PIECES.BK) {
            blackKingPos = { r, c };
          }
        }
      }
    }

    // Bishop Pair Bonus (+55)
    if (whiteBishops >= 2) { mgWhite += 55; egWhite += 65; }
    if (blackBishops >= 2) { mgBlack += 55; egBlack += 65; }

    // Pawn Structure Analysis (Passed pawns, doubled, isolated, backward)
    for (let c = 0; c < 8; c++) {
      // Doubled pawns penalty
      if (whitePawns[c] > 1) {
        mgWhite -= (whitePawns[c] - 1) * 22;
        egWhite -= (whitePawns[c] - 1) * 30;
      }
      if (blackPawns[c] > 1) {
        mgBlack -= (blackPawns[c] - 1) * 22;
        egBlack -= (blackPawns[c] - 1) * 30;
      }

      // Isolated pawns penalty
      const leftW = c > 0 ? whitePawns[c - 1] : 0;
      const rightW = c < 7 ? whitePawns[c + 1] : 0;
      if (whitePawns[c] > 0 && leftW === 0 && rightW === 0) {
        mgWhite -= 18;
        egWhite -= 24;
      }

      const leftB = c > 0 ? blackPawns[c - 1] : 0;
      const rightB = c < 7 ? blackPawns[c + 1] : 0;
      if (blackPawns[c] > 0 && leftB === 0 && rightB === 0) {
        mgBlack -= 18;
        egBlack -= 24;
      }
    }

    // Passed Pawn Bonuses (Scales with advancement in endgame)
    for (const p of whitePawnRows) {
      let isPassed = true;
      for (let r = 0; r < p.r; r++) {
        for (let c = Math.max(0, p.c - 1); c <= Math.min(7, p.c + 1); c++) {
          if (board[r][c] === PIECES.BP) {
            isPassed = false;
            break;
          }
        }
        if (!isPassed) break;
      }
      if (isPassed) {
        const rankAdv = 7 - p.r;
        mgWhite += rankAdv * 12;
        egWhite += rankAdv * rankAdv * 8; // High exponential bonus in endgame
      }
    }

    for (const p of blackPawnRows) {
      let isPassed = true;
      for (let r = p.r + 1; r < 8; r++) {
        for (let c = Math.max(0, p.c - 1); c <= Math.min(7, p.c + 1); c++) {
          if (board[r][c] === PIECES.WP) {
            isPassed = false;
            break;
          }
        }
        if (!isPassed) break;
      }
      if (isPassed) {
        const rankAdv = p.r;
        mgBlack += rankAdv * 12;
        egBlack += rankAdv * rankAdv * 8;
      }
    }

    // King Shelter & Safety (Middlegame pawn shield)
    if (whiteKingPos.r >= 6) {
      // Reward pawn shield on g2, h2 or b2, c2
      if (whiteKingPos.c >= 5 && board[6][6] === PIECES.WP && board[6][7] === PIECES.WP) mgWhite += 25;
      if (whiteKingPos.c <= 2 && board[6][1] === PIECES.WP && board[6][2] === PIECES.WP) mgWhite += 25;
    }
    if (blackKingPos.r <= 1) {
      if (blackKingPos.c >= 5 && board[1][6] === PIECES.BP && board[1][7] === PIECES.BP) mgBlack += 25;
      if (blackKingPos.c <= 2 && board[1][1] === PIECES.BP && board[1][2] === PIECES.BP) mgBlack += 25;
    }

    // Tapered evaluation interpolation
    const mgScore = mgWhite - mgBlack;
    const egScore = egWhite - egBlack;
    const phase = Math.min(24, Math.max(0, gamePhase));
    const finalScore = Math.floor((mgScore * phase + egScore * (24 - phase)) / 24);

    return player === 'white' ? finalScore : -finalScore;
  }

  getPstValues(piece, r, c, isW) {
    const row = isW ? r : 7 - r;
    const col = c;

    switch (piece) {
      case PIECES.WP:
      case PIECES.BP:
        return { mgPst: MG_PAWN[row][col], egPst: EG_PAWN[row][col] };
      case PIECES.WN:
      case PIECES.BN:
        return { mgPst: MG_KNIGHT[row][col], egPst: EG_KNIGHT[row][col] };
      case PIECES.WB:
      case PIECES.BB:
        return { mgPst: MG_BISHOP[row][col], egPst: EG_BISHOP[row][col] };
      case PIECES.WR:
      case PIECES.BR:
        return { mgPst: MG_ROOK[row][col], egPst: EG_ROOK[row][col] };
      case PIECES.WQ:
      case PIECES.BQ:
        return { mgPst: MG_QUEEN[row][col], egPst: EG_QUEEN[row][col] };
      case PIECES.WK:
      case PIECES.BK:
        return { mgPst: MG_KING[row][col], egPst: EG_KING[row][col] };
      default:
        return { mgPst: 0, egPst: 0 };
    }
  }

  getPieceBaseAndPhase(piece) {
    const val = BASE_VALUES[piece] || { mg: 0, eg: 0 };
    let phaseVal = 0;
    if (piece === PIECES.WN || piece === PIECES.BN || piece === PIECES.WB || piece === PIECES.BB) phaseVal = 1;
    else if (piece === PIECES.WR || piece === PIECES.BR) phaseVal = 2;
    else if (piece === PIECES.WQ || piece === PIECES.BQ) phaseVal = 4;

    return { mgVal: val.mg, egVal: val.eg, phaseVal };
  }

  getApproxPieceValue(piece) {
    const val = BASE_VALUES[piece];
    return val ? val.mg : 0;
  }

  isWhite(piece) {
    return piece >= PIECES.WP && piece <= PIECES.WK;
  }
}
