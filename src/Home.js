import { useEffect } from "react";
import "./Home.css";

const SKILLS = {
  Backend: ["Node.js", "Express", "FastAPI", "Java 8", "REST APIs", "GraphQL", "Microservices"],
  Databases: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions"],
  Frontend: ["React", "Angular", "Next.js", "Electron", "TypeScript", "Tailwind", "Redux"],
  Testing: ["Jest", "Playwright", "React Testing Library", "JUnit", "Mockito"],
  Languages: ["JavaScript", "TypeScript", "Python", "Java", "C/C++"],
};

const EXPERIENCE = [
  {
    company: "Innovaccer",
    role: "Software Engineer II",
    period: "Jun 2025 – Present",
    location: "Noida, India",
    subtitle: "Equipp Copilot — AI-powered Pharmacy Platform",
    highlights: [
      "Built FastAPI backend serving AI clinical recommendations at p95 <200ms for 10K+ concurrent users with circuit breakers and horizontal pod autoscaling.",
      "Architected microservices with MongoDB + PostgreSQL + Redis, reducing query latency by 35% via strategic indexing and connection pooling.",
      "Containerized on AWS (ECS, EKS) with Terraform IaC, enabling zero-downtime deployments and supporting 5x traffic growth.",
      "Built Electron + React desktop app with modular component architecture, reducing pharmacist task-switching time by 40%.",
      "Led design reviews across 3 engineering teams on API versioning and performance trade-offs.",
      "Grew automated test coverage from 42% to 78% with Playwright E2E and Jest unit tests.",
    ],
  },
  {
    company: "Biz2x",
    role: "Software Engineer (A2)",
    period: "Feb 2024 – Jun 2025",
    location: "Noida, India",
    highlights: [
      "Designed microservices backend with MySQL + Redis on AWS (EC2, RDS, ElastiCache), achieving 30% faster API response.",
      "Built scalable Angular microfrontend platform improving deployment velocity across 5+ business units.",
      "Unified authentication and RBAC for OAuth 2.0, SAML, and custom identity providers — reduced auth incidents by 60%.",
      "Integrated Yodlee & Finicity financial APIs processing 50K+ daily aggregation requests at 99.5% uptime.",
    ],
  },
  {
    company: "EPAM Systems",
    role: "Software Engineer (A1)",
    period: "Nov 2021 – Jan 2024",
    location: "Hyderabad, India",
    subtitle: "Google Internal Tooling (On-site, Google Gurugram)",
    highlights: [
      "Built backend APIs for Google using Java 8 and internal tech stack (Critique, Piper, Angular, Borg, Spanner).",
      "Created Chrome Extension reducing manual lookup time by 50% for 500+ internal users.",
      "Achieved >80% unit test coverage with JUnit and Mockito across assigned modules.",
      "Built reusable Angular components with pixel-perfect implementation verified against Figma specs.",
    ],
  },
];

const PROJECTS = [
  {
    title: "JaagrukBharat",
    role: "Lead Developer",
    tech: ["Next.js", "Node.js", "MongoDB", "AWS S3", "CloudFront"],
    description:
      "Civic awareness platform serving ~20K daily active users with <1s load time and 95+ Lighthouse score. Implemented SSR, CDN caching, and automated CI/CD to AWS.",
    link: null,
  },
  {
    title: "E-Commerce Platform",
    role: null,
    tech: ["MongoDB", "Express", "React", "Node.js", "PayPal API", "JWT"],
    description:
      "Full-stack MERN application with RESTful APIs, PayPal payment gateway, and JWT-based RBAC authentication with PCI compliance best practices.",
    link: null,
  },
  {
    title: "Real-Time Chat App",
    role: null,
    tech: ["Node.js", "Express", "Socket.io", "MongoDB"],
    description:
      "WebSocket-based messaging system with room architecture, presence indicators, and optimized connection pooling for low-latency delivery.",
    link: null,
  },
];

export default function Home() {
  useEffect(() => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  return (
    <div className="portfolio">
      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">RK</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="/resume" className="nav-cta">Resume</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="about" className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-greeting">Hi, I'm</p>
            <h1 className="hero-name">Roshan Kharke</h1>
            <p className="hero-title">Full-Stack Software Engineer</p>
            <p className="hero-summary">
              4+ years building scalable cloud-native backend services and modern
              frontend systems. Deep expertise in distributed system design,
              microservices architecture, and data-driven engineering on AWS.
              Previously built internal tooling at Google via EPAM Systems.
            </p>
            <div className="hero-links">
              <div className="hero-cta">
                <a
                  href="https://github.com/roshan2498"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  GitHub
                </a>
                <a href="/resume" className="btn btn-secondary">
                  Resume
                </a>
              </div>
              <div className="hero-socials">
                <a href="https://linkedin.com/in/nikoCodes" target="_blank" rel="noreferrer">LinkedIn</a>
                <span>·</span>
                <a href="https://leetcode.com/nikoCodes" target="_blank" rel="noreferrer">LeetCode</a>
                <span>·</span>
                <a href="https://instagram.com/roshan_kharke" target="_blank" rel="noreferrer">Instagram</a>
                <span>·</span>
                <a href="mailto:roshan.kharke@gmail.com">Email</a>
              </div>
            </div>
          </div>
          <div className="hero-instagram">
            <behold-widget feed-id="Qbdaywcn9ucVNu2WBP4H"></behold-widget>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {EXPERIENCE.map((job, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="job-header">
                    <div>
                      <h3 className="job-company">{job.company}</h3>
                      <p className="job-role">{job.role}</p>
                      {job.subtitle && (
                        <p className="job-subtitle">{job.subtitle}</p>
                      )}
                    </div>
                    <div className="job-meta">
                      <span>{job.period}</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <ul className="job-highlights">
                    {job.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h4 className="skill-category-label">{category}</h4>
                <div className="skill-tags">
                  {items.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={i} className="project-card">
                <h3 className="project-name">{p.title}</h3>
                {p.role && <p className="project-role">{p.role}</p>}
                <p className="project-desc">{p.description}</p>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION + PUBLICATIONS */}
      <section className="section section-alt">
        <div className="container">
          <div className="edu-pub-grid">
            <div>
              <h2 className="section-title">Education</h2>
              <div className="edu-card">
                <h3>B.Tech in Computer Science</h3>
                <p>Delhi Technological University</p>
                <p className="muted">2016 – 2020 · CGPA: 7.32</p>
              </div>
            </div>
            <div>
              <h2 className="section-title">Publications</h2>
              <div className="pub-card">
                <h3>
                  Cardiovascular Disease Classification Using Different
                  Algorithms
                </h3>
                <p className="muted">Sep 2020 · IEEE</p>
                <p>
                  Comparative ML study evaluating Random Forest, SVM, and
                  Neural Networks on the UCI Cleveland dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOBBIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Beyond Code</h2>
          <div className="beyond-grid">
            <div className="hobbies-grid">
              {[
                { emoji: "🏋️", label: "Powerlifting", desc: "Competing in strength sports and chasing PRs." },
                { emoji: "🏃", label: "Running", desc: "Long-distance runs to clear the mind and build endurance." },
                { emoji: "👨‍🍳", label: "Cooking", desc: "Experimenting with cuisines and perfecting recipes." },
                { emoji: "✈️", label: "Travelling", desc: "Collecting experiences across cities and cultures." },
              ].map((h) => (
                <div key={h.label} className="hobby-card">
                  <span className="hobby-emoji">{h.emoji}</span>
                  <h4 className="hobby-label">{h.label}</h4>
                  <p className="hobby-desc">{h.desc}</p>
                </div>
              ))}
            </div>
            <div className="spotify-wrap">
              <p className="spotify-label">🎧 Current Playlist</p>
              <iframe
                src="https://open.spotify.com/embed/playlist/3LRGMv8m4JejxYGnMqHBox?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Roshan's Gym Playlist"
                className="spotify-iframe"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p className="footer-name">Roshan Kharke</p>
          <div className="footer-links">
            <a
              href="https://github.com/roshan2498"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/nikoCodes"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://leetcode.com/nikoCodes"
              target="_blank"
              rel="noreferrer"
            >
              LeetCode
            </a>
            <a href="mailto:roshan.kharke@gmail.com">Email</a>
            <a
              href="https://instagram.com/roshan_kharke"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a href="https://t.me/r0shan_cs" target="_blank" rel="noreferrer">
              Telegram
            </a>
          </div>
          <p className="footer-copy">© 2026 Roshan Kharke</p>
        </div>
      </footer>
    </div>
  );
}
