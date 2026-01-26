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
                <a href="dashboard.html" class="btn-dashboard" style="background-color: #4A90E2; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500; text-decoration: none; display: inline-block; margin-right: 0.5rem;">Dashboard</a>
                <button onclick="logout()" class="btn-logout" style="border: 2px solid #e74c3c; background: white; color: #e74c3c; padding: 0.6rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500;">Logout</button>
            `;
            if (authButtons) authButtons.innerHTML = regularButtons;
            if (mobileAuthButtons) mobileAuthButtons.innerHTML = regularButtons;
        }
    } else {
        // User is not logged in - show login/signup buttons
        const loginButtons = `
            <a href="login.html" class="btn-login">Login</a>
            <a href="signup.html" class="btn-signup">Sign Up Free</a>
        `;
        if (authButtons) authButtons.innerHTML = loginButtons;
        if (mobileAuthButtons) mobileAuthButtons.innerHTML = loginButtons;
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
                btn.textContent = '<!-- add icone -->';
            } else if (input) {
                input.type = 'password';
                btn.textContent = '<!-- add icone -->';
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