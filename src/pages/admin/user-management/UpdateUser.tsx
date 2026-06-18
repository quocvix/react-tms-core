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
import { useNavigate, useParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    SelectBox,
    type ComboOption,
} from "@/components/select-box/select-box";

import { useQuery } from "@tanstack/react-query";
import userService from "@/services/userService";
import type { RoleItem } from "@/types/role-permission";
import type { HubItem } from "@/services/hubService";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError } from "@/components/ui/field";

import { RoleSelectionTab } from "./components/RoleSelectionTab";
import { HubSelectionTab } from "./components/HubSelectionTab";

const statusOptions: ComboOption[] = [
    { label: "Hoạt Động", value: "AC" },
    { label: "Không Hoạt Động", value: "IN" },
];

const formSchema = z.object({
    email: z
        .string()
        .min(1, "Vui lòng nhập Email")
        .email("Email không hợp lệ"),
    name: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
    profile: z.object({
        full_name: z.string().optional(),
        first_name: z.string().min(1, "Vui lòng nhập tên"),
        last_name: z.string().min(1, "Vui lòng nhập họ"),
        gender: z.string(),
        contact_phone: z.string().optional(),
        contact_email: z.string().optional(),
        code: z.string().optional(),
        location: z.string().optional(),
    }),
    role_list: z.array(z.any()).optional(),
    role_ids: z.array(z.number()).optional(),
    status: z.string(),
    hub_ids: z.array(z.number()).optional(),
    hub_list: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateUser = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("vai-tro");
    const [addedRoles, setAddedRoles] = useState<RoleItem[]>([]);
    const [addedHubs, setAddedHubs] = useState<HubItem[]>([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
            profile: {
                full_name: "",
                first_name: "",
                last_name: "",
                gender: "MALE",
                contact_phone: "",
                contact_email: "",
                code: "",
                location: "",
            },
            role_list: [],
            role_ids: [],
            status: "AC",
            hub_ids: [],
            hub_list: [],
        },
    });

    // Fetch user data and populate the form
    const { isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getUserById(id!),
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (res: any) => res?.data,
        placeholderData: undefined,
        // @ts-ignore — onSuccess deprecated in v5 but still works; alternative is useEffect
    });

    // Populate form when user data arrives
    React.useEffect(() => {
        if (!id) return;
        userService.getUserById(id).then((res: any) => {
            const user = res?.data;
            if (!user) return;

            reset({
                email: user.email ?? "",
                name: user.user_name ?? user.name ?? "",
                profile: {
                    full_name: user.full_name ?? "",
                    first_name: user.first_name ?? "",
                    last_name: user.last_name ?? "",
                    gender: user.gender ?? "MALE",
                    contact_phone: user.contact_phone ?? "",
                    contact_email: user.contact_email ?? "",
                    code: user.code ?? "",
                    location: user.location ?? "",
                },
                role_list: user.role_list ?? [],
                role_ids: user.role_ids ?? [],
                status: user.status ?? "AC",
                hub_ids: user.hub_ids ?? [],
                hub_list: user.hub_list ?? [],
            });

            // Populate role and hub lists for tabs
            if (user.role_list?.length) {
                setAddedRoles(user.role_list);
            }
            if (user.hub_list?.length) {
                setAddedHubs(user.hub_list);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    React.useEffect(() => {
        if (addedRoles.length === 0 && activeTab === "kho") {
            setActiveTab("vai-tro");
        }
    }, [addedRoles.length, activeTab]);

    const onSubmit = (data: FormValues) => {
        setIsConfirmOpen(true);
    };

    const handleConfirmSave = () => {
        setIsConfirmOpen(false);
        navigate("/admin/user-management/list");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-muted-foreground">
                    Đang tải thông tin...
                </div>
            </div>
        );
    }

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
                        <Label>Giới Tính</Label>
                        <Controller
                            control={control}
                            name="profile.gender"
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex items-center gap-4 mt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="FEMALE"
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
                                            value="MALE"
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
                        <Input {...register("profile.code")} />
                    </Field>

                    {/* Row 2 */}
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Tên Đăng Nhập{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("name")}
                            aria-invalid={!!errors.name}
                        />
                        <FieldError>{errors.name?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Tên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("profile.first_name")}
                            aria-invalid={!!errors.profile?.first_name}
                        />
                        <FieldError>
                            {errors.profile?.first_name?.message}
                        </FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            Họ <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("profile.last_name")}
                            aria-invalid={!!errors.profile?.last_name}
                        />
                        <FieldError>
                            {errors.profile?.last_name?.message}
                        </FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>SĐT Liên Hệ</Label>
                        <Input {...register("profile.contact_phone")} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Email Liên Hệ</Label>
                        <Input {...register("profile.contact_email")} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>Địa Điểm</Label>
                        <Input {...register("profile.location")} />
                    </Field>
                </div>
            </Card>

            {/* Bottom Tabs Section */}
            <Card className="p-4 flex flex-col">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="flex justify-between items-center mb-4">
                        <TabsList className="w-fit border bg-background p-1 gap-1 shadow-sm">
                            <TabsTrigger
                                value="vai-tro"
                                className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                Vai Trò
                            </TabsTrigger>
                            {addedRoles.length > 0 && (
                                <TabsTrigger
                                    value="kho"
                                    className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    Kho
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="vai-tro" className="mt-0">
                        <RoleSelectionTab
                            selectedRoles={addedRoles}
                            onChange={setAddedRoles}
                        />
                    </TabsContent>

                    <TabsContent value="kho" className="mt-0">
                        <HubSelectionTab
                            selectedHubs={addedHubs}
                            onChange={setAddedHubs}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
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
                                    Bạn có chắc chắn muốn hủy quá trình cập nhật
                                    người dùng? Các thông tin đã sửa sẽ không
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
                            Bạn có chắc chắn muốn cập nhật người dùng này
                            không?
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

export default UpdateUser;
