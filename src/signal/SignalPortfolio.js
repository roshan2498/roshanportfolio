import { useEffect, useRef, useState } from "react";
import ParticleField, { SCENES } from "./ParticleField";
import { THUMBS } from "./Thumbs";
import { useInView, useScramble, prefersReducedMotion } from "./hooks";
import { LINKS, CAPABILITIES, STACK, STATS, PROJECTS, PATH, BEYOND } from "./content";
import "./signal.css";

const NAV = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.12 }, true);
  return (
    <Tag
      ref={ref}
      className={`rv ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Scramble({ text, start, className, duration }) {
  const out = useScramble(text, start, duration);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

function SectionHead({ index, label, title }) {
  const [ref, inView] = useInView({ threshold: 0.4 }, true);
  return (
    <header className="sg-head" ref={ref}>
      <span className="sg-eyebrow">
        <b>{index}</b> / <Scramble text={label} start={inView} />
      </span>
      <h2 className={`rv ${inView ? "in" : ""}`}>{title}</h2>
    </header>
  );
}

function Counter({ n, suffix }) {
  const [ref, inView] = useInView({ threshold: 0.5 }, true);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setV(n);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1400);
      setV(Math.round(n * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, n]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------- telemetry */
function Telemetry({ scene }) {
  const [now, setNow] = useState(() => Date.now());
  const bootRef = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const up = Math.floor((now - bootRef.current) / 1000);
  const hh = String(Math.floor(up / 3600)).padStart(2, "0");
  const mm = String(Math.floor((up % 3600) / 60)).padStart(2, "0");
  const ss = String(up % 60).padStart(2, "0");
  const p95 = 160 + ((now / 1000) % 7) * 4 + Math.round(Math.sin(now / 1300) * 9);
  const local = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(now);

  return (
    <aside className="sg-hud" aria-hidden="true">
      <div>
        <span className="dot" /> sys.status <b>nominal</b>
      </div>
      <div>
        p95 <b>{Math.round(p95)}ms</b>
      </div>
      <div>
        uptime <b>{`${hh}:${mm}:${ss}`}</b>
      </div>
      <div>
        noida <b>{local} IST</b>
      </div>
      <div>
        scene <b>{String(scene + 1).padStart(2, "0")}/{SCENES.length} {SCENES[scene]}</b>
      </div>
    </aside>
  );
}

/* --------------------------------------------------------------------- work */
function ProjectCard({ project, index }) {
  const Thumb = THUMBS[project.id];
  const [ref, inView] = useInView({ threshold: 0.05 });
  const cardRef = useRef(null);

  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const el = cardRef.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Reveal as="article" className="sg-card-wrap" delay={(index % 2) * 120}>
      <div className="sg-card" ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="sg-thumb" ref={ref}>
          <Thumb active={inView} />
          <span className="sg-glare" />
        </div>
        <div className="sg-card-body">
          <div className="sg-card-top">
            <span className="sg-idx">{String(index + 1).padStart(2, "0")}</span>
            <span className="sg-kicker">{project.kicker}</span>
            <span className="sg-metric">{project.metric}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.blurb}</p>
          <div className="sg-card-foot">
            <ul className="sg-tags">
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="sg-card-links">
              {project.links.length === 0 && <span className="sg-private">Private repo</span>}
              {project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* --------------------------------------------------------------------- page */
export default function SignalPortfolio() {
  const progressRef = useRef(0);
  const [scene, setScene] = useState(0);
  const [booted, setBooted] = useState(false);
  const [boot, setBoot] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Roshan Kharke — Full-Stack Software Engineer";
  }, []);

  // boot counter, then the curtain lifts
  useEffect(() => {
    if (prefersReducedMotion()) {
      setBoot(100);
      setBooted(true);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1100);
      setBoot(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setBooted(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // scroll → scene progress. Each section holds its shape and morphs into the
  // next over the last stretch before the next one arrives.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-scene]"));
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.55;
      let p = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        const next = sections[i + 1] ? sections[i + 1].offsetTop : top + sections[i].offsetHeight;
        if (probe >= top && probe < next) {
          const local = (probe - top) / (next - top);
          const t = Math.min(1, Math.max(0, (local - 0.6) / 0.4));
          p = i + (i < sections.length - 1 ? t * t * (3 - 2 * t) : 0);
          break;
        }
        if (probe >= next) p = i;
      }
      progressRef.current = p;
      setScene(Math.min(SCENES.length - 1, Math.round(p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`sg ${booted ? "booted" : ""}`}>
      <ParticleField progressRef={progressRef} />
      <div className="sg-grain" aria-hidden="true" />

      <div className={`sg-boot ${booted ? "gone" : ""}`} aria-hidden="true">
        <span>RK</span>
        <span className="sg-boot-line">
          <i style={{ transform: `scaleX(${boot / 100})` }} />
        </span>
        <span className="sg-boot-num">spinning up nodes · {String(boot).padStart(3, "0")}%</span>
      </div>

      <nav className={`sg-nav ${menuOpen ? "open" : ""}`}>
        <a href="#top" className="sg-mark" aria-label="Roshan Kharke, home">
          RK<span>.</span>
        </a>
        <button className="sg-burger" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label="Menu">
          <span />
          <span />
        </button>
        <div className="sg-nav-links">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className={scene === i + 1 ? "on" : ""}>
              <b>0{i + 1}</b> {n.label}
            </a>
          ))}
          <a href="/resume" className="sg-nav-cta">
            Resume <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <ol className="sg-rail" aria-hidden="true">
        {SCENES.map((s, i) => (
          <li key={s} className={scene === i ? "on" : ""}>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <Telemetry scene={scene} />

      <main>
        {/* 00 · hero */}
        <section className="sg-hero" id="top" data-scene="0">
          <div className="sg-wrap">
            <p className="sg-avail">
              <span className="dot" /> Software Engineer II at Innovaccer · open to hard problems
            </p>
            <h1>
              <Scramble className="l1" text="Quiet systems" start={booted} duration={800} />
              <Scramble className="l2" text="that carry" start={booted} duration={900} />
              <span className="l3">
                <em>real load.</em>
              </span>
            </h1>
            <div className="sg-hero-foot">
              <p className="sg-lede">
                I'm <strong>Roshan Kharke</strong>, a full-stack engineer who has spent 4+ years building
                cloud-native backends, AI platforms and the frontends that sit on top of them.
              </p>
              <div className="sg-cta">
                <a href="#work" className="sg-btn primary">
                  See the work
                </a>
                <a href={`mailto:${LINKS.email}`} className="sg-btn">
                  Get in touch
                </a>
              </div>
            </div>
            <ul className="sg-caps">
              {CAPABILITIES.map((c, i) => (
                <li key={c.k}>
                  <span>0{i + 1}</span>
                  <b>{c.k}</b>
                  <p>{c.v}</p>
                </li>
              ))}
            </ul>
          </div>
          <a href="#about" className="sg-scroll" aria-label="Scroll to about">
            <span>scroll</span>
            <i />
          </a>
        </section>

        <div className="sg-marquee" aria-label="Tech stack">
          <div className="sg-marquee-track">
            {[0, 1].map((k) => (
              <span key={k} aria-hidden={k === 1}>
                {STACK.map((s) => (
                  <b key={s}>
                    {s}
                    <i>✳</i>
                  </b>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* 01 · about */}
        <section className="sg-section sg-about" id="about" data-scene="1">
          <div className="sg-wrap">
            <SectionHead index="01" label="about" title={<>Distributed systems, built to <em>outlast</em> the traffic.</>} />
            <div className="sg-about-grid">
              <Reveal className="sg-about-copy">
                <p>
                  I build scalable backend services and the interfaces on top of them. My work centres on distributed
                  system design, microservices and data-driven engineering on AWS, from API contracts down to the
                  indexes that keep them fast.
                </p>
                <p>
                  Today I work on <strong>Equipp Copilot</strong> at Innovaccer, an AI-powered pharmacy platform. Before
                  that I built fintech microfrontends at Biz2x, and internal tooling for Google on-site in Gurugram
                  through EPAM Systems.
                </p>
                <p className="sg-principles">
                  <span>Measure first</span>
                  <span>Design for failure</span>
                  <span>Test what matters</span>
                  <span>Leave it easier to change</span>
                </p>
              </Reveal>
              <ul className="sg-stats">
                {STATS.map((s, i) => (
                  <Reveal as="li" key={s.label} delay={i * 90}>
                    <strong>
                      <Counter n={s.n} suffix={s.suffix} />
                    </strong>
                    <span>{s.label}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 02 · work */}
        <section className="sg-section sg-work" id="work" data-scene="2">
          <div className="sg-wrap">
            <SectionHead index="02" label="selected work" title={<>Things I've <em>shipped</em> and still run.</>} />
            <div className="sg-grid">
              {PROJECTS.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
            <Reveal className="sg-more">
              <a href={LINKS.github} target="_blank" rel="noreferrer">
                More on GitHub <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* 03 · path */}
        <section className="sg-section sg-path" id="path" data-scene="3">
          <div className="sg-wrap">
            <SectionHead index="03" label="path" title={<>Three companies. Four years. <em>One way</em> of working.</>} />
            <ol className="sg-timeline">
              {PATH.map((p, i) => (
                <Reveal as="li" key={p.org} delay={i * 70} className={p.now ? "now" : ""}>
                  <span className="when">{p.when}</span>
                  <div className="who">
                    <h3>
                      {p.org}
                      {p.now && <span className="sg-now">now</span>}
                    </h3>
                    <span className="role">{p.role}</span>
                  </div>
                  <p>{p.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 04 · contact */}
        <section className="sg-section sg-contact" id="contact" data-scene="4">
          <div className="sg-wrap">
            <span className="sg-eyebrow">
              <b>04</b> / contact
            </span>
            <Reveal as="h2" className="sg-contact-title">
              Let's build something <em>that holds.</em>
            </Reveal>
            <Reveal as="p" className="sg-contact-lede" delay={100}>
              I'm open to hard problems in distributed systems, AI platforms and developer tooling.
            </Reveal>
            <Reveal delay={180}>
              <a className="sg-mail" href={`mailto:${LINKS.email}`}>
                {LINKS.email}
                <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal className="sg-socials" delay={240}>
              <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={LINKS.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={LINKS.telegram} target="_blank" rel="noreferrer">Telegram</a>
              <a href="/resume">Resume</a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="sg-footer">
        <div className="sg-wrap">
          <div className="sg-beyond">
            <span>Beyond code</span>
            {BEYOND.map((b) =>
              b.href ? (
                <a key={b.label} href={b.href} target="_blank" rel="noreferrer">
                  {b.label} ↗
                </a>
              ) : (
                <span key={b.label}>{b.label}</span>
              ),
            )}
          </div>
          <div className="sg-colophon">
            <span>© {new Date().getFullYear()} Roshan Kharke · Noida, India</span>
            <span>Rendered live · {typeof window !== "undefined" && window.innerWidth < 760 ? "7,000" : "14,000"} nodes in WebGL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
