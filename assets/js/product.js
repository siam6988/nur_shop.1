// Product Detail Page Functionality
class ProductPage {
    constructor() {
        this.product = null;
        this.selectedSize = 'M';
        this.quantity = 1;
        this.init();
    }

    init() {
        this.loadProduct();
        this.setupImageGallery();
        this.setupSizeSelection();
        this.setupQuantityControls();
        this.setupTabs();
        this.setupAddToCart();
    }

    loadProduct() {
        // For demo, use the first product from sample data
        const products = nurApp.getSampleProducts();
        this.product = products[0]; // Use first product for demo
        
        this.updateProductDisplay();
    }

    updateProductDisplay() {
        if (!this.product) return;

        // Update product title
        const titleElement = document.getElementById('productTitle');
        if (titleElement) {
            titleElement.textContent = this.product.title_bn;
        }

        // Update price
        const currentPrice = document.querySelector('.current-price');
        const originalPrice = document.querySelector('.original-price');
        const discount = document.querySelector('.discount');

        if (currentPrice) {
            currentPrice.textContent = `৳ ${nurApp.calculateDiscountedPrice(this.product)}`;
        }

        if (originalPrice && this.product.discount_percent) {
            originalPrice.textContent = `৳ ${this.product.price}`;
        }

        if (discount && this.product.discount_percent) {
            discount.textContent = `${this.product.discount_percent}% ছাড়`;
        }

        // Update sizes
        this.updateSizeOptions();
    }

    updateSizeOptions() {
        const sizeContainer = document.querySelector('.size-options');
        if (!sizeContainer || !this.product) return;

        sizeContainer.innerHTML = this.product.sizes.map(size => `
            <button class="size-btn ${size === this.selectedSize ? 'active' : ''}" 
                    data-size="${size}">
                ${size}
            </button>
        `).join('');

        // Re-attach event listeners
        this.setupSizeSelection();
    }

    setupImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                // Update main image
                if (mainImage) {
                    mainImage.src = thumbnail.src;
                }
            });
        });
    }

    setupSizeSelection() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                this.selectedSize = btn.dataset.size;
            });
        });
    }

    setupQuantityControls() {
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityDisplay = document.getElementById('quantity');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    quantityDisplay.textContent = this.quantity;
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.quantity++;
                quantityDisplay.textContent = this.quantity;
            });
        }
    }

    setupTabs() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const tabId = header.dataset.tab;

                // Remove active class from all headers and panes
                tabHeaders.forEach(h => h.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Add active class to clicked header and corresponding pane
                header.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    setupAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (!this.product) return;

                // Check if size is available
                if (!this.product.sizes.includes(this.selectedSize)) {
                    nurApp.showToast('এই সাইজটি স্টকে নেই');
                    return;
                }

                nurApp.addToCart(this.product, this.selectedSize, this.quantity);
                
                // Reset quantity
                this.quantity = 1;
                document.getElementById('quantity').textContent = '1';
            });
        }
    }
}

// Initialize product page
document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});
