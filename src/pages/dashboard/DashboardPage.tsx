import { useTranslation } from "react-i18next";

const DashboardPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1 className="text-2xl font-bold tracking-tight">{t("Dashboard")}</h1>
            <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    );
};

export default DashboardPage;
