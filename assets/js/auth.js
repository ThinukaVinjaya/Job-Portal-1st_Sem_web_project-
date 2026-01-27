// ========== AUTHENTICATION FUNCTIONS ==========
function checkAuthStatus() {
    return authDB.isAuthenticated() ? authDB.getCurrentUser() : null;
}

function logout() {
    authDB.logout();
    showNotification('You have been logged out successfully', 'info');
    
    // Determine correct path to index.html
    const isInPagesDir = window.location.pathname.includes('/pages/') || window.location.href.includes('/pages/');
    const indexHref = isInPagesDir ? '../index.html' : 'index.html';
    
    setTimeout(() => {
        window.location.href = indexHref;
    }, 1000);
}

function updateNavigationUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');

    const userData = checkAuthStatus();
    const isDashboardPage = window.location.pathname.includes('dashboard.html') ||
                           window.location.href.includes('dashboard.html');
    
    // Determine if we're in the pages/ directory
    const isInPagesDir = window.location.pathname.includes('/pages/') || window.location.href.includes('/pages/');
    const dashboardHref = isInPagesDir ? 'dashboard.html' : 'pages/dashboard.html';
    const loginHref = isInPagesDir ? 'login.html' : 'pages/login.html';
    const signupHref = isInPagesDir ? 'signup.html' : 'pages/signup.html';

    if (userData) {
        // User is logged in
        if (isDashboardPage) {
            // On dashboard page, show logout only
            const dashboardButtons = `
                <button onclick="logout()" class="btn-logout" style="background-color: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">Logout</button>
            `;
            if (authButtons) authButtons.innerHTML = dashboardButtons;
            if (mobileAuthButtons) mobileAuthButtons.innerHTML = dashboardButtons;
            
            // Add mobile menu close functionality to new buttons
            if (mobileAuthButtons) {
                const newButtons = mobileAuthButtons.querySelectorAll('a, button');
                newButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
                        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });
            }
        } else {
            // On other pages, show dashboard link and logout
            const regularButtons = `
                <a href="${dashboardHref}" class="btn-dashboard" style="background-color: #4A90E2; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500; text-decoration: none; display: inline-block; margin-right: 0.5rem;">Dashboard</a>
                <button onclick="logout()" class="btn-logout" style="border: 2px solid #e74c3c; background: white; color: #e74c3c; padding: 0.6rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500;">Logout</button>
            `;
            if (authButtons) authButtons.innerHTML = regularButtons;
            if (mobileAuthButtons) mobileAuthButtons.innerHTML = regularButtons;
            
            // Add mobile menu close functionality to new buttons
            if (mobileAuthButtons) {
                const newButtons = mobileAuthButtons.querySelectorAll('a, button');
                newButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
                        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });
            }
        }
    } else {
        // User is not logged in - show login/signup buttons
        const loginButtons = `
            <a href="${loginHref}" class="btn-login">Login</a>
            <a href="${signupHref}" class="btn-signup">Sign Up Free</a>
        `;
        if (authButtons) authButtons.innerHTML = loginButtons;
        if (mobileAuthButtons) mobileAuthButtons.innerHTML = loginButtons;
        
        // Add mobile menu close functionality to new buttons
        if (mobileAuthButtons) {
            const newButtons = mobileAuthButtons.querySelectorAll('a, button');
            newButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
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
                btn.textContent = '🙈';
            } else if (input) {
                input.type = 'password';
                btn.textContent = '👁';
            }
        });
    });
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

// ========== AUTH INITIALIZATION ==========
function initAuth() {
    initAuthTabs();
    initPasswordToggle();
    initAuthHandlers();
    updateNavigationUI();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html') || window.location.pathname.includes('dashboard.html')) {
        initAuth();
    }
});