function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = clamp((window.scrollY / max) * 100, 0, 100);
        bar.style.width = `${p}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initNavbarGlass() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () => {
        if ((window.scrollY || 0) > 50) {
            navbar.style.backdropFilter = 'blur(14px)';
            navbar.style.backgroundColor = 'rgba(10, 26, 47, 0.84)';
            navbar.style.borderBottom = '1px solid rgba(79, 195, 247, 0.22)';
        } else {
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = 'rgba(10, 26, 47, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(30, 136, 229, 0.2)';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initCustomCursor() {
    if (reducedMotion()) return;
    const dot = document.getElementById('cursor-dot');
    const glow = document.getElementById('cursor-glow');
    if (!dot || !glow) return;

    let tx = -999, ty = -999;
    let dx = -999, dy = -999;
    let gx = -999, gy = -999;

    window.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    }, { passive: true });

    const tick = () => {
        dx = lerp(dx, tx, 0.6);
        dy = lerp(dy, ty, 0.6);
        gx = lerp(gx, tx, 0.08);
        gy = lerp(gy, ty, 0.08);
        dot.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
        glow.style.transform = `translate3d(${gx - 21}px, ${gy - 21}px, 0)`;
        requestAnimationFrame(tick);
    };
    tick();
}

function initTypingEffect() {
    const el = document.getElementById('hero-typing');
    const live = document.getElementById('hero-typing-text');
    if (!el || !live) return;

    const full = (el.dataset.text || '').trim();
    if (!full) return;

    if (reducedMotion()) {
        live.textContent = full;
        return;
    }

    live.textContent = full;
    const reservedHeight = el.offsetHeight;
    live.textContent = '';
    if (reservedHeight > 0) {
        el.style.minHeight = `${reservedHeight}px`;
    }

    let i = 0;
    let deleting = false;
    let timer = null;

    const write = (txt) => {
        live.textContent = txt;
    };

    const loop = () => {
        if (!deleting) {
            i += 1;
            write(full.slice(0, i));
            if (i >= full.length) {
                deleting = true;
                timer = setTimeout(loop, 1400);
                return;
            }
            timer = setTimeout(loop, 34);
            return;
        }
        i -= 1;
        write(full.slice(0, Math.max(0, i)));
        if (i <= 0) {
            deleting = false;
            timer = setTimeout(loop, 400);
            return;
        }
        timer = setTimeout(loop, 18);
    };

    write('');
    loop();

    window.stopHeroTyping = () => {
        if (timer) clearTimeout(timer);
        write(full);
    };
}

window.startHeroTyping = initTypingEffect;

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || reducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let raf = null;
    const count = 55;
    const maxDist = 130;
    let dots = [];

    const resize = () => {
        const r = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(r.width));
        h = Math.max(1, Math.floor(r.height));
        dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
        dots = Array.from({ length: count }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        for (const p of dots) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (let i = 0; i < dots.length; i += 1) {
            for (let j = i + 1; j < dots.length; j += 1) {
                const a = dots[i], b = dots[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d > maxDist) continue;
                const t = 1 - d / maxDist;
                ctx.strokeStyle = `rgba(79,195,247,${0.11 * t})`;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
        }
        ctx.fillStyle = 'rgba(245,249,255,0.6)';
        dots.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill(); });
        raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => { resize(); seed(); });
    resize(); seed(); draw();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && raf) cancelAnimationFrame(raf);
        if (!document.hidden) draw();
    });
}

function initCounterEnhance() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.enhancedCounted === '1') return;
            el.dataset.enhancedCounted = '1';
            const target = Number(el.getAttribute('data-target') || '0');
            const start = performance.now();
            const from = Number(el.textContent || '0');
            const duration = 1300;
            const step = (now) => {
                const t = clamp((now - start) / duration, 0, 1);
                const val = Math.round(from + (target - from) * easeOutCubic(t));
                el.textContent = `${val}`;
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }, { threshold: 0.25 });
    counters.forEach((c) => obs.observe(c));
}

function initTiltCards() {
    if (reducedMotion() || (window.matchMedia && window.matchMedia('(hover: none)').matches)) return;
    document.querySelectorAll('.tilt-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

function initParallaxBlobs() {
    if (reducedMotion()) return;
    const blobs = document.querySelectorAll('[data-parallax-speed]');
    if (!blobs.length) return;
    const run = () => {
        const y = window.scrollY || 0;
        blobs.forEach((b) => {
            const s = Number(b.getAttribute('data-parallax-speed') || '0.1');
            b.style.transform = `translate3d(0, ${y * s}px, 0)`;
        });
    };
    window.addEventListener('scroll', run, { passive: true });
    run();
}

function initAOS() {
    if (!window.AOS) return;
    window.AOS.init({ once: true, duration: 700, offset: 50, disable: reducedMotion() });
    if (window.AOS.refresh) window.AOS.refresh();
}

function ensureFadeInVisible() {
    document.querySelectorAll('.fade-in').forEach((el) => {
        el.classList.add('visible');
        el.style.opacity = '1';
    });
    document.querySelectorAll('.gsap-item').forEach((el) => {
        el.style.opacity = '1';
    });
}

function initServiceSwiper() {
    if (!window.Swiper) return;
    const host = document.getElementById('home-services-swiper');
    if (host && host.dataset.swiperReady !== '1') {
        host.dataset.swiperReady = '1';
        // eslint-disable-next-line no-new
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        new window.Swiper('#home-services-swiper', {
            loop: !isMobile,
            slidesPerView: 1,
            spaceBetween: 18,
            speed: 800,
            watchOverflow: true,
            autoplay: reducedMotion() ? false : { delay: 2300, disableOnInteraction: false },
            pagination: { el: '#home-services-swiper .swiper-pagination', clickable: true },
            breakpoints: { 768: { slidesPerView: 2, loop: true }, 1024: { slidesPerView: 3, loop: true } },
        });
    }

    document.querySelectorAll('.printing-swiper, .tshirt-swiper').forEach((el) => {
        if (el.dataset.swiperReady === '1') return;
        el.dataset.swiperReady = '1';
        const pagination = el.querySelector('.swiper-pagination');
        // eslint-disable-next-line no-new
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        new window.Swiper(el, {
            loop: !isMobile,
            slidesPerView: 1,
            speed: 700,
            watchOverflow: true,
            autoplay: reducedMotion() ? false : { delay: 2200, disableOnInteraction: false },
            pagination: pagination ? { el: pagination, clickable: true } : undefined,
        });
    });
}

function initGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const closeBtn = document.getElementById('gallery-modal-close');
    const prevBtn = document.getElementById('gallery-modal-prev');
    const nextBtn = document.getElementById('gallery-modal-next');
    if (!modal || !modalImg || !closeBtn) return;
    const images = Array.from(document.querySelectorAll('img')).filter((img) => img.src && !img.closest('#gallery-modal'));
    if (!images.length) return;
    let index = 0;

    const open = (i) => {
        index = (i + images.length) % images.length;
        modalImg.src = images[index].src;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };
    images.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(i));
    });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    prevBtn && prevBtn.addEventListener('click', () => open(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => open(index + 1));
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(index - 1);
        if (e.key === 'ArrowRight') open(index + 1);
    });
}

function showToast(message) {
    const host = document.getElementById('toast-host');
    if (!host) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 260);
    }, 2600);
}

function initToast() {
    // Toast only used for contact form / manual triggers — no auto welcome popup on load
}

function initHeroReveal() {
    const hero = document.querySelector('#hero .gsap-hero');
    if (!hero) return;

    const items = hero.querySelectorAll('.hero-animate');
    items.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    if (!window.gsap || reducedMotion() || !items.length) return;

    window.gsap.killTweensOf(items);
    window.gsap.set(items, { opacity: 0, y: 14 });
    window.gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        delay: 0.1,
    });
}

window.playHeroReveal = initHeroReveal;

function initGSAP() {
    if (!window.gsap) return;
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

    if (!document.getElementById('loader')) {
        initHeroReveal();
    }

    if (!window.ScrollTrigger) {
        ensureFadeInVisible();
        return;
    }

    ['.service-card', '.stat-card', '.printing-card', '.project-card', '.faq-item'].forEach((selector) => {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;
        window.gsap.fromTo(els, { y: 24 }, {
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: els[0].parentElement || els[0], start: 'top 88%' },
        });
    });

    ensureFadeInVisible();
}

function init() {
    initScrollProgress();
    initNavbarGlass();
    initCustomCursor();
    if (!document.getElementById('loader')) {
        setTimeout(initTypingEffect, 900);
    }
    initParticles();
    initCounterEnhance();
    initTiltCards();
    initParallaxBlobs();
    initAOS();
    ensureFadeInVisible();
    initServiceSwiper();
    initGalleryModal();
    initToast();
    initGSAP();
}

function bootPremium() {
    init();
    window.addEventListener('load', () => {
        ensureFadeInVisible();
        if (window.AOS && window.AOS.refresh) window.AOS.refresh();
    });
    setTimeout(ensureFadeInVisible, 400);
    setTimeout(ensureFadeInVisible, 1200);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootPremium);
else bootPremium();

