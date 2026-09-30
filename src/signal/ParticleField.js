import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * One point cloud for the whole page. Every point carries a position for each
 * of the five scenes, and the vertex shader walks between them as the reader
 * scrolls, so the scene never reloads, it only changes shape:
 *
 *   0 cluster  — a globe of nodes (hero)
 *   1 plane    — a rolling data plane (about)
 *   2 lattice  — a rotating grid of services (work)
 *   3 helix    — a double helix, the career timeline (path)
 *   4 ring     — a torus that closes the loop (contact)
 */

export const SCENES = ["cluster", "plane", "lattice", "helix", "ring"];

function fibonacciSphere(i, n, r) {
  const y = 1 - (i / (n - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r];
}

function buildShapes(n) {
  const shapes = SCENES.map(() => new Float32Array(n * 3));
  const rand = new Float32Array(n);
  const scale = new Float32Array(n);
  const side = Math.ceil(Math.cbrt(n));

  for (let i = 0; i < n; i++) {
    const r = Math.random();
    rand[i] = r;
    scale[i] = r > 0.992 ? 2.2 : 0.55 + Math.random() * 0.8;
    const o = i * 3;

    // 0 · cluster: a shell of nodes, a few inner orbits and loose satellites
    let p;
    if (r < 0.72) {
      p = fibonacciSphere(i % 9000, 9000, 2.2 + (Math.random() - 0.5) * 0.06);
    } else if (r < 0.9) {
      const a = Math.random() * Math.PI * 2;
      const tilt = Math.floor(Math.random() * 3) * 1.05;
      const rr = 1.1 + Math.random() * 0.25;
      p = [Math.cos(a) * rr, Math.sin(a) * rr * Math.cos(tilt), Math.sin(a) * rr * Math.sin(tilt)];
    } else {
      const s = fibonacciSphere(Math.floor(Math.random() * 4000), 4000, 2.6 + Math.random() * 1.6);
      p = s;
    }
    shapes[0].set(p, o);

    // 1 · plane: a wide sheet, height is animated in the shader
    const cols = 160;
    const gx = (i % cols) / (cols - 1);
    const gz = Math.floor(i / cols) / Math.ceil(n / cols);
    shapes[1].set([(gx - 0.5) * 11, -1.2, (gz - 0.5) * 7 - 0.5], o);

    // 2 · lattice: a cube of evenly spaced nodes
    const lx = i % side;
    const ly = Math.floor(i / side) % side;
    const lz = Math.floor(i / (side * side));
    const sp = 3.6 / side;
    shapes[2].set([(lx - side / 2) * sp, (ly - side / 2) * sp, (lz - side / 2) * sp], o);

    // 3 · helix: two strands along x with rungs between them
    const t = (i / n) * Math.PI * 9;
    const x = (i / n - 0.5) * 12;
    if (r < 0.8) {
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const jitter = (Math.random() - 0.5) * 0.12;
      shapes[3].set([x, Math.cos(t + strand) * 1.1 + jitter, Math.sin(t + strand) * 1.1 + jitter], o);
    } else {
      const k = Math.random() * 2 - 1;
      shapes[3].set([x, Math.cos(t) * 1.1 * k, Math.sin(t) * 1.1 * k], o);
    }

    // 4 · ring: a torus with a thin halo, lying flat so the spin turns it in
    // place; the layout tilts it up towards the camera
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const R = 2.5;
    const tube = r < 0.85 ? 0.3 : 0.9 + Math.random() * 0.4;
    shapes[4].set(
      [(R + tube * Math.cos(v)) * Math.cos(u), tube * Math.sin(v), (R + tube * Math.cos(v)) * Math.sin(u)],
      o,
    );
  }
  return { shapes, rand, scale };
}

const vertexShader = /* glsl */ `
  attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4;
  attribute float aRand; attribute float aScale;
  uniform float uProgress; uniform float uTime; uniform float uSize; uniform float uPixelRatio;
  uniform vec3 uMouse; uniform float uMouseForce;
  varying float vRand; varying float vGlow;

  float stage(float k) {
    // stagger each point a little so the morph reads as a wave, not a swap
    float t = clamp((uProgress - k) * 1.35 - aRand * 0.35, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    vec3 s1 = aS1;
    s1.y += sin(s1.x * 0.9 + uTime * 0.8) * 0.35 + cos(s1.z * 1.3 + uTime * 0.6) * 0.25;
    vec3 p = aS0;
    p = mix(p, s1, stage(0.0));
    p = mix(p, aS2, stage(1.0));
    p = mix(p, aS3, stage(2.0));
    p = mix(p, aS4, stage(3.0));

    // a slow drift so nothing is ever perfectly still
    p += vec3(sin(uTime * 0.7 + aRand * 40.0), cos(uTime * 0.5 + aRand * 30.0), sin(uTime * 0.6 + aRand * 20.0)) * 0.025;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec3 d = world.xyz - uMouse;
    float f = smoothstep(1.4, 0.0, length(d.xy)) * uMouseForce;
    world.xyz += normalize(d + 0.0001) * f * 0.55;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    // packets: a sharp travelling pulse lights a point up now and then
    float pulse = pow(max(0.0, sin(uTime * 1.6 + aRand * 60.0)), 24.0);
    vGlow = pulse + f * 0.8;
    vRand = aRand;
    gl_PointSize = uSize * aScale * (1.0 + pulse * 1.4) * uPixelRatio / -mv.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase; uniform vec3 uAccent; uniform float uDim;
  varying float vRand; varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(uBase, uAccent, step(0.93, vRand));
    c = mix(c, uAccent, clamp(vGlow, 0.0, 1.0));
    gl_FragColor = vec4(c, a * (0.55 + vGlow * 0.45) * uDim);
  }
`;

// Where the cloud sits, how big and how bright, per scene. Desktop pushes the
// hero globe right so the headline owns the left of the screen.
const LAYOUT = [
  { x: 2.6, y: 0.1, s: 1.0, dim: 0.9, tilt: 0 },
  { x: 0.0, y: -0.4, s: 1.0, dim: 0.7, tilt: 0 },
  { x: 2.6, y: 0.0, s: 0.9, dim: 0.3, tilt: 0 },
  { x: 0.0, y: 0.0, s: 1.0, dim: 0.32, tilt: 0 },
  { x: 0.0, y: 0.2, s: 1.0, dim: 0.55, tilt: 1.2 },
];

export default function ParticleField({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      mount.classList.add("no-webgl");
      return undefined;
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const count = small ? 7000 : 14000;
    const { shapes, rand, scale } = buildShapes(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    shapes.forEach((s, i) => geometry.setAttribute(`aS${i}`, new THREE.BufferAttribute(s, 3)));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: small ? 34 : 42 },
      uPixelRatio: { value: pixelRatio },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseForce: { value: 0 },
      uBase: { value: new THREE.Color("#d9d6cf") },
      uAccent: { value: new THREE.Color("#ff5b24") },
      uDim: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // pointer → a point on the z=0 plane, which is where the repel happens
    const pointer = new THREE.Vector2(99, 99);
    const target = new THREE.Vector3(99, 99, 0);
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let pointerActive = false;
    const onMove = (e) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      pointerActive = true;
    };
    const onLeave = () => (pointerActive = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let progress = 0;
    let raf = 0;
    let running = true;

    const lerpLayout = (p, key) => {
      const i = Math.min(Math.floor(p), LAYOUT.length - 1);
      const j = Math.min(i + 1, LAYOUT.length - 1);
      const t = p - i;
      return LAYOUT[i][key] + (LAYOUT[j][key] - LAYOUT[i][key]) * t;
    };

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const goal = progressRef.current;
      progress += (goal - progress) * (reduced ? 1 : Math.min(1, dt * 3.2));
      uniforms.uProgress.value = progress;
      uniforms.uTime.value = reduced ? 0 : time;

      const wide = window.innerWidth > 980;
      group.position.x += ((wide ? lerpLayout(progress, "x") : 0) - group.position.x) * 0.06;
      group.position.y += (lerpLayout(progress, "y") - group.position.y) * 0.06;
      const s = lerpLayout(progress, "s") * (wide ? 1 : 0.72);
      group.scale.setScalar(group.scale.x + (s - group.scale.x) * 0.06);
      uniforms.uDim.value = lerpLayout(progress, "dim") * (wide ? 1 : 0.6);

      if (reduced) {
        group.rotation.x = lerpLayout(progress, "tilt");
      } else {
        group.rotation.y = time * 0.08 + pointer.x * 0.15 * (pointerActive ? 1 : 0);
        group.rotation.x =
          lerpLayout(progress, "tilt") + Math.sin(time * 0.1) * 0.12 - pointer.y * 0.1 * (pointerActive ? 1 : 0);
      }

      if (pointerActive) {
        ray.setFromCamera(pointer, camera);
        ray.ray.intersectPlane(plane, target);
        uniforms.uMouse.value.lerp(target, 0.2);
      }
      uniforms.uMouseForce.value += ((pointerActive && !reduced ? 1 : 0) - uniforms.uMouseForce.value) * 0.08;

      renderer.render(scene, camera);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };
    frame();

    // Reduced motion draws on scroll only, instead of every frame
    let onScroll;
    if (reduced) {
      onScroll = () => requestAnimationFrame(frame);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div ref={mountRef} className="sg-field" aria-hidden="true" />;
}
