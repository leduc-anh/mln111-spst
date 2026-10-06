/* Original instrumental motifs, synthesized locally; no external audio requests. */
class JourneyMusic {
  constructor(button, label) {
    this.button = button;
    this.label = label;
    this.scene = 0;
    this.enabled = false;
    this.profiles = [
      {name:'Khởi đầu · piano dịu', bpm:68, root:48, melody:[0,4,7,12,11,7,4,2], chords:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]]},
      {name:'Kiểm duyệt · nhịp căng', bpm:82, root:45, melody:[0,7,3,2,0,3,7,2], chords:[[0,3,7],[5,8,12],[7,10,14],[0,3,7]], pulse:true},
      {name:'Paris · điệu valse ấm', bpm:94, root:48, melody:[4,7,12,11,9,7,5,4,2,4,7,12], chords:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]], meter:3},
      {name:'Brussels · suy tưởng', bpm:62, root:50, melody:[0,3,7,10,7,5,3,2], chords:[[0,3,7],[5,8,12],[3,7,10],[0,3,7]]},
      {name:'1848 · nhịp tiến bước', bpm:108, root:48, melody:[0,0,7,7,8,7,3,2], chords:[[0,3,7],[8,12,15],[5,8,12],[7,11,14]], pulse:true},
      {name:'London · piano trầm', bpm:56, root:45, melody:[7,3,2,0,3,5,2,0], chords:[[0,3,7],[5,8,12],[8,12,15],[0,3,7]]},
      {name:'Tư bản · âm hưởng sáng', bpm:76, root:48, melody:[0,4,7,12,14,12,7,4], chords:[[0,4,7],[9,12,16],[5,9,12],[7,11,14]]}
    ];
    button.addEventListener('click', () => this.toggle());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else if (this.enabled) this.start().catch(() => this.fail());
    });
    window.addEventListener('pagehide', () => this.stop());
    window.addEventListener('pageshow', () => {
      if (this.enabled && !document.hidden) this.start().catch(() => this.fail());
    });
    this.render();
  }
  render() {
    this.button.setAttribute('aria-pressed', String(this.enabled));
    this.button.setAttribute('aria-label', this.enabled ? 'Tắt nhạc nền' : 'Bật nhạc nền theo cột mốc');
    this.button.querySelector('.music-action').textContent = this.enabled ? 'Tắt nhạc' : 'Bật nhạc';
    this.label.textContent = this.enabled ? this.profiles[this.scene].name : 'Nhạc theo cột mốc';
  }
  async toggle() {
    this.enabled = !this.enabled;
    this.render();
    if (!this.enabled) { this.stop(); return; }
    try {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Audio unavailable');
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.context.destination);
      }
      await this.start();
    } catch { this.fail(); }
  }
  fail() {
    this.enabled = false;
    this.stop();
    this.render();
    this.label.textContent = 'Chưa phát được · bấm thử lại';
  }
  setScene(index) {
    if (index === this.scene) return;
    this.scene = index;
    this.render();
    if (this.enabled && !document.hidden) this.start().catch(() => this.fail());
  }
  stop() {
    clearInterval(this.timer);
    this.timer = null;
    if (!this.bus) return;
    const bus = this.bus;
    const now = this.context.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(0, now + 0.65);
    setTimeout(() => bus.disconnect(), 1800);
    this.bus = null;
  }
  async start() {
    this.stop();
    await this.context.resume();
    if (!this.enabled || document.hidden) return;
    // Another scene change can complete while resume() is pending.
    this.stop();
    this.bus = this.context.createGain();
    this.bus.gain.setValueAtTime(0, this.context.currentTime);
    this.bus.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.85);
    this.bus.connect(this.master);
    this.beat = 0;
    this.nextNote = this.context.currentTime + 0.06;
    const schedule = () => {
      const profile = this.profiles[this.scene];
      const step = 60 / profile.bpm;
      const meter = profile.meter || 4;
      while (this.nextNote < this.context.currentTime + 0.2) {
        const t = this.nextNote;
        const chord = profile.chords[Math.floor(this.beat / meter) % profile.chords.length];
        this.note(profile.root + 12 + profile.melody[this.beat % profile.melody.length], t, step * 1.7, 0.075);
        if (this.beat % meter === 0) {
          chord.forEach((interval, i) => this.note(profile.root + interval, t + i * 0.035, step * meter, 0.035));
          this.note(profile.root - 12 + chord[0], t, step * 2, 0.07);
        } else if (meter === 3) {
          chord.forEach(interval => this.note(profile.root + interval, t, step * 0.8, 0.02));
        }
        if (profile.pulse) this.note(profile.root - 12, t, step * 0.35, 0.045);
        this.beat++;
        this.nextNote += step;
      }
    };
    schedule();
    this.timer = setInterval(schedule, 80);
  }
  note(midi, time, duration, volume) {
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    envelope.connect(this.bus);
    [1, 2, 3].forEach((harmonic, index) => {
      const oscillator = this.context.createOscillator();
      const level = this.context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency * harmonic;
      level.gain.value = [1, 0.22, 0.08][index];
      oscillator.connect(level);
      level.connect(envelope);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
      oscillator.onended = () => { oscillator.disconnect(); level.disconnect(); if (!index) envelope.disconnect(); };
    });
  }
}
