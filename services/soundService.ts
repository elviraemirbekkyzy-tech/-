let audioContext: AudioContext | null = null;
let isMuted = false;

const getContext = () => {
  if (!audioContext) {
    // Create AudioContext on demand (must happen after user interaction)
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

export const getMuted = () => isMuted;

// Play a happy major chord chime
export const playCorrectSound = () => {
  if (isMuted) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    
    // Create two oscillators for a harmony
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // High C
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, t); 
    osc1.frequency.exponentialRampToValueAtTime(1046.5, t + 0.1); 

    // E (Major 3rd)
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, t);
    osc2.frequency.exponentialRampToValueAtTime(1318.5, t + 0.1);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.4);
    osc2.stop(t + 0.4);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// Play a low buzzing sound
export const playIncorrectSound = () => {
  if (isMuted) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// Play a short click/tick sound
export const playClickSound = () => {
   if (isMuted) return;
   try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, t);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    osc.start(t);
    osc.stop(t + 0.05);
   } catch (e) {
    console.error("Audio play failed", e);
   }
}