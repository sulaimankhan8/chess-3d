// ============================================================
// CHESS ROYALE 3D - SOUND EFFECTS ENGINE
// Real-time Web Audio API Synthesizer for Chess SFX
// ============================================================

class ChessAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.initialized = false;
    this.masterGain = null;
    this.sfxGain = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.85 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ============================================================
  // SOUND EFFECTS (SFX)
  // ============================================================

  playMove() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    try {
      const time = this.ctx.currentTime;
      // Gentle slide whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, time);
      osc.frequency.exponentialRampToValueAtTime(340, time + 0.11);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.11);

      // Wooden piece clack
      setTimeout(() => {
        this.playWoodClack(0.32);
      }, 70);
    } catch (e) {}
  }

  playWoodClack(vol = 0.32) {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    try {
      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, time);
      osc.frequency.exponentialRampToValueAtTime(130, time + 0.06);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.06);
    } catch (e) {}
  }

  playCapture() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    try {
      const time = this.ctx.currentTime;
      this.playWoodClack(0.48);

      // Resonant capture chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, time + 0.02);
      osc.frequency.exponentialRampToValueAtTime(920, time + 0.16);

      gain.gain.setValueAtTime(0.28, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time + 0.02);
      osc.stop(time + 0.18);
    } catch (e) {}
  }

  playCheck() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    const notes = [
      { f: 587.33, d: 0.12, del: 0 },
      { f: 880.00, d: 0.30, del: 80 }
    ];
    notes.forEach(n => {
      setTimeout(() => {
        try {
          const time = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, time);
          gain.gain.setValueAtTime(0.38, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + n.d);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(time);
          osc.stop(time + n.d);
        } catch (e) {}
      }, n.del);
    });
  }

  playCheckmate() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    const fanfare = [
      { f: 523.25, d: 0.14, del: 0 },
      { f: 659.25, d: 0.14, del: 120 },
      { f: 783.99, d: 0.18, del: 240 },
      { f: 1046.50, d: 0.22, del: 380 },
      { f: 880.00, d: 0.18, del: 540 },
      { f: 1046.50, d: 0.65, del: 700 }
    ];
    fanfare.forEach(note => {
      setTimeout(() => {
        try {
          const time = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, time);
          gain.gain.setValueAtTime(0.42, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + note.d);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(time);
          osc.stop(time + note.d);
        } catch (e) {}
      }, note.del);
    });
  }

  playPromotion() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    const chime = [
      { f: 659.25, del: 0 },
      { f: 880.00, del: 90 },
      { f: 1174.66, del: 180 }
    ];
    chime.forEach(c => {
      setTimeout(() => {
        try {
          const time = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(c.f, time);
          gain.gain.setValueAtTime(0.32, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(time);
          osc.stop(time + 0.25);
        } catch (e) {}
      }, c.del);
    });
  }

  playSelect() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    try {
      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, time);
      gain.gain.setValueAtTime(0.14, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.04);
    } catch (e) {}
  }

  playUndo() {
    if (!this.sfxEnabled) return;
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    this.resumeContext();
    try {
      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, time);
      osc.frequency.exponentialRampToValueAtTime(220, time + 0.14);
      gain.gain.setValueAtTime(0.20, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.14);
    } catch (e) {}
  }
}

export const audio = new ChessAudioEngine();

// Auto unlock audio context on first user gesture
const unlockAudio = () => {
  if (!audio.initialized) {
    audio.init();
  } else {
    audio.resumeContext();
  }
};

document.addEventListener('click', unlockAudio, { once: false });
document.addEventListener('touchstart', unlockAudio, { passive: true });
document.addEventListener('touchend', unlockAudio, { passive: true });
document.addEventListener('keydown', unlockAudio);
