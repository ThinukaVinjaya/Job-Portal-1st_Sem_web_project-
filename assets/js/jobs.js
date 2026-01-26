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

function filterAndDisplayJobs() {
    const container = document.getElementById('jobListings');
    if (!container) return;

    // Get filter values
    const selectedCategories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
        .map(cb => cb.value)
        .filter(val => jobsDatabase.some(job => job.category === val));

    const selectedEmploymentTypes = Array.from(document.querySelectorAll('input[data-filter="employment"]:checked'))
        .map(cb => cb.value)
        .filter(val => jobsDatabase.some(job => job.employmentType === val));

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
        const matchesEmployment = selectedEmploymentTypes.length === 0 || selectedEmploymentTypes.includes(job.employmentType);
        const matchesLocation = !selectedLocation || job.type === selectedLocation;
        const matchesSearchJob = !searchJob || job.title.toLowerCase().includes(searchJob) || job.company.toLowerCase().includes(searchJob);
        const matchesSearchLocation = !searchLocation || job.location.toLowerCase().includes(searchLocation);

        return matchesCategory && matchesEmployment && matchesLocation && matchesSearchJob && matchesSearchLocation;
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
        <div class="job-card" onclick="selectJob(${job.id})" style="animation: slideUp 0.5s ease ${idx * 0.05}s both;">
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

// ========== JOBS INITIALIZATION ==========
function initJobs() {
    if (window.location.pathname.includes('jobs.html')) {
        initJobFilters();
    }
}

// ========== PAGINATION & SORTING ==========
function changePage(page) {
    // Simple pagination - in a real app this would handle actual pagination
    console.log('Changing to page:', page);
    // For now, just update the active button
    document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`.page-btn:nth-child(${page})`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

function handleSort(value) {
    // This function is called from the HTML onchange, but we handle sorting in filterAndDisplayJobs
    filterAndDisplayJobs();
}

function clearAllFilters() {
    // Clear ALL category checkboxes
    document.querySelectorAll('input[data-filter="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear ALL employment checkboxes
    document.querySelectorAll('input[data-filter="employment"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear location radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Reset sort to default
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.value = 'relevant';
    }

    // Clear any search parameters
    sessionStorage.removeItem('searchJob');
    sessionStorage.removeItem('searchLocation');
    localStorage.removeItem('searchJob');
    localStorage.removeItem('searchLocation');

    // Re-filter and display jobs (this will show all jobs when no filters are applied)
    filterAndDisplayJobs();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initJobs);