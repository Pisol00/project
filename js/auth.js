// Authentication Functions - auth.js

/**
 * Authentication Manager
 */
const AuthManager = {
    currentUser: null,

    /**
     * Initialize authentication
     */
    init() {
        this.currentUser = LocalStorage.get('currentUser');
        this.setupEventListeners();
    },

    /**
     * Setup event listeners for authentication
     */
    setupEventListeners() {
        safeAddEventListener('loginButton', 'click', () => this.handleLogin());

        // Enhanced Accessibility - Enter key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.id === 'loginButton') {
                this.handleLogin();
            }
        });
    },

    /**
     * Handle login process
     */
    async handleLogin() {
        const button = document.getElementById('loginButton');
        const buttonText = document.getElementById('buttonText');
        const googleIcon = document.getElementById('googleIcon');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successCheck = document.getElementById('successCheck');
        const errorMessage = document.getElementById('errorMessage');

        // Reset UI state
        this.resetLoginUI();

        // Start loading state
        this.setLoadingState(true);

        try {
            // Simulate login API call
            const result = await this.simulateLogin();

            if (result.success) {
                // Success state
                this.setSuccessState();

                // Save user data
                this.currentUser = result.user;
                LocalStorage.set('currentUser', this.currentUser);

                // Show loading screen and then dashboard
                setTimeout(() => {
                    this.showLoadingScreen();
                }, 1000);
            } else {
                throw new Error(result.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.setErrorState(error.message);
        }
    },

    /**
     * Simulate login API call
     */
    async simulateLogin() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate random success/failure for demo
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
            return {
                success: true,
                user: {
                    id: 'user_123',
                    name: 'ผู้ใช้งาน',
                    email: 'user@example.com',
                    role: 'admin',
                    avatar: null
                }
            };
        } else {
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
            };
        }
    },

    /**
     * Reset login UI to initial state
     */
    resetLoginUI() {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    },

    /**
     * Set loading state
     */
    setLoadingState(loading = true) {
        const button = document.getElementById('loginButton');
        const buttonText = document.getElementById('buttonText');
        const googleIcon = document.getElementById('googleIcon');
        const loadingSpinner = document.getElementById('loadingSpinner');

        if (loading) {
            button.classList.add('loading');
            buttonText.textContent = 'กำลังเข้าสู่ระบบ...';
            googleIcon.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            button.classList.remove('loading');
            buttonText.textContent = 'เข้าสู่ระบบด้วย Google';
            googleIcon.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    },

    /**
     * Set success state
     */
    setSuccessState() {
        const buttonText = document.getElementById('buttonText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successCheck = document.getElementById('successCheck');

        loadingSpinner.classList.add('hidden');
        successCheck.classList.remove('hidden');
        buttonText.textContent = 'เข้าสู่ระบบสำเร็จ';
    },

    /**
     * Set error state
     */
    setErrorState(message) {
        const button = document.getElementById('loginButton');
        const buttonText = document.getElementById('buttonText');
        const googleIcon = document.getElementById('googleIcon');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('errorMessage');

        // Reset button state
        this.setLoadingState(false);

        // Show error message
        if (errorMessage) {
            const errorText = errorMessage.querySelector('p');
            if (errorText) {
                errorText.textContent = message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
            }
            errorMessage.classList.remove('hidden');

            // Auto hide error after 5 seconds
            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 5000);
        }

        // Add shake animation to button
        button.classList.add('shake');
        setTimeout(() => {
            button.classList.remove('shake');
        }, 500);
    },

    /**
     * Show skeleton loading screen (most popular loading pattern)
     */
    async showLoadingScreen() {
        showPage('loadingPage');

        const loadingStatus = document.getElementById('loadingStatus');

        const loadingSteps = [
            { text: 'กำลังเริ่มต้นระบบ...', delay: 800 },
            { text: 'ตรวจสอบสิทธิ์การเข้าใช้...', delay: 700 },
            { text: 'เตรียมโปรไฟล์ของคุณ...', delay: 600 },
            { text: 'โหลดข้อมูลตารางเรียน...', delay: 500 },
            { text: 'เตรียมข้อมูลโรงเรียน...', delay: 400 },
            { text: 'กำลังดำเนินการให้เสร็จสิ้น...', delay: 300 },
            { text: 'พร้อมใช้งานแล้ว', delay: 200 }
        ];

        // Add progressive loading effect to skeleton items
        const skeletonItems = document.querySelectorAll('.skeleton-item');
        const skeletonWidgets = document.querySelectorAll('.skeleton-widget');

        // Animate skeleton items loading
        setTimeout(() => {
            skeletonItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('loaded');
                }, index * 200);
            });
        }, 2000);

        // Animate skeleton widgets loading
        setTimeout(() => {
            skeletonWidgets.forEach((widget, index) => {
                setTimeout(() => {
                    widget.classList.add('loaded');
                }, index * 300);
            });
        }, 2500);

        for (const step of loadingSteps) {
            await new Promise(resolve => {
                setTimeout(() => {
                    if (loadingStatus) {
                        loadingStatus.textContent = step.text;

                        // Special styling for completion
                        if (step.text === 'เสร็จสิ้น!') {
                            loadingStatus.style.color = '#059669';
                            loadingStatus.style.fontWeight = '600';
                        }
                    }
                    resolve();
                }, step.delay);
            });
        }

        // Go to dashboard with smooth transition
        setTimeout(() => {
            showPage('dashboardPage');
            if (window.DashboardManager) {
                window.DashboardManager.init();
            }
        }, 500);
    },

    /**
     * Logout function
     */
    logout() {
        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
            // Clear user data
            this.currentUser = null;
            LocalStorage.remove('currentUser');

            // Reset login button state
            this.resetLoginButton();

            // Go back to login page
            showPage('loginPage');

            showNotification('ออกจากระบบสำเร็จ', 'success');
        }
    },

    /**
     * Reset login button to initial state
     */
    resetLoginButton() {
        const button = document.getElementById('loginButton');
        const buttonText = document.getElementById('buttonText');
        const googleIcon = document.getElementById('googleIcon');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successCheck = document.getElementById('successCheck');

        if (button) button.classList.remove('loading');
        if (buttonText) buttonText.textContent = 'เข้าสู่ระบบด้วย Google';
        if (googleIcon) googleIcon.classList.remove('hidden');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        if (successCheck) successCheck.classList.add('hidden');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }
};

// Global logout function for compatibility
function logout() {
    AuthManager.logout();
}