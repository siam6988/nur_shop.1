// Settings Page Functionality
class SettingsPage {
    constructor() {
        this.init();
    }

    init() {
        this.loadCurrentSettings();
        this.setupEventListeners();
    }

    loadCurrentSettings() {
        // Load language setting
        const currentLanguage = localStorage.getItem('nur_language') || 'bn';
        const languageRadio = document.querySelector(`input[name="language"][value="${currentLanguage}"]`);
        if (languageRadio) {
            languageRadio.checked = true;
        }

        // Load notification settings
        const notifications = JSON.parse(localStorage.getItem('nur_notifications')) || {
            email: true,
            sms: true,
            promotional: false
        };

        document.querySelectorAll('.notification-settings input[type="checkbox"]').forEach(checkbox => {
            const setting = checkbox.parentNode.querySelector('.notification-text').textContent;
            if (setting.includes('ইমেইল')) checkbox.checked = notifications.email;
            if (setting.includes('এসএমএস')) checkbox.checked = notifications.sms;
            if (setting.includes('প্রোমোশনাল')) checkbox.checked = notifications.promotional;
        });

        // Load privacy settings
        const privacy = JSON.parse(localStorage.getItem('nur_privacy')) || {
            dataCollection: true,
            thirdPartySharing: false
        };

        document.querySelectorAll('.privacy-settings input[type="checkbox"]').forEach(checkbox => {
            const setting = checkbox.parentNode.querySelector('.privacy-text').textContent;
            if (setting.includes('ডেটা সংগ্রহ')) checkbox.checked = privacy.dataCollection;
            if (setting.includes('থার্ড-পার্টি')) checkbox.checked = privacy.thirdPartySharing;
        });
    }

    setupEventListeners() {
        // Language change
        document.querySelectorAll('input[name="language"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                localStorage.setItem('nur_language', e.target.value);
                nurApp.showToast(e.target.value === 'bn' ? 'ভাষা বাংলাতে পরিবর্তন করা হয়েছে' : 'Language changed to English');
            });
        });

        // Notification settings
        document.querySelectorAll('.notification-settings input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveNotificationSettings();
            });
        });

        // Privacy settings
        document.querySelectorAll('.privacy-settings input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.savePrivacySettings();
            });
        });

        // Account settings form
        const accountForm = document.querySelector('.account-settings');
        if (accountForm) {
            accountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAccountSettings();
            });
        }

        // Danger zone actions
        document.querySelector('.btn-danger')?.addEventListener('click', () => {
            this.deleteAccount();
        });

        document.querySelector('.btn-warning')?.addEventListener('click', () => {
            this.logout();
        });
    }

    saveNotificationSettings() {
        const notifications = {
            email: document.querySelector('.notification-settings input[type="checkbox"]:nth-child(1)').checked,
            sms: document.querySelector('.notification-settings input[type="checkbox"]:nth-child(2)').checked,
            promotional: document.querySelector('.notification-settings input[type="checkbox"]:nth-child(3)').checked
        };

        localStorage.setItem('nur_notifications', JSON.stringify(notifications));
        nurApp.showToast('নোটিফিকেশন সেটিংস সেভ করা হয়েছে');
    }

    savePrivacySettings() {
        const privacy = {
            dataCollection: document.querySelector('.privacy-settings input[type="checkbox"]:nth-child(1)').checked,
            thirdPartySharing: document.querySelector('.privacy-settings input[type="checkbox"]:nth-child(2)').checked
        };

        localStorage.setItem('nur_privacy', JSON.stringify(privacy));
        nurApp.showToast('প্রাইভেসি সেটিংস সেভ করা হয়েছে');
    }

    saveAccountSettings() {
        const accountData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value
        };

        localStorage.setItem('nur_account', JSON.stringify(accountData));
        nurApp.showToast('অ্যাকাউন্ট তথ্য আপডেট করা হয়েছে');
    }

    deleteAccount() {
        if (confirm('আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট ডিলিট করতে চান? এই কাজটি undo করা যাবে না।')) {
            // Clear all user data
            localStorage.removeItem('nur_cart');
            localStorage.removeItem('nur_orders');
            localStorage.removeItem('nur_account');
            localStorage.removeItem('nur_notifications');
            localStorage.removeItem('nur_privacy');
            
            nurApp.showToast('অ্যাকাউন্ট সফলভাবে ডিলিট করা হয়েছে');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    logout() {
        // Clear session data but keep settings
        const language = localStorage.getItem('nur_language');
        const notifications = localStorage.getItem('nur_notifications');
        const privacy = localStorage.getItem('nur_privacy');

        localStorage.clear();

        // Restore settings
        if (language) localStorage.setItem('nur_language', language);
        if (notifications) localStorage.setItem('nur_notifications', notifications);
        if (privacy) localStorage.setItem('nur_privacy', privacy);

        nurApp.showToast('সফলভাবে লগআউট করা হয়েছে');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
    new SettingsPage();
});
