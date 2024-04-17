import { Subscription, UserDetails } from "@/types";

import { User } from "@supabase/auth-helpers-nextjs";
import { 
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react";
import { createContext, useEffect, useState } from "react";


type userContextType = {
    acessToken: string | null;
    user: User;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

export const userContext = createContext<userContextType | undefined>(
    undefined
);

export interface Props {
    [propsName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, serUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase.from('users').select('*').single();
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .single();

    useEffect(() => {
        if(user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];
                }
            )
        }
    }, [])
}