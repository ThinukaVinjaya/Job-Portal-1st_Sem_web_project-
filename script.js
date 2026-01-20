// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'info' ? 'ℹ' : '⚠';
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// ========== AUTHENTICATION FUNCTIONS ==========
function checkAuthStatus() {
    return authDB.isAuthenticated() ? authDB.getCurrentUser() : null;
}

function logout() {
    authDB.logout();
    showNotification('You have been logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateNavigationUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');

    const userData = checkAuthStatus();
    const isDashboardPage = window.location.pathname.includes('dashboard.html') ||
                           window.location.href.includes('dashboard.html');

    if (userData) {
        // User is logged in
        if (isDashboardPage) {
            // On dashboard page, show logout only
            const dashboardButtons = `
                <button onclick="logout()" class="btn-logout" style="background-color: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">Logout</button>
            `;
            if (authButtons) authButtons.innerHTML = dashboardButtons;
            if (mobileAuthButtons) mobileAuthButtons.innerHTML = dashboardButtons;
        } else {
            // On other pages, show dashboard link and logout
            const regularButtons = `
                <a href="dashboard.html" class="btn-dashboard" style="color: #4A90E2; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem;">Dashboard</a>
                <button onclick="logout()" class="btn-logout" style="background-color: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">Logout</button>
            `;
            if (authButtons) authButtons.innerHTML = regularButtons;
            if (mobileAuthButtons) mobileAuthButtons.innerHTML = regularButtons;
        }
    } else {
        // User is logged out
        const loginButtons = `
            <a href="login.html" class="btn-login" style="color: #4A90E2; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem;">Login</a>
            <a href="signup.html" class="btn-signup" style="background-color: #4A90E2; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: 600;">Sign Up Free</a>
        `;
        if (authButtons) authButtons.innerHTML = loginButtons;
        if (mobileAuthButtons) mobileAuthButtons.innerHTML = loginButtons;
    }
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

// ========== JOB NAVIGATION & FILTERING ==========
function selectJob(jobId) {
    const job = jobsDatabase.find(j => j.id === jobId);
    if (job) {
        localStorage.setItem('selectedJob', JSON.stringify(job));
        window.location.href = 'job-detail.html';
    }
}

function getSelectedJob() {
    const jobStr = localStorage.getItem('selectedJob');
    return jobStr ? JSON.parse(jobStr) : null;
}

function displayJobDetails() {
    const job = getSelectedJob();
    if (!job) {
        window.location.href = 'jobs.html';
        return;
    }
    
    const detailContainer = document.querySelector('.job-detail-container');
    if (detailContainer) {
        const detailsHTML = `
            <div style="animation: slideUp 0.6s ease;">
                <div class="job-detail-header">
                    <div class="job-detail-title">
                        <div class="job-detail-avatar" style="background: ${job.avatarGradient};">${job.avatar}</div>
                        <div class="job-detail-info">
                            <h1>${job.title}</h1>
                            <div class="job-detail-company">${job.company} • ${job.location} (${job.type})</div>
                            <div class="job-detail-meta">
                                <span class="detail-meta-item meta-salary"><!-- add icone --> ${job.salary}/year</span>
                                <span class="detail-meta-item"><!-- add icone --> ${job.category}</span>
                                <span class="detail-meta-item"><!-- add icone --> ${job.type}</span>
                                <span class="detail-meta-item"><!-- add icone --> Senior Level</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-apply" onclick="showNotification('Successfully applied for ${job.title} at ${job.company}!', 'success')" style="transition: all 0.3s; cursor: pointer;">Easy Apply</button>
                </div>

                <div class="job-detail-content">
                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.1s both;">
                        <h3>Job Description</h3>
                        <p>${job.fullDescription}</p>
                    </div>

                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.2s both;">
                        <h3>Requirements</h3>
                        <ul class="requirements-list">
                            ${job.requirements.map(req => `<li style="animation: slideIn 0.5s ease;"> ${req}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.3s both;">
                        <h3>Benefits & Perks</h3>
                        <div class="benefits-grid">
                            ${job.benefits.map((benefit, idx) => `<div class="benefit-card" style="animation: pop 0.4s ease ${0.3 + idx * 0.1}s both;"> ${benefit}</div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        detailContainer.innerHTML = detailsHTML;
    }
}

function filterAndDisplayJobs() {
    const container = document.getElementById('jobListings');
    if (!container) return;

    // Get filter values
    const selectedCategories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
        .map(cb => cb.value)
        .filter(val => jobsDatabase.some(job => job.category === val));
    
    const selectedLocation = document.querySelector('input[type="radio"]:checked')?.value;
    const sortBy = document.querySelector('.sort-select')?.value || 'relevant';
    // Prefer sessionSearch (one-time) then fall back to persistent localStorage
    const sessionSearchJob = sessionStorage.getItem('searchJob');
    const sessionSearchLocation = sessionStorage.getItem('searchLocation');
    const searchJob = (sessionSearchJob ?? localStorage.getItem('searchJob') ?? '').toLowerCase();
    const searchLocation = (sessionSearchLocation ?? localStorage.getItem('searchLocation') ?? '').toLowerCase();

    // If we consumed session search params, remove them so the search only applies once
    if (sessionSearchJob !== null || sessionSearchLocation !== null) {
        sessionStorage.removeItem('searchJob');
        sessionStorage.removeItem('searchLocation');
        // Also clear any persistent search used previously to ensure history cleared
        localStorage.removeItem('searchJob');
        localStorage.removeItem('searchLocation');
    }

    // Filter jobs
    let filtered = jobsDatabase.filter(job => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchesLocation = !selectedLocation || job.type === selectedLocation;
        const matchesSearchJob = !searchJob || job.title.toLowerCase().includes(searchJob) || job.company.toLowerCase().includes(searchJob);
        const matchesSearchLocation = !searchLocation || job.location.toLowerCase().includes(searchLocation);
        
        return matchesCategory && matchesLocation && matchesSearchJob && matchesSearchLocation;
    });

    // Sort jobs
    switch(sortBy) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
            break;
        case 'salary-high':
            filtered.sort((a, b) => {
                const salaryA = parseInt(b.salary.split('-')[0].replace(/[^\d]/g, '')) * 1000;
                const salaryB = parseInt(a.salary.split('-')[0].replace(/[^\d]/g, '')) * 1000;
                return salaryA - salaryB;
            });
            break;
        case 'salary-low':
            filtered.sort((a, b) => {
                const salaryA = parseInt(a.salary.split('-')[0].replace(/[^\d]/g, '')) * 1000;
                const salaryB = parseInt(b.salary.split('-')[0].replace(/[^\d]/g, '')) * 1000;
                return salaryA - salaryB;
            });
            break;
    }

    // Display results with animations
    container.innerHTML = filtered.map((job, idx) => `
        <div class="job-card" onclick="selectJob(${job.id})" style="cursor: pointer; transition: all 0.3s; animation: slideUp 0.5s ease ${idx * 0.05}s both; transform: translateY(0);" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div class="job-avatar" style="background: ${job.avatarGradient};">${job.avatar}</div>
            <div class="job-info">
                <div class="job-title">${job.title}</div>
                <div class="company-name">${job.company}</div>
                <div class="job-meta">
                    <span class="meta-item meta-location"><!-- add icone --> ${job.location} (${job.type})</span>
                    <span class="meta-item meta-salary"><!-- add icone --> ${job.salary}</span>
                    <span class="meta-item meta-badge">Posted ${job.posted}</span>
                </div>
                <div class="job-description">${job.description}</div>
                <div class="job-actions">
                    <button class="btn-apply" onclick="event.stopPropagation(); selectJob(${job.id})">Easy Apply ➤</button>
                </div>
            </div>
            <span class="bookmark-btn" onclick="toggleBookmark(this, event)"><!-- add icone --></span>
        </div>
    `).join('');

    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${filtered.length} jobs`;
    }
}

// ========== REAL-TIME FILTER LISTENER ==========
function initJobFilters() {
    // Category & employment filters (listen for changes but only category is used for filtering)
    document.querySelectorAll('input[data-filter="category"], input[data-filter="employment"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterAndDisplayJobs);
    });

    // Location filters
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', filterAndDisplayJobs);
    });

    // Sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndDisplayJobs);
    }

    // Display jobs on page load
    if (document.getElementById('jobListings')) {
        filterAndDisplayJobs();
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            faqItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Auth Tabs
function initAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// Password toggle
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = btn.previousElementSibling;
            if (input && input.type === 'password') {
                input.type = 'text';
                btn.textContent = '<!-- add icone -->';
            } else if (input) {
                input.type = 'password';
                btn.textContent = '<!-- add icone -->';
            }
        });
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

// Category cards
function initCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h3').textContent;
            showNotification(`Showing jobs in ${categoryName}`, 'info');
        });
    });
}

// Contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.send-btn') || contactForm.querySelector('button');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const fullName = document.querySelector('input[name="full_name"]')?.value;
                const email = document.querySelector('input[name="email"]')?.value;
                const message = document.querySelector('textarea[name="message"]')?.value;
                
                if (fullName && email && message) {
                    showNotification(`Thank you ${fullName}! We'll contact you at ${email} soon.`, 'success');
                    contactForm.reset();
                } else {
                    showNotification('Please fill in all fields', 'warning');
                }
            });
        }
    }
}

// Auth handlers
function initAuthHandlers() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.querySelector('input[name="email"]')?.value;
            const password = document.querySelector('input[name="password"]')?.value;
            
            if (email && password) {
                showNotification(`Welcome back! Logging in as ${email}`, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Please fill in all fields', 'warning');
            }
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const fullName = document.querySelector('input[name="full_name"]')?.value;
            const email = document.querySelector('input[name="email"]')?.value;
            const password = document.querySelector('input[name="password"]')?.value;
            
            if (fullName && email && password) {
                showNotification(`Account created successfully for ${fullName}!`, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Please fill in all fields', 'warning');
            }
        });
    }
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

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initSearch();
    initJobFilters();
    initTags();
    initCategoryCards();
    initFAQ();
    initAuthTabs();
    initPasswordToggle();
    initContactForm();
    initAuthHandlers();
    initSmoothScroll();
    initMobileMenu();
    updateNavigationUI();
    
    // Display job details if on job-detail page
    if (window.location.pathname.includes('job-detail.html')) {
        displayJobDetails();
    }
});
