// Dashboard Functions - dashboard.js

/**
 * Dashboard Manager
 */
const DashboardManager = {
    currentView: 'overview',
    
    /**
     * Initialize Dashboard
     */
    init() {
        this.setupUI();
        this.setupEventListeners();
        this.loadDashboardData();
        this.startRealTimeUpdates();
    },
    
    /**
     * Setup Dashboard UI
     */
    setupUI() {
        this.setCurrentDate();
        this.setupMobileMenu();
        this.setupUserDropdown();
        this.setupNavigation();
    },
    
    /**
     * Set current date
     */
    setCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = formatThaiDate();
        }
    },
    
    /**
     * Setup Mobile Menu
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');

        if (mobileMenuBtn && sidebar && mobileOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                mobileOverlay.classList.toggle('hidden');
            });

            mobileOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                mobileOverlay.classList.add('hidden');
            });
        }
    },
    
    /**
     * Setup User Dropdown Menu
     */
    setupUserDropdown() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
                
                if (!userDropdown.classList.contains('hidden')) {
                    userDropdown.classList.add('slide-down');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });

            userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    },
    
    /**
     * Setup Navigation
     */
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(nav => 
                    nav.classList.remove('active')
                );
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Get the navigation target
                const navText = item.querySelector('span').textContent;
                this.switchView(navText);
                
                // Close mobile menu if open
                const sidebar = document.getElementById('sidebar');
                const mobileOverlay = document.getElementById('mobileOverlay');
                if (sidebar && mobileOverlay) {
                    sidebar.classList.remove('open');
                    mobileOverlay.classList.add('hidden');
                }
            });
        });
    },
    
    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Quick action buttons
        this.setupQuickActions();
        
        // Stats cards click events
        this.setupStatsCards();
        
        // Schedule items
        this.setupScheduleItems();
    },
    
    /**
     * Setup Quick Actions
     */
    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn, [class*="bg-"][class*="-50"]');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actionType = this.getActionType(btn);
                this.handleQuickAction(actionType);
            });
        });
    },
    
    /**
     * Get action type from button
     */
    getActionType(btn) {
        const text = btn.textContent.trim();
        const actionMap = {
            'เพิ่มตาราง': 'add_schedule',
            'สร้างรายงาน': 'create_report',
            'จัดการครู': 'manage_teachers',
            'ตั้งค่า': 'settings'
        };
        return actionMap[text] || 'unknown';
    },
    
    /**
     * Handle Quick Actions
     */
    handleQuickAction(actionType) {
        switch (actionType) {
            case 'add_schedule':
                this.showAddScheduleModal();
                break;
            case 'create_report':
                this.showCreateReportModal();
                break;
            case 'manage_teachers':
                this.switchView('ครูผู้สอน');
                break;
            case 'settings':
                this.showSettingsModal();
                break;
            default:
                showNotification('คุณสมบัตินี้กำลังพัฒนา', 'info');
        }
    },
    
    /**
     * Setup Stats Cards
     */
    setupStatsCards() {
        const statsCards = document.querySelectorAll('.interactive-card');
        statsCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardTitle = card.querySelector('p').textContent;
                this.showStatsDetail(cardTitle);
            });
        });
    },
    
    /**
     * Setup Schedule Items
     */
    setupScheduleItems() {
        const scheduleItems = document.querySelectorAll('.schedule-item, [class*="bg-"][class*="-50"]');
        scheduleItems.forEach(item => {
            if (item.querySelector('h4')) {
                item.addEventListener('click', () => {
                    const scheduleTitle = item.querySelector('h4').textContent;
                    this.showScheduleDetail(scheduleTitle);
                });
            }
        });
    },
    
    /**
     * Switch View
     */
    switchView(viewName) {
        this.currentView = viewName;
        showNotification(`เปลี่ยนไปยัง${viewName}`, 'info');
        
        // Here you would typically load different content
        // For now, just show notification
        switch (viewName) {
            case 'ภาพรวม':
                this.loadOverviewData();
                break;
            case 'ตารางเรียน':
                this.loadScheduleData();
                break;
            case 'ตารางสอน':
                this.loadTeachingData();
                break;
            case 'นักเรียน':
                this.loadStudentsData();
                break;
            case 'ครูผู้สอน':
                this.loadTeachersData();
                break;
            case 'รายงาน':
                this.loadReportsData();
                break;
        }
    },
    
    /**
     * Load Dashboard Data
     */
    async loadDashboardData() {
        try {
            // Simulate API calls
            const [stats, schedule, progress] = await Promise.all([
                this.fetchStats(),
                this.fetchTodaySchedule(),
                this.fetchProgress()
            ]);
            
            this.updateStatsCards(stats);
            this.updateSchedule(schedule);
            this.updateProgress(progress);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        }
    },
    
    /**
     * Fetch Statistics
     */
    async fetchStats() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            todayClasses: 8,
            teachers: 24,
            students: 1247,
            classrooms: 32
        };
    },
    
    /**
     * Fetch Today's Schedule
     */
    async fetchTodaySchedule() {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return [
            {
                time: '08:00',
                subject: 'คณิตศาสตร์ ม.3/1',
                room: 'ห้อง A301',
                teacher: 'ครูสมชาย',
                status: 'active'
            },
            {
                time: '09:50',
                subject: 'ฟิสิกส์ ม.6/2',
                room: 'ห้อง B205',
                teacher: 'ครูสมหญิง',
                status: 'pending'
            },
            {
                time: '13:00',
                subject: 'เคมี ม.5/1',
                room: 'ห้อง C102',
                teacher: 'ครูสมศักดิ์',
                status: 'pending'
            }
        ];
    },
    
    /**
     * Fetch Progress Data
     */
    async fetchProgress() {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return {
            scheduleComplete: 85,
            attendance: 92,
            teacherReady: 78
        };
    },
    
    /**
     * Update Stats Cards
     */
    updateStatsCards(stats) {
        // This would update the stats cards with real data
        // For now, the data is already in HTML
        console.log('Updating stats:', stats);
    },
    
    /**
     * Update Schedule
     */
    updateSchedule(schedule) {
        console.log('Updating schedule:', schedule);
    },
    
    /**
     * Update Progress
     */
    updateProgress(progress) {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const progressValue = Object.values(progress)[index];
            if (progressValue) {
                bar.style.width = `${progressValue}%`;
                bar.classList.add('progress-animate');
            }
        });
    },
    
    /**
     * Start Real-time Updates
     */
    startRealTimeUpdates() {
        // Update time every minute
        setInterval(() => {
            this.setCurrentDate();
        }, 60000);
        
        // Update dashboard data every 5 minutes
        setInterval(() => {
            this.loadDashboardData();
        }, 300000);
    },
    
    /**
     * Modal Functions
     */
    showAddScheduleModal() {
        showNotification('เปิดหน้าเพิ่มตารางเรียน', 'info');
    },
    
    showCreateReportModal() {
        showNotification('เปิดหน้าสร้างรายงาน', 'info');
    },
    
    showSettingsModal() {
        showNotification('เปิดหน้าตั้งค่า', 'info');
    },
    
    showStatsDetail(cardTitle) {
        showNotification(`แสดงรายละเอียด: ${cardTitle}`, 'info');
    },
    
    showScheduleDetail(scheduleTitle) {
        showNotification(`แสดงรายละเอียด: ${scheduleTitle}`, 'info');
    },
    
    /**
     * Data Loading Functions
     */
    loadOverviewData() {
        console.log('Loading overview data');
    },
    
    loadScheduleData() {
        console.log('Loading schedule data');
    },
    
    loadTeachingData() {
        console.log('Loading teaching data');
    },
    
    loadStudentsData() {
        console.log('Loading students data');
    },
    
    loadTeachersData() {
        console.log('Loading teachers data');
    },
    
    loadReportsData() {
        console.log('Loading reports data');
    }
};

// Make DashboardManager available globally
window.DashboardManager = DashboardManager;