function getItemFromLocalStorage(key: string) {
    return localStorage.getItem(key) || '';
}


function setAuthorizationHeader(options: any = {}, key: string) {
    const token = getItemFromLocalStorage(key);
    return {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
}

export function withUserAuthorization(options: any = {}){
    return setAuthorizationHeader(options, 'adminJwtToken') ?? setAuthorizationHeader(options, 'userJwtToken')
}

export function withAdminAuthorization(options: any = {}){
    return setAuthorizationHeader(options, 'adminJwtToken')
}