import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CreateNewPasswordSchema, createNewPasswordSchema } from "@/types/form.types";
import { ApiResCode } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom";




export default function CreateNewPasswordPage() {
    const form = useForm<CreateNewPasswordSchema>({
        resolver: zodResolver(createNewPasswordSchema),
        mode: "all"
    });
    const { formState } = form;
    const { sessionId } = useParams();
    const navigate = useNavigate()
    const { trans } = handleTranslation();



    const handleFormSubmit = async (data: CreateNewPasswordSchema) => {
        if (!sessionId) {
            return form.setError("other", {
                message: "session_expired",
                type: "validate"
            })
        }
        const res = await api.createNewPassword(sessionId, data)
        if (res.succeed) {
            return navigate("/login?password-reset=true")
        }
        if (res.code === ApiResCode.SESSION_EXPIRED) {
            form.setError("other", {
                message: "session_expired",
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
                <div className="max-w-xl w-full px-4 md:px-10 bg-secondary rounded-xl mt-[100px] py-10">
                    <div className="flex flex-col items-center justify-center">
                        <img src="/assets/logo.png" width={200} loading="lazy" alt="" className="w-[200px] h-auto" />
                        <h3 className="mt-8 text-primary font-bold text-2xl text-center">
                            {trans("update_password")}
                        </h3>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                            <div className={cn(
                                "w-full space-y-3 mt-8",
                                formState.isSubmitting && "opacity-70 pointer-events-none"
                            )}>
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>{trans("password")}</FormLabel>
                                            <FormControl>
                                                <Input type="password" autoComplete="password" {...field} />
                                            </FormControl>
                                            {
                                                fieldState.error?.message &&
                                                <FormMessage />
                                            }
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>{trans("confirm_password")}</FormLabel>
                                            <FormControl>
                                                <Input type="password" autoComplete="password" {...field} />
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
        </Layout>
    )
}
