export const LINKS = {
  email: "roshan.kharke@gmail.com",
  github: "https://github.com/roshan2498",
  linkedin: "https://linkedin.com/in/nikoCodes",
  leetcode: "https://leetcode.com/nikoCodes",
  instagram: "https://instagram.com/roshan_kharke",
  telegram: "https://t.me/r0shan_cs",
  playlist: "https://open.spotify.com/playlist/3LRGMv8m4JejxYGnMqHBox",
};

export const CAPABILITIES = [
  { k: "Backend", v: "FastAPI, Node.js and microservices at p95 under 200ms." },
  { k: "Cloud", v: "AWS, Kubernetes and Terraform with zero-downtime deploys." },
  { k: "Frontend", v: "React, Angular and Electron apps built to spec." },
  { k: "Quality", v: "Playwright and Jest suites that took coverage to 78%." },
];

export const STACK = [
  "FastAPI", "Node.js", "Python", "TypeScript", "AWS EKS", "Terraform", "Kubernetes",
  "Docker", "React", "Angular", "Electron", "PostgreSQL", "MongoDB", "Redis",
  "Socket.IO", "Playwright", "Jest", "Java",
];

export const STATS = [
  { n: 4, suffix: "+", label: "Years shipping" },
  { n: 10, suffix: "K+", label: "Concurrent users" },
  { n: 35, suffix: "%", label: "Faster queries" },
  { n: 78, suffix: "%", label: "Test coverage" },
];

export const PROJECTS = [
  {
    id: "jaagruk",
    title: "JaagrukBharat",
    kicker: "Civic platform",
    blurb:
      "A civic engagement platform where citizens report and follow local issues. Serves around 20K people a day on Next.js and AWS.",
    stack: ["Next.js", "TypeScript", "AWS"],
    metric: "~20K daily users",
    links: [],
  },
  {
    id: "codejudge",
    title: "CodeJudge",
    kicker: "Code execution engine",
    blurb:
      "A local LeetCode-style judge. User code runs in in-house Docker sandboxes, with no Judge0 or Piston. Containers that exceed the limit are killed and ruled Time Limit Exceeded.",
    stack: ["FastAPI", "React", "Docker"],
    metric: "4 languages · sandboxed",
    links: [{ label: "Source", href: "https://github.com/roshan2498/codejudge" }],
  },
  {
    id: "syncwave",
    title: "SyncWave",
    kicker: "Realtime listening rooms",
    blurb:
      "Create a channel, share the link and listen to YouTube in sync with everyone in it. The host drives play, pause and seek over Socket.IO, and there's live chat. No signup.",
    stack: ["Socket.IO", "Node.js", "React"],
    metric: "Host-authoritative sync",
    links: [{ label: "Source", href: "https://github.com/roshan2498/syncwave" }],
  },
  {
    id: "tracker",
    title: "LeetCode Tracker",
    kicker: "Interview prep tool",
    blurb:
      "Company-wise LeetCode progress with time-window filters. An automated sync pipeline keeps the problem lists fresh, and progress stays in your browser.",
    stack: ["Next.js", "TypeScript", "CI pipeline"],
    metric: "Local-first",
    links: [
      { label: "Live", href: "https://leetcode-tracker-woad.vercel.app" },
      { label: "Source", href: "https://github.com/roshan2498/leetcode-tracker" },
    ],
  },
];

export const PATH = [
  {
    org: "Innovaccer",
    role: "Software Engineer II · Equipp Copilot",
    when: "2025 —",
    body: "FastAPI at p95 <200ms for 10K+ users, AWS EKS with Terraform, and an Electron + React desktop app for an AI-powered pharmacy platform.",
    now: true,
  },
  {
    org: "Biz2x",
    role: "Software Engineer · Fintech",
    when: "2024 — 25",
    body: "Made microservices on AWS 30% faster, built Angular microfrontends across 5+ business units, and unified OAuth / SAML auth with RBAC.",
  },
  {
    org: "EPAM · Google",
    role: "Software Engineer · on-site, Gurugram",
    when: "2021 — 24",
    body: "Built internal tooling for Google in Java 8 and Angular, and a Chrome extension used by 500+ engineers.",
  },
  {
    org: "Delhi Technological University",
    role: "B.Tech, Computer Science & Engineering",
    when: "2016 — 20",
    body: "IEEE publication comparing Random Forest, SVM and neural networks for cardiovascular disease classification.",
  },
];

export const BEYOND = [
  { label: "Powerlifting" },
  { label: "Long runs" },
  { label: "Cooking" },
  { label: "Gym playlist", href: LINKS.playlist },
];
