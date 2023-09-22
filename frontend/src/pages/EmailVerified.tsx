import { handleTranslation } from "@/lib/i18n";
import { CheckCircleIcon } from "lucide-react";


export default function EmailVerifiedPage() {
    const { trans } = handleTranslation()
    return (
        <div className="flex items-center justify-center min-h-screen py-10 px-5">
            <div className="max-w-xl p-4 md:p-10 bg-secondary rounded-xl mt-[100px]">
                <div className="flex flex-col items-center gap-10 justify-center">
                    <CheckCircleIcon strokeWidth={3} className="w-14 h-14 text-green-500" />
                    {/* </span> */}
                    <p className="text-primary text-xl text-center">
                        {
                            trans("email_verified")
                        }
                        <br /> <br />
                        <a href="/login" className="text-blue-500 cursor-pointer underline mx-2" role="button">
                            {trans("login_here")}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}