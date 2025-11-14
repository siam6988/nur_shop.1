// Contact Page Functionality
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupFAQ();
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateContactForm()) {
                    this.submitContactForm();
                }
            });
        }
    }

    validateContactForm() {
        const requiredFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'এই ফিল্ডটি পূরণ করা আবশ্যক');
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailField = document.getElementById('contactEmail');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                this.showFieldError(emailField, 'সঠিক ইমেইল দিন');
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = 'var(--danger-color)';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: var(--danger-color); font-size: 0.8rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    submitContactForm() {
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // In a real app, this would send to a server
        console.log('Contact form submitted:', formData);
        
        nurApp.showToast('আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});
