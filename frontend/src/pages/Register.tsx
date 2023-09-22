import EmailNotVerified from "@/components/email-not-verified";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { RegisterSchema, registerSchema } from "@/types/form.types";
import { ApiResCode } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from 'react-hook-form'




export default function RegisterPage() {
    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: "all"
    });
    const { formState } = form;
    const [registered, setRegistered] = useState(false);
    const { trans } = handleTranslation();



    const handleFormSubmit = async (data: RegisterSchema) => {
        const res = await api.register(data)
        if (res.succeed) {
            return setRegistered(true)
        }
        if (res.code === ApiResCode.DUPLICATE_EMAIL) {
            form.setError("email", {
                message: "already_register",
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
                registered ?
                    <EmailNotVerified email={form.getValues("email")} />
                    :
                    <div className="flex items-center justify-center min-h-screen py-10 px-5">
                        {/* content */}
                        <div className="max-w-xl w-full px-4 md:px-10 bg-secondary rounded-xl mt-[100px] py-10">
                            <div className="flex flex-col items-center justify-center">
                                <img src="/assets/logo.png" width={200} loading="lazy" alt="" className="w-[200px] h-auto" />
                                <h3 className="mt-8 text-primary font-bold text-2xl text-center">
                                    {trans("create_account")}
                                </h3>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                                    <div className={cn(
                                        "w-full space-y-3 mt-8",
                                        formState.isSubmitting && "opacity-70 pointer-events-none"
                                    )}>
                                        <FormField
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem>
                                                    <FormLabel>{trans("name")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} />
                                                    </FormControl>
                                                    {
                                                        fieldState.error?.message &&
                                                        <FormMessage />
                                                    }
                                                </FormItem>
                                            )}
                                        />
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
                                                    <FormLabel>{trans("password")}</FormLabel>
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
                                    <div className="mt-7">
                                        <FormField
                                            name="other"
                                            control={form.control}
                                            render={({ fieldState }) => (
                                                <FormItem>
                                                    {
                                                        fieldState.error?.message &&
                                                        <FormMessage>
                                                            {trans(fieldState.error.message)}
                                                        </FormMessage>
                                                    }
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <div className="">
                                            <p className=" md:text-base text-xs font-medium">
                                                {trans("already_have_account")}
                                            </p>
                                            <a href="/login" className="md:text-base text-xs font-bold text-primary underline">
                                                {trans("login_here")}
                                            </a>
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
