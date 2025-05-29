// Configuration - config.js

/**
 * Application Configuration
 */
const Config = {
    // Application Info
    app: {
        name: 'ระบบจัดการตารางเรียนตารางสอน',
        version: '1.0.0',
        author: 'IT Department',
        description: 'ระบบจัดการตารางเรียนและตารางสอนสำหรับสถานศึกษา'
    },

    // Environment Settings
    env: {
        development: {
            debug: true,
            apiBaseUrl: 'http://localhost:3000/api',
            enableMockData: true,
            logLevel: 'debug'
        },
        production: {
            debug: false,
            apiBaseUrl: '/api',
            enableMockData: false,
            logLevel: 'error'
        }
    },

    // API Configuration
    api: {
        timeout: 30000, // 30 seconds
        maxRetries: 3,
        retryDelay: 1000, // 1 second
        endpoints: {
            auth: {
                login: '/auth/login',
                logout: '/auth/logout',
                refresh: '/auth/refresh',
                profile: '/auth/profile'
            }
        }
    },

    // UI Configuration
    ui: {
        theme: {
            default: 'light',
            available: ['light', 'dark', 'auto']
        },
        animations: {
            enabled: true,
            duration: {
                fast: 200,
                normal: 300,
                slow: 500
            },
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        notifications: {
            position: 'top-right',
            duration: 3000,
            maxVisible: 5
        }
    },

    // Feature Flags
    features: {
        enableNotifications: true,
        enableDarkMode: true,
        enableOfflineMode: false, // Future feature
        enablePWA: false // Future feature
    },

    // Localization
    localization: {
        defaultLanguage: 'th',
        availableLanguages: ['th', 'en'],
        dateFormat: {
            th: 'DD/MM/YYYY',
            en: 'MM/DD/YYYY'
        },
        timeFormat: {
            th: 'HH:mm',
            en: 'h:mm A'
        }
    },

    // Security Settings
    security: {
        sessionTimeout: 3600000, // 1 hour in milliseconds
        maxLoginAttempts: 5,
        lockoutDuration: 900000, // 15 minutes in milliseconds
        csrfEnabled: true
    },

    // Storage Configuration
    storage: {
        prefix: 'schedule_mgmt_',
        keys: {
            user: 'current_user',
            preferences: 'user_preferences',
            theme: 'theme_preference',
            language: 'language_preference'
        },
        encryption: false // Future feature
    },

    // Cache Configuration
    cache: {
        enabled: true,
        ttl: {
            default: 300000, // 5 minutes
            user: 3600000, // 1 hour
            static: 86400000 // 24 hours
        }
    },

    // Performance Settings
    performance: {
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableGzipCompression: true,
        maxBundleSize: '500kb'
    },

    // Validation Rules
    validation: {
        password: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    },

    // Error Messages
    errorMessages: {
        th: {
            network: 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย',
            unauthorized: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
            notFound: 'ไม่พบข้อมูลที่ต้องการ',
            serverError: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์',
            validation: 'ข้อมูลที่กรอกไม่ถูกต้อง',
            timeout: 'การเชื่อมต่อหมดเวลา',
            generic: 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
        },
        en: {
            network: 'Network connection error',
            unauthorized: 'Unauthorized access',
            notFound: 'Data not found',
            serverError: 'Server error occurred',
            validation: 'Invalid data entered',
            timeout: 'Connection timeout',
            generic: 'Unexpected error occurred'
        }
    },

    // Success Messages
    successMessages: {
        th: {
            login: 'เข้าสู่ระบบสำเร็จ',
            logout: 'ออกจากระบบสำเร็จ',
            save: 'บันทึกข้อมูลสำเร็จ',
            delete: 'ลบข้อมูลสำเร็จ',
            update: 'อัปเดตข้อมูลสำเร็จ',
            create: 'สร้างข้อมูลสำเร็จ'
        },
        en: {
            login: 'Login successful',
            logout: 'Logout successful',
            save: 'Data saved successfully',
            delete: 'Data deleted successfully',
            update: 'Data updated successfully',
            create: 'Data created successfully'
        }
    }
};

/**
 * Get current environment configuration
 */
function getCurrentEnvConfig() {
    const hostname = window.location.hostname;
    const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';
    return isProduction ? Config.env.production : Config.env.development;
}

/**
 * Get configuration value
 */
function getConfig(path, defaultValue = null) {
    return path.split('.').reduce((obj, key) => 
        obj && obj[key] !== undefined ? obj[key] : defaultValue, Config
    );
}

/**
 * Get error message
 */
function getErrorMessage(key, language = Config.localization.defaultLanguage) {
    const messages = Config.errorMessages[language] || Config.errorMessages.th;
    return messages[key] || messages.generic;
}

/**
 * Get success message
 */
function getSuccessMessage(key, language = Config.localization.defaultLanguage) {
    const messages = Config.successMessages[language] || Config.successMessages.th;
    return messages[key] || key;
}

/**
 * Build API URL
 */
function buildApiUrl(endpoint, params = {}) {
    const envConfig = getCurrentEnvConfig();
    let url = envConfig.apiBaseUrl + endpoint;
    
    // Replace URL parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
}

/**
 * Check if feature is enabled
 */
function isFeatureEnabled(featureName) {
    return Config.features[featureName] === true;
}

/**
 * Get validation rules
 */
function getValidationRules(type) {
    return Config.validation[type] || {};
}

/**
 * Export configuration
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Config,
        getCurrentEnvConfig,
        getConfig,
        getErrorMessage,
        getSuccessMessage,
        buildApiUrl,
        isFeatureEnabled,
        getValidationRules
    };
}