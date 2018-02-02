
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCountryObj(cName) {
    try {
        var cookieName = getCookie(cName);
        if (cookieName != null && cookieName != "") {
            return JSON.parse(cookieName);
        } else {
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Token HHiQLYvZnkGqfD5xzxr/Sw');
            myHeaders.append('content-type', 'application/json');

            var url = 'https://cig-prod-api.azurewebsites.net/api/users/country';
            var myInit = {
                method: 'GET',
                async: false,
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            };

            fetch(url, myInit).then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (response) {
                        setCookie('cig-location', JSON.stringify(response), 10000);
                    });
                }
            });
        }
    }
    catch (e) {
        console.log("Error On Getting Country Object");
    }
}
window.getCountryObj = getCountryObj;
