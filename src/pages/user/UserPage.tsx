import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, CircleUser } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const UserPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    const TABS = [
        { id: "profile", label: t("Profile"), icon: User },
        { id: "password", label: t("Change Password"), icon: Lock },
    ];

    // Profile Form State
    const [username, setUsername] = useState(user?.user_name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [first_name, setFirstName] = useState(user?.first_name || "");
    const [last_name, setLastName] = useState(user?.last_name || "");
    const [contact_email, setContactEmail] = useState(
        user?.contact_email || "",
    );
    const [contact_phone, setContactPhone] = useState(
        user?.contact_phone || "",
    );
    const [gender, setGender] = useState(user?.gender || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>(
        user?.image || "/avatars/shadcn.jpg",
    );

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
            toast.success(t("Avatar uploaded successfully!"));
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t("Profile updated successfully!"));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t("New passwords do not match!"));
            return;
        }
        toast.success(t("Password updated successfully!"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0">
            <Tabs
                defaultValue="profile"
                className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start"
            >
                {/* Left Navigation Card */}
                <TabsList className="flex flex-col h-auto justify-start border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card p-3 space-y-1 shadow-sm w-full">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center justify-start gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:font-semibold data-[state=active]:shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 text-zinc-500 dark:text-zinc-400"
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{tab.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {/* Right Form Card */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card p-6 md:p-8 shadow-sm">
                    {/* Tab Content 1: PROFILE */}
                    <TabsContent
                        value="profile"
                        className="m-0 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        <form
                            onSubmit={handleProfileSubmit}
                            className="space-y-6"
                        >
                            {/* Avatar Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-150 dark:border-zinc-800">
                                <Avatar className="h-28 w-28 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
                                    <AvatarImage
                                        src={avatarUrl}
                                        alt={username}
                                    />
                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        <CircleUser className="h-16 w-16 stroke-[1.25]" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 text-center sm:text-left">
                                    <Button
                                        type="button"
                                        onClick={handleUploadClick}
                                        className="cursor-pointer"
                                    >
                                        {t("Upload new image")}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        {t("PNG, JPG or GIF. Max size 2MB.")}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Split Form Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Username Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Username")}
                                        </label>
                                        <Input
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            placeholder={t("Username")}
                                            required
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Email")}
                                        </label>
                                        <Input
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder={t("Email")}
                                            disabled
                                        />
                                    </div>

                                    {/* First Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("First Name")}
                                        </label>
                                        <Input
                                            value={first_name}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            placeholder={t("First Name")}
                                        />
                                    </div>

                                    {/* Last Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Last Name")}
                                        </label>
                                        <Input
                                            value={last_name}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            placeholder={t("Last Name")}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Contact Phone Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Contact Phone")}
                                        </label>
                                        <Input
                                            value={contact_phone}
                                            onChange={(e) =>
                                                setContactPhone(e.target.value)
                                            }
                                            placeholder={t("Contact Phone")}
                                        />
                                    </div>

                                    {/* Contact Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Contact Email")}
                                        </label>
                                        <Input
                                            value={contact_email}
                                            onChange={(e) =>
                                                setContactEmail(e.target.value)
                                            }
                                            placeholder={t("Contact Email")}
                                        />
                                    </div>

                                    {/* Gender Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            {t("Gender")}
                                        </label>
                                        <RadioGroup
                                            value={gender}
                                            onValueChange={setGender}
                                            className="flex flex-col gap-3 pt-1"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value="MALE"
                                                    id="r1"
                                                />
                                                <Label
                                                    htmlFor="r1"
                                                    className="cursor-pointer font-normal"
                                                >
                                                    {t("Male")}
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value="FEMALE"
                                                    id="r2"
                                                />
                                                <Label
                                                    htmlFor="r2"
                                                    className="cursor-pointer font-normal"
                                                >
                                                    {t("Female")}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                >
                                    {t("Update profile")}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Tab Content 2: CHANGE PASSWORD */}
                    <TabsContent
                        value="password"
                        className="m-0 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">
                                    {t("Current Password")}
                                </label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    placeholder={t("Enter current password")}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">
                                    {t("New Password")}
                                </label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder={t("Enter new password")}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">
                                    {t("Confirm New Password")}
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder={t("Confirm new password")}
                                    required
                                />
                            </div>

                            <Button type="submit" className="cursor-pointer">
                                {t("Update password")}
                            </Button>
                        </form>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default UserPage;
