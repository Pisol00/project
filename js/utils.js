// Utility Functions - utils.js

/**
 * Local Storage Management
 */
const LocalStorage = {
    /**
     * Set item to localStorage with error handling
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with error handling
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Check if localStorage is available
     */
    isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};

/**
 * Page Management Functions
 */
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        
        // Trigger page-specific animations
        setTimeout(() => {
            const animatedElements = targetPage.querySelectorAll('.fade-in, .slide-in, .scale-in');
            animatedElements.forEach(element => {
                element.classList.add('animate-in');
            });
        }, 50);
    } else {
        console.error(`Page with id '${pageId}' not found`);
    }
}

/**
 * Notification System
 */
let notificationContainer = null;
let notificationCount = 0;

function createNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = createNotificationContainer();
    notificationCount++;
    
    const notification = document.createElement('div');
    notification.className = `
        notification-item max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4
        transform translate-x-full opacity-0 transition-all duration-300 ease-out
        ${type === 'success' ? 'border-green-200 bg-green-50' : ''}
        ${type === 'error' ? 'border-red-200 bg-red-50' : ''}
        ${type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
        ${type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
    `;
    
    const icon = getNotificationIcon(type);
    const color = getNotificationColor(type);
    
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                ${icon}
            </div>
            <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium ${color}">
                    ${message}
                </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button class="notification-close inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Close button handler
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    // Limit max notifications
    const notifications = container.querySelectorAll('.notification-item');
    if (notifications.length > 5) {
        removeNotification(notifications[0]);
    }
}

function removeNotification(notification) {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: `<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,
        error: `<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,
        warning: `<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,
        info: `<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'text-green-800',
        error: 'text-red-800', 
        warning: 'text-yellow-800',
        info: 'text-blue-800'
    };
    return colors[type] || colors.info;
}

/**
 * Safe Event Listener Attachment
 */
function safeAddEventListener(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(event, handler);
        return true;
    } else {
        console.warn(`Element with id '${elementId}' not found`);
        return false;
    }
}

/**
 * Debounce Function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle Function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smooth Scroll to Element
 */
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Format Date/Time Functions
 */
const DateFormatter = {
    /**
     * Format date in Thai format
     */
    formatThaiDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            locale: 'th-TH'
        };
        return new Intl.DateTimeFormat('th-TH', options).format(new Date(date));
    },

    /**
     * Format time in Thai format
     */
    formatThaiTime(date) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            locale: 'th-TH'
        };
        return new Intl.DateTimeFormat('th-TH', options).format(new Date(date));
    },

    /**
     * Get relative time (เช่น "2 นาทีที่แล้ว")
     */
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} วันที่แล้ว`;
        if (hours > 0) return `${hours} ชั่วโมงที่แล้ว`;
        if (minutes > 0) return `${minutes} นาทีที่แล้ว`;
        return 'เมื่อสักครู่';
    }
};

/**
 * Validation Utilities
 */
const Validator = {
    /**
     * Validate email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate Thai phone number
     */
    isValidPhoneNumber(phone) {
        const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
        return phoneRegex.test(phone);
    },

    /**
     * Check if string is empty or whitespace
     */
    isEmpty(str) {
        return !str || str.trim().length === 0;
    },

    /**
     * Validate password strength
     */
    isStrongPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonalphas = /\W/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }
};

/**
 * DOM Utilities
 */
const DOMUtils = {
    /**
     * Check if element is visible in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Add class with animation delay
     */
    addClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    },

    /**
     * Remove element with fade out animation
     */
    removeWithFadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }
};

/**
 * Export all utilities
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LocalStorage,
        showPage,
        showNotification,
        safeAddEventListener,
        debounce,
        throttle,
        scrollToElement,
        DateFormatter,
        Validator,
        DOMUtils
    };
}