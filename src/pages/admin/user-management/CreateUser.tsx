import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
    SelectBox,
    type ComboOption,
} from "@/components/select-box/select-box";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError } from "@/components/ui/field";

const statusOptions: ComboOption[] = [
    { label: "Hoạt Động", value: "active" },
    { label: "Không Hoạt Động", value: "inactive" },
];

const formSchema = z
    .object({
        email: z
            .string()
            .min(1, "Vui lòng nhập Email")
            .email("Email không hợp lệ"),
        password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
        confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
        gender: z.string(),
        status: z.string(),
        code: z.string().optional(),
        username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
        first_name: z.string().min(1, "Vui lòng nhập tên"),
        last_name: z.string().min(1, "Vui lòng nhập họ"),
        contact_phone: z.string().optional(),
        contact_email: z.string().optional(),
        location: z.string().optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirm_password"],
    });

type FormValues = z.infer<typeof formSchema>;

const CreateUser = () => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "active",
            gender: "nam",
            email: "",
            password: "",
            confirm_password: "",
            username: "",
            first_name: "",
            last_name: "",
            code: "",
            contact_phone: "",
            contact_email: "",
            location: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        // Form is valid, open confirm dialog
        setIsConfirmOpen(true);
    };

    const handleConfirmSave = () => {
        // Proceed with saving data
        setIsConfirmOpen(false);
        navigate("/admin/user-management/list");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Top Form Section */}
            <Card className="p-4">
                <div className="grid grid-cols-6 gap-4">
                    {/* Row 1 */}
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("email")}
                            aria-invalid={!!errors.email}
                        />
                        <FieldError>{errors.email?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Mật Khẩu <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            type="password"
                            {...register("password")}
                            aria-invalid={!!errors.password}
                        />
                        <FieldError>{errors.password?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Xác Nhận Mật Khẩu 123
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            type="password"
                            {...register("confirm_password")}
                            aria-invalid={!!errors.confirm_password}
                        />
                        <FieldError>
                            {errors.confirm_password?.message}
                        </FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Giới Tính</Label>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex items-center gap-4 mt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="nu"
                                            id="gender-nu"
                                        />
                                        <Label
                                            htmlFor="gender-nu"
                                            className="font-normal"
                                        >
                                            Nữ
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="nam"
                                            id="gender-nam"
                                        />
                                        <Label
                                            htmlFor="gender-nam"
                                            className="font-normal"
                                        >
                                            Nam
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Trạng Thái</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <SelectBox
                                    value={field.value}
                                    options={statusOptions}
                                    onChange={field.onChange}
                                    placeholder="Chọn trạng thái"
                                />
                            )}
                        />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Mã</Label>
                        <Input {...register("code")} />
                    </Field>

                    {/* Row 2 */}
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Tên Đăng Nhập{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("username")}
                            aria-invalid={!!errors.username}
                        />
                        <FieldError>{errors.username?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Tên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("first_name")}
                            aria-invalid={!!errors.first_name}
                        />
                        <FieldError>{errors.first_name?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Họ <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("last_name")}
                            aria-invalid={!!errors.last_name}
                        />
                        <FieldError>{errors.last_name?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>SĐT Liên Hệ</Label>
                        <Input {...register("contact_phone")} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Email Liên Hệ</Label>
                        <Input {...register("contact_email")} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Địa Điểm</Label>
                        <Input {...register("location")} />
                    </Field>
                </div>
            </Card>

            {/* Bottom Tabs Section */}
            <Card className="p-4 flex flex-col">
                <Tabs defaultValue="vai-tro" className="w-full">
                    <TabsList className="w-fit border bg-background p-1 gap-1 shadow-sm">
                        <TabsTrigger
                            value="vai-tro"
                            className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                        >
                            Vai Trò
                        </TabsTrigger>
                        <TabsTrigger
                            value="kho"
                            className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                        >
                            Kho
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="vai-tro" className="mt-4">
                        <div className="flex justify-end gap-2 mb-4">
                            <Button type="button">Thêm</Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                                Xóa
                            </Button>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted border-b">
                                    <tr>
                                        <th className="p-3 w-12 text-center">
                                            <Checkbox />
                                        </th>
                                        <th className="p-3 font-medium text-muted-foreground">
                                            Tên Vai Trò
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 text-center">
                                            <Checkbox />
                                        </td>
                                        <td className="p-3">ADMIN</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="kho" className="mt-4">
                        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-md">
                            Chưa có dữ liệu kho
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="outline">
                                Hủy
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Hủy thao tác
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn hủy quá trình tạo
                                    người dùng? Các thông tin đã nhập sẽ không
                                    được lưu.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        navigate("/admin/user-management/list")
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Đồng ý
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button type="submit">Lưu</Button>
                </div>
            </Card>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Lưu thông tin</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn tạo người dùng này không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSave}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Đồng ý
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
};

export default CreateUser;
