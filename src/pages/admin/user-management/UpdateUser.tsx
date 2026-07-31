import { useState, useEffect, useMemo } from "react";
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
import permissionService from "@/services/permissionService";
import hubService, { type HubItem } from "@/services/hubService";
import type { RoleItem } from "@/types/role-permission";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError } from "@/components/ui/field";
import { t } from "i18next";

import { RoleSelectionTab } from "./components/RoleSelectionTab";
import { HubSelectionTab } from "./components/HubSelectionTab";

const statusOptions: ComboOption[] = [
    { label: t("Active", "Hoạt Động"), value: "AC" },
    { label: t("Inactive", "Không Hoạt Động"), value: "IN" },
];

const formSchema = z.object({
    email: z
        .string()
        .min(1, t("Please enter Email", "Vui lòng nhập Email"))
        .email(t("Invalid Email", "Email không hợp lệ")),
    name: z.string().min(1, t("Please enter username", "Vui lòng nhập tên đăng nhập")),
    profile: z.object({
        full_name: z.string().optional(),
        first_name: z.string().min(1, t("Please enter first name", "Vui lòng nhập tên")),
        last_name: z.string().min(1, t("Please enter last name", "Vui lòng nhập họ")),
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

export interface UpdateUserProps {
    mode?: "edit" | "view";
}

const UpdateUser: React.FC<UpdateUserProps> = ({ mode = "edit" }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isReadOnly = mode === "view";

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("vai-tro");
    const [addedRoles, setAddedRoles] = useState<RoleItem[]>([]);
    const [addedHubs, setAddedHubs] = useState<HubItem[]>([]);
    const [isRolesMapped, setIsRolesMapped] = useState(false);
    const [isHubsMapped, setIsHubsMapped] = useState(false);

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

    // Fetch user data via useQuery
    const { data: user, isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getUserById(id!),
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (res: any) => res?.data,
    });

    // Fetch roles & hubs for mapping role_ids & hub_ids
    const { data: rolesResponse } = useQuery({
        queryKey: ["roles"],
        queryFn: () => permissionService.getRoles(),
    });

    const { data: hubsResponse } = useQuery({
        queryKey: ["hubs"],
        queryFn: () => hubService.getAllHub(),
    });

    const roles = useMemo(
        () => rolesResponse?.data || [],
        [rolesResponse],
    );

    const hubs = useMemo(
        () => hubsResponse?.data?.data || hubsResponse?.data || [],
        [hubsResponse],
    );

    // Populate form when user data arrives
    useEffect(() => {
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
    }, [user, reset]);

    // Map user.role_ids -> addedRoles
    useEffect(() => {
        if (!user || isRolesMapped) return;

        if (user.role_list?.length) {
            setAddedRoles(user.role_list);
            setIsRolesMapped(true);
        } else if (user.role_ids?.length) {
            if (roles.length > 0) {
                const mappedRoles = roles.filter((r: RoleItem) =>
                    user.role_ids.includes(r.id),
                );
                setAddedRoles(mappedRoles);
                setIsRolesMapped(true);
            }
        } else {
            setIsRolesMapped(true);
        }
    }, [user, roles, isRolesMapped]);

    // Map user.hub_ids -> addedHubs
    useEffect(() => {
        if (!user || isHubsMapped) return;

        if (user.hub_list?.length) {
            setAddedHubs(user.hub_list);
            setIsHubsMapped(true);
        } else if (user.hub_ids?.length) {
            if (hubs.length > 0) {
                const mappedHubs = hubs.filter((h: HubItem) =>
                    user.hub_ids.includes(h.id),
                );
                setAddedHubs(mappedHubs);
                setIsHubsMapped(true);
            }
        } else {
            setIsHubsMapped(true);
        }
    }, [user, hubs, isHubsMapped]);

    useEffect(() => {
        if (addedRoles.length === 0 && activeTab === "kho") {
            setActiveTab("vai-tro");
        }
    }, [addedRoles.length, activeTab]);

    const onSubmit = (_data: FormValues) => {
        if (isReadOnly) return;
        setIsConfirmOpen(true);
    };

    const handleConfirmSave = () => {
        setIsConfirmOpen(false);
        navigate("/administration/user-management/list");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-muted-foreground">
                    {t("Loading information...", "Đang tải thông tin...")}
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
                            {t("Email")} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("email")}
                            disabled={isReadOnly}
                            aria-invalid={!!errors.email}
                        />
                        <FieldError>{errors.email?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Gender", "Giới Tính")}</Label>
                        <Controller
                            control={control}
                            name="profile.gender"
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isReadOnly}
                                    className="flex items-center gap-4 mt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="FEMALE"
                                            id="gender-nu"
                                            disabled={isReadOnly}
                                        />
                                        <Label
                                            htmlFor="gender-nu"
                                            className="font-normal"
                                        >
                                            {t("Female", "Nữ")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="MALE"
                                            id="gender-nam"
                                            disabled={isReadOnly}
                                        />
                                        <Label
                                            htmlFor="gender-nam"
                                            className="font-normal"
                                        >
                                            {t("Male", "Nam")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Status", "Trạng Thái")}</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <SelectBox
                                    value={field.value}
                                    options={statusOptions}
                                    onChange={field.onChange}
                                    placeholder={t("Select status", "Chọn trạng thái")}
                                    disabled={isReadOnly}
                                />
                            )}
                        />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Code", "Mã")}</Label>
                        <Input {...register("profile.code")} disabled={isReadOnly} />
                    </Field>

                    {/* Row 2 */}
                    <Field className="flex flex-col gap-2">
                        <Label>
                            {t("Username", "Tên Đăng Nhập")}{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("name")}
                            disabled={isReadOnly}
                            aria-invalid={!!errors.name}
                        />
                        <FieldError>{errors.name?.message}</FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            {t("First Name", "Tên")} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("profile.first_name")}
                            disabled={isReadOnly}
                            aria-invalid={!!errors.profile?.first_name}
                        />
                        <FieldError>
                            {errors.profile?.first_name?.message}
                        </FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>
                            {t("Last Name", "Họ")} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            {...register("profile.last_name")}
                            disabled={isReadOnly}
                            aria-invalid={!!errors.profile?.last_name}
                        />
                        <FieldError>
                            {errors.profile?.last_name?.message}
                        </FieldError>
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Contact Phone", "SĐT Liên Hệ")}</Label>
                        <Input {...register("profile.contact_phone")} disabled={isReadOnly} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Contact Email", "Email Liên Hệ")}</Label>
                        <Input {...register("profile.contact_email")} disabled={isReadOnly} />
                    </Field>
                    <Field className="flex flex-col gap-2">
                        <Label>{t("Location", "Địa Điểm")}</Label>
                        <Input {...register("profile.location")} disabled={isReadOnly} />
                    </Field>
                </div>
            </Card>

            {/* Bottom Tabs Section */}
            <Card className="p-4 flex flex-col">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full relative"
                >
                    <div className="flex justify-between items-center mb-4">
                        <TabsList className="w-fit border bg-background p-1 gap-1 shadow-sm">
                            <TabsTrigger
                                value="vai-tro"
                                className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                {t("Role", "Vai Trò")}
                            </TabsTrigger>
                            {addedRoles.length > 0 && (
                                <TabsTrigger
                                    value="kho"
                                    className="rounded-md px-4 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                                >
                                    {t("Hub", "Kho")}
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="vai-tro" className="mt-0">
                        <RoleSelectionTab
                            selectedRoles={addedRoles}
                            onChange={setAddedRoles}
                            disabled={isReadOnly}
                        />
                    </TabsContent>

                    <TabsContent value="kho" className="mt-0">
                        <HubSelectionTab
                            selectedHubs={addedHubs}
                            onChange={setAddedHubs}
                            disabled={isReadOnly}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                    {isReadOnly ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    navigate("/administration/user-management/list")
                                }
                            >
                                {t("Back", "Quay lại")}
                            </Button>
                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() =>
                                    navigate(
                                        `/administration/user-management/update/${id}`,
                                    )
                                }
                            >
                                {t("Update", "Cập nhật")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="outline">
                                        {t("Cancel", "Hủy")}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent size="sm">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t("Cancel action", "Hủy thao tác")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t(
                                                "Are you sure you want to cancel the user update process? Modified information will not be saved.",
                                                "Bạn có chắc chắn muốn hủy quá trình cập nhật người dùng? Các thông tin đã sửa sẽ không được lưu.",
                                            )}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t("Cancel", "Huỷ")}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                navigate(
                                                    "/administration/user-management/list",
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {t("Confirm", "Đồng ý")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button type="submit">{t("Save", "Lưu")}</Button>
                        </>
                    )}
                </div>
            </Card>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Save information", "Lưu thông tin")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                "Are you sure you want to update this user?",
                                "Bạn có chắc chắn muốn cập nhật người dùng này không?",
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("Cancel", "Huỷ")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSave}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {t("Confirm", "Đồng ý")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
};

export default UpdateUser;
