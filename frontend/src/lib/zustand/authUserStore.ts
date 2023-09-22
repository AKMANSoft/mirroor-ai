import { UserProfile } from '@/types/response.types';
import { create } from 'zustand'


type AuthUserState = {
    authUser?: UserProfile | null;
    token?: string | null;
    setToken: (token: string) => void;
    setAuthUser: (profile: UserProfile) => void;
    logout: () => void
}

const delete_cookie = function (name: string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const useAuthUserStore = create<AuthUserState>()(
    (set) => ({
        authUser: null,
        token: null,
        setToken: (token: string) => set((state) => ({ ...state, token: token })),
        setAuthUser: (profile: UserProfile) => set((state) => ({ ...state, authUser: profile })),
        logout: () => {
            delete_cookie("access_token")
            set({ authUser: null, token: null })
            window.location.reload()
        }
    })
)

export default useAuthUserStore
