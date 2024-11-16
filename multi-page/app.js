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




