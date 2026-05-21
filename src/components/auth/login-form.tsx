import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { Label } from "../ui/label";

const signInSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

type SignInSchemaValues = z.infer<typeof signInSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const { signIn } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInSchemaValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignInSchemaValues) => {
        const { email, password } = data;
        const platform = "web";
        const device_id = crypto.randomUUID();
        await signIn(email, password, platform, device_id);
        navigate("/");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    Welcome back
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your account
                                </p>
                            </div>

                            {/* email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Nhập email của bạn"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* nút submit */}
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Đang đăng nhập..."
                                    : "Đăng nhập"}
                            </Button>
                        </div>
                    </form>

                    {/* right side image */}
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="src/assets/images/public/404_NotFound.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
