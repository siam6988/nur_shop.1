// Shop Page Functionality
class ShopPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.filters = {
            categories: [],
            maxPrice: 50000,
            sizes: []
        };
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupFilters();
        this.setupSearch();
        this.setupSorting();
    }

    loadProducts() {
        // Use sample products from app.js
        this.products = nurApp.getSampleProducts();
        this.filteredProducts = [...this.products];
        this.displayProducts();
        this.updateProductsCount();
    }

    displayProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>কোন প্রোডাক্ট পাওয়া যায়নি</h3>
                    <p>আপনার সার্চ বা ফিল্টারের সাথে মিলছে না</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title_bn}" onerror="this.src='https://via.placeholder.com/300x300?text=Product+Image'">
                    ${product.discount_percent ? `<span class="discount-badge">${product.discount_percent}% OFF</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.title_bn}</h3>
                    <div class="price">
                        <span class="current-price">৳${nurApp.calculateDiscountedPrice(product)}</span>
                        ${product.discount_percent ? `<span class="original-price">৳${product.price}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="nurApp.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}, 'M')">
                            কার্টে যোগ করুন
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-secondary">
                            বিস্তারিত
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupFilters() {
        const applyFiltersBtn = document.getElementById('applyFilters');
        const priceRange = document.getElementById('priceRange');
        const maxPrice = document.getElementById('maxPrice');

        if (priceRange && maxPrice) {
            priceRange.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                maxPrice.textContent = this.formatPrice(this.filters.maxPrice);
            });
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
            });
        });

        // Size filters
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.updateSizeFilters();
            });
        });
    }

    updateCategoryFilters() {
        this.filters.categories = [];
        document.querySelectorAll('.filter-options input[type="checkbox"]:checked').forEach(checkbox => {
            this.filters.categories.push(checkbox.value);
        });
    }

    updateSizeFilters() {
        this.filters.sizes = [];
        document.querySelectorAll('.size-btn.active').forEach(btn => {
            this.filters.sizes.push(btn.dataset.size);
        });
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price filter
            if (nurApp.calculateDiscountedPrice(product) > this.filters.maxPrice) {
                return false;
            }

            // Size filter
            if (this.filters.sizes.length > 0) {
                const hasMatchingSize = product.sizes.some(size => this.filters.sizes.includes(size));
                if (!hasMatchingSize) return false;
            }

            return true;
        });

        this.displayProducts();
        this.updateProductsCount();
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filteredProducts = this.products.filter(product =>
                    product.title_bn.toLowerCase().includes(searchTerm) ||
                    product.title_en.toLowerCase().includes(searchTerm)
                );
                this.displayProducts();
                this.updateProductsCount();
            });
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => nurApp.calculateDiscountedPrice(a) - nurApp.calculateDiscountedPrice(b));
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => nurApp.calculateDiscountedPrice(b) - nurApp.calculateDiscountedPrice(a));
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.title_bn.localeCompare(b.title_bn));
                break;
            default:
                // Default sorting (by ID or original order)
                this.filteredProducts = [...this.products];
                this.applyFilters();
                return;
        }
        this.displayProducts();
    }

    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            countElement.textContent = `মোট ${this.filteredProducts.length}টি প্রোডাক্ট`;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('bn-BD').format(price);
    }
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
    new ShopPage();
});
