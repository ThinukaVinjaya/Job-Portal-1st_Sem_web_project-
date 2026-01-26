// ========== ABOUT PAGE FUNCTIONS ==========
function initCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h3').textContent;
            showNotification(`Showing jobs in ${categoryName}`, 'info');
        });
    });
}

// ========== ABOUT INITIALIZATION ==========
function initAbout() {
    if (window.location.pathname.includes('about.html')) {
        initCategoryCards();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAbout);