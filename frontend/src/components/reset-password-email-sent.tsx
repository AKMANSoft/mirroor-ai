import { SendVerificationResponse } from "@/types/response.types";
import axios from "axios";
import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { handleTranslation } from "@/lib/i18n";


export default function ResetPasswordEmailSent({ email }: { email: string }) {
    const [state, setState] = useState<"IDLE" | "RESENDING_EMAIL" | "RESENT_EMAIL">("IDLE");
    const { trans } = handleTranslation()


    const handleResendEmail = async () => {
        if (state === "RESENDING_EMAIL") return;
        setState("RESENDING_EMAIL")
        try {
            const response = await axios.post<SendVerificationResponse>(
                "/api/user/password/reset",
                { email: email }
            )
            if (response.status !== 200) throw new Error();
            setState("RESENT_EMAIL")
        } catch (error) {
            setState("IDLE")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-10 px-5">
            <div className="max-w-xl p-4 md:p-10 bg-secondary rounded-xl mt-[100px]">
                <div className="flex flex-col items-center gap-10 justify-center">
                    {/* <span className="border-[3px] border-green-500 rounded-full p-2"> */}
                    {
                        state === "RESENDING_EMAIL" ?
                            <Spinner className="border-primary w-10 h-10" />
                            :
                            <CheckCircleIcon strokeWidth={3} className="w-12 h-12 text-green-500" />
                    }
                    {/* </span> */}
                    <p className="text-primary text-lg">
                        {
                            trans(state === "RESENT_EMAIL" ? "reset_password_email_resent" : "reset_password_email_sent")
                        }
                        <br /> <br />
                        {trans("email_not_received")}
                        <span className="text-blue-500 cursor-pointer mx-2" role="button" onClick={handleResendEmail}>
                            {trans("resend")}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}