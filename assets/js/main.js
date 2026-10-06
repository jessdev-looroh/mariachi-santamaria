/* Mariachi Santamaria v2 · interacciones */
(() => {
  'use strict';

  const WA = '51934217438';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const conGsap = !!(G && ST);
  if (conGsap) G.registerPlugin(ST);
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- enlaces de WhatsApp ---------- */
  const MSGS = {
    general: 'Hola Mariachi Santamaria, quiero consultar disponibilidad y precio para un evento.',
    medio: 'Hola Mariachi Santamaria, quiero consultar el precio del Medio show.',
    completo: 'Hola Mariachi Santamaria, quiero consultar el precio del Show completo.',
    fuera: 'Hola Mariachi Santamaria, quiero cotizar un show completo fuera de Piura.'
  };
  const waUrl = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  $$('.wa-link').forEach((a) => {
    const k = a.dataset.msg || 'general';
    const t = MSGS[k] || `Hola Mariachi Santamaria, quiero consultar disponibilidad y precio para: ${k}.`;
    a.href = waUrl(t);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- confeti y serpentinas ---------- */
  const Fiesta = (() => {
    const cv = $('#fiesta');
    const ctx = cv.getContext('2d');
    const COLORES = ['#d9b45e', '#f3dc9a', '#22a7d4', '#b4404f', '#f4ecdd', '#d9b45e'];
    const P = [];
    let W = 0, H = 0, corriendo = false;
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();
    addEventListener('resize', medir);

    const crear = (x, y, vx, vy, tipo) => ({
      x, y, vx, vy,
      k: tipo || (Math.random() < 0.28 ? 'cinta' : Math.random() < 0.55 ? 'rect' : 'circ'),
      c: COLORES[(Math.random() * COLORES.length) | 0],
      rot: rnd(0, 6.28), vr: rnd(-0.12, 0.12),
      w: rnd(7, 12), h: rnd(4, 7),
      vida: 0, max: rnd(170, 280),
      ph: rnd(0, 6.28), largo: rnd(46, 90), giro: rnd(0, 6.28)
    });
    const agregar = (p) => {
      if (P.length > 240) P.shift();
      P.push(p);
      if (!corriendo) { corriendo = true; requestAnimationFrame(tick); }
    };
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.vida++;
        p.vx *= 0.982;
        p.vy = Math.min(p.vy * 0.982 + 0.17, p.k === 'cinta' ? 2.3 : 3.4);
        p.x += p.vx + Math.sin(p.vida * 0.05 + p.ph) * 0.7;
        p.y += p.vy;
        p.rot += p.vr;
        p.giro += 0.13;
        if (p.vida > p.max || p.y > H + 120) { P.splice(i, 1); continue; }
        ctx.globalAlpha = p.vida > p.max - 40 ? (p.max - p.vida) / 40 : 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.k === 'rect') {
          ctx.fillStyle = p.c;
          ctx.scale(1, Math.cos(p.giro));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.k === 'circ') {
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.h * 0.75, p.h * 0.75 * Math.abs(Math.cos(p.giro)) + 0.4, 0, 0, 6.283);
          ctx.fill();
        } else {
          // serpentina: una cinta rizada que se enrolla mientras cae
          ctx.strokeStyle = p.c;
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          const n = 22;
          for (let j = 0; j <= n; j++) {
            const t = j / n;
            const x = (t - 0.5) * p.largo;
            const y = Math.sin(t * 10 + p.ph + p.vida * 0.16) * 6.5 * (0.5 + t * 0.7);
            j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (P.length) requestAnimationFrame(tick);
      else { corriendo = false; ctx.clearRect(0, 0, W, H); }
    }

    return {
      get vivos() { return P.length; },
      explosion(x, y, n = 90, fuerza = 1) {
        if (reduce) return;
        for (let i = 0; i < n; i++) {
          const a = rnd(-Math.PI * 0.92, -Math.PI * 0.08);
          const s = rnd(5, 14) * fuerza;
          agregar(crear(x, y, Math.cos(a) * s, Math.sin(a) * s));
        }
      },
      lanzar() {
        // desde un costado (como serpentina lanzada) o cayendo desde arriba
        if (reduce) return;
        const r = Math.random();
        if (r < 0.5) {
          const izq = Math.random() < 0.5;
          agregar(crear(izq ? -12 : W + 12, rnd(H * 0.15, H * 0.6), (izq ? 1 : -1) * rnd(4, 9), rnd(-7, -2), Math.random() < 0.5 ? 'cinta' : undefined));
        } else {
          agregar(crear(rnd(0, W), -20, rnd(-1.5, 1.5), rnd(0.5, 2.5)));
        }
      }
    };
  })();

  // confeti al tocar los botones principales
  $$('[data-confeti]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const r = el.getBoundingClientRect();
      Fiesta.explosion(e.clientX || r.left + r.width / 2, e.clientY || r.top, 70, 0.9);
    });
  });

  /* ---------- polvo dorado en la portada ---------- */
  (() => {
    const cv = $('#polvo');
    if (!cv || reduce) return;
    const ctx = cv.getContext('2d');
    let W, H, motas = [], visible = true;
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, W / 18));
      motas = Array.from({ length: n }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.5, 1.9), v: rnd(0.12, 0.45), f: rnd(0, 6.28) }));
    };
    medir();
    addEventListener('resize', medir);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(cv);
    function loop() {
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const m of motas) {
        m.y -= m.v; m.f += 0.03; m.x += Math.sin(m.f) * 0.2;
        if (m.y < -5) { m.y = H + 5; m.x = rnd(0, W); }
        ctx.globalAlpha = 0.25 + Math.abs(Math.sin(m.f)) * 0.6;
        ctx.fillStyle = '#f3dc9a';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- letras del nombre ---------- */
  const nombre = $('.h1-nombre');
  if (nombre) {
    const letras = [...nombre.textContent.trim()];
    nombre.innerHTML = letras.map((l, i) => `<span class="l" aria-hidden="true" style="--i:${i}">${l}</span>`).join('');
  }

  /* ---------- scroll suave ---------- */
  let lenis = null;
  if (conGsap && window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  const irA = (destino) => {
    if (lenis) lenis.scrollTo(destino, { offset: -60, duration: 1.4 });
    else (typeof destino === 'number' ? scrollTo({ top: destino, behavior: 'smooth' }) : destino.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  };
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      cerrarMenu();
      irA(id === '#inicio' ? 0 : t);
    });
  });

  /* ---------- menú móvil ---------- */
  const menuBtn = $('#menu-btn');
  function cerrarMenu() {
    if (!root.classList.contains('menu-abierto')) return;
    root.classList.remove('menu-abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menú');
    if (lenis) lenis.start();
  }
  menuBtn.addEventListener('click', () => {
    const abrir = !root.classList.contains('menu-abierto');
    if (!abrir) return cerrarMenu();
    root.classList.add('menu-abierto');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
    if (lenis) lenis.stop();
    if (conGsap && !reduce) G.from('.menu nav a, .menu .btn', { y: 40, opacity: 0, stagger: 0.06, duration: 0.8, delay: 0.2, ease: 'expo.out' });
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });

  /* ---------- splash ---------- */
  const splash = $('#splash');
  function esperar(img) {
    return new Promise((ok) => {
      if (!img || img.complete) return ok();
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', ok, { once: true });
    });
  }
  function correrSplash(listo) {
    if (!splash) return listo();
    if (lenis) lenis.stop();
    root.style.overflow = 'hidden';
    const corona = $('.splash-corona');
    const pct = $('#pct');
    const tareas = [
      esperar($('.hero-arco img')),
      esperar($('.splash-corona .llena')),
      esperar($('.marca-corona')),
      document.fonts ? document.fonts.ready : Promise.resolve()
    ];
    let hechas = 0;
    tareas.forEach((t) => t.then(() => hechas++));
    const minimo = reduce ? 300 : 1900;
    const limite = 4500;
    const t0 = performance.now();
    let mostrado = 0;
    const salir = () => {
      root.style.overflow = '';
      const fin = () => { splash.remove(); root.classList.add('listo'); if (lenis) lenis.start(); };
      if (!conGsap || reduce) {
        splash.style.transition = 'opacity .5s';
        splash.style.opacity = '0';
        listo();
        setTimeout(fin, 520);
        return;
      }
      const tl = G.timeline({ onComplete: fin });
      tl.to(corona, { scale: 1.08, '--glow': 1, duration: 0.45, ease: 'power2.out' })
        .to('.splash-centro', { opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in' }, '+=0.12')
        .to('.splash-costura', { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '<')
        .add(() => { Fiesta.explosion(innerWidth / 2, innerHeight / 2, 110, 1.15); listo(); })
        .to('.splash-panel.arriba', { yPercent: -101, duration: 1.15, ease: 'expo.inOut' })
        .to('.splash-panel.abajo', { yPercent: 101, duration: 1.15, ease: 'expo.inOut' }, '<')
        .to('.splash-costura', { opacity: 0, duration: 0.3 }, '<');
    };
    const frame = (ahora) => {
      const t = ahora - t0;
      const real = (hechas / tareas.length) * 100;
      const meta = t > limite ? 100 : Math.min(real, (t / minimo) * 100);
      mostrado += (meta - mostrado) * 0.09;
      if (meta - mostrado < 0.4) mostrado = meta;
      const v = Math.round(mostrado);
      pct.textContent = v;
      corona.style.setProperty('--p', v + '%');
      splash.style.setProperty('--pp', (v / 100).toFixed(3));
      $('.splash-barra i').style.transform = `scaleX(${v / 100})`;
      if (v >= 100) return salir();
      requestAnimationFrame(frame);
    };
    if (conGsap && !reduce) G.from('.splash-nombre', { letterSpacing: '0.9em', opacity: 0, duration: 1.6, ease: 'expo.out' });
    requestAnimationFrame(frame);
  }

  /* ---------- entrada de la portada ---------- */
  function entradaHero() {
    if (!conGsap || reduce) return;
    const tl = G.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.h1-nombre .l', { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.045 }, 0.15)
      .from('.hero-in', { y: 34, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.25)
      .from('.hero-arco', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .from('.hero-arco img', { scale: 1.35, duration: 2, ease: 'expo.out' }, 0.3)
      .from('.arco-linea', { opacity: 0, scale: 0.92, transformOrigin: '50% 100%', duration: 1.4, stagger: 0.12 }, 0.6)
      .from('.sello-giro', { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(1.6)' }, 0.9)
      .from('.vivo-card', { y: 80, opacity: 0, rotate: -6, duration: 1.2 }, 1)
      .from('.top .wrap', { opacity: 0, y: -20, duration: 1 }, 0.4);
  }

  /* ---------- animaciones al hacer scroll ---------- */
  function animarScroll() {
    // barra de progreso y header
    const top = $('#top');
    const progreso = $('.progreso');
    const wa = $('.wa-flot');
    let ultimoY = scrollY;
    const alScroll = (y) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progreso.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      top.classList.toggle('solido', y > 30);
      const bajando = y > ultimoY;
      top.classList.toggle('oculto', bajando && y > 700 && !root.classList.contains('menu-abierto'));
      wa.classList.toggle('visible', y > innerHeight * 0.6);
      ultimoY = y;
    };
    if (lenis) lenis.on('scroll', (l) => alScroll(l.scroll));
    else addEventListener('scroll', () => alScroll(scrollY), { passive: true });
    alScroll(scrollY);

    // serpentinas al deslizar: más rápido, más fiesta (con tope)
    if (!reduce) {
      let yPrev = scrollY, carga = 0;
      const pulso = () => {
        const y = lenis ? lenis.scroll : scrollY;
        const dy = Math.abs(y - yPrev);
        yPrev = y;
        if (root.classList.contains('listo') && !root.classList.contains('menu-abierto') && $('#lightbox').hidden) {
          carga += Math.min(dy, 80) * 0.011;
          while (carga > 1) { carga -= 1; if (Fiesta.vivos < 26) Fiesta.lanzar(); }
        }
        requestAnimationFrame(pulso);
      };
      requestAnimationFrame(pulso);
    }

    if (!conGsap || reduce) return;

    // parallax de la portada
    G.to('.hero-arco img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.hero-texto', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    // marquesinas infinitas que aceleran con el scroll
    const cintas = $$('.cinta-pista').map((pista, i) => {
      const base = [...pista.children];
      let guardia = 0;
      while (pista.scrollWidth < innerWidth * 1.2 && guardia++ < 6) base.forEach((n) => pista.appendChild(n.cloneNode(true)));
      [...pista.children].forEach((n) => pista.appendChild(n.cloneNode(true)));
      const dir = i % 2 ? 1 : -1;
      G.set(pista, { xPercent: dir > 0 ? -50 : 0 });
      return G.to(pista, { xPercent: dir > 0 ? 0 : -50, duration: 38, ease: 'none', repeat: -1 });
    });
    ST.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 220, 7);
        cintas.forEach((tw) => { tw.timeScale(1 + v); G.to(tw, { timeScale: 1, duration: 1.2, overwrite: true }); });
      }
    });

    // manifiesto palabra por palabra
    const man = $('#manifiesto');
    if (man) {
      const palabras = [];
      const partir = (texto, oro) => texto.split(/(\s+)/).map((t) => {
        if (!t.trim()) return document.createTextNode(t);
        const s = document.createElement('span');
        s.className = 'w' + (oro ? ' oro' : '');
        s.textContent = t;
        palabras.push(s);
        return s;
      });
      const nodos = [...man.childNodes];
      man.textContent = '';
      nodos.forEach((n) => {
        const partes = n.nodeType === 3 ? partir(n.textContent, false) : partir(n.textContent, true);
        partes.forEach((p) => man.appendChild(p));
      });
      ST.create({
        trigger: man, start: 'top 80%', end: 'bottom 40%', scrub: true,
        onUpdate: (self) => {
          const n = Math.round(self.progress * palabras.length);
          palabras.forEach((w, i) => w.classList.toggle('on', i < n));
        }
      });
    }

    // fotos de "nosotros": cortina y parallax
    $$('.foto-mask').forEach((m) => {
      G.from(m, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
    });
    $$('[data-parallax]').forEach((img) => {
      G.to(img, { yPercent: +img.dataset.parallax, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    G.from('.somos-fotos .etiqueta', { opacity: 0, x: -30, duration: 1, scrollTrigger: { trigger: '.somos-fotos', start: 'top 60%', once: true } });

    // revelado general de títulos y bloques
    const bloques = $$('.seccion .eyebrow, .seccion .titulo, .seccion .lead, .ocasiones-cab > *, .somos-pie, .zona, .pasos li, .galeria-cab p, .videos-nota, .shows-nota, .numero, .redes, .armar, .pie-grande > *, .pie-cols > div, .comillas, .citas, .citas-nav');
    G.set(bloques, { y: 46, opacity: 0 });
    ST.batch(bloques, {
      start: 'top 90%', once: true,
      onEnter: (b) => G.to(b, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true })
    });

    // ocasiones: recorrido horizontal fijado en escritorio
    const mm = G.matchMedia();
    mm.add('(min-width: 960px)', () => {
      const sec = $('#ocasiones');
      const pista = $('#pista-h');
      sec.classList.add('horizontal');
      const dist = () => Math.max(0, pista.scrollWidth - innerWidth);
      const tw = G.to(pista, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      $$('.ocasion', pista).forEach((card) => {
        G.fromTo($('img', card), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
      G.from($$('.ocasion', pista), { y: 90, rotate: 3, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: sec, start: 'top 65%', once: true } });
      return () => sec.classList.remove('horizontal');
    });
    mm.add('(max-width: 959px)', () => {
      G.from('.ocasion', { x: 80, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '#pista-h', start: 'top 85%', once: true } });
    });

    // shows: las tarjetas se reparten como naipes
    const planes = $$('.plan');
    let repartidas = false;
    mm.add('(min-width: 900px)', () => {
      G.from(planes, {
        x: (i) => (1 - i) * 110 + '%', y: (i) => (i === 1 ? 40 : 90), rotate: (i) => (i - 1) * 9,
        opacity: 0, duration: 1.5, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: '#planes', start: 'top 78%', once: true },
        onComplete: () => { repartidas = true; }
      });
    });
    mm.add('(max-width: 899px)', () => {
      planes.forEach((p) => G.from(p, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%', once: true }, onComplete: () => { repartidas = true; } }));
    });
    ST.create({
      trigger: '.plan.destacado', start: 'top 60%', once: true,
      onEnter: () => setTimeout(() => {
        const r = $('.plan.destacado').getBoundingClientRect();
        Fiesta.explosion(r.left + r.width / 2, r.top + 10, 110, 1);
      }, 900)
    });
    if (fino) {
      planes.forEach((p) => {
        p.addEventListener('pointermove', (e) => {
          const r = p.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          p.style.setProperty('--mx', x * 100 + '%');
          p.style.setProperty('--my', y * 100 + '%');
          if (repartidas) G.to(p, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 8, y: -6, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        });
        p.addEventListener('pointerleave', () => { if (repartidas) G.to(p, { rotateY: 0, rotateX: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .5)' }); });
      });
    }

    // galería: cortinas en cascada
    const fotos = $$('.mosaico button');
    G.set(fotos, { clipPath: 'inset(100% 0% 0% 0%)' });
    ST.batch(fotos, {
      start: 'top 92%', once: true,
      onEnter: (b) => {
        G.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', stagger: 0.09 });
        G.from(b.map((x) => x.querySelector('img')), { scale: 1.35, duration: 1.8, ease: 'expo.out', stagger: 0.09 });
      }
    });

    // videos
    G.from('.reel', { y: 90, opacity: 0, rotate: (i) => (i - 2) * 3, duration: 1.3, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '#reels', start: 'top 85%', once: true } });

    // mapa de cobertura
    const rutas = $$('#mapa-svg .rutas path');
    rutas.forEach((r) => {
      if (r.getAttribute('stroke-dasharray')) { G.set(r, { opacity: 0 }); return; }
      const L = r.getTotalLength();
      G.set(r, { strokeDasharray: L, strokeDashoffset: L });
    });
    G.set('#mapa-svg .puntos > *', { opacity: 0 });
    G.set('#mapa-svg .anillo', { scale: 0.6, opacity: 0, transformOrigin: '260px 250px' });
    ST.create({
      trigger: '.mapa', start: 'top 72%', once: true,
      onEnter: () => {
        const tl = G.timeline();
        tl.to('#mapa-svg .anillo', { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: 0.15 })
          .to(rutas.filter((r) => !r.getAttribute('stroke-dasharray')), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: 0.08 }, 0.3)
          .to(rutas.filter((r) => r.getAttribute('stroke-dasharray')), { opacity: 0.9, duration: 1, stagger: 0.1 }, 0.9)
          .to('#mapa-svg .puntos > *', { opacity: 1, duration: 0.6, stagger: 0.04 }, 0.7);
      }
    });

    // fondo de reservas
    G.fromTo('.reservas-fondo', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.reservas', start: 'top bottom', end: 'bottom top', scrub: true } });

    // lema del pie, letra a letra
    G.from('.pie-lema', { backgroundPosition: '100% 0', scale: 0.9, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.pie-lema', start: 'top 90%', once: true } });

    addEventListener('load', () => ST.refresh());
    if (document.fonts) document.fonts.ready.then(() => ST.refresh());
  }

  /* ---------- videos: reproducir en silencio al verlos ---------- */
  const reels = $$('.reel');
  const vivo = $('.vivo-card video');
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      const v = e.target.querySelector('video') || e.target;
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); }
      else if (!v.closest('.con-sonido')) v.pause();
    });
  }, { threshold: 0.55 });
  reels.forEach((r) => io.observe(r));
  if (vivo) io.observe(vivo);
  reels.forEach((r) => {
    const v = $('video', r);
    $('.sonido', r).addEventListener('click', () => {
      const activar = v.muted;
      reels.forEach((o) => { if (o !== r) { $('video', o).muted = true; o.classList.remove('con-sonido'); } });
      v.muted = !activar;
      r.classList.toggle('con-sonido', activar);
      if (activar) { v.currentTime = 0; v.play().catch(() => {}); }
    });
  });

  /* ---------- testimonios ---------- */
  (() => {
    const citas = $$('.cita');
    const pts = $$('#citas-nav .pt');
    let i = 0, timer;
    const ir = (n) => {
      citas[i].classList.remove('activa'); pts[i].classList.remove('on');
      i = (n + citas.length) % citas.length;
      citas[i].classList.add('activa');
      void pts[i].offsetWidth;
      pts[i].classList.add('on');
    };
    const arrancar = () => { clearInterval(timer); timer = setInterval(() => ir(i + 1), 6000); };
    pts.forEach((p, n) => p.addEventListener('click', () => { ir(n); arrancar(); }));
    $('#citas').addEventListener('mouseenter', () => clearInterval(timer));
    $('#citas').addEventListener('mouseleave', arrancar);
    arrancar();
  })();

  /* ---------- galería: visor ---------- */
  (() => {
    const btns = $$('#mosaico button');
    const lb = $('#lightbox');
    const img = $('#lb-img');
    const cap = $('#lb-cap');
    const cuenta = $('#lb-cuenta');
    let i = 0, ultimoFoco = null;
    const mostrar = (n) => {
      i = (n + btns.length) % btns.length;
      const src = $('img', btns[i]);
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      cap.textContent = src.alt;
      cuenta.textContent = `${String(i + 1).padStart(2, '0')} / ${String(btns.length).padStart(2, '0')}`;
      if (conGsap && !reduce) G.fromTo(img, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    };
    const abrir = (n) => { ultimoFoco = document.activeElement; mostrar(n); lb.hidden = false; if (lenis) lenis.stop(); root.style.overflow = 'hidden'; $('#lb-cerrar').focus(); };
    const cerrar = () => { lb.hidden = true; if (lenis) lenis.start(); root.style.overflow = ''; if (ultimoFoco) ultimoFoco.focus(); };
    btns.forEach((b, n) => b.addEventListener('click', () => abrir(n)));
    $('#lb-cerrar').addEventListener('click', cerrar);
    $('#lb-prev').addEventListener('click', () => mostrar(i - 1));
    $('#lb-next').addEventListener('click', () => mostrar(i + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) cerrar(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') mostrar(i - 1);
      if (e.key === 'ArrowRight') mostrar(i + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  })();

  /* ---------- formulario de WhatsApp ---------- */
  (() => {
    const f = $('#armar');
    const vista = $('#vista');
    const enviar = $('#enviar');
    const fecha = $('#f-fecha');
    const hoy = new Date();
    fecha.min = hoy.toISOString().slice(0, 10);
    const fmtFecha = (v) => {
      if (!v) return '';
      const [a, m, d] = v.split('-').map(Number);
      return new Date(a, m - 1, d).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    };
    const fmtHora = (v) => {
      if (!v) return '';
      const [h, m] = v.split(':').map(Number);
      const ampm = h >= 12 ? 'p. m.' : 'a. m.';
      return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ampm}`;
    };
    const armar = () => {
      const show = (f.querySelector('input[name="show"]:checked') || {}).value || 'Show completo';
      const para = $('#f-para').value.trim();
      const de = $('#f-de').value.trim();
      const lineas = [
        'Hola Mariachi Santamaria. Quiero consultar precio y disponibilidad.',
        `• Show: ${show}`,
        `• Ocasión: ${$('#f-ocasion').value}`,
        `• Para: ${para || 'por confirmar'}`,
        `• De parte de: ${de || 'por confirmar'}`
      ];
      if (fecha.value) lineas.push(`• Fecha: ${fmtFecha(fecha.value)}`);
      if ($('#f-hora').value) lineas.push(`• Hora: ${fmtHora($('#f-hora').value)}`);
      const lugar = $('#f-lugar').value.trim();
      lineas.push(`• Lugar: ${lugar || 'por confirmar'}`);
      const txt = lineas.join('\n');
      vista.textContent = txt;
      enviar.href = waUrl(txt);
    };
    f.addEventListener('input', armar);
    f.addEventListener('change', armar);
    f.addEventListener('submit', (e) => e.preventDefault());
    // las tarjetas de shows también marcan el show en el formulario
    const mapa = { medio: 's-medio', completo: 's-completo', fuera: 's-fuera' };
    $$('.plan .wa-link').forEach((a) => a.addEventListener('click', () => { const id = mapa[a.dataset.msg]; if (id) { $('#' + id).checked = true; armar(); } }));
    armar();
  })();

  /* ---------- copiar número ---------- */
  const toast = $('#toast');
  let toastT;
  const avisar = (t) => { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2200); };
  $('#copiar').addEventListener('click', (e) => {
    const n = '+51934217438';
    const seleccionar = () => { const r = document.createRange(); r.selectNodeContents($('#num')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); avisar('Número seleccionado, cópialo'); };
    try {
      navigator.clipboard.writeText(n).then(() => { avisar('Número copiado'); const r = e.currentTarget.getBoundingClientRect(); Fiesta.explosion(r.left + r.width / 2, r.top, 40, 0.7); }, seleccionar);
    } catch (_) { seleccionar(); }
  });

  /* ---------- cursor y botones magnéticos ---------- */
  if (fino && !reduce) {
    const dot = $('.cursor'), aro = $('.cursor-aro'), etiqueta = $('.cursor-aro span');
    let mx = innerWidth / 2, my = innerHeight / 2, ax = mx, ay = my;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
    (function seguir() { ax += (mx - ax) * 0.16; ay += (my - ay) * 0.16; aro.style.transform = `translate(${ax}px, ${ay}px)`; requestAnimationFrame(seguir); })();
    $$('#mosaico button').forEach((b) => (b.dataset.cursor = 'Ver'));
    $$('.ocasion').forEach((b) => (b.dataset.cursor = 'Pedir'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, label, select, input');
      aro.classList.remove('grande', 'link');
      if (!t) return;
      if (t.dataset.cursor) { etiqueta.textContent = t.dataset.cursor; aro.classList.add('grande'); }
      else aro.classList.add('link');
    });
    if (conGsap) {
      $$('.magnetico').forEach((b) => {
        b.addEventListener('pointermove', (e) => {
          const r = b.getBoundingClientRect();
          G.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: 'power3.out' });
        });
        b.addEventListener('pointerleave', () => G.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)' }));
      });
    }
  }

  /* ---------- arranque ---------- */
  animarScroll();
  correrSplash(entradaHero);
})();
