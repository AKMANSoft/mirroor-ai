import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LoginSchema, loginSchema } from "@/types/form.types";
import { ApiResCode } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from "react-router-dom";




export default function LoginPage() {
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "all"
    });
    const { formState } = form;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passwordReset = searchParams.get("password-reset") !== null
    const { trans } = handleTranslation()


    const handleFormSubmit = async (data: LoginSchema) => {
        const res = await api.login(data)
        if (res.succeed && res.data) return navigate("/")
        if (res.code === ApiResCode.USER_NOT_FOUND) {
            form.setError("email", {
                message: "email_not_register",
                type: "validate"
            })
        }
        if (res.code === ApiResCode.WRONG_PASSWORD) {
            form.setError("password", {
                message: "wrong_password",
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
            <div className="flex items-center justify-center min-h-screen py-10 px-5">
                {/* content */}
                <div className="max-w-xl w-full px-4 md:px-10 bg-secondary rounded-xl mt-[100px]  py-10">
                    <div className="flex flex-col items-center justify-center">
                        <img src="/assets/logo.png" width={200} loading="lazy" alt="" className="w-[200px] h-auto" />
                        <h3 className="mt-8 text-primary font-bold text-2xl text-center">Login</h3>
                        {
                            passwordReset &&
                            <p className="mt-3 text-accent font-medium text-lg text-center">
                                {trans("password_reset_success")}
                            </p>
                        }
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
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            {
                                                fieldState.error?.message &&
                                                <FormMessage />
                                            }
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-end my-3">
                                <a href="/reset-password" className="text-accent underline font-semibold">
                                    {trans("forgot_password")}
                                </a>
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
                                    <p className=" md:text-base text-xs font-medium">
                                        {trans("no_account")}
                                    </p>
                                    <a href="/register" className="md:text-base text-xs font-bold text-primary underline">
                                        {trans("register")}
                                    </a>
                                </div>
                                <div>
                                    <Button type="submit" disabled={formState.isSubmitting} variant="primary">
                                        {
                                            formState.isSubmitting ?
                                                <Spinner />
                                                :
                                                <span>{trans("login")}</span>
                                        }
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Layout>
    )
}
