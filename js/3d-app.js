import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ChessGame, PIECES } from './game.js';
import { ChessAI } from './ai.js';

// --- 3D setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0d14);
const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.set(0, 7.15, 9.0);
camera.lookAt(0, 0.62, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  container.clientWidth,
  container.clientHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 0.95;

container.appendChild(
  renderer.domElement
);

// ============================================================
// CAMERA CONTROLS
// ============================================================

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.45;
controls.autoRotate = false;

controls.target.set(
  0,
  0.62,
  0
);

controls.maxPolarAngle =
  Math.PI / 2.2;

controls.minDistance = 4;
controls.maxDistance = 16;

// ============================================================
// LIGHTING
// ============================================================

const ambient =
  new THREE.AmbientLight(
    0x687085,
    1.15
  );

scene.add(ambient);

const keyLight =
  new THREE.DirectionalLight(
    0xffeedd,
    1.10
  );

keyLight.position.set(
  5,
  12,
  8
);

keyLight.castShadow = true;

keyLight.shadow.mapSize.width =
  1024;

keyLight.shadow.mapSize.height =
  1024;

scene.add(keyLight);

const fillLight =
  new THREE.DirectionalLight(
    0x99bbff,
    0.65
  );

fillLight.position.set(
  -5,
  8,
  -7
);

scene.add(fillLight);

const backLight =
  new THREE.DirectionalLight(
    0xffeedd,
    0.50
  );

backLight.position.set(
  0,
  6,
  -10
);

scene.add(backLight);

const ambient2 =
  new THREE.HemisphereLight(
    0x445566,
    0x221122,
    0.55
  );

scene.add(ambient2);

// ============================================================
// BOARD
// ============================================================

const boardGroup =
  new THREE.Group();

scene.add(boardGroup);

const squareSize = 0.95;
const gap = 0.02;
const boardRadius = 4.0;

// ============================================================
// BOARD MATERIALS
// ============================================================

const lightMat =
  new THREE.MeshStandardMaterial({
    color: 0xe6d1b2, // Light cream/maple
    roughness: 0.25,  // Polished semi-gloss
    metalness: 0.05
  });

// Dark Squares: Rich Walnut/Mahogany Wood Tone
const darkMat =
  new THREE.MeshStandardMaterial({
    color: 0x5a311b, // Deep warm brown
    roughness: 0.30,  // Slightly more texture than light squares
    metalness: 0.05
  });
// ============================================================
// BOARD BASE
// ============================================================

const baseGeo =
new THREE.BoxGeometry(
  9.6,
  0.35,
  9.6
);

const baseMat =
new THREE.MeshStandardMaterial({
  color: 0x24130d,       // dark wooden underside
  roughness: 0.78,
  metalness: 0.02
});

const baseMesh =
new THREE.Mesh(
  baseGeo,
  baseMat
);

baseMesh.position.y =
-0.25;

baseMesh.receiveShadow = true;

boardGroup.add(
  baseMesh
);

// ============================================================
// DARK TRIM
// ============================================================

const goldBevelGeo =
new THREE.BoxGeometry(
  9.25,
  0.04,
  9.25
);

const goldBevelMat =
new THREE.MeshStandardMaterial({
  color: 0x3a3428,       // muted bronze/gray
  roughness: 0.58,
  metalness: 0.12
});

const goldBevel =
new THREE.Mesh(
  goldBevelGeo,
  goldBevelMat
);

goldBevel.position.y =
-0.06;

boardGroup.add(
  goldBevel
);

// ============================================================
// GRAVEYARD TRAYS
// ============================================================

const trayGeo =
new THREE.BoxGeometry(
  1.4,
  0.15,
  7.8
);

const trayMat =
new THREE.MeshStandardMaterial({
  color: 0x2b1810,       // dark walnut
  roughness: 0.76,
  metalness: 0.02
});

const leftTray =
new THREE.Mesh(
  trayGeo,
  trayMat
);

leftTray.position.set(
  -5.35,
  -0.15,
  0
);

leftTray.receiveShadow = true;

const rightTray =
new THREE.Mesh(
  trayGeo,
  trayMat
);

rightTray.position.set(
  5.35,
  -0.15,
  0
);

rightTray.receiveShadow = true;

boardGroup.add(
  leftTray,
  rightTray
);

// ============================================================
// SUBTLE UNDER GLOW
// ============================================================

const underGlow =
new THREE.PointLight(
  0xc47a3a,
  0.12,
  9
);

underGlow.position.set(
  0,
  -0.5,
  0
);

boardGroup.add(
  underGlow
);
// ============================================================
// BOARD SQUARE STORAGE
// ============================================================

const squares = [];

// ============================================================
// CREATE BOARD SQUARES
// ============================================================

for (
  let r = 0;
  r < 8;
  r++
) {

  squares[r] = [];

  for (
    let c = 0;
    c < 8;
    c++
  ) {

    const isLight =
      (r + c) % 2 === 0;

    const mat =
      (
        isLight
          ? lightMat
          : darkMat
      ).clone();

    const geo =
      new THREE.BoxGeometry(
        squareSize,
        0.12,
        squareSize
      );

    const mesh =
      new THREE.Mesh(
        geo,
        mat
      );

    const x =
      c - 3.5;

    const z =
      r - 3.5;

    mesh.position.set(
      x,
      0,
      z
    );

    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData = { row: r, col: c };

    boardGroup.add(
      mesh
    );

    squares[r][c] = {
      mesh,
      row: r,
      col: c,
      pieceType: PIECES.EMPTY,
      group: null
    };
  }
}

// ============================================================
// BOARD BORDER
// ============================================================

const borderGeo =
  new THREE.BoxGeometry(
    9.0,
    0.05,
    9.0
  );

const borderMat =
  new THREE.MeshStandardMaterial({
    color: 0xf4c95d,
    emissive: 0xf4c95d,
    emissiveIntensity: 0.08,
    transparent: true,
    opacity: 0.15
  });

const border =
  new THREE.Mesh(
    borderGeo,
    borderMat
  );

border.position.y =
  0.07;

boardGroup.add(
  border
);

// ============================================================
// GLTF CHESS PIECES
// ============================================================
//
// Actual supplied models:
//
// https://github.com/Sushant-Coder-01/chess3d/tree/main/public/models
// The loader below uses the repository's exact scene.gltf assets.
//
// The game logic continues to own the chess state.
// This section only loads and prepares the visual pieces.
// ============================================================

const pieceModelLoader =
  new GLTFLoader();

// Models are sourced from the public GitHub repository supplied for this game.
// GLTFLoader will resolve each model's scene.bin and texture files relative to
// the scene.gltf URL, so the complete original asset structure remains intact.
const MODEL_BASE_URL =
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models';

const pieceModelCache = {};

let pieceModelsReady = false;

let pieceModelsLoading =
  null;

const MODEL_NAMES = {
  pawn: 'pawn',
  knight: 'knight',
  bishop: 'bishop',
  rook: 'rook',
  queen: 'queen',
  king: 'king'
};

// ============================================================
// MODEL CONFIGURATION
// ============================================================
//
// These values normalize the imported models to the existing
// board. They do NOT modify the actual geometry/proportions.
//
// The knight orientation follows the supplied knight loader.
// ============================================================

const PIECE_MODEL_CONFIG = {

  pawn: {
    targetHeight: 0.64,

    rotation:
      new THREE.Euler(
        0,
        0,
        0
      )
  },

  knight: {
    targetHeight: 0.91,

    rotation:
      new THREE.Euler(
        -Math.PI / 2,
        0,
        -Math.PI / 2
      )
  },

  bishop: {
    targetHeight: 0.92,

    rotation:
      new THREE.Euler(
        0,
        0,
        0
      )
  },

  rook: {
    targetHeight: 0.82,

    rotation:
      new THREE.Euler(
        -Math.PI / 2,
        0,
        0
      )
  },

  queen: {
    targetHeight: 1.02,

    rotation:
      new THREE.Euler(
        0,
        0,
        0
      )
  },

  king: {
    targetHeight: 1.10,

    rotation:
      new THREE.Euler(
        0,
        0,
        0
      )
  }
};

// ============================================================
// PIECE TYPE -> MODEL
// ============================================================

function getPieceModelName(
  type
) {

  if (
    type === PIECES.WP ||
    type === PIECES.BP
  ) {

    return MODEL_NAMES.pawn;
  }

  if (
    type === PIECES.WN ||
    type === PIECES.BN
  ) {

    return MODEL_NAMES.knight;
  }

  if (
    type === PIECES.WB ||
    type === PIECES.BB
  ) {

    return MODEL_NAMES.bishop;
  }

  if (
    type === PIECES.WR ||
    type === PIECES.BR
  ) {

    return MODEL_NAMES.rook;
  }

  if (
    type === PIECES.WQ ||
    type === PIECES.BQ
  ) {

    return MODEL_NAMES.queen;
  }

  if (
    type === PIECES.WK ||
    type === PIECES.BK
  ) {

    return MODEL_NAMES.king;
  }

  return null;
}

// ============================================================
// WHITE / BLACK
// ============================================================

function isWhitePiece(
  type
) {

  return (
    type >= PIECES.WP &&
    type <= PIECES.WK
  );
}

// ============================================================
// PREPARE MODEL
// ============================================================

function preparePieceModel(
  sourceModel,
  modelName
) {

  const config =
    PIECE_MODEL_CONFIG[
      modelName
    ];

  const model =
    sourceModel.clone(true);

  // ----------------------------------------------------------
  // Orientation from supplied models
  // ----------------------------------------------------------

  model.rotation.copy(
    config.rotation
  );

  model.updateMatrixWorld(
    true
  );

  // ----------------------------------------------------------
  // Normalize height
  // ----------------------------------------------------------

  const initialBox =
    new THREE.Box3()
      .setFromObject(
        model
      );

  const initialSize =
    initialBox.getSize(
      new THREE.Vector3()
    );

  const initialHeight =
    Math.max(
      initialSize.y,
      0.0001
    );

  model.scale.multiplyScalar(
    config.targetHeight /
      initialHeight
  );

  model.updateMatrixWorld(
    true
  );

  // ----------------------------------------------------------
  // Center X/Z and place base on board
  // ----------------------------------------------------------

  const box =
    new THREE.Box3()
      .setFromObject(
        model
      );

  const center =
    box.getCenter(
      new THREE.Vector3()
    );

  model.position.x -=
    center.x;

  model.position.z -=
    center.z;

  model.position.y -=
    box.min.y;

  model.updateMatrixWorld(
    true
  );

  // ----------------------------------------------------------
  // Material adjustments
  // ----------------------------------------------------------

  model.traverse(
    (child) => {

      if (!child.isMesh) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      const sourceMaterials =
        Array.isArray(
          child.material
        )
          ? child.material
          : [child.material];

      const materials =
        sourceMaterials.map(
          (sourceMaterial) => {

            const material =
              sourceMaterial?.clone
                ? sourceMaterial.clone()
                : new THREE.MeshStandardMaterial();

            // Keep imported textures.
            // Only reduce excessive reflection.

            if (
              'roughness'
              in material
            ) {

              material.roughness =
                0.42;
            }

            if (
              'metalness'
              in material
            ) {

              material.metalness =
                0.06;
            }

            return material;
          }
        );

      child.material =
        materials.length === 1
          ? materials[0]
          : materials;
    }
  );

  return model;
}

// ============================================================
// LOAD ONE MODEL
// ============================================================

function loadPieceModel(
  modelName
) {

  if (
    pieceModelCache[
      modelName
    ]
  ) {

    return Promise.resolve(
      pieceModelCache[
        modelName
      ]
    );
  }

  return new Promise(
    (resolve, reject) => {

      pieceModelLoader.load(

        `${MODEL_BASE_URL}/${modelName}/scene.gltf`,

        (gltf) => {

          try {

            const prepared =
              preparePieceModel(
                gltf.scene,
                modelName
              );

            pieceModelCache[
              modelName
            ] = prepared;

            resolve(
              prepared
            );

          } catch (error) {

            console.error(
              `Failed preparing ${modelName} model:`,
              error
            );

            reject(
              error
            );
          }
        },

        undefined,

        (error) => {

          console.error(
            `Failed loading ${modelName} model:`,
            error
          );

          reject(
            error
          );
        }
      );
    }
  );
}

// ============================================================
// PRELOAD ALL MODELS
// ============================================================

function preloadPieceModels() {

  if (
    pieceModelsLoading
  ) {

    return pieceModelsLoading;
  }

  pieceModelsLoading =
    Promise.all(
      Object.values(
        MODEL_NAMES
      ).map(
        loadPieceModel
      )
    )

      .then(() => {

        pieceModelsReady =
          true;

        return true;
      })

      .catch(
        (error) => {

          pieceModelsReady =
            true;

          console.warn(
            'GLTF piece models offline/loading error, using procedural 3D models:',
            error
          );

          return true;
        }
      );

  return pieceModelsLoading;
}

function createProceduralPieceMesh(type) {
  const group = new THREE.Group();
  const isWhite = isWhitePiece(type);
  const mat = new THREE.MeshStandardMaterial({
    color: isWhite ? 0xf4efe3 : 0x1a1d28,
    roughness: isWhite ? 0.35 : 0.45,
    metalness: 0.1
  });

  const baseGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.15, 16);
  const baseMesh = new THREE.Mesh(baseGeo, mat);
  baseMesh.position.y = 0.075;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  let pieceType = type;
  if (pieceType >= PIECES.BP) pieceType -= 6;

  if (pieceType === PIECES.WP) {
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.4, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.35;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, mat);
    headMesh.position.y = 0.65;
    headMesh.castShadow = true;
    group.add(headMesh);
  } else if (pieceType === PIECES.WN) {
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.35;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const headGeo = new THREE.BoxGeometry(0.25, 0.4, 0.35);
    const headMesh = new THREE.Mesh(headGeo, mat);
    headMesh.position.set(0, 0.65, 0.05);
    headMesh.rotation.x = 0.2;
    headMesh.castShadow = true;
    group.add(headMesh);
  } else if (pieceType === PIECES.WB) {
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.3, 0.5, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.4;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
    headGeo.scale(0.8, 1.2, 0.8);
    const headMesh = new THREE.Mesh(headGeo, mat);
    headMesh.position.y = 0.75;
    headMesh.castShadow = true;
    group.add(headMesh);
  } else if (pieceType === PIECES.WR) {
    const bodyGeo = new THREE.CylinderGeometry(0.26, 0.32, 0.55, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.425;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const topGeo = new THREE.CylinderGeometry(0.3, 0.28, 0.2, 8);
    const topMesh = new THREE.Mesh(topGeo, mat);
    topMesh.position.y = 0.75;
    topMesh.castShadow = true;
    group.add(topMesh);
  } else if (pieceType === PIECES.WQ) {
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.34, 0.65, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.475;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const crownGeo = new THREE.ConeGeometry(0.28, 0.3, 16);
    const crownMesh = new THREE.Mesh(crownGeo, mat);
    crownMesh.position.y = 0.9;
    crownMesh.castShadow = true;
    group.add(crownMesh);

    const ballGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const ballMesh = new THREE.Mesh(ballGeo, mat);
    ballMesh.position.y = 1.08;
    ballMesh.castShadow = true;
    group.add(ballMesh);
  } else if (pieceType === PIECES.WK) {
    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.36, 0.7, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mat);
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const crownGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.25, 16);
    const crownMesh = new THREE.Mesh(crownGeo, mat);
    crownMesh.position.y = 0.925;
    crownMesh.castShadow = true;
    group.add(crownMesh);

    const crossV = new THREE.BoxGeometry(0.06, 0.2, 0.06);
    const crossVMesh = new THREE.Mesh(crossV, mat);
    crossVMesh.position.y = 1.125;
    crossVMesh.castShadow = true;
    group.add(crossVMesh);
  }

  return group;
}

// ============================================================
// CREATE PIECE INSTANCE
// ============================================================

function createPieceMesh(
  type
) {

  const modelName =
    getPieceModelName(
      type
    );

  const group =
    new THREE.Group();

  if (
    !modelName ||
    !pieceModelCache[
      modelName
    ]
  ) {

    return group;
  }

  const piece =
    pieceModelCache[
      modelName
    ].clone(true);

  const isWhite =
    isWhitePiece(
      type
    );

  piece.traverse(
    (child) => {

      if (!child.isMesh) {
        return;
      }

      const sourceMaterials =
        Array.isArray(
          child.material
        )
          ? child.material
          : [child.material];

      const materials =
        sourceMaterials.map(
          (sourceMaterial) => {

            const material =
              sourceMaterial?.clone
                ? sourceMaterial.clone()
                : new THREE.MeshStandardMaterial();

            if (
              material.color
            ) {

              material.color.set(
                isWhite
                  ? 0xf4efe3
                  : 0x2c3240
              );
            }

            material.map = null;

            if (material.emissive) {
              material.emissive.set(0x000000);
            }

            if ('emissiveIntensity' in material) {
              material.emissiveIntensity = 0;
            }

            if (
              'roughness'
              in material
            ) {

              material.roughness =
                isWhite ? 0.45 : 0.35;
            }

            if (
              'metalness'
              in material
            ) {

              material.metalness =
                0.02;
            }

            if (
              'envMapIntensity'
              in material
            ) {

              material.envMapIntensity =
                0.55;
            }

            return material;
          }
        );

      child.material =
        materials.length === 1
          ? materials[0]
          : materials;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  );

  group.add(
    piece
  );

  if (
    modelName === MODEL_NAMES.knight &&
    !isWhite
  ) {
    group.rotation.y = Math.PI;
  }

  group.position.y =
    0.12;

  return group;
}

// ============================================================
// GAME STATE
// ============================================================

const game =
  new ChessGame();

const ai =
  new ChessAI(
    'easy'
  );

let mode =
  'ai-easy';

let aiThinking =
  false;

let animating =
  false;

let moveQueue =
  [];

// ============================================================
// CAMERA ROTATION
// ============================================================

let cameraAnimating =
  false;

let cameraStartTheta =
  0;

let cameraDeltaTheta =
  0;

let cameraRadius =
  8.5;

let cameraY =
  7;

let cameraAnimStartTime =
  0;

const CAMERA_ANIM_DURATION =
  1200;

function getShortestAngleDelta(
  start,
  end
) {

  let delta =
    (
      end - start
    ) %
    (2 * Math.PI);

  if (
    delta > Math.PI
  ) {

    delta -=
      2 * Math.PI;
  }

  if (
    delta < -Math.PI
  ) {

    delta +=
      2 * Math.PI;
  }

  return delta;
}

function updateCameraPerspective() {

  const isWhiteTurn =
    game.currentPlayer ===
    'white';

  const isAiMode =
    mode.startsWith(
      'ai'
    );

  const targetTheta =
    (
      isAiMode ||
      isWhiteTurn
    )
      ? 0
      : Math.PI;

  const curX =
    camera.position.x;

  const curZ =
    camera.position.z;

  const curTheta =
    Math.atan2(
      curX,
      curZ
    );

  const deltaTheta =
    getShortestAngleDelta(
      curTheta,
      targetTheta
    );

  if (
    Math.abs(
      deltaTheta
    ) > 0.08
  ) {

    cameraStartTheta =
      curTheta;

    cameraDeltaTheta =
      deltaTheta;

    cameraRadius =
      Math.hypot(
        curX,
        curZ
      ) || 8.5;

    cameraY =
      camera.position.y ||
      7;

    cameraAnimStartTime =
      performance.now();

    cameraAnimating =
      true;
  }
}

// ============================================================
// DOM REFERENCES
// ============================================================

const turnPill =
  document.getElementById(
    'turnPill'
  );

const activeLabel =
  document.getElementById(
    'activePlayerLabel'
  );

const moveCount =
  document.getElementById(
    'moveCount'
  );

const moveLog =
  document.getElementById(
    'moveLog'
  );

const statusText =
  document.getElementById(
    'statusText'
  );

const newGameBtn =
  document.getElementById(
    'newGameBtn'
  );

const undoBtn =
  document.getElementById(
    'undoBtn'
  );

const claimDrawBtn =
  document.getElementById(
    'mobileClaimDrawBtn'
  );

const offerDrawBtn =
  document.getElementById(
    'mobileOfferDrawBtn'
  );

// Mobile bottom bar button references
const mobileNewGameBtn =
  document.getElementById(
    'mobileNewGameBtn'
  );

const mobileUndoBtn =
  document.getElementById(
    'mobileUndoBtn'
  );

const modeSelect =
  document.getElementById(
    'modeSelect'
  );

const whiteCapturesEl =
  document.getElementById(
    'whiteCaptures'
  );

const blackCapturesEl =
  document.getElementById(
    'blackCaptures'
  );

const whiteLeadEl =
  document.getElementById(
    'whiteLead'
  );

const blackLeadEl =
  document.getElementById(
    'blackLead'
  );

const promotionModal =
  document.getElementById(
    'promotionModal'
  );

const promotionOptions =
  document.getElementById(
    'promotionOptions'
  );

const sideStatusText =
  document.getElementById(
    'sideStatusText'
  );

const gameResultModal =
  document.getElementById(
    'gameResultModal'
  );

const gameResultIcon =
  document.getElementById(
    'gameResultIcon'
  );

const gameResultKicker =
  document.getElementById(
    'gameResultKicker'
  );

const gameResultTitle =
  document.getElementById(
    'gameResultTitle'
  );

const gameResultMessage =
  document.getElementById(
    'gameResultMessage'
  );

const resultNewGameBtn =
  document.getElementById(
    'resultNewGameBtn'
  );

const resultCloseBtn =
  document.getElementById(
    'resultCloseBtn'
  );

let lastShownGameResult = null;

function hideGameResultModal() {
  if (gameResultModal) {
    gameResultModal.style.display = 'none';
  }
}

function showGameResultModal() {
  if (!gameResultModal || !game.gameOver) return;

  const resultKey = `${game.gameResult}:${game.winner || 'draw'}:${game.history.length}`;
  if (lastShownGameResult === resultKey) return;
  lastShownGameResult = resultKey;

  const gameResultCard = document.getElementById('gameResultCard');
  const isCheckmate = game.gameResult === 'checkmate';
  const winnerName = game.winner === 'white' ? 'White' : 'Black';
  const humanWon = mode.startsWith('ai') && game.winner === 'white';
  const humanLost = mode.startsWith('ai') && game.winner === 'black';

  // Remove old result classes
  if (gameResultCard) {
    gameResultCard.classList.remove('result-win', 'result-lose', 'result-draw');
  }

  // Helper to set SVG icon
  function setResultIcon(iconId) {
    gameResultIcon.innerHTML = `<span class="icon icon-xl"><svg><use href="#${iconId}"/></svg></span>`;
  }

  if (isCheckmate) {
    setResultIcon(humanWon ? 'ico-trophy' : humanLost ? 'ico-skull' : 'ico-chess-piece');
    gameResultKicker.textContent = 'CHECKMATE';
    gameResultTitle.textContent = mode.startsWith('ai')
      ? (humanWon ? 'You Win!' : 'You Lose')
      : `${winnerName} Wins`;
    gameResultMessage.textContent = `${winnerName} delivered checkmate.`;

    if (gameResultCard) {
      if (humanWon || (!mode.startsWith('ai') && game.winner)) {
        gameResultCard.classList.add('result-win');
      } else if (humanLost) {
        gameResultCard.classList.add('result-lose');
      }
    }

    // Confetti on win
    if (humanWon || !mode.startsWith('ai')) {
      if (typeof window.spawnConfetti === 'function') {
        window.spawnConfetti();
      }
    }
  } else {
    const drawMessages = {
      stalemate: 'No legal moves remain.',
      'fivefold-repetition': 'The position repeated five times.',
      'seventy-five-move-rule': 'The 75-move rule ended the game.',
      'insufficient-material': 'There is not enough material to checkmate.',
      'dead-position': 'The position cannot produce a checkmate.',
      'threefold-repetition': 'Threefold repetition was claimed.',
      'fifty-move-rule': 'The 50-move rule was claimed.',
      agreement: 'Both players agreed to a draw.'
    };
    setResultIcon('ico-balance');
    gameResultKicker.textContent = 'GAME DRAWN';
    gameResultTitle.textContent = 'Draw';
    gameResultMessage.textContent = drawMessages[game.gameResult] || 'The game ended in a draw.';
    if (gameResultCard) gameResultCard.classList.add('result-draw');
  }

  gameResultModal.style.display = 'flex';
}

// ============================================================
// MOVE MARKERS
// ============================================================

const markersGroup =
  new THREE.Group();

boardGroup.add(
  markersGroup
);

function clearMoveMarkers3D() {

  while (
    markersGroup.children.length >
    0
  ) {

    const child =
      markersGroup.children[0];

    markersGroup.remove(
      child
    );

    child.geometry?.dispose();
    child.material?.dispose();
  }
}

// ============================================================
// GRAVEYARD
// ============================================================

const graveyardGroup =
  new THREE.Group();

boardGroup.add(
  graveyardGroup
);

function clearGraveyard3D() {

  while (
    graveyardGroup.children.length >
    0
  ) {

    const child =
      graveyardGroup.children[0];

    graveyardGroup.remove(
      child
    );
  }
}

// ============================================================
// CAPTURED STATS
// ============================================================

function renderCapturedStats() {

  const {
    capturedByWhite,
    capturedByBlack,
    whiteScore,
    blackScore,
    lead
  } =
    game.getCapturedPieces();

  // ----------------------------------------------------------
  // White captures
  // ----------------------------------------------------------

  if (
    capturedByWhite.length ===
    0
  ) {

    whiteCapturesEl.innerHTML =
      '<span style="color:#7886b7;font-size:11px;">No captures yet</span>';

  } else {

    const counts = {};

    capturedByWhite.forEach(
      (item) => {

        counts[item.symbol] =
          (
            counts[item.symbol] ||
            0
          ) + 1;
      }
    );

    whiteCapturesEl.innerHTML =
      Object.entries(
        counts
      )
        .map(
          ([sym, count]) => {

            return `
              <span class="captured-chip">
                ${sym}
                ${
                  count > 1
                    ? `<span style="font-weight:700;color:#ffd36e;">x${count}</span>`
                    : ''
                }
              </span>
            `;
          }
        )
        .join('');
  }

  // ----------------------------------------------------------
  // Black captures
  // ----------------------------------------------------------

  if (
    capturedByBlack.length ===
    0
  ) {

    blackCapturesEl.innerHTML =
      '<span style="color:#7886b7;font-size:11px;">No captures yet</span>';

  } else {

    const counts = {};

    capturedByBlack.forEach(
      (item) => {

        counts[item.symbol] =
          (
            counts[item.symbol] ||
            0
          ) + 1;
      }
    );

    blackCapturesEl.innerHTML =
      Object.entries(
        counts
      )
        .map(
          ([sym, count]) => {

            return `
              <span class="captured-chip">
                ${sym}
                ${
                  count > 1
                    ? `<span style="font-weight:700;color:#ffd36e;">x${count}</span>`
                    : ''
                }
              </span>
            `;
          }
        )
        .join('');
  }

  // ----------------------------------------------------------
  // Material lead
  // ----------------------------------------------------------

  if (
    lead > 0
  ) {

    whiteLeadEl.style.display =
      'inline-block';

    whiteLeadEl.textContent =
      `+${lead}`;

    blackLeadEl.style.display =
      'none';

  } else if (
    lead < 0
  ) {

    blackLeadEl.style.display =
      'inline-block';

    blackLeadEl.textContent =
      `+${Math.abs(lead)}`;

    whiteLeadEl.style.display =
      'none';

  } else {

    whiteLeadEl.style.display =
      'none';

    blackLeadEl.style.display =
      'none';
  }

  // ----------------------------------------------------------
  // Material balance
  // ----------------------------------------------------------

  const materialFillWhite =
    document.getElementById(
      'materialFillWhite'
    );

  const materialFillBlack =
    document.getElementById(
      'materialFillBlack'
    );

  if (
    materialFillWhite &&
    materialFillBlack
  ) {

    const totalCapturedValue =
      whiteScore +
      blackScore;

    if (
      totalCapturedValue ===
      0
    ) {

      materialFillWhite.style.width =
        '50%';

      materialFillBlack.style.width =
        '50%';

    } else {

      const whitePct =
        Math.round(
          (
            whiteScore /
            totalCapturedValue
          ) * 100
        );

      const blackPct =
        100 -
        whitePct;

      materialFillWhite.style.width =
        `${whitePct}%`;

      materialFillBlack.style.width =
        `${blackPct}%`;
    }
  }

  // ----------------------------------------------------------
  // 3D graveyard
  // ----------------------------------------------------------

  clearGraveyard3D();

  // Captured black pieces.
  capturedByWhite.forEach(
    (item, idx) => {

      const mesh =
        createPieceMesh(
          item.piece
        );

      mesh.scale.set(
        0.32,
        0.32,
        0.32
      );

      const row =
        Math.floor(
          idx / 2
        );

      const col =
        idx % 2;

      const x =
        5.0 +
        col * 0.7;

      const z =
        3.0 -
        row * 0.85;

      mesh.position.set(
        x,
        0.05,
        z
      );

      graveyardGroup.add(
        mesh
      );
    }
  );

  // Captured white pieces.
  capturedByBlack.forEach(
    (item, idx) => {

      const mesh =
        createPieceMesh(
          item.piece
        );

      mesh.scale.set(
        0.32,
        0.32,
        0.32
      );

      const row =
        Math.floor(
          idx / 2
        );

      const col =
        idx % 2;

      const x =
        -5.0 -
        col * 0.7;

      const z =
        -3.0 +
        row * 0.85;

      mesh.position.set(
        x,
        0.05,
        z
      );

      graveyardGroup.add(
        mesh
      );
    }
  );
}

// ============================================================
// BOARD POSITION
// ============================================================

function getPos(
  row,
  col
) {

  return {
    x: col - 3.5,
    z: row - 3.5
  };
}

// ============================================================
// CLEAR PIECES
// ============================================================

function clearPieces() {

  for (
    let r = 0;
    r < 8;
    r++
  ) {

    for (
      let c = 0;
      c < 8;
      c++
    ) {

      if (
        squares[r][c].group
      ) {

        boardGroup.remove(
          squares[r][c].group
        );

        squares[r][c].group =
          null;
      }

      squares[r][c].pieceType =
        PIECES.EMPTY;
    }
  }
}

// ============================================================
// SYNC BOARD
// ============================================================

function syncBoard() {

  if (
    !pieceModelsReady
  ) {

    return;
  }

  clearPieces();

  for (
    let r = 0;
    r < 8;
    r++
  ) {

    for (
      let c = 0;
      c < 8;
      c++
    ) {

      const piece =
        game.board[r][c];

      if (
        piece !==
        PIECES.EMPTY
      ) {

        const group =
          createPieceMesh(
            piece
          );

        const pos =
          getPos(
            r,
            c
          );

        group.position.set(
          pos.x,
          0.12,
          pos.z
        );

        boardGroup.add(
          group
        );

        squares[r][c].group =
          group;

        squares[r][c].pieceType =
          piece;
      }
    }
  }
}

// ============================================================
// MOVE ANIMATION
// ============================================================

function animateMove(
  move,
  callback
) {

  if (!move) {

    callback();
    return;
  }

  const fromGroup =
    squares[
      move.fromRow
    ][
      move.fromCol
    ].group;

  const toPos =
    getPos(
      move.toRow,
      move.toCol
    );

  if (
    !fromGroup
  ) {

    const piece =
      game.board[
        move.toRow
      ][
        move.toCol
      ];

    if (
      piece !==
      PIECES.EMPTY
    ) {

      const newGroup =
        createPieceMesh(
          piece
        );

      newGroup.position.set(
        toPos.x,
        0.12,
        toPos.z
      );

      boardGroup.add(
        newGroup
      );

      squares[
        move.toRow
      ][
        move.toCol
      ].group =
        newGroup;

      squares[
        move.toRow
      ][
        move.toCol
      ].pieceType =
        piece;
    }

    callback();
    return;
  }

  const startPos = fromGroup.position.clone();
  const startRotY = fromGroup.rotation.y;
  const endPos = new THREE.Vector3(toPos.x, 0.12, toPos.z);
  const duration = 400;
  const startTime = performance.now();
  animating = true;

  const capturedGroup = squares[move.toRow][move.toCol].group;
  const capturedRow = move.toRow;
  const capturedCol = move.toCol;

  function step(time) {
    const t = Math.min((time - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    fromGroup.position.lerpVectors(startPos, endPos, ease);
    fromGroup.position.y = 0.12 + Math.sin(ease * Math.PI) * 0.35;
    fromGroup.rotation.y = startRotY;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      fromGroup.position.copy(endPos);
      fromGroup.position.y = 0.12;
      fromGroup.rotation.y = startRotY;

      // Remove captured piece.
      if (
        capturedGroup &&
        capturedGroup !==
          fromGroup
      ) {

        boardGroup.remove(
          capturedGroup
        );

        squares[
          capturedRow
        ][
          capturedCol
        ].group =
          null;

        squares[
          capturedRow
        ][
          capturedCol
        ].pieceType =
          PIECES.EMPTY;
      }

      // Update references.
      squares[
        move.fromRow
      ][
        move.fromCol
      ].group =
        null;

      squares[
        move.fromRow
      ][
        move.fromCol
      ].pieceType =
        PIECES.EMPTY;

      squares[
        move.toRow
      ][
        move.toCol
      ].group =
        fromGroup;

      squares[
        move.toRow
      ][
        move.toCol
      ].pieceType =
        game.board[
          move.toRow
        ][
          move.toCol
        ];

      animating =
        false;

      callback();
    }
  }

  requestAnimationFrame(
    step
  );
}

// ============================================================
// MAIN RENDER
// ============================================================

function render(
  afterMove = null
) {

  if (is2DView) {
    render2DBoard();
  }

  moveCount.textContent =
    game.history.length;

  const isWhite =
    game.currentPlayer ===
    'white';

  const player =
    isWhite
      ? 'White'
      : 'Black';

  // ----------------------------------------------------------
  // Turn pill
  // ----------------------------------------------------------

  const turnPillText =
    document.getElementById(
      'turnPillText'
    );

  if (
    turnPillText
  ) {

    turnPillText.textContent =
      `${player} to move`;
  }

  if (
    activeLabel
  ) {

    activeLabel.textContent =
      `${player} Turn`;
  }

  // ----------------------------------------------------------
  // Active player cards
  // ----------------------------------------------------------

  const whiteCard =
    document.getElementById(
      'whitePlayerCard'
    );

  const blackCard =
    document.getElementById(
      'blackPlayerCard'
    );

  if (
    whiteCard &&
    blackCard
  ) {

    if (
      isWhite
    ) {

      whiteCard.classList.add(
        'active-turn'
      );

      blackCard.classList.remove(
        'active-turn'
      );

    } else {

      blackCard.classList.add(
        'active-turn'
      );

      whiteCard.classList.remove(
        'active-turn'
      );
    }
  }

  // ----------------------------------------------------------
  // Undo
  // ----------------------------------------------------------

  undoBtn.disabled =
    !game.history.length ||
    animating ||
    aiThinking;

  if (mobileUndoBtn) {
    mobileUndoBtn.disabled = undoBtn.disabled;
  }

  // ----------------------------------------------------------
  // Captured stats
  // ----------------------------------------------------------

  renderCapturedStats();

  // ----------------------------------------------------------
  // Move log
  // ----------------------------------------------------------

  moveLog.innerHTML =
    '';

  const logEntries =
    game.moveHistory.slice(
      -8
    );

  if (
    logEntries.length ===
    0
  ) {

    moveLog.innerHTML =
      '<div>Game started.</div>';

  } else {

    const startIdx =
      game.moveHistory.length -
      logEntries.length;

    logEntries.forEach(
      (entry, i) => {

        const div =
          document.createElement(
            'div'
          );

        const num =
          startIdx +
          i +
          1;

        const sep =
          entry.capture
            ? 'x'
            : '→';

        let text =
          `#${num} ${entry.piece}${entry.from}${sep}${entry.to}`;

        if (
          entry.castling ===
          'king-side'
        ) {

          text =
            `#${num} O-O`;
        }

        if (
          entry.castling ===
          'queen-side'
        ) {

          text =
            `#${num} O-O-O`;
        }

        if (
          entry.promotion
        ) {

          text +=
            `=${entry.promotion}`;
        }

        div.textContent =
          text;

        moveLog.appendChild(
          div
        );
      }
    );
  }

  // ----------------------------------------------------------
  // Draw claim
  // ----------------------------------------------------------

  const claimReasons =
    game.getDrawClaimReasons();

  if (
    claimDrawBtn
  ) {

    claimDrawBtn.disabled =
      game.gameOver ||
      claimReasons.length ===
        0 ||
      animating ||
      aiThinking;

    // Update text label only (the icon is preserved via innerHTML)
    const balanceIcon = '<span class="icon"><svg><use href="#ico-balance"/></svg></span>';
    if (
      claimReasons.includes(
        'threefold-repetition'
      ) &&
      claimReasons.includes(
        'fifty-move-rule'
      )
    ) {

      claimDrawBtn.innerHTML =
        balanceIcon + '<span>Claim</span>';

    } else if (
      claimReasons.includes(
        'threefold-repetition'
      )
    ) {

      claimDrawBtn.innerHTML =
        balanceIcon + '<span>3-Fold</span>';

    } else if (
      claimReasons.includes(
        'fifty-move-rule'
      )
    ) {

      claimDrawBtn.innerHTML =
        balanceIcon + '<span>50-Move</span>';

    } else {

      claimDrawBtn.innerHTML =
        balanceIcon + '<span>Draw</span>';
    }
  }

  // ----------------------------------------------------------
  // Draw offer
  // ----------------------------------------------------------

  if (
    offerDrawBtn
  ) {

    const pending =
      game.drawOffer &&
      game.drawOffer !==
        game.currentPlayer;

    offerDrawBtn.disabled =
      game.gameOver ||
      mode !== 'pvp' ||
      animating ||
      aiThinking;

    const handshakeIcon = '<span class="icon"><svg><use href="#ico-handshake"/></svg></span>';
    offerDrawBtn.innerHTML =
      pending
        ? handshakeIcon + '<span>Accept</span>'
        : handshakeIcon + '<span>Offer</span>';
  }

  // ----------------------------------------------------------
  // Game status
  // ----------------------------------------------------------

  if (
    game.gameOver
  ) {

    const drawMessages = {

      stalemate:
        'Stalemate — draw.',

      'fivefold-repetition':
        'Fivefold repetition — automatic draw.',

      'seventy-five-move-rule':
        '75-move rule — automatic draw.',

      'insufficient-material':
        'Insufficient material — automatic draw.',

      'dead-position':
        'Dead position — automatic draw.',

      'threefold-repetition':
        'Threefold repetition — draw claimed.',

      'fifty-move-rule':
        '50-move rule — draw claimed.',

      agreement:
        'Draw agreed by both players.'
    };

    if (
      game.gameResult ===
      'checkmate'
    ) {

      statusText.textContent =
        `Checkmate! ${
          game.winner === 'white'
            ? 'White'
            : 'Black'
        } wins!`;

    } else {

      statusText.textContent =
        drawMessages[
          game.gameResult
        ] ||
        'Game drawn.';
    }

  } else if (
    game.drawOffer
  ) {

    const offeringPlayer =
      game.drawOffer ===
      'white'
        ? 'White'
        : 'Black';

    const acceptingPlayer =
      game.currentPlayer ===
      'white'
        ? 'White'
        : 'Black';

    statusText.textContent =
      `${offeringPlayer} offered a draw. ${acceptingPlayer} can accept it.`;

  } else if (
    game.gameResult ===
    'check'
  ) {

    statusText.textContent =
      `${player} is in check!`;

  } else {

    statusText.textContent =
      `${player} to move. Select a piece.`;
  }

  if (sideStatusText) {
    sideStatusText.textContent = statusText.textContent;
  }

  if (game.gameOver) {
    showGameResultModal();
  }

  // ==========================================================
  // 3D BOARD SYNC
  // ==========================================================

  if (
    !animating &&
    pieceModelsReady
  ) {

    syncBoard();

    clearMoveMarkers3D();

    // --------------------------------------------------------
    // Reset square highlights
    // --------------------------------------------------------

    for (
      let r = 0;
      r < 8;
      r++
    ) {

      for (
        let c = 0;
        c < 8;
        c++
      ) {

        squares[r][c]
          .mesh
          .material
          .emissive
          .set(
            0x000000
          );

        squares[r][c]
          .mesh
          .material
          .emissiveIntensity =
          0;
      }
    }

    // --------------------------------------------------------
    // Last move
    // --------------------------------------------------------

    if (
      game.lastMove
    ) {

      const from =
        game.lastMove.from;

      const to =
        game.lastMove.to;

      if (
        from &&
        to
      ) {

        const fromCol =
          from.charCodeAt(0) -
          97;

        const fromRow =
          8 -
          parseInt(
            from[1]
          );

        const toCol =
          to.charCodeAt(0) -
          97;

        const toRow =
          8 -
          parseInt(
            to[1]
          );

        if (
          fromRow >= 0 &&
          fromRow < 8 &&
          fromCol >= 0 &&
          fromCol < 8
        ) {

          squares[
            fromRow
          ][
            fromCol
          ]
            .mesh
            .material
            .emissive
            .set(
              0x44ff99
            );

          squares[
            fromRow
          ][
            fromCol
          ]
            .mesh
            .material
            .emissiveIntensity =
            0.25;
        }

        if (
          toRow >= 0 &&
          toRow < 8 &&
          toCol >= 0 &&
          toCol < 8
        ) {

          squares[
            toRow
          ][
            toCol
          ]
            .mesh
            .material
            .emissive
            .set(
              0x44ff99
            );

          squares[
            toRow
          ][
            toCol
          ]
            .mesh
            .material
            .emissiveIntensity =
            0.3;
        }
      }
    }

    // --------------------------------------------------------
    // Selected piece
    // --------------------------------------------------------

    if (
      game.selected
    ) {

      const {
        row,
        col
      } =
        game.selected;

      squares[
        row
      ][
        col
      ]
        .mesh
        .material
        .emissive
        .set(
          0xffc857
        );

      squares[
        row
      ][
        col
      ]
        .mesh
        .material
        .emissiveIntensity =
        0.8;

      const pieceMoves =
        game.validMoves.filter(
          (m) =>
            m.fromRow ===
              row &&
            m.fromCol ===
              col
        );

      for (
        const mv of pieceMoves
      ) {

        const sqMat =
          squares[
            mv.toRow
          ][
            mv.toCol
          ]
            .mesh
            .material;

        const targetX =
          mv.toCol -
          3.5;

        const targetZ =
          mv.toRow -
          3.5;

        // ----------------------------------------------------
        // SPECIAL MOVES
        // ----------------------------------------------------

        if (
          mv.castling ||
          mv.enPassant
        ) {

          sqMat.emissive.set(
            0xffcc00
          );

          sqMat.emissiveIntensity =
            0.6;

          const ringGeo =
            new THREE.TorusGeometry(
              0.24,
              0.035,
              12,
              24
            );

          const ringMat =
            new THREE.MeshBasicMaterial({
              color: 0xffcc00
            });

          const ring =
            new THREE.Mesh(
              ringGeo,
              ringMat
            );

          ring.rotation.x =
            Math.PI / 2;

          ring.position.set(
            targetX,
            0.08,
            targetZ
          );

          ring.userData = { row: mv.toRow, col: mv.toCol };
          markersGroup.add(
            ring
          );

        // ----------------------------------------------------
        // CAPTURE
        // ----------------------------------------------------

        } else if (
          mv.capture
        ) {

          sqMat.emissive.set(
            0xff2244
          );

          sqMat.emissiveIntensity =
            0.6;

          const ringGeo =
            new THREE.TorusGeometry(
              0.26,
              0.04,
              12,
              24
            );

          const ringMat =
            new THREE.MeshBasicMaterial({
              color: 0xff2244
            });

          const ring =
            new THREE.Mesh(
              ringGeo,
              ringMat
            );

          ring.rotation.x =
            Math.PI / 2;

          ring.position.set(
            targetX,
            0.08,
            targetZ
          );

          ring.userData = { row: mv.toRow, col: mv.toCol };
          markersGroup.add(
            ring
          );

        // ----------------------------------------------------
        // NORMAL MOVE
        // ----------------------------------------------------

        } else {

          sqMat.emissive.set(
            0x00ff66
          );

          sqMat.emissiveIntensity =
            0.5;

          const discGeo =
            new THREE.CylinderGeometry(
              0.16,
              0.16,
              0.02,
              24
            );

          const discMat =
            new THREE.MeshBasicMaterial({
              color: 0x00ff66
            });

          const disc =
            new THREE.Mesh(
              discGeo,
              discMat
            );

          disc.position.set(
            targetX,
            0.08,
            targetZ
          );

          disc.userData = { row: mv.toRow, col: mv.toCol };
          markersGroup.add(
            disc
          );
        }
      }
    }

    // --------------------------------------------------------
    // KING IN CHECK
    // --------------------------------------------------------

    if (
      game.gameResult ===
      'check'
    ) {

      const kingPiece =
        game.currentPlayer ===
        'white'
          ? PIECES.WK
          : PIECES.BK;

      for (
        let r = 0;
        r < 8;
        r++
      ) {

        for (
          let c = 0;
          c < 8;
          c++
        ) {

          if (
            game.board[r][c] ===
            kingPiece
          ) {

            squares[
              r
            ][
              c
            ]
              .mesh
              .material
              .emissive
              .set(
                0xff0000
              );

            squares[
              r
            ][
              c
            ]
              .mesh
              .material
              .emissiveIntensity =
              0.7;
          }
        }
      }
    }
  }

  // ==========================================================
  // AI TRIGGER
  // ==========================================================

  if (
    pieceModelsReady &&
    !animating &&
    !game.gameOver &&
    mode.startsWith('ai') &&
    game.currentPlayer ===
      'black' &&
    !aiThinking
  ) {

    triggerAI();
  }

  // ==========================================================
  // CAMERA
  // ==========================================================

  updateCameraPerspective();
}

// ============================================================
// AI
// ============================================================

function animate2DMove(move, callback) {
  const boardEl = document.getElementById('board2d');
  if (!boardEl) {
    callback();
    return;
  }
  const fromSqIndex = move.fromRow * 8 + move.fromCol;
  const sqs = boardEl.querySelectorAll('.sq2d');
  const fromSq = sqs[fromSqIndex];
  if (!fromSq) {
    callback();
    return;
  }
  const pieceEl = fromSq.querySelector('.piece2d');
  if (!pieceEl) {
    callback();
    return;
  }

  const sqWidth = fromSq.clientWidth || 50;
  const sqHeight = fromSq.clientHeight || 50;
  const deltaX = (move.toCol - move.fromCol) * sqWidth;
  const deltaY = (move.toRow - move.fromRow) * sqHeight;

  animating = true;
  pieceEl.style.transition = 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)';
  pieceEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  setTimeout(() => {
    animating = false;
    callback();
  }, 470);
}

function triggerAI() {

  if (
    aiThinking ||
    animating ||
    game.gameOver ||
    !pieceModelsReady
  ) {

    return;
  }

  aiThinking =
    true;

  statusText.textContent =
    'Computer thinking...';

  const delay =
    mode === 'ai-hard'
      ? 600
      : 450;

  setTimeout(
    () => {

      if (
        game.gameOver ||
        game.currentPlayer !==
          'black'
      ) {

        aiThinking =
          false;

        render();

        return;
      }

      const move = ai.getBestMove(game, 'black');

      if (!move) {
        aiThinking = false;
        render();
        return;
      }

      // Highlight the intended move origin & destination squares first
      game.lastMove = move;
      render();

      // Pause 300ms so player clearly sees the pre-move highlight
      setTimeout(() => {
        if (is2DView) {
          animate2DMove(move, () => {
            game.makeMove(move);
            aiThinking = false;
            render();
          });
        } else {
          const fromGroup = squares[move.fromRow][move.fromCol].group;

          if (!fromGroup) {
            game.makeMove(move);
            aiThinking = false;
            render();
            return;
          }

          animateMove(move, () => {
            game.makeMove(move);
            aiThinking = false;
            render();
          });
        }
      }, 300);

    },
    delay
  );
}

// ============================================================
// NEW GAME
// ============================================================

newGameBtn.addEventListener(
  'click',
  () => {

    if (
      animating
    ) {

      return;
    }

    game.reset();

    aiThinking =
      false;

    lastShownGameResult = null;
    hideGameResultModal();

    render();
  }
);

function handleUndo() {
  if (animating || aiThinking) return;

  if (mode !== 'pvp') {
    // In vs Computer mode, undo 2 plies if both player and AI have moved
    if (game.history.length >= 2) {
      game.undo();
      game.undo();
    } else if (game.history.length === 1) {
      game.undo();
    }
  } else {
    // In 2-Player (PvP) mode, undo 1 ply
    game.undo();
  }

  aiThinking = false;
  lastShownGameResult = null;
  hideGameResultModal();
  render();
}

undoBtn.addEventListener('click', handleUndo);

// ============================================================
// CLAIM DRAW
// ============================================================

claimDrawBtn?.addEventListener(
  'click',
  () => {

    if (
      animating ||
      aiThinking ||
      game.gameOver
    ) {

      return;
    }

    const reasons =
      game.getDrawClaimReasons();

    if (
      !reasons.length
    ) {

      return;
    }

    game.claimDraw(
      reasons[0]
    );

    render();
  }
);

// ============================================================
// OFFER DRAW
// ============================================================

offerDrawBtn?.addEventListener(
  'click',
  () => {

    if (
      animating ||
      aiThinking ||
      game.gameOver ||
      mode !== 'pvp'
    ) {

      return;
    }

    game.offerDraw();

    render();
  }
);

// ============================================================
// MODE SELECT
// ============================================================

modeSelect.addEventListener(
  'change',
  (e) => {

    mode =
      e.target.value;

    ai.setDifficulty(
      mode === 'ai-hard'
        ? 'hard'
        : 'easy'
    );

    game.reset();

    aiThinking =
      false;

    lastShownGameResult = null;
    hideGameResultModal();

    render();
  }
);

resultCloseBtn?.addEventListener('click', () => {
  hideGameResultModal();
});

resultNewGameBtn?.addEventListener('click', () => {
  if (animating) return;
  game.reset();
  aiThinking = false;
  lastShownGameResult = null;
  hideGameResultModal();
  render();
});

// ============================================================
// MOBILE BOTTOM BAR BUTTONS
// ============================================================

mobileNewGameBtn?.addEventListener('click', () => {
  if (animating) return;
  game.reset();
  aiThinking = false;
  lastShownGameResult = null;
  hideGameResultModal();
  render();
});

mobileUndoBtn?.addEventListener('click', handleUndo);

// ============================================================
// CAMERA 2D/3D VIEW TOGGLE
// ============================================================

// ============================================================
// 2D FLAT CHESSBOARD RENDERER & PIECE VECTOR SET
// ============================================================

const CBURNETT_SVGS = {
  [PIECES.WP]: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  [PIECES.WN]: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  [PIECES.WB]: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  [PIECES.WR]: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  [PIECES.WQ]: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  [PIECES.WK]: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',

  [PIECES.BP]: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  [PIECES.BN]: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  [PIECES.BB]: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  [PIECES.BR]: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  [PIECES.BQ]: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  [PIECES.BK]: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
};

let is2DView = false;
const viewToggleBtn = document.getElementById('viewToggleBtn');
const viewToggleIcon = document.getElementById('viewToggleIcon');
const mobileViewToggleBtn = document.getElementById('mobileViewToggleBtn');
const mobileViewToggleIcon = document.getElementById('mobileViewToggleIcon');

function render2DBoard() {
  const boardEl = document.getElementById('board2d');
  if (!boardEl) return;
  boardEl.innerHTML = '';

  let lastMoveFrom = null;
  let lastMoveTo = null;
  if (game.lastMove && game.lastMove.from && game.lastMove.to) {
    const fCol = game.lastMove.from.charCodeAt(0) - 97;
    const fRow = 8 - parseInt(game.lastMove.from[1]);
    const tCol = game.lastMove.to.charCodeAt(0) - 97;
    const tRow = 8 - parseInt(game.lastMove.to[1]);
    lastMoveFrom = `${fRow},${fCol}`;
    lastMoveTo = `${tRow},${tCol}`;
  }

  const validMap = new Map();
  if (game.selected) {
    const moves = game.validMoves.filter(m => m.fromRow === game.selected.row && m.fromCol === game.selected.col);
    moves.forEach(m => validMap.set(`${m.toRow},${m.toCol}`, m));
  }

  let checkSquare = null;
  if (game.gameResult === 'check') {
    const kingPiece = game.currentPlayer === 'white' ? PIECES.WK : PIECES.BK;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (game.board[r][c] === kingPiece) {
          checkSquare = `${r},${c}`;
          break;
        }
      }
    }
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      const key = `${r},${c}`;
      
      sq.className = `sq2d ${isLight ? 'light' : 'dark'}`;

      if (game.selected && game.selected.row === r && game.selected.col === c) {
        sq.classList.add('selected');
      } else if (key === lastMoveFrom || key === lastMoveTo) {
        sq.classList.add('last-move');
      } else if (key === checkSquare) {
        sq.classList.add('check');
      }

      const piece = game.board[r][c];
      if (piece && CBURNETT_SVGS[piece]) {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece2d';
        pieceEl.innerHTML = `<img src="${CBURNETT_SVGS[piece]}" alt="piece" style="width:100%;height:100%;pointer-events:none;" />`;
        sq.appendChild(pieceEl);
      }

      if (validMap.has(key)) {
        const move = validMap.get(key);
        if (move.capture || move.enPassant) {
          const ring = document.createElement('div');
          ring.className = 'ring2d';
          sq.appendChild(ring);
        } else {
          const dot = document.createElement('div');
          dot.className = 'dot2d';
          sq.appendChild(dot);
        }
      }

      sq.addEventListener('click', () => {
        if (animating || aiThinking) return;
        game.selectSquare(r, c);
        render();
      });

      boardEl.appendChild(sq);
    }
  }
}

function toggle2D3DView() {
  if (animating) return;
  is2DView = !is2DView;

  const boardWrap2d = document.getElementById('board2d-wrap');
  const canvasContainer = document.getElementById('canvas-container');
  const updateIcons = (iconId) => {
    if (viewToggleIcon) viewToggleIcon.setAttribute('href', iconId);
    if (mobileViewToggleIcon) mobileViewToggleIcon.setAttribute('href', iconId);
  };

  if (is2DView) {
    if (boardWrap2d) boardWrap2d.style.display = 'flex';
    if (canvasContainer) {
      canvasContainer.style.opacity = '0';
      canvasContainer.style.pointerEvents = 'none';
    }
    updateIcons('#ico-eye');
    render2DBoard();
  } else {
    if (boardWrap2d) boardWrap2d.style.display = 'none';
    if (canvasContainer) {
      canvasContainer.style.opacity = '1';
      canvasContainer.style.pointerEvents = 'auto';
    }
    updateIcons('#ico-grid');
    render();
  }
}

viewToggleBtn?.addEventListener('click', toggle2D3DView);
mobileViewToggleBtn?.addEventListener('click', toggle2D3DView);

// ============================================================
// BOARD RAYCASTER
// ============================================================

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

let pointerDownTime = 0;
const pointerDownPos = new THREE.Vector2();

renderer.domElement.addEventListener(
  'pointerdown',
  (event) => {
    pointerDownTime = Date.now();
    pointerDownPos.set(event.clientX, event.clientY);
  }
);

renderer.domElement.addEventListener(
  'pointerup',
  (event) => {
    const elapsed = Date.now() - pointerDownTime;
    const distance = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));

    if (elapsed > 300 || distance > 6) {
      return;
    }

    if (
      animating ||
      aiThinking ||
      !pieceModelsReady
    ) {

      return;
    }

    if (
      mode.startsWith('ai') &&
      game.currentPlayer ===
        'black'
    ) {

      return;
    }

    const rect =
      renderer.domElement
        .getBoundingClientRect();

    pointer.x =
      (
        (
          event.clientX -
          rect.left
        ) /
        rect.width
      ) *
      2 -
      1;

    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) *
      2 +
      1;

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const targetObjects = [...boardGroup.children, ...markersGroup.children];
    const intersects = raycaster.intersectObjects(targetObjects, true);

    if (intersects.length === 0) {
      return;
    }

    let row = -1;
    let col = -1;

    for (let i = 0; i < intersects.length; i++) {
      let curr = intersects[i].object;
      while (curr && curr !== scene) {
        if (curr.userData && typeof curr.userData.row === 'number' && typeof curr.userData.col === 'number') {
          row = curr.userData.row;
          col = curr.userData.col;
          break;
        }
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (squares[r][c].mesh === curr || squares[r][c].group === curr) {
              row = r;
              col = c;
              break;
            }
          }
          if (row !== -1) break;
        }
        if (row !== -1) break;
        curr = curr.parent;
      }
      if (row !== -1) break;
    }

    if (row === -1) {
      return;
    }

    // ========================================================
    // SELECTED PIECE -> MOVE
    // ========================================================

    if (
      game.selected
    ) {

      const move =
        game.validMoves.find(
          (item) =>
            item.fromRow ===
              game.selected.row &&
            item.fromCol ===
              game.selected.col &&
            item.toRow ===
              row &&
            item.toCol ===
              col
        );

      if (
        move
      ) {

        const piece =
          game.board[
            move.fromRow
          ][
            move.fromCol
          ];

        const isPromotion =
          (
            piece ===
              PIECES.WP &&
            move.toRow ===
              0
          ) ||
          (
            piece ===
              PIECES.BP &&
            move.toRow ===
              7
          );

        // ----------------------------------------------------
        // PROMOTION
        // ----------------------------------------------------

        if (
          isPromotion
        ) {

          showPromotionModal(
            piece,
            (chosenPiece) => {

              move.promotedPiece =
                chosenPiece;

              game.makeMove(
                move
              );

              const fromGroup =
                squares[
                  move.fromRow
                ][
                  move.fromCol
                ].group;

              if (
                fromGroup
              ) {

                animateMove(
                  move,
                  () => {
                    render();
                  }
                );

              } else {

                render();
              }
            }
          );

          return;
        }
      }
    }

    // ========================================================
    // SELECT / NORMAL MOVE
    // ========================================================

    const result =
      game.selectSquare(
        row,
        col
      );

    if (
      result.type ===
      'MOVE_COMPLETED'
    ) {

      const move =
        result.move;

      const fromGroup =
        squares[
          move.fromRow
        ][
          move.fromCol
        ].group;

      if (
        fromGroup
      ) {

        animateMove(
          move,
          () => {
            render();
          }
        );

      } else {

        render();
      }

    } else {

      render();
    }
  }
);

// ============================================================
// PROMOTION MODAL
// ============================================================

function showPromotionModal(
  pawnType,
  callback
) {

  const isWhite =
    pawnType ===
    PIECES.WP;

  const options =
    isWhite
      ? [
          {
            type:
              PIECES.WQ,
            label:
              '♕ Queen'
          },
          {
            type:
              PIECES.WR,
            label:
              '♜ Rook'
          },
          {
            type:
              PIECES.WB,
            label:
              '♗ Bishop'
          },
          {
            type:
              PIECES.WN,
            label:
              '♞ Knight'
          }
        ]
      : [
          {
            type:
              PIECES.BQ,
            label:
              '♛ Queen'
          },
          {
            type:
              PIECES.BR,
            label:
              '♜ Rook'
          },
          {
            type:
              PIECES.BB,
            label:
              '♝ Bishop'
          },
          {
            type:
              PIECES.BN,
            label:
              '♞ Knight'
          }
        ];

  promotionOptions.innerHTML =
    '';

  options.forEach(
    (opt) => {

      const btn =
        document.createElement(
          'button'
        );

      btn.className =
        'btn btn-primary';

      btn.style.padding =
        '12px 8px';

      btn.style.fontSize =
        '15px';

      btn.textContent =
        opt.label;

      btn.addEventListener(
        'click',
        () => {

          promotionModal.style.display =
            'none';

          callback(
            opt.type
          );
        }
      );

      promotionOptions.appendChild(
        btn
      );
    }
  );

  promotionModal.style.display =
    'flex';
}

// ============================================================
// AUTO-FIT BOARD TO VIEWPORT
// ============================================================

function fitBoardToViewport() {
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 300;
  const aspect = width / height;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  const boardSize = 9.8; // Chessboard diameter with margins
  const fovRad = (camera.fov * Math.PI) / 180;
  const halfFovHeight = Math.tan(fovRad / 2);
  const halfFovWidth = halfFovHeight * aspect;

  const distHeight = boardSize / (2 * halfFovHeight);
  const distWidth = boardSize / (2 * halfFovWidth);
  let targetDist = Math.max(distHeight, distWidth);

  // Add 15% safety margin on mobile portrait screens so the board is 100% visible without clipping!
  if (width < 768) {
    targetDist *= 1.15;
  } else if (width < 1100) {
    targetDist *= 1.05;
  }

  targetDist = Math.max(5.5, Math.min(targetDist, 35.0));

  if (isNaN(targetDist) || !isFinite(targetDist)) {
    return;
  }

  controls.maxDistance = Math.max(18.0, targetDist + 4.0);

  const target = controls.target;
  const dir = new THREE.Vector3().subVectors(camera.position, target).normalize();
  
  if (isNaN(dir.x) || isNaN(dir.y) || isNaN(dir.z)) {
    dir.set(0, 1, 0); // fallback orientation vector
  }
  
  camera.position.copy(target).addScaledVector(dir, targetDist);
  controls.update();
}

window.addEventListener(
  'resize',
  () => {
    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    fitBoardToViewport();
  }
);

// ============================================================
// ANIMATION LOOP
// ============================================================

function animate() {

  if (
    cameraAnimating
  ) {
    controls.enabled = false;

    const elapsed =
      performance.now() -
      cameraAnimStartTime;

    const t =
      Math.min(
        elapsed /
          CAMERA_ANIM_DURATION,
        1
      );

    const ease =
      t < 0.5
        ? 4 *
          t *
          t *
          t
        : 1 -
          Math.pow(
            -2 * t + 2,
            3
          ) /
            2;

    const currentTheta =
      cameraStartTheta +
      cameraDeltaTheta *
      ease;

    camera.position.x =
      cameraRadius *
      Math.sin(
        currentTheta
      );

    camera.position.z =
      cameraRadius *
      Math.cos(
        currentTheta
      );

    camera.position.y =
      cameraY;

    controls.target.set(
      0,
      0.62,
      0
    );

    camera.lookAt(
      controls.target
    );

    if (
      t >= 1
    ) {

      cameraAnimating =
        false;
      controls.enabled = true;
      controls.update();
    }
  } else {
    controls.update();
  }

  renderer.render(
    scene,
    camera
  );

  requestAnimationFrame(
    animate
  );
}

pieceModelsReady = true;
render();
fitBoardToViewport();
animate();

// ============================================================
// LOAD THE ACTUAL SUPPLIED CHESS SET
// ============================================================

preloadPieceModels()
  .then(
    () => {
      render();
      fitBoardToViewport();
      console.log('Chess Royale 3D initialized cleanly.');
    }
  );