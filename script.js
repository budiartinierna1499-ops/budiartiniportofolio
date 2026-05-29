/* =====================================================
   COSMIC E-PORTFOLIO - MAIN JAVASCRIPT
   Interactive Features, Animations, & Functionality
   ===================================================== */

// =====================================================
// 1. STAR GENERATION (CSS Keyframe Stars)
// =====================================================

function generateStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2;
        const duration = Math.random() * 3 + 2;
        
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDuration = duration + 's';
        
        starsContainer.appendChild(star);
    }
}

// =====================================================
// 2. PARTICLE CANVAS EFFECT
// =====================================================

function initializeParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle array
    const particles = [];
    const particleCount = 50;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// =====================================================
// 3. MOBILE NAVIGATION TOGGLE
// =====================================================

function initializeNavigation() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu on button click
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navbarMenu.classList.remove('active');
        }
    });
}

// =====================================================
// 4. GALLERY LIGHTBOX FUNCTIONALITY
// =====================================================

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    
    // Get image data from gallery items
    const imageData = Array.from(galleryItems).map(item => ({
        image: item.querySelector('.gallery-image').src,
        title: item.querySelector('.caption-title').textContent,
        description: item.querySelector('.caption-description').textContent
    }));
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        img.addEventListener('click', () => {
            openLightbox(index);
        });
        
        // Also make the overlay clickable
        item.querySelector('.gallery-image-container').addEventListener('click', (e) => {
            if (e.target === img) {
                openLightbox(index);
            }
        });
    });
    
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightbox() {
        const data = imageData[currentImageIndex];
        lightboxImage.src = data.image;
        lightboxTitle.textContent = data.title;
        lightboxDescription.textContent = data.description;
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imageData.length) % imageData.length;
        updateLightbox();
    });
    
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imageData.length;
        updateLightbox();
    });
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
}

// =====================================================
// 5. CYCLE TABS FUNCTIONALITY
// ===================================================== 

function initializeCycleTabs() {
    const cycleTabs = document.querySelectorAll('.cycle-tab');
    const cyclePanels = document.querySelectorAll('.cycle-panel');
    
    cycleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cycleNum = tab.dataset.cycle;
            
            // Remove active class from all tabs and panels
            cycleTabs.forEach(t => t.classList.remove('active'));
            cyclePanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(`cycle-${cycleNum}`).classList.add('active');
        });
    });
}

// =====================================================
// 6. SMOOTH SCROLL ANIMATIONS (AOS-style)
// ===================================================== 

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatableElements = document.querySelectorAll(
        '.section, .gallery-item, .artefak-card, .analisis-card, .assessment-card, .roadmap-star'
    );
    
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// =====================================================
// 7. PARALLAX SCROLLING EFFECT
// ===================================================== 

function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Parallax for section titles
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    });
}

// =====================================================
// 8. NAVBAR GLOWING EFFECT ON SCROLL
// ===================================================== 

function initializeNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.5)';
        } else {
            navbar.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
        }
    });
}

// =====================================================
// 9. INTERACTIVE HOVER EFFECTS
// ===================================================== 

function initializeHoverEffects() {
    // Gallery items hover effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.artefak-card, .analisis-card, .assessment-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// =====================================================
// 10. KEYBOARD NAVIGATION
// ===================================================== 

function initializeKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    document.addEventListener('keydown', (e) => {
        if (e.altKey) {
            // Alt + 1 = Home/Profil
            if (e.key === '1') navLinks[0].click();
            // Alt + 2 = Dokumentasi
            if (e.key === '2') navLinks[1].click();
            // Alt + 3 = Artefak
            if (e.key === '3') navLinks[2].click();
            // Alt + 4 = Lampiran
            if (e.key === '4') navLinks[3].click();
            // Alt + 5 = Model Guru
            if (e.key === '5') navLinks[4].click();
        }
    });
}

// =====================================================
// 11. PERFORMANCE OPTIMIZATION - LAZY LOADING
// ===================================================== 

function initializeLazyLoading() {
    const imageObserverOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Images will load naturally, but you can add loading placeholder logic here
                imageObserver.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    const images = document.querySelectorAll('img');
    images.forEach(img => imageObserver.observe(img));
}

// =====================================================
// 12. PRINT STYLES DETECTION
// ===================================================== 

function initializePrintStyles() {
    window.addEventListener('beforeprint', () => {
        document.body.style.background = 'white';
    });
    
    window.addEventListener('afterprint', () => {
        // Reset styles
    });
}

// =====================================================
// 13. NAVIGATION ACTIVE STATE
// ===================================================== 

function initializeActiveNavState() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = 'var(--color-text-primary)';
            link.style.textShadow = 'none';
            
            if (link.getAttribute('href').slice(1) === current) {
                link.style.color = 'var(--color-primary)';
                link.style.textShadow = '0 0 10px var(--color-primary)';
            }
        });
    });
}

// =====================================================
// 14. INITIALIZATION & DOCUMENT READY
// ===================================================== 

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Cosmic E-Portfolio Loading...');
    
    // Initialize all features
    generateStars();
    initializeParticleCanvas();
    initializeNavigation();
    initializeLightbox();
    initializeCycleTabs();
    initializeScrollAnimations();
    initializeParallax();
    initializeNavbarScroll();
    initializeHoverEffects();
    initializeKeyboardNavigation();
    initializeLazyLoading();
    initializePrintStyles();
    initializeActiveNavState();
    
    console.log('✨ Cosmic E-Portfolio Fully Initialized!');
    console.log('🚀 Navigation Shortcuts: Alt+1-5 to jump between sections');
});

// =====================================================
// 15. ERROR HANDLING & FALLBACKS
// ===================================================== 

window.addEventListener('error', (e) => {
    console.error('Error detected:', e.error);
    // Graceful fallback - site still works
});

// =====================================================
// 16. OPTIONAL: ADVANCED PARALLAX WITH MOUSE
// ===================================================== 

function initializeMouseParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Subtle movement of constellation elements
        const constellationQuote = document.querySelector('.constellation-quote');
        if (constellationQuote) {
            constellationQuote.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
        }
    });
}

// Optional: Uncomment to enable
// document.addEventListener('DOMContentLoaded', () => {
//     initializeMouseParallax();
// });

// =====================================================
// 17. SERVICE WORKER REGISTRATION (PWA Support)
// ===================================================== 

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA support
        // navigator.serviceWorker.register('sw.js').then(reg => {
        //     console.log('✓ Service Worker registered');
        // }).catch(err => {
        //     console.log('✗ Service Worker registration failed:', err);
        // });
    });
}

// =====================================================
// 18. PERFORMANCE MONITORING
// ===================================================== 

function initializePerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        window.addEventListener('load', () => {
            console.log('Performance Report:');
            console.log('Page Load Time: ' + pageLoadTime + 'ms');
        });
    }
}

// =====================================================
// 19. THEME PERSISTENCE (Optional Local Storage)
// ===================================================== 

function initializeThemePersistence() {
    // You can add theme switching functionality here
    // Example: Dark/Light mode toggle
    
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// =====================================================
// 20. ADDITIONAL UTILITIES
// ===================================================== 

// Utility: Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Utility: Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Utility: Get device type
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    if (/tablet/i.test(ua)) return 'tablet';
    return 'desktop';
}

console.log('🌟 Device Type: ' + getDeviceType());
