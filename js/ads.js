/**
 * Google AdSense loader — shows ad space only when ads are enabled AND filled.
 * When disabled or slot ID is missing, the site works normally with no ad boxes.
 */
(function () {
    const config = window.MS_ADS_CONFIG;
    if (!config || !config.enabled || !config.client) return;

    let scriptRequested = false;

    function loadAdSenseScript() {
        if (scriptRequested) return Promise.resolve();
        scriptRequested = true;
        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
            if (existing) {
                existing.addEventListener('load', resolve, { once: true });
                if (existing.dataset.loaded === '1') resolve();
                return;
            }
            const s = document.createElement('script');
            s.async = true;
            s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(config.client);
            s.crossOrigin = 'anonymous';
            s.onload = () => {
                s.dataset.loaded = '1';
                resolve();
            };
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function isSlotFilled(ins) {
        if (!ins) return false;
        const adStatus = ins.getAttribute('data-ad-status');
        const googleStatus = ins.getAttribute('data-adsbygoogle-status');
        const height = ins.offsetHeight || 0;
        const hasFrame = ins.querySelector('iframe');
        return adStatus === 'filled' || (googleStatus === 'done' && (height > 48 || hasFrame));
    }

    function showSlot(wrapper) {
        wrapper.classList.add('ad-slot--visible');
        wrapper.removeAttribute('hidden');
        wrapper.setAttribute('aria-hidden', 'false');
    }

    function hideSlot(wrapper) {
        wrapper.classList.remove('ad-slot--visible');
        wrapper.setAttribute('hidden', '');
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.innerHTML = '';
    }

    function watchSlot(wrapper, ins) {
        const timeout = Number(config.fillTimeoutMs) || 5000;
        const started = Date.now();

        const tick = () => {
            if (isSlotFilled(ins)) {
                showSlot(wrapper);
                return;
            }
            if (Date.now() - started >= timeout) {
                hideSlot(wrapper);
                return;
            }
            requestAnimationFrame(tick);
        };

        setTimeout(tick, 400);
    }

    function renderSlot(wrapper) {
        const key = wrapper.getAttribute('data-ad-slot');
        if (!key) return null;

        const slotId = (config.slots && config.slots[key]) ? String(config.slots[key]).trim() : '';
        if (!slotId) return null;

        const format = wrapper.getAttribute('data-ad-format') || 'auto';
        const layout = wrapper.getAttribute('data-ad-layout') || '';
        const layoutKey = wrapper.getAttribute('data-ad-layout-key') || '';

        wrapper.innerHTML = '';
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', config.client);
        ins.setAttribute('data-ad-slot', slotId);
        ins.setAttribute('data-ad-format', format);
        ins.setAttribute('data-full-width-responsive', 'true');

        if (layout) ins.setAttribute('data-ad-layout', layout);
        if (layoutKey) ins.setAttribute('data-ad-layout-key', layoutKey);
        if (config.testMode) ins.setAttribute('data-adtest', 'on');

        wrapper.appendChild(ins);
        return ins;
    }

    function initSlot(wrapper) {
        const ins = renderSlot(wrapper);
        if (!ins) {
            hideSlot(wrapper);
            return;
        }

        loadAdSenseScript()
            .then(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    hideSlot(wrapper);
                    return;
                }
                watchSlot(wrapper, ins);
            })
            .catch(() => hideSlot(wrapper));
    }

    function initVisibleSlots() {
        const slots = document.querySelectorAll('.ms-ad-slot[data-ad-slot]');
        if (!slots.length) return;

        if (!('IntersectionObserver' in window)) {
            slots.forEach(initSlot);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.adInit === '1') return;
                el.dataset.adInit = '1';
                observer.unobserve(el);
                initSlot(el);
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        slots.forEach((slot) => observer.observe(slot));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisibleSlots);
    } else {
        initVisibleSlots();
    }
})();
