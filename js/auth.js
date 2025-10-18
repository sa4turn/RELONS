// Authentication system for RELONS
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Load current user from localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        
        // Update navigation on page load
        this.updateNavigation();
        
        // Check authentication for protected pages
        this.checkPageAccess();
    }
    
    // Check if user is logged in
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Check if user is guest
    isGuest() {
        return this.currentUser && this.currentUser.isGuest === true;
    }
    
    // Check if user is student
    isStudent() {
        return this.currentUser && this.currentUser.role === 'student';
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Login user
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('relons_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateNavigation();
            return true;
        }
        return false;
    }
    
    // Register new user
    register(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('relons_users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === userData.email)) {
                return { success: false, message: 'Email sudah terdaftar!' };
            }
            
            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                studentId: userData.studentId,
                password: userData.password, // In real app, this should be hashed
                createdAt: new Date().toISOString(),
                isActive: true
            };
            
            users.push(newUser);
            localStorage.setItem('relons_users', JSON.stringify(users));
            
            return { success: true, message: 'Pendaftaran berhasil!' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Terjadi kesalahan saat mendaftar!' };
        }
    }
    
    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateNavigation();
        
        // Redirect to home if on protected page
        const protectedPages = ['profile.html', 'report.html', 'tracking.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = '../index.html';
        }
    }
    
    // Update navigation based on authentication status
    updateNavigation() {
        const userMenu = document.getElementById('userMenu');
        if (!userMenu) return;
        
        if (this.isAuthenticated()) {
            const userName = this.isGuest() ? 'Guest' : this.currentUser.name.split(' ')[0];
            const userIcon = this.isGuest() ? 'fas fa-user-secret' : 'fas fa-user';
            
            let menuItems = '';
            
            if (this.isGuest()) {
                menuItems = `
                    <a href="pages/report.html"><i class="fas fa-flag"></i> Buat Laporan</a>
                    <a href="#" onclick="auth.confirmLogout()"><i class="fas fa-sign-out-alt"></i> Keluar</a>
                `;
            } else {
                menuItems = `
                    <a href="pages/profile.html"><i class="fas fa-user"></i> Profil</a>
                    <a href="pages/tracking.html"><i class="fas fa-list"></i> Laporan Saya</a>
                    <a href="#" onclick="auth.confirmLogout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                `;
            }
            
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <a href="#" class="nav-link user-trigger" onclick="auth.toggleUserDropdown(event)">
                        <i class="${userIcon}"></i> ${userName}
                        <i class="fas fa-chevron-down"></i>
                    </a>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        ${menuItems}
                    </div>
                </div>
            `;
            
            this.addDropdownStyles();
        } else {
            userMenu.innerHTML = `
                <a href="pages/login.html" class="nav-link">
                    <i class="fas fa-sign-in-alt"></i> Masuk
                </a>
            `;
        }
    }
    
    // Add dropdown styles
    addDropdownStyles() {
        if (document.getElementById('userDropdownStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'userDropdownStyles';
        style.textContent = `
            .user-dropdown {
                position: relative;
            }
            .user-trigger {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .user-dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--white);
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                min-width: 180px;
                display: none;
                z-index: 1000;
                overflow: hidden;
            }
            .user-dropdown-menu.show {
                display: block;
            }
            .user-dropdown-menu a {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                color: var(--text-dark);
                text-decoration: none;
                border-bottom: 1px solid #f3f4f6;
                transition: var(--transition);
            }
            .user-dropdown-menu a:hover {
                background: var(--bg-light);
                color: var(--primary-color);
            }
            .user-dropdown-menu a:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle user dropdown
    toggleUserDropdown(event) {
        event.preventDefault();
        const menu = document.getElementById('userDropdownMenu');
        if (menu) {
            menu.classList.toggle('show');
        }
    }
    
    // Check page access for protected pages
    checkPageAccess() {
        const protectedPages = ['profile.html'];
        const reportRestrictedPages = ['report.html']; // Pages that require authentication (including guest)
        const guestRestrictedPages = ['profile.html', 'tracking.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        // Check if page requires authentication (including guest access)
        if (reportRestrictedPages.includes(currentPage) && !this.isAuthenticated()) {
            RELONS.showAlert('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        // Check if page requires full authentication (no guest)
        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            RELONS.showAlert('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        // Check if guest is trying to access restricted pages
        if (guestRestrictedPages.includes(currentPage) && this.isGuest()) {
            RELONS.showAlert('Halaman ini tidak tersedia untuk guest. Silakan daftar atau login.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
    }
    
    // Confirm logout
    confirmLogout() {
        const message = this.isGuest() ? 
            'Apakah Anda yakin ingin keluar dari mode guest?' : 
            'Apakah Anda yakin ingin logout?';
            
        if (confirm(message)) {
            this.logout();
            const successMessage = this.isGuest() ? 
                'Keluar dari mode guest berhasil!' : 
                'Logout berhasil. Sampai jumpa!';
                
            RELONS.showAlert(successMessage, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }
    
    // Require authentication for certain actions
    requireAuth(callback) {
        if (this.isAuthenticated()) {
            callback();
        } else {
            RELONS.showAlert('Silakan login terlebih dahulu.', 'warning');
            setTimeout(() => {
                window.location.href = 'pages/login.html';
            }, 2000);
        }
    }
    
    // Allow guest access to report
    allowGuestReport(callback) {
        if (this.isAuthenticated() || this.isGuest()) {
            callback();
        } else {
            RELONS.showAlert('Silakan login atau gunakan mode guest untuk membuat laporan.', 'warning');
            setTimeout(() => {
                window.location.href = 'pages/login.html';
            }, 2000);
        }
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-dropdown')) {
        const menu = document.getElementById('userDropdownMenu');
        if (menu) menu.classList.remove('show');
    }
});

// Export for use in other scripts
window.AuthSystem = AuthSystem;
window.auth = auth;