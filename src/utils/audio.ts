/**
 * @file audio.ts
 * @description Advanced High-Fidelity Web Audio API Synthesizer for Interactive UI Feedback
 * 
 * [시스템 설계 지침 - 전문 금융 공학용 오디오 피드백]
 * - 이 모듈은 별도의 외부 오디오 리소스(.mp3 등) 다운로드 없이, 웹 브라우저의 Web Audio API
 *   OscillatorNode 및 BiquadFilterNode를 직접 동적으로 합성하여 99.9% 지연 없는 경쾌한 오디오 피드백을 제공합니다.
 * - Auto-play 제한 정책을 준수하여, 사용자가 화면을 터치/클릭하는 순간 AudioContext를 유연하게 점화(Resume)시킵니다.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Standard Cross-Browser Initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 1. Play Soft Click Sound (가벼운 버튼 클릭 피드백 - UI State Transition Tick)
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Precise mechanical micro-tick formulation
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    console.warn('Audio Context interaction deferred until user gesture.', e);
  }
}

/**
 * 2. Play Lock Sound (🔒 금 자산 설계 인자 고정 잠금 소리 - Satisfying Metal Click)
 * 가상 금속 래칫 기어가 물리적으로 철컥하며 고정되는 느낌의 두 개의 연속 레이어 사운드
 */
export function playLockSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer 1: Sharp Metallic Attack
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.setValueAtTime(450, now + 0.02);

    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(1000, now);

    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.1);

    // Layer 2: Deeper satisfying mechanical click (slightly delayed)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(180, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(60, now + 0.07);

    gain2.gain.setValueAtTime(0.15, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.02);
    osc2.stop(now + 0.12);
  } catch (e) {
    console.warn('Audio feedback failed or deferred:', e);
  }
}

/**
 * 3. Play Unlock Sound (🔓 자산 잠금 해제 소리 - Elegant Upward Mechanical Chime)
 * 속박되었던 자산 설계 인자가 튕겨져 나오듯 밝고 시원하게 상승하는 입체적 톤
 */
export function playUnlockSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Two harmonized oscillators (Perfect 5th) rising rapidly
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.15);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, now);
    osc2.frequency.exponentialRampToValueAtTime(1650, now + 0.15);

    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);
  } catch (e) {
    console.warn('Audio feedback failed or deferred:', e);
  }
}

/**
 * 4. Play Ignite Spark Sound (🔥 6대 인자 완비 기념 '이글이글' 점화 및 마스터플랜 자산 종합 보고서 열람 음)
 * 화르륵 타오르는 노이즈 효과음과 함께 아름다운 황금 비율(Golden Ratio)의 메이저 아르페지오가
 * 단계적으로 울려퍼져, 극상의 성취감과 신뢰도 높은 금융 솔루션 빌드업을 시청각적으로 완성합니다.
 */
export function playIgniteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer A: Beautiful Golden Ascension Arpeggio (C Major / G Major Golden Mood)
    // Notes: G4(392Hz) -> C5(523.25Hz) -> E5(659.25Hz) -> G5(783.99Hz) -> C6(1046.5Hz)
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = index * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      // Add subtle warm vibrato or decay
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.45);
    });

    // Layer B: Blazing Spark/Flame Sizzle Sweep (Noise + Filter)
    // Create random buffers for warm flame sizzle noise
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(150, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.45);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.5);
  } catch (e) {
    console.warn('Flame ignition audio feedback failed or deferred:', e);
  }
}
