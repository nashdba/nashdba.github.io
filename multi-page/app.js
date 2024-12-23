

	function showError(e) {
		console.error(e);
		document.getElementById('error').textContent = e;
		document.getElementById('login-btn').setAttribute('class', 'button');
	}

	function success(decodeIDToken) {
		document.getElementById('welcome').textContent = 'Hello, ';
	}

	(async function () {

		const currentPage = window.location.pathname;
		console.error('Window Locator Ref: ', window.location.href);
		console.error('Current Page:',currentPage);
		
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
				document.getElementById('login-btn').setAttribute('class', 'hidden');
				success(tokens.idTokenPayload);
			}
		} catch (e) {
			document.getElementById('loader').setAttribute('class', 'hidden');
			showError(e);
		}
		document.getElementById('login-btn').addEventListener('click', async () => {
			document.getElementById('login-btn').setAttribute('class', 'hidden');
			document.getElementById('error').textContent = '';

			try {
				tokens = await appID.signin();
				let userInfo = await appID.getUserInfo(tokens.accessToken);
				success(tokens.idTokenPayload);
			} catch (e) {
				showError(e);
			}
		});



// If user is not authenticated, redirect to login page
if (currentPage !== '/multi-page/login.html' && !appID.isAuthenticated()) {
    console.error('You are not logged in: No see page!!');
    window.location.href = 'login.html';
}
		
// Handle redirect on Home page currentPage === '/multi-page/index.html' && appID.isLoggedIn()
    if (currentPage) {
            console.error('Entering index.html logic:');
	    console.error('Current Page2:',currentPage);
	    //console.error('Window Locator Ref: ', window.location.href);
            //window.location.href = 'https://nashdba.github.io/multi-page/profile.html';	   
	    //window.location.replace('https://nashdba.github.io/multi-page/profile.html');
        
    }


//end async
})()
