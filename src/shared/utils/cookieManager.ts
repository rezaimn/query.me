export function getCookie(cname: string) {
    const name          = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca            = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export function setCookie(cname: string, cvalue: string, exdays: number = 1) {
    const now = new Date();
    now.setTime(now.getTime() + (exdays * 24 * 60 * 60 * 1000));

    const expires   = 'expires=' + now.toUTCString();
    const domain = document.location.hostname === "localhost" ? "" : "domain=" + document.location.hostname + ";";
    document.cookie = `${cname}=${cvalue};${domain}${expires};path=/;SameSite=None;Secure`;
}
