import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { handleTranslation } from "@/lib/i18n"
import { UserProfile } from "@/types/response.types"
import { LogOutIcon, UserCircleIcon } from 'lucide-react'

export function UserNavMenu({ user, logout }: { user: UserProfile, logout: () => void }) {
  const { trans, i18n } = handleTranslation()


  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 aspect-square !ring-0 rounded-full text-primary">
          <UserCircleIcon className="w-8 h-8 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal py-4">
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-medium leading-none">
              {user.name}
            </p>
            <p className="text-sm leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <div className="block md:hidden">
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            {trans("language")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={i18n.language}
            onValueChange={setLanguage}>
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="it">Italiano</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </div>
        {
          user.role === "admin" &&
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/api/export-excel" className="flex w-full py-2 text-sm font-medium items-center">
                {trans("export-excel")}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/api/export-db" className="flex w-full py-2 text-sm font-medium items-center">
                {trans("export-db")}
              </a>
            </DropdownMenuItem>
          </>
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-0">
          <button type="button" onClick={logout} className="flex w-full py-2 text-sm font-medium items-center justify-between">
            {trans("logout")}
            <LogOutIcon className="w-4 h-4 text-primary" />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}