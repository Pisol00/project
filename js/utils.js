// Utility Functions - utils.js

/**
 * Page Navigation Functions
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 50);
    }
}

/**
 * Format Date in Thai Format
 */
function formatThaiDate(date = new Date()) {
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Show/Hide Element with Animation
 */
function toggleElement(elementId, show = null) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (show === null) {
        show = element.classList.contains('hidden');
    }
    
    if (show) {
        element.classList.remove('hidden');
        element.classList.add('scale-in');
    } else {
        element.classList.add('hidden');
        element.classList.remove('scale-in');
    }
}

/**
 * Add Event Listener with Error Handling
 */
function safeAddEventListener(elementId, event, callback) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(event, callback);
    } else {
        console.warn(`Element with ID '${elementId}' not found`);
    }
}

/**
 * Show Notification/Toast
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${getNotificationClass(type)}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function getNotificationClass(type) {
    switch (type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

/**
 * Local Storage Helpers
 */
const LocalStorage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

/**
 * Debounce Function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Generate unique ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format time to Thai format
 */
function formatTime(time) {
    if (typeof time === 'string') {
        return time;
    }
    
    const date = new Date(time);
    return date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Enhanced Loading Animation Manager
 */
const LoadingManager = {
    /**
     * Show loading with custom configuration
     */
    show(config = {}) {
        const defaultConfig = {
            title: 'กำลังโหลด',
            steps: [
                { text: 'กำลังเตรียมข้อมูล', progress: 20 },
                { text: 'กำลังประมวลผล', progress: 60 },
                { text: 'เกือบเสร็จแล้ว', progress: 90 },
                { text: 'เสร็จสิ้น', progress: 100 }
            ],
            duration: 3000
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        // Implementation here
        console.log('Loading with config:', finalConfig);
    },
    
    /**
     * Update loading progress
     */
    updateProgress(progress, text = '') {
        const progressBar = document.getElementById('loadingProgressBar');
        const statusText = document.getElementById('loadingStatus');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            
            // Add special effect at 100%
            if (progress >= 100) {
                progressBar.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            }
        }
        
        if (statusText && text) {
            statusText.style.opacity = '0';
            setTimeout(() => {
                statusText.textContent = text;
                statusText.style.opacity = '0.8';
            }, 150);
        }
    },
    
    /**
     * Hide loading
     */
    hide() {
        const loadingPage = document.getElementById('loadingPage');
        if (loadingPage) {
            loadingPage.classList.add('fade-out');
            setTimeout(() => {
                loadingPage.classList.add('hidden');
                loadingPage.classList.remove('fade-out');
            }, 300);
        }
    }
};