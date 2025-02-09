(async function () {
    // For this to work, enable CORS in Okta: Security > API > Trusted Origins > Add Origin > CORS.
    const baseUrl = 'https://daxiao.oktapreview.com';

    const init = {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    
    try {
        var response = await fetch(baseUrl + '/api/v1/users/me', init);
    } catch (e) {
        error.innerHTML = "Not logged in";
        // TODO: send the user to login and come back to this page?
        return;
    }
    const user = await response.json();
    app.innerHTML = '<form><table><tr><td>Login<td>' + user.profile.login +
        '<tr><td>Email<td>' + user.profile.email +
        '<tr><td>Second Email<td><input id=secondEmail value="' + user.profile.secondEmail + '">' +
        '<tr><td>Mobile Phone<td><input id=mobilePhone value="' + user.profile.mobilePhone + '">' +
        '</table><button id=updateUser type=submit>Update</button></form>';
    secondEmail.focus();

    if (user.profile.secondEmail && user.profile.mobilePhone) {
        close();
    } else {
        updateUser.onclick = async (event) => {
            event.preventDefault();
            error.innerHTML = '';
            const body = {
                profile: {
                    secondEmail: secondEmail.value,
                    mobilePhone: mobilePhone.value
                }
            };
            init.body = JSON.stringify(body);
            init.method = 'POST';
            const response = await fetch(baseUrl + '/api/v1/users/me', init);
            if (response.ok) {
                const user = await response.json();
                app.innerHTML = 'Your Okta account has been updated. This window will close in 3 seconds.';
                var sec = 3;
                setInterval(() => {
                    app.innerHTML += ' ' + sec + '.';
                    if (sec == 0) close();
                    sec--;
                }, 1000);
            } else {
                const e = await response.json();
                error.innerHTML = e.errorCauses[0].errorSummary;
            }
        }
    }
})();
