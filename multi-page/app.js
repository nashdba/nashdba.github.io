// Initialize IBM AppID
const appID = new AppID({
    clientId: 'YOUR_CLIENT_ID', // Your IBM App ID client ID
    discoveryEndpoint: 'YOUR_DISCOVERY_URL', // Your App ID discovery URL
    redirectUri: window.location.href
});

document.addEventListener('DOMContentLoaded', () => {
    // Check user authentication
    const currentPage = window.location.pathname;

    // If user is not authenticated, redirect to login page
    if (currentPage !== '/login.html' && !appID.isAuthenticated()) {
        window.location.href = 'login.html';
    }

    // Handle login button
    if (document.getElementById('login-btn')) {
        document.getElementById('login-btn').addEventListener('click', () => {
            appID.login()
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((err) => {
                    console.error('Login failed: ', err);
                });
        });
    }

    // Handle logout button
    if (document.getElementById('logout-btn')) {
        document.getElementById('logout-btn').addEventListener('click', () => {
            appID.logout()
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch((err) => {
                    console.error('Logout failed: ', err);
                });
        });
    }

    // Handle profile page and display user info
    if (currentPage === '/profile.html') {
        if (appID.isAuthenticated()) {
            appID.getUserInfo()
                .then((user) => {
                    document.getElementById('user-name').textContent = user.name;
                    document.getElementById('user-email').textContent = user.email;
                })
                .catch((err) => {
                    console.error('Failed to get user info: ', err);
                });
        }
    }

    // Handle redirect on Home page
    if (currentPage === '/index.html' && appID.isAuthenticated()) {
        document.getElementById('profile-btn').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
});

