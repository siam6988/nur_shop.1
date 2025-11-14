// Orders Page Functionality
class OrdersPage {
    constructor() {
        this.orders = [];
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupSearch();
        this.setupFAQ();
    }

    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('nur_orders')) || [];
        this.displayOrders();
    }

    displayOrders() {
        const container = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');

        if (this.orders.length === 0) {
            if (container) container.style.display = 'none';
            if (emptyOrders) emptyOrders.style.display = 'block';
            return;
        }

        if (emptyOrders) emptyOrders.style.display = 'none';
        if (container) container.style.display = 'block';

        if (container) {
            container.innerHTML = this.orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>অর্ডার #${order.id}</h3>
                            <span class="order-date">${this.formatDate(order.createdAt)}</span>
                        </div>
                        <div class="order-status ${order.status}">
                            <i class="fas ${this.getStatusIcon(order.status)}"></i>
                            ${this.getStatusText(order.status)}
                        </div>
                    </div>

                    <div class="order-products">
                        ${order.items.map(item => `
                            <div class="order-product">
                                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
                                <div class="product-details">
                                    <h4>${item.name}</h4>
                                    <p>সাইজ: ${item.size}, পরিমাণ: ${item.quantity}</p>
                                    <span class="product-price">৳ ${item.price * item.quantity}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-footer">
                        <div class="order-total">
                            <strong>মোট: ৳ ${order.total}</strong>
                            <small>(ডেলিভারি চার্জ: ৳${order.deliveryCharge} সহ)</small>
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-primary btn-small" onclick="ordersPage.viewOrderDetails('${order.id}')">
                                <i class="fas fa-eye"></i> বিস্তারিত
                            </button>
                            ${order.status === 'delivered' ? `
                                <button class="btn btn-success btn-small" onclick="ordersPage.leaveReview('${order.id}')">
                                    <i class="fas fa-star"></i> রিভিউ দিন
                                </button>
                            ` : ''}
                            ${order.status === 'pending' ? `
                                <button class="btn btn-danger btn-small" onclick="ordersPage.cancelOrder('${order.id}')">
                                    <i class="fas fa-times"></i> বাতিল করুন
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    getStatusIcon(status) {
        const icons = {
            'pending': 'fa-clock',
            'confirmed': 'fa-check-circle',
            'delivered': 'fa-check-circle'
        };
        return icons[status] || 'fa-clock';
    }

    getStatusText(status) {
        const texts = {
            'pending': 'পেন্ডিং',
            'confirmed': 'কনফার্মড',
            'delivered': 'ডেলিভার্ড'
        };
        return texts[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('orderSearch');
        const searchBtn = document.getElementById('searchOrderBtn');

        if (searchInput && searchBtn) {
            const searchHandler = () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm) {
                    const filteredOrders = this.orders.filter(order =>
                        order.id.toLowerCase().includes(searchTerm) ||
                        order.customer.phone.includes(searchTerm)
                    );
                    this.displayFilteredOrders(filteredOrders);
                } else {
                    this.displayOrders();
                }
            };

            searchInput.addEventListener('input', searchHandler);
            searchBtn.addEventListener('click', searchHandler);
        }
    }

    displayFilteredOrders(filteredOrders) {
        const container = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');

        if (filteredOrders.length === 0) {
            if (container) container.style.display = 'none';
            if (emptyOrders) {
                emptyOrders.style.display = 'block';
                emptyOrders.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h2>কোন অর্ডার পাওয়া যায়নি</h2>
                    <p>আপনার সার্চের সাথে মিলছে না</p>
                `;
            }
            return;
        }

        if (emptyOrders) emptyOrders.style.display = 'none';
        if (container) container.style.display = 'block';

        // Similar to displayOrders but with filteredOrders
        container.innerHTML = filteredOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h3>অর্ডার #${order.id}</h3>
                        <span class="order-date">${this.formatDate(order.createdAt)}</span>
                    </div>
                    <div class="order-status ${order.status}">
                        <i class="fas ${this.getStatusIcon(order.status)}"></i>
                        ${this.getStatusText(order.status)}
                    </div>
                </div>
                <div class="order-products">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-details">
                                <h4>${item.name}</h4>
                                <p>সাইজ: ${item.size}, পরিমাণ: ${item.quantity}</p>
                                <span class="product-price">৳ ${item.price * item.quantity}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }

    viewOrderDetails(orderId) {
        // In a real app, this would show a detailed order view
        nurApp.showToast(`অর্ডার #${orderId} এর বিস্তারিত দেখানো হচ্ছে`);
    }

    leaveReview(orderId) {
        // In a real app, this would open a review modal
        nurApp.showToast(`অর্ডার #${orderId} এর জন্য রিভিউ দিন`);
    }

    cancelOrder(orderId) {
        if (confirm('আপনি কি এই অর্ডার বাতিল করতে চান?')) {
            this.orders = this.orders.filter(order => order.id !== orderId);
            localStorage.setItem('nur_orders', JSON.stringify(this.orders));
            this.displayOrders();
            nurApp.showToast('অর্ডার বাতিল করা হয়েছে');
        }
    }
}

// Initialize orders page
const ordersPage = new OrdersPage();
