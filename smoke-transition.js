/**
 * ====================================================================
 * CINEMATIC VOLUMETRIC SMOKE TRANSITION — DARK ASH / CHARCOAL
 * Hardware-accelerated WebGL domain-warping fluid smoke shader.
 *
 * DYNAMIC SCROLL-BASED SIZE EXPANSION & CONTRACTION:
 * - Phase 1: Smoke begins slightly BEFORE Hero completion as a narrow,
 *            compressed horizontal ribbon concealing the incoming divider.
 * - Phase 2: Expands vertically to its full-sized volumetric billow formation
 *            as the divider travels through the middle of the viewport.
 * - Phase 3: Contracts vertically back down to a narrow formation tightly
 *            hugging and concealing the divider as it approaches the top.
 * - Phase 4: Finishes cleanly when the divider reaches the top of the viewport.
 * ====================================================================
 */

(function () {
  'use strict';

  // Vertex Shader: full-screen quad
  const VS_SOURCE = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment Shader: domain-warped fractal fluid smoke with dynamic vertical span
  const FS_SOURCE = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_dividerY; // Screen Y coordinate of the section divider (0.0 bottom -> 1.0 top)
    uniform float u_halfSpan; // Dynamic vertical half-height (0.15 narrow -> 0.55 full-size)
    uniform float u_opacity;  // Master transition opacity
    uniform float u_disperse; // Dispersal factor when works reaches top

    // Fast 2D Hash
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    // Smooth 2D Value Noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    // 6-Octave Fractional Brownian Motion (fBm)
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot * p * 2.05 + vec2(8.5, 5.2);
        a *= 0.5;
      }
      return v;
    }

    // Domain Warping for convective fluid turbulence
    float domainWarpedSmoke(vec2 p, out vec2 q, out vec2 r) {
      q = vec2(fbm(p + vec2(0.0, -u_time * 0.22)),
                fbm(p + vec2(5.2, 1.3 - u_time * 0.18)));

      r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) - vec2(0.0, u_time * 0.28)),
                fbm(p + 3.2 * q + vec2(8.3, 2.8) - vec2(0.0, u_time * 0.24)));

      return fbm(p + 3.6 * r - vec2(0.0, u_time * 0.35));
    }

    void main() {
      if (u_opacity <= 0.001) {
        discard;
      }

      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float aspect = u_resolution.x / u_resolution.y;

      // Coordinate scaling for atmospheric smoke billows (preserves natural texture without stretching)
      vec2 p = vec2(uv.x * aspect, uv.y) * 2.2;

      // Primary fluid smoke simulation
      vec2 q, r;
      float mainSmoke = domainWarpedSmoke(p, q, r);

      // Secondary fine filamentary wisps for feathered edges
      float fineWisps = fbm(p * 3.8 + r * 2.2 - vec2(0.0, u_time * 0.45));
      float smoke = mix(mainSmoke, fineWisps, 0.28);

      // DYNAMIC SECTION BOUNDARY COVERAGE:
      // The smoke is centered DIRECTLY on the section divider (u_dividerY):
      // - 50% extends upward into Hero (deltaY > 0)
      // - 50% extends downward into Works (deltaY < 0)
      float deltaY = uv.y - u_dividerY;

      // Organic turbulent distortion of the boundary mask
      float turbOffset = (q.x - 0.5) * 0.35 + (r.y - 0.5) * 0.26;
      float distFromDivider = abs(deltaY + turbOffset);

      // Dynamic vertical envelope: smoothly expands from 0.15 (narrow)
      // up to 0.55 (full-sized) in the middle, and contracts back to 0.15 near top
      float span = max(0.08, u_halfSpan);
      float boundaryMask = clamp(1.0 - (distFromDivider / span), 0.0, 1.0);
      boundaryMask = smoothstep(0.0, 0.60, boundaryMask);

      // Top dispersion when divider reaches top of viewport
      if (u_disperse > 0.0) {
        boundaryMask *= (1.0 - smoothstep(0.0, 0.90, u_disperse * (1.15 - uv.y)));
      }

      // Density calculation: guaranteed thick and opaque at the divider
      // High multiplier ensures dense, completely opaque charcoal core over the seam line
      float density = clamp(smoke * boundaryMask * 2.4, 0.0, 1.0);

      // Strict Color Palette:
      // Dark Charcoal: #303030 (vec3(48.0 / 255.0))
      // Medium Grey:   #777777 (vec3(119.0 / 255.0))
      // Light Ash:     #D0D0D0 (vec3(208.0 / 255.0))
      vec3 cCharcoal = vec3(48.0 / 255.0);
      vec3 cMedium   = vec3(119.0 / 255.0);
      vec3 cLight    = vec3(208.0 / 255.0);

      // Density-dependent shading:
      // Dense smoke cores -> #303030
      // Rolling cloud midbody -> #777777
      // Thin wispy edges -> #D0D0D0
      vec3 smokeColor = mix(cLight, cMedium, smoothstep(0.12, 0.48, density));
      smokeColor      = mix(smokeColor, cCharcoal, smoothstep(0.48, 0.82, density));

      // Alpha calculation: dense regions reach > 0.98 opacity directly over the divider
      float alpha = smoothstep(0.05, 0.50, density) * u_opacity;

      gl_FragColor = vec4(smokeColor, alpha);
    }
  `;

  class CinematicSmokeTransition {
    constructor() {
      this.layer = document.getElementById('smoke-transition-layer');
      this.canvas = document.getElementById('smoke-canvas');
      if (!this.layer || !this.canvas) return;

      this.heroSection = document.getElementById('hero-section');
      this.worksSection = document.getElementById('works-section');

      this.gl = null;
      this.prog = null;
      this.uRes = null;
      this.uTime = null;
      this.uDividerY = null;
      this.uHalfSpan = null;
      this.uOpacity = null;
      this.uDisperse = null;

      this.width = 0;
      this.height = 0;
      this.dpr = 1;

      // Scroll State
      this.dividerY = 0; // Normalized screen Y of divider: 0.0 (bottom) to 1.0 (top)
      this.targetDividerY = 0;
      this.halfSpan = 0.15; // Vertical half-span: 0.15 (narrow) to 0.55 (full-size)
      this.targetHalfSpan = 0.15;
      this.masterOpacity = 0; // 0.0 to 1.0
      this.targetOpacity = 0;
      this.disperse = 0;
      this.targetDisperse = 0;

      this.startTime = performance.now();
      this.lastTime = performance.now();
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Expose globally for diagnostics
      window.__smoke = this;

      this.init();
    }

    init() {
      this.initWebGL();
      this.resize();
      this.bindEvents();
      this.updateScrollState();
      this.startLoop();
    }

    initWebGL() {
      const gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
                 this.canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
      if (!gl) {
        console.warn('WebGL not supported for smoke transition');
        return;
      }
      this.gl = gl;

      function createShader(gl, type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error('Smoke Shader Error:', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
      if (!vs || !fs) return;

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('Smoke Program Link Error:', gl.getProgramInfoLog(prog));
        return;
      }

      this.prog = prog;
      gl.useProgram(prog);

      // Full-screen quad buffer
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]), gl.STATIC_DRAW);

      const posAttr = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      this.uRes = gl.getUniformLocation(prog, 'u_resolution');
      this.uTime = gl.getUniformLocation(prog, 'u_time');
      this.uDividerY = gl.getUniformLocation(prog, 'u_dividerY');
      this.uHalfSpan = gl.getUniformLocation(prog, 'u_halfSpan');
      this.uOpacity = gl.getUniformLocation(prog, 'u_opacity');
      this.uDisperse = gl.getUniformLocation(prog, 'u_disperse');

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';

      if (this.gl) {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
      }, { passive: true });

      // Native scroll tracking
      window.addEventListener('scroll', () => {
        this.updateScrollState();
      }, { passive: true });

      // Lenis smooth scroll tracking
      if (window.__portfolioLenis) {
        window.__portfolioLenis.on('scroll', () => {
          this.updateScrollState();
        });
      } else {
        const checkLenis = setInterval(() => {
          if (window.__portfolioLenis) {
            window.__portfolioLenis.on('scroll', () => {
              this.updateScrollState();
            });
            clearInterval(checkLenis);
          }
        }, 150);
        setTimeout(() => clearInterval(checkLenis), 5000);
      }

      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) {
        mq.addEventListener('change', (e) => {
          this.reducedMotion = e.matches;
        });
      }
    }

    /**
     * Exact Scroll-Based Timing & Dynamic Size Progression:
     *
     * PHASE 1: Smoke appears slightly BEFORE Hero scroll completion (heroMaxScroll - 28vh).
     *          Narrow, compressed horizontal formation (halfSpan = 0.15) at screen bottom,
     *          concealing the incoming divider.
     *
     * PHASE 2: Expanding vertically as divider travels up the viewport.
     *          Reaches full-sized original billow formation (halfSpan = 0.55) at screen center.
     *
     * PHASE 3: Contracting vertically as divider approaches top of viewport.
     *          Smoothly returns to a narrow formation (halfSpan = 0.15), continuing to
     *          conceal the divider 100%.
     *
     * PHASE 4: Dispersing cleanly when the divider reaches the top of the viewport.
     */
    updateScrollState() {
      const hero = this.heroSection || document.getElementById('scroll-track');
      const works = this.worksSection;
      if (!hero) return;

      const currentY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const heroHeight = hero.offsetHeight || (window.innerHeight * 5);
      const heroMaxScroll = Math.max(1, heroHeight - window.innerHeight); // 400vh
      const worksStart = works ? works.offsetTop : heroHeight; // 500vh
      const windowH = window.innerHeight;

      // Phase 1 Lead-in: smoke starts slightly BEFORE Hero scroll completion (28vh before heroMaxScroll)
      const smokeStart = heroMaxScroll - windowH * 0.28;
      const transitionDistance = Math.max(1, worksStart - heroMaxScroll);
      const disperseBuffer = Math.max(1, windowH * 0.25);

      if (currentY < smokeStart) {
        // Before smoke start: strictly 0% smoke
        this.targetOpacity = 0.0;
        this.targetDividerY = -0.15;
        this.targetHalfSpan = 0.15;
        this.targetDisperse = 0.0;
        return;
      }

      // Distance of divider from top of viewport in pixels:
      // At currentY = worksStart: divider is at 0 (top of viewport)
      // At currentY = heroMaxScroll: divider is at 100vh (bottom of viewport)
      const dividerScreenDist = worksStart - currentY;
      // Normalized screen Y of divider: 0.0 at screen bottom, 1.0 at screen top
      const dividerUV = 1.0 - (dividerScreenDist / windowH);

      if (currentY <= heroMaxScroll) {
        // PHASE 1: Smoke appears slightly before Hero completes
        // Narrow, compressed horizontal formation centered at the bottom
        const t = (currentY - smokeStart) / Math.max(1, heroMaxScroll - smokeStart);
        this.targetOpacity = t * t * (3.0 - 2.0 * t); // smooth cubic fade-in
        this.targetDividerY = Math.max(0.0, dividerUV);
        this.targetHalfSpan = 0.15; // narrow formation (covers ~15vh above and below)
        this.targetDisperse = 0.0;
      } else if (currentY <= worksStart) {
        // PHASE 2 & 3: Divider travels from bottom (UV=0.0) to top (UV=1.0)
        // 100% opaque: divider is NEVER visible
        this.targetOpacity = 1.0;
        this.targetDividerY = dividerUV;
        this.targetDisperse = 0.0;

        // Dynamic vertical expansion and contraction:
        // Peak at dividerUV = 0.5 (middle of screen): expands to 0.55 (full-sized)
        // Near bottom (dividerUV = 0.0): 0.15 (narrow)
        // Near top (dividerUV = 1.0): 0.15 (narrow)
        const normUV = Math.max(0.0, Math.min(1.0, dividerUV));
        const expansionCurve = Math.sin(Math.PI * normUV);
        this.targetHalfSpan = 0.15 + 0.40 * expansionCurve;
      } else if (currentY <= worksStart + disperseBuffer) {
        // PHASE 4: Divider reached top of viewport (UV >= 1.0); finishes dispersing
        const t = (currentY - worksStart) / disperseBuffer; // 0.0 to 1.0
        this.targetDividerY = 1.0 + t * 0.30;
        this.targetDisperse = t;
        // Contracts and stays narrow as it exits top edge
        this.targetHalfSpan = 0.15;
        this.targetOpacity = Math.max(0.0, 1.0 - t * t * (3.0 - 2.0 * t));
      } else {
        // Way past transition: completely dormant
        this.targetOpacity = 0.0;
        this.targetDividerY = 1.5;
        this.targetHalfSpan = 0.15;
        this.targetDisperse = 1.0;
      }
    }

    startLoop() {
      this.lastTime = performance.now();
      const loop = (now) => {
        this.render(now);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    render(now) {
      this.updateScrollState();

      // Fluid interpolation of divider Y, vertical half-span & opacity for seamless scroll scrubbing
      const yDiff = this.targetDividerY - this.dividerY;
      if (Math.abs(yDiff) > 0.0005) {
        this.dividerY += yDiff * 0.20;
      } else {
        this.dividerY = this.targetDividerY;
      }

      const sDiff = this.targetHalfSpan - this.halfSpan;
      if (Math.abs(sDiff) > 0.0005) {
        this.halfSpan += sDiff * 0.20;
      } else {
        this.halfSpan = this.targetHalfSpan;
      }

      const oDiff = this.targetOpacity - this.masterOpacity;
      if (Math.abs(oDiff) > 0.001) {
        this.masterOpacity += oDiff * 0.18;
      } else {
        this.masterOpacity = this.targetOpacity;
      }

      const dDiff = this.targetDisperse - this.disperse;
      if (Math.abs(dDiff) > 0.001) {
        this.disperse += dDiff * 0.20;
      } else {
        this.disperse = this.targetDisperse;
      }

      // If smoke is completely dormant, maintain clean canvas and skip GPU draw
      if (this.masterOpacity <= 0.003) {
        if (this.layer.classList.contains('is-active')) {
          this.layer.classList.remove('is-active');
          this.layer.style.opacity = '0';
          if (this.gl) {
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
          }
        }
        return;
      }

      // Smoke is active
      if (!this.layer.classList.contains('is-active')) {
        this.layer.classList.add('is-active');
      }
      this.layer.style.opacity = this.masterOpacity.toFixed(3);

      if (!this.gl || !this.prog) return;

      const gl = this.gl;
      gl.useProgram(this.prog);

      // Continuous fluid time (slows down gracefully if reduced motion is requested)
      const elapsedTime = this.reducedMotion ? 1.0 : (now - this.startTime) * 0.001;

      gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.uTime, elapsedTime);
      gl.uniform1f(this.uDividerY, this.dividerY);
      gl.uniform1f(this.uHalfSpan, this.halfSpan);
      gl.uniform1f(this.uOpacity, this.masterOpacity);
      gl.uniform1f(this.uDisperse, this.disperse);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  // Self-initialize once DOM is ready
  function initSmokeEngine() {
    new CinematicSmokeTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmokeEngine);
  } else {
    initSmokeEngine();
  }
})();
