import { handleTranslation } from "@/lib/i18n"
import useAuthUserStore from "@/lib/zustand/authUserStore"
import { UserNavMenu } from "./user-nav-menu"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"


export default function Header() {
  const { authUser, logout } = useAuthUserStore()
  const { i18n } = handleTranslation()
  const { pathname } = useLocation()


  const setLanguage = (lang: "en" | "it") => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className={cn(
      "w-full min-w-full flex justify-between items-center fixed shadow-sm top-0 py-5 md:py-8 z-10 max-w-screen-2xl mx-auto px-4 md:px-10",
      pathname === "/" ? "bg-secondary" : "bg-white"
    )}>
      <a href="/">
        <img src="/assets/logo.png" className="object-contain object-center h-7 md:h-12 w-auto" alt="" />
      </a>
      <div className="flex items-center">
        <div className={cn(
          authUser ? "hidden items-center md:flex" : "flex items-center"
        )}>
          <button type="button" className={"py-1.5 md:py-2 px-4 text-sm sm:text-base md:text-base font-medium rounded " + (i18n.language === "en" ? "bg-primary text-white" : "bg-transparent text-black")}
            onClick={() => setLanguage("en")}>
            English
          </button>
          <button type="button" className={"py-1.5 md:py-2 px-4 text-sm sm:text-base md:text-base font-medium rounded " + (i18n.language === "it" ? "bg-primary text-white" : "bg-transparent text-black")}
            onClick={() => setLanguage("it")}>
            Italiano
          </button>
        </div>
        {
          authUser &&
          <div className="ml-4">
            <UserNavMenu user={authUser} logout={logout} />
          </div>
        }
      </div>
    </div>
  )
}