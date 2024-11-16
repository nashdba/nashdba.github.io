// Initialize App ID with your client ID and discovery endpoint
const appID = new AppID({
	
                clientId: '0a08efad-7177-4907-a2d2-3aa90b4e5af2',
                discoveryEndpoint: 'https://eu-gb.appid.cloud.ibm.com/oauth/v4/2e834006-5b8a-4c84-937b-7a7d6a14ccbf/.well-known/openid-configuration'
    });

// Handle login button click
document.getElementById('login-btn').addEventListener('click', async () => {
    try {
        const tokens = await appID.signin();
        if (tokens) {
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error('Login failed: ', e);
    }
});

// Handle user info display
if (appID.isLoggedIn()) {
    appID.getUserInfo()
        .then((user) => {
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
        })
        .catch((err) => {
            console.error('Failed to get user info: ', err);
        });
}






(async function () {
		const appID = new AppID();
		let tokens;
		try {
			await appID.init({
                clientId: '0a08efad-7177-4907-a2d2-3aa90b4e5af2',
                discoveryEndpoint: 'https://eu-gb.appid.cloud.ibm.com/oauth/v4/2e834006-5b8a-4c84-937b-7a7d6a14ccbf/.well-known/openid-configuration'
			});
		} catch (e) {
			console.error(e);
			document.getElementById('error').textContent = e;
			return;
		}
		try {
			tokens = await appID.silentSignin();
			if (tokens) {
				document.getElementById('loader').setAttribute('class', 'hidden');
				document.getElementById('login').setAttribute('class', 'hidden');
				success(tokens.idTokenPayload);
			}
		} catch (e) {
			document.getElementById('loader').setAttribute('class', 'hidden');
			showError(e);
		}
		document.getElementById('login').addEventListener('click', async () => {
			document.getElementById('login').setAttribute('class', 'hidden');
			document.getElementById('error').textContent = '';

			try {
				tokens = await appID.signin();
				let userInfo = await appID.getUserInfo(tokens.accessToken);
				success(tokens.idTokenPayload);
			} catch (e) {
				showError(e);
			}
		});

document.addEventListener('DOMContentLoaded', () => {
    // Check user authentication
    const currentPage = window.location.pathname;

    // If user is not authenticated, redirect to login page
    if (currentPage !== '/multi-page/login.html' && !appID.isAuthenticated()) {
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
    if (currentPage === '/multi-page/profile.html') {
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
    if (currentPage === '/multi-page/index.html' && appID.isAuthenticated()) {
        document.getElementById('profile-btn').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
});

