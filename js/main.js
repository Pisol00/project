// Main Application - main.js

/**
 * Application Configuration
 */
const AppConfig = {
    version: '1.0.0',
    debug: false,
    apiBaseUrl: '/api',
    enableAnimations: true,
    theme: 'light',
    language: 'th'
};

/**
 * Main Application Class
 */
class ScheduleManagementApp {
    constructor() {
        this.isInitialized = false;
        this.currentPage = 'loginPage';
        this.eventListeners = new Map();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Schedule Management System...');
            
            // Check if already initialized
            if (this.isInitialized) {
                console.warn('App already initialized');
                return;
            }

            // Setup error handling
            this.setupErrorHandling();
            
            // Initialize modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup animations and effects
            this.setupAnimationsAndEffects();
            
            // Check authentication state
            this.checkAuthenticationState();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (AppConfig.debug) {
                showNotification(`Error: ${event.error.message}`, 'error');
            }
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (AppConfig.debug) {
                showNotification(`Promise rejection: ${event.reason}`, 'error');
            }
        });
    }

    /**
     * Initialize modules
     */
    async initializeModules() {
        // Initialize authentication module
        if (typeof AuthManager !== 'undefined') {
            AuthManager.init();
            console.log('✅ AuthManager initialized');
        } else {
            console.warn('AuthManager not found');
        }

        // Initialize utilities
        console.log('✅ Utilities ready');

        // Other modules can be initialized here
        // await this.initializeOtherModules();
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload handler
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K - Quick search (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openQuickSearch();
        }

        // Escape key - Close modals/dropdowns
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Alt + L - Go to login page
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            showPage('loginPage');
        }

        // Alt + S - Go to success page (if authenticated)
        if (e.altKey && e.key === 's' && typeof AuthManager !== 'undefined' && AuthManager.isAuthenticated()) {
            e.preventDefault();
            showPage('successPage');
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Adjust layout if needed
        this.adjustLayoutForScreenSize();
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause unnecessary processes
            console.log('Page hidden - pausing processes');
        } else {
            // Page is visible - resume processes
            console.log('Page visible - resuming processes');
        }
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload(e) {
        // Check if there are unsaved changes
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?';
            return e.returnValue;
        }
    }

    /**
     * Setup animations and effects
     */
    setupAnimationsAndEffects() {
        if (!AppConfig.enableAnimations) return;

        // Parallax effect for login page
        this.setupParallaxEffect();
        
        // Intersection Observer for animations
        this.setupScrollAnimations();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
    }

    /**
     * Setup parallax effect
     */
    setupParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            if (document.getElementById('loginPage').classList.contains('active')) {
                const shapes = document.querySelectorAll('#loginPage .floating-shape');
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.5;
                    const xPos = (x - 0.5) * speed;
                    const yPos = (y - 0.5) * speed;
                    
                    shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
                });
            }
        });
    }

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Setup smooth scrolling
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                scrollToElement(targetId, 80);
            });
        });
    }

    /**
     * Check authentication state
     */
    checkAuthenticationState() {
        if (typeof AuthManager !== 'undefined') {
            const currentUser = AuthManager.getCurrentUser();
            
            if (currentUser) {
                console.log('User already authenticated:', currentUser.name);
                // Could auto-navigate to success page
                showPage('successPage');
            }
        } else {
            console.warn('AuthManager not available for authentication check');
        }
    }

    /**
     * Quick search functionality
     */
    openQuickSearch() {
        showNotification('ค้นหาด่วน (กำลังพัฒนา)', 'info');
        // Implementation for quick search modal
    }

    /**
     * Close all modals and dropdowns
     */
    closeAllModals() {
        // Close any modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });

        // Close dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    }

    /**
     * Adjust layout for screen size
     */
    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        // Add/remove classes based on screen size
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
    }

    /**
     * Check for unsaved changes
     */
    hasUnsavedChanges() {
        // Implementation to check for unsaved changes
        return false; // For now, return false
    }

    /**
     * Handle initialization error
     */
    handleInitializationError(error) {
        const errorMessage = `
            <div class="text-center p-8">
                <h2 class="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
                <p class="text-gray-600 mb-4">ไม่สามารถเริ่มต้นระบบได้ กรุณาลองใหม่อีกครั้ง</p>
                <button onclick="location.reload()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    โหลดหน้าใหม่
                </button>
            </div>
        `;
        
        document.body.innerHTML = errorMessage;
    }

    /**
     * Cleanup function
     */
    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach((listener, element) => {
            element.removeEventListener(listener.event, listener.handler);
        });
        this.eventListeners.clear();
        
        // Clean up other resources
        console.log('Application cleaned up');
    }
}

/**
 * Application instance
 */
const app = new ScheduleManagementApp();

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

/**
 * Make app instance available globally for debugging
 */
if (AppConfig.debug) {
    window.app = app;
}

/**
 * Service Worker Registration (for future PWA features)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/**
 * Export for module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScheduleManagementApp, AppConfig };
}