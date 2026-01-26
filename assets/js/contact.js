// ========== CONTACT PAGE FUNCTIONS ==========
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

// ========== CONTACT INITIALIZATION ==========
function initContact() {
    if (window.location.pathname.includes('contact.html')) {
        initContactForm();
        initFAQ();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initContact);