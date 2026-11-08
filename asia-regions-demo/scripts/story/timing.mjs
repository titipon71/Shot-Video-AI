// When things happen inside a scene: cue phrases in the narration -> seconds, and caption phrases.
// Without a voiceover, time runs through the scene's speaking window in proportion to characters
// read (spaces not counted), which is close enough for Thai narration at an even pace.

const seg = new Intl.Segmenter("th", { granularity: "word" });
const len = (t) => t.replace(/[\s\u0001]/g, "").length;
// Caption phrase: split runs above MAX characters, join neighbours up to MERGE (about two lines on screen).
const MAX = 26, MERGE = 24, MIN_TAIL = 6;
const READ = 1.5, SKIP = 0.3, JOIN = 44; // seconds a caption needs; joined captions stay within JOIN characters

// Seconds into the scene at which `cue` (a phrase of s.say) starts being spoken.
// With a voiceover, s.voice.times[i] is the clip time of say[i] and s.voice.start the scene's start.
export function cueTimes(s) {
  const [a, b] = s.speak;
  const total = len(s.say);
  const at = s.voice
    ? (i) => +Math.max(0, s.voice.times[Math.min(i, s.say.length - 1)] - s.voice.start).toFixed(2)
    : (i) => +(a + (len(s.say.slice(0, i)) / total) * (b - a)).toFixed(2);
  const fn = (cue) => {
    const i = s.say.indexOf(cue);
    if (i < 0) throw new Error(`${s.id}: cue "${cue}" is not in the narration`);
    return at(i);
  };
  fn.at = at;
  return fn;
}

// Voiceover alignment. The transcript's text is only close to the narration (ASR misspells names and
// reads "1283" as words), so align the two character by character (edit distance over letters and
// digits) and keep the times of the characters that match; the rest are interpolated between them.
const key = (t) =>
  [...t.toLowerCase().replace(/[๐-๙]/g, (d) => d.charCodeAt(0) - 0x0e50)].filter((c) => /[ก-๎ a-z0-9]/.test(c) && c !== " ");

// scenes[].say + words [{text, start, end}] -> per scene { first, last, times[] (clip time of each say index), matched }.
export function alignVoice(scenes, words) {
  const S = []; // narration characters: [char, scene, index in say]
  scenes.forEach((s, k) => [...s.say].forEach((c, i) => key(c).length && S.push([key(c)[0], k, i])));
  const T = []; // transcript characters: [char, start, end]
  for (const w of words) {
    const cs = key(w.text);
    const step = (w.end - w.start) / Math.max(cs.length, 1);
    cs.forEach((c, j) => T.push([c, w.start + j * step, w.start + (j + 1) * step]));
  }
  const n = S.length, m = T.length;
  if (!m) throw new Error("voice transcript has no words");
  // Levenshtein with a backtrack table (0 diagonal, 1 skip narration char, 2 skip transcript char).
  const back = new Uint8Array((n + 1) * (m + 1));
  let prev = new Uint32Array(m + 1).map((_, j) => j), cur = new Uint32Array(m + 1);
  for (let j = 1; j <= m; j++) back[j] = 2;
  for (let i = 1; i <= n; i++) {
    cur[0] = i;
    back[i * (m + 1)] = 1;
    for (let j = 1; j <= m; j++) {
      const d = prev[j - 1] + (S[i - 1][0] === T[j - 1][0] ? 0 : 1), u = prev[j] + 1, l = cur[j - 1] + 1;
      const v = Math.min(d, u, l);
      cur[j] = v;
      back[i * (m + 1) + j] = v === d ? 0 : v === u ? 1 : 2;
    }
    [prev, cur] = [cur, prev];
  }
  const anchor = new Array(n).fill(null); // [start, end] for narration chars that match exactly
  for (let i = n, j = m; i > 0 || j > 0; ) {
    const b = back[i * (m + 1) + j];
    if (i > 0 && j > 0 && b === 0) {
      if (S[i - 1][0] === T[j - 1][0]) anchor[i - 1] = [T[j - 1][1], T[j - 1][2]];
      i--, j--;
    } else if (i > 0 && (j === 0 || b === 1)) i--;
    else j--;
  }
  // Interpolate unmatched characters between the nearest anchors (by position in the narration).
  const idx = anchor.flatMap((a, i) => (a ? [i] : []));
  if (idx.length < 2) throw new Error("voice transcript does not match the narration");
  const time = new Array(n), endOf = new Array(n);
  for (let i = 0, p = 0; i < n; i++) {
    while (p + 1 < idx.length && idx[p + 1] <= i) p++;
    const a = idx[p], b = idx[Math.min(p + 1, idx.length - 1)];
    if (anchor[i]) [time[i], endOf[i]] = anchor[i];
    else if (i < a) time[i] = endOf[i] = anchor[a][0];
    else if (b === a) time[i] = endOf[i] = anchor[a][1];
    else time[i] = endOf[i] = anchor[a][1] + ((i - a) / (b - a)) * (anchor[b][0] - anchor[a][1]);
  }
  return scenes.map((s, k) => {
    const mine = S.flatMap((c, q) => (c[1] === k ? [q] : []));
    const times = new Array(s.say.length);
    // Non-letters (spaces, punctuation) take the time of the next letter.
    let q = mine.length - 1, next = endOf[mine.at(-1)];
    for (let i = s.say.length - 1; i >= 0; i--) {
      if (q >= 0 && S[mine[q]][2] === i) next = time[mine[q--]];
      times[i] = next;
    }
    return {
      first: time[mine[0]],
      last: endOf[mine.at(-1)],
      times,
      matched: mine.filter((q) => anchor[q]).length / mine.length,
    };
  });
}

// Caption phrases with times: split at the narration's own spaces, long runs at word boundaries.
// Words the segmenter splits but a caption must not (compounds, names), plus "ค.ศ. 1292"-style years.
const KEEP = ["ราชสำนัก", "เดินทาง", "พ่อขุนรามคำแหง", "รามคำแหง", "ตอนนั้น", "ตอนต้น", "กุบไลข่าน", "มองโกล", "จักรวรรดิ", "มาร์โค โปโล",
  "กามิกาเซ่", "ไต้ฝุ่น", "อยุธยา", "สุโขทัย", "ถือกำเนิด", "ทำบุญ", "อักษรไทย", "ประดิษฐ์", "หลักที่ 1"];

export function phrases(s) {
  // Positions a caption may not break at: inside a kept word or between an era and its year.
  const noBreak = new Set();
  for (const w of [...KEEP, ...(s.keep ?? [])])
    for (let i = s.say.indexOf(w); i >= 0; i = s.say.indexOf(w, i + 1)) for (let k = i + 1; k < i + w.length; k++) noBreak.add(k);
  for (const m of s.say.matchAll(/[คพ]\.ศ\. \d/g)) noBreak.add(m.index + 4);
  // Spaces that must stay become a placeholder so they don't split runs (same length, so indices hold).
  const text = [...s.say].map((c, k) => (c === " " && noBreak.has(k) ? "\u0001" : c)).join("");
  const runs = [];
  for (const m of text.matchAll(/\S+/g)) {
    const w = m[0];
    if (len(w) <= MAX) runs.push({ text: w, i: m.index });
    else {
      // Long runs (Thai writes a whole clause without spaces): split into even pieces at word boundaries.
      const n = Math.ceil(len(w) / MAX), target = len(w) / n;
      const pieces = [];
      let cur = "", start = m.index;
      for (const { segment, index } of seg.segment(w)) {
        if (cur && pieces.length < n - 1 && len(cur + segment) > target && !noBreak.has(m.index + index)) {
          pieces.push({ text: cur, i: start });
          cur = "";
          start = m.index + index;
        }
        cur += segment;
      }
      if (cur) {
        if (pieces.length && len(cur) < MIN_TAIL) pieces.at(-1).text += cur;
        else pieces.push({ text: cur, i: start });
      }
      runs.push(...pieces);
    }
  }
  // Join short neighbours so captions don't flicker one word at a time, with the narration's own spacing.
  const sep = (i) => (/\s/.test(s.say[i - 1] ?? "") ? " " : "");
  const out = [];
  for (const r of runs) {
    const last = out.at(-1);
    const fits = last && len(last.text) + len(r.text) <= (len(r.text) < MIN_TAIL ? MAX + MIN_TAIL : MERGE);
    if (fits && !/[?!]$/.test(last.text)) last.text += sep(r.i) + r.text;
    else out.push({ ...r });
  }
  const caps = out.map((p, k) => ({
    i: p.i,
    text: p.text.replace(/\u0001/g, " ").replace(/\.{3}$/, "…"),
    start: s.cue.at(p.i),
    end: k + 1 < out.length ? s.cue.at(out[k + 1].i) : s.dur,
  }));
  // A phrase the voice rushes (on screen under READ s) joins a neighbour while the pair still fits two
  // lines; one it skips (under SKIP s) joins regardless. Shortest first, so the joins spread evenly.
  const dur = (c) => c.end - c.start;
  for (;;) {
    let best = null;
    caps.forEach((c, k) => {
      if (dur(c) >= READ) return;
      for (const j of [k - 1, k + 1]) {
        const o = caps[j];
        if (!o || (dur(c) >= SKIP && (len(c.text) + len(o.text) > JOIN || /[?!]$/.test(caps[Math.min(j, k)].text)))) continue;
        const score = dur(c) * 100 + len(c.text) + len(o.text);
        if (!best || score < best.score) best = { score, a: Math.min(j, k) };
      }
    });
    if (!best) break;
    const [x, y] = caps.splice(best.a, 2);
    caps.splice(best.a, 0, { i: x.i, text: x.text + sep(y.i) + y.text, start: x.start, end: y.end });
  }
  return caps.map(({ i, ...c }) => c);
}
