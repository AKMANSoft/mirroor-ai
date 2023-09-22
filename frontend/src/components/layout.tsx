import api from "@/lib/api";
import useAuthUserStore from "@/lib/zustand/authUserStore";
import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "./header";
import { Spinner } from "./ui/spinner";




type LayoutProps = {
    children?: ReactNode;
    secure?: boolean;
}

export default function Layout({ children, secure = true }: LayoutProps) {
    const { setAuthUser } = useAuthUserStore()
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!secure) return setShowContent(true);
        api.getProfile().then((profile) => {
            if (profile) {
                setAuthUser(profile)
                setShowContent(true)
            } else {
                navigate("/login")
            }
        }, () => {
            navigate("/login")
        })
    }, [secure])

    return (
        <main>
            {
                showContent ?
                    <div>
                        <Header />
                        {children}
                    </div>
                    :
                    <div className="flex w-full h-screen items-center justify-center">
                        <Spinner className="w-20 h-20 border-primary border-4" />
                    </div>
            }
        </main>
    )
}
