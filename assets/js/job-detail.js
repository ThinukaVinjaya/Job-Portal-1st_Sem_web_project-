// ========== JOB DETAIL PAGE ==========
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

// ========== JOB DETAIL INITIALIZATION ==========
function initJobDetail() {
    if (window.location.pathname.includes('job-detail.html')) {
        displayJobDetails();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initJobDetail);