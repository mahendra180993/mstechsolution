/**
 * Animated Counter Script
 * Animates numerical counters when they enter the viewport
 */

function animateCounter(element, start, target, duration = 2000) {
    if (!element) return;
    
    const startTime = performance.now();
    const difference = target - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + difference * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

function triggerCounter(counter) {
    if (!counter || counter.classList.contains('counted')) return;
    
    const targetValue = counter.getAttribute('data-target');
    if (!targetValue) return;
    
    const target = parseInt(targetValue);
    if (isNaN(target) || target <= 0) return;
    
    counter.classList.add('counted');
    animateCounter(counter, 0, target);
}

function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    
    if (counters.length === 0) {
        setTimeout(initCounters, 200);
        return;
    }
    
    // Always trigger counters - very lenient visibility check
    counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Trigger if anywhere near viewport (very lenient)
        if (rect.top < windowHeight + 1000 && rect.bottom > -500) {
            triggerCounter(counter);
        }
    });
    
    // Intersection Observer as backup
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerCounter(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '500px'
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Scroll handler
    const handleScroll = () => {
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < windowHeight + 500 && rect.bottom > -200) {
                triggerCounter(counter);
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Immediate trigger after short delay
    setTimeout(() => {
        counters.forEach(counter => triggerCounter(counter));
    }, 200);
}

// Initialize
function initializeCounters() {
    initCounters();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCounters);
} else {
    initializeCounters();
}

setTimeout(initializeCounters, 300);
setTimeout(initializeCounters, 800);
setTimeout(initializeCounters, 1500);
setTimeout(initializeCounters, 2500);

window.addEventListener('load', () => {
    setTimeout(initializeCounters, 200);
});

window.initCounters = initCounters;

// Force trigger all counters after 3 seconds (last resort)
setTimeout(() => {
    document.querySelectorAll('.counter[data-target]').forEach(counter => {
        triggerCounter(counter);
    });
}, 3000);
