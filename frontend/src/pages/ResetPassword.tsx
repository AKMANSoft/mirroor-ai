import Layout from "@/components/layout";
import ResetPasswordEmailSent from "@/components/reset-password-email-sent";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ResetPasswordSchema, resetPasswordSchema } from "@/types/form.types";
import { ApiResCode } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form'




export default function ResetPasswordPage() {
    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "all"
    });
    const { formState } = form;
    const [passwordReset, setPasswordReset] = useState(false);
    const { trans } = handleTranslation()


    const handleFormSubmit = async (data: ResetPasswordSchema) => {
        const res = await api.resetPassword(data)
        if (res.succeed) {
            return setPasswordReset(true)
        }
        if (res.code === ApiResCode.USER_NOT_FOUND) {
            form.setError("email", {
                message: "email_not_register",
                type: "validate"
            })
        }
        if (res.code === ApiResCode.UNKNOWN_ERROR) {
            form.setError("other", {
                message: "issue_processing_request",
                type: "validate"
            })
        }
    }

    return (
        <Layout secure={false}>
            {
                passwordReset ?
                    <ResetPasswordEmailSent email={form.getValues("email")} />
                    :
                    <div className="flex items-center justify-center min-h-screen py-10 px-5">
                        {/* content */}
                        <div className="max-w-xl w-full px-4 md:px-10 bg-secondary rounded-xl mt-[100px]  py-10">
                            <div className="flex flex-col items-center justify-center">
                                <img src="/assets/logo.png" width={200} loading="lazy" alt="" className="w-[200px] h-auto" />
                                <h3 className="mt-8 text-primary font-bold text-2xl text-center">
                                    {trans("reset_password")}
                                </h3>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                                    <div className={cn(
                                        "w-full space-y-3 mt-8",
                                        formState.isSubmitting && "opacity-70 pointer-events-none"
                                    )}>
                                        <FormField
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem>
                                                    <FormLabel>{trans("email")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" autoComplete="email" {...field} />
                                                    </FormControl>
                                                    {
                                                        fieldState.error?.message &&
                                                        <FormMessage />
                                                    }
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="mt-7">
                                        <FormField
                                            name="other"
                                            control={form.control}
                                            render={({ fieldState }) => (
                                                <FormItem>
                                                    {
                                                        fieldState.error?.message &&
                                                        <FormMessage />
                                                    }
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <div className="">

                                        </div>
                                        <div>
                                            <Button type="submit" disabled={formState.isSubmitting} variant="primary">
                                                {
                                                    formState.isSubmitting ?
                                                        <Spinner />
                                                        :
                                                        <span>{trans("continue")}</span>
                                                }
                                            </Button>
                                        </div>

                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
            }
        </Layout>
    )
}
