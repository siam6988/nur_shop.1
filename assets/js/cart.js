// Cart Page Functionality
class CartPage {
    constructor() {
        this.cart = nurApp.cart;
        this.init();
    }

    init() {
        this.displayCartItems();
        this.setupEventListeners();
        this.updateSummary();
    }

    displayCartItems() {
        const container = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (this.cart.length === 0) {
            if (container) container.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (container) container.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = false;

        if (container) {
            container.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="cart-item-meta">
                            <span>সাইজ: ${item.size}</span>
                        </div>
                        <div class="cart-item-price">৳ ${item.price}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cartPage.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartPage.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-item" onclick="cartPage.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length > 0) {
                    window.location.href = 'checkout.html';
                }
            });
        }
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                nurApp.saveCart();
                this.displayCartItems();
                this.updateSummary();
                nurApp.updateCartCount();
            }
        }
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        nurApp.cart = this.cart;
        nurApp.saveCart();
        this.displayCartItems();
        this.updateSummary();
        nurApp.updateCartCount();
    }

    updateSummary() {
        const subtotal = nurApp.getCartTotal();
        const deliveryCharge = nurApp.getDeliveryCharge();
        const total = subtotal + deliveryCharge;

        const subtotalElement = document.getElementById('subtotal');
        const deliveryElement = document.getElementById('deliveryCharge');
        const totalElement = document.getElementById('totalAmount');

        if (subtotalElement) subtotalElement.textContent = `৳ ${subtotal}`;
        if (deliveryElement) deliveryElement.textContent = `৳ ${deliveryCharge}`;
        if (totalElement) totalElement.textContent = `৳ ${total}`;
    }
}

// Initialize cart page
const cartPage = new CartPage();
