// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    let icon = '';
    switch(type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        case 'warning':
            icon = '⚠';
            break;
        default:
            icon = 'ℹ';
    }

    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentNode.remove()">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ========== GLOBAL FUNCTIONS ==========
function toggleBookmark(element, event) {
    if (event) event.stopPropagation();

    if (!authDB.isAuthenticated()) {
        showNotification('Please login to save jobs', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const jobCard = element.closest('.job-card') || element.closest('.saved-job-card');
    const jobId = jobCard ? jobCard.querySelector('button[onclick*="selectJob"]')?.getAttribute('onclick')?.match(/selectJob\((\d+)\)/)?.[1] : null;

    if (!jobId) return;

    try {
        if (element.classList.contains('active')) {
            // Remove from saved jobs
            authDB.removeSavedJob(parseInt(jobId));
            element.classList.remove('active');
        } else {
            // Add to saved jobs
            authDB.saveJob(parseInt(jobId));
            element.classList.add('active');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const mobileNavLinks = mobileMenuOverlay.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                mobileMenuToggle.classList.remove('active');
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function performSearch() {
    const jobInput = document.getElementById('jobInput')?.value || '';
    const locationInput = document.getElementById('locationInput')?.value || '';

    if (!jobInput && !locationInput) {
        showNotification('Please enter a job title or location', 'warning');
        return;
    }

    // Use sessionStorage for one-time searches so results don't persist repeatedly
    sessionStorage.setItem('searchJob', jobInput);
    sessionStorage.setItem('searchLocation', locationInput);

    // If already on jobs page, refresh filters and consume the session search
    if (window.location.pathname.includes('jobs.html')) {
        filterAndDisplayJobs();
        // Clear one-time session search and any persistent localStorage search keys
        sessionStorage.removeItem('searchJob');
        sessionStorage.removeItem('searchLocation');
        localStorage.removeItem('searchJob');
        localStorage.removeItem('searchLocation');
    } else {
        window.location.href = 'jobs.html';
    }
}

function handleSort(value) {
    if (window.location.pathname.includes('jobs.html')) {
        filterAndDisplayJobs();
    }
}

function changePage(page) {
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => btn.classList.remove('active'));
    if (page > 0 && page < pageButtons.length - 1) {
        pageButtons[page].classList.add('active');
    }
}

function clearAllFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    if (document.getElementById('jobListings')) {
        filterAndDisplayJobs();
    }
}

// ========== GLOBAL INITIALIZATION ==========
function initGlobal() {
    initHeaderScroll();
    initSearch();
    initTags();
    initSmoothScroll();
    initMobileMenu();
}

// Header scroll effect
function initHeaderScroll() {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');

        if (scrollTop > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
        lastScrollTop = scrollTop;
    });
}

// Search functionality
function initSearch() {
    const jobInput = document.getElementById('jobInput');
    const locationInput = document.getElementById('locationInput');

    if (jobInput) jobInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    if (locationInput) locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Tags functionality
function initTags() {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const jobInput = document.getElementById('jobInput');
            if (jobInput) {
                jobInput.value = tag.textContent;
            }
        });
    });
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========== GLOBAL INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initSearch();
    initTags();
    initSmoothScroll();
    
    // Update navigation UI if auth system is available
    if (typeof updateNavigationUI === 'function') {
        updateNavigationUI();
    }
});