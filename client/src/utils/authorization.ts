import { AuthenticationContext } from 'react-adal';

import { adalGetToken } from 'react-adal';

export const config: adal.Config = {
    clientId: '94004a9f-3295-4b81-b64d-a18f7eb070de', // Kusto Web
    tenant: 'common', // multi tennat        
    popUp: false, 
    cacheLocation: 'localStorage',        
    resource: 'https://help.kusto.windows.net',
    redirectUri: window.location.origin + '/'
};

export const authContext = new AuthenticationContext(config);

export const getUser = () => new Promise<adal.User>((resolve, reject) => {
    authContext.getUser((message: string, user?: adal.User) => {
        if (user) {
            resolve(user);
        } else {
            reject(message);
        }
    });
});

export const getToken = () => {
    return adalGetToken(authContext, config.resource!);
};