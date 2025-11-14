// Checkout Page Functionality
class CheckoutPage {
    constructor() {
        this.cart = nurApp.cart;
        this.init();
    }

    init() {
        this.displayOrderSummary();
        this.setupFormValidation();
        this.setupPlaceOrder();
    }

    displayOrderSummary() {
        const container = document.getElementById('checkoutItems');
        const subtotal = nurApp.getCartTotal();
        const deliveryCharge = nurApp.getDeliveryCharge();
        const total = subtotal + deliveryCharge;

        if (container) {
            container.innerHTML = this.cart.map(item => `
                <div class="summary-item">
                    <span>${item.name} (${item.size}) x ${item.quantity}</span>
                    <span>৳ ${item.price * item.quantity}</span>
                </div>
            `).join('');
        }

        // Update totals
        document.getElementById('checkoutSubtotal').textContent = `৳ ${subtotal}`;
        document.getElementById('checkoutDelivery').textContent = `৳ ${deliveryCharge}`;
        document.getElementById('checkoutTotal').textContent = `৳ ${total}`;
    }

    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    this.placeOrder();
                }
            });
        }
    }

    validateForm() {
        const requiredFields = ['customerName', 'customerPhone', 'customerAddress', 'customerCity', 'customerArea'];
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

        // Phone number validation
        const phoneField = document.getElementById('customerPhone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^(?:\+88|01)?\d{11}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                isValid = false;
                this.showFieldError(phoneField, 'সঠিক মোবাইল নম্বর দিন');
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

    setupPlaceOrder() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                if (this.validateForm()) {
                    this.placeOrder();
                }
            });
        }
    }

    placeOrder() {
        // Get form data
        const formData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value,
            city: document.getElementById('customerCity').value,
            area: document.getElementById('customerArea').value,
            zip: document.getElementById('customerZip').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
        };

        // Create order
        const order = {
            id: this.generateOrderId(),
            items: this.cart,
            customer: formData,
            subtotal: nurApp.getCartTotal(),
            deliveryCharge: nurApp.getDeliveryCharge(),
            total: nurApp.getCartTotal() + nurApp.getDeliveryCharge(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save order to localStorage (in real app, this would go to Firebase)
        this.saveOrder(order);

        // Clear cart
        nurApp.cart = [];
        nurApp.saveCart();
        nurApp.updateCartCount();

        // Show success modal
        this.showSuccessModal(order.id);
    }

    generateOrderId() {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `NUR-${timestamp}-${random}`;
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('nur_orders')) || [];
        orders.push(order);
        localStorage.setItem('nur_orders', JSON.stringify(orders));
    }

    showSuccessModal(orderId) {
        const modal = document.getElementById('successModal');
        const orderNumber = document.getElementById('orderNumber');
        
        if (orderNumber) {
            orderNumber.innerHTML = `আপনার অর্ডার নম্বর: <strong>${orderId}</strong>`;
        }
        
        if (modal) {
            modal.style.display = 'flex';
        }
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutPage();
});
