/**
 * ====================================================================
 * GAME DEVELOPER PORTFOLIO - SECTION 2: MY WORKS (CIRCULAR GALLERY)
 * Modular, maintainable interactive circular gallery with split-screen details
 * ====================================================================
 */

(function () {
  'use strict';

  // ==================================================================
  // 1. CENTRALIZED PROJECT DATA REPOSITORY (Section 3 & 12)
  // Easy to modify, replace thumbnails, text, and technical details
  // ==================================================================
  const PROJECTS_DATA = [
    {
      id: '01',
      title: 'VOID RUSH',
      subtitle: 'A FAST-PACED 3D ACTION GAME BUILT IN UNITY.',
      category: 'GAME PROJECT',
      tags: ['UNITY', 'C#', '3D', 'ACTION', 'PHYSICS'],
      artwork: 'assets/projects/void-rush.jpg',
      themeColor: '#d31a28',
      overview: 'Void Rush is a high-octane 3D action title centered on momentum-driven character traversal, aerial dash combat, and precision platforming. The project features custom kinematic physics controllers, responsive input buffering, volumetric atmospheric lighting, and a dynamic camera system that seamlessly adjusts based on velocity and encounter intensity.',
      gameplayImages: [
        'assets/projects/void-rush-gp1.jpg',
        'assets/projects/void-rush-gp2.jpg',
        'assets/projects/void-rush-gp3.jpg'
      ],
      process: 'Developed using Unity 2022 LTS with URP. Core mechanics were prototyped in iterative graybox phases to dial in jump curves, gravity scaling, and ledge detection. Custom HLSL shaders drive the celestial moon atmosphere, energy rift portals, and velocity particle trails.',
      techStack: {
        'Engine': 'Unity 2022 LTS (URP)',
        'Language': 'C# (Kinematic Controllers)',
        'Key Systems': 'State Machine, Input Buffer, Shaders',
        'Status': 'Featured Release'
      }
    },
    {
      id: '02',
      title: 'RACING GAME',
      subtitle: 'HIGH-SPEED ARCADE RACING SIMULATOR IN UNREAL ENGINE 5.',
      category: 'GAME PROJECT',
      tags: ['UNREAL 5', 'C++', 'PHYSICS', 'CHAOS VEHICLES'],
      artwork: 'assets/projects/racing-game.jpg',
      themeColor: '#1a1a1a',
      overview: 'An arcade-simulation hybrid racing experience delivering intense slipstream drafting, high-speed mountain switchbacks, and responsive tire grip modeling. The project features customized Chaos Vehicle dynamics, dynamic day-to-dusk celestial transitions, and telemetry data recording for competitive ghost-lap races.',
      gameplayImages: [
        'assets/projects/racing-game-gp1.jpg',
        'assets/projects/racing-game-gp2.jpg',
        'assets/projects/racing-game-gp3.jpg'
      ],
      process: 'Built on Unreal Engine 5 using C++ for the underlying vehicle simulation physics and suspension damping. Designed custom tire slip curves to reward deliberate weight transfers during high-speed cornering, with Lumen real-time lighting for asphalt reflections.',
      techStack: {
        'Engine': 'Unreal Engine 5.3',
        'Language': 'C++ & Blueprints',
        'Key Systems': 'Chaos Physics, Lumen, Ghost Telemetry',
        'Status': 'Playable Demo'
      }
    },
    {
      id: '03',
      title: 'HORROR GAME',
      subtitle: 'PSYCHOLOGICAL FIRST-PERSON SURVIVAL HORROR EXPERIENCE.',
      category: 'GAME PROJECT',
      tags: ['UNITY', 'C#', 'SPATIAL AUDIO', 'AI BEHAVIOR'],
      artwork: 'assets/projects/horror-game.jpg',
      themeColor: '#1c1e22',
      overview: 'Set within an abandoned sub-arctic research observatory surrounded by pitch-black pine forests, players navigate dense fog and deteriorating facilities using only an audio-frequency sensor and a flickering torch. Focuses heavily on environmental tension, adaptive sound design, and psychological uncertainty.',
      gameplayImages: [
        'assets/projects/horror-game-gp1.jpg',
        'assets/projects/horror-game-gp2.jpg',
        'assets/projects/horror-game-gp3.jpg'
      ],
      process: 'Employed Unity’s High Definition Render Pipeline (HDRP) with volumetric fog and volumetric cloud shadows. Developed a custom binaural spatial audio occlusion system and finite-state creature AI that hunts using sound propagation rather than raycasts.',
      techStack: {
        'Engine': 'Unity 2022 (HDRP)',
        'Language': 'C# (A* NavMesh AI)',
        'Key Systems': 'Volumetric Fog, 3D Sound Occlusion',
        'Status': 'Vertical Slice'
      }
    },
    {
      id: '04',
      title: 'PARKOUR GAME',
      subtitle: 'MOMENTUM-BASED FREERUNNING PLATFORMER IN MINIMALIST CITY.',
      category: 'GAME PROJECT',
      tags: ['UNREAL 5', 'MOTION WARPING', 'PLATFORMER', 'ANIMATION'],
      artwork: 'assets/projects/parkour-game.jpg',
      themeColor: '#18181b',
      overview: 'A fluid first-person freerunning title set in a stark brutalist architectural playground. Players chain wall-runs, cat leaps, ledge vaults, and momentum slides to maintain peak speed through sprawling vertical courses.',
      gameplayImages: [
        'assets/projects/parkour-game-gp1.jpg',
        'assets/projects/parkour-game-gp2.jpg',
        'assets/projects/parkour-game-gp3.jpg'
      ],
      process: 'Utilized Unreal Engine 5’s Motion Warping system to dynamically snap character hands and feet to varied geometry without rigid predefined trigger volumes. Features custom camera tilt shaders that accentuate velocity and angular inertia.',
      techStack: {
        'Engine': 'Unreal Engine 5.2',
        'Language': 'Blueprints & C++',
        'Key Systems': 'Motion Warping, Procedural Ledges',
        'Status': 'Early Access Demo'
      }
    },
    {
      id: '05',
      title: 'MAZE GAME',
      subtitle: 'NON-EUCLIDEAN SPATIAL PUZZLE & LABYRINTH ARCHITECTURE.',
      category: 'GAME PROJECT',
      tags: ['UNITY', 'STENCIL SHADERS', 'PUZZLE', 'MATH'],
      artwork: 'assets/projects/maze-game.jpg',
      themeColor: '#22242a',
      overview: 'A mind-bending spatial puzzle game set in an impossible labyrinth where corridors loop back into themselves, doorways lead to rooms larger than their buildings, and gravity re-orients based on optical perspective.',
      gameplayImages: [
        'assets/projects/maze-game-gp1.jpg',
        'assets/projects/maze-game-gp2.jpg',
        'assets/projects/maze-game-gp3.jpg'
      ],
      process: 'Developed using custom GPU stencil buffer shaders and recursive render targets to achieve seamless portal transitions with zero teleportation seams or visual tearing. Player momentum and orientation are translated smoothly across non-Euclidean boundaries.',
      techStack: {
        'Engine': 'Unity 2022 LTS',
        'Language': 'C# & HLSL',
        'Key Systems': 'Stencil Portals, Oblique Projection Matrix',
        'Status': 'Prototype Complete'
      }
    },
    {
      id: '06',
      title: 'UFO SPACESHIP GAME',
      subtitle: 'ZERO-G 6DOF SCI-FI COMBAT & EXPLORATION SIMULATOR.',
      category: 'GAME PROJECT',
      tags: ['UNREAL 5', 'C++', 'SCI-FI', '6DOF', 'PHYSICS'],
      artwork: 'assets/projects/ufo-game.jpg',
      themeColor: '#141720',
      overview: 'Piloting an experimental scout disc craft through dense asteroid belts and derelict alien mega-structures. Features full 6-degrees-of-freedom inertial physics, omnidirectional thruster management, and orbital dogfights.',
      gameplayImages: [
        'assets/projects/ufo-game-gp1.jpg',
        'assets/projects/ufo-game-gp2.jpg',
        'assets/projects/ufo-game-gp3.jpg'
      ],
      process: 'Crafted with custom Newtonian inertial dynamics in C++. Thrusters apply authentic torque vectors to the rigid-body hull. Particle systems simulate ion engine plumes, cosmic radiation belts, and laser projectile deflections.',
      techStack: {
        'Engine': 'Unreal Engine 5.3',
        'Language': 'C++ (Rigid-body Mechanics)',
        'Key Systems': 'Newtonian 6DOF, Niagara FX, Nanite',
        'Status': 'In Active Production'
      }
    }
  ];

  // ==================================================================
  // 2. INTERACTIVE BLACK BUBBLE PARTICLES BACKGROUND (Section 9)
  // Subtle, lightweight, floating bubbles responding gently to cursor
  // ==================================================================
  class BubbleParticlesSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -2000, y: -2000, isOver: false };
      this.width = 0;
      this.height = 0;
      this.animId = null;
      this.isActive = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      this.init();
    }

    init() {
      this.resize();
      const count = Math.min(45, Math.max(25, Math.floor(window.innerWidth / 38)));
      this.particles = [];

      for (let i = 0; i < count; i++) {
        const isLarge = Math.random() < 0.16;
        const radius = isLarge ? (10 + Math.random() * 8) : (2.5 + Math.random() * 4.5);
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          baseVx: (Math.random() - 0.5) * 0.35,
          baseVy: -(0.25 + Math.random() * 0.45), // natural gentle upward float
          vx: 0,
          vy: 0,
          r: radius,
          baseAlpha: isLarge ? (0.05 + Math.random() * 0.08) : (0.08 + Math.random() * 0.16),
          isLarge: isLarge,
          pulse: Math.random() * Math.PI * 2
        });
      }

      // Mouse move tracking inside section 2
      const section = document.getElementById('works-section');
      if (section && !this.isTouch) {
        section.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
          this.mouse.isOver = true;
        }, { passive: true });

        section.addEventListener('mouseleave', () => {
          this.mouse.isOver = false;
          this.mouse.x = -2000;
          this.mouse.y = -2000;
        }, { passive: true });
      }

      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width || window.innerWidth;
      this.height = rect.height || window.innerHeight;

      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';

      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    start() {
      if (!this.isActive) {
        this.isActive = true;
        this.render();
      }
    }

    stop() {
      this.isActive = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    render() {
      if (!this.isActive) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Cursor gentle interaction (push away gently)
        if (this.mouse.isOver && !this.reducedMotion) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 135;

          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 0.9;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Friction damping back toward gentle base floating speed
        p.vx *= 0.93;
        p.vy *= 0.93;

        p.x += p.baseVx + p.vx;
        p.y += p.baseVy + p.vy;

        // Wrap around boundaries
        if (p.y < -25) p.y = this.height + 20;
        if (p.y > this.height + 25) p.y = -20;
        if (p.x < -25) p.x = this.width + 20;
        if (p.x > this.width + 25) p.x = -20;

        // Subtle alpha breathing
        p.pulse += 0.02;
        const currentAlpha = Math.max(0.04, Math.min(0.25, p.baseAlpha + Math.sin(p.pulse) * 0.02));

        // Draw bubble
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(18, 18, 18, ${currentAlpha})`;
        ctx.fill();

        // For larger bubbles: add soft rim & specular micro-gleam for volume
        if (p.isLarge) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(18, 18, 18, ${currentAlpha * 1.4})`;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 2.2})`;
          ctx.fill();
        }
      }

      this.animId = requestAnimationFrame(() => this.render());
    }
  }

  // ==================================================================
  // 3. CIRCULAR ORBITAL GALLERY CONTROLLER (Section 3, 4, 5, 6, 7, 8)
  // Complete circular orbit geometry, smooth scroll scrubbing, card clicks
  // ==================================================================
  class CircularGalleryController {
    constructor() {
      this.stage = document.getElementById('circular-gallery-stage');
      this.cardsContainer = document.getElementById('cards-orbit-container');
      this.orbitArcCircle = document.getElementById('orbit-circle-guide');
      this.detailsPanel = document.getElementById('project-details-panel');
      this.detailsContent = document.getElementById('details-inner-content');
      this.closeBtn = document.getElementById('details-close-btn');
      this.worksSection = document.getElementById('works-section');
      this.heroSection = document.getElementById('hero-section') || document.getElementById('scroll-track');

      this.cardElements = [];
      this.targetProgress = 0;
      this.currentProgress = 0;
      this.isSplitMode = false;
      this.activeProjectIndex = 0;
      this.focusedCardIndex = 0;

      // Orbit Parameters (dynamically calculated on resize)
      this.cx = 0;
      this.cy = 0;
      this.radius = 0;
      this.deltaAngle = 22; // 22 degrees between projects along the circular path

      this.init();
    }

    init() {
      if (!this.stage || !this.cardsContainer) return;

      this.createCardsDOM();
      this.updateGeometry();
      this.bindEvents();
      this.updateCardsPosition(0, true);
    }

    createCardsDOM() {
      this.cardsContainer.innerHTML = '';
      this.cardElements = [];

      PROJECTS_DATA.forEach((proj, idx) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-index', idx);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View details for ${proj.title}`);

        card.innerHTML = `
          <div class="card-inner">
            <div class="card-meta">
              <span class="card-num">${proj.id}</span>
              <h3 class="card-title">${proj.title}</h3>
            </div>
            <span class="card-plus-icon">+</span>
          </div>
          <img class="card-artwork-thumb" src="${proj.artwork}" alt="${proj.title} artwork" loading="lazy" />
        `;

        // Click handler: opens project in split-screen mode
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.isSplitMode && this.activeProjectIndex === idx) return;
          this.openProjectDetails(idx);
        });

        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openProjectDetails(idx);
          }
        });

        this.cardsContainer.appendChild(card);
        this.cardElements.push(card);
      });
    }

    updateGeometry() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Responsive circular orbital path matching the reference
      if (w >= 1400) {
        this.cx = w * 0.20;
        this.cy = h * 0.50;
        this.radius = h * 0.58;
      } else if (w >= 1024) {
        this.cx = w * 0.18;
        this.cy = h * 0.50;
        this.radius = h * 0.55;
      } else if (w >= 768) {
        this.cx = w * 0.12;
        this.cy = h * 0.50;
        this.radius = w * 0.52;
      } else {
        // Mobile layout
        this.cx = -w * 0.10;
        this.cy = h * 0.55;
        this.radius = w * 0.72;
      }

      // Update SVG circular guide line path
      if (this.orbitArcCircle) {
        this.orbitArcCircle.setAttribute('cx', this.cx);
        this.orbitArcCircle.setAttribute('cy', this.cy);
        this.orbitArcCircle.setAttribute('r', this.radius);
      }
    }

    // Mathematical orbital positioning along the circle
    updateCardsPosition(progress, force = false) {
      const count = PROJECTS_DATA.length;
      const totalTravel = (count - 1) * this.deltaAngle; // Total angular travel from Project 0 to Project 5

      // Current center angle offset
      const currentScrollAngle = progress * totalTravel;

      let closestDist = Infinity;
      let closestIdx = 0;

      this.cardElements.forEach((card, idx) => {
        // Angle of card along the circular path:
        // When progress aligns with card idx: angle = 0deg (3 o'clock focus position!)
        const thetaDeg = (idx * this.deltaAngle) - currentScrollAngle;
        const thetaRad = (thetaDeg * Math.PI) / 180;

        const distFromFocus = Math.abs(thetaDeg);
        if (distFromFocus < closestDist) {
          closestDist = distFromFocus;
          closestIdx = idx;
        }

        // Only render cards within reasonable visible arc (-70deg to +70deg)
        if (thetaDeg < -75 || thetaDeg > 75) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.visibility = 'hidden';
          return;
        }

        card.style.visibility = 'visible';

        // Coordinates along the right-half circular path
        const cardW = card.offsetWidth || 320;
        const cardH = card.offsetHeight || 175;

        const x = this.cx + this.radius * Math.cos(thetaRad) - cardW * 0.5;
        const y = this.cy + this.radius * Math.sin(thetaRad) - cardH * 0.5;

        // Tangent rotation following circular trajectory
        // subtle -2deg baseline tilt matching the reference mockup
        const rotDeg = (thetaDeg * 0.75) - 2;

        // Smooth opacity falloff near viewport edges
        let opacity = 1;
        if (Math.abs(thetaDeg) > 42) {
          opacity = Math.max(0, 1 - (Math.abs(thetaDeg) - 42) / 28);
        }

        // Scale & depth
        const scale = distFromFocus < 8 ? 1.02 : Math.max(0.92, 1 - (distFromFocus / 90) * 0.12);

        // Z-Index: cards higher up overlap cards lower down like in mockup, or focus card gets top priority
        const zIndex = distFromFocus < 8 ? 40 : Math.max(5, 30 - idx);

        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotDeg.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex;

        // Pointer events only for visible interactive cards
        if (!this.isSplitMode) {
          card.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
        } else {
          card.style.pointerEvents = 'none'; // in split mode, the whole gallery acts as return-click
        }
      });

      this.focusedCardIndex = closestIdx;

      // Update ambient orbit numbers matching position
      const numTop = document.getElementById('orbit-num-top');
      const numBottom = document.getElementById('orbit-num-bottom');
      if (numTop && numBottom) {
        const topIdx = (this.focusedCardIndex + 5) % count;
        const btmIdx = (this.focusedCardIndex + 1) % count;
        numTop.textContent = PROJECTS_DATA[topIdx].id;
        numBottom.textContent = PROJECTS_DATA[btmIdx].id;
      }
    }

    openProjectDetails(index) {
      if (index < 0 || index >= PROJECTS_DATA.length) return;

      this.activeProjectIndex = index;
      this.isSplitMode = true;

      const proj = PROJECTS_DATA[index];

      // Highlight selected card
      this.cardElements.forEach((c, idx) => {
        if (idx === index) {
          c.classList.add('is-selected-card');
        } else {
          c.classList.remove('is-selected-card');
        }
      });

      // Populate details panel content
      this.renderDetailsContent(proj);

      // Trigger split-screen transformation
      this.stage.classList.add('is-split-mode');
      this.worksSection.classList.add('is-split-mode');
      this.detailsPanel.classList.add('is-active');

      // Ensure Lenis recognises this nested scroll container
      this.detailsPanel.setAttribute('data-lenis-prevent', 'true');
      this.detailsPanel.setAttribute('data-lenis-prevent-wheel', 'true');
      this.detailsPanel.setAttribute('data-lenis-prevent-touch', 'true');

      // Scroll details panel to top
      this.detailsPanel.scrollTop = 0;

      // Stop page scrolling with Lenis so details panel can scroll independently without scroll chaining
      if (window.__portfolioLenis) {
        window.__portfolioLenis.stop();
      }

      // Focus panel for immediate keyboard scroll accessibility without shifting scroll
      try {
        this.detailsPanel.focus({ preventScroll: true });
      } catch (err) {}
    }

    closeProjectDetails() {
      if (!this.isSplitMode) return;

      this.isSplitMode = false;

      // Remove active card highlight
      this.cardElements.forEach(c => c.classList.remove('is-selected-card'));

      // Reverse gallery transformation
      this.stage.classList.remove('is-split-mode');
      this.worksSection.classList.remove('is-split-mode');
      this.detailsPanel.classList.remove('is-active');

      // Re-enable page scrolling
      if (window.__portfolioLenis) {
        window.__portfolioLenis.start();
      }

      // Restore card pointer events
      this.updateCardsPosition(this.currentProgress);
    }

    renderDetailsContent(proj) {
      if (!this.detailsContent) return;

      const tagsHtml = proj.tags.map(t => `<span class="details-tag-pill">${t}</span>`).join('');
      const gameplayHtml = proj.gameplayImages.map((src, i) => `
        <div class="gameplay-card">
          <img src="${src}" alt="${proj.title} gameplay capture ${i + 1}" loading="lazy" />
        </div>
      `).join('');

      let techHtml = '';
      if (proj.techStack) {
        techHtml = Object.entries(proj.techStack).map(([k, v]) => `
          <div class="tech-detail-item">
            <span class="tech-detail-label">${k}</span>
            <span class="tech-detail-val">${v}</span>
          </div>
        `).join('');
      }

      this.detailsContent.innerHTML = `
        <div class="details-header-tag">
          <span>${proj.id} / ${proj.category}</span>
          <span class="tag-line"></span>
        </div>

        <div class="details-title-wrap">
          <h2 class="details-main-title">${proj.title}</h2>
          <p class="details-subtitle">${proj.subtitle}</p>
        </div>

        <div class="details-tags-row">
          ${tagsHtml}
        </div>

        <div class="details-hero-showcase">
          <img class="details-hero-img" src="${proj.artwork}" alt="${proj.title} showcase" />
          <div class="details-play-overlay" title="Watch gameplay trailer">
            <div class="details-play-triangle"></div>
          </div>
        </div>

        <div class="details-section-block">
          <h3 class="details-section-heading">OVERVIEW</h3>
          <p class="details-paragraph">${proj.overview}</p>
        </div>

        <div class="details-section-block">
          <h3 class="details-section-heading">GAMEPLAY SHOWCASE</h3>
          <div class="gameplay-grid">
            ${gameplayHtml}
          </div>
        </div>

        <div class="details-section-block">
          <h3 class="details-section-heading">DEVELOPMENT & ARCHITECTURE</h3>
          <p class="details-paragraph">${proj.process}</p>
          <div class="tech-details-grid">
            ${techHtml}
          </div>
        </div>

        <div class="details-back-action">
          <button class="btn-back-gallery" id="btn-back-to-gallery">
            <span>←</span>
            <span>BACK TO GALLERY</span>
          </button>
        </div>
      `;

      // Back button click
      const backBtn = document.getElementById('btn-back-to-gallery');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.closeProjectDetails());
      }
    }

    bindEvents() {
      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeProjectDetails();
        });
      }

      // Clicking left gallery when in split-mode returns to gallery
      this.stage.addEventListener('click', (e) => {
        if (this.isSplitMode) {
          this.closeProjectDetails();
        }
      });

      // Escape key returns to gallery
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isSplitMode) {
          this.closeProjectDetails();
        }
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.updateGeometry();
        this.updateCardsPosition(this.currentProgress, true);
      }, { passive: true });
    }

    // Called on each frame during scroll
    update(scrollProgress) {
      if (this.isSplitMode) return; // In split mode, the circular gallery stays completely stationary

      this.targetProgress = Math.max(0, Math.min(1, scrollProgress));
      const diff = this.targetProgress - this.currentProgress;

      if (Math.abs(diff) > 0.0005) {
        this.currentProgress += diff * 0.16;
        this.updateCardsPosition(this.currentProgress);
      } else if (diff !== 0) {
        this.currentProgress = this.targetProgress;
        this.updateCardsPosition(this.currentProgress);
      }
    }
  }

  // ==================================================================
  // 4. COORDINATOR & SCROLL MANAGER
  // Bridges Lenis scroll, Section 1 timeline, and Section 2 timeline
  // ==================================================================
  function initSection2() {
    const particlesCanvas = document.getElementById('particles-canvas');
    let particlesSystem = null;
    if (particlesCanvas) {
      particlesSystem = new BubbleParticlesSystem(particlesCanvas);
    }

    const circularGallery = new CircularGalleryController();

    const heroSection = document.getElementById('hero-section') || document.getElementById('scroll-track');
    const worksSection = document.getElementById('works-section');

    function onScrollTick() {
      if (!worksSection || !heroSection) return;

      const currentY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const worksStart = worksSection.offsetTop;
      const worksMaxScroll = Math.max(1, worksSection.offsetHeight - window.innerHeight);

      if (currentY >= worksStart) {
        // User has entered Section 2 and sticky frame is locked at top: 0
        const worksProgress = Math.max(0, Math.min(1, (currentY - worksStart) / worksMaxScroll));
        circularGallery.update(worksProgress);
      } else {
        // User is still in Section 1 or transitioning into Section 2
        circularGallery.update(0);
      }

      // Manage particle loop strictly when Section 2 is visible in the viewport
      const isWorksInView = (currentY + window.innerHeight >= worksStart) && (currentY <= worksStart + worksSection.offsetHeight);
      if (particlesSystem) {
        if (isWorksInView && !particlesSystem.isActive) {
          particlesSystem.start();
        } else if (!isWorksInView && particlesSystem.isActive) {
          particlesSystem.stop();
        }
      }
    }

    window.addEventListener('scroll', onScrollTick, { passive: true });

    function loop() {
      onScrollTick();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // Self-initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSection2);
  } else {
    initSection2();
  }
})();
