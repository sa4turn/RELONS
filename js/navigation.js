// Navigation Active State Handler
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavigation();
});

function setActiveNavigation() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        // Beranda
        const homeLink = document.querySelector('a[href="#home"], a[href="../index.html"], a[href="index.html"], a[href="./index.html"]');
        if (homeLink) homeLink.classList.add('active');
    } else if (currentPage === 'education.html') {
        // Edukasi
        const eduLink = document.querySelector('a[href="pages/education.html"], a[href="education.html"]');
        if (eduLink) eduLink.classList.add('active');
    } else if (currentPage === 'forum.html') {
        // Forum
        const forumLink = document.querySelector('a[href="pages/forum.html"], a[href="forum.html"]');
        if (forumLink) forumLink.classList.add('active');
    } else if (currentPage === 'report.html') {
        // Laporkan
        const reportLink = document.querySelector('a[href="pages/report.html"], a[href="report.html"]');
        if (reportLink) reportLink.classList.add('active');
    } else if (currentPage === 'tracking.html') {
        // Tracking
        const trackingLink = document.querySelector('a[href="pages/tracking.html"], a[href="tracking.html"]');
        if (trackingLink) trackingLink.classList.add('active');
    } else if (currentPage === 'news.html') {
        // Berita
        const newsLink = document.querySelector('a[href="pages/news.html"], a[href="news.html"]');
        if (newsLink) newsLink.classList.add('active');
    } else if (currentPage === 'contact.html') {
        // Kontak
        const contactLink = document.querySelector('a[href="pages/contact.html"], a[href="contact.html"]');
        if (contactLink) contactLink.classList.add('active');
    } else if (currentPage === 'profile.html') {
        // Profile
        const profileLink = document.querySelector('a[href="pages/profile.html"], a[href="profile.html"]');
        if (profileLink) profileLink.classList.add('active');
    } else if (currentPage === 'login.html') {
        // Login
        const loginLink = document.querySelector('a[href="pages/login.html"], a[href="login.html"]');
        if (loginLink) loginLink.classList.add('active');
    } else if (currentPage === 'register.html') {
        // Register
        const registerLink = document.querySelector('a[href="pages/register.html"], a[href="register.html"]');
        if (registerLink) registerLink.classList.add('active');
    } else if (currentPage === 'forgot-password.html') {
        // Forgot Password
        const forgotLink = document.querySelector('a[href="pages/forgot-password.html"], a[href="forgot-password.html"]');
        if (forgotLink) forgotLink.classList.add('active');
    } else if (currentPage === 'reset-password.html') {
        // Reset Password
        const resetLink = document.querySelector('a[href="pages/reset-password.html"], a[href="reset-password.html"]');
        if (resetLink) resetLink.classList.add('active');
    }
}

// Handle navigation clicks to update active state
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        // Remove active from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active to clicked link
        e.target.classList.add('active');
    }
});

// Function to manually set active navigation (can be called from individual pages)
function setActiveNav(pageName) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active based on page name
    let selector = '';
    switch(pageName) {
        case 'home':
        case 'beranda':
            selector = 'a[href="#home"], a[href="../index.html"], a[href="index.html"], a[href="./index.html"]';
            break;
        case 'education':
        case 'edukasi':
            selector = 'a[href="pages/education.html"], a[href="education.html"]';
            break;
        case 'forum':
            selector = 'a[href="pages/forum.html"], a[href="forum.html"]';
            break;
        case 'report':
        case 'laporkan':
            selector = 'a[href="pages/report.html"], a[href="report.html"]';
            break;
        case 'tracking':
            selector = 'a[href="pages/tracking.html"], a[href="tracking.html"]';
            break;
        case 'news':
        case 'berita':
            selector = 'a[href="pages/news.html"], a[href="news.html"]';
            break;
        case 'contact':
        case 'kontak':
            selector = 'a[href="pages/contact.html"], a[href="contact.html"]';
            break;
        case 'profile':
            selector = 'a[href="pages/profile.html"], a[href="profile.html"]';
            break;
        case 'login':
            selector = 'a[href="pages/login.html"], a[href="login.html"]';
            break;
        case 'register':
            selector = 'a[href="pages/register.html"], a[href="register.html"]';
            break;
    }
    
    if (selector) {
        const link = document.querySelector(selector);
        if (link) link.classList.add('active');
    }
}