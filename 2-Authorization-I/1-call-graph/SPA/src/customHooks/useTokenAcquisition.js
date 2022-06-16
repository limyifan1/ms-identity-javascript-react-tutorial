import { useEffect, useState } from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

/**
 * 
 * @param {Array} scopes 
 * @returns response object with an access token
 */
const useTokenAcquisition = (scopes) => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * an array of all accounts currently signed in and an inProgress value
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance, inProgress } = useMsal();
    const account = instance.getActiveAccount();
    const [response, setResponse] = useState(null);
    useEffect(() => {
        const getToken = async () => {
            let token;
            if (account && inProgress === 'none' && !response) {
                 try {
                    token = await instance.acquireTokenSilent({
                        scopes: scopes,
                        account: account,
                    });
                    setResponse(token);
                 }catch(error) {
                    if(error instanceof InteractionRequiredAuthError) {
                        try {
                            token = await instance.acquireTokenPopup({
                                 scopes: scopes,
                                 account: account,
                            });
                            setResponse(token);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                 }
            }
        }
        getToken();
    }, [account, inProgress, instance]);

    return [response];
};

export default useTokenAcquisition;
