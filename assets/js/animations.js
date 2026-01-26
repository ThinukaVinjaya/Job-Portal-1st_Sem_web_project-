// animations.js - Animation and interaction scripts for JobPortal

document.addEventListener('DOMContentLoaded', function() {
    // Scroll-triggered animations - lightweight version for better mobile performance
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add scroll animation classes to elements
    const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-up, .scroll-rotate-in, .scroll-slide-up');
    scrollElements.forEach(el => observer.observe(el));

    // Stagger animations for grids
    const staggerGrids = document.querySelectorAll('.categories, .testimonials-grid');
    staggerGrids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('stagger-item');
            observer.observe(item);
        });
    });

    // Stagger animations for footer sections
    const footerSections = document.querySelectorAll('footer .footer-section, footer .footer-bottom');
    footerSections.forEach((section, index) => {
        section.style.transitionDelay = `${index * 0.15}s`;
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const targetText = stat.textContent;
        const target = parseInt(targetText.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 100;
        const suffix = targetText.replace(/\d+/g, '');

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, 20);
    });

    // Magnetic effect for buttons
    const magneticButtons = document.querySelectorAll('.btn, button');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });

    // Particle effect on hover for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            for (let i = 0; i < 5; i++) {
                createParticle(this);
            }
        });
    });

    function createParticle(element) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#4A90E2';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = 'particleFloat 1s ease-out forwards';

        element.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-20px) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// Intersection Observer for performance optimization
const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.willChange = 'transform, opacity';
        } else {
            entry.target.style.willChange = 'auto';
        }
    });
});

document.querySelectorAll('.category-card, .testimonial-card, .stat-item').forEach(el => {
    performanceObserver.observe(el);
});