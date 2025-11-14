// Banner Slider Functionality
class BannerSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.banner-slide');
        this.dots = document.querySelectorAll('.dot');
        this.interval = null;
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.startAutoSlide();
        this.setupDotNavigation();
        this.setupPauseOnHover();
    }

    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 3000); // Change slide every 3 seconds
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
    }

    setupDotNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.currentSlide = index;
                this.showSlide(index);
                this.resetAutoSlide();
            });
        });
    }

    setupPauseOnHover() {
        const banner = document.querySelector('.banner-section');
        if (banner) {
            banner.addEventListener('mouseenter', () => {
                clearInterval(this.interval);
            });

            banner.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }

    resetAutoSlide() {
        clearInterval(this.interval);
        this.startAutoSlide();
    }
}

// Initialize banner slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BannerSlider();
});
