// Main Application JavaScript
class NurApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('nur_cart')) || [];
        this.currentLanguage = localStorage.getItem('nur_language') || 'bn';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.updateCartCount();
        this.setupLanguage();
        this.loadFeaturedProducts();
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    setupLanguage() {
        // Language toggle functionality
        const languageRadios = document.querySelectorAll('input[name="language"]');
        languageRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                localStorage.setItem('nur_language', this.currentLanguage);
                this.showToast(this.currentLanguage === 'bn' ? 'ভাষা পরিবর্তন করা হয়েছে' : 'Language changed');
            });
        });

        // Set current language
        const currentRadio = document.querySelector(`input[name="language"][value="${this.currentLanguage}"]`);
        if (currentRadio) {
            currentRadio.checked = true;
        }
    }

    addToCart(product, size, quantity = 1) {
        const existingItem = this.cart.find(item => 
            item.productId === product.id && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const cartItem = {
                id: Date.now(),
                productId: product.id,
                name: product.title_bn,
                price: this.calculateDiscountedPrice(product),
                size: size,
                quantity: quantity,
                image: product.images[0]
            };
            this.cart.push(cartItem);
        }

        this.saveCart();
        this.updateCartCount();
        
        this.showToast(this.currentLanguage === 'bn' ? 'কার্টে যোগ করা হয়েছে' : 'Added to cart');
    }

    calculateDiscountedPrice(product) {
        if (product.discount_percent) {
            return product.price - (product.price * product.discount_percent / 100);
        }
        return product.price;
    }

    saveCart() {
        localStorage.setItem('nur_cart', JSON.stringify(this.cart));
    }

    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    loadFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        const products = this.getSampleProducts();
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title_bn}" onerror="this.src='https://via.placeholder.com/300x300?text=Product+Image'">
                    ${product.discount_percent ? `<span class="discount-badge">${product.discount_percent}% OFF</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.title_bn}</h3>
                    <div class="price">
                        <span class="current-price">৳${this.calculateDiscountedPrice(product)}</span>
                        ${product.discount_percent ? `<span class="original-price">৳${product.price}</span>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="nurApp.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}, 'M')">
                        কার্টে যোগ করুন
                    </button>
                </div>
            </div>
        `).join('');
    }

    getSampleProducts() {
        return [
            {
                id: 1,
                title_bn: "মেনস কটন শার্ট",
                title_en: "Men's Cotton Shirt",
                price: 1200,
                discount_percent: 10,
                images: ["assets/img/products/shirt1.jpg"],
                sizes: ["S", "M", "L", "XL"],
                category: "ফ্যাশন"
            },
            {
                id: 2,
                title_bn: "স্মার্টফোন",
                title_en: "Smartphone",
                price: 25000,
                discount_percent: 15,
                images: ["assets/img/products/phone1.jpg"],
                sizes: ["FREE SIZE"],
                category: "ইলেকট্রনিক্স"
            },
            {
                id: 3,
                title_bn: "কিচেন ব্লেন্ডার",
                title_en: "Kitchen Blender",
                price: 3500,
                discount_percent: 20,
                images: ["assets/img/products/blender1.jpg"],
                sizes: ["FREE SIZE"],
                category: "কিচেন"
            },
            {
                id: 4,
                title_bn: "স্পোর্টস স্নিকার",
                title_en: "Sports Sneakers",
                price: 2200,
                discount_percent: 5,
                images: ["assets/img/products/shoes1.jpg"],
                sizes: ["38", "39", "40", "41", "42"],
                category: "ফ্যাশন"
            }
        ];
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getDeliveryCharge() {
        return 120; // Fixed delivery charge
    }

    getTotalAmount() {
        return this.getCartTotal() + this.getDeliveryCharge();
    }
}

// Initialize the app
const nurApp = new NurApp();

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
