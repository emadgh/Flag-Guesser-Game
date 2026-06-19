class AudioManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Try to load setting from localStorage
    try {
      const saved = localStorage.getItem('soundEnabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch (e) {
      // Ignore
    }
  }

  private initContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('soundEnabled', enabled.toString());
    } catch (e) {}
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.1); // C6

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playIncorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.start(t);
    osc.stop(t + 0.2);
  }
  
  playTick() {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.audioContext) return;
  
      const t = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
  
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
  
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
  
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  
      osc.start(t);
      osc.stop(t + 0.05);
  }
}

export const audioManager = new AudioManager();
