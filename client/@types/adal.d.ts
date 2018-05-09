// type definitions modified by ronyl for 1.0.15. below header belongs to
// the original file.
// TODO either push to DefinitelyTypes or pull latest version from there.

// Type definitions for ADAL.JS 1.0.14
// Project: https://github.com/AzureAD/azure-activedirectory-library-for-js
// Definitions by: mmaitre314 <https://github.com/mmaitre314>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare var AuthenticationContext: adal.AuthenticationContextStatic;
declare var Logging: adal.Logging;

declare module 'adal-angular' {
    export const AuthenticationContext: adal.AuthenticationContextStatic;
    export const Logging: adal.Logging;
}

declare namespace adal {

    interface Config {
        tenant?: string;
        clientId: string;
        redirectUri?: string;
        instance?: string;
        endpoints?: any;  // If you need to send CORS api requests.
        popUp?: boolean;
        localLoginUrl?: string;
        displayCall?: (urlNavigate: string) => any;
        postLogoutRedirectUri?: string; // redirect url after succesful logout operation
        cacheLocation?: string;
        anonymousEndpoints?: string[];
        expireOffsetSeconds?: number;
        correlationId?: string;
        loginResource?: string;
        resource?: string;
        extraQueryParameter?: string;
        navigateToLoginRequestUrl?: boolean;
        logOutUri?: string;
        isAngular?: boolean;
        callback?: (errorDescription: string, token: string, error: string) => void;
    }

    interface User {
        userName: string;
        profile: any;
    }

    interface RequestInfo {
        valid: boolean;
        parameters: any;
        stateMatch: boolean;
        stateResponse: string;
        requestType: string;
    }

    interface Logging {
        log: (message: string) => void;
        level: LoggingLevel;
    }

    enum LoggingLevel {
        ERROR = 0,
        WARNING = 1,
        INFO = 2,
        VERBOSE = 3
    }

    interface AuthenticationContextStatic {
        new (config: Config): AuthenticationContext;
    }

    interface AuthenticationContext {

        instance: string;
        config: Config;

        /**
         * Gets initial Idtoken for the app backend
         * Saves the resulting Idtoken in localStorage.
         */
        login(): void;

        /**
         * Indicates whether login is in progress now or not.
         */
        loginInProgress(): boolean;

        /**
         * Gets token for the specified resource from local storage cache
         * @param {string}   resource A URI that identifies the resource for which the token is valid.
         * @returns {string} token if exists and not expired or null
         */
        getCachedToken(resource: string): string;

        /**
         * Retrieves and parse idToken from localstorage
         * @returns {User} user object
         */
        getCachedUser(): User;

        registerCallback(expectedState: string, resource: string, callback: (message: string, token: string) => any): void;

        /**
         * Acquire token from cache if not expired and available. Acquires token from iframe if expired.
         * @param {string}   resource  ResourceUri identifying the target resource
         * @param {requestCallback} callback
         */
        acquireToken(resource: string, callback: (errorDecsription: string, token: string, error:string ) => any): void;

        /**
        * Acquires token (interactive flow using a popUp window) by sending request to AAD to obtain a new token.
        * @param {string}   resource  ResourceUri identifying the target resource
        * @param {string}   extraQueryParameters  extraQueryParameters to add to the authentication request
        * @param {string}   claims claims query parameter to add to token request
        * @param {tokenCallback} callback -  The callback provided by the caller. It will be called with token or error.
        */
        acquireTokenPopup(resource: string, extraQueryParameteres: string | null, claims: string | null, callback: (errorDescription: string, token: string, error: string) => any): void;

        /**
         * Acquires token (interactive flow using a redirect) by sending request to AAD to obtain a new token. In this case the callback passed in the Authentication
        * request constructor will be called.
        * @param {string}   resource  ResourceUri identifying the target resource
        * @param {string}   extraQueryParameters  extraQueryParameters to add to the authentication request
        * @param {string}   claims claims query paramerter to add to token request.
        */
        acquireTokenRedirect(resource: string, extraQueryParameteres: string, claims: string): void;

        /**
         * Redirect the Browser to Azure AD Authorization endpoint
         * @param {string}   urlNavigate The authorization request url
         */
        promptUser(urlNavigate: string): void;

        /**
         * Clear cache items.
         */
        clearCache(): void;

        /**
         * Clear cache items for a resource.
         */
        clearCacheForResource(resource: string): void;

        /**
         * Logout user will redirect page to logout endpoint.
         * After logout, it will redirect to post_logout page if provided.
         */
        logOut(): void;

        /**
         * Gets a user profile
         * @param {requestCallback} callback - The callback that handles the response.
         */
        getUser(callback: (message: string, user?: User) => any): void;

        /**
         * Checks if hash contains access token or id token or error_description
         * @param {string} hash  -  Hash passed from redirect page
         * @returns {Boolean}
         */
        isCallback(hash: string): boolean;

        /**
         * Gets login error
         * @returns {string} error message related to login
         */
        getLoginError(): string;

        /**
         * Gets requestInfo from given hash.
         * @returns {RequestInfo} for appropriate hash.
         */
        getRequestInfo(hash: string): RequestInfo;

        /**
         * Saves token from hash that is received from redirect.
         */
        saveTokenFromHash(requestInfo: RequestInfo): void;

        /**
         * Gets resource for given endpoint if mapping is provided with config.
         * @param {string} endpoint  -  API endpoint
         * @returns {string} resource for this API endpoint
         */
        getResourceForEndpoint(endpoint: string): string;

        /**
         * Handles redirection after login operation.
         * Gets access token from url and saves token to the (local/session) storage
         * or saves error in case unsuccessful login.
         */
        handleWindowCallback(): void;

        log(level: number, message: string, error: any): void;
        error(message: string, error: any): void;
        warn(message: string): void;
        info(message: string): void;
        verbose(message: string): void;
    }

}