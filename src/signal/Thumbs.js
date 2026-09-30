import { useEffect, useMemo, useState } from "react";
import { useCanvasLoop, prefersReducedMotion } from "./hooks";

const ACCENT = "255, 91, 36";
const BONE = "217, 214, 207";

function useTicker(active, ms) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return undefined;
    const id = setInterval(() => setStep((s) => s + 1), ms);
    return () => clearInterval(id);
  }, [active, ms]);
  return step;
}

/* ------------------------------------------------------------------ civic */
/* A field of citizens. Each report lands as a ripple that lights its ward. */
export function CivicPulse({ active }) {
  const ripples = useMemo(() => [], []);
  const users = 20184 + useTicker(active, 700) * 3;

  const canvasRef = useCanvasLoop(active, (ctx, w, h, t) => {
    const gap = 12;
    // the loop's clock restarts each time the card scrolls back into view
    if (ripples.length && t < ripples[ripples.length - 1].born) ripples.length = 0;
    if (ripples.length === 0 || t - ripples[ripples.length - 1].born > 0.45) {
      ripples.push({ x: Math.random() * w, y: Math.random() * h, born: t });
      if (ripples.length > 9) ripples.shift();
    }
    for (let y = gap / 2; y < h; y += gap) {
      for (let x = gap / 2; x < w; x += gap) {
        let glow = 0;
        for (const r of ripples) {
          const age = t - r.born;
          const front = age * 70;
          const d = Math.hypot(x - r.x, y - r.y);
          const band = Math.exp(-((d - front) ** 2) / 60);
          glow += band * Math.max(0, 1 - age / 2.6) + (d < 7 ? Math.max(0, 1 - age / 3.5) : 0);
        }
        glow = Math.min(1, glow);
        ctx.fillStyle = glow > 0.05 ? `rgba(${ACCENT}, ${0.15 + glow * 0.85})` : `rgba(${BONE}, 0.2)`;
        const s = 1.6 + glow * 1.6;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
  });

  return (
    <div className="th th-civic">
      <canvas ref={canvasRef} />
      <div className="th-label">
        <span className="dot" /> live · civic reports
      </div>
      <div className="th-civic-count">
        <strong>{users.toLocaleString("en-IN")}</strong>
        <span>citizens today</span>
      </div>
      <div className="th-civic-toast">
        ward {12 + (users % 17)} · streetlight reported
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- codejudge */
/* Code runs test by test in its own container. Every other run, one blows
   the time limit and the container is killed. */
const CODE = [
  ["kw", "def "], ["fn", "two_sum"], ["", "(nums, target):"],
  null,
  ["", "    seen = {}"],
  null,
  ["kw", "    for "], ["", "i, n "], ["kw", "in "], ["fn", "enumerate"], ["", "(nums):"],
  null,
  ["kw", "        if "], ["", "target - n "], ["kw", "in "], ["", "seen:"],
  null,
  ["kw", "            return "], ["", "[seen[target - n], i]"],
  null,
  ["", "        seen[n] = i"],
  null,
  null,
  ["cm", "# harness · injected per test case"],
  null,
  ["kw", "assert "], ["fn", "two_sum"], ["", "([2, 7, 11, 15], 9) == [0, 1]"],
  null,
  ["kw", "assert "], ["fn", "two_sum"], ["", "([3, 2, 4], 6) == [1, 2]"],
];

function codeLines() {
  const lines = [[]];
  CODE.forEach((tok) => (tok === null ? lines.push([]) : lines[lines.length - 1].push(tok)));
  return lines;
}

const TESTS = 6;
const CYCLE = TESTS + 6;

export function Sandbox({ active }) {
  const step = useTicker(active, 420);
  const lines = useMemo(codeLines, []);
  const run = Math.floor(step / CYCLE);
  const s = step % CYCLE;
  const tle = run % 2 === 1;
  const killAt = 4;

  const tests = Array.from({ length: TESTS }, (_, i) => {
    const at = i + 1;
    if (tle && i === killAt && s >= at) return s >= at + 2 ? "killed" : "slow";
    if (tle && i > killAt) return s >= killAt + 3 ? "skip" : "queued";
    if (s > at) return "pass";
    if (s === at) return "run";
    return "queued";
  });
  const done = s >= TESTS + 2 || (tle && s >= killAt + 3);
  const ms = [31, 28, 36, 30, 42, 34];

  return (
    <div className="th th-judge">
      <div className="th-judge-code">
        <div className="th-judge-tabs">
          <span className="on">solution.py</span>
          <span>python 3.11</span>
        </div>
        <pre>
          {lines.map((l, i) => (
            <div key={i} className="ln">
              <i>{i + 1}</i>
              {l.map(([c, txt], j) => (
                <span key={j} className={c}>
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
      <div className="th-judge-runs">
        <div className="th-label">
          <span className="dot" /> docker · run #{1042 + run}
        </div>
        <ul>
          {tests.map((st, i) => (
            <li key={i} className={`t-${st}`}>
              <span className="box" />
              <span>case {i + 1}</span>
              <span className="meta">
                {st === "pass" && `${ms[i]}ms`}
                {st === "run" && "running"}
                {st === "slow" && "2000ms+"}
                {st === "killed" && "killed"}
                {st === "skip" && "—"}
              </span>
            </li>
          ))}
        </ul>
        <div className={`th-judge-verdict ${done ? "show" : ""} ${tle ? "bad" : "ok"}`}>
          {tle ? "Time Limit Exceeded" : "Accepted · 42ms"}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- syncwave */
/* Three listeners, one track. Guests drift for a moment and snap back. */
const CHAT = ["queue lo-fi next", "this drop 🔥", "synced ✓", "who picked this banger", "skip to 1:24?"];

function seeded(n) {
  let x = 7;
  return Array.from({ length: n }, () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  });
}

export function SyncLanes({ active }) {
  const amps = useMemo(() => seeded(400), []);
  const msgIndex = useTicker(active, 2200);

  const canvasRef = useCanvasLoop(active, (ctx, w, h, t) => {
    const lanes = 3;
    const top = 44;
    const laneH = (h - top - 64) / lanes;
    const bar = 4;
    const gap = 2;
    const head = w * 0.42;
    const scroll = t * 26;

    for (let l = 0; l < lanes; l++) {
      const cy = top + laneH * l + laneH / 2;
      // guests wander off the host clock, then get pulled back
      const drift = l === 0 ? 0 : Math.max(0, Math.sin(t * 0.9 + l * 2.1)) ** 8 * 18 * (l === 1 ? 1 : -1);
      ctx.fillStyle = `rgba(${BONE}, 0.45)`;
      ctx.font = "10px 'Geist Mono', monospace";
      ctx.fillText(l === 0 ? "host" : l === 1 ? "guest·7f" : "guest·a2", 12, cy - laneH / 2 + 12);
      for (let x = 70; x < w - 10; x += bar + gap) {
        const idx = Math.floor((x + scroll + drift) / (bar + gap));
        const a = amps[((idx % amps.length) + amps.length) % amps.length];
        const env = 0.35 + 0.65 * Math.abs(Math.sin(idx * 0.13));
        const bh = Math.max(2, a * env * laneH * 0.62);
        const played = x < head;
        ctx.fillStyle = played ? `rgba(${ACCENT}, ${0.55 + a * 0.45})` : `rgba(${BONE}, 0.18)`;
        ctx.fillRect(x, cy - bh / 2, bar, bh);
      }
    }
    ctx.fillStyle = `rgba(${ACCENT}, 1)`;
    ctx.fillRect(head, top - 6, 1.5, laneH * lanes + 6);
    ctx.beginPath();
    ctx.arc(head + 0.75, top - 8, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  return (
    <div className="th th-sync">
      <canvas ref={canvasRef} />
      <div className="th-label">
        <span className="dot" /> 3 listening · /c/8K2Q
      </div>
      <div className="th-sync-chat">
        <span key={msgIndex}>{CHAT[msgIndex % CHAT.length]}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- tracker */
const COMPANIES = [
  ["Google", 0.72, 180],
  ["Amazon", 0.58, 214],
  ["Meta", 0.81, 126],
  ["Microsoft", 0.44, 160],
  ["Uber", 0.63, 88],
];
const WINDOWS = ["30d", "3m", "6m", "all"];

export function Heatmap({ active }) {
  const cells = useMemo(() => {
    const r = seeded(26 * 7);
    return r.map((v, i) => ({ level: v > 0.82 ? 4 : v > 0.62 ? 3 : v > 0.42 ? 2 : v > 0.22 ? 1 : 0, delay: (i % 26) * 45 + (v * 300) | 0 }));
  }, []);
  const tick = useTicker(active, 1800);

  return (
    <div className={`th th-track ${active ? "run" : ""}`}>
      <div className="th-track-top">
        <div className="th-label">
          <span className="dot" /> company-wise progress
        </div>
        <div className="chips">
          {WINDOWS.map((w, i) => (
            <span key={w} className={i === tick % WINDOWS.length ? "on" : ""}>
              {w}
            </span>
          ))}
        </div>
      </div>
      <ul className="th-track-rows">
        {COMPANIES.map(([name, pct, total], i) => {
          const wobble = ((tick + i) % 3) * 0.04;
          const p = Math.min(0.95, pct + wobble);
          return (
            <li key={name}>
              <span>{name}</span>
              <span className="bar">
                <i style={{ transform: `scaleX(${active ? p : 0})`, transitionDelay: `${i * 90}ms` }} />
              </span>
              <span className="meta">
                {Math.round(p * total)}/{total}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="th-track-heat">
        {cells.map((c, i) => (
          <i key={i} className={`l${c.level}`} style={{ animationDelay: `${c.delay}ms` }} />
        ))}
      </div>
    </div>
  );
}

export const THUMBS = {
  jaagruk: CivicPulse,
  codejudge: Sandbox,
  syncwave: SyncLanes,
  tracker: Heatmap,
};
