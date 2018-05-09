declare module 'react-adal' {
  export function runWithAdal(authContext: adal.AuthenticationContext, callback: () => void): void
  export { AuthenticationContext } from 'adal-angular'
  export function adalGetToken(authContext: adal.AuthenticationContext, resourceGuiId: string): Promise<string>
}