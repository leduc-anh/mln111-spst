/* Original instrumental motifs, synthesized locally; no external audio requests. */
class JourneyMusic {
  constructor(button, label) {
    this.button = button;
    this.label = label;
    this.scene = 0;
    this.enabled = false;
    this.profiles = [
      {
        name: "Khởi đầu · piano dịu",
        bpm: 68,
        root: 48,
        melody: [0, 4, 7, 12, 11, 7, 4, 2],
        chords: [
          [0, 4, 7],
          [5, 9, 12],
          [7, 11, 14],
          [0, 4, 7],
        ],
      },
      {
        name: "Kiểm duyệt · nhịp căng",
        bpm: 82,
        root: 45,
        melody: [0, 7, 3, 2, 0, 3, 7, 2],
        chords: [
          [0, 3, 7],
          [5, 8, 12],
          [7, 10, 14],
          [0, 3, 7],
        ],
        pulse: true,
      },
      {
        name: "Paris · điệu valse ấm",
        bpm: 94,
        root: 48,
        melody: [4, 7, 12, 11, 9, 7, 5, 4, 2, 4, 7, 12],
        chords: [
          [0, 4, 7],
          [5, 9, 12],
          [7, 11, 14],
          [0, 4, 7],
        ],
        meter: 3,
      },
      {
        name: "Brussels · suy tưởng",
        bpm: 62,
        root: 50,
        melody: [0, 3, 7, 10, 7, 5, 3, 2],
        chords: [
          [0, 3, 7],
          [5, 8, 12],
          [3, 7, 10],
          [0, 3, 7],
        ],
      },
      {
        name: "1848 · nhịp tiến bước",
        bpm: 108,
        root: 48,
        melody: [0, 0, 7, 7, 8, 7, 3, 2],
        chords: [
          [0, 3, 7],
          [8, 12, 15],
          [5, 8, 12],
          [7, 11, 14],
        ],
        pulse: true,
      },
      {
        name: "London · piano trầm",
        bpm: 56,
        root: 45,
        melody: [7, 3, 2, 0, 3, 5, 2, 0],
        chords: [
          [0, 3, 7],
          [5, 8, 12],
          [8, 12, 15],
          [0, 3, 7],
        ],
      },
      {
        name: "Tư bản · âm hưởng sáng",
        bpm: 76,
        root: 48,
        melody: [0, 4, 7, 12, 14, 12, 7, 4],
        chords: [
          [0, 4, 7],
          [9, 12, 16],
          [5, 9, 12],
          [7, 11, 14],
        ],
      },
    ];
    // Each chapter has its own orchestration, phrase spacing and accompaniment.
    const arrangements = [
      {
        voice: "piano",
        backing: "pad",
        rhythm: "arpeggio",
        meter: 4,
        spacing: 2,
        name: "Trier · piano dịu & hợp âm mở",
      },
      {
        voice: "pluck",
        backing: "bass",
        rhythm: "tension",
        meter: 4,
        spacing: 1,
        name: "Kiểm duyệt · dây gảy & nhịp gõ căng",
      },
      {
        voice: "reed",
        backing: "reed",
        rhythm: "waltz",
        meter: 3,
        spacing: 1,
        name: "Paris · đàn hơi & valse 3/4",
      },
      {
        voice: "flute",
        backing: "pad",
        rhythm: "sparse",
        meter: 4,
        spacing: 2,
        name: "Brussels · sáo & khoảng lặng",
      },
      {
        voice: "brass",
        backing: "brass",
        rhythm: "march",
        meter: 4,
        spacing: 1,
        name: "1848 · kèn đồng & trống hành tiến",
      },
      {
        voice: "piano",
        backing: "pad",
        rhythm: "sparse",
        meter: 4,
        spacing: 3,
        name: "London · piano trầm, chậm & thưa",
      },
      {
        voice: "strings",
        backing: "strings",
        rhythm: "arpeggio",
        meter: 6,
        spacing: 1,
        name: "Tư bản · đàn dây & nhịp 6/8",
      },
    ];
    this.profiles.forEach((profile, i) =>
      Object.assign(profile, arrangements[i]),
    );
    button.addEventListener("click", () => this.toggle());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else if (this.enabled) this.start().catch(() => this.fail());
    });
    window.addEventListener("pagehide", () => this.stop());
    window.addEventListener("pageshow", () => {
      if (this.enabled && !document.hidden)
        this.start().catch(() => this.fail());
    });
    this.render();
  }
  render() {
    this.button.setAttribute("aria-pressed", String(this.enabled));
    this.button.setAttribute(
      "aria-label",
      this.enabled ? "Tắt nhạc nền" : "Bật nhạc nền theo cột mốc",
    );
    this.button.querySelector(".music-action").textContent = this.enabled
      ? "Tắt nhạc"
      : "Bật nhạc";
    this.label.textContent = this.enabled
      ? this.profiles[this.scene].name
      : "Nhạc theo cột mốc";
  }
  async toggle() {
    this.enabled = !this.enabled;
    this.render();
    if (!this.enabled) {
      this.stop();
      return;
    }
    try {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error("Audio unavailable");
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = 1;
        // Roll off bright harmonics so the score stays behind the speaker.
        this.softFilter = this.context.createBiquadFilter();
        this.softFilter.type = "lowpass";
        this.softFilter.frequency.value = 1100;
        this.softFilter.Q.value = 1;
        this.master.connect(this.softFilter);
        this.softFilter.connect(this.context.destination);
      }
      await this.start();
    } catch {
      this.fail();
    }
  }
  fail() {
    this.enabled = false;
    this.stop();
    this.render();
    this.label.textContent = "Chưa phát được · bấm thử lại";
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
        const chord =
          profile.chords[Math.floor(this.beat / meter) % profile.chords.length];
        if (this.beat % profile.spacing === 0) {
          const phrase =
            Math.floor(this.beat / profile.spacing) %
            (profile.melody.length + 2);
          if (phrase < profile.melody.length)
            this.note(
              profile.root + profile.melody[phrase],
              t,
              step * profile.spacing * 1.4,
              0.05,
              profile.voice,
            );
        }
        if (this.beat % meter === 0) {
          if (profile.rhythm !== "waltz")
            chord.forEach((interval, i) =>
              this.note(
                profile.root + interval,
                t + i * 0.04,
                step * meter,
                0.025,
                profile.backing,
              ),
            );
          this.note(profile.root - 12 + chord[0], t, step * 1.5, 0.06, "bass");
        } else if (profile.rhythm === "waltz") {
          chord.forEach((interval) =>
            this.note(profile.root + interval, t, step * 0.65, 0.025, "reed"),
          );
        }
        if (profile.rhythm === "arpeggio")
          this.note(
            profile.root + chord[this.beat % chord.length],
            t,
            step * 1.1,
            0.035,
            "pluck",
          );
        if (profile.rhythm === "tension") {
          this.note(
            profile.root - 12 + (this.beat % 2 ? 7 : 0),
            t,
            step * 0.3,
            0.04,
            "pluck",
          );
          if (this.beat % 2 === 0) this.percussion(t, "kick", 0.018);
        }
        if (profile.rhythm === "march") {
          this.percussion(t, this.beat % 2 ? "snare" : "kick", 0.022);
        }
        this.beat++;
        this.nextNote += step;
      }
    };
    schedule();
    this.timer = setInterval(schedule, 80);
  }
  percussion(time, kind, volume) {
    const envelope = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    const length = kind === "kick" ? 0.22 : kind === "snare" ? 0.14 : 0.035;
    const buffer = this.context.createBuffer(
      1,
      Math.ceil(this.context.sampleRate * length),
      this.context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = kind === "kick" ? 130 : 650;
    filter.Q.value = 0.5;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + length);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.bus);
    source.start(time);
    source.stop(time + length);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      envelope.disconnect();
    };
  }
  note(midi, time, duration, volume, voice = "piano") {
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    const timbres = {
      piano: { type: "sine", partials: [1, 0.1, 0.025], attack: 0.06 },
      pluck: { type: "sine", partials: [1, 0.12], attack: 0.04 },
      reed: { type: "triangle", partials: [0.8, 0.12, 0.03], attack: 0.12 },
      flute: { type: "sine", partials: [1, 0.04], attack: 0.18 },
      brass: { type: "triangle", partials: [0.65, 0.06], attack: 0.16 },
      strings: { type: "triangle", partials: [0.8, 0.1, 0.025], attack: 0.35 },
      pad: { type: "sine", partials: [1, 0.08], attack: 0.45 },
      bass: { type: "sine", partials: [1, 0.04], attack: 0.06 },
    };
    const tone = timbres[voice];
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(
      volume,
      time + Math.min(tone.attack, duration * 0.2),
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    envelope.connect(this.bus);
    tone.partials.forEach((strength, index) => {
      const oscillator = this.context.createOscillator();
      const level = this.context.createGain();
      oscillator.type = tone.type;
      oscillator.frequency.value =
        frequency * (tone.ratios ? tone.ratios[index] : index + 1);
      oscillator.detune.value =
        voice === "strings" || voice === "reed" ? (index % 2 ? 5 : -5) : 0;
      level.gain.value = strength;
      oscillator.connect(level);
      level.connect(envelope);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
      oscillator.onended = () => {
        oscillator.disconnect();
        level.disconnect();
        if (!index) envelope.disconnect();
      };
    });
  }
}
