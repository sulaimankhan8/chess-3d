# Chess Royale 3D — Latest UI/3D Pass

## Fixed
- Black knight orientation now uses the outer piece group for the 180° facing turn, preventing the imported knight from becoming inverted.
- Board squares changed to a darker graphite palette so black pieces remain readable without the previous cream/brown visual noise.
- Board trim and base were darkened and made less reflective.

## UI layout
- Replaced the single right-side dashboard with two independent side panels.
- Left panel: turn, move count, player cards, captures, and material balance.
- Right panel: move history and compact board status.
- Panels hide below tablet width so they never cover the 3D board.
- Top controls remain centered above the play area.

## Game result
Added a full-screen result modal for:
- Checkmate / Win / Lose
- Stalemate
- Repetition draws
- 50/75-move draws
- Insufficient material
- Dead position
- Draw by agreement

The result modal offers New Game or Continue Viewing.

## Offline
The existing Service Worker cache remains enabled. The first online run downloads the app, Three.js and the GitHub-hosted model assets; subsequent runs can use the browser Cache Storage while offline.
