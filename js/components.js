/**
 * Reusable Components (Navbar, Footer)
 * Shared across all pages
 */

/**
 * Navbar Component with Center Logo
 * Format: | Item | Item | Item | Item |   LOGO   | Item | Item | Item | Item |
 */
function createNavbar(currentPage = '') {
    const isMobile = window.innerWidth < 768;
    
    const navLinks = {
        'Home': '/',
        'About': '/about',
        'Services': '/services',
        'Projects': '/projects',
        'FAQ': '/faq',
        'Contact': '/contact'
    };
    
    // Left side links (before logo)
    const leftLinks = ['Home', 'About', 'Services'];
    // Right side links (after logo)
    const rightLinks = ['Projects', 'FAQ', 'Contact'];
    
    const activeClass = (link) => {
        const linkPage = link === 'Home' ? '/' : '/' + link.toLowerCase();
        // Handle both .html and clean URLs for currentPage comparison
        const cleanCurrentPage = currentPage.replace('.html', '').replace('index.html', '/').replace('index', '/');
        return cleanCurrentPage === linkPage || currentPage === linkPage ? 'text-[#4FC3F7] font-semibold' : 'text-[#F5F9FF] opacity-90 hover:opacity-100';
    };
    
    return `
        <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0A1A2F]/95 border-b border-[#1E88E5]/20 shadow-md backdrop-blur-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Desktop Navbar -->
                <div class="hidden md:flex items-center justify-between h-20">
                    <!-- Left Links -->
                    <div class="flex items-center space-x-6 lg:space-x-8 flex-1 justify-end pr-8">
                        ${leftLinks.map(link => `
                            <a href="${navLinks[link]}" class="nav-link ${activeClass(link)} hover:text-[#4FC3F7] transition-colors font-medium">
                                ${link}
                            </a>
                        `).join('')}
                    </div>
                    
                    <!-- Center Logo -->
                    <div class="flex-shrink-0 px-8">
                        <a href="/" class="flex items-center justify-center">
                            <img src="imgs/full-logo.png" alt="MS Tech Solution" class="h-16 lg:h-[65px] w-auto" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <span class="text-2xl lg:text-3xl font-heading font-bold bg-gradient-to-r from-[#1E88E5] to-[#4FC3F7] bg-clip-text text-transparent hidden">MS Tech Solution</span>
                        </a>
                    </div>
                    
                    <!-- Right Links -->
                    <div class="flex items-center space-x-6 lg:space-x-8 flex-1 justify-start pl-8">
                        ${rightLinks.map(link => `
                            <a href="${navLinks[link]}" class="nav-link ${activeClass(link)} hover:text-[#4FC3F7] transition-colors font-medium">
                                ${link}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Mobile Navbar -->
                <div class="md:hidden flex items-center justify-between h-16 relative">
                    <!-- Mobile Logo (Left Side) -->
                    <div class="flex items-center">
                            <a href="/" class="flex items-center">
                            <img src="imgs/full-logo.png" alt="MS Tech Solution" class="h-14  w-auto" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <span class="text-xl font-heading font-bold bg-gradient-to-r from-[#1E88E5] to-[#4FC3F7] bg-clip-text text-transparent hidden ml-2">MS Tech Solution</span>
                        </a>
                    </div>
                    
                    <!-- Hamburger Menu Button -->
                    <button id="mobile-menu-btn" type="button" aria-label="Toggle menu" class="text-[#F5F9FF] hover:text-[#4FC3F7] focus:outline-none z-[10000] p-2 rounded-md transition-all">
                        <svg id="menu-icon" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg id="close-icon" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
        
        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="mobile-menu-overlay md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
            <!-- Close Button in Menu -->
            <button id="mobile-menu-close" class="absolute top-4 right-4 text-[#F5F9FF] hover:text-[#4FC3F7] focus:outline-none z-[10001] p-3 rounded-lg hover:bg-[#0F1F3A] transition-all" aria-label="Close menu">
                <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div class="flex flex-col items-center justify-center h-full space-y-4 px-4 py-8">
                ${Object.entries(navLinks).map(([name, url]) => `
                    <a href="${url}" class="mobile-menu-link text-xl md:text-2xl font-semibold text-[#F5F9FF] hover:text-[#4FC3F7] transition-all duration-300 ${currentPage === url ? 'text-[#4FC3F7]' : ''} py-3 px-6 rounded-lg hover:bg-[#0F1F3A] min-w-[200px] text-center">
                        ${name}
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Footer Component
 */
function createFooter() {
    return `
        <footer class="relative bg-gradient-to-b from-[#0A1A2F] to-[#050F1A] text-[#B0BEC5] py-12 mt-20 border-t border-[#1E88E5]/20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-[#1E88E5]/5 to-[#4FC3F7]/5"></div>
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <!-- Company Info -->
                    <div class="col-span-1 md:col-span-2">
                        <img src="imgs/full-logo.png" alt="MS Tech Solution" class="h-16 lg:h-20 w-auto mb-4" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <h3 class="text-2xl font-heading font-bold bg-gradient-to-r from-[#1E88E5] to-[#4FC3F7] bg-clip-text text-transparent mb-4 hidden">MS Tech Solution</h3>
                        <p class="mb-4 text-[#B0BEC5] leading-relaxed font-body">
                            Enterprise-grade IT and software services. We deliver cutting-edge digital solutions with scalable technology and 24/7 support.
                        </p>
                        <p class="mb-6 text-[#C7D0D4]">
                            <span class="font-medium">Location:</span> Kukatpally, Hyderabad
                        </p>
                        <!-- Social Media Icons -->
                        <div class="flex items-center space-x-4">
                            <a href="https://www.facebook.com/mstechsol" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon group">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/mstech_solution/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon group">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://x.com/MstechhSolution" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="social-icon group">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/ms-tech-solutions/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon group">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-lg font-semibold text-[#FFFFFF] mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li><a href="/" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Home</a></li>
                            <li><a href="/about" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">About Us</a></li>
                            <li><a href="/services" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Services</a></li>
                            <li><a href="/contact" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Contact Us</a></li>
                        </ul>
                    </div>
                    
                    <!-- Services Links -->
                    <div>
                        <h4 class="text-lg font-semibold text-[#FFFFFF] mb-4">Services</h4>
                        <ul class="space-y-2">
                            <li><a href="/services" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Website Designing</a></li>
                            <li><a href="/services" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Web Development</a></li>
                            <li><a href="/services" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Digital Marketing</a></li>
                            <li><a href="/services" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors font-body">Graphic Design</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="border-t border-[#1E88E5]/20 pt-8 text-center text-[#B0BEC5]">
                    <p class="font-body">&copy; ${new Date().getFullYear()} MS Tech Solution. All rights reserved.</p>
                    <p class="mt-2 text-sm font-body">
                        <a href="tel:+917995575773" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors">+91 79955 75773</a> | 
                        <a href="mailto:hr.mstech.solution@gmail.com" class="text-[#B0BEC5] hover:text-[#4FC3F7] transition-colors">hr.mstech.solution@gmail.com</a>
                    </p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const menuCloseBtn = document.getElementById('mobile-menu-close');
    
    if (!menuBtn || !mobileMenu) return;
    
    // Function to close menu
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    // Function to open menu
    const openMenu = () => {
        mobileMenu.classList.add('active');
        if (menuIcon) menuIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    // Toggle menu on hamburger button click
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu on close button click
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside (on overlay background)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });
}

/**
 * Initialize navbar scroll behavior
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || window.scrollY;
        
        if (currentScroll > 50) {
            // Scrolled - make navbar more solid with shadow and add sawtooth border
            navbar.style.backgroundColor = 'rgba(10, 26, 47, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.classList.add('navbar-fixed');
        } else {
            // At top - slightly transparent, remove sawtooth border
            navbar.style.backgroundColor = 'rgba(10, 26, 47, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            navbar.style.backdropFilter = 'blur(8px)';
            navbar.classList.remove('navbar-fixed');
        }
    });
    
    // Initialize on load
    const initialScroll = window.pageYOffset || window.scrollY;
    if (initialScroll > 50) {
        navbar.style.backgroundColor = 'rgba(10, 26, 47, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.classList.add('navbar-fixed');
    }
}

// Global function to initialize components after navbar injection
window.initNavbarComponents = function() {
    if (document.getElementById('mobile-menu-btn') && document.getElementById('mobile-menu')) {
        initMobileMenu();
    }
    if (document.getElementById('navbar')) {
        initNavbarScroll();
    }
};

// Initialize mobile menu - wait for navbar to be injected
function initializeComponents() {
    window.initNavbarComponents();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for navbar injection (usually happens right after DOMContentLoaded)
        setTimeout(initializeComponents, 100);
    });
} else {
    // DOM already loaded, wait a bit for navbar injection
    setTimeout(initializeComponents, 100);
}

// Also reinitialize after navbar injection (navbar is usually injected immediately after DOM ready)
setTimeout(initializeComponents, 300);
setTimeout(initializeComponents, 600);

/**
 * Floating Contact Buttons Component
 * Creates WhatsApp and Phone buttons in bottom right corner
 */
function createFloatingButtons() {
    const phoneNumber = '+917995575773';
    const whatsappNumber = '91995575773'; // WhatsApp format (without +)
    
    return `
        <div id="floating-buttons" class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
            <!-- WhatsApp Button -->
            <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer" 
               class="floating-btn floating-btn-whatsapp group flex items-center justify-end gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0E7A6E] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                <svg class="w-6 h-6 flex-shrink-0 order-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span class="floating-btn-text hidden group-hover:inline-block whitespace-nowrap font-medium text-sm order-1">WhatsApp</span>
            </a>
            
            <!-- Phone Button -->
            <a href="tel:${phoneNumber}" target="_blank" rel="noopener noreferrer" 
               class="floating-btn floating-btn-phone group flex items-center justify-end gap-3 bg-gradient-to-r from-[#1E88E5] to-[#4FC3F7] hover:from-[#1976D2] hover:to-[#29B6F6] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                <svg class="w-6 h-6 flex-shrink-0 order-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="floating-btn-text hidden group-hover:inline-block whitespace-nowrap font-medium text-sm order-1">+91 79955 75773</span>
            </a>
        </div>
    `;
}

/**
 * Initialize Floating Buttons
 */
function initFloatingButtons() {
    // Check if buttons already exist
    if (document.getElementById('floating-buttons')) {
        return;
    }
    
    // Create and inject floating buttons
    const buttonsHTML = createFloatingButtons();
    document.body.insertAdjacentHTML('beforeend', buttonsHTML);
}
