/**
 * Main JavaScript for MS Tech Solution Website
 * Handles scroll animations, navbar behavior, mobile menu, smooth scrolling, and form handling
 */

// DOM elements
let navbar;
let mobileMenuBtn;
let mobileMenu;
let navLinks;
let fadeInElements;

/**
 * Initialize all functionality
 */
function init() {
    navbar = document.getElementById('navbar');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenu = document.getElementById('mobile-menu');
    navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');
    fadeInElements = document.querySelectorAll('.fade-in');
    
    // Initialize features
    initNavbar();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initFormHandling();
}

/**
 * Navbar scroll behavior - add/remove background opacity
 */
function initNavbar() {
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add solid background after scrolling past hero section
        if (currentScroll > 100) {
            navbar.classList.add('bg-white', 'dark:bg-slate-900', 'shadow-lg');
            navbar.classList.remove('bg-white/80', 'dark:bg-slate-900/80');
        } else {
            navbar.classList.add('bg-white/80', 'dark:bg-slate-900/80');
            navbar.classList.remove('bg-white', 'dark:bg-slate-900', 'shadow-lg');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icon
        const icon = mobileMenuBtn.querySelector('svg');
        if (icon) {
            icon.classList.toggle('rotate-90');
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Scroll animations - fade in elements when they enter viewport
 */
function initScrollAnimations() {
    if (fadeInElements.length === 0) return;
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully visible
    });
    
    // Observe all fade-in elements
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
    
    // Trigger initial check for elements already in viewport
    checkInitialVisibility();
}

/**
 * Check if elements are already visible on page load
 */
function checkInitialVisibility() {
    fadeInElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            // Add small delay for initial load
            setTimeout(() => {
                element.classList.add('visible');
            }, 100);
        }
    });
}

/**
 * Form handling - contact form submission
 */
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Client-side validation
        if (!data.name || !data.email || !data.phone || !data.message) {
            e.preventDefault();
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            e.preventDefault();
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Update button state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Let Netlify handle the form submission
        // The form will submit normally, and Netlify will process it
        // After successful submission, Netlify will redirect to a success page
        // or we can handle it with JavaScript if using AJAX
        
        // Show success message (will be shown before redirect if using default Netlify behavior)
        setTimeout(() => {
            showNotification('Thank you! We\'ll reply within 24 hours.', 'success');
        }, 100);
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300 ${
        type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Add hover effects to service cards (additional enhancement)
 */
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('#services .bg-white, #services .dark\\:bg-slate-800');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Add parallax effect to hero section (subtle)
 */
function initParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.relative.z-10');
        
        if (heroContent && scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
        }
    });
}

/**
 * Add loading animation (if needed)
 */
function handlePageLoad() {
    // Remove any loading overlay if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

/**
 * Initialize Floating Contact Buttons
 */
function initFloatingButtons() {
    // Check if buttons already exist
    if (document.getElementById('floating-buttons')) {
        return;
    }
    
    // Check if initFloatingButtons is available from components.js
    if (typeof window.initFloatingButtonsFromComponents === 'function') {
        window.initFloatingButtonsFromComponents();
        return;
    }
    
    // Fallback: Create buttons directly if components.js function not available
    const phoneNumber = '+917995575773';
    const whatsappNumber = '91995575773';
    
    const buttonsHTML = `
        <div id="floating-buttons" class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
            <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer" 
               class="floating-btn floating-btn-whatsapp group flex items-center justify-end gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0E7A6E] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                <svg class="w-6 h-6 flex-shrink-0 order-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span class="floating-btn-text hidden group-hover:inline-block whitespace-nowrap font-medium text-sm order-1">WhatsApp</span>
            </a>
            <a href="tel:${phoneNumber}" target="_blank" rel="noopener noreferrer" 
               class="floating-btn floating-btn-phone group flex items-center justify-end gap-3 bg-gradient-to-r from-[#1E88E5] to-[#4FC3F7] hover:from-[#1976D2] hover:to-[#29B6F6] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                <svg class="w-6 h-6 flex-shrink-0 order-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="floating-btn-text hidden group-hover:inline-block whitespace-nowrap font-medium text-sm order-1">+91 79955 75773</span>
            </a>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', buttonsHTML);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        enhanceServiceCards();
        initParallax();
        handlePageLoad();
        setTimeout(initFloatingButtons, 200);
    });
} else {
    init();
    enhanceServiceCards();
    initParallax();
    handlePageLoad();
    setTimeout(initFloatingButtons, 200);
}

// Handle page visibility change (pause/resume animations if needed)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - can pause animations if needed
    } else {
        // Page is visible - resume animations if needed
    }
});

