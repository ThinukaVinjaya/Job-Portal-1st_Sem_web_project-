// ========== DASHBOARD FUNCTIONS ==========
function checkAuthOnDashboard() {
    if (!authDB.isAuthenticated()) {
        showNotification('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const user = authDB.getCurrentUser();
    // Update dashboard header with role
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        dashboardHeader.innerHTML = `
            <h1>My Dashboard</h1>
            <p>Welcome back, ${user.email}! You are logged in as <strong>${user.role === 'job-seeker' ? 'Job Seeker' : 'Employer'}</strong></p>
        `;
    }

    // Show/hide employer tabs based on role
    const employerTabs = document.querySelectorAll('.employer-only');
    employerTabs.forEach(tab => {
        if (user.role === 'employer') {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}

function showDashboardTab(tabName, event) {
    event.preventDefault();

    // Show loading indicator
    const main = document.querySelector('.dashboard-main');
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
    main.appendChild(loading);

    // Simulate loading delay for better UX
    setTimeout(() => {
        // Hide all tabs
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active from nav items
        document.querySelectorAll('.dashboard-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName + '-tab').classList.add('active');

        // Add active class to the clicked nav item
        const navItem = event.target.closest('.dashboard-nav-item');
        if (navItem) {
            navItem.classList.add('active');
        }

        // Remove loading
        main.removeChild(loading);
    }, 200);
}

function createJobAlert() {
    const title = document.getElementById('alertJobTitle').value;
    const location = document.getElementById('alertLocation').value;

    if(!title || !location) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }

    try {
        const alert = authDB.addJobAlert({
            title: title,
            location: location,
            daily: document.getElementById('alertDaily').checked
        });

        showNotification(`Alert created for ${title} jobs in ${location}`, 'success');
        document.getElementById('alertJobTitle').value = '';
        document.getElementById('alertLocation').value = '';
        loadJobAlerts();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function saveProfile() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const title = document.getElementById('profileTitle').value;
    const bio = document.getElementById('profileBio').value;

    if(!name || !email) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }

    try {
        authDB.updateProfile({
            name: name,
            title: title,
            bio: bio
        });

        showNotification('Profile saved successfully!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function loadSavedJobs() {
    const savedJobIds = authDB.getSavedJobs();
    const savedJobs = jobsDatabase.filter(job => savedJobIds.includes(job.id));
    const list = document.getElementById('saved-jobs-list');

    if(savedJobs.length === 0) {
        document.getElementById('saved-info').textContent = 'You haven\'t saved any jobs yet';
        list.innerHTML = '';
    } else {
        document.getElementById('saved-info').textContent = `${savedJobs.length} job(s) saved`;
        list.innerHTML = savedJobs.map(job => `
            <div class="saved-job-card scroll-fade-in">
                <div class="saved-job-header">
                    <h3>${job.title}</h3>
                    <button onclick="removeSavedJob('${job.id}')" class="btn-remove">✕</button>
                </div>
                <p class="company-name">${job.company}</p>
                <p class="job-location">${job.location}</p>
                <button onclick="selectJob('${job.id}')" class="btn btn-primary">View Details</button>
            </div>
        `).join('');
    }
    document.getElementById('saved-count').textContent = savedJobs.length;
}

function loadAppliedJobs() {
    const appliedJobIds = authDB.getAppliedJobs();
    const appliedJobs = jobsDatabase.filter(job => appliedJobIds.includes(job.id));
    const list = document.getElementById('applied-jobs-list');

    if(appliedJobs.length === 0) {
        document.getElementById('applied-info').textContent = 'You haven\'t applied to any jobs yet';
        list.innerHTML = '';
    } else {
        document.getElementById('applied-info').textContent = `${appliedJobs.length} job(s) applied to`;
        list.innerHTML = appliedJobs.map(job => `
            <div class="applied-job-card scroll-fade-in">
                <div class="applied-job-header">
                    <h3>${job.title}</h3>
                    <span class="applied-status">Applied</span>
                </div>
                <p class="company-name">${job.company}</p>
                <p class="job-location">${job.location}</p>
                <button onclick="selectJob('${job.id}')" class="btn btn-primary">View Details</button>
            </div>
        `).join('');
    }
    document.getElementById('applied-count').textContent = appliedJobs.length;
}

function loadJobAlerts() {
    const alerts = authDB.getJobAlerts();
    const alertsList = document.getElementById('alerts-list');

    if(alerts.length === 0) {
        alertsList.innerHTML = '<p style="color: #999; padding: 2rem; text-align: center;">No job alerts created yet</p>';
    } else {
        alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-item scroll-fade-in" style="border: 1px solid #ddd; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong>${alert.title}</strong> in <strong>${alert.location}</strong>
                        <p style="color: #999; font-size: 0.85rem; margin-top: 0.5rem;">Created ${new Date(alert.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onclick="removeAlert('${alert.id}')" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;">✕</button>
                </div>
            </div>
        `).join('');
    }
}

function removeSavedJob(jobId) {
    try {
        authDB.removeSavedJob(parseInt(jobId));
        loadSavedJobs();
    } catch (error) {
        alert(error.message);
    }
}

function removeAlert(alertId) {
    try {
        authDB.removeJobAlert(alertId);
        loadJobAlerts();
        showNotification('Job alert removed successfully', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function handleJobPost(event) {
    event.preventDefault();

    const jobData = {
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('jobCompany').value,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        category: document.getElementById('jobCategory').value,
        salary: document.getElementById('jobSalary').value,
        description: document.getElementById('jobDescription').value,
        fullDescription: document.getElementById('jobDescription').value,
        requirements: document.getElementById('jobRequirements').value.split('\n').filter(req => req.trim()),
        benefits: document.getElementById('jobBenefits').value.split('\n').filter(benefit => benefit.trim()),
        avatar: document.getElementById('jobCompany').value.charAt(0).toUpperCase(),
        avatarGradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
        posted: 'Just now'
    };

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.type || !jobData.category || !jobData.description) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }

    // Generate new ID
    const newId = Math.max(...jobsDatabase.map(job => job.id)) + 1;
    jobData.id = newId;

    // Add to jobs database
    jobsDatabase.push(jobData);

    // Save to localStorage for persistence
    localStorage.setItem('jobsDatabase', JSON.stringify(jobsDatabase));

    showNotification(`Job "${jobData.title}" posted successfully!`, 'success');
    document.getElementById('jobPostForm').reset();

    // Optionally redirect to jobs page to see the new job
    setTimeout(() => {
        if (confirm('Job posted! Would you like to view all jobs?')) {
            window.location.href = 'jobs.html';
        }
    }, 1000);
}

function loadUserProfile() {
    const user = authDB.getCurrentUser();
    const profile = authDB.getProfile();

    if (user) {
        document.getElementById('profileEmail').value = user.email;
    }

    if (profile) {
        document.getElementById('profileName').value = profile.name || '';
        document.getElementById('profileTitle').value = profile.title || '';
        document.getElementById('profileBio').value = profile.bio || '';
    }
}

// Load dark mode preference
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkMode').checked = true;
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function quickPostJob() {
    const user = authDB.getCurrentUser();
    if (user && user.role === 'employer') {
        showDashboardTab('create-job', { preventDefault: () => {}, target: document.querySelector(`[onclick*="showDashboardTab('create-job')"]`) });
        // Scroll to form
        document.querySelector('.job-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Show FAB only for employers on mobile
function updateFABVisibility() {
    const user = authDB.getCurrentUser();
    const fab = document.getElementById('fabContainer');
    if (user && user.role === 'employer' && window.innerWidth <= 768) {
        fab.style.display = 'block';
    } else {
        fab.style.display = 'none';
    }
}

// ========== DASHBOARD INITIALIZATION ==========
function initDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        checkAuthOnDashboard();
        loadSavedJobs();
        loadAppliedJobs();
        loadJobAlerts();
        loadUserProfile();
        loadDarkModePreference();
        updateFABVisibility();

        // Initialize dashboard tabs
        const defaultTab = 'saved';
        showDashboardTab(defaultTab, { preventDefault: () => {}, target: document.querySelector(`[onclick*="showDashboardTab('${defaultTab}')"]`) });
    }
}

// ========== DASHBOARD INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
});