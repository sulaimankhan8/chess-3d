# Offline mode

Chess Royale 3D uses a Service Worker + Cache Storage for offline support.

## First run

1. Start the game with `start.bat` (or `python -m http.server 8000`).
2. Keep internet enabled for the first run.
3. Wait for the chess pieces to appear.
4. Refresh once. The Service Worker is now controlling the page and has cached the game dependencies and chess models.
5. You can disconnect from the internet and play normally.

## Important

Do not open `index.html` directly with `file://`. Service Workers are not available from `file://`, so use the included local server.

The cache is stored by the browser's Cache Storage API, not localStorage. This is the correct browser storage mechanism for large JavaScript/model files.
